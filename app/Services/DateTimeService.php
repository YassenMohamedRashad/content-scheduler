<?php
namespace App\Services;

use Carbon\Carbon;

class DateTimeService
{
protected string $userTz;

public function __construct()
{
$this->userTz = config('app.user_timezone', config('app.timezone', 'UTC'));
}

/**
* Get current time in user's timezone.
*/
public function now(): Carbon
{
return Carbon::now($this->userTz);
}

/**
* Parse user date input (assumes it's in user's timezone).
* Convert to UTC for storage.
*/
public function toUtc(string $dateTime): Carbon
{
return Carbon::parse($dateTime, $this->userTz)->setTimezone('UTC');
}

/**
* Convert a UTC datetime (e.g. from DB) to user timezone.
*/
public function fromUtc(string|\DateTimeInterface $utcDateTime): Carbon
{
return Carbon::parse($utcDateTime)->setTimezone($this->userTz);
}

/**
* Format a UTC datetime for displaying in user's timezone.
*/
public function formatFromUtc(string|\DateTimeInterface $utcDateTime, string $format = 'Y-m-d H:i:s'): string
{
return $this->fromUtc($utcDateTime)->format($format);
}

/**
* Format current time in user's timezone.
*/
public function formatNow(string $format = 'Y-m-d H:i:s'): string
{
return $this->now()->format($format);
}
}
