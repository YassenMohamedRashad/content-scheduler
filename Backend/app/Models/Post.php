<?php

namespace App\Models;

use App\Facades\DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Post extends BaseModel
{
    use HasFactory;
    protected $dates = [
        'scheduled_time',
    ];

    protected $guarded = ['id'];

    protected $casts = [
        'scheduled_time' => 'datetime', // or 'date' if you only want date without time
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function platforms()
    {
        return $this->hasMany(PostPlatform::class);
    }

    public function getImageUrlAttribute($value)
    {
        if ($value) {
            return $value != "placeholder" ? env('APP_URL')  . Storage::url($value) : env('APP_URL')  . "/images/posts/placeholder/placeholder.png";
        }
        return $value;
    }

}
