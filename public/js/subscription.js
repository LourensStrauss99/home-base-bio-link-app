// Subscription page script
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

    // Load current subscription
    const subscription = JSON.parse(localStorage.getItem('subscription')) || { plan: 'free', status: 'active' };
    
    // Update UI based on current plan
    updatePlanUI(subscription.plan);

    // Plan button handlers
    document.querySelectorAll('.plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const plan = e.target.dataset.plan;
            if (plan === 'free') {
                downgradePlan();
            } else {
                upgradePlan(plan);
            }
        });
    });

    function updatePlanUI(currentPlan) {
        document.querySelectorAll('.plan-btn').forEach(btn => {
            const planType = btn.dataset.plan;
            if (planType === currentPlan) {
                btn.textContent = 'Current Plan';
                btn.classList.add('current');
                btn.disabled = true;
            } else if (planType === 'free') {
                btn.textContent = 'Downgrade to Free';
                btn.classList.remove('current');
                btn.disabled = false;
            } else {
                btn.textContent = `Upgrade to ${planType.charAt(0).toUpperCase() + planType.slice(1)}`;
                btn.classList.remove('current');
                btn.disabled = false;
            }
        });
    }

    function upgradePlan(plan) {
        // Simulate payment process
        if (confirm(`Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} for ${plan === 'premium' ? '$9.99' : '$19.99'}/month?`)) {
            const newSubscription = {
                plan: plan,
                status: 'active',
                startDate: new Date().toISOString(),
                nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
            localStorage.setItem('subscription', JSON.stringify(newSubscription));
            alert(`Successfully upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)}!`);
            updatePlanUI(plan);
        }
    }

    function downgradePlan() {
        if (confirm('Downgrade to Free plan? You will lose premium features.')) {
            const newSubscription = {
                plan: 'free',
                status: 'active',
                startDate: new Date().toISOString(),
                nextBilling: null
            };
            localStorage.setItem('subscription', JSON.stringify(newSubscription));
            alert('Downgraded to Free plan.');
            updatePlanUI('free');
        }
    }
});