# DIKLAT 2026 Admin Portal

Dashboard admin untuk mengelola kegiatan DIKLAT 2026 Himpunan RPL. Dibangun dengan **Nuxt 4**, **Nuxt UI v4**, dan gaya visual **Neubrutalist** yang bold dan kontras.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3 + TypeScript)
- **UI Library:** Nuxt UI v4
- **Styling:** Tailwind CSS v4 + Custom Neubrutalist CSS Utilities
- **Font:** Space Grotesk (Display/Body) + JetBrains Mono (Label/Mono)
- **Icons:** Lucide Icons (via Nuxt UI)

## Design System: Neubrutalist Cadre Admin

### Warna

| Token | Kegunaan | Hex |
|---|---|---|
| Primary | Tombol aktif, navigasi, aksi utama | `#0046CB` |
| Primary Container | Badge aktif, header aksi | `#0A5CFF` |
| Secondary | Status berhasil, konfirmasi | `#006B5F` |
| Secondary Container | Badge sukses, progress | `#62FAE3` |
| Tertiary | Warning, alert, antrian | `#735C00` |
| Tertiary Container | Badge warning, skor tinggi | `#CEA700` |
| Danger | Error, hapus, kritis | `#FF4B4B` |
| Surface | Background utama | `#FCF9F8` |
| Surface Container | Background sekunder, card | `#F0EDEC` |
| Ink | Border, teks utama, shadow | `#111111` |

### Typography

| Level | Font | Size | Weight | Kegunaan |
|---|---|---|---|---|
| Display LG | Space Grotesk | 44px | 700 | Judul hero, angka besar |
| Headline LG | Space Grotesk | 32px | 700 | Judul section |
| Headline MD | Space Grotesk | 24px | 700 | Sub-judul |
| Headline SM | Space Grotesk | 20px | 600 | Card title |
| Title MD | Space Grotesk | 16px | 600 | Nama item, label tombol |
| Body MD | Space Grotesk | 14px | 400 | Teks deskripsi |
| Body SM | Space Grotesk | 12px | 400 | Teks kecil, caption |
| Label MD | JetBrains Mono | 13px | 600 | Badge, metadata |
| Label SM | JetBrains Mono | 11px | 600 | Tag kecil, ID |

### Elevation & Shadow

| Level | Shadow | Kegunaan |
|---|---|---|
| SM | `2px 2px 0px #111111` | Badge, small elements |
| MD | `4px 4px 0px #111111` | Cards, buttons |
| LG | `6px 6px 0px #111111` | Tables, modals |
| XL | `8px 8px 0px #111111` | Hero elements |
| Active | `translate(2px, 2px)` + shadow hilang | State tombol ditekan |

### Border

- **Thin:** `2px solid #111111` (input, badge, elemen kecil)
- **Thick:** `3px solid #111111` (card, table, sidebar, tombol utama)

## Struktur Projek

```
app/
  assets/
    css/
      main.css              # CSS utilities neubrutalist + theme tokens
  components/
    NeoCard.vue             # Card container dengan border & shadow
    PageHeader.vue          # Header halaman dengan badge & judul
    StatCard.vue            # Kartu statistik metric
    StatusBadge.vue         # Badge status (active/completed/warning/danger)
  layouts/
    admin.vue               # Layout admin dengan sidebar navigasi
    ketua.vue               # Layout ketua post dengan sidebar navigasi
    login.vue               # Layout halaman login
  pages/
    index.vue               # Redirect ke /login
    login.vue               # Halaman login
    admin/
      tracking-murid.vue    # Monitoring posisi & status kelompok
      leaderboard.vue       # Klasemen & peringkat tim
      tracking-pos.vue      # Pemantauan tiap pos evaluasi
      pos-evaluation-hub.vue # Hub monitoring ruang evaluasi
    ketua/
      panel.vue             # Panel operasional ketua post
      riwayat.vue           # Riwayat penilaian di pos
      akun.vue              # Pengaturan akun ketua post
  app.vue                   # Root component
  app.config.ts             # Nuxt UI theme overrides
```

## Halaman & Fitur

### Admin Pages

| Halaman | Route | Deskripsi |
|---|---|---|
| Tracking Murid | `/admin/tracking-murid` | Real-time monitoring posisi 15 kelompok, filter by pos & status, export CSV |
| Leaderboard | `/admin/leaderboard` | Klasemen lengkap dengan podium 3 besar, distribusi skor per pos, audit feed |
| Tracking Pos | `/admin/tracking-pos` | Pemantauan 5 pos evaluasi, activity log real-time |
| Pos Evaluation Hub | `/admin/pos-evaluation-hub` | Monitoring ruang evaluasi per pos, antrian standby, data panitia |

### Ketua Pages

| Halaman | Route | Deskripsi |
|---|---|---|
| Panel Operasional | `/ketua/panel` | Giliran aktif, antrian standby, submit skor, info panitia |
| Riwayat Penilaian | `/ketua/riwayat` | Log semua penilaian yang dilakukan, filter & export |
| Akun | `/ketua/akun` | Edit profil, pengaturan notifikasi, keamanan akun |

## Komponen Reusable

### NeoCard
Card container dengan neubrutalist border & shadow. Mendukung header, footer, dan badge.

```vue
<NeoCard title="JUDUL" icon="i-lucide-icon" badge="LABEL">
  <template #header>...</template>
  <template #footer>...</template>
  Default slot content
</NeoCard>
```

### StatCard
Kartu metrik untuk menampilkan angka statistik dengan icon berwarna.

```vue
<StatCard
  label="LABEL STATISTIK"
  value="123"
  subtext="Keterangan tambahan"
  icon="i-lucide-icon"
  color="primary"
/>
```

### StatusBadge
Badge status dengan warna dinamis berdasarkan state.

```vue
<StatusBadge label="ACTIVE" status="active" />
<StatusBadge label="COMPLETED" status="completed" />
<StatusBadge label="STANDBY" status="standby" />
```

Status yang tersedia: `success`, `warning`, `danger`, `info`, `active`, `pending`, `completed`, `standby`, `busy`

### PageHeader
Header halaman dengan badge, judul, deskripsi, dan action slot.

```vue
<PageHeader
  badge="LABEL BADGE"
  badge-color="primary"
  title="JUDUL HALAMAN"
  description="Deskripsi singkat"
>
  <template #actions>
    <UButton>Action</UButton>
  </template>
</PageHeader>
```

## Akun Default

| Username | Password | Role | Redirect |
|---|---|---|---|
| `admin` | `admin123` | Admin | `/admin/tracking-murid` |
| `ketua` | `ketua123` | Ketua Post | `/ketua/panel` |

## Cara Menjalankan

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

## Catatan Pengembangan

- Semua komponen menggunakan CSS utilities neubrutalist yang didefinisikan di `main.css`
- Shadow dan border diatur konsisten melalui `app.config.ts` untuk Nuxt UI components
- Layout admin & ketua menggunakan `UDashboardSidebar` dengan styling custom
- Semua tabel memiliki border thick dan shadow XL untuk penekanan visual
- Tombol memiliki 3 state: default, hover (shadow naik), active (translate + shadow hilang)
