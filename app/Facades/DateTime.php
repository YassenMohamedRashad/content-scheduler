<?php
// app/Facades/DateTime.php
namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class DateTime extends Facade
{
protected static function getFacadeAccessor(): string
{
return 'datetime'; // Bind this in a service provider
}
}
