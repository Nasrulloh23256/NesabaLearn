<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private function resolveStatus(User $user): string
    {
        $lastLogin = $user->last_login_at;
        if (!$lastLogin || now()->diffInDays($lastLogin) >= 3) {
            return 'Tidak Aktif';
        }

        if (!$user->email_verified_at) {
            return 'Pending';
        }

        return 'Aktif';
    }

    public function index(): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/UserCreate');
    }

    public function show(User $user): Response
    {
        $status = $this->resolveStatus($user);
        $joinedAt = $user->created_at?->toDateTimeString();
        $lastActivity = ($user->last_login_at ?? $user->updated_at)?->toDateTimeString();

        $activity = [
            [
                'dot' => 'bg-emerald-400',
                'title' => 'Akun dibuat',
                'description' => $joinedAt ? "Pengguna terdaftar pada {$joinedAt}." : 'Pengguna baru terdaftar.',
            ],
        ];

        if ($lastActivity && $lastActivity !== $joinedAt) {
            $activity[] = [
                'dot' => 'bg-sky-400',
                'title' => 'Profil diperbarui',
                'description' => "Perubahan terakhir pada {$lastActivity}.",
            ];
        }

        $activity[] = [
            'dot' => 'bg-amber-400',
            'title' => 'Aktivitas terbaru',
            'description' => $lastActivity
                ? "Terakhir aktif pada {$lastActivity}."
                : 'Belum ada aktivitas terbaru.',
        ];

        return Inertia::render('Admin/UserDetail', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $status,
                'joined_at' => $joinedAt,
                'last_activity' => $lastActivity,
                'avatar_url' => $user->avatar_url,
            ],
            'activity' => $activity,
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/UserEdit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $this->resolveStatus($user),
            ],
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['Admin', 'Pengguna'])],
        ]);

        $user->update($data);

        return redirect()->route('admin.users.show', $user)->with('success', 'Perubahan pengguna disimpan.');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'role' => ['required', Rule::in(['Admin', 'Pengguna'])],
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        return redirect()->route('admin.users.index');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->id === $user->id) {
            return back()->withErrors([
                'delete' => 'Tidak dapat menghapus akun yang sedang digunakan.',
            ]);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Pengguna berhasil dihapus.');
    }

    public function impersonate(Request $request, User $user): RedirectResponse
    {
        if ($user->role === 'Admin') {
            return back()->withErrors([
                'impersonate' => 'Tidak dapat masuk sebagai admin lain.',
            ]);
        }

        if (!$request->session()->has('impersonator_id')) {
            $request->session()->put('impersonator_id', $request->user()->id);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('user.meetings.index');
    }
}
