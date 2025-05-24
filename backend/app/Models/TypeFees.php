<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeFees extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'label', 
        'school_id', 
        'status',
    ];
}
