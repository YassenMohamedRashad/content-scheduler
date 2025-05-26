<?php

namespace App\Http\Requests\Platforms;

use App\Enums\PlatformEnums\UserPlatformStatusEnum;
use App\Http\Requests\ApiFormRequest;
use Illuminate\Foundation\Http\FormRequest;

class ChangeUserPlatformStatus extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => 'required|in:'. implode(",",UserPlatformStatusEnum::toArray())
        ];
    }
}
