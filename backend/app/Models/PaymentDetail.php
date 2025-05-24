<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentDetail extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'payment_id',
        'school_id',
        'classe_id',
        'student_id',
        'academic_year',
        'balance_fees_id',
        'fees_amount',
        'type_fees_id',
        'scolar_commission',
        'operator_id',
        'create_id',
        'update_id',
        'school_classe_fees_id',
    ];

    public function payment(){
        return $this->belongsTo('App\Models\Payment', 'payment_id');
    }

    public function school_classe_fees(){
        return $this->belongsTo('App\Models\SchoolClasseFees', 'school_classe_fees_id');
    }

    public function school(){
        return $this->belongsTo('App\Models\School', 'school_id');
    }

    public function classe(){
        return $this->belongsTo('App\Models\Classe', 'classe_id');
    }

    public function student(){
        return $this->belongsTo('App\Models\Student', 'student_id');
    }

    public function academic_year(){
        return $this->belongsTo('App\Models\AcademicYear', 'academic_year');
    }

    public function balance_fees(){
        return $this->belongsTo('App\Models\BalanceFees', 'balance_fees_id');
    }

    public function type_fees(){
        return $this->belongsTo('App\Models\TypeFees', 'type_fees_id');
    }
    
    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
    public function operator(){
        return $this->belongsTo('App\Models\Operator', 'operator_id');
    }
}
