<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use App\Models\UserLink;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SocialAuthController extends Controller
{
    /**
     * Supported OAuth providers and their configurations
     */
    private $supportedProviders = [
        'google' => [
            'name' => '📧 Google',
            'scopes' => [],
            'profile_url_template' => 'https://plus.google.com/+{username}' // Note: Google+ is deprecated
        ],
        'github' => [
            'name' => '🐙 GitHub',
            'scopes' => ['user:email'],
            'profile_url_template' => 'https://github.com/{username}'
        ],
        'twitter' => [
            'name' => '🐦 Twitter',
            'scopes' => ['tweet.read', 'users.read'],
            'profile_url_template' => 'https://twitter.com/{username}'
        ],
        'facebook' => [
            'name' => '📘 Facebook',
            'scopes' => ['email', 'public_profile'],
            'profile_url_template' => 'https://facebook.com/{username}'
        ],
        'linkedin' => [
            'name' => '💼 LinkedIn',
            'scopes' => ['r_liteprofile', 'r_emailaddress'],
            'profile_url_template' => 'https://linkedin.com/in/{username}'
        ],
        'instagram' => [
            'name' => '📷 Instagram',
            'scopes' => ['user_profile'],
            'profile_url_template' => 'https://instagram.com/{username}'
        ]
    ];

    /**
     * Redirect the user to the OAuth provider
     */
    public function redirect(Request $request, $provider)
    {
        try {
            // Validate provider
            if (!array_key_exists($provider, $this->supportedProviders)) {
                return redirect('/admin')->with('error', 'Unsupported social platform: ' . $provider);
            }

            // Store the current user ID in session so we can link the account after OAuth
            if (Auth::check()) {
                $request->session()->put('oauth_user_id', Auth::id());
            }

            // Check if this is for link creation (from query parameter)
            $isLinkCreation = $request->query('action') === 'add_link';
            if ($isLinkCreation) {
                $request->session()->put('oauth_link_creation', true);
                $request->session()->put('oauth_platform', $provider);
            }

            // Configure scopes if needed
            $socialiteDriver = Socialite::driver($provider);
            
            // Note: Not all drivers support scopes() method consistently
            // Individual platform implementations may vary

            return $socialiteDriver->redirect();

        } catch (\Exception $e) {
            Log::error('OAuth redirect error: ' . $e->getMessage());
            return redirect('/admin')->with('error', 'Failed to connect to ' . $provider . '. Please try again.');
        }
    }

    /**
     * Handle the OAuth callback
     */
    public function callback(Request $request, $provider)
    {
        try {
            // Validate provider
            if (!array_key_exists($provider, $this->supportedProviders)) {
                return redirect('/admin')->with('error', 'Unsupported social platform: ' . $provider);
            }

            // Get user from OAuth provider
            $socialUser = Socialite::driver($provider)->user();

            // Check if this is for link creation
            $isLinkCreation = $request->session()->get('oauth_link_creation', false);

            if ($isLinkCreation) {
                return $this->handleLinkCreation($request, $provider, $socialUser);
            } else {
                return $this->handleAuthentication($request, $provider, $socialUser);
            }

        } catch (\Exception $e) {
            Log::error('OAuth callback error: ' . $e->getMessage());
            return redirect('/admin')->with('error', 'Failed to connect your ' . $provider . ' account. Please try again.');
        }
    }

    /**
     * Handle OAuth callback for link creation
     */
    private function handleLinkCreation(Request $request, $provider, $socialUser)
    {
        // Get the current user ID from session
        $userId = $request->session()->get('oauth_user_id');
        
        if (!$userId) {
            return redirect('/admin/dashboard')->with('error', 'Session expired. Please try connecting your account again.');
        }

        // Verify user exists
        $user = User::find($userId);
        if (!$user) {
            return redirect('/admin/dashboard')->with('error', 'User not found. Please log in and try again.');
        }

        // Extract profile information
        $profileData = $this->extractProfileData($provider, $socialUser);

        // Check if link already exists for this user and platform
        $existingLink = UserLink::where('user_id', $userId)
            ->where('url', $profileData['profile_url'])
            ->first();

        if ($existingLink) {
            // Clear session
            $this->clearOAuthSession($request);
            return redirect('/admin/dashboard')->with('error', 'You already have this ' . $this->supportedProviders[$provider]['name'] . ' link added to your profile.');
        }

        // Store the link data in session for confirmation
        $request->session()->put('pending_link', [
            'platform' => $provider,
            'platform_name' => $this->supportedProviders[$provider]['name'],
            'profile_url' => $profileData['profile_url'],
            'username' => $profileData['username'],
            'display_name' => $profileData['display_name'] ?? $profileData['username'],
            'icon' => $provider
        ]);

        // Clear OAuth session data but keep pending_link
        $request->session()->forget(['oauth_user_id', 'oauth_link_creation', 'oauth_platform']);

        // Redirect to confirmation page
        return redirect('/admin/dashboard')->with('pending_oauth_link', true);
    }

    /**
     * Handle OAuth callback for authentication (original functionality)
     */
    private function handleAuthentication(Request $request, $provider, $socialUser)
    {
        // Get the current user ID from session
        $userId = $request->session()->get('oauth_user_id');
        
        if (!$userId) {
            return redirect('/admin')->with('error', 'Session expired. Please try connecting your account again.');
        }

        // Verify user exists
        $user = User::find($userId);
        if (!$user) {
            return redirect('/admin')->with('error', 'User not found. Please log in and try again.');
        }

        // Extract profile information
        $profileData = $this->extractProfileData($provider, $socialUser);

        // Create the user link
        $link = UserLink::create([
            'user_id' => $userId,
            'name' => $this->supportedProviders[$provider]['name'],
            'url' => $profileData['profile_url'],
            'icon' => $provider,
            'click_count' => 0
        ]);

        // Clear session
        $this->clearOAuthSession($request);

        return redirect('/admin')->with('success', 'Successfully connected your ' . $this->supportedProviders[$provider]['name'] . ' account!');
    }

    /**
     * Clear OAuth session data
     */
    private function clearOAuthSession(Request $request)
    {
        $request->session()->forget([
            'oauth_user_id', 
            'oauth_link_creation', 
            'oauth_platform'
        ]);
    }

    /**
     * Extract profile data from OAuth response
     */
    private function extractProfileData($provider, $socialUser)
    {
        $profileUrl = '';
        $username = '';

        switch ($provider) {
            case 'github':
                $username = $socialUser->nickname ?? $socialUser->name;
                $profileUrl = 'https://github.com/' . $username;
                break;

            case 'twitter':
                $username = $socialUser->nickname ?? $socialUser->name;
                $profileUrl = 'https://twitter.com/' . $username;
                break;

            case 'facebook':
                // Facebook doesn't provide username in the same way
                $profileUrl = 'https://facebook.com/' . $socialUser->id;
                break;

            case 'linkedin':
                // LinkedIn profile URLs are typically in this format
                $profileUrl = $socialUser->profileUrl ?? 'https://linkedin.com/in/' . ($socialUser->nickname ?? 'profile');
                break;

            case 'instagram':
                $username = $socialUser->nickname ?? $socialUser->name;
                $profileUrl = 'https://instagram.com/' . $username;
                break;

            case 'google':
                // Google+ is deprecated, so we'll use email as identifier
                $profileUrl = 'mailto:' . $socialUser->email;
                break;

            default:
                $profileUrl = $socialUser->profileUrl ?? '#';
                break;
        }

        return [
            'profile_url' => $profileUrl,
            'username' => $username ?: ($socialUser->nickname ?? $socialUser->name),
            'display_name' => $socialUser->name,
            'email' => $socialUser->email,
            'avatar' => $socialUser->avatar ?? null
        ];
    }

    /**
     * Get available OAuth providers
     */
    public function getProviders()
    {
        return response()->json($this->supportedProviders);
    }

    /**
     * Confirm and save the OAuth link
     */
    public function confirmLink(Request $request)
    {
        try {
            $pendingLink = $request->session()->get('pending_link');
            
            if (!$pendingLink) {
                return redirect('/admin/dashboard')->with('error', 'No pending link found. Please try again.');
            }

            // Create the user link
            $link = UserLink::create([
                'user_id' => Auth::id(),
                'name' => $pendingLink['platform_name'],
                'url' => $pendingLink['profile_url'],
                'icon' => $pendingLink['icon'],
                'click_count' => 0
            ]);

            // Clear the pending link from session
            $request->session()->forget('pending_link');

            return redirect('/admin/dashboard')->with('success', 'Successfully added your ' . $pendingLink['platform_name'] . ' link!');

        } catch (\Exception $e) {
            Log::error('OAuth link confirmation error: ' . $e->getMessage());
            return redirect('/admin/dashboard')->with('error', 'Failed to add your link. Please try again.');
        }
    }

    /**
     * Reject the OAuth link
     */
    public function rejectLink(Request $request)
    {
        // Clear the pending link from session
        $request->session()->forget('pending_link');
        
        return redirect('/admin/dashboard')->with('info', 'Link creation cancelled.');
    }
}
