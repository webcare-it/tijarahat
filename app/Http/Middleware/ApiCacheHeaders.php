<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ApiCacheHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string|null  $duration
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $duration = null)
    {
        $response = $next($request);
        
        // Default cache duration is 1 hour (3600 seconds)
        $cacheDuration = $duration ? (int)$duration : 300;
        
        // Add ETag for better cache validation
        $etag = md5($response->getContent());
        
        // Check if client has a valid cache
        $requestEtag = $request->getETags();
        if (!empty($requestEtag) && $requestEtag[0] === '"' . $etag . '"') {
            return response('', 304)->header('ETag', '"' . $etag . '"');
        }
        
        // Set cache headers
        $headers = [
            'Cache-Control' => 'public, max-age=' . $cacheDuration . ', stale-while-revalidate=259200',
            'Expires' => now()->addSeconds($cacheDuration)->toRfc7231String(),
            'ETag' => '"' . $etag . '"',
            'Last-Modified' => now()->toRfc7231String(),
            'Vary' => 'Accept-Encoding'
        ];
        
        // Check if the response is a BinaryFileResponse or other response types
        if ($response instanceof BinaryFileResponse) {
            // For BinaryFileResponse, we need to use the headers property directly
            foreach ($headers as $key => $value) {
                $response->headers->set($key, $value);
            }
        } else {
            // For regular responses, we can use the header() method
            foreach ($headers as $key => $value) {
                $response->header($key, $value);
            }
        }
        
        return $response;
    }
}