<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard</title>
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons.min.js"></script>

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="{{ asset('assets/icons/AppImages/ios/180.png') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Dashboard">

    <!-- Standard Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('assets/icons/AppImages/ios/32.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('assets/icons/AppImages/ios/16.png') }}">

    <!-- Theme Color for Mobile Browsers -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
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

        /* Social Links Section Styles */
        .social-link-section {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .social-dropdown-container {
            margin-bottom: 15px;
        }

        .social-dropdown-container label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: inherit;
        }

        .social-platform-dropdown {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: inherit;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .social-platform-dropdown:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
        }

        .social-platform-dropdown option {
            background: #2a5298;
            color: white;
            padding: 10px;
        }

        .url-input-container {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        .url-input-container input {
            flex: 1;
            min-width: 250px;
            padding: 12px 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            color: inherit;
            font-size: 14px;
        }

        .url-input-container input:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
        }

        .add-btn, .cancel-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .add-btn {
            background: #4CAF50;
            color: white;
        }

        .add-btn:hover {
            background: #45a049;
            transform: translateY(-2px);
        }

        .cancel-btn {
            background: #f44336;
            color: white;
        }

        .cancel-btn:hover {
            background: #da190b;
            transform: translateY(-2px);
        }
        
        .input-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .quick-signin-btn {
            background: #2196F3;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 120px;
        }

        .quick-signin-btn:hover {
            background: #1976D2;
            transform: translateY(-2px);
        }

        .no-links-message {
            font-style: italic;
        }

        @media (max-width: 480px) {
            .url-input-container {
                flex-direction: column;
            }
            
            .url-input-container input {
                min-width: 100%;
            }
            
            .input-actions {
                flex-direction: column;
            }
            
            .add-btn, .cancel-btn, .quick-signin-btn {
                width: 100%;
            }
        }
    </style>
</head>
<body class="light-theme">
    <div class="container">
        <!-- Profile Section -->
        <div class="admin-profile-section" id="admin-profile-section">
            <div id="profile-photo-container" style="display: none;">
                <img id="admin-profile-photo" src="" alt="Your Profile Photo" class="admin-profile-photo">
            </div>
            <h2 id="admin-username">Loading...</h2>
            <div class="bio-section" style="margin: 15px 0;">
                <label for="user-bio" style="display: block; margin-bottom: 5px; font-weight: bold;">📝 Bio:</label>
                <textarea id="user-bio" placeholder="Tell people about yourself..." style="width: 100%; max-width: 400px; height: 80px; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: inherit; resize: vertical;" maxlength="500"></textarea>
                <button id="save-bio-btn" class="save-bio-btn" style="margin-top: 10px;">💾 Save Bio</button>
                <small style="display: block; margin-top: 5px; opacity: 0.7;">Max 500 characters</small>
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
            <a href="{{ route('profile', ['username' => auth()->user()->username]) }}" class="public-link">🌐 View Public Profile</a> |
            <a href="{{ route('home') }}">🏠 Home</a>
        </nav>

        <!-- Profile Link Section -->
        <div class="homebase-link-section">
            <h2>🔗 Your Profile Link</h2>
            <div class="link-display">
                <input type="text" id="homebase-url" readonly value="Loading...">
                <button id="copy-link-btn" class="copy-btn">📋 Copy</button>
            </div>
            <p class="link-description">Share this link with others to showcase all your social media profiles in one place!</p>
        </div>

        <h2>Add Social Links</h2>
        
        {{-- Display success/error messages from OAuth flow --}}
        @if(session('success'))
            <div class="alert alert-success" style="background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                ✅ {{ session('success') }}
            </div>
        @endif
        
        @if(session('error'))
            <div class="alert alert-error" style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                ❌ {{ session('error') }}
            </div>
        @endif
        
        @if(session('info'))
            <div class="alert alert-info" style="background: #d1ecf1; color: #0c5460; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                ℹ️ {{ session('info') }}
            </div>
        @endif

        {{-- OAuth Link Confirmation Dialog --}}
        @if(session('pending_oauth_link') && session('pending_link'))
            @php $pendingLink = session('pending_link'); @endphp
            <div id="oauth-confirmation-dialog" class="oauth-dialog" style="background: #e3f2fd; border: 2px solid #2196F3; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #1976D2;">🔗 Confirm Your {{ $pendingLink['platform_name'] }} Link</h3>
                <div class="oauth-link-preview" style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <div class="link-info" style="display: flex; align-items: center; gap: 10px;">
                        <span class="platform-icon" style="font-size: 24px;">
                            @if($pendingLink['platform'] === 'github') 💻
                            @elseif($pendingLink['platform'] === 'twitter') 🐦
                            @elseif($pendingLink['platform'] === 'google') 📧
                            @elseif($pendingLink['platform'] === 'facebook') 📘
                            @elseif($pendingLink['platform'] === 'linkedin') 💼
                            @elseif($pendingLink['platform'] === 'instagram') 📷
                            @else 🔗
                            @endif
                        </span>
                        <div>
                            <strong>{{ $pendingLink['display_name'] ?? $pendingLink['username'] }}</strong><br>
                            <small style="color: #666;">{{ $pendingLink['profile_url'] }}</small>
                        </div>
                    </div>
                </div>
                <p style="margin-bottom: 15px; color: #424242;">
                    We've successfully connected to your {{ $pendingLink['platform_name'] }} account. 
                    Would you like to add this link to your profile?
                </p>
                <div class="oauth-actions" style="display: flex; gap: 10px;">
                    <form method="POST" action="{{ route('oauth.confirm_link') }}" style="display: inline;">
                        @csrf
                        <button type="submit" class="oauth-confirm-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                            ✅ Add to Profile
                        </button>
                    </form>
                    <form method="POST" action="{{ route('oauth.reject_link') }}" style="display: inline;">
                        @csrf
                        <button type="submit" class="oauth-reject-btn" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            ❌ Cancel
                        </button>
                    </form>
                </div>
            </div>
        @endif
        
        @if(session('error'))
            <div class="alert alert-error" style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                ❌ {{ session('error') }}
            </div>
        @endif
        
        <div id="add-link-section" class="social-link-section">
            <div class="oauth-info" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
                <p style="margin: 0; font-size: 14px; color: #1565c0;">
                    <strong>🔐 OAuth Connect:</strong> Automatically connect and verify your accounts with one click<br>
                    <strong>✏️ Manual Entry:</strong> Enter your profile URLs manually
                </p>
            </div>
            <div class="social-dropdown-container">
                <label for="social-platform-select">🌐 Choose Platform:</label>
                <select id="social-platform-select" class="social-platform-dropdown">
                    <option value="">Select a platform...</option>
                    <optgroup label="🔐 OAuth Connect (Auto-sign in) - Coming Soon">
                        <!-- OAuth platforms temporarily disabled until real credentials are configured -->
                        <!-- <option value="google" data-icon="�" data-color="#4285F4" data-oauth="true">Google</option> -->
                        <!-- <option value="github" data-icon="💻" data-color="#333333" data-oauth="true">GitHub</option> -->
                        <!-- <option value="twitter" data-icon="🐦" data-color="#1DA1F2" data-oauth="true">Twitter/X</option> -->
                        <!-- <option value="facebook" data-icon="📘" data-color="#4267B2" data-oauth="true">Facebook</option> -->
                        <!-- <option value="linkedin" data-icon="💼" data-color="#0077B5" data-oauth="true">LinkedIn</option> -->
                        <!-- <option value="instagram" data-icon="�" data-color="#E4405F" data-oauth="true">Instagram</option> -->
                    </optgroup>
                    <optgroup label="✏️ Manual Entry">
                        <option value="google" data-icon="📧" data-color="#4285F4" data-placeholder="https://plus.google.com/+yourusername">Google</option>
                        <option value="github" data-icon="💻" data-color="#333333" data-placeholder="https://github.com/yourusername">GitHub</option>
                        <option value="twitter" data-icon="🐦" data-color="#1DA1F2" data-placeholder="https://twitter.com/yourusername">Twitter/X</option>
                        <option value="facebook" data-icon="📘" data-color="#4267B2" data-placeholder="https://facebook.com/yourusername">Facebook</option>
                        <option value="linkedin" data-icon="💼" data-color="#0077B5" data-placeholder="https://linkedin.com/in/yourusername">LinkedIn</option>
                        <option value="instagram" data-icon="📷" data-color="#E4405F" data-placeholder="https://instagram.com/yourusername">Instagram</option>
                        <option value="youtube" data-icon="📺" data-color="#FF0000" data-placeholder="https://youtube.com/@yourchannel">YouTube</option>
                        <option value="tiktok" data-icon="🎵" data-color="#000000" data-placeholder="https://tiktok.com/@yourusername">TikTok</option>
                        <option value="discord" data-icon="🎮" data-color="#5865F2" data-placeholder="https://discord.gg/yourserver">Discord</option>
                        <option value="twitch" data-icon="🎮" data-color="#9146FF" data-placeholder="https://twitch.tv/yourusername">Twitch</option>
                        <option value="spotify" data-icon="🎧" data-color="#1DB954" data-placeholder="https://open.spotify.com/user/yourusername">Spotify</option>
                        <option value="pinterest" data-icon="📌" data-color="#BD081C" data-placeholder="https://pinterest.com/yourusername">Pinterest</option>
                        <option value="reddit" data-icon="🔴" data-color="#FF4500" data-placeholder="https://reddit.com/user/yourusername">Reddit</option>
                        <option value="snapchat" data-icon="👻" data-color="#FFFC00" data-placeholder="https://snapchat.com/add/yourusername">Snapchat</option>
                        <option value="telegram" data-icon="✈️" data-color="#0088CC" data-placeholder="https://t.me/yourusername">Telegram</option>
                        <option value="whatsapp" data-icon="💬" data-color="#25D366" data-placeholder="https://wa.me/yourphonenumber">WhatsApp</option>
                        <option value="website" data-icon="🌐" data-color="#666666" data-placeholder="https://yourwebsite.com">Website</option>
                        <option value="email" data-icon="📧" data-color="#EA4335" data-placeholder="mailto:your@email.com">Email</option>
                        <option value="phone" data-icon="📞" data-color="#4285F4" data-placeholder="tel:+1234567890">Phone</option>
                    </optgroup>
                </select>
            </div>
            
            <div class="url-input-container" style="display: none;">
                <input type="url" id="link-url" placeholder="Enter your profile URL...">
                <div class="input-actions">
                    <button id="quick-signin-btn" class="quick-signin-btn" style="display: none;">🚀 Quick Sign-in</button>
                    <button id="add-link-btn" class="add-btn">➕ Add Link</button>
                    <button id="cancel-link-btn" class="cancel-btn">❌ Cancel</button>
                </div>
            </div>
        </div>
        
        <div class="links" id="admin-links">
            <!-- Links will be loaded here -->
            <p class="no-links-message" style="text-align: center; opacity: 0.7; margin: 20px 0;">No links added yet. Choose a platform above to get started!</p>
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

    <!-- Admin Navigation -->
    <script src="{{ asset('js/admin-nav.js') }}"></script>
    <!-- Admin Dashboard Script -->
    <script src="{{ asset('js/admin.js') }}?v={{ time() }}"></script>
</body>
</html>