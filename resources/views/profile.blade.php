<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeBase</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons.min.js"></script>

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="{{ asset('assets/icons/AppImages/ios/180.png') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="HomeBase">

    <!-- Standard Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/icons/AppImages/ios/32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('assets/icons/AppImages/ios/16.png') }}">

    <!-- Theme Color for Mobile Browsers -->
    <meta name="theme-color" content="#2a5298">
    <meta name="msapplication-TileColor" content="#1e3c72">
    <meta name="msapplication-TileImage" content="{{ asset('assets/icons/AppImages/android/android-launchericon-144-144.png') }}">
</head>
<body class="theme-light">
    <div class="container">
        <div class="header">
            <h1><a href="{{ route('home') }}" style="color: inherit; text-decoration: none;">🏠 HomeBase</a></h1>
            <a href="{{ route('signup') }}" class="signup-link" title="Create Your HomeBase">✨ Sign Up</a>
        </div>

        <!-- User Profile Section -->
        <div class="user-profile-section" id="user-profile-section">
            <!-- Profile Photo -->
            <div class="profile-photo-container" id="profile-photo-container" style="display: none;">
                <img id="profile-photo" src="" alt="Profile Photo" class="profile-photo">
            </div>

            <!-- Username -->
            <h2 id="profile-username" class="profile-username">Loading...</h2>

            <!-- Bio -->
            <div class="profile-bio-container" id="profile-bio-container" style="display: none;">
                <p id="profile-bio" class="profile-bio"></p>
            </div>

            <!-- Create Your Own HomeBase Call-to-Action -->
            <div class="cta-banner">
                <p>💡 Want your own HomeBase? <a href="{{ route('signup') }}" class="cta-link">Create yours free!</a></p>
            </div>
        </div>

        <p id="welcome-text">Click the links below to visit my profiles.</p>

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

        <div id="add-link-section" style="display: none; margin: 20px 0;">
            <input type="text" id="link-name" placeholder="Link Name (e.g., Instagram)">
            <input type="url" id="link-url" placeholder="URL (e.g., https://instagram.com/username)">
            <button id="add-link-btn">Add Link</button>
        </div>
        <div class="links">
        </div>
    </div>
    <!-- Supabase UMD Bundle -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>