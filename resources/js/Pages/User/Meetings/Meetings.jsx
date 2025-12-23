import { Link } from "@/router";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useState } from "react";
import UserLayout from "../../../Layouts/UserLayout";
import { meetings as mockMeetings, formatLongDate } from "../../../data/mock";
import { useLanguage } from "../../../context/LanguageContext";

export default function UserMeetingsPage() {
  const { props } = usePage();
  const { adminCopy } = useLanguage();
  const { meetingList } = adminCopy;
  const meetings = Array.isArray(props?.meetings)
    ? props.meetings
    : props?.meetings?.data ?? mockMeetings;
  const [filter, setFilter] = useState("all");
  const formatDate = (value) => (value ? formatLongDate(value) : "-");
  const normalizeType = (value) => (value || "").toString().toLowerCase();
  const filteredMeetings =
    filter === "all"
      ? meetings
      : meetings.filter((meeting) => normalizeType(meeting.type) === filter);
  return (
    <UserLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">{meetingList.title}</h1>
            <p className="text-slate-500">{meetingList.description}</p>
          </div>
          <div className="relative w-full sm:w-[220px]">
            <div className="rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] p-[2px] shadow-sm">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="appearance-none w-full rounded-full bg-white pl-5 pr-14 py-2 text-left text-sm font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all" className="text-slate-900">
                  {meetingList.filterAll}
                </option>
                <option value="artikel" className="text-slate-900">
                  {meetingList.filterArticle}
                </option>
                <option value="editorial" className="text-slate-900">
                  {meetingList.filterEditorial}
                </option>
              </select>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] text-white shadow">
                <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill="currentColor" d="M5 7l5 6 5-6z" />
                </svg>
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm">
                <tr>
                  <th className="text-left px-6 py-3">{meetingList.table.title}</th>
                  <th className="text-left px-6 py-3">{meetingList.table.date}</th>
                  <th className="text-left px-6 py-3">{meetingList.table.start}</th>
                  <th className="text-left px-6 py-3">{meetingList.table.end}</th>
                  <th className="text-left px-6 py-3">{meetingList.table.url}</th>
                  <th className="text-left px-6 py-3">{meetingList.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredMeetings.length > 0 ? (
                  filteredMeetings.map((m) => {
                    const dateValue = m.meeting_date ?? m.date;
                    const startTime = m.start_time ?? m.start;
                    const endTime = m.end_time ?? m.end;
                    const meetingUrl = m.meeting_url ?? m.url;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span>{m.title}</span>
                      {m.is_cancelled && (
                        <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
                          Dibatalkan
                        </span>
                      )}
                    </div>
                  </td>
                        <td className="px-6 py-4">{formatDate(dateValue)}</td>
                        <td className="px-6 py-4">{startTime || "-"}</td>
                        <td className="px-6 py-4">{endTime || "-"}</td>
                        <td className="px-6 py-4">
                          <a
                            href={meetingUrl || "#"}
                            className="font-medium text-slate-800 dark:text-slate-100 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {meetingList.join}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Link
                              to={`/user/meetings/${m.id}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                              title="Lihat detail meeting"
                            >
                              <img src="/Eye.png" alt="Detail meeting" className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                      {meetingList.empty ?? "Belum ada pertemuan."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </UserLayout>
  );
}
