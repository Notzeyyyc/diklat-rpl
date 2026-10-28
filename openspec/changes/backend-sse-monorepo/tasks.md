# Tasks

## 1. Fase 0 — Bug blocker (repo lama, commit per app)

- [x] 1.1 dashboard: verifikasi patch lokal `:menu="{ modal: false }"` di kedua layout, commit
- [x] 1.2 dashboard: bungkus `<UApp>` di `app/app.vue`, verifikasi toast muncul
- [x] 1.3 quest: guard `/pos/[id]` tambah cek `isPosAvailable`, redirect ke `/pos` jika terkunci
- [x] 1.4 quest: ganti SCAN QR tanpa password → alur jujur (disable / label stub) sambil menunggu fitur kamera asli
- [x] 1.5 quest: validasi `route.query.done` dengan `isValidPos` + `isPosCompleted`
- [x] 1.6 quest: FormInput — hapus `required` native / tambah `novalidate` + validasi alfanumerik jalan
- [x] 1.7 quest: hapus `user-scalable=no` + 1 stylesheet Material Symbols duplikat
- [x] 1.8 Verifikasi Fase 0 via Playwright (klik jalan kedua app, 375/414px) → commit

## 2. Fase 1 — Monorepo + backend/SSE di quest

- [x] 2.1 Buat monorepo fresh di `/root/diklat`: pnpm-workspace.yaml, root package.json, pindahkan kode ke `apps/dashboard` & `apps/quest`, commit OpenSpec artifacts, `pnpm -r build` hijau
- [x] 2.2 `packages/shared`: types.ts, positions.ts, api-contract.ts, schema.sql (dari briefing), `@diklat/shared` ter-resolve di kedua app
- [x] 2.3 Setup Postgres di VPS2 + jalankan schema.sql + seed 5 pos (bcrypt) & 10 tim
- [x] 2.4 `server/utils/db.ts` (postgres.js singleton globalThis) + `server/utils/bus.ts` (EventEmitter globalThis)
- [x] 2.5 Endpoint `POST/GET /api/teams` + rate limit Map 10 req/menit/IP
- [x] 2.6 Endpoint `POST /api/pos/:id/verify` — hash compare server-side, cek `isPosAvailable` server-side, catat team_progress, publish `progress`
- [x] 2.7 `server/api/events.get.ts` SSE + heartbeat 25s
- [x] 2.8 Composable `useRealtime()` (client-only, reconnect, fallback polling 5s, close di onUnmounted); grid `/pos` & `/pos/progress` subscribe
- [x] 2.9 Refactor `useGameState`: sumber kebenaran API, `team_id` di localStorage, load sekali di plugin client (fix hydration mismatch)
- [x] 2.10 Scan QR kamera asli: baca QR → isi ke alur verify server yang sama; fallback input manual tanpa kamera
- [x] 2.11 Test quest: happy path + bypass guard + password salah; `pnpm -r build` hijau → commit

## 3. Fase 2 — Dashboard

- [ ] 3.1 Seed staff (bcrypt) + login `/api/auth/login` (h3 session httpOnly) + logout; hapus `dummyAccounts` & kredensial hardcoded
- [ ] 3.2 `server/middleware/auth.ts` (API guard role) + `middleware/auth.global.ts` (halaman) untuk `/admin/*` vs `/ketua/*`
- [ ] 3.3 Ganti semua data mock → `/api/admin/overview`; StatCard dari count DB
- [ ] 3.4 `POST /api/scores` (ketua/admin) + publish SSE; leaderboard & tracking subscribe `scores` live
- [ ] 3.5 Wire Print/Export CSV (escape koma/quote) atau hapus tombolnya; aktifkan POS Hub per-pos atau hapus tab
- [ ] 3.6 Test dashboard: login salah/benar, guard role, submit skor → SSE; `pnpm -r build` hijau → commit

## 4. Fase 3 — Mobile polish (kedua app)

- [ ] 4.1 Tap target ≥ 44px (nav item 32×24, CLUE 66×20, semua `size="sm"` path mobile → `md`)
- [ ] 4.2 Dashboard mobile: sidebar jadi slideover + tombol toggle
- [ ] 4.3 `maxlength` semua input + label `for`/`id` ter-asosiasi
- [ ] 4.4 Verifikasi Playwright 375/414px: 0 tap target < 44px, 0 overflow horizontal, semua klik jalan → commit

## 5. Verifikasi akhir

- [ ] 5.1 Uji end-to-end via tunnel: registrasi regu → verify pos → skor ketua → SSE live di kedua app
- [ ] 5.2 Grep client bundle: tidak ada password pos / kredensial staff / `dummyAccounts`
- [ ] 5.3 Deploy VPS2: systemd service kedua app + postgres, `.env` gitignore, backup pg_dump harian
- [ ] 5.4 `openspec validate backend-sse-monorepo` lulus → siap di-archive
