<?php

namespace App\Http\Controllers\SchoolSpace;

use App\Exceptions\ScolarException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolInscriptionRequest;
use App\Services\SchoolInscriptionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SchoolInscriptionController extends Controller
{
    protected $school_inscription_service;

    public function __construct(SchoolInscriptionService $school_inscription_service)
    {
        $this->school_inscription_service = $school_inscription_service;
    }

    public function createInscription(StoreSchoolInscriptionRequest $request)
    {

        try {
            $user = $this->school_inscription_service->createSchoolInscription($request);
            return response()->json([
                'data' => [],
                'message' => 'Inscription enregistrée avec succès. Le Groupe Scolar Plus traitera votre inscription.',
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

    public function getCodeOfVerification(Request $request)
    {
        try {
            if ($request->email) {
                $this->school_inscription_service->getCodeVerificarion($request);

                return response()->json([
                    'message' => 'Code de vérification envoyé par mail.',
                ], 200);
            }
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

    //Verification
    public function codeVerification(Request $request)
    {
        try {
            $this->school_inscription_service->codeVerification($request);

            return response()->json([
                'message' => 'Code valide',
            ], 200);
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

    //Resend verification code
    public function getNewCodeOfVerification(Request $request)
    {
        try {

            $this->school_inscription_service->getNewCodeOfVerification($request);
            return response()->json([
                'message' => 'Code de vérification renvoyé par mail',
                'data' => '',
            ], 200);
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
