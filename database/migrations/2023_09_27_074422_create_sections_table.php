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
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('book_id')->constrained(); // foreign key on book
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('title');
            $table->string('content')->nullable();
            $table->integer('nesting_level')->default(0);
            $table->integer('order')->default(0);
            $table->foreignId('updated_by')->constrained('users'); // foreign key on user
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('sections'); // foreign key on parent
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
