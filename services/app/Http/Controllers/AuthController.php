<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'login', 'generateCodeOfVerification',
            'getCodeOfVerification', 'codeVerification', 'getNewCodeOfVerification',
            'activateAccount', 'resetPassword', 'changePassword'
        ]]);
    }
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
                    'status' => 500
                ]);
            }

            $user = User::with('school')->where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'message' => 'Vos paramètres de connexion sont incorrects.',
                    'data' => [],
                    'status' => 500
                ]);
            }

            if (/*$user->school_id == NULL || */$user->status ==  0) {
                return response()->json([
                    'message' => 'Votre compte n\'est pas activé. Veuillez contacter le Groupe Scolar Plus.',
                    'data' => [],
                    'status' => 500
                ]);
            }


            if (!$token = auth()->attempt($validator->validated())) {
                return response()->json([
                    'message' => 'Vos paramètres de connexion sont incorrects.',
                    'status' => 500
                ]);
            }
            return $this->createNewToken($token);
        } catch (Exception $e) {
            Log::info($e);
            return response()->json([
                'message' => 'Impossible de valider vos identifiants.',
                'data' => [],
                'status' => 500
            ]);
        }
    }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */


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
            'status' => 205
        ]);
    }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */

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



    public function activateAccount(Request $request)
    {

        try {
            $email = $request->email;
            $pwd = $request->password;
            $type = $request->type;
            $knw = $request->knw;

            if ($email == null || !$email) {
                return response()->json([
                    'message' => 'L\'adresse mail est n\'existe pas dans le système',
                    'status' => 300
                ]);
            }

            $user = User::where('email', $email)->first();

            if ($type != 'v1' || !password_verify($user->last_name . $user->first_name, $knw)) {
                return response()->json([
                    'message' => 'Veuillez suivre la procédure d\'un compte Scolar Plus.',
                    'status' => 300
                ]);
            }

            if ($user->email_verified_at != null || $user->email_verified_at != '') {
                return response()->json([
                    'message' => 'Ce compte a déjà été activé. Merci de contacter le groupe Scolar Plus
                    pour plus d\'informations.',
                    'status' => 302
                ]);
            }

            if ($email != null) {
                User::where('email', $email)->update([
                    'password' => Hash::make($pwd), 'status' => 1,
                    'email_verified_at' => Carbon::now()
                ]);
                return response()->json([
                    'message' => 'Compte activé avec succès',
                    'status' => 200
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

    // To send mail with mail to change password
    public function resetPassword(Request $request)
    {
        $email = trim($request->email);
        try {

            if ($email == null || !$email) {
                return response()->json([
                    'message' => 'L\'adresse mail est indisponible',
                    'status' => 500
                ]);
            }
            $user = User::where('email', $email)->first();

            if ($user == null || !$user) {
                return response()->json([
                    'message' => 'Cette adresse mail n\'existe pas dans le système.',
                    'status' => 300
                ]);
            }

            if ($user->status == 0) {
                return response()->json([
                    'message' => 'Ce compte n\'est pas activé.',
                    'status' => 300
                ]);
            }

            if ($user != null || $user) {
                Log::info($request->email);
                sendMail(
                    [
                        trim($request->email)
                    ],
                    [
                        'email' => trim($request->email),
                        'last_name' => $user->last_name, 'first_name' => $user->first_name,
                        'code' => password_hash($user->last_name . $user->first_name, PASSWORD_DEFAULT)
                    ],
                    'emails.resetPassword',
                    'REDEFINITION DE MOT DE PASSE',
                    env("APP_NAME"),
                    'Merci de cliquer sur le bouton ci-dessous pour redefinir votre mot de passe.'
                );
                

                return response()->json([
                    'message' => 'Email envoyé avec succès',
                    'status' => 200
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

    // To change the passord after forgeting old pwd
    public function changePassword(Request $request)
    {
        $email = $request->email;
        $pwd = $request->password;
        $type = $request->type;
        $knw = $request->knw;
        try {

            if ($email == null || !$email) {
                return response()->json([
                    'message' => 'L\'adresse mail est indisponible',
                    'status' => 300
                ]);
            }

            $user = User::where('email', $email)->first();
            if ($type != 'v2' || !password_verify($user->last_name . $user->first_name, $knw)) {
                return response()->json([
                    'message' => 'Veuillez suivre la procédure de redéfinition du mot de passe.',
                    'status' => 300
                ]);
            }


            if ($user->email_verified_at == null || $user->email_verified_at == '') {
                return response()->json([
                    'message' => 'Ce compte n\'a pas encore été activé. Contactez 
                 l\'administrateur pour plus d\'informations.',
                    'status' => 302
                ]);
            }


            if ($email != null) {
                User::where('email', $email)->update([
                    'password' => Hash::make($pwd)
                ]);
                return response()->json([
                    'message' => 'Mot de passe changé avec succès',
                    'status' => 200
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
}
