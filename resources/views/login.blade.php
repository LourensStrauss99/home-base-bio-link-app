<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login to HomeBase</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">

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
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#2a5298">
</head>
<body class="light-theme">
    <div class="container">
        <h1>Login to HomeBase</h1>
        <form id="login-form">
            <input type="email" id="email" placeholder="Email" required>
            <div class="password-container">
                <input type="password" id="password" placeholder="Password" required>
                <button type="button" class="password-toggle" aria-label="Show password">
                    <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </button>
            </div>
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="{{ route('signup') }}">Sign Up</a></p>
        <button id="theme-toggle">Toggle Theme</button>
    </div>

    <!-- Laravel Authentication Script -->
    <script src="{{ asset('js/login.js') }}"></script>
</body>
</html>