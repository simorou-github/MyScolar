<?php

namespace App\Http\Controllers\ParentSpace;

use App\Http\Controllers\Controller;
use App\Services\ParentInscriptionService;
use Illuminate\Http\Request;

class ParentInscriptionController extends Controller
{
    public function __construct(protected ParentInscriptionService $service)
    {
    }

    // Étape 1 : saisie email -> envoi OTP email
    public function sendEmailOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $this->service->preRegisterAndSendEmailOtp($request);
        return response()->json(['message' => 'Code de vérification envoyé par mail.', 'status' => 200]);
    }

    public function verifyEmailOtp(Request $request)
    {
        $request->validate(['email' => 'required|email', 'code' => 'required']);
        $this->service->verifyEmailOtp($request);
        return response()->json(['message' => 'Adresse mail vérifiée avec succès.', 'status' => 200]);
    }

    public function resendEmailOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $this->service->resendEmailOtp($request);
        return response()->json(['message' => 'Nouveau code envoyé par mail.', 'status' => 200]);
    }

    // Étape 2 : saisie téléphone -> envoi OTP sms (FasterMessage)
    public function sendPhoneOtp(Request $request)
    {
        $request->validate(['email' => 'required|email', 'phone' => 'required|string']);
        $this->service->sendPhoneOtp($request);
        return response()->json(['message' => 'Code de vérification envoyé par SMS.', 'status' => 200]);
    }

    public function verifyPhoneOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string', 'code' => 'required']);
        $this->service->verifyPhoneOtp($request);
        return response()->json(['message' => 'Numéro de téléphone vérifié avec succès.', 'status' => 200]);
    }

    // Étape 3 : finalisation de l'inscription (nom, pays, recaptcha)
    public function createInscription(Request $request)
    {
        $request->validate([
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'country_id' => 'required|integer',
            'recaptcha_token' => 'required|string',
        ]);

        $this->service->createParentInscription($request);
        return response()->json([
            'message' => "Inscription enregistrée avec succès. Le Groupe Scolar Plus traitera votre demande et vous recevrez un lien d'activation par email.",
            'status' => 201,
        ], 201);
    }

    public function activateAccount(Request $request)
    {
        $request->validate(['token' => 'required|string']);
        $parent = $this->service->activateAccount($request->token);
        return response()->json([
            'message' => 'Votre Espace Parent a été activé avec succès. Vous pouvez maintenant vous connecter.',
            'data' => ['email' => $parent->email],
            'status' => 200,
        ]);
    }

    // --- Administration ScolarPlus ---

    public function listInscriptionsPending(Request $request)
    {
        $data = $this->service->listInscriptionsPending($request);
        return response()->json(['data' => $data, 'nb_data' => $data->count(), 'status' => 200]);
    }

    public function listInscriptionsValidated(Request $request)
    {
        $data = $this->service->listInscriptionsValidated($request);
        return response()->json(['data' => $data, 'nb_data' => $data->count(), 'status' => 200]);
    }

    public function changeStatus(Request $request)
    {
        $request->validate(['id' => 'required', 'status' => 'required|in:VALIDE,REJETE,INACTIF']);
        $data = $this->service->changeStatus($request);
        return response()->json(['data' => $data, 'message' => 'Statut mis à jour avec succès.', 'status' => 200]);
    }
}
