<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        // Check if user is authenticated with the given guard
        if (Auth::guard($guard)->check()) {
            // For admin/staff users, redirect to admin dashboard
            if (auth()->user() && (auth()->user()->user_type == 'admin' || auth()->user()->user_type == 'staff')) {
                return redirect()->route('admin.dashboard');
            }
            // For other users, redirect to home
            return redirect('/');
        }

        return $next($request);
    }
}
