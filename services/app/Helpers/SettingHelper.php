<?php

use App\Models\AcademicYear;
use App\Models\Parameter;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Calculation\Logical\Conditional;

function generateStudentRegistration($school_country_code){
    $regis = "";
    $last_student_code_plus_one = Student::max('code') + 1;
    $current_size = config('constants.size_registration') - strlen((string)$last_student_code_plus_one);

    for($i = 0; $i < $current_size; $i++){
        $regis.="0";
    }
    return [
        'registration' => $school_country_code . $regis . $last_student_code_plus_one,
        'last_student_code_plus_one' => $last_student_code_plus_one
    ];
}

function getScolarPlusRate(){
    if($scolar_rate = Parameter::where('label', 'scolar_rate')->where('status', true)->first()){
        return $scolar_rate->value;
    }
    return 0;
}

//Get Active Academic year
function getActiveAcademicYear()
{
    if (!$academic_year = AcademicYear::where('status', true)->first()) {
        return null;
    }
    return $academic_year->academic_year;
}

// Generate id for each table in database
function generateDBTableId($length, $model_name): string
{
    $random_id = Str::random($length); //Generate random string
    $exists = $model_name::where('id', $random_id)->get(['id']);

    if (isset($exists[0]->id)) { //id exists in table
        return generateDBTableId($length, $model_name); //Retry with another generated id
    }
    return $random_id; //Return the generated id as it does not exist in the DB
}

//General Model Search
function modelGeneralSearch($model, $relation=[], $condition=[]): string
{
    $data = $model::with($relation)->where($condition)->get();
    return $data;
}

function getCurrentUserId(){
    return auth()->user()->id;
}

function getMonthsOfYear(){
    $months = [
        ['label' => 'Janvier', 'month_num' => 1],
        ['label' => 'Février', 'month_num' => 2],
        ['label' => 'Mars', 'month_num' => 3],
        ['label' => 'Avril', 'month_num' => 4],
        ['label' => 'Mai', 'month_num' => 5],
        ['label' => 'Juin', 'month_num' => 6],
        ['label' => 'Juillet', 'month_num' => 7],
        ['label' => 'Août', 'month_num' => 8],
        ['label' => 'Septembre', 'month_num' => 9],
        ['label' => 'Octobre', 'month_num' => 10],
        ['label' => 'Novembre', 'month_num' => 11],
        ['label' => 'Décembre', 'month_num' => 12]        
    ];

    return $months;
}


  
    