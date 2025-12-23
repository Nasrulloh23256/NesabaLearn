<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeetingAssignmentReviewController extends Controller
{
    public function show(Meeting $meeting, MeetingAssignment $assignment): Response
    {
        if ($assignment->meeting_id !== $meeting->id) {
            abort(404);
        }

        return Inertia::render('Admin/MeetingAssignmentReview', [
            'meeting' => $meeting,
            'assignment' => $assignment->load(['user', 'reviewer']),
        ]);
    }

    public function update(Request $request, Meeting $meeting, MeetingAssignment $assignment): RedirectResponse
    {
        if ($assignment->meeting_id !== $meeting->id) {
            abort(404);
        }

        $validated = $request->validate([
            'rubric' => ['required', 'array', 'min:1'],
            'rubric.*.label' => ['required', 'string', 'max:100'],
            'rubric.*.score' => ['required', 'numeric', 'min:0'],
            'rubric.*.max' => ['nullable', 'numeric', 'min:0'],
            'mentor_feedback' => ['nullable', 'string', 'max:2000'],
        ]);

        $totalScore = collect($validated['rubric'])
            ->sum(fn ($item) => (float) ($item['score'] ?? 0));

        $assignment->update([
            'rubric' => $validated['rubric'],
            'mentor_feedback' => $validated['mentor_feedback'] ?? null,
            'score' => $totalScore,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()
            ->route('admin.meetings.show', $meeting)
            ->with('success', 'Penilaian tugas berhasil disimpan.');
    }
}
