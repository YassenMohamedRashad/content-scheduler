<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\ActivityLogEnum\ActivityLogActionsEnum;
use App\Enums\ActivityLogEnum\ActivityLogTypesEnum;

class ActivityLogFactory extends Factory
{
    public function definition(): array
    {
        $actions = ActivityLogActionsEnum::values();
        $action = fake()->randomElement($actions);
        $typeMap = [
            'Post Published' => ActivityLogTypesEnum::Post,
            'Post Scheduled' => ActivityLogTypesEnum::Post,
            'Post Failed' => ActivityLogTypesEnum::Post,
            'Post Deleted' => ActivityLogTypesEnum::Post,

            'Platform Connected' => ActivityLogTypesEnum::Platform,
            'Platform Disabled' => ActivityLogTypesEnum::Platform,

            'Profile Updated' => ActivityLogTypesEnum::Profile,

            'Login' => ActivityLogTypesEnum::System,
            'Logout' => ActivityLogTypesEnum::System,
        ];

        $type = $typeMap[$action] ?? ActivityLogTypesEnum::System;

        return [
            'action' => $action,
            'type' => $type,
            'description' => fake()->sentence(),
        ];
    }
}
