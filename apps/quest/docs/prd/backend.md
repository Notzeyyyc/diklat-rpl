# PRD — Backend DIKLAT 2026 Orientation Quest

Status: draft. Menunggu keputusan rapat soal jumlah regu & kebutuhan rekap panitia.

## Problem

Frontend sudah jalan tapi ada logika kritis yang cuma di sisi klien:

- Password verifikasi tiap pos **hardcoded di bundle frontend** (`app/pages/pos/[id].vue`). Siapa pun buka source/devtools bisa lihat semua password. Ini alasan utama backend dibutuhkan.
- Progres regu (`completedPos`) cuma di `sessionStorage` — ilang kalau ganti device, gampang diakalin dari devtools.
- Scan QR belum validasi apa-apa (masih `ValidationMessage` palsu tanpa cek server).

Fakta yang sudah pasti:

- Password beda tiap pos.
- QR berisi password pos; kalau di-scan dan cocok, regu dinyatakan berhasil di pos itu.
- Suasana acara santai — anti-cheat cukup ringan.
- Storage: SQLite.

Belum diketahui:

- Jumlah regu & concurrency (rapat belum). Tidak mengubah pilihan SQLite, tapi menentukan apakah butuh seed data regu.
- Apakah panitia butuh rekap/dashboard regu mana selesai pos apa.

## Tujuan

- Pindahkan verifikasi password pos ke server, supaya password tidak ada di bundle frontend.
- QR dan input manual verifikasi lewat mekanisme yang sama (QR = pembawa string password).
- Simpan konfigurasi pos (password + jawaban puzzle) di SQLite, bisa diedit tanpa rebuild frontend.

## Non-tujuan

- Leaderboard / ranking / timestamp kompetitif (suasana santai).
- Autentikasi user berat (login/password akun). Regu cukup identitas ringan.
- Real-time (websocket) update antar device.
- Anti-cheat ketat (rate-limit ekstrem, signature QR, dsb).

## User & use case utama

- **Peserta (regu)**: datang ke pos fisik, dapat password dari panitia / scan QR, sistem konfirmasi berhasil.
- **Panitia pos**: pegang password/QR pos, tidak berinteraksi langsung dengan sistem (kecuali nanti butuh rekap).

Use case inti:

1. Regu masukkan/scan password pos → sistem verifikasi ke server → berhasil/gagal.

## Requirement (MoSCoW)

### Must

- `POST /api/pos/:id/verify` — body `{ password }`, response `{ ok: boolean }`.
  - Validasi `id` integer 1..totalPos. Invalid → 404.
  - Bandingkan password case-insensitive + trim (samakan dengan perilaku frontend sekarang).
- Tabel SQLite `pos(id INTEGER PRIMARY KEY, password TEXT NOT NULL, answer TEXT)`.
  - `answer` = jawaban puzzle biner (opsional, buat referensi panitia), bukan dipakai verifikasi.
- Seed 5 pos dengan password masing-masing (nilai dari panitia, belum ada — placeholder dulu).
- Frontend `pos/[id].vue` panggil endpoint ini, hapus password hardcoded.
- Input password manual dan hasil scan QR sama-sama lewat endpoint ini.

### Should

- Progres server-side (kalau rapat mutusin panitia butuh rekap):
  - `POST /api/register` — `{ groupName }` → `{ teamId }`.
  - `POST /api/pos/:id/verify` terima `{ teamId, password }`, catat completion.
  - `GET /api/progress?teamId=` → `{ teamName, completedPos: number[] }`.
  - Tabel `teams(id, name, created_at)`, `completions(team_id, pos_id, completed_at, UNIQUE(team_id, pos_id))`.
- Locking sequential di-enforce server (pos n hanya bisa di-verify kalau n-1 sudah selesai untuk teamId itu).

### Could

- Endpoint rekap panitia `GET /api/admin/progress` (semua regu + status), dilindungi token statik sederhana.

### Won't (untuk versi ini)

- Leaderboard, timestamp ranking.
- Login akun, session server, refresh token.
- Real-time / websocket.
- QR signature / anti-replay.

## Alur utama (Must — verify-only)

1. Regu buka `/pos/:id`.
2. Frontend validasi `id` (sudah ada guard client). 
3. Regu masukkan password manual ATAU scan QR (QR mengisi field password).
4. Frontend `POST /api/pos/:id/verify { password }`.
5. Server cek `id` valid → ambil `pos.password` → bandingkan (trim + uppercase).
6. `ok: true` → frontend tandai pos selesai (sessionStorage), redirect `/pos/progress?done=:id`.
7. `ok: false` → tampilkan pesan gagal.

## Alur (Should — dengan progres server)

1. Registrasi: `POST /api/register { groupName }` → simpan regu, balikin `teamId` (frontend simpan di sessionStorage).
2. Verify: `POST /api/pos/:id/verify { teamId, password }`.
3. Server cek locking (pos n butuh n-1 selesai), cek password, catat `completions`.
4. `/pos/progress` & `/pos` ambil status dari `GET /api/progress?teamId=` bukan dari sessionStorage.

## Kriteria terima (bisa diuji)

- `POST /api/pos/1/verify` dengan password benar → `{ ok: true }`; password salah → `{ ok: false }`.
- Password TIDAK muncul di bundle frontend hasil `nuxt build` (grep string password di `.output` = kosong).
- `POST /api/pos/999/verify` → 404.
- Password dicek case-insensitive: `"rpljuara"` dan `"RPLJUARA"` dua-duanya lolos (kalau itu password pos-nya).
- (Should) `POST /api/pos/2/verify` sebelum pos 1 selesai → `{ ok: false, reason: "locked" }`.
- (Should) `GET /api/progress?teamId=X` balikin `completedPos` sesuai yang sudah di-verify.

## Risiko & mitigasi

- **Password ketebak** (santai, password pendek): terima risiko; mitigasi ringan = rate-limit sederhana per-IP kalau perlu (Could).
- **teamId dipalsukan** (Should): santai, terima risiko. Kalau butuh, tambah token acak per-regu.
- **QR di-share antar regu**: memang mungkin (QR = password). Sesuai desain "santai", diterima.
- **DB file hilang saat redeploy**: pastikan file SQLite di volume persisten, bukan di folder build yang ke-wipe.

## Pertanyaan terbuka

1. Jumlah regu & apakah regu di-seed dulu atau daftar mandiri saat acara? (nunggu rapat)
2. Panitia butuh rekap regu-selesai-pos-apa? → nentuin Should dikerjakan atau tidak.
3. Nilai password 5 pos yang sebenarnya (sekarang cuma placeholder `RPLJUARA`/`PARKIRAN26`).
4. Format isi QR: password mentah (`RPLJUARA`) atau URL (`/pos/1?p=RPLJUARA`) yang auto-submit?
5. Deploy di mana? (nentuin lokasi file SQLite persisten)
