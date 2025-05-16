<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogTrace extends Model
{
    use HasFactory;
    public $fillable = [
        'action', 
        'details',
    ];
}
