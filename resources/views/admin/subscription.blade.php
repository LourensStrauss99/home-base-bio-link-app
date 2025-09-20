<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeBase Subscription Plans</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
</head>
<body class="light-theme">
    <div class="container">
        <h1>Choose Your Plan</h1>

        <!-- Navigation will be injected here by admin-nav.js -->

        <p>Select the perfect plan for your HomeBase experience</p>

        <div class="plans-container">
            <!-- Free Plan -->
            <div class="plan-card free">
                <div class="plan-header">
                    <h3>Free</h3>
                    <div class="price">$0<span>/month</span></div>
                </div>
                <ul class="features">
                    <li>✓ Up to 5 links</li>
                    <li>✓ Basic themes</li>
                    <li>✓ Basic analytics</li>
                    <li>✓ Standard support</li>
                </ul>
                <button class="plan-btn current" data-plan="free">Current Plan</button>
            </div>

            <!-- Premium Plan -->
            <div class="plan-card premium popular">
                <div class="popular-badge">Most Popular</div>
                <div class="plan-header">
                    <h3>Premium</h3>
                    <div class="price">$9.99<span>/month</span></div>
                </div>
                <ul class="features">
                    <li>✓ Unlimited links</li>
                    <li>✓ Custom themes & backgrounds</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Priority support</li>
                    <li>✓ Custom domain</li>
                    <li>✓ Link scheduling</li>
                </ul>
                <button class="plan-btn" data-plan="premium">Upgrade to Premium</button>
            </div>

            <!-- Pro Plan -->
            <div class="plan-card pro">
                <div class="plan-header">
                    <h3>Pro</h3>
                    <div class="price">$19.99<span>/month</span></div>
                </div>
                <ul class="features">
                    <li>✓ Everything in Premium</li>
                    <li>✓ White-label solution</li>
                    <li>✓ API access</li>
                    <li>✓ Advanced integrations</li>
                    <li>✓ Team collaboration</li>
                    <li>✓ Custom branding</li>
                    <li>✓ Dedicated support</li>
                </ul>
                <button class="plan-btn" data-plan="pro">Upgrade to Pro</button>
            </div>
        </div>

        <!-- Old navigation removed - new navigation injected by admin-nav.js -->

        <button id="theme-toggle">Toggle Theme</button>
    </div>

    <!-- Admin Navigation -->
    <script src="{{ asset('js/admin-nav.js') }}"></script>
    <script>injectAdminNavigation('subscription');</script>
    <!-- Subscription Script -->
    <script src="{{ asset('js/subscription.js') }}"></script>
</body>
</html>