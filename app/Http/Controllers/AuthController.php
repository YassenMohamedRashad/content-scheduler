<?php
namespace App\Http\Controllers;

use App\Enums\User\UserRole;
use App\Helpers\UserHelpers;
use App\Http\Controllers\Controller;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\ClientRequest;
use App\Http\Requests\Users\TrainerRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\Client;
use App\Models\Trainer;
use App\Models\User;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function register(StoreUserRequest $userRequest)
    {
        try {
            $validated = $userRequest->validated();
            $user = User::create($validated);
            $token = $user->createToken('api-token')->plainTextToken;
            return ResponseService::success("registered successfully",["user" => $user, "token" => $token],201);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }

    public function updateProfile(UpdateUserRequest $userRequest){
        try {
            $validated = $userRequest->validated();
            $user = auth()->user();
            if($validated['current_password']){
                if(!Hash::check($validated['current_password'], $user->password)){
                    return ResponseService::forbidden("current password is not correct" , code:403);
                }
            }

            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['new_password'] ? Hash::make($validated['new_password']) : $user->password,
            ]);

            return ResponseService::success("Profile updated successfully", $user, 200);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }


    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            $user = User::where('email', $request->email)->first();

            if (! $user || ! Hash::check($request->password, $user->password)) {
                return ResponseService::unauthenticated('The provided credentials are incorrect.');
            }

            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json(['user' => $user, 'token' => $token]);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();

            return response()->json(['message' => 'Logged out']);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }



    public function me(Request $request)
    {
        try {
            return response()->json(auth()->user());
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }
}
