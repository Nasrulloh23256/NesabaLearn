<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MeetingQuizController extends Controller
{
    public function create(Meeting $meeting): Response
    {
        return Inertia::render('Admin/MeetingQuizCreate', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
            ],
        ]);
    }

    public function store(Request $request, Meeting $meeting): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after_or_equal:start_time'],
            'minimum_score' => ['nullable', 'integer', 'min:0'],
            'time_limit' => ['nullable', 'integer', 'min:0'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question' => ['required', 'string'],
            'questions.*.type' => ['required', Rule::in(['essay', 'multiple_choice'])],
            'questions.*.score' => ['nullable', 'integer', 'min:0'],
            'questions.*.options' => ['nullable', 'array'],
            'questions.*.options.*' => ['nullable', 'string'],
            'questions.*.correct_index' => ['nullable', 'integer', 'min:0'],
        ]);

        $createdQuiz = null;

        DB::transaction(function () use ($data, $meeting, &$createdQuiz) {
            $createdQuiz = Quiz::create([
                'meeting_id' => $meeting->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'minimum_score' => $data['minimum_score'] ?? null,
                'time_limit' => $data['time_limit'] ?? null,
            ]);

            foreach ($data['questions'] as $questionData) {
                $question = QuizQuestion::create([
                    'quiz_id' => $createdQuiz->id,
                    'question' => $questionData['question'],
                    'type' => $questionData['type'],
                    'score' => $questionData['score'] ?? 0,
                ]);

                if ($questionData['type'] === 'multiple_choice') {
                    $options = array_values(array_filter($questionData['options'] ?? [], fn ($value) => $value !== null && $value !== ''));
                    $correctIndex = $questionData['correct_index'] ?? 0;

                    if (count($options) < 2) {
                        throw \Illuminate\Validation\ValidationException::withMessages([
                            'questions' => ['Pilihan ganda harus memiliki minimal 2 opsi jawaban.'],
                        ]);
                    }

                    if (!isset($options[$correctIndex])) {
                        $correctIndex = 0;
                    }

                    foreach ($options as $index => $optionText) {
                        QuestionOption::create([
                            'quiz_question_id' => $question->id,
                            'option' => $optionText,
                            'is_correct' => $index === $correctIndex,
                        ]);
                    }
                }
            }
        });

        if ($createdQuiz) {
            app(NotificationService::class)->sendQuizCreated($createdQuiz->load('meeting'));
        }

        return redirect()->route('admin.meetings.show', $meeting);
    }

    public function destroy(Meeting $meeting, Quiz $quiz): RedirectResponse
    {
        if ($quiz->meeting_id !== $meeting->id) {
            return back()->withErrors(['quiz' => 'Quiz tidak ditemukan.']);
        }

        DB::transaction(function () use ($quiz) {
            $attemptIds = $quiz->attempts()->pluck('id');
            if ($attemptIds->isNotEmpty()) {
                QuizAnswer::query()->whereIn('quiz_attempt_id', $attemptIds)->delete();
                $quiz->attempts()->delete();
            }

            $questionIds = $quiz->questions()->pluck('id');
            if ($questionIds->isNotEmpty()) {
                QuestionOption::query()->whereIn('quiz_question_id', $questionIds)->delete();
                $quiz->questions()->delete();
            }

            $quiz->delete();
        });

        return redirect()->route('admin.meetings.show', $meeting)->with('success', 'Quiz dihapus.');
    }
}
