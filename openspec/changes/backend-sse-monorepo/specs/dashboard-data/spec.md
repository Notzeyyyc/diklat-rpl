# Spec Delta

## Purpose

Dashboard membaca data nyata dari Postgres (bukan mock), skor live via SSE, tombol bermakna semua.

## ADDED Requirements

### Requirement: Overview & leaderboard dari DB
`GET /api/admin/overview` (staff) mengembalikan data tracking/leaderboard + angka StatCard dari count DB (jumlah tim, progres, skor). Angka selalu konsisten dengan isi tabel.

#### Scenario: StatCard konsisten
- **WHEN** halaman overview dimuat
- **THEN** "N Tim" sama dengan jumlah baris `teams`

### Requirement: Submit skor
`POST /api/scores` (ketua/admin) menyimpan skor 0–100 + notes + judge_id, lalu publish SSE `scores`.

#### Scenario: Skor tampil live
- **WHEN** ketua submit skor dari dashboard
- **THEN** leaderboard/tracking subscriber SSE ter-update tanpa refresh

### Requirement: Export CSV & Print
Tombol Print/Export berfungsi: Export CSV menghasilkan file dengan koma/quote di data ter-escape, atau tombolnya dihapus kalau tidak dipakai. Tidak ada tombol no-op.

#### Scenario: Export CSV
- **WHEN** admin klik Export CSV dengan data mengandung koma/quote
- **THEN** file CSV valid ter-download

### Requirement: POS Hub berfungsi
Tab POS Hub mengubah konten per pos, atau tab dihapus jika tidak dipakai. Tidak ada tab hias.

#### Scenario: Ganti pos di POS Hub
- **WHEN** admin pilih pos lain di tab POS Hub
- **THEN** konten tab berubah sesuai pos terpilih
