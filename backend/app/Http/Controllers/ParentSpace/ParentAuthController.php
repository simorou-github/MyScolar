<?php

namespace App\Http\Controllers\ParentSpace;

use App\Http\Controllers\Controller;
use App\Services\ParentAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ParentAuthController extends Controller
{
    public function __construct(protected ParentAuthService $service)
    {
    }

    public function requestLoginOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string']);
        $this->service->requestLoginOtp($request);
        return response()->json([
            'message' => 'Un code de vérification vous a été envoyé par email et par SMS.',
            'status' => 200,
        ]);
    }

    public function verifyLoginOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string', 'code' => 'required']);
        $result = $this->service->verifyLoginOtp($request);
        return response()->json([
            'message' => 'Connexion réussie.',
            'access_token' => $result['access_token'],
            'expires_in' => $result['expires_in'],
            'data' => $result['parent'],
            'status' => 200,
        ]);
    }

    public function me()
    {
        return response()->json(['data' => Auth::guard('parent-api')->user(), 'status' => 200]);
    }

    public function logout()
    {
        Auth::guard('parent-api')->logout();
        return response()->json(['message' => 'Déconnexion réussie.', 'status' => 205]);
    }
}
