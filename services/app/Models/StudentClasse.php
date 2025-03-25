<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentClasse extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'student_id', 
        'classe_id',
        'school_classe_id',
        'academic_year',
    ];

    public function student(){
        return $this->belongsTo('App\Models\Student', 'student_id');
    }

    public function classe(){
        return $this->belongsTo('App\Models\SchoolClasse', 'classe_id');
    }

    public function school_classe(){
        return $this->belongsTo('App\Models\SchoolClasse', 'school_classe_id');
    }

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
