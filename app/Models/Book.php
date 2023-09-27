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
        'description',
        'updated_by'

    ];
   
    public function author(){
        return $this->belongsTo(User::class, 'author');
    }

    public function sections(){
        return $this->hasMany(Section::class);
    }
    
}
