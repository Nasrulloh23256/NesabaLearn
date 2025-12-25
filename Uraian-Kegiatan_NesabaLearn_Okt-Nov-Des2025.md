- Target Oktober: analisis kebutuhan, desain arsitektur, fondasi UI/UX, autentikasi, dan CRUD pertemuan awal.
- Target November: penyempurnaan fitur admin dan user (meeting detail, tugas, quiz, absensi), rubrik penilaian, dan manajemen pengguna.
- Target Desember: notifikasi email, hardening keamanan, perbaikan UX responsif, dan finalisasi fitur hapus data.
- Target QA: pengujian fungsional per role, validasi deadline, dan konsistensi data antar halaman.
- Target dokumentasi: ringkasan konfigurasi, catatan rilis, dan panduan penggunaan admin/user.

## Oktober 2025

1. Judul: Analisis kebutuhan dan penyusunan backlog
Tanggal: 1 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Melakukan analisis kebutuhan stakeholder, memetakan alur bisnis LMS, mendefinisikan modul utama (meeting, tugas, quiz, absensi), serta menyusun backlog prioritas untuk rilis Q4 2025.
Bukti Kegiatan: file: docs/requirements.md

2. Judul: Desain arsitektur Laravel + Inertia + React
Tanggal: 2 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun rancangan arsitektur aplikasi, struktur routing, pola controller-service, serta skema RBAC untuk role admin dan pengguna.
Bukti Kegiatan: file: routes/web.php, app/Http/Middleware/EnsureRole.php

3. Judul: Implementasi landing page dan navigasi utama
Tanggal: 3 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Membangun landing page, CTA, layout hero, serta pengkabelan navigasi ke login/register dengan komponen React dan i18n dasar.
Bukti Kegiatan: file: resources/js/Pages/App.jsx, resources/js/context/LanguageContext.jsx

4. Judul: Pembuatan halaman Login/Register/Forgot Password
Tanggal: 6 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Implementasi UI autentikasi, validasi input dasar, dan penyiapan rute autentikasi awal pada front-end.
Bukti Kegiatan: file: resources/js/Pages/Login.jsx, resources/js/Pages/Register.jsx, resources/js/Pages/ForgotPassword.jsx

5. Judul: Integrasi tema dan bahasa di halaman autentikasi
Tanggal: 7 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan switch dark/light mode dan toggle bahasa ID/EN pada login/register/forgot, termasuk sinkronisasi state dan lokal storage.
Bukti Kegiatan: file: resources/context/ThemeContext.js, resources/js/context/LanguageContext.jsx

6. Judul: Implementasi autentikasi dan redirect role
Tanggal: 8 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menyambungkan flow login/register ke Laravel Auth, menambahkan redirect role setelah login, serta memastikan logout kembali ke landing page.
Bukti Kegiatan: file: app/Http/Controllers/Auth/AuthenticatedSessionController.php, routes/web.php

7. Judul: Setup awal Dashboard Admin
Tanggal: 9 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Mendesain layout dashboard admin, kartu statistik awal, dan struktur data placeholder untuk pengembangan analitik berikutnya.
Bukti Kegiatan: file: resources/js/Pages/Admin/Dashboard.jsx

8. Judul: Implementasi CRUD Meeting (backend)
Tanggal: 10 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Membuat migration, model, controller, dan route meeting; termasuk validasi input serta penyimpanan jadwal meeting.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingController.php, app/Models/Meeting.php, database/migrations

9. Judul: Implementasi list meeting dan filter di admin
Tanggal: 13 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun tabel meeting admin, filter tipe pertemuan, dan aksi dasar (lihat/edit) pada UI.
Bukti Kegiatan: file: resources/js/Pages/Admin/Meetings.jsx

10. Judul: Implementasi form tambah/edit meeting
Tanggal: 14 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Membuat form meeting dengan validasi frontend, dukungan tanggal/waktu, serta binding field sesuai kebutuhan backend.
Bukti Kegiatan: file: resources/js/Pages/Admin/MeetingCreate.jsx, resources/js/Pages/Admin/MeetingEdit.jsx

11. Judul: Fitur lampiran meeting (upload)
Tanggal: 15 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan endpoint upload lampiran dan penyimpanan file ke storage public, beserta metadata lampiran.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingAttachmentController.php

12. Judul: Fitur materi meeting (konten/video)
Tanggal: 16 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan pembuatan materi berbasis konten dan video, validasi tipe file, serta penyimpanan path video.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingMaterialController.php, app/Models/MeetingMaterial.php

13. Judul: Fitur tugas meeting (konten/file) dan deadline
Tanggal: 17 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Mengimplementasikan pembuatan tugas meeting, validasi konten/file, penyimpanan file ke storage, serta metadata deadline.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingTaskController.php, app/Models/MeetingTask.php

14. Judul: Halaman detail meeting admin
Tanggal: 20 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menyatukan informasi meeting (lampiran, materi, tugas, absensi, quiz) pada satu halaman detail untuk monitoring admin.
Bukti Kegiatan: file: resources/js/Pages/Admin/MeetingDetail.jsx

15. Judul: Implementasi logika absensi berbasis waktu
Tanggal: 21 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan rule backend agar absensi hanya bisa dilakukan setelah waktu meeting dimulai.
Bukti Kegiatan: file: app/Http/Controllers/User/MeetingController.php

16. Judul: Setup quiz meeting (backend)
Tanggal: 22 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan model quiz, question, option, validasi pilihan ganda, serta penyimpanan struktur soal.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingQuizController.php, app/Models/ 

17. Judul: UI pembuatan quiz di admin
Tanggal: 23 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Membuat form quiz dinamis (pertanyaan, opsi jawaban, skor) dan validasi client-side.
Bukti Kegiatan: file: resources/js/Pages/Admin/MeetingQuizCreate.jsx

18. Judul: Daftar meeting untuk role pengguna
Tanggal: 24 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun halaman list meeting untuk pengguna, beserta filter tipe pertemuan dan akses detail.
Bukti Kegiatan: file: resources/js/Pages/User/Meetings/Meetings.jsx

19. Judul: Detail meeting role pengguna
Tanggal: 27 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menampilkan informasi meeting di sisi pengguna beserta materi, tugas, quiz, dan absensi.
Bukti Kegiatan: file: resources/js/Pages/User/Meetings/MeetingDetail.jsx

20. Judul: Pengumpulan tugas oleh pengguna
Tanggal: 28 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan endpoint pengumpulan tugas, upload file, dan penyimpanan assignment ke database.
Bukti Kegiatan: file: app/Http/Controllers/User/MeetingController.php

21. Judul: Profil admin dan user (awal)
Tanggal: 29 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Membangun halaman profil dasar untuk admin dan user, termasuk struktur form update.
Bukti Kegiatan: file: resources/js/Pages/Admin/Profile.jsx, resources/js/Pages/User/Meetings/Profile.jsx

22. Judul: Setup awal Chatbot AI
Tanggal: 30 Oktober 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan routing dan UI dasar chatbot AI agar siap diintegrasikan dengan logika riwayat dan interaksi.
Bukti Kegiatan: file: app/Http/Controllers/ChatbotController.php, resources/js/Pages/User/Meetings/Chatbot.jsx

## November 2025

23. Judul: Implementasi attempt quiz dan pembatasan 1x
Tanggal: 3 November 2025
Waktu Kegiatan: 540 menit
Uraian: Membangun flow pengerjaan quiz, pencatatan attempt, serta validasi agar user hanya dapat submit satu kali.
Bukti Kegiatan: file: app/Http/Controllers/User/QuizController.php

24. Judul: Timer countdown saat pengerjaan quiz
Tanggal: 4 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan timer countdown pada UI quiz dan integrasi dengan batas waktu yang diset admin.
Bukti Kegiatan: file: resources/js/Pages/User/Meetings/Quiz.jsx

25. Judul: Riwayat attempt quiz (admin & user)
Tanggal: 5 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menampilkan riwayat quiz attempt di detail meeting admin dan user dengan metadata waktu dan skor.
Bukti Kegiatan: file: resources/js/Pages/Admin/MeetingDetail.jsx, resources/js/Pages/User/Meetings/MeetingDetail.jsx

26. Judul: Penilaian tugas dengan rubrik
Tanggal: 6 November 2025
Waktu Kegiatan: 540 menit
Uraian: Membuat migration rubrik, endpoint penilaian, serta UI review dengan total skor otomatis.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingAssignmentReviewController.php, resources/js/Pages/Admin/MeetingAssignmentReview.jsx

27. Judul: Tampilan feedback mentor di user
Tanggal: 7 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan tampilan skor dan komentar mentor di halaman detail meeting user.
Bukti Kegiatan: file: resources/js/Pages/User/Meetings/MeetingDetail.jsx

28. Judul: CRUD pengguna (admin)
Tanggal: 10 November 2025
Waktu Kegiatan: 540 menit
Uraian: Implementasi create, read, update, delete pengguna lengkap dengan validasi form dan pengelolaan role.
Bukti Kegiatan: file: app/Http/Controllers/Admin/UserController.php, resources/js/Pages/Admin/Users.jsx

29. Judul: Detail pengguna dan aktivitas
Tanggal: 11 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun halaman detail pengguna dengan ringkasan profil, status, dan aktivitas terkini.
Bukti Kegiatan: file: resources/js/Pages/Admin/UserDetail.jsx

30. Judul: Status otomatis nonaktif jika tidak login 3 hari
Tanggal: 12 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan field last_login_at, memperbarui autentikasi, dan logika status akun berdasarkan selisih hari.
Bukti Kegiatan: file: database/migrations/2025_12_21_000002_add_last_login_at_to_users_table.php, app/Http/Controllers/Admin/UserController.php

31. Judul: Upload avatar dan sinkronisasi topbar
Tanggal: 13 November 2025
Waktu Kegiatan: 540 menit
Uraian: Implementasi upload avatar ke database, update akun, dan tampil di topbar serta list aktivitas.
Bukti Kegiatan: file: app/Http/Controllers/AccountProfileController.php, resources/js/Pages/Admin/Profile.jsx

32. Judul: Perbaikan UI sidebar dan responsivitas     pppppppppp
Tanggal: 14 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menyesuaikan layout sidebar, ikon, dan breakpoint agar tampilan konsisten di mobile dan desktop.
Bukti Kegiatan: file: resources/js/Layouts/AdminLayout.jsx, resources/js/Layouts/UserLayout.jsx

33. Judul: Chatbot AI dengan riwayat, rename, delete, search
Tanggal: 17 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan CRUD riwayat chat, fitur rename, delete, dan pencarian dengan integrasi Inertia.
Bukti Kegiatan: file: app/Http/Controllers/ChatbotController.php, resources/js/Pages/User/Meetings/Chatbot.jsx

34. Judul: Penyempurnaan i18n admin
Tanggal: 18 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menambah terjemahan admin untuk meeting detail, user, dan CTA agar konsisten antara ID/EN.
Bukti Kegiatan: file: resources/js/context/LanguageContext.jsx

35. Judul: Fitur pembatalan meeting
Tanggal: 19 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menambah flag cancel meeting, tombol aksi admin, serta status dibatalkan di admin dan user.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingController.php, database/migrations/2025_12_20_000001_add_cancelled_to_meetings_table.php

36. Judul: Filter meeting admin dan user
Tanggal: 20 November 2025
Waktu Kegiatan: 540 menit
Uraian: Memperbaiki filter meeting agar hasil sesuai tipe Artikel/Editorial di kedua role.
Bukti Kegiatan: file: resources/js/Pages/Admin/Meetings.jsx, resources/js/Pages/User/Meetings/Meetings.jsx

37. Judul: Hardening alur autentikasi dan role
Tanggal: 21 November 2025
Waktu Kegiatan: 540 menit
Uraian: Review logic RBAC, memastikan redirect yang tepat saat role tidak sesuai, dan perbaikan edge case.
Bukti Kegiatan: file: app/Http/Middleware/EnsureRole.php, routes/web.php

38. Judul: Penyempurnaan UX responsif login dan landing
Tanggal: 24 November 2025
Waktu Kegiatan: 540 menit
Uraian: Penyesuaian layout untuk perangkat mobile, termasuk perbaikan ukuran teks dan tombol.
Bukti Kegiatan: file: resources/js/Pages/Login.jsx, resources/js/Pages/App.jsx

39. Judul: Dokumentasi internal modul meeting dan quiz
Tanggal: 25 November 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun dokumentasi teknis modul meeting dan quiz untuk referensi tim pengembang.
Bukti Kegiatan: file: docs/meeting-quiz.md

## Desember 2025

40. Judul: Integrasi SMTP Gmail dan mail template
Tanggal: 1 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan konfigurasi SMTP Gmail, membuat mail template, dan memastikan pengiriman email dasar.
Bukti Kegiatan: file: app/Mail/NotificationMail.php, resources/views/emails/notification.blade.php

41. Judul: Scheduler dan log notifikasi
Tanggal: 2 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Membuat command scheduler, logging notifikasi, serta mekanisme anti-duplikasi pengiriman email.
Bukti Kegiatan: file: routes/console.php, app/Models/NotificationLog.php

42. Judul: Reminder meeting H-1 hari dan H-1 jam
Tanggal: 3 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan logika reminder meeting pada window waktu tertentu dan memastikan pesan tersusun jelas.
Bukti Kegiatan: file: app/Services/NotificationService.php

43. Judul: Reminder deadline tugas dan quiz
Tanggal: 4 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan notifikasi deadline tugas dan quiz, termasuk pengecekan apakah user sudah submit/attempt.
Bukti Kegiatan: file: app/Services/NotificationService.php

44. Judul: Email hasil quiz setelah submit
Tanggal: 5 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Mengirimkan email ringkasan hasil quiz setelah user submit attempt, termasuk skor.
Bukti Kegiatan: file: app/Http/Controllers/User/QuizController.php

45. Judul: Notifikasi meeting baru
Tanggal: 8 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan notifikasi email ketika meeting baru dibuat, beserta detail judul, waktu, tipe, dan link.
Bukti Kegiatan: file: app/Services/NotificationService.php, app/Http/Controllers/Admin/MeetingController.php

46. Judul: Notifikasi tugas baru dan quiz baru
Tanggal: 9 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan email otomatis saat admin menambahkan tugas atau quiz baru ke pertemuan.
Bukti Kegiatan: file: app/Services/NotificationService.php, app/Http/Controllers/Admin/MeetingTaskController.php

47. Judul: Fitur hapus lampiran, materi, dan tugas
Tanggal: 10 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan endpoint delete, menghapus file dari storage, serta UI tombol hapus dengan konfirmasi.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingAttachmentController.php, resources/js/Pages/Admin/MeetingDetail.jsx

48. Judul: Fitur hapus quiz meeting
Tanggal: 11 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan delete quiz lengkap dengan penghapusan question, option, attempt, dan answer secara transaksional.
Bukti Kegiatan: file: app/Http/Controllers/Admin/MeetingQuizController.php

49. Judul: Tampilkan lampiran di role user
Tanggal: 12 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menampilkan daftar lampiran meeting pada user dengan tautan akses file.
Bukti Kegiatan: file: resources/js/Pages/User/Meetings/MeetingDetail.jsx

50. Judul: Informasi absensi belum dibuka
Tanggal: 15 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan pesan informasi tanggal pembukaan absensi agar user mengetahui jadwal absensi.
Bukti Kegiatan: file: resources/js/Pages/User/Meetings/MeetingDetail.jsx, resources/js/context/LanguageContext.jsx

51. Judul: Responsif profil admin di mobile
Tanggal: 16 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menyesuaikan layout header, tombol, dan avatar agar profil admin nyaman diakses via perangkat mobile.
Bukti Kegiatan: file: resources/js/Pages/Admin/Profile.jsx

52. Judul: Perbaikan last_login_at saat autentikasi
Tanggal: 17 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Memastikan timestamp last_login_at terupdate pada saat login untuk keperluan status akun otomatis.
Bukti Kegiatan: file: app/Http/Controllers/Auth/AuthenticatedSessionController.php

53. Judul: Impersonate user oleh admin
Tanggal: 18 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menambahkan aksi login sebagai user untuk kebutuhan troubleshooting dan validasi pengalaman pengguna.
Bukti Kegiatan: file: app/Http/Controllers/Admin/UserController.php

54. Judul: Perbaikan parsing waktu pada dashboard admin
Tanggal: 19 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menyelaraskan format tanggal dan waktu agar statistik dashboard tidak error pada data meeting.
Bukti Kegiatan: file: app/Http/Controllers/Admin/DashboardController.php

55. Judul: Pengujian end-to-end per role
Tanggal: 22 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Melakukan uji alur login, CRUD meeting, tugas, quiz, dan notifikasi untuk admin dan user.
Bukti Kegiatan: folder: tests/Feature/

56. Judul: Dokumentasi konfigurasi deployment dan SMTP
Tanggal: 23 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun dokumentasi konfigurasi environment, mailer, dan scheduler untuk proses deploy.
Bukti Kegiatan: file: README.md

57. Judul: Release note dan checklist rilis
Tanggal: 24 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun catatan rilis, daftar fitur, serta checklist operasional akhir tahun.
Bukti Kegiatan: file: docs/release-notes.md

58. Judul: Hardening pasca libur Natal
Tanggal: 29 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Melakukan perbaikan bug minor, validasi ulang deadline tugas/quiz, dan review log error produksi.
Bukti Kegiatan: file: storage/logs/laravel.log

59. Judul: QA final dan regresi
Tanggal: 30 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menjalankan uji regresi UI/UX, memastikan data konsisten di admin dan user, serta perbaikan minor styling.
Bukti Kegiatan: file: resources/js/Pages/Admin/MeetingDetail.jsx

60. Judul: Dokumentasi handover dan arsip teknis
Tanggal: 31 Desember 2025
Waktu Kegiatan: 540 menit
Uraian: Menyusun dokumen handover, rangkuman konfigurasi, dan arsip teknis untuk pemeliharaan 2026.
Bukti Kegiatan: file: docs/handover.md

Total Waktu Kegiatan: 32400 menit (540 jam)
