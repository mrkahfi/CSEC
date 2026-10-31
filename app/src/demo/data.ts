import type {
  FindingClassificationId,
  FindingStatusId,
  HoldPointStatusId,
  InspectionStatusId,
  PointTypeId,
  RoleId,
  StatusTone,
} from '@/components/status'
import {
  Archive,
  BadgeCheck,
  CalendarClock,
  CalendarX,
  CircleCheck,
  CircleX,
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
    id: 'aru',
    code: 'ARU',
    name: 'Gedung Aruna Tower A',
    client: 'PT Griya Aruna Sejahtera',
    location: 'Jakarta Selatan',
    type: 'Gedung bertingkat (struktur & arsitektur)',
    status: 'active',
    value: 'Rp 412 M',
    period: 'Jan 2025 – Agu 2026',
    pm: 'Andi Prasetyo',
    siteManager: 'Rizky Hidayat',
    qualityLead: 'Sari Wulandari',
    consultant: 'CV Mitra Teknik (Hendra Kusuma)',
  },
  {
    id: 'ks',
    code: 'KS',
    name: 'Pembangunan Klinik Sentosa',
    client: 'Yayasan Sentosa Sehat',
    location: 'Bandung',
    type: 'Fasilitas kesehatan (2 lantai + MEP)',
    status: 'active',
    value: 'Rp 68 M',
    period: 'Okt 2025 – Mar 2026',
    pm: 'Andi Prasetyo',
    siteManager: 'Dedi Kurniawan',
    qualityLead: 'Sari Wulandari',
    consultant: 'CV Mitra Teknik (Hendra Kusuma)',
  },
  {
    id: 'jk',
    code: 'JK',
    name: 'Peningkatan Jalan Kartika',
    client: 'Dinas Bina Marga Kota (fiktif)',
    location: 'Makassar, Sektor 2',
    type: 'Jalan (peningkatan perkerasan, Sta 0+000–1+200)',
    status: 'active',
    value: 'Rp 31 M',
    period: 'Agu 2026 – Feb 2027',
    pm: 'Andi Prasetyo',
    siteManager: 'Yusuf Maulana',
    qualityLead: 'Sari Wulandari',
    consultant: 'PT Cipta Karya Konsultan',
  },
  {
    id: 'bl',
    code: 'BL',
    name: 'Renovasi Gudang Logistik Bantan',
    client: 'PT Sentra Pergudangan',
    location: 'Medan',
    type: 'Renovasi gudang (struktur baja)',
    status: 'closed',
    value: 'Rp 12 M',
    period: 'Feb 2025 – Des 2025 · diarsipkan',
    pm: 'Andi Prasetyo',
    siteManager: 'Dedi Kurniawan',
    qualityLead: 'Sari Wulandari',
    consultant: 'CV Mitra Teknik',
  },
]

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

export const WORK_PACKAGES: WorkPackage[] = [
  { id: 'wp-ar-l8', projectId: 'aru', code: 'ARU-STR-L8', name: 'Struktur pelat & balok lantai 8', discipline: 'Struktur beton', location: 'Tower A · Lantai 8', itpRef: 'ITP-ARU-STR Rev C', nextActivity: 'Pengecoran pelat lantai 8' },
  { id: 'wp-ar-l9', projectId: 'aru', code: 'ARU-ARC-L9', name: 'Dinding geser & bekistik lantai 9', discipline: 'Struktur beton', location: 'Tower A · Lantai 9', itpRef: 'ITP-ARU-STR Rev C', nextActivity: 'Pengecoran dinding geser L9' },
  { id: 'wp-ar-l7', projectId: 'aru', code: 'ARU-ARC-L7', name: 'Arsitektur lantai 7 (dinding & lantai keramik)', discipline: 'Arsitektur', location: 'Tower A · Lantai 7', itpRef: 'ITP-ARU-ARC Rev B' },
  { id: 'wp-ar-mep8', projectId: 'aru', code: 'ARU-MEP-L8', name: 'MEP lantai 8 (ducting, pipa, riser)', discipline: 'MEP', location: 'Tower A · Lantai 8 · Shaft B', itpRef: 'ITP-ARU-MEP Rev A' },
  { id: 'wp-ks-mep', projectId: 'ks', code: 'KS-MEP-L2', name: 'MEP plafon lantai 2 (kelistrikan & HVAC)', discipline: 'MEP', location: 'Lantai 2 · Zona Klinik', itpRef: 'ITP-KS-MEP Rev B' },
  { id: 'wp-ks-san', projectId: 'ks', code: 'KS-PLB-L1', name: 'Instalasi sanitair & plumbing lantai 1', discipline: 'Plumbing', location: 'Lantai 1 · Blok Poli', itpRef: 'ITP-KS-PLB Rev A' },
  { id: 'wp-ks-ff', projectId: 'ks', code: 'KS-FF-L2', name: 'Instalasi fire fighting lantai 2', discipline: 'Fire Fighting', location: 'Lantai 2 · Koridor Utara', itpRef: 'ITP-KS-FF Rev A' },
  { id: 'wp-jk-sub', projectId: 'jk', code: 'JK-EW-01', name: 'Tanah dasar & subbase (earthwork)', discipline: 'Perkerasan jalan', location: 'Sta 0+400 – 0+900', itpRef: 'ITP-JK-RW Rev 2', nextActivity: 'Layer base kelas A' },
  { id: 'wp-bl-st', projectId: 'bl', code: 'BL-ST-01', name: 'Struktur baja kanopi & mezzanine', discipline: 'Struktur baja', location: 'Blok Gudang B', itpRef: 'ITP-BL-ST Rev A' },
]

/* ------------------------------------------------------------
 * Titik inspeksi (hold / witness / review) — PRD §9.7
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
    ref: 'HP-AR-02',
    projectId: 'aru',
    activityId: 'wp-ar-l8',
    pointType: 'hold',
    title: 'Pengecoran pelat lantai 8',
    itpRef: 'ITP-ARU-STR Rev C · Item 4.2',
    releaseAuthority: 'Quality Manager · Ratna Dewi',
    status: 'awaiting_release',
    conditions: [
      { id: 'c1', label: 'Inspeksi tulangan terakhir tercatat (WIR-AR-2026-0142)', met: true, note: 'Re-inspeksi lapangan telah dilaksanakan; keputusan QC menunggu rekam.' },
      { id: 'c2', label: 'Tidak ada temuan terbuka pada lingkup terkait', met: false, note: 'F-AR-021 · cover tulangan di bawah spesifikasi, masih terbuka.' },
      { id: 'c3', label: 'Verifikasi tindakan perbaikan oleh QA/QC', met: false, note: 'Tindakan CA-021-1 menunggu verifikasi independen.' },
      { id: 'c4', label: 'Hasil uji bahan (slump & kuat tekan batch 118)', met: true, note: 'Laboratorium: slump 85 mm, kuat tekan 28,4 MPa; memenuhi.' },
    ],
    nextActivity: 'Pengecoran pelat lantai 8',
    relatedInspectionRef: 'WIR-AR-2026-0142',
  },
  {
    id: 'wp-jk-01',
    ref: 'WP-JK-01',
    projectId: 'jk',
    activityId: 'wp-jk-sub',
    pointType: 'witness',
    title: 'Kepadatan in-situ subbase (sand cone)',
    itpRef: 'ITP-JK-RW Rev 2 · Item 3.4',
    releaseAuthority: 'Konsultan · PT Cipta Karya',
    status: 'awaiting_inspection',
    witness: {
      party: 'PT Cipta Karya Konsultan',
      scheduledAt: aheadH(30),
      attendance: 'rescheduled',
      note: 'Kehadiran dijadwalkan ulang (konsultan berhalangan); waktu baru tercatat & pemberitahuan ulang terkirim.',
    },
    relatedInspectionRef: 'WIR-JK-2026-0041',
  },
  {
    id: 'hp-jk-01',
    ref: 'HP-JK-01',
    projectId: 'jk',
    activityId: 'wp-jk-sub',
    pointType: 'hold',
    title: 'Penerimaan layer base sebelum aspal',
    itpRef: 'ITP-JK-RW Rev 2 · Item 5.1',
    releaseAuthority: 'Konsultan · PT Cipta Karya',
    status: 'not_due',
    nextActivity: 'Pekerjaan perkerasan aspal lapis 1',
  },
  {
    id: 'rp-ks-01',
    ref: 'RP-KS-01',
    projectId: 'ks',
    activityId: 'wp-ks-mep',
    pointType: 'review',
    title: 'Review shop drawing MEP revisi terbaru',
    itpRef: 'ITP-KS-MEP Rev B · Item 1.3',
    releaseAuthority: 'Konsultan · CV Mitra Teknik',
    status: 'awaiting_release',
    note: 'Review point, bukan hold fisik.',
    relatedInspectionRef: 'WIR-KS-2026-0088',
  },
]

/* ------------------------------------------------------------
 * Referensi dokumen — revisi & status (SC-27/28)
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
  s301c: { id: 's301c', title: 'Gambar Detail Tulangan Pelat L8', number: 'S-301', rev: 'C', status: 'current', issued: agoD(24), usedRevAtSubmission: 'C' },
  s301b: { id: 's301b', title: 'Gambar Detail Tulangan Pelat L8', number: 'S-301', rev: 'B', status: 'superseded', issued: agoD(120) },
  mep12: { id: 'mep12', title: 'Shop Drawing Tata Letak MEP Lantai 2', number: 'MEP-12', rev: '2', status: 'current', issued: agoD(9) },
  speccon: { id: 'speccon', title: 'Spesifikasi Teknik Beton Struktur', number: 'SPEC-CON-01', rev: '1', status: 'current', issued: agoD(300) },
  itpjkrw: { id: 'itpjkrw', title: 'ITP Perkerasan Jalan', number: 'ITP-JK-RW', rev: '2', status: 'current', issued: agoD(60) },
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
  nextAction?: { label: string; owner: string; dueAt?: string }
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
  /* ---------- ARU — inti skenario §15.3 ---------- */
  {
    id: 'wir-ar-0142',
    ref: 'WIR-AR-2026-0142',
    projectId: 'aru',
    activityId: 'wp-ar-l8',
    title: 'Inspeksi tulangan pelat lantai 8',
    scope: 'Tulangan pelat & balok · Grid A/1–4, ±184 m², besi D16-150',
    location: 'Tower A · Lantai 8 · Grid A/1–4',
    locationDetail: 'Zona puring timur, dekat lift core B',
    pointType: 'hold',
    itpRef: 'ITP-ARU-STR Rev C · Item 4.2',
    status: 'reinspection_requested',
    submittedAt: agoD(6),
    requestedAt: aheadH(20),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    externalAuthority: undefined,
    noticeHours: 48,
    nextAction: { label: 'Terima/tolak hasil re-inspeksi', owner: 'Sari Wulandari (QA/QC)', dueAt: aheadH(26) },
    documents: [DOCS.s301c, DOCS.s301b, DOCS.speccon],
    checklist: [
      { id: 'ck1', label: 'Diameter, jarak & jumlah tulangan sesuai gambar', source: 'S-301 Rev C · Sheet 2', result: 'ok' },
      { id: 'ck2', label: 'Cover beton sesuai spesifikasi (25 mm)', source: 'SPEC-CON-01 Rev 1 §5.3', result: 'issue', note: 'Cover sebagian 20 mm, sudah dikoreksi & difoto ulang' },
      { id: 'ck3', label: 'Ikatan spacer & kur jarak terpasang', source: 'ITP-ARU-STR Rev C 4.2.b', result: 'ok' },
      { id: 'ck4', label: 'Bersihan & rapat sambungan bekisting', source: 'ITP-ARU-STR Rev C 4.2.c', result: 'ok' },
      { id: 'ck5', label: 'Hasil uji slump & benda uji batch tercatat', source: 'SPEC-CON-01 Rev 1 §7.1', result: 'ok', note: 'Batch 118 · slump 85 mm' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto cover tulangan setelah koreksi (Grid A/2)', meta: '8 foto · Budi Santoso · terlampir pada pengajuan ulang' },
      { id: 'ev2', kind: 'doc', title: 'Laporan pengawasan harian LW-08-114', meta: 'PDF · 2 hal · CV Mitra Teknik' },
      { id: 'ev3', kind: 'test', title: 'Berita acara uji slump batch 118', meta: 'PDF · lab independen' },
      { id: 'ev4', kind: 'photo', title: 'Foto progres sebelum koreksi (riwayat)', meta: '6 foto · arsip pengajuan pertama', unavailable: true },
    ],
    linkedFindingIds: ['f-ar-021'],
    priorInspectionIds: ['wir-ar-0131'],
    holdPointId: 'hp-ar-02',
    timeline: [
      { id: 't1', at: agoD(6), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan dibuat', kind: 'created', detail: 'WIR-AR-2026-0142 · lingkup Grid A/1–4 · S-301 Rev C' },
      { id: 't2', at: agoH(140), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan untuk review', kind: 'submitted', note: 'Pemberitahuan 48 jam sesuai ITP.' },
      { id: 't3', at: agoD(4), actor: SARI.name, role: 'QA/QC', title: 'Keputusan direkam: Perlu Perbaikan', kind: 'correction', note: 'Cover tulangan sebagian 20 mm (spesifikasi 25 mm); foto pendukung kurang mewakili area Grid A/3–4.', detail: 'Bukan inkonformitas teknis formal, tidak membuat NCR. Re-inspeksi ditautkan ke pengajuan ini.' },
      { id: 't4', at: agoD(3), actor: BUDI.name, role: 'Site Engineer', title: 'Perbaikan dikerjakan + bukti dilampirkan', kind: 'evidence', note: 'Cover diganti spacer 25 mm; 8 foto baru & laporan pengawasan LW-08-114.' },
      { id: 't5', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', title: 'Re-inspeksi diminta', kind: 'reinspection', detail: 'Tertaut ke WIR-AR-2026-0142; riwayat pengajuan pertama tetap tersimpan.' },
      { id: 't6', at: agoH(20), actor: SARI.name, role: 'QA/QC', title: 'Inspeksi ulang dilaksanakan di lapangan', kind: 'in_progress', note: 'Pemeriksaan lapangan selesai; keputusan formal menunggu perekaman.' },
    ],
  },
  {
    id: 'wir-ar-0151',
    ref: 'WIR-AR-2026-0151',
    projectId: 'aru',
    activityId: 'wp-ar-l9',
    title: 'Inspeksi bekisting & dinding geser L9',
    scope: 'Bekisting dinding geser inti · Grid C/2–5, per…' ,
    location: 'Tower A · Lantai 9 · Grid C/2–5',
    pointType: 'witness',
    itpRef: 'ITP-ARU-STR Rev C · Item 3.1',
    status: 'submitted',
    submittedAt: agoH(9),
    requestedAt: aheadD(2),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 48,
    nextAction: { label: 'Review kelengkapan & jadwalkan', owner: 'Sari Wulandari (QA/QC)', dueAt: aheadH(30) },
    documents: [DOCS.s301c],
    checklist: [
      { id: 'ck1', label: 'Kesesuaian dimensi bekisting dengan gambar', source: 'S-301 Rev C · Sheet 4', result: 'ok' },
      { id: 'ck2', label: 'Kelurusan & penyangga vertikal', source: 'ITP-ARU-STR Rev C 3.1.a', result: 'ok' },
      { id: 'ck3', label: 'Agent release & lendutan diizinkan', source: 'ITP-ARU-STR Rev C 3.1.c', result: 'na' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto bekisting dinding inti', meta: '5 foto · Budi Santoso' },
      { id: 'ev2', kind: 'doc', title: 'Checklist pra-pengecoran', meta: 'PDF · ditandatangani mandor' },
    ],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoH(10), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan dibuat', kind: 'created' },
      { id: 't2', at: agoH(9), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan untuk review', kind: 'submitted', note: 'Menunggu penugasan reviewer QA/QC.' },
    ],
  },
  {
    id: 'wir-ar-0131',
    ref: 'WIR-AR-2026-0131',
    projectId: 'aru',
    activityId: 'wp-ar-l8',
    title: 'Inspeksi tulangan balok lantai 7 (parsial)',
    scope: 'Tulangan balok B-7a/B-7b · lingkup yang diperiksa: balok B-7a saja',
    location: 'Tower A · Lantai 7 · Grid B/2–4',
    pointType: 'hold',
    itpRef: 'ITP-ARU-STR Rev C · Item 4.1',
    status: 'accepted',
    submittedAt: agoD(11),
    requestedAt: agoD(9),
    decidedAt: agoD(9),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 48,
    documents: [DOCS.s301c, DOCS.s301b],
    checklist: [
      { id: 'ck1', label: 'Diameter & jarak tulangan sesuai gambar', source: 'S-301 Rev C · Sheet 2', result: 'ok' },
      { id: 'ck2', label: 'Panjang kait & overlap las', source: 'SPEC-CON-01 Rev 1 §5.1', result: 'ok' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto tulangan balok B-7a', meta: '9 foto · Budi Santoso' },
    ],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(11), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(10), actor: SARI.name, role: 'QA/QC', title: 'Inspeksi dilaksanakan (lingkup parsial)', kind: 'in_progress', note: 'Balok B-7b belum dapat diperiksa (material belum tiba). Sisa lingkup memerlukan pengajuan baru.' },
      { id: 't3', at: agoD(9), actor: SARI.name, role: 'QA/QC', title: 'Keputusan direkam: Diterima (lingkup B-7a)', kind: 'accepted', note: 'Diterima untuk lingkup & revisi gambar yang ditinjau (S-301 Rev C).', detail: 'Bukan penerimaan kontraktual; bukan rilis hold point.' },
    ],
    decision: { outcome: 'Diterima', statusId: 'accepted', by: SARI.name, role: 'QA/QC', scope: 'Balok B-7a · Grid B/2–4 · S-301 Rev C', comment: 'Sesuai gambar & spesifikasi. Sisa lingkup (B-7b) = pengajuan terpisah.' },
  },
  {
    id: 'wir-ar-0128',
    ref: 'WIR-AR-2026-0128',
    projectId: 'aru',
    activityId: 'wp-ar-l7',
    title: 'Pengecoran fooring lantai 7',
    scope: 'Pengecoran fooring 100 mm · area parkir L7',
    location: 'Tower A · Lantai 7 · Zona Parkir',
    pointType: 'surveillance',
    itpRef: 'ITP-ARU-ARC Rev B · Item 6.2',
    status: 'accepted',
    submittedAt: agoD(14),
    decidedAt: agoD(13),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 24,
    documents: [],
    checklist: [
      { id: 'ck1', label: 'Ketebalan & mutu beton fooring', source: 'ITP-ARU-ARC Rev B 6.2', result: 'ok' },
    ],
    evidence: [{ id: 'ev1', kind: 'photo', title: 'Foto hasil fooring', meta: '4 foto' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(14), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(13), actor: SARI.name, role: 'QA/QC', title: 'Keputusan direkam: Diterima', kind: 'accepted' },
    ],
    decision: { outcome: 'Diterima', statusId: 'accepted', by: SARI.name, role: 'QA/QC', scope: 'Fooring L7 · ITP-ARU-ARC Rev B', comment: 'Rata & sesuai garis tinggi.' },
  },
  {
    id: 'wir-ar-0135',
    ref: 'WIR-AR-2026-0135',
    projectId: 'aru',
    activityId: 'wp-ar-l7',
    title: 'Waterproofing bak toilet L7',
    scope: 'Waterproofing 6 bak toilet · uji genangan 48 jam',
    location: 'Tower A · Lantai 7 · Bak Toilet 1–6',
    pointType: 'hold',
    itpRef: 'ITP-ARU-ARC Rev B · Item 7.3',
    status: 'deferred',
    submittedAt: agoD(5),
    requestedAt: agoD(2),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 24,
    nextAction: { label: 'Jadwalkan ulang uji genangan', owner: 'Budi Santoso (Site Eng)', dueAt: aheadD(1) },
    documents: [],
    checklist: [
      { id: 'ck1', label: 'Genangan 48 jam tanpa rembes', source: 'ITP-ARU-ARC Rev B 7.3', result: 'na' },
    ],
    evidence: [{ id: 'ev1', kind: 'photo', title: 'Foto bak dalam pengujian', meta: '3 foto' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(5), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(2), actor: SARI.name, role: 'QA/QC', title: 'Tidak dapat diinspeksi, reviewer berhalangan', kind: 'unable', note: 'Pemeriksa tidak hadir pada jadwal; waktu asli & pihak terkait tercatat.', detail: 'Tidak ada izin otomatis melanjutkan pekerjaan; sesuai prosedur, jadwal ulang.' },
      { id: 't3', at: agoH(30), actor: SARI.name, role: 'QA/QC', title: 'Ditunda & dijadwalkan ulang', kind: 'rescheduled', detail: 'Alasan: ketersediaan pemeriksa. Waktu baru diusulkan oleh penjadwal.' },
    ],
  },
  {
    id: 'wir-ar-0119',
    ref: 'WIR-AR-2026-0119',
    projectId: 'aru',
    activityId: 'wp-ar-mep8',
    title: 'Instalasi pipa riser shaft B',
    scope: 'Pipa riser air bersih DN80 · shaft B',
    location: 'Tower A · Lantai 8 · Shaft B',
    pointType: 'review',
    itpRef: 'ITP-ARU-MEP Rev A · Item 2.2',
    status: 'withdrawn',
    submittedAt: agoD(9),
    decidedAt: agoD(8),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 24,
    documents: [],
    checklist: [],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(9), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(8), actor: BUDI.name, role: 'Site Engineer', title: 'Ditarik oleh pengirim', kind: 'withdrawn', note: 'Duplikasi dengan WIR-AR-2026-0118 untuk lingkup yang sama, tidak digabung diam-diam.' },
    ],
  },
  {
    id: 'wir-ar-0147',
    ref: 'WIR-AR-2026-0147',
    projectId: 'aru',
    activityId: 'wp-ar-mep8',
    title: 'Ducting AC lantai 8',
    scope: 'Ducting prefabricated · zona tenaga utara',
    location: 'Tower A · Lantai 8 · Zona Tenaga Utara',
    pointType: 'witness',
    itpRef: 'ITP-ARU-MEP Rev A · Item 3.4',
    status: 'draft',
    submitter: BUDI,
    reviewer: 'Belum ditunjuk',
    noticeHours: 48,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Kedapatan ducting & isolasi', source: 'ITP-ARU-MEP Rev A 3.4' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoH(5), actor: BUDI.name, role: 'Site Engineer', title: 'Draf dibuat, belum diajukan', kind: 'created' },
    ],
  },

  /* ---------- Klinik Sentosa ---------- */
  {
    id: 'wir-ks-0088',
    ref: 'WIR-KS-2026-0088',
    projectId: 'ks',
    activityId: 'wp-ks-mep',
    title: 'Instalasi MEP plafon lantai 2',
    scope: 'Kelistrikan, HVAC & pasokan gas medis · plafon zona klinik',
    location: 'Lantai 2 · Zona Klinik · Sektor A1–A6',
    pointType: 'review',
    itpRef: 'ITP-KS-MEP Rev B · Item 2.5',
    status: 'clarification_required',
    submittedAt: agoD(3),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    externalAuthority: 'CV Mitra Teknik',
    noticeHours: 48,
    missingItems: [
      'Nomor revisi shop drawing MEP belum dicantumkan pada pengajuan (MEP-12 Rev 2 terbaru, perlu konfirmasi)',
      'Checklist pra-instalasi bertanda tangan QA kontraktor belum terlampir',
    ],
    nextAction: { label: 'Lengkapi referensi dokumen & kirim respons', owner: 'Budi Santoso (Site Eng)', dueAt: aheadD(2) },
    documents: [DOCS.mep12],
    checklist: [
      { id: 'ck1', label: 'Routing kabel sesuai shop drawing', source: 'MEP-12 Rev … (perlu konfirmasi revisi)', result: 'issue', note: 'Revisi gambar tidak disebut pada pengajuan' },
      { id: 'ck2', label: 'Uji kontinuitas & isolasi tercatat', source: 'ITP-KS-MEP Rev B 2.5.b', result: 'ok' },
      { id: 'ck3', label: 'Penandaan jalur gas medis', source: 'ITP-KS-MEP Rev B 2.5.d', result: 'ok' },
    ],
    evidence: [
      { id: 'ev1', kind: 'photo', title: 'Foto instalasi plafon terbuka', meta: '12 foto · Budi Santoso' },
      { id: 'ev2', kind: 'test', title: 'Hasil uji kontinuitas (terpusat)', meta: 'PDF · 1 hal' },
    ],
    linkedFindingIds: ['f-ks-012'],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(3), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(2), actor: SARI.name, role: 'QA/QC', title: 'Perlu klarifikasi, bukan kegagalan teknis', kind: 'clarification', note: 'Referensi revisi gambar tidak lengkap; perlu konfirmasi sebelum review teknis.', detail: 'Tidak dinyatakan sebagai inkonformitas; pengajuan dikembalikan untuk kelengkapan.' },
    ],
  },
  {
    id: 'wir-ks-0079',
    ref: 'WIR-KS-2026-0079',
    projectId: 'ks',
    activityId: 'wp-ks-san',
    title: 'Instalasi sanitair lantai 1',
    scope: 'Pipa air bersih & kotor · blok poli',
    location: 'Lantai 1 · Blok Poli · Ruang 101–118',
    pointType: 'witness',
    itpRef: 'ITP-KS-PLB Rev A · Item 2.1',
    status: 'accepted',
    submittedAt: agoD(8),
    decidedAt: agoD(7),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 24,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Uji tekan pipa 1,5× tekanan kerja', source: 'ITP-KS-PLB Rev A 2.1', result: 'ok' }],
    evidence: [{ id: 'ev1', kind: 'test', title: 'Berita acara uji tekan', meta: 'PDF' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(8), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(7), actor: SARI.name, role: 'QA/QC', title: 'Keputusan direkam: Diterima (lulus pertama)', kind: 'accepted' },
    ],
    decision: { outcome: 'Diterima', statusId: 'accepted', by: SARI.name, role: 'QA/QC', scope: 'Sanitair L1 · ITP-KS-PLB Rev A', comment: 'Uji tekan lulus; tidak ada kebocoran.' },
  },
  {
    id: 'wir-ks-0091',
    ref: 'WIR-KS-2026-0091',
    projectId: 'ks',
    activityId: 'wp-ks-ff',
    title: 'Instalasi fire fighting lantai 2',
    scope: 'Pipa sprinkler & hydrant box · koridor utara',
    location: 'Lantai 2 · Koridor Utara',
    pointType: 'hold',
    itpRef: 'ITP-KS-FF Rev A · Item 3.2',
    status: 'scheduled',
    submittedAt: agoD(2),
    requestedAt: aheadD(3),
    scheduledAt: aheadD(3),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    externalAuthority: 'CV Mitra Teknik',
    noticeHours: 48,
    nextAction: { label: 'Siapkan area & hadir pada jadwal', owner: 'Budi Santoso (Site Eng)', dueAt: aheadD(3) },
    documents: [],
    checklist: [{ id: 'ck1', label: 'Uji tekan sprinkler tercatat', source: 'ITP-KS-FF Rev A 3.2' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(2), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(1), actor: SARI.name, role: 'QA/QC', title: 'Terjadwal, disetujui kedua pihak', kind: 'scheduled', detail: 'Jadwal: H+3 pukul 09:00 · pemberitahuan 48 jam terpenuhi.' },
    ],
  },

  /* ---------- Jalan Kartika ---------- */
  {
    id: 'wir-jk-0041',
    ref: 'WIR-JK-2026-0041',
    projectId: 'jk',
    activityId: 'wp-jk-sub',
    title: 'Pemadatan subbase (uji kepadatan lapangan)',
    scope: 'Subbase kelas B · kepadatan in-situ (sand cone), 3 titik',
    location: 'Sta 0+600 – 0+900 · Lajur kanan',
    pointType: 'witness',
    itpRef: 'ITP-JK-RW Rev 2 · Item 3.4',
    status: 'scheduled',
    submittedAt: agoD(4),
    scheduledAt: aheadH(30),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Konsultan',
    externalAuthority: 'PT Cipta Karya Konsultan',
    noticeHours: 72,
    nextAction: { label: 'Konfirmasi kehadiran witness baru', owner: 'PT Cipta Karya (Konsultan)', dueAt: aheadH(24) },
    documents: [DOCS.itpjkrw],
    checklist: [
      { id: 'ck1', label: 'Kepadatan ≥ 95% proctor standar', source: 'ITP-JK-RW Rev 2 3.4', result: 'na' },
    ],
    evidence: [{ id: 'ev1', kind: 'photo', title: 'Foto permukaan subbase', meta: '6 foto' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(4), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted', detail: 'Pemberitahuan 72 jam (witness point).' },
      { id: 't2', at: agoD(2), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Jadwal diubah, konsultan berhalangan', kind: 'rescheduled', note: 'Waktu asli, alasan perubahan, waktu baru & penanggung jawab penjadwalan tercatat. Notifikasi simulasi terkirim ke pihak terkait.' },
      { id: 't3', at: agoD(1), actor: 'Yusuf Maulana', role: 'Site Manager', title: 'Terjadwal, disetujui ulang', kind: 'scheduled', detail: 'Waktu baru: H+1 pukul 14:00.' },
    ],
  },
  {
    id: 'wir-jk-0033',
    ref: 'WIR-JK-2026-0033',
    projectId: 'jk',
    activityId: 'wp-jk-sub',
    title: 'Tanah dasar (uji CBR lapangan)',
    scope: 'Tanah dasar sta 0+400–0+600 · CBR & kepadatan',
    location: 'Sta 0+400 – 0+600 · Lajur kiri',
    pointType: 'witness',
    itpRef: 'ITP-JK-RW Rev 2 · Item 2.3',
    status: 'accepted',
    submittedAt: agoD(10),
    decidedAt: agoD(9),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Konsultan',
    externalAuthority: 'PT Cipta Karya Konsultan',
    noticeHours: 72,
    documents: [DOCS.itpjkrw],
    checklist: [{ id: 'ck1', label: 'CBR ≥ 8% (tanah dasar)', source: 'ITP-JK-RW Rev 2 2.3', result: 'ok', note: 'CBR rata-rata 10,2%' }],
    evidence: [{ id: 'ev1', kind: 'test', title: 'Laporan uji CBR lab', meta: 'PDF · 3 hal' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(10), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(9), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Keputusan direkam: Diterima', kind: 'accepted' },
    ],
    decision: { outcome: 'Diterima', statusId: 'accepted', by: 'PT Cipta Karya', role: 'Konsultan', scope: 'Sta 0+400–0+600 lajur kiri', comment: 'CBR memenuhi; lanjut subbase.' },
  },
  {
    id: 'wir-jk-0027',
    ref: 'WIR-JK-2026-0027',
    projectId: 'jk',
    activityId: 'wp-jk-sub',
    title: 'Review rencana campuran aspal (mix design)',
    scope: 'Dokumen mix design AC-WC & AC-BC · review point',
    location: 'Dokumen · Sta seluruh segmen',
    pointType: 'review',
    itpRef: 'ITP-JK-RW Rev 2 · Item 5.0',
    status: 'external_review',
    submittedAt: agoD(5),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Konsultan',
    externalAuthority: 'PT Cipta Karya Konsultan',
    noticeHours: 0,
    nextAction: { label: 'Catat keputusan eksternal', owner: 'PT Cipta Karya (Konsultan)', dueAt: aheadD(1) },
    documents: [DOCS.itpjkrw],
    checklist: [{ id: 'ck1', label: 'Mix design sesuai spesifikasi dinas', source: 'ITP-JK-RW Rev 2 5.0' }],
    evidence: [{ id: 'ev1', kind: 'doc', title: 'Mix design proposal AC-WC/AC-BC', meta: 'PDF · 11 hal' }],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(5), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(4), actor: SARI.name, role: 'QA/QC', title: 'Review internal selesai, diteruskan ke pihak eksternal', kind: 'review', detail: 'Menunggu keputusan konsultan; satu persetujuan bukan semua persetujuan.' },
    ],
  },
  {
    id: 'wir-jk-0038',
    ref: 'WIR-JK-2026-0038',
    projectId: 'jk',
    activityId: 'wp-jk-sub',
    title: 'Pemadatan tanah dasar (lanjutan)',
    scope: 'Tanah dasar sta 0+900–1+200 · sedang diperiksa',
    location: 'Sta 0+900 – 1+200 · Lajur kanan',
    pointType: 'surveillance',
    itpRef: 'ITP-JK-RW Rev 2 · Item 2.3',
    status: 'in_progress',
    submittedAt: agoD(1),
    submitter: BUDI,
    reviewer: 'PT Cipta Karya Konsultan',
    noticeHours: 72,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Kepadatan lapangan', source: 'ITP-JK-RW Rev 2 2.3' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoH(4), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Inspeksi berlangsung di lapangan', kind: 'in_progress' },
    ],
  },

  /* ---------- Bantan (arsip, hanya-baca — FR-PR-05) ---------- */
  {
    id: 'wir-bl-0202',
    ref: 'WIR-BL-2025-0202',
    projectId: 'bl',
    activityId: 'wp-bl-st',
    title: 'Ereksi struktur baja mezzanine',
    scope: 'Ereksi kolom & balok WF · blok gudang B',
    location: 'Blok Gudang B · Grid 3–7/A–D',
    pointType: 'hold',
    itpRef: 'ITP-BL-ST Rev A · Item 4.1',
    status: 'accepted',
    submittedAt: agoD(400),
    decidedAt: agoD(398),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 48,
    documents: [],
    checklist: [{ id: 'ck1', label: 'Torque baut & plumb kolom', source: 'ITP-BL-ST Rev A 4.1', result: 'ok' }],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(400), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(398), actor: SARI.name, role: 'QA/QC', title: 'Keputusan direkam: Diterima', kind: 'accepted' },
    ],
    decision: { outcome: 'Diterima', statusId: 'accepted', by: SARI.name, role: 'QA/QC', scope: 'Ereksi mezzanine Rev A', comment: 'Rekam historis, proyek arsip (hanya-baca).' },
  },
  {
    id: 'wir-bl-0196',
    ref: 'WIR-BL-2025-0196',
    projectId: 'bl',
    activityId: 'wp-bl-st',
    title: 'Pengecatan struktur baja',
    scope: 'Primer & finishing · zona 2',
    location: 'Blok Gudang B · Zona 2',
    pointType: 'review',
    itpRef: 'ITP-BL-ST Rev A · Item 6.1',
    status: 'cancelled',
    submittedAt: agoD(380),
    decidedAt: agoD(379),
    submitter: BUDI,
    reviewer: 'Sari Wulandari (QA/QC)',
    noticeHours: 24,
    documents: [],
    checklist: [],
    evidence: [],
    linkedFindingIds: [],
    priorInspectionIds: [],
    timeline: [
      { id: 't1', at: agoD(380), actor: BUDI.name, role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't2', at: agoD(379), actor: 'Ratna Dewi', role: 'Quality Manager', title: 'Dibatalkan', kind: 'cancelled', note: 'Lingkup dialihkan ke vendor cat; riwayat tetap tersimpan.' },
    ],
  },
]

/* ------------------------------------------------------------
 * Temuan & tindakan perbaikan — PRD §9.6 / §10.2
 * ------------------------------------------------------------ */

export interface CorrectiveAction {
  id: string
  ref: string
  description: string
  assignee: string
  assigneeOrg: string
  dueAt: string
  status: 'in_progress' | 'submitted' | 'verification_pending' | 'verified' | 'rejected'
  evidenceNote?: string
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
  title: string
  /** Fakta objektif terpisah dari dugaan penyebab (FR-FA-03). */
  facts: string
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
    ref: 'F-AR-021',
    projectId: 'aru',
    inspectionRef: 'WIR-AR-2026-0142',
    location: 'Tower A · Lantai 8 · Grid A/2–3',
    title: 'Cover tulangan pelat di bawah spesifikasi',
    facts: 'Pengukuran lapangan pada 12 titik menunjukkan cover 20 mm pada area Grid A/2–3; spesifikasi 25 mm (SPEC-CON-01 §5.3). 4 titik lainnya sesuai.',
    suspectedCause: 'Spacer tidak terpasang merata saat pengecoran tahap awal (dugaan, belum dikonfirmasi).',
    affectedExtent: '±6 m² pelat atas Grid A/2–3, luas pasti masih diinvestigasi',
    sourceRequirement: 'SPEC-CON-01 Rev 1 §5.3 · S-301 Rev C',
    classification: 'confirmed_nc',
    status: 'verification_pending',
    identifiedAt: agoD(4),
    identifiedBy: SARI.name,
    assignee: 'CV Bangun Jaya (subkontraktor)',
    dueAt: aheadD(2),
    ncrRequired: true,
    actions: [
      {
        id: 'ca-021-1',
        ref: 'CA-021-1',
        description: 'Ganti spacer 25 mm & pasang ulang kur pada area terdampak; dokumentasikan foto tiap titik.',
        assignee: 'CV Bangun Jaya (subkontraktor)',
        assigneeOrg: 'Subkontraktor struktur',
        dueAt: aheadD(1),
        status: 'verification_pending',
        evidenceNote: '8 foto pasca-perbaikan + laporan pengawasan LW-08-114 diajukan Budi Santoso.',
      },
    ],
    timeline: [
      { id: 't1', at: agoD(4), actor: SARI.name, role: 'QA/QC', title: 'Temuan dicatat, inkonformitas terkonfirmasi', kind: 'finding', note: 'Klasifikasi oleh otoritas QA; indikator NCR wajib dibuat pada sistem resmi.' },
      { id: 't2', at: agoD(3), actor: 'Andi Prasetyo', role: 'Project Manager', title: 'Tindakan ditugaskan ke subkontraktor', kind: 'action', detail: 'Penanggung jawab internal: Rizky Hidayat (Site Manager).' },
      { id: 't3', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', title: 'Bukti perbaikan diajukan', kind: 'evidence', note: 'Menunggu verifikasi independen; temuan belum boleh ditutup.' },
    ],
  },
  {
    id: 'f-ar-022',
    ref: 'F-AR-022',
    projectId: 'aru',
    inspectionRef: 'WIR-AR-2026-0131',
    location: 'Tower A · Lantai 7 · Grid B/2–4',
    title: 'Urutan ikatan kait balok tidak seragam',
    facts: 'Jarak kait bervariasi 190–210 mm pada 2 titik; toleransi ±10 mm. Sudah diperbaiki saat inspeksi.',
    affectedExtent: '2 titik kait, sudah dikoreksi saat inspeksi',
    sourceRequirement: 'SPEC-CON-01 Rev 1 §5.1',
    classification: 'observation',
    status: 'closed',
    identifiedAt: agoD(10),
    identifiedBy: SARI.name,
    assignee: 'Budi Santoso',
    actions: [
      { id: 'ca-022-1', ref: 'CA-022-1', description: 'Rapikan kait & briefing mandor tulangan.', assignee: 'Budi Santoso', assigneeOrg: 'PT KBN', dueAt: agoD(9), status: 'verified', evidenceNote: 'Foto pasca-perbaikan.', verifiedBy: SARI.name, verifiedAt: agoD(9) },
    ],
    timeline: [
      { id: 't1', at: agoD(10), actor: SARI.name, role: 'QA/QC', title: 'Observasi dicatat, tanpa NCR', kind: 'finding', note: 'Observasi tidak otomatis membuka NCR.' },
      { id: 't2', at: agoD(9), actor: SARI.name, role: 'QA/QC', title: 'Diverifikasi & ditutup', kind: 'verified' },
    ],
  },
  {
    id: 'f-ks-012',
    ref: 'F-KS-012',
    projectId: 'ks',
    inspectionRef: 'WIR-KS-2026-0088',
    location: 'Lantai 2 · Zona Klinik · Sektor A3',
    title: 'Jalur kabel tidak sesuai routing plan',
    facts: 'Tray kabel daya Sektor A3 melewati jalur gas medis sesuai foto lapangan; routing plan menetapkan jalur terpisah min. 300 mm.',
    suspectedCause: 'Interpretasi drawing oleh installer (dugaan).',
    affectedExtent: '±14 m tray, masih diinvestigasi',
    sourceRequirement: 'MEP-12 · ITP-KS-MEP Rev B 2.5',
    classification: 'potential_nc',
    status: 'assigned',
    identifiedAt: agoD(2),
    identifiedBy: SARI.name,
    assignee: 'PT Karya Bangun Nusantara · MEP',
    dueAt: aheadD(4),
    actions: [],
    timeline: [
      { id: 't1', at: agoD(2), actor: SARI.name, role: 'QA/QC', title: 'Temuan dicatat, potensi inkonformitas', kind: 'finding', note: 'Klasifikasi menunggu investigasi; belum dinyatakan terkonfirmasi.' },
      { id: 't2', at: agoD(1), actor: 'Andi Prasetyo', role: 'Project Manager', title: 'Ditugaskan ke tim MEP', kind: 'action', detail: 'Investigasi luas dampak oleh mandor MEP; update berikutnya H+2.' },
    ],
  },
  {
    id: 'f-ks-014',
    ref: 'F-KS-014',
    projectId: 'ks',
    location: 'Lantai 1 · Ruang Panel Listrik',
    title: 'Panel listrik sementara tidak tertutup',
    facts: 'Panel distribusi sementara ditemukan tanpa penutup pelindung saat patroli; risiko kontak listrik area kerja.',
    affectedExtent: '1 panel distribusi · Ruang Panel L1',
    sourceRequirement: 'Prosedur K3 Proyek KS §4.2',
    classification: 'confirmed_nc',
    status: 'action_in_progress',
    identifiedAt: agoD(6),
    identifiedBy: 'Rizky Hidayat',
    assignee: 'CV Bangun Jaya (subkontraktor MEP)',
    dueAt: agoD(1),
    ncrRequired: true,
    actions: [
      {
        id: 'ca-014-1',
        ref: 'CA-014-1',
        description: 'Pasang penutup panel sementara + rambu; ajukan foto kepatuhan.',
        assignee: 'CV Bangun Jaya',
        assigneeOrg: 'Subkontraktor MEP',
        dueAt: agoD(1),
        status: 'in_progress',
      },
    ],
    timeline: [
      { id: 't1', at: agoD(6), actor: 'Rizky Hidayat', role: 'Site Manager', title: 'Temuan dicatat, inkonformitas terkonfirmasi', kind: 'finding' },
      { id: 't2', at: agoD(5), actor: 'Andi Prasetyo', role: 'Project Manager', title: 'Tindakan ditugaskan, due H+1', kind: 'action' },
      { id: 't3', at: agoH(20), actor: 'Sistem (simulasi)', role: 'Eskalasi demo', title: 'Tindakan melewati jatuh tempo', kind: 'rejected', note: 'Overdue 1 hari; tampil di kotak tindakan PM.' },
    ],
  },
  {
    id: 'f-jk-006',
    ref: 'F-JK-006',
    projectId: 'jk',
    inspectionRef: 'WIR-JK-2026-0033',
    location: 'Sta 0+520 · Lajur kiri',
    title: 'Genangan kecil pada galian terbuka',
    facts: 'Air menggenang ±2 m² pada galian terbuka pasca hujan; dipompa & diurug ulang di hari yang sama.',
    affectedExtent: '±2 m², ditangani di hari yang sama',
    sourceRequirement: 'ITP-JK-RW Rev 2 §2.3',
    classification: 'observation',
    status: 'closed',
    identifiedAt: agoD(10),
    identifiedBy: 'PT Cipta Karya',
    assignee: 'Yusuf Maulana',
    actions: [
      { id: 'ca-006-1', ref: 'CA-006-1', description: 'Pompa genangan & padatkan ulang.', assignee: 'Yusuf Maulana', assigneeOrg: 'PT KBN', dueAt: agoD(9), status: 'verified', verifiedBy: 'PT Cipta Karya', verifiedAt: agoD(9) },
    ],
    timeline: [
      { id: 't1', at: agoD(10), actor: 'PT Cipta Karya', role: 'Konsultan', title: 'Observasi dicatat', kind: 'finding' },
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
  { id: 'a1', kind: 'review_inspection', title: 'Terima/tolak hasil re-inspeksi WIR-AR-2026-0142', detail: 'Tulangan pelat L8; perbaikan cover sudah diajukan ulang dengan bukti.', projectId: 'aru', record: { type: 'inspection', id: 'wir-ar-0142' }, owner: 'Sari Wulandari (QA/QC)', dueAt: aheadH(26), visibleTo: ['qc_inspector', 'quality_manager', 'project_manager'] },
  { id: 'a2', kind: 'review_inspection', title: 'Review pengajuan WIR-AR-2026-0151', detail: 'Bekisting dinding geser L9 (baru masuk), prioritas jadwal H+2.', projectId: 'aru', record: { type: 'inspection', id: 'wir-ar-0151' }, owner: 'Sari Wulandari (QA/QC)', dueAt: aheadH(30), visibleTo: ['qc_inspector', 'quality_manager'] },
  { id: 'a3', kind: 'complete_submission', title: 'Lengkapi referensi dokumen WIR-KS-2026-0088', detail: 'Nomor revisi shop drawing & checklist bertanda tangan belum terlampir.', projectId: 'ks', record: { type: 'inspection', id: 'wir-ks-0088' }, owner: 'Budi Santoso (Site Eng)', dueAt: aheadD(2), visibleTo: ['site_engineer', 'project_manager'] },
  { id: 'a4', kind: 'verify_action', title: 'Verifikasi tindakan CA-021-1 (F-AR-021)', detail: 'Perbaikan cover tulangan menunggu verifikasi independen QA/QC.', projectId: 'aru', record: { type: 'finding', id: 'f-ar-021' }, owner: 'Sari Wulandari (QA/QC)', dueAt: aheadD(1), visibleTo: ['qc_inspector', 'quality_manager'] },
  { id: 'a5', kind: 'respond_finding', title: 'Investigasi F-KS-012 (jalur kabel vs gas medis)', detail: 'Tentukan luas dampak & tindakan; update berikutnya H+2.', projectId: 'ks', record: { type: 'finding', id: 'f-ks-012' }, owner: 'Tim MEP · PT KBN', dueAt: aheadD(4), visibleTo: ['site_engineer', 'project_manager', 'qc_inspector'] },
  { id: 'a6', kind: 'release_hold_point', title: 'Catat rilis HP-AR-02 (pengecoran pelat L8)', detail: 'Rilis oleh Quality Manager setelah seluruh kondisi terpenuhi. Saat ini terblokir 2 kondisi.', projectId: 'aru', record: { type: 'holdpoint', id: 'hp-ar-02' }, owner: 'Ratna Dewi (Quality Manager)', visibleTo: ['quality_manager', 'project_manager'] },
  { id: 'a7', kind: 'record_external_decision', title: 'Rekam keputusan konsultan · WIR-JK-2026-0027', detail: 'Review mix design aspal menunggu keputusan pihak eksternal.', projectId: 'jk', record: { type: 'inspection', id: 'wir-jk-0027' }, owner: 'PT Cipta Karya (Konsultan)', dueAt: aheadD(1), visibleTo: ['external'] },
  { id: 'a8', kind: 'schedule_inspection', title: 'Konfirmasi jadwal witness baru WP-JK-01', detail: 'Kehadiran konsultan dijadwalkan ulang, perlu konfirmasi akhir.', projectId: 'jk', record: { type: 'holdpoint', id: 'wp-jk-01' }, owner: 'PT Cipta Karya (Konsultan)', dueAt: aheadH(24), visibleTo: ['external', 'site_engineer', 'project_manager'] },
  { id: 'a9', kind: 'resolve_overdue', title: 'Overdue: CA-014-1 penutupan panel listrik (F-KS-014)', detail: 'Tindakan melewati jatuh tempo 1 hari; perlu penanganan/eskalasi.', projectId: 'ks', record: { type: 'finding', id: 'f-ks-014' }, owner: 'CV Bangun Jaya / PM', dueAt: agoD(1), visibleTo: ['project_manager', 'site_engineer', 'qc_inspector', 'quality_manager'] },
]

/** Notifikasi in-app — SELALU berlabel simulasi (FR-NO-04). */
export const NOTIFICATIONS = [
  { id: 'n1', at: agoH(2), title: 'Re-inspeksi WIR-AR-2026-0142 menunggu keputusan Anda', body: 'Sari Wulandari · QA/QC · simulasi', link: '/inspeksi/wir-ar-0142', tone: 'info' as StatusTone },
  { id: 'n2', at: agoD(1), title: 'Tindakan CA-014-1 melewati jatuh tempo', body: 'F-KS-014 panel listrik, overdue 1 hari · simulasi', link: '/temuan/f-ks-014', tone: 'danger' as StatusTone },
  { id: 'n3', at: agoD(2), title: 'Jadwal witness WP-JK-01 diubah', body: 'Kehadiran konsultan ditunda ke H+1 14:00 · simulasi', link: '/inspeksi/wir-jk-0041', tone: 'warning' as StatusTone },
]

/* ------------------------------------------------------------
 * Aktivitas global (FR-OV-04 / FR-AU-01)
 * ------------------------------------------------------------ */

export interface ActivityEntry {
  id: string
  at: string
  actor: string
  role: string
  projectId: string
  ref: string
  kind: TimelineEvent['kind']
  title: string
  note?: string
  /** 'decision' bila berdampak tinggi (FR-OV-04). */
  impact?: boolean
  link: string
}

export const ACTIVITY: ActivityEntry[] = [
  { id: 'g1', at: agoH(2), actor: SARI.name, role: 'QA/QC', projectId: 'aru', ref: 'WIR-AR-2026-0142', kind: 'in_progress', title: 'Inspeksi ulang dilaksanakan di lapangan', note: 'Keputusan formal menunggu perekaman.', impact: true, link: '/inspeksi/wir-ar-0142' },
  { id: 'g2', at: agoH(5), actor: BUDI.name, role: 'Site Engineer', projectId: 'aru', ref: 'WIR-AR-2026-0147', kind: 'created', title: 'Draf pengajuan dibuat', link: '/inspeksi/wir-ar-0147' },
  { id: 'g3', at: agoH(20), actor: 'Sistem (simulasi)', role: 'Eskalasi demo', projectId: 'ks', ref: 'F-KS-014', kind: 'rejected', title: 'Tindakan CA-014-1 melewati jatuh tempo', impact: true, link: '/temuan/f-ks-014' },
  { id: 'g4', at: agoD(1), actor: BUDI.name, role: 'Site Engineer', projectId: 'aru', ref: 'F-AR-021', kind: 'evidence', title: 'Bukti perbaikan diajukan (CA-021-1)', note: 'Menunggu verifikasi QA/QC.', impact: true, link: '/temuan/f-ar-021' },
  { id: 'g5', at: agoD(1), actor: 'Yusuf Maulana', role: 'Site Manager', projectId: 'jk', ref: 'WIR-JK-2026-0041', kind: 'scheduled', title: 'Jadwal witness disetujui ulang', link: '/inspeksi/wir-jk-0041' },
  { id: 'g6', at: agoD(1), actor: SARI.name, role: 'QA/QC', projectId: 'ks', ref: 'WIR-KS-2026-0091', kind: 'scheduled', title: 'Inspeksi fire fighting terjadwal H+3', link: '/inspeksi/wir-ks-0091' },
  { id: 'g7', at: agoD(2), actor: 'PT Cipta Karya', role: 'Konsultan', projectId: 'jk', ref: 'WIR-JK-2026-0041', kind: 'rescheduled', title: 'Jadwal diubah, konsultan berhalangan', note: 'Waktu asli, alasan, & penanggung jawab tercatat.', impact: true, link: '/inspeksi/wir-jk-0041' },
  { id: 'g8', at: agoD(2), actor: SARI.name, role: 'QA/QC', projectId: 'ks', ref: 'WIR-KS-2026-0088', kind: 'clarification', title: 'Perlu klarifikasi, referensi revisi gambar', note: 'Bukan kegagalan teknis.', impact: true, link: '/inspeksi/wir-ks-0088' },
  { id: 'g9', at: agoD(2), actor: SARI.name, role: 'QA/QC', projectId: 'ks', ref: 'F-KS-012', kind: 'finding', title: 'Temuan potensi inkonformitas dicatat', link: '/temuan/f-ks-012' },
  { id: 'g10', at: agoD(3), actor: 'Andi Prasetyo', role: 'Project Manager', projectId: 'aru', ref: 'F-AR-021', kind: 'action', title: 'Tindakan perbaikan ditugaskan ke subkontraktor', link: '/temuan/f-ar-021' },
  { id: 'g11', at: agoD(4), actor: SARI.name, role: 'QA/QC', projectId: 'aru', ref: 'WIR-AR-2026-0142', kind: 'correction', title: 'Keputusan direkam: Perlu Perbaikan', note: 'Alasan wajib tercatat; riwayat pengajuan dipertahankan.', impact: true, link: '/inspeksi/wir-ar-0142' },
  { id: 'g12', at: agoD(4), actor: SARI.name, role: 'QA/QC', projectId: 'aru', ref: 'F-AR-021', kind: 'finding', title: 'Inkonformitas terkonfirmasi (indikator NCR)', impact: true, link: '/temuan/f-ar-021' },
]

/* ------------------------------------------------------------
 * Selektor & hitungan presentasi
 * ------------------------------------------------------------ */

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id)!
export const projectName = (id: string) => projectById(id)?.name ?? id
export const projectCode = (id: string) => projectById(id)?.code ?? id
export const inspectionById = (id: string) => INSPECTIONS.find((i) => i.id === id)
export const inspectionByRef = (ref: string) => INSPECTIONS.find((i) => i.ref === ref)
export const findingById = (id: string) => FINDINGS.find((f) => f.id === id)
export const controlPointById = (id: string) => CONTROL_POINTS.find((c) => c.id === id)
export const activityById = (id: string) => WORK_PACKAGES.find((w) => w.id === id)

export const inspectionsOfProject = (projectId: string) => INSPECTIONS.filter((i) => i.projectId === projectId)
export const findingsOfProject = (projectId: string) => FINDINGS.filter((f) => f.projectId === projectId)
export const controlPointsOfProject = (projectId: string) => CONTROL_POINTS.filter((c) => c.projectId === projectId)

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
    { tone: 'success', count: g(['accepted']), label: 'Diterima' },
    { tone: 'info', count: g(['submitted', 'scheduled', 'external_review']), label: 'Menunggu/terjadwal' },
    { tone: 'active', count: g(['internal_review', 'in_progress', 'reinspection_requested']), label: 'Berjalan' },
    { tone: 'warning', count: g(['clarification_required', 'correction_required', 'deferred', 'unable_to_inspect']), label: 'Perlu tindakan' },
    { tone: 'neutral', count: g(['draft', 'withdrawn', 'cancelled']), label: 'Lainnya' },
  ]
  return segments.filter((s) => s.count > 0)
}

/* ------------------------------------------------------------
 * Indeks pencarian global (FR-SE-01/02)
 * ------------------------------------------------------------ */

export interface SearchEntry {
  type: 'proyek' | 'inspeksi' | 'temuan' | 'titik kendali'
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
    ...PROJECTS.map<SearchEntry>((p) => ({ type: 'proyek', id: p.id, title: p.name, subtitle: `${p.code} · ${p.client}`, projectId: p.id, statusId: p.status, location: p.location, to: `/proyek/${p.id}` })),
    ...INSPECTIONS.map<SearchEntry>((i) => ({ type: 'inspeksi', id: i.id, title: `${i.ref} · ${i.title}`, subtitle: i.scope, projectId: i.projectId, statusId: i.status, location: i.location, to: `/inspeksi/${i.id}` })),
    ...FINDINGS.map<SearchEntry>((f) => ({ type: 'temuan', id: f.id, title: `${f.ref} · ${f.title}`, subtitle: f.facts.slice(0, 80) + '…', projectId: f.projectId, statusId: f.status, location: f.location, to: `/temuan/${f.id}` })),
    ...CONTROL_POINTS.map<SearchEntry>((c) => ({ type: 'titik kendali', id: c.id, title: `${c.ref} · ${c.title}`, subtitle: `Otoritas: ${c.releaseAuthority}`, projectId: c.projectId, statusId: c.status, location: c.nextActivity ?? '-', to: `/proyek/${c.projectId}?titik=${c.id}` })),
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
