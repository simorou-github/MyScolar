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
        'school_id',
        'classe_id',
        'groupe_id',
        'create_id',
        'update_id',
        'status'
    ];

    public function school(){
        return $this->belongsTo('App\Models\School', 'school_id');
    }

    public function classe(){
        return $this->belongsTo('App\Models\Classe', 'classe_id');
    }

    public function groupe(){
        return $this->belongsTo('App\Models\Groupe', 'groupe_id');
    }

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
