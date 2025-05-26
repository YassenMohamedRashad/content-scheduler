<?php

namespace App\Http\Requests\Platforms;

use App\Http\Requests\ApiFormRequest;
use Illuminate\Foundation\Http\FormRequest;

class SyncPlatformRequest extends ApiFormRequest
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
            'platform_id' => [
                'required',
                'integer',
                'exists:platforms,id',
                // Ensure the combination of user_id and platform_id is unique in the table (e.g., user_platforms)
                \Illuminate\Validation\Rule::unique('user_platforms')->where(function ($query) {
                    return $query->where('user_id', auth()->user()->id);
                }),
            ],
            'username' => 'required|string|max:255|unique:user_platforms,username',
        ];
    }

    public function messages(): array
    {
        return [
            'platform_id.required' => 'The platform ID is required.',
            'platform_id.integer' => 'The platform ID must be an integer.',
            'platform_id.exists' => 'The selected platform ID is invalid.',
            'platform_id.unique' => 'The platform has already been synced.',
            'username.required' => 'The username is required.',
            'username.string' => 'The username must be a string.',
            'username.max' => 'The username may not be greater than 255 characters.',
        ];
    }
}
