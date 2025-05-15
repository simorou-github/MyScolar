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
        Schema::create('type_fees', function (Blueprint $table) {
            $table->char('id', 15)->primary();
            $table->string('label');
            $table->char('school_id', 30)->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
            
            $table->foreign('school_id')->references('id')->on('schools');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_fees');
    }
};
