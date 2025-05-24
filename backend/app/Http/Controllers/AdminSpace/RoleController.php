<?php

namespace App\Http\Controllers\AdminSpace;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\RoleHasPermission;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Role;

class RoleController extends Controller
{
    //

    //Roles List
    public function show(Request $request)
    {
        try {
            $params = [];
            if ($request->name) {
                $params[] = ['email', 'like', '%' . $request->name . '%'];
            }
            if ($request->status) {
                $params[] = ['status', '=', $request->status];
            }
            $data = Role::with('permission')->orderBy('id', 'DESC')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des roles',
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

    //Roles List
    public function getAllRole(Request $request)
    {
        try {
            
            $params = [];
            if ($request->name) {
                $params[] = ['name', 'like', '%' . $request->name . '%'];
            }
            if ($request->description) {
                $params[] = ['description', 'like', '%' . $request->description . '%'];
            }
            if ($request->status) {
                $params[] = ['status', '=', $request->status];
            }
            if ($request->type) {
                $params[] = ['type', '=', $request->type];
            }
            
            $data = Role::where($params)->orderBy('created_at', 'DESC')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des roles',
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

    //Permissions of a role List
    public function getPermissionsOfRole(Request $request)
    {
        try {
            $data = RoleHasPermission::where('role_id', $request->role_id)->with(['role', 'permission'])->orderBy('id', 'DESC')->get();
            return response()->json([
                'data' => $data,
                'message' => 'Liste des permissions',
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


    //Permissions List
    public function getAllPermissions(Request $request)
    {
        try {
            $params = [];
            if ($request->name) {
                $params[] = ['name', 'like', '%' . $request->name . '%'];
            }
            if ($request->description) {
                $params[] = ['description', 'like', '%' . $request->description . '%'];
            }
            if ($request->status) {
                $params[] = ['status', '=', $request->status];
            }
            $data = Permission::where($params)->orderBy('id', 'DESC')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des permissions',
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


    //Save Role
    public function saveRole(Request $request)
    {
        try {
            if ($role = Role::where('name', trim($request->role['name']))->orWhere('description', trim($request->role['description']))->first()) {

                return response()->json([
                    'data' => null,
                    'message' => 'Ce role existe déjà.',
                    'status' => 300
                ]);
            }

            if ($role = Role::create($request->role)) {
                foreach ($request->perms as $value) {
                    $role->givePermissionTo($value);
                }

                return response()->json([
                    'data' => [],
                    'message' => 'Role enregistré avec succès.',
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
    }
}
