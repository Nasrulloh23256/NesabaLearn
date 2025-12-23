<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Meeting;
use App\Models\MeetingAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingController extends Controller
{
    public function index(): Response
    {
        $meetings = Meeting::query()
            ->orderBy('meeting_date')
            ->get();

        return Inertia::render('User/Meetings/Meetings', [
            'meetings' => $meetings,
        ]);
    }

    public function show(Meeting $meeting): Response
    {
        return Inertia::render('User/Meetings/MeetingDetail', [
            'meeting' => $meeting->load([
                'materials',
                'attachments',
                'task',
                'assignments' => function ($query) {
                    $query->where('user_id', request()->user()->id)
                        ->with(['user', 'reviewer'])
                        ->latest('submitted_at');
                },
                'attendances.user',
                'quizzes.questions.options',
                'quizzes.attempts' => function ($query) {
                    $query->where('user_id', request()->user()->id)
                        ->latest('submitted_at');
                },
            ]),
        ]);
    }

    public function storeAttendance(Request $request, Meeting $meeting): RedirectResponse
    {
        if ($meeting->meeting_date && $meeting->start_time) {
            $startAt = $meeting->meeting_date
                ->copy()
                ->setTimeFromTimeString($meeting->start_time);
            if (now()->lt($startAt)) {
                return back()->withErrors([
                    'attendance' => 'Absensi belum dibuka. Silakan hadir sesuai jadwal.',
                ]);
            }
        }

        Attendance::updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'user_id' => $request->user()->id,
            ],
            [
                'checked_in_at' => now(),
                'status' => 'present',
            ]
        );

        return back()->with('success', 'Kehadiran berhasil dicatat.');
    }

    public function submitAssignment(Request $request, Meeting $meeting): RedirectResponse
    {
        $task = $meeting->task;
        if (!$task) {
            return back()->withErrors([
                'assignment' => 'Tugas untuk pertemuan ini belum tersedia.',
            ]);
        }

        $now = now();
        if ($task->start_time && $now->lt($task->start_time)) {
            return back()->withErrors([
                'assignment' => 'Tugas belum dibuka.',
            ]);
        }
        if ($task->end_time && $now->gt($task->end_time)) {
            return back()->withErrors([
                'assignment' => 'Tugas sudah ditutup.',
            ]);
        }

        $validated = $request->validate([
            'description' => ['nullable', 'string'],
            'file' => ['required', 'file', 'max:20480'],
        ]);

        $path = $validated['file']->store('assignments', 'public');

        MeetingAssignment::create([
            'meeting_id' => $meeting->id,
            'user_id' => $request->user()->id,
            'original_name' => $validated['file']->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $validated['file']->getClientMimeType(),
            'file_size' => $validated['file']->getSize(),
            'description' => $validated['description'] ?? null,
            'submitted_at' => now(),
        ]);

        return back()->with('success', 'Tugas berhasil dikirim.');
    }
}
