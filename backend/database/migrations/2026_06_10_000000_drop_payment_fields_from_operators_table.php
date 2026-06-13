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
        Schema::table('operators', function (Blueprint $table) {
            foreach (['token_url', 'pay_request_url', 'balance_request_url', 'api_key', 'primary_key', 'secondary_key'] as $column) {
                if (Schema::hasColumn('operators', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('operators', function (Blueprint $table) {
            $table->string('token_url')->nullable();
            $table->string('pay_request_url')->nullable();
            $table->string('balance_request_url')->nullable();
            $table->string('api_key')->nullable();
            $table->string('primary_key')->nullable();
        });
    }
};
