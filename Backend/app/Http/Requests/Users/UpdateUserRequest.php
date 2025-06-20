<?php

namespace App\Http\Requests\Users;

use App\Http\Requests\ApiFormRequest;
use App\Services\ResponseService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class UpdateUserRequest extends ApiFormRequest
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
            'name' => 'string|max:255',
            'email' => 'string|email|max:255|unique:users,email,' . $this->user()->id,
            'new_password' => 'required_with:current_password|string|confirmed|min:8',
            'new_password_confirmation' => 'required_with:new_password|string',
            'current_password' => 'required_with:new_password|string',
        ];
    }
}
