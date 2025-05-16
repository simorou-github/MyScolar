<?php

namespace App\Http\Controllers\SchoolSpace;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SchoolClasse;
use App\Models\SchoolClasseFees;
use App\Models\TypeFees;
use Exception;
use Illuminate\Support\Facades\Log;

class SchoolDashboardController extends Controller
{
    //Get School Class Fees that are not assigned 
    public function getUnassignedSchoolFees(Request $request)
    {

        //Classes without Fees
        $scFees = SchoolClasseFees::where('school_id', $request->school_id)
            ->where('academic_year', getActiveAcademicYear())->get('school_classe_id');
            
        $scNotAssigned = SchoolClasse::with(['classe', 'groupe'])->where('school_id', $request->school_id)->whereNotIn('id', $scFees)->get();
        //Log::info($scNotAssigned);
        

        //Fees not assigned
        $scFees1 = SchoolClasseFees::where('school_id', $request->school_id)
            ->where('academic_year', getActiveAcademicYear())->get('type_fees_id');
            Log::info($scFees1);
            
        $feesNotAssigned = TypeFees::whereNotIn('id', $scFees1)->where('school_id', $request->school_id)->get();
        //Log::info($feesNotAssigned);

        return response()->json([
            'scNotAssigned' => $scNotAssigned,
            'feesNotAssigned' => $feesNotAssigned,
            'message' => 'Les frais.',
            'status' => 200
        ]);
    }

}
