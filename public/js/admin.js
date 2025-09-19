// Admin dashboard script with Supabase - UMD version
// Initialize Supabase client using the global variable
const { createClient } = supabase;

const supabaseUrl = 'https://kiaqpvwcifgtiliwkxny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYXFwdndjaWZndGlsaXdreG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTc0OTQsImV4cCI6MjA3MzY3MzQ5NH0.wjy54c99IFy3h-XSONf3yaxeWZlI2Hfu6hvVut6dZTU';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Supabase functions
const authFunctions = {
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    },

    onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange(callback);
    },

    async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Signout error:', error);
            throw error;
        }
    }
};

const dbFunctions = {
    async getUserData(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If user not found, try to auto-create from auth data
                if (error.code === 'PGRST116' || error.message.includes('No rows')) {
                    console.log('User not found in users table, attempting auto-creation...');
                    return await this.createUserFromAuth(userId);
                }
                throw error;
            }
            return data;
        } catch (error) {
            console.error('Get user data error:', error);
            throw error;
        }
    },

    async createUserFromAuth(userId) {
        try {
            console.log('Creating user from auth data for userId:', userId);
            const { data: { user } } = await supabaseClient.auth.getUser();
            
            if (!user || user.id !== userId) {
                throw new Error('Auth user not found or ID mismatch');
            }

            const username = user.user_metadata?.username || 
                            user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

            const userData = await this.saveUserData(userId, {
                email: user.email,
                username: username,
                bio: null,
                photo_url: null
            });

            console.log('User auto-created successfully:', userData);
            return userData;
        } catch (error) {
            console.error('Error auto-creating user:', error);
            throw error;
        }
    },

    async saveUserData(userId, userData) {
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .upsert({
                    id: userId,
                    email: userData.email,
                    username: userData.username,
                    photo_url: userData.photo_url || null,
                    bio: userData.bio || null,
                    updated_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Save user data error:', error);
            throw error;
        }
    },

    async checkUsernameExists(username) {
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('username')
                .eq('username', username)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return !!data;
        } catch (error) {
            console.error('Check username error:', error);
            return false;
        }
    },

    async saveUserLink(userId, linkData) {
        try {
            const { data, error } = await supabaseClient
                .from('user_links')
                .insert({
                    user_id: userId,
                    name: linkData.name,
                    url: linkData.url,
                    icon: linkData.icon,
                    created_at: new Date().toISOString()
                })
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Save user link error:', error);
            throw error;
        }
    },

    async getUserLinks(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('user_links')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Get user links error:', error);
            return [];
        }
    },

    async deleteUserLink(linkId) {
        try {
            const { error } = await supabaseClient
                .from('user_links')
                .delete()
                .eq('id', linkId);

            if (error) throw error;
        } catch (error) {
            console.error('Delete user link error:', error);
            throw error;
        }
    }
};

const storageFunctions = {
    async uploadProfilePhoto(userId, file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/profile.${fileExt}`;
            
            const { data, error } = await supabaseClient.storage
                .from('profile-photos')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) throw error;

            const { data: urlData } = supabaseClient.storage
                .from('profile-photos')
                .getPublicUrl(fileName);

            return urlData.publicUrl;
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
    
    // Check Supabase authentication
    authFunctions.onAuthStateChange((event, session) => {
        authCheckComplete = true;
        
        if (!session?.user && !isRedirecting) {
            // User is not authenticated, redirect to login
            isRedirecting = true;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 100);
            return;
        }
        
        if (session?.user) {
            // User is authenticated, continue with admin dashboard
            currentUserId = session.user.id;
            
            // Store user info for compatibility with existing code
            localStorage.setItem('user', JSON.stringify({
                uid: session.user.id,
                email: session.user.email
            }));
            
            // Load user profile data (this will also load links)
            loadUserProfile(session.user.id);
        }
    });

    // Load user profile data
    async function loadUserProfile(userId) {
        try {
            console.log('Loading user profile for userId:', userId);
            const userData = await dbFunctions.getUserData(userId);
            console.log('User data loaded successfully:', userData);
            
            // Update username display
            const adminUsername = document.getElementById('admin-username');
            if (adminUsername) {
                adminUsername.textContent = userData.username || 'User';
            }
            
            // Update profile photo
            const profilePhotoContainer = document.getElementById('profile-photo-container');
            const adminProfilePhoto = document.getElementById('admin-profile-photo');
            const changePhotoBtn = document.getElementById('change-photo-btn');
            
            console.log('Photo elements found:', {
                profilePhotoContainer: !!profilePhotoContainer,
                adminProfilePhoto: !!adminProfilePhoto,
                changePhotoBtn: !!changePhotoBtn,
                photo_url: userData.photo_url
            });
                
            if (userData.photo_url && adminProfilePhoto) {
                console.log('Setting profile photo src to:', userData.photo_url);
                adminProfilePhoto.src = userData.photo_url;
                if (profilePhotoContainer) {
                    profilePhotoContainer.style.display = 'block';
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
                userBio.value = userData.bio || '';
            }
            
            // Load user links after profile is loaded
            await loadUserLinks(userId);
            
        } catch (error) {
            console.error('Error loading user profile:', error);
            
            // Show error message to user
            const errorEl = document.createElement('div');
            errorEl.style.cssText = 'background: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 5px;';
            errorEl.textContent = 'Unable to load profile. Please try refreshing the page.';
            const container = document.querySelector('.container');
            if (container) {
                container.insertBefore(errorEl, container.firstChild);
            }
        }
    }

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
                
                const user = await authFunctions.getCurrentUser();
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
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await authFunctions.signOut();
                localStorage.removeItem('user');
                localStorage.removeItem('links');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Error logging out. Please try again.');
            }
        });
    }

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
                        
                        // Update in Supabase
                        btn.textContent = 'Updating...';
                        btn.disabled = true;
                        
                        await dbFunctions.saveUserLink(currentUserId, {
                            id: links[index].id,
                            name: newName,
                            url: newUrl,
                            icon: newIcon
                        });
                        
                        // Update local array
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
                        
                        // Delete from Supabase
                        btn.textContent = 'Deleting...';
                        btn.disabled = true;
                        
                        await dbFunctions.deleteUserLink(linkId);
                        
                        // Remove from local array
                        links.splice(index, 1);
                        renderLinks();
                        
                        alert('Link deleted successfully!');
                    } catch (error) {
                        console.error('Error deleting link:', error);
                        alert('Error deleting link. Please try again.');
                        btn.textContent = 'Delete';
                        btn.disabled = false;
                    }
                }
            });
        });
    }

    // Add link functionality
    const addLinkBtn = document.getElementById('add-link-btn');
    const linkUrlInput = document.getElementById('link-url');

    addLinkBtn.addEventListener('click', async () => {
        const url = linkUrlInput.value.trim();
        
        console.log('Add link clicked, currentUserId:', currentUserId);
        console.log('URL entered:', url);
        
        // Check subscription limits
        const maxLinks = getMaxLinks(subscription.plan);
        if (links.length >= maxLinks) {
            alert(`Free plan limited to ${maxLinks} links. Upgrade to Premium for unlimited links!`);
            return;
        }
        
        if (url && currentUserId) {
            try {
                // Auto-detect name and icon for the URL
                const name = detectPlatformName(url);
                const iconSlug = detectSocialIcon(url);
                
                // Save to Supabase
                addLinkBtn.textContent = 'Adding...';
                addLinkBtn.disabled = true;
                
                const newLink = await dbFunctions.saveUserLink(currentUserId, {
                    name: name,
                    url: url,
                    icon: iconSlug
                });
                
                console.log('Link saved successfully:', newLink);
                
                // Add to local array and re-render
                links.push({
                    id: newLink.id,
                    name: name,
                    url: url,
                    icon: iconSlug,
                    count: 0
                });
                
                renderLinks();
                linkUrlInput.value = '';
                
                // Show detected platform feedback
                alert(`${name} link added successfully!`);
            } catch (error) {
                console.error('Error adding link:', error);
                console.error('Error details:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint
                });
                alert('Error adding link. Please try again.');
            } finally {
                addLinkBtn.textContent = 'Add Link';
                addLinkBtn.disabled = false;
            }
        } else {
            alert('Please enter a URL.');
        }
    });

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
                            // GitHub Pages deployment
                            if (currentPath.includes('/HomeBase/')) {
                                // We're in the repository subdirectory
                                return `${currentUrl}/HomeBase/profile.html?user=${username}`;
                            } else {
                                // We're at the root (custom domain or root deployment)
                                return `${currentUrl}/profile.html?user=${username}`;
                            }
                        }
                    
                    // Localhost or custom domain
                    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
                        // Local development
                        return `${currentUrl}/profile.html?user=${username}`;
                    }
                    
                    // Custom domain deployment
                    return `${currentUrl}/profile.html?user=${username}`;
                }
            }
            
            // Fallback if no user data
            return `${currentUrl}/profile.html`;
        } catch (error) {
            console.error('Error in generateHomeBaseUrl:', error);
            return `${window.location.origin}/profile.html`;
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