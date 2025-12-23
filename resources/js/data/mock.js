// Data contoh agar UI langsung tampil. Nanti tinggal ganti ke API kamu.
export const users = [
  {
    id: 1,
    name: "Muhammad Nasrulloh",
    email: "mnasrulloh001@gmail.com",
    role: "Siswa",
    joinedAt: "2025-08-27",
    status: "Tidak Aktif",
    lastLogin: null,
  },
  {
    id: 2,
    name: "Admin",
    email: "admin@example.com",
    role: "Admin",
    joinedAt: "2025-04-12",
    status: "Aktif",
    lastLogin: "2025-08-08T08:15:00",
  },
  {
    id: 3,
    name: "User",
    email: "user@example.com",
    role: "Siswa",
    joinedAt: "2025-06-04",
    status: "Aktif",
    lastLogin: "2025-08-05T19:20:00",
  },
  {
    id: 4,
    name: "Sinta Aulia",
    email: "sinta@example.com",
    role: "Mentor",
    joinedAt: "2025-03-18",
    status: "Aktif",
    lastLogin: "2025-08-07T10:00:00",
  },
  {
    id: 5,
    name: "Rafli Dimas",
    email: "rafli@example.com",
    role: "Siswa",
    joinedAt: "2025-07-14",
    status: "Pending",
    lastLogin: null,
  },
  {
    id: 6,
    name: "Galang Prasetyo",
    email: "galang@example.com",
    role: "Siswa",
    joinedAt: "2025-05-02",
    status: "Aktif",
    lastLogin: "2025-08-06T21:30:00",
  },
];

export const meetings = [
  {
    id: 101,
    title: "Pertemuan Perkenalan",
    date: "2025-08-03",
    start: "08:00:00",
    end: "10:00:00",
    url: "#",
    type: "Umum",
    status: "Completed",
    attendance: { registered: 45, attended: 41 },
  },
  {
    id: 102,
    title: "Editorial 1",
    date: "2025-08-06",
    start: "09:00:00",
    end: "11:00:00",
    url: "#",
    type: "Editorial",
    status: "Completed",
    attendance: { registered: 38, attended: 35 },
  },
  {
    id: 103,
    title: "Workshop UI/UX",
    date: "2025-08-12",
    start: "13:00:00",
    end: "15:00:00",
    url: "#",
    type: "Pelatihan",
    status: "Upcoming",
    attendance: { registered: 52, attended: 0 },
  },
  {
    id: 104,
    title: "Mentoring Batch 2",
    date: "2025-08-18",
    start: "19:00:00",
    end: "21:00:00",
    url: "#",
    type: "Mentoring",
    status: "Upcoming",
    attendance: { registered: 60, attended: 0 },
  },
  {
    id: 105,
    title: "Townhall Community",
    date: "2025-08-22",
    start: "10:00:00",
    end: "12:00:00",
    url: "#",
    type: "Umum",
    status: "Cancelled",
    attendance: { registered: 80, attended: 0 },
  },
];

export const monthlyUserGrowth = [
  { month: "Mar", users: 60, meetings: 8 },
  { month: "Apr", users: 72, meetings: 9 },
  { month: "Mei", users: 86, meetings: 11 },
  { month: "Jun", users: 98, meetings: 10 },
  { month: "Jul", users: 112, meetings: 12 },
  { month: "Agu", users: 125, meetings: 14 },
];

export const dashboardAlerts = [
  {
    id: "notif-1",
    title: "Workshop UI/UX",
    description: "Mulai 12 Agu pukul 13:00 WIB",
    type: "meeting",
  },
  {
    id: "notif-2",
    title: "Mentoring Batch 2",
    description: "Persiapkan mentor & materi sebelum 18 Agu.",
    type: "reminder",
  },
  {
    id: "notif-3",
    title: "Pengguna baru menunggu onboarding",
    description: "3 siswa baru bergabung pekan ini.",
    type: "info",
  },
];

const toDateKey = (meeting) => new Date(`${meeting.date}T${meeting.start}`);

export const formatLongDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const meetingsThisMonthCount = () => {
  const now = new Date();
  const m = now.getMonth();
  const y = now.getFullYear();
  return meetings.filter((d) => {
    const dt = new Date(d.date);
    return dt.getMonth() === m && dt.getFullYear() === y;
  }).length;
};

export const meetingStatusSummary = () => {
  const total = meetings.length;
  const completed = meetings.filter((m) => m.status === "Completed").length;
  const upcoming = meetings.filter((m) => m.status === "Upcoming").length;
  const cancelled = meetings.filter((m) => m.status === "Cancelled").length;
  const attended = meetings
    .filter((m) => m.status === "Completed")
    .reduce((sum, m) => sum + (m.attendance?.attended || 0), 0);
  const registered = meetings
    .filter((m) => m.status === "Completed")
    .reduce((sum, m) => sum + (m.attendance?.registered || 0), 0);

  return {
    total,
    completed,
    upcoming,
    cancelled,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
    cancellationRate: total ? Math.round((cancelled / total) * 100) : 0,
    attendanceRate: registered ? Math.round((attended / registered) * 100) : 0,
  };
};

export const nextMeetings = () =>
  meetings
    .filter((m) => toDateKey(m) >= new Date())
    .sort((a, b) => toDateKey(a) - toDateKey(b))
    .slice(0, 3);
