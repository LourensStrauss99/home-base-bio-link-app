// Customize page script
document.addEventListener('DOMContentLoaded', () => {
    let isRedirecting = false;
    
    // Check Firebase authentication
    FirebaseUtils.onAuthStateChanged((user) => {
        if (!user && !isRedirecting) {
            isRedirecting = true;
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 100);
            return;
        }
        
        if (user) {
            // Store user info for compatibility
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email
            }));
            // Initialize customize
            initializeCustomize(user);
        }
    });

    function initializeCustomize(currentUser) {
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

    // Load saved background
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.body.style.background = `url(${savedBg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    // Background image
    document.getElementById('bg-image').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const bgUrl = reader.result;
                document.body.style.background = `url(${bgUrl})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                localStorage.setItem('background', bgUrl);
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove background
    document.getElementById('remove-bg').addEventListener('click', () => {
        document.body.style.background = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
        localStorage.removeItem('background');
    });
    }
});