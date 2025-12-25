import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@/router";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";

const infoCardClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60";

const formatDate = (input, locale) => {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

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

const resolveAvatar = (value) => {
  if (!value) return "/avatar.png";
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return `/storage/${value}`;
};

export default function MeetingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { props } = usePage();
  const meeting = props?.meeting;
  const { data, setData, post, processing, errors, reset } = useForm({
    attachments: null,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { adminCopy, language } = useLanguage();
  const { common, meetingDetail } = adminCopy;
  const locale = language === "en" ? "en-US" : "id-ID";
  const confirmDelete = (message) => (event) => {
    if (!window.confirm(message)) {
      event.preventDefault();
    }
  };

  if (!meeting) {
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

  const meetingUrl = meeting?.meeting_url ?? meeting?.url ?? "-";
  const meetingDate = meeting?.meeting_date ?? meeting?.date;
  const startTime = meeting?.start_time ?? meeting?.start;
  const endTime = meeting?.end_time ?? meeting?.end;
  const task = meeting?.task || null;
  const assignments = Array.isArray(meeting?.assignments) ? meeting.assignments : [];
  const attendanceRecords = Array.isArray(meeting?.attendances) ? meeting.attendances : [];
  const taskTypeLabel =
    task?.type === "content" ? (language === "en" ? "Content" : "Konten") : task ? "File" : "-";
  const taskFileHref =
    task?.file_path && (task.file_path.startsWith("http") || task.file_path.startsWith("/"))
      ? task.file_path
      : task?.file_path
      ? `/storage/${task.file_path}`
      : null;
  const resolveAssignmentFile = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return `/storage/${path}`;
  };
  const quizAttempts = useMemo(() => {
    const entries = [];
    (meeting?.quizzes || []).forEach((quiz) => {
      (quiz.attempts || []).forEach((attempt) => {
        entries.push({
          ...attempt,
          quizTitle: quiz.title,
        });
      });
    });
    return entries.sort((a, b) => {
      const aTime = new Date(a.submitted_at || a.created_at || 0).getTime();
      const bTime = new Date(b.submitted_at || b.created_at || 0).getTime();
      return bTime - aTime;
    });
  }, [meeting?.quizzes]);

  const handleAttachmentChange = (event) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setSelectedFiles(files);
    setData("attachments", files.length ? files : null);
  };

  const handleAttachmentSubmit = (event) => {
    event.preventDefault();
    post(`/admin/meetings/${meeting.id}/attachments`, {
      forceFormData: true,
      onSuccess: () => {
        reset("attachments");
        setSelectedFiles([]);
      },
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
              <path
                fill="currentColor"
                d="M12 3L3 10.5V12h1v9h6v-5h4v5h6v-9h1v-1.5z"
              />
            </svg>
          </Link>
          <span>&gt;</span>
          <Link to="/admin/meetings" className="hover:text-slate-700 dark:hover:text-slate-200">
            {common.meetings}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{meetingDetail.pageTitle}</span>
        </nav>

        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{meetingDetail.pageTitle}</h1>
            <p className="text-slate-500 dark:text-slate-300">{meetingDetail.description}</p>
          </div>
          <Link
            to={`/admin/meetings/${meeting.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83l3.75 3.75l1.84-1.82z"
              />
            </svg>
            {meetingDetail.editButton}
          </Link>
        </header>

        <section className={`${infoCardClass}`}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{meetingDetail.infoTitle}</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.title}</p>
                <p className="text-base text-slate-900 dark:text-slate-100">{meeting.title}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.description}</p>
                <p className="text-base text-slate-900 dark:text-slate-100">
                  {meeting.description || meetingDetail.noDescription}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.link}</p>
                <a
                  href={meetingUrl || "#"}
                  className="text-slate-900 dark:text-slate-100 underline break-all"
                  target="_blank"
                  rel="noreferrer"
                >
                  {meetingUrl}
                </a>
              </div>
            </div>
            <div className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.type}</p>
                <div className="flex items-center gap-2">
                  <p className="text-base text-slate-900 dark:text-slate-100">{meeting.type}</p>
                  {meeting.is_cancelled && (
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                      Dibatalkan
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.date}</p>
                <p className="text-base text-slate-900 dark:text-slate-100">{formatDate(meetingDate, locale)}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.time}</p>
                <p className="text-base text-slate-900 dark:text-slate-100">
                  {startTime || "-"} - {endTime || "-"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`${infoCardClass}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.attachmentsTitle}</h2>
          </div>
          <form onSubmit={handleAttachmentSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="meeting-attachments"
              type="file"
              multiple
              onChange={handleAttachmentChange}
              className="sr-only"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="meeting-attachments"
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              Pilih Berkas
            </label>
            <button
              type="submit"
              disabled={processing || !selectedFiles.length}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            >
              Tambah Lampiran
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedFiles.length ? `${selectedFiles.length} file dipilih` : "Belum ada file"}
            </span>
          </form>
          {errors.attachments && <p className="mt-2 text-xs text-rose-500">{errors.attachments}</p>}
          {meeting?.attachments?.length ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {meeting.attachments.map((file) => {
                const href = file.path?.startsWith("http") || file.path?.startsWith("/")
                  ? file.path
                  : `/storage/${file.path}`;
                return (
                  <li key={file.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700">
                    <span className="truncate">{file.title}</span>
                    <div className="flex items-center gap-3">
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-700 underline hover:text-slate-900 dark:text-slate-200"
                      >
                        {meetingDetail.attachmentsView}
                      </a>
                      <Link
                        as="button"
                        method="delete"
                        href={`/admin/meetings/${meeting.id}/attachments/${file.id}`}
                        onClick={confirmDelete(meetingDetail.attachmentsConfirm)}
                        className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                      >
                        {meetingDetail.attachmentsDelete}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.noAttachments}</p>
          )}
        </section>

        <section className={`${infoCardClass}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.materialTitle}</h2>
            <Link
              to={`/admin/meetings/${meeting.id}/materials/new`}
              className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90"
            >
              {meetingDetail.materialCTA}
            </Link>
          </div>
          {meeting?.materials?.length ? (
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {meeting.materials.map((material) => {
                const isVideo = material.type === "video";
                const materialHref =
                  isVideo && material.video_path
                    ? material.video_path.startsWith("http") || material.video_path.startsWith("/")
                      ? material.video_path
                      : `/storage/${material.video_path}`
                    : null;
                return (
                  <div
                    key={material.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                  >
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{material.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isVideo ? meetingDetail.materialTypeVideo : meetingDetail.materialTypeContent}
                      </p>
                      {!isVideo && material.content && (
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {material.content.length > 140 ? `${material.content.slice(0, 140)}...` : material.content}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {materialHref && (
                        <a
                          href={materialHref}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-slate-700 underline hover:text-slate-900 dark:text-slate-200"
                        >
                          {meetingDetail.materialView}
                        </a>
                      )}
                      <Link
                        as="button"
                        method="delete"
                        href={`/admin/meetings/${meeting.id}/materials/${material.id}`}
                        onClick={confirmDelete(meetingDetail.materialConfirm)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        {meetingDetail.materialDelete}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.noMaterials}</p>
          )}
        </section>

        <section className={`${infoCardClass}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.taskTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{meetingDetail.taskDescription}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {task && (
                <Link
                  as="button"
                  method="delete"
                  href={`/admin/meetings/${meeting.id}/assignments`}
                  onClick={confirmDelete(meetingDetail.taskConfirm)}
                  className="rounded-full border border-rose-200 px-4 py-1.5 text-xs font-semibold text-rose-600 shadow hover:bg-rose-50"
                >
                  {meetingDetail.taskDelete}
                </Link>
              )}
              <Link
                to={`/admin/meetings/${meeting.id}/assignments/new`}
                className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90"
              >
                {task ? meetingDetail.taskEdit : meetingDetail.taskAdd}
              </Link>
            </div>
          </div>
          {task ? (
            <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {meetingDetail.taskType}
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{taskTypeLabel}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {meetingDetail.taskSchedule}
                  </p>
                  <p className="text-base text-slate-900 dark:text-slate-100">
                    {meetingDetail.taskStart}: {formatDateTime(task.start_time, locale)} • {meetingDetail.taskEnd}:{" "}
                    {formatDateTime(task.end_time, locale)}
                  </p>
                </div>
              </div>
              {task.type === "content" ? (
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {meetingDetail.taskContent}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-200">
                    {task.content || "-"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      {meetingDetail.taskFile}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {task.file_name || "File"}
                    </p>
                  </div>
                  {taskFileHref && (
                    <a
                      href={taskFileHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-slate-700 underline hover:text-slate-900 dark:text-slate-200"
                    >
                      {meetingDetail.taskDownload}
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.taskEmpty}</p>
          )}
        </section>

        <section className={`${infoCardClass}`}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.attendanceTitle}</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {attendanceRecords.length ? `${attendanceRecords.length} peserta hadir.` : meetingDetail.noAttendance}
          </p>
          {attendanceRecords.length ? (
            <ul className="mt-4 space-y-3">
              {attendanceRecords.map((entry) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveAvatar(entry.user?.avatar_url || entry.user?.avatar)}
                      alt={entry.user?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {entry.user?.name || entry.user?.email || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(entry.checked_in_at, locale)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className={`${infoCardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.assignmentListTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{meetingDetail.assignmentDescription}</p>
            </div>
          </div>
          {assignments.length ? (
            <div className="mt-4 space-y-3">
              {assignments.map((assignment) => {
                const fileHref = resolveAssignmentFile(assignment.file_path);
                const reviewed = Boolean(assignment.reviewed_at || assignment.score !== null);
                return (
                  <div
                    key={assignment.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveAvatar(assignment.user?.avatar_url || assignment.user?.avatar)}
                        alt={assignment.user?.name || "User"}
                        className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {assignment.user?.name || assignment.user?.email || "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDateTime(assignment.submitted_at, locale)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {fileHref && (
                        <a
                          href={fileHref}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          Lihat File
                        </a>
                      )}
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {meetingDetail.assignmentReviewScore}: {assignment.score ?? "-"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                        {reviewed ? meetingDetail.assignmentReviewDone : meetingDetail.assignmentReviewPending}
                      </span>
                      <Link
                        to={`/admin/meetings/${meeting.id}/assignments/${assignment.id}`}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
                      >
                        {reviewed ? meetingDetail.assignmentReviewEdit : meetingDetail.assignmentReviewCta}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.assignmentEmpty}</p>
          )}
        </section>

        <section className={`${infoCardClass}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.quizTitle}</h2>
            <Link
              to={`/admin/meetings/${meeting.id}/quizzes/new`}
              className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90"
            >
              {meetingDetail.quizCTA}
            </Link>
          </div>
          {meeting?.quizzes?.length ? (
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {meeting.quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                >
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{quiz.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {quiz.questions?.length ?? 0} pertanyaan
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
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
                    <Link
                      as="button"
                      method="delete"
                      href={`/admin/meetings/${meeting.id}/quizzes/${quiz.id}`}
                      onClick={confirmDelete(meetingDetail.quizConfirm)}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 shadow hover:bg-rose-50"
                    >
                      {meetingDetail.quizDelete}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.quizEmpty}</p>
          )}
        </section>

        <section className={`${infoCardClass}`}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.historyTitle}</h2>
          {quizAttempts.length ? (
            <div className="mt-3 space-y-3">
              {quizAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={resolveAvatar(attempt.user?.avatar_url || attempt.user?.avatar)}
                      alt={attempt.user?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{attempt.quizTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {attempt.user?.name || attempt.user?.email || "User"} • {formatDateTime(attempt.submitted_at, locale)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                      Skor: {attempt.total_score ?? "-"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                      Status: {attempt.submitted_at ? "Terkumpul" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.historyEmpty}</p>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
