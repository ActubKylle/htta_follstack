<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\LearnerRegistrationController;
use App\Http\Controllers\Staff\EnrollmentController;
use App\Http\Controllers\Staff\ProgramController;
use App\Http\Controllers\Staff\ScholarshipController;
use App\Http\Controllers\StudentScholarshipController;
use App\Http\Controllers\Staff\DashboardController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//#################################################################
// 1. PUBLIC ROUTES (Accessible to everyone)
//#################################################################

Route::get('/', [PublicPageController::class, 'home'])->name('public.home');
Route::get('/about', [PublicPageController::class, 'about'])->name('public.about');
Route::get('/programs', [PublicPageController::class, 'programs'])->name('public.programs');
Route::get('/contact', [PublicPageController::class, 'contact'])->name('public.contact');
Route::get('/enrollnow', [PublicPageController::class, 'enrollNow'])->name('public.enrollnow');
Route::post('/register/learner', [LearnerRegistrationController::class, 'store'])->name('register.learner');


//#################################################################
// 2. AUTHENTICATED ROUTES (For logged-in users)
//#################################################################

Route::middleware(['auth', 'verified'])->group(function () {

    // --- General Dashboard Redirect ---
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->role === 'staff') {
            return redirect()->route('staff.dashboard');
        }
        // if ($user->role === 'learner') {
        //     // Redirect students to their scholarship page
        //     return redirect()->route('student.scholarships.index');
        // }
        // Default fallback for any other roles
        return Inertia::render('Dashboard');
    })->name('dashboard');


    

    // --- STUDENT-ONLY ROUTES ---
    // Protected by the 'student' middleware
  Route::middleware(['learner'])->group(function () {
    // This route shows the list of all scholarships
    Route::get('/scholarships', [StudentScholarshipController::class, 'index'])
         ->name('student.scholarships.index');

    // FIX: This new GET route will SHOW the application form page
    Route::get('/scholarships/{scholarship}/apply', [StudentScholarshipController::class, 'showApplicationForm'])
         ->name('student.scholarships.apply');

    // FIX: This POST route will SUBMIT the application form data
    Route::post('/scholarships/{scholarship}/store', [StudentScholarshipController::class, 'storeApplication'])
         ->name('student.scholarships.store');
});




});

// Route::middleware(['auth', 'verified', 'learner'])->prefix('learner')->name('learner.')->group(function () {
//     Route::get('/scholarships', [StudentScholarshipController::class, 'index'])
//          ->name('student.scholarships.index');

//     // FIX: This new GET route will SHOW the application form page
//     Route::get('/scholarships/{scholarship}/apply', [StudentScholarshipController::class, 'showApplicationForm'])
//          ->name('student.scholarships.apply');

//     // FIX: This POST route will SUBMIT the application form data
//     Route::post('/scholarships/{scholarship}/store', [StudentScholarshipController::class, 'storeApplication'])
//          ->name('student.scholarships.store');
// });


//#################################################################
// 3. STAFF-ONLY ROUTES (Protected by the 'staff' middleware)
//#################################################################

Route::middleware(['auth', 'verified', 'staff'])->prefix('staff')->name('staff.')->group(function () {

    // --- Staff Dashboard ---
    // Route::get('/dashboard', function () {d
    //     return Inertia::render('Staff/dashboard');
    // })->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    // --- Enrollment Management ---
    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments');
    Route::get('/enrollments/{learner}', [EnrollmentController::class, 'show'])->name('enrollment.show');
    Route::post('/enrollments/{learner}/accept', [EnrollmentController::class, 'accept'])->name('enrollment.accept');
    Route::post('/enrollments/{learner}/reject', [EnrollmentController::class, 'reject'])->name('enrollment.reject');

    // --- Student List ---
    Route::get('/students', [EnrollmentController::class, 'studentList'])->name('students.index');
    Route::post('/students/import', [ProgramController::class, 'handleImport'])->name('students.import');

    // --- Program Management ---
    Route::prefix('programs')->name('programs.')->group(function () {
        Route::get('/', [ProgramController::class, 'manageIndex'])->name('manage_index');
        Route::get('/create', [ProgramController::class, 'create'])->name('create');
        Route::post('/', [ProgramController::class, 'store'])->name('store');
        Route::get('/{program}/edit', [ProgramController::class, 'edit'])->name('edit');
        Route::put('/{program}', [ProgramController::class, 'update'])->name('update');
        Route::post('/{program}/toggle-status', [ProgramController::class, 'toggleStatus'])->name('toggle_status');
    });

    // --- Scholarship Management ---
    Route::resource('scholarships', ScholarshipController::class);
    Route::post('/scholarships/{scholarship}/applicants/{learner}', [ScholarshipController::class, 'updateApplicationStatus'])
         ->name('scholarships.applicants.update_status');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
