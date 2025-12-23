import { Link, useNavigate } from "@/router";
import { useForm } from "@inertiajs/react";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";

const roles = ["Admin", "Pengguna"];

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { adminCopy } = useLanguage();
  const { common, userForm } = adminCopy;
  const formCopy = userForm.create;
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: roles[0],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    post("/admin/users", {
      onSuccess: () => {
        reset("password", "password_confirmation");
        navigate("/admin/users");
      },
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
          <span className="font-medium text-slate-700 dark:text-slate-100">{formCopy.title}</span>
        </nav>

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{formCopy.title}</h1>
          <p className="text-slate-500 dark:text-slate-300">{formCopy.description}</p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.name} <span className="text-rose-500">*</span>
              </label>
              <input
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder={userForm.placeholders.name}
                className={inputClass}
                required
              />
              {errors.name && <p className="mt-2 text-xs text-rose-500">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.email} <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder={userForm.placeholders.email}
                className={inputClass}
                required
              />
              {errors.email && <p className="mt-2 text-xs text-rose-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.password} <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder={userForm.placeholders.password}
                className={inputClass}
                required
              />
              {errors.password && <p className="mt-2 text-xs text-rose-500">{errors.password}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {userForm.fields.confirmPassword} <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleChange}
                placeholder={userForm.placeholders.confirmPassword}
                className={inputClass}
                required
              />
              {errors.password_confirmation && (
                <p className="mt-2 text-xs text-rose-500">{errors.password_confirmation}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {userForm.fields.role} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select name="role" value={data.role} onChange={handleChange} className={`${inputClass} appearance-none`}>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role === "Admin" ? userForm.roles.admin : userForm.roles.user}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-2 text-xs text-rose-500">{errors.role}</p>}
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400 dark:text-slate-500">
                <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill="currentColor" d="M5 7l5 6 5-6z" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {common.cancel}
          </button>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            disabled={processing}
          >
            {formCopy.submit}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
