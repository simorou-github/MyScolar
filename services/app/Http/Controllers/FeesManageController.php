<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BalanceFees;
use App\Models\Operator;
use App\Models\Payment;
use App\Models\PaymentDetail;
use App\Models\SchoolClasse;
use Illuminate\Http\Request;
use App\Models\SchoolClasseFees;
use App\Models\SchoolClasseFeesDetails;
use Illuminate\Support\Facades\Storage;

use App\Models\Student;
use App\Models\StudentClasse;
use Carbon\Carbon;
use Exception;
use PDF;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel as FacadesExcel;


use App\Exports\BalanceOfFees;
use Maatwebsite\Excel\Facades\Excel;

class FeesManageController extends Controller
{
    //Assign Fees to Class
    function assigneFeesToClasse(Request $request)
    {
        try {
            if (!getActiveAcademicYear()) {
                return response()->json([
                    'data' => [],
                    'message' => 'L\'année n\'est pas encore ouverte. Veuillez réessayer plus tard.',
                    'status' => 500
                ]);
            }

            //Check if fees row amount sum is equal to input amount_fees
            if ($request->fees) {

                $fees_row_amount_sum = 0;
                foreach ($request->fees as $value) {
                    $fees_row_amount_sum += $value['due_amount'];
                }

                if ($fees_row_amount_sum != $request->amount_fees) {
                    return response()->json([
                        'data' => [],
                        'message' => 'La somme des répartitions est différente du motant total. Veuillez corriger.',
                        'status' => 500
                    ]);
                }
            }

            // Check if SchoolClasse exist
            if ($sc = SchoolClasse::where('id', $request->school_classe_id)->first()) {

                //Check if SchoolClassFees allready exist with passed AccademicYear
                $scFees = SchoolClasseFees::where(['school_classe_id' => $sc->id, 'academic_year' => $request->academic_year, 'type_fees_id' => $request->type_fees_id])
                    ->first();

                DB::beginTransaction();
                if ($scFees) { //Existe

                    //Check if SchoolClasseFees already has payment at the current year
                    if ($hasPayment = PaymentDetail::where(['school_classe_fees_id' => $scFees->id, 'academic_year' => $request->academic_year])
                        ->first()
                    ) {
                        return response()->json([
                            'data' => [],
                            'message' => 'Impossible de modifier l\'affectation existante car il existe déjà des paiements sur ce frais.',
                            'status' => 500
                        ]);
                    }

                    //Update SchoolClassFees
                    $scFees->update([
                        'academic_year' => getActiveAcademicYear(),
                        'amount_fees' => $request->amount_fees,
                        'type_fees_id' => $request->type_fees_id,
                        'type_payment' => $request->type_payment['label'],
                        'school_id' => $sc->school_id,
                        'classe_id' => $sc->classe_id,
                        'school_classe_id' => $sc->id,
                        'updated_at' => Carbon::now()
                    ]);

                    //Get all old SchoolClasseFeesDetails
                    if ($scfDetails = SchoolClasseFeesDetails::where('school_classe_fees_id', $scFees->id)
                        ->get()
                    ) {
                        //Delete all previouse School Classe Fees Details
                        foreach ($scfDetails as $value) {
                            $value->delete(); //delete existing rows
                        }

                        //Create new School Classe Fees Details
                        foreach ($request->fees as $value) {
                            SchoolClasseFeesDetails::create([
                                'id' => generateDBTableId(20, 'App\Models\SchoolClasseFeesDetails'),
                                'fees_label' => $value['label'],
                                'due_date' => $value['due_date'],
                                'due_amount' => $value['due_amount'],
                                'school_classe_fees_id' => $scFees->id,
                                'created_at' => Carbon::now()
                            ]);
                        }

                        //Get all old SchoolClasseFeesBalence
                        if ($balanceFees = BalanceFees::where('school_classe_fees_id', $scFees->id)
                            ->get()
                        ) {
                            //Delete existing rows of Balance Fees
                            foreach ($balanceFees as $value) {
                                $value->delete();
                            }
                            
                            //Get existing student of SchoolClasse to set Balance Fees
                            $studentsOfClasse = StudentClasse::where('school_classe_id', $request->school_classe_id)->get();
                            Log::info("----Init----");
                            Log::info($studentsOfClasse);
                            Log::info("----Fin----");
                            if ($studentsOfClasse->count() > 0) {
                                foreach ($studentsOfClasse as  $student) {
                                    foreach ($request->fees  as $fee) {
                                        $balance = BalanceFees::create([
                                            'id' => generateDBTableId(29, "App\Models\BalanceFees"),
                                            'student_id' => $student->student_id,
                                            'classe_id' => $student->school_classe_id,
                                            'school_id' => $sc->school_id,
                                            'type_fees_id' => $scFees->type_fees_id,
                                            'academic_year' => getActiveAcademicYear(),
                                            'fees_amount' => $fee['due_amount'],
                                            'balance' => $fee['due_amount'],
                                            'fees_label' => $fee['label'],
                                            'due_date' => $fee['due_date'],
                                            'school_classe_fees_id' => $scFees->id
                                        ]);
                                    }
                                }
                            }
                        }
                    }
                    $message = 'Une affectation existante trouvée et mise à jour.';
                } else { //New, Create SchoolClasseFees row
                    $scFees = SchoolClasseFees::create([
                        'id' => generateDBTableId(20, 'App\Models\SchoolClasseFees'),
                        'academic_year' => getActiveAcademicYear(),
                        'amount_fees' => $request->amount_fees,
                        'type_fees_id' => $request->type_fees_id,
                        'type_payment' => $request->type_payment['label'],
                        'school_id' => $sc->school_id,
                        'classe_id' => $sc->classe_id,
                        'school_classe_id' => $sc->id,
                        'created_at' => Carbon::now()
                    ]);

                    if ($scFees) { //Create new SchoolClasseFeesDetails row
                        foreach ($request->fees as $value) {
                            SchoolClasseFeesDetails::create([
                                'id' => generateDBTableId(20, 'App\Models\SchoolClasseFeesDetails'),
                                'fees_label' => $value['label'],
                                'due_date' => $value['due_date'],
                                'due_amount' => $value['due_amount'],
                                'school_classe_fees_id' => $scFees->id,
                                'created_at' => Carbon::now()
                            ]);
                        }
                    }
                    //Get existing student of SchoolClasse to set Balance Fees
                    $studentsOfClasse = StudentClasse::where('school_classe_id', $request->school_classe_id)->get();
                    
                    if ($studentsOfClasse->count() > 0) {
                        foreach ($studentsOfClasse as  $student) {
                            foreach ($request->fees  as $detail) {
                                $balance = BalanceFees::create([
                                    'id' => generateDBTableId(29, "App\Models\BalanceFees"),
                                    'student_id' => $student->student_id,
                                    'classe_id' => $student->school_classe_id,
                                    'school_id' => $sc->school_id,
                                    'type_fees_id' => $scFees->type_fees_id,
                                    'academic_year' => getActiveAcademicYear(),
                                    'fees_amount' => $detail['due_amount'],
                                    'balance' => $detail['due_amount'],
                                    'fees_label' => $detail['label'],
                                    'due_date' => $detail['due_date'],
                                    'school_classe_fees_id' => $scFees->id
                                ]);
                            }
                        }
                    }
                    $message = 'Frais ajouté avec succès.';
                }

                DB::commit();
                return response()->json([
                    'data' => [],
                    'message' => $message,
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'data' => [],
                    'message' => 'Attention ! Classe non disponible pour l\'école. Veuillez contacter l\'administrateur.',
                    'status' => 500
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            DB::rollBack();
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
                'status' => 500
            ]);
        }
    }


    //Assign Fees to Class
    function getStudentFeesBalance(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => ['required'],
            ]);
            if (!$validated) {
                return response()->json([
                    'data' => null,
                    'message' => 'Les champs requis ne sont pas tous fournis.',
                    'status' => 500
                ]);
            }

            $params[] = ['academic_year', '=', getActiveAcademicYear()];
            if ($request->input('id')) {
                $params[] = ['id', '=', $request->id];
            }
            if ($request->input('student_id')) {
                $params[] = ['student_id', '=', $request->student_id];
            }

            $balanceFees = BalanceFees::with('type_fees')->where($params)
                ->get();

            $details_transactions = PaymentDetail::with(['payment', 'type_fees', 'balance_fees'])
                ->where('student_id', $request->student_id)
                //->where('classe_id', $request->classe_id)
                ->where('academic_year', $request->academic_year)
                ->get();

            return response()->json([
                'data' => $balanceFees,
                'details_transactions' => $details_transactions,
                'message' => 'Balance',
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


    //Assign Fees to Class
    function getFeesDetails(Request $request)
    {
        try {

            $params[] = ['academic_year', '=', getActiveAcademicYear()];

            if ($request->school_id) {
                $params[] = ['school_id', '=', $request->school_id];
            }
            if ($request->type_fees_id) {
                $params[] = ['type_fees_id', '=', $request->type_fees_id];
            }
            $school_fees = SchoolClasseFees::with(['type_fees', 'classes', 'school_classe.groupe'])
                ->where('type_fees_id', $request->type_fees_id)->where($params)
                ->get();
         
            return response()->json([
                'school_fees' => $school_fees,
                'message' => 'Balance',
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


    //Assign Fees to Class
    function searchStudentFeesBalanceForParentPayment(Request $request)
    {
        try {
            $validated = $request->validate([
                'birthday' => ['required'],
                'code_scolar' => ['required'],
                'academic_year' => ['required'],
            ]);

            if (!$validated) {
                return response()->json([
                    'data' => null,
                    'message' => 'Les champs requis ne sont pas tous fournis.',
                    'status' => 500
                ]);
            }

            $params[] = [];

            if ($request->birthday) {
                $params[] = ['birthday', '=', $request->birthday];
            }

            if ($request->code_scolar) {
                $params[] = ['code_scolar', '=', $request->code_scolar];
            }

            //Check if student exist
            $student = Student::with('school')->where('code_scolar', $request->code_scolar)->where('birthday', $request->birthday)
                ->first();

            if (!$student) {
                return response()->json([
                    'data' => null,
                    'message' => 'Aucun apprenant ne correspond aux critères recherchés.',
                    'status' => 500
                ]);
            }

            //Check if student has inscription
            $student_classe = StudentClasse::with(['classe', 'classe.classe', 'classe.groupe'])->where('student_id', $student->id)->where('academic_year', $request->academic_year)
                ->first();

            if (!$student_classe) {
                return response()->json([
                    'data' => null,
                    'message' => 'L\'apprenant n\'a pas été inscrit dans le système au cours de l\'année ' . $request->academic_year,
                    'status' => 500
                ]);
            }

            //Get student balance Fees
            $balanceFees = BalanceFees::with('type_fees')
                ->where('student_id', $student->id)
                ->where('school_id', $student->school_id)
                ->where('classe_id', $student_classe->classe_id)
                ->where('academic_year', $student_classe->academic_year)
                ->orderBy('updated_at', 'ASC')->get();

            //Get School country's operator
            $operators = Operator::with('country')
                ->where('country_id', $student->school->country_id)->get();

            return response()->json([
                'balanceFees' => $balanceFees,
                'student' => $student,
                'student_classe' => $student_classe,
                'operators' => $operators,
                'message' => 'Balance',
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

    
    //Suivi des soldes des paiements
    function getFeesBalanceFollowupData(Request $request)
    {
        try {
            $params = [];
            if (!$request->academic_year) {
                $params[] = ['b.academic_year', '=', getActiveAcademicYear()];
            }
            if ($request->id) {
                $params[] = ['b.id', '=', $request->id];
            }
            if ($request->fees_label) {
                $params[] = ['b.fees_label', 'like', '%'.$request->fees_label.'%'];
            }
            if ($request->student_id) {
                $params[] = ['b.student_id', '=', $request->student_id];
            }
            if ($request->classe_id) {
                $params[] = ['b.classe_id', '=', $request->classe_id];
            }
            if ($request->type_fees_id) {
                $params[] = ['b.type_fees_id', '=', $request->type_fees_id];
            }
            if ($request->school_id) {
                $params[] = ['b.school_id', '=', $request->school_id];
            }

            $balanceFees = DB::table('balance_fees as b')
                ->leftJoin('type_fees as tf', 'b.type_fees_id', '=', 'tf.id')
                ->leftJoin('schools as s', 'b.school_id', '=', 's.id')
                ->leftJoin('school_classes as sc', 'b.classe_id', '=', 'sc.id')
                ->leftJoin('students as st', 'b.student_id', '=', 'st.id')
                ->leftJoin('classes as c', 'sc.classe_id', '=', 'c.id')
                ->leftJoin('groupes as g', 'sc.groupe_id', '=', 'g.id')
                ->where($params)
                ->select('b.*',
                    's.ifu as ifu', 's.social_reason as social_reason', 's.email as school_email', 's.owner as school_owner', 's.tel as school_tel', 's.location as school_location', 
                    'st.code_scolar', 'st.code as student_code', 'st.last_name as student_last_name', 'st.first_name as student_first_name','st.sex as student_sex', 'st.matricule as student_matricule', 'st.email as student_email', 'st.birthday as student_birthday', 'st.phone as student_phone',
                    'c.code as classe_code', 'c.label as classe_label', 
                    'g.code as groupe_code', 'g.description as groupe_label',
                    'tf.label as type_fees_label')
                ->orderBy('st.code_scolar')->orderBy('b.fees_label')
                ->get();

            return response()->json([
                'data' => $balanceFees,
                'sum_fees' => $balanceFees->sum('fees_amount'),
                'sum_balance' => $balanceFees->sum('balance'),
                'message' => 'Balance'
            ],200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
            ], 500);
        }
    }


    //Export to Soldes des Paiements PDF/XLS
    function getExportOfFeesBalance(Request $request)
    {
        try {
            $params = [];
            if (!$request->academic_year) {
                $params[] = ['b.academic_year', '=', getActiveAcademicYear()];
            }
            if ($request->id) {
                $params[] = ['b.id', '=', $request->id];
            }
            if ($request->fees_label) {
                $params[] = ['b.fees_label', 'like', '%'.$request->fees_label.'%'];
            }
            if ($request->student_id) {
                $params[] = ['b.student_id', '=', $request->student_id];
            }
            if ($request->classe_id) {
                $params[] = ['b.classe_id', '=', $request->classe_id];
            }
            if ($request->type_fees_id) {
                $params[] = ['b.type_fees_id', '=', $request->type_fees_id];
            }
            if ($request->school_id) {
                $params[] = ['b.school_id', '=', $request->school_id];
            }

            if($request->type == 'xls'){
                return FacadesExcel::download(new BalanceOfFees($params), "SoldesFrais_".date('Ymd').date('Hi').".xlsx");
            } else {
                $balanceFeesData = getFeesBalanceData($params);
                $vewData = [
                    'balanceFeesData' => $balanceFeesData['data'],
                    'sum_fees' => $balanceFeesData['sum_fees'],
                    'sum_balance' => $balanceFeesData['sum_balance'],
                    'nbre_fees' => $balanceFeesData['nbre_fees']
                ];
                $pdf = PDF::loadView("payment.fees-balance-export", $vewData)->setPaper('a4', 'landscape');
                return $pdf->download("SoldesFrais_".date('Ymd').date('Hi').".pdf");
            }   

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'data' => [],
                'message' => 'Une erreur interne est survenue',
            ], 500);
        }
    }
}
