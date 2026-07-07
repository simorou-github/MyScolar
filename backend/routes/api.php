<?php

use App\Http\Controllers\AdminSpace\ActivityLogController;
use App\Http\Controllers\AdminSpace\MTNPaymentController;
use App\Http\Controllers\SchoolSpace\CityController;
use App\Http\Controllers\SchoolSpace\FeesManageController;
use App\Http\Controllers\SchoolSpace\SchoolController;
use App\Http\Controllers\SchoolSpace\SchoolInscriptionController;
use App\Http\Controllers\Authentication\AuthController;
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
use App\Http\Controllers\ParentSpace\ParentInscriptionController;
use App\Http\Controllers\ParentSpace\ParentAuthController;
use App\Http\Controllers\ParentSpace\ParentStudentLinkController;
use App\Http\Controllers\ParentSpace\ParentFeesController;
use App\Models\School;

// Authentification
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('change-pwd', [AuthController::class, 'changePassword']);

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

Route::prefix('school')->middleware(['auth:api'])->group(function () {
    Route::post('detail', [SchoolController::class, 'getSchoolDetail']);
    Route::post('change-inscription-status', [SchoolInscriptionController::class, 'changeStatus']);
    Route::post('list-inscription-pending', [SchoolInscriptionController::class, 'listInscriptionsPending']);
    Route::post('list-inscription-validated', [SchoolInscriptionController::class, 'listInscriptionsValidated']);
    Route::post('change-status', [SchoolInscriptionController::class, 'changeStatus']);
    Route::post('list', [SchoolController::class, 'list']);
    Route::post('create', [SchoolController::class, 'create']);
    Route::post('update', [SchoolController::class, 'update']);
    Route::post('delete', [SchoolController::class, 'delete']);
    Route::post('create-classe', [SchoolController::class, 'createSchoolClasse']);
    Route::post('list-classe', [SchoolController::class, 'listSchoolClasse']);
    Route::post('list-student', [SchoolController::class, 'listStudent']);
    Route::post('get-student-with-param', [SchoolController::class, 'getSchoolStudentsWithParam']);
    Route::post('add-one-student', [SchoolController::class, 'addStudentToClasse']);
    Route::post('add-list-student', [SchoolController::class, 'addStudentListToClasse']);
    Route::post('get-fees-details', [SchoolController::class, 'getFeesDetailsById']);
    Route::post('groupe/list', [SchoolController::class, 'listGroupe']);
    Route::post('groupe-actif/list', [SchoolController::class, 'listActifGroupe']);
    Route::post('groupe/create', [SchoolController::class, 'createGroupe']);
    Route::post('groupe/change-status', [SchoolController::class, 'changeGroupeStatus']);
    Route::post('groupe/delete', [SchoolController::class, 'deleteGroupe']);
    Route::post('statistic/transaction-evolution', [SchoolController::class, 'transactionEvolutionByMonth']);
    Route::post('statistic/fees-collected', [SchoolController::class, 'staticticsForFeesCollected']);
    Route::post('statistic/payment-aggregation-by-typefees', [SchoolController::class, 'paymentAggregationByTypeFees']);
    Route::post('statistic/year-payment-per-month', [SchoolController::class, 'yearTransactionPerMonth']);
});


//Manage Dashboard   
Route::prefix('manage-dashboard')->middleware(['auth:api'])->group(function () {
    Route::post('verify-fees-assignement', [SchoolDashboardController::class, 'getUnassignedSchoolFees']);
});

// Manage Public Search Fees  
Route::prefix('manage-fees')->group(function () {
    Route::post('public-search-student-balance', [FeesManageController::class, 'searchStudentFeesBalanceForParentPayment']);
});

// Manage Fees   
Route::prefix('manage-fees')->middleware(['auth:api'])->group(function () {
    Route::post('assign-fees-to-classe', [FeesManageController::class, 'assigneFeesToClasse']);
    Route::post('get-student-balance', [FeesManageController::class, 'getStudentFeesBalance']);
    Route::post('search-student-balance-for-caisse', [FeesManageController::class, 'searchStudentFeesBalanceForCaissePayment']);
    Route::post('get-fees-details-data', [FeesManageController::class, 'getFeesDetails']);
    Route::post('get-fees-balance-follow-up-data', [FeesManageController::class, 'getFeesBalanceFollowupData']);
    Route::get('get-fees-balance-data-export', [FeesManageController::class, 'getExportOfFeesBalance']);
    Route::post('generate-balance/by-type-file', [FeesManageController::class, 'getExportOfFeesBalance']);
});

// Publics Routes
Route::prefix('public')->group(function () {
    Route::post('academic-year/public-list', [ParameterController::class, 'listAcademicYear']);
});

// // All about classe of the system
Route::prefix('classe')->middleware(['auth:api'])->group(function () {
    Route::get('list', [ClasseController::class, 'list']);
    Route::post('create', [ClasseController::class, 'create']);
    Route::post('delete', [ClasseController::class, 'delete']);
    Route::post('search', [ClasseController::class, 'searchClasse']);
});

// All about push notifications of the system
Route::prefix('notifications')->middleware(['auth:api'])->group(function () {
    Route::get('inscription', [PushNotificationController::class, 'getInscriptionPushNotification']);
});

// // All parameters of the system
Route::get('parameter/distinct-years', [SchoolController::class, 'getDistinctAcademicYears']);
Route::post('parameter/academic-year/list', [ParameterController::class, 'listAcademicYear']);

Route::prefix('parameter')->middleware(['auth:api'])->group(function () {
    Route::post('params-list', [ParameterController::class, 'listParams']);
    Route::post('crud-params', [ParameterController::class, 'crudParams']);
    Route::post('type-fees/list', [ParameterController::class, 'listTypeFees']);
    Route::post('group/list', [ParameterController::class, 'listGroupe']);
    Route::post('operator/list', [ParameterController::class, 'listOperator']);
    Route::post('operator/create', [ParameterController::class, 'createOperator']);
    Route::post('operator/delete', [ParameterController::class, 'deleteOperator']);
    Route::get('type-payment/list', [ParameterController::class, 'listTypePayment']);
    Route::post('type-fees/crud', [ParameterController::class, 'crudTypeFees']);
    Route::post('group/crud', [ParameterController::class, 'crudGroups']);
});

// Academic years
Route::group(['prefix' => 'academic-year'], function () {
    Route::get('list', [AcademicYearController::class, 'list']);
    Route::post('create', [AcademicYearController::class, 'create']);
    Route::post('delete', [AcademicYearController::class, 'delete']);
});

// Payment
Route::middleware(['auth:api'])->post('payment/get-history', [PaymentController::class, 'getHistoryOfPayment']);
Route::middleware(['auth:api'])->post('payment/get-details', [PaymentController::class, 'getPaymentDetails']);

// MTN Paiement
Route::prefix('payment')->group(function () {
    Route::post('create-token', [MTNPaymentController::class, 'createAccessToken']);
    Route::post('process-unique-caisse-payment', [FeesManageController::class, 'requestToUniqueCaissePayment']);
    Route::post('process-batch-caisse-payment', [FeesManageController::class, 'requestToBatchCaissePayment']);
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
    Route::post('manage-user/add-by-admin', [UserContoller::class, 'addUserByAdmin']);
    Route::apiResource('roles', RoleController::class);

    // Journal d'activité
    Route::prefix('activity-log')->group(function () {
        Route::post('list', [ActivityLogController::class, 'index']);
        Route::get('log-names', [ActivityLogController::class, 'logNames']);
    });
});

// =========================================================================
// ESPACE PARENT
// =========================================================================

// Inscription Parent (publique, avec OTP email + sms et reCAPTCHA)
Route::prefix('parent/inscription')->group(function () {
    Route::post('search-school',      [ParentStudentLinkController::class,   'searchSchools']);
    Route::post('send-email-otp',     [ParentInscriptionController::class,   'sendEmailOtp'])->middleware('throttle:6,10');
    Route::post('resend-email-otp',   [ParentInscriptionController::class,   'resendEmailOtp'])->middleware('throttle:6,10');
    Route::post('send-phone-otp',     [ParentInscriptionController::class,   'sendPhoneOtp'])->middleware('throttle:6,10');
    Route::post('verify-email-otp',   [ParentInscriptionController::class,   'verifyEmailOtp']);
    Route::post('verify-phone-otp',   [ParentInscriptionController::class,   'verifyPhoneOtp']);
    Route::post('create',             [ParentInscriptionController::class,   'createInscription']);
    Route::post('activate',           [ParentInscriptionController::class,   'activateAccount']);
});

// Connexion Parent par OTP (téléphone uniquement)
Route::prefix('parent/auth')->group(function () {
    Route::post('request-otp', [ParentAuthController::class, 'requestLoginOtp'])->middleware('throttle:6,10');
    Route::post('verify-otp',  [ParentAuthController::class, 'verifyLoginOtp']);
});

// Validation des inscriptions Parent par ScolarPlus (back-office, auth école/admin)
Route::prefix('parent/manage-inscription')->middleware(['auth:api'])->group(function () {
    Route::post('list-pending', [ParentInscriptionController::class, 'listInscriptionsPending']);
    Route::post('list-validated', [ParentInscriptionController::class, 'listInscriptionsValidated']);
    Route::post('change-status', [ParentInscriptionController::class, 'changeStatus']);
});

// Validation des demandes d'association apprenant par l'école (auth école)
Route::prefix('parent/manage-link')->middleware(['auth:api'])->group(function () {
    Route::post('list-pending', [ParentStudentLinkController::class, 'listPendingForSchool']);
    Route::post('list-active', [ParentStudentLinkController::class, 'listActiveForSchool']);
    Route::post('validate', [ParentStudentLinkController::class, 'validateLink']);
});

// Espace Parent authentifié (guard parent-api)
Route::prefix('parent/space')->middleware(['auth:parent-api'])->group(function () {
    Route::get('me', [ParentAuthController::class, 'me']);
    Route::post('logout', [ParentAuthController::class, 'logout']);

    Route::post('search-student', [ParentStudentLinkController::class, 'searchStudent']);
    Route::post('request-link', [ParentStudentLinkController::class, 'requestLink']);
    Route::get('my-links', [ParentStudentLinkController::class, 'listMyLinks']);

    Route::post('student-balance', [ParentFeesController::class, 'getStudentBalance']);
    Route::post('student-academic-years', [ParentFeesController::class, 'getStudentAcademicYears']);
});
