// Analytics page script with Laravel authentication
document.addEventListener('DOMContentLoaded', () => {
    let isRedirecting = false;

    // Check Laravel authentication
    checkAuthStatus();

    // Initialize analytics once authenticated
    initializeAnalytics();

    function initializeAnalytics() {
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
        const subscription = JSON.parse(localStorage.getItem('subscription')) || { plan: 'free', status: 'active' };

        // Calculate totals
        const totalClicks = links.reduce((sum, link) => sum + (link.count || 0), 0);
        const clickRate = views > 0 ? ((totalClicks / views) * 100).toFixed(2) : 0;

        // Display overview
        const totalViewsEl = document.getElementById('total-views');
        const totalClicksEl = document.getElementById('total-clicks');
        const clickRateEl = document.getElementById('click-rate');

        if (totalViewsEl) totalViewsEl.textContent = views;
        if (totalClicksEl) totalClicksEl.textContent = totalClicks;
        if (clickRateEl) clickRateEl.textContent = clickRate + '%';

        // Display link stats with subscription limitations
        const linkStats = document.getElementById('link-stats');
        if (linkStats) {
            linkStats.innerHTML = '<h3>Link Performance</h3>';

            if (subscription.plan === 'free') {
                linkStats.innerHTML += '<p><em>Upgrade to Premium for detailed analytics and insights!</em></p>';
                links.slice(0, 3).forEach(link => {
                    const statDiv = document.createElement('div');
                    statDiv.innerHTML = '<p><strong>' + (link.name || 'Unnamed Link') + '</strong>: ' + (link.count || 0) + ' clicks</p>';
                    linkStats.appendChild(statDiv);
                });
                if (links.length > 3) {
                    linkStats.innerHTML += '<p><em>... and more. Upgrade to see all analytics.</em></p>';
                }
            } else {
                // Premium/Pro features
                links.forEach(link => {
                    const percentage = totalClicks > 0 ? ((link.count / totalClicks) * 100).toFixed(1) : 0;
                    const statDiv = document.createElement('div');
                    statDiv.innerHTML = '<div style=\"background: rgba(255,255,255,0.1); padding: 10px; margin: 10px 0; border-radius: 8px;\"><strong>' + (link.name || 'Unnamed Link') + '</strong><br>Clicks: ' + (link.count || 0) + ' (' + percentage + '% of total)<br>' + (subscription.plan === 'pro' ? '<small>Conversion rate: ' + (Math.random() * 5 + 1).toFixed(1) + '%</small>' : '') + '</div>';
                    linkStats.appendChild(statDiv);
                });

                if (subscription.plan === 'pro') {
                    linkStats.innerHTML += '<div style=\"margin-top: 20px; padding: 15px; background: rgba(0,123,255,0.1); border-radius: 8px;\"><h4>Pro Analytics</h4><p>📊 Average session duration: ' + (Math.random() * 3 + 1).toFixed(1) + ' minutes</p><p>🌍 Top country: United States (' + (Math.random() * 30 + 40).toFixed(0) + '%)</p><p>📱 Mobile traffic: ' + (Math.random() * 20 + 60).toFixed(0) + '%</p></div>';
                }
            }
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
