<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{



    public static function upload(UploadedFile $file, string $path = 'uploads', string $disk = 'public'): string
    {
        return $file->store($path, $disk);
    }


    public static function delete(string $filePath, string $disk = 'public'): bool
    {
        return Storage::disk($disk)->delete($filePath);
    }



}
