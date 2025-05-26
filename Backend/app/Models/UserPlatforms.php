<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserPlatforms extends Pivot
{
    use  HasFactory;
    protected $table = 'user_platforms'; // Specify the pivot table name
    use HasFactory;

    protected $guarded = ['id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function platform()
    {
        return $this->belongsTo(Platform::class);
    }

}
