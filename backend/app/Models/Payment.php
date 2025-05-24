<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'student_id',
        'classe_id',
        'school_id',
        'academic_year',
        'details',
        'amount',
        'phone',
        'email',
        'operation_date',
        'operator',
        'transaction_id',
        'scolar_commission',
        'transaction_status',
    ];

    public function student(){
        return $this->belongsTo('App\Models\Student', 'student_id');
    }

    public function classe(){
        return $this->belongsTo('App\Models\SchoolClasse', 'classe_id');
    }

    public function operator(){
        return $this->belongsTo('App\Models\Operator', 'operator');
    }
    public function school(){
        return $this->belongsTo('App\Models\School', 'school_id');
    }
    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
