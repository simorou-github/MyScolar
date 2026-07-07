<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

/**
 * Vérifie le jeton "je ne suis pas un robot" (Google reCAPTCHA) côté serveur.
 */
class RecaptchaService
{
    public function verify(?string $token, ?string $remoteIp = null): bool
    {
        $secret = config('services.recaptcha.secret_key');

        // Pas de clé configurée (environnement de dev) : on ne bloque pas l'inscription.
        if (!$secret) {
            Log::info('[Recaptcha:SIMULATION] Vérification ignorée (clé secrète absente).');
            return true;
        }

        if (!$token) {
            return false;
        }

        try {
            $client = new Client(['timeout' => 10]);
            $response = $client->post(config('services.recaptcha.verify_url'), [
                'form_params' => [
                    'secret' => $secret,
                    'response' => $token,
                    'remoteip' => $remoteIp,
                ],
            ]);

            $body = json_decode((string) $response->getBody(), true);
            return (bool) ($body['success'] ?? false);
        } catch (\Throwable $e) {
            Log::error('[Recaptcha] Echec de vérification : ' . $e->getMessage());
            return false;
        }
    }
}
