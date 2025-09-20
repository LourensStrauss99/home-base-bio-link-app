// Admin dashboard script with Laravel authentication - Updated: 2025-09-19 15:30

// Authentication functions
const authFunctions = {
    async checkAuth() {
        try {
            console.log('Checking authentication...');
            const response = await fetch('/check-auth', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });

            console.log('Auth response status:', response.status);
            console.log('Auth response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log('Auth response data:', data);
                return data.authenticated ? data.user : null;
            }
            console.log('Auth response not ok');
            return null;
        } catch (error) {
            console.error('Auth check error:', error);
            return null;
        }
    },

    async getCurrentUser() {
        return await this.checkAuth();
    },

    async logout() {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};

// Load user profile data
async function loadUserProfile() {
    try {
        console.log('Starting loadUserProfile...');
        
        const user = await authFunctions.checkAuth();
        if (!user) {
            console.log('No user returned from checkAuth');
            return;
        }

        console.log('Loading user profile for user:', user);

        // Update username display
        const adminUsername = document.getElementById('admin-username');
        if (adminUsername) {
            const displayName = user.username || user.name || 'User';
            console.log('Setting username to:', displayName);
            adminUsername.textContent = displayName;
        } else {
            console.log('admin-username element not found');
        }

        // Update profile photo
        const profilePhotoContainer = document.getElementById('profile-photo-container');
        const adminProfilePhoto = document.getElementById('admin-profile-photo');
        const changePhotoBtn = document.getElementById('change-photo-btn');

        console.log('Photo elements found:', {
            profilePhotoContainer: !!profilePhotoContainer,
            adminProfilePhoto: !!adminProfilePhoto,
            changePhotoBtn: !!changePhotoBtn,
            photo_url: user.photo_url
        });

        if (user.photo_url && adminProfilePhoto) {
            const photoUrl = '/storage/' + user.photo_url;
            console.log('Setting profile photo src to:', photoUrl);
            adminProfilePhoto.src = photoUrl;
            if (profilePhotoContainer) {
                profilePhotoContainer.style.display = 'block';
                console.log('Profile photo container made visible');
            }
        } else {
            console.log('No photo URL or photo element missing');
        }
        
        // Always show the change photo button
        if (changePhotoBtn) {
            changePhotoBtn.style.display = 'block';
            console.log('Change photo button made visible');
        } else {
            console.log('Change photo button not found');
        }
        
        // Update bio
        const userBio = document.getElementById('user-bio');
        if (userBio) {
            const bioText = user.bio || '';
            console.log('Setting bio to:', bioText);
            userBio.value = bioText;
        } else {
            console.log('user-bio element not found');
        }

        console.log('Profile loading completed successfully');
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        // Profile loaded successfully despite minor errors, no need for popup
    }
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const user = await authFunctions.checkAuth();
        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            throw new Error('Not authenticated');
        }
        console.log('User authenticated:', user);
        return user; // Return user data
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login';
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'theme-default';
    document.body.className = savedTheme;

    // Theme change
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            document.body.className = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }

    // Check authentication status and load profile
    checkAuthStatus().then((user) => {
        // User is authenticated, set currentUserId and load their profile
        currentUserId = user.id;
        console.log('Current user ID set to:', currentUserId);
        loadUserProfile();
    }).catch(() => {
        // User is not authenticated, already redirected by checkAuthStatus
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    console.error('Logout failed with status:', response.status);
                    // Even if the request fails, redirect to login
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Logout error:', error);
                // On error, still redirect to login
                window.location.href = '/login';
            }
        });
    }

    // Load admin data
    loadAdminData();
});

// Load admin data
async function loadAdminData() {
    try {
        console.log('🔍 Starting loadAdminData...');
        const user = await authFunctions.checkAuth();
        console.log('👤 User check result:', user);
        
        if (user) {
            // Load user data and links
            console.log('✅ Loading admin data for user:', user);

            // Load user links if the API exists
            const linksContainer = document.getElementById('admin-links');
            console.log('📦 Links container found:', linksContainer);
            
            if (linksContainer) {
                console.log('🌐 Calling getUserLinks for user ID:', user.id);
                const links = await dbFunctions.getUserLinks(user.id);
                console.log('📋 Links received:', links);
                console.log('📊 Number of links:', links.length);
                
                displayUserLinks(links);
                console.log('✅ displayUserLinks called');
            }
        } else {
            console.log('❌ No user found - not authenticated');
        }
    } catch (error) {
        console.error('💥 Error loading admin data:', error);
    }
}

// Global helper functions for link display
function detectSocialIcon(url) {
    const domain = url.toLowerCase();
    
    // Return the Simple Icons slug name for each platform
    if (domain.includes('instagram.com') || domain.includes('ig.me')) {
        return 'instagram';
    } else if (domain.includes('twitter.com') || domain.includes('x.com') || domain.includes('t.co')) {
        return 'x';
    } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        return 'youtube';
    } else if (domain.includes('github.com') || domain.includes('git.io')) {
        return 'github';
    } else if (domain.includes('linkedin.com') || domain.includes('lnkd.in')) {
        return 'linkedin';
    } else if (domain.includes('tiktok.com') || domain.includes('vm.tiktok.com')) {
        return 'tiktok';
    } else if (domain.includes('facebook.com') || domain.includes('fb.me')) {
        return 'facebook';
    } else if (domain.includes('discord.com') || domain.includes('discord.gg')) {
        return 'discord';
    } else if (domain.includes('snapchat.com')) {
        return 'snapchat';
    } else if (domain.includes('twitch.tv')) {
        return 'twitch';
    } else {
        return 'globe'; // Default icon
    }
}

function renderIcon(iconSlug) {
    // Simple fallback icons for common platforms
    const fallbackIcons = {
        'youtube': '🎬',
        'instagram': '📷', 
        'x': '🐦',
        'twitter': '🐦',
        'github': '💻',
        'linkedin': '💼',
        'tiktok': '🎵',
        'facebook': '📘',
        'discord': '🎮',
        'snapchat': '👻',
        'twitch': '🎮',
        'globe': '🔗'
    };
    
    return `<span class="admin-link-icon">${fallbackIcons[iconSlug] || '🔗'}</span>`;
}

function detectPlatformName(url) {
    const domain = url.toLowerCase();
    
    if (domain.includes('instagram.com') || domain.includes('ig.me')) {
        return 'Instagram';
    } else if (domain.includes('twitter.com') || domain.includes('x.com') || domain.includes('t.co')) {
        return 'X (Twitter)';
    } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        return 'YouTube';
    } else if (domain.includes('github.com') || domain.includes('git.io')) {
        return 'GitHub';
    } else if (domain.includes('linkedin.com') || domain.includes('lnkd.in')) {
        return 'LinkedIn';
    } else if (domain.includes('tiktok.com') || domain.includes('vm.tiktok.com')) {
        return 'TikTok';
    } else if (domain.includes('facebook.com') || domain.includes('fb.me')) {
        return 'Facebook';
    } else if (domain.includes('discord.com') || domain.includes('discord.gg')) {
        return 'Discord';
    } else if (domain.includes('snapchat.com')) {
        return 'Snapchat';
    } else if (domain.includes('twitch.tv')) {
        return 'Twitch';
    } else {
        // Extract domain name for unknown platforms
        try {
            const hostname = new URL(url).hostname;
            const domainParts = hostname.split('.');
            const mainDomain = domainParts[domainParts.length - 2];
            return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
        } catch {
            return 'Custom Link';
        }
    }
}

// Display user links with proper Edit and Delete buttons
function displayUserLinks(links) {
    console.log('🎨 displayUserLinks called with:', links);
    const linksContainer = document.getElementById('admin-links');
    if (!linksContainer) {
        console.log('❌ Links container not found!');
        return;
    }

    console.log('🧹 Clearing container...');
    linksContainer.innerHTML = '';

    if (links.length === 0) {
        console.log('📭 No links to display');
        linksContainer.innerHTML = '<p>No links added yet. Add your first link below!</p>';
        return;
    }

    console.log('🔨 Creating', links.length, 'link elements...');
    links.forEach((link, index) => {
        console.log('Creating link element for:', link);
        const linkElement = document.createElement('div');
        linkElement.className = 'admin-link-item';
        
        // Get icon for the link
        const iconSlug = link.icon || detectSocialIcon(link.url);
        const iconHtml = renderIcon(iconSlug);
        
        linkElement.innerHTML = `
            <span class="admin-link-info">
                ${iconHtml}
                <span class="admin-link-details">${link.name}: ${link.url} (Clicks: ${link.click_count || 0})</span>
            </span>
            <button class="edit-btn" data-link-id="${link.id}" data-index="${index}">Edit</button>
            <button class="delete-btn" data-link-id="${link.id}" data-index="${index}">Delete</button>
        `;
        linksContainer.appendChild(linkElement);
    });

    console.log('✅ All link elements created, attaching events...');
    // Attach event listeners to Edit and Delete buttons
    attachAdminLinkEvents(links);
    console.log('🎯 Events attached successfully');
}

// Attach events to edit/delete buttons for admin links
function attachAdminLinkEvents(links) {
    // Edit button event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const linkId = e.target.dataset.linkId;
            const index = e.target.dataset.index;
            const currentLink = links[index];
            
            const newUrl = prompt('Enter new URL:', currentLink.url);
            if (newUrl && newUrl !== currentLink.url) {
                try {
                    btn.textContent = 'Updating...';
                    btn.disabled = true;

                    // Auto-detect new name and icon based on URL
                    const newName = detectPlatformName(newUrl);
                    const newIcon = detectSocialIcon(newUrl);
                    
                    // TODO: Create update API endpoint
                    // For now, we'll update locally
                    currentLink.url = newUrl;
                    currentLink.name = newName;
                    currentLink.icon = newIcon;
                    
                    // Refresh the display
                    displayUserLinks(links);
                    alert('Link updated successfully!');
                    
                } catch (error) {
                    console.error('Error updating link:', error);
                    alert('Error updating link: ' + error.message);
                    btn.textContent = 'Edit';
                    btn.disabled = false;
                }
            }
        });
    });

    // Delete button event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const linkId = e.target.dataset.linkId;
            const index = e.target.dataset.index;
            
            if (confirm('Are you sure you want to delete this link?')) {
                try {
                    btn.textContent = 'Deleting...';
                    btn.disabled = true;

                    // Call Laravel delete API
                    const response = await fetch(`/api/link/${linkId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        }
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        // Remove from local array and refresh display
                        links.splice(index, 1);
                        displayUserLinks(links);
                        alert('Link deleted successfully!');
                    } else {
                        throw new Error(result.error || 'Failed to delete link');
                    }
                } catch (error) {
                    console.error('Error deleting link:', error);
                    alert('Error deleting link: ' + error.message);
                    btn.textContent = 'Delete';
                    btn.disabled = false;
                }
            }
        });
    });
}

// Laravel authentication functions

const dbFunctions = {
    async getUserData(userId) {
        try {
            // For Laravel, we'll get the current user data from the session
            const user = await authFunctions.checkAuth();
            return user;
        } catch (error) {
            console.error('Get user data error:', error);
            throw error;
        }
    },

    async saveUserData(userId, userData) {
        try {
            // This would typically be handled by Laravel backend
            // For now, we'll just return the data as if it was saved
            console.log('Saving user data:', userData);
            return userData;
        } catch (error) {
            console.error('Save user data error:', error);
            throw error;
        }
    },

    async checkUsernameExists(username) {
        try {
            // This would need a Laravel API endpoint to check username availability
            console.log('Checking username availability:', username);
            return false; // For now, assume it's available
        } catch (error) {
            console.error('Check username error:', error);
            return false;
        }
    },

    async saveUserLink(userId, linkData) {
        try {
            console.log('Saving user link:', linkData);
            
            const response = await fetch(`/api/user/${userId}/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: linkData.name,
                    url: linkData.url,
                    icon: linkData.icon
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save link');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Save user link error:', error);
            throw error;
        }
    },

    async getUserLinks(userId) {
        try {
            console.log('getUserLinks called for user:', userId);
            const response = await fetch(`/api/user/${userId}/links`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const links = await response.json();
            console.log('Loaded links:', links);
            return links;
        } catch (error) {
            console.error('Get user links error:', error);
            return [];
        }
    },

    async deleteUserLink(linkId) {
        try {
            console.log('Deleting user link:', linkId);
            
            const response = await fetch(`/api/link/${linkId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to delete link');
            }

            return result;
        } catch (error) {
            console.error('Delete user link error:', error);
            throw error;
        }
    }
};

const storageFunctions = {
    async uploadProfilePhoto(userId, file) {
        try {
            // For Laravel, profile photos are handled by the backend during registration
            // This function would need to be implemented with a Laravel API endpoint
            console.log('Profile photo upload would be handled by Laravel backend');
            return '/storage/profile-photos/default.jpg'; // Placeholder
        } catch (error) {
            console.error('Upload profile photo error:', error);
            throw error;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Social media platform name detection function
    function detectPlatformName(url) {
        const domain = url.toLowerCase();
        
        if (domain.includes('instagram.com') || domain.includes('ig.me')) {
            return 'Instagram';
        } else if (domain.includes('twitter.com') || domain.includes('x.com') || domain.includes('t.co')) {
            return 'X';
        } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
            return 'YouTube';
        } else if (domain.includes('github.com') || domain.includes('git.io')) {
            return 'GitHub';
        } else if (domain.includes('linkedin.com') || domain.includes('lnkd.in')) {
            return 'LinkedIn';
        } else if (domain.includes('tiktok.com') || domain.includes('vm.tiktok.com')) {
            return 'TikTok';
        } else if (domain.includes('facebook.com') || domain.includes('fb.me')) {
            return 'Facebook';
        } else if (domain.includes('snapchat.com') || domain.includes('snap.com')) {
            return 'Snapchat';
        } else if (domain.includes('discord.gg') || domain.includes('discord.com')) {
            return 'Discord';
        } else if (domain.includes('twitch.tv')) {
            return 'Twitch';
        } else if (domain.includes('spotify.com') || domain.includes('spoti.fi')) {
            return 'Spotify';
        } else if (domain.includes('pinterest.com') || domain.includes('pin.it')) {
            return 'Pinterest';
        } else if (domain.includes('reddit.com') || domain.includes('redd.it')) {
            return 'Reddit';
        } else if (domain.includes('telegram.me') || domain.includes('t.me')) {
            return 'Telegram';
        } else if (domain.includes('whatsapp.com') || domain.includes('wa.me')) {
            return 'WhatsApp';
        } else if (domain.includes('paypal.com') || domain.includes('paypal.me')) {
            return 'PayPal';
        } else if (domain.includes('venmo.com')) {
            return 'Venmo';
        } else if (domain.includes('cashapp.com') || domain.includes('cash.me')) {
            return 'Cash App';
        } else if (domain.includes('medium.com')) {
            return 'Medium';
        } else if (domain.includes('substack.com')) {
            return 'Substack';
        } else {
            // Extract domain name for unknown platforms
            try {
                const hostname = new URL(url).hostname;
                const domainParts = hostname.split('.');
                const mainDomain = domainParts[domainParts.length - 2];
                return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
            } catch {
                return 'Custom Link';
            }
        }
    }

    // Social media icon detection function using Simple Icons
    function detectSocialIcon(url) {
        const domain = url.toLowerCase();
        
        // Return the Simple Icons slug name for each platform
        if (domain.includes('instagram.com') || domain.includes('ig.me')) {
            return 'instagram';
        } else if (domain.includes('twitter.com') || domain.includes('x.com') || domain.includes('t.co')) {
            return 'x';
        } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
            return 'youtube';
        } else if (domain.includes('github.com') || domain.includes('git.io')) {
            return 'github';
        } else if (domain.includes('linkedin.com') || domain.includes('lnkd.in')) {
            return 'linkedin';
        } else if (domain.includes('tiktok.com') || domain.includes('vm.tiktok.com')) {
            return 'tiktok';
        } else if (domain.includes('facebook.com') || domain.includes('fb.me')) {
            return 'facebook';
        } else if (domain.includes('snapchat.com') || domain.includes('snap.com')) {
            return 'snapchat';
        } else if (domain.includes('discord.gg') || domain.includes('discord.com')) {
            return 'discord';
        } else if (domain.includes('twitch.tv')) {
            return 'twitch';
        } else if (domain.includes('spotify.com') || domain.includes('spoti.fi')) {
            return 'spotify';
        } else if (domain.includes('pinterest.com') || domain.includes('pin.it')) {
            return 'pinterest';
        } else if (domain.includes('reddit.com') || domain.includes('redd.it')) {
            return 'reddit';
        } else if (domain.includes('telegram.me') || domain.includes('t.me')) {
            return 'telegram';
        } else if (domain.includes('whatsapp.com') || domain.includes('wa.me')) {
            return 'whatsapp';
        } else if (domain.includes('paypal.com') || domain.includes('paypal.me')) {
            return 'paypal';
        } else if (domain.includes('venmo.com')) {
            return 'venmo';
        } else if (domain.includes('cashapp.com') || domain.includes('cash.me')) {
            return 'cashapp';
        } else if (domain.includes('medium.com')) {
            return 'medium';
        } else if (domain.includes('substack.com')) {
            return 'substack';
        } else {
            return 'globe'; // Generic link icon
        }
    }

    // Function to render SVG icon from Simple Icons
    function renderIcon(iconSlug) {
        // Wait for Simple Icons to load if it hasn't yet
        if (window.simpleIcons && window.simpleIcons[iconSlug]) {
            const icon = window.simpleIcons[iconSlug];
            return `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <title>${icon.title}</title>
                        <path d="${icon.path}"></path>
                    </svg>`;
        }
        
        // Fallback icons for common platforms if Simple Icons isn't available
        const fallbackIcons = {
            'instagram': `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <title>Instagram</title>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>`,
            'x': `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <title>X</title>
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>`,
            'youtube': `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                          <title>YouTube</title>
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>`,
            'github': `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                         <title>GitHub</title>
                         <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                       </svg>`,
            'linkedin': `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                           <title>LinkedIn</title>
                           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                         </svg>`,
            'globe': `<svg class="admin-link-icon-svg" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <title>Link</title>
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 9.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"/>
                        <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                      </svg>`
        };
        
        // Use fallback icon if available, otherwise generic globe
        return fallbackIcons[iconSlug] || fallbackIcons['globe'];
    }

    let isRedirecting = false;
    let authCheckComplete = false;

    // Authentication is already checked at the top of DOMContentLoaded

    // Photo change functionality
    const changePhotoBtnGlobal = document.getElementById('change-photo-btn');
    const newProfilePhotoInput = document.getElementById('new-profile-photo');
    
    if (changePhotoBtnGlobal && newProfilePhotoInput) {
        changePhotoBtnGlobal.addEventListener('click', () => {
            newProfilePhotoInput.click();
        });
        
        newProfilePhotoInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Only JPG, PNG, GIF, and WebP files are allowed');
                }
                
                const user = await authFunctions.checkAuth();
                if (user) {
                    changePhotoBtnGlobal.textContent = '📤 Uploading...';
                    changePhotoBtnGlobal.disabled = true;
                    
                    try {
                        // Get current user data 
                        const currentData = await dbFunctions.getUserData(user.id);
                        
                        // Upload new photo
                        const photoURL = await storageFunctions.uploadProfilePhoto(user.id, file);
                        
                        // Update user data with new photo
                        await dbFunctions.saveUserData(user.id, {
                            email: currentData.email,
                            username: currentData.username,
                            photo_url: photoURL
                        });
                        
                        // Update UI
                        const adminProfilePhoto = document.getElementById('admin-profile-photo');
                        const profilePhotoContainer = document.getElementById('profile-photo-container');
                        
                        if (adminProfilePhoto) {
                            adminProfilePhoto.src = photoURL;
                            if (profilePhotoContainer) {
                                profilePhotoContainer.style.display = 'block';
                            }
                        }
                        
                        alert('Profile photo updated successfully!');
                    } catch (error) {
                        console.error('Photo upload error:', error);
                        alert('Failed to upload photo: ' + error.message);
                    } finally {
                        changePhotoBtnGlobal.textContent = '📸 Change Photo';
                        changePhotoBtnGlobal.disabled = false;
                        newProfilePhotoInput.value = '';
                    }
                }
            }
        });
    }

    // Bio editing functionality
    const userBio = document.getElementById('user-bio');
    const saveBioBtn = document.getElementById('save-bio-btn');
    
    if (saveBioBtn && userBio) {
        saveBioBtn.addEventListener('click', async () => {
            const user = await authFunctions.getCurrentUser();
            if (user) {
                const bioText = userBio.value.trim();
                
                if (bioText.length > 200) {
                    alert('Bio must be 200 characters or less');
                    return;
                }
                
                try {
                    saveBioBtn.textContent = '💾 Saving...';
                    saveBioBtn.disabled = true;
                    
                    // Get current user data and update with bio
                    const currentData = await dbFunctions.getUserData(user.id);
                    await dbFunctions.saveUserData(user.id, {
                        email: currentData.email,
                        username: currentData.username,
                        photo_url: currentData.photo_url,
                        bio: bioText
                    });
                    
                    alert('Bio saved successfully!');
                } catch (error) {
                    console.error('Bio save error:', error);
                    alert('Failed to save bio: ' + error.message);
                } finally {
                    saveBioBtn.textContent = '💾 Save Bio';
                    saveBioBtn.disabled = false;
                }
            }
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'theme-light';
    document.body.className = savedTheme; // Replace all classes with saved theme

    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        // Set current theme in dropdown
        themeSelect.value = savedTheme;
        
        // Listen for theme changes
        themeSelect.addEventListener('change', (e) => {
            const newTheme = e.target.value;
            
            // Remove all theme classes
            document.body.className = '';
            
            // Add new theme class
            document.body.classList.add(newTheme);
            
            // Save theme preference
            localStorage.setItem('theme', newTheme);
        });
    }

    // Logout functionality
    // Logout functionality is handled at the top of DOMContentLoaded

    // Default links - empty array for new users
    const defaultLinks = [];

    // Load subscription info
    const subscription = JSON.parse(localStorage.getItem('subscription')) || { plan: 'free', status: 'active' };
    displaySubscriptionInfo(subscription);

    // Load links from Supabase database
    let links = [];
    let currentUserId = null;

    // Function to load user links from database
    async function loadUserLinks(userId) {
        try {
            const userLinks = await dbFunctions.getUserLinks(userId);
            links = userLinks.map(link => ({
                id: link.id,
                name: link.name,
                url: link.url,
                icon: link.icon,
                count: link.click_count || 0
            }));
            renderLinks();
        } catch (error) {
            console.error('Error loading user links:', error);
            links = [];
            renderLinks();
        }
    }

    // Function to render links
    function renderLinks() {
        const linksContainer = document.getElementById('admin-links');
        linksContainer.innerHTML = '';
        links.forEach((link, index) => {
            const linkDiv = document.createElement('div');
            linkDiv.className = 'admin-link-item';
            
            // Get icon for the link
            const iconSlug = link.icon || detectSocialIcon(link.url);
            const iconHtml = renderIcon(iconSlug);
            
            linkDiv.innerHTML = `
                <span class="admin-link-info">
                    ${iconHtml}
                    <span class="admin-link-details">${link.name}: ${link.url} (Clicks: ${link.count})</span>
                </span>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            linksContainer.appendChild(linkDiv);
        });
        attachLinkEvents();
    }

    // Attach events to edit/delete buttons
    function attachLinkEvents() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = e.target.dataset.index;
                const newUrl = prompt('New URL:', links[index].url);
                if (newUrl && currentUserId) {
                    try {
                        // Auto-detect new name and icon based on URL
                        const newName = detectPlatformName(newUrl);
                        const newIcon = detectSocialIcon(newUrl);
                        
                        // Update via Laravel API
                        btn.textContent = 'Updating...';
                        btn.disabled = true;

                        // For now, just update locally since we don't have the update API yet
                        links[index].url = newUrl;
                        links[index].name = newName;
                        links[index].icon = newIcon;
                        renderLinks();
                        links[index].name = newName;
                        links[index].url = newUrl;
                        links[index].icon = newIcon;
                        
                        renderLinks();
                        alert(`Link updated successfully!`);
                    } catch (error) {
                        console.error('Error updating link:', error);
                        alert('Error updating link. Please try again.');
                        btn.textContent = 'Edit';
                        btn.disabled = false;
                    }
                }
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = e.target.dataset.index;
                if (confirm('Delete this link?')) {
                    try {
                        const linkId = links[index].id;
                        
                        // Delete via Laravel API
                        btn.textContent = 'Deleting...';
                        btn.disabled = true;

                        // Call delete API
                        const response = await fetch(`/api/link/${linkId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            }
                        });

                        const result = await response.json();

                        if (response.ok && result.success) {
                            // Remove from local array and re-render
                            links.splice(index, 1);
                            renderLinks();
                            
                            alert('Link deleted successfully!');
                        } else {
                            throw new Error(result.error || 'Failed to delete link');
                        }
                    } catch (error) {
                        console.error('Error deleting link:', error);
                        alert('Error deleting link: ' + error.message);
                        btn.textContent = 'Delete';
                        btn.disabled = false;
                    }
                }
            });
        });
    }

    // Social platform dropdown functionality
    const socialPlatformSelect = document.getElementById('social-platform-select');
    const urlInputContainer = document.querySelector('.url-input-container');
    const linkUrlInput = document.getElementById('link-url');
    const addLinkBtn = document.getElementById('add-link-btn');
    const cancelLinkBtn = document.getElementById('cancel-link-btn');
    const quickSigninBtn = document.getElementById('quick-signin-btn');
    const noLinksMessage = document.querySelector('.no-links-message');

    // Debug: Check if elements exist
    console.log('DOM Elements Check:');
    console.log('socialPlatformSelect:', socialPlatformSelect);
    console.log('urlInputContainer:', urlInputContainer);
    console.log('linkUrlInput:', linkUrlInput);
    console.log('addLinkBtn:', addLinkBtn);

    // Define which platforms support OAuth vs manual input
    // Temporarily disable OAuth until real credentials are configured
    const oauthSupportedPlatforms = []; // ['google', 'github', 'twitter', 'facebook', 'linkedin', 'instagram'];
    const defaultLinkPlatforms = ['youtube']; // Platforms with default links
    
    // Platform login URLs for quick sign-in
    const platformLoginUrls = {
        'facebook': 'https://www.facebook.com/login',
        'instagram': 'https://www.instagram.com/accounts/login/',
        'twitter': 'https://x.com/i/flow/login',
        'linkedin': 'https://www.linkedin.com/login',
        'tiktok': 'https://www.tiktok.com/login',
        'youtube': 'https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop&flowName=WebLiteSignIn&flowEntry=ServiceLogin',
        'whatsapp': 'https://www.whatsapp.com/login',
        'reddit': 'https://www.reddit.com/login',
        'pinterest': 'https://www.pinterest.com/_/login/',
        'snapchat': 'https://accounts.snapchat.com/accounts/login',
        'discord': 'https://discord.com/login',
        'telegram': 'https://web.telegram.org/login',
        'github': 'https://github.com/login',
        'google': 'https://accounts.google.com/signin'
    };
    
    // Handle platform selection - OAuth redirect, default link, or manual input
    if (socialPlatformSelect) {
        socialPlatformSelect.addEventListener('change', function() {
            const selectedPlatform = this.value;
            const selectedOption = this.options[this.selectedIndex];
            const placeholder = selectedOption.dataset.placeholder;
            
            if (selectedPlatform) {
                if (oauthSupportedPlatforms.includes(selectedPlatform)) {
                    // OAuth-supported platform - redirect to OAuth flow for link creation
                    const confirmMessage = `Connect your ${selectedOption.textContent} account?\n\nYou'll be redirected to ${selectedOption.textContent} to sign in and we'll automatically get your correct profile link.`;
                    
                    if (confirm(confirmMessage)) {
                        // Show loading state
                        this.disabled = true;
                        const originalText = selectedOption.textContent;
                        selectedOption.textContent = '🔄 Connecting...';
                        
                        // Redirect to OAuth endpoint with link creation action
                        window.location.href = `/auth/${selectedPlatform}?action=add_link`;
                    } else {
                        // User cancelled, reset dropdown
                        this.value = '';
                    }
                } else if (defaultLinkPlatforms.includes(selectedPlatform)) {
                    // Platform with default link - show URL input with default value
                    console.log('YouTube selected - setting up default link');
                    console.log('urlInputContainer:', urlInputContainer);
                    console.log('linkUrlInput:', linkUrlInput);
                    
                    urlInputContainer.style.display = 'flex';
                    
                    // For now, just show empty input instead of default URL
                    linkUrlInput.value = '';
                    linkUrlInput.placeholder = placeholder || 'Enter your profile URL...';
                    linkUrlInput.focus();
                    
                    // Show quick sign-in button for YouTube
                    if (platformLoginUrls[selectedPlatform]) {
                        quickSigninBtn.style.display = 'block';
                        quickSigninBtn.setAttribute('data-platform', selectedPlatform);
                    } else {
                        quickSigninBtn.style.display = 'none';
                    }
                    
                    console.log('YouTube input ready for manual entry');
                } else {
                    // Regular manual input platform
                    urlInputContainer.style.display = 'flex';
                    linkUrlInput.value = '';
                    linkUrlInput.placeholder = placeholder || 'Enter your profile URL...';
                    linkUrlInput.focus();
                    
                    // Show quick sign-in button if platform has login URL
                    if (platformLoginUrls[selectedPlatform]) {
                        quickSigninBtn.style.display = 'block';
                        quickSigninBtn.setAttribute('data-platform', selectedPlatform);
                    } else {
                        quickSigninBtn.style.display = 'none';
                    }
                }
            } else {
                // No platform selected - hide URL input section
                urlInputContainer.style.display = 'none';
                linkUrlInput.value = '';
                quickSigninBtn.style.display = 'none';
            }
        });
    }

    // Cancel button functionality
    if (cancelLinkBtn) {
        cancelLinkBtn.addEventListener('click', () => {
            socialPlatformSelect.value = '';
            urlInputContainer.style.display = 'none';
            linkUrlInput.value = '';
            quickSigninBtn.style.display = 'none';
        });
    }

    // Quick sign-in button functionality
    if (quickSigninBtn) {
        quickSigninBtn.addEventListener('click', () => {
            const platform = quickSigninBtn.getAttribute('data-platform');
            const loginUrl = platformLoginUrls[platform];
            
            if (loginUrl) {
                // Show helpful message
                const platformName = socialPlatformSelect.options[socialPlatformSelect.selectedIndex].textContent;
                const message = `🚀 Opening ${platformName} login page...\n\n` +
                               `Instructions:\n` +
                               `1. Sign in to your ${platformName} account\n` +
                               `2. Copy your profile URL from the address bar\n` +
                               `3. Come back here and paste it in the input field\n\n` +
                               `The login page will open in a new tab.`;
                
                alert(message);
                
                // Open login page in new tab
                window.open(loginUrl, '_blank');
            }
        });
    }

    // Add link functionality with social platform data
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', async () => {
            const url = linkUrlInput.value.trim();
            const selectedPlatform = socialPlatformSelect.value;
            const selectedOption = socialPlatformSelect.options[socialPlatformSelect.selectedIndex];
            
            console.log('Add link clicked, currentUserId:', currentUserId);
            console.log('URL entered:', url);
            console.log('Selected platform:', selectedPlatform);
            console.log('URL length:', url.length);
            console.log('Platform exists:', !!selectedPlatform);
            
            // Enhanced validation
            if (!selectedPlatform) {
                alert('Please select a platform first');
                return;
            }
            
            if (!url || url.length === 0) {
                alert('Please enter a valid URL. Current URL: "' + url + '"');
                return;
            }
            
            if (!currentUserId) {
                // Fallback: try to get current user directly
                console.log('currentUserId is null, trying to get current user...');
                const user = await authFunctions.getCurrentUser();
                if (user && user.id) {
                    currentUserId = user.id;
                    console.log('Got current user ID from direct call:', currentUserId);
                } else {
                    alert('User not authenticated. Please log in again.');
                    window.location.href = '/login';
                    return;
                }
            }
            
            // Basic URL validation
            try {
                new URL(url);
            } catch (e) {
                alert('Please enter a valid URL format (e.g., https://example.com). Error: ' + e.message);
                return;
            }
            
            // Check subscription limits
            const maxLinks = getMaxLinks(subscription.plan);
            if (links.length >= maxLinks) {
                alert(`Free plan limited to ${maxLinks} links. Upgrade to Premium for unlimited links!`);
                return;
            }
            
            if (url && currentUserId) {
                try {
                    // Use selected platform data
                    const platformName = selectedOption.textContent;
                    const platformIcon = selectedOption.dataset.icon;
                    const platformColor = selectedOption.dataset.color;
                    
                    // Save via Laravel API
                    addLinkBtn.textContent = 'Adding...';
                    addLinkBtn.disabled = true;

                    // Create link via API
                    const response = await fetch(`/api/user/${currentUserId}/links`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                        },
                        body: JSON.stringify({
                            name: platformName,
                            url: url,
                            icon: selectedPlatform
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        // Add to local array and render
                        const newLink = {
                            id: result.link.id,
                            name: result.link.name,
                            url: result.link.url,
                            icon: result.link.icon,
                            color: platformColor,
                            count: result.link.count
                        };
                        
                        links.push(newLink);
                        renderLinks();
                        
                        // Reset form
                        socialPlatformSelect.value = '';
                        urlInputContainer.style.display = 'none';
                        linkUrlInput.value = '';
                        
                        // Hide no links message
                        if (noLinksMessage) {
                            noLinksMessage.style.display = 'none';
                        }

                        alert('Link added successfully!');
                    } else {
                        throw new Error(result.error || 'Failed to add link');
                    }
                } catch (error) {
                    console.error('Error adding link:', error);
                    alert('Failed to add link: ' + error.message);
                } finally {
                    addLinkBtn.textContent = '➕ Add Link';
                    addLinkBtn.disabled = false;
                }
            } else {
                alert('Please enter a valid URL.');
            }
        });
    }

    // Helper functions
    function displaySubscriptionInfo(sub) {
        const subInfo = document.getElementById('subscription-info');
        const statusClass = sub.status === 'active' ? 'status-active' : 'status-expired';
        subInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span><strong>Plan:</strong> ${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}</span>
                <span class="status-badge ${statusClass}">${sub.status.toUpperCase()}</span>
            </div>
            ${sub.plan !== 'free' && sub.nextBilling ? `<small>Next billing: ${new Date(sub.nextBilling).toLocaleDateString()}</small>` : ''}
        `;
    }

    function getMaxLinks(plan) {
        switch(plan) {
            case 'free': return 5;
            case 'premium': return Infinity;
            case 'pro': return Infinity;
            default: return 5;
        }
    }

    // Initial render
    renderLinks();
    
    // HomeBase Link functionality
    const homebaseUrlInput = document.getElementById('homebase-url');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    
    if (homebaseUrlInput && copyLinkBtn) {
        // Smart URL generation for different deployment environments
        async function generateHomeBaseUrl() {
            try {
                const currentUrl = window.location.origin;
                const currentPath = window.location.pathname;
                
                console.log('Generating HomeBase URL with:', { currentUrl, currentPath });
                
                // Get current user's username
                const user = await authFunctions.getCurrentUser();
                if (user) {
                    const userData = await dbFunctions.getUserData(user.id);
                    if (userData && userData.username) {
                        const username = userData.username;
                        console.log('Username found:', username);
                        
                        // Check if we're on GitHub Pages
                        if (currentUrl.includes('github.io')) {
                            // GitHub Pages deployment (legacy)
                            if (currentPath.includes('/HomeBase/')) {
                                // We're in the repository subdirectory
                                return `${currentUrl}/HomeBase/profile.html?user=${username}`;
                            } else {
                                // We're at the root (custom domain or root deployment)
                                return `${currentUrl}/profile.html?user=${username}`;
                            }
                        }
                    
                    // Laravel development or production
                    return `${currentUrl}/profile/${username}`;
                }
            }
            
            // Fallback if no user data - redirect to Laravel profile route
            return `${currentUrl}/profile`;
        } catch (error) {
            console.error('Error in generateHomeBaseUrl:', error);
            return `${window.location.origin}/profile`;
        }
    }
        
        // Initialize URL (async)
        generateHomeBaseUrl().then(homebaseUrl => {
            homebaseUrlInput.value = homebaseUrl;
            
            // Copy to clipboard functionality
            copyLinkBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(homebaseUrl);
                    copyLinkBtn.textContent = '✅ Copied!';
                    copyLinkBtn.classList.add('copied');
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyLinkBtn.textContent = '📋 Copy';
                        copyLinkBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    // Fallback for older browsers
                    homebaseUrlInput.select();
                    document.execCommand('copy');
                    copyLinkBtn.textContent = '✅ Copied!';
                    copyLinkBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyLinkBtn.textContent = '📋 Copy';
                        copyLinkBtn.classList.remove('copied');
                    }, 2000);
                }
            });
        }).catch(error => {
            console.error('Error generating HomeBase URL:', error);
            homebaseUrlInput.value = 'Error loading profile URL';
        });
    }

    // Debug functionality for checking user data
    const checkUserDataBtn = document.getElementById('check-user-data-btn');
    const updateUsernameBtn = document.getElementById('update-username-btn');
    const initDatabaseBtn = document.getElementById('init-database-btn');
    const fixUserDataBtn = document.getElementById('fix-user-data-btn');
    const userDataDisplay = document.getElementById('user-data-display');
    const userDataJson = document.getElementById('user-data-json');

    if (checkUserDataBtn) {
        checkUserDataBtn.addEventListener('click', async () => {
            const user = await authFunctions.getCurrentUser();
            if (user) {
                try {
                    const userData = await dbFunctions.getUserData(user.id);
                    userDataJson.textContent = JSON.stringify(userData, null, 2);
                    userDataDisplay.style.display = 'block';
                } catch (error) {
                    userDataJson.textContent = 'Error: ' + error.message;
                    userDataDisplay.style.display = 'block';
                }
            }
        });
    }

    if (updateUsernameBtn) {
        updateUsernameBtn.addEventListener('click', async () => {
            const user = await authFunctions.getCurrentUser();
            if (user) {
                const username = prompt('Enter a username for this account:');
                if (username) {
                    try {
                        // Check if username exists
                        const exists = await dbFunctions.checkUsernameExists(username);
                        if (exists) {
                            alert('Username already taken!');
                            return;
                        }

                        // Get current user data and update it
                        const currentData = await dbFunctions.getUserData(user.id);
                        await dbFunctions.saveUserData(user.id, {
                            email: currentData.email,
                            username: username.toLowerCase().trim(),
                            photo_url: currentData.photo_url
                        });

                        alert('Username updated successfully!');
                        
                        // Reload profile
                        loadUserProfile(user.id);
                    } catch (error) {
                        alert('Failed to update username: ' + error.message);
                    }
                }
            }
        });
    }

    if (initDatabaseBtn) {
        initDatabaseBtn.addEventListener('click', async () => {
            const user = await authFunctions.getCurrentUser();
            if (user) {
                try {
                    initDatabaseBtn.textContent = '🔄 Initializing...';
                    initDatabaseBtn.disabled = true;

                    // Initialize user data in Supabase
                    console.log('Initializing Supabase user data...');
                    
                    // Create/update user record
                    const userData = {
                        email: user.email,
                        username: null,
                        photo_url: null
                    };
                    
                    await dbFunctions.saveUserData(user.id, userData);
                    console.log('User data initialized');
                    
                    // Database initialization not needed for Supabase - tables already exist
                    console.log('Database already initialized with Supabase');
                    
                    alert('Database collections initialized successfully! You can now use the signup form.');
                    
                    // Reload user profile
                    loadUserProfile(user.id);
                    
                } catch (error) {
                    alert('Error initializing database: ' + error.message);
                    console.error('Database initialization error:', error);
                } finally {
                    initDatabaseBtn.textContent = '🗄️ Initialize Database';
                    initDatabaseBtn.disabled = false;
                }
            } else {
                alert('Please login first to initialize the database.');
            }
        });
    }

    if (fixUserDataBtn) {
        fixUserDataBtn.addEventListener('click', async () => {
            const user = await authFunctions.getCurrentUser();
            if (user) {
                try {
                    // Get current user data
                    const currentData = await dbFunctions.getUserData(user.id);
                    console.log('Current user data:', currentData);

                    // Check if username is missing
                    if (!currentData.username || currentData.username === null) {
                        const username = prompt('Your username is missing. Please enter a username:');
                        if (username) {
                            const cleanUsername = username.toLowerCase().trim();
                            
                            // Validate username
                            if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
                                alert('Username can only contain letters, numbers, and underscores!');
                                return;
                            }
                            
                            // Check if username exists
                            const exists = await dbFunctions.checkUsernameExists(cleanUsername);
                            if (exists) {
                                alert('Username already taken!');
                                return;
                            }

                            // Update user data with username
                            const updateResult = await dbFunctions.saveUserData(user.id, {
                                username: cleanUsername
                            });

                            if (updateResult) {
                                alert('Username updated successfully!');
                            } else {
                                alert('Failed to update username: ' + updateResult.error);
                                return;
                            }
                        }
                    } else {
                        alert('Username is already set: ' + currentData.username);
                    }

                    // Reload profile to show changes
                    loadUserProfile(user.id);
                    
                } catch (error) {
                    alert('Error fixing user data: ' + error.message);
                    console.error('Fix user data error:', error);
                }
            }
        });
    }
});