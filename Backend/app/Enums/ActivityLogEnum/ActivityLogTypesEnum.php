<?php

namespace App\Enums\ActivityLogEnum;

use App\Enums\EnumHelpers;

enum ActivityLogTypesEnum : string
{
    use EnumHelpers;
    case Post = "post";
    case Platform = "platform";
    case Profile = "profile";
    case System = "system";
}
