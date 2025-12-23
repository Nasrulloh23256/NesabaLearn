<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MeetingAttachmentController extends Controller
{
    public function store(Request $request, Meeting $meeting): RedirectResponse
    {
        $request->validate([
            'attachments' => ['required', 'array', 'min:1'],
            'attachments.*' => ['file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png'],
        ]);

        foreach ($request->file('attachments', []) as $file) {
            $path = $file->store('meeting-attachments', 'public');

            $meeting->attachments()->create([
                'title' => $file->getClientOriginalName(),
                'type' => $file->getClientMimeType() ?: 'file',
                'path' => $path,
            ]);
        }

        return redirect()->route('admin.meetings.show', $meeting);
    }

    public function destroy(Meeting $meeting, MeetingAttachment $attachment): RedirectResponse
    {
        if ($attachment->meeting_id !== $meeting->id) {
            return back()->withErrors(['attachment' => 'Lampiran tidak ditemukan.']);
        }

        if ($attachment->path) {
            Storage::disk('public')->delete($attachment->path);
        }

        $attachment->delete();

        return redirect()->route('admin.meetings.show', $meeting)->with('success', 'Lampiran dihapus.');
    }
}
