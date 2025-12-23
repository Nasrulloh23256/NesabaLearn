import { Link, useNavigate } from "@/router";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { useForm, usePage } from "@inertiajs/react";

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";

const questionTypes = [
  { value: "multiple_choice", label: { id: "Pilihan Ganda", en: "Multiple Choice" } },
  { value: "essay", label: { id: "Esai", en: "Essay" } },
];

const newQuestionId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const defaultQuestion = (index) => ({
  id: newQuestionId(),
  title: "",
  type: questionTypes[0].value,
  score: 0,
  answers: ["", ""],
  correctIndex: 0,
  index,
});

export default function MeetingQuizCreatePage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const meeting = props?.meeting;
  const { adminCopy, language } = useLanguage();
  const { common, quizForm } = adminCopy;
  const description = quizForm.description.replace("{{title}}", meeting?.title || "");

  const { data, setData, post, processing, errors, transform } = useForm({
    title: "",
    description: "",
    minimum_score: "",
    time_limit: "",
    start_time: "",
    end_time: "",
    questions: [defaultQuestion(1)],
  });

  if (!meeting) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Pertemuan tidak ditemukan.
          <button onClick={() => navigate(-1)} className="ml-4 text-sm font-semibold text-rose-600 underline">
            {common.back}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const updateQuestion = (idx, payload) => {
    const updated = data.questions.map((q, qIdx) => (qIdx === idx ? { ...q, ...payload } : q));
    setData("questions", updated);
  };

  const handleQuestionAnswerChange = (qIdx, ansIdx, value) => {
    const updatedQuestions = data.questions.map((q, index) => {
      if (index !== qIdx) return q;
      const answers = q.answers.map((ans, idx) => (idx === ansIdx ? value : ans));
      return { ...q, answers };
    });
    setData("questions", updatedQuestions);
  };

  const handleAddAnswer = (qIdx) => {
    const updatedQuestions = data.questions.map((q, index) => {
      if (index !== qIdx) return q;
      return { ...q, answers: [...q.answers, ""] };
    });
    setData("questions", updatedQuestions);
  };

  const handleRemoveAnswer = (qIdx, ansIdx) => {
    const updatedQuestions = data.questions.map((q, index) => {
      if (index !== qIdx) return q;
      const nextAnswers = q.answers.filter((_, idx) => idx !== ansIdx);
      return {
        ...q,
        answers: nextAnswers,
        correctIndex: Math.min(q.correctIndex, Math.max(nextAnswers.length - 1, 0)),
      };
    });
    setData("questions", updatedQuestions);
  };

  const handleAddQuestion = () => {
    setData("questions", [...data.questions, defaultQuestion(data.questions.length + 1)]);
  };

  const handleRemoveQuestion = (idx) => {
    const nextQuestions = data.questions
      .filter((_, qIdx) => qIdx !== idx)
      .map((q, newIndex) => ({ ...q, index: newIndex + 1 }));
    setData("questions", nextQuestions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    transform((formData) => ({
      title: formData.title,
      description: formData.description,
      minimum_score: formData.minimum_score ? Number(formData.minimum_score) : null,
      time_limit: formData.time_limit ? Number(formData.time_limit) : null,
      start_time: formData.start_time || null,
      end_time: formData.end_time || null,
      questions: formData.questions.map((q) => ({
        question: q.title,
        type: q.type,
        score: Number(q.score) || 0,
        options: q.type === "multiple_choice" ? q.answers : [],
        correct_index: q.type === "multiple_choice" ? q.correctIndex : null,
      })),
    }));
    post(`/admin/meetings/${meeting.id}/quizzes`, {
      onSuccess: () => navigate(`/admin/meetings/${meeting.id}`),
    });
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/admin"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 3L3 10.5V12h1v9h6v-5h4v5h6v-9h1v-1.5z" />
            </svg>
          </Link>
          <span>&gt;</span>
          <Link to="/admin/meetings" className="hover:text-slate-700 dark:hover:text-slate-200">
            {common.meetings}
          </Link>
          <span>&gt;</span>
          <Link to={`/admin/meetings/${meeting.id}`} className="hover:text-slate-700 dark:hover:text-slate-200">
            {adminCopy.meetingDetail?.pageTitle || "Detail Pertemuan"}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{quizForm.title}</span>
        </nav>

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{quizForm.title}</h1>
          <p className="text-slate-500 dark:text-slate-300">{description}</p>
        </header>

        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{quizForm.title}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {quizForm.info.name} <span className="text-rose-500">*</span>
              </label>
              <input
                name="title"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                placeholder={quizForm.info.name}
                className={inputBase}
                required
              />
              {errors.title && <p className="mt-2 text-xs text-rose-500">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {quizForm.info.timeLimit}
              </label>
              <input
                type="number"
                min="0"
                name="timeLimit"
                value={data.time_limit}
                onChange={(e) => setData("time_limit", e.target.value)}
                placeholder={quizForm.info.timeLimit}
                className={inputBase}
              />
              {errors.time_limit && <p className="mt-2 text-xs text-rose-500">{errors.time_limit}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {quizForm.info.startTime} <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={data.start_time}
                onChange={(e) => setData("start_time", e.target.value)}
                className={inputBase}
                required
              />
              {errors.start_time && <p className="mt-2 text-xs text-rose-500">{errors.start_time}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {quizForm.info.endTime} <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={data.end_time}
                onChange={(e) => setData("end_time", e.target.value)}
                className={inputBase}
                required
              />
              {errors.end_time && <p className="mt-2 text-xs text-rose-500">{errors.end_time}</p>}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {quizForm.info.description}
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              rows={3}
              placeholder={quizForm.info.description}
              className={`${inputBase} resize-none`}
            />
            {errors.description && <p className="mt-2 text-xs text-rose-500">{errors.description}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {quizForm.info.minScore}
            </label>
            <input
              type="number"
              min="0"
              name="minScore"
              value={data.minimum_score}
              onChange={(e) => setData("minimum_score", e.target.value)}
              placeholder={quizForm.info.minScore}
              className={inputBase}
            />
            {errors.minimum_score && <p className="mt-2 text-xs text-rose-500">{errors.minimum_score}</p>}
          </div>
        </section>

        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{quizForm.questions.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{quizForm.questions.description}</p>
            </div>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90"
            >
              {quizForm.questions.addButton}
            </button>
          </div>

          <div className="space-y-5">
            {data.questions.map((question, qIdx) => (
              <div key={question.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-200">
                    Pertanyaan #{question.index}
                  </h3>
                  {data.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      {quizForm.questions.remove}
                    </button>
                  )}
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                      {quizForm.questions.questionLabel}
                    </label>
                    <textarea
                      value={question.title}
                      onChange={(e) => updateQuestion(qIdx, { title: e.target.value })}
                      rows={3}
                      placeholder={quizForm.questions.questionLabel}
                      className={`${inputBase} resize-none`}
                    />
                    {errors[`questions.${qIdx}.question`] && (
                      <p className="mt-2 text-xs text-rose-500">{errors[`questions.${qIdx}.question`]}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        {quizForm.questions.typeLabel}
                      </label>
                      <div className="relative">
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(qIdx, { type: e.target.value })}
                          className={`${inputBase} appearance-none`}
                        >
                          {questionTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label[language] || type.label.id}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400 dark:text-slate-500">
                          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                            <path fill="currentColor" d="M5 7l5 6 5-6z" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        {quizForm.questions.scoreLabel}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={question.score}
                        onChange={(e) => updateQuestion(qIdx, { score: Number(e.target.value) })}
                        placeholder="0"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  {question.type === "multiple_choice" ? (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {quizForm.questions.optionsLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddAnswer(qIdx)}
                          className="text-xs font-semibold text-[#6B5AED] hover:underline"
                        >
                          {quizForm.questions.addOption}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.answers.map((answer, ansIdx) => (
                          <div key={`${question.id}-answer-${ansIdx}`} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={question.correctIndex === ansIdx}
                              onChange={() => updateQuestion(qIdx, { correctIndex: ansIdx })}
                            />
                            <input
                              value={answer}
                              onChange={(e) => handleQuestionAnswerChange(qIdx, ansIdx, e.target.value)}
                              placeholder={`${quizForm.questions.optionPlaceholder} ${ansIdx + 1}`}
                              className={`flex-1 ${inputBase}`}
                            />
                            {question.answers.length > 2 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAnswer(qIdx, ansIdx)}
                                className="text-xs font-semibold text-rose-600 hover:underline"
                              >
                                {quizForm.questions.remove}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      {errors[`questions.${qIdx}.options`] && (
                        <p className="mt-2 text-xs text-rose-500">{errors[`questions.${qIdx}.options`]}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                        {quizForm.questions.essayLabel}
                      </label>
                      <textarea rows={3} placeholder={quizForm.questions.essayLabel} className={`${inputBase} resize-none`} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {quizForm.buttons.cancel}
          </button>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            disabled={processing}
          >
            {quizForm.buttons.save}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
