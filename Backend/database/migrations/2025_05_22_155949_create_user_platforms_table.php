<?php

use App\Enums\PlatformEnums\UserPlatformStatusEnum;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_platforms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('platform_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('username')->nullable()->unique();
            $table->enum('status', UserPlatformStatusEnum::values())->default(UserPlatformStatusEnum::Inactive);
            $table->timestamps();
            $table->unique(['user_id', 'platform_id'], 'user_platforms_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_platforms');
    }
};
