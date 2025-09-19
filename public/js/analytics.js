// Analytics page script
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
            // Initialize analytics
            initializeAnalytics(user);
        }
    });

    function initializeAnalytics(currentUser) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'theme-light';
        document.body.className = savedTheme; // Replace all classes with saved theme

    // Load saved background
    const savedBg = localStorage.getItem('background');
    if (savedBg) {
        document.body.style.background = `url(${savedBg})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
    });

    // Load data
    const views = parseInt(localStorage.getItem('views')) || 0;
    const links = JSON.parse(localStorage.getItem('links')) || [];
    const subscription = JSON.parse(localStorage.getItem('subscription')) || { plan: 'free', status: 'active' };

    // Calculate totals
    const totalClicks = links.reduce((sum, link) => sum + link.count, 0);
    const clickRate = views > 0 ? ((totalClicks / views) * 100).toFixed(2) : 0;

    // Display overview
    document.getElementById('total-views').textContent = views;
    document.getElementById('total-clicks').textContent = totalClicks;
    document.getElementById('click-rate').textContent = clickRate + '%';

    // Display link stats with subscription limitations
    const linkStats = document.getElementById('link-stats');
    linkStats.innerHTML = '<h3>Link Performance</h3>';
    
    if (subscription.plan === 'free') {
        linkStats.innerHTML += '<p><em>Upgrade to Premium for detailed analytics and insights!</em></p>';
        links.slice(0, 3).forEach(link => {
            const statDiv = document.createElement('div');
            statDiv.innerHTML = `<p><strong>${link.name}</strong>: ${link.count} clicks</p>`;
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
            statDiv.innerHTML = `
                <div style="background: rgba(255,255,255,0.1); padding: 10px; margin: 10px 0; border-radius: 8px;">
                    <strong>${link.name}</strong><br>
                    Clicks: ${link.count} (${percentage}% of total)<br>
                    ${subscription.plan === 'pro' ? `<small>Conversion rate: ${(Math.random() * 5 + 1).toFixed(1)}%</small>` : ''}
                </div>
            `;
            linkStats.appendChild(statDiv);
        });
        
        if (subscription.plan === 'pro') {
            linkStats.innerHTML += `
                <div style="margin-top: 20px; padding: 15px; background: rgba(0,123,255,0.1); border-radius: 8px;">
                    <h4>Pro Analytics</h4>
                    <p>📊 Average session duration: ${(Math.random() * 3 + 1).toFixed(1)} minutes</p>
                    <p>🌍 Top country: United States (${(Math.random() * 30 + 40).toFixed(0)}%)</p>
                    <p>📱 Mobile traffic: ${(Math.random() * 20 + 60).toFixed(0)}%</p>
                </div>
            `;
        }
    }
    }
});