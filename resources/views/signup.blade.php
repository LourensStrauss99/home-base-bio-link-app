<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up for HomeBase</title>
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
    <meta name="theme-color" content="#2a5298">
</head>
<body class="light-theme">
    <div class="container">
        <h1>Sign Up for HomeBase</h1>
        <form id="signup-form">
            <input type="text" id="username" placeholder="Username (e.g., johnsmith)" required minlength="3" maxlength="20" pattern="[a-zA-Z0-9_]+" title="Username can only contain letters, numbers, and underscores">
            <input type="email" id="email" placeholder="Email" required>

            <!-- Profile Photo Upload -->
            <div class="photo-upload-section">
                <label for="profile-photo" class="photo-label">📸 Profile Photo (Optional)</label>
                <input type="file" id="profile-photo" accept="image/*" class="photo-input">
                <div id="photo-preview" class="photo-preview" style="display: none;">
                    <img id="preview-image" src="" alt="Profile preview">
                    <button type="button" id="remove-photo" class="remove-photo">✕ Remove</button>
                </div>
                <p class="photo-help">Choose a profile picture (JPG, PNG, GIF - Max 5MB)</p>
            </div>

            <!-- Bio Field -->
            <textarea id="bio" placeholder="Tell us about yourself (optional)" maxlength="500" rows="3"></textarea>
            <div class="password-container">
                <input type="password" id="password" placeholder="Password" required>
                <button type="button" class="password-toggle" aria-label="Show password">
                    <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </button>
            </div>
            <div class="password-container">
                <input type="password" id="confirm-password" placeholder="Confirm Password" required>
                <button type="button" class="password-toggle" aria-label="Show password">
                    <svg class="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </button>
            </div>
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="{{ route('login') }}">Login</a></p>
        <button id="theme-toggle">Toggle Theme</button>
    </div>

    <!-- Supabase UMD Bundle -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <script src="{{ asset('js/signup.js') }}"></script>
</body>
</html>