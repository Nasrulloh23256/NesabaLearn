import { useEffect, useState } from "react";
import { useNavigate } from "@/router";
import { motion } from "framer-motion";
import { useForm, usePage } from "@inertiajs/react";
import UserLayout from "../../../Layouts/UserLayout";
import { useLanguage } from "../../../context/LanguageContext";

const gradientButton =
  "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#04BBFD] to-[#FB00FF] px-5 py-2.5 font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#04BBFD]/60 focus:ring-offset-transparent";

const resolveAvatarSrc = (candidate) => {
  if (!candidate) return "/avatar.png";
  if (candidate.startsWith("http") || candidate.startsWith("/")) return candidate;
  return `/storage/${candidate}`;
};

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const user = props?.auth?.user;
  const { adminCopy } = useLanguage();
  const profileCopy = adminCopy.profilePage;
  const [avatarPreview, setAvatarPreview] = useState(
    resolveAvatarSrc(user?.avatar_url || user?.avatar)
  );
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("success");

  const { data, setData, post, processing, errors, reset } = useForm({
    name: user?.name || "",
    email: user?.email || "",
    avatar: null,
  });

  useEffect(() => {
    setData("name", user?.name || "");
    setData("email", user?.email || "");
    setAvatarPreview(resolveAvatarSrc(user?.avatar_url || user?.avatar));
  }, [user?.name, user?.email, user?.avatar, user?.avatar_url, setData]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setData("avatar", file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage(profileCopy.notFound);
      setMessageTone("error");
      return;
    }

    post("/user/profile", {
      forceFormData: true,
      onSuccess: () => {
        setMessage(profileCopy.success);
        setMessageTone("success");
        reset("avatar");
      },
      onError: () => {
        setMessage(profileCopy.error);
        setMessageTone("error");
      },
    });
  };

  return (
    <UserLayout>
      <motion.form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-3xl space-y-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{profileCopy.title}</h1>
            <p className="mt-1 text-slate-500 max-w-md">{profileCopy.description}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 sm:w-auto"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M11.67 3.87L9.9 2.1L0 12l9.9 9.9l1.77-1.77L3.54 12z"
                />
              </svg>
              {profileCopy.back}
            </button>
            <button
              type="submit"
              className={`${gradientButton} w-full justify-center sm:w-auto`}
              disabled={processing}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
              </svg>
              {profileCopy.save}
            </button>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-1 flex-col gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  {profileCopy.nameLabel}
                </label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={(event) => setData("name", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={profileCopy.namePlaceholder}
                />
                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                  {profileCopy.emailLabel}
                </label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(event) => setData("email", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FB00FF] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  placeholder={profileCopy.emailPlaceholder}
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-4 md:max-w-xs">
              <div className="relative h-36 w-36 overflow-hidden rounded-3xl border-4 border-slate-200 shadow-lg sm:h-40 sm:w-40 dark:border-slate-800">
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-center">
                <input
                  id="user-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="user-avatar" className={`${gradientButton} w-full justify-center sm:w-auto`}>
                  {profileCopy.chooseFile}
                </label>
                <p className="mt-2 text-xs text-slate-400">{profileCopy.fileHint}</p>
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              messageTone === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/user/change-password")}
            className={`${gradientButton} w-full justify-center sm:w-auto`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 1a5 5 0 0 1 5 5v1h1a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v1h6V6a3 3 0 0 0-3-3z"
              />
            </svg>
            {profileCopy.passwordCta}
          </button>
        </div>
      </motion.form>
    </UserLayout>
  );
}
