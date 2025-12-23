<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'type',
        'description',
        'meeting_date',
        'start_time',
        'end_time',
        'meeting_url',
        'is_cancelled',
        'cancelled_at',
        'created_by',
    ];

    protected $casts = [
        'meeting_date' => 'date',
        'start_time' => 'string',
        'end_time' => 'string',
        'is_cancelled' => 'boolean',
        'cancelled_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function materials()
    {
        return $this->hasMany(MeetingMaterial::class);
    }

    public function attachments()
    {
        return $this->hasMany(MeetingAttachment::class);
    }

    public function assignments()
    {
        return $this->hasMany(MeetingAssignment::class);
    }

    public function task()
    {
        return $this->hasOne(MeetingTask::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
