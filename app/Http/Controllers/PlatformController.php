<?php

    namespace App\Http\Controllers;
    use App\Http\Requests\Platforms\SyncPlatformRequest;
    use App\Models\Platform;
    use App\Models\UserPlatforms;
    use App\Services\ResponseService;

    class PlatformController extends Controller
    {
        private $pagination = 20;

        public function index()
        {
            try {
                $platforms = Platform::paginate($this->pagination);
                return ResponseService::success("Platforms fetched successfully", $platforms);
            } catch (\Throwable $th) {
                return ResponseService::error($th);
            }
        }


        public function syncPlatforms(SyncPlatformRequest $request)
        {
            try {
                $validated = $request->validated();
                $validated['user_id'] = auth()->user()->id;


                UserPlatforms::create($validated);

                return ResponseService::success("Platform synced successfully", code: 201);

            } catch (\Throwable $th) {
                return ResponseService::error($th);
            }
        }


        public function unsyncPlatform($id)
        {
            try {
                $platform = UserPlatforms::where(['user_id'=> auth()->user()->id , 'id' => $id ])->first();
                if (!$platform) {
                    return ResponseService::error("Platform not found", code: 404);
                }
                $platform->delete();
                return ResponseService::success("Platform deleted successfully", code: 200);
            } catch (\Throwable $th) {
                return ResponseService::error($th);
            }
        }

    }
