<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    //

    //Roles Permission
    public function show(Request $request){
        try{
            $params = [];
            if ($request->name) {
                $params[] = ['email', 'like', '%'.$request->name.'%'];
            }
            if ($request->status) {
                $params[] = ['status', '=', $request->status];
            }
            $data = Permission::where($params)->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des roles',
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
