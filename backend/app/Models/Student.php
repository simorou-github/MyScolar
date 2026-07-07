<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Student extends Model
{
    use HasFactory, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['last_name', 'first_name', 'email', 'matricule', 'sex', 'birthday', 'phone', 'status'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $e) => match($e) {
                'created' => 'Apprenant créé',
                'updated' => 'Apprenant mis à jour',
                'deleted' => 'Apprenant supprimé',
                default   => "Apprenant : $e",
            })
            ->useLogName('apprenant');
    }
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'code_scolar', 
        'code', 
        'last_name',
        'first_name',
        'sex',
        'matricule',
        'email',
        'birthday',
        'phone',
        'school_id',
        'status'
    ];

    public function school(){
        return $this->belongsTo('App\Models\School', 'school_id');
    }

    public function studentClasses(){
        return $this->hasMany('App\Models\StudentClasse', 'student_id');
    }

    public function creater(){
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    
    public function updater(){
        return $this->belongsTo('App\Models\User', 'update_id');
    }
    
}
