<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->string('ifu', 20)->nullable();
            $table->string('social_reason', 120);
            $table->string('email')->unique();
            $table->string('location');
            $table->string('owner', 120);
            $table->string('tel', 20);
            $table->enum('status', ['INITIE', 'REJETE', 'VALIDE','ACTIF' ,'INACTIF'])->default('INITIE');          
            $table->unsignedBigInteger('country_id')->nullable();
            $table->unsignedBigInteger('city_id')->nullable();
            $table->timestamps();

            $table->foreign('country_id')->references('id')->on('countries');
            $table->foreign('city_id')->references('id')->on('cities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {        
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');
        Schema::dropIfExists('schools');
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
};
