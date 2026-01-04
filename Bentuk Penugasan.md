# 3.2 Bentuk Penugasan Sebelum Rebuild

Sebagai mahasiswa pelaksana Program Asistensi Mengajar, peran utama saya dalam proyek pengembangan LMS NesabaLearn tidak hanya terbatas pada aspek teknis pengembangan sistem, tetapi juga mencakup serangkaian penugasan yang terintegrasi dengan kebutuhan sekolah mitra, khususnya dalam mendukung peningkatan kompetensi guru dalam penulisan dan publikasi artikel ilmiah. Dalam proyek ini, saya Muhammad Nasrulloh berperan sebagai Backend Developer dan berkolaborasi dengan Riefkika Martavia sebagai Frontend Developer. Tugas saya berfokus pada perancangan arsitektur backend, pemodelan database, implementasi logika bisnis, integrasi modul pembelajaran, serta pengamanan dan validasi data. Dalam prosesnya, saya juga terlibat dalam perancangan UI/UX bersama Riefkika Martavia untuk memastikan alur fitur backend selaras dengan kebutuhan pengguna dan tampilan antarmuka.

Berikut bentuk penugasan yang saya kerjakan secara rinci pada pengembangan backend Laravel LMS NesabaLearn.

| No | Bentuk Penugasan | Uraian Kegiatan | Output |
| --- | --- | --- | --- |
| 1 | Analisis Kebutuhan Sistem | Menganalisis kebutuhan fungsional LMS (meeting, materi, kuis, absensi, tugas, chatbot) dan memetakan alur data agar siap diimplementasikan ke backend. | Dokumen kebutuhan dan pemetaan modul backend |
| 2 | Perancangan Skema Database | Mendesain struktur tabel dan relasi inti (users, meetings, materials, attachments, assignments, attendances, quizzes, attempts, answers, chatbot) agar konsisten dengan kebutuhan LMS. | Skema database dan migration Laravel |
| 3 | Implementasi Autentikasi & Role | Mengaktifkan autentikasi Laravel, mengatur role `admin` dan `user`, serta menyiapkan pembatasan akses pada rute penting. | Sistem login, register, dan kontrol akses |
| 4 | CRUD Meeting | Mengimplementasikan CRUD meeting lengkap dengan pencarian, filter tipe meeting, dan penjadwalan untuk kebutuhan editorial/artikel. | MeetingController, route resource, dan halaman meeting |
| 5 | Manajemen Lampiran Meeting | Menangani upload, penyimpanan, dan pengunduhan lampiran meeting secara aman dengan validasi konteks meeting. | Modul lampiran meeting dan endpoint download |
| 6 | Manajemen Materi Meeting | Menyediakan CRUD materi meeting dengan dukungan konten teks maupun video, termasuk streaming video dari storage. | MeetingMaterialController dan halaman materi |
| 7 | Pengumpulan Tugas Meeting | Mengatur proses upload tugas, pembaruan file, penghapusan, dan unduh massal ZIP untuk admin. | MeetingAssignmentController dan manajemen file tugas |
| 8 | Modul Absensi | Menyusun pencatatan kehadiran peserta pada meeting tertentu dengan timestamp dan status kehadiran. | AttendanceController dan tabel attendances |
| 9 | Modul Kuis & Bank Soal | Membuat struktur kuis, pertanyaan, dan opsi jawaban; termasuk validasi skor dan tipe soal (essay/multiple choice). | QuizController, QuizQuestion, QuestionOption |
| 10 | Alur Pengerjaan Kuis | Mengimplementasikan alur attempt (start, continue, save, submit) serta perhitungan skor otomatis dan penilaian esai. | QuizAttemptController dan QuizAnswer |
| 11 | Integrasi Chatbot AI | Menyediakan endpoint tanya jawab, menyimpan percakapan dan pesan, serta mengelola riwayat (rename, delete, search). | ChatbotController dan tabel chatbot_conversations/messages |
| 12 | Validasi & Keamanan Input | Menggunakan Form Request untuk validasi data penting (meeting, materi, kuis, profil) dan transaksi database agar data konsisten. | Store/Update Request dan logika transaksi |
| 13 | Notifikasi Sistem | Mengirim notifikasi meeting baru ke pengguna sesuai role agar informasi jadwal tersampaikan. | NewMeetingNotification dan integrasi controller |
| 14 | Integrasi Backend ke UI | Menyelaraskan output backend dengan kebutuhan tampilan, memastikan data terload dengan eager loading dan format siap render. | Controller + relasi model untuk view Blade |
| 15 | UI/UX Collaboration | Berkolaborasi dengan frontend untuk menyusun wireframe alur fitur, menentukan kebutuhan data, dan menyesuaikan struktur UI agar sesuai flow backend. | Rancangan alur UI/UX dan daftar kebutuhan data |
| 16 | Pengujian & Debugging | Melakukan uji fungsional, memeriksa error alur kuis/tugas, serta memastikan konfigurasi PHPUnit tetap berjalan. | Stabilitas modul inti dan konfigurasi testing |
| 17 | Dokumentasi Teknis | Menulis dokumentasi instalasi dan modul pada README agar tim mudah melakukan setup dan pemeliharaan. | README dan panduan instalasi |

Catatan: Seluruh pekerjaan backend diimplementasikan dengan Laravel dan diselaraskan dengan kebutuhan antarmuka bersama Riefkika Martavia agar proses pembelajaran di LMS NesabaLearn berjalan stabil, terstruktur, dan mudah digunakan.

# 3.3 Bentuk Penugasan Sesudah Rebuild

Pada proyek rebuild LMS NesabaLearn, sistem yang sebelumnya berbasis Laravel + Blade + MySQL dibangun ulang menjadi Laravel (backend) + React.js (frontend) dengan Inertia.js sebagai jembatan agar frontend dan backend tetap berada dalam satu kodebase, serta PostgreSQL sebagai basis data. Dalam proyek ini saya, Muhammad Nasrulloh, berperan sebagai Fullstack Developer yang menangani seluruh alur pengembangan dari sisi frontend sampai backend, termasuk integrasi Inertia, pemodelan database, hingga sinkronisasi data ke UI. Riefkika Martavia berperan sebagai UI/UX Designer yang menyusun rancangan antarmuka menggunakan Figma sebagai acuan implementasi.

Berikut bentuk penugasan saya pada proyek rebuild, dibagi berdasarkan fokus frontend dan backend agar terlihat jelas cakupan pekerjaan fullstack.

| No | Fokus | Bentuk Penugasan | Uraian Kegiatan | Output |
| --- | --- | --- | --- | --- |
| 1 | Frontend | Interpretasi desain UI/UX | Menerjemahkan desain Figma ke struktur halaman React, menetapkan layout, tipografi, warna, dan konsistensi komponen. | Halaman React sesuai desain Figma |
| 2 | Frontend | Setup React + Inertia | Menyiapkan struktur React, konfigurasi Inertia, dan integrasi dengan Laravel agar halaman dirender sebagai React. | Setup React-Inertia berjalan stabil |
| 3 | Frontend | Konfigurasi Vite dan struktur folder | Menentukan struktur folder, alias import, dan konfigurasi build Vite agar pengembangan konsisten. | Struktur proyek frontend rapi |
| 4 | Frontend | Layout dan navigasi | Membuat layout utama (sidebar, header, breadcrumb) dan navigasi berbasis role agar alur penggunaan rapi. | Layout aplikasi dan navigasi dinamis |
| 5 | Frontend | Komponen UI reusable | Membuat komponen umum (button, modal, tabel, pagination, badge, alert) untuk dipakai lintas halaman. | Library komponen konsisten |
| 6 | Frontend | Implementasi halaman inti | Membuat halaman dashboard, meeting, materi, tugas, absensi, kuis, chatbot, dan profil pengguna. | Modul UI lengkap sesuai fitur LMS |
| 7 | Frontend | Form dan validasi UI | Membangun form input, validasi client-side, serta alur upload file untuk modul LMS. | Form responsif dengan feedback error |
| 8 | Frontend | Manajemen state tampilan | Mengelola state filter, pencarian, pagination, dan flash message agar interaksi stabil. | Interaksi UI lebih stabil |
| 9 | Frontend | Penanganan state UI | Menangani kondisi loading, empty state, dan error state agar UX tetap jelas. | UX informatif di semua kondisi |
| 10 | Frontend | Responsive dan aksesibilitas | Menyesuaikan tampilan untuk mobile/desktop dan memastikan komponen mudah diakses. | UI adaptif dan lebih aksesibel |
| 11 | Frontend | Integrasi data Inertia | Menghubungkan halaman React dengan data dari controller, termasuk props, pagination, dan query. | Data tampil konsisten dengan backend |
| 12 | Backend | Analisis kebutuhan rebuild | Menyusun ulang kebutuhan modul LMS agar selaras dengan stack baru (React + Inertia + PostgreSQL). | Dokumen kebutuhan dan scope rebuild |
| 13 | Backend | Desain database PostgreSQL | Mendesain ulang skema tabel dan relasi, menyesuaikan tipe data dan indexing untuk PostgreSQL. | Skema database dan migration baru |
| 14 | Backend | Migration dan seeding data | Menulis migration, seeder, dan factory untuk data awal serta kebutuhan uji. | Database siap dipakai |
| 15 | Backend | Implementasi model dan relasi | Menyiapkan model Eloquent beserta relasi untuk modul meeting, materi, tugas, absensi, kuis, dan chatbot. | Model dan relasi siap pakai |
| 16 | Backend | Autentikasi dan role access | Menerapkan autentikasi Laravel, role admin/user, serta proteksi rute dan halaman Inertia. | Sistem login dan kontrol akses |
| 17 | Backend | Authorization policy | Menetapkan policy atau gate agar akses fitur sesuai peran pengguna. | Akses berbasis peran terjaga |
| 18 | Backend | Controller dan logika bisnis | Mengembangkan controller untuk CRUD, alur tugas, absensi, materi, dan modul kuis. | Controller dan logika bisnis berjalan |
| 19 | Backend | Manajemen file dan storage | Menangani upload, penyimpanan, streaming, dan proteksi file sesuai konteks modul. | File aman dan terstruktur |
| 20 | Backend | Modul kuis dan penilaian | Mengatur bank soal, attempt, perhitungan skor otomatis, dan penilaian esai. | Alur kuis terukur dan terdokumentasi |
| 21 | Backend | Modul chatbot dan riwayat | Menyediakan endpoint percakapan, penyimpanan riwayat, serta pengelolaan pesan. | Fitur chatbot terintegrasi |
| 22 | Backend | Validasi dan keamanan data | Menggunakan Form Request, sanitasi input, dan transaksi database agar data konsisten. | Data aman dan konsisten |
| 23 | Integrasi | Sinkronisasi UI dan data | Menyelaraskan output backend ke format props React yang siap dirender. | UI menerima data siap pakai |
| 24 | Integrasi | Migrasi data dan penyesuaian fitur | Menyesuaikan fitur lama agar kompatibel dengan stack baru, termasuk mapping MySQL ke PostgreSQL. | Fitur lama kompatibel |
| 25 | Quality | Testing dan debugging end-to-end | Menguji alur auth, CRUD, upload, dan kuis lintas layer serta memperbaiki bug. | Fitur stabil di semua modul |
| 26 | Dokumentasi | Dokumentasi teknis rebuild | Menulis panduan setup, struktur proyek, dan catatan perubahan arsitektur untuk tim. | README dan dokumentasi teknis |

Catatan: Dengan peran fullstack, saya memastikan seluruh modul LMS berfungsi utuh dari sisi antarmuka sampai ke logika server, sementara desain UI/UX dipandu oleh rancangan Figma dari Riefkika Martavia agar tampilan tetap konsisten dan mudah digunakan.
