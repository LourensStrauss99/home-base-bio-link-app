// Customize page script with Laravel authentication
document.addEventListener('DOMContentLoaded', () => {
    let isRedirecting = false;

    // Check Laravel authentication
    checkAuthStatus();

    // Initialize customize once authenticated
    initializeCustomize();

    function initializeCustomize() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light-theme';
        document.body.className = savedTheme;

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

        // Load saved background
        const savedBg = localStorage.getItem('background');
        if (savedBg) {
            document.body.style.background = 'url(' + savedBg + ')';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }

        // Background image
        const bgImageInput = document.getElementById('bg-image');
        if (bgImageInput) {
            bgImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const bgUrl = reader.result;
                        document.body.style.background = 'url(' + bgUrl + ')';
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        localStorage.setItem('background', bgUrl);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Remove background
        const removeBgBtn = document.getElementById('remove-bg');
        if (removeBgBtn) {
            removeBgBtn.addEventListener('click', () => {
                document.body.style.background = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                localStorage.removeItem('background');
            });
        }
    }
});

// Function to check Laravel authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/check-auth', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const result = await response.json();

        if (!result.authenticated) {
            console.log('User not authenticated, redirecting to login...');
            window.location.href = '/login';
        } else {
            console.log('User authenticated:', result.user);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        // If auth check fails, redirect to login
        window.location.href = '/login';
    }
}
