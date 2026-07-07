<?php

namespace App\Services;

use App\Exceptions\ScolarException;
use App\Models\ParentUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentAuthService
{
    public function __construct(protected ParentOtpService $otpService)
    {
    }

    /**
     * Vérifie le couple email + téléphone et envoie un OTP sur les deux canaux.
     */
    public function requestLoginOtp(Request $request): void
    {
        $parent = ParentUser::where('phone', $request->phone)->first();

        if (!$parent) {
            throw new ScolarException("Aucun Espace Parent n'est associé à ce numéro de téléphone.");
        }

        if ($parent->status !== 'VALIDE') {
            throw new ScolarException("Votre Espace Parent n'est pas encore actif. Merci de patienter la validation par le Groupe Scolar Plus ou d'activer votre compte via le lien reçu par mail.");
        }

        $this->otpService->sendLoginOtp($parent->email, $parent->phone, $parent->first_name);
    }

    /**
     * Vérifie l'OTP (envoyé par email, saisi une seule fois côté UI mais
     * vérifié sur les deux canaux pour garantir la possession des deux identifiants)
     * et retourne un token JWT pour l'espace parent.
     */
    public function verifyLoginOtp(Request $request): array
    {
        $parent = ParentUser::where('phone', $request->phone)->first();

        if (!$parent || $parent->status !== 'VALIDE') {
            throw new ScolarException('Connexion impossible. Merci de redemander un code.');
        }

        $this->otpService->verifyLoginOtp($parent->email, $parent->phone, $request->code);

        $token = Auth::guard('parent-api')->login($parent);

        return [
            'access_token' => $token,
            'expires_in' => Auth::guard('parent-api')->factory()->getTTL() * 60,
            'parent' => $parent,
        ];
    }
}
