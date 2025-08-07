<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        // Gère toutes les exceptions dans les requêtes API
        $this->renderable(function (Throwable $e, Request $request) {
            if ($request->expectsJson()) {
                // Définit le message d'erreur et le code HTTP par défaut
                $message = 'Une erreur est survenue.';
                $code = 500;

                // Spécifie les messages et codes pour des exceptions connues
                if ($e instanceof NotFoundHttpException) {
                    $message = 'Ressource ou page non trouvée.';
                    $code = 404;
                } elseif ($e instanceof ValidationException) {
                    $message = 'Les données fournies sont invalides.';
                    $code = 422;
                    // Optionnel : renvoyer les erreurs de validation
                    Log::error($e);
                    return response()->json([
                        'error' => $message,
                        'code' => $code,
                        'errors' => $e->errors(),
                    ], $code);
                } elseif ($e instanceof AuthenticationException) {
                    $message = 'Accès non autorisé.';
                    $code = 401;
                } elseif ($e instanceof ThrottleRequestsException) {
                    $retry_after = (int) $e->getHeaders()['Retry-After'];
                    $minutes = ceil($retry_after / 60);
                    $message = "Vous avez effectué trop de tentatives. Réessayez dans environ {$minutes} minute(s).";
                    $code = 429;
                }
                // Si vous avez une ScolarException
                elseif ($e instanceof ScolarException) {
                    $message = $e->getMessage();
                    $code = 422;
                }

                // Renvoie une réponse JSON générique
                return response()->json([
                    'error' => $message,
                    'code' => $code,
                ], $code);
            }
        });

        $this->reportable(function (Throwable $e) {
            // Log toutes les exceptions
        });
    }
}