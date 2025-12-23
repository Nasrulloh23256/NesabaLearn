import { useState } from "react";
import { Link, useNavigate } from "@/router";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { useForm, usePage } from "@inertiajs/react";

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";

const materialTypes = [
  { value: "content", label: { id: "Konten", en: "Content" } },
  { value: "video", label: { id: "Video", en: "Video" } },
];

const toolbarItems = ["B", "I", "U", "*", "1.", '"', "</>", "fx", "link", "img"];

export default function MeetingMaterialCreatePage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const meeting = props?.meeting;
  const { adminCopy, language } = useLanguage();
  const { common, materialForm } = adminCopy;
  const description = materialForm.description.replace("{{title}}", meeting?.title || "");

  const { data, setData, post, processing, errors } = useForm({
    type: materialTypes[0].value,
    name: "",
    content: "",
    video: null,
  });
  const [videoFile, setVideoFile] = useState(null);

  if (!meeting) {
    return (
      <AdminLayout>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          Pertemuan tidak ditemukan.
          <button onClick={() => navigate(-1)} className="ml-4 text-sm font-semibold text-rose-600 underline">
            {common.back}
          </button>
        </div>
      </AdminLayout>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(name, value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setVideoFile(file);
    setData("video", file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    post(`/admin/meetings/${meeting.id}/materials`, {
      forceFormData: true,
      onSuccess: () => {
        navigate(`/admin/meetings/${meeting.id}`);
      },
    });
  };

  const isContentType = data.type === "content";

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/admin"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M12 3L3 10.5V12h1v9h6v-5h4v5h6v-9h1v-1.5z" />
            </svg>
          </Link>
          <span>&gt;</span>
          <Link to="/admin/meetings" className="hover:text-slate-700 dark:hover:text-slate-200">
            {common.meetings}
          </Link>
          <span>&gt;</span>
          <Link to={`/admin/meetings/${meeting.id}`} className="hover:text-slate-700 dark:hover:text-slate-200">
            {adminCopy.meetingDetail?.pageTitle || "Detail Pertemuan"}
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{materialForm.title}</span>
        </nav>

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{materialForm.title}</h1>
          <p className="text-slate-500 dark:text-slate-300">{description}</p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {materialForm.typeLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select name="type" value={data.type} onChange={handleChange} className={`${inputBase} appearance-none`}>
                {materialTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label[language] || type.label.id}
                  </option>
                ))}
              </select>
              {errors.type && <p className="mt-2 text-xs text-rose-500">{errors.type}</p>}
              <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-slate-400 dark:text-slate-500">
                <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill="currentColor" d="M5 7l5 6 5-6z" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {materialForm.nameLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder={materialForm.nameLabel}
              className={inputBase}
              required
            />
            {errors.name && <p className="mt-2 text-xs text-rose-500">{errors.name}</p>}
          </div>

          {isContentType ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {materialForm.contentLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">
                  {toolbarItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="rounded-lg border border-transparent px-2 py-1 hover:border-slate-300 dark:hover:border-slate-600"
                      title={item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <textarea
                  name="content"
                  value={data.content}
                  onChange={handleChange}
                  rows={8}
                  placeholder={materialForm.contentLabel}
                  className="block w-full resize-none rounded-b-2xl bg-transparent px-4 py-3 text-sm text-slate-900 focus:outline-none dark:text-slate-100"
                  required
                />
                {errors.content && <p className="mt-2 text-xs text-rose-500">{errors.content}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {materialForm.videoLabel} <span className="text-rose-500">*</span>
              </label>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <label
                  htmlFor="material-video"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100"
                >
                  <span>{materialForm.chooseFile}</span>
                  <input
                    id="material-video"
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  {videoFile ? videoFile.name : materialForm.noFile}
                </p>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{materialForm.formatHint}</p>
                {errors.video && <p className="mt-2 text-xs text-rose-500">{errors.video}</p>}
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {materialForm.back}
          </button>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            disabled={processing}
          >
            {materialForm.submit}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
