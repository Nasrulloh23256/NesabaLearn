import { Link, usePage } from "@inertiajs/react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3L3 10.5V12h1v9h6v-5h4v5h6v-9h1v-1.5z"
      />
    </svg>
  ),
  meetings: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2zm12 8H5v10h14zm0-2V6H5v2z"
      />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 12a4 4 0 1 1 4-4a4 4 0 0 1-4 4m10 0a3 3 0 1 1 3-3a3 3 0 0 1-3 3M7 14a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6m10 1a5.5 5.5 0 0 0-2.5.6a7.7 7.7 0 0 1 1.6 4.4H23a5 5 0 0 0-6-5"
      />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0 2a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7"
      />
    </svg>
  ),
  password: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 1a5 5 0 0 0-5 5v4H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5m-3 9V6a3 3 0 0 1 6 0v4z"
      />
    </svg>
  ),
  chatbot: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m3 5h3v2H7zm5 0h5v2h-5z"
      />
    </svg>
  ),
};

const navVariants = {
  admin: [
    {
      key: "dashboard",
      to: "/admin",
      exact: true,
      icon: icons.dashboard,
      iconClass: "text-sky-400",
    },
    {
      key: "meetings",
      to: "/admin/meetings",
      icon: icons.meetings,
      iconClass: "text-indigo-400",
    },
    {
      key: "users",
      to: "/admin/users",
      icon: icons.users,
      iconClass: "text-fuchsia-400",
    },
    {
      key: "profile",
      to: "/admin/profile",
      icon: icons.profile,
      iconClass: "text-emerald-400",
    },
    {
      key: "password",
      to: "/admin/change-password",
      icon: icons.password,
      iconClass: "text-amber-400",
    },
  ],
  user: [
    {
      key: "meetings",
      to: "/user/meetings",
      icon: icons.meetings,
      iconClass: "text-sky-400",
    },
    {
      key: "profile",
      to: "/user/profile",
      icon: icons.profile,
      iconClass: "text-violet-400",
    },
    {
      key: "password",
      to: "/user/change-password",
      icon: icons.password,
      iconClass: "text-amber-400",
    },
    {
      key: "chatbot",
      to: "/user/chatbot",
      icon: icons.chatbot,
      iconClass: "text-cyan-400",
    },
  ],
};

const lightStyles = {
  aside: "bg-white/95 text-slate-700 border-r border-slate-200 shadow-sm",
  linkActive: "bg-slate-900 text-white shadow",
  linkIdle: "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
  footer: "text-slate-400",
};

const darkStyles = {
  aside: "bg-slate-900 text-white",
  linkActive: "bg-white text-slate-900 shadow",
  linkIdle: "text-slate-300 hover:text-white hover:bg-white/10",
  footer: "text-slate-400",
};

export default function Sidebar({
  collapsed = false,
  theme: themeProp,
  mobileOpen = false,
  onCloseMobile,
  variant = "admin",
}) {
  const { theme: ctxTheme } = useTheme();
  const { adminCopy } = useLanguage();
  const { url } = usePage();
  const sidebarCopy = adminCopy.sidebar;
  const navItems = navVariants[variant] || navVariants.admin;
  const theme = themeProp ?? ctxTheme ?? "dark";
  const styles = theme === "light" ? lightStyles : darkStyles;
  const widthClass = collapsed ? "md:w-20" : "md:w-64";
  const brandSpacing = collapsed ? "px-4 justify-center" : "px-5 justify-start";
  const labelClass = collapsed ? "hidden" : "block";
  const footerAlign = collapsed ? "text-center" : "text-left";

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/60 md:hidden"
          onClick={onCloseMobile}
          aria-label={sidebarCopy.close}
        />
      )}
      <aside
        className={`${
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 flex w-64"
            : "hidden md:flex md:fixed md:inset-y-0 md:left-0"
        } ${widthClass} shrink-0 flex-col ${styles.aside} min-h-screen transition-all duration-300`}
      >
        <div className="flex flex-col flex-1 bg-inherit">
          <div className={`py-6 flex items-center gap-3 ${brandSpacing}`}>
            <img src="/NesabaLearnLogo.png" alt="logo" className="w-9 h-9" />
            <span
              className={`${labelClass} text-lg font-bold bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] bg-clip-text text-transparent`}
            >
              NesabaLearn
            </span>
            {mobileOpen && (
              <button
                type="button"
                className="md:hidden ml-auto text-slate-400"
                onClick={onCloseMobile}
                aria-label={sidebarCopy.close}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <nav className={`${collapsed ? "px-2" : "px-3"} space-y-1`}>
            {navItems.map((link) => {
              const label = sidebarCopy.links[link.key] || link.key;
              const isActive = link.exact ? url === link.to : url.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  title={label}
                  onClick={onCloseMobile}
                  className={`flex items-center py-2.5 rounded-xl transition ${collapsed ? "justify-center px-3" : "gap-3 px-4"} ${
                    isActive ? styles.linkActive : styles.linkIdle
                  }`}
                >
                  <span aria-hidden="true" className={`text-lg ${link.iconClass || ""}`}>
                    {link.icon}
                  </span>
                  <span className={labelClass}>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className={`mt-auto p-4 text-xs ${styles.footer} ${footerAlign}`}>
            (c) {new Date().getFullYear()} NesabaLearn
          </div>
        </div>
      </aside>
    </>
  );
}
