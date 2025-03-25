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
        Schema::create('balance_fees', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->char('student_id');
            $table->char('classe_id', 30);
            $table->char('school_id', 30);
            $table->char('type_fees_id', 30);
            $table->integer('fees_amount');
            $table->integer('balance');
            $table->string('academic_year', 9);
            $table->string('fees_label', 120);
            $table->date('due_date');
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students');
            $table->foreign('classe_id')->references('id')->on('school_classes');
            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('type_fees_id')->references('id')->on('type_fees');
            $table->foreign('academic_year')->references('academic_year')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('balance_fees');
    }
};
