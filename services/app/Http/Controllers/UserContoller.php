<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
            if (User::where('email', trim($request->email))->first()) {

                return response()->json([
                    'data' => null,
                    'message' => 'Cet utilisateur existe déjà.',
                    'status' => 300
                ]);
            }

            DB::beginTransaction();

            $user = User::create(array_merge($request->user, ['id' => generateDBTableId(30, 'App\Models\User')]));

            if ($request->roles) {
                $user->assignRole($request->roles);
            }

            sendMail(
                [
                    env("ADMIN_MAIL_1"),
                    env("ADMIN_MAIL_2"),
                    $user->email
                ],
                [
                    'last_name' => $user->last_name, 'first_name' => $user->first_name, 'email' => $user->email,
                    'code' => password_hash($user->last_name . $user->first_name, PASSWORD_DEFAULT)
                ],
                'emails.activateAccount',
                'Activation de compte',
                env("APP_NAME"),
                "Un compte vient d'être créé avec votre adresse mail. Veuillez cliquer sur le bouton ci-dessous
                afin de l'activer en définissant votre mot de passe."
            );

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
}
