import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ meetings }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Kelola Pertemuan</h2>
                    <Link
                        href={route('admin.meetings.create')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                    >
                        Tambah Pertemuan
                    </Link>
                </div>
            }
        >
            <Head title="Pertemuan" />
            <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
                <p className="text-sm text-gray-600">
                    Sementara ini hanya tampilan sederhana agar alur backend
                    dapat diuji. Nantinya diganti menggunakan komponen lengkap
                    dari frontend React yang sudah ada.
                </p>

                <div className="overflow-hidden rounded-lg border bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 text-left font-semibold text-gray-700">
                            <tr>
                                <th className="px-4 py-3">Judul</th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3">Tipe</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {meetings?.data?.map((meeting) => (
                                <tr key={meeting.id}>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {meeting.title}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {meeting.meeting_date}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {meeting.type}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={route(
                                                'admin.meetings.show',
                                                meeting.id,
                                            )}
                                            className="text-indigo-600 hover:text-indigo-500"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {meetings?.data?.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        Belum ada pertemuan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
