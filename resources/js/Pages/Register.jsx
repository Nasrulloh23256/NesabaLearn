import { motion } from "framer-motion";
import { Link, useNavigate } from "@/router";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useThemeMode } from "../hooks/useThemeMode";

export default function Register() {
  const images = ["/login1.jpeg", "/login2.jpeg", "/login3.jpeg"]; // ganti dengan gambar kamu
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { copy, language, toggleLanguage } = useLanguage();
  const authCopy = copy.auth?.register ?? {};
  const { theme, toggleTheme } = useThemeMode();
  const languageToggleLabel = language === "id" ? "EN" : "ID";
  const languageTarget = language === "id" ? "English" : "Bahasa Indonesia";
  const themeToggleLabel =
    theme === "dark"
      ? language === "id"
        ? "Ubah ke mode terang"
        : "Switch to light mode"
      : language === "id"
        ? "Ubah ke mode gelap"
        : "Switch to dark mode";

  // Auto ganti gambar tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmed = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
    };

    if (!trimmed.firstName || !trimmed.lastName || !trimmed.email || !trimmed.password) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      setError("Format email tidak valid.");
      return;
    }

    const existing = JSON.parse(window.localStorage.getItem("nesabaUsers") || "[]");
    const duplicate = existing.some((user) => user.email === trimmed.email);
    if (duplicate) {
      setError("Email sudah terdaftar, silakan login.");
      return;
    }

    const uid =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `user-${Date.now()}`;

    const newUser = {
      id: uid,
      firstName: trimmed.firstName,
      lastName: trimmed.lastName,
      email: trimmed.email,
      password: trimmed.password,
      fullName: `${trimmed.firstName} ${trimmed.lastName}`.trim(),
      role: "Pengguna",
    };

    window.localStorage.setItem("nesabaUsers", JSON.stringify([...existing, newUser]));
    window.localStorage.setItem("nesabaLastSignup", trimmed.email);
    setSuccess("Akun berhasil dibuat, silakan login.");
    setForm({ firstName: "", lastName: "", email: "", password: "" });

    setTimeout(() => navigate("/login", { replace: true }), 1000);
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen flex flex-col md:flex-row font-poppins bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative pt-16 sm:pt-20 md:pt-0"
    >
      <div className="absolute right-3 top-2 z-20 flex items-center gap-2 sm:right-4 sm:top-4 md:right-6 md:top-6">
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white/90 text-slate-700 text-sm font-semibold shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800"
          aria-label={`Switch language to ${languageTarget}`}
        >
          {languageToggleLabel}
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label={themeToggleLabel}
        >
          {theme === "light" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 4a1 1 0 0 1 1 1v1.07a6 6 0 0 1 4.93 4.93H19a1 1 0 1 1 0 2h-1.07A6 6 0 0 1 13 17.93V19a1 1 0 1 1-2 0v-1.07A6 6 0 0 1 6.07 13H5a1 1 0 0 1 0-2h1.07A6 6 0 0 1 11 6.07V5a1 1 0 0 1 1-1m0-2a3 3 0 0 0-3 3c0 .34.03.67.09.99A8.01 8.01 0 0 0 3 11a1 1 0 0 0 0 2a8.01 8.01 0 0 0 6.09 5.01c-.06.32-.09.65-.09.99a3 3 0 0 0 6 0c0-.34-.03-.67-.09-.99A8.01 8.01 0 0 0 21 13a1 1 0 0 0 0-2a8.01 8.01 0 0 0-6.09-5.01A6.8 6.8 0 0 0 15 5a3 3 0 0 0-3-3z"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0 0 20a9.7 9.7 0 0 0 5.19-1.5a1 1 0 0 0-.54-1.86a7 7 0 0 1-5.65-11.05a1 1 0 0 0-1.59-1.18A9.96 9.96 0 0 0 12 2z"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Bagian kiri: Slideshow */}
      <div className="hidden md:flex md:w-1/2 h-screen relative overflow-hidden">
        <img
          src={images[currentIndex]}
          alt="Slideshow"
          className="absolute w-full h-full object-cover"
        />

        {/* Logo + Brand di pojok kiri atas */}
        <div className="absolute top-6 left-6 flex items-center space-x-3">
          <img src="/NesabaLearnLogo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-bold bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] bg-clip-text text-transparent">
            NesabaLearn
          </span>
        </div>

        {/* Dot Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bagian kanan: Card Register */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8"
      >
        <div className="w-full max-w-md">
          {/* Header Form */}
          <div className="mb-8 text-center">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] bg-clip-text text-transparent">
              {authCopy.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              {authCopy.subtitle}
            </p>
          </div>

          {/* Form Register */}
          <form onSubmit={handleSubmit}>
            {error && <p className="mb-4 text-sm text-red-600 text-center">{error}</p>}
            {success && <p className="mb-4 text-sm text-emerald-600 text-center">{success}</p>}
            <div className="mb-5">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {authCopy.firstNameLabel}
              </label>
              <input
                type="text"
                placeholder={authCopy.firstNamePlaceholder}
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-gray-800 dark:text-white transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {authCopy.lastNameLabel}
              </label>
              <input
                type="text"
                placeholder={authCopy.lastNamePlaceholder}
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB00FF] dark:bg-gray-800 dark:text-white transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {authCopy.emailLabel}
              </label>
              <input
                type="email"
                placeholder={authCopy.emailPlaceholder}
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-gray-800 dark:text-white transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {authCopy.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={authCopy.passwordPlaceholder}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB00FF] dark:bg-gray-800 dark:text-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
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
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] hover:opacity-90 transition-all duration-300"
            >
              {authCopy.submit}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            {authCopy.footer}{" "}
            <Link
              to="/login"
              className="font-semibold bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] bg-clip-text text-transparent hover:opacity-80 transition"
            >
              {authCopy.footerLink}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
