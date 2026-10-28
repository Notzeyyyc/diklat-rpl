# Design

## Context

Dua app Nuxt 4 frontend-murni di `~/diklat-review/` (laporan review & QA: `report-diklat-rpl-dashboard.md`, `report-mobile-ui-kelompok-diklat.md`). Lengkapnya lihat briefing `briefing-refactor-sse.md` (rev.2). Monorepo dibuat di `/root/diklat`, OpenSpec root sudah di-init di sana.

## Goals / Non-Goals

**Goals:**
- Backend Nitro + Postgres + SSE di kedua app, satu DB.
- Password pos & kredensial keluar dari client.
- Progres & skor live di kedua arah.

**Non-Goals:**
- Rewrite framework, websocket vendor (Supabase/Pusher), ORM.
- Rombak struktur komponen / design system — visual tidak diubah.
- LISTEN/NOTIFY Postgres (single-instance; upgrade path kalau multi-instance).
- Fallback SQLite offline (keputusan owner: tidak).
- Domain produksi + Caddy — demo pakai tunnel/trycloudflare, Caddy menyusul.

## Decisions

- **Monorepo pnpm workspaces, fresh git history** (owner setuju): `apps/dashboard`, `apps/quest`, `packages/shared`. Alternatif git subtree ditolak — tidak ada nilai riwayat lama yang layak biaya merge-nya.
- **Driver `postgres` (postgres.js)**, tag template anti-SQL-injection, singleton koneksi di `globalThis` (HMR-safe). Tanpa ORM (YAGNI; Drizzle kalau schema membesar).
- **SSE via EventEmitter in-memory** `globalThis.__diklatBus`, publish setelah INSERT/UPDATE sukses. Heartbeat ping 25s. Client `useRealtime()`: EventSource client-only + fallback polling 5s setelah 3x error.
- **Auth h3 `useSession` + bcryptjs**: cookie httpOnly, tabel `staff`, `server/middleware/auth.ts` (API) + `middleware/auth.global.ts` (halaman). bcryptjs dipilih (pure JS, tanpa build native) atas `bcrypt`.
- **Scan QR kamera asli** (keputusan owner): QR berisi password pos, hasil scan masuk alur verify server yang sama. Library scanner: pakai `BarcodeDetector API` bila ada, fallback kecil ke library scanner ringan jika perlu — keputusan di fase implementasi, jangan bawa lib besar tanpa perlu.
- **Rate limit verify/registrasi**: Map in-memory 10 req/menit/IP — cukup untuk single-instance.
- **Seed**: 5 pos (password bcrypt) + 10 tim, dari script di `packages/shared`. Sizing asumsi 40 regu, angka tidak di-hardcode.

## Risks / Trade-offs

- [EventEmitter in-memory hilang saat restart] → SSE hanya broadcast live; state kebenaran tetap DB; client re-fetch on connect.
- [SSE lewat tunnel/proxy bisa diputus] → heartbeat 25s + fallback polling sudah dispesifikasi; SSE tidak boleh jadi blocker.
- [OpenSpec root di `/root/diklat` terpisah dari repo lama] → Fase 0 dikerjakan di repo lama, commit; isi lama dipindah (fresh) ke monorepo; OpenSpec artifacts ikut masuk repo monorepo.
- [Provider sub-agent sering putus] → kerja per fase kecil, file ditulis incremental, commit per fase.

## Migration Plan

1. Fase 0 fix di repo lama + commit (verifikasi klik jalan via Playwright).
2. Buat monorepo fresh, pindahkan kode kedua app, `pnpm -r build` hijau → commit.
3. Setup Postgres (self-host VPS2, `DATABASE_URL` di `.env` gitignore), jalankan `schema.sql`, seed.
4. Backend quest dulu (pola bukti), lalu dashboard. Commit per fase, tiap fase `pnpm -r build` + happy path jalan.
5. Demo via `cloudflared tunnel --url`; deploy VPS2 172.104.166.179 (spec produksi sekolah: 4 vCPU/8GB, lihat briefing §6).

Rollback: tiap fase = 1 commit; revert commit fase terakhir cukup.

## Open Questions

Tidak ada — 3 unknown briefing sudah dijawab owner (27 Okt): QR = fitur asli, history = fresh, fallback SQLite = tidak.
