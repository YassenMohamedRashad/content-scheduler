<?php

namespace Database\Factories;

use App\Enums\PostsEnums\PostStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'image_url' => $this->faker->imageUrl(),
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraph,
            'scheduled_time' => $this->faker->dateTime,
            'status' => $this->faker->randomElement(PostStatusEnum::cases()),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}
