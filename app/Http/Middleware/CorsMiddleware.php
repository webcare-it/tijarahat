<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        // Handle preflight requests immediately
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
            return $this->addCorsHeaders($response, $request);
        }
        
        $response = $next($request);
        
        return $this->addCorsHeaders($response, $request);
    }
    
    private function addCorsHeaders($response, $request)
    {
        $origin = $request->header('Origin');

        // Only Illuminate\Http\Response exposes the fluent header() helper.
        // BinaryFileResponse, StreamedResponse, JsonResponse, etc. do not, so
        // set headers directly via the underlying HeaderBag for those.
        if ($response instanceof \Illuminate\Http\Response) {
            $response->header('Access-Control-Allow-Origin', $origin ?: '*')
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD')
                ->header('Access-Control-Allow-Headers', $request->header('Access-Control-Request-Headers') ?: 'Content-Type, Authorization, X-Requested-With')
                ->header('Access-Control-Max-Age', '3600')
                ->header('Access-Control-Allow-Credentials', 'true');
        } else {
            $response->headers->set('Access-Control-Allow-Origin', $origin ?: '*');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
            $response->headers->set('Access-Control-Allow-Headers', $request->header('Access-Control-Request-Headers') ?: 'Content-Type, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Max-Age', '3600');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}