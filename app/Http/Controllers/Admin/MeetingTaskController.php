<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingTask;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MeetingTaskController extends Controller
{
    public function create(Meeting $meeting): Response
    {
        $task = $meeting->task;

        return Inertia::render('Admin/MeetingAssignmentCreate', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
            ],
            'task' => $task,
        ]);
    }

    public function store(Request $request, Meeting $meeting): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['content', 'file'])],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:51200'],
            'start_time' => ['nullable', 'date'],
            'end_time' => ['nullable', 'date', 'after_or_equal:start_time'],
        ]);

        if ($data['type'] === 'content' && empty($data['content'])) {
            return back()->withErrors(['content' => 'Konten tugas wajib diisi.'])->withInput();
        }

        if ($data['type'] === 'file' && !$request->hasFile('file') && !($meeting->task && $meeting->task->file_path)) {
            return back()->withErrors(['file' => 'File tugas wajib diunggah.'])->withInput();
        }

        $payload = [
            'meeting_id' => $meeting->id,
            'title' => $data['title'],
            'type' => $data['type'],
            'content' => $data['type'] === 'content' ? $data['content'] : null,
            'file_path' => null,
            'file_name' => null,
            'file_mime' => null,
            'file_size' => null,
            'start_time' => $data['start_time'] ?? null,
            'end_time' => $data['end_time'] ?? null,
            'created_by' => $request->user()->id,
        ];

        $existing = $meeting->task;

        if ($data['type'] === 'file' && $request->hasFile('file')) {
            if ($existing && $existing->file_path) {
                Storage::disk('public')->delete($existing->file_path);
            }
            $file = $request->file('file');
            $path = $file->store('meeting-tasks', 'public');
            $payload['file_path'] = $path;
            $payload['file_name'] = $file->getClientOriginalName();
            $payload['file_mime'] = $file->getClientMimeType();
            $payload['file_size'] = $file->getSize();
        } elseif ($data['type'] === 'file' && $existing) {
            $payload['file_path'] = $existing->file_path;
            $payload['file_name'] = $existing->file_name;
            $payload['file_mime'] = $existing->file_mime;
            $payload['file_size'] = $existing->file_size;
        } elseif ($existing && $existing->file_path) {
            Storage::disk('public')->delete($existing->file_path);
        }

        $task = MeetingTask::updateOrCreate(['meeting_id' => $meeting->id], $payload);

        if (!$existing) {
            app(NotificationService::class)->sendTaskCreated($task);
        }

        return redirect()->route('admin.meetings.show', $meeting)->with('success', 'Tugas pertemuan disimpan.');
    }

    public function destroy(Meeting $meeting): RedirectResponse
    {
        $task = $meeting->task;

        if (!$task) {
            return back()->withErrors(['task' => 'Tugas tidak ditemukan.']);
        }

        if ($task->file_path) {
            Storage::disk('public')->delete($task->file_path);
        }

        $task->delete();

        return redirect()->route('admin.meetings.show', $meeting)->with('success', 'Tugas pertemuan dihapus.');
    }
}
