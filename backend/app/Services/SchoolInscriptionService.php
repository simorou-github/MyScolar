<?php

namespace App\Services;

use App\Exceptions\ScolarException;
use App\Http\Requests\StoreSchoolInscriptionRequest;
use App\Jobs\EmailScolarTemplateJob;
use App\Models\MailVerification;
use App\Models\School;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class SchoolInscriptionService
{

    public function createSchoolInscription(StoreSchoolInscriptionRequest $school_request)
    {
        $school = School::where('email', $school_request->email)->first();

        // Vérifier si un email est déjà associé à une école et si le statut n'est pas rejeté
        // Donc cette est déjà utilisée

        if (isset($school->email) && $school->status != "REJETE") {
            throw new ScolarException("Cette adresse mail est déjà utilisée par une école.");
            // 422 Erreur de validation Laravel (par défaut) et choisi pour les erreurs de Scolar
        }

        DB::beginTransaction();

        // Pour uploader le fichier joint
        $document = "";
        if ($school_request->hasFile('document')) {
            $file      = $school_request->file('document');
            $filename  = $file->getClientOriginalName();
            $extension  = $file->getClientOriginalExtension();

            //Controle extension o file (only PDF file)
            if ($extension != 'pdf') {
                throw new ScolarException("Seul le format PDF est accepté.", 422);
            }

            $document   = date('y-m-d-Hms') . '_' . str_replace(' ', '_', $school_request->social_reason) . '.' . $extension;
            $file->move(public_path('/storage/inscription_files'), $document);
        }

        // Vérifier si un email est déjà associé à une école et si le statut est rejeté
        // Donc cette école a tenté de s'inscrire mais l'inscription a été rejetée
        if (isset($school->email) && $school->status == "REJETE") {
            $user_to_upd = User::where('email', $school->email)->first();

            // Vérifier si un document a été joint à l'ancienne inscription
            if (isset($school->document) && file_exists(public_path('storage/inscription_files/' . $school->document))) {

                File::copy(public_path('storage/inscription_files/' . $school->document), public_path('storage/rejected_inscription_files/Rejet_' . str_replace(' ', '_', $school->social_reason) . '_' . date('ymdHms') . '.pdf'));
                unlink(public_path('storage/inscription_files/' . $school->document));
            }

            $res_upd_school = $school->update(array_merge($school_request->except(['document', 'tel']), [
                'id' => generateDBTableId(30, "App\Models\School"),
                'owner' => $school_request->first_name . ' ' . $school_request->last_name,
                'owner_lastname' => $school_request->last_name,
                'owner_firstname' => $school_request->first_name,
                'tel' => $school_request->indicatif . $school_request->tel,
                'document' => $document,
                'status' => "INITIE"
            ]));

            $res_upd_user = $user_to_upd->update([
                'last_name' => $school_request->last_name,
                'first_name' => $school_request->first_name,
                'email' => $school_request->email,
                'password' => Hash::make($school_request->password),
            ]);

            if ($res_upd_school && $res_upd_user) {
                DB::commit();
                return $school;
            }
        }


        if ($school_request->type == 'ecole') { //Inscription of school
            if (School::create(array_merge($school_request->except(['document', 'tel']), [
                'id' => generateDBTableId(30, "App\Models\School"),
                'owner' => $school_request->first_name . ' ' . $school_request->last_name,
                'owner_lastname' => $school_request->last_name,
                'owner_firstname' => $school_request->first_name,
                'tel' => $school_request->indicatif . $school_request->tel,
                'document' => $document
            ]))) {

                $user = User::create([
                    'id' => generateDBTableId(30, "App\Models\User"),
                    'last_name' => $school_request->last_name,
                    'first_name' => $school_request->first_name,
                    'email' => $school_request->email,
                    'password' => Hash::make($school_request->password),
                ]);
                DB::commit();
                return $user;
            }
        } else {
            DB::rollBack();
            throw new ScolarException("Inscription parent non encore disponible.", 422);
        }
    }

    public function getCodeVerificarion(Request $school_request)
    {
        $email_to_test = School::where('email', $school_request->email)->first();

        if ($email_to_test) {
            throw new ScolarException("Il existe déjà un espace école associé à cette adresse mail.");
        }

        //Generate verification email code
        $code = $this->generateCodeOfVerification();
        $response = MailVerification::create([
            'email' => $school_request->email,
            'code' => $code,
            // 30 min pour utiliser le code sinon regénérer
            'expires_at' => Carbon::now()->addMinutes(30)
        ]);

        if ($response) {
            EmailScolarTemplateJob::dispatch(
                $school_request->email,
                ['code' => $code],
                'emails.emailVerification',
                'Vérification de compte mail',
                env("APP_NAME"),
                'Merci de taper le code reçu sur la page de vérification de mail sur notre plateforme pour continuer
                        votre demande d\'inscription. Ce code expire dans 30 minutes.'
            );
        } else {
            throw new ScolarException("Une erreur est survenue. Merci de réessayer");
        }
    }


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

    public function codeVerification(Request $request)
    {
        $res = MailVerification::where('email', $request->email)->where('code', $request->code)
        ->where('expires_at', '>', now())->first();
        if (!$res) {
            throw new ScolarException("Code invalide ou code expiré après 30 min");
        }
    }

    //Resend verification code
    public function getNewCodeOfVerification(Request $request)
    {

        if ($request->email) {
            //Verify is email already exist
            $email_to_test = User::where('email', $request->email)->first();

            if ($email_to_test) {
                throw new ScolarException("Il existe déjà un espace école associé à cette adresse mail");
            }

            //Generate verification email code
            $code = $this->generateCodeOfVerification();
            $response = MailVerification::where('email', $request->email)->update(['code' => $code,
        'expires_at' => Carbon::now()->addMinutes(30)]);
            if ($response) {
                EmailScolarTemplateJob::dispatch(
                    $request->email,
                    ['code' => $code],
                    'emails.emailVerification',
                    'Vérification de compte mail',
                    env("APP_NAME"),
                    'Merci de taper ce nouveau code reçu sur la page de vérification de mail sur notre plateforme pour continuer
                        votre demande d\'inscription.'
                );
            } else {
                throw new ScolarException("Merci de réessayer.");
            }
        } else {
            throw new ScolarException("Adresse mail inexistant pour renvoyer le code.");
        }
    }

    // Validate inscription and change status of school inscription
    public function changeStatus(Request $request)
    {
        $message = '';
        $msg = '';
        $data = School::find($request->id);
        if (!$data) {
            throw new ScolarException("Cette demande d'inscription n\'existe plus dans le système.");
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

        EmailScolarTemplateJob::dispatch(
            [
                // env("ADMIN_MAIL_1"),
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
        $data['data'] = $data;
        $data['msg'] = $msg;

        return  $data;
    }
}
