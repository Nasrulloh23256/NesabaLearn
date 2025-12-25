import { motion } from "framer-motion";
import { Link } from "@/router";
import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { useLanguage } from "../context/LanguageContext";
import { useThemeMode } from "../hooks/useThemeMode";

export default function ForgotPassword() {
  const images = ["/login1.jpeg", "/login2.jpeg", "/login3.jpeg"]; // ganti dengan gambar kamu
  const [currentIndex, setCurrentIndex] = useState(0);
  const { props } = usePage();
  const status = props?.status;
  const { copy, language, toggleLanguage } = useLanguage();
  const authCopy = copy.auth?.forgot ?? {};
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
  const { data, setData, post, processing, errors } = useForm({
    email: "",
  });

  // Auto ganti gambar tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

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

      {/* Bagian kanan: Card Forgot Password */}
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

          {/* Form Forgot Password */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              post("/forgot-password", {
                preserveScroll: true,
              });
            }}
          >
            {status && <p className="mb-4 text-sm text-emerald-600 text-center">{status}</p>}
            {errors.email && <p className="mb-4 text-sm text-red-600 text-center">{errors.email}</p>}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                {authCopy.emailLabel}
              </label>
              <input
                type="email"
                placeholder={authCopy.emailPlaceholder}
                value={data.email}
                onChange={(event) => setData("email", event.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-gray-800 dark:text-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3 font-semibold text-white rounded-lg bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] hover:opacity-90 transition-all duration-300"
            >
              {processing ? authCopy.submitBusy : authCopy.submit}
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
