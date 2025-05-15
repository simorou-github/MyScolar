<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypePayment extends Model
{
    use HasFactory;
    public $fillable = [
        'label', 
        'description', 
        'due_date_number', //Echéance
        'status'
    ];
}
