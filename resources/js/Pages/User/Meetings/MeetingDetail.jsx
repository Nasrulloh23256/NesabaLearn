import { useMemo } from "react";
import { Link, useNavigate, useParams } from "@/router";
import { useForm, usePage } from "@inertiajs/react";
import UserLayout from "../../../Layouts/UserLayout";
import { useLanguage } from "../../../context/LanguageContext";

const infoCardClass =
  "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60";

const formatDate = (input, locale) =>
  new Date(input).toLocaleDateString(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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

const resolveMaterialVideo = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/storage/${path}`;
};

const resolveAssignmentFile = (path) => resolveMaterialVideo(path);

const buildMeetingStart = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;
  const dateOnly = String(dateValue).split("T")[0];
  const dateTime = new Date(`${dateOnly}T${timeValue}`);
  if (Number.isNaN(dateTime.getTime())) return null;
  return dateTime;
};

const getQuizAvailability = (quiz, language) => {
  const now = new Date();
  const startAt = quiz?.start_time ? new Date(quiz.start_time) : null;
  const endAt = quiz?.end_time ? new Date(quiz.end_time) : null;
  if (startAt && !Number.isNaN(startAt.getTime()) && now < startAt) {
    return {
      label: language === "en" ? "Not open yet" : "Belum dibuka",
      disabled: true,
    };
  }
  if (endAt && !Number.isNaN(endAt.getTime()) && now > endAt) {
    return {
      label: language === "en" ? "Closed" : "Ditutup",
      disabled: true,
    };
  }
  return {
    label: language === "en" ? "Start Quiz" : "Kerjakan Quiz",
    disabled: false,
  };
};

export default function UserMeetingDetailPage() {
  const { props } = usePage();
  const { id } = useParams();
  const navigate = useNavigate();
  const meeting = props?.meeting;
  const errors = props?.errors ?? {};
  const currentUser = props?.auth?.user ?? null;
  const { adminCopy, language } = useLanguage();
  const { common, meetingDetail } = adminCopy;
  const locale = language === "en" ? "en-US" : "id-ID";
  const { post: postAttendance, processing: attendanceProcessing } = useForm({});
  const assignmentForm = useForm({ description: "", file: null });

  if (!meeting) {
    return (
      <UserLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {meetingDetail.notFound}
          <button onClick={() => navigate(-1)} className="ml-4 text-sm font-semibold text-rose-600 underline">
            {common.back}
          </button>
        </div>
      </UserLayout>
    );
  }

  const dateValue = meeting.meeting_date ?? meeting.date;
  const startTime = meeting.start_time ?? meeting.start;
  const endTime = meeting.end_time ?? meeting.end;
  const meetingUrl = meeting.meeting_url ?? meeting.url;
  const meetingType = meeting.type ?? meeting.meeting_type;
  const meetingDescription = meeting.description || meetingDetail.noDescription;
  const quizzes = meeting.quizzes || [];
  const materials = meeting.materials || [];
  const attachments = meeting.attachments || [];
  const task = meeting.task || null;
  const assignments = Array.isArray(meeting.assignments) ? meeting.assignments : [];
  const userAssignment = assignments.length ? assignments[0] : null;
  const meetingStart = buildMeetingStart(dateValue, startTime);
  const canCheckIn = !meetingStart || new Date() >= meetingStart;
  const attendanceRecords = meeting.attendances || [];
  const userAttendance = currentUser
    ? attendanceRecords.find((entry) => entry.user_id === currentUser.id)
    : null;
  const hasCheckedIn = Boolean(userAttendance);
  const quizAttempts = useMemo(() => {
    const entries = [];
    quizzes.forEach((quiz) => {
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
  }, [quizzes]);

  const now = new Date();
  const taskStart = task?.start_time ? new Date(task.start_time) : null;
  const taskEnd = task?.end_time ? new Date(task.end_time) : null;
  const taskNotOpen = taskStart && !Number.isNaN(taskStart.getTime()) && now < taskStart;
  const taskClosed = taskEnd && !Number.isNaN(taskEnd.getTime()) && now > taskEnd;
  const canSubmitAssignment = Boolean(task) && !taskNotOpen && !taskClosed;
  const assignmentError = assignmentForm.errors.assignment || errors.assignment;

  const handleAssignmentSubmit = (event) => {
    event.preventDefault();
    assignmentForm.post(`/user/meetings/${meeting.id}/assignments`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        assignmentForm.reset();
      },
    });
  };

  const handleCheckIn = () => {
    postAttendance(`/user/meetings/${meeting.id}/attendance`, {
      preserveScroll: true,
    });
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/user/meetings"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 3L3 10.5V12h1v9h6v-5h4v5h6v-9h1v-1.5z" />
            </svg>
          </Link>
          <span>&gt;</span>
          <Link to="/user/meetings" className="hover:text-slate-700 dark:hover:text-slate-200">
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
        </header>

        <section className={infoCardClass}>
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
                  {meetingDescription}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.link}</p>
                <a href={meetingUrl || "#"} className="text-slate-900 dark:text-slate-100 underline break-all" target="_blank" rel="noreferrer">
                  {meetingUrl || "-"}
                </a>
              </div>
            </div>
            <div className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.type}</p>
                <div className="flex items-center gap-2">
                  <p className="text-base text-slate-900 dark:text-slate-100">{meetingType || "-"}</p>
                  {meeting.is_cancelled && (
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                      Dibatalkan
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-500 dark:text-slate-400">{meetingDetail.labels.date}</p>
                <p className="text-base text-slate-900 dark:text-slate-100">{dateValue ? formatDate(dateValue, locale) : "-"}</p>
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

        <section className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.attachmentsTitle}</h2>
          {attachments.length ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {attachments.map((file) => {
                const href = file.path?.startsWith("http") || file.path?.startsWith("/")
                  ? file.path
                  : `/storage/${file.path}`;
                return (
                  <li
                    key={file.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-2 dark:border-slate-700"
                  >
                    <span className="truncate">{file.title}</span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-slate-700 underline hover:text-slate-900 dark:text-slate-200"
                    >
                      {meetingDetail.attachmentsView ?? (language === "en" ? "View" : "Lihat")}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.noAttachments}</p>
          )}
        </section>

        <section className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.materialTitle}</h2>
          {materials.length ? (
            <div className="mt-4 space-y-4">
              {materials.map((material) => {
                const isVideo = material.type === "video";
                const videoSrc = resolveMaterialVideo(material.video_path);
                return (
                  <div
                    key={material.id}
                    className="rounded-2xl border border-slate-200 p-4 shadow-sm dark:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">{material.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {isVideo ? "Video" : "Konten"}
                        </p>
                      </div>
                      {isVideo && videoSrc && (
                        <a
                          href={videoSrc}
                          download
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                        >
                          Download Video
                        </a>
                      )}
                    </div>
                    {isVideo ? (
                      videoSrc ? (
                        <div className="mt-4">
                          <video
                            controls
                            preload="metadata"
                            className="w-full rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"
                          >
                            <source src={videoSrc} />
                            {language === "en"
                              ? "Your browser does not support the video tag."
                              : "Browser Anda tidak mendukung pemutar video."}
                          </video>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                          {language === "en"
                            ? "Video file is not available."
                            : "File video belum tersedia."}
                        </p>
                      )
                    ) : (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                        {material.content || (language === "en" ? "No content." : "Tidak ada konten.")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.noMaterials}</p>
          )}
        </section>

        <section className={infoCardClass}>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.taskTitle}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{meetingDetail.taskDescription}</p>
          </div>
          {task ? (
            <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {meetingDetail.taskType}
                  </p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {task.type === "content" ? (language === "en" ? "Content" : "Konten") : "File"}
                  </p>
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
                  {task.file_path && (
                    <a
                      href={resolveMaterialVideo(task.file_path)}
                      download
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

        <section className={infoCardClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.attendanceTitle}</h2>
            {!hasCheckedIn && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={!canCheckIn || attendanceProcessing}
                className="rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-5 py-1.5 text-xs font-semibold text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {language === "en" ? "Check-in" : "Absensi Meeting"}
              </button>
            )}
          </div>
          {errors.attendance && <p className="mt-2 text-sm text-rose-500">{errors.attendance}</p>}
          {!canCheckIn && meetingStart && (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {meetingDetail.attendanceNotOpen}{" "}
              {meetingDetail.attendanceOpenAt.replace("{{date}}", formatDateTime(meetingStart, locale))}
            </p>
          )}
          {hasCheckedIn ? (
            <ul className="mt-3 space-y-3">
              {[userAttendance].filter(Boolean).map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-3 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={entry.user?.avatar_url || entry.user?.avatar || "/avatar.png"}
                      alt={entry.user?.name || "User"}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {entry.user?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateTime(entry.checked_in_at, locale)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.noAttendance}</p>
          )}
        </section>

        <section className={infoCardClass}>
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.assignmentTitle}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{meetingDetail.assignmentDescription}</p>
            </div>
            <form onSubmit={handleAssignmentSubmit} className="space-y-4">
              {task?.end_time && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {meetingDetail.taskEnd}: {formatDateTime(task.end_time, locale)}
                </p>
              )}
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Deskripsi Tugas (opsional)</label>
                <textarea
                  rows={3}
                  value={assignmentForm.data.description}
                  onChange={(e) => assignmentForm.setData("description", e.target.value)}
                  disabled={!canSubmitAssignment}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                  placeholder={meetingDetail.assignmentCTA}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Unggah File Tugas</label>
                <label className="mt-2 flex items-center gap-2 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
                  <span className="flex-1">
                    {assignmentForm.data.file ? assignmentForm.data.file.name : "Choose File (Max 20MB)"}
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    disabled={!canSubmitAssignment}
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      assignmentForm.setData("file", file);
                    }}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.jpg,.jpeg,.png,.mp4,.mov"
                  />
                </label>
              </div>
              {assignmentError && <p className="text-sm text-rose-500">{assignmentError}</p>}
              {assignmentForm.errors.file && <p className="text-sm text-rose-500">{assignmentForm.errors.file}</p>}
              {assignmentForm.recentlySuccessful && (
                <p className="text-sm text-emerald-600">
                  {language === "en" ? "Assignment submitted successfully." : "Tugas berhasil dikirim."}
                </p>
              )}
              {taskNotOpen && (
                <p className="text-sm text-amber-500">
                  {meetingDetail.taskNotOpen} {formatDateTime(task.start_time, locale)}
                </p>
              )}
              {taskClosed && (
                <p className="text-sm text-rose-500">
                  {meetingDetail.taskClosed} {formatDateTime(task.end_time, locale)}
                </p>
              )}
              <button
                type="submit"
                disabled={!canSubmitAssignment || assignmentForm.processing}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {language === "en" ? "Submit Assignment" : "Kumpulkan Tugas"}
              </button>
            </form>
            {userAssignment ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                      {meetingDetail.assignmentTitle}
                    </p>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {formatDateTime(userAssignment.submitted_at, locale)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                      {meetingDetail.assignmentReviewScore}: {userAssignment.score ?? "-"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                      {userAssignment.reviewed_at ? meetingDetail.assignmentReviewDone : meetingDetail.assignmentReviewPending}
                    </span>
                    {userAssignment.file_path && (
                      <a
                        href={resolveAssignmentFile(userAssignment.file_path)}
                        download
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                      >
                        {language === "en" ? "Download file" : "Unduh file"}
                      </a>
                    )}
                  </div>
                </div>
                {Array.isArray(userAssignment.rubric) && userAssignment.rubric.length ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {meetingDetail.assignmentReviewRubric}
                    </p>
                    <ul className="space-y-2">
                      {userAssignment.rubric.map((item, index) => (
                        <li
                          key={`${item.label}-${index}`}
                          className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-xs dark:border-slate-700"
                        >
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {item.score}
                            {item.max ? ` / ${item.max}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {meetingDetail.assignmentReviewFeedback}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                    {userAssignment.mentor_feedback || meetingDetail.assignmentReviewEmpty}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">{meetingDetail.assignmentEmpty}</p>
            )}
          </div>
        </section>

        <section className={infoCardClass}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{meetingDetail.quizTitle}</h2>
          {quizzes.length ? (
            <div className="mt-3 space-y-3">
              {quizzes.map((quiz) => {
                const hasAttempt = (quiz.attempts || []).length > 0;
                const availability = getQuizAvailability(quiz, language);
                const label = hasAttempt
                  ? language === "en"
                    ? "Completed"
                    : "Sudah dikerjakan"
                  : availability.label;
                const disabled = hasAttempt || availability.disabled;
                return (
                  <div
                    key={quiz.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{quiz.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {quiz.questions?.length ?? 0} pertanyaan
                      </p>
                    </div>
                    {disabled ? (
                      <span className="rounded-full bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {label}
                      </span>
                    ) : (
                      <Link
                        to={`/user/meetings/${meeting.id}/quizzes/${quiz.id}`}
                        className="rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-5 py-2 text-xs font-semibold text-white shadow hover:opacity-90"
                      >
                        {label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{meetingDetail.quizEmpty}</p>
          )}
        </section>

        <section className={infoCardClass}>
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
                      src={resolveAvatar(currentUser?.avatar_url || currentUser?.avatar)}
                      alt={currentUser?.name || "User"}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{attempt.quizTitle}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {currentUser?.name || currentUser?.email || "User"} • {formatDateTime(attempt.submitted_at, locale)}
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
    </UserLayout>
  );
}
