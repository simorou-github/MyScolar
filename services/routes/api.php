<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\FeesManageController;
use App\Http\Controllers\ManageSchoolUserController;
use App\Http\Controllers\MTNPaymentController;
use App\Http\Controllers\ParameterController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SchoolDashboardController;
use App\Http\Controllers\SchoolInscriptionController;
use App\Http\Controllers\ScolarController;
use App\Http\Controllers\UserContoller;
use App\Models\Permission;
use App\Models\School;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Code verification to make school inscription request
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('code/confirmation', [SchoolInscriptionController::class, 'getCodeOfVerification']);
Route::post('new/code/confirmation', [SchoolInscriptionController::class, 'getNewCodeOfVerification']);
Route::post('verify/code', [SchoolInscriptionController::class, 'codeVerification']);
Route::post('activation-account', [AuthController::class, 'activateAccount']);
Route::post('password-to-reset', [AuthController::class, 'resetPassword']);
Route::post('change-pwd', [AuthController::class, 'changePassword']);

// Country and City
Route::get('country/list', [CityController::class, 'list']);
Route::get('city/list', [CityController::class, 'listCities']);
Route::post('country/city/list', [CityController::class, 'listCitiesByCountry']);

// Inscription & School
Route::group(['prefix' => 'school'], function () {
    Route::post('create-inscription', [SchoolInscriptionController::class, 'createInscription']);
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
    
    Route::post('user/list', [ManageSchoolUserController::class, 'list']);
    Route::post('user/add', [ManageSchoolUserController::class, 'add']);
    Route::post('user/update', [ManageSchoolUserController::class, 'update']);
    Route::post('user/update-status', [ManageSchoolUserController::class, 'updateStatus']);

});

// Frame for view document
Route::get('school/get-file-path/{id}', function ($id) {
    $school = School::find($id);
    $file_path = 'storage/inscription_files/' . $school->document;

    return response()->file(public_path($file_path));
});

//Manage users   
Route::group(['prefix' => 'manage-user'], function () {
    Route::post('list', [UserContoller::class, 'userList']);
    Route::post('crud', [UserContoller::class, 'crudUser']);
    Route::post('change-status', [UserContoller::class, 'changeStatusOfUser']);
    Route::post('add-by-admin', [UserContoller::class, 'addUserByAdmin']);

});

//Manage Dashboard   
Route::group(['prefix' => 'manage-dashboard'], function () {
    Route::post('verify-fees-assignement', [SchoolDashboardController::class, 'getUnassignedSchoolFees']);
});

//Manage Fees   
Route::group(['prefix' => 'manage-fees'], function () {
    Route::post('assign-fees-to-classe', [FeesManageController::class, 'assigneFeesToClasse']);
    Route::post('get-student-balance', [FeesManageController::class, 'getStudentFeesBalance']);
    Route::post('search-student-balance', [FeesManageController::class, 'searchStudentFeesBalanceForParentPayment']);
    Route::post('get-fees-details-data', [FeesManageController::class, 'getFeesDetails']);
    Route::get('get-fees-balance-follow-up-data', [FeesManageController::class, 'getFeesBalanceFollowupData']);
    Route::get('get-fees-balance-data-export',[FeesManageController::class, 'getExportOfFeesBalance']);    

    Route::post('generate-balance/by-type-file', [FeesManageController::class, 'getExportOfFeesBalance']);

});

// All about classe of the system
Route::middleware(['auth:api'])->group(['prefix' => 'classe'], function () {
    Route::get('list', [ClasseController::class, 'list']);
    Route::post('create', [ClasseController::class, 'create']);
    Route::post('delete', [ClasseController::class, 'delete']);
    Route::post('search', [ClasseController::class, 'searchClasse']);
});

// All parameters of the system
Route::group(['prefix' => 'parameter'], function () {
    Route::get('distinct-years', [SchoolController::class, 'getDistinctAcademicYears']);
    Route::post('params-list', [ParameterController::class, 'listParams']);
    Route::post('crud-params', [ParameterController::class, 'crudParams']);
    Route::post('type-fees/list', [ParameterController::class, 'listTypeFees']);
    Route::post('group/list', [ParameterController::class, 'listGroupe']);
    Route::post('academic-year/list', [ParameterController::class, 'listAcademicYear']);
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
Route::group(['prefix' => 'payment'], function () {
    Route::post('get-history', [PaymentController::class, 'getHistoryOfPayment']);
    Route::post('get-details', [PaymentController::class, 'getPaymentDetails']);

    Route::post('create-token', [MTNPaymentController::class, 'createAccessToken']);
    Route::post('process-unique-payment', [MTNPaymentController::class, 'requestToUniquePayment']);
    Route::post('process-batch-payment', [MTNPaymentController::class, 'requestToBatchPayment']);
    Route::get('account-balance', [MTNPaymentController::class, 'requestToAccountBalance']);
});

//Scolar 
Route::group(['prefix' => 'scolar'], function () {
    Route::post('statistic/payment-aggregation-by-typefees', [ScolarController::class, 'paymentAggregationByTypeFees']);
    Route::post('statistic/year-payment-per-month', [ScolarController::class, 'yearTransactionPerMonth']);
});

Route::group(['prefix' => 'user'], function () {
    //Route::resource('role', RoleController::class);
    Route::post('get-all-role', [RoleController::class, 'getAllRole']);
    Route::post('save-role', [RoleController::class, 'saveRole']);
    Route::post('get-all-permission', [RoleController::class, 'getAllPermissions']);
    Route::post('get-permissions-of-role', [RoleController::class, 'getPermissionsOfRole']);
    Route::resource('permission', PermissionController::class);
});

Route::group(['middleware' => ['auth']], function() {
    Route::resource('roles', UserContoller::class);
    Route::resource('users', UserContoller::class);
});