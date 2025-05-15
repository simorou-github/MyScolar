<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;
    public $fillable = [
        'academic_year',
        'date',
        'status',
        'create_id',
        'update_id'
    ];

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
