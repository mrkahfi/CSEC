---
name: webapp-ui-polish
description: "Standar Arsitektur & UI/UX Web App: Panduan merancang, membangun (build), dan memoles produk atau fitur web app profesional dari nol. Mencegah jebakan 'website artikel/blog padat teks' dengan menegakkan diferensiasi nilai visual, eliminasi rantai dot-separator (·), integrasi aset visual domain nyata, aksi berbasis ikon, dan tipografi berbobot."
metadata:
  author: User Feedback & Anti-Slop Engineering
  version: "1.1.0"
  category: SoftwareArchitectureAndUIUX
---

# Standar Arsitektur & UI/UX Web App (Build & Polish Framework)

Standar ini adalah panduan baku bagi AI coding agent dan software engineer ketika **merancang dan membangun fitur/produk baru dari nol (greenfield/feature build)** maupun ketika **memoles antarmuka yang sudah ada (polish/refactor)**.

Tujuannya adalah memastikan setiap layar, komponen, dan interaksi yang dibangun memiliki karakter **Web Application Profesional berstandar industri** (seperti Linear, Procore, Jira, GitHub Workspace), bukan **website artikel/blog yang monoton, padat teks, dan rempet-rempet**.

---

## 1. Paradigma Fundamental: Web App Workspace vs. Website Artikel

Ketika membangun produk atau fitur baru, selalu gunakan mental model **Workstation / Tool**, bukan **Halaman Bacaan**:

| Dimensi Arsitektur | ❌ Jebakan Website / Artikel (Slop) | ✅ Karakter Web App Profesional (Wajib) |
| :--- | :--- | :--- |
| **Pola Header** | Judul H1 diikuti 2-3 baris paragraf panjang yang menjelaskan fungsi halaman | Judul padat + badge entitas/status + toolbar aksi langsung (filter, search, view switcher) |
| **Diferensiasi Data** | Teks seukuran dan monoton, disambung dengan rantai titik (`A · B · C · D`) | Struktur token visual: *stacked layout*, *micro-icon chips*, badge semantik, grid terpisah |
| **Konteks & Bukti** | Nihil elemen visual; hanya deretan label, angka polos, dan teks link nama berkas | Menghadirkan *domain reality*: thumbnail kanvas visual (geotag HUD, kop surat, tabel SNI/ASTM, stempel resmi) |
| **Tombol & Aksi** | Tombol teks panjang berulang ("Tambah Baris", "Hapus Data") & panah dekoratif (`→`) | *Icon-first buttons* (`IconButton`) dengan tooltip aksesibel & affordance semantik (`ExternalLink`) |
| **Kuantitatif / KPI** | Angka kecil bercampur aduk di dalam paragraf atau tabel datar | Angka masif monospaced (`text-2xl font-mono font-bold`) + *micro-labels* + wadah ikon berwarna semantik |
| **Panduan & Overlay** | Modal box raksasa 3 kolom yang menutupi separuh layar kerja | HUD Toolbar mengambang yang ramping (*collapsed by default*, icon controls, step pills) |

---

## 2. Blueprint Membangun Fitur Baru (Feature Build Blueprint)

Gunakan 5 fase ini setiap kali membuat layar, modul, atau komponen baru:

### FASE 1: Scaffolding Layout Workspace (Struktur Layar)
Saat membuat file halaman baru (`pages/NamaFitur.tsx`), bangun layout dengan struktur workspace berikut:

```tsx
export function FiturView() {
  return (
    <>
      {/* 1. Header Ringkas: Judul + Entity Badge + Aksi Utama (Tanpa paragraf penjelas!) */}
      <PageHeader
        title="Daftar Pekerjaan Lapangan"
        meta={<Badge tone="neutral">14 aktif</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <IconButton icon={Download} label="Ekspor data" size="sm" variant="secondary" />
            <Button size="sm" variant="primary">
              <Plus size={14} /> Buat Permintaan
            </Button>
          </div>
        }
      />

      <PageBody className="space-y-4">
        {/* 2. Control Toolbar: Search + Filter Dropdown + Segmented View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput placeholder="Cari kode, lokasi, penanggung jawab..." className="w-72" />
          <Select aria-label="Filter status" wrapperClassName="w-48">
            <option value="">Semua Status</option>
            {/* Format dropdown enterprise: [KODE] Nama */}
            <option value="open">[OPEN] Menunggu Review</option>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            <SegmentedControl options={VIEW_OPTIONS} />
          </div>
        </div>

        {/* 3. Operational KPI Deck: Angka Masif + Micro-labels + Wadah Ikon Berwarna */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="TERLAMBAT"
            value={3}
            icon={OctagonAlert}
            tone="danger" // Wadah ikon merah, angka font-mono tebal
          />
          {/* ...stat tiles lainnya */}
        </div>

        {/* 4. Area Kerja / Data Workspace (Grid, Split View, atau Master-Detail) */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {/* Kartu data dengan diferensiasi visual */}
          </div>
          <div className="space-y-3">
            {/* Inspector / Panel Konteks Samping */}
          </div>
        </div>
      </PageBody>
    </>
  )
}
```

---

### FASE 2: Data Modeling & Entity Tokenization (Anti-Concatenation)
Saat mendesain *view model* atau merender atribut data, **HARAM** menggabungkan field dengan rantai string titik (` · `). Terapkan 4 pola tokenisasi visual ini:

#### Pola 1: Dua Baris Bertingkat (*Stacked Metadata*)
Gunakan untuk pasangan *Primary Entity* + *Supporting Meta*:
```tsx
// ❌ JANGAN PERNAH MENULIS INI:
<p className="text-xs text-ink-muted">{author.name} · {author.role} · {author.org}</p>

// ✅ WAJIB POLA STACKED:
<div>
  <span className="block text-xs font-semibold text-ink">{author.name}</span>
  <span className="flex items-center gap-1 text-2xs text-ink-muted">
    <span className="font-medium text-ink-secondary">{author.role}</span>
    <span className="rounded bg-sunken px-1.5 py-0.2">{author.org}</span>
  </span>
</div>
```

#### Pola 2: Micro-Icon + Label Chip
Gunakan untuk atribut fisik seperti Lokasi, Klien, Waktu, atau Mesin:
```tsx
// ❌ SLOP:
<p>{project.client} · {project.location} · {project.type}</p>

// ✅ WEB APP CHIPS:
<div className="flex flex-wrap items-center gap-2 text-xs">
  <span className="flex items-center gap-1 font-medium text-ink-secondary">
    <Building2 size={13} className="text-ink-muted" /> {project.client}
  </span>
  <span className="flex items-center gap-1 text-ink-secondary">
    <MapPin size={13} className="text-ink-muted" /> {project.location}
  </span>
  <span className="rounded bg-sunken px-2 py-0.5 text-2xs font-semibold text-ink-muted">
    {project.type}
  </span>
</div>
```

#### Pola 3: Status & Deadline Chips Mandiri
Status dan batas waktu harus memiliki wadah warna semantik, bukan sekadar kata di ujung string:
```tsx
// ❌ SLOP:
<span>{formatDateTime(task.dueAt)} · terlambat</span>

// ✅ SEMANTIC CHIP:
<div className="flex items-center gap-1.5">
  <span className="font-mono text-xs text-ink">{formatDateTime(task.dueAt)}</span>
  <span className="rounded bg-red-100 px-1.5 py-0.5 font-bold text-2xs text-red-700">
    Terlambat
  </span>
</div>
```

#### Pola 4: Dropdown Selector Enterprise
Gunakan format kurung siku untuk kode entitas agar terlihat seperti sistem enterprise:
```tsx
// ❌ SLOP:
<option value={p.id}>{p.code} · {p.name}</option>

// ✅ ENTERPRISE:
<option value={p.id}>[{p.code}] {p.name}</option>
```

---

### FASE 3: Integrasi Aset Visual Domain & Bukti Fisik (*Domain Reality*)
Aplikasi web profesional (khususnya untuk operasional, teknik, manufaktur, atau logistik) tidak boleh hanya berisi teks dan tautan unduh fiktif. Rancang aset visual konkret sejak awal:

#### 1. Thumbnail Kanvas Berbasis CSS/SVG
Buat kartu pratinjau yang merefleksikan wujud fisik dokumen atau objek lapangan:
- **Simulasi Foto Konstruksi/Pabrik**: Gunakan gradien CSS, grid garis baja/rebar, indikator toleransi dimensi (mis. `25.4 mm (OK)`), dan HUD geotag kamera lapangan (resolusi, ISO, GPS lat/long, stempel waktu WIB).
- **Berita Acara & Sertifikat Mutu**: Render tabel pengujian standar industri (SNI/ASTM), stempel stensil bersudut (`rotate-[-8deg] LULUS UJI`), dan kop laboratorium.
- **Laporan Harian Supervisi**: Format dokumen A4 dengan identitas konsultan, log cuaca, jumlah tenaga kerja, dan catatan supervisi.

#### 2. Modal Penampil Berkas Resolusi Penuh (`size="2xl"` / `max-w-5xl`)
Ketika thumbnail bukti diklik, buka modal berukuran lebar:
- **Kolom Kiri (60-65%)**: Kanvas grafis bukti visual atau dokumen dokumen utuh.
- **Kolom Kanan (35-40%)**: Panel inspektur teknis berisi spesifikasi kontrak, hasil ukur aktual, identitas pengambil foto, catatan pemeriksa, dan tombol unduh resmi.

#### 3. Ambient Glow pada Empty States & Wadah Ikon KPI
- Jangan biarkan *empty state* terlihat seperti dead-end: berikan aksen lingkaran cahaya halus (*ambient glow halo*) di belakang ikon dan tombol aksi langsung (*CTA*).
- Setiap metrik/KPI wajib memiliki wadah ikon dengan tone warna semantik (`emerald`, `amber`, `red`, `blue`), bukan monokrom abu-abu pudar.

---

### FASE 4: Aksi Berbasis Ikon (*Icon-First Actions*) & HUD Overlays

#### 1. Tombol Aksi Baris & Toolbar
Untuk tindakan operasional dengan frekuensi tinggi, prioritaskan `IconButton`:
- **Tambah Item**: Gunakan `Plus`
- **Hapus Item**: Gunakan `Trash2`
- **Edit / Ralat**: Gunakan `Pencil` atau `Edit3`
- **Unduh Dokumen**: Gunakan `Download`
- **Cetak / PDF**: Gunakan `Printer`
- **Info / Bantuan**: Gunakan `Info` atau `HelpCircle`
- **Tutup**: Gunakan `X`

> [!IMPORTANT]
> Setiap `IconButton` **wajib** memiliki atribut `title` dan `aria-label` yang jelas agar ramah aksesibilitas pembaca layar dan memberikan tooltip saat kursor diarahkan.

#### 2. Larangan Panah Dekoratif (`→`, `ArrowRight`)
- Jangan menambahkan panah `→` atau `ArrowRight` di ujung teks tautan/tombol sekadar sebagai hiasan AI.
- Jika elemen memicu navigasi ke entitas detail luar, gunakan ikon fungsional semantik seperti `ExternalLink` dengan ukuran proporsional (`size={13}`).

#### 3. Pola Floating HUD Toolbar untuk Fitur Panduan / Tur
Jika fitur memerlukan tur terpandu (*onboarding* atau demo):
- **Jangan** buat modal kotak raksasa yang menutupi konten kerja.
- **Rancang sebagai Floating HUD Toolbar**:
  - Posisi tetap (*docked*) di atas atau bawah workspace.
  - *Collapsed by default*: Menampilkan ringkasan status dalam strip pills kecil.
  - Kontrol navigasi berbasis ikon (`Play`, `Pause`, `Prev`, `Next`, `Reset`, `Info`, `Close`).
  - Penjelasan langkah detail hanya muncul jika pengguna menekan toggle ikon `Info`.

---

### FASE 5: Higiene Copywriting & Anti-Slop Domain

#### 1. Nol Toleransi Em-Dash (`—`)
Dilarang keras memakai em-dash (`—`) pada antarmuka pengguna bahasa Indonesia.
- Gunakan tanda titik dua (`:`), tanda kurung `(...)`, atau pisahkan menjadi dua baris bertingkat.

#### 2. Ikon Semantik Murni
- Dilarang memakai ikon dekoratif tanpa makna fungsional seperti `Sparkles`, `Wand`, atau `Stars` pada dashboard teknis.
- Gunakan ikon semantik:
  - `Database` untuk penyimpanan/demo state.
  - `Camera` untuk bukti foto visual.
  - `FileCheck2` untuk berita acara hasil uji.
  - `FileText` untuk laporan supervisi.
  - `Wrench` untuk tindakan perbaikan lapangan.
  - `ShieldCheck` untuk hold point & otorisasi resmi.

---

## 3. Checklist Validasi Fitur Baru (Pre-Flight Feature Checklist)

Sebelum menandai pembuatan fitur baru selesai (atau sebelum mengajukan pull request), verifikasi setiap item berikut:

- [ ] **Karakter Workspace**: Apakah ada paragraf artikel panjang di bawah judul halaman? Jika ada, hapus dan ganti dengan *count badge* atau toolbar kontrol.
- [ ] **Bebas Dot-Separator**: Apakah seluruh tampilan data sudah bebas dari penggabungan string ` · `? Apakah semua metadata sudah menggunakan stacked meta, micro-icons, atau status chip?
- [ ] **Kehadiran Aset Visual Lapangan**: Apakah fitur menampilkan representasi visual nyata (bukti foto bergeotag, berita acara uji lab, atau dokumen bertanda tangan)?
- [ ] **Modal Berukuran Proporsional**: Apakah dialog penampil bukti menggunakan ukuran lebar (`size="2xl"`) sehingga nyaman dibaca tanpa terhimpit?
- [ ] **Tipografi Angka Menonjol**: Apakah nilai kuantitatif/KPI utama menggunakan font monospaced besar (`text-2xl font-mono font-bold`)?
- [ ] **Aksi Bersih (Icon-First)**: Apakah aksi standar pada baris/tabel (tambah, hapus, unduh, pratinjau) sudah menggunakan `IconButton` dengan tooltip?
- [ ] **Tanpa Panah Dekoratif**: Apakah seluruh tombol dan link sudah bebas dari panah `→` atau `ArrowRight` tanpa fungsi?
- [ ] **Higiene Teks**: Apakah seluruh string UI bahasa Indonesia sudah 100% bebas dari em-dash (`—`) dan bebas dari ikon generik AI (`Sparkles`)?
