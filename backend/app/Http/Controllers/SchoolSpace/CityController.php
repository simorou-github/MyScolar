<?php

namespace App\Http\Controllers\SchoolSpace;

use App\Http\Controllers\Controller;
use App\Services\CityService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CityController extends Controller
{
    protected $city_service;

    public function __construct(CityService $city_service)
    {
        $this->city_service = $city_service;
    }

    public function list(){
        try {
            $data = $this->city_service->listCountries();
            return response()->json([
                'data' => $data,
                'nb_data' => $data->count(),
                'message' => 'Liste des pays',
            ], 200); 
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
            ], 500);
        }
    }

    public function listCities()
    {
        try{
            $data = $this->city_service->listCities();
            return response()->json([
                'data' => $data,
                'nb_data' => $data->count(),
                'message' => 'Liste des villes',
            ], 200);            
        }catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
            ], 500);
        }
    }

    public function listCitiesByCountry(Request $request){
        try{
           $data = $this->city_service->listCitiesByCountry($request->country_id);
            return response()->json([
                'data' => $data,
                'message' => 'Liste des villes par pays',
            ], 200);            
        }catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
            ], 500);
        }
    }
}
