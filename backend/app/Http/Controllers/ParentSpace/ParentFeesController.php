<?php

namespace App\Http\Controllers\ParentSpace;

use App\Exceptions\ScolarException;
use App\Http\Controllers\Controller;
use App\Models\BalanceFees;
use App\Models\Operator;
use App\Models\ParentStudentLink;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ParentFeesController extends Controller
{
    // Vérifie que l'apprenant demandé est bien associé et validé pour le parent connecté
    protected function assertOwnership(string $studentId): void
    {
        $parentId = Auth::guard('parent-api')->id();
        $owns = ParentStudentLink::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->where('status', 'VALIDE')
            ->exists();

        if (!$owns) {
            throw new ScolarException("Vous n'êtes pas autorisé à consulter les informations de cet apprenant.");
        }
    }

    // Liste des frais/solde d'un apprenant, filtrable par année académique
    public function getStudentBalance(Request $request)
    {
        $request->validate(['student_id' => 'required|string']);
        $this->assertOwnership($request->student_id);

        $params = [['student_id', '=', $request->student_id]];
        if ($request->academic_year) {
            $params[] = ['academic_year', '=', $request->academic_year];
        }

        $balanceFees = BalanceFees::with('type_fees')->where($params)
            ->orderBy('academic_year', 'DESC')->orderBy('fees_label')->get();

        $student = Student::with('school')->find($request->student_id);
        $operators = Operator::where('country_id', $student->school->country_id)
            ->where('is_cash_mode', false)
            ->where('status', true)->get();

        return response()->json([
            'data' => $balanceFees,
            'student' => $student,
            'operators' => $operators,
            'sum_fees' => $balanceFees->sum('fees_amount'),
            'sum_balance' => $balanceFees->sum('balance'),
            'status' => 200,
        ]);
    }

    // Liste des années académiques pour lesquelles l'apprenant a des frais
    public function getStudentAcademicYears(Request $request)
    {
        $request->validate(['student_id' => 'required|string']);
        $this->assertOwnership($request->student_id);

        $years = BalanceFees::where('student_id', $request->student_id)
            ->select('academic_year')->distinct()->orderBy('academic_year', 'DESC')->pluck('academic_year');

        return response()->json(['data' => $years, 'status' => 200]);
    }
}
