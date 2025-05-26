<?php

namespace App\Http\Controllers\PushNotification;

use App\Exceptions\ScolarException;
use App\Http\Controllers\Controller;
use App\Http\Requests\PushNotificationRequest;
use App\Services\PushNotificationService;
use Exception;
use Illuminate\Support\Facades\Log;

class PushNotificationController extends Controller
{
    //
    protected $push_notif_service;

    public function __construct(PushNotificationService $push_notif_service)
    {
        $this->push_notif_service = $push_notif_service;
        
    }

    public function getInscriptionPushNotification(PushNotificationRequest $request)
    {
        Log::info($request);
        try {
            Log::info($request);
            $notif = $this->push_notif_service->getInscriptionPushNotification($request);
            Log::info($notif);
            return response()->json([
                'data' => $notif,
                'message' => 'Notification Inscription.',
            ], 201);
            
        } catch (ScolarException $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Une erreur interne est survenue.',
            ], 500);
        }
    }
}
