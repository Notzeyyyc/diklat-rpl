# pos-code Specification

## Purpose
One-time code per regu per pos, digenerate ketua dari panel dashboard, ditampilkan plain + QR, hangus sekali pakai.

## Requirements

### Requirement: Generate code oleh ketua
`POST /api/admin/pos-codes` (role `admin`/`ketua`, session cookie) menerima `teamId` + `positionId` (1–5), mengembalikan code 6 karakter random. Code lama yang belum terpakai untuk pasangan (team, pos) di-invalidate — selalu tepat satu code aktif.

#### Scenario: Generate sukses
- **WHEN** ketua pilih regu & pos lalu klik Generate
- **THEN** response berisi code baru; panel menampilkan code plain dan QR berisi code tersebut

#### Scenario: Generate ulang
- **WHEN** ketua generate lagi untuk pasangan yang sama
- **THEN** code lama yang belum terpakai tidak lagi valid; code baru yang aktif

### Requirement: Code sekali pakai
Code aktif hangus setelah verifikasi pos sukses dengan code itu. Salah ketik → regu minta generate baru ke ketua.

#### Scenario: Code dipakai ulang
- **WHEN** regu kirim code yang sudah hangus
- **THEN** verifikasi gagal 401
