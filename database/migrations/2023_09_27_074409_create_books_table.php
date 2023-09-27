<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author')->constrained('users');
            $table->string('title');
            $table->string('description');
            $table->string('publisher');
            $table->string('isbn');
            $table->string('image');
            $table->foreignId('updated_by')->constrained('users'); // foreign key on user
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sections', function (Blueprint $table) {
            $table->dropIfExists('sections_book_id_foreign');
        });
        Schema::dropIfExists('books');
    }
};
