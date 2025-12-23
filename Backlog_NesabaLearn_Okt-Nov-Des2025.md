# Backlog Proyek NesabaLearn (Okt–Des 2025)

## Ringkasan Sprint
- Sprint 1 (1–14 Okt 2025): 2 minggu / 10 hari kerja
- Sprint 2 (15–31 Okt 2025): 2,5 minggu / 12 hari kerja
- Sprint 3 (1–14 Nov 2025): 2 minggu / 10 hari kerja
- Sprint 4 (15–30 Nov 2025): 2 minggu / 10 hari kerja
- Sprint 5 (1–14 Des 2025): 2 minggu / 10 hari kerja
- Sprint 6 (15–31 Des 2025): 2 minggu / 9 hari kerja (25–26 Des libur)

Catatan: Estimasi penyelesaian tiap sprint dihitung dalam hari kerja aktif.

---

## Sprint 1 (1–14 Okt 2025) — Durasi: 10 hari kerja
**Tujuan:** Fondasi sistem, autentikasi, dan struktur navigasi.

Backlog:
- Analisis kebutuhan dan scope LMS (2 hari)
- Desain arsitektur (Laravel + Inertia + React) (2 hari)
- Implementasi landing page + navigasi umum (2 hari)
- Setup i18n dasar (ID/EN) + theme toggle (2 hari)
- Setup autentikasi (login/register/forgot) (2 hari)

Output utama:
- Landing page siap
- Auth flow dasar berjalan
- Struktur routing awal

---

## Sprint 2 (15–31 Okt 2025) — Durasi: 12 hari kerja
**Tujuan:** Manajemen pertemuan dasar dan tampilan user.

Backlog:
- CRUD meeting (backend + frontend) (4 hari)
- Form tambah/edit meeting + validasi (2 hari)
- Lampiran pertemuan (upload) (2 hari)
- Materi pertemuan (konten/video) (2 hari)
- Tugas pertemuan (konten/file + deadline) (2 hari)

Output utama:
- Meeting bisa dikelola admin
- Lampiran/materi/tugas tersimpan
- Halaman detail meeting admin awal

---

## Sprint 3 (1–14 Nov 2025) — Durasi: 10 hari kerja
**Tujuan:** Quiz, absensi, dan pengalaman user.

Backlog:
- Quiz meeting (model, soal, opsi, skor) (3 hari)
- UI pembuatan quiz admin (2 hari)
- Absensi berbasis waktu (1 hari)
- Halaman detail meeting user (materi, tugas, quiz, absensi) (2 hari)
- Filter meeting user (2 hari)

Output utama:
- Quiz bisa dibuat admin
- Absensi terkunci sebelum waktu meeting
- User melihat detail meeting lengkap

---

## Sprint 4 (15–30 Nov 2025) — Durasi: 10 hari kerja
**Tujuan:** Penilaian tugas dan manajemen pengguna.

Backlog:
- Rubrik penilaian tugas (migration + UI) (3 hari)
- Feedback mentor + total skor otomatis (2 hari)
- CRUD pengguna admin (2 hari)
- Detail user + aktivitas (2 hari)
- Status otomatis nonaktif >3 hari tidak login (1 hari)

Output utama:
- Admin menilai tugas dengan rubrik
- User melihat skor & feedback
- Manajemen pengguna lengkap

---

## Sprint 5 (1–14 Des 2025) — Durasi: 10 hari kerja
**Tujuan:** Notifikasi email & chatbot.

Backlog:
- Integrasi SMTP Gmail + mail template (2 hari)
- Scheduler notifikasi (meeting/tugas/quiz H-1 & H-1 jam) (3 hari)
- Email hasil quiz (1 hari)
- Notifikasi meeting/tugas/quiz baru (2 hari)
- Chatbot AI (riwayat, rename, delete, search) (2 hari)

Output utama:
- Notifikasi email berjalan
- Chatbot AI usable

---

## Sprint 6 (15–31 Des 2025) — Durasi: 9 hari kerja
**Tujuan:** Hardening, delete flow, QA, dokumentasi.

Backlog:
- Hapus lampiran/materi/tugas/quiz (2 hari)
- Responsif UI profil admin & user (1 hari)
- Penyelarasan role redirect & impersonate (1 hari)
- QA end-to-end per role (2 hari)
- Dokumentasi konfigurasi & release notes (2 hari)
- Buffer bugfix & polish (1 hari)

Output utama:
- Semua fitur stabil
- QA lulus
- Dokumentasi siap
