import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ meetings }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Pertemuan Saya</h2>}
        >
            <Head title="Pertemuan" />
            <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
                <p className="text-sm text-gray-600">
                    Tampilan ini hanya daftar sederhana. Pada tahap berikutnya
                    akan diganti dengan versi yang kaya desain seperti di
                    frontend React.
                </p>

                <div className="space-y-3">
                    {meetings?.map((meeting) => (
                        <div
                            key={meeting.id}
                            className="rounded-lg border bg-white p-4 shadow"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {meeting.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {meeting.meeting_date} • {meeting.type}
                                    </p>
                                </div>
                                <Link
                                    href={route(
                                        'user.meetings.show',
                                        meeting.id,
                                    )}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                                >
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    ))}

                    {meetings?.length === 0 && (
                        <div className="rounded-lg border border-dashed px-4 py-6 text-center text-gray-500">
                            Belum ada pertemuan terjadwal.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
