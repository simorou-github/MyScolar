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
        Schema::create('parameters', function (Blueprint $table) {
             $table->char('id', 30)->primary();
            $table->string('label', 80);
            $table->string('value', 60);
            $table->string('description', 180);
            $table->boolean('status')->default(true);
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->timestamps();

            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parameters');
    }
};
