<?php

namespace Database\Seeders;

use App\Enums\PlatformEnums\PlatformTypesEnum;
use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach(PlatformTypesEnum::values() as $type){
            Platform::create([
                "name" => $type,
                "type" => $type,
                "char_limit" => match ($type) {
                    PlatformTypesEnum::Facebook->value => 63206,
                    PlatformTypesEnum::Instagram->value => 2200,
                    PlatformTypesEnum::LinkedIn->value => 3000,
                    PlatformTypesEnum::Twitter->value => 280,
                    PlatformTypesEnum::TikTok->value => 1500,
                    default => null
                }
            ]);
        }
    }
}
