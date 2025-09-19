<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeBase Analytics</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="{{ asset('assets/icons/AppImages/ios/180.png') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#2a5298">
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/icons/AppImages/ios/32.png') }}">
</head>
<body class="theme-light">
    <div class="container">
        <h1>HomeBase Analytics</h1>

        <!-- Navigation will be injected here by admin-nav.js -->

        <!-- Theme Selector -->
        <div class="theme-selector">
            <label for="theme-select">🎨 Choose Theme:</label>
            <select id="theme-select">
                <option value="theme-default">Deep Blue</option>
                <option value="theme-purple">Purple</option>
                <option value="theme-green">Green</option>
                <option value="theme-orange">Orange</option>
                <option value="theme-dark">Dark Mode</option>
                <option value="theme-light">Light Mode</option>
                <option value="theme-sunset">Sunset</option>
                <option value="theme-ocean">Ocean</option>
                <option value="theme-cosmic">Cosmic</option>
            </select>
        </div>

        <div id="analytics-data">
            <h2>Overview</h2>
            <p>Total Views: <span id="total-views">0</span></p>
            <p>Total Clicks: <span id="total-clicks">0</span></p>
            <p>Click Rate: <span id="click-rate">0%</span></p>
            <h2>Link Performance</h2>
            <div id="link-stats"></div>
        </div>
    </div>

    <!-- Supabase SDK -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

    <!-- Analytics Script -->
    <script src="{{ asset('js/analytics.js') }}"></script>
    <!-- Supabase UMD Bundle -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <!-- Admin Navigation -->
    <script src="{{ asset('js/admin-nav.js') }}"></script>
    <script>injectAdminNavigation('analytics');</script>
    <!-- Analytics Script -->
    <script src="{{ asset('js/analytics.js') }}"></script>
</body>
</html>