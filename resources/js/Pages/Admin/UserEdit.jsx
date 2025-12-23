import { useMemo, useEffect } from "react";
import { Link, useNavigate } from "@/router";
import { useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";

const roles = ["Admin", "Pengguna"];
const statuses = ["Aktif", "Tidak Aktif", "Pending"];

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";

export default function UserEditPage() {
  const { props } = usePage();
  const navigate = useNavigate();
  const { adminCopy } = useLanguage();
  const { common, userForm, userDetail } = adminCopy;
  const editCopy = userForm.edit;

  const user = useMemo(() => props?.user ?? null, [props?.user]);
  const statusValue = user?.status && statuses.includes(user.status) ? user.status : statuses[0];
  const { data, setData, put, processing, errors } = useForm({
    name: "",
    email: "",
    role: roles[0],
  });

  useEffect(() => {
    if (!user) return;
    setData("name", user.name || "");
    setData("email", user.email || "");
    setData("role", user.role || roles[0]);
  }, [user, setData]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    put(`/admin/users/${user.id}`, {
      onSuccess: () => navigate(`/admin/users/${user.id}`),
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
          <Link to="/admin/users" className="hover:text-slate-700 dark:hover:text-slate-200">
            {common.users}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{editCopy.title}</span>
        </nav>

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{editCopy.title}</h1>
          <p className="text-slate-500 dark:text-slate-300">{editCopy.description}</p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{userDetail.infoSection.title}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.name}
              </label>
              <input
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder={userForm.placeholders.name}
                className={inputBase}
              />
              {errors.name && <p className="mt-2 text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.email}
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder={userForm.placeholders.email}
                className={inputBase}
              />
              {errors.email && <p className="mt-2 text-xs text-rose-500">{errors.email}</p>}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.role}
              </label>
              <select name="role" value={data.role} onChange={handleChange} className={inputBase}>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "Admin" ? userForm.roles.admin : userForm.roles.user}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-2 text-xs text-rose-500">{errors.role}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userDetail.infoSection.labels.status}
              </label>
              <select name="status" value={statusValue} disabled className={`${inputBase} cursor-not-allowed`}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-400">
                Status otomatis: akun tidak aktif jika tidak login 3 hari.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              {common.cancel}
            </button>
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 dark:bg-slate-100 dark:text-slate-900"
              disabled={processing}
            >
              {editCopy.submit}
            </button>
          </div>
        </section>
      </form>
    </AdminLayout>
  );
}
