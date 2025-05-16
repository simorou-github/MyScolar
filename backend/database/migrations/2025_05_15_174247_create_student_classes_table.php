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
        Schema::create('student_classes', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->char('student_id')->nullable();
            $table->char('classe_id', 30)->nullable();
            $table->string('academic_year');
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->unique(['student_id', 'classe_id']);
            $table->char('school_classe_id', 30)->nullable();
            $table->foreign('school_classe_id')->references('id')->on('school_classes');
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students');
            $table->foreign('classe_id')->references('id')->on('school_classes');
            $table->foreign('academic_year')->references('academic_year')->on('academic_years');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_classes');
    }
};
