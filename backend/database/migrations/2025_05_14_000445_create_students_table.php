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
        Schema::create('students', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->string('code_scolar',30);
            $table->integer('code');
            $table->string('last_name');
            $table->string('first_name');
            $table->enum('sex', ['M', 'F']);
            $table->date('birthday');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->boolean('status');
            $table->char('matricule', 30)->nullable();   
            $table->char('school_id', 30);
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->timestamps();

            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
