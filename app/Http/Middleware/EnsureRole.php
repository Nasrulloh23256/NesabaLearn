<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        if (empty($roles) || in_array($user->role, $roles, true)) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            abort(403, 'Unauthorized.');
        }

        if ($user->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('user.meetings.index');
    }
}
