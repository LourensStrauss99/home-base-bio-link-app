<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\BioLinkController;
use App\Http\Controllers\SocialAuthController;

Route::get('/', function () {
    return view('index');
})->name('home');

Route::get('/login', function () {
    return view('login');
})->name('login');

Route::get('/signup', function () {
    return view('signup');
})->name('signup');

Route::get('/profile/{username?}', function ($username = null) {
    return view('profile', compact('username'));
})->name('profile');

// Authentication routes
Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
Route::get('/check-auth', [AuthController::class, 'checkAuth'])->middleware('web')->name('auth.check');

// OAuth Social Authentication routes
Route::prefix('auth')->group(function () {
    Route::get('/{provider}', [SocialAuthController::class, 'redirect'])->name('social.redirect');
    Route::get('/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');
});

// OAuth Link Creation routes
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::post('/oauth/confirm-link', [SocialAuthController::class, 'confirmLink'])->name('oauth.confirm_link');
    Route::post('/oauth/reject-link', [SocialAuthController::class, 'rejectLink'])->name('oauth.reject_link');
});

// API routes for bio links
Route::prefix('api')->group(function () {
    Route::get('/user/{username}', [BioLinkController::class, 'getUserByUsername']);
    Route::get('/user/{userId}/links', [BioLinkController::class, 'getUserLinks']);
    Route::post('/user/{userId}/links', [BioLinkController::class, 'createLink']);
    Route::delete('/link/{linkId}', [BioLinkController::class, 'deleteLink']);
    Route::post('/link/{linkId}/click', [BioLinkController::class, 'incrementLinkClick']);
});

// Admin routes
Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');

    Route::get('/analytics', function () {
        return view('admin.analytics');
    })->name('admin.analytics');

    Route::get('/activity', function () {
        return view('admin.activity');
    })->name('admin.activity');

    Route::get('/customize', function () {
        return view('admin.customize');
    })->name('admin.customize');

    Route::get('/billing', function () {
        return view('admin.billing');
    })->name('admin.billing');

    Route::get('/subscription', function () {
        return view('admin.subscription');
    })->name('admin.subscription');
});
