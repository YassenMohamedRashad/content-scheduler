<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{
    /**
     * Success response with data and message
     *
     * @param string $message
     * @param mixed $data
     * @param int $code
     * @return JsonResponse
     */
    public static function  success(string $message = 'Request successful', $data = [], int $code = 200): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    public static function forbidden(string $message = 'Forbidden', int $code = 403): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }

    public static function unauthenticated(string $message = 'Unauthenticated', int $code = 401): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }
    /**
     * Error response with message and optional data
     *
     * @param string $message
     * @param mixed $data
     * @param int $code
     * @return JsonResponse
     */
    public static function error(string $message = 'internal server error',  $data = [], int $code = 500): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Validation error response
     *
     * @param array $errors
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    public static function validationError(array $errors, string $message = 'Validation failed', int $code = 422): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }



    /**
     * Not Found response
     *
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    public static function notFound(string $message = 'Resource not found', int $code = 404): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }


    /**
     * Too Many Attempts response
     *
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    public static function tooManyAttempts(string $message = 'Too Many Attempts', int $code = 429): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], $code);
    }
}
