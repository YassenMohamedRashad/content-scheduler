<?php
namespace App\Services;

use App\Enums\ActivityLogEnum\ActivityLogActionsEnum;
use App\Enums\ActivityLogEnum\ActivityLogTypesEnum;
use App\Models\ActivityLog;

class ActivityLogService{


    public static function postPublished($user_id, $description = "Publish New Post") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PostPublished,
            "type" => ActivityLogTypesEnum::Post,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function postScheduled($user_id, $description = "Post Scheduled") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PostScheduled,
            "type" => ActivityLogTypesEnum::Post,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function postFailed($user_id, $description = "Post Failed") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PostFailed,
            "type" => ActivityLogTypesEnum::Post,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function postDeleted($user_id, $description = "Post Deleted") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PostDeleted,
            "type" => ActivityLogTypesEnum::Post,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function platformConnected($user_id, $description = "Platform Connected") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PlatformConnected,
            "type" => ActivityLogTypesEnum::Platform,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function platformEnabled($user_id, $description = "Platform Disabled") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PlatformEnabled,
            "type" => ActivityLogTypesEnum::Platform,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }
    public static function platformDisabled($user_id, $description = "Platform Disabled") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::PlatformDisabled,
            "type" => ActivityLogTypesEnum::Platform,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function profileUpdated($user_id, $description = "Profile Updated") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::ProfileUpdated,
            "type" => ActivityLogTypesEnum::Profile,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function login($user_id, $description = "Login") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::Login,
            "type" => ActivityLogTypesEnum::System,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }

    public static function logout($user_id, $description = "Logout") {
        ActivityLog::create([
            "action" => ActivityLogActionsEnum::Logout,
            "type" => ActivityLogTypesEnum::System,
            "user_id" => $user_id,
            "description" => $description
        ]);
    }



}
