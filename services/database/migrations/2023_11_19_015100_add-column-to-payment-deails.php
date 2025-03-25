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
        Schema::table('payment_details', function (Blueprint $table) {
            $table->char('school_id', 30)->nullable();
            $table->char('classe_id', 30)->nullable();
            $table->char('student_id', 30)->nullable();
            $table->char('academic_year', 9)->nullable();

            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('classe_id')->references('id')->on('school_classes');
            $table->foreign('student_id')->references('id')->on('students');
            $table->foreign('academic_year')->references('academic_year')->on('academic_years');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
