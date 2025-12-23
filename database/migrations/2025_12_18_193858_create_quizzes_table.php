<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->unsignedInteger('minimum_score')->nullable();
            $table->unsignedInteger('time_limit')->nullable(); // minutes
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
