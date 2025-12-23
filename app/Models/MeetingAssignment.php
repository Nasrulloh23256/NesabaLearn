<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'user_id',
        'original_name',
        'file_path',
        'mime_type',
        'file_size',
        'description',
        'submitted_at',
        'score',
        'rubric',
        'mentor_feedback',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'file_size' => 'integer',
        'score' => 'decimal:2',
        'rubric' => 'array',
        'reviewed_at' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
