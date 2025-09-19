<?php

use Illuminate\Support\Facades\Route;

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

// Admin routes
Route::prefix('admin')->group(function () {
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
