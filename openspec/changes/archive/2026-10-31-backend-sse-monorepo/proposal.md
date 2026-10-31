# Proposal

## Why

Kedua app (dashboard & quest) murni frontend tanpa backend: kredensial hardcoded di client, password pos terbaca di bundle, progres hilang saat tab ditutup, lock sequential bisa di-bypass via URL, dan data tidak sinkron antar app. Event Diklat butuh satu sumber kebenaran (Postgres) + update realtime satu arah (SSE).

## What Changes

- **BREAKING**: Gabung `diklat-rpl-dashboard` + `ui-kelompok-diklat` ke monorepo pnpm workspaces — `apps/dashboard`, `apps/quest`, `packages/shared` (fresh git history, konfirmasi owner 27 Okt).
- Backend Nitro: Postgres via `postgres` (postgres.js), tanpa ORM. Schema migrasi di `packages/shared/schema.sql` (staff, teams, positions, team_progress, scores).
- Realtime SSE: `/api/events` per app + EventEmitter in-memory (`globalThis.__diklatBus`), fallback polling 5s di client.
- Auth: session cookie httpOnly (h3) + bcrypt untuk role `admin`/`ketua`; guard API + guard halaman.
- Password pos pindah ke server (hash di tabel `positions`); verifikasi via `POST /api/pos/:id/verify` dengan rate limit.
- Regu anon: identitas = `team_id` di localStorage (bukan sessionStorage).
- Fase 0 bug blocker kedua app (klik mati `<UDashboardSidebar>`, toast tanpa `<UApp>`, guard bypass `/pos/[id]`, SCAN QR tanpa password, query `?done` mentah, validasi FormInput, `user-scalable=no`, stylesheet duplikat).
- **BREAKING**: SCAN QR jadi fitur kamera asli (keputusan owner 27 Okt) — verifikasi password pos lewat scan QR berisi password.
- Dashboard: data mock → endpoint DB, StatCard dari count DB, logout bener, Print/Export CSV di-wire, tab POS Hub aktif.
- Mobile polish: tap target ≥ 44px, sidebar jadi slideover di mobile, `maxlength`, label ter-asosiasi.

## Capabilities

### New Capabilities
- `monorepo`: struktur pnpm workspaces + `packages/shared` sebagai single source of truth (schema.sql, types, konstanta pos, kontrak API).
- `quest-verification`: registrasi regu, verifikasi password pos server-side, catat progres, lock sequential di server, scan QR kamera sebagai cara input password.
- `realtime`: SSE stream event `progress` & `scores`, heartbeat, auto-reconnect, fallback polling.
- `staff-auth`: login/logout staff (admin/ketua) via session cookie httpOnly + bcrypt, role guard API & halaman.
- `dashboard-data`: overview, leaderboard, tracking skor dari Postgres, submit skor → publish SSE, export CSV.
- `mobile-usability`: tap target ≥ 44px, layout mobile tanpa overflow, form aksesibel.

### Modified Capabilities

(tidak ada — belum ada spec lama)

## Impact

- Kedua app: data layer baru, auth baru. Visual/design system TIDAK diubah.
- Dependency baru hanya: `postgres`, `bcryptjs`. SSE & EventSource native.
- Deploy: 1 VPS, Caddy reverse proxy (quest :3000, dashboard :3001), 1 instance Postgres.
