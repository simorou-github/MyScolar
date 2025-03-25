<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleHasPermission extends Model
{
    use HasFactory;
    
    public $fillable = [
        'id',
        'role_id',
        'permission_id',
    ];

    public function role(){
        return $this->belongsTo('App\Models\Role', 'role_id');
    }

    public function permission(){
        return $this->belongsTo('App\Models\Permission', 'permission_id',);
    }
}
