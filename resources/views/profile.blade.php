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
        <!-- User Profile Section - Centered at Top -->
        <div class="user-profile-section" id="user-profile-section" style="text-align: center; margin-bottom: 30px;">
            <!-- Profile Photo -->
            <div class="profile-photo-container" id="profile-photo-container" style="display: none; margin-bottom: 20px;">
                <img id="profile-photo" src="" alt="Profile Photo" class="profile-photo" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid rgba(255,255,255,0.3);">
            </div>
            
            <!-- Username -->
            <h1 id="profile-username" class="profile-username" style="margin: 20px 0 10px 0; font-size: 2em; font-weight: bold;">Loading...</h1>
            
            <!-- Bio -->
            <div class="profile-bio-container" id="profile-bio-container" style="display: none; margin-bottom: 20px;">
                <p id="profile-bio" class="profile-bio" style="font-size: 1.1em; opacity: 0.8; max-width: 400px; margin: 0 auto; line-height: 1.4;"></p>
            </div>
        </div>
        
        <p id="welcome-text" style="text-align: center; margin: 20px 0;">Click the links below to visit my profiles.</p>

        <div id="add-link-section" style="display: none; margin: 20px 0;">
            <input type="text" id="link-name" placeholder="Link Name (e.g., Instagram)">
            <input type="url" id="link-url" placeholder="URL (e.g., https://instagram.com/username)">
            <button id="add-link-btn">Add Link</button>
        </div>
        <div class="links">
        </div>
        
        <!-- CTA Footer -->
        <footer style="text-align: center; margin-top: 40px; padding: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
            <div class="cta-banner">
                <p style="margin: 0; opacity: 0.8;">💡 Want your own HomeBase? <a href="{{ route('signup') }}" class="cta-link" style="color: #4CAF50; font-weight: bold; text-decoration: none;">Create yours free!</a></p>
            </div>
        </footer>
    </div>
    <!-- Profile Page Script -->
    <script>
        // Pass username from Laravel to JavaScript
        window.profileUsername = @json($username ?? '');
        window.isProfilePage = true;
    </script>
    <script src="{{ asset('js/script.js') }}?v={{ time() }}"></script>
</body>
</html>