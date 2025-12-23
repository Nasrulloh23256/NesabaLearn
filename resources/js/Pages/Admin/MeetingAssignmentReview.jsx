import { useMemo } from "react";
import { Link, useNavigate } from "@/router";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";

const infoCardClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60";

const formatDateTime = (input, locale) => {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const resolveFile = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/storage/${path}`;
};

export default function MeetingAssignmentReviewPage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const meeting = props?.meeting;
  const assignment = props?.assignment;
  const { adminCopy, language } = useLanguage();
  const { common, meetingDetail } = adminCopy;
  const locale = language === "en" ? "en-US" : "id-ID";

  const defaultRubric = useMemo(
    () => [
      { label: language === "en" ? "Content quality" : "Kualitas konten", score: "", max: "" },
      { label: language === "en" ? "Structure & clarity" : "Struktur dan kejelasan", score: "", max: "" },
      { label: language === "en" ? "Relevance" : "Kesesuaian topik", score: "", max: "" },
    ],
    [language]
  );

  const initialRubric = Array.isArray(assignment?.rubric) && assignment.rubric.length
    ? assignment.rubric.map((item) => ({
        label: item.label ?? "",
        score: item.score ?? "",
        max: item.max ?? "",
      }))
    : defaultRubric;

  const { data, setData, put, processing, errors } = useForm({
    rubric: initialRubric,
    mentor_feedback: assignment?.mentor_feedback ?? "",
  });

  const totalScore = useMemo(
    () => data.rubric.reduce((sum, item) => sum + Number(item.score || 0), 0),
    [data.rubric]
  );

  if (!meeting || !assignment) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {meetingDetail.notFound}
          <button onClick={() => navigate(-1)} className="ml-4 text-sm font-semibold text-rose-600 underline">
            {common.back}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const fileHref = resolveFile(assignment.file_path);

  const updateRubric = (index, key, value) => {
    const next = [...data.rubric];
    next[index] = { ...next[index], [key]: value };
    setData("rubric", next);
  };

  const addRubricRow = () => {
    setData("rubric", [...data.rubric, { label: "", score: "", max: "" }]);
  };

  const removeRubricRow = (index) => {
    const next = data.rubric.filter((_, i) => i !== index);
    setData("rubric", next.length ? next : [{ label: "", score: "", max: "" }]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    put(`/admin/meetings/${meeting.id}/assignments/${assignment.id}/review`, {
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
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
            {meeting.title}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{meetingDetail.assignmentReviewTitle}</span>
        </nav>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{meetingDetail.assignmentReviewTitle}</h1>
            <p className="text-slate-500 dark:text-slate-300">{meetingDetail.assignmentReviewDescription}</p>
          </div>
          <Link
            to={`/admin/meetings/${meeting.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
          >
            {common.back}
          </Link>
        </header>

        <section className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{meetingDetail.assignmentTitle}</h2>
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">{meetingDetail.labels.title}</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{meeting.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Peserta</p>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {assignment.user?.name || assignment.user?.email || "User"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500 dark:text-slate-400">Waktu Submit</p>
              <p className="text-base text-slate-900 dark:text-slate-100">
                {formatDateTime(assignment.submitted_at, locale)}
              </p>
            </div>
            {fileHref && (
              <a
                href={fileHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Lihat File
              </a>
            )}
          </div>
          {assignment.description && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {assignment.description}
            </p>
          )}
        </section>

        <section className={infoCardClass}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {meetingDetail.assignmentReviewRubric}
              </h2>
              <button
                type="button"
                onClick={addRubricRow}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {meetingDetail.assignmentReviewAdd}
              </button>
            </div>
            {errors.rubric && <p className="text-sm text-rose-500">{errors.rubric}</p>}
            <div className="space-y-3">
              {data.rubric.map((item, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-12">
                  <div className="md:col-span-6">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      {meetingDetail.assignmentReviewCriterion}
                    </label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(event) => updateRubric(index, "label", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    {errors[`rubric.${index}.label`] && (
                      <p className="mt-1 text-xs text-rose-500">{errors[`rubric.${index}.label`]}</p>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      {meetingDetail.assignmentReviewScore}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.score}
                      onChange={(event) => updateRubric(index, "score", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FB00FF] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    {errors[`rubric.${index}.score`] && (
                      <p className="mt-1 text-xs text-rose-500">{errors[`rubric.${index}.score`]}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      {meetingDetail.assignmentReviewMax}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.max}
                      onChange={(event) => updateRubric(index, "max", event.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FB00FF] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                    {errors[`rubric.${index}.max`] && (
                      <p className="mt-1 text-xs text-rose-500">{errors[`rubric.${index}.max`]}</p>
                    )}
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeRubricRow(index)}
                      className="h-9 w-9 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200"
                      aria-label="Hapus kriteria"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-7.12l1.41-1.41L12 11.59l1.12-1.12l1.41 1.41L13.41 13l1.12 1.12l-1.41 1.41L12 14.41l-1.12 1.12l-1.41-1.41L10.59 13zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span>{meetingDetail.assignmentReviewTotal}</span>
              <span>{totalScore.toFixed(2)}</span>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {meetingDetail.assignmentReviewFeedback}
              </label>
              <textarea
                rows={4}
                value={data.mentor_feedback}
                onChange={(event) => setData("mentor_feedback", event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {errors.mentor_feedback && <p className="mt-1 text-xs text-rose-500">{errors.mentor_feedback}</p>}
            </div>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-6 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
            >
              {meetingDetail.assignmentReviewSave}
            </button>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
