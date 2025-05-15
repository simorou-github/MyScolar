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
        Schema::create('operators', function (Blueprint $table) {
            $table->char('id', 15)->primary();
            $table->string('name', 60);
            $table->string('path_logo');
            $table->boolean('status')->default(false);
            $table->unsignedBigInteger('country_id')->nullable();
            $table->char('create_id', 30)->nullable();
            $table->char('update_id', 30)->nullable();
            $table->timestamps();
            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('create_id')->references('id')->on('users');
            $table->foreign('update_id')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operators');
    }
};
