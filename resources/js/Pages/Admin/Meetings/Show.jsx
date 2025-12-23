import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ meeting }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">
                        Detail Pertemuan: {meeting.title}
                    </h2>
                    <Link
                        href={route('admin.meetings.edit', meeting.id)}
                        className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Edit
                    </Link>
                </div>
            }
        >
            <Head title={`Pertemuan - ${meeting.title}`} />
            <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <section className="rounded-lg border bg-white p-6 shadow">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Tipe
                            </dt>
                            <dd className="text-lg font-semibold text-gray-900">
                                {meeting.type}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Tanggal
                            </dt>
                            <dd className="text-lg font-semibold text-gray-900">
                                {meeting.meeting_date}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Waktu
                            </dt>
                            <dd className="text-lg font-semibold text-gray-900">
                                {meeting.start_time} - {meeting.end_time}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">
                                Link
                            </dt>
                            <dd className="text-lg font-semibold text-indigo-600">
                                {meeting.meeting_url || '-'}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        <dt className="text-sm font-medium text-gray-500">
                            Deskripsi
                        </dt>
                        <dd className="mt-2 whitespace-pre-line text-gray-700">
                            {meeting.description || 'Belum ada deskripsi.'}
                        </dd>
                    </div>
                </section>

                <section className="rounded-lg border bg-white p-6 shadow">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Lampiran & Materi
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Data materi, lampiran, assignment, dan absensi sudah
                        disediakan melalui relasi. Gunakan data ini ketika UI
                        final siap.
                    </p>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
