<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Veuillez saisir vos identifiants.',
                ], 500);
            }

            $user = User::with('school')->where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'message' => 'Vos paramètres de connexion sont incorrects.',
                    'data' => []
                ], 500);
            }

            if (/*$user->school_id == NULL || */$user->status ==  0) {
                return response()->json([
                    'message' => 'Votre compte n\'est pas activé. Veuillez contacter le Groupe Scolar Plus.',
                    'data' => []
                ], 500);
            }


            if (!$token = auth()->attempt($validator->validated())) {
                return response()->json([
                    'message' => 'Vos paramètres de connexion sont incorrects.',
                ], 500);
            }
            return $this->createNewToken($token);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json([
                'message' => 'Impossible de valider vos identifiants.',
                'data' => [],
            ], 500);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token)
    {

        return response()->json([
            'message' => 'Connexion réussie.',
            'access_token' => $token,
            'status' => 200,
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();
        return response()->json([
            'message' => 'Utilisateur déconnecté avec succès',
        ], 205);
    }
}
