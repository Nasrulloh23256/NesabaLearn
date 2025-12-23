import { motion } from "framer-motion";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useThemeMode } from "../../hooks/useThemeMode";

export default function Login({ status, canResetPassword }) {
  const images = ["/login1.jpeg", "/login2.jpeg", "/login3.jpeg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const { copy, language, toggleLanguage } = useLanguage();
  const authCopy = copy.auth?.login ?? {};
  const [showPassword, setShowPassword] = useState(false);
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
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setData(name, type === "checkbox" ? checked : value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    post("/login", {
      onFinish: () => reset("password"),
    });
  };

  const formError = errors.email || errors.password;

  return (
    <>
      <Head title="Login" />
      <div
        data-theme={theme}
        className="min-h-screen flex flex-col md:flex-row font-poppins bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 relative"
      >
        <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
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
        <div className="hidden md:flex md:w-1/2 h-screen relative overflow-hidden">
          <img
            src={images[currentIndex]}
            alt="Slideshow"
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950/10 opacity-0 dark:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-6 left-6 flex items-center space-x-3">
            <img src="/NesabaLearnLogo.png" alt="Logo" className="w-10 h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] bg-clip-text text-transparent">
              NesabaLearn
            </span>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white text-slate-900 w-full md:w-1/2 flex items-center justify-center p-8 border-l border-slate-200 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800"
        >
          <div className="w-full max-w-lg text-base">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-300 to-fuchsia-400 bg-clip-text text-transparent">
                {authCopy.title}
              </h1>
              <p className="mt-3 text-slate-400 text-base md:text-lg">
                {authCopy.subtitle}
              </p>
            </div>

            {status && (
              <p className="mb-4 text-base text-emerald-600 text-center dark:text-emerald-400">
                {status}
              </p>
            )}
            {formError && (
              <p className="mb-4 text-base text-rose-600 text-center dark:text-rose-300">
                {formError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-base dark:text-slate-200">
                  {authCopy.emailLabel}
                </label>
                <input
                  type="email"
                  placeholder={authCopy.emailPlaceholder}
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 text-base rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/70 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                  autoComplete="username"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-slate-700 font-semibold text-base dark:text-slate-200">
                    {authCopy.passwordLabel}
                  </label>
                  {canResetPassword && (
                    <Link
                      href="/forgot-password"
                      className="relative text-sm font-semibold text-sky-600 hover:text-sky-500 after:content-[''] after:block after:w-full after:h-[2px] after:bg-slate-300/70 after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 hover:after:bg-gradient-to-r hover:after:from-[#04BBFD] hover:after:to-[#FB00FF] dark:text-sky-300 dark:hover:text-sky-200 dark:after:bg-slate-600/60"
                    >
                      {authCopy.forgotPassword}
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={authCopy.passwordPlaceholder}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 pr-12 text-base rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/70 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                    autoComplete="current-password"
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
                disabled={processing}
                className="w-full py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] hover:opacity-90 transition-all duration-300 disabled:opacity-60 shadow-lg shadow-sky-500/10"
              >
                {authCopy.submit}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-400 text-base">
              {authCopy.footer}{" "}
              <Link
                href="/register"
                className="font-semibold text-sky-300 hover:text-sky-200"
              >
                {authCopy.footerLink}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
