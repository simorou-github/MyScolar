<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolClasseFeesDetail extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'school_classe_fees_id',            
        'fees_label',
        'due_date',
        'due_amount',
        'create_id',
        'update_id'
    ];
    

    public function school_classe_fees(){
        return $this->belongsTo('App\Models\SchoolClasseFees', 'school_classe_fees_id');
    }

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
