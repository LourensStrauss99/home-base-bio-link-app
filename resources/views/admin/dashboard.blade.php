<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HomeBase Admin</title>
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

    <!-- Admin Navigation Styles -->
    <style>
        .admin-navigation {
            margin: 20px 0;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .admin-navigation h3 {
            margin: 0 0 15px 0;
            color: inherit;
            text-align: center;
        }

        .nav-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            max-width: 600px;
            margin: 0 auto;
        }

        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .nav-item:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .nav-item.active {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
        }

        .nav-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }

        .nav-item span {
            font-size: 12px;
            font-weight: 500;
            text-align: center;
        }

        .public-link {
            color: #4CAF50;
            font-weight: bold;
        }

        @media (max-width: 480px) {
            .nav-grid {
                grid-template-columns: repeat(2, 1fr);
            }

            .nav-item {
                padding: 12px 8px;
            }

            .nav-icon {
                font-size: 20px;
            }
        }
    </style>
</head>
<body class="light-theme">
    <div class="container">
        <h1>HomeBase Admin Dashboard</h1>

        <!-- Profile Section -->
        <div class="admin-profile-section" id="admin-profile-section">
            <div id="profile-photo-container" style="display: none;">
                <img id="admin-profile-photo" src="" alt="Your Profile Photo" class="admin-profile-photo">
            </div>
            <h2 id="admin-username">Loading...</h2>
            <div class="bio-section" style="margin: 15px 0;">
                <label for="user-bio" style="display: block; margin-bottom: 5px; font-weight: bold;">📝 Bio:</label>
                <textarea id="user-bio" placeholder="Tell people about yourself..." style="width: 100%; max-width: 400px; height: 80px; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: inherit; resize: vertical;" maxlength="200"></textarea>
                <button id="save-bio-btn" class="save-bio-btn" style="margin-top: 10px;">💾 Save Bio</button>
                <small style="display: block; margin-top: 5px; opacity: 0.7;">Max 200 characters</small>
            </div>
            <button id="change-photo-btn" class="change-photo-btn" style="display: none;">📸 Change Photo</button>
            <input type="file" id="new-profile-photo" accept="image/*" style="display: none;">
        </div>

        <div class="subscription-status" id="subscription-info">
            <!-- Subscription info will be loaded here -->
        </div>

        <!-- Admin Navigation -->
        <div class="admin-navigation">
            <h3>📊 Dashboard Navigation</h3>
            <div class="nav-grid">
                <a href="{{ route('admin.dashboard') }}" class="nav-item active">
                    <div class="nav-icon">🏠</div>
                    <span>Dashboard</span>
                </a>
                <a href="{{ route('admin.analytics') }}" class="nav-item">
                    <div class="nav-icon">📈</div>
                    <span>Analytics</span>
                </a>
                <a href="{{ route('admin.activity') }}" class="nav-item">
                    <div class="nav-icon">🔥</div>
                    <span>Activity</span>
                </a>
                <a href="{{ route('admin.customize') }}" class="nav-item">
                    <div class="nav-icon">🎨</div>
                    <span>Customize</span>
                </a>
                <a href="{{ route('admin.billing') }}" class="nav-item">
                    <div class="nav-icon">💳</div>
                    <span>Billing</span>
                </a>
                <a href="{{ route('admin.subscription') }}" class="nav-item">
                    <div class="nav-icon">⭐</div>
                    <span>Subscription</span>
                </a>
            </div>
        </div>

        <nav>
            <a href="{{ route('profile') }}" class="public-link">🌐 View Public Profile</a> |
            <a href="{{ route('home') }}">🏠 Home</a>
        </nav>

        <!-- HomeBase Link Section -->
        <div class="homebase-link-section">
            <h2>🔗 Your HomeBase Link</h2>
            <div class="link-display">
                <input type="text" id="homebase-url" readonly value="Loading...">
                <button id="copy-link-btn" class="copy-btn">📋 Copy</button>
            </div>
            <p class="link-description">Share this link with others to showcase all your social media profiles in one place!</p>
        </div>

        <h2>Manage Links</h2>
        <div id="add-link-section">
            <input type="url" id="link-url" placeholder="URL (e.g., https://instagram.com/username)">
            <button id="add-link-btn">Add Link</button>
        </div>
        <div class="links" id="admin-links">
            <!-- Links will be loaded here -->
        </div>

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

        <button id="logout-btn">Logout</button>
    </div>

    <!-- Supabase UMD Bundle -->
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
    <!-- Admin Navigation -->
    <script src="{{ asset('js/admin-nav.js') }}"></script>
    <!-- Admin Dashboard Script -->
    <script src="{{ asset('js/admin.js') }}"></script>
</body>
</html>