<?php

namespace App\Enums\ActivityLogEnum;

use App\Enums\EnumHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;

enum ActivityLogActionsEnum : string
{
    use EnumHelpers;
    case PostPublished = 'Post Published';
    case PostScheduled = 'Post Scheduled';
    case PostFailed = 'Post Failed';
    case PostDeleted = 'Post Deleted';
    case PlatformConnected = 'Platform Connected';
    case PlatformEnabled = 'Platform Enabled';
    case PlatformDisabled = 'Platform Disabled';
    case ProfileUpdated = 'Profile Updated';
    case Login = 'Login';
    case Logout = 'Logout';

}
