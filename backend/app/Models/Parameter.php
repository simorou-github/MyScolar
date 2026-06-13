<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Parameter extends Model
{
    use HasFactory, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['label', 'value', 'description', 'status'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $e) => match($e) {
                'created' => 'Paramètre créé',
                'updated' => 'Paramètre mis à jour',
                'deleted' => 'Paramètre supprimé',
                default   => "Paramètre : $e",
            })
            ->useLogName('parametre');
    }
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
