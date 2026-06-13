<?php

namespace App\Http\Controllers\AdminSpace;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
   
    public function index()
    {
        Log::info('est ici 1');
        $user = auth()->user(); 
        $school_id = $user->school_id;

        if ($school_id) {
            $roles = Role::where('school_id', $school_id)
                ->orWhereNull('school_id') 
                ->with('permissions')
                ->get();
        } else {
            $roles = Role::with('permissions')->get();
        }
        return response()->json([
            'data' => $roles,
            'status' => 200
        ]);
    }

   
    public function store(StoreRoleRequest $request)
    {
        $user = auth()->user();

        $role = Role::create([
            'name' => $this->createSlug($request->label),
            'label' => $request->label,
            'guard_name' => 'api',
            'school_id' => $user->school_id,
        ]);

        $role->givePermissionTo($request->permissions);

        activity('rôle')
            ->causedBy($user)
            ->performedOn($role)
            ->event('created')
            ->withProperties(['permissions' => $request->permissions])
            ->log("Création du rôle : {$role->label}");

        return response()->json([
            'message' => 'Rôle créé avec succès',
            'data' => $role->load('permissions'),
            'status' => 200
        ]);
    }

 
    public function show(Role $role)
    {
        return response()->json($role->load('permissions'));
    }

 
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $role->update(['label' => $request->label]);
        $role->syncPermissions($request->permissions);

        activity('rôle')
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->event('updated')
            ->withProperties(['permissions' => $request->permissions])
            ->log("Modification du rôle : {$role->label}");

        return response()->json([
            'message' => 'Rôle mis à jour avec succès',
            'data' => $role->load('permissions'),
            'status' => 200
        ]);
    }

    
    public function destroy(Role $role)
    {
        $label = $role->label;
        activity('rôle')
            ->causedBy(auth()->user())
            ->withProperties(['role' => $label])
            ->event('deleted')
            ->log("Suppression du rôle : {$label}");

        $role->delete();

        return response()->json([
            'message' => 'Rôle supprimé avec succès',
            'data' => null,
            'status' => 200
        ]);
    }

   
    public function getPermissions()
    {
        $permissions = Permission::all();
        return response()->json([
            'data' => $permissions,
            'status' => 200
        ]);
    }

    function createSlug($string)
    {
        // Convertir la chaîne en minuscules
        $slug = strtolower($string);

        // Remplacer les caractères accentués par leur équivalent non accentué
        $slug = iconv('UTF-8', 'us-ascii//TRANSLIT', $slug);

        // Supprimer tous les caractères spéciaux (sauf les lettres, les chiffres et les espaces)
        $slug = preg_replace('/[^a-z0-9\s]/', '', $slug);

        // Remplacer les espaces par des tirets
        $slug = preg_replace('/\s+/', '-', $slug);

        // Supprimer les tirets multiples
        $slug = preg_replace('/-+/', '-', $slug);

        // Supprimer les tirets au début et à la fin
        $slug = trim($slug, '-');

        return $slug;
    }

    
}
