<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['avatar_url'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        if (str_starts_with($this->avatar, '/')) {
            return $this->avatar;
        }

        return '/storage/'.$this->avatar;
    }

    public function createdMeetings()
    {
        return $this->hasMany(Meeting::class, 'created_by');
    }

    public function assignments()
    {
        return $this->hasMany(MeetingAssignment::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function conversations()
    {
        return $this->hasMany(ChatbotConversation::class);
    }
}
