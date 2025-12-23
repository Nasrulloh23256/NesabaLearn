import { useEffect, useMemo, useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import { ThemeContext } from "../context/ThemeContext";

export default function UserLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const handleCloseMobileSidebar = () => setMobileSidebarOpen(false);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const sidebarOffset = sidebarCollapsed ? "md:pl-20" : "md:pl-64";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: handleToggleTheme }}>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
        }`}
        data-theme={theme}
      >
        <div className="flex">
          <Sidebar
            collapsed={sidebarCollapsed}
            theme={theme}
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={handleCloseMobileSidebar}
            variant="user"
          />
          <main className={`flex-1 min-w-0 transition-[padding] duration-300 ${sidebarOffset}`}>
            <Topbar
              theme={theme}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={handleToggleSidebar}
              onToggleTheme={handleToggleTheme}
              variant="user"
            />
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
