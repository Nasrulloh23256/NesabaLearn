<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['Editorial', 'Artikel'])->default('Artikel');
            $table->text('description')->nullable();
            $table->date('meeting_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->text('meeting_url')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
