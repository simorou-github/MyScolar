<?php

namespace App\Exceptions;


use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Client\RequestException;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        return response()->json(['message' => 'Accès non autorisé. Veuillez vous authentifier.'], Response::HTTP_UNAUTHORIZED);
    }

    public function render($request, Throwable $exception)
    {
        if ($request->is('api/*')) {

            if ($exception instanceof AuthenticationException) {
                Log::error($exception);
                return response()->json([
                    'message' => 'Accès non autorisé. Veuillez vous authentifier.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Exceptions métiers
            if ($exception instanceof ScolarException) {
                Log::error($exception);

                return response()->json([
                    'message' => $exception->getMessage(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if ($exception instanceof ValidationException) {
                Log::error($exception);

                return response()->json([
                    'message' => 'Les données fournies ne sont pas valides.',
                    'errors' => $exception->errors(),
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Ressource non trouvée via model binding
            if ($exception instanceof ModelNotFoundException) {
                // $model = class_basename($exception->getModel());
                Log::error($exception);

                return response()->json([
                    'message' => "Aucune information trouvée pour l'identifiant spécifié.",
                ], Response::HTTP_NOT_FOUND);
            }

            // Autorisation refusée
            if ($exception instanceof UnauthorizedException) {
                Log::error($exception);

                return response()->json([
                    'message' => 'Vous n\'êtes pas autorisé(e) à accéder à ces informations. Veuillez contacter l\'administrateur.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            if ($exception instanceof RequestException) {
                Log::error($exception);

                return response()->json([
                    'message' => 'Token invalide ou expiré',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Erreurs de base de données
            if ($exception instanceof QueryException) {
                $code = $exception->errorInfo[1] ?? null;
                Log::error($exception);

                if ($code == 1062) { // Violation de contrainte d'unicité
                    return response()->json([
                        'message' => 'Cette ressource existe déjà.',
                    ], Response::HTTP_CONFLICT);
                }

                if ($code == 1265) { // Troncation de données
                    return response()->json([
                        'message' => 'Les données fournies sont trop longues ou mal formatées.',
                    ], Response::HTTP_BAD_REQUEST);
                }

                return response()->json([
                    'message' => 'Une erreur de base de données est survenue.',
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            // Catch-all pour toutes les autres erreurs
            Log::error($exception);

            return response()->json([
                'message' => 'Une erreur interne est survenue. Veuillez réessayer.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Pour les requêtes non-API, comportement Laravel par défaut
        return parent::render($request, $exception);
    }
}
