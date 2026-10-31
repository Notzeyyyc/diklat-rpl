# mobile-usability Specification

## Purpose
Kedua app nyaman dan bisa dipakai di layar 375/414px: tap target cukup, layout tidak menimpa konten, form aksesibel.

## Requirements

### Requirement: Tap target minimal 44px
Semua elemen interaktif di mobile punya tap target ≥ 44px (nav item dashboard, tombol CLUE, semua tombol `size="sm"` di path mobile).

#### Scenario: Audit tap target
- **WHEN** halaman kedua app diuji di viewport 375px
- **THEN** tidak ada elemen interaktif dengan tap target < 44px

### Requirement: Sidebar dashboard tidak menimpa konten
Di mobile, sidebar dashboard jadi slideover dengan tombol toggle — bukan block full-width di atas konten. Klik di seluruh app berfungsi (fix `<UDashboardSidebar>` modal lock tetap ada).

#### Scenario: Buka dashboard di 375px
- **WHEN** halaman dashboard dibuka di viewport 375px
- **THEN** konten terlihat penuh, sidebar hanya muncul saat toggle, 0 overflow horizontal

### Requirement: Form aksesibel
Semua input punya `maxlength` dan label ter-asosiasi (`for`/`id`).

#### Scenario: Audit label
- **WHEN** form di-scan
- **THEN** setiap input punya label ter-asosiasi dan batas panjang
