<?php

namespace App\Http\Controllers\SchoolSpace;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        try{
            $data = Classe::orderBy('rank')->get();
            $nb = $data->count();
            return response()->json([
                'data' => $data,
                'nb_data' => $nb,
                'message' => 'Liste des classes',
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

    public function searchClasse(Request $request)
    {
        try{
            $params = [];
            if ($request->input('code')) {
                $params[] = ['code', 'like', '%'.$request->input('code').'%'];
            }
            if ($request->input('label')) {
                $params[] = ['label', 'like', '%'.$request->input('label').'%'];
            }
            if ($request->input('status')) {
                $params[] = ['status', '=', $request->status];
            }

            $data = Classe::where($params)->orderBy('rank')->get();
            return response()->json([
                'data' => $data,
                'message' => 'Liste des classes',
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
        $code = trim($request->code);
        $label = trim($request->label);

        if (!$request->id) {
            try {
                $result = Classe::where('code', $code)->orWhere('label', $label)->first();
                if ($result != null) {
                    return response()->json([
                        'message' => 'Cette classe existe déjà dans le système',
                        'status' => 300
                    ]);
                } else {
                    $classe = Classe::create([
                        'id'=> generateDBTableId(20, 'App\Models\Classe'),
                        'code' => $code,
                        'label' => strtoupper($label),
                    ]);

                    return response()->json([
                        'data' => $classe,
                        'message' => 'Classe enregistée avec succès.',
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
                $data = Classe::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette classe n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $_data = Classe::where('code', $code)->orWhere('label', $label)->get();
                if ($_data->count() > 1) {
                    return response()->json([
                        'data' => $_data,
                        'message' => 'Une autre classe existe avec ce libellé.',
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
                'message' => 'La classe sélectionnée n\'existe plus dans le système.',
                'status' => 300
            ]);
        } else {
            $id = $request->id;
            try {
                $data = Classe::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette classe n\'existe plus dans le système.',
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
