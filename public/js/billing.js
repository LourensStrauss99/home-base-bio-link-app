// Billing page script
document.addEventListener('DOMContentLoaded', () => {
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

    // Load subscription and billing data
    const subscription = JSON.parse(localStorage.getItem('subscription')) || { plan: 'free', status: 'active' };
    const billingHistory = JSON.parse(localStorage.getItem('billingHistory')) || generateMockBillingHistory();
    
    displayCurrentSubscription(subscription);
    displayBillingHistory(billingHistory);

    function displayCurrentSubscription(sub) {
        const subElement = document.getElementById('current-subscription');
        const statusClass = sub.status === 'active' ? 'status-active' : 'status-expired';
        const planPrice = getPlanPrice(sub.plan);
        
        subElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                    <h3>${sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)} Plan</h3>
                    <p style="margin: 0; font-size: 1.2em; color: #007bff;">${planPrice}/month</p>
                </div>
                <span class="status-badge ${statusClass}">${sub.status.toUpperCase()}</span>
            </div>
            ${sub.nextBilling ? `<p><strong>Next billing date:</strong> ${new Date(sub.nextBilling).toLocaleDateString()}</p>` : '<p>No upcoming billing</p>'}
            ${sub.plan !== 'free' ? '<button class="btn-secondary" onclick="cancelSubscription()">Cancel Subscription</button>' : ''}
        `;
    }

    function displayBillingHistory(history) {
        const historyElement = document.getElementById('billing-history');
        if (history.length === 0) {
            historyElement.innerHTML = '<p>No billing history available.</p>';
            return;
        }
        
        historyElement.innerHTML = history.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div>
                    <strong>${item.description}</strong><br>
                    <small>${new Date(item.date).toLocaleDateString()}</small>
                </div>
                <div style="text-align: right;">
                    <strong>$${item.amount}</strong><br>
                    <small class="status-badge status-${item.status}">${item.status.toUpperCase()}</small>
                </div>
            </div>
        `).join('');
    }

    function getPlanPrice(plan) {
        switch(plan) {
            case 'free': return '$0';
            case 'premium': return '$9.99';
            case 'pro': return '$19.99';
            default: return '$0';
        }
    }

    function generateMockBillingHistory() {
        const history = [];
        const currentSub = JSON.parse(localStorage.getItem('subscription'));
        
        if (currentSub && currentSub.plan !== 'free' && currentSub.startDate) {
            const startDate = new Date(currentSub.startDate);
            const price = currentSub.plan === 'premium' ? '9.99' : '19.99';
            
            history.push({
                date: startDate.toISOString(),
                description: `${currentSub.plan.charAt(0).toUpperCase() + currentSub.plan.slice(1)} Plan - Monthly`,
                amount: price,
                status: 'paid'
            });
        }
        
        return history;
    }

    // Make cancelSubscription globally available
    window.cancelSubscription = function() {
        if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
            const subscription = JSON.parse(localStorage.getItem('subscription'));
            subscription.status = 'cancelled';
            localStorage.setItem('subscription', JSON.stringify(subscription));
            alert('Subscription cancelled. You will retain access until your next billing date.');
            displayCurrentSubscription(subscription);
        }
    };
});