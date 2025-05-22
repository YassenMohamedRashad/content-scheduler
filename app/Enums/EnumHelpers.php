<?php
// app/Enums/Concerns/EnumToArray.php

namespace App\Enums;

trait EnumHelpers
{
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function keys(): array
    {
        return array_column(self::cases(), 'name');
    }

    public static function toArray(): array
    {
        return array_combine(self::keys(), self::values());
    }
}
