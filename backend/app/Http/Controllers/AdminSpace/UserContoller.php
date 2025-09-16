<?php

namespace App\Http\Controllers\AdminSpace;

use App\Http\Controllers\Controller;
use App\Mail\UserCreatedWithTemporaryPassword;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;


class UserContoller extends Controller
{
    //Users List
    public function userList(Request $request)
    {
        try {
            $params = [];
            if ($request->input('email')) {
                $params[] = ['email', 'like', '%' . $request->input('email') . '%'];
            }
            if ($request->input('last_name')) {
                $params[] = ['last_name', 'like', '%' . $request->input('last_name') . '%'];
            }
            if ($request->input('first_name')) {
                $params[] = ['first_name', 'like', '%' . $request->input('first_name') . '%'];
            }
            if ($request->input('school_id')) {
                $params[] = ['school_id', 'like', $request->input('school_id')];
            }
            if ($request->input('id')) {
                $params[] = ['id', 'like', $request->input('id')];
            }
            $data = User::with(['school', 'roles'])->where($params)->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des utilisateurs',
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

    //Add or update User
    public function crudUser(Request $request)
    {
        try {
            if (!$request->input('id')) { //Create
                User::create(array_merge($request->all(), ['id' => generateDBTableId(15, 'App\Models\Groupe')]));
                return response()->json([
                    'data' => null,
                    'message' => 'Groupe créé avec succès.',
                    'status' => 200
                ]);
            } else {
                if ($request->input('action') == 'delete') { // Delete logicaly
                    $data = User::find($request->input('id'));
                    $data->status = !$data->status;
                    $data->save();
                    return response()->json([
                        'data' => null,
                        'message' => 'Groupe mis à jour avec succès.',
                        'status' => 200
                    ]);
                }
                if ($request->input('action') == 'update') { //Update
                    $data = User::find($request->input('id'));
                    $data->update($request->all());
                    return response()->json([
                        'data' => null,
                        'message' => 'Groupe mis à jour avec succès.',
                        'status' => 200
                    ]);
                }
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

    public function changeStatusOfUser(Request $request)
    {
        if (!$request->id_user) {
            return response()->json([
                'data' => [],
                'message' => 'L\'utilisateur sélectionné n\'existe plus dans le système.',
                'status' => 500
            ]);
        } else {
            $id = $request->id_user;
            $msg = '';
            try {
                $data = User::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cet utilisateur n\'existe plus dans le système.',
                        'status' => 515
                    ]);
                }

                $data->status = !$data->status;
                $data->save();

                if ($data->status) {
                    $msg = "Utilisateur activé avec succès.";
                } else {
                    $msg = "Utilisateur désactivé avec succès.";
                }


                return response()->json([
                    'data' => $data,
                    'message' => $msg,
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

    //Add user by admin ui
    public function addUserByAdmin(Request $request)
    {
        try {
            if (User::where('email', trim($request->user['email']))->first()) {

                return response()->json([
                    'data' => null,
                    'message' => 'Cet utilisateur existe déjà.',
                    'status' => 300
                ]);
            }

            DB::beginTransaction();

            $user_created = User::create([
                'id' => generateDBTableId(30, 'App\Models\User'),
                'temp_password' => $request->user['temp_password'],
                'password' => Hash::make($request->user['temp_password']),
                'email' => $request->user['email'],
                'last_name' => $request->user['last_name'],
                'first_name' => $request->user['first_name'],
                'is_true_password' => false,
                'email_verified_at' => Carbon::now(),
                'school_id' => $request->schoolId ? $request->schoolId : null
            ]);

            if ($request->roles) {
                $user_created->assignRole($request->roles);
            }

            Mail::to($request->user['email'])->send(new UserCreatedWithTemporaryPassword($user_created, $request->user['temp_password']));
            
            DB::commit();
            return response()->json([
                'data' => [],
                'message' => 'Utilisateur enregistré avec succès.',
                'status' => 200
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    public function updateUserProfile(Request $request)
    {
        try {
            if (!$request->id) {
                return response()->json([
                    'message' => 'L\'identifiant de cet utilisateur n\'existe pas',
                    'status' => 500
                ]);
            }
            $user = User::find($request->id);
            if (!$user) {
                return response()->json([
                    'message' => 'Aucun utilisateur trouvé avec cet identifiant',
                    'status' => 500
                ]);
            }

            $user_updated = $user->update([
                'last_name' => $request->last_name,
                'first_name' => $request->first_name,
                'password' => Hash::make($request->password)
            ]);

            if ($user_updated) {
                return response()->json([
                    'message' => 'Profil mis à jour avec succès',
                    'status' => 200
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }
}
