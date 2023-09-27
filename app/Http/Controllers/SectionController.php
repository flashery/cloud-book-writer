<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sections = Section::with('author')->get();

        if($request->is('api/*')) {
            return $sections;
        }

        return Inertia::render('Section/List', ['sections' => $sections]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $book = [
            'book_id',
            'parent_id' => 0,
            'title'=>'',
            'content'=> '',
            'nesting_level' => 0,
            'order' => 0,
            'updated_by'=>0
        ];
            
        return Inertia::render('Section/Create', ['section'=>  $section]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $result = $request->validate([
            'book_id' => 'required|integer',
            'parent_id' => 'required|integer',
            'nesting_level' => 'required|integer',
            'order' => 'required|integer',
            'updated_by' => 'required|integer',
        ]);
    
       
        return Section::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        if($section) {
            return response()->json(['error'=> 'Section not found'], 404);
        }

        return $section;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        if(!$section) {
            return response()->json(['error'=> 'Section not found'], 404);
        }
        
        $section = $section->load('children');

        return Inertia::render('Section/Edit', ['section' => $section]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Section $section)
    {
        if(!$section) {
            return response()->json(['error'=> 'Section not found'], 404);
        }

        return $section->update($request->all());

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        if(!$section) {
            return response()->json(['error'=> 'Section not found'], 404);
        }

        return $section->delete();
    }
}
