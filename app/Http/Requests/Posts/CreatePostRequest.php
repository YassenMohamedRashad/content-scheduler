<?php

namespace App\Http\Requests\Posts;

use App\Services\ResponseService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class CreatePostRequest extends FormRequest
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
            "image" => "nullable|image|mimes:jpeg,png,jpg|max:5048",
            "title" => "required|string|max:255",
            "content" => "required|string",
            "scheduled_time" => "required|date_format:Y-m-d H:i:s",
            "platforms" => "required|array|min:1",
            "platforms.*" => "required|integer|exists:platforms,id",
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new ValidationException($validator, ResponseService::error("Validation error", $validator->errors()));
    }
}
