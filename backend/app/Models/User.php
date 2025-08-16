<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    public $incrementing = false;
    public $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'last_name',
        'first_name',
        'email',
        'password',
        'status',
        'email_verified_at',
        'school_id',
        'is_true_password',
        'temp_password'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function school()
    {
        return $this->belongsTo('App\Models\School', 'school_id');
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        // Récupérer l'utilisateur connecté
        $user = User::with('school')->where('email', $this->email)->first();
        $roles = $user->getRoleNames(); 
        Log::info($roles);
        return [
            'id' => $user->id,
<<<<<<< HEAD
            'roles' => $roles, 
=======
            'roles' => $roles,
>>>>>>> 7376667d9159aaad64390f6c5a997d24ed148df0
            'last_name' => $user->last_name,
            'first_name' => $user->first_name,
            'email' => $user->email,
            'status' => $user->status,
            'school_id' => $user->school?->id,
            'social_reason' => $user->school?->social_reason,
            'ac' => getActiveAcademicYear(),
            'token_type' => 'bearer',
        ];
    }
}
