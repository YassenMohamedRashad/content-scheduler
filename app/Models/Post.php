<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

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
