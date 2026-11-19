import { type RoleId } from '@/components/status'

export interface DemoStepDef {
  step: number
  id: string
  title: string
  shortLabel: string
  role: RoleId
  path: string
  personaName: string
  personaRole: string
  goal: string
  action: string
  takeaway: string
}

export const DEMO_STEPS: DemoStepDef[] = [
  {
    step: 1,
    id: 'ringkasan-awal',
    title: 'Tinjauan Operasional Multi-Proyek',
    shortLabel: '1. Portofolio Proyek',
    role: 'project_manager',
    path: '/dashboard',
    personaName: 'Rizky Hidayat',
    personaRole: 'Project Manager / Manajer Operasional',
    goal: 'Memantau progres proyek, status unit pengerjaan, dan pekerjaan yang memerlukan tindak lanjut.',
    action: 'Melihat progres Cluster Nawasena 24 Unit (54% vs 58%), 1 pengajuan pemeriksaan menunggu verifikasi, dan temuan perbaikan pada Unit A-05.',
    takeaway: 'Pemilik proyek dan manajemen mendapatkan kontrol operasional lintas proyek dan blok unit dalam satu layar.',
  },
  {
    step: 2,
    id: 'proyek-nawasena',
    title: 'Operasional Cluster Nawasena — 24 Unit',
    shortLabel: '2. Cluster Nawasena',
    role: 'project_manager',
    path: '/dashboard/proyek/naw',
    personaName: 'Rizky Hidayat',
    personaRole: 'Project Manager',
    goal: 'Memeriksa progres per unit (Blok A, B, C), tahapan konstruksi, dan status unit pengerjaan.',
    action: 'Melihat matriks unit: Unit A-05 sedang tahap struktur beton dengan catatan perbaikan selimut beton balok B2 yang menahan pengecoran.',
    takeaway: 'Transparansi detail hingga level blok dan nomor unit rumah mempermudah koordinasi mandor dan pelaksana.',
  },
  {
    step: 3,
    id: 'inspeksi-pengajuan',
    title: 'Pengajuan Pemeriksaan: Unit A-05',
    shortLabel: '3. Ajukan Pemeriksaan',
    role: 'site_engineer',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Budi Santoso',
    personaRole: 'Site Engineer / Pelaksana',
    goal: 'Mengecek kelengkapan pengajuan pemeriksaan pembesian balok & pelat Unit A-05 sebelum cor.',
    action: 'Memeriksa checklist acuan kerja (diameter besi D13/D10, cover 25 mm) dan referensi gambar kerja STR-A05.',
    takeaway: 'Pengajuan pemeriksaan lapangan terikat jelas pada gambar kerja, nomor unit, dan checklist acuan.',
  },
  {
    step: 4,
    id: 'qc-koreksi',
    title: 'Pemeriksaan Lapangan: Perlu Perbaikan',
    shortLabel: '4. Hasil Checklist',
    role: 'qc_inspector',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Sari Wulandari',
    personaRole: 'Pengawas Kualitas / QC',
    goal: 'Mencatat hasil pemeriksaan fisik lapangan menggunakan checklist acuan.',
    action: 'Pengawas mencatat hasil "Perlu Perbaikan" karena selimut beton balok B2 terukur 20 mm (kurang dari standar 25 mm).',
    takeaway: 'Hasil pemeriksaan dicatat objektif: Sesuai, Perlu Perbaikan, atau Perlu Klarifikasi beserta foto bukti temuan.',
  },
  {
    step: 5,
    id: 'se-bukti',
    title: 'Dokumentasi & Bukti Tindak Lanjut Perbaikan',
    shortLabel: '5. Bukti Perbaikan',
    role: 'site_engineer',
    path: '/dashboard/temuan/f-ar-021',
    personaName: 'Budi Santoso',
    personaRole: 'Site Engineer / Pelaksana',
    goal: 'Menyampaikan dokumentasi perbaikan fisik setelah spacer beton standar dipasang mandor.',
    action: 'Pelaksana mengunggah 8 foto pemasangan spacer 25 mm pada balok B2 Unit A-05 dan mengajukan verifikasi perbaikan.',
    takeaway: 'Tindak lanjut perbaikan terdokumentasi rapi dengan bukti foto sebelum diverifikasi pengawas.',
  },
  {
    step: 6,
    id: 'qc-terima',
    title: 'Verifikasi Hasil Perbaikan di Lapangan',
    shortLabel: '6. Verifikasi Perbaikan',
    role: 'qc_inspector',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Sari Wulandari',
    personaRole: 'Pengawas Kualitas / QC',
    goal: 'Memverifikasi perbaikan fisik lapangan dan memastikan kriteria checklist terpenuhi.',
    action: 'Pengawas memeriksa spacer 25 mm di lokasi Unit A-05 dan mencatat hasil verifikasi "Sesuai".',
    takeaway: 'Pekerjaan dinyatakan sesuai berdasarkan verifikasi fisik nyata di lapangan, bukan sekadar janji lisan.',
  },
  {
    step: 7,
    id: 'qm-holdpoint',
    title: 'Pengecekan Izin Pengecoran & Titik Kendali',
    shortLabel: '7. Izin Pengecoran',
    role: 'quality_manager',
    path: '/dashboard/proyek/naw?titik=hp-ar-02',
    personaName: 'Ratna Dewi',
    personaRole: 'Quality Lead / Manajer Lapangan',
    goal: 'Memastikan seluruh checklist pemeriksaan dan catatan perbaikan selesai sebelum mengizinkan pengecoran.',
    action: 'Meninjau kondisi prasyarat CP-NW-02: hasil pemeriksaan balok Unit A-05 telah diverifikasi dan tidak ada temuan terbuka.',
    takeaway: 'Persetujuan tahap kritis (pengecoran) terkontrol rapi tanpa risiko pembongkaran beton.',
  },
  {
    step: 8,
    id: 'qm-rilis',
    title: 'Konfirmasi Persetujuan Lanjut Cor',
    shortLabel: '8. Persetujuan Cor',
    role: 'quality_manager',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Ratna Dewi',
    personaRole: 'Quality Lead / Manajer Lapangan',
    goal: 'Merekam persetujuan pengecoran balok & pelat lantai 2 Unit A-05.',
    action: 'Ratna mencatat persetujuan rilis cor dengan nomor verifikasi izin pengecoran.',
    takeaway: 'Riwayat persetujuan terekam lengkap dan dapat ditunjukkan saat laporan progres ke developer atau pemilik.',
  },
  {
    step: 9,
    id: 'pm-selesai',
    title: 'Pekerjaan Selesai & Lanjut Tahap Berikutnya',
    shortLabel: '9. Siap Cor & Progres',
    role: 'project_manager',
    path: '/dashboard',
    personaName: 'Rizky Hidayat',
    personaRole: 'Project Manager',
    goal: 'Melihat pembaruan status unit dan kelancaran pekerjaan proyek.',
    action: 'Kembali ke ringkasan: Unit A-05 siap dicor, progres pengerjaan berjalan lancar, dan temuan perbaikan telah terselesaikan.',
    takeaway: 'Kontrol penuh atas multi-proyek, unit pengerjaan, pemeriksaan kualitas, dan tindak lanjut perbaikan dalam satu alur terpadu.',
  },
]
