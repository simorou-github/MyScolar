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
        Schema::create('payments', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->string('details')->nullable();
            $table->integer('amount');
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->date('operation_date');
            $table->string('transaction_id')->nullable();
            $table->double('scolar_commission')->default(0);//1 mean payment is Ok
            $table->string('transaction_status')->default(false);
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->char('student_id');
            $table->char('classe_id', 30);
            $table->char('school_id', 30);
            $table->char('operator');
            $table->string('academic_year', 9);
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('students');
            $table->foreign('classe_id')->references('id')->on('school_classes');
            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('academic_year')->references('academic_year')->on('academic_years');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');
            $table->foreign('operator')->references('id')->on('operators');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
