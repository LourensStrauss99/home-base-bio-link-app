// Shared admin navigation component
function createAdminNavigation(currentPage = '') {
    const navigationHTML = `
        <div class="admin-navigation">
            <h3>📊 Dashboard Navigation</h3>
            <div class="nav-grid">
                <a href="admin.html" class="nav-item ${currentPage === 'dashboard' ? 'active' : ''}">
                    <div class="nav-icon">🏠</div>
                    <span>Dashboard</span>
                </a>
                <a href="analytics.html" class="nav-item ${currentPage === 'analytics' ? 'active' : ''}">
                    <div class="nav-icon">📈</div>
                    <span>Analytics</span>
                </a>
                <a href="activity.html" class="nav-item ${currentPage === 'activity' ? 'active' : ''}">
                    <div class="nav-icon">🔥</div>
                    <span>Activity</span>
                </a>
                <a href="customize.html" class="nav-item ${currentPage === 'customize' ? 'active' : ''}">
                    <div class="nav-icon">🎨</div>
                    <span>Customize</span>
                </a>
                <a href="billing.html" class="nav-item ${currentPage === 'billing' ? 'active' : ''}">
                    <div class="nav-icon">💳</div>
                    <span>Billing</span>
                </a>
                <a href="subscription.html" class="nav-item ${currentPage === 'subscription' ? 'active' : ''}">
                    <div class="nav-icon">⭐</div>
                    <span>Subscription</span>
                </a>
            </div>
        </div>
        
        <nav>
            <a href="profile.html" class="public-link">🌐 View Public Profile</a> |
            <a href="index.html">🏠 Home</a> |
            <a href="#" onclick="logout()" class="logout-link">🚪 Logout</a>
        </nav>
    `;
    
    return navigationHTML;
}

// Shared navigation styles
function getAdminNavigationStyles() {
    return `
        <style>
            .admin-navigation {
                margin: 20px 0;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .admin-navigation h3 {
                margin: 0 0 15px 0;
                color: inherit;
                text-align: center;
            }
            
            .nav-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 15px;
                max-width: 600px;
                margin: 0 auto;
            }
            
            .nav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px 10px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                text-decoration: none;
                color: inherit;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .nav-item:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .nav-item.active {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.5);
            }
            
            .nav-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }
            
            .nav-item span {
                font-size: 12px;
                font-weight: 500;
                text-align: center;
            }
            
            .public-link {
                color: #4CAF50;
                font-weight: bold;
            }
            
            .logout-link {
                color: #f44336;
                font-weight: bold;
            }
            
            @media (max-width: 480px) {
                .nav-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .nav-item {
                    padding: 12px 8px;
                }
                
                .nav-icon {
                    font-size: 20px;
                }
            }
        </style>
    `;
}

// Shared logout function
async function logout() {
    try {
        // Import Supabase if not already available
        if (typeof supabaseClient !== 'undefined') {
            await supabaseClient.auth.signOut();
        }
        localStorage.removeItem('user');
        localStorage.removeItem('links');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Force redirect even if logout fails
        window.location.href = 'index.html';
    }
}

// Function to inject navigation into a page
function injectAdminNavigation(currentPage = '', insertAfterSelector = '.container h1') {
    document.addEventListener('DOMContentLoaded', () => {
        // Add styles to head
        const styleSheet = document.createElement('style');
        styleSheet.textContent = getAdminNavigationStyles().replace('<style>', '').replace('</style>', '');
        document.head.appendChild(styleSheet);
        
        // Find insertion point
        const insertAfter = document.querySelector(insertAfterSelector);
        if (insertAfter) {
            const navDiv = document.createElement('div');
            navDiv.innerHTML = createAdminNavigation(currentPage);
            insertAfter.parentNode.insertBefore(navDiv, insertAfter.nextSibling);
        }
    });
}