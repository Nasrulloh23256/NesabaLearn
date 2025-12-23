<?php

use App\Http\Controllers\AccountProfileController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\MeetingController as AdminMeetingController;
use App\Http\Controllers\Admin\MeetingAttachmentController as AdminMeetingAttachmentController;
use App\Http\Controllers\Admin\MeetingMaterialController as AdminMeetingMaterialController;
use App\Http\Controllers\Admin\MeetingQuizController as AdminMeetingQuizController;
use App\Http\Controllers\Admin\MeetingAssignmentReviewController as AdminMeetingAssignmentReviewController;
use App\Http\Controllers\Admin\MeetingTaskController as AdminMeetingTaskController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\User\MeetingController as UserMeetingController;
use App\Http\Controllers\User\QuizController as UserQuizController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('App', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = request()->user();

    if ($user && $user->role === 'Admin') {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('user.meetings.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:Admin'])->prefix('admin')->as('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('home');
    Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
    Route::get('meetings/new', [AdminMeetingController::class, 'create'])->name('meetings.new');
    Route::patch('meetings/{meeting}/cancel', [AdminMeetingController::class, 'cancel'])
        ->name('meetings.cancel');
    Route::resource('meetings', AdminMeetingController::class)->whereNumber('meeting');
    Route::get('meetings/{meeting}/materials/new', [AdminMeetingMaterialController::class, 'create'])
        ->name('meetings.materials.create');
    Route::post('meetings/{meeting}/materials', [AdminMeetingMaterialController::class, 'store'])
        ->name('meetings.materials.store');
    Route::delete('meetings/{meeting}/materials/{material}', [AdminMeetingMaterialController::class, 'destroy'])
        ->name('meetings.materials.destroy');
    Route::post('meetings/{meeting}/attachments', [AdminMeetingAttachmentController::class, 'store'])
        ->name('meetings.attachments.store');
    Route::delete('meetings/{meeting}/attachments/{attachment}', [AdminMeetingAttachmentController::class, 'destroy'])
        ->name('meetings.attachments.destroy');
    Route::get('meetings/{meeting}/assignments/new', [AdminMeetingTaskController::class, 'create'])
        ->name('meetings.assignments.create');
    Route::post('meetings/{meeting}/assignments', [AdminMeetingTaskController::class, 'store'])
        ->name('meetings.assignments.store');
    Route::delete('meetings/{meeting}/assignments', [AdminMeetingTaskController::class, 'destroy'])
        ->name('meetings.assignments.destroy');
    Route::get('meetings/{meeting}/assignments/{assignment}', [AdminMeetingAssignmentReviewController::class, 'show'])
        ->name('meetings.assignments.show');
    Route::put('meetings/{meeting}/assignments/{assignment}/review', [AdminMeetingAssignmentReviewController::class, 'update'])
        ->name('meetings.assignments.review');
    Route::get('meetings/{meeting}/quizzes/new', [AdminMeetingQuizController::class, 'create'])
        ->name('meetings.quizzes.create');
    Route::post('meetings/{meeting}/quizzes', [AdminMeetingQuizController::class, 'store'])
        ->name('meetings.quizzes.store');
    Route::delete('meetings/{meeting}/quizzes/{quiz}', [AdminMeetingQuizController::class, 'destroy'])
        ->name('meetings.quizzes.destroy');
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('users/new', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::post('users/{user}/impersonate', [AdminUserController::class, 'impersonate'])->name('users.impersonate');
    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::get('users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::get('profile', function () {
        return Inertia::render('Admin/Profile');
    })->name('profile');
    Route::post('profile', [AccountProfileController::class, 'update'])->name('profile.update');
    Route::get('change-password', function () {
        return Inertia::render('Admin/ChangePassword');
    })->name('password');
});

Route::middleware(['auth', 'verified', 'role:Pengguna'])->prefix('user')->as('user.')->group(function () {
    Route::get('meetings', [UserMeetingController::class, 'index'])->name('meetings.index');
    Route::get('meetings/{meeting}', [UserMeetingController::class, 'show'])->name('meetings.show');
    Route::post('meetings/{meeting}/attendance', [UserMeetingController::class, 'storeAttendance'])->name('meetings.attendance');
    Route::post('meetings/{meeting}/assignments', [UserMeetingController::class, 'submitAssignment'])->name('meetings.assignments');
    Route::get('meetings/{meeting}/quizzes/{quiz}', [UserQuizController::class, 'show'])->name('meetings.quizzes.show');
    Route::post('meetings/{meeting}/quizzes/{quiz}', [UserQuizController::class, 'submit'])->name('meetings.quizzes.submit');
    Route::get('profile', function () {
        return Inertia::render('User/Meetings/Profile');
    })->name('profile');
    Route::post('profile', [AccountProfileController::class, 'update'])->name('profile.update');
    Route::get('change-password', function () {
        return Inertia::render('User/Meetings/ChangePassword');
    })->name('password');
    Route::get('chatbot', [ChatbotController::class, 'index'])->name('chatbot');
    Route::post('chatbot/ask', [ChatbotController::class, 'ask'])->name('chatbot.ask');
    Route::post('chatbot/conversations', [ChatbotController::class, 'create'])->name('chatbot.create');
    Route::get('chatbot/conversations/{conversation}', [ChatbotController::class, 'show'])->name('chatbot.show');
    Route::put('chatbot/conversations/{conversation}', [ChatbotController::class, 'rename'])->name('chatbot.rename');
    Route::delete('chatbot/conversations/{conversation}', [ChatbotController::class, 'destroy'])->name('chatbot.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
