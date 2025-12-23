import { Link } from "@/router";
import { motion } from "framer-motion";
import { router, usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";

const RoleBadge = ({ role }) => {
  const map = {
    Admin: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    Pengguna: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  };
  return <span className={`text-xs px-3 py-1 rounded-full ${map[role] || "bg-slate-100"}`}>{role}</span>;
};

const ActionBtn = ({ children, tone = "slate", onClick, disabled = false, ...rest }) => {
  const tones = {
    slate: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    red: "bg-red-100 text-red-600 hover:bg-red-200",
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`p-2 rounded-full transition ${
        disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : tones[tone]
      }`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default function UsersPage() {
  const { adminCopy } = useLanguage();
  const { usersPage } = adminCopy;
  const { props } = usePage();
  const users = props?.users ?? [];

  const handleDelete = (user) => {
    if (!window.confirm(`Hapus pengguna ${user.name}?`)) return;
    router.delete(`/admin/users/${user.id}`, {
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{usersPage.title}</h1>
            <p className="text-slate-500">{usersPage.description}</p>
          </div>
          <Link
            to="/admin/users/new"
            className="group relative rounded-xl text-white font-medium focus:outline-none"
          >
            <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] blur-lg"></span>
            <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#04BBFD] to-[#FB00FF]"></span>
            <span className="absolute inset-[2px] rounded-[0.65rem] bg-slate-900"></span>
            <span className="relative z-[1] block px-4 py-2 rounded-[0.6rem] bg-slate-900">{usersPage.addButton}</span>
          </Link>
        </div>

        {/* table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm">
            <tr>
              <th className="text-left px-6 py-3">{usersPage.table.name}</th>
              <th className="text-left px-6 py-3">{usersPage.table.email}</th>
              <th className="text-left px-6 py-3">{usersPage.table.role}</th>
              <th className="text-left px-6 py-3">{usersPage.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                  Belum ada pengguna.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                      title={usersPage.view}
                    >
                      <img src="/Eye.png" alt={usersPage.view} className="h-4 w-4" />
                    </Link>
                    <ActionBtn
                      aria-label={usersPage.impersonate}
                      title={usersPage.impersonate}
                      disabled={u.role === "Admin"}
                      onClick={() => {
                        if (u.role === "Admin") return;
                        if (!window.confirm(`Masuk sebagai ${u.name}?`)) return;
                        router.post(`/admin/users/${u.id}/impersonate`);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2c-3.33 0-6 1.34-6 3v2h12v-2c0-1.66-2.67-3-6-3m9-2h-2v-2h-2V8h2V6h2v2h2v2h-2z"
                        />
                      </svg>
                    </ActionBtn>
                    <ActionBtn
                      tone="red"
                      aria-label={usersPage.remove}
                      title={usersPage.remove}
                      onClick={() => handleDelete(u)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="currentColor"
                          d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-7.12l1.41-1.41L12 11.59l1.12-1.12l1.41 1.41L13.41 13l1.12 1.12l-1.41 1.41L12 14.41l-1.12 1.12l-1.41-1.41L10.59 13zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"
                        />
                      </svg>
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
