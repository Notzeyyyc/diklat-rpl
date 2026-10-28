# Design

## Keputusan owner (FINAL — jangan litigasi ulang)

- POS semua kebuka, urutan bebas. Guard sequential server & client dihapus total.
- Password pos statis diganti one-time code per regu yang digenerate ketua; plain + QR; hangus sekali pakai; salah ketik → generate baru.
- Panel ketua tanpa giliran/antrian.

## Keputusan teknis

- **Code**: 6 karakter dari alphabet bebas-ambigu (`ABCDEFGHJKMNPQRSTUVWXYZ23456789`), via `crypto.randomInt`. Disimpan plain di `pos_codes` (bukan hash) — code ini memang ditampilkan ke regu, bukan rahasia jangka panjang; masa hidup singkat & sekali pakai.
- **Invalidasi**: generate baru untuk (team, pos) menghapus code lama yang belum terpakai (`delete ... where used_at is null`) — selalu tepat satu code aktif per pasangan.
- **Race-safety hangus**: `update pos_codes set used_at = now() where id = ... and used_at is null returning id` — kalau 0 baris (sudah hangus / dipakai paralel) → 401.
- **Schema**: `positions.password_hash` di-drop (statis tidak dipakai lagi); tabel `pos_codes` baru dengan FK ke teams & positions.
- **QR**: generate di client dashboard pakai `qrcode` (`toDataURL`), data URL `<img>`. Tidak perlu lib di quest — scanner `BarcodeDetector` yang sudah ada memindai isi code mentah.
- **Kontrak**: `VerifyPosRequest.password` → `code`. Endpoint baru `POST /api/admin/pos-codes` di dashboard, diizinkan untuk role `admin` dan `ketua` (menambah pengecualian di `server/middleware/auth.ts`).
- **Panel skor**: tanpa antrian, regu & pos dipilih manual di form skor.

## ponytail

- Code plain di DB tanpa hash: cukup untuk event 1 hari; hash kalau code berlaku lama.
- Tanpa expiry timestamp untuk code: hangus per pemakaian sudah sesuai kebutuhan; tambah `expires_at` kalau nanti code boleh kedaluwarsa.
