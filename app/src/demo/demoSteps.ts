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
    title: 'Tinjauan Portofolio Multi-Proyek',
    shortLabel: '1. Portofolio',
    role: 'project_manager',
    path: '/dashboard',
    personaName: 'Andi Prasetyo',
    personaRole: 'Project Manager',
    goal: 'Identifikasi deviasi jadwal proyek dan hambatan mutu kritis.',
    action: 'Melihat 2 permintaan review dan 1 titik tahan (hold point) belum terilis pada Gedung Aruna.',
    takeaway: 'Manajemen mendapatkan visibilitas langsung tanpa menunggu rekap spreadsheet mingguan.',
  },
  {
    step: 2,
    id: 'proyek-aruna',
    title: 'Detail Proyek Gedung Aruna Tower A',
    shortLabel: '2. Proyek Aruna',
    role: 'project_manager',
    path: '/dashboard/proyek/aru',
    personaName: 'Andi Prasetyo',
    personaRole: 'Project Manager',
    goal: 'Memeriksa akar masalah keterlambatan pengecoran pelat lantai 8.',
    action: 'Meninjau kurva deviasi (-5 poin), isu terbuka cover tulangan F-AR-021, dan titik kendali HP-AR-02.',
    takeaway: 'Keterkaitan langsung antara temuan teknis lapangan dan jadwal milestone fisik cor.',
  },
  {
    step: 3,
    id: 'inspeksi-pengajuan',
    title: 'Pemeriksaan Pengajuan WIR-AR-2026-0142',
    shortLabel: '3. Pengajuan WIR',
    role: 'site_engineer',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Budi Santoso',
    personaRole: 'Site Engineer',
    goal: 'Mengecek kelengkapan pengajuan izin inspeksi pembesian sebelum cor.',
    action: 'Memeriksa checklist toleransi spesifikasi (D16-150, cover 25 mm) dan referensi gambar kerja S-301.',
    takeaway: 'Semua dokumen acuan dan kriteria keberterimaan terikat pada nomor registrasi pengajuan.',
  },
  {
    step: 4,
    id: 'qc-koreksi',
    title: 'Pemeriksaan Lapangan: Perlu Perbaikan',
    shortLabel: '4. Koreksi QC',
    role: 'qc_inspector',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Sari Wulandari',
    personaRole: 'QA/QC Inspector',
    goal: 'Mencatat hasil inspeksi fisik lapangan oleh inspektur independen.',
    action: 'Sari mencatat keputusan "Perlu Perbaikan" karena selimut beton terukur 20 mm (di bawah syarat 25 mm).',
    takeaway: 'Penolakan dicatat dengan alasan teknis terukur, bukan sekadar penolakan verbal di chat.',
  },
  {
    step: 5,
    id: 'se-bukti',
    title: 'Pengajuan Bukti Tindakan Perbaikan',
    shortLabel: '5. Bukti Perbaikan',
    role: 'site_engineer',
    path: '/dashboard/temuan/f-ar-021',
    personaName: 'Budi Santoso',
    personaRole: 'Site Engineer',
    goal: 'Menyampaikan dokumentasi perbaikan fisik setelah tahu beton dipasang.',
    action: 'Site Engineer mengajukan perbaikan CA-021-1 dengan bukti foto pasang spacer dan meminta re-inspeksi.',
    takeaway: 'Tindakan perbaikan wajib disertai bukti visual sebelum dapat diverifikasi ulang.',
  },
  {
    step: 6,
    id: 'qc-terima',
    title: 'Penerimaan Hasil Re-Inspeksi',
    shortLabel: '6. Terima Re-Inspeksi',
    role: 'qc_inspector',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Sari Wulandari',
    personaRole: 'QA/QC Inspector',
    goal: 'Verifikasi lapangan ulang dan penerimaan mutu pembesian.',
    action: 'Sari memverifikasi cover beton telah mencapai 25 mm dan mencatat keputusan "Terima".',
    takeaway: 'WIR diterima, namun izin cor tetap ditahan sampai rilis resmi hold point diberikan.',
  },
  {
    step: 7,
    id: 'qm-holdpoint',
    title: 'Verifikasi Prasyarat Titik Tahan (Hold Point)',
    shortLabel: '7. Prasyarat Hold Point',
    role: 'quality_manager',
    path: '/dashboard/proyek/aru?titik=hp-ar-02',
    personaName: 'Ratna Dewi',
    personaRole: 'Quality Manager',
    goal: 'Memastikan seluruh kondisi prasyarat terpenuhi sebelum merilis cor.',
    action: 'Quality Manager memeriksa WIR telah diterima dan tidak ada temuan terbuka yang menahan cor.',
    takeaway: 'Pemisahan wewenang yang tegas antara penerimaan item kerja dan otorisasi tahap cor kritis.',
  },
  {
    step: 8,
    id: 'qm-rilis',
    title: 'Perekaman Rilis Resmi Hold Point Cor',
    shortLabel: '8. Rilis Hold Point',
    role: 'quality_manager',
    path: '/dashboard/inspeksi/wir-ar-0142',
    personaName: 'Ratna Dewi',
    personaRole: 'Quality Manager',
    goal: 'Menerbitkan otorisasi pelepasan titik tahan pengecoran pelat lantai 8.',
    action: 'Ratna mencatat rilis resmi hold point HP-AR-02 dengan nomor verifikasi izin pengecoran.',
    takeaway: 'Keputusan rilis terekam permanen dalam log audit, memberikan kepastian hukum dan mutu.',
  },
  {
    step: 9,
    id: 'pm-selesai',
    title: 'Blocker Terilis & Siklus Cor Siap',
    shortLabel: '9. Cor Siap Eksekusi',
    role: 'project_manager',
    path: '/dashboard',
    personaName: 'Andi Prasetyo',
    personaRole: 'Project Manager',
    goal: 'Melihat dampak penyelesaian masalah mutu pada dashboard portofolio.',
    action: 'Kembali ke ringkasan portofolio: titik tahan terilis, pekerjaan cor pelat L8 siap dilaksanakan.',
    takeaway: 'Alur kerja mutu yang tertib melindungi struktur gedung dari risiko pembongkaran beton di kemudian hari.',
  },
]
