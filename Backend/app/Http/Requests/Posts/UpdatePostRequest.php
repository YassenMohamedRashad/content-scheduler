<?php

namespace App\Http\Requests\Posts;

use App\Enums\PostsEnums\PostStatusEnum;
use App\Http\Requests\ApiFormRequest;
use App\Models\Post;
use App\Services\ResponseService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;

class UpdatePostRequest extends ApiFormRequest
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
            "image" => "image|mimes:jpeg,png,jpg|max:5048",
            "title" => "string|max:255",
            "content" => "string",
            "scheduled_time" => "date",
            "draft" => "boolean",
            "platforms" => "array|min:1",
            "platforms.*" => "integer|exists:platforms,id",
        ];
    }

        protected function withValidator(Validator $validator): void
        {
            $validator->after(function ($validator) {
                $postId = $this->route('post'); // or $this->route('post') depending on your route
                $post = Post::find($postId);

                if ($post && $post->status == PostStatusEnum::Published->value) {
                    $validator->errors()->add('post', 'Published posts cannot be updated.');
                }
            });
        }

}
