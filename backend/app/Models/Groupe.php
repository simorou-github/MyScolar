<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Groupe extends Model
{
    use HasFactory, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'description', 'status'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $e) => match($e) {
                'created' => 'Groupe créé',
                'updated' => 'Groupe mis à jour',
                'deleted' => 'Groupe supprimé',
                default   => "Groupe : $e",
            })
            ->useLogName('groupe');
    }
    public $incrementing = false;
    public $keyType = 'string';

    public $fillable = [
        'id',
        'code',
        'description',
        'status',
        'school_id'
    ];

    public function school()
    {
        return $this->belongsTo('App\Models\School', 'school_id');
    }
    public function creater()
    {
        return $this->belongsTo('App\Models\User', 'create_id');
    }
    public function updater()
    {
        return $this->belongsTo('App\Models\User', 'update_id');
    }
}
