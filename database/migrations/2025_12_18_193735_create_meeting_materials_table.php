<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['content', 'video']);
            $table->string('name');
            $table->longText('content')->nullable();
            $table->string('video_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_materials');
    }
};
