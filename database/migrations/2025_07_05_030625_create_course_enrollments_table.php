<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->id('enrollment_id');
            $table->foreignId('learner_id')->constrained('learners', 'learner_id')->onDelete('cascade');
            $table->string('course_qualification', 255);
            $table->string('scholarship_package', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};