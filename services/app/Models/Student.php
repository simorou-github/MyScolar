<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'code_scolar', 
        'code', 
        'last_name',
        'first_name',
        'sex',
        'matricule',
        'email',
        'birthday',
        'phone',
        'school_id',
        'status'
    ];

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
