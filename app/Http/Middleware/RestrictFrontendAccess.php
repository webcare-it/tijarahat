<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Auth;

class RestrictFrontendAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Allow access to admin login routes
        if (Auth::check() && (Auth::user()->user_type == 'admin')) {
            return $next($request);
        }
        
        // Redirect all other routes to admin login
        return redirect()->route('login');
    }
}