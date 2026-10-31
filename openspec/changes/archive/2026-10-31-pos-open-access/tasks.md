# Tasks

## 1. Shared
- [x] Hapus `isPosAvailable` dari `positions.ts`
- [x] Kontrak: `VerifyPosRequest.password` → `code`; tambah `GeneratePosCodeRequest/Response`
- [x] `schema.sql`: drop `positions.password_hash`, tambah tabel `pos_codes`
- [x] `seed.ts`: hapus password pos statis

## 2. Quest
- [x] `verify.post.ts`: hapus guard sequential + bcrypt; cocokkan one-time code, hanguskan
- [x] `useGameState.ts`: hapus `isPosAvailable`
- [x] `/pos/[id].vue`, `pos/index.vue`, `pos/progress.vue`: hapus lock, field `code`
- [x] `PosGrid.vue` / `PosButton.vue`: hapus state LOCKED

## 3. Dashboard
- [x] Endpoint `POST /api/admin/pos-codes` (ketua/admin)
- [x] Middleware: izinkan ketua di `/api/admin/pos-codes`
- [x] `panel.vue`: hapus GILIRAN AKTIF/ANTRIAN/Regu Berikutnya; kartu Generate Code (plain + QR); skor pilih regu & pos manual

## 4. Verifikasi
- [x] Migrasi dev DB (drop kolom, buat tabel)
- [x] Update tests quest & dashboard; `pnpm -r build` hijau
- [x] Test run hijau (kedua app); grep bundle 0 hit password lama
- [x] Commit
