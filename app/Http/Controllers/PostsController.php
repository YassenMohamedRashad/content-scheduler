<?php

namespace App\Http\Controllers;

use App\Enums\PlatformEnums\PostPlatformsStatusEnum;
use App\Enums\PostsEnums\PostStatusEnum;
use App\Facades\DateTime;
use App\Http\Requests\Posts\CreatePostRequest;
use App\Http\Requests\Posts\UpdatePostRequest;
use App\Jobs\PublishPost;
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
    public function index()
    {
        try {

            // Post::factory()->count(10)->create();
            $posts = Post::where(['user_id' => auth()->user()->id])->with('platforms.platform')->paginate($this->postsPagination);
            return ResponseService::success("posts fetched successfully", $posts);
        } catch (\Throwable $th) {
            return ResponseService::error($th);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(CreatePostRequest $request)
    {
        try {
            $data = $request->validated();
            if(!isset($data['scheduled_time'])){
                $data['scheduled_time'] = null;
            }


            $data['user_id'] = auth()->user()->id;
            $data['image_url'] = FileService::upload($request->image, 'posts');
            $scheduledTime = 0;

            if ($data['scheduled_time']) {
                $scheduledTime = DateTime::toUtc($data['scheduled_time']);
                $data['scheduled_time'] = DateTime::toUtc($data['scheduled_time']);
                $data['status'] = PostStatusEnum::Scheduled;
            }

            $post = Post::create($data);

            if ($data['scheduled_time']) {
                PublishPost::dispatch($post->id)->delay($scheduledTime);
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
            return ResponseService::error($th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $post = Post::where(['user_id' => auth()->user()->id, 'id' => $id])->first();
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
            $post = Post::where(['user_id' => auth()->user()->id, 'id' => $id])->with('platforms')->first();
            if (!$post) {
                return ResponseService::notFound("post not found");
            }
            $data = $request->validated();

            if ($data['platforms']) {
                PostPlatform::where(['post_id' => $post->id])->delete();
                foreach ($data['platforms'] as $platform) {
                    PostPlatform::create([
                        'post_id' => $post->id,
                        'platform_id' => $platform
                    ]);
                }
            }

            if ($request->image) {
                FileService::delete($post->getRawOriginal('image_url'));
                $data['image_url'] = FileService::upload($request->image, 'posts');
            }
            $post->update($data);
            if (isset($data['scheduled_time'])) {
                $post->update(['status' => PostStatusEnum::Scheduled]);
                PublishPost::dispatch($post->id)->delay(DateTime::toUtc($data['scheduled_time']));
            }

            return ResponseService::success("post updated successfully", $post);
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
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

            FileService::delete($post->getRawOriginal('image_url'));
            $post->delete();
            return ResponseService::success("post deleted successfully");
        } catch (\Throwable $th) {
            return ResponseService::error($th->getMessage());
        }
    }
}
