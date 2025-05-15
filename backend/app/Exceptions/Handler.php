<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        // Pour les appels API, on renvoie tout en JSON
        $this->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Ressource ou page non trouvée.',
                    'code' => 404
                ], 404);
            }
        });

        // Validation
        $this->renderable(function (ValidationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Les données fournies sont invalides.',
                    'code' => 422,
                ], 422);
            }
        });

        // Authentification
         $this->renderable(function (AuthenticationException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Accès non autorisé.',
                    'code' => 401,
                ], 401);
            }
        });

        // Exception de Scolar
         $this->renderable(function (ScolarException $e, Request $request) {
            if ($request->expectsJson()) {
                Log::info(get_class($e));
                return response()->json([
                    'error' => $e->getMessage(),
                    'code' => 422,
                ], 422);
            }
        });

        $this->reportable(function (Throwable $e) {
            //
        });
    }
}
