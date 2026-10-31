# quest-verification Specification

## Purpose
Registrasi regu, verifikasi password pos di server, pencatatan progres, dan lock sequential yang tidak bisa di-bypass — termasuk scan QR kamera sebagai cara input password.

## Requirements

### Requirement: Registrasi regu
`POST /api/teams` publik (rate-limit) menerima nama regu (3–40 karakter, unik) dan mengembalikan `team_id`. Identitas regu anon = `team_id` tersimpan di localStorage (bukan sessionStorage), jadi progres bertahan antar sesi tab.

#### Scenario: Registrasi sukses
- **WHEN** regu submit nama valid yang belum dipakai
- **THEN** response berisi `team_id` baru dan regu tersimpan di DB

#### Scenario: Nama invalid atau duplikat
- **WHEN** nama < 3 / > 40 karakter atau sudah dipakai
- **THEN** response error 4xx dengan pesan jelas, tanpa membuat tim

### Requirement: Verifikasi password pos server-side
`POST /api/pos/:id/verify` (rate-limit 10 req/menit/IP) membandingkan password dengan hash di tabel `positions`. Password pos TIDAK PERNAH ada di client bundle. Sukses → catat baris `team_progress` + publish event SSE `progress`.

#### Scenario: Password benar
- **WHEN** regu kirim password pos yang cocok dengan hash
- **THEN** progres pos tersebut tercatat dan event `progress` dipublish

#### Scenario: Password salah
- **WHEN** password tidak cocok
- **THEN** response 401/422, tidak ada progres tercatat, tidak ada event publish

#### Scenario: Rate limit
- **WHEN** satu IP kirim > 10 request verify dalam 1 menit
- **THEN** request berikutnya ditolak (429) sampai jendela waktu lewat

### Requirement: Lock sequential tidak bisa di-bypass
Akses `/pos/[id]` hanya boleh jika pos tersedia (pos sebelumnya selesai). Cek `isPosAvailable` dijalankan di server (endpoint verify menolak pos terkunci) DAN di guard halaman (redirect ke `/pos`).

#### Scenario: Bypass via URL
- **WHEN** regu membuka `/pos/3` padahal pos 1–2 belum selesai
- **THEN** halaman redirect ke `/pos` dan verify pos 3 ditolak server

### Requirement: Scan QR kamera asli
Tombol scan QR membuka kamera dan membaca QR yang berisi password pos. Hasil scan diisi ke alur verifikasi yang sama dengan input manual (server-side verify). Tanpa kamera/izin ditolak → fallback input manual. Tidak ada stub palsu.

#### Scenario: Scan berisi password benar
- **WHEN** kamera membaca QR dengan isi password pos yang benar
- **THEN** verifikasi sukses sama seperti input manual

#### Scenario: Kamera tidak tersedia
- **WHEN** izin kamera ditolak / perangkat tanpa kamera
- **THEN** UI menawarkan input password manual, tanpa error crash

### Requirement: Query progres tervalidasi
Parameter `?done=<n>` di halaman progres divalidasi `isValidPos` + `isPosCompleted`; query mentah tidak pernah dipakai langsung.

#### Scenario: Query invalid
- **WHEN** halaman progres dibuka dengan `?done=99`
- **THEN** tidak ada toast "Berhasil" palsu; halaman menampilkan state sebenarnya dari API

### Requirement: Validasi form client jalan
Input form tidak mengandalkan `required` native saja: validasi alfanumerik dijalankan di kode dengan pesan error custom yang benar-benar tampil.

#### Scenario: Input karakter terlarang
- **WHEN** regu submit karakter non-alfanumerik
- **THEN** pesan error custom tampil dan submit diblok
