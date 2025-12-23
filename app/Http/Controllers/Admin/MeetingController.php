<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index(Request $request): Response
    {
        $meetings = Meeting::query()
            ->latest('meeting_date')
            ->withCount('attendances')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Meetings', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/MeetingCreate');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:Editorial,Artikel'],
            'description' => ['nullable', 'string'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'meeting_url' => ['nullable', 'url'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png'],
        ]);

        $validated['created_by'] = $request->user()->id;

        $meeting = Meeting::create($validated);

        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('meeting-attachments', 'public');
                $meeting->attachments()->create([
                    'title' => $file->getClientOriginalName(),
                    'type' => $file->getClientMimeType() ?: 'file',
                    'path' => $path,
                ]);
            }
        }

        app(NotificationService::class)->sendMeetingCreated($meeting);

        return redirect()->route('admin.meetings.index')->with('success', 'Meeting created.');
    }

    public function show(Meeting $meeting): Response
    {
        return Inertia::render('Admin/MeetingDetail', [
            'meeting' => $meeting->load([
                'materials',
                'attachments',
                'task',
                'assignments' => function ($query) {
                    $query->with(['user', 'reviewer'])->latest('submitted_at');
                },
                'attendances.user',
                'quizzes.questions.options',
                'quizzes.attempts' => function ($query) {
                    $query->latest('submitted_at')->with('user');
                },
            ]),
        ]);
    }

    public function edit(Meeting $meeting): Response
    {
        return Inertia::render('Admin/MeetingEdit', [
            'meeting' => $meeting,
        ]);
    }

    public function update(Request $request, Meeting $meeting): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:Editorial,Artikel'],
            'description' => ['nullable', 'string'],
            'meeting_date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'meeting_url' => ['nullable', 'url'],
        ]);

        $meeting->update($validated);

        return redirect()->route('admin.meetings.show', $meeting)->with('success', 'Meeting updated.');
    }

    public function destroy(Meeting $meeting): RedirectResponse
    {
        $meeting->delete();

        return redirect()->route('admin.meetings.index')->with('success', 'Meeting deleted.');
    }

    public function cancel(Meeting $meeting): RedirectResponse
    {
        if ($meeting->is_cancelled) {
            return back()->withErrors([
                'cancel' => 'Pertemuan sudah dibatalkan.',
            ]);
        }

        $meeting->update([
            'is_cancelled' => true,
            'cancelled_at' => now(),
        ]);

        return redirect()->route('admin.meetings.index')->with('success', 'Pertemuan dibatalkan.');
    }
}
