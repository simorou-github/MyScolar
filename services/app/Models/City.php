<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;
    public $fillable = [
        'name', 
        'status', 
        'country_id'
    ];

    public function country(){
        return $this->belongsTo('App\Models\Country', 'country_id');
    }
}
