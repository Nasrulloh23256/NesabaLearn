import { Link, useNavigate, useParams } from "@/router";
import { usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";

const roleBadgeClass = {
  Admin: "bg-purple-100/90 text-purple-800 dark:bg-purple-400/20 dark:text-purple-200",
  Pengguna: "bg-sky-100/90 text-sky-700 dark:bg-sky-400/20 dark:text-sky-200",
  Mentor: "bg-sky-100/90 text-sky-700 dark:bg-sky-400/20 dark:text-sky-200",
  Siswa: "bg-emerald-100/90 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200",
};

const statusBadgeClass = {
  Aktif: "bg-emerald-100/90 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200",
  "Tidak Aktif": "bg-rose-100/90 text-rose-600 dark:bg-rose-400/20 dark:text-rose-200",
  Pending: "bg-amber-100/90 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200",
};

const formatDate = (input, locale, options) => {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(locale, options);
};

const formatDateTime = (input, locale) =>
  formatDate(input, locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatJoinDate = (input, locale) =>
  formatDate(input, locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const RoleBadge = ({ role }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleBadgeClass[role] || "bg-slate-100 text-slate-600"}`}
  >
    {role}
  </span>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[status] || "bg-slate-200 text-slate-600"}`}
  >
    {status}
  </span>
);

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
    <div className="text-base text-slate-900 dark:text-slate-100">{value || "-"}</div>
  </div>
);

const SectionCard = ({ title, description, action, children }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {action}
    </div>
    <div className="mt-6">{children}</div>
  </section>
);

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { props } = usePage();
  const { adminCopy, language } = useLanguage();
  const { common, userDetail } = adminCopy;
  const locale = language === "en" ? "en-US" : "id-ID";

  const user = props?.user;
  const activity = props?.activity ?? [];

  if (!user) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {userDetail.notFound}
          <button onClick={() => navigate(-1)} className="ml-4 text-sm font-semibold text-rose-600 underline">
            {common.back}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const initials = (user.name || "U")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const lastLoginText = user.last_activity
    ? formatDateTime(user.last_activity, locale)
    : userDetail.lastLoginEmpty;

  const accessSummaries =
    language === "en"
      ? {
          Admin: "Full access to every module",
          Mentor: "Mentor and class modules",
          Siswa: "Student modules",
          Pengguna: "User modules",
        }
      : {
          Admin: "Akses penuh ke semua modul",
          Mentor: "Modul mentor & kelas",
          Siswa: "Modul siswa",
          Pengguna: "Modul pengguna",
        };

  const historyEntries = userDetail.accessSection.historyList.map((entry) =>
    entry.replace("{{lastLogin}}", lastLoginText),
  );

  const activityItems =
    activity.length > 0
      ? activity
      : [
          {
            dot: "bg-emerald-400",
            title: userDetail.activitySection.items.dashboard,
            description: userDetail.activitySection.items.dashboardDesc.replace("{{lastLogin}}", lastLoginText),
          },
          {
            dot: "bg-sky-400",
            title: userDetail.activitySection.items.download,
            description: userDetail.activitySection.items.downloadDesc,
          },
          {
            dot: "bg-amber-400",
            title: userDetail.activitySection.items.mentoring,
            description: userDetail.activitySection.items.mentoringDesc,
          },
        ];

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
          <Link to="/admin/users" className="hover:text-slate-700 dark:hover:text-slate-200">
            {common.users}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{userDetail.pageTitle}</span>
        </nav>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#04BBFD] to-[#FB00FF] text-xl font-bold text-white">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-300">{user.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap gap-3">
              <Link
                to={`/admin/users/${user.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100"
              >
                {userDetail.header.edit}
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900">
                {userDetail.header.resetPassword}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoRow label={userDetail.infoSection.labels.role} value={user.role} />
            <InfoRow label={userDetail.infoSection.labels.status} value={user.status} />
            <InfoRow label={userDetail.infoSection.labels.joined} value={formatJoinDate(user.joined_at, locale)} />
            <InfoRow label={userDetail.infoSection.labels.lastActivity} value={lastLoginText} />
          </div>
        </section>

        <SectionCard title={userDetail.infoSection.title} description={userDetail.infoSection.description}>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <InfoRow label={userDetail.infoSection.labels.name} value={user.name} />
              <InfoRow label={userDetail.infoSection.labels.email} value={user.email} />
            </div>
            <div className="space-y-4">
              <InfoRow label={userDetail.infoSection.labels.role} value={<RoleBadge role={user.role} />} />
              <InfoRow label={userDetail.infoSection.labels.status} value={<StatusBadge status={user.status} />} />
            </div>
            <div className="space-y-4">
              <InfoRow label={userDetail.infoSection.labels.joined} value={formatJoinDate(user.joined_at, locale)} />
              <InfoRow label={userDetail.infoSection.labels.lastActivity} value={lastLoginText} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title={userDetail.accessSection.title} description={userDetail.accessSection.description}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">{userDetail.accessSection.accessLabel}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {accessSummaries[user.role] || accessSummaries.Pengguna}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{userDetail.accessSection.advice}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">{userDetail.accessSection.historyLabel}</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {historyEntries.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={userDetail.activitySection.title}
          description={userDetail.activitySection.description}
          action={
            <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              {userDetail.activitySection.viewAll}
            </button>
          }
        >
          <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            {activityItems.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className={`mt-1 h-2 w-2 rounded-full ${item.dot}`} />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AdminLayout>
  );
}
