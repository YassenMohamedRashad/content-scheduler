<?php

namespace App\Http\Requests\Posts;

use App\Http\Requests\ApiFormRequest;
use App\Models\Platform;
use App\Models\Post;
use App\Services\DateTimeService;
use App\Services\ResponseService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;



class CreatePostRequest extends ApiFormRequest
{
    private $postsPerDayLimit = 10;

    private DateTimeService $dateTimeService;
    public function __construct(DateTimeService $dateTimeService)
    {
        $this->dateTimeService = $dateTimeService;
    }


    public function rules(): array
    {
        return [
            "image" => "nullable|image|mimes:jpeg,png,jpg|max:20000",
            "title" => "required|string|max:255",
            "content" => "required|string",
            "scheduled_time" => ["nullable","date","after_or_equal:" . $this->dateTimeService->now()],
            "platforms" => "required|array|min:1",
            "platforms.*" => "required|integer|exists:platforms,id",
        ];
    }

    public function messages(): array
    {
        return [
            'image.image' => 'The image must be an image.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg.',
            'image.max' => 'The image may not be greater than 5MB.',
            'title.required' => 'The title field is required.',
            'content.required' => 'The content field is required.',
            'scheduled_time.date_format' => 'The scheduled time must be in the format Y-m-d H:i:s.',
            'scheduled_time.after_or_equal' => 'The scheduled time must be a date after or equal to now.',
            'platforms.required' => 'The platforms field is required.',
            'platforms.array' => 'The platforms field must be an array.',
            'platforms.min' => 'At least one platform is required.',
            'platforms.*.required' => 'Each platform is required.',
            'platforms.*.integer' => 'Each platform must be an integer.',
            'platforms.*.exists' => 'Each platform must exist in the platforms table.',
        ];
    }

    // protected function failedValidation(Validator $validator)
    // {
    //     throw new ValidationException($validator, ResponseService::error("Validation error", $validator->errors()));
    // }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $platforms = $this->input('platforms');
            $content = $this->input('content');

            if (is_array($platforms) && !empty($platforms) && !empty($content)) {
                $platformsMinCharLimit = Platform::whereIn('id', $platforms)
                    ->pluck('char_limit', 'type')
                    ->toArray();

                if (!empty($platformsMinCharLimit)) {
                    $minCharLimit = min($platformsMinCharLimit);

                    if (mb_strlen($content) > $minCharLimit) {
                        $minCharLimitKey = array_search($minCharLimit, $platformsMinCharLimit);
                        $validator->errors()->add('content', "Content length should be ≤ $minCharLimit characters for $minCharLimitKey.");
                    }
                }
            }

            if($this->input('scheduled_time')){
                $scheduledDate = $this->dateTimeService->toUtc($this->input('scheduled_time'))->toDateString(); // Format: 'YYYY-MM-DD'
                $postsCountInSameDate = Post::whereDate('scheduled_time', $scheduledDate)
                    ->where('user_id', auth()->id())
                    ->count();
                if ($postsCountInSameDate >= $this->postsPerDayLimit) {
                    $validator->errors()->add('scheduled_time', "You can only schedule $this->postsPerDayLimit posts in same date ($scheduledDate).");
                }
            }

        });
    }
}
