<?php

namespace App\Enums\PlatformEnums;

use App\Enums\EnumHelpers;

enum PostPlatformsStatusEnum : string
{
    use EnumHelpers;

    case Draft = 'draft';
    case Published = 'published';
    case Scheduled = 'scheduled';


}
