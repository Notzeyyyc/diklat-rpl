# Proposal

## Why

Keputusan owner 28 Okt (override design `backend-sse-monorepo`):
1. **POS semua kebuka** — lock sequential DIHAPUS TOTAL. Regu bebas kerjakan pos 1–5 urutan bebas. Panel ketua bagian giliran/antrian (GILIRAN AKTIF, ANTRIAN, Regu Berikutnya) DIHAPUS.
2. **Password pos statis DIGANTI** one-time code per regu yang digenerate ketua. Regu datang ke pos → ketua klik Generate → code random muncul (plain + QR) → regu input/scan → verified sekali, code hangus. Salah ketik → minta generate baru.

## What Changes

- **BREAKING**: hapus guard sequential di server (`isPosAvailable` di verify), di client (route guard `/pos/[id]`, PosGrid/PosButton lock), dan helper `isPosAvailable` di `@diklat/shared`.
- **BREAKING**: tabel `positions.password_hash` dihapus; password statis seed (`RPLJUARA1..5`) dihapus dari seed & repo.
- Tabel baru `pos_codes` (team_id, position_id, code, used_at). `POST /api/admin/pos-codes` (ketua/admin) generate code 6 karakter random; code lama yang belum terpakai untuk pasangan sama di-invalidate.
- Verifikasi pos: `POST /api/pos/:id/verify` menerima `code` (bukan password), cocokkan ke `pos_codes` yang belum hangus; sukses → tandai hangus (`used_at`) + catat progres + publish SSE.
- Panel ketua: hapus kartu GILIRAN AKTIF / ANTRIAN STANDBY / tombol Regu Berikutnya. Tambah kartu Generate Code (pilih regu + pos → tampilkan code plain + QR) dan input skor pakai pilihan regu & pos manual.

## Capabilities

### Modified Capabilities
- `quest-verification`: lock sequential dihapus; verifikasi pakai one-time code.

### New Capabilities
- `pos-code`: one-time code per regu per pos, digenerate ketua, hangus setelah dipakai.

## Impact

- Semua app: quest (verify + UI lock), dashboard (panel + endpoint), shared (schema, helper, kontrak).
- Dependency baru: `qrcode` (dashboard, render QR code).
