import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Show({ meeting }) {
    const { flash } = usePage().props;
    const attendanceForm = useForm({});
    const assignmentForm = useForm({
        description: '',
        file: null,
    });

    const submitAttendance = (e) => {
        e.preventDefault();
        attendanceForm.post(
            route('user.meetings.attendance', meeting.id),
            {
                preserveScroll: true,
            },
        );
    };

    const submitAssignment = (e) => {
        e.preventDefault();
        assignmentForm.post(
            route('user.meetings.assignments', meeting.id),
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold">
                    Detail Pertemuan - {meeting.title}
                </h2>
            }
        >
            <Head title={`Pertemuan ${meeting.title}`} />
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <section className="rounded-lg border bg-white p-6 shadow">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Informasi Meeting
                    </h3>
                    <dl className="mt-4 space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                            <dt className="font-medium">Tanggal</dt>
                            <dd>{meeting.meeting_date}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-medium">Waktu</dt>
                            <dd>
                                {meeting.start_time} - {meeting.end_time}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-medium">Tipe</dt>
                            <dd>{meeting.type}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="font-medium">Link</dt>
                            <dd>{meeting.meeting_url || '-'}</dd>
                        </div>
                    </dl>

                    <p className="mt-4 whitespace-pre-line text-gray-700">
                        {meeting.description || 'Belum ada deskripsi.'}
                    </p>
                </section>

                <section className="rounded-lg border bg-white p-6 shadow space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Absensi
                        </h3>
                    </div>
                    <form onSubmit={submitAttendance}>
                        <button
                            type="submit"
                            disabled={attendanceForm.processing}
                            className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
                        >
                            Tandai Hadir
                        </button>
                    </form>
                </section>

                <section className="rounded-lg border bg-white p-6 shadow">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Pengumpulan Tugas
                    </h3>
                    <form className="mt-4 space-y-3" onSubmit={submitAssignment}>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                Deskripsi
                            </label>
                            <textarea
                                value={assignmentForm.data.description}
                                onChange={(e) =>
                                    assignmentForm.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                rows={3}
                                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            {assignmentForm.errors.description && (
                                <p className="text-sm text-red-600">
                                    {assignmentForm.errors.description}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">
                                File Tugas
                            </label>
                            <input
                                type="file"
                                onChange={(e) =>
                                    assignmentForm.setData(
                                        'file',
                                        e.target.files[0],
                                    )
                                }
                                className="mt-1 w-full text-sm text-gray-700"
                            />
                            {assignmentForm.errors.file && (
                                <p className="text-sm text-red-600">
                                    {assignmentForm.errors.file}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={assignmentForm.processing}
                            className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50"
                        >
                            Kumpulkan Tugas
                        </button>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
