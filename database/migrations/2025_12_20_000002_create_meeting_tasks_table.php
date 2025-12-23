<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->enum('type', ['content', 'file']);
            $table->text('content')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_mime')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique('meeting_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_tasks');
    }
};
