<?php

namespace App\Enums\PostsEnums;
use App\Enums\EnumHelpers;

enum PostStatusEnum : string
{
    use EnumHelpers;
    case Draft = 'draft';
    case Scheduled = 'scheduled';
    case Published = 'published';

}
