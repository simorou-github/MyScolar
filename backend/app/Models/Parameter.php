<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parameter extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'label',
        'value',
        'description',
        'status',
    ];

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
