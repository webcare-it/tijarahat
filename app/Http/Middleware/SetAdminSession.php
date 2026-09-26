<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Str;

class SetAdminSession
{
    /**
     * Handle an incoming request.
     *
     * This middleware should run as early as possible (ideally in the global middleware stack)
     * to ensure the correct session cookie name is set BEFORE the session starts.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $path = $request->getPathInfo();
        
        // Define paths that should use the admin/backend session cookie
        // We include admin, seller, staff, delivery-boy prefixes and the uploader endpoints
        // so that uploading files from the backend uses the same session cookie.
        $backendPrefixes = ['/admin', '/seller', '/delivery-boy', '/staff', '/pos', '/aiz-uploader'];
        
        $isAdminPath = false;
        foreach ($backendPrefixes as $prefix) {
            if (Str::startsWith($path, $prefix)) {
                $isAdminPath = true;
                break;
            }
        }

        // Set the appropriate session cookie name based on the path
        if ($isAdminPath) {
            $cookieName = env('ADMIN_SESSION_COOKIE', 'arman_admin_session');
        } else {
            $cookieName = env('SESSION_COOKIE', 'web_session');
        }

        // Update the configuration
        Config::set('session.cookie', $cookieName);
        
        // If the session manager has already been resolved, we try to force it to re-read the config
        // although it's better to ensure this middleware runs before StartSession.
        if (app()->resolved('session')) {
            $sessionManager = app('session');
            // We can't easily force the manager to re-read config for already created drivers,
            // which is why this middleware MUST run before StartSession.
        }
        
        return $next($request);
    }
}
