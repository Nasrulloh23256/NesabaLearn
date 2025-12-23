<?php

namespace App\Services;

use App\Mail\NotificationMail;
use App\Models\Meeting;
use App\Models\MeetingAssignment;
use App\Models\MeetingTask;
use App\Models\NotificationLog;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    private int $windowMinutes = 10;

    public function sendDueNotifications(): void
    {
        $now = now();

        $this->sendMeetingReminders($now);
        $this->sendTaskDeadlines($now);
        $this->sendQuizDeadlines($now);
    }

    public function sendQuizResult(QuizAttempt $attempt): void
    {
        $user = $attempt->user;
        if (!$user || !$user->email) {
            return;
        }

        $quiz = $attempt->quiz;
        if (!$quiz) {
            return;
        }

        $headline = 'Hasil Quiz: '.$quiz->title;
        $scoreLine = $attempt->total_score !== null ? 'Skor Anda: '.$attempt->total_score : 'Skor Anda sedang diproses.';
        $body = "Quiz Anda sudah terkumpul.\n".$scoreLine."\nTerima kasih sudah menyelesaikan quiz ini.";

        Mail::to($user->email)->send(new NotificationMail(
            $headline,
            $body,
            'Lihat Detail Quiz',
            url("/user/meetings/{$quiz->meeting_id}")
        ));

        $this->logOnce($user->id, 'quiz_result', 'quiz_attempt', $attempt->id);
    }

    public function sendTaskCreated(MeetingTask $task): void
    {
        $meeting = $task->meeting;
        if (!$meeting) {
            return;
        }

        $deadline = $task->end_time
            ? Carbon::parse($task->end_time)->format('d M Y, H:i')
            : null;

        $detailLines = [
            "Pertemuan: {$meeting->title}",
            "Tugas: {$task->title}",
            "Tipe: ".($task->type === 'file' ? 'File' : 'Konten'),
        ];
        if ($deadline) {
            $detailLines[] = "Deadline: {$deadline} WIB";
        }

        $headline = 'Tugas Pertemuan Baru';
        $body = "Ada tugas baru yang ditambahkan.\n".implode("\n", $detailLines);
        $actionUrl = url("/user/meetings/{$meeting->id}");

        $users = User::query()
            ->where('role', 'Pengguna')
            ->whereNotNull('email')
            ->get(['id', 'name', 'email']);

        foreach ($users as $user) {
            if ($this->alreadySent($user->id, 'meeting_task_created', 'meeting_task', $task->id)) {
                continue;
            }
            $this->sendMail($user, $headline, $body, 'Lihat Tugas', $actionUrl);
            $this->logOnce($user->id, 'meeting_task_created', 'meeting_task', $task->id);
        }
    }

    public function sendQuizCreated(Quiz $quiz): void
    {
        $meeting = $quiz->meeting;
        if (!$meeting) {
            return;
        }

        $startAt = $quiz->start_time ? Carbon::parse($quiz->start_time)->format('d M Y, H:i') : null;
        $endAt = $quiz->end_time ? Carbon::parse($quiz->end_time)->format('d M Y, H:i') : null;

        $detailLines = [
            "Pertemuan: {$meeting->title}",
            "Quiz: {$quiz->title}",
        ];
        if ($startAt) {
            $detailLines[] = "Mulai: {$startAt} WIB";
        }
        if ($endAt) {
            $detailLines[] = "Deadline: {$endAt} WIB";
        }
        if ($quiz->time_limit !== null) {
            $detailLines[] = "Durasi: {$quiz->time_limit} menit";
        }
        if ($quiz->minimum_score !== null) {
            $detailLines[] = "Skor Minimum: {$quiz->minimum_score}";
        }

        $headline = 'Quiz Baru Dibuka';
        $body = "Ada quiz baru yang tersedia.\n".implode("\n", $detailLines);
        $actionUrl = url("/user/meetings/{$meeting->id}");

        $users = User::query()
            ->where('role', 'Pengguna')
            ->whereNotNull('email')
            ->get(['id', 'name', 'email']);

        foreach ($users as $user) {
            if ($this->alreadySent($user->id, 'quiz_created', 'quiz', $quiz->id)) {
                continue;
            }
            $this->sendMail($user, $headline, $body, 'Lihat Quiz', $actionUrl);
            $this->logOnce($user->id, 'quiz_created', 'quiz', $quiz->id);
        }
    }

    public function sendMeetingCreated(Meeting $meeting): void
    {
        if ($meeting->is_cancelled) {
            return;
        }

        $startAt = $this->buildMeetingStart($meeting);
        $dateLabel = $meeting->meeting_date
            ? Carbon::parse($meeting->meeting_date)->format('d M Y')
            : ($startAt ? $startAt->format('d M Y') : null);

        $timeLabel = null;
        if ($startAt) {
            $timeLabel = $startAt->format('H:i');
            if ($meeting->end_time) {
                $endAt = $meeting->meeting_date
                    ? Carbon::parse($meeting->meeting_date)->setTimeFromTimeString($meeting->end_time)
                    : null;
                if ($endAt) {
                    $timeLabel = $startAt->format('H:i').' - '.$endAt->format('H:i');
                }
            }
        }

        $detailLines = [
            "Judul: {$meeting->title}",
            "Tipe: {$meeting->type}",
        ];
        if ($dateLabel) {
            $detailLines[] = "Tanggal: {$dateLabel}";
        }
        if ($timeLabel) {
            $detailLines[] = "Waktu: {$timeLabel} WIB";
        }
        if ($meeting->meeting_url) {
            $detailLines[] = "Link: {$meeting->meeting_url}";
        }
        if (!empty($meeting->description)) {
            $detailLines[] = "Deskripsi: {$meeting->description}";
        }

        $headline = 'Pertemuan Baru Dijadwalkan';
        $body = "Ada pertemuan baru yang sudah dijadwalkan.\n".implode("\n", $detailLines);
        $actionUrl = $meeting->meeting_url ?: url("/user/meetings/{$meeting->id}");

        $users = User::query()
            ->where('role', 'Pengguna')
            ->whereNotNull('email')
            ->get(['id', 'name', 'email']);

        foreach ($users as $user) {
            if ($this->alreadySent($user->id, 'meeting_created', 'meeting', $meeting->id)) {
                continue;
            }
            $this->sendMail($user, $headline, $body, 'Lihat Pertemuan', $actionUrl);
            $this->logOnce($user->id, 'meeting_created', 'meeting', $meeting->id);
        }
    }

    private function sendMeetingReminders(Carbon $now): void
    {
        $meetings = Meeting::query()
            ->where('is_cancelled', false)
            ->whereNotNull('meeting_date')
            ->get();

        foreach ($meetings as $meeting) {
            $startAt = $this->buildMeetingStart($meeting);
            if (!$startAt) {
                continue;
            }

            $this->sendIfDue(
                $now,
                $startAt->copy()->subDay(),
                'meeting_reminder_day',
                'meeting',
                $meeting->id,
                function (User $user) use ($meeting, $startAt) {
                    $headline = 'Reminder Pertemuan Besok';
                    $body = "Besok ada pertemuan: {$meeting->title}.\nWaktu: ".$startAt->format('d M Y, H:i')." WIB.";
                    $this->sendMail($user, $headline, $body, 'Lihat Pertemuan', url("/user/meetings/{$meeting->id}"));
                }
            );

            $this->sendIfDue(
                $now,
                $startAt->copy()->subHour(),
                'meeting_reminder_hour',
                'meeting',
                $meeting->id,
                function (User $user) use ($meeting, $startAt) {
                    $headline = 'Reminder Pertemuan 1 Jam Lagi';
                    $body = "Pertemuan: {$meeting->title}.\nWaktu: ".$startAt->format('d M Y, H:i')." WIB.\nJangan lupa hadir tepat waktu.";
                    $this->sendMail($user, $headline, $body, 'Masuk Pertemuan', $meeting->meeting_url ?: url("/user/meetings/{$meeting->id}"));
                }
            );
        }
    }

    private function sendTaskDeadlines(Carbon $now): void
    {
        $tasks = MeetingTask::query()
            ->whereNotNull('end_time')
            ->with('meeting')
            ->get();

        foreach ($tasks as $task) {
            $deadline = $task->end_time instanceof Carbon ? $task->end_time : Carbon::parse($task->end_time);
            $meeting = $task->meeting;
            if (!$meeting) {
                continue;
            }

            $this->sendIfDue(
                $now,
                $deadline->copy()->subDay(),
                'task_deadline_day',
                'meeting_task',
                $task->id,
                function (User $user) use ($task, $deadline, $meeting) {
                    if ($this->hasSubmittedAssignment($meeting->id, $user->id)) {
                        return;
                    }
                    $headline = 'Deadline Tugas Besok';
                    $body = "Tugas: {$task->title}\nDeadline: ".$deadline->format('d M Y, H:i')." WIB.\nSegera kumpulkan tugas Anda.";
                    $this->sendMail($user, $headline, $body, 'Kumpulkan Tugas', url("/user/meetings/{$meeting->id}"));
                }
            );

            $this->sendIfDue(
                $now,
                $deadline->copy()->subHour(),
                'task_deadline_hour',
                'meeting_task',
                $task->id,
                function (User $user) use ($task, $deadline, $meeting) {
                    if ($this->hasSubmittedAssignment($meeting->id, $user->id)) {
                        return;
                    }
                    $headline = 'Deadline Tugas 1 Jam Lagi';
                    $body = "Tugas: {$task->title}\nDeadline: ".$deadline->format('d M Y, H:i')." WIB.\nSegera kumpulkan tugas Anda sebelum terlambat.";
                    $this->sendMail($user, $headline, $body, 'Kumpulkan Tugas', url("/user/meetings/{$meeting->id}"));
                }
            );
        }
    }

    private function sendQuizDeadlines(Carbon $now): void
    {
        $quizzes = Quiz::query()
            ->whereNotNull('end_time')
            ->with('meeting')
            ->get();

        foreach ($quizzes as $quiz) {
            $deadline = $quiz->end_time instanceof Carbon ? $quiz->end_time : Carbon::parse($quiz->end_time);
            $meeting = $quiz->meeting;
            if (!$meeting) {
                continue;
            }

            $this->sendIfDue(
                $now,
                $deadline->copy()->subDay(),
                'quiz_deadline_day',
                'quiz',
                $quiz->id,
                function (User $user) use ($quiz, $deadline, $meeting) {
                    if ($this->hasAttemptedQuiz($quiz->id, $user->id)) {
                        return;
                    }
                    $headline = 'Deadline Quiz Besok';
                    $body = "Quiz: {$quiz->title}\nDeadline: ".$deadline->format('d M Y, H:i')." WIB.\nSegera kerjakan quiz Anda.";
                    $this->sendMail($user, $headline, $body, 'Kerjakan Quiz', url("/user/meetings/{$meeting->id}"));
                }
            );

            $this->sendIfDue(
                $now,
                $deadline->copy()->subHour(),
                'quiz_deadline_hour',
                'quiz',
                $quiz->id,
                function (User $user) use ($quiz, $deadline, $meeting) {
                    if ($this->hasAttemptedQuiz($quiz->id, $user->id)) {
                        return;
                    }
                    $headline = 'Deadline Quiz 1 Jam Lagi';
                    $body = "Quiz: {$quiz->title}\nDeadline: ".$deadline->format('d M Y, H:i')." WIB.\nSegera kerjakan quiz Anda sebelum terlambat.";
                    $this->sendMail($user, $headline, $body, 'Kerjakan Quiz', url("/user/meetings/{$meeting->id}"));
                }
            );
        }
    }

    private function sendIfDue(
        Carbon $now,
        Carbon $targetTime,
        string $type,
        string $subjectType,
        int $subjectId,
        callable $callback
    ): void {
        $windowStart = $targetTime->copy()->subMinutes($this->windowMinutes);
        $windowEnd = $targetTime->copy()->addMinutes($this->windowMinutes);

        if (!$now->between($windowStart, $windowEnd)) {
            return;
        }

        $users = User::query()
            ->where('role', 'Pengguna')
            ->whereNotNull('email')
            ->get(['id', 'name', 'email']);

        foreach ($users as $user) {
            if ($this->alreadySent($user->id, $type, $subjectType, $subjectId)) {
                continue;
            }
            $callback($user);
            $this->logOnce($user->id, $type, $subjectType, $subjectId);
        }
    }

    private function sendMail(User $user, string $headline, string $body, ?string $actionText, ?string $actionUrl): void
    {
        Mail::to($user->email)->send(new NotificationMail($headline, $body, $actionText, $actionUrl));
    }

    private function buildMeetingStart(Meeting $meeting): ?Carbon
    {
        if (!$meeting->meeting_date || !$meeting->start_time) {
            return null;
        }
        $date = $meeting->meeting_date instanceof Carbon ? $meeting->meeting_date : Carbon::parse($meeting->meeting_date);
        return $date->copy()->setTimeFromTimeString($meeting->start_time);
    }

    private function hasSubmittedAssignment(int $meetingId, int $userId): bool
    {
        return MeetingAssignment::query()
            ->where('meeting_id', $meetingId)
            ->where('user_id', $userId)
            ->exists();
    }

    private function hasAttemptedQuiz(int $quizId, int $userId): bool
    {
        return QuizAttempt::query()
            ->where('quiz_id', $quizId)
            ->where('user_id', $userId)
            ->exists();
    }

    private function alreadySent(int $userId, string $type, string $subjectType, int $subjectId): bool
    {
        return NotificationLog::query()
            ->where('user_id', $userId)
            ->where('type', $type)
            ->where('subject_type', $subjectType)
            ->where('subject_id', $subjectId)
            ->exists();
    }

    private function logOnce(int $userId, string $type, string $subjectType, int $subjectId): void
    {
        NotificationLog::create([
            'user_id' => $userId,
            'type' => $type,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'sent_at' => now(),
        ]);
    }
}
