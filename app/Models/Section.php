<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable =  [
        'book_id',
        'parent_id',
        'title',
        'content',
        'nesting_level',
        'order',
        'updated_by'
    ];

    public function book(){
        return $this->belongsTo(Book::class);
    }

    public function children()
    {
        return $this->hasMany(Section::class, 'parent_id');
    }
    
    public function allDescendants()
    {
        return $this->children()->with('allDescendants');
    }

    public function parent(){
        return $this->belongsTo(Section::class, 'parent_id');
    }

    public function updateBy(){
        return $this->belongsTo(User::class, 'updated_by');
    }
}
