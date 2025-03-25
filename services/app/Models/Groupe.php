<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'code',
        'description',
        'status',
        'school_id'
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
