<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'ifu', 
        'social_reason',
        'email',
        'location',
        'country_id',
        'city_id',
        'owner',
        'tel',
        'status',
        'groupe_id',
        'document',
        'reject_reason',
        'owner_lastname',
        'owner_firstname'
    ];

    public function groupe(){
        return $this->belongsTo('App\Models\Groupe', 'groupe_id');
    }
    public function country(){
        return $this->belongsTo('App\Models\Country', 'country_id');
    }

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }

    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }

    public function activater(){
        return $this->belongsTo('App\Models\User', 'activation_id');
    }
    
    public function approver(){
        return $this->belongsTo('App\Models\User', 'approval_id');
    }

    public function canceller(){
        return $this->belongsTo('App\Models\User', 'cancellation_id');
    }

    public function classe(){
        return $this->belongsTo('App\Models\Classe', 'classe_id');
    }
}
