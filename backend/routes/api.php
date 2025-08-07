<?php

use App\Http\Controllers\AdminSpace\MTNPaymentController;
use App\Http\Controllers\SchoolSpace\CityController;
use App\Http\Controllers\SchoolSpace\FeesManageController;
use App\Http\Controllers\SchoolSpace\SchoolController;
use App\Http\Controllers\SchoolSpace\SchoolInscriptionController;
use App\Http\Controllers\Authentication\AuthController;
use App\Models\School;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminSpace\ParameterController;
use App\Http\Controllers\AdminSpace\RoleController;
use App\Http\Controllers\AdminSpace\ScolarController;
use App\Http\Controllers\AdminSpace\UserContoller;
use App\Http\Controllers\PushNotification\PushNotificationController;
use App\Http\Controllers\SchoolSpace\AcademicYearController;
use App\Http\Controllers\SchoolSpace\ClasseController;
use App\Http\Controllers\SchoolSpace\PaymentController;
use App\Http\Controllers\SchoolSpace\SchoolDashboardController;

// Authentification
Route::post('auth/login', [AuthController::class, 'login']);

// Inscription
Route::post('school/create-inscription', [SchoolInscriptionController::class, 'createInscription']);
Route::post('verify/code', [SchoolInscriptionController::class, 'codeVerification']);

// Vérification du code (avec limitation de débit)
Route::middleware('throttle:3,10')->group(function () {
    Route::post('code/confirmation', [SchoolInscriptionController::class, 'getCodeOfVerification']);
    Route::post('new/code/confirmation', [SchoolInscriptionController::class, 'getNewCodeOfVerification']);
});

// Villes & Pays
Route::get('country/list', [CityController::class, 'list']);
Route::get('city/list', [CityController::class, 'listCities']);
Route::post('country/city/list', [CityController::class, 'listCitiesByCountry']);

// Paiement Public
Route::post('manage-fees/public-search-student-balance', [FeesManageController::class, 'searchStudentFeesBalanceForParentPayment']);

// MTN Paiement
Route::prefix('payment')->group(function () {
    Route::post('create-token', [MTNPaymentController::class, 'createAccessToken']);
    Route::post('process-unique-payment', [MTNPaymentController::class, 'requestToUniquePayment']);
    Route::post('process-batch-payment', [MTNPaymentController::class, 'requestToBatchPayment']);
    Route::get('account-balance', [MTNPaymentController::class, 'requestToAccountBalance']);
});

// Routes de téléchargement de fichiers
Route::get('parameter/distinct-years', [SchoolController::class, 'getDistinctAcademicYears']);
Route::get('/model-apprenant/export-xls', [SchoolController::class, 'exportApprenantModelExcel']);
Route::get('/download-template', function () {
    $filePath = storage_path('app/public/modeles/ModelListeEleve.xlsx');
    if (!file_exists($filePath)) {
        Log::warning('Fichier modèle Excel introuvable : ' . $filePath);
        abort(404);
    }
    return response()->download($filePath, 'ModelListeEleve.xlsx', [
        'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]);
});
Route::get('school/get-file-path/{id}', function ($id) {
    $school = School::find($id);
    $file_path = 'storage/inscription_files/' . $school->document;
    if (!file_exists(public_path($file_path))) {
        abort(404);
    }
    return response()->file(public_path($file_path));
});

Route::middleware(['auth:api'])->group(function () {
    // Routes spécifiques aux écoles
    Route::prefix('school')->group(function () {
        Route::post('detail', [SchoolController::class, 'getSchoolDetail']);
        Route::post('list-inscription-pending', [SchoolInscriptionController::class, 'listInscriptionsPending']);
        Route::post('list-inscription-validated', [SchoolInscriptionController::class, 'listInscriptionsValidated']);
        Route::post('change-inscription-status', [SchoolInscriptionController::class, 'changeStatus']);
        Route::post('change-status', [SchoolInscriptionController::class, 'changeStatus']);
        Route::post('list-classe', [SchoolController::class, 'listSchoolClasse']);
        Route::post('list-student', [SchoolController::class, 'listStudent']);
        Route::post('get-student-with-param', [SchoolController::class, 'getSchoolStudentsWithParam']);
        Route::post('add-one-student', [SchoolController::class, 'addStudentToClasse']);
        Route::post('add-list-student', [SchoolController::class, 'addStudentListToClasse']);
        Route::post('get-fees-details', [SchoolController::class, 'getFeesDetailsById']);
        Route::post('list', [SchoolController::class, 'list']);
        Route::post('create', [SchoolController::class, 'create']);
        Route::post('update', [SchoolController::class, 'update']);
        Route::post('delete', [SchoolController::class, 'delete']);

        // Groupes
        Route::prefix('groupe')->group(function () {
            Route::post('list', [SchoolController::class, 'listGroupe']);
            Route::post('list-actif', [SchoolController::class, 'listActifGroupe']);
            Route::post('create', [SchoolController::class, 'createGroupe']);
            Route::post('change-status', [SchoolController::class, 'changeGroupeStatus']);
            Route::post('delete', [SchoolController::class, 'deleteGroupe']);
        });

        // Statistiques
        Route::prefix('statistic')->group(function () {
            Route::post('transaction-evolution', [SchoolController::class, 'transactionEvolutionByMonth']);
            Route::post('fees-collected', [SchoolController::class, 'staticticsForFeesCollected']);
            Route::post('payment-aggregation-by-typefees', [SchoolController::class, 'paymentAggregationByTypeFees']);
            Route::post('year-payment-per-month', [SchoolController::class, 'yearTransactionPerMonth']);
        });
    });

    // Gestion du tableau de bord
    Route::prefix('manage-dashboard')->group(function () {
        Route::post('verify-fees-assignement', [SchoolDashboardController::class, 'getUnassignedSchoolFees']);
    });

    // Gestion des frais
    Route::prefix('manage-fees')->group(function () {
        Route::post('assign-fees-to-classe', [FeesManageController::class, 'assigneFeesToClasse']);
        Route::post('get-student-balance', [FeesManageController::class, 'getStudentFeesBalance']);
        Route::post('search-student-balance', [FeesManageController::class, 'searchStudentFeesBalanceForParentPayment']);
        Route::post('get-fees-details-data', [FeesManageController::class, 'getFeesDetails']);
        Route::post('get-fees-balance-follow-up-data', [FeesManageController::class, 'getFeesBalanceFollowupData']);
        Route::post('generate-balance/by-type-file', [FeesManageController::class, 'getExportOfFeesBalance']);
        Route::get('get-fees-balance-data-export', [FeesManageController::class, 'getExportOfFeesBalance']);
    });

    // Classes
    Route::prefix('classe')->group(function () {
        Route::get('list', [ClasseController::class, 'list']);
        Route::post('create', [ClasseController::class, 'create']);
        Route::post('delete', [ClasseController::class, 'delete']);
        Route::post('search', [ClasseController::class, 'searchClasse']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('inscription', [PushNotificationController::class, 'getInscriptionPushNotification']);
    });

    // Paramètres
    Route::prefix('parameter')->group(function () {
        Route::post('params-list', [ParameterController::class, 'listParams']);
        Route::post('crud-params', [ParameterController::class, 'crudParams']);
        Route::post('type-fees/list', [ParameterController::class, 'listTypeFees']);
        Route::post('group/list', [ParameterController::class, 'listGroupe']);
        Route::post('group/crud', [ParameterController::class, 'crudGroups']);
        Route::post('type-fees/crud', [ParameterController::class, 'crudTypeFees']);

        // Opérateurs
        Route::prefix('operator')->group(function () {
            Route::post('list', [ParameterController::class, 'listOperator']);
            Route::post('create', [ParameterController::class, 'createOperator']);
            Route::post('delete', [ParameterController::class, 'deleteOperator']);
        });

        Route::get('type-payment/list', [ParameterController::class, 'listTypePayment']);
        Route::post('academic-year/list', [ParameterController::class, 'listAcademicYear']);
    });

    // Années académiques
    Route::prefix('academic-year')->group(function () {
        Route::get('list', [AcademicYearController::class, 'list']);
        Route::post('create', [AcademicYearController::class, 'create']);
        Route::post('delete', [AcademicYearController::class, 'delete']);
    });

    // Paiements
    Route::prefix('payment')->group(function () {
        Route::post('get-history', [PaymentController::class, 'getHistoryOfPayment']);
        Route::post('get-details', [PaymentController::class, 'getPaymentDetails']);
    });

    // Scolar
    Route::prefix('scolar')->group(function () {
        Route::post('statistic/payment-aggregation-by-typefees', [ScolarController::class, 'paymentAggregationByTypeFees']);
        Route::post('statistic/year-payment-per-month', [ScolarController::class, 'yearTransactionPerMonth']);
    });

    // Utilisateurs & Rôles
    Route::get('permissions', [RoleController::class, 'getPermissions']);
    Route::post('manage-user/list', [UserContoller::class, 'userList']);

    Route::apiResource('roles', RoleController::class);
});
