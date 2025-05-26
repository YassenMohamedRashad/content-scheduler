<?php

namespace App\Http\Controllers;


use App\Services\ActivityLogService;
use App\Enums\PlatformEnums\UserPlatformStatusEnum;
use App\Http\Requests\Platforms\ChangeUserPlatformStatus;
use App\Http\Requests\Platforms\SyncPlatformRequest;
use App\Models\Platform;
use App\Models\UserPlatforms;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PlatformController extends Controller
{
    private $pagination = 10;

    public function index()
    {
        try {
            $user_platforms = auth()->user()->platforms()->withCount(['posts' => function ($query) {
                $query->where('user_id', auth()->user()->id);
            }])->get()->keyBy('id')->map(function ($platform) {
                $platform->is_synced = true;

                return $platform;
            });




            $rest_of_platforms = Platform::whereNotIn('id', $user_platforms->pluck('id'))->get()
            ->keyBy('id')->map(function ($platform) {
                $platform->is_synced = false;
                $platform->pivot = [
                    "status" => null,
                    "user_id" => null,
                    "platform_id" => null,
                    "username" => null
                ];
                $platform->posts_count = 0; // Default posts count for unsynced platforms
                return $platform;
            });

            $analytics = [
                "connected_platforms" => $user_platforms->count(),
                "total_platforms" => $user_platforms->count() + $rest_of_platforms->count(),
                "total_posts" => $user_platforms->sum(function ($platform) {
                    return $platform->posts_count;
                }),
                "active_platforms" => $user_platforms->filter(function ($platform) {
                    return $platform->pivot->status === 'active';
                })->count(),
            ];



            $platforms = [...$user_platforms, ...$rest_of_platforms];
            return ResponseService::success("Platforms fetched successfully", ["platforms"=>$platforms , "analytics" => $analytics]);
        } catch (\Throwable $th) {
            return ResponseService::error($th);
        }
    }


    public function syncPlatforms(SyncPlatformRequest $request)
    {
        try {
            $validated = $request->validated();
            $validated['user_id'] = auth()->user()->id;

            $platform_name = Platform::where(['id' => $validated['platform_id']])->pluck('name')->first();


            UserPlatforms::create($validated);
            ActivityLogService::platformConnected(auth()->user()->id , "Connect $platform_name platform");

            return ResponseService::success("Platform synced successfully", code: 201);
        } catch (\Throwable $th) {
            return ResponseService::error($th);
        }
    }


    public function unsyncPlatform($id)
    {
        try {
            $platform = UserPlatforms::where(['user_id' => auth()->user()->id, 'id' => $id])->first();
            if (!$platform) {
                return ResponseService::error("Platform not found", code: 404);
            }
            $platform->delete();
            return ResponseService::success("Platform deleted successfully", code: 200);
        } catch (\Throwable $th) {
            return ResponseService::error($th);
        }
    }

    public function changePlatformAccountStatus(ChangeUserPlatformStatus $request  , $id)
    {
        try {
            $validated = $request->validated();
            $platform = UserPlatforms::where(['user_id' => auth()->user()->id, 'platform_id' => $id])->first();
            if (!$platform) {
                return ResponseService::error("Platform not found", code: 404);
            }
            $platform->status = $validated['status'];
            $platform->save();

            $platform_name = $platform->platform()->first()->name;
            if($platform->status == UserPlatformStatusEnum::Active->value){
                ActivityLogService::platformEnabled(auth()->user()->id, $platform_name ." enabled");
            }else{
                ActivityLogService::platformDisabled(auth()->user()->id, $platform_name ." disabled");
            }
            return ResponseService::success("Platform status updated successfully", $platform);
        } catch (\Throwable $th) {
            return ResponseService::error($th);
        }
    }
}
