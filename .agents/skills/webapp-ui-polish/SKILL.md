---
name: webapp-ui-polish
description: "Standar Arsitektur & UI/UX Web App: Panduan merancang, membangun (build), dan memoles produk atau fitur web app profesional dari nol. Mencegah jebakan 'website artikel/blog padat teks' dengan menegakkan diferensiasi nilai visual, eliminasi rantai dot-separator (·), integrasi aset visual domain nyata, aksi berbasis ikon, dan tipografi berbobot."
metadata:
  author: User Feedback & Anti-Slop Engineering
  version: "2.0.0"
  category: SoftwareArchitectureAndUIUX
---

# Standar Arsitektur & UI/UX Web App (Build & Polish Framework)

Standar ini adalah panduan baku bagi AI coding agent dan software engineer ketika **merancang dan membangun fitur/produk baru dari nol (greenfield/feature build)** maupun ketika **memoles antarmuka yang sudah ada (polish/refactor)**.

Tujuannya adalah memastikan setiap layar, komponen, dan interaksi yang dibangun memiliki karakter **Web Application Profesional berstandar industri** (seperti Linear, Notion, Stripe Dashboard, Jira, GitHub), bukan **website artikel/blog yang monoton, padat teks, dan rempet-rempet**.

Skill ini **industry-agnostic** — berlaku untuk SaaS, fintech, healthcare, logistics, e-commerce, HR, project management, maupun domain manapun.

---

## 1. Paradigma Fundamental: Web App Workspace vs. Website Artikel

Ketika membangun produk atau fitur baru, selalu gunakan mental model **Workstation / Tool**, bukan **Halaman Bacaan**:

| Dimensi Arsitektur | ❌ Jebakan Website / Artikel (Slop) | ✅ Karakter Web App Profesional (Wajib) |
| :--- | :--- | :--- |
| **Pola Header** | Judul H1 diikuti 2-3 baris paragraf panjang yang menjelaskan fungsi halaman | Judul padat + badge entitas/status + toolbar aksi langsung (filter, search, view switcher) |
| **Diferensiasi Data** | Teks seukuran dan monoton, disambung dengan rantai titik (`A · B · C · D`) | Struktur token visual: *stacked layout*, *micro-icon chips*, badge semantik, grid terpisah |
| **Konteks & Bukti** | Nihil elemen visual; hanya deretan label, angka polos, dan teks link nama berkas | Menghadirkan *domain reality*: thumbnail dokumen, foto preview dengan metadata overlay, kartu laporan visual |
| **Tombol & Aksi** | Tombol teks panjang berulang ("Tambah Baris", "Hapus Data") & panah dekoratif (`→`) | *Icon-first buttons* (`IconButton`) dengan tooltip aksesibel & affordance semantik (`ExternalLink`) |
| **Kuantitatif / KPI** | Angka kecil bercampur aduk di dalam paragraf atau tabel datar | Angka masif monospaced (`text-2xl font-mono font-bold`) + *micro-labels* + wadah ikon berwarna semantik |
| **Panduan & Overlay** | Modal box raksasa 3 kolom yang menutupi separuh layar kerja | HUD Toolbar mengambang yang ramping (*collapsed by default*, icon controls, step pills) |

---

## 2. Blueprint Membangun Fitur Baru (Feature Build Blueprint)

Gunakan 5 fase ini setiap kali membuat layar, modul, atau komponen baru:

### FASE 1: Scaffolding Layout Workspace (Struktur Layar)
Saat membuat file halaman baru, bangun layout dengan struktur workspace berikut:

```tsx
export function FeatureView() {
  return (
    <>
      {/* 1. Header Ringkas: Judul + Entity Badge + Aksi Utama (Tanpa paragraf penjelas!) */}
      <PageHeader
        title="Orders"
        meta={<Badge tone="neutral">14 active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <IconButton icon={Download} label="Export data" size="sm" variant="secondary" />
            <Button size="sm" variant="primary">
              <Plus size={14} /> New Order
            </Button>
          </div>
        }
      />

      <PageBody className="space-y-4">
        {/* 2. Control Toolbar: Search + Filter Dropdown + Segmented View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput placeholder="Search by ID, name, assignee..." className="w-72" />
          <Select aria-label="Filter status" wrapperClassName="w-48">
            <option value="">All Status</option>
            {/* Format dropdown enterprise: [CODE] Name */}
            <option value="pending">[PENDING] Awaiting Review</option>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            <SegmentedControl options={VIEW_OPTIONS} />
          </div>
        </div>

        {/* 3. Operational KPI Deck: Angka Masif + Micro-labels + Wadah Ikon Berwarna */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="OVERDUE"
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
<p className="text-xs text-ink-muted">{user.name} · {user.role} · {user.department}</p>

// ✅ WAJIB POLA STACKED:
<div>
  <span className="block text-xs font-semibold text-ink">{user.name}</span>
  <span className="flex items-center gap-1 text-2xs text-ink-muted">
    <span className="font-medium text-ink-secondary">{user.role}</span>
    <span className="rounded bg-sunken px-1.5 py-0.2">{user.department}</span>
  </span>
</div>
```

#### Pola 2: Micro-Icon + Label Chip
Gunakan untuk atribut entitas seperti Lokasi, Organisasi, Waktu, atau Kategori:
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
<span>{formatDateTime(task.dueAt)} · overdue</span>

// ✅ SEMANTIC CHIP:
<div className="flex items-center gap-1.5">
  <span className="font-mono text-xs text-ink">{formatDateTime(task.dueAt)}</span>
  <span className="rounded bg-red-100 px-1.5 py-0.5 font-bold text-2xs text-red-700">
    Overdue
  </span>
</div>
```

#### Pola 4: Dropdown Selector Enterprise
Gunakan format kurung siku untuk kode entitas agar terlihat seperti sistem enterprise:
```tsx
// ❌ SLOP:
<option value={item.id}>{item.code} · {item.name}</option>

// ✅ ENTERPRISE:
<option value={item.id}>[{item.code}] {item.name}</option>
```

---

### FASE 3: Integrasi Aset Visual Domain (*Domain Reality*)
Aplikasi web profesional tidak boleh hanya berisi teks dan tautan unduh. Rancang aset visual konkret yang merefleksikan domain produk sejak awal:

#### 1. Thumbnail & Preview Card
Setiap entitas yang memiliki representasi visual (dokumen, foto, sertifikat, invoice, laporan) wajib ditampilkan sebagai thumbnail yang bisa diklik:
- **Dokumen**: Preview halaman pertama dengan CSS rendering (kop surat, tabel ringkasan, stempel/cap resmi jika relevan).
- **Foto / Media**: Grid thumbnail dengan metadata overlay (tanggal, pengunggah, dimensi, ukuran file).
- **Sertifikat / Approval**: Kartu visual dengan indikator status (cap APPROVED/REJECTED dengan rotasi sudut, warna semantik).
- **Laporan / Report**: Simulasi format dokumen A4 dengan header organisasi dan ringkasan data.

> [!TIP]
> Gunakan gradien CSS, SVG patterns, dan grid lines untuk membangun thumbnail yang kaya visual tanpa memerlukan aset gambar eksternal. Ini jauh lebih baik daripada sekadar ikon `FileText` dengan nama file di bawahnya.

#### 2. Modal Penampil Berkas Resolusi Penuh (`size="2xl"` / `max-w-5xl`)
Ketika thumbnail diklik, buka modal berukuran lebar:
- **Kolom Kiri (60-65%)**: Kanvas visual dokumen atau media utuh.
- **Kolom Kanan (35-40%)**: Panel inspektur berisi metadata terstruktur, catatan reviewer, versi/histori, dan tombol aksi (unduh, cetak, bagikan).

#### 3. Ambient Glow pada Empty States & Wadah Ikon KPI
- Jangan biarkan *empty state* terlihat seperti dead-end: berikan aksen lingkaran cahaya halus (*ambient glow halo*) di belakang ikon dan tombol aksi langsung (*CTA*).
- Setiap metrik/KPI wajib memiliki wadah ikon dengan tone warna semantik (`emerald`, `amber`, `red`, `blue`), bukan monokrom abu-abu pudar.

---

### FASE 4: Aksi Berbasis Ikon (*Icon-First Actions*) & HUD Overlays

#### 1. Tombol Aksi Baris & Toolbar
Untuk tindakan operasional dengan frekuensi tinggi, prioritaskan `IconButton`:
- **Tambah Item**: `Plus`
- **Hapus Item**: `Trash2`
- **Edit**: `Pencil` atau `Edit3`
- **Unduh**: `Download`
- **Cetak / PDF**: `Printer`
- **Info / Bantuan**: `Info` atau `HelpCircle`
- **Tutup**: `X`
- **Lihat Detail**: `Eye`
- **Bagikan / Share**: `Share2`
- **Duplikat / Copy**: `Copy`

> [!IMPORTANT]
> Setiap `IconButton` **wajib** memiliki atribut `title` dan `aria-label` yang jelas agar ramah aksesibilitas pembaca layar dan memberikan tooltip saat kursor diarahkan.

#### 2. Larangan Panah Dekoratif (`→`, `ArrowRight`)
- Jangan menambahkan panah `→` atau `ArrowRight` di ujung teks tautan/tombol sekadar sebagai hiasan AI.
- Jika elemen memicu navigasi ke halaman detail, gunakan ikon fungsional semantik seperti `ExternalLink` atau `ChevronRight` dengan ukuran proporsional (`size={13}`).

#### 3. Pola Floating HUD Toolbar untuk Fitur Panduan / Tur
Jika fitur memerlukan tur terpandu (*onboarding* atau demo):
- **Jangan** buat modal kotak raksasa yang menutupi konten kerja.
- **Rancang sebagai Floating HUD Toolbar**:
  - Posisi tetap (*docked*) di atas atau bawah workspace.
  - *Collapsed by default*: Menampilkan ringkasan status dalam strip pills kecil.
  - Kontrol navigasi berbasis ikon (`Play`, `Pause`, `Prev`, `Next`, `Reset`, `Info`, `Close`).
  - Penjelasan langkah detail hanya muncul jika pengguna menekan toggle ikon `Info`.

---

### FASE 5: Higiene Copywriting & Anti-Slop

#### 1. Nol Toleransi Em-Dash (`—`)
Dilarang keras memakai em-dash (`—`) pada antarmuka pengguna bahasa Indonesia.
- Gunakan tanda titik dua (`:`), tanda kurung `(...)`, atau pisahkan menjadi dua baris bertingkat.

#### 2. Ikon Semantik Murni
- Dilarang memakai ikon dekoratif tanpa makna fungsional seperti `Sparkles`, `Wand`, `Stars`, atau `Zap` pada dashboard dan UI operasional.
- Setiap ikon harus memiliki makna fungsional yang jelas dan relevan dengan konteks domain.
- Contoh pemetaan ikon semantik universal:

| Fungsi | Ikon yang Tepat |
| :--- | :--- |
| Penyimpanan / Data | `Database`, `HardDrive` |
| Bukti Foto / Media | `Camera`, `Image` |
| Dokumen Resmi | `FileCheck2`, `FileText` |
| Laporan / Report | `BarChart3`, `ClipboardList` |
| Tindakan Perbaikan | `Wrench`, `Settings` |
| Otorisasi / Approval | `ShieldCheck`, `CheckCircle2` |
| Pengguna / Profil | `User`, `Users` |
| Notifikasi | `Bell`, `BellRing` |
| Kalender / Jadwal | `Calendar`, `Clock` |
| Pembayaran / Transaksi | `CreditCard`, `Wallet` |

#### 3. Konsistensi Tipografi Kuantitatif
Setiap angka KPI atau metrik utama harus menggunakan treatment tipografi yang membedakannya dari teks biasa:
```tsx
// ❌ SLOP: Angka tenggelam di paragraf
<p>Total pesanan bulan ini: {count}</p>

// ✅ KPI MASIF:
<div>
  <span className="text-2xs font-semibold uppercase tracking-wider text-ink-muted">
    Total Pesanan
  </span>
  <span className="block text-2xl font-mono font-bold text-ink">{count}</span>
</div>
```

---

## 3. Checklist Validasi Fitur Baru (Pre-Flight Feature Checklist)

Sebelum menandai pembuatan fitur baru selesai (atau sebelum mengajukan pull request), verifikasi setiap item berikut:

- [ ] **Karakter Workspace**: Apakah ada paragraf artikel panjang di bawah judul halaman? Jika ada, hapus dan ganti dengan *count badge* atau toolbar kontrol.
- [ ] **Bebas Dot-Separator**: Apakah seluruh tampilan data sudah bebas dari penggabungan string ` · `? Apakah semua metadata sudah menggunakan stacked meta, micro-icons, atau status chip?
- [ ] **Kehadiran Aset Visual Domain**: Apakah fitur menampilkan representasi visual nyata dari domain-nya (preview dokumen, thumbnail foto, kartu sertifikat, simulasi laporan)?
- [ ] **Modal Berukuran Proporsional**: Apakah dialog penampil konten menggunakan ukuran lebar (`size="2xl"`) sehingga nyaman dibaca tanpa terhimpit?
- [ ] **Tipografi Angka Menonjol**: Apakah nilai kuantitatif/KPI utama menggunakan font monospaced besar (`text-2xl font-mono font-bold`)?
- [ ] **Aksi Bersih (Icon-First)**: Apakah aksi standar pada baris/tabel (tambah, hapus, unduh, pratinjau) sudah menggunakan `IconButton` dengan tooltip?
- [ ] **Tanpa Panah Dekoratif**: Apakah seluruh tombol dan link sudah bebas dari panah `→` atau `ArrowRight` tanpa fungsi?
- [ ] **Higiene Teks**: Apakah seluruh string UI sudah bebas dari em-dash (`—`) dan bebas dari ikon generik AI (`Sparkles`)?
- [ ] **Empty States Berkualitas**: Apakah setiap halaman kosong memiliki ilustrasi/ikon dengan ambient glow dan CTA yang jelas?
- [ ] **Responsif**: Apakah layout workspace berfungsi baik di mobile (stack) dan desktop (grid/split)?
