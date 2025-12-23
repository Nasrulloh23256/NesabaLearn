import { useState } from "react";
import { useNavigate } from "@/router";
import { motion } from "framer-motion";
import { useForm, usePage } from "@inertiajs/react";
import UserLayout from "../../../Layouts/UserLayout";
import { useLanguage } from "../../../context/LanguageContext";

const gradientButton =
  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-5 py-2.5 font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#04BBFD]/60 focus:ring-offset-transparent";

export default function UserChangePasswordPage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const user = props?.auth?.user;
  const { adminCopy } = useLanguage();
  const copy = adminCopy.changePassword;
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data, setData, put, processing, errors, reset } = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "currentPassword") setData("current_password", value);
    if (name === "newPassword") setData("password", value);
    if (name === "confirmPassword") setData("password_confirmation", value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError(copy.errors.noUser);
      return;
    }

    const current = form.currentPassword.trim();
    const next = form.newPassword.trim();
    const confirm = form.confirmPassword.trim();

    if (!current || !next || !confirm) {
      setError(copy.errors.blank);
      return;
    }
    if (next.length < 6) {
      setError(copy.errors.minLength);
      return;
    }
    if (next !== confirm) {
      setError(copy.errors.mismatch);
      return;
    }

    put(route("password.update"), {
      onSuccess: () => {
        setSuccess(copy.success);
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        reset();
      },
      onError: () => {
        setError(copy.errors.general);
      },
    });
  };

  return (
    <UserLayout>
      <motion.form
        onSubmit={handleSubmit}
        className="mx-auto max-w-xl space-y-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <header>
          <h1 className="text-3xl font-bold">{copy.title}</h1>
          <p className="mt-1 text-slate-500">{copy.description}</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                {copy.fields.current}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={copy.placeholders.current}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPasswords.current ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPasswords.current ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M2 5.27L3.28 4L20 20.72L18.73 22L16.92 20.19A11 11 0 0 1 12 21C7 21 2.73 17.89 1 13.5c.71-1.82 1.9-3.39 3.4-4.63zM12 7c5 0 9.27 3.11 11 7.5c-.43 1.1-1.05 2.1-1.82 2.98l-2.12-2.12A6 6 0 0 0 12 9a6 6 0 0 0-2.36.49L7.7 7.53C9.02 7.18 10.48 7 12 7m0 4a2 2 0 0 1 2 2c0 .25-.05.49-.14.71l-2.57-2.57c.22-.09.46-.14.71-.14m-7.2 2.5c.78 1.73 2.2 3.2 4 4.09l-1.42-1.42A4 4 0 0 1 7 12c0-.37.05-.74.14-1.09z"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 5c5 0 9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5C2.73 8.11 7 5 12 5m0 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9m0 2a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.current_password && (
                <p className="mt-2 text-sm text-red-500">{errors.current_password}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                {copy.fields.new}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.next ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FB00FF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={copy.placeholders.new}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, next: !prev.next }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPasswords.next ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPasswords.next ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M2 5.27L3.28 4L20 20.72L18.73 22L16.92 20.19A11 11 0 0 1 12 21C7 21 2.73 17.89 1 13.5c.71-1.82 1.9-3.39 3.4-4.63zM12 7c5 0 9.27 3.11 11 7.5c-.43 1.1-1.05 2.1-1.82 2.98l-2.12-2.12A6 6 0 0 0 12 9a6 6 0 0 0-2.36.49L7.7 7.53C9.02 7.18 10.48 7 12 7m0 4a2 2 0 0 1 2 2c0 .25-.05.49-.14.71l-2.57-2.57c.22-.09.46-.14.71-.14m-7.2 2.5c.78 1.73 2.2 3.2 4 4.09l-1.42-1.42A4 4 0 0 1 7 12c0-.37.05-.74.14-1.09z"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 5c5 0 9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5C2.73 8.11 7 5 12 5m0 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9m0 2a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">
                {copy.fields.confirm}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={copy.placeholders.confirm}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPasswords.confirm ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPasswords.confirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M2 5.27L3.28 4L20 20.72L18.73 22L16.92 20.19A11 11 0 0 1 12 21C7 21 2.73 17.89 1 13.5c.71-1.82 1.9-3.39 3.4-4.63zM12 7c5 0 9.27 3.11 11 7.5c-.43 1.1-1.05 2.1-1.82 2.98l-2.12-2.12A6 6 0 0 0 12 9a6 6 0 0 0-2.36.49L7.7 7.53C9.02 7.18 10.48 7 12 7m0 4a2 2 0 0 1 2 2c0 .25-.05.49-.14.71l-2.57-2.57c.22-.09.46-.14.71-.14m-7.2 2.5c.78 1.73 2.2 3.2 4 4.09l-1.42-1.42A4 4 0 0 1 7 12c0-.37.05-.74.14-1.09z"
                      />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12 5c5 0 9.27 3.11 11 7.5C21.27 16.89 17 20 12 20S2.73 16.89 1 12.5C2.73 8.11 7 5 12 5m0 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9m0 2a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-500">{errors.password_confirmation}</p>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M11.67 3.87L9.9 2.1L0 12l9.9 9.9l1.77-1.77L3.54 12z"
              />
            </svg>
            {copy.back}
          </button>

          <button type="submit" className={gradientButton} disabled={processing}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V6a3 3 0 0 0-3-3z"
              />
            </svg>
            {copy.submit}
          </button>
        </div>
      </motion.form>
    </UserLayout>
  );
}
