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
        Schema::create('classes', function (Blueprint $table) {
            $table->char('id', 15)->primary();
            $table->string('code', 20)->unique();
            $table->string('label', 50)->unique();
            $table->string('rank', 10);
            $table->boolean('status')->default(1);
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
        Schema::dropIfExists('classes');
    }
};
