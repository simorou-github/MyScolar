<?php

namespace App\Services;

use App\Exceptions\ScolarException;
use App\Jobs\EmailScolarTemplateJob;
use App\Models\ParentOtp;
use Carbon\Carbon;

/**
 * Centralise la génération, l'envoi (email + SMS via FasterMessage) et la
 * vérification des codes OTP utilisés par l'espace Parent (inscription et connexion).
 */
class ParentOtpService
{
    public function __construct(protected FasterMessageService $fasterMessage)
    {
    }

    public function generateCode(): string
    {
        return (string) random_int(100000, 999999);
    }

    public function sendEmailOtp(string $email, string $purpose, string $firstName = ''): void
    {
        $code = $this->generateCode();

        ParentOtp::where('email', $email)->where('channel', 'EMAIL')->where('purpose', $purpose)
            ->where('consumed', false)->update(['consumed' => true]);

        ParentOtp::create([
            'channel' => 'EMAIL',
            'purpose' => $purpose,
            'email' => $email,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes((int) env('EMAIL_CODE_VALIDITY_TIME', 30)),
        ]);

        EmailScolarTemplateJob::dispatch(
            $email,
            ['code' => $code, 'first_name' => $firstName],
            'emails.emailVerification',
            'Code de vérification - Espace Parent',
            env('APP_NAME'),
            'Merci de saisir le code reçu pour valider votre adresse mail sur l\'Espace Parent Scolar Plus.
            Ce code expire dans ' . env('EMAIL_CODE_VALIDITY_TIME', 30) . ' minutes.'
        );
    }

    public function sendSmsOtp(string $phone, string $purpose): void
    {
        $code = $this->generateCode();

        ParentOtp::where('phone', $phone)->where('channel', 'SMS')->where('purpose', $purpose)
            ->where('consumed', false)->update(['consumed' => true]);

        ParentOtp::create([
            'channel' => 'SMS',
            'purpose' => $purpose,
            'phone' => $phone,
            'code' => $code,
            'expires_at' => Carbon::now()->addMinutes((int) env('SMS_CODE_VALIDITY_TIME', 10)),
        ]);

        $this->fasterMessage->sendSms(
            $phone,
            'Scolar Plus : votre code de vérification est ' . $code . '. Il expire dans ' . env('SMS_CODE_VALIDITY_TIME', 10) . ' minutes.'
        );
    }

    /**
     * Envoie un seul et même code OTP simultanément par email et par SMS
     * (utilisé pour la connexion : le parent saisit un seul code reçu sur l'un des deux canaux).
     */
    public function sendLoginOtp(string $email, string $phone, string $firstName = ''): void
    {
        $code = $this->generateCode();
        $expiresAt = Carbon::now()->addMinutes((int) env('SMS_CODE_VALIDITY_TIME', 10));

        ParentOtp::where('email', $email)->where('purpose', 'LOGIN')->where('consumed', false)->update(['consumed' => true]);
        ParentOtp::where('phone', $phone)->where('purpose', 'LOGIN')->where('consumed', false)->update(['consumed' => true]);

        ParentOtp::create(['channel' => 'EMAIL', 'purpose' => 'LOGIN', 'email' => $email, 'code' => $code, 'expires_at' => $expiresAt]);
        ParentOtp::create(['channel' => 'SMS', 'purpose' => 'LOGIN', 'phone' => $phone, 'code' => $code, 'expires_at' => $expiresAt]);

        EmailScolarTemplateJob::dispatch(
            $email,
            ['code' => $code, 'first_name' => $firstName],
            'emails.emailVerification',
            'Code de connexion - Espace Parent',
            env('APP_NAME'),
            'Merci de saisir ce code pour confirmer votre connexion à votre Espace Parent. Ce code expire dans ' . env('SMS_CODE_VALIDITY_TIME', 10) . ' minutes.'
        );

        $this->fasterMessage->sendSms(
            $phone,
            'Scolar Plus : votre code de connexion est ' . $code . '. Il expire dans ' . env('SMS_CODE_VALIDITY_TIME', 10) . ' minutes.'
        );
    }

    /**
     * Vérifie un code de connexion envoyé sur les deux canaux (email + sms partagent le même code).
     *
     * @throws ScolarException
     */
    public function verifyLoginOtp(string $email, string $phone, string $code): void
    {
        $otp = ParentOtp::where('purpose', 'LOGIN')
            ->where(function ($q) use ($email, $phone) {
                $q->where('email', $email)->orWhere('phone', $phone);
            })
            ->where('consumed', false)
            ->latest('id')
            ->first();

        if (!$otp) {
            throw new ScolarException('Aucun code n\'a été envoyé pour cette demande. Merci de redemander un code.');
        }

        if ($otp->expires_at->isPast()) {
            throw new ScolarException('Ce code a expiré. Merci de redemander un nouveau code.');
        }

        if ($otp->code !== $code) {
            throw new ScolarException('Le code saisi est incorrect.');
        }

        ParentOtp::where('purpose', 'LOGIN')
            ->where(function ($q) use ($email, $phone) {
                $q->where('email', $email)->orWhere('phone', $phone);
            })
            ->where('consumed', false)
            ->update(['consumed' => true]);
    }

    /**
     * @throws ScolarException
     */
    public function verifyOtp(string $channel, string $identifier, string $code, string $purpose): void
    {
        $field = $channel === 'EMAIL' ? 'email' : 'phone';

        $otp = ParentOtp::where($field, $identifier)
            ->where('channel', $channel)
            ->where('purpose', $purpose)
            ->where('consumed', false)
            ->latest('id')
            ->first();

        if (!$otp) {
            throw new ScolarException('Aucun code n\'a été envoyé pour cette demande. Merci de redemander un code.');
        }

        if ($otp->expires_at->isPast()) {
            throw new ScolarException('Ce code a expiré. Merci de redemander un nouveau code.');
        }

        if ($otp->code !== $code) {
            throw new ScolarException('Le code saisi est incorrect.');
        }

        $otp->update(['consumed' => true]);
    }
}
