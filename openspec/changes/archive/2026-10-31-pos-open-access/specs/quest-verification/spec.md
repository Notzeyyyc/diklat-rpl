# Spec Delta

## Purpose

Registrasi regu, verifikasi one-time code pos di server, pencatatan progres — tanpa lock sequential (pos semua kebuka, urutan bebas).

## MODIFIED Requirements

### Requirement: Verifikasi password pos server-side
`POST /api/pos/:id/verify` (rate-limit 10 req/menit/IP) membandingkan `code` dengan baris aktif di `pos_codes` untuk (team, pos). Code TIDAK statis — digenerate ketua per regu. Sukses → code dihanguskan (`used_at`), catat baris `team_progress` + publish event SSE `progress`. (Dulu: password statis bcrypt di `positions` — diganti one-time code per keputusan owner 28 Okt.)

#### Scenario: Password benar
- **WHEN** regu kirim code yang cocok dengan code belum terpakai untuk (team, pos)
- **THEN** progres pos tercatat, code hangus, event `progress` dipublish

#### Scenario: Password salah
- **WHEN** code tidak cocok atau `used_at` sudah terisi (termasuk dipakai ulang)
- **THEN** response 401, tidak ada progres tercatat

#### Scenario: Rate limit
- **WHEN** satu IP kirim > 10 request verify dalam 1 menit
- **THEN** request berikutnya ditolak (429) sampai jendela waktu lewat

## REMOVED Requirements

- **REMOVED**: Verifikasi password pos statis (hash di tabel `positions`) — diganti one-time code per regu.
- **REMOVED**: Lock sequential server-side (`isPosAvailable` di verify & route guard) — POS semua kebuka sesuai keputusan owner 28 Okt.
