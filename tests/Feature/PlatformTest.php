<?php

use App\Models\Platform;
use App\Models\User;
use App\Models\UserPlatforms;

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// GET /api/platforms
test('can fetch paginated platforms', function () {
    $this->seed();
    Platform::factory()->count(25)->create();
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/platforms');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'status',
        'message',
        'data' => [
            'current_page',
            'data',
            'last_page',
            'per_page',
            'total'
        ]
    ]);
});

// POST /api/platforms/sync
test('can sync a new platform', function () {
    $this->seed();
    $user = User::factory()->create();
    $platform = Platform::factory()->create();

    $data = [
        'platform_id' => $platform->id,
        'username' => 'testuser'
    ];

    $response = $this->actingAs($user)->postJson('/api/platforms/sync', $data);

    $response->assertStatus(201);
    $response->assertJsonFragment(['message' => 'Platform synced successfully']);

    $this->assertDatabaseHas('user_platforms', [
        'user_id' => $user->id,
        'platform_id' => $platform->id,
        'username' => 'testuser'
    ]);
});

// POST /api/platforms/sync - duplicate sync attempt
test('cannot sync the same platform twice for same user', function () {
    $this->seed();
    $user = User::factory()->create();
    $platform = Platform::factory()->create();

    UserPlatforms::create([
        'user_id' => $user->id,
        'platform_id' => $platform->id,
        'username' => 'existinguser'
    ]);

    $data = [
        'platform_id' => $platform->id,
        'username' => 'anotheruser'
    ];

    $response = $this->actingAs($user)->postJson('/api/platforms/sync', $data);
    $response->assertStatus(422);

});

// DELETE /api/platforms/unsync/{id} - valid delete
test('can unsync a synced platform', function () {
    $this->seed();
    $user = User::factory()->create();
    $platform = Platform::factory()->create();

    $userPlatform = UserPlatforms::create([
        'user_id' => $user->id,
        'platform_id' => $platform->id,
        'username' => 'testuser'
    ]);

    $response = $this->actingAs($user)->deleteJson('/api/platforms/' . $userPlatform->id . '/unsync');

    $response->assertStatus(200);
    $response->assertJsonFragment(['message' => 'Platform deleted successfully']);
    $this->assertDatabaseMissing('user_platforms', ['id' => $userPlatform->id]);
});

// DELETE /api/platforms/unsync/{id} - invalid delete (not owned by user)
test('cannot unsync platform that does not belong to user', function () {
    $this->seed();
    $user = User::factory()->create();
    $anotherUser = User::factory()->create();
    $platform = Platform::factory()->create();

    $userPlatform = UserPlatforms::create([
        'user_id' => $anotherUser->id,
        'platform_id' => $platform->id,
        'username' => 'otheruser'
    ]);

    $response = $this->actingAs($user)->deleteJson('/api/platforms/' . $userPlatform->id . '/unsync');
    $response->assertStatus(404);
    $response->assertJsonFragment(['message' => 'Platform not found']);
});
