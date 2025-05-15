<?php

use App\Exceptions\ScolarException;
use App\Http\Controllers\SchoolSpace\CityController;
use App\Http\Controllers\SchoolSpace\SchoolInscriptionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

// Inscription & School
Route::post('school/create-inscription', [SchoolInscriptionController::class, 'createInscription']);

// Code verification to make school inscription request
Route::post('code/confirmation', [SchoolInscriptionController::class, 'getCodeOfVerification']);
Route::post('verify/code', [SchoolInscriptionController::class, 'codeVerification']);
Route::post('new/code/confirmation', [SchoolInscriptionController::class, 'getNewCodeOfVerification']);


Route::get('country/list', [CityController::class, 'list']);
Route::get('city/list', [CityController::class, 'listCities']);
Route::post('country/city/list', [CityController::class, 'listCitiesByCountry']);






// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
