<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClasse extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'school_classe_id',
        'school_id',
        'classe_id',
        'type_fees_id',
        'type_payment',
        'status',
        'academic_year',
        'amount_fees',
        'create_id',
        'update_id'
    ];

    public function type_fees(){
        return $this->belongsTo('App\Models\TypeFees', 'type_fees_id');
    }

    public function type_payment(){
        return $this->belongsTo('App\Models\TypePayment', 'label',);
    }

    public function school_classe(){
        return $this->belongsTo('App\Models\SchoolClasse', 'school_classe_id');
    }

    public function schools(){
        return $this->belongsTo('App\Models\School', 'school_id');
    }
    
    public function classes(){
        return $this->belongsTo('App\Models\Classe', 'classe_id');
    }

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
