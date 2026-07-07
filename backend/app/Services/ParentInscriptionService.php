<?php

namespace App\Services;

use App\Exceptions\ScolarException;
use App\Jobs\EmailScolarTemplateJob;
use App\Models\ParentUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ParentInscriptionService
{
    public function __construct(
        protected ParentOtpService $otpService,
        protected RecaptchaService $recaptchaService,
    ) {
    }

    public function createParentInscription(Request $request): ParentUser
    {
        if (!$this->recaptchaService->verify($request->input('recaptcha_token'), $request->ip())) {
            throw new ScolarException('La vérification "Je ne suis pas un robot" a échoué. Merci de réessayer.');
        }

        $existing = ParentUser::where('email', $request->email)->first();

        if (!$existing || !$existing->email_verified) {
            throw new ScolarException("Cette adresse mail n'a pas été validée par code. Veuillez recommencer la vérification depuis l'étape 1.");
        }

        if (!$existing->phone_verified) {
            throw new ScolarException("Ce numéro de téléphone n'a pas été validé par code. Veuillez recommencer la vérification depuis l'étape 2.");
        }

        if (in_array($existing->status, ['VALIDE', 'INACTIF'])) {
            throw new ScolarException('Votre Espace Parent est déjà actif. Veuillez vous connecter.');
        }

        DB::beginTransaction();

        $existing->update([
            'last_name' => $request->last_name,
            'first_name' => $request->first_name,
            'country_id' => $request->country_id,
            'status' => 'INITIE',
        ]);

        EmailScolarTemplateJob::dispatch(
            array_filter([env('ADMIN_MAIL_1'), env('ADMIN_MAIL_2')]),
            [
                'last_name' => $existing->last_name,
                'first_name' => $existing->first_name,
                'email' => $existing->email,
                'phone' => $existing->phone,
                'parent_id' => $existing->id,
            ],
            'emails.parentInscriptionNotice',
            'Nouvelle inscription Parent à valider',
            env('APP_NAME'),
            'Une nouvelle demande d\'inscription Parent est en attente de validation sur Scolar Plus.'
        );

        DB::commit();

        return $existing;
    }

    public function preRegisterAndSendEmailOtp(Request $request): void
    {
        // Compte déjà actif (VALIDE ou INACTIF) : bloquer
        if (ParentUser::where('email', $request->email)
            ->whereIn('status', ['VALIDE', 'INACTIF'])
            ->exists()) {
            throw new ScolarException('Cette adresse mail est déjà associée à un espace parent actif. Veuillez vous connecter.');
        }

        $parent = ParentUser::where('email', $request->email)->first();

        if (!$parent) {
            $parent = ParentUser::create([
                'id' => generateDBTableId(30, ParentUser::class),
                'last_name'  => '',
                'first_name' => '',
                'email'      => $request->email,
                'phone'      => '',
                'status'     => 'INITIE',
            ]);
        } else {
            // Compte INITIE ou REJETE : on réinitialise la vérification pour permettre un nouveau départ
            $parent->update([
                'email_verified' => false,
                'phone_verified' => false,
                'phone'          => '',
                'status'         => 'INITIE',
            ]);
            $parent->refresh();
        }

        $this->otpService->sendEmailOtp($request->email, 'INSCRIPTION', $parent->first_name);
    }

    public function verifyEmailOtp(Request $request): void
    {
        $this->otpService->verifyOtp('EMAIL', $request->email, $request->code, 'INSCRIPTION');
        ParentUser::where('email', $request->email)->update(['email_verified' => true]);
    }

    public function resendEmailOtp(Request $request): void
    {
        $parent = ParentUser::where('email', $request->email)->first();
        if (!$parent) {
            throw new ScolarException("Aucune demande d'inscription en cours pour cette adresse mail.");
        }
        $this->otpService->sendEmailOtp($request->email, 'INSCRIPTION', $parent->first_name);
    }

    public function sendPhoneOtp(Request $request): void
    {
        $parent = ParentUser::where('email', $request->email)->first();
        if (!$parent || !$parent->email_verified) {
            throw new ScolarException('Veuillez valider votre adresse mail avant de vérifier votre téléphone.');
        }

        $parent->update(['phone' => $request->phone, 'phone_verified' => false]);
        $this->otpService->sendSmsOtp($request->phone, 'INSCRIPTION');
    }

    public function verifyPhoneOtp(Request $request): void
    {
        $this->otpService->verifyOtp('SMS', $request->phone, $request->code, 'INSCRIPTION');
        ParentUser::where('phone', $request->phone)->update(['phone_verified' => true]);
    }

    public function listInscriptionsPending(Request $request)
    {
        $params = [['status', '=', 'INITIE']];
        if ($request->email) {
            $params[] = ['email', 'LIKE', '%' . $request->email . '%'];
        }
        return ParentUser::with('country')->where($params)->orderBy('created_at', 'DESC')->get();
    }

    public function listInscriptionsValidated(Request $request)
    {
        $params = [];
        if ($request->email) {
            $params[] = ['email', 'LIKE', '%' . $request->email . '%'];
        }
        return ParentUser::with('country')->whereIn('status', ['VALIDE', 'REJETE', 'INACTIF'])
            ->where($params)->orderBy('created_at', 'DESC')->get();
    }

    public function changeStatus(Request $request): ParentUser
    {
        $parent = ParentUser::find($request->id);
        if (!$parent) {
            throw new ScolarException("Cette demande d'inscription n'existe plus dans le système.");
        }

        $message = '';

        DB::beginTransaction();

        if ($request->status === 'VALIDE') {
            $token = Str::random(48);
            $parent->update([
                'status' => 'VALIDE',
                'activation_token' => $token,
            ]);
            $message = 'Votre inscription a été validée. Cliquez sur le lien ci-dessous pour activer votre Espace Parent.';

            EmailScolarTemplateJob::dispatch(
                $parent->email,
                [
                    'first_name' => $parent->first_name,
                    'last_name' => $parent->last_name,
                    'activation_link' => rtrim(env('PARENT_SPACE_URL', env('APP_URL')), '/') . '/activation/' . $token,
                ],
                'emails.parentInscriptionValidated',
                'Votre Espace Parent Scolar Plus est prêt',
                env('APP_NAME'),
                $message
            );
        } elseif ($request->status === 'REJETE') {
            $parent->update([
                'status' => 'REJETE',
                'reject_reason' => $request->reject_reason,
            ]);
            $message = 'Votre demande d\'inscription a été rejetée. Merci de lire le motif puis de soumettre une nouvelle demande.';

            EmailScolarTemplateJob::dispatch(
                $parent->email,
                [
                    'first_name' => $parent->first_name,
                    'reason' => $request->reject_reason,
                ],
                'emails.parentInscriptionRejected',
                'Votre inscription Espace Parent a été rejetée',
                env('APP_NAME'),
                $message
            );
        } elseif ($request->status === 'INACTIF') {
            $parent->update(['status' => 'INACTIF']);
            $message = 'Votre compte Espace Parent a été désactivé. Merci de contacter le Groupe Scolar Plus.';
        }

        DB::commit();

        return $parent;
    }

    public function activateAccount(string $token): ParentUser
    {
        $parent = ParentUser::where('activation_token', $token)->where('status', 'VALIDE')->first();
        if (!$parent) {
            throw new ScolarException("Ce lien d'activation est invalide ou a déjà été utilisé.");
        }

        $parent->update([
            'activation_token' => null,
            'activated_at' => now(),
        ]);

        return $parent;
    }
}
