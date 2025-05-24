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
        Schema::create('payment_details', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->char('payment_id', 30);            
            $table->char('balance_fees_id', 30);   
            $table->char('type_fees_id', 30);   
            $table->integer('fees_amount');
            $table->char('school_classe_fees_id', 30)->nullable();
            $table->foreign('school_classe_fees_id')->references('id')->on('school_classe_fees');
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->char('operator_id', 30)->nullable();
            $table->double('scolar_commission'); 
            $table->char('school_id', 30); 
            $table->char('classe_id', 30); 
            $table->char('student_id', 30); 
            $table->char('academic_year', 9); 

            $table->foreign('payment_id')->references('id')->on('payments');
            $table->foreign('balance_fees_id')->references('id')->on('balance_fees');
            $table->foreign('type_fees_id')->references('id')->on('type_fees');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');
            $table->foreign('student_id')->references('id')->on('students');
            $table->foreign('classe_id')->references('id')->on('school_classes');
            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('academic_year')->references('academic_year')->on('academic_years');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_details');
    }
};
