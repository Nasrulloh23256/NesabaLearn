import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { useLanguage } from "../context/LanguageContext.jsx";


export default function App() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const { copy, language, toggleLanguage } = useLanguage();
  const { brandName, nav, hero, overview, howItWorks, availability, features, footer } = copy;
  const languageToggleLabel = language === "id" ? "EN" : "ID";
  const languageTarget = language === "id" ? "English" : "Bahasa Indonesia";
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const getInitialTheme = useMemo(
    () => () => {
      if (typeof window === "undefined") return "dark";
      const stored = window.localStorage.getItem("nesabaTheme");
      if (stored === "light" || stored === "dark") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    [],
  );
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }
    window.localStorage.setItem("nesabaTheme", theme);
  }, [theme]);

  return (
    <div
      data-theme={theme}
      className="font-poppins text-[16px] sm:text-[17px] md:text-[18px] text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300"
    >
    {/* Navbar */}

<header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-md font-poppins transition-all duration-300 border-b border-slate-200/70 dark:border-slate-800/80">
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-4">
    
    {/* Logo */}
    <div className="flex items-center space-x-2">
      <img
        src="/NesabaLearnLogo.png"
        alt="NesabaLearn Logo"
        className="h-8 w-8 sm:h-10 sm:w-10"
      />
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] bg-clip-text text-transparent sm:text-3xl">
        {brandName}
      </h1>
    </div>

    {/* Button Section */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={toggleLanguage}
        className="px-3 py-1.5 border border-sky-500 text-sky-600 rounded-full font-semibold transition hover:bg-sky-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900/60 text-sm sm:px-4 sm:py-2 sm:text-base"
        aria-label={`${nav.languageToggle} ${languageTarget}`}
      >
        {languageToggleLabel}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:h-10 sm:w-10"
        aria-label={theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
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
      {/* Tombol Login */}
      <Link
        href="/login"
        className="relative px-4 py-1.5 text-sky-600 rounded-full transition-all duration-300 ease-out overflow-hidden group font-semibold text-sm sm:px-5 sm:py-2 sm:text-base"
      >
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-[3px] border-transparent bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] p-[2px]">
          <div className="absolute inset-0 bg-white dark:bg-slate-950 rounded-full"></div>
        </div>
        <span className="relative z-10">{nav.login}</span>
      </Link>

      {/* Tombol Sign Up */}
      <Link
        href="/register"
        className="px-4 py-1.5 bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] text-white rounded-full hover:opacity-90 transition-all duration-300 font-semibold text-sm sm:px-5 sm:py-2 sm:text-base"
      >
        {nav.signUp}
      </Link>
    </div>
  </div>
</header>



      {/* Hero Section */}
      <section className="text-center pt-28 pb-16 px-4 sm:px-6 sm:pt-32 sm:pb-24 bg-white dark:bg-slate-950 min-h-screen flex flex-col justify-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.h2 
            variants={slideUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-blue-700 via-fuchsia-600 to-pink-500 bg-clip-text text-transparent mb-6"
          >
            {hero.title.map((line, index) => (
              <React.Fragment key={`${line}-${index}`}>
                {line}
                {index === hero.title.length - 1 ? null : <br />}
              </React.Fragment>
            ))}
          </motion.h2>
          
          <motion.p
            variants={fadeIn}
            className="mt-6 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-slate-600 dark:text-slate-300 mb-8"
          >
            {hero.description}
          </motion.p>
          
          <Link href="/login">
  <motion.button
    variants={fadeIn}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mt-6 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white rounded-full text-base sm:text-lg hover:opacity-90 transition"
  >
    {hero.cta}
  </motion.button>
</Link>

        </motion.div>
      </section>

    {/* Gambar utama */}
<section className="flex justify-center py-8 px-4 sm:py-10 sm:px-8">
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
    className="mt-6 lg:mt-0 lg:w-[85%] relative overflow-hidden rounded-3xl shadow-lg group"
  >
    <motion.img
      src="/landing1.jpg"
      alt={hero.imageAlt}
      className="w-full h-[260px] sm:h-[360px] md:h-[500px] object-cover rounded-3xl transition-all duration-700 ease-out group-hover:shadow-[0_10px_30px_rgba(4,187,253,0.25)]"
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { type: 'spring', stiffness: 120, damping: 12 },
      }}
    />
  </motion.div>
</section>


      {/* Deskripsi */}
      <section className="text-center py-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-semibold mb-3">
            {overview.title}
          </h3>
          <p className="max-w-3xl mx-auto text-slate-600 dark:text-slate-300 mb-5">
            {overview.description}
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-full hover:opacity-90 transition"
          >
            {overview.cta}
          </Link>
        </motion.div>
      </section>

      {/* Cara Menggunakan */}
      <section className="py-14 px-4 sm:py-16 sm:px-8 text-center bg-gradient-to-b from-[#04BBFD]/30 via-[#04BBFD]/10 to-[#A5A5A5]/30 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 sm:mb-10 text-sky-700 dark:text-sky-200">
            {howItWorks.title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            {howItWorks.description}
          </p>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
          >
            {howItWorks.steps.map((item, i) => (
              <motion.div
                key={i}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow hover:shadow-md transition"
                variants={fadeIn}
                whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

    {/* Fitur 24/7 */}
<section className="py-14 px-4 sm:py-20 sm:px-8 bg-gradient-to-b from-[#04BBFD]/30 via-[#04BBFD]/10 to-[#A5A5A5]/30 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950 grid md:grid-cols-2 gap-8 sm:gap-10 items-center max-w-6xl mx-auto rounded-3xl mt-8 sm:mt-10 mb-16 sm:mb-20">
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-700 dark:text-sky-200 mb-4">
      {availability.title}
    </h3>
    <p className="text-slate-700 dark:text-slate-300 mb-6">
      {availability.description}
    </p>
    
    <Link
      href="/register"
      className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white rounded-full hover:opacity-90 transition"
    >
      {availability.cta}
    </Link>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <img
      src="/landing2.jpg"
      alt={availability.imageAlt}
      className="rounded-2xl shadow-lg w-full transform transition-transform duration-500 hover:-translate-y-1 hover:scale-[1.01]"
    />
  </motion.div>
</section>


{/* Fitur-fitur */}
<section className="py-14 px-4 sm:py-16 sm:px-8 bg-gradient-to-b from-white to-sky-50 dark:from-slate-950 dark:to-slate-900 font-poppins">
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-center"
    initial="hidden"
    whileInView="visible"
    variants={{
      visible: { transition: { staggerChildren: 0.15 } },
    }}
    viewport={{ once: true }}
  >
    {features.map((item, i) => (
      <motion.div
        key={i}
        className="relative p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-md overflow-hidden transition-all duration-300 ease-out group"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        whileHover={{ scale: 1.05, y: -8 }}
      >
        {/* Gradient Outline hanya saat hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-[4px] border-transparent bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] p-[3px]">
          <div className="absolute inset-0 bg-white dark:bg-slate-950 rounded-2xl"></div>
        </div>

        {/* Konten */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-5xl mb-4">{item.icon}</div>
          <h4 className="font-bold text-lg mb-3 text-sky-700 dark:text-sky-200 tracking-wide">
            {item.title}
          </h4>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    ))}
  </motion.div>
</section>





      {/* Footer */}
      <footer className="bg-sky-950 text-white py-10 px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-sm">
            {footer.columns.map((column) => (
              <div key={column.heading}>
                <h5 className="font-bold mb-2">{column.heading}</h5>
                <ul className="space-y-1">
                  {column.items.map((item, index) => (
                    <li key={`${column.heading}-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center text-xs mt-8 text-gray-400">
            {footer.copyright}
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
