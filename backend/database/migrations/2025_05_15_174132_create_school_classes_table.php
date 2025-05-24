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
        Schema::create('school_classes', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->char('school_id', 30);
            $table->char('classe_id', 30);
            $table->char('groupe_id', 5)->nullable();
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->boolean('status')->default(true);

            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('groupe_id')->references('id')->on('groupes');
            $table->foreign('classe_id')->references('id')->on('classes');
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
        Schema::dropIfExists('school_classes');
    }
};
