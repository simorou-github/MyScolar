<?php

namespace App\Http\Controllers;

use App\Models\MailVerification;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class SchoolInscriptionController extends Controller
{
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

    //create Inscription
    public function createInscription(Request $request)
    {
        //Validate request
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => 'required',
            'password_conf' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'code_verification' => 'required',
            'location' => 'required',
            'country_id' => 'required',
            'city_id' => 'required',
            'tel' => 'required',
            'phone_code' => 'required',
            'type' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'data' => null,
                'message' => 'Veuillez remplir correctement tous les champs obligatoire (*).',
                'status' => 500
            ]);
        }

        //Verify if password is confirmed
        if ($request->password != $request->password_conf) {
            return response()->json([
                'data' => null,
                'message' => 'Les mots de passes ne correspondent pas.',
                'status' => 500
            ]);
        }

        //Validate password complexity
        $validator_pw = Validator::make($request->all(), [
            'password' => [
                'required', 'string', 'min:8', 'regex:/[a-z]/',
                'regex:/[A-Z]/', 'regex:/[0-9]/', 'regex:/[@$!%*#?&]/'
            ],
        ]);

        if ($validator_pw->fails()) {
            return response()->json([
                'data' => null,
                'message' => 'Veuillez utiliser un mot de passe fort (8 Caractères au moins, Chiffres, Majuscules, Minuscules, Caractères spéciaux comme @-!-#).',
                'status' => 500
            ]);
        }

        try {

            $type = $request->type;
            $school = School::where('email', $request->email)->first();
            // Vérifier si un email est déjà associé à une école et si le statut n'est pas rejeté
            // Donc cette est déjà utilisée
            if (isset($school->email) && $school->status != "REJETE") {
                return response()->json([
                    'data' => [],
                    'message' => 'Cette adresse mail est déjà utilisée par une école.',
                    'status' => 300
                ]);
            }

            DB::beginTransaction();

            // Pour uploader le fichier joint
            $document = "";
            if ($request->hasFile('document')) {
                $file      = $request->file('document');
                $filename  = $file->getClientOriginalName();
                $extension  = $file->getClientOriginalExtension();

                //Controle extension o file (only PDF file)
                if ($extension != 'pdf') {
                    return response()->json([
                        'data' => [],
                        'message' => 'Seul le format PDF est accepté.',
                        'status' => 500
                    ]);
                }

                $document   = date('y-m-d-Hms') . '_' . str_replace(' ', '_', $request->social_reason) . '.' . $extension;
                $file->move(public_path('/storage/inscription_files'), $document);
            }

            // Vérifier si un email est déjà associé à une école et si le statut est rejeté
            // Donc cette a tenté de s'inscrire mais l'inscription a été rejetée
            if (isset($school->email) && $school->status == "REJETE") {
                $user_to_upd = User::where('email', $school->email)->first();

                // Vérifier si un document a été joint à l'ancienne inscription
                if (isset($school->document) && file_exists(public_path('storage/inscription_files/' . $school->document))) {

                    File::copy(public_path('storage/inscription_files/' . $school->document), public_path('storage/rejected_inscription_files/Rejet_' . str_replace(' ', '_', $school->social_reason) . '_' . date('ymdHms') . '.pdf'));
                    unlink(public_path('storage/inscription_files/' . $school->document));
                }

                $res_upd_school = $school->update(array_merge($request->except(['document', 'tel']), [
                    'id' => generateDBTableId(30, "App\Models\School"),
                    'owner' => $request->first_name . ' ' . $request->last_name,
                    'owner_lastname' => $request->last_name,
                    'owner_firstname' => $request->first_name,
                    'tel' => $request->indicatif . $request->tel,
                    'document' => $document,
                    'status' => "INITIE"
                ]));

                $res_upd_user = $user_to_upd->update([
                    'last_name' => $request->last_name,
                    'first_name' => $request->first_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);

                if ($res_upd_school && $res_upd_user) {
                    DB::commit();
                    return response()->json([
                        'data' => [],
                        'message' => 'Les données d\'inscription ont été mises à jour avec succès. 
                        Le Groupe Scolar Plus traitera votre inscription.',
                        'status' => 200
                    ]);
                }
            }


            if ($type == 'ecole') { //Inscription of school
                if (School::create(array_merge($request->except(['document', 'tel']), [
                    'id' => generateDBTableId(30, "App\Models\School"),
                    'owner' => $request->first_name . ' ' . $request->last_name,
                    'owner_lastname' => $request->last_name,
                    'owner_firstname' => $request->first_name,
                    'tel' => $request->indicatif . $request->tel,
                    'document' => $document
                ]))) {
                    User::create([
                        'id' => generateDBTableId(20, "App\Models\User"),
                        'last_name' => $request->last_name,
                        'first_name' => $request->first_name,
                        'email' => $request->email,
                        'password' => Hash::make($request->password),
                    ]);
                    DB::commit();
                    return response()->json([
                        'data' => [],
                        'message' => 'Inscription enregistrée avec succès. Le Groupe Scolar Plus traitera votre inscription.',
                        'status' => 200
                    ]);
                }
            } else {
                DB::rollBack();
                return response()->json([
                    'data' => [],
                    'message' => 'Inscription parent non encore disponible.',
                    'status' => 500
                ]);
            }
        } catch (Exception $ex) {
            DB::rollBack();
            Log::error($ex->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue.',
                'status' => 500
            ]);
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
                    $user->syncRoles([$school_admin->name, $school_acc]);
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

                // if (!$data->status) {
                //     $msg = 'Compte désactivé avec succès';
                //     $message = 'Votre demande d\'inscription a été rejetée.';
                // }
                //Sending Mail
                sendMail(
                    [
                        env("ADMIN_MAIL_1"),
                        env("ADMIN_MAIL_2"),
                        /*env("ADMIN_MAIL_3"), 
                        env("ADMIN_MAIL_4"), */
                        $data->email
                    ],
                    [
                        'school' => $data->social_reason, 'email' => $data->email, 'status' => $request->status,
                        'reason' => $request->reject_reason, 'school_id' => $data->id
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



    // Generation of verification mail
    public function generateCodeOfVerification()
    {
        $list_characters = '0123456789ABCDEF';
        $n = 6;
        $code_verif = '';

        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($list_characters) - 1);
            $code_verif .= $list_characters[$index];
        }

        return $code_verif;
    }

    // Get code 
    public function getCodeOfVerification(Request $request)
    {
        try {
            if ($request->email) {
                //Verify is email already exist
                $email_to_test = School::where('email', $request->email)->first();

                if ($email_to_test) {
                    return response()->json([
                        'message' => 'Il existe déjà un espace école associé à cette adresse mail.',
                        'status' => 500
                    ]);
                }

                //Generate verification email code
                $code = $this->generateCodeOfVerification();
                $response = MailVerification::create(['email' => $request->email, 'code' => $code]);
                if ($response) {
                    //Sendding Mail
                    sendMail(
                        [
                            env("ADMIN_MAIL_1"),
                           // env("ADMIN_MAIL_2"),
                            $request->email
                        ],
                        ['code' => $code],
                        'emails.emailVerification',
                        'Vérification de compte mail',
                        env("APP_NAME"),
                        'Merci de taper le code reçu sur la page de vérification de mail sur notre plateforme pour continuer
                        votre demande d\'inscription.
                        '
                    );
                }
            }
            return response()->json([
                'message' => 'Code de vérification envoyé par mail.',
                'status' => 200
            ]);
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    //Verification
    public function codeVerification(Request $request)
    {
        $email = $request->email;
        $code = $request->code;
        try {
            $res = MailVerification::where('email', $email)->where('code', $code)->first();

            if ($res) {
                return response()->json([
                    'message' => 'Code valide',
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'message' => 'Code invalide',
                    'status' => 500
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    //Resend verification code
    public function getNewCodeOfVerification(Request $request)
    {
        try {
            if ($request->email) {
                //Verify is email already exist
                $email_to_test = User::where('email', $request->email)->first();

                if ($email_to_test) {
                    return response()->json([
                        'message' => 'Il existe déjà un espace école associé à cette adresse mail.',
                        'status' => 500
                    ]);
                }

                //Generate verification email code
                $code = $this->generateCodeOfVerification();
                $response = MailVerification::where('email', $request->email)->update(['code' => $code]);
                if ($response) {
                    //Sendding Mail
                    sendMail(
                        [
                            env("ADMIN_MAIL_1"),
                            env("ADMIN_MAIL_2"),
                            $request->email
                        ],
                        ['code' => $code],
                        'emails.emailVerification',
                        'Vérification de compte mail',
                        env("APP_NAME"),
                        'Merci de taper ce nouveau code reçu sur la page de vérification de mail sur notre plateforme pour continuer
                        votre demande d\'inscription.
                        '
                    );
                }
                return response()->json([
                    'message' => 'Code de vérification renvoyé par mail',
                    'data' => '',
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'message' => 'Adresse mail inexistant pour renvoyer le code',
                    'data' => '',
                    'status' => 300
                ]);
            }
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
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
