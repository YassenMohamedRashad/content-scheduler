<?php

namespace App\Http\Controllers;

use App\Enums\PlatformEnums\PlatformTypesEnum;
use App\Enums\PlatformEnums\UserPlatformStatusEnum;
use App\Enums\PostsEnums\PostStatusEnum;
use App\Models\ActivityLog;
use App\Services\ResponseService;
use Illuminate\Http\Request;


class AnalyticsController extends Controller
{
    public function index(){
        try {
            $user_posts = auth()->user()->posts()->with("platforms.platform")->get();
            $user_platforms = auth()->user()->platforms()->get();
            $last_activities = auth()->user()->activityLogs()->orderByDesc('created_at')->take(5)->get();

            // Filter upcoming posts: scheduled and scheduled_at in the future

            $upcoming_posts = $user_posts->filter(function ($post) {
            return $post->status == PostStatusEnum::Scheduled->value
                && $post->scheduled_time
                && $post->scheduled_time->isFuture();
            });

            $data = [
            'posts' => $user_posts,
            'total_posts' => $user_posts->count(),
            'scheduled' => $user_posts->where('status', PostStatusEnum::Scheduled->value)->count(),
            'active_platforms' => $user_platforms->filter(function ($platform) {
                return $platform->pivot && $platform->pivot->status == UserPlatformStatusEnum::Active->value;
            })->count(),
            'recent_activities' => $last_activities,
            'upcoming_posts' => $upcoming_posts->values(),
            ];
            return ResponseService::success("Retrived Successfully", $data);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }

    public function getActivityLogHistory(Request $request)
    {
        try {
            $query = auth()->user()->activityLogs()->latest();

            // Search filter
            if ($request->has('search') && $request->search) {
                $query->where(function ($q) use ($request) {
                    $q->where('action', 'like', '%' . $request->search . '%')
                        ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            }

            // Type filter
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            // Pagination
            $logs = $query->paginate(10); // Adjust per page count as needed

            return ResponseService::success("Logs retrieved successfully", $logs);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }
}
