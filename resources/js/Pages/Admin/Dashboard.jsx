import { Link } from "@/router";
import { motion } from "framer-motion";
import AdminLayout from "../../Layouts/AdminLayout";
import {
  dashboardAlerts,
  meetingStatusSummary,
  meetingsThisMonthCount,
  monthlyUserGrowth,
  users,
} from "../../data/mock";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { usePage } from "@inertiajs/react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const quickActions = [
  {
    key: "addMeeting",
    to: "/admin/meetings/new",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5a1 1 0 0 1 1 1v5h5a1 1 0 0 1 0 2h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1"
        />
      </svg>
    ),
  },
  {
    key: "inviteUser",
    to: "/admin/users/new",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 11a4 4 0 1 0-4-4a4 4 0 0 0 4 4m-8 0a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-3.33 0-6 1.34-6 3v2h12v-2c0-1.66-2.67-3-6-3m8 0c-.66 0-1.29.07-1.88.2A6 6 0 0 1 20 16v2h6v-2c0-1.66-2.67-3-6-3"
        />
      </svg>
    ),
  },
  {
    key: "viewReport",
    to: "/admin/meetings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 13h2v4H3zm4-6h2v10H7zm4 4h2v6h-2zm4-7h2v13h-2zm4 9h2v4h-2z"
        />
      </svg>
    ),
  },
];

const alertBadge = {
  meeting: "bg-sky-100 text-sky-700",
  reminder: "bg-amber-100 text-amber-700",
  info: "bg-emerald-100 text-emerald-700",
};

export default function Dashboard() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}

function DashboardContent() {
  const { props } = usePage();
  const { theme } = useTheme();
  const { adminCopy, language } = useLanguage();
  const dashboardCopy = adminCopy.dashboard;
  const rawGrowth = Array.isArray(props?.growth) && props.growth.length
    ? props.growth
    : monthlyUserGrowth;
  const growthBars = rawGrowth.map((item) => {
    if (item.month && item.year) {
      const label = new Date(item.year, item.month - 1, 1).toLocaleDateString(
        language === "en" ? "en-US" : "id-ID",
        { month: "short" },
      );
      return { month: label, users: item.users ?? 0, meetings: item.meetings ?? 0 };
    }
    return item;
  });
  const status = meetingStatusSummary();
  const alertsSource = Array.isArray(props?.alerts) && props.alerts.length ? props.alerts : dashboardAlerts;
  const alerts = alertsSource
    .slice()
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  const quickActionCopy = dashboardCopy.quickActions;
  const stats = props?.stats ?? {};
  const totalUsers = stats.users ?? users.length;
  const meetingsThisMonth = stats.meetingsThisMonth ?? meetingsThisMonthCount();
  const attendanceRate =
    Number.isFinite(stats.attendanceRate) && stats.attendanceRate !== null
      ? stats.attendanceRate
      : status.attendanceRate;

  const surface =
    theme === "light"
      ? "bg-white text-slate-900 border border-slate-200 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.18)]"
      : "bg-slate-900 border border-slate-800 text-slate-100";

  const interactiveSurface =
    theme === "light"
      ? "bg-white border border-slate-200 shadow-[0_16px_32px_-20px_rgba(15,23,42,0.2)] hover:-translate-y-1 hover:shadow-[0_24px_40px_-20px_rgba(15,23,42,0.24)] text-slate-900"
      : "bg-slate-900 border border-slate-800 hover:-translate-y-1 hover:bg-slate-800 text-slate-100";

  const subtleSurface =
    theme === "light"
      ? "border border-slate-200 bg-white shadow text-slate-700"
      : "border border-slate-800 bg-slate-800/40 text-slate-100";
  const chartSurface =
    theme === "light"
      ? "bg-white border border-slate-200"
      : "bg-slate-900/40 border border-slate-800";

  const statCards = [
    {
      key: "totalUsers",
      title: dashboardCopy.stats.totalUsers.title,
      value: totalUsers,
      note: dashboardCopy.stats.totalUsers.note,
      ring: "from-[#04BBFD] to-[#FB00FF]",
    },
    {
      key: "meetings",
      title: dashboardCopy.stats.meetings.title,
      value: meetingsThisMonth,
      note: dashboardCopy.stats.meetings.note,
      ring: "from-emerald-400 to-cyan-500",
    },
    {
      key: "attendance",
      title: dashboardCopy.stats.attendance.title,
      value: `${attendanceRate}%`,
      note: dashboardCopy.stats.attendance.note,
      ring: "from-violet-400 to-indigo-500",
    },
  ];

  const maxUsers = Math.max(...growthBars.map((d) => d.users));
  const maxMeetings = Math.max(...growthBars.map((d) => d.meetings));
  const topMonth =
    growthBars.length > 0
      ? growthBars.reduce((best, item) => (item.users > best.users ? item : best), growthBars[0])
      : null;
  const growthCaption = language === "en" ? "Last 6 months" : "6 bulan terakhir";
  const lineChartWidth = 640;
  const lineChartHeight = 180;
  const lineChartPadding = 18;
  const usableWidth = lineChartWidth - lineChartPadding * 2;
  const usableHeight = lineChartHeight - lineChartPadding * 2;
  const maxGrowthValue = Math.max(
    1,
    ...growthBars.map((d) => Math.max(d.users || 0, d.meetings || 0)),
  );
  const buildLine = (items, key) =>
    items
      .map((item, index) => {
        const x =
          lineChartPadding +
          (usableWidth / Math.max(items.length - 1, 1)) * index;
        const y =
          lineChartHeight -
          lineChartPadding -
          ((item[key] || 0) / maxGrowthValue) * usableHeight;
        return `${x},${y}`;
      })
      .join(" ");

  const progress = [
    {
      key: "completed",
      label: dashboardCopy.status.completed,
      value: status.completed,
      percent: status.completionRate,
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      key: "cancelled",
      label: dashboardCopy.status.cancelled,
      value: status.cancelled,
      percent: status.cancellationRate,
      gradient: "from-rose-400 to-rose-500",
    },
    {
      key: "upcoming",
      label: dashboardCopy.status.upcoming,
      value: status.upcoming,
      percent: status.total ? Math.round((status.upcoming / status.total) * 100) : 0,
      gradient: "from-sky-400 to-blue-500",
    },
  ];

  const getTimeAgo = (input) => {
    if (!input) return language === "en" ? "just now" : "baru saja";
    const diffMs = Date.now() - new Date(input).getTime();
    if (Number.isNaN(diffMs)) return language === "en" ? "just now" : "baru saja";
    const minutes = Math.max(1, Math.floor(diffMs / 60000));
    if (minutes < 60) {
      return language === "en" ? `${minutes} minutes` : `${minutes} menit`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return language === "en" ? `${hours} hours` : `${hours} jam`;
    }
    const days = Math.floor(hours / 24);
    return language === "en" ? `${days} days` : `${days} hari`;
  };
  const alertsUpdatedText = dashboardCopy.alerts.updated.replace(
    "{{time}}",
    getTimeAgo(alerts[0]?.created_at),
  );

  return (
    <motion.div initial="hidden" animate="show" variants={container} className="space-y-6">
      <motion.div variants={item} className="mb-2">
        <h1 className="text-3xl font-bold">{dashboardCopy.title}</h1>
        <p className="text-slate-500 mt-1">{dashboardCopy.subtitle}</p>
      </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {statCards.map((card) => (
            <motion.div
              key={card.key}
              variants={item}
              className={`rounded-[26px] p-5 flex items-center gap-4 transition ${surface}`}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.ring} shadow-lg`} />
              <div>
                <div className={`text-sm ${theme === "light" ? "text-slate-600" : "text-slate-400"}`}>{card.title}</div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className={`text-xs ${theme === "light" ? "text-slate-500" : "text-slate-400"}`}>{card.note}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={item} className="grid gap-3 sm:grid-cols-3">
          {quickActions.map((action) => (
            <motion.div key={action.key} variants={item}>
              <Link
                to={action.to}
                className={`group flex items-center gap-3 rounded-[26px] px-4 py-4 transition ${interactiveSurface}`}
              >
                <span className="text-xl text-slate-500">{action.icon}</span>
                <div>
                  <span className="font-semibold block group-hover:text-[#04BBFD]">
                    {quickActionCopy[action.key].label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {quickActionCopy[action.key].description}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
          <div className={`lg:col-span-2 rounded-[26px] p-6 ${surface}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{dashboardCopy.growth.title}</h2>
                <p className="text-sm text-slate-500">{dashboardCopy.growth.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span
                  className={`rounded-full border px-3 py-1 ${
                    theme === "light" ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900"
                  }`}
                >
                  {growthCaption}
                </span>
                {topMonth && (
                  <span className="rounded-full bg-gradient-to-r from-[#04BBFD]/20 to-[#FB00FF]/20 px-3 py-1 text-xs text-slate-600 dark:text-slate-200">
                    {language === "en" ? "Top month:" : "Bulan tertinggi:"} {topMonth.month}
                  </span>
                )}
              </div>
            </div>

              <div className={`mt-6 rounded-[22px] p-6 shadow-sm ${chartSurface}`}>
              <div className="flex items-center justify-end gap-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF]" />
                  {dashboardCopy.growth.legendUsers}
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                  {dashboardCopy.growth.legendMeetings}
                </span>
              </div>

              <div className="relative mt-5">
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-slate-200/60 dark:border-slate-800/70">
                  <div className="h-full w-full bg-[linear-gradient(to_top,rgba(148,163,184,0.22)_1px,transparent_1px)] bg-[length:100%_20%] dark:bg-[linear-gradient(to_top,rgba(148,163,184,0.12)_1px,transparent_1px)]" />
                </div>
                <svg
                  viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}
                  className="relative z-10 h-64 w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="userLine" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#04BBFD" />
                      <stop offset="100%" stopColor="#FB00FF" />
                    </linearGradient>
                    <linearGradient id="meetingLine" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>

                  <motion.polyline
                    points={buildLine(growthBars, "meetings")}
                    fill="none"
                    stroke="url(#meetingLine)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.polyline
                    points={buildLine(growthBars, "users")}
                    fill="none"
                    stroke="url(#userLine)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
                  />

                  {growthBars.map((item, index) => {
                    const x =
                      lineChartPadding +
                      (usableWidth / Math.max(growthBars.length - 1, 1)) * index;
                    const yUsers =
                      lineChartHeight -
                      lineChartPadding -
                      ((item.users || 0) / maxGrowthValue) * usableHeight;
                    const yMeetings =
                      lineChartHeight -
                      lineChartPadding -
                      ((item.meetings || 0) / maxGrowthValue) * usableHeight;
                    return (
                      <g key={`${item.month}-${index}`}>
                        <circle cx={x} cy={yMeetings} r="5" fill="#14B8A6" opacity="0.9" />
                        <circle cx={x} cy={yUsers} r="5.5" fill="#FB00FF" opacity="0.9" />
                      </g>
                    );
                  })}
                </svg>
                <div className="relative z-10 mt-2 grid grid-cols-6 text-center text-xs text-slate-500">
                  {growthBars.map((item) => (
                    <span key={`label-${item.month}`}>{item.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-[26px] p-6 flex flex-col gap-5 ${surface}`}>
            <div>
              <h2 className="text-lg font-semibold">{dashboardCopy.status.title}</h2>
              <p className="text-sm text-slate-500">
                {dashboardCopy.status.description
                  .replace("{{completed}}", status.completed)
                  .replace("{{total}}", status.total)}
              </p>
            </div>
            <div className="space-y-4">
              {progress.map((row) => (
                <div key={row.key}>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
                    <span>{row.label}</span>
                    <span>
                      {row.value} • {row.percent}%
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${row.gradient}`}
                      style={{ width: `${row.percent}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${row.percent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-3">
        <div className={`lg:col-span-2 rounded-[26px] p-6 ${surface}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{dashboardCopy.alerts.title}</h2>
            <span className="text-xs font-medium text-slate-500">{alertsUpdatedText}</span>
          </div>
          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={item}
                className={`flex items-start gap-3 rounded-[22px] px-4 py-3 ${subtleSurface}`}
              >
                <span
                  className={`mt-1 rounded-full px-2 py-1 text-xs font-semibold ${
                    alertBadge[alert.type] || "bg-slate-200 text-slate-600"
                  }`}
                >
                  {dashboardCopy.alerts.badges[alert.type] || alert.type}
                </span>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{alert.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {(language === "en" ? alert.description_en : alert.description_id) || alert.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={`rounded-[26px] p-6 ${surface}`}>
          <h2 className="text-lg font-semibold">{dashboardCopy.notes.title}</h2>
          <p className="text-sm text-slate-500">{dashboardCopy.notes.description}</p>
          <div className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <Link
                key={`side-${action.key}`}
                to={action.to}
                className={`flex items-center justify-between rounded-[22px] border px-4 py-3 text-sm font-medium transition hover:border-[#04BBFD] ${
                  theme === "light"
                    ? "border-slate-200 text-slate-600 bg-white hover:shadow"
                    : "border-slate-800 text-slate-200 bg-slate-900 hover:bg-slate-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-slate-500">{action.icon}</span>
                  {quickActionCopy[action.key].label}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{dashboardCopy.notes.shortcutHint}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
