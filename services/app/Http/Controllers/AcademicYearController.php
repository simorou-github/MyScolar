<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AcademicYearController extends Controller
{
    public function list()
    {
        try{
            $data = AcademicYear::orderBy('id', 'desc')->get();
            $nb = $data->count();
            return response()->json([
                'data' => $data,
                'nb_data' => $nb,
                'message' => 'Liste des années scolaires',
                'status' => 200
            ]);            
        }catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    public function create(Request $request)
    {
        $academic_year = trim($request->academic_year);
        $status = $request->status;

        if (!$request->id) {
            try {
                $result = AcademicYear::where('academic_year', $academic_year)->first();
                if ($result != null) {
                    return response()->json([
                        'message' => 'Cette année d\'étude existe déjà dans le système',
                        'status' => 300
                    ]);
                } else {
                    $response = AcademicYear::create([
                        'academic_year' => $academic_year,
                        'status' => $status,
                    ]);

                    return response()->json([
                        'data' => $response,
                        'message' => 'Année d\'étude enregistée avec succès.',
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
        } else {
            $id = $request->id;
            try {
                $data = AcademicYear::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette année d\'étude n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $_data = AcademicYear::where('academic_year', $academic_year)->get();
                if ($_data->count() > 1) {
                    return response()->json([
                        'data' => $_data,
                        'message' => 'Une autre année d\'étude existe avec ce libellé.',
                        'status' => 300
                    ]);
                }

                $data->update($request->all());

                return response()->json([
                    'data' => $data,
                    'message' => 'Mise à jour effectuée avec succès.',
                    'status' => 200
                ]);
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

    public function delete(Request $request)
    {
        if (!$request->id) {
            return response()->json([
                'data' => [],
                'message' => 'L\'année d\'étude sélectionnée n\'existe plus dans le système.',
                'status' => 300
            ]);
        } else {
            $id = $request->id;
            try {
                $data = AcademicYear::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette AcademicYear n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $data->delete($request->all());

                return response()->json([
                    'data' => $data,
                    'message' => 'Suppression effectuée avec succès.',
                    'status' => 200
                ]);
            } catch (Exception $ex) {
                Log::error($ex->getMessage());
                return response()->json([
                    'data' => [],
                    'message' => 'Une erreur interne est survenue',
                    'status' => 500
                ]);
            }
        }
    }
}
