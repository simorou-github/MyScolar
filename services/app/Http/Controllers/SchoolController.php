<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BalanceFees;
use App\Models\Classe;
use App\Models\Groupe;
use App\Models\Payment;
use App\Models\PaymentDetail;
use App\Models\School;
use App\Models\SchoolClasse;
use App\Models\SchoolClasseFees;
use App\Models\SchoolClasseFeesDetails;
use App\Models\Student;
use App\Models\StudentClasse;
use App\Models\TypeFees;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SchoolController extends Controller
{
    public function list(Request $request)
    {
        $params = [];
        if ($request->input('id')) {
            $params[] = ['id', '=', $request->input('id')];
        }
        if ($request->input('social_reason')) {
            $params[] = ['social_reason', 'like', '%' . $request->input('social_reason') . '%'];
        }
        if ($request->input('status')) {
            $params[] = ['status', '=', $request->input('statut')];
        }
        if ($request->input('ifu')) {
            $params[] = ['ifu', 'like', '%' . $request->input('ifu') . '%'];
        }
        if ($request->input('country_id')) {
            $params[] = ['country_id', '=', $request->input('country_id')];
        }
        if ($request->status) {
            $params[] = ['status', '=', $request->status];
        }

        try {
            $data = School::with(['creater', 'updater', 'activater', 'approver', 'canceller', 'country'])
                ->where($params)->whereNotIn('status', ['ANNULE', 'REJETE'])->orderBy('id', 'desc')->get();
            if ($request->input('id')) {
                $data = $data->first();
            }
            return response()->json([
                'data' => $data,
                'nbr' => $data->count(),
                'message' => 'Liste des écoles',
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

    // Get all students of school by param
    public function getSchoolStudentsWithParam(Request $request)
    {
        try {
            $params = [];
            if ($request->input('id')) {
                $params[] = ['id', '=', $request->input('id')];
            }
            if ($request->input('school_id')) {
                $params[] = ['school_id', '=', $request->input('school_id')];
            }

            $data = Student::with(['school'])->where($params)->orderBy('id', 'desc')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des élèves',
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


    // All class of school which is connected
    public function listSchoolClasse(Request $request)
    {
        try {
            $params = [];
            if ($request->input('id')) {
                $params[] = ['id', '=', $request->input('id')];
            }
            if ($request->input('school_id')) {
                $params[] = ['school_id', '=', $request->input('school_id')];
            }

            $data = SchoolClasse::with(['school', 'classe', 'groupe'])->where($params)
            ->orderByRaw('(SELECT rank FROM classes WHERE classes.id = school_classes.classe_id) ASC')->get();

            return response()->json([
                'data' => $data,
                'message' => 'Liste des classes',
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

    // Get all students of school 
    public function listStudent(Request $request)
    {
        try {
            $params = [];
            if ($request->input('classe_id')) {
                $params[] = ['classe_id', '=', $request->input('classe_id')];
            }

            $data = StudentClasse::with(['student', 'classe.classe', 'classe.groupe', 'student.school'])->whereRelation(
                'student',
                'school_id',
                $request->school_id,
                'academic_year',
                '=',
                $request->academic_year
            )->where($params)->get();

            // C'est le school classe id qui représente classe id ici
            if ($request->input('classe_id')) {
                $true_classe_id = SchoolClasse::where('id', $request->input('classe_id'))->first()['classe_id'];
                $classe = Classe::where('id', $true_classe_id)->first()['code'];
            } else {
                $classe = '';
            }

            return response()->json([
                'data' => $data,
                'classe' => $classe,
                'message' => 'Liste des élèves',
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

    /**
     * Show the form for creating a new resource.
     */
    public function save(Request $request)
    {
        $status = "INITIE";

        if (!$request->id) {
            $response = School::create([
                array_merge(
                    $request->all(),
                    [
                        'social_reason' => strtoupper($request->social_reason),
                        'status' => $status
                    ]
                )
            ]);

            return response()->json([
                'data' => $response,
                'message' => 'Demande d\'inscription enregistrée avec succès.',
                'status' => 200
            ]);
        }
    }



    public function createSchoolClasse(Request $request)
    {
        $classe_id = $request->school_classe['classe_id'];
        $school_id = $request->school_id;
        $groupe_id = $request->school_classe['groupe_id'];

        try {
            $verif_data = SchoolClasse::where('classe_id', $classe_id)->where('groupe_id', $groupe_id)->where('school_id', $school_id)->first();
            if ($verif_data) {
                return response()->json([
                    'data' => '',
                    'message' => 'Cette classe existe déjà dans cette école.',
                    'status' => 500
                ]);
            }

            $res = SchoolClasse::create([
                'id' => generateDBTableId('10', 'App\Models\SchoolClasse'),
                'school_id' => $school_id,
                'classe_id' => $classe_id,
                'school_classe_id' => $classe_id,
                'groupe_id' => $groupe_id
            ]);
            if ($res) {
                return response()->json([
                    'data' => '',
                    'message' => 'Classe ajoutée avec succès.',
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'data' => '',
                    'message' => 'Impossible d\'ajoutée cette classe. Veuillez réessayer.',
                    'status' => 500
                ]);
            }
        } catch (Exception $e) {
            Log::info($e);
            return response()->json([
                'data' => '',
                'message' => 'Une erreur interne est survenue, veuillez réessayer.',
                'status' => 500
            ]);
        }
    }

    // To add a student to one classe
    public function addStudentToClasse(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required'],
            'last_name' => ['required'],
            'birthday' => ['required'],
            'sex' => ['required'],
            'classe_id' => ['required'],
        ]);

        $student = null;
        $student_classe = null;

        if (!$validated) {
            return response()->json([
                'data' => null,
                'message' => 'Veuillez remplir tous les champs obligatoire (*).',
                'status' => 500
            ]);
        }

        // To get code of country of school
        if (!$school = School::with('country')->where('id', $request->school_id)->first()) {
            return response()->json([
                'message' => 'L\'école associée manque de configuration. Veuillez la mettre à jour.',
                'status' => 500
            ]);
        }

        // To get school-classe row
        if (!$school_classe = SchoolClasse::where('id', $request->classe_id)->first()) {
            return response()->json([
                'message' => 'La configuration de la Classe est incorrecte. Veuillez la mettre à jour.',
                'status' => 500
            ]);
        }
        //Corresponding SchoolClasseFees
        if (!$school_classe_fees = SchoolClasseFees::where('school_id', $request->school_id)
            ->where('school_classe_id', $school_classe->id)
            ->where('academic_year', getActiveAcademicYear())
            ->get()) {
            return response()->json([
                'message' => 'Aucun frais n\'est encore configuré pour cette école. Veuillez la mettre à jour d\'abord.',
                'status' => 500
            ]);
        }

        try {
            DB::beginTransaction();
            if (!$request->id) //New
            {
                // Insert Student in DB Table
                $generatedStudentRegistration = generateStudentRegistration($school->country->code);
                $student = Student::create([
                    'id' => generateDBTableId(28, "App\Models\Student"),
                    'code' => $generatedStudentRegistration['last_student_code_plus_one'],
                    'school_id' => $request->school_id,
                    'last_name' => $request->last_name,
                    'first_name' => $request->first_name,
                    'sex' => $request->sex,
                    'email' => $request->email,
                    'matricule' => $request->matricule,
                    'phone' => $request->phone,
                    'birthday' => date("Y-m-d", strtotime($request->birthday)),
                    'code_scolar' => $generatedStudentRegistration['registration'],
                    'status' => true
                ]);

                if ($student) {
                    $student_classe = StudentClasse::create([
                        'id' => generateDBTableId(29, "App\Models\StudentClasse"),
                        'student_id' => $student->id,
                        'classe_id' => $request->classe_id,
                        'school_classe_id' => $request->classe_id,
                        'academic_year' => getActiveAcademicYear()
                    ]);

                    if ($student_classe) {
                        //Loop on School Classe Fees rows to save each row in Balance Fees table for the current student
                        foreach ($school_classe_fees as $value) {
                            if ($school_classe_fees_details = SchoolClasseFeesDetails::where('school_classe_fees_id', $value['id'])->get()) {
                                //Loop to create balance fees
                                foreach ($school_classe_fees_details as $detail) {
                                    $balance = BalanceFees::create([
                                        'id' => generateDBTableId(29, "App\Models\BalanceFees"),
                                        'student_id' => $student->id,
                                        'classe_id' => $request->classe_id,
                                        'school_id' => $request->school_id,
                                        'type_fees_id' => $value['type_fees_id'],
                                        'academic_year' => getActiveAcademicYear(),
                                        'fees_amount' => $detail['due_amount'],
                                        'balance' => $detail['due_amount'],
                                        'fees_label' => $detail['fees_label'],
                                        'due_date' => $detail['due_date'],
                                        'school_classe_fees_id' => $value['school_classe_fees_id'],
                                    ]);
                                }
                            }
                        }
                        DB::commit();
                    }

                    return response()->json([
                        'data' => null,
                        'message' => 'Apprenant ajouté(e) avec succès.',
                        'status' => 200
                    ]);
                }
            }

            if ($request->id) //Modify
            {
                // Search student
                $student = Student::where('id', $request->id)->first();

                if (!$student) {
                    return response()->json([
                        'message' => 'Cet apprenant n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $response = $student->update(array_merge($request->all(), [
                    'birthday' => date('Y-m-d', strtotime($request->birthday))
                ]));

                if ($response) {
                    DB::commit();
                    return response()->json([
                        'data' => $response,
                        'message' => 'Apprenant modifié avec succès',
                        'status' => 200
                    ]);
                }
            }
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

    // To add list of students to one classe
    public function addStudentListToClasse(Request $request)
    {
        try {
            DB::beginTransaction();
            $academic_year = $request->academic_year;
            $classe_id = $request->classe_id;
            $students_list = $request->students_list;

            // To get code of country of school
            if (!$school = School::with('country')->where('id', $request->school_id)->first()) {
                return response()->json([
                    'message' => 'L\'école associée manque de configuration. Veuillez la mettre à jour.',
                    'status' => 500
                ]);
            }

            $existed_student_list = [];
            for ($i = 0; $i < count($students_list); $i++) {

                if ($students_list[$i][0] == "" || $students_list[$i][0] == null) {
                    return response()->json([
                        'message' => 'Le nom de l\'apprenant est manquant à la ligne ' . ($i + 7) . ' Veuillez corriger et réessayer',
                        'status' => 500
                    ]);
                }
                if ($students_list[$i][1] == "" || $students_list[$i][1] == null) {
                    return response()->json([
                        'message' => 'Le prénom de l\'apprenant est manquant à la ligne ' . ($i + 7) . ' Veuillez corriger et réessayer',
                        'status' => 500
                    ]);
                }
                if ($students_list[$i][2] == "" || $students_list[$i][2] == null) {
                    return response()->json([
                        'message' => 'La date de naissance de l\'apprenant est manquant à la ligne ' . ($i + 7) . ' Veuillez corriger et réessayer',
                        'status' => 500
                    ]);
                }
                if ($students_list[$i][3] == "" || $students_list[$i][3] == null) {
                    return response()->json([
                        'message' => 'Le sexe de l\'apprenant est manquant à la ligne ' . ($i + 7) . ' Veuillez corriger et réessayer',
                        'status' => 500
                    ]);
                }

                if (!isset($students_list[$i][4])) {
                    $students_list[$i][4] = null;
                }

                if (!isset($students_list[$i][5])) {
                    $students_list[$i][5] = null;
                }

                if (!isset($students_list[$i][6])) {
                    $students_list[$i][6] = null;
                }


                $last_name = trim($students_list[$i][0]);
                $first_name = trim($students_list[$i][1]);
                $matricule = trim($students_list[$i][6]);

                $birthday = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($students_list[$i][2])->format('Y-m-d');
                $sex = $students_list[$i][3];

                $params = [];

                if ($matricule) {
                    $params[] = ['matricule', '=', $matricule];
                }

                if ($first_name) {
                    $params[] = ['first_name', 'like', '%' . $first_name . '%'];
                }
                if ($last_name) {
                    $params[] = ['last_name', 'like', '%' . strtoupper($last_name) . '%'];
                }
                if ($sex) {
                    $params[] = ['sex', '=', $sex];
                }
                if ($birthday) {
                    $params[] = ['birthday', '=', date("Y-m-d", strtotime($birthday))];
                }

                $stud = Student::where($params)->first();
                if (!is_null($stud)) {
                    $existed_student_list[] = ['line' => $i + 7, 'student' => $last_name . ' ' . $first_name];
                    continue;
                }

                // To get school-classe row
                if (!$school_classe = SchoolClasseFees::where('school_id', $request->school_id)->where('school_classe_id', $request->classe_id)->first()) {
                    return response()->json([
                        'message' => 'La configuration de frais manque pour cette Classe. Veuillez la mettre à jour.',
                        'status' => 500
                    ]);
                }

                //Corresponding SchoolClasseFees
                if (!$school_classe_fees = SchoolClasseFees::where('school_id', $request->school_id)
                    ->where('school_classe_id', $classe_id)
                    ->where('academic_year', $request->academic_year)
                    ->get()) {
                    return response()->json([
                        'message' => 'Aucun frais n\'est encore configuré pour cette école. Veuillez la mettre à jour d\'abord.',
                        'status' => 500
                    ]);
                }

                // Insert Student in DB Table
                $generatedStudentRegistration = generateStudentRegistration($school->country->code);
                $student = Student::create([
                    'id' => generateDBTableId(28, "App\Models\Student"),
                    'code' => $generatedStudentRegistration['last_student_code_plus_one'],
                    'school_id' => $request->school_id,
                    'last_name' => $last_name,
                    'first_name' => $first_name,
                    'sex' => $sex,
                    'email' => $students_list[$i][4],
                    'phone' => $students_list[$i][5],
                    'matricule' => $students_list[$i][6],
                    'birthday' => date("Y-m-d", strtotime($birthday)),
                    'code_scolar' => $generatedStudentRegistration['registration'],
                    'status' => 1
                ]);

                if ($student) {
                    $student_classe = StudentClasse::create([
                        'id' => generateDBTableId(29, "App\Models\StudentClasse"),
                        'student_id' => $student->id,
                        'classe_id' => $classe_id,
                        'school_classe_id' => $classe_id,
                        'academic_year' => $academic_year,
                    ]);

                    if ($student_classe) {
                        //$isbalance = 0;
                        //Loop on School Classe Fees rows to save each row in Balance Fees table for the current student
                        foreach ($school_classe_fees as $value) {
                            if ($school_classe_fees_details = SchoolClasseFeesDetails::where('school_classe_fees_id', $value['id'])->get()) {
                                //Loop to create BalanceFees
                                foreach ($school_classe_fees_details as $detail) {
                                    $balance = BalanceFees::create([
                                        'id' => generateDBTableId(29, "App\Models\BalanceFees"),
                                        'student_id' => $student->id,
                                        'classe_id' => $classe_id,
                                        'school_id' => $request->school_id,
                                        'type_fees_id' => $value['type_fees_id'],
                                        'academic_year' => getActiveAcademicYear(),
                                        'fees_amount' => $detail['due_amount'],
                                        'balance' => $detail['due_amount'],
                                        'fees_label' => $detail['fees_label'],
                                        'due_date' => $detail['due_date'],
                                        'school_classe_fees_id' => $value['school_classe_fees_id'],
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
            DB::commit();
            return response()->json([
                'data' => $existed_student_list,
                'message' => 'Liste d\'apprenants chargée avec succès',
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

    public function getFeesDetailsById(Request $request)
    {
        $type_fees_id = $request->type_fees_id;
        $school_id = $request->school_id;
        $academic_year = $request->academic_year;

        try {
            $_data = SchoolClasse::with('classes', 'type_fees')->where('school_id', $school_id)
                ->where('type_fees_id', $type_fees_id)
                ->where('academic_year', $academic_year)->get();
            Log::info($_data);
            if ($_data) {
                return response()->json([
                    'data' => $_data,
                    'message' => 'Cette classe existe déjà dans l\'école pour cette année',
                    'status' => 300
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

    // List Groups of school
    public function listGroupe(Request $request)
    {
        try {
            $params = [];
            if ($request->school_id) {
                $params[] = ['school_id', 'like', $request->school_id];
            }
            if ($request->searchForm['code']) {
                $params[] = ['code', 'LIKE', strtoupper($request->searchForm['code']) . '%'];
            }
            if ($request->searchForm['status']) {
                $params[] = ['status', '=', $request->searchForm['status']];
            }
            $data = Groupe::where($params)->orderBy('created_at', 'asc')->get();
            return response()->json([
                'data' => $data,
                'message' => 'Liste des groupes',
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

    // List Actifs Groups of school
    public function listActifGroupe(Request $request)
    {
        try {
            $data = Groupe::where('school_id', $request->school_id)->where('status', true)->get();
            return response()->json([
                'data' => $data,
                'message' => 'Liste des groupes',
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

    // Create Groupe of school
    public function createGroupe(Request $request)
    {
        $code = trim($request->groupe['code']);
        $description = trim($request->groupe['description']);
        $school_id = $request->school_id;

        if (!$request->groupe['id']) {
            try {
                $result = Groupe::where('code', $code)->where('school_id', $school_id)->first();
                if ($result != null) {
                    return response()->json([
                        'message' => 'Ce groupe existe déjà pour cette école',
                        'status' => 300
                    ]);
                } else {
                    $groupe = Groupe::create([
                        'id' => generateDBTableId(5, "App\Models\Groupe"),
                        'code' => strtoupper($code),
                        'description' => $description,
                        'school_id' => $school_id,
                        // A remplacer par user id
                        'create_id' => null,
                    ]);

                    if ($groupe) {
                        return response()->json([
                            'data' => $groupe,
                            'message' => 'Groupe enregisté avec succès.',
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
        } else {
            $id = $request->groupe['id'];
            try {
                $data = Groupe::where('id', $id)->first();
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette classe n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $_data = Groupe::where('code', $code)->where('school_id', $school_id)->get();
                if ($_data->count() > 1) {
                    return response()->json([
                        'data' => $_data,
                        'message' => 'Un autre groupe existe avec ce code.',
                        'status' => 300
                    ]);
                }

                $res = $data->update($request->groupe);

                if ($res) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Mise à jour effectuée avec succès.',
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

    public function changeGroupeStatus(Request $request)
    {
        if (!$request->id) {
            return response()->json([
                'data' => [],
                'message' => 'Aucune linge n\'a été sélectionnée.',
                'status' => 300
            ]);
        } else {
            try {

                $data = Groupe::find($request->id);
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Cette ligne n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                if ($data->update(['status' => $request->status])) {
                    return response()->json([
                        'data' => '',
                        'message' => 'Statut mis à jour avec succès',
                        'status' => 200
                    ]);
                }
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

    public function deleteGroupe(Request $request)
    {
        if (!$request->id) {
            return response()->json([
                'data' => [],
                'message' => 'Le groupe sélectionné n\'existe plus dans le système.',
                'status' => 300
            ]);
        } else {
            $id = $request->id;
            try {
                $data = Groupe::find($id);
                if (!$data) {
                    return response()->json([
                        'data' => $data,
                        'message' => 'Ce groupe n\'existe plus dans le système.',
                        'status' => 300
                    ]);
                }

                $school_classe = SchoolClasse::where('groupe_id', $id)->get();
                if (count($school_classe) > 0) {
                    return response()->json([
                        'data' => '',
                        'message' => 'Ce groupe est affecté à des classes. Il ne peut donc pas être supprimé.',
                        'status' => 300
                    ]);
                }

                $data->delete($request->all());

                return response()->json([
                    'data' => $data,
                    'message' => 'Suppression du groupe effectuée avec succès.',
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


    public function transactionEvolutionByMonth(Request $request)
    {

        try {
            $academic_year = $request->academicYear;
            $school_id = $request->schoolId;

            $params = [];
            if ($request->input('school_id')) {
                $params[] = ['school_id', '=', $school_id];
            }
            if ($request->input('academic_year')) {
                $params[] = ['academic_year', '=', $academic_year];
            }
            if ($request->input('type_fees_id')) {
                $params[] = ['type_fees_id', '=', $request->input('type_fees_id')];
            }

            if ($request->input('operation_date')) {
                $params[] = ['operation_date', '=', $request->input('operation_date')];
            }
            if ($request->input('operator')) {
                $params[] = ['operator', '=', $request->input('operator')];
            }

            $payments = Payment::with(['student', 'classe.classe', 'classe.groupe', 'school', 'creater', 'operator'])
                ->where($params)->orderBy('id', 'DESC')->get();
            $data = [];
            $months = getMonthsOfYear();
            foreach ($months as $month) {
                $temp_month_amount = 0;
                foreach ($payments as $payment) {
                    if ($month['month_num'] == date('n', strtotime($payment->created_at))) {
                        $temp_month_amount += $payment->amount;
                    }
                }
                $data['amount'][] = $temp_month_amount;
            }

            return response()->json([
                'data' => $data,
                'message' => 'OK',
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

    public function getDistinctAcademicYears()
    {
        try {
            $years = Payment::distinct()->orderBy('academic_year', 'desc')->get('academic_year');
            return response()->json([
                'data' => $years,
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

    // public function upestAmount($data){
    //     $temp = 0;
    //     for($i = 0; $i<count($data); $i++){
    //         for($j = $i + 1; $j < count($data) - 1; $j++){
    //             if($data[$i] < $data[$j]){
    //                 $temp = $data[$i];
    //                 $data[$i] = $data[$j];
    //                 $data[$j] = $temp;
    //             }
    //         }
    //     }

    //     return $data;
    // }

    public function staticticsForFeesCollected(Request $request)
    {
        try {

            $academic_year = $request->academicYear;
            $school_id = $request->schoolId;
            $classe_id = $request->classeId;
            $type_fees_id = $request->typeFeesId;

            $params = [];
            if ($classe_id) {
                $params[] = ['classe_id', '=', $classe_id];
            }
            if ($school_id) {
                $params[] = ['school_id', '=', $school_id];
            }
            if ($academic_year) {
                $params[] = ['academic_year', '=', $academic_year];
            }
            if ($type_fees_id) {
                $params[] = ['type_fees_id', '=', $type_fees_id];
            }

            // $payments = Payment::with(['classe.classe', 'classe.groupe', 'school'])
            //     ->where($params)->orderBy('id', 'DESC')->get();

            $payments = PaymentDetail::with(['type_fees'])->where($params)->orderBy('id', 'DESC')->get();
        } catch (Exception $ex) {
            Log::error($ex->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }

    public function getSchoolDetail(Request $request)
    {
        try {
            $school = School::find($request->id);
            if ($school->status != "REJETE") {
                return response()->json([
                    'message' => 'Désolé. Les informations demandées ne peuvent pas être affichées.',
                    'status' => 500
                ]);
            }
            return response()->json([
                'data' => $school,
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

    //Agrégation des paiement par type de frais
    public function paymentAggregationByTypeFees(Request $request)
    {
        $amounts = [];
        if ($request->school_id)
            $_data = PaymentDetail::with(['type_fees'])
                ->where('school_id', $request->school_id)->where('academic_year', getActiveAcademicYear())
                ->groupBy('type_fees_id')
                ->selectRaw('sum(fees_amount) as sum, type_fees_id')->get();
        else
            $_data = PaymentDetail::with(['type_fees'])->where('academic_year', getActiveAcademicYear())
                ->groupBy('type_fees_id')
                ->selectRaw('sum(fees_amount) as sum, type_fees_id')->get();

        $total = $_data->sum('sum');

        foreach ($_data as $fee) {
            $amounts['type_fees'][] = $fee->type_fees->label;
            $amounts['amount'][] = round($fee->sum);
        }

        return response()->json([
            'data' => $_data,
            'total' => $total,
            'amounts' => $amounts,
            'message' => 'Une erreur interne est survenue',
            'status' => 500
        ]);
    }

    //Liste des transactions par moi de l'année courrante
    public function yearTransactionPerMonth(Request $request)
    {
        if ($request->school_id)
            $_data = PaymentDetail::with(['type_fees'])
                ->where('academic_year', getActiveAcademicYear())
                ->where('school_id', $request->school_id)
                ->selectRaw('sum(fees_amount) as sum, MONTH(created_at) month, type_fees_id')
                ->groupBy('month', 'type_fees_id')
                ->get();
        else
            $_data = PaymentDetail::with(['type_fees'])
                ->where('academic_year', getActiveAcademicYear())
                ->where('school_id', $request->school_id)
                ->selectRaw('sum(fees_amount) as sum, MONTH(created_at) month, type_fees_id')
                ->groupBy('month', 'type_fees_id')
                ->get();

        $listFees = TypeFees::where('school_id', $request->school_id)->orderBy('created_at', 'desc')->get();

        $general_data = [];
        foreach ($listFees as $parentFee) {
            $fee_data = [];
            $fee_data['name'] = $parentFee->label;
            $months_amounts = array_fill(0, 12, 0);
            foreach ($_data as $childFee) {
                if ($parentFee->id == $childFee->type_fees_id) {
                    $months_amounts[$childFee->month - 1] = (int)$childFee->sum;
                }
            }
            $fee_data['data'] = $months_amounts;
            $general_data[] = $fee_data;
        }

        $max_amount = 0;
        foreach ($_data as $fee) {
            if ($fee->sum > $max_amount) {
                $max_amount = $fee->sum;
            }
        }

        return response()->json([
            'data' => $general_data,
            'max_amount' => $max_amount + 10000,
            'message' => 'Une erreur interne est survenue',
            'status' => 500
        ]);
    }
}
