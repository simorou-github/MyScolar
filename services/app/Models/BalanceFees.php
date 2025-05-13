<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceFees extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'student_id',
        'classe_id',
        'school_id',
        'type_fees_id',
        'fees_amount',
        'fees_label',
        'balance',
        'due_date',
        'academic_year',
        'school_classe_fees_id',
    ];

    public function student(){
        return $this->belongsTo('App\Models\Student', 'id');
    }

    public function classe(){
        return $this->belongsTo('App\Models\SchoolClasse', 'classe_id');
    }

    public function school_classe_fees(){
        return $this->belongsTo('App\Models\SchoolClasseFees', 'school_classe_fees_id');
    }

    public function type_fees(){
        return $this->belongsTo('App\Models\TypeFees', 'type_fees_id');
    }

    public function school(){
        return $this->belongsTo('App\Models\School', 'school_id');
    }
}
