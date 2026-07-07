<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parents', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('email')->unique();
            $table->string('phone', 20);
            $table->unsignedBigInteger('country_id')->nullable();
            $table->boolean('email_verified')->default(false);
            $table->boolean('phone_verified')->default(false);
            // INITIE -> en attente de validation ScolarPlus, VALIDE -> compte actif, REJETE, INACTIF
            $table->enum('status', ['INITIE', 'VALIDE', 'REJETE', 'INACTIF'])->default('INITIE');
            $table->string('reject_reason')->nullable();
            $table->string('activation_token', 64)->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();

            $table->foreign('country_id')->references('id')->on('countries');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parents');
    }
};
