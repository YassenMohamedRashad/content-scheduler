<?php

namespace App\Enums\PlatformEnums;

use App\Enums\EnumHelpers;

enum UserPlatformStatusEnum: string
{
    use EnumHelpers;
    case Active = 'active';
    case Inactive = 'inactive';
}
