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
        Schema::create('school_classe_fees_details', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->char('school_classe_fees_id', 30);            
            $table->string('fees_label');
            $table->date('due_date')->nullable();
            $table->integer('due_amount');
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();

            $table->foreign('school_classe_fees_id')->references('id')->on('school_classe_fees');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_classe_fees_details');
    }
};
