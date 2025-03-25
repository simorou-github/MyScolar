<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StudentController extends Controller
{
    public function list(Request $request)
    {
        $params = [];
        if ($request->input('id')) {
            $params[] = ['id', '=', $request->input('id')];
        }
        if ($request->input('first_name')) {
            $params[] = ['first_name','like', '%'.$request->input('first_name').'%'];
        } 
        if ($request->input('last_name')) {
            $params[] = ['last_name','like', '%'.$request->input('last_name').'%'];
        } 
        if ($request->input('code_scolar')) {
            $params[] = ['code_scolar','=', $request->input('code_scolar')];
        } 
        if ($request->input('matricule')) {
            $params[] = ['matricule','=', $request->input('matricule')];
        } 
        if ($request->input('status')) {
            $params[] = ['status','=',$request->input('status')];
        } 
        if ($request->input('birthday')) {
            $params[] = ['birthday','=',$request->input('birthday')];
        } 
         
        try{
            $data = Student::where($params)->get();
            if ($request->input('id')) {
                $data = $data->first();
            }

            if ($request->input('code_scolar') && $request->input('birthday') ) {
                $data = $data->first();
            }
            return response()->json([
                'data' => $data,
                'message' => "Liste des apprenants",
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

}
