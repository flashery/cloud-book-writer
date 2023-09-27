<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $books = Book::all();

        if($request->is('api/*')) {
            return $books;
        }

        return Inertia::render('Book', ['books' => $books]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('Book/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
        ]);
        
        return Book::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        if($book) {
            return response()->json(['error'=> 'Book not found'], 404);
        }

        return $book;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        return Inertia::render('Book/Edit', ['book' => $book]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        if(!$book) {
            return response()->json(['error'=> 'Book not found'], 404);
        }

        return $book->update($request->all());

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        if(!$book) {
            return response()->json(['error'=> 'Book not found'], 404);
        }
        
        return $book->delete();
    }
}
