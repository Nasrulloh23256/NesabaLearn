<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'title',
        'type',
        'content',
        'file_path',
        'file_name',
        'file_mime',
        'file_size',
        'start_time',
        'end_time',
        'created_by',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'file_size' => 'integer',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
