<?php

namespace App\Services;
use App\Exceptions\ScolarException;
use App\Http\Requests\PushNotificationRequest;
use App\Models\School;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{

    //Nombre d'inscription Notif
    public function getInscriptionPushNotification(PushNotificationRequest $request)
    {
        return School::where('status',  $request->status)->count();
    }

}
