# DIKLAT 2026 - Orientation Quest

Aplikasi web mobile-first untuk orientasi DIKLAT 2026 dengan konsep **Modern Neubrutalism**. Dirancang untuk pengalaman gamifikasi pos-to-pos bagi mahasiswa.

## Tech Stack

- **Framework**: Nuxt 4 + Vue 3
- **Styling**: Tailwind CSS 6
- **Font**: Space Grotesk (500/700/800)
- **Icons**: Material Symbols Outlined

## Setup

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka `http://localhost:3000`

## Struktur Folder

```
ui-kelompok-diklat/
├── nuxt.config.ts                   # Konfigurasi Nuxt (fonts, modules)
├── tailwind.config.ts               # Design tokens (warna, font, spacing, shadows)
│
├── app/                             # Source files (Nuxt 4 structure)
│   ├── app.vue                      # Root application layout
│   │
│   ├── assets/
│   │   └── css/
│   │       └── main.css             # Custom CSS & utility classes neubrutalist
│   │
│   ├── layouts/
│   │   └── default.vue              # Default layout (container max-w-[30rem])
│   │
│   ├── pages/                       # Halaman aplikasi (file-based routing)
│   │   ├── index.vue                # Page 1 - Registrasi Kelompok
│   │   └── pos/
│   │       ├── index.vue            # Page 2 - Pilih Pos (Awal)
│   │       ├── [id].vue             # Page 3 - Puzzle Pos (dynamics)
│   │       └── progress.vue         # Page 4 - Pilih Pos (Progres)
│   │
│   ├── components/                  # Komponen UI (auto-import Nuxt)
│   │   │
│   │   │   # === Layout & Navigation ===
│   │   ├── AppHeader.vue            # Header "DIKLAT 2026 by Himpunan RPL"
│   │   ├── BackLink.vue             # Tombol navigasi kembali
│   │   │
│   │   │   # === Form Components ===
│   │   ├── FormInput.vue            # Input field dengan v-model
│   │   ├── FormButton.vue           # Tombol submit dengan loading state
│   │   ├── FormHint.vue             # Hint/validasi pesan error
│   │   ├── PasswordInput.vue        # Input password dengan label
│   │   ├── ValidationMessage.vue    # Pesan validasi (success/error)
│   │   │
│   │   │   # === Card Components ===
│   │   ├── RegistrationCard.vue     # Card registrasi dengan step label
│   │   ├── ProcedureCard.vue        # Card prosedur langkah-langkah
│   │   ├── HelperNote.vue           # Card catatan petunjuk
│   │   ├── PuzzleCard.vue           # Card puzzle (slide 1/2)
│   │   │
│   │   │   # === Status & Indicators ===
│   │   ├── StatusRibbon.vue         # Ribbon status (CHECK-IN AKTIF)
│   │   ├── StatusIndicator.vue      # Indicator "SYSTEM READY" dengan animasi
│   │   │
│   │   │   # === Navigation & Grid ===
│   │   ├── PosButton.vue            # Tombol pos (completed/available/locked)
│   │   ├── PosGrid.vue              # Grid 2-2-1 layout pos selection
│   │   │
│   │   │   # === Progress & Team ===
│   │   ├── TeamStatusBanner.vue     # Banner status tim + online indicator
│   │   ├── ProgressHeader.vue       # Header "PILIH POS"
│   │   ├── ProgressStrip.vue        # Strip progress + team info
│   │   ├── ProgressBar.vue          # Segmented progress bar
│   │   │
│   │   │   # === Puzzle & QR ===
│   │   ├── PuzzleHeader.vue         # Header pos puzzle
│   │   ├── QRScanner.vue            # Section QR scanner
│   │   │
│   │   │   # === Notifications ===
│   │   └── SuccessToast.vue         # Toast notifikasi sukses
│   │
│   └── composables/                 # Composition API hooks
│       └── useGameState.ts          # State management (group, pos, progress)
│
├── server/                          # Server-side logic (Nitro)
└── public/                          # Static assets
```

## Halaman (Pages)

### Page 1 - Registrasi Kelompok (`/`)
- Input nama kelompok (min 3 karakter)
- Validasi form real-time
- Submit → navigasi ke halaman pos

### Page 2 - Pilih Pos Awal (`/pos`)
- Banner status tim + "ONLINE"
- Grid 5 pos (2-2-1 layout)
- Setiap pos: AVAILABLE / LOCKED / COMPLETED
- Catatan petunjuk lapangan

### Page 3 - Puzzle Pos (`/pos/:id`)
- Header pos dengan status aktif
- Puzzle card (2 slide):
  - Slide 1: Bit stream puzzle + password input
  - Slide 2: Clue/petunjuk dekripsi
- QR Scanner section
- Prosedur misi (4 langkah)
- Tombol kembali

### Page 4 - Pilih Pos Progres (`/pos/progress`)
- Progress strip dengan segmented bar
- Grid pos dengan status completed/available
- Toast notifikasi pos selesai

## State Management

```typescript
// app/composables/useGameState.ts
const { state, registerGroup, selectPos, completePos, progress } = useGameState()

// state.groupName     - Nama kelompok
// state.teamName      - Nama tim (uppercase)
// state.completedPos  - Array pos yang selesai
// state.totalPos      - Total pos (5)
// progress            - Computed: jumlah pos selesai
```

## Design System

### Warna
| Token | Hex | Kegunaan |
|-------|-----|----------|
| `primary` | `#0046cb` | Tombol utama, aksi |
| `primary-container` | `#0a5cff` | Background tombol |
| `secondary-container` | `#62fae3` | Status selesai |
| `tertiary` | `#9b2d00` | Peringatan |
| `surface` | `#fcf9f8` | Background utama |
| `neutral` | `#111111` | Border, shadow |

### Neubrutalist Style
- Border: `3px solid #111111`
- Shadow: `4px 4px 0px #111111`
- Pressed: `translate(2px, 2px)` + shadow turun
- Border radius: `12px` (cards)

### Typography
- **Display**: 32px / 800 weight
- **Headline**: 18-28px / 700 weight
- **Body**: 12-16px / 500 weight
- **Label**: 11-15px / 700 weight (uppercase)

## Navigasi

```
/ (Registrasi)
  └── Submit → /pos

/pos (Pilih Pos)
  └── Click pos → /pos/:id

/pos/:id (Puzzle)
  └── Verifikasi password → Complete pos → /pos

/pos/progress (Progress View)
  └── Click pos → /pos/:id
```

## Development

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## License

Created for DIKLAT 2026 Orientation Quest by Himpunan RPL.
