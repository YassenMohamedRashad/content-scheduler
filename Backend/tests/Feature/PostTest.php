<?php

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

use App\Models\User;
use App\Models\Post;
use App\Services\FileService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

test('get user posts', function () {
    $this->seed();
    $user = User::factory()->create();
    $posts = Post::factory()->count(5)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->getJson('/api/posts');
    $response->assertStatus(200);

    $response->assertStatus(200);
});
test('get user posts with pagination', function () {
    $this->seed();
    $user = User::factory()->create();
    $posts = Post::factory()->count(15)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->getJson('/api/posts?page=1&per_page=10');
    $response->assertStatus(200);
    $response->assertJsonCount(10, 'data.data');
});

test('create post', function () {
    $this->seed();
    $user = User::factory()->create();
    Log::info(now()->addDays(1));
    $postData = [
        'image' => UploadedFile::fake()->image('post.jpg'),
        'title' => 'Test Post',
        'content' => 'This is a test post.',
        'scheduled_time' => now()->addDays(1)->toDateTimeString(),
        // 'scheduled_time' => "2025-12-11 10:00:00",
        'status' => 'draft',
        'platforms' => [1, 2],
    ];

    $response = $this->actingAs($user)->postJson('/api/posts', $postData);
    $response->assertStatus(201);
    $post = Post::find($response->json('data.id'));
    FileService::delete($post->getRawOriginal('image_url'));
    $this->assertDatabaseHas('posts', ['title' => 'Test Post']);

});

test('update post', function () {
    $this->seed();
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $updateData = [
        'image' => UploadedFile::fake()->image('updated_post.jpg'),
        'title' => 'Updated Post',
        'content' => 'This is an updated test post.',
        'scheduled_time' => now()->addDays(1)->toDateTimeString(),
        'status' => 'published',
        'platforms' => [1, 2],
    ];

    $response = $this->actingAs($user)->putJson('/api/posts/' . $post->id, $updateData);
    $response->assertStatus(200);
    $this->assertDatabaseHas('posts', ['title' => 'Updated Post']);
});

test('delete post', function () {
    $this->seed();
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->deleteJson('/api/posts/' . $post->id);
    $response->assertStatus(200);
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});


