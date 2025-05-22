<?php

use App\Models\AcademicYear;
use App\Models\Parameter;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

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

//Get Active Academic year
function getFeesBalanceData(Array $param)
{
    if (!$param) {
        return [];
    } else {
        $balanceFeesData = DB::table('balance_fees as b')
            ->leftJoin('type_fees as tf', 'b.type_fees_id', '=', 'tf.id')
            ->leftJoin('schools as s', 'b.school_id', '=', 's.id')
            ->leftJoin('school_classes as sc', 'b.classe_id', '=', 'sc.id')
            ->leftJoin('students as st', 'b.student_id', '=', 'st.id')
            ->leftJoin('classes as c', 'sc.classe_id', '=', 'c.id')
            ->leftJoin('groupes as g', 'sc.groupe_id', '=', 'g.id')
            ->where($param)
            ->select('b.*',
                's.ifu as ifu', 's.social_reason as social_reason', 's.email as school_email', 's.owner as school_owner', 's.tel as school_tel', 's.location as school_location', 
                'st.code_scolar', 'st.code as student_code', 'st.last_name as student_last_name', 'st.first_name as student_first_name','st.sex as student_sex', 'st.matricule as student_matricule', 'st.email as student_email', 'st.birthday as student_birthday', 'st.phone as student_phone',
                'c.code as classe_code', 'c.label as classe_label', 
                'g.code as groupe_code', 'g.description as groupe_label',
                'tf.label as type_fees_label')
            ->orderBy('st.code_scolar')->orderBy('b.fees_label')
            ->get();
        return [
            'data' => $balanceFeesData,
            'sum_fees' => $balanceFeesData->sum('fees_amount'),
            'sum_balance' => $balanceFeesData->sum('balance'),
            'nbre_fees' => $balanceFeesData->count(),
        ];
    }
}

  
    