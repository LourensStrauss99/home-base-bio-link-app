// Activity page script with Laravel authentication
document.addEventListener('DOMContentLoaded', () => {
    let isRedirecting = false;

    // Check Laravel authentication
    checkAuthStatus();

    // Initialize activity once authenticated
    initializeActivity();

    function initializeActivity() {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light-theme';
        document.body.className = savedTheme;

        // Load saved background
        const savedBg = localStorage.getItem('background');
        if (savedBg) {
            document.body.style.background = 'url(' + savedBg + ')';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                document.body.classList.toggle('dark-theme');

                // Save theme preference
                const currentTheme = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
                localStorage.setItem('theme', currentTheme);
            });
        }

        // Load data from localStorage (will be replaced with Laravel API calls later)
        const views = parseInt(localStorage.getItem('views')) || 0;
        const links = JSON.parse(localStorage.getItem('links')) || [];

        // Display views
        const pageViewsEl = document.getElementById('page-views');
        if (pageViewsEl) pageViewsEl.textContent = views;

        // Click distribution
        const totalClicks = links.reduce((sum, link) => sum + (link.count || 0), 0);
        const clickDist = document.getElementById('click-distribution');
        if (clickDist) {
            links.forEach(link => {
                const percentage = totalClicks > 0 ? ((link.count / totalClicks) * 100).toFixed(2) : 0;
                const distDiv = document.createElement('div');
                distDiv.innerHTML = '<p><strong>' + (link.name || 'Unnamed Link') + '</strong>: ' + (link.count || 0) + ' clicks (' + percentage + '%)</p>';
                clickDist.appendChild(distDiv);
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
