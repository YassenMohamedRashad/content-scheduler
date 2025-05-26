<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Carbon\Carbon;
use DateTimeZone;
use Illuminate\Support\Facades\Log;

class SetUserTimezone
{
    public function handle(Request $request, Closure $next)
    {
        $default = config('app.timezone');
        $timezone = $request->header('X-Timezone', $default);

        // Validate timezone
        if (!in_array($timezone, DateTimeZone::listIdentifiers())) {
            $timezone = $default;
        }

        // Set a valid timezone in config
        config(['app.user_timezone' => $timezone]);
        config(['app.timezone' => $timezone]);
        // return response()->json($timezone);

        return $next($request);
    }
}
