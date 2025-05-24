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
        Schema::create('school_classe_fees', function (Blueprint $table) {
            $table->char('id', 30)->primary();            
            $table->char('school_classe_id', 30);
            $table->char('school_id', 30);
            $table->char('classe_id', 30);
            $table->char('type_fees_id', 30);
            $table->string('type_payment');
            $table->boolean('status')->default(true);
            $table->string('academic_year', 9);
            $table->integer('amount_fees');
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();

            $table->foreign('school_classe_id')->references('id')->on('school_classes');
            $table->foreign('type_fees_id')->references('id')->on('type_fees');
            $table->foreign('type_payment')->references('label')->on('type_payments');
            $table->foreign('academic_year')->references('academic_year')->on('academic_years');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');
            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('classe_id')->references('id')->on('classes');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_classe_fees');
    }
};
