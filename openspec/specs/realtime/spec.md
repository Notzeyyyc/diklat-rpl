# realtime Specification

## Purpose
Update realtime satu arah (server → client) via SSE, tanpa dependensi realtime eksternal, dengan fallback polling.

## Requirements

### Requirement: Endpoint SSE
`GET /api/events` (publik) stream JSON per event. Event type: `progress` (progres pos regu) dan `scores` (skor baru). Format event: `data: {"type":"progress"|"scores","teamId":"...","positionId":3,"score":85,"at":"..."}\n\n`. Kedua app expose endpoint yang sama dari bus yang sama (DB sama).

#### Scenario: Verify pos memicu event
- **WHEN** regu berhasil verify pos di quest
- **THEN** subscriber SSE di quest DAN dashboard menerima event `progress` untuk regu tsb tanpa refresh

### Requirement: Heartbeat
Server kirim `data: {"type":"ping"}` tiap 25 detik agar proxy/CDN tidak memutus stream idle.

#### Scenario: Stream idle 30 detik
- **WHEN** tidak ada event bisnis selama 30 detik
- **THEN** minimal satu event `ping` sudah terkirim dan stream masih hidup

### Requirement: Client subscribe dengan reconnect + fallback
Composable `useRealtime()` membuka `new EventSource('/api/events')` (client-only, tidak pernah saat SSR), auto-reconnect bawaan browser, dan fallback polling 5 detik jika EventSource gagal 3x. EventSource di-close di `onUnmounted`.

#### Scenario: Koneksi buruk
- **WHEN** EventSource error 3 kali berturut-turut
- **THEN** client beralih ke polling 5 detik dan UI tetap dapat update

#### Scenario: Cleanup
- **WHEN** komponen yang subscribe di-unmount
- **THEN** EventSource/polling dihentikan, tidak ada leak koneksi

### Requirement: Publish setelah tulis sukses
Event hanya dipublish SETELAH INSERT/UPDATE DB sukses. Tidak ada event untuk operasi gagal.

#### Scenario: Verify gagal
- **WHEN** verifikasi password gagal
- **THEN** tidak ada event dipublish
