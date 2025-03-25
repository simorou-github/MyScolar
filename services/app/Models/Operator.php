<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operator extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    public $fillable = [
        'id',
        'name', 
        'status', 
        'country_id'
    ];

    public function country(){
        return $this->belongsTo('App\Models\Country', 'country_id');
    }

}
