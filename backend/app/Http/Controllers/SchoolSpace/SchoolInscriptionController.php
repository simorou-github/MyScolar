<?php

namespace App\Http\Controllers\SchoolSpace;

use App\Exceptions\ScolarException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolInscriptionRequest;
use App\Jobs\EmailScolarTemplateJob;
use App\Models\School;
use App\Models\User;
use App\Services\SchoolInscriptionService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

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

    // Validate inscription and change status of school inscription
    public function changeStatus(Request $request)
    {
        if (!$request->id) {
            return response()->json([
                'data' => [],
                'message' => 'Aucune demande d\'inscription n\'est sélectionnée.',
                'status' => 300
            ]);
        } else {
            try {
                $message = '';
                $msg = '';
                $data = School::find($request->id);
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette demande d\'inscription n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                DB::beginTransaction();
                $user = User::where('email', $data->email)->first();

                if ($request->status == 'VALIDE' && $data->update(['status' => $request->status])) {
                    $user->school_id = $data->id;
                    $user->email_verified_at = Carbon::now();
                    $user->status = !$user->status;
                    $user->save();
                    $school_admin = Role::findByName('school_admin', 'api');
                    $school_acc = Role::findByName('accountant', 'api');
                    $user->assignRole($school_admin);
                    $user->assignRole($school_acc);
                    $msg = 'Compte activé avec succès.';
                    $message = 'Votre demande d\'inscription a bien été validée.';
                }

                if ($request->status == 'REJETE' && $data->update(['status' => $request->status])) {
                    $data->reject_reason = $request->reject_reason;
                    $data->save();

                    $msg = 'Inscription rejetée avec succès';
                    $message = 'Votre demande d\'inscription a été rejétée. Merci de lire les motifs de ce rejet
                    pour resoumettre votre demande.';
                }

                if ($request->status == 'INACTIF' && $data->update(['status' => $request->status])) {
                    $data->save();

                    //Disable user
                    $user->status = false;
                    $user->save();

                    $msg = 'Compte désactivé avec succès';
                    $message = 'Le compte de votre école a été désactivé. Merci de de contacter le Groupe Scolar Plus.';
                }

                //Sending Mail
                EmailScolarTemplateJob::dispatch(
                    [
                        env("ADMIN_MAIL_1"),
                        $data->email
                    ],
                    [
                        'school' => $data->social_reason,
                        'email' => $data->email,
                        'status' => $request->status,
                        'reason' => $request->reject_reason,
                        'school_id' => $data->id
                    ],
                    'emails.validateInscription',
                    ($request->status == 'VALIDE') ? 'Validation Inscription' : 'Rejet Inscription',
                    env("APP_NAME"),
                    $message
                );


                DB::commit();
                return response()->json([
                    'data' => $data,
                    'message' => $msg,
                    'status' => 200
                ]);
            } catch (Exception $ex) {
                DB::rollBack();
                Log::error($ex->getMessage());
                return response()->json([
                    'data' => [],
                    'message' => 'Une erreur interne est survenue',
                    'status' => 500
                ]);
            }
        }
    }

    // List of school inscription pending
    public function listInscriptionsPending(Request $request)
    {
        $params = [];
        if ($request->social_reason) {
            $params[] = ['social_reason', 'LIKE', strtoupper($request->social_reason) . '%'];
        }
        if ($request->owner) {
            $params[] = ['owner', '=', $request->owner];
        }
        if ($request->country_id) {
            $params[] = ['country_id', '=', $request->country_id];
        }
        if ($request->tel) {
            $params[] = ['tel', '=', $request->tel];
        }
        if ($request->status) {
            $params[] = ['status', '=', $request->status];
        }

        try {
            $inscriptions_pending = School::with(['country'])->whereIn('status', ['INITIE', 'REJETE'])->where($params)->orderBy('id', 'DESC')->get();
            $nb = $inscriptions_pending->count();
            return response()->json([
                'data' => $inscriptions_pending,
                'nb_data' => $nb,
                'status' => 200,
                'message' => 'Liste des inscriptions en attente.'
            ]);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json(['data' => [], 'message' => 'Une erreur est survenue. Veuillez réessayer plus tard.'], 500);
        }
    }

    // List of school inscription validated
    public function listInscriptionsValidated(Request $request)
    {
        try {
            $params = [];

            if ($request->social_reason) {
                $params[] = ['social_reason', 'LIKE', strtoupper($request->social_reason) . '%'];
            }
            if ($request->owner) {
                $params[] = ['owner', '=', $request->owner];
            }
            if ($request->country_id) {
                $params[] = ['country_id', '=', $request->country_id];
            }
            if ($request->tel) {
                $params[] = ['tel', '=', $request->tel];
            }
            if ($request->status) {
                $params[] = ['status', '=', $request->status];
            }

            $inscriptions_validated = School::with(['country'])->whereIn('status', ['VALIDE', 'ACTIF', 'INACTIF'])->where($params)->orderBy('id', 'DESC')->get();
            $nb = $inscriptions_validated->count();
            return response()->json([
                'data' => $inscriptions_validated,
                'nb_data' => $nb,
                'status' => 200,
                'message' => 'Liste des inscriptions validées.'
            ]);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json(['data' => [], 'message' => 'Une erreur est survenue. Veuillez réessayer plus tard.'], 500);
        }
    }

    public function getUrlFileForSchool(Request $request)
    {
        try {
            Log::info('est ici');
            $school = School::find($request->id);
            $file_path = 'storage/inscription_files/' . $school->document;
            Log::info($file_path);
            //return response()->file(public_path($file_path));
            return response()->file(
                public_path($file_path)
            );
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }
}
