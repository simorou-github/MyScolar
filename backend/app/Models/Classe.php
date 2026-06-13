<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Classe extends Model
{
    use HasFactory, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['code', 'label', 'rank', 'status'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $e) => match($e) {
                'created' => 'Classe créée',
                'updated' => 'Classe mise à jour',
                'deleted' => 'Classe supprimée',
                default   => "Classe : $e",
            })
            ->useLogName('classe');
    }
    public $incrementing = false;
    public $keyType = 'string'; 
    
    public $fillable = [
        'id',
        'code', 
        'label',
        'rank',
        'school_fees',
        'status',
    ];

}
