<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_otps', function (Blueprint $table) {
            $table->id();
            // channel: EMAIL | SMS
            $table->enum('channel', ['EMAIL', 'SMS']);
            // purpose: INSCRIPTION | LOGIN
            $table->enum('purpose', ['INSCRIPTION', 'LOGIN']);
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('code', 6);
            $table->boolean('consumed')->default(false);
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['email', 'channel', 'purpose']);
            $table->index(['phone', 'channel', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_otps');
    }
};
