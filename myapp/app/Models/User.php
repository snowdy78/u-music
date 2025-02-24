<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $fillable = [
        'login',
        'email',
        'password',
        'is_admin',
        'img_id'
    ];
    public $timestamps = false;
}
