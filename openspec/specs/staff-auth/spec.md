# staff-auth Specification

## Purpose
Auth staff (admin/ketua panitia) via session cookie httpOnly + bcrypt, menggantikan kredensial hardcoded di client.

## Requirements

### Requirement: Login/logout staff
`POST /api/auth/login` memverifikasi username + bcrypt hash dari tabel `staff` dan men-set session cookie httpOnly. `POST /api/auth/logout` (staff) menghapus session. Tidak ada kredensial di client bundle; tidak ada `dummyAccounts`.

#### Scenario: Login benar
- **WHEN** staff kirim kredensial valid
- **THEN** session cookie httpOnly ter-set dan halaman role-nya bisa diakses

#### Scenario: Login salah
- **WHEN** username/password salah
- **THEN** response 401, tidak ada cookie ter-set

#### Scenario: Logout
- **WHEN** staff (admin maupun ketua) logout
- **THEN** session clear di server dan client, akses ke halaman role ditolak setelahnya

### Requirement: Role guard API
`server/middleware/auth.ts` melindungi endpoint staff: `/api/admin/*` & `/api/scores` butuh session valid; endpoint tertentu butuh role `ketua`/`admin`.

#### Scenario: Akses tanpa login
- **WHEN** request tanpa session cookie hit endpoint staff
- **THEN** response 401

#### Scenario: Role salah
- **WHEN** role `ketua` hit endpoint khusus `admin` (atau sebaliknya, sesuai matriks)
- **THEN** response 403

### Requirement: Role guard halaman
`middleware/auth.global.ts` (client) melindungi `/admin/*` untuk role admin dan `/ketua/*` untuk role ketua — tidak ada halaman terbuka tanpa login.

#### Scenario: Bypass URL tanpa login
- **WHEN** anonim membuka `/admin/overview`
- **THEN** redirect ke halaman login
