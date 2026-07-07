<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Tymon\JWTAuth\Contracts\JWTSubject;

class ParentUser extends Authenticatable implements JWTSubject
{
    use HasFactory, LogsActivity;

    protected $table = 'parents';

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['last_name', 'first_name', 'email', 'phone', 'status'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn(string $e) => match ($e) {
                'created' => "Nouvelle inscription parent : {$this->email}",
                'updated' => "Mise à jour parent : {$this->email}",
                'deleted' => "Suppression parent : {$this->email}",
                default   => "Parent {$e}",
            })
            ->useLogName('parent');
    }

    public $incrementing = false;
    public $keyType = 'string';

    protected $fillable = [
        'id',
        'last_name',
        'first_name',
        'email',
        'phone',
        'country_id',
        'email_verified',
        'phone_verified',
        'status',
        'reject_reason',
        'activation_token',
        'activated_at',
    ];

    protected $hidden = [
        'activation_token',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
    ];

    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function links()
    {
        return $this->hasMany(ParentStudentLink::class, 'parent_id');
    }

    public function validatedStudents()
    {
        return $this->belongsToMany(Student::class, 'parent_student_links', 'parent_id', 'student_id')
            ->wherePivot('status', 'VALIDE');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'id' => $this->id,
            'last_name' => $this->last_name,
            'first_name' => $this->first_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'token_type' => 'bearer',
            'space' => 'parent',
        ];
    }
}
