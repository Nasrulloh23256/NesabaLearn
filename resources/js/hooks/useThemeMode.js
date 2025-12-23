import { useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "nesabaTheme";

export const useThemeMode = () => {
  const getInitialTheme = useMemo(
    () => () => {
      if (typeof window === "undefined") return "dark";
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
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
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
