// Activity page script
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
            // Initialize activity
            initializeActivity(user);
        }
    });

    function initializeActivity(currentUser) {
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

    // Display views
    document.getElementById('page-views').textContent = views;

    // Click distribution
    const totalClicks = links.reduce((sum, link) => sum + link.count, 0);
    const clickDist = document.getElementById('click-distribution');
    links.forEach(link => {
        const percentage = totalClicks > 0 ? ((link.count / totalClicks) * 100).toFixed(2) : 0;
        const distDiv = document.createElement('div');
        distDiv.innerHTML = `
            <p><strong>${link.name}</strong>: ${link.count} clicks (${percentage}%)</p>
        `;
        clickDist.appendChild(distDiv);
    });
    }
});