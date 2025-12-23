<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'meeting_id',
        'type',
        'name',
        'content',
        'video_path',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }
}
