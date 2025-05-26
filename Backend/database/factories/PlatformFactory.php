<?php

namespace Database\Factories;

use App\Enums\PlatformEnums\PlatformTypesEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Platform>
 */
class PlatformFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => fake()->name(),
            "type" => fake()->randomElement(PlatformTypesEnum::values()),
        ];
    }
}
