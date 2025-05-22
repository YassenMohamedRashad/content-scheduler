<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\PostsController;
use App\Http\Middleware\AuthWithThrottle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::middleware('throttle:api')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            // Auth Routes
            Route::put('/update-profile', [AuthController::class, 'updateProfile']);
            Route::patch('/update-profile', [AuthController::class, 'updateProfile']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
        });
    });



    Route::middleware('auth:sanctum')->group(function () {
        // posts
        Route::apiResource('/posts', PostsController::class);

        // platforms
        Route::get('/platforms', [PlatformController::class, 'index']);
        Route::post('/platforms/sync', [PlatformController::class, 'syncPlatforms']);
        Route::delete('/platforms/{id}/unsync', [PlatformController::class, 'unsyncPlatform']);
    });
});

