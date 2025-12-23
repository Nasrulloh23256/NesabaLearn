import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@/router";
import { useForm, usePage } from "@inertiajs/react";
import UserLayout from "../../../Layouts/UserLayout";
import { useLanguage } from "../../../context/LanguageContext";

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";

export default function QuizTakePage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const meeting = props?.meeting;
  const quiz = props?.quiz;
  const attempt = props?.attempt;
  const canAttempt = props?.canAttempt ?? true;
  const availability = props?.availability ?? {};
  const { adminCopy, language } = useLanguage();
  const { common } = adminCopy;

  const { data, setData, post, processing, errors, transform } = useForm({
    answers: {},
  });

  const questions = quiz?.questions ?? [];
  const timeLimitSeconds = useMemo(() => {
    const limit = Number(quiz?.time_limit);
    if (!Number.isFinite(limit) || limit <= 0) return null;
    return limit * 60;
  }, [quiz?.time_limit]);
  const [remaining, setRemaining] = useState(null);
  const timerRef = useRef(null);
  const hasSubmittedRef = useRef(false);

  const setAnswer = (questionId, payload) => {
    setData("answers", { ...data.answers, [questionId]: payload });
  };

  const formatDuration = (totalSeconds) => {
    if (totalSeconds === null || totalSeconds === undefined) return "-";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const submitAnswers = () => {
    if (!canAttempt) return;
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    transform((formData) => ({
      answers: Object.values(formData.answers),
    }));
    post(`/user/meetings/${meeting.id}/quizzes/${quiz.id}`, {
      onSuccess: () => navigate(`/user/meetings/${meeting.id}`),
      onError: () => {
        hasSubmittedRef.current = false;
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitAnswers();
  };

  const answeredCount = useMemo(() => Object.keys(data.answers).length, [data.answers]);

  useEffect(() => {
    if (!canAttempt) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      setRemaining(null);
      return;
    }
    setRemaining(timeLimitSeconds);
  }, [timeLimitSeconds, canAttempt]);

  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      submitAnswers();
      return;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev === null) return prev;
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [remaining]);

  if (!meeting || !quiz) {
    return (
      <UserLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Quiz tidak ditemukan.
          <button onClick={() => navigate(-1)} className="ml-4 text-sm font-semibold text-rose-600 underline">
            {common.back}
          </button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/user/meetings" className="hover:text-slate-700 dark:hover:text-slate-200">
            {common.meetings}
          </Link>
          <span>&gt;</span>
          <Link to={`/user/meetings/${meeting.id}`} className="hover:text-slate-700 dark:hover:text-slate-200">
            {meeting.title}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">Quiz</span>
        </nav>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{quiz.title}</h1>
          <p className="text-slate-500 dark:text-slate-300">{quiz.description || "-"}</p>
          {!canAttempt && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {availability.message ||
                (language === "en" ? "Quiz is not available." : "Quiz tidak tersedia.")}
            </div>
          )}
          {availability?.start_time && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "en" ? "Opens:" : "Dibuka:"}{" "}
              {new Date(availability.start_time).toLocaleString(language === "en" ? "en-US" : "id-ID")}
            </p>
          )}
          {availability?.end_time && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "en" ? "Deadline:" : "Deadline:"}{" "}
              {new Date(availability.end_time).toLocaleString(language === "en" ? "en-US" : "id-ID")}
            </p>
          )}
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            {quiz.minimum_score !== null && (
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                Min skor: {quiz.minimum_score}
              </span>
            )}
            {quiz.time_limit !== null && (
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                Waktu: {quiz.time_limit} menit
              </span>
            )}
            {remaining !== null && (
              <span className={`rounded-full px-3 py-1 ${remaining <= 60 ? "bg-rose-100 text-rose-600" : "bg-slate-100 dark:bg-slate-800"}`}>
                Sisa waktu: {formatDuration(remaining)}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
              {answeredCount}/{questions.length} terjawab
            </span>
          </div>
          {attempt && (
            <p className="text-xs text-emerald-400">
              {language === "en"
                ? `Last submission score: ${attempt.total_score ?? 0}.`
                : `Quiz terakhir dikumpulkan. Skor: ${attempt.total_score ?? 0}.`}
            </p>
          )}
          {errors.quiz && <p className="text-sm text-rose-500">{errors.quiz}</p>}
          {errors.answers && <p className="text-sm text-rose-500">{errors.answers}</p>}
        </header>

        <section className="space-y-5">
          {questions.map((question, index) => (
            <div key={question.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  {index + 1}. {question.question}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Skor: {question.score}
                </span>
              </div>

              {question.type === "multiple_choice" ? (
                <div className="mt-4 space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={data.answers[question.id]?.option_id === option.id}
                        onChange={() =>
                          setAnswer(question.id, {
                            question_id: question.id,
                            option_id: option.id,
                          })
                        }
                        disabled={!canAttempt}
                      />
                      <span>{option.option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-4">
                  <textarea
                    rows={4}
                    className={`${inputBase} resize-none`}
                    placeholder="Tulis jawaban Anda..."
                    value={data.answers[question.id]?.answer ?? ""}
                    onChange={(event) =>
                      setAnswer(question.id, {
                        question_id: question.id,
                        answer: event.target.value,
                      })
                    }
                    disabled={!canAttempt}
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/user/meetings/${meeting.id}`)}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {common.back}
          </button>
          <button
            type="submit"
            disabled={processing || !canAttempt}
            className="rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60"
          >
            Kirim Jawaban
          </button>
        </div>
      </form>
    </UserLayout>
  );
}
