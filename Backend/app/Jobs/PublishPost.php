<?php

namespace App\Jobs;

use App\Services\ActivityLogService;
use App\Enums\PlatformEnums\PostPlatformsStatusEnum;
use App\Enums\PostsEnums\PostStatusEnum;
use App\Facades\DateTime;
use App\Models\Post;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class PublishPost implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $postId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $post = Post::find($this->postId);
        if ($post && $post->status == PostStatusEnum::Scheduled->value && $post->scheduled_time <= now()) {
            $post->update(['status' => PostStatusEnum::Published]);
            $post->platforms()->each(function ($platform) {
                $platform->update(['status' => PostPlatformsStatusEnum::Published]);
            });
            ActivityLogService::postPublished($post->user_id);
        }
    }
}
