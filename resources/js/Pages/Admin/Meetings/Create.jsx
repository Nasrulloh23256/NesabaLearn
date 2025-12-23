import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'Editorial',
        meeting_date: '',
        start_time: '',
        end_time: '',
        meeting_url: '',
        description: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.meetings.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Tambah Pertemuan</h2>}
        >
            <Head title="Tambah Pertemuan" />
            <div className="mx-auto max-w-3xl px-4 py-6">
                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-lg border bg-white p-6 shadow"
                >
                    <p className="text-sm text-gray-500">
                        Form sederhana ini hanya untuk memastikan pipeline
                        backend bekerja. Silakan gantikan dengan UI final saat
                        React frontend dipindahkan ke Inertia.
                    </p>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Judul
                        </label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Tipe
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData('type', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="Editorial">Editorial</option>
                                <option value="Artikel">Artikel</option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Tanggal
                            </label>
                            <input
                                type="date"
                                value={data.meeting_date}
                                onChange={(e) =>
                                    setData('meeting_date', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.meeting_date && (
                                <p className="text-sm text-red-600">
                                    {errors.meeting_date}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Waktu Mulai
                            </label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) =>
                                    setData('start_time', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.start_time && (
                                <p className="text-sm text-red-600">
                                    {errors.start_time}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Waktu Selesai
                            </label>
                            <input
                                type="time"
                                value={data.end_time}
                                onChange={(e) =>
                                    setData('end_time', e.target.value)
                                }
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {errors.end_time && (
                                <p className="text-sm text-red-600">
                                    {errors.end_time}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            URL Meeting
                        </label>
                        <input
                            type="url"
                            value={data.meeting_url}
                            onChange={(e) =>
                                setData('meeting_url', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.meeting_url && (
                            <p className="text-sm text-red-600">
                                {errors.meeting_url}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:opacity-50"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
