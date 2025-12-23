<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function show(Meeting $meeting, Quiz $quiz, Request $request): Response
    {
        if ($quiz->meeting_id !== $meeting->id) {
            abort(404);
        }

        $quiz->load('questions.options');

        $startAt = $quiz->start_time;
        $endAt = $quiz->end_time;
        $now = now();

        $latestAttempt = QuizAttempt::query()
            ->where('quiz_id', $quiz->id)
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        $canAttempt = true;
        $availabilityMessage = null;

        if ($latestAttempt) {
            $canAttempt = false;
            $availabilityMessage = 'Quiz sudah dikerjakan. Anda hanya bisa mengerjakan sekali.';
        } elseif ($startAt && $now->lt($startAt)) {
            $canAttempt = false;
            $availabilityMessage = 'Quiz belum dibuka. Silakan kembali pada jadwal yang ditentukan.';
        } elseif ($endAt && $now->gt($endAt)) {
            $canAttempt = false;
            $availabilityMessage = 'Quiz sudah ditutup.';
        }

        return Inertia::render('User/Meetings/QuizTake', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
            ],
            'quiz' => $quiz,
            'attempt' => $latestAttempt ? [
                'id' => $latestAttempt->id,
                'total_score' => $latestAttempt->total_score,
                'submitted_at' => $latestAttempt->submitted_at?->toDateTimeString(),
            ] : null,
            'canAttempt' => $canAttempt,
            'availability' => [
                'message' => $availabilityMessage,
                'start_time' => $startAt?->toDateTimeString(),
                'end_time' => $endAt?->toDateTimeString(),
            ],
        ]);
    }

    public function submit(Request $request, Meeting $meeting, Quiz $quiz): RedirectResponse
    {
        if ($quiz->meeting_id !== $meeting->id) {
            abort(404);
        }

        $startAt = $quiz->start_time;
        $endAt = $quiz->end_time;
        $now = now();

        $existingAttempt = QuizAttempt::query()
            ->where('quiz_id', $quiz->id)
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        if ($existingAttempt) {
            throw ValidationException::withMessages([
                'quiz' => ['Quiz sudah dikerjakan. Anda hanya bisa mengerjakan sekali.'],
            ]);
        }

        if ($startAt && $now->lt($startAt)) {
            throw ValidationException::withMessages([
                'quiz' => ['Quiz belum dibuka. Silakan kembali pada jadwal yang ditentukan.'],
            ]);
        }

        if ($endAt && $now->gt($endAt)) {
            throw ValidationException::withMessages([
                'quiz' => ['Quiz sudah ditutup.'],
            ]);
        }

        $data = $request->validate([
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'integer', Rule::exists('quiz_questions', 'id')->where('quiz_id', $quiz->id)],
            'answers.*.option_id' => ['nullable', 'integer', Rule::exists('question_options', 'id')],
            'answers.*.answer' => ['nullable', 'string'],
        ]);

        $quiz->load('questions.options');

        $answersByQuestion = collect($data['answers'])->keyBy('question_id');
        if ($answersByQuestion->count() < $quiz->questions->count()) {
            throw ValidationException::withMessages([
                'answers' => ['Semua pertanyaan harus dijawab.'],
            ]);
        }

        $attempt = DB::transaction(function () use ($quiz, $answersByQuestion, $request) {
            $attempt = QuizAttempt::create([
                'user_id' => $request->user()->id,
                'quiz_id' => $quiz->id,
                'token' => Str::uuid()->toString(),
                'started_at' => now(),
            ]);

            $totalScore = 0;

            foreach ($quiz->questions as $question) {
                $answerData = $answersByQuestion->get($question->id);
                if (!$answerData) {
                    continue;
                }

                if ($question->type === 'multiple_choice') {
                    $optionId = $answerData['option_id'] ?? null;
                    $option = $question->options->firstWhere('id', $optionId);

                    if (!$option) {
                        throw ValidationException::withMessages([
                            'answers' => ['Pilihan jawaban tidak valid.'],
                        ]);
                    }

                    $score = $option->is_correct ? $question->score : 0;
                    $totalScore += $score;

                    QuizAnswer::create([
                        'quiz_attempt_id' => $attempt->id,
                        'quiz_question_id' => $question->id,
                        'question_option_id' => $option->id,
                        'score' => $score,
                    ]);
                } else {
                    $text = trim($answerData['answer'] ?? '');
                    if ($text === '') {
                        throw ValidationException::withMessages([
                            'answers' => ['Semua pertanyaan esai harus diisi.'],
                        ]);
                    }

                    QuizAnswer::create([
                        'quiz_attempt_id' => $attempt->id,
                        'quiz_question_id' => $question->id,
                        'answer' => $text,
                    ]);
                }
            }

            $attempt->update([
                'total_score' => $totalScore,
                'submitted_at' => now(),
            ]);

            return $attempt;
        });

        if ($attempt) {
            app(NotificationService::class)->sendQuizResult($attempt->load(['user', 'quiz']));
        }

        return redirect()->route('user.meetings.show', $meeting)->with('success', 'Quiz berhasil dikumpulkan.');
    }
}
