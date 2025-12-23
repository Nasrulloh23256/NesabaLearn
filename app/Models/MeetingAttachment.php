<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'title',
        'type',
        'path',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
