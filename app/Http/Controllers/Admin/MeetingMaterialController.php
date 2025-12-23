<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingMaterial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MeetingMaterialController extends Controller
{
    public function create(Meeting $meeting): Response
    {
        return Inertia::render('Admin/MeetingMaterialCreate', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
            ],
        ]);
    }

    public function store(Request $request, Meeting $meeting): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', Rule::in(['content', 'video'])],
            'name' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'video' => ['nullable', 'file', 'max:51200', 'mimes:mp4,webm,ogg,mov'],
        ]);

        if ($data['type'] === 'content' && empty($data['content'])) {
            return back()->withErrors(['content' => 'Konten materi wajib diisi.'])->withInput();
        }

        if ($data['type'] === 'video' && !$request->hasFile('video')) {
            return back()->withErrors(['video' => 'File video wajib diunggah.'])->withInput();
        }

        $payload = [
            'meeting_id' => $meeting->id,
            'type' => $data['type'],
            'name' => $data['name'],
            'content' => $data['type'] === 'content' ? $data['content'] : null,
            'video_path' => null,
        ];

        if ($data['type'] === 'video') {
            $path = $request->file('video')->store('meeting-materials', 'public');
            $payload['video_path'] = $path;
        }

        MeetingMaterial::create($payload);

        return redirect()->route('admin.meetings.show', $meeting);
    }

    public function destroy(Meeting $meeting, MeetingMaterial $material): RedirectResponse
    {
        if ($material->meeting_id !== $meeting->id) {
            return back()->withErrors(['material' => 'Materi tidak ditemukan.']);
        }

        if ($material->video_path) {
            Storage::disk('public')->delete($material->video_path);
        }

        $material->delete();

        return redirect()->route('admin.meetings.show', $meeting)->with('success', 'Materi dihapus.');
    }
}
