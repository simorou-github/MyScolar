<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parent_student_links', function (Blueprint $table) {
            $table->char('id', 30)->primary();
            $table->char('parent_id', 30);
            $table->char('student_id', 30);
            $table->char('school_id', 30);
            // PENDING -> en attente de validation école, VALIDE, REJETE
            $table->enum('status', ['PENDING', 'VALIDE', 'REJETE'])->default('PENDING');
            $table->string('reject_reason')->nullable();
            $table->char('validated_by', 30)->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('parents')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('school_id')->references('id')->on('schools');
            $table->foreign('validated_by')->references('id')->on('users');
            $table->unique(['parent_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parent_student_links');
    }
};
