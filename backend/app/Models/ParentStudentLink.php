<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ParentStudentLink extends Model
{
    use HasFactory, LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $e) => match ($e) {
                'created' => 'Demande d\'association parent-apprenant créée',
                'updated' => 'Demande d\'association parent-apprenant mise à jour',
                default   => "Association parent-apprenant : {$e}",
            })
            ->useLogName('association_parent');
    }

    public $incrementing = false;
    public $keyType = 'string';

    public $fillable = [
        'id',
        'parent_id',
        'student_id',
        'school_id',
        'status',
        'reject_reason',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'validated_at' => 'datetime',
    ];

    public function parent_user()
    {
        return $this->belongsTo(ParentUser::class, 'parent_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}
