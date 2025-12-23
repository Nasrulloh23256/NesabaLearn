<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'title',
        'description',
        'start_time',
        'end_time',
        'minimum_score',
        'time_limit',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
}
