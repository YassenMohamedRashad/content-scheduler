<?php

namespace App\Enums\PlatformEnums;
use App\Enums\EnumHelpers;

enum PlatformTypesEnum : string
{
    use EnumHelpers;
    case Instagram = 'instagram';
    case Facebook = 'facebook';
    case Twitter = 'twitter';
    case LinkedIn = 'linkedin';
    case TikTok = 'tiktok';

}
