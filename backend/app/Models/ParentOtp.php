<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentOtp extends Model
{
    use HasFactory;

    public $fillable = [
        'channel',
        'purpose',
        'email',
        'phone',
        'code',
        'consumed',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'consumed' => 'boolean',
    ];
}
