<?php

namespace App\Http\Requests\Posts;

use App\Http\Requests\ApiFormRequest;
use App\Services\ResponseService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class UpdatePostRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }



    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "image" => "image|mimes:jpeg,png,jpg|max:5048",
            "title" => "string|max:255",
            "content" => "string",
            "scheduled_time" => "date_format:Y-m-d H:i:s",
            "platforms" => "array|min:1",
            "platforms.*" => "integer|exists:platforms,id",
        ];
    }

}
