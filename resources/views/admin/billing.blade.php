<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeBase Billing</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
</head>
<body class="light-theme">
    <div class="container">
        <h1>Billing & Subscription</h1>

        <!-- Navigation will be injected here by admin-nav.js -->

        <div class="billing-info">
            <div class="subscription-status" id="current-subscription">
                <!-- Current subscription info -->
            </div>

            <h3>Payment Method</h3>
            <div class="payment-method" id="payment-info">
                <p>💳 **** **** **** 1234</p>
                <p>Expires: 12/25</p>
                <button class="btn-secondary">Update Payment Method</button>
            </div>

            <h3>Billing History</h3>
            <div class="billing-history" id="billing-history">
                <!-- Billing history will be loaded here -->
            </div>
        </div>

        <!-- Old navigation removed - new navigation injected by admin-nav.js -->

        <button id="theme-toggle">Toggle Theme</button>
    </div>

    <!-- Admin Navigation -->
    <script src="{{ asset('js/admin-nav.js') }}"></script>
    <script>injectAdminNavigation('billing');</script>
    <!-- Billing Script -->
    <script src="{{ asset('js/billing.js') }}"></script>
</body>
</html>