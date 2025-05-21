<?php


uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

use App\Models\User;

test('register new account', function () {
    $response = $this->postJson('/api/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertStatus(201);
});

test('Login to Account', function () {
        $user = User::factory()->create();
        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => "password",
        ]);

        $response->assertStatus(200);
});

test('get user info using me endpoint', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->getJson('/api/auth/me');

    $response->assertStatus(200);
});

test('logout from account', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->postJson('/api/auth/logout');

    $response->assertStatus(200);
});
