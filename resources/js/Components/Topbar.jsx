import { useEffect, useRef, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const defaultUser = { name: "Muhammad Nasrulloh", avatar: "/avatar.png" };
const resolveAvatarSrc = (candidate) => {
  if (!candidate) return "/avatar.png";
  if (candidate.startsWith("http") || candidate.startsWith("/")) return candidate;
  return `/storage/${candidate}`;
};

export default function Topbar({
  user = defaultUser,
  theme: themeProp,
  onToggleSidebar = () => {},
  sidebarCollapsed = false,
  onToggleTheme,
  variant = "admin",
}) {
  const { props } = usePage();
  const authUser = props?.auth?.user;
  const { theme: ctxTheme, toggleTheme } = useTheme();
  const theme = themeProp ?? ctxTheme ?? "dark";
  const handleThemeToggle = onToggleTheme || toggleTheme || (() => {});
  const { language, toggleLanguage, adminCopy } = useLanguage();
  const topbarCopy = adminCopy.topbar;

  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(authUser || user);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    setProfile(authUser || user);
  }, [authUser, user]);

  const displayName = profile.fullName || profile.name || defaultUser.name;
  const avatarSrc = resolveAvatarSrc(profile.avatar_url || profile.avatar || defaultUser.avatar);
  const basePath = variant === "user" ? "/user" : "/admin";
  const roleLabel =
    (profile?.role || "").toLowerCase() === "admin"
      ? topbarCopy.adminLabel
      : topbarCopy.userLabel;

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("nesabaActiveUser");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
    router.post("/logout", {}, {
      onFinish: () => {
        window.location.href = "/";
      },
    });
  };

  const headerClass =
    theme === "light"
      ? "bg-white/95 border-slate-200 shadow-sm"
      : "bg-slate-900/70 border-slate-800";

  return (
    <header className={`sticky top-0 z-40 backdrop-blur transition-colors ${headerClass}`}>
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
              theme === "light"
                ? "border-slate-200 text-slate-600 hover:bg-slate-100"
                : "border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
          </button>
          <span className="hidden md:inline">{roleLabel}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className={`inline-flex h-9 px-3 items-center justify-center rounded-full border text-xs font-semibold shadow-sm transition ${
              theme === "light"
                ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            }`}
            aria-label={topbarCopy.languageToggleAria}
          >
            {language === "id" ? "EN" : "ID"}
          </button>
          <button
            type="button"
            onClick={handleThemeToggle}
            className={`hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition ${
              theme === "light"
                ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            }`}
            aria-label={theme === "dark" ? topbarCopy.themeToggleToLight : topbarCopy.themeToggleToDark}
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

          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex items-center gap-3 rounded-full pl-2 pr-3 py-1.5 transition ${
                theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-800"
              }`}
            >
              <img src={avatarSrc} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              <span className="hidden sm:block font-medium">{displayName}</span>
              <svg width="18" height="18" viewBox="0 0 20 20" className="text-slate-500">
                <path fill="currentColor" d="M5 7l5 6 5-6z" />
              </svg>
            </button>

            {open && (
              <div
                className={`absolute right-0 mt-2 w-56 rounded-xl border p-2 shadow-lg ${
                  theme === "light"
                    ? "border-slate-200 bg-white"
                    : "border-slate-800 bg-slate-900"
                }`}
              >
                <Link
                  href={`${basePath}/profile`}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition ${
                    theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-800"
                  }`}
                >
                  {topbarCopy.profile}
                </Link>
                <Link
                  href={`${basePath}/change-password`}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition ${
                    theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-800"
                  }`}
                >
                  {topbarCopy.changePassword}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                    theme === "light" ? "hover:bg-slate-100" : "hover:bg-slate-800"
                  }`}
                >
                  {topbarCopy.settings}
                </button>
                <div className={`my-1 border-t ${theme === "light" ? "border-slate-200" : "border-slate-800"}`} />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                >
                  {topbarCopy.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
