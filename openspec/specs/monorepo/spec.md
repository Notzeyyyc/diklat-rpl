# monorepo Specification

## Purpose
Struktur monorepo pnpm workspaces yang menyatukan kedua app dan `packages/shared` sebagai single source of truth schema & tipe.

## Requirements

### Requirement: Workspace monorepo
Repo tunggal berisi `apps/dashboard`, `apps/quest`, `packages/shared` via pnpm workspaces. `pnpm -r build` harus sukses.

#### Scenario: Build semua app dari root
- **WHEN** `pnpm -r build` dijalankan di root monorepo
- **THEN** kedua app Nuxt ter-build sukses tanpa error

### Requirement: Shared package sebagai satu sumber kebenaran
`packages/shared` memuat `schema.sql`, `types.ts` (Team/Position/Score/ProgressEvent), `positions.ts` (pos 1..5 & konstanta), `api-contract.ts`. Apps TIDAK BOLEH mendefinis ulang tipe/konstanta tersebut; semua import dari `@diklat/shared`. Migrasi SQL hanya dijalankan dari `packages/shared`.

#### Scenario: Konstanta pos hanya di satu tempat
- **WHEN** app butuh daftar pos
- **THEN** ia mengimpor dari `@diklat/shared`, dan grep di `apps/*` tidak menemukan definisi duplikat daftar pos

### Requirement: Riwayat git fresh
Monorepo memulai riwayat git baru (keputusan owner: fresh, bukan git subtree).

#### Scenario: Initial commit monorepo
- **WHEN** monorepo di-commit pertama kali
- **THEN** riwayat hanya berisi commit monorepo, kedua kode app ada di tree awal
