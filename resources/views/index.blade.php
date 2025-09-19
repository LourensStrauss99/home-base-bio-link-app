<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeBase - Your Link Hub</title>
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
        <div class="landing-header">
            <h1>🏠 Welcome to HomeBase</h1>
            <p class="tagline">Your personal link hub for all your social profiles</p>
            <p class="welcome-message">Join thousands of creators who use HomeBase to share all their links in one place!</p>
        </div>

        <div class="landing-content">
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🔗</div>
                    <h3>One Link for Everything</h3>
                    <p>Share one link that connects to all your social media profiles</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <h3>Track Your Clicks</h3>
                    <p>See which links get the most engagement with built-in analytics</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Themes</h3>
                    <p>Choose from 9 stunning themes to match your style</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🚀</div>
                    <h3>Free to Start</h3>
                    <p>Get started with up to 3 links, upgrade for unlimited</p>
                </div>
            </div>

            <div class="cta-section">
                <h2>Ready to create your HomeBase?</h2>
                <div class="auth-buttons">
                    <a href="{{ route('signup') }}" class="btn btn-primary">Create Account</a>
                    <a href="{{ route('login') }}" class="btn btn-secondary">Sign In</a>
                </div>
                <p class="auth-note">Already have an account? <a href="{{ route('login') }}">Sign in here</a></p>
            </div>
        </div>

        <!-- Theme Selector -->
        <div class="theme-selector">
            <label for="theme-select">🎨 Preview Themes:</label>
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
    </div>

    <!-- Supabase UMD Bundle -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="{{ asset('js/landing.js') }}"></script>
</body>
</html>