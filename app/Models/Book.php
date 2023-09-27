<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'publisher',
        'isbn',
        'image',
        'user_id',
        'description',

    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function sections(){
        return $this->hasMany(Section::class);
    }
}
