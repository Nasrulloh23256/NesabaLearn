<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('type')->default('file');
            $table->text('path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_attachments');
    }
};
