<?php

namespace App\Http\Controllers;

use App\Services\ActivityLogService;
use App\Enums\PlatformEnums\PostPlatformsStatusEnum;
use App\Enums\PostsEnums\PostStatusEnum;
use App\Facades\DateTime;
use App\Http\Requests\Posts\CreatePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Jobs\PublishPost;
use App\Models\ActivityLog;
use App\Models\Platform;
use App\Models\Post;
use App\Models\PostPlatform;
use App\Services\DateTimeService;
use App\Services\FileService;
use App\Services\ResponseService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PostsController extends Controller
{
    private int $postsPagination = 10;


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Post::where('user_id', auth()->user()->id)
                ->with('platforms.platform');

            // Filter by status if provided
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Search by term if provided
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('content', 'like', "%{$search}%");
                });
            }

            // Filter by created_at range
            if ($request->filled('created_from')) {
                $query->whereDate('created_at', '>=', $request->created_from);
            }
            if ($request->filled('created_to')) {
                $query->whereDate('created_at', '<=', $request->created_to);
            }

            // Filter by scheduled_time range
            if ($request->filled('scheduled_from')) {
                $query->whereDate('scheduled_time', '>=', $request->scheduled_from);
            }
            if ($request->filled('scheduled_to')) {
                $query->whereDate('scheduled_time', '<=', $request->scheduled_to);
            }

            $posts = $query->paginate($this->postsPagination);

            return ResponseService::success("posts fetched successfully", $posts);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }





    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePostRequest $request)
    {
        try {
            $data = $request->validated();
            if (!isset($data['scheduled_time'])) {
                $data['scheduled_time'] = null;
            }


            $data['user_id'] = auth()->user()->id;
            if (isset($data['image'])) {
                $data['image_url'] = FileService::upload($request->image, 'posts');
            }
            $scheduledTime = 0;

            if ($data['scheduled_time']) {
                $scheduledTime = DateTime::toUtc($data['scheduled_time']);
                // $data['scheduled_time'] = DateTime::toUtc($data['scheduled_time']);
                $data['status'] = PostStatusEnum::Scheduled;
            }

            $post = Post::create($data);

            if ($data['scheduled_time']) {
                PublishPost::dispatch($post->id)->delay($scheduledTime);
                ActivityLogService::postPublished(auth()->user()->id);
            }


            if ($data['platforms'] && count($data['platforms']) > 0) {
                foreach ($data['platforms'] as $platform) {
                    PostPlatform::create([
                        'post_id' => $post->id,
                        'platform_id' => $platform,
                        'platform_status' => $data['scheduled_time'] ? PostPlatformsStatusEnum::Published : PostPlatformsStatusEnum::Draft
                    ]);
                }
            }
            return ResponseService::success("post created successfully", $post, 201);
        } catch (\Throwable $th) {
            ActivityLogService::postFailed(auth()->user()->id);
            return ResponseService::error($th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $post = Post::where(['user_id' => auth()->user()->id, 'id' => $id])->with("platforms")->first();
            if (!$post) {
                return ResponseService::notFound("post not found");
            }
            return ResponseService::success("post fetched successfully", $post);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, string $id)
    {
        try {
            // Retrieve the post for the authenticated user
            $post = Post::where(['user_id' => auth()->id(), 'id' => $id])
                ->with('platforms')
                ->first();

            if (!$post) {
                return ResponseService::notFound("Post not found");
            }

            $data = $request->validated();
            $isDraft = $data['draft'] ?? false;

            // Handle draft status
            if ($isDraft) {
                $data['status'] = PostStatusEnum::Draft->value;
                $data['scheduled_time'] = null;
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                if ($post->image_url) {
                    FileService::delete($post->getRawOriginal('image_url'));
                }
                $data['image_url'] = FileService::upload($request->file('image'), 'posts');
            }

            // Handle platform update
            if (isset($data['platforms'])) {
                PostPlatform::where('post_id', $post->id)->delete();

                $platforms = collect($data['platforms'])->unique()->filter();
                foreach ($platforms as $platformId) {
                    PostPlatform::create([
                        'post_id' => $post->id,
                        'platform_id' => $platformId,
                    ]);
                }

                unset($data['platforms']); // Prevent mass assignment error
            }

            // Update post data
            $post->update($data);

            // Schedule post if needed
            if (!$isDraft && isset($data['scheduled_time'])) {
                $post->update(['status' => PostStatusEnum::Scheduled]);
                PublishPost::dispatch($post->id)->delay(DateTime::toUtc($data['scheduled_time']));
            }

            return ResponseService::success("Post updated successfully", $post);
        } catch (\Throwable $th) {
            // Optionally log exception for debugging
            // Log::error('Post update failed', ['error' => $th]);

            return ResponseService::error("An error occurred while updating the post: " . $th->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $post = Post::where(['user_id' => auth()->user()->id, 'id' => $id])->first();
            if (!$post) {
                return ResponseService::error("post not found");
            }
            if ($post->image_url) {
                FileService::delete($post->getRawOriginal('image_url'));
            }
            $post->delete();
            ActivityLogService::postDeleted(auth()->user()->id);
            return ResponseService::success("post deleted successfully");
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }
}
