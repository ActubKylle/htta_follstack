<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\LearnerRegistrationController;
use App\Http\Controllers\Admin\EnrollmentController; // Changed from DashboardController

// Public Home Page
Route::get('/', [PublicPageController::class, 'home'])->name('public.home');

// Public Pages
Route::get('/about', [PublicPageController::class, 'about'])->name('public.about');
Route::get('/programs', [PublicPageController::class, 'programs'])->name('public.programs');
Route::get('/contact', [PublicPageController::class, 'contact'])->name('public.contact');

Route::get('/enrollnow', [PublicPageController::class, 'enrollNow'])->name('public.enrollnow'); // Added new route

// Route for your Registration Form submission
Route::post('/register/learner', [LearnerRegistrationController::class, 'store'])->name('register.learner');


// Authenticated User Routes (from your starter kit)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard'); // This is your general user dashboard
    })->name('dashboard');
});

// ADMIN ROUTES - Protected by 'admin' middleware
Route::middleware(['auth', 'verified', 'admin'])->group(function () {

    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/dashboard'); // This is your general user dashboard
    })->name('admin.dashboard');


    Route::get('/admin/enrollments', [EnrollmentController::class, 'index'])->name('admin.enrollments'); // Changed route path and name
    // Add other admin-specific routes here (e.g., /admin/learners, /admin/programs)
        Route::get('/admin/enrollments/{learner}', [EnrollmentController::class, 'show'])->name('admin.enrollment.show');
         Route::post('/admin/enrollments/{learner}/accept', [EnrollmentController::class, 'accept'])->name('admin.enrollment.accept'); // New route
    Route::post('/admin/enrollments/{learner}/reject', [EnrollmentController::class, 'reject'])->name('admin.enrollment.reject'); // New route

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';