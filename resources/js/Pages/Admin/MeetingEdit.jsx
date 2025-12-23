import { useRef } from "react";
import { Link, useNavigate } from "@/router";
import AdminLayout from "../../Layouts/AdminLayout";
import { useLanguage } from "../../context/LanguageContext";
import { useForm, usePage } from "@inertiajs/react";

const meetingTypeOptions = [
  { value: "Artikel", label: { id: "Artikel", en: "Article" } },
  { value: "Editorial", label: { id: "Editorial", en: "Editorial" } },
];

const inputBase =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#04BBFD] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100";
const pickerBase =
  "relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100";

const PickerField = ({ label, name, type, value, placeholder, required, onChange }) => {
  const inputRef = useRef(null);
  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") el.showPicker();
    else el.focus();
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative rounded-2xl" onClick={openPicker}>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          ref={inputRef}
          onFocus={openPicker}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
        <div className={`${pickerBase} ${value ? "" : "text-slate-400 dark:text-slate-500"}`}>
          <span>{value || placeholder}</span>
          <span className="pointer-events-none text-slate-400 dark:text-slate-500">
            {type === "date" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2zm12 8H5v10h14zm0-2V6H5v2z"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 1a11 11 0 1 1-11 11A11 11 0 0 1 12 1m0 2a9 9 0 1 0 9 9a9 9 0 0 0-9-9m.5 4h-1v6l4.75 2.85l.5-.84l-4.25-2.51z"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function MeetingEditPage() {
  const navigate = useNavigate();
  const { props } = usePage();
  const meeting = props?.meeting;
  const { adminCopy, language } = useLanguage();
  const { common, meetingForm } = adminCopy;
  const formCopy = meetingForm.edit;

  const { data, setData, put, processing, errors } = useForm({
    title: meeting?.title || "",
    meeting_url: meeting?.meeting_url || meeting?.url || "",
    type: meeting?.type || meetingTypeOptions[0].value,
    meeting_date: meeting?.meeting_date || meeting?.date || "",
    start_time: meeting?.start_time || meeting?.start || "",
    end_time: meeting?.end_time || meeting?.end || "",
    description: meeting?.description || "",
  });

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

  const handleSubmit = (event) => {
    event.preventDefault();
    put(`/admin/meetings/${meeting.id}`, {
      onSuccess: () => {
        navigate(`/admin/meetings/${meeting.id}`);
      },
    });
  };

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
          <span className="font-medium text-slate-700 dark:text-slate-100">{formCopy.title}</span>
        </nav>

        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{formCopy.title}</h1>
          <p className="text-slate-500 dark:text-slate-300">{formCopy.description}</p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/70 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {meetingForm.fields.title} <span className="text-rose-500">*</span>
              </label>
              <input
                name="title"
                value={data.title}
                onChange={handleChange}
                placeholder={meetingForm.placeholders.title}
                required
                className={inputBase}
              />
              {errors.title && <p className="mt-2 text-xs text-rose-500">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {meetingForm.fields.type} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select name="type" value={data.type} onChange={handleChange} className={`${inputBase} appearance-none`}>
                  {meetingTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label[language] || option.value}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="mt-2 text-xs text-rose-500">{errors.type}</p>}
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
                    <path fill="currentColor" d="M5 7l5 6 5-6z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
                {meetingForm.fields.url}
              </label>
              <input
                name="meeting_url"
                value={data.meeting_url}
                onChange={handleChange}
                placeholder={meetingForm.placeholders.url}
                className={inputBase}
              />
              {errors.meeting_url && <p className="mt-2 text-xs text-rose-500">{errors.meeting_url}</p>}
            </div>
            <PickerField
              label={meetingForm.fields.date}
              name="meeting_date"
              type="date"
              value={data.meeting_date}
              placeholder={meetingForm.placeholders.date}
              required
              onChange={handleChange}
            />
            {errors.meeting_date && <p className="mt-2 text-xs text-rose-500">{errors.meeting_date}</p>}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <PickerField
              label={meetingForm.fields.start}
              name="start_time"
              type="time"
              value={data.start_time}
              placeholder={meetingForm.placeholders.start}
              required
              onChange={handleChange}
            />
            {errors.start_time && <p className="mt-2 text-xs text-rose-500">{errors.start_time}</p>}
            <PickerField
              label={meetingForm.fields.end}
              name="end_time"
              type="time"
              value={data.end_time}
              placeholder={meetingForm.placeholders.end}
              required
              onChange={handleChange}
            />
            {errors.end_time && <p className="mt-2 text-xs text-rose-500">{errors.end_time}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {meetingForm.fields.description}
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              rows={5}
              placeholder={meetingForm.placeholders.description}
              className={`${inputBase} resize-none`}
            />
            {errors.description && <p className="mt-2 text-xs text-rose-500">{errors.description}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {meetingForm.fields.attachments}
            </label>
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <label
                htmlFor="edit-attachments"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100"
              >
                <span>{meetingForm.filePicker.button}</span>
                <input id="edit-attachments" type="file" multiple className="sr-only" />
              </label>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{meetingForm.filePicker.empty}</p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{meetingForm.attachmentHint}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
              {meetingForm.fields.materials}
            </label>
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <label
                htmlFor="edit-material"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100"
              >
                <span>{meetingForm.filePicker.button}</span>
                <input id="edit-material" type="file" className="sr-only" />
              </label>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{meetingForm.filePicker.empty}</p>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{meetingForm.materialHint}</p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          >
            {common.back}
          </button>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
            disabled={processing}
          >
            {formCopy.submit}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
