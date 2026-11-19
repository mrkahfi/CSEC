import type {
  FindingClassificationId,
  FindingStatusId,
  HoldPointStatusId,
  InspectionStatusId,
  PointTypeId,
  RoleId,
  StatusDef,
  StatusTone,
} from '@/components/status'
import {
  Archive,
  BadgeCheck,
  CalendarClock,
  CalendarX,
  CircleCheck,
  CircleX,
  OctagonAlert,
  TrendingDown,
  ClipboardCheck,
  Eye,
  EyeOff,
  Hourglass,
  KeyRound,
  FilePenLine,
  FileText,
  FileWarning,
  LockOpen,
  MessageCircleQuestion,
  MessageSquare,
  RefreshCw,
  Send,
  Stamp,
  TriangleAlert,
  UserPlus,
  Undo2,
  Ban,
  type LucideIcon,
} from 'lucide-react'

/* ============================================================
 * DATA SEED DEMO — PRD §15
 * ------------------------------------------------------------
 * Seluruh data ilustratif & konsisten (PRD §15.1): referensi
 * proyek/inspeksi/temuan/aktor saling tertaut agar alur
 * "submit → review → koreksi → re-inspeksi → terima → rilis
 * hold point" (PRD §15.3) dapat dibawakan sebagai cerita.
 *
 * Tanggal di-anchor relatif terhadap waktu buka aplikasi
 * sehingga umur catatan, overdue, dan jadwal selalu relevan.
 * Tidak ada logika bisnis — murni data + turunan presentasi.
 * ============================================================ */

const NOW = Date.now()
/** ISO jam-n lalu. */
const agoH = (h: number) => new Date(NOW - h * 3_600_000).toISOString()
/** ISO hari-n lalu. */
const agoD = (d: number) => new Date(NOW - d * 86_400_000).toISOString()
/** ISO jam-n ke depan. */
const aheadH = (h: number) => new Date(NOW + h * 3_600_000).toISOString()
/** ISO hari-n ke depan. */
const aheadD = (d: number) => new Date(NOW + d * 86_400_000).toISOString()

export interface Person {
  name: string
  org: string
  role: RoleId
}

/* ------------------------------------------------------------
 * Proyek — PRD §15.2 + satu proyek arsip (FR-PR-05)
 * ------------------------------------------------------------ */

export type ProjectStatusId = 'mobilization' | 'active' | 'handover' | 'closed'

export const PROJECT_STATUS: Record<ProjectStatusId, { id: string; label: string; tone: StatusTone; icon: LucideIcon; description: string }> = {
  mobilization: { id: 'mobilization', label: 'Mobilisasi', tone: 'info', icon: Hourglass, description: 'Proyek tahap awal.' },
  active: { id: 'active', label: 'Aktif', tone: 'success', icon: CircleCheck, description: 'Proyek berjalan.' },
  handover: { id: 'handover', label: 'Serah Terima', tone: 'warning', icon: KeyRound, description: 'Tahap serah terima.' },
  closed: { id: 'closed', label: 'Arsip', tone: 'neutral', icon: Archive, description: 'Hanya-baca, tetap dapat dicari.' },
}

export interface Project {
  id: string
  code: string
  name: string
  client: string
  location: string
  type: string
  status: ProjectStatusId
  value: string
  period: string
  pm: string
  siteManager: string
  qualityLead: string
  consultant: string
}

export const PROJECTS: Project[] = [
  {
    id: 'naw',
    code: 'NAW',
    name: 'Cluster Nawasena (Tahap 2)',
    client: 'PT Graha Nawasena Makmur',
    location: 'Bekasi Barat',
    type: 'Cluster Perumahan — 24 Unit (Blok A, B, C)',
    status: 'active',
    value: 'Rp 18,5 M',
    period: 'Feb 2026 s.d. Nov 2026',
    pm: 'Andi Prasetyo',
    siteManager: 'Rizky Hidayat',
    qualityLead: 'Sari Wulandari',
    consultant: 'PT Cipta Graha Konsultan (Hendra Kusuma)',
  },
  {
    id: 'rko',
    code: 'RKO',
    name: 'Pembangunan Ruko Grand Harmoni',
    client: 'PT Harmoni Niaga Sentosa',
    location: 'Tangerang Kota',
    type: 'Ruko Komersial (6 Unit, 3 Lantai + MEP)',
    status: 'active',
    value: 'Rp 14,2 M',
    period: 'Jan 2026 s.d. Sep 2026',
    pm: 'Andi Prasetyo',
    siteManager: 'Dedi Kurniawan',
    qualityLead: 'Sari Wulandari',
    consultant: 'CV Mitra Desain & Arsitektur',
  },
  {
    id: 'gml',
    code: 'GML',
    name: 'Renovasi Gedung Graha Mulia',
    client: 'Yayasan Graha Mulia',
    location: 'Jakarta Timur',
    type: 'Renovasi Gedung Kantor (3 Lantai)',
    status: 'active',
    value: 'Rp 6,8 M',
    period: 'Mei 2026 s.d. Okt 2026',
    pm: 'Andi Prasetyo',
    siteManager: 'Yusuf Maulana',
    qualityLead: 'Sari Wulandari',
    consultant: 'PT Cipta Karya Desain',
  },
  {
    id: 'bl',
    code: 'BL',
    name: 'Renovasi Gudang Logistik Bantan',
    client: 'PT Sentra Pergudangan Mandiri',
    location: 'Bekasi Timur',
    type: 'Renovasi gudang (struktur baja)',
    status: 'closed',
    value: 'Rp 5,4 M',
    period: 'Feb 2025 s.d. Des 2025 · diarsipkan',
    pm: 'Andi Prasetyo',
    siteManager: 'Dedi Kurniawan',
    qualityLead: 'Sari Wulandari',
    consultant: 'CV Mitra Teknik',
  },
]

/* ------------------------------------------------------------
 * Unit & Blok Proyek (Visibilitas Operasional Perumahan & Ruko)
 * ------------------------------------------------------------ */

export interface ProjectUnit {
  id: string
  projectId: string
  code: string // e.g. "Unit A-05", "Unit B-12", "Ruko 03"
  blockOrZone: string // "Blok A", "Blok B", "Blok C", "Zona Ruko"
  type: string // "Type 60/90", "Type 45/72", "Type 70/105", "Ruko 3 Lantai"
  stage: string // "Pondasi & Sloof", "Struktur Beton", "Dinding & Plesteran", "Atap & Baja Ringan", "Instalasi MEP", "Lantai & Keramik", "Pengecatan", "Finishing & Punch List"
  progressPct: number
  status: 'normal' | 'need_inspection' | 'has_findings' | 'ready_handover' | 'delayed'
  activeInspectionRef?: string
  openFindingRef?: string
  targetHandover: string
  notes?: string
}

export const PROJECT_UNITS: ProjectUnit[] = [
  // Cluster Nawasena: 24 Unit (Blok A: 8 unit, Blok B: 8 unit, Blok C: 8 unit)
  { id: 'u-a01', projectId: 'naw', code: 'Unit A-01', blockOrZone: 'Blok A', type: 'Type 70/105', stage: 'Finishing & Punch List', progressPct: 92, status: 'ready_handover', targetHandover: aheadD(20), notes: 'Punch list serah terima unit' },
  { id: 'u-a02', projectId: 'naw', code: 'Unit A-02', blockOrZone: 'Blok A', type: 'Type 60/90', stage: 'Lantai & Keramik', progressPct: 84, status: 'normal', targetHandover: aheadD(35) },
  { id: 'u-a03', projectId: 'naw', code: 'Unit A-03', blockOrZone: 'Blok A', type: 'Type 60/90', stage: 'Dinding & Plesteran', progressPct: 65, status: 'normal', targetHandover: aheadD(50) },
  { id: 'u-a04', projectId: 'naw', code: 'Unit A-04', blockOrZone: 'Blok A', type: 'Type 60/90', stage: 'Instalasi MEP', progressPct: 72, status: 'normal', targetHandover: aheadD(45) },
  { id: 'u-a05', projectId: 'naw', code: 'Unit A-05', blockOrZone: 'Blok A', type: 'Type 70/105', stage: 'Struktur Beton', progressPct: 55, status: 'need_inspection', activeInspectionRef: 'INSP-NW-2026-0142', openFindingRef: 'F-NW-021', targetHandover: aheadD(60), notes: 'Balok B2: Verifikasi spacer 25 mm' },
  { id: 'u-a06', projectId: 'naw', code: 'Unit A-06', blockOrZone: 'Blok A', type: 'Type 60/90', stage: 'Atap & Baja Ringan', progressPct: 78, status: 'normal', targetHandover: aheadD(40) },
  { id: 'u-a07', projectId: 'naw', code: 'Unit A-07', blockOrZone: 'Blok A', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 35, status: 'normal', targetHandover: aheadD(80) },
  { id: 'u-a08', projectId: 'naw', code: 'Unit A-08', blockOrZone: 'Blok A', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 30, status: 'normal', targetHandover: aheadD(85) },

  { id: 'u-b01', projectId: 'naw', code: 'Unit B-01', blockOrZone: 'Blok B', type: 'Type 45/72', stage: 'Pengecatan', progressPct: 88, status: 'normal', targetHandover: aheadD(25) },
  { id: 'u-b02', projectId: 'naw', code: 'Unit B-02', blockOrZone: 'Blok B', type: 'Type 45/72', stage: 'Atap & Baja Ringan', progressPct: 68, status: 'need_inspection', activeInspectionRef: 'INSP-NW-2026-0151', targetHandover: aheadD(50), notes: 'Rangka Atap: Inspeksi Kuda-Kuda' },
  { id: 'u-b03', projectId: 'naw', code: 'Unit B-03', blockOrZone: 'Blok B', type: 'Type 60/90', stage: 'Instalasi MEP', progressPct: 62, status: 'normal', targetHandover: aheadD(55) },
  { id: 'u-b04', projectId: 'naw', code: 'Unit B-04', blockOrZone: 'Blok B', type: 'Type 60/90', stage: 'Dinding & Plesteran', progressPct: 58, status: 'has_findings', openFindingRef: 'F-NW-022', targetHandover: aheadD(60), notes: 'Dinding Belakang: Retak Rambut (40 cm)' },
  { id: 'u-b05', projectId: 'naw', code: 'Unit B-05', blockOrZone: 'Blok B', type: 'Type 45/72', stage: 'Struktur Beton', progressPct: 48, status: 'normal', targetHandover: aheadD(70) },
  { id: 'u-b06', projectId: 'naw', code: 'Unit B-06', blockOrZone: 'Blok B', type: 'Type 45/72', stage: 'Struktur Beton', progressPct: 45, status: 'normal', targetHandover: aheadD(75) },
  { id: 'u-b07', projectId: 'naw', code: 'Unit B-07', blockOrZone: 'Blok B', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 25, status: 'normal', targetHandover: aheadD(90) },
  { id: 'u-b12', projectId: 'naw', code: 'Unit B-12', blockOrZone: 'Blok B', type: 'Type 60/90', stage: 'Instalasi MEP', progressPct: 60, status: 'normal', targetHandover: aheadD(55), notes: 'MEP: Sanitair & Sparing Pipa' },

  { id: 'u-c01', projectId: 'naw', code: 'Unit C-01', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Dinding & Plesteran', progressPct: 50, status: 'normal', targetHandover: aheadD(65) },
  { id: 'u-c02', projectId: 'naw', code: 'Unit C-02', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Struktur Beton', progressPct: 40, status: 'normal', targetHandover: aheadD(75) },
  { id: 'u-c03', projectId: 'naw', code: 'Unit C-03', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 28, status: 'normal', targetHandover: aheadD(85) },
  { id: 'u-c04', projectId: 'naw', code: 'Unit C-04', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 22, status: 'delayed', targetHandover: aheadD(90), notes: 'Logistik: Suplai batu belah tertunda 1 hari' },
  { id: 'u-c05', projectId: 'naw', code: 'Unit C-05', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 20, status: 'normal', targetHandover: aheadD(95) },
  { id: 'u-c06', projectId: 'naw', code: 'Unit C-06', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 15, status: 'normal', targetHandover: aheadD(100) },
  { id: 'u-c07', projectId: 'naw', code: 'Unit C-07', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 10, status: 'normal', targetHandover: aheadD(110) },
  { id: 'u-c08', projectId: 'naw', code: 'Unit C-08', blockOrZone: 'Blok C', type: 'Type 45/72', stage: 'Pondasi & Sloof', progressPct: 10, status: 'normal', targetHandover: aheadD(110) },

  // Pembangunan Ruko Grand Harmoni: 6 Unit Ruko 3 Lantai
  { id: 'u-rk01', projectId: 'rko', code: 'Ruko 01', blockOrZone: 'Zona Ruko', type: 'Ruko 3 Lantai', stage: 'Finishing & Cat', progressPct: 86, status: 'normal', targetHandover: aheadD(30) },
  { id: 'u-rk02', projectId: 'rko', code: 'Ruko 02', blockOrZone: 'Zona Ruko', type: 'Ruko 3 Lantai', stage: 'Finishing & Rolling Door', progressPct: 82, status: 'has_findings', openFindingRef: 'F-RKO-014', targetHandover: aheadD(30), notes: 'Fasad: Perbaikan cat melepuh (1,5 m²)' },
  { id: 'u-rk03', projectId: 'rko', code: 'Ruko 03', blockOrZone: 'Zona Ruko', type: 'Ruko 3 Lantai', stage: 'Instalasi MEP', progressPct: 64, status: 'need_inspection', activeInspectionRef: 'INSP-RKO-2026-0088', openFindingRef: 'F-RKO-012', targetHandover: aheadD(45), notes: 'Shaft L2: Relokasi pipa vs kabel' },
  { id: 'u-rk04', projectId: 'rko', code: 'Ruko 04', blockOrZone: 'Zona Ruko', type: 'Ruko 3 Lantai', stage: 'Dinding & Plesteran', progressPct: 52, status: 'normal', targetHandover: aheadD(55) },
  { id: 'u-rk05', projectId: 'rko', code: 'Ruko 05', blockOrZone: 'Zona Ruko', type: 'Ruko 3 Lantai', stage: 'Struktur Beton', progressPct: 44, status: 'normal', targetHandover: aheadD(65) },
  { id: 'u-rk06', projectId: 'rko', code: 'Ruko 06', blockOrZone: 'Zona Ruko', type: 'Ruko 3 Lantai', stage: 'Struktur Beton', progressPct: 38, status: 'delayed', targetHandover: aheadD(70), notes: 'Ready-mix: Pasokan batching plant terjadwal ulang' },
]

export const unitsOfProject = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return PROJECT_UNITS.filter((u) => u.projectId === norm || u.projectId === projectId)
}

/* ------------------------------------------------------------
 * Paket pekerjaan / aktivitas + titik ITP
 * ------------------------------------------------------------ */

export interface WorkPackage {
  id: string
  projectId: string
  code: string
  name: string
  discipline: string
  location: string
  itpRef: string
  /** Aktivitas berikutnya bersifat informasional (PRD §7.1). */
  nextActivity?: string
}

export const normalizeProjectId = (id: string): string => {
  if (id === 'aru') return 'naw'
  if (id === 'ks') return 'rko'
  if (id === 'jk') return 'gml'
  return id
}

export const WORK_PACKAGES: WorkPackage[] = [
  { id: 'wp-ar-l8', projectId: 'naw', code: 'NAW-STR-A05', name: 'Pembesian balok & pelat lantai 2 Unit A-05', discipline: 'Struktur beton', location: 'Blok A — Unit A-05 · Lantai 2', itpRef: 'Checklist Struktur Beton · Item 4.2', nextActivity: 'Pengecoran balok & pelat Unit A-05' },
  { id: 'wp-ar-l9', projectId: 'naw', code: 'NAW-ATP-B02', name: 'Rangka atap baja ringan & insulasi Unit B-02', discipline: 'Struktur atap', location: 'Blok B — Unit B-02 · Atap', itpRef: 'Checklist Rangka Atap · Item 3.1', nextActivity: 'Pemasangan genteng beton' },
  { id: 'wp-ar-l7', projectId: 'naw', code: 'NAW-ARC-A03', name: 'Pasangan bata ringan & plesteran Unit A-03', discipline: 'Arsitektur', location: 'Blok A — Unit A-03', itpRef: 'Checklist Dinding & Plesteran' },
  { id: 'wp-ar-mep8', projectId: 'naw', code: 'NAW-MEP-B12', name: 'Instalasi pipa air bersih & pembuangan Unit B-12', discipline: 'MEP / Plumbing', location: 'Blok B — Unit B-12', itpRef: 'Checklist Plumbing Air Bersih' },
  { id: 'wp-ks-mep', projectId: 'rko', code: 'RKO-MEP-03', name: 'Instalasi MEP & sanitair Ruko 03 Lantai 2', discipline: 'MEP', location: 'Ruko 03 — Lantai 2', itpRef: 'Checklist MEP Komersial' },
  { id: 'wp-ks-san', projectId: 'rko', code: 'RKO-PLB-01', name: 'Instalasi sanitair & pipa pembuangan Ruko 01', discipline: 'Plumbing', location: 'Ruko 01 — Lantai 1', itpRef: 'Checklist Plumbing Ruko' },
  { id: 'wp-ks-ff', projectId: 'rko', code: 'RKO-STR-02', name: 'Plesteran dinding & pemasangan keramik Ruko 02', discipline: 'Finishing', location: 'Ruko 02 — Lantai 1-3', itpRef: 'Checklist Finishing Ruko' },
  { id: 'wp-jk-sub', projectId: 'gml', code: 'GML-ARC-01', name: 'Partisi gypsum & plafon akustik Lantai 2', discipline: 'Arsitektur', location: 'Lantai 2 · Area Kantor', itpRef: 'Checklist Interior Graha Mulia' },
  { id: 'wp-bl-st', projectId: 'bl', code: 'BL-ST-01', name: 'Struktur baja kanopi & mezzanine', discipline: 'Struktur baja', location: 'Blok Gudang B', itpRef: 'Checklist Struktur Baja' },
]

/* ------------------------------------------------------------
 * Titik pemeriksaan & kendali mutu (Tahap Kritis) — PRD §9.7
 * ------------------------------------------------------------ */

export interface ReleaseCondition {
  id: string
  label: string
  met: boolean
  note?: string
}

export interface ControlPoint {
  id: string
  ref: string
  projectId: string
  activityId: string
  pointType: PointTypeId
  title: string
  itpRef: string
  /** Otoritas rilis yang disyaratkan prosedur (FR-HP-02). */
  releaseAuthority: string
  status: HoldPointStatusId
  /** Kondisi rilis — rilis hanya boleh bila semua terpenuhi (SC-23). */
  conditions?: ReleaseCondition[]
  nextActivity?: string
  relatedInspectionRef?: string
  note?: string
  /** Untuk witness point: jadwal & kehadiran (SC-06/07/26). */
  witness?: {
    party: string
    scheduledAt: string
    attendance: 'confirmed' | 'rescheduled' | 'recorded' | 'no_show'
    note?: string
  }
}

export const CONTROL_POINTS: ControlPoint[] = [
  {
    id: 'hp-ar-02',
    ref: 'CP-NW-02',
    projectId: 'naw',
    activityId: 'wp-ar-l8',
    pointType: 'hold',
    title: 'Pengecoran balok & pelat lantai 2 Unit A-05',
    itpRef: 'Checklist Struktur Beton · Item 4.2',
    releaseAuthority: 'Quality Lead · Ratna Dewi / Site Manager',
    status: 'awaiting_release',
    conditions: [
      { id: 'c1', label: 'Pemeriksaan tulangan Unit A-05 tercatat (WIR-AR-2026-0142)', met: true, note: 'Pemeriksaan fisik lapangan telah dilaksanakan; keputusan pengawas menunggu rekam.' },
      { id: 'c2', label: 'Tidak ada temuan terbuka pada pembesian balok B2', met: false, note: 'F-AR-021 · cover tulangan balok B2 kurang dari spesifikasi, masih terbuka.' },
      { id: 'c3', label: 'Verifikasi tindakan perbaikan oleh pengawas lapangan', met: false, note: 'Tindakan CA-021-1 menunggu verifikasi fisik di lapangan.' },
      { id: 'c4', label: 'Pembersihan bekisting & sparing pipa terpasang', met: true, note: 'Pipa sparing listrik dan plumbing telah tertanam rapi.' },
    ],
    nextActivity: 'Pengecoran balok & pelat lantai 2 Unit A-05',
    relatedInspectionRef: 'WIR-AR-2026-0142',
  },
  {
    id: 'wp-jk-01',
    ref: 'WP-RKO-01',
    projectId: 'rko',
    activityId: 'wp-ks-mep',
    pointType: 'witness',
    title: 'Uji tekan pipa air bersih Ruko 03 Lantai 2',
    itpRef: 'Checklist MEP Komersial · Item 2.4',
    releaseAuthority: 'Konsultan Pengawas · CV Mitra Desain',
    status: 'awaiting_inspection',
    witness: {
      party: 'Konsultan Pengawas (CV Mitra Desain)',
      scheduledAt: aheadH(30),
      attendance: 'rescheduled',
      note: 'Kehadiran dijadwalkan ulang (konsultan berhalangan); waktu baru tercatat & pemberitahuan ulang terkirim.',
    },
    relatedInspectionRef: 'WIR-KS-2026-0088',
  },
  {
    id: 'hp-jk-01',
    ref: 'CP-NW-05',
    projectId: 'naw',
    activityId: 'wp-ar-l9',
    pointType: 'hold',
    title: 'Persetujuan pemasangan penutup genteng Unit B-02',
    itpRef: 'Checklist Rangka Atap · Item 3.1',
    releaseAuthority: 'Site Manager · Rizky Hidayat',
    status: 'not_due',
    nextActivity: 'Pemasangan genteng beton & nok',
  },
  {
    id: 'rp-ks-01',
    ref: 'RP-GML-01',
    projectId: 'gml',
    activityId: 'wp-jk-sub',
    pointType: 'review',
    title: 'Review shop drawing tata letak partisi ruangan',
    itpRef: 'Checklist Arsitektur · Item 1.2',
    releaseAuthority: 'Konsultan · PT Cipta Karya Desain',
    status: 'awaiting_release',
    note: 'Review denah partisi dan jalur kabel daya.',
    relatedInspectionRef: 'WIR-JK-2026-0041',
  },
]

/* ------------------------------------------------------------
 * Referensi dokumen acuan — gambar kerja & spesifikasi
 * ------------------------------------------------------------ */

export interface DocRef {
  id: string
  title: string
  number: string
  rev: string
  status: 'current' | 'superseded'
  issued: string
  /** Dipakai pada pengajuan ini? (untuk warning revisi berubah) */
  usedRevAtSubmission?: string
}

export const DOCS: Record<string, DocRef> = {
  s301c: { id: 's301c', title: 'Gambar Detail Pembesian Balok & Pelat Unit A-05', number: 'STR-A05', rev: 'C', status: 'current', issued: agoD(24), usedRevAtSubmission: 'C' },
  s301b: { id: 's301b', title: 'Gambar Detail Pembesian Balok & Pelat Unit A-05', number: 'STR-A05', rev: 'B', status: 'superseded', issued: agoD(120) },
  mep12: { id: 'mep12', title: 'Shop Drawing Jalur Pipa Sanitair & Listrik Ruko', number: 'MEP-RK-03', rev: '2', status: 'current', issued: agoD(9) },
  speccon: { id: 'speccon', title: 'Spesifikasi Pekerjaan Struktur & Pasangan Nawasena', number: 'SPEC-NW-01', rev: '1', status: 'current', issued: agoD(300) },
  itpjkrw: { id: 'itpjkrw', title: 'Checklist Acuan Rangka Atap Baja Ringan', number: 'CHK-ATP-01', rev: '2', status: 'current', issued: agoD(60) },
}

/* ------------------------------------------------------------
 * Inspeksi — 16 catatan mencakup seluruh status §10.1
 * ------------------------------------------------------------ */

export interface ChecklistItem {
  id: string
  label: string
  /** Sumber persyaratan: gambar/spec/ITP + revisi (FR-ID-03). */
  source?: string
  result?: 'ok' | 'na' | 'issue'
  note?: string
}

export interface EvidenceItem {
  id: string
  kind: 'photo' | 'doc' | 'test'
  title: string
  meta: string
  /** SC-29: lampiran tidak tersedia/korup → kartu dirancang khusus. */
  unavailable?: boolean
  restricted?: boolean
}

export interface TimelineEvent {
  id: string
  at: string
  actor: string
  role: string
  title: string
  note?: string
  detail?: string
  /** Kunci pemetaan ikon + tone di halaman. */
  kind:
  | 'created' | 'submitted' | 'review' | 'external' | 'scheduled'
  | 'in_progress' | 'accepted' | 'correction' | 'clarification'
  | 'reinspection' | 'rescheduled' | 'unable' | 'withdrawn' | 'cancelled'
  | 'finding' | 'action' | 'verified' | 'rejected' | 'release'
  | 'evidence' | 'doc'
}

export interface Inspection {
  id: string
  ref: string
  projectId: string
  activityId: string
  title: string
  discipline?: string
  activityType?: string
  targetScope: string
  scope: string
  /** Lokasi kerja granular (FR-ID-04). */
  location: string
  locationDetail?: string
  pointType: PointTypeId
  itpRef: string
  status: InspectionStatusId
  submittedAt?: string
  requestedAt?: string
  scheduledAt?: string
  decidedAt?: string
  submitter: Person
  reviewer: string
  /** Pihak eksternal yang berwenang bila relevan. */
  externalAuthority?: string
  noticeHours: number
  /** Tindakan berikutnya + penanggung jawab + target (FR-IN-01). */
  nextAction?: {
    actionType?: string
    component?: string
    label: string
    owner: string
    dueAt?: string
  }
  documents: DocRef[]
  checklist: ChecklistItem[]
  /** SC-01: daftar kekurangan pengajuan, eksplisit. */
  missingItems?: string[]
  evidence: EvidenceItem[]
  linkedFindingIds: string[]
  priorInspectionIds: string[]
  holdPointId?: string
  timeline: TimelineEvent[]
  decision?: {
    outcome: string
    statusId: InspectionStatusId
    by: string
    role: string
    scope: string
    comment: string
  }
}

const SARI: Person = { name: 'Sari Wulandari', org: 'QA/QC · PT KBN', role: 'qc_inspector' }
const BUDI: Person = { name: 'Budi Santoso', org: 'PT Karya Bangun Nusantara', role: 'site_engineer' }

export const INSPECTIONS: Inspection[] = [
  /* ---------- Cluster Nawasena — inti skenario demo operasional ---------- */
  {
    id: 'wir-ar-0142',
    ref: 'INSP-NW-2026-0142',
    projectId: 'naw',
    activityId: 'wp-ar-l8',
    discipline: 'Struktur Beton',
    activityType: 'Pembesian Balok & Pelat',
    targetScope: 'Unit A-05 · Lantai 2',
    title: '[Unit A-05] Pembesian Balok & Pelat L2',
    scope: 'Pembesian balok B1-B2 & pelat lantai 2 Unit A-05 · besi D13 & D10, selimut beton 25 mm',
    location: 'Blok A — Unit A-05 · Lantai 2',
    locationDetail: 'Balok B2 sisi timur & pelat lantai 2 Unit A-05',
    pointType: 'hold',
    itpRef: 'Checklist Struktur Beton · Item 4.2',
    status: 'reinspection_requested',
    submittedAt: agoD(6),
    requestedAt: aheadH(20),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    externalAuthority: undefined,
    noticeHours: 24,
    nextAction: {
      actionType: 'Verifikasi Lapangan',
      component: 'Spacer Selimut Beton 25 mm',
      label: 'Verifikasi hasil perbaikan selimut beton',
      owner: 'Sari Wulandari (Pengawas Kualitas)',
      dueAt: aheadH(26),
    },
    documents: [DOCS.s301c, DOCS.s301b, DOCS.speccon],
    checklist: [
      { id: 'ck1', label: 'Diameter, jarak sengkang & jumlah tulangan sesuai gambar kerja (STR-A05)', source: 'STR-A05 Rev C · Sheet 2', result: 'ok' },
      { id: 'ck2', label: 'Tebal selimut beton/cover block sesuai spesifikasi (25 mm)', source: 'SPEC-NW-01 Rev 1 §5.3', result: 'issue', note: 'Cover sebagian 20 mm di balok B2; spacer standar 25 mm sudah dipasang & difoto ulang' },
      { id: 'ck3', label: 'Kerapatan ikatan kawat bendrat & posisi sambungan kait', source: 'Checklist Struktur 4.2.b', result: 'ok' },
      { id: 'ck4', label: 'Kebersihan bekisting dari serpihan kayu dan serbuk', source: 'Checklist Struktur 4.2.c', result: 'ok' },
      { id: 'ck5', label: 'Pipa sparing instalasi listrik dan sanitair terpasang rapi', source: 'SPEC-NW-01 Rev 1 §7.1', result: 'ok', note: 'Pipa sparing conduit & buangan aman' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto cover tulangan setelah perbaikan spacer 25 mm', meta: '8 foto · Budi Santoso · terlampir pada pengajuan ulang' },
      { id: 'ev2', kind: 'doc', title: 'Laporan pengawasan harian lapangan LHR-NAW-1030', meta: 'PDF · 2 hal · PT Cipta Graha Konsultan' },
      { id: 'ev3', kind: 'test', title: 'Surat jalan & sertifikat uji tarik besi D13/D10 SNI', meta: 'PDF · pabrikan' },
      { id: 'ev4', kind: 'photo', title: 'Foto kondisi sebelum koreksi (riwayat)', meta: '6 foto · arsip pengajuan pertama', unavailable: true },
    ],
    linkedFindingIds: ['f-ar-021'],
    priorInspectionIds: ['wir-ar-0131'],
    holdPointId: 'hp-ar-02',
    timeline: [
      { id: 't1', at: agoD(6), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan pemeriksaan dibuat', kind: 'created', detail: 'INSP-NW-2026-0142 · lingkup Unit A-05 Lantai 2 · STR-A05 Rev C' },
      { id: 't2', at: agoH(140), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan untuk pemeriksaan kualitas', kind: 'submitted', note: 'Pemberitahuan diajukan sesuai checklist operasional.' },
      { id: 't3', at: agoD(4), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Hasil pemeriksaan: Perlu Perbaikan', kind: 'correction', note: 'Cover tulangan balok B2 sebagian terukur 20 mm (spesifikasi 25 mm). Mandor diminta pasang spacer beton standar.', detail: 'Catatan pekerjaan lapangan, bukan NCR formal.' },
      { id: 't4', at: agoD(3), actor: BUDI.name, role: 'Site Engineer', title: 'Perbaikan dikerjakan + bukti dilampirkan', kind: 'evidence', note: 'Spacer diganti 25 mm tiap jarak 60 cm; 8 foto baru dilampirkan.' },
      { id: 't5', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', title: 'Verifikasi perbaikan diajukan', kind: 'reinspection', detail: 'Tertaut ke INSP-NW-2026-0142; riwayat catatan awal tersimpan rapi.' },
      { id: 't6', at: agoH(20), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Pemeriksaan ulang dilaksanakan di lapangan', kind: 'in_progress', note: 'Pemeriksaan lapangan selesai; konfirmasi formal menunggu perekaman.' },
    ],
  },
  {
    id: 'wir-ar-0151',
    ref: 'INSP-NW-2026-0151',
    projectId: 'naw',
    activityId: 'wp-ar-l9',
    discipline: 'Struktur Atap',
    activityType: 'Rangka Kuda-kuda Baja Ringan',
    targetScope: 'Unit B-02 · Atap',
    title: '[Unit B-02] Rangka Kuda-kuda Baja Ringan',
    scope: 'Kuda-kuda baja ringan, bracing, reng, dan dynabolt ringbalk Unit B-02',
    location: 'Blok B — Unit B-02 · Atap',
    pointType: 'witness',
    itpRef: 'Checklist Rangka Atap · Item 3.1',
    status: 'submitted',
    submittedAt: agoH(9),
    requestedAt: aheadD(2),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    nextAction: {
      actionType: 'Review Checklist',
      component: 'Jarak Kuda-kuda & Dynabolt',
      label: 'Review checklist & jadwalkan cek lapangan',
      owner: 'Sari Wulandari (Pengawas Kualitas)',
      dueAt: aheadH(30),
    },
    documents: [DOCS.s301c],
    checklist: [
      { id: 'ck1', label: 'Dimensi profil kanal C & reng sesuai gambar', source: 'STR-A05 Rev C · Sheet 4', result: 'ok' },
      { id: 'ck2', label: 'Jarak kuda-kuda maks 1,2 m & kerapatan sekrup self-drilling', source: 'Checklist Rangka Atap 3.1.a', result: 'ok' },
      { id: 'ck3', label: 'Ikatan dynabolt ke ringbalk terpasang kokoh', source: 'Checklist Rangka Atap 3.1.c', result: 'na' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto sambungan kuda-kuda baja ringan', meta: '5 foto · Budi Santoso' },
      { id: 'ev2', kind: 'doc', title: 'Checklist fabrikasi rangka atap', meta: 'PDF · ditandatangani mandor' },
    ],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoH(10), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan dibuat', kind: 'created' },
      { id: 't2', at: agoH(9), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan untuk pemeriksaan', kind: 'submitted', note: 'Menunggu penugasan pengawas kualitas.' },
    ],
  },
  {
    id: 'wir-ar-0131',
    ref: 'INSP-NW-2026-0131',
    projectId: 'naw',
    activityId: 'wp-ar-l8',
    discipline: 'Struktur Pondasi',
    activityType: 'Pondasi Batu Kali & Sloof',
    targetScope: 'Unit C-03 · Sloof Dasar',
    title: '[Unit C-03] Pondasi Batu Kali & Sloof',
    scope: 'Dimensi sloof 15/20 cm, besi 4D12, begel D8-150 Unit C-03',
    location: 'Blok C — Unit C-03',
    pointType: 'hold',
    itpRef: 'Checklist Pondasi & Sloof · Item 2.1',
    status: 'accepted',
    submittedAt: agoD(11),
    requestedAt: agoD(9),
    decidedAt: agoD(9),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    documents: [DOCS.s301c, DOCS.s301b],
    checklist: [
      { id: 'ck1', label: 'Ukuran dimensi sloof & kedalaman pondasi', source: 'STR-A05 Rev C · Sheet 2', result: 'ok' },
      { id: 'ck2', label: 'Jarak begel & penyaluran stek kolom praktis', source: 'SPEC-NW-01 Rev 1 §5.1', result: 'ok' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto pembesian sloof Unit C-03', meta: '6 foto · Budi Santoso' },
    ],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(11), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(10), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Pemeriksaan fisik di lokasi Unit C-03', kind: 'in_progress' },
      { id: 't3', at: agoD(9), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Hasil pemeriksaan: Sesuai', kind: 'accepted', note: 'Dimensi & tulangan sesuai gambar kerja.' },
    ],
    decision: { outcome: 'Sesuai', statusId: 'accepted', by: SARI.name, role: 'Pengawas Kualitas', scope: 'Sloof pondasi Unit C-03 · STR-A05 Rev C', comment: 'Sesuai gambar & spesifikasi. Siap dicor.' },
  },
  {
    id: 'wir-ar-0128',
    ref: 'INSP-NW-2026-0128',
    projectId: 'naw',
    activityId: 'wp-ar-l7',
    discipline: 'Pekerjaan Dinding',
    activityType: 'Plesteran & Acian Dinding',
    targetScope: 'Unit A-03 · Dinding L1',
    title: '[Unit A-03] Plesteran & Acian Dinding',
    scope: 'Plesteran bata ringan & acian halus dinding ruang keluarga Unit A-03',
    location: 'Blok A — Unit A-03 · Lantai 1',
    pointType: 'surveillance',
    itpRef: 'Checklist Dinding & Plesteran · Item 3.2',
    status: 'accepted',
    submittedAt: agoD(14),
    decidedAt: agoD(13),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    documents: [],
    checklist: [
      { id: 'ck1', label: 'Kelurusan permukaan dinding & bebas retak', source: 'Checklist Dinding 3.2', result: 'ok' },
    ],
    evidence: [{ id: 'ev1', kind: 'photo', title: 'Foto dinding setelah diaci', meta: '4 foto' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(14), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(13), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Hasil pemeriksaan: Sesuai', kind: 'accepted' },
    ],
    decision: { outcome: 'Sesuai', statusId: 'accepted', by: SARI.name, role: 'Pengawas Kualitas', scope: 'Dinding Unit A-03 · Checklist Dinding', comment: 'Rata, siku, dan siap dicat dasar.' },
  },
  {
    id: 'wir-ar-0135',
    ref: 'INSP-NW-2026-0135',
    projectId: 'naw',
    activityId: 'wp-ar-l7',
    discipline: 'Sanitair & Basah',
    activityType: 'Uji Genangan Air 24 Jam',
    targetScope: 'Unit A-05 · KM Lantai 2',
    title: '[Unit A-05] Uji Genangan Waterproofing KM',
    scope: 'Uji genangan air 24 jam lantai kamar mandi Unit A-05 Lantai 2',
    location: 'Blok A — Unit A-05 · Lantai 2',
    pointType: 'hold',
    itpRef: 'Checklist Sanitair & Waterproofing · Item 2.3',
    status: 'deferred',
    submittedAt: agoD(5),
    requestedAt: agoD(2),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    nextAction: {
      actionType: 'Jadwal Ulang',
      component: 'Uji Genangan Mandor Plumbing',
      label: 'Jadwalkan ulang uji genangan air',
      owner: 'Budi Santoso (Site Eng)',
      dueAt: aheadD(1),
    },
    documents: [],
    checklist: [
      { id: 'ck1', label: 'Genangan 24 jam tanpa rembes ke lantai bawah', source: 'Checklist Sanitair 2.3', result: 'na' },
    ],
    evidence: [{ id: 'ev1', kind: 'photo', title: 'Foto lantai kamar mandi dalam pengujian', meta: '3 foto' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(5), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(2), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Tidak dapat diperiksa, pengawas berhalangan', kind: 'unable', note: 'Pemeriksa berhalangan hadir; waktu asli tercatat.' },
      { id: 't3', at: agoH(30), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Ditunda & dijadwalkan ulang', kind: 'rescheduled', detail: 'Jadwal baru disepakati bersama mandor plumbing.' },
    ],
  },
  {
    id: 'wir-ar-0119',
    ref: 'INSP-NW-2026-0119',
    projectId: 'naw',
    activityId: 'wp-ar-mep8',
    discipline: 'Pekerjaan MEP',
    activityType: 'Pipa Distribusi Air Bersih',
    targetScope: 'Blok B · Distribusi Air',
    title: '[Blok B] Jalur Pipa Distribusi PVC AW',
    scope: 'Pipa distribusi air bersih PVC AW DN25 Blok B',
    location: 'Blok B — Saluran Distribusi',
    pointType: 'review',
    itpRef: 'Checklist Plumbing · Item 1.2',
    status: 'withdrawn',
    submittedAt: agoD(9),
    decidedAt: agoD(8),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    documents: [],
    checklist: [],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(9), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(8), actor: BUDI.name, role: 'Site Engineer', title: 'Ditarik oleh pengirim', kind: 'withdrawn', note: 'Digabungkan dengan pengajuan saluran terpadu Blok B.' },
    ],
  },
  {
    id: 'wir-ar-0147',
    ref: 'INSP-NW-2026-0147',
    projectId: 'naw',
    activityId: 'wp-ar-mep8',
    discipline: 'Finishing Lantai',
    activityType: 'Pemasangan Granit Tile 40x40',
    targetScope: 'Unit A-01 · Ruang Tamu',
    title: '[Unit A-01] Pemasangan Granit Tile 40x40',
    scope: 'Keramik lantai granit tile 40x40 area ruang tamu Unit A-01',
    location: 'Blok A — Unit A-01 · Ruang Tamu',
    pointType: 'witness',
    itpRef: 'Checklist Finishing Keramik · Item 2.4',
    status: 'draft',
    submitter: BUDI,
    reviewer: 'Belum ditunjuk',
    noticeHours: 24,
    nextAction: {
      actionType: 'Pengajuan QC',
      component: 'Review Kerataan Nat',
      label: 'Ajukan verifikasi kerataan nat lantai',
      owner: 'Budi Santoso (Site Eng)',
      dueAt: aheadD(2),
    },
    documents: [],
    checklist: [{ id: 'ck1', label: 'Kerataan nat & kelurusan pemasangan', source: 'Checklist Finishing 2.4' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoH(5), actor: BUDI.name, role: 'Site Engineer', title: 'Draf dibuat, belum diajukan', kind: 'created' },
    ],
  },

  /* ---------- Pembangunan Ruko Grand Harmoni ---------- */
  {
    id: 'wir-ks-0088',
    ref: 'INSP-RKO-2026-0088',
    projectId: 'rko',
    activityId: 'wp-ks-mep',
    discipline: 'Pekerjaan MEP',
    activityType: 'Pipa Sanitair & Kabel Daya',
    targetScope: 'Ruko 03 · Shaft Lantai 2',
    title: '[Ruko 03] Pipa Sanitair & Tray Kabel L2',
    scope: 'Instalasi pipa PPR air bersih, pipa buangan PVC & kabel daya Ruko 03',
    location: 'Ruko 03 — Lantai 2 · Toilet & Shaft',
    pointType: 'review',
    itpRef: 'Checklist MEP Komersial · Item 2.5',
    status: 'clarification_required',
    submittedAt: agoD(3),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    externalAuthority: 'CV Mitra Desain',
    noticeHours: 24,
    missingItems: [
      'Nomor revisi shop drawing sanitair Ruko 03 belum dicantumkan (MEP-RK-03 Rev 2)',
      'Foto jalur tray kabel vs pipa air belum terlampir jelas',
    ],
    nextAction: {
      actionType: 'Klarifikasi Gambar',
      component: 'Revisi Shop Drawing MEP-RK-03',
      label: 'Lengkapi referensi gambar & kirim klarifikasi',
      owner: 'Budi Santoso (Site Eng)',
      dueAt: aheadD(2),
    },
    documents: [DOCS.mep12],
    checklist: [
      { id: 'ck1', label: 'Jalur kabel daya & pemisahan dari pipa air', source: 'MEP-RK-03 Rev 2', result: 'issue', note: 'Jarak jalur kabel daya dan pipa air terlalu dekat (<20 cm)' },
      { id: 'ck2', label: 'Klem pipa & support penggantung terpasang kokoh', source: 'Checklist MEP 2.5.b', result: 'ok' },
      { id: 'ck3', label: 'Penandaan jalur pipa air bersih & air kotor', source: 'Checklist MEP 2.5.d', result: 'ok' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto instalasi pipa & kabel di shaft Ruko 03', meta: '8 foto · Budi Santoso' },
      { id: 'ev2', kind: 'test', title: 'Hasil uji kontinuitas instalasi kabel', meta: 'PDF · 1 hal' },
    ],
    linkedFindingIds: ['f-ks-012'],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(3), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(2), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Perlu klarifikasi pemisahan jalur pipa', kind: 'clarification', note: 'Jalur pipa dan kabel daya berhimpitan di shaft; mohon konfirmasi revisi denah jalur.', detail: 'Bukan kegagalan konstruksi; dikembalikan untuk penataan jalur.' },
    ],
  },
  {
    id: 'wir-ks-0079',
    ref: 'INSP-RKO-2026-0079',
    projectId: 'rko',
    activityId: 'wp-ks-san',
    discipline: 'Pekerjaan Plumbing',
    activityType: 'Pipa Pembuangan PVC 4 Inch',
    targetScope: 'Ruko 01 · Lantai Dasar',
    title: '[Ruko 01] Pipa Pembuangan Air Kotor L1',
    scope: 'Pipa air kotor & pipa limbah PVC 4 inch lantai dasar Ruko 01',
    location: 'Ruko 01 — Lantai 1',
    pointType: 'witness',
    itpRef: 'Checklist Plumbing Ruko · Item 2.1',
    status: 'accepted',
    submittedAt: agoD(8),
    decidedAt: agoD(7),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Kemiringan pipa pembuangan minimal 2%', source: 'Checklist Plumbing 2.1', result: 'ok' }],
    evidence: [{ id: 'ev1', kind: 'test', title: 'Berita acara uji gelontor air', meta: 'PDF' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(8), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(7), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Hasil pemeriksaan: Sesuai', kind: 'accepted' },
    ],
    decision: { outcome: 'Sesuai', statusId: 'accepted', by: SARI.name, role: 'Pengawas Kualitas', scope: 'Saluran pembuangan Ruko 01', comment: 'Aliran lancar, kemiringan memenuhi standar.' },
  },
  {
    id: 'wir-ks-0091',
    ref: 'INSP-RKO-2026-0091',
    projectId: 'rko',
    activityId: 'wp-ks-ff',
    discipline: 'Finishing Fasad',
    activityType: 'Rolling Door & Lantai 60x60',
    targetScope: 'Ruko 02 · Lantai 1',
    title: '[Ruko 02] Rolling Door & Keramik L1',
    scope: 'Rolling door aluminium & keramik lantai dasar 60x60 Ruko 02',
    location: 'Ruko 02 — Lantai 1',
    pointType: 'hold',
    itpRef: 'Checklist Finishing Ruko · Item 3.2',
    status: 'scheduled',
    submittedAt: agoD(2),
    requestedAt: aheadD(3),
    scheduledAt: aheadD(3),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    externalAuthority: 'CV Mitra Desain',
    noticeHours: 24,
    nextAction: {
      actionType: 'Persiapan Lapangan',
      component: 'Area Kerja & Uji Buka-Tutup',
      label: 'Siapkan area dan kelengkapan operasional',
      owner: 'Budi Santoso (Site Eng)',
      dueAt: aheadD(3),
    },
    documents: [],
    checklist: [{ id: 'ck1', label: 'Kunci rolling door & kelancaran buka-tutup', source: 'Checklist Finishing 3.2' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(2), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(1), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Terjadwal pemeriksaan bersama', kind: 'scheduled', detail: 'Jadwal: H+3 pukul 10:00 WIB bersama pengawas.' },
    ],
  },

  /* ---------- Renovasi Gedung Graha Mulia ---------- */
  {
    id: 'wir-jk-0041',
    ref: 'INSP-GML-2026-0041',
    projectId: 'gml',
    activityId: 'wp-jk-sub',
    discipline: 'Interior & Plafon',
    activityType: 'Rangka Hollow & Gypsum 9 mm',
    targetScope: 'Lantai 2 · Ruang Rapat',
    title: '[Lantai 2] Partisi Gypsum & Plafon',
    scope: 'Rangka hollow galvalum & gypsum board 9 mm ruang rapat Graha Mulia',
    location: 'Lantai 2 · Area Ruang Rapat',
    pointType: 'witness',
    itpRef: 'Checklist Interior Graha Mulia · Item 3.4',
    status: 'scheduled',
    submittedAt: agoD(4),
    scheduledAt: aheadH(30),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Desain',
    externalAuthority: 'PT Cipta Karya Desain',
    noticeHours: 24,
    nextAction: {
      actionType: 'Konfirmasi Jadwal',
      component: 'Witness Pengawas Arsitektur',
      label: 'Konfirmasi kehadiran pengawas arsitektur',
      owner: 'PT Cipta Karya (Konsultan)',
      dueAt: aheadH(24),
    },
    documents: [DOCS.itpjkrw],
    checklist: [
      { id: 'ck1', label: 'Kerataan permukaan & jarak sekrup gypsum maks 20 cm', source: 'Checklist Interior 3.4', result: 'na' },
    ],
    evidence: [{ id: 'ev1', kind: 'photo', title: 'Foto rangka partisi hollow', meta: '6 foto' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(4), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(2), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Jadwal disesuaikan dengan pengawas arsitek', kind: 'rescheduled', note: 'Waktu pemeriksaan disepakati ulang ke H+1 pukul 14:00.' },
      { id: 't3', at: agoD(1), actor: 'Yusuf Maulana', role: 'Site Manager', title: 'Jadwal baru dikonfirmasi', kind: 'scheduled', detail: 'Waktu baru: H+1 pukul 14:00.' },
    ],
  },
  {
    id: 'wir-jk-0033',
    ref: 'INSP-GML-2026-0033',
    projectId: 'gml',
    activityId: 'wp-jk-sub',
    discipline: 'Finishing Lantai',
    activityType: 'Epoxy Primer & Perataan Lantai',
    targetScope: 'Lantai 1 · Lobby Depan',
    title: '[Lantai 1] Coating Lantai Epoxy Primer',
    scope: 'Coating epoxy primer & perataan lantai lobby Graha Mulia',
    location: 'Lantai 1 · Lobby Depan',
    pointType: 'witness',
    itpRef: 'Checklist Interior · Item 2.3',
    status: 'accepted',
    submittedAt: agoD(10),
    decidedAt: agoD(9),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Desain',
    externalAuthority: 'PT Cipta Karya Desain',
    noticeHours: 24,
    documents: [DOCS.itpjkrw],
    checklist: [{ id: 'ck1', label: 'Ketebalan coating epoxy & daya rekat', source: 'Checklist Interior 2.3', result: 'ok', note: 'Hasil uji gores baik' }],
    evidence: [{ id: 'ev1', kind: 'test', title: 'Laporan uji daya rekat epoxy', meta: 'PDF · 2 hal' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(10), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(9), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Hasil pemeriksaan: Sesuai', kind: 'accepted' },
    ],
    decision: { outcome: 'Sesuai', statusId: 'accepted', by: 'PT Cipta Karya', role: 'Konsultan', scope: 'Lantai lobby Graha Mulia', comment: 'Rata, mengkilap, dan daya rekat memenuhi.' },
  },
  {
    id: 'wir-jk-0027',
    ref: 'INSP-GML-2026-0027',
    projectId: 'gml',
    activityId: 'wp-jk-sub',
    discipline: 'Fasad Arsitektur',
    activityType: 'Kusen Aluminium & Kaca 10 mm',
    targetScope: 'Lantai 1 · Fasad Depan',
    title: '[Fasad Depan] Material Kaca & Kusen 4"',
    scope: 'Kusen aluminium 4 inch & kaca tempered 10 mm fasad depan',
    location: 'Area Fasad Depan',
    pointType: 'review',
    itpRef: 'Checklist Material · Item 5.0',
    status: 'external_review',
    submittedAt: agoD(5),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Desain',
    externalAuthority: 'PT Cipta Karya Desain',
    noticeHours: 0,
    nextAction: {
      actionType: 'Review Sampel',
      component: 'Persetujuan Kaca Tempered',
      label: 'Konfirmasi persetujuan sampel kaca',
      owner: 'PT Cipta Karya (Konsultan)',
      dueAt: aheadD(1),
    },
    documents: [DOCS.itpjkrw],
    checklist: [{ id: 'ck1', label: 'Sampel profil aluminium & ketebalan anodize', source: 'Checklist Material 5.0' }],
    evidence: [{ id: 'ev1', kind: 'doc', title: 'Brosur & sertifikat spesifikasi kaca tempered', meta: 'PDF · 5 hal' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(5), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(4), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Sampel diperiksa, diteruskan ke konsultan arsitek', kind: 'review' },
    ],
  },
  {
    id: 'wir-jk-0038',
    ref: 'INSP-GML-2026-0038',
    projectId: 'gml',
    activityId: 'wp-jk-sub',
    discipline: 'Pekerjaan MEP',
    activityType: 'Kabel Data Cat6 & Stop Kontak',
    targetScope: 'Lantai 2 · Ruang Rapat',
    title: '[Lantai 2] Kabel Data Cat6 & Elektrikal',
    scope: 'Kabel data Cat6 & stop kontak tersembunyi ruang kerja',
    location: 'Lantai 2 · Ruang Rapat',
    pointType: 'surveillance',
    itpRef: 'Checklist MEP Graha Mulia · Item 2.3',
    status: 'in_progress',
    submittedAt: agoD(1),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Desain',
    noticeHours: 24,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Labeling kabel & konektivitas jaringan', source: 'Checklist MEP 2.3' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoH(4), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Pemeriksaan sedang berlangsung', kind: 'in_progress' },
    ],
  },

  /* ---------- Gudang Bantan (arsip, hanya-baca) ---------- */
  {
    id: 'wir-bl-0202',
    ref: 'INSP-BL-2025-0202',
    projectId: 'bl',
    activityId: 'wp-bl-st',
    discipline: 'Struktur Baja',
    activityType: 'Ereksi Kolom & Balok WF',
    targetScope: 'Blok Gudang B · Grid 3-7',
    title: '[Gudang B] Ereksi Kolom & Balok WF',
    scope: 'Ereksi kolom & balok WF · blok gudang B',
    location: 'Blok Gudang B · Grid 3-7/A-D',
    pointType: 'hold',
    itpRef: 'Checklist Struktur Baja · Item 4.1',
    status: 'accepted',
    submittedAt: agoD(400),
    decidedAt: agoD(398),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 48,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Kekencangan baut & ketegakan kolom', source: 'Checklist Struktur Baja 4.1', result: 'ok' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(400), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(398), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Hasil pemeriksaan: Sesuai', kind: 'accepted' },
    ],
    decision: { outcome: 'Sesuai', statusId: 'accepted', by: SARI.name, role: 'Pengawas Kualitas', scope: 'Ereksi mezzanine', comment: 'Rekaman historis arsip (hanya-baca).' },
  },
  {
    id: 'wir-bl-0196',
    ref: 'INSP-BL-2025-0196',
    projectId: 'bl',
    activityId: 'wp-bl-st',
    discipline: 'Finishing Proteksi',
    activityType: 'Cat Primer Anti-Karat',
    targetScope: 'Blok Gudang B · Zona 2',
    title: '[Gudang B] Primer Anti-Karat & Cat',
    scope: 'Primer anti-karat & cat finishing · zona 2',
    location: 'Blok Gudang B · Zona 2',
    pointType: 'review',
    itpRef: 'Checklist Pengecatan · Item 6.1',
    status: 'cancelled',
    submittedAt: agoD(380),
    decidedAt: agoD(379),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (Pengawas Kualitas)',
    noticeHours: 24,
    documents: [],
    checklist: [],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(380), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(379), actor: 'Ratna Dewi', role: 'Manajer Mutu', title: 'Dibatalkan', kind: 'cancelled', note: 'Lingkup dialihkan ke vendor cat eksternal.' },
    ],
  },
]

/* ------------------------------------------------------------
 * Temuan & tindakan perbaikan — PRD §9.6 / §10.2
 * ------------------------------------------------------------ */

export interface MeasurementBenchmark {
  param: string            // "Tebal Selimut Beton"
  actual: number           // 20
  spec: number             // 25
  unit: string             // "mm"
  diff: string             // "-5 mm"
  diffPct: string          // "-20%"
  status: 'below' | 'above' | 'compliant'
  statusLabel: string      // "Di Bawah Spesifikasi"
  specRef: string          // "SPEC-NW-01 §5.3"
  element: string          // "Balok B2 (Unit A-05)"
  secondaryPoints?: { label: string; value: string; compliant: boolean }[]
}

export interface RootCauseIndication {
  category: string         // "Material / Aksesoris"
  component: string        // "Spacer Beton / Tahu Beton"
  trigger: string          // "Lepas saat perakitan tulangan oleh tukang besi"
}

export interface StructuredActionPlan {
  actionType: string       // "Pasang Ulang / Replace"
  component: string        // "Spacer Beton 25 mm"
  location: string         // "Balok B2 · Unit A-05"
  photoRequired: boolean   // true
  photoCount?: number      // 8
  submittedBy?: string     // "Budi Santoso"
}

export interface CorrectiveAction {
  id: string
  ref: string
  description: string
  actionPlan?: StructuredActionPlan
  assignee: string
  assigneeOrg: string
  dueAt: string
  status: 'in_progress' | 'submitted' | 'verification_pending' | 'verified' | 'rejected'
  evidenceNote?: string
  evidenceCount?: number
  evidenceType?: string
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
}

export interface Finding {
  id: string
  ref: string
  projectId: string
  inspectionRef?: string
  location: string
  trade?: string
  element?: string
  defectType?: string
  title: string
  /** Fakta objektif terpisah dari dugaan penyebab (FR-FA-03). */
  facts: string
  benchmark?: MeasurementBenchmark
  rootCause?: RootCauseIndication
  actionPlan?: StructuredActionPlan
  suspectedCause?: string
  affectedExtent: string
  sourceRequirement: string
  classification: FindingClassificationId
  status: FindingStatusId
  identifiedAt: string
  identifiedBy: string
  assignee: string
  dueAt?: string
  /** NCR: referensi atau indikator "perlu NCR" (FR-FA-04). */
  ncrRef?: string
  ncrRequired?: boolean
  actions: CorrectiveAction[]
  timeline: TimelineEvent[]
}

export const FINDINGS: Finding[] = [
  {
    id: 'f-ar-021',
    ref: 'F-NW-021',
    projectId: 'naw',
    inspectionRef: 'INSP-NW-2026-0142',
    location: 'Blok A — Unit A-05 · Lantai 2 · Balok B2',
    trade: 'Struktur Beton',
    element: 'Balok B2 (Unit A-05)',
    defectType: 'Tebal Selimut Kurang (20 mm)',
    title: '[Balok B2] Tebal Selimut Kurang (<25 mm)',
    facts: 'Pengukuran lapangan pada balok B2 Unit A-05 menunjukkan selimut beton 20 mm; spesifikasi menetapkan 25 mm (SPEC-NW-01 §5.3). Titik lainnya pada balok B1 sesuai.',
    benchmark: {
      param: 'Tebal Selimut Beton',
      actual: 20,
      spec: 25,
      unit: 'mm',
      diff: '-5 mm',
      diffPct: '-20%',
      status: 'below',
      statusLabel: 'Di Bawah Spesifikasi',
      specRef: 'SPEC-NW-01 Rev 1 §5.3',
      element: 'Balok B2 (Bentang 3,5 m sisi timur Unit A-05)',
      secondaryPoints: [{ label: 'Balok B1', value: '25 mm', compliant: true }],
    },
    rootCause: {
      category: 'Material / Aksesoris',
      component: 'Spacer Beton / Tahu Beton',
      trigger: 'Lepas saat perakitan tulangan oleh tukang besi',
    },
    actionPlan: {
      actionType: 'Pasang Ulang',
      component: 'Spacer beton 25 mm',
      location: 'Balok B2 · Unit A-05',
      photoRequired: true,
      photoCount: 8,
      submittedBy: 'Budi Santoso',
    },
    suspectedCause: 'Spacer beton / tahu beton lepas saat perakitan tulangan oleh tukang besi.',
    affectedExtent: 'Balok B2 bentang 3,5 m sisi timur Unit A-05',
    sourceRequirement: 'SPEC-NW-01 Rev 1 §5.3 · STR-A05 Rev C',
    classification: 'potential_nc',
    status: 'verification_pending',
    identifiedAt: agoD(4),
    identifiedBy: SARI.name,
    assignee: 'CV Mitra Bangun (Mandor Struktur)',
    dueAt: aheadD(2),
    ncrRequired: false,
    actions: [
      {
        id: 'ca-021-1',
        ref: 'CA-021-1',
        description: 'Ganti dan pasang ulang spacer beton 25 mm pada balok B2 Unit A-05; lampirkan foto dokumentasi tiap titik perbaikan.',
        actionPlan: {
          actionType: 'Pasang Ulang',
          component: 'Spacer beton 25 mm',
          location: 'Balok B2 · Unit A-05',
          photoRequired: true,
          photoCount: 8,
          submittedBy: 'Budi Santoso',
        },
        assignee: 'CV Mitra Bangun (Mandor Struktur)',
        assigneeOrg: 'Subkontraktor struktur',
        dueAt: aheadD(1),
        status: 'verification_pending',
        evidenceNote: '8 foto pasca-perbaikan spacer 25 mm diajukan Budi Santoso.',
        evidenceCount: 8,
        evidenceType: 'Foto',
      },
    ],
    timeline: [
      { id: 't1', at: agoD(4), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Catatan perbaikan dicatat di lapangan', kind: 'finding', note: 'Catatan pekerjaan lapangan; perlu perbaikan sebelum pengecoran diizinkan.' },
      { id: 't2', at: agoD(3), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Tindak lanjut ditugaskan ke mandor struktur', kind: 'action', detail: 'Penanggung jawab lapangan: Mandor Slamet (CV Mitra Bangun).' },
      { id: 't3', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', title: 'Bukti perbaikan diajukan', kind: 'evidence', note: '8 foto pemasangan spacer 25 mm diunggah; menunggu verifikasi pengawas.' },
    ],
  },
  {
    id: 'f-ar-022',
    ref: 'F-NW-022',
    projectId: 'naw',
    inspectionRef: 'INSP-NW-2026-0131',
    location: 'Blok B — Unit B-04 · Dinding Belakang',
    trade: 'Finishing Dinding',
    element: 'Dinding Kamar Unit B-04',
    defectType: 'Retak Rambut Plesteran (40 cm)',
    title: '[Dinding B-04] Retak Rambut Plesteran (40 cm)',
    facts: 'Retak rambut sepanjang 40 cm pada plesteran dinding belakang kamar tidur Unit B-04; plesteran belum diaci.',
    benchmark: {
      param: 'Lebar Retak Plesteran',
      actual: 0.3,
      spec: 0,
      unit: 'mm',
      diff: '+0.3 mm',
      diffPct: 'Retak Rambut',
      status: 'above',
      statusLabel: 'Punch List',
      specRef: 'SPEC-NW-01 Rev 1 §6.2',
      element: 'Dinding Belakang Kamar Tidur Unit B-04',
    },
    rootCause: {
      category: 'Aplikasi Plesteran',
      component: 'Mortar Plesteran Belum Diaci',
      trigger: 'Penyusutan mortar saat pengeringan awal',
    },
    actionPlan: {
      actionType: 'Coak & Tambal',
      component: 'Mortar Elastis',
      location: 'Dinding Belakang · Unit B-04',
      photoRequired: true,
      photoCount: 2,
      submittedBy: 'Budi Santoso',
    },
    affectedExtent: '1 bidang dinding belakang kamar tidur',
    sourceRequirement: 'SPEC-NW-01 Rev 1 §6.2',
    classification: 'observation',
    status: 'closed',
    identifiedAt: agoD(10),
    identifiedBy: SARI.name,
    assignee: 'Budi Santoso',
    actions: [
      { id: 'ca-022-1', ref: 'CA-022-1', description: 'Coak retakan, tambal mortar elastis & ratakan sebelum acian.', assignee: 'Budi Santoso', assigneeOrg: 'PT Tri Daya Bangun', dueAt: agoD(9), status: 'verified', evidenceNote: 'Foto tambalan mortar rapi.', evidenceCount: 2, evidenceType: 'Foto', verifiedBy: SARI.name, verifiedAt: agoD(9) },
    ],
    timeline: [
      { id: 't1', at: agoD(10), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Catatan punch list dicatat', kind: 'finding', note: 'Pekerjaan minor masuk daftar punch list serah terima unit.' },
      { id: 't2', at: agoD(9), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Diverifikasi & ditutup', kind: 'verified' },
    ],
  },
  {
    id: 'f-ks-012',
    ref: 'F-RKO-012',
    projectId: 'rko',
    inspectionRef: 'INSP-RKO-2026-0088',
    location: 'Ruko 03 — Lantai 2 · Shaft Pipa',
    trade: 'Instalasi MEP',
    element: 'Shaft Pipa L2 (Ruko 03)',
    defectType: 'Jarak Pipa vs Kabel < 30 cm',
    title: '[Shaft Pipa] Jarak Pipa vs Kabel < 30 cm',
    facts: 'Pipa air bersih PPR dan tray kabel daya di shaft Ruko 03 terpasang dengan jarak kurang dari 10 cm; jarak aman yang disyaratkan minimal 30 cm.',
    benchmark: {
      param: 'Jarak Aman Pipa ke Kabel Daya',
      actual: 8,
      spec: 30,
      unit: 'cm',
      diff: '-22 cm',
      diffPct: '-73%',
      status: 'below',
      statusLabel: 'Di Bawah Jarak Minimum',
      specRef: 'MEP-RK-03 §2.5',
      element: 'Shaft Pipa Lantai 2 Ruko 03',
    },
    rootCause: {
      category: 'Koordinasi MEP',
      component: 'Tray Kabel & Pipa PPR',
      trigger: 'Penarikan pipa mendahului tray kabel tanpa cek shop drawing',
    },
    actionPlan: {
      actionType: 'Relokasi Jalur',
      component: 'Pipa Air Bersih PPR',
      location: 'Shaft Lantai 2 · Ruko 03',
      photoRequired: true,
    },
    suspectedCause: 'Penarikan pipa mendahului instalasi tray kabel tanpa koordinasi shop drawing.',
    affectedExtent: '±3 m jalur vertikal shaft pipa Lantai 2',
    sourceRequirement: 'MEP-RK-03 · Checklist MEP Komersial §2.5',
    classification: 'potential_nc',
    status: 'assigned',
    identifiedAt: agoD(2),
    identifiedBy: SARI.name,
    assignee: 'PT Tri Daya Bangun · MEP',
    dueAt: aheadD(4),
    actions: [],
    timeline: [
      { id: 't1', at: agoD(2), actor: SARI.name, role: 'Pengawas Kualitas', title: 'Temuan pekerjaan dicatat', kind: 'finding', note: 'Perlu penataan ulang posisi jalur pipa sebelum shaft ditutup partisi.' },
      { id: 't2', at: agoD(1), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Ditugaskan ke mandor MEP', kind: 'action', detail: 'Relokasi jalur pipa air bersih ke sisi berlawanan shaft.' },
    ],
  },
  {
    id: 'f-ks-014',
    ref: 'F-RKO-014',
    projectId: 'rko',
    location: 'Ruko 02 — Lantai 1 · Dinding Depan',
    trade: 'Finishing Fasad',
    element: 'Dinding Fasad Ruko 02',
    defectType: 'Cat Weatherproof Melepuh (1,5 m²)',
    title: '[Fasad Ruko 02] Cat Menggelembung (1,5 m²)',
    facts: 'Cat weatherproof dinding fasad depan Ruko 02 menggelembung seluas ±1,5 m² akibat kelembapan dinding belum kering saat pengecatan dasar.',
    benchmark: {
      param: 'Luas Cat Menggelembung',
      actual: 1.5,
      spec: 0,
      unit: 'm²',
      diff: '+1.5 m²',
      diffPct: 'Cacat Lapisan',
      status: 'above',
      statusLabel: 'Perlu Perbaikan Fasad',
      specRef: 'Spesifikasi Finishing Ruko §4.2',
      element: 'Dinding Fasad Depan Lantai 1 Ruko 02',
    },
    rootCause: {
      category: 'Kondisi Permukaan',
      component: 'Cat Weatherproof & Sealer',
      trigger: 'Dinding belum kering saat pengecatan dasar',
    },
    actionPlan: {
      actionType: 'Kerok & Cat Ulang',
      component: 'Sealer + 2 Lapis Weatherproof',
      location: 'Fasad Depan · Ruko 02',
      photoRequired: true,
    },
    affectedExtent: '±1,5 m² fasad depan Ruko 02',
    sourceRequirement: 'Spesifikasi Finishing Ruko §4.2',
    classification: 'confirmed_nc',
    status: 'action_in_progress',
    identifiedAt: agoD(6),
    identifiedBy: 'Rizky Hidayat',
    assignee: 'CV Berkah Finishing (Subkontraktor Cat)',
    dueAt: agoD(1),
    ncrRequired: true,
    actions: [
      {
        id: 'ca-014-1',
        ref: 'CA-014-1',
        description: 'Kerok cat yang menggelembung, keringkan dinding, lapisi sealer anti-kelembapan & cat ulang 2 lapis.',
        assignee: 'CV Berkah Finishing',
        assigneeOrg: 'Subkontraktor Finishing',
        dueAt: agoD(1),
        status: 'in_progress',
      },
    ],
    timeline: [
      { id: 't1', at: agoD(6), actor: 'Rizky Hidayat', role: 'Site Manager', title: 'Temuan dicatat, perlu perbaikan mendesak sebelum serah terima', kind: 'finding' },
      { id: 't2', at: agoD(5), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Tindakan ditugaskan ke subkontraktor finishing', kind: 'action' },
      { id: 't3', at: agoH(20), actor: 'Sistem (simulasi)', role: 'Eskalasi demo', title: 'Tindakan melewati batas waktu (Overdue)', kind: 'rejected', note: 'Overdue 1 hari; perlu konfirmasi mandor cat sebelum serah terima unit.' },
    ],
  },
  {
    id: 'f-jk-006',
    ref: 'F-GML-006',
    projectId: 'gml',
    inspectionRef: 'INSP-GML-2026-0033',
    location: 'Lantai 2 · Area Ruang Rapat',
    trade: 'Plafon & Partisi',
    element: 'Rangka Partisi Lantai 2',
    defectType: 'Jarak Sekrup Gypsum > 20 cm (30 cm)',
    title: '[Partisi L2] Jarak Sekrup Rangka > 20 cm',
    facts: 'Jarak pemasangan sekrup gypsum pada beberapa rangka hollow mencapai 30 cm; standar spesifikasi maksimal 20 cm.',
    benchmark: {
      param: 'Jarak Pemasangan Sekrup',
      actual: 30,
      spec: 20,
      unit: 'cm',
      diff: '+10 cm',
      diffPct: '+50%',
      status: 'above',
      statusLabel: 'Melebihi Jarak Maksimal',
      specRef: 'SPEC-GML-ARC §3.4',
      element: '2 Lembar Panel Gypsum Ruang Rapat',
    },
    rootCause: {
      category: 'Pemasangan Partisi',
      component: 'Sekrup Gypsum & Rangka Hollow',
      trigger: 'Pemasangan sekrup melompati grid rangka',
    },
    actionPlan: {
      actionType: 'Tambah Sekrup',
      component: 'Sekrup Gypsum 15 cm + Dempul',
      location: 'Ruang Rapat Lantai 2',
      photoRequired: true,
    },
    affectedExtent: '2 lembar panel gypsum ruang rapat',
    sourceRequirement: 'SPEC-GML-ARC §3.4',
    classification: 'observation',
    status: 'closed',
    identifiedAt: agoD(10),
    identifiedBy: 'PT Cipta Karya Desain',
    assignee: 'Yusuf Maulana',
    actions: [
      { id: 'ca-006-1', ref: 'CA-006-1', description: 'Tambahkan sekrup perantara tiap 15 cm & dempul ulang.', assignee: 'Yusuf Maulana', assigneeOrg: 'PT Tri Daya Bangun', dueAt: agoD(9), status: 'verified', verifiedBy: 'PT Cipta Karya', verifiedAt: agoD(9) },
    ],
    timeline: [
      { id: 't1', at: agoD(10), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Catatan punch list dicatat', kind: 'finding' },
      { id: 't2', at: agoD(9), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Diverifikasi & ditutup', kind: 'verified' },
    ],
  },
]

/* ------------------------------------------------------------
 * Kotak tindakan per peran (FR-NO-01..03) — tampilan tunggal
 * ------------------------------------------------------------ */

export interface ActionItem {
  id: string
  kind: keyof typeof ACTION_KIND
  title: string
  detail: string
  projectId: string
  record: { type: 'inspection' | 'finding' | 'holdpoint'; id: string }
  owner: string
  dueAt?: string
  /** Peran yang melihat item ini di inbox (simulasi, bukan enforcement). */
  visibleTo: RoleId[]
}

export const ACTION_KIND: Record<string, { label: string; tone: StatusTone; icon: LucideIcon }> = {
  review_inspection: { label: 'Review inspeksi', tone: 'info', icon: ClipboardCheck },
  complete_submission: { label: 'Lengkapi pengajuan', tone: 'warning', icon: FileWarning },
  respond_finding: { label: 'Respons temuan', tone: 'warning', icon: MessageSquare },
  verify_action: { label: 'Verifikasi tindakan', tone: 'active', icon: BadgeCheck },
  schedule_inspection: { label: 'Jadwalkan inspeksi', tone: 'info', icon: CalendarClock },
  record_external_decision: { label: 'Rekam keputusan eksternal', tone: 'brand', icon: Stamp },
  release_hold_point: { label: 'Rilis hold point', tone: 'warning', icon: LockOpen },
  resolve_overdue: { label: 'Selesaikan overdue', tone: 'danger', icon: TriangleAlert },
}

export const ACTION_ITEMS: ActionItem[] = [
  { id: 'a1', kind: 'review_inspection', title: 'Verifikasi hasil perbaikan INSP-NW-2026-0142', detail: 'Pembesian balok & pelat Unit A-05; perbaikan spacer 25 mm sudah diajukan ulang dengan bukti foto.', projectId: 'naw', record: { type: 'inspection', id: 'wir-ar-0142' }, owner: 'Sari Wulandari (Pengawas Kualitas)', dueAt: aheadH(26), visibleTo: ['qc_inspector', 'quality_manager', 'project_manager'] },
  { id: 'a2', kind: 'review_inspection', title: 'Review pengajuan INSP-NW-2026-0151', detail: 'Rangka atap baja ringan Unit B-02 (baru masuk), jadwal cek lapangan H+2.', projectId: 'naw', record: { type: 'inspection', id: 'wir-ar-0151' }, owner: 'Sari Wulandari (Pengawas Kualitas)', dueAt: aheadH(30), visibleTo: ['qc_inspector', 'quality_manager'] },
  { id: 'a3', kind: 'complete_submission', title: 'Lengkapi referensi dokumen INSP-RKO-2026-0088', detail: 'Nomor revisi shop drawing sanitair Ruko 03 & jalur tray kabel perlu dilengkapi.', projectId: 'rko', record: { type: 'inspection', id: 'wir-ks-0088' }, owner: 'Budi Santoso (Site Eng)', dueAt: aheadD(2), visibleTo: ['site_engineer', 'project_manager'] },
  { id: 'a4', kind: 'verify_action', title: 'Verifikasi tindakan CA-021-1 (F-NW-021)', detail: 'Perbaikan cover tulangan balok B2 Unit A-05 menunggu verifikasi pengawas kualitas.', projectId: 'naw', record: { type: 'finding', id: 'f-ar-021' }, owner: 'Sari Wulandari (Pengawas Kualitas)', dueAt: aheadD(1), visibleTo: ['qc_inspector', 'quality_manager'] },
  { id: 'a5', kind: 'respond_finding', title: 'Tindak lanjut F-RKO-012 (jalur pipa vs kabel)', detail: 'Atur ulang posisi tray kabel dan pipa air shaft Ruko 03 Lantai 2.', projectId: 'rko', record: { type: 'finding', id: 'f-ks-012' }, owner: 'Tim MEP · PT Tri Daya Bangun', dueAt: aheadD(4), visibleTo: ['site_engineer', 'project_manager', 'qc_inspector'] },
  { id: 'a6', kind: 'release_hold_point', title: 'Konfirmasi izin pengecoran CP-NW-02 (Unit A-05)', detail: 'Pengecoran balok & pelat Unit A-05 menunggu rilis kondisi verifikasi perbaikan.', projectId: 'naw', record: { type: 'holdpoint', id: 'hp-ar-02' }, owner: 'Ratna Dewi / Site Manager', visibleTo: ['quality_manager', 'project_manager'] },
  { id: 'a7', kind: 'record_external_decision', title: 'Rekam review konsultan · INSP-GML-2026-0027', detail: 'Review sampel spesifikasi material kaca fasad depan oleh konsultan.', projectId: 'gml', record: { type: 'inspection', id: 'wir-jk-0027' }, owner: 'PT Cipta Karya Desain', dueAt: aheadD(1), visibleTo: ['external'] },
  { id: 'a8', kind: 'schedule_inspection', title: 'Konfirmasi jadwal uji tekan WP-RKO-01', detail: 'Uji tekan pipa air bersih Ruko 03 dijadwalkan ulang bersama konsultan pengawas.', projectId: 'rko', record: { type: 'holdpoint', id: 'wp-jk-01' }, owner: 'CV Mitra Desain', dueAt: aheadH(24), visibleTo: ['external', 'site_engineer', 'project_manager'] },
  { id: 'a9', kind: 'resolve_overdue', title: 'Overdue: CA-014-1 perbaikan cat dinding (F-RKO-014)', detail: 'Perbaikan cat fasad Ruko 02 melewati batas waktu 1 hari sebelum serah terima.', projectId: 'rko', record: { type: 'finding', id: 'f-ks-014' }, owner: 'CV Berkah Finishing / PM', dueAt: agoD(1), visibleTo: ['project_manager', 'site_engineer', 'qc_inspector', 'quality_manager'] },
]

/** Notifikasi in-app — SELALU berlabel simulasi (FR-NO-04). */
export const NOTIFICATIONS = [
  { id: 'n1', at: agoH(2), title: 'Verifikasi INSP-NW-2026-0142 (Unit A-05) menunggu keputusan', body: 'Sari Wulandari · Pengawas Kualitas · simulasi', link: '/dashboard/inspeksi/wir-ar-0142', tone: 'info' as StatusTone },
  { id: 'n2', at: agoD(1), title: 'Tindakan CA-014-1 (Cat Ruko 02) melewati batas waktu', body: 'F-RKO-014 cat dinding menggelembung, overdue 1 hari · simulasi', link: '/dashboard/temuan/f-ks-014', tone: 'danger' as StatusTone },
  { id: 'n3', at: agoD(2), title: 'Jadwal uji tekan WP-RKO-01 Ruko 03 disesuaikan', body: 'Kehadiran konsultan disepakati ke H+1 14:00 · simulasi', link: '/dashboard/inspeksi/wir-ks-0088', tone: 'warning' as StatusTone },
]

/* ------------------------------------------------------------
 * Aktivitas global (FR-OV-04 / FR-AU-01)
 * ------------------------------------------------------------ */

export interface StructuredEventAction {
  actionLabel: string
  targetScope: string
  statusOutcome?: string
  tone?: 'danger' | 'warning' | 'info' | 'success'
}

export interface ActivityEntry {
  id: string
  at: string
  actor: string
  role: string
  projectId: string
  ref: string
  kind: TimelineEvent['kind']
  title: string
  actionDetail?: StructuredEventAction
  note?: string
  /** 'decision' bila berdampak tinggi (FR-OV-04). */
  impact?: boolean
  link: string
}

export const ACTIVITY: ActivityEntry[] = [
  {
    id: 'g1',
    at: agoH(2),
    actor: SARI.name,
    role: 'Pengawas Kualitas',
    projectId: 'naw',
    ref: 'INSP-NW-2026-0142',
    kind: 'in_progress',
    title: '[Balok B2] Verifikasi Fisik di Lokasi',
    actionDetail: {
      actionLabel: 'Verifikasi Fisik Lapangan',
      targetScope: 'Unit A-05 · Balok B2',
      statusOutcome: 'Siap Rekam Hasil',
      tone: 'info',
    },
    note: 'Pengawas memeriksa spacer 25 mm; konfirmasi siap direkam.',
    impact: true,
    link: '/dashboard/inspeksi/wir-ar-0142',
  },
  {
    id: 'g2',
    at: agoH(5),
    actor: BUDI.name,
    role: 'Site Engineer',
    projectId: 'naw',
    ref: 'INSP-NW-2026-0147',
    kind: 'created',
    title: '[Unit A-01] Draf Pengajuan Keramik',
    actionDetail: {
      actionLabel: 'Draf Pengajuan',
      targetScope: 'Unit A-01 · Keramik Lantai',
      statusOutcome: 'Dibuat',
      tone: 'info',
    },
    link: '/dashboard/inspeksi/wir-ar-0147',
  },
  {
    id: 'g3',
    at: agoH(20),
    actor: 'Sistem (simulasi)',
    role: 'Eskalasi demo',
    projectId: 'rko',
    ref: 'F-RKO-014',
    kind: 'rejected',
    title: '[Fasad Ruko 02] Jatuh Tempo Tindakan Lewat',
    actionDetail: {
      actionLabel: 'Batas Waktu Lewat',
      targetScope: 'Ruko 02 · Cat Fasad',
      statusOutcome: 'Overdue 1 Hari',
      tone: 'danger',
    },
    impact: true,
    link: '/dashboard/temuan/f-ks-014',
  },
  {
    id: 'g4',
    at: agoD(1),
    actor: BUDI.name,
    role: 'Site Engineer',
    projectId: 'naw',
    ref: 'F-NW-021',
    kind: 'evidence',
    title: '[Balok B2] Bukti Foto Spacer Diunggah',
    actionDetail: {
      actionLabel: 'Unggah Bukti (CA-021-1)',
      targetScope: 'Unit A-05 · Balok B2',
      statusOutcome: '8 Foto Terlampir',
      tone: 'info',
    },
    note: 'Menunggu verifikasi pengawas kualitas.',
    impact: true,
    link: '/dashboard/temuan/f-ar-021',
  },
  {
    id: 'g5',
    at: agoD(1),
    actor: 'Yusuf Maulana',
    role: 'Site Manager',
    projectId: 'gml',
    ref: 'INSP-GML-2026-0041',
    kind: 'scheduled',
    title: '[Partisi L2] Jadwal Pemeriksaan H+1',
    actionDetail: {
      actionLabel: 'Jadwal Pemeriksaan',
      targetScope: 'Lantai 2 · Partisi Gypsum',
      statusOutcome: 'Disepakati H+1',
      tone: 'info',
    },
    link: '/dashboard/inspeksi/wir-jk-0041',
  },
  {
    id: 'g6',
    at: agoD(1),
    actor: SARI.name,
    role: 'Pengawas Kualitas',
    projectId: 'rko',
    ref: 'INSP-RKO-2026-0091',
    kind: 'scheduled',
    title: '[Ruko 02] Jadwal Rolling Door H+3',
    actionDetail: {
      actionLabel: 'Jadwal Rolling Door',
      targetScope: 'Ruko 02 · Rolling Door',
      statusOutcome: 'Terjadwal H+3',
      tone: 'info',
    },
    link: '/dashboard/inspeksi/wir-ks-0091',
  },
  {
    id: 'g7',
    at: agoD(2),
    actor: 'PT Cipta Karya',
    role: 'Konsultan',
    projectId: 'gml',
    ref: 'INSP-GML-2026-0041',
    kind: 'rescheduled',
    title: '[Partisi L2] Penyesuaian Jadwal Konsultan',
    actionDetail: {
      actionLabel: 'Penyesuaian Jadwal',
      targetScope: 'Graha Mulia · Partisi L2',
      statusOutcome: 'Disepakati H+1',
      tone: 'info',
    },
    note: 'Waktu pemeriksaan disepakati ulang ke H+1 14:00.',
    impact: true,
    link: '/dashboard/inspeksi/wir-jk-0041',
  },
  {
    id: 'g8',
    at: agoD(2),
    actor: SARI.name,
    role: 'Pengawas Kualitas',
    projectId: 'rko',
    ref: 'INSP-RKO-2026-0088',
    kind: 'clarification',
    title: '[Shaft Pipa] Klarifikasi Jarak Pipa vs Kabel',
    actionDetail: {
      actionLabel: 'Klarifikasi Teknis',
      targetScope: 'Ruko 03 · Shaft Pipa L2',
      statusOutcome: 'Perlu Rincian Jarak',
      tone: 'warning',
    },
    note: 'Bukan kegagalan konstruksi.',
    impact: true,
    link: '/dashboard/inspeksi/wir-ks-0088',
  },
  {
    id: 'g9',
    at: agoD(2),
    actor: SARI.name,
    role: 'Pengawas Kualitas',
    projectId: 'rko',
    ref: 'F-RKO-012',
    kind: 'finding',
    title: '[Shaft Pipa] Temuan Jarak Kurang (<30 cm)',
    actionDetail: {
      actionLabel: 'Temuan Lapangan',
      targetScope: 'Ruko 03 · Shaft Pipa L2',
      statusOutcome: 'Jarak < 30 cm',
      tone: 'warning',
    },
    link: '/dashboard/temuan/f-ks-012',
  },
  {
    id: 'g10',
    at: agoD(3),
    actor: 'Andi Pratama',
    role: 'Site Engineer',
    projectId: 'naw',
    ref: 'F-NW-021',
    kind: 'action',
    title: '[Balok B2] Penugasan Perbaikan Spacer',
    actionDetail: {
      actionLabel: 'Penugasan Perbaikan',
      targetScope: 'Unit A-05 · Balok B2',
      statusOutcome: 'Mandor Struktur',
      tone: 'info',
    },
    link: '/dashboard/temuan/f-ar-021',
  },
  {
    id: 'g11',
    at: agoD(4),
    actor: SARI.name,
    role: 'Pengawas Kualitas',
    projectId: 'naw',
    ref: 'INSP-NW-2026-0142',
    kind: 'correction',
    title: '[Balok B2] Hasil Perlu Perbaikan (20 mm)',
    actionDetail: {
      actionLabel: 'Pemeriksaan Lapangan',
      targetScope: 'Unit A-05 · Balok B2',
      statusOutcome: 'Perlu Perbaikan (20 mm)',
      tone: 'warning',
    },
    note: 'Catatan pekerjaan lapangan; ganti spacer 25 mm.',
    impact: true,
    link: '/dashboard/inspeksi/wir-ar-0142',
  },
  {
    id: 'g12',
    at: agoD(4),
    actor: SARI.name,
    role: 'Pengawas Kualitas',
    projectId: 'naw',
    ref: 'F-NW-021',
    kind: 'finding',
    title: '[Balok B2] Temuan Selimut Kurang (<25 mm)',
    actionDetail: {
      actionLabel: 'Temuan Selimut',
      targetScope: 'Unit A-05 · Balok B2',
      statusOutcome: 'Deviasi -5 mm',
      tone: 'danger',
    },
    impact: true,
    link: '/dashboard/temuan/f-ar-021',
  },
]

/* ============================================================
 * KENDALI EKSEKUSI — kesehatan proyek, progres vs rencana,
 * laporan harian lapangan & milestone (penyempurnaan demo)
 * ------------------------------------------------------------
 * Prinsip: progres & kondisi lapangan BERSUMBER dari laporan
 * harian (pengawas/site) — tidak ada deteksi otomatis. Seluruh
 * angka & alasan saling tertaut ke catatan yang sudah ada
 * (temuan, titik kendali, inspeksi) agar cerita "pantau →
 * deteksi deviasi → pahami masalah lapangan → tugaskan
 * tindak lanjut → pantau penyelesaian" konsisten antar layar.
 * ============================================================ */

/* ------------------------------------------------------------
 * Kesehatan proyek — status level pemilik (bukan status QA)
 * ------------------------------------------------------------ */

export type ProjectHealthId = 'on_track' | 'at_risk' | 'behind' | 'archived'

export const PROJECT_HEALTH: Record<ProjectHealthId, StatusDef> = {
  on_track: {
    id: 'on_track',
    label: 'Sesuai Rencana',
    tone: 'success',
    icon: CircleCheck,
    description: 'Progres mengikuti rencana; tidak ada hambatan material terbuka.',
  },
  at_risk: {
    id: 'at_risk',
    label: 'Perlu Perhatian',
    tone: 'warning',
    icon: TriangleAlert,
    description: 'Ada hambatan/risiko yang perlu ditindaklanjuti sebelum berdampak ke jadwal.',
  },
  behind: {
    id: 'behind',
    label: 'Terlambat',
    tone: 'danger',
    icon: TrendingDown,
    description: 'Progres di bawah rencana dan/atau ada aktivitas terblokir; perlu tindakan pemulihan.',
  },
  archived: {
    id: 'archived',
    label: 'Arsip',
    tone: 'neutral',
    icon: Archive,
    description: 'Proyek selesai & diarsipkan; rekaman hanya-baca.',
  },
}

/** Satu alasan "mengapa proyek ini perlu perhatian" — tertaut ke catatan sumber. */
export interface HealthReason {
  id: string
  severity: Extract<StatusTone, 'danger' | 'warning' | 'info'>
  /** Referensi catatan sumber, mis. "F-AR-021". */
  refLabel?: string
  targetScope?: string
  issueCategory?: string
  metricSummary?: string
  label: string
  to?: string
}

export interface StructuredBlockerSummary {
  badgeLabel: string
  tone: 'danger' | 'warning' | 'info' | 'success'
  targetUnit: string
  component: string
  prerequisiteRef?: string
  prerequisiteAction?: string
}

export interface ProjectHealthState {
  healthId: ProjectHealthId
  /** Satu kalimat ringkas untuk pemilik. */
  headline: string
  blockerSummary?: StructuredBlockerSummary
  reasons: HealthReason[]
}

const NAW_HEALTH: ProjectHealthState = {
  healthId: 'behind',
  headline: '[Unit A-05] Pengecoran Tertahan · Verifikasi Spacer Balok B2',
  blockerSummary: {
    badgeLabel: 'Cor Tertahan',
    tone: 'danger',
    targetUnit: 'Unit A-05',
    component: 'Pembesian Balok B2',
    prerequisiteRef: 'CP-NW-02',
    prerequisiteAction: 'Verifikasi Spacer 25 mm',
  },
  reasons: [
    {
      id: 'r1',
      severity: 'danger',
      refLabel: 'CP-NW-02',
      targetScope: 'Unit A-05 · Balok B2',
      issueCategory: 'Izin Pengecoran Tertahan',
      metricSummary: 'Syarat Rilis Cor',
      label: '[CP-NW-02] Unit A-05: Syarat Rilis Cor (Verifikasi Selimut Beton)',
      to: '/dashboard/proyek/naw?titik=hp-ar-02',
    },
    {
      id: 'r2',
      severity: 'warning',
      refLabel: 'F-NW-021',
      targetScope: 'Unit A-05 · Balok B2',
      issueCategory: 'Verifikasi Bukti Perbaikan',
      metricSummary: '8 Foto Diajukan',
      label: '[F-NW-021] Unit A-05: Bukti Foto Spacer Diajukan (Menunggu Verifikasi)',
      to: '/dashboard/temuan/f-ar-021',
    },
    {
      id: 'r3',
      severity: 'warning',
      refLabel: 'INSP-NW-2026-0142',
      targetScope: 'Unit A-05 · Pelat L2',
      issueCategory: 'Perekaman Hasil Lapangan',
      metricSummary: 'Menunggu Rekam QC',
      label: '[INSP-NW-2026-0142] Unit A-05: Verifikasi Fisik Lapangan (Menunggu Rekam QC)',
      to: '/dashboard/inspeksi/wir-ar-0142',
    },
    {
      id: 'r4',
      severity: 'info',
      targetScope: 'Blok A & Blok B',
      issueCategory: 'Deviasi Progres Kumulatif',
      metricSummary: '54% vs 58% (-4 poin)',
      label: '[Blok A & B] Deviasi Progres: 54% Realisasi vs 58% Rencana (-4 Poin)',
    },
  ],
}

const RKO_HEALTH: ProjectHealthState = {
  healthId: 'at_risk',
  headline: '[Ruko 02] Perbaikan Cat Fasad Overdue · Deviasi Progres -2 Poin',
  blockerSummary: {
    badgeLabel: 'Perbaikan Terlambat',
    tone: 'danger',
    targetUnit: 'Ruko 02',
    component: 'Kerokan Cat Fasad',
    prerequisiteRef: 'CA-014-1',
    prerequisiteAction: 'Tambah 2 Tukang Cat',
  },
  reasons: [
    {
      id: 'r1',
      severity: 'danger',
      refLabel: 'CA-014-1',
      targetScope: 'Ruko 02 · Fasad Depan',
      issueCategory: 'Perbaikan Cat Fasad Overdue',
      metricSummary: 'Lewat 1 Hari',
      label: '[CA-014-1] Ruko 02: Perbaikan Cat Fasad Lewat Jatuh Tempo 1 Hari',
      to: '/dashboard/temuan/f-ks-014',
    },
    {
      id: 'r2',
      severity: 'warning',
      refLabel: 'F-RKO-012',
      targetScope: 'Ruko 03 · Shaft Pipa L2',
      issueCategory: 'Penataan Jalur Pipa vs Kabel',
      metricSummary: 'Proses Relokasi',
      label: '[F-RKO-012] Ruko 03: Penataan Ulang Jalur Pipa Air vs Kabel Daya',
      to: '/dashboard/temuan/f-ks-012',
    },
    {
      id: 'r3',
      severity: 'info',
      refLabel: 'INSP-RKO-2026-0088',
      targetScope: 'Ruko 03 · Shaft MEP',
      issueCategory: 'Detail Revisi Jarak Tray',
      metricSummary: 'Klarifikasi Gambar',
      label: '[INSP-RKO-2026-0088] Ruko 03: Klarifikasi Shop Drawing MEP-RK-03',
      to: '/dashboard/inspeksi/wir-ks-0088',
    },
  ],
}

const GML_HEALTH: ProjectHealthState = {
  healthId: 'on_track',
  headline: '[Lantai 2] Pekerjaan Partisi Gypsum & Lobby On-Track',
  blockerSummary: {
    badgeLabel: 'Sesuai Jadwal',
    tone: 'info',
    targetUnit: 'Lantai 2',
    component: 'Rangka Partisi Gypsum',
    prerequisiteRef: 'INSP-GML-2026-0041',
    prerequisiteAction: 'Pemeriksaan Rangka H+1',
  },
  reasons: [
    {
      id: 'r1',
      severity: 'info',
      refLabel: 'INSP-GML-2026-0041',
      targetScope: 'Lantai 2 · Ruang Rapat',
      issueCategory: 'Pemeriksaan Rangka Gypsum',
      metricSummary: 'Terjadwal H+1',
      label: '[INSP-GML-2026-0041] Lantai 2: Jadwal Pemeriksaan Partisi Disepakati',
      to: '/dashboard/inspeksi/wir-jk-0041',
    },
    {
      id: 'r2',
      severity: 'info',
      refLabel: 'INSP-GML-2026-0027',
      targetScope: 'Fasad Depan',
      issueCategory: 'Review Sampel Kaca Fasad',
      metricSummary: 'Telaah Konsultan',
      label: '[INSP-GML-2026-0027] Fasad Depan: Review Sampel Kaca Tempered',
      to: '/dashboard/inspeksi/wir-jk-0027',
    },
  ],
}

const BL_HEALTH: ProjectHealthState = {
  healthId: 'archived',
  headline: '[Gudang Bantan] Proyek Selesai & Diarsipkan (Hanya-Baca)',
  reasons: [],
}

export const PROJECT_HEALTH_STATE: Record<string, ProjectHealthState> = {
  naw: NAW_HEALTH,
  rko: RKO_HEALTH,
  gml: GML_HEALTH,
  bl: BL_HEALTH,
  aru: NAW_HEALTH,
  ks: RKO_HEALTH,
  jk: GML_HEALTH,
}

/* ------------------------------------------------------------
 * Progres aktual vs rencana — direkap dari laporan harian
 * ------------------------------------------------------------ */

export interface ProgressPoint {
  label: string
  plan: number
  actual: number
}

export interface ProjectProgress {
  projectId: string
  /** Rencana & realisasi kumulatif (%) pada tanggal laporan terakhir. */
  planPct: number
  actualPct: number
  asOf: string
  /** Laporan sumber rekapan terakhir. */
  sourceRef: string
  reporter: string
  weekly: ProgressPoint[]
}

const NAW_PROGRESS: ProjectProgress = {
  projectId: 'naw',
  planPct: 58,
  actualPct: 54,
  asOf: agoH(20),
  sourceRef: 'LHR-NAW-1030',
  reporter: 'Rizky Hidayat (Site Manager)',
  weekly: [
    { label: 'M1', plan: 42, actual: 41 },
    { label: 'M2', plan: 46, actual: 44 },
    { label: 'M3', plan: 49, actual: 47 },
    { label: 'M4', plan: 52, actual: 50 },
    { label: 'M5', plan: 55, actual: 52 },
    { label: 'M6', plan: 58, actual: 54 },
  ],
}

const RKO_PROGRESS: ProjectProgress = {
  projectId: 'rko',
  planPct: 70,
  actualPct: 68,
  asOf: agoH(26),
  sourceRef: 'LHR-RKO-1030',
  reporter: 'Dedi Kurniawan (Site Manager)',
  weekly: [
    { label: 'M1', plan: 54, actual: 53 },
    { label: 'M2', plan: 58, actual: 57 },
    { label: 'M3', plan: 61, actual: 60 },
    { label: 'M4', plan: 64, actual: 63 },
    { label: 'M5', plan: 67, actual: 66 },
    { label: 'M6', plan: 70, actual: 68 },
  ],
}

const GML_PROGRESS: ProjectProgress = {
  projectId: 'gml',
  planPct: 45,
  actualPct: 44,
  asOf: agoH(30),
  sourceRef: 'LHR-GML-0021',
  reporter: 'Yusuf Maulana (Site Manager)',
  weekly: [
    { label: 'M1', plan: 30, actual: 30 },
    { label: 'M2', plan: 33, actual: 33 },
    { label: 'M3', plan: 36, actual: 35 },
    { label: 'M4', plan: 39, actual: 38 },
    { label: 'M5', plan: 42, actual: 41 },
    { label: 'M6', plan: 45, actual: 44 },
  ],
}

const BL_PROGRESS: ProjectProgress = {
  projectId: 'bl',
  planPct: 100,
  actualPct: 100,
  asOf: agoD(30),
  sourceRef: 'LHR-BL-0018',
  reporter: 'Dedi Kurniawan (Site Manager)',
  weekly: [],
}

export const PROJECT_PROGRESS: Record<string, ProjectProgress> = {
  naw: NAW_PROGRESS,
  rko: RKO_PROGRESS,
  gml: GML_PROGRESS,
  bl: BL_PROGRESS,
  aru: NAW_PROGRESS,
  ks: RKO_PROGRESS,
  jk: GML_PROGRESS,
}

/* ------------------------------------------------------------
 * Laporan harian lapangan — sumber kondisi & progres
 * (dimiliki konsultan pengawas; kontraktor melaporkan via
 * Field Ops). Setiap isu tertaut ke catatan resminya.
 * ------------------------------------------------------------ */

export interface ReportFlag {
  id: string
  kind: 'finding' | 'inspection' | 'holdpoint'
  /** id data seed, mis. 'f-ar-021'. */
  refId: string
  label: string
  to: string
  code?: string
  targetUnit?: string
  statusNote?: string
}

export interface ReportDelay {
  id: string
  category: string
  desc: string
}

export interface WorkProgressItem {
  unitCode: string
  trade: string
  progressPct: number
  status: 'completed' | 'in_progress' | 'need_inspection' | 'pending_verification'
  statusLabel: string
}

export interface StructuredDelay {
  id: string
  category: string
  duration: string
  affectedUnit: string
  impact: string
}

export interface DailyReport {
  id: string
  ref: string
  projectId: string
  at: string
  author: string
  authorOrg: string
  /** Rekapan progres kumulatif yang dilaporkan hari itu. */
  progressNote: string
  workSummary: string[]
  progressItems?: WorkProgressItem[]
  delays: ReportDelay[]
  structuredDelays?: StructuredDelay[]
  flags: ReportFlag[]
  photoCount: number
}

export const DAILY_REPORTS: DailyReport[] = [
  /* ---------- Nawasena · LHR-NAW (Cluster Nawasena Tahap 2) ---------- */
  {
    id: 'lw-08-116',
    ref: 'LHR-NAW-1030',
    projectId: 'naw',
    at: agoH(20),
    author: 'Rizky Hidayat',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan Cluster Nawasena 54% (rencana 58%).',
    progressItems: [
      { unitCode: 'Unit A-05', trade: 'Pembesian Balok & Pelat', progressPct: 100, status: 'pending_verification', statusLabel: 'Menunggu Verifikasi' },
      { unitCode: 'Unit B-02', trade: 'Rangka Atap Baja Ringan', progressPct: 100, status: 'need_inspection', statusLabel: 'Ajukan Pemeriksaan' },
      { unitCode: 'Blok A', trade: 'Plesteran & Acian (A-03, A-04)', progressPct: 60, status: 'in_progress', statusLabel: 'Sesuai Jadwal' },
      { unitCode: 'Unit A-01', trade: 'Keramik Lantai Ruang Tamu', progressPct: 85, status: 'in_progress', statusLabel: 'Punch List Siap' },
    ],
    workSummary: [
      'Pembesian balok & pelat Unit A-05: koreksi penambahan spacer beton 25 mm selesai 100%; menunggu verifikasi pengawas kualitas.',
      'Rangka atap baja ringan Unit B-02 terpasang kokoh; permohonan pemeriksaan diajukan ke pengawas.',
      'Pekerjaan plesteran & acian dinding Blok A (Unit A-03 & A-04) berjalan sesuai jadwal.',
      'Pemasangan keramik lantai Unit A-01 mencapai 85%; persiapan penyusunan punch list serah terima unit.',
    ],
    delays: [
      { id: 'd1', category: 'cuaca', desc: 'Hujan deras sore (1 jam): pengecoran sloof pondasi Unit C-04 ditunda ke esok pagi.' },
    ],
    structuredDelays: [
      { id: 'd1', category: 'Cuaca (Hujan Deras)', duration: '1 Jam', affectedUnit: 'Unit C-04 (Cor Sloof)', impact: 'Pengecoran ditunda ke esok pagi' },
    ],
    flags: [
      { id: 'fl1', kind: 'finding', refId: 'f-ar-021', label: 'F-NW-021 · verifikasi perbaikan spacer Unit A-05 menunggu pengawas', code: 'F-NW-021', targetUnit: 'Unit A-05', statusNote: 'Verifikasi Spacer', to: '/dashboard/temuan/f-ar-021' },
      { id: 'fl2', kind: 'holdpoint', refId: 'hp-ar-02', label: 'CP-NW-02 · izin cor balok Unit A-05 menunggu verifikasi', code: 'CP-NW-02', targetUnit: 'Unit A-05', statusNote: 'Izin Cor Tertahan', to: '/dashboard/proyek/naw?titik=hp-ar-02' },
      { id: 'fl3', kind: 'inspection', refId: 'wir-ar-0142', label: 'INSP-NW-2026-0142 · verifikasi fisik di lapangan Unit A-05', code: 'INSP-NW-2026-0142', targetUnit: 'Unit A-05', statusNote: 'Verifikasi Lapangan', to: '/dashboard/inspeksi/wir-ar-0142' },
    ],
    photoCount: 12,
  },
  {
    id: 'lw-08-115',
    ref: 'LHR-NAW-1029',
    projectId: 'naw',
    at: agoH(44),
    author: 'Rizky Hidayat',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan 53% (rencana 56%).',
    progressItems: [
      { unitCode: 'Unit A-05', trade: 'Perbaikan Spacer Balok B2', progressPct: 80, status: 'in_progress', statusLabel: 'Pemasangan Spacer 25 mm' },
      { unitCode: 'Blok B', trade: 'Instalasi Sanitair & Sparing Pipa', progressPct: 45, status: 'in_progress', statusLabel: 'Sesuai Jadwal' },
    ],
    workSummary: [
      'Pekerjaan perbaikan spacer beton balok B2 Unit A-05 dikerjakan oleh mandor struktur CV Mitra Bangun.',
      'Pemasangan instalasi sanitair dan sparing pipa Blok B berjalan normal.',
    ],
    delays: [],
    flags: [
      { id: 'fl1', kind: 'inspection', refId: 'wir-ar-0142', label: 'INSP-NW-2026-0142 · pemeriksaan ulang diajukan ke pengawas', code: 'INSP-NW-2026-0142', targetUnit: 'Unit A-05', statusNote: 'Pemeriksaan Ulang', to: '/dashboard/inspeksi/wir-ar-0142' },
      { id: 'fl2', kind: 'finding', refId: 'f-ar-021', label: 'F-NW-021 · bukti foto perbaikan spacer 25 mm diunggah', code: 'F-NW-021', targetUnit: 'Unit A-05', statusNote: 'Foto Diunggah', to: '/dashboard/temuan/f-ar-021' },
    ],
    photoCount: 8,
  },
  {
    id: 'lw-08-114',
    ref: 'LHR-NAW-1028',
    projectId: 'naw',
    at: agoH(92),
    author: 'Rizky Hidayat',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan 52% (rencana 55%).',
    progressItems: [
      { unitCode: 'Unit A-05', trade: 'Pembesian Balok & Pelat', progressPct: 100, status: 'need_inspection', statusLabel: 'Temuan Selimut Beton' },
    ],
    workSummary: [
      'Pemeriksaan pembesian balok & pelat Unit A-05 mencatat selimut beton balok B2 terukur 20 mm (kurang dari standar 25 mm).',
      'Mandor struktur diinstruksikan memasang spacer beton kur standar sebelum izin cor diberikan.',
    ],
    delays: [
      { id: 'd1', category: 'kualitas', desc: 'Perbaikan selimut beton balok B2 Unit A-05: jadwal cor pelat lantai 2 digeser 2 hari.' },
    ],
    structuredDelays: [
      { id: 'd1', category: 'Kualitas (Spacer)', duration: '2 Hari', affectedUnit: 'Unit A-05 (Pelat L2)', impact: 'Jadwal cor digeser untuk perbaikan spacer' },
    ],
    flags: [
      { id: 'fl1', kind: 'finding', refId: 'f-ar-021', label: 'F-NW-021 · catatan selimut beton di bawah spesifikasi dicatat', to: '/dashboard/temuan/f-ar-021' },
      { id: 'fl2', kind: 'inspection', refId: 'wir-ar-0142', label: 'INSP-NW-2026-0142 · hasil pemeriksaan: perlu perbaikan', to: '/dashboard/inspeksi/wir-ar-0142' },
    ],
    photoCount: 6,
  },

  /* ---------- Ruko Grand Harmoni · LHR-RKO ---------- */
  {
    id: 'lw-11-038',
    ref: 'LHR-RKO-1030',
    projectId: 'rko',
    at: agoH(26),
    author: 'Dedi Kurniawan',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan 68% (rencana 70%).',
    progressItems: [
      { unitCode: 'Ruko 03', trade: 'Pipa PPR & Kabel Daya Shaft L2', progressPct: 40, status: 'in_progress', statusLabel: 'Penataan Pemisah' },
      { unitCode: 'Ruko 02', trade: 'Kerokan Cat Fasad', progressPct: 50, status: 'need_inspection', statusLabel: 'Lewat Tempo 1 Hari' },
      { unitCode: 'Ruko 01', trade: 'Uji Gelontor Pipa Buang L1', progressPct: 100, status: 'completed', statusLabel: 'Lancar & Disetujui' },
    ],
    workSummary: [
      'Instalasi pipa PPR air bersih dan kabel daya di shaft pipa Ruko 03 Lantai 2 sedang diatur ulang pemisahannya.',
      'Mandor finishing belum menuntaskan kerokan cat menggelembung fasad Ruko 02 (telah melewati batas waktu 1 hari).',
      'Uji gelontor instalasi pipa pembuangan lantai 1 Ruko 01 selesai dengan hasil lancar.',
    ],
    delays: [
      { id: 'd1', category: 'finishing', desc: 'Perbaikan cat fasad Ruko 02 terlambat: mandor cat diminta menambah 2 tukang hari ini.' },
    ],
    structuredDelays: [
      { id: 'd1', category: 'Finishing (Cat)', duration: '1 Hari', affectedUnit: 'Ruko 02 (Fasad)', impact: 'Penambahan 2 tukang cat' },
    ],
    flags: [
      { id: 'fl1', kind: 'finding', refId: 'f-ks-014', label: 'F-RKO-014 · tindakan perbaikan cat fasad Ruko 02 lewat jatuh tempo', to: '/dashboard/temuan/f-ks-014' },
      { id: 'fl2', kind: 'finding', refId: 'f-ks-012', label: 'F-RKO-012 · penataan pipa air vs kabel shaft Ruko 03', to: '/dashboard/temuan/f-ks-012' },
      { id: 'fl3', kind: 'inspection', refId: 'wir-ks-0088', label: 'INSP-RKO-2026-0088 · klarifikasi jarak pemisah pipa Ruko 03', to: '/dashboard/inspeksi/wir-ks-0088' },
    ],
    photoCount: 9,
  },
  {
    id: 'lw-11-037',
    ref: 'LHR-RKO-1029',
    projectId: 'rko',
    at: agoH(50),
    author: 'Dedi Kurniawan',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan 67% (rencana 69%).',
    workSummary: [
      'Pemeriksaan berkala menemukan cat dinding luar Ruko 02 menggelembung sebelum serah terima unit.',
      'Instruksi perbaikan diterbitkan kepada subkontraktor finishing CV Berkah Finishing.',
    ],
    delays: [],
    flags: [
      { id: 'fl1', kind: 'finding', refId: 'f-ks-014', label: 'F-RKO-014 · cat dinding luar menggelembung dicatat', to: '/dashboard/temuan/f-ks-014' },
    ],
    photoCount: 4,
  },

  /* ---------- Graha Mulia · LHR-GML ---------- */
  {
    id: 'lw-05-021',
    ref: 'LHR-GML-0021',
    projectId: 'gml',
    at: agoH(30),
    author: 'Yusuf Maulana',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan 44% (rencana 45%).',
    workSummary: [
      'Rangka hollow partisi gypsum Lantai 2 ruang rapat selesai dirakit; jadwal pemeriksaan disepakati esok H+1.',
      'Pengecatan epoxy primer lantai lobby lantai 1 kering sempurna dan lolos uji daya rekat.',
    ],
    delays: [
      { id: 'd1', category: 'jadwal', desc: 'Pemeriksaan partisi disesuaikan ke H+1 pukul 14:00 mengikuti jadwal konsultan pengawas.' },
    ],
    flags: [
      { id: 'fl1', kind: 'inspection', refId: 'wir-jk-0041', label: 'INSP-GML-2026-0041 · jadwal pemeriksaan disepakati H+1 14:00', to: '/dashboard/inspeksi/wir-jk-0041' },
      { id: 'fl2', kind: 'inspection', refId: 'wir-jk-0027', label: 'INSP-GML-2026-0027 · review sampel kaca fasad oleh konsultan', to: '/dashboard/inspeksi/wir-jk-0027' },
    ],
    photoCount: 7,
  },
  {
    id: 'lw-05-020',
    ref: 'LHR-GML-0020',
    projectId: 'gml',
    at: agoH(54),
    author: 'Yusuf Maulana',
    authorOrg: 'Site Manager · PT Tri Daya Bangun',
    progressNote: 'Progres kumulatif pelaksanaan 43% (rencana 44%).',
    workSummary: [
      'Sampel profil kusen aluminium dan kaca tempered 10 mm diajukan ke PT Cipta Karya Desain.',
      'Pemasangan stop kontak dan instalasi kabel data lantai 2 berlanjut.',
    ],
    delays: [],
    flags: [
      { id: 'fl1', kind: 'inspection', refId: 'wir-jk-0027', label: 'INSP-GML-2026-0027 · sampel spesifikasi material diajukan', to: '/dashboard/inspeksi/wir-jk-0027' },
    ],
    photoCount: 3,
  },
]

/* ------------------------------------------------------------
 * Milestone / aktivitas berikutnya & risikonya
 * ------------------------------------------------------------ */

export type MilestoneStatusId = 'on_track' | 'at_risk' | 'blocked'

export const MILESTONE_STATUS: Record<MilestoneStatusId, StatusDef> = {
  on_track: { id: 'on_track', label: 'Sesuai Jadwal', tone: 'success', icon: CircleCheck, description: 'Tidak ada hambatan pada persiapan aktivitas ini.' },
  at_risk: { id: 'at_risk', label: 'Berisiko', tone: 'warning', icon: TriangleAlert, description: 'Ada prasyarat/risiko yang belum selesai; dapat menggeser jadwal.' },
  blocked: { id: 'blocked', label: 'Tertahan', tone: 'danger', icon: OctagonAlert, description: 'Aktivitas tidak dapat dimulai sampai prasyarat dirilis.' },
}

export interface Milestone {
  id: string
  projectId: string
  code?: string
  activityName: string
  targetScope: string
  title: string
  date: string
  statusId: MilestoneStatusId
  note: string
  prerequisiteAction?: string
  links: ReportFlag[]
}

export const MILESTONES: Milestone[] = [
  {
    id: 'ms-aru-1',
    projectId: 'naw',
    code: 'MS-COR-L2',
    activityName: 'Pengecoran Balok & Pelat L2',
    targetScope: 'Unit A-05',
    title: '[Unit A-05] Cor Balok & Pelat L2',
    date: aheadD(2),
    statusId: 'blocked',
    note: 'Menunggu verifikasi spacer beton balok B2.',
    prerequisiteAction: 'Verifikasi Spacer Balok B2 (25 mm)',
    links: [
      { id: 'l1', kind: 'holdpoint', refId: 'hp-ar-02', label: 'CP-NW-02', to: '/dashboard/proyek/naw?titik=hp-ar-02' },
      { id: 'l2', kind: 'finding', refId: 'f-ar-021', label: 'F-NW-021', to: '/dashboard/temuan/f-ar-021' },
    ],
  },
  {
    id: 'ms-aru-2',
    projectId: 'naw',
    code: 'MS-ATAP-B2',
    activityName: 'Pemasangan Genteng Beton',
    targetScope: 'Unit B-02',
    title: '[Unit B-02] Penutup Genteng Beton',
    date: aheadD(5),
    statusId: 'at_risk',
    note: 'Pemeriksaan rangka atap INSP-NW-2026-0151 terjadwal H+2.',
    prerequisiteAction: 'Inspeksi Rangka Kuda-Kuda Baja',
    links: [
      { id: 'l1', kind: 'inspection', refId: 'wir-ar-0151', label: 'INSP-NW-2026-0151', to: '/dashboard/inspeksi/wir-ar-0151' },
    ],
  },
  {
    id: 'ms-ks-1',
    projectId: 'rko',
    code: 'MS-MEP-RK3',
    activityName: 'Uji Tekan Pipa PPR L2',
    targetScope: 'Ruko 03',
    title: '[Ruko 03] Uji Tekan Pipa Air Bersih',
    date: aheadD(3),
    statusId: 'at_risk',
    note: 'Witness bersama konsultan dijadwalkan ulang H+1 14:00.',
    prerequisiteAction: 'Relokasi Pipa vs Kabel Tray L2',
    links: [
      { id: 'l1', kind: 'inspection', refId: 'wir-ks-0088', label: 'INSP-RKO-2026-0088', to: '/dashboard/inspeksi/wir-ks-0088' },
    ],
  },
  {
    id: 'ms-ks-2',
    projectId: 'rko',
    code: 'MS-STK-RK12',
    activityName: 'Serah Terima Kunci Unit',
    targetScope: 'Ruko 01 & 02',
    title: '[Ruko 01 & 02] Serah Terima Kunci',
    date: aheadD(7),
    statusId: 'at_risk',
    note: 'Menunggu penuntasan perbaikan cat fasad Ruko 02.',
    prerequisiteAction: 'Penyelesaian Perbaikan Cat Fasad Overdue',
    links: [
      { id: 'l1', kind: 'inspection', refId: 'wir-ks-0091', label: 'INSP-RKO-2026-0091', to: '/dashboard/inspeksi/wir-ks-0091' },
      { id: 'l2', kind: 'finding', refId: 'f-ks-014', label: 'F-RKO-014', to: '/dashboard/temuan/f-ks-014' },
    ],
  },
  {
    id: 'ms-jk-1',
    projectId: 'gml',
    code: 'MS-PAR-L2',
    activityName: 'Inspeksi Rangka Partisi Gypsum',
    targetScope: 'Lantai 2',
    title: '[Lantai 2] Rangka Partisi Gypsum',
    date: aheadH(30),
    statusId: 'on_track',
    note: 'Inspeksi konsultan terkonfirmasi H+1 14:00.',
    prerequisiteAction: 'Inspeksi Bersama Konsultan H+1',
    links: [
      { id: 'l1', kind: 'inspection', refId: 'wir-jk-0041', label: 'INSP-GML-2026-0041', to: '/dashboard/inspeksi/wir-jk-0041' },
    ],
  },
  {
    id: 'ms-jk-2',
    projectId: 'gml',
    code: 'MS-EPX-LOB',
    activityName: 'Lantai Epoxy & Partisi Kaca',
    targetScope: 'Lobby Utama',
    title: '[Lobby] Lantai Epoxy & Partisi Kaca',
    date: aheadD(8),
    statusId: 'on_track',
    note: 'Uji adhesi disetujui; siap pasang kaca.',
    prerequisiteAction: 'Uji Adhesi Lolos Disetujui',
    links: [
      { id: 'l1', kind: 'inspection', refId: 'wir-jk-0033', label: 'INSP-GML-2026-0033', to: '/dashboard/inspeksi/wir-jk-0033' },
    ],
  },
]

/* ------------------------------------------------------------
 * Selektor & hitungan presentasi
 * ------------------------------------------------------------ */

export const projectById = (id: string) => {
  const norm = normalizeProjectId(id)
  return PROJECTS.find((p) => p.id === norm || p.id === id)!
}
export const projectName = (id: string) => projectById(id)?.name ?? id
export const projectCode = (id: string) => projectById(id)?.code ?? id
export const inspectionById = (id: string) => INSPECTIONS.find((i) => i.id === id)
export const inspectionByRef = (ref: string) => INSPECTIONS.find((i) => i.ref === ref)
export const findingById = (id: string) => FINDINGS.find((f) => f.id === id)
export const controlPointById = (id: string) => CONTROL_POINTS.find((c) => c.id === id)
export const activityById = (id: string) => WORK_PACKAGES.find((w) => w.id === id)

export const inspectionsOfProject = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return INSPECTIONS.filter((i) => i.projectId === norm || i.projectId === projectId)
}
export const findingsOfProject = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return FINDINGS.filter((f) => f.projectId === norm || f.projectId === projectId)
}
export const controlPointsOfProject = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return CONTROL_POINTS.filter((c) => c.projectId === norm || c.projectId === projectId)
}

/** Hitungan portofolio — logika hitung dipakai juga oleh register (FR-OV-03). */
export function portfolioCounts() {
  const open = INSPECTIONS.filter((i) => i.projectId !== 'bl')
  return {
    awaitingReview: open.filter((i) => ['submitted', 'internal_review', 'reinspection_requested'].includes(i.status)).length,
    awaitingExternal: open.filter((i) => ['external_review'].includes(i.status)).length,
    corrections: open.filter((i) => ['clarification_required', 'correction_required'].includes(i.status)).length,
    scheduled: open.filter((i) => ['scheduled', 'in_progress'].includes(i.status)).length,
    openFindings: FINDINGS.filter((f) => !['closed', 'superseded', 'cancelled'].includes(f.status)).length,
    overdueActions: FINDINGS.flatMap((f) => f.actions).filter((a) => ['in_progress', 'submitted', 'verification_pending'].includes(a.status) && new Date(a.dueAt).getTime() < NOW).length,
    holdAwaitingRelease: CONTROL_POINTS.filter((c) => c.pointType === 'hold' && c.status === 'awaiting_release').length,
  }
}

/** Pita "workflow pulse" per proyek — ringkasan workflow, bukan progres fisik (FR-OV-01). */
export interface PulseSegment { tone: StatusTone; count: number; label: string }

export function projectPulse(projectId: string): PulseSegment[] {
  const list = inspectionsOfProject(projectId)
  const g = (ids: InspectionStatusId[]) => list.filter((i) => ids.includes(i.status)).length
  const segments: PulseSegment[] = [
    { tone: 'success', count: g(['accepted']), label: 'Sesuai' },
    { tone: 'info', count: g(['submitted', 'scheduled', 'external_review']), label: 'Menunggu/terjadwal' },
    { tone: 'active', count: g(['internal_review', 'in_progress', 'reinspection_requested']), label: 'Berjalan' },
    { tone: 'warning', count: g(['clarification_required', 'correction_required', 'deferred', 'unable_to_inspect']), label: 'Perlu tindakan' },
    { tone: 'neutral', count: g(['draft', 'withdrawn', 'cancelled']), label: 'Lainnya' },
  ]
  return segments.filter((s) => s.count > 0)
}

/* ------------------------------------------------------------
 * Selektor kendali eksekusi
 * ------------------------------------------------------------ */

export const healthOf = (projectId: string): ProjectHealthState => {
  const norm = normalizeProjectId(projectId)
  return PROJECT_HEALTH_STATE[norm] ?? PROJECT_HEALTH_STATE[projectId] ?? { healthId: 'on_track', headline: '', reasons: [] }
}
export const progressOf = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return PROJECT_PROGRESS[norm] ?? PROJECT_PROGRESS[projectId]
}

export const reportsOfProject = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return DAILY_REPORTS.filter((r) => r.projectId === norm || r.projectId === projectId).sort((a, b) => b.at.localeCompare(a.at))
}
export const latestReportOf = (projectId: string) => reportsOfProject(projectId)[0]
export const milestonesOfProject = (projectId: string) => {
  const norm = normalizeProjectId(projectId)
  return MILESTONES.filter((m) => m.projectId === norm || m.projectId === projectId).sort((a, b) => a.date.localeCompare(b.date))
}

const HEALTH_RANK: Record<ProjectHealthId, number> = { behind: 0, at_risk: 1, on_track: 2, archived: 3 }

/** Proyek aktif terurut dari yang paling perlu perhatian (exception-first). */
export function attentionProjects(): Project[] {
  return PROJECTS.filter((p) => p.status !== 'closed').sort((a, b) => {
    const ha = healthOf(a.id)
    const hb = healthOf(b.id)
    if (ha.healthId !== hb.healthId) return HEALTH_RANK[ha.healthId] - HEALTH_RANK[hb.healthId]
    const pa = progressOf(a.id)
    const pb = progressOf(b.id)
    return (pa ? pa.actualPct - pa.planPct : 0) - (pb ? pb.actualPct - pb.planPct : 0)
  })
}

export interface PriorityIssue {
  finding: Finding
  overdue: boolean
  /** Hold point yang diblokir temuan ini (bila ada). */
  blocks: ControlPoint[]
}

/** Temuan terbuka terpenting lintas proyek — overdue dulu, lalu yang memblokir. */
export function priorityIssues(): PriorityIssue[] {
  const open = FINDINGS.filter((f) => !['closed', 'superseded', 'cancelled'].includes(f.status))
  const key = (f: Finding): PriorityIssue => {
    const overdue = !!f.dueAt && new Date(f.dueAt).getTime() < NOW
    const blocks = CONTROL_POINTS.filter((c) => c.conditions?.some((x) => !x.met && x.label.includes(f.ref)))
    return { finding: f, overdue, blocks }
  }
  const weight = (i: PriorityIssue) => (i.overdue ? 0 : i.blocks.length > 0 ? 1 : 2)
  return open
    .map(key)
    .sort((a, b) => weight(a) - weight(b) || a.finding.ref.localeCompare(b.finding.ref))
}

/** Milestone berisiko/tertahan — untuk pita "perlu perhatian". */
export function milestonesAtRisk() {
  return MILESTONES.filter((m) => m.statusId !== 'on_track').sort((a, b) => a.date.localeCompare(b.date))
}

/** Laporan hari ini belum diterima? (batas: 06:00 hari demo) — sinyal disiplin pelaporan. */
export function reportDueToday(projectId: string) {
  const latest = latestReportOf(projectId)
  if (!latest) return false
  const todayStart = new Date(new Date(NOW).setHours(6, 0, 0, 0)).getTime()
  return new Date(latest.at).getTime() < todayStart
}

/** Laporan harian yang menyebut sebuah temuan — jejak lapangan → tindak lanjut. */
export const reportsMentioningFinding = (findingId: string) =>
  DAILY_REPORTS.filter((r) => r.flags.some((fl) => fl.kind === 'finding' && fl.refId === findingId))

/* ------------------------------------------------------------
 * Indeks pencarian global (FR-SE-01/02)
 * ------------------------------------------------------------ */

export interface SearchEntry {
  type: 'proyek' | 'inspeksi' | 'temuan' | 'titik kendali' | 'laporan harian'
  id: string
  title: string
  subtitle: string
  projectId: string
  statusId: string
  location: string
  to: string
}

export function searchIndex(): SearchEntry[] {
  return [
    ...PROJECTS.map<SearchEntry>((p) => ({ type: 'proyek', id: p.id, title: p.name, subtitle: `${p.code} · ${p.client}`, projectId: p.id, statusId: p.status, location: p.location, to: `/dashboard/proyek/${p.id}` })),
    ...INSPECTIONS.map<SearchEntry>((i) => ({ type: 'inspeksi', id: i.id, title: `${i.ref} · ${i.title}`, subtitle: i.scope, projectId: i.projectId, statusId: i.status, location: i.location, to: `/dashboard/inspeksi/${i.id}` })),
    ...FINDINGS.map<SearchEntry>((f) => ({ type: 'temuan', id: f.id, title: `${f.ref} · ${f.title}`, subtitle: f.facts.slice(0, 80) + '…', projectId: f.projectId, statusId: f.status, location: f.location, to: `/dashboard/temuan/${f.id}` })),
    ...CONTROL_POINTS.map<SearchEntry>((c) => ({ type: 'titik kendali', id: c.id, title: `${c.ref} · ${c.title}`, subtitle: `Otoritas: ${c.releaseAuthority}`, projectId: c.projectId, statusId: c.status, location: c.nextActivity ?? '-', to: `/dashboard/proyek/${c.projectId}?titik=${c.id}` })),
    ...DAILY_REPORTS.map<SearchEntry>((r) => ({ type: 'laporan harian', id: r.id, title: `${r.ref} · ${projectName(r.projectId)}`, subtitle: r.progressNote, projectId: r.projectId, statusId: healthOf(r.projectId).healthId, location: r.author, to: `/dashboard/proyek/${r.projectId}` })),
  ]
}

/* ------------------------------------------------------------
 * Ikon per jenis peristiwa timeline (pemetaan presentasi)
 * ------------------------------------------------------------ */

export const EVENT_ICON: Record<TimelineEvent['kind'], LucideIcon> = {
  created: FilePenLine,
  submitted: Send,
  review: FileText,
  external: MessageCircleQuestion,
  scheduled: CalendarClock,
  in_progress: Eye,
  accepted: CircleCheck,
  correction: FileWarning,
  clarification: MessageCircleQuestion,
  reinspection: RefreshCw,
  rescheduled: CalendarX,
  unable: EyeOff,
  withdrawn: Undo2,
  cancelled: Ban,
  finding: TriangleAlert,
  action: UserPlus,
  verified: BadgeCheck,
  rejected: CircleX,
  release: Stamp,
  evidence: FileText,
  doc: FileText,
}

export const EVENT_TONE: Record<TimelineEvent['kind'], StatusTone> = {
  created: 'neutral',
  submitted: 'info',
  review: 'info',
  external: 'info',
  scheduled: 'info',
  in_progress: 'active',
  accepted: 'success',
  correction: 'warning',
  clarification: 'warning',
  reinspection: 'active',
  rescheduled: 'neutral',
  unable: 'warning',
  withdrawn: 'neutral',
  cancelled: 'neutral',
  finding: 'danger',
  action: 'brand',
  verified: 'success',
  rejected: 'danger',
  release: 'success',
  evidence: 'brand',
  doc: 'neutral',
}

export const ACTION_ICON_KEYS = Object.keys(ACTION_KIND)
