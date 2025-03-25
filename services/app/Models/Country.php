<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;
    public $fillable = [
        'name', 
        'code',
        'phone_code',
        'masking'
    ];
}
