<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meeting_assignments', function (Blueprint $table) {
            $table->decimal('score', 6, 2)->nullable()->after('submitted_at');
            $table->json('rubric')->nullable()->after('score');
            $table->text('mentor_feedback')->nullable()->after('rubric');
            $table->timestamp('reviewed_at')->nullable()->after('mentor_feedback');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete()->after('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('meeting_assignments', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn(['reviewed_by', 'reviewed_at', 'mentor_feedback', 'rubric', 'score']);
        });
    }
};
