<?php

use App\Services\NotificationService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('notifications:send', function () {
    app(NotificationService::class)->sendDueNotifications();
})->purpose('Send due meeting/task/quiz notifications');

Schedule::call(function () {
    app(NotificationService::class)->sendDueNotifications();
})->name('send-due-notifications')->everyTenMinutes()->withoutOverlapping();
