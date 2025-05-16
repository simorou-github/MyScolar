<?php

namespace App\Http\Controllers\AdminSpace;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Groupe;
use App\Models\Operator;
use App\Models\Parameter;
use App\Models\TypeFees;
use App\Models\TypePayment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Attributes\Group;

class ParameterController extends Controller
{
    //Type Fees List
    public function listTypeFees(Request $request){
        try{
            $params = [];
            if ($request->input('school_id')) {
                $params[] = ['school_id', '=', $request->input('school_id')];
            }
            if ($request->input('label')) {
                $params[] = ['label', 'like', '%'.$request->input('label').'%'];
            }
            if ($request->input('id')) {
                $params[] = ['id', '=', $request->input('id')];
            }
            $data = TypeFees::where($params)->orderBy('created_at', 'desc')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des types de frais',
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
    
    //Group/Spéciality List
    public function listGroupe(Request $request){
        try{
            $params = [];
            if ($request->input('school_id')) {
                $params[] = ['school_id', '=', $request->input('school_id')];
            }
            if ($request->input('code')) {
                $params[] = ['code', 'like', '%'.$request->input('code').'%'];
            }
            if ($request->input('id')) {
                $params[] = ['id', '=', $request->input('id')];
            }
            $data = Groupe::where($params)->orderBy('created_at', 'desc')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des groupes',
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
    
    
    // Parameter List
    public function listParams(Request $request){
        try{
            $params = [];
            if ($request->input('label')) {
                $params[] = ['label', 'like', '%'.$request->input('label').'%'];
            }
            if ($request->input('value')) {
                $params[] = ['value', 'like', '%'.$request->input('value').'%'];
            }
            if ($request->input('description')) {
                $params[] = ['description', 'like', '%'.$request->input('description').'%'];
            }
            if ($request->input('id')) {
                $params[] = ['id', 'like', $request->input('id')];
            }
            $data = Parameter::where($params)->orderBy('created_at', 'desc')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des groupes',
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
    
    //
    public function listAcademicYear(Request $request){
        try{            
            $data = AcademicYear::all();
            return response()->json([
                'data' => $data,
                'message' => 'Liste des années académique',
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
    
    //
    public function listOperator(Request $request){
        $params = [];
        if ($request->country_id) {
            $params[] = ['country_id', '=', $request->country_id];
        }
        if ($request->input('name')) {
            $params[] = ['name', 'like', '%'.$request->input('name').'%'];
        }
        if ($request->status) {
            $params[] = ['status', '=', $request->status];
        }
        try{            
            $data = Operator::with('country')->where($params)->get();
            return response()->json([
                'data' => $data,
                'message' => 'Liste des opérateurs',
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

    public function listTypePayment(){
        try{
            $data = TypePayment::orderBy('label', 'asc')->get();
            $nb = $data->count();
            return response()->json([
                'data' => $data,
                'nb_data' => $nb,
                'message' => 'Liste des types de frais',
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

    //Add or update TypeFees
    public function crudTypeFees(Request $request){
        try{
            if(!$request->input('id')){ //Create
                TypeFees::create(array_merge($request->all(), ['id'=>generateDBTableId(5, 'App\Models\TypeFees')]));
                return response()->json([
                    'data' => null,
                    'message' => 'Frais créé avec succès.',
                    'status' => 200
                ]);  
            } else {
                if($request->input('action')=='delete')
                { // Delete logicaly
                    $data = TypeFees::find($request->input('id'));
                    if($data){
                        $data->status = !$data->status;
                        $data->save();
                        return response()->json([
                            'data' => null,
                            'message' => 'Frais mis à jour avec succès.',
                            'status' => 200
                        ]); 
                    }else{
                        return response()->json([
                            'data' => [],
                            'message' => 'Aucune ligne trouvée à supprimer.',
                            'status' => 500
                        ]);
                    }
                    
                } 

                if($request->input('action')=='update') { //Update
                    $data = TypeFees::find($request->input('id'));
                    if($data){
                        $verif = TypeFees::where('label', strtoupper($request->label))->
                        where('school_id', $request->school_id)->get();
                        if(count($verif) > 0){
                            return response()->json([
                                'data' => [],
                                'message' => 'Un autre frais existe avec ce libellé.',
                                'status' => 500
                            ]);
                        }else{
                            $data->update($request->all());
                            return response()->json([
                                'data' => null,
                                'message' => 'Frais mis à jour avec succès.',
                                'status' => 200
                            ]);
                        }
                    }

                     
                }
            }     
        }catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    //Add or update Groupe
    public function crudGroups(Request $request){
        try{
            if(!$request->input('id')){ //Create
                Groupe::create(array_merge($request->all(), ['id'=>generateDBTableId(15, 'App\Models\Groupe')]));
                return response()->json([
                    'data' => null,
                    'message' => 'Groupe créé avec succès.',
                    'status' => 200
                ]);  
            } else {
                if($request->input('action')=='delete')
                { // Delete logicaly
                    $data = Groupe::find($request->input('id'));
                    $data->status = !$data->status;
                    $data->save();
                    return response()->json([
                        'data' => null,
                        'message' => 'Groupe mis à jour avec succès.',
                        'status' => 200
                    ]); 
                } 
                if($request->input('action')=='update') { //Update
                    $data = Groupe::find($request->input('id'));
                    $data->update($request->all());
                    return response()->json([
                        'data' => null,
                        'message' => 'Groupe mis à jour avec succès.',
                        'status' => 200
                    ]); 
                }
            }     
        }catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    //Add or update Param
    public function crudParams(Request $request){
        try{
            if(!$request->input('id')){ //Create
                Parameter::create(array_merge($request->all(), ['id'=>generateDBTableId(15, 'App\Models\Parameter')]));
                return response()->json([
                    'data' => null,
                    'message' => 'Paramètre créé avec succès.',
                    'status' => 200
                ]);  
            } else {
                if($request->action == 'delete')
                { // Delete logicaly
                    $data = Parameter::find($request->id);
                    $data->status = !$data->status;
                    $data->save();
                    return response()->json([
                        'data' => null,
                        'message' => 'Parametre mis à jour avec succès.',
                        'status' => 200
                    ]); 
                } 
                if($request->input('action')=='update') { //Update
                    $data = Parameter::find($request->id);
                    $data->update($request->all());
                    return response()->json([
                        'data' => null,
                        'message' => 'Paramètre mis à jour avec succès.',
                        'status' => 200
                    ]); 
                }
            }     
        }catch(Exception $e){
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    public function createOperator(Request $request)
    {
        $name = trim($request->name);
        $country_id = $request->country_id;

        if (!$request->id) {
            try {
                $result = Operator::where('name', $name)->Where('country_id', $country_id)->first();
                if ($result != null) {
                    return response()->json([
                        'message' => 'Cet opérateur existe déjà pour ce pays',
                        'status' => 300
                    ]);
                } else {
                    $operator = Operator::create([
                        'id' => generateDBTableId(20, "App\Models\Operator"),
                        'name' => $name,
                        'country_id' => $country_id,
                        'status' => 1
                    ]);

                    return response()->json([
                        'data' => $operator,
                        'message' => 'Opérateur enregisté avec succès.',
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
                $data = Operator::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cet opérateur n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $_data = Operator::where('name', $name)->Where('country_id', $country_id)->get();
                if ($_data->count() > 1) {
                    return response()->json([
                        'data' => $_data,
                        'message' => 'Un autre opérateur existe avec ce libellé pour ce pays.',
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

    public function deleteOperator(Request $request)
    {
        if (!$request->id) {
            return response()->json([
                'data' => [],
                'message' => 'L\'opérateur sélectionné n\'existe plus dans le système.',
                'status' => 300
            ]);
        } else {
            $id = $request->id;
            try {
                $data = Operator::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cet opérateur n\'existe plus dans le système.',
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
