<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Meeting;
use App\Models\MeetingTask;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Response;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totalUsers = User::count();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $meetingsThisMonth = Meeting::query()
            ->whereBetween('meeting_date', [$startOfMonth, $endOfMonth])
            ->count();
        $attendanceThisMonth = Attendance::query()
            ->whereHas('meeting', function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereBetween('meeting_date', [$startOfMonth, $endOfMonth]);
            })
            ->count();
        $attendanceRate = 0;
        if ($meetingsThisMonth > 0 && $totalUsers > 0) {
            $attendanceRate = (int) round(($attendanceThisMonth / ($meetingsThisMonth * $totalUsers)) * 100);
        }
        $months = collect(range(0, 5))->map(function ($offset) {
            return Carbon::now()->startOfMonth()->subMonths(5 - $offset);
        });
        $growth = $months->map(function ($month) {
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();
            return [
                'month' => (int) $month->format('n'),
                'year' => (int) $month->format('Y'),
                'users' => User::query()->whereBetween('created_at', [$start, $end])->count(),
                'meetings' => Meeting::query()->whereBetween('meeting_date', [$start, $end])->count(),
            ];
        })->values();

        $alerts = collect();
        $nextMeeting = Meeting::query()
            ->whereDate('meeting_date', '>=', Carbon::today())
            ->orderBy('meeting_date')
            ->orderBy('start_time')
            ->first();

        if ($nextMeeting) {
            $startAt = Carbon::parse($nextMeeting->meeting_date);
            if ($nextMeeting->start_time) {
                $startAt = $startAt->copy()->setTimeFromTimeString($nextMeeting->start_time);
            }
            $alerts->push([
                'id' => 'meeting-'.$nextMeeting->id,
                'type' => 'meeting',
                'title' => $nextMeeting->title,
                'description_id' => 'Mulai '.$startAt->format('d M Y').' pukul '.$startAt->format('H:i').' WIB',
                'description_en' => 'Starts '.$startAt->format('d M Y').' at '.$startAt->format('H:i').' WIB',
                'created_at' => $startAt->toIso8601String(),
            ]);
        }

        $taskDeadline = MeetingTask::query()
            ->whereNotNull('end_time')
            ->where('end_time', '>=', Carbon::now())
            ->orderBy('end_time')
            ->with('meeting')
            ->first();

        if ($taskDeadline) {
            $deadline = Carbon::parse($taskDeadline->end_time);
            $alerts->push([
                'id' => 'task-'.$taskDeadline->id,
                'type' => 'reminder',
                'title' => $taskDeadline->meeting?->title ?? $taskDeadline->title,
                'description_id' =>
                    'Deadline tugas '.$taskDeadline->title.' '.$deadline->format('d M Y').' pukul '.$deadline->format('H:i').' WIB',
                'description_en' =>
                    'Task deadline '.$deadline->format('d M Y').' at '.$deadline->format('H:i').' WIB',
                'created_at' => $deadline->toIso8601String(),
            ]);
        }

        $newUsersCount = User::query()
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->count();

        if ($newUsersCount > 0) {
            $alerts->push([
                'id' => 'users-week',
                'type' => 'info',
                'title' => 'Pengguna baru',
                'description_id' => $newUsersCount.' pengguna baru bergabung minggu ini.',
                'description_en' => $newUsersCount.' new users joined this week.',
                'created_at' => Carbon::now()->toIso8601String(),
            ]);
        }

        if ($alerts->isEmpty()) {
            $alerts->push([
                'id' => 'empty',
                'type' => 'info',
                'title' => 'Belum ada pemberitahuan',
                'description_id' => 'Belum ada pemberitahuan terbaru saat ini.',
                'description_en' => 'No new notifications at the moment.',
                'created_at' => Carbon::now()->toIso8601String(),
            ]);
        }

        $alerts = $alerts->sortByDesc('created_at')->values()->take(3);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => $totalUsers,
                'meetingsThisMonth' => $meetingsThisMonth,
                'attendanceRate' => $attendanceRate,
            ],
            'growth' => $growth,
            'alerts' => $alerts,
        ]);
    }
}
