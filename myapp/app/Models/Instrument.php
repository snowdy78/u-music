<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instrument extends Model
{
    use HasFactory;

    protected $fillable = ['category', 'model_name', 'price', 'in_stock', 'img_id'];
    public $timestamps = false;
}
