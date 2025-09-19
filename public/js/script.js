// Add interactivity to the links - Supabase UMD version
// Initialize Supabase client using the global variable
const { createClient } = supabase;

const supabaseUrl = 'https://kiaqpvwcifgtiliwkxny.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpYXFwdndjaWZndGlsaXdreG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwOTc0OTQsImV4cCI6MjA3MzY3MzQ5NH0.wjy54c99IFy3h-XSONf3yaxeWZlI2Hfu6hvVut6dZTU';

const supabaseClient = createClient(supabaseUrl, supabaseKey);

const dbFunctions = {
    async getUserByUsername(username) {
        try {
            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('username', username)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get user by username error:', error);
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
    }
};

document.addEventListener('DOMContentLoaded', () => {
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
            return `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <title>${icon.title}</title>
                        <path d="${icon.path}"></path>
                    </svg>`;
        }
        
        // Fallback icons for common platforms if Simple Icons isn't available
        const fallbackIcons = {
            'instagram': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <title>Instagram</title>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>`,
            'x': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <title>X</title>
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>`,
            'youtube': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                          <title>YouTube</title>
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>`,
            'github': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                         <title>GitHub</title>
                         <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                       </svg>`,
            'linkedin': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                           <title>LinkedIn</title>
                           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                         </svg>`,
            'tiktok': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                         <title>TikTok</title>
                         <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                       </svg>`,
            'facebook': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                           <title>Facebook</title>
                           <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                         </svg>`,
            'spotify': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                          <title>Spotify</title>
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>`,
            'discord': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                          <title>Discord</title>
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                        </svg>`,
            'globe': `<svg class="link-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <title>Link</title>
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.5 9.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"/>
                        <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                      </svg>`
        };
        
        // Use fallback icon if available, otherwise generic globe
        return fallbackIcons[iconSlug] || fallbackIcons['globe'];
    }

    // Track page views
    let views = parseInt(localStorage.getItem('views')) || 0;
    views++;
    localStorage.setItem('views', views);

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

    // Check if we're loading a specific user's profile
    const urlParams = new URLSearchParams(window.location.search);
    const profileUsername = urlParams.get('user');
    
    // Variables for links and click tracking
    let links = [];
    let clickCounts = {};
    let isUserProfile = false;
    let currentUserId = null;

    // Function to load user-specific links
    async function loadUserLinks(username) {
        if (!username) {
            // No username provided, use default links
            return {
                links: [
                    { name: "YouTube", url: "https://youtube.com/@yourname", count: 2 },
                    { name: "TikTok", url: "https://tiktok.com/@yourname", count: 2 },
                    { name: "Facebook", url: "https://facebook.com/yourname", count: 0 },
                    { name: "Instagram", url: "https://instagram.com/yourname", count: 0 }
                ],
                success: true
            };
        }

        try {
            const userData = await dbFunctions.getUserByUsername(username);
            
            // Get user's links from user_links table
            const userLinks = await dbFunctions.getUserLinks(userData.id);
            
            return {
                links: userLinks || [],
                success: true,
                userData: userData
            };
        } catch (error) {
            console.error('Error loading user links:', error);
            // User not found, show default message
            return {
                links: [],
                success: false,
                error: "User not found"
            };
        }
    }

    // Initialize links based on profile type
    async function initializeLinks() {
        if (profileUsername) {
            // Loading a specific user's profile
            isUserProfile = true;
            const result = await loadUserLinks(profileUsername);
            links = result.links;
            
            if (result.success && result.userData) {
                // Update page title with username
                document.title = `${result.userData.username}'s HomeBase`;
                
                // Update header if it exists
                const headerElement = document.querySelector('h1 a');
                if (headerElement) {
                    headerElement.textContent = `🏠 ${result.userData.username}'s HomeBase`;
                }
                
                // Show profile information
                const profilePhotoContainer = document.getElementById('profile-photo-container');
                const profilePhoto = document.getElementById('profile-photo');
                const profileUsername = document.getElementById('profile-username');
                const profileBioContainer = document.getElementById('profile-bio-container');
                const profileBio = document.getElementById('profile-bio');
                const welcomeText = document.getElementById('welcome-text');
                
                // Display username
                if (profileUsername) {
                    profileUsername.textContent = result.userData.username;
                }
                
                // Display profile photo if available
                if (result.userData.photo_url && profilePhoto) {
                    profilePhoto.src = result.userData.photo_url;
                    profilePhoto.alt = `${result.userData.username}'s profile photo`;
                    if (profilePhotoContainer) {
                        profilePhotoContainer.style.display = 'block';
                    }
                }
                
                // Display bio if available
                if (result.userData.bio && profileBio) {
                    profileBio.textContent = result.userData.bio;
                    if (profileBioContainer) {
                        profileBioContainer.style.display = 'block';
                    }
                }
                
                // Update welcome text
                if (welcomeText) {
                    welcomeText.textContent = `Click the links below to visit ${result.userData.username}'s profiles.`;
                }
            }
        } else {
            // Default profile page or admin mode
            links = JSON.parse(localStorage.getItem('links')) || [
                { name: "YouTube", url: "https://youtube.com/@yourname", count: 2 },
                { name: "TikTok", url: "https://tiktok.com/@yourname", count: 2 },
                { name: "Facebook", url: "https://facebook.com/yourname", count: 0 },
                { name: "Instagram", url: "https://instagram.com/yourname", count: 0 }
            ];
        }
        
        clickCounts = JSON.parse(localStorage.getItem('clickCounts')) || {};
        renderLinks();
    }

    // Function to render links
    function renderLinks() {
        const linksContainer = document.querySelector('.links');
        if (!linksContainer) {
            return; // Exit if links container doesn't exist on this page
        }
        linksContainer.innerHTML = '';
        links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.className = 'link';
            
            // Get icon for the link
            const iconSlug = link.icon || detectSocialIcon(link.url);
            const iconHtml = renderIcon(iconSlug);
            
            linkElement.innerHTML = `
                ${iconHtml}
                <span class="link-text">${link.name}</span>
                <span class="count">${link.count}</span>
            `;
            linksContainer.appendChild(linkElement);
        });
        attachLinkEvents();
    }

    // Attach events to links
    function attachLinkEvents() {
        const linkElements = document.querySelectorAll('.link');
        linkElements.forEach((linkElement, index) => {
            const link = links[index];
            linkElement.addEventListener('click', (e) => {
                if (link.url === '#') {
                    e.preventDefault();
                }
                
                // Only increment count for valid links
                if (link.url !== '#' && isUserProfile) {
                    link.count++;
                    linkElement.querySelector('.count').textContent = link.count;
                    
                    // For user profiles, we'd want to update Firestore here
                    // For now, just track locally for demo purposes
                    if (!isUserProfile) {
                        localStorage.setItem('links', JSON.stringify(links));
                    }
                }
            });

            // Hover effects
            linkElement.addEventListener('mouseenter', () => {
                linkElement.style.transform = 'scale(1.05)';
            });
            linkElement.addEventListener('mouseleave', () => {
                linkElement.style.transform = 'scale(1)';
            });
        });
    }

    // Show add link section only in admin mode
    const addLinkSection = document.getElementById('add-link-section');
    if (window.location.search.includes('admin=true')) {
        addLinkSection.style.display = 'block';

        const addLinkBtn = document.getElementById('add-link-btn');
        const linkNameInput = document.getElementById('link-name');
        const linkUrlInput = document.getElementById('link-url');

        addLinkBtn.addEventListener('click', () => {
            const name = linkNameInput.value.trim();
            const url = linkUrlInput.value.trim();
            if (name && url) {
                links.push({ name, url, count: 0 });
                localStorage.setItem('links', JSON.stringify(links));
                renderLinks();
                linkNameInput.value = '';
                linkUrlInput.value = '';
            } else {
                alert('Please enter both name and URL.');
            }
        });
    }

    // Initialize everything
    initializeLinks();
});