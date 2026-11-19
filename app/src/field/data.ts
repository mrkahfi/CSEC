import type {
  FindingClassificationId,
  FindingStatusId,
  InspectionStatusId,
  PointTypeId,
} from '@/components/status'

/* ============================================================
 * DATA SEED FIELD OPERATIONS APP (PRD Field Ops §16)
 * ------------------------------------------------------------
 * Dunia yang sama dengan Site Operations Dashboard: proyek,
 * orang, dan alur cerita konsisten (PRD §18). Skenario inti
 * mengikuti §21: pembesian balok, pengajuan pre-pour, QC
 * mencatat perbaikan, bukti perbaikan, verifikasi, re-inspeksi.
 *
 * Semua tanggal di-anchor relatif terhadap waktu buka aplikasi.
 * Tidak ada logika bisnis; murni data + turunan presentasi.
 * ============================================================ */

const NOW = Date.now()
const agoH = (h: number) => new Date(NOW - h * 3_600_000).toISOString()
const agoD = (d: number) => new Date(NOW - d * 86_400_000).toISOString()
const aheadH = (h: number) => new Date(NOW + h * 3_600_000).toISOString()

/* ------------------------------------------------------------
 * Persona demo (PRD §16.4) — dua pengalaman peran
 * ------------------------------------------------------------ */

export type PersonaId = 'engineer' | 'qc'

export interface Persona {
  id: PersonaId
  name: string
  role: string
  org: string
  responsibility: string
  projectIds: string[]
}

export const PERSONAS: Record<PersonaId, Persona> = {
  engineer: {
    id: 'engineer',
    name: 'Andi Pratama',
    role: 'Site Engineer / Pelaksana',
    org: 'PT Tri Daya Bangun',
    responsibility: 'Mencatat laporan harian, update progres fisik, mengajukan pemeriksaan, dan menindaklanjuti perbaikan.',
    projectIds: ['naw', 'gml', 'aru', 'jk'],
  },
  qc: {
    id: 'qc',
    name: 'Rina Maharani',
    role: 'Pengawas Kualitas / QC',
    org: 'PT Tri Daya Bangun',
    responsibility: 'Memeriksa pekerjaan lapangan, checklist kualitas, mencatat temuan/punch list, dan memverifikasi perbaikan.',
    projectIds: ['naw', 'rko', 'aru', 'ks'],
  },
}

/* ------------------------------------------------------------
 * Proyek (PRD §16.1 s.d. §16.3)
 * ------------------------------------------------------------ */

export type FProjectStatus = 'active' | 'handover' | 'archived'

export interface FProject {
  id: string
  code: string
  name: string
  client: string
  location: string
  type: string
  status: FProjectStatus
  pm: string
  latestUpdate: string
  latestUpdateAt: string
}

export const normalizeFieldProjectId = (id: string): string => {
  if (id === 'aru') return 'naw'
  if (id === 'ks') return 'rko'
  if (id === 'jk') return 'gml'
  return id
}

export const F_PROJECTS: FProject[] = [
  {
    id: 'naw',
    code: 'NAW',
    name: 'Cluster Nawasena Tahap 2',
    client: 'PT Nawasena Propertindo',
    location: 'Sawangan, Depok',
    type: 'Perumahan 24 Unit (Blok A, B, C)',
    status: 'active',
    pm: 'Rizky Hidayat',
    latestUpdate: 'INSP-NW-2026-0142 verifikasi selimut beton balok Unit A-05',
    latestUpdateAt: agoH(2),
  },
  {
    id: 'rko',
    code: 'RKO',
    name: 'Pembangunan Ruko Grand Harmoni',
    client: 'PT Harmoni Graha Lestari',
    location: 'Serpong, Tangerang Selatan',
    type: 'Ruko komersial 6 unit, 3 lantai',
    status: 'active',
    pm: 'Dedi Kurniawan',
    latestUpdate: 'INSP-RKO-2026-0088 jalur pipa shaft Ruko 03 diajukan klarifikasi',
    latestUpdateAt: agoH(2),
  },
  {
    id: 'gml',
    code: 'GML',
    name: 'Renovasi Gedung Graha Mulia',
    client: 'PT Graha Mulia Sentosa',
    location: 'Jakarta Selatan',
    type: 'Renovasi interior lantai 2 & lobby',
    status: 'active',
    pm: 'Yusuf Maulana',
    latestUpdate: 'Pemeriksaan partisi gypsum Lantai 2 disepakati H+1 14:00',
    latestUpdateAt: agoH(6),
  },
  // Backwards compatibility aliases
  {
    id: 'aru',
    code: 'NAW',
    name: 'Cluster Nawasena Tahap 2',
    client: 'PT Nawasena Propertindo',
    location: 'Sawangan, Depok',
    type: 'Perumahan 24 Unit (Blok A, B, C)',
    status: 'active',
    pm: 'Rizky Hidayat',
    latestUpdate: 'INSP-NW-2026-0142 verifikasi selimut beton balok Unit A-05',
    latestUpdateAt: agoH(2),
  },
  {
    id: 'ks',
    code: 'RKO',
    name: 'Pembangunan Ruko Grand Harmoni',
    client: 'PT Harmoni Graha Lestari',
    location: 'Serpong, Tangerang Selatan',
    type: 'Ruko komersial 6 unit, 3 lantai',
    status: 'active',
    pm: 'Dedi Kurniawan',
    latestUpdate: 'INSP-RKO-2026-0088 jalur pipa shaft Ruko 03 diajukan klarifikasi',
    latestUpdateAt: agoH(2),
  },
  {
    id: 'jk',
    code: 'GML',
    name: 'Renovasi Gedung Graha Mulia',
    client: 'PT Graha Mulia Sentosa',
    location: 'Jakarta Selatan',
    type: 'Renovasi interior lantai 2 & lobby',
    status: 'active',
    pm: 'Yusuf Maulana',
    latestUpdate: 'Pemeriksaan partisi gypsum Lantai 2 disepakati H+1 14:00',
    latestUpdateAt: agoH(6),
  },
]

export const fProject = (id: string) => {
  const norm = normalizeFieldProjectId(id)
  return F_PROJECTS.find((p) => p.id === norm || p.id === id)!
}

/* ------------------------------------------------------------
 * Aktivitas pekerjaan (PRD §7.7)
 * ------------------------------------------------------------ */

export type ActivityStatus = 'belum_mulai' | 'berlangsung' | 'selesai_dilaporkan' | 'tertahan'

export const ACTIVITY_STATUS: Record<ActivityStatus, { label: string; tone: 'neutral' | 'active' | 'success' | 'warning' }> = {
  belum_mulai: { label: 'Belum mulai', tone: 'neutral' },
  berlangsung: { label: 'Berlangsung', tone: 'active' },
  selesai_dilaporkan: { label: 'Selesai dilaporkan', tone: 'success' },
  tertahan: { label: 'Tertahan', tone: 'warning' },
}

export interface ProgressEntry {
  id: string
  at: string
  by: string
  status: ActivityStatus
  qty?: string
  area?: string
  note: string
}

export interface FActivity {
  id: string
  projectId: string
  name: string
  discipline: 'Struktur' | 'MEP' | 'Arsitektur' | 'Finishing' | 'Perkerasan'
  location: string
  subkon: string
  status: ActivityStatus
  /** Progres fisik dilaporkan, bukan dari baseline jadwal. */
  progressPct: number
  unit?: string
  qtyDone?: string
  qtyPlan?: string
  lastUpdate: string
  lastUpdateAt: string
  /** Titik inspeksi berikutnya, bila relevan. */
  nextCheck?: string
  holdNote?: string
  progress: ProgressEntry[]
}

export const F_ACTIVITIES: FActivity[] = [
  {
    id: 'act-ar-1',
    projectId: 'naw',
    name: 'Pembesian balok & pelat Unit A-05',
    discipline: 'Struktur',
    location: 'Blok A — Unit A-05 · Lantai 2',
    subkon: 'CV Mitra Bangun (Mandor Struktur)',
    status: 'berlangsung',
    progressPct: 75,
    unit: 'm³',
    qtyDone: '18',
    qtyPlan: '24',
    lastUpdate: 'Spacer 25 mm diganti, menunggu verifikasi pengawas kualitas',
    lastUpdateAt: agoH(2),
    nextCheck: 'Pengecoran balok & pelat · Izin Cor',
    holdNote: 'Pengecoran menunggu verifikasi hasil perbaikan selimut beton balok B2.',
    progress: [
      { id: 'p1', at: agoH(2), by: 'Andi Pratama', status: 'berlangsung', qty: '4 balok', area: 'Unit A-05 L2', note: 'Spacer beton 25 mm telah dipasang tiap 60 cm; foto diunggah.' },
      { id: 'p2', at: agoD(1), by: 'Andi Pratama', status: 'berlangsung', qty: 'Balok B2', area: 'Unit A-05 L2', note: 'Koreksi jarak spacer atas temuan pengawas.' },
    ],
  },
  {
    id: 'act-ar-2',
    projectId: 'naw',
    name: 'Rangka atap baja ringan Unit B-02',
    discipline: 'Struktur',
    location: 'Blok B — Unit B-02 · Atap',
    subkon: 'CV Baja Mandiri',
    status: 'berlangsung',
    progressPct: 70,
    unit: 'm²',
    qtyDone: '65',
    qtyPlan: '90',
    lastUpdate: 'Kuda-kuda dan reng terpasang, siap dicek pengawas',
    lastUpdateAt: agoH(4),
    nextCheck: 'Pemeriksaan rangka atap · INSP-NW-2026-0151',
    progress: [
      { id: 'p3', at: agoH(4), by: 'Budi Santoso', status: 'berlangsung', qty: 'Kuda-kuda C75', area: 'Unit B-02', note: 'Dynabolt ke ringbalk telah dikencangkan.' },
    ],
  },
  {
    id: 'act-ar-3',
    projectId: 'naw',
    name: 'Pengecoran balok & pelat Unit A-05',
    discipline: 'Struktur',
    location: 'Blok A — Unit A-05 · Lantai 2',
    subkon: 'PT Tri Daya Bangun (Internal)',
    status: 'tertahan',
    progressPct: 0,
    unit: 'm³',
    lastUpdate: 'Menunggu verifikasi selimut beton balok B2',
    lastUpdateAt: agoH(5),
    holdNote: 'Tertahan: izin cor menunggu konfirmasi hasil perbaikan spacer.',
    progress: [
      { id: 'p4', at: agoH(5), by: 'Sistem (simulasi)', status: 'tertahan', note: 'INSP-NW-2026-0142 perbaikan diajukan; pengecoran menunggu verifikasi.' },
    ],
  },
  {
    id: 'act-ar-4',
    projectId: 'naw',
    name: 'Instalasi sanitair & buangan Unit B-12',
    discipline: 'MEP',
    location: 'Blok B — Unit B-12 · Lantai 1',
    subkon: 'CV Tirta Abadi',
    status: 'berlangsung',
    progressPct: 60,
    unit: 'titik',
    qtyDone: '12',
    qtyPlan: '20',
    lastUpdate: 'Pipa buangan air kotor & septic tank terpasang',
    lastUpdateAt: agoD(1),
    nextCheck: 'Uji gelontor pipa buangan',
    progress: [
      { id: 'p5', at: agoD(1), by: 'Andi Pratama', status: 'berlangsung', qty: '6 titik', area: 'Kamar Mandi & Dapur', note: 'Kemiringan pipa PVC 4 inch minimal 2% sudah dicek.' },
    ],
  },
  {
    id: 'act-ks-1',
    projectId: 'rko',
    name: 'Instalasi pipa air bersih Ruko 03',
    discipline: 'MEP',
    location: 'Ruko 03 — Lantai 2 · Shaft Pipa',
    subkon: 'CV Tirta Abadi',
    status: 'berlangsung',
    progressPct: 65,
    unit: 'm',
    qtyDone: '85',
    qtyPlan: '130',
    lastUpdate: 'Penataan ulang pipa air vs tray kabel sedang dikerjakan',
    lastUpdateAt: agoH(3),
    nextCheck: 'Pemeriksaan shaft pipa · INSP-RKO-2026-0088',
    progress: [
      { id: 'p6', at: agoH(3), by: 'Budi Santoso', status: 'berlangsung', qty: 'Pipa PPR 1 inch', area: 'Shaft L2', note: 'Jarak pemisah dengan tray kabel disesuaikan minimal 30 cm.' },
    ],
  },
  {
    id: 'act-ks-2',
    projectId: 'rko',
    name: 'Finishing cat fasad Ruko 02',
    discipline: 'Finishing',
    location: 'Ruko 02 — Lantai 1 · Dinding Depan',
    subkon: 'CV Berkah Finishing',
    status: 'berlangsung',
    progressPct: 80,
    unit: 'm²',
    qtyDone: '40',
    qtyPlan: '50',
    lastUpdate: 'Pengerokan cat menggelembung berjalan; mandor terlambat 1 hari',
    lastUpdateAt: agoD(1),
    progress: [
      { id: 'p7', at: agoD(1), by: 'Budi Santoso', status: 'berlangsung', qty: 'Area 1.5 m²', area: 'Fasad Depan', note: 'Cat dasar dikerok, dinding dianginkan sebelum lapis sealer.' },
    ],
  },
  {
    id: 'act-ks-3',
    projectId: 'rko',
    name: 'Uji tekan pipa air bersih Ruko 03',
    discipline: 'MEP',
    location: 'Ruko 03 — Lantai 2',
    subkon: 'CV Tirta Abadi',
    status: 'belum_mulai',
    progressPct: 0,
    lastUpdate: 'Menunggu penataan pipa selesai',
    lastUpdateAt: agoD(2),
    nextCheck: 'Uji tekan pipa · Witness Point WP-RKO-01',
    progress: [],
  },
  {
    id: 'act-jk-1',
    projectId: 'gml',
    name: 'Rangka partisi gypsum Lantai 2',
    discipline: 'Arsitektur',
    location: 'Lantai 2 · Area Ruang Rapat',
    subkon: 'PT Tri Daya Bangun · Interior',
    status: 'selesai_dilaporkan',
    progressPct: 100,
    unit: 'm²',
    qtyDone: '180',
    qtyPlan: '180',
    lastUpdate: 'Rangka hollow terpasang, jadwal cek lapangan disepakati H+1',
    lastUpdateAt: agoH(6),
    nextCheck: 'Pemeriksaan partisi · INSP-GML-2026-0041',
    progress: [
      { id: 'p8', at: agoH(6), by: 'Yusuf Maulana', status: 'selesai_dilaporkan', qty: '180 m²', area: 'Ruang Rapat L2', note: 'Jarak rangka 60x60 cm telah dicek kelurusannya.' },
    ],
  },
  {
    id: 'act-jk-2',
    projectId: 'gml',
    name: 'Lantai epoxy lobby Lantai 1',
    discipline: 'Finishing',
    location: 'Lantai 1 · Lobby Depan',
    subkon: 'PT Epoxy Prima',
    status: 'berlangsung',
    progressPct: 70,
    unit: 'm²',
    qtyDone: '85',
    qtyPlan: '120',
    lastUpdate: 'Epoxy primer lulus uji daya rekat',
    lastUpdateAt: agoD(1),
    progress: [
      { id: 'p9', at: agoD(1), by: 'Yusuf Maulana', status: 'berlangsung', qty: '85 m²', area: 'Lobby', note: 'Persiapan top coat gloss setelah partisi terpasang.' },
    ],
  },
]

export const fActivity = (id: string) => F_ACTIVITIES.find((a) => a.id === id)!

/* ------------------------------------------------------------
 * Titik inspeksi ITP per disiplin (PRD §8.3)
 * Bukan checklist universal: tiap disiplin punya daftar sendiri.
 * ------------------------------------------------------------ */

export interface ItpPoint {
  id: string
  projectId: string
  itpRef: string
  item: string
  name: string
  type: PointTypeId
  /** Checklist pemeriksaan siap-inspeksi dari dokumen proyek. */
  readiness: string[]
  refs: string[]
}

export const ITP_POINTS: ItpPoint[] = [
  {
    id: 'itp-ar-41',
    projectId: 'naw',
    itpRef: 'Checklist Struktur Beton',
    item: 'Item 4.2',
    name: 'Pemeriksaan pembesian balok & pelat',
    type: 'hold',
    readiness: [
      'Pemasangan tulangan balok & pelat sesuai gambar kerja STR-A05',
      'Diameter, jarak sengkang & jumlah tulangan (D13 & D10)',
      'Cover block dan spacer beton 25 mm terpasang kokoh',
      'Kondisi bekisting bersih dari serpihan dan debu',
      'Pipa sparing listrik dan sanitair terpasang rapi',
    ],
    refs: ['STR-A05 Rev C', 'SPEC-NW-01 Rev 1'],
  },
  {
    id: 'itp-ar-42',
    projectId: 'naw',
    itpRef: 'Checklist Rangka Atap',
    item: 'Item 3.1',
    name: 'Pemeriksaan rangka kuda-kuda baja ringan',
    type: 'witness',
    readiness: [
      'Dimensi profil kanal C & reng sesuai gambar',
      'Jarak kuda-kuda maksimal 1,2 m & kerapatan sekrup',
      'Ikatan dynabolt ke ringbalk terpasang kokoh',
      'Bracing dan ikatan angin terpasang rapi',
    ],
    refs: ['STR-A05 Rev C', 'CHK-ATP-01 Rev 2'],
  },
  {
    id: 'itp-ar-43',
    projectId: 'naw',
    itpRef: 'Checklist Sanitair & Pipa',
    item: 'Item 2.1',
    name: 'Pemeriksaan instalasi pipa air & buangan',
    type: 'review',
    readiness: [
      'Kemiringan pipa pembuangan minimal 2%',
      'Klem pipa & support terpasang kokoh',
      'Pipa buangan air kotor menuju septic tank tersambung',
    ],
    refs: ['SPEC-NW-01 Rev 1'],
  },
  {
    id: 'itp-ks-plb1',
    projectId: 'rko',
    itpRef: 'Checklist MEP Komersial',
    item: 'Item 2.5',
    name: 'Pemeriksaan jalur pipa & kabel shaft Ruko',
    type: 'hold',
    readiness: [
      'Jarak pemisah pipa air dan tray kabel minimal 30 cm',
      'Klem dan penggantung pipa kokoh',
      'Shop drawing sanitair & kabel daya terlampir',
    ],
    refs: ['MEP-RK-03 Rev 2'],
  },
  {
    id: 'itp-ks-plb2',
    projectId: 'rko',
    itpRef: 'Checklist Plumbing Ruko',
    item: 'Item 3.2',
    name: 'Uji tekan pipa air bersih PPR',
    type: 'witness',
    readiness: [
      'Manometer uji terkalibrasi',
      'Tekanan uji 8-10 bar dipertahankan 2 jam',
      'Tidak ada rembesan pada setiap fitting sambungan',
    ],
    refs: ['SPEC-PLB-01 Rev 1'],
  },
  {
    id: 'itp-jk-51',
    projectId: 'gml',
    itpRef: 'Checklist Interior Graha Mulia',
    item: 'Item 3.4',
    name: 'Pemeriksaan rangka partisi gypsum Lantai 2',
    type: 'witness',
    readiness: [
      'Rangka hollow galvalum 40x40 terpasang rata & siku',
      'Jarak rangka maksimal 60x60 cm',
      'Jarak sekrup gypsum terpasang maksimal 20 cm',
    ],
    refs: ['SPEC-GML-ARC §3.4'],
  },
]

/* ------------------------------------------------------------
 * Bukti: foto & dokumen lampiran (PRD §11.1)
 * ------------------------------------------------------------ */

export type EvidenceState = 'ok' | 'pending' | 'failed' | 'unavailable'
export type PhotoCategory = 'progres' | 'inspeksi' | 'temuan' | 'material' | 'alat' | 'kondisi site'

export interface FEvidence {
  id: string
  kind: 'photo' | 'doc' | 'test'
  title: string
  meta: string
  cat?: PhotoCategory
  state?: EvidenceState
  /** Sebelum/sesudah untuk perbandingan perbaikan. */
  phase?: 'before' | 'after'
}

/* ------------------------------------------------------------
 * Inspeksi / permintaan inspeksi (PRD §8, §9)
 * ------------------------------------------------------------ */

export interface ChecklistItem {
  id: string
  label: string
  source?: string
  result?: 'ok' | 'issue' | 'na'
  note?: string
}

export interface ChecklistSection {
  id: string
  title: string
  items: ChecklistItem[]
}

export interface TimelineEvent {
  id: string
  at: string
  actor: string
  role: string
  title: string
  note?: string
  /** Baris kecil tambahan (lingkup, referensi temuan, dsb.) */
  detail?: string
  kind:
  | 'created' | 'submitted' | 'scheduled' | 'accepted' | 'correction'
  | 'clarification' | 'reinspection' | 'unable' | 'withdrawn'
  | 'finding' | 'action' | 'verified' | 'evidence' | 'schedule_change'
}

export interface WirRound {
  n: number
  at: string
  outcome: string
  note?: string
}

export interface FWir {
  id: string
  ref: string
  projectId: string
  activityId: string
  itpPointId: string
  title: string
  discipline?: string
  activityType?: string
  targetScope?: string
  location: string
  portion: string
  status: InspectionStatusId
  submittedAt?: string
  scheduledAt?: string
  decidedAt?: string
  submitter: string
  inspector?: string
  externalParty?: { name: string; role: string; attendance?: 'hadir' | 'tidak_hadir' | 'belum_dikonfirmasi' }
  noticeNote?: string
  missingItems?: string[]
  evidence: FEvidence[]
  checklist: ChecklistSection[]
  timeline: TimelineEvent[]
  rounds?: WirRound[]
  decision?: {
    outcome: string
    statusId: InspectionStatusId
    by: string
    comment: string
    partialNote?: string
  }
  holdNote?: string
  linkedFindingIds?: string[]
  comment?: string
}

const prePourSections = (): ChecklistSection[] => [
  {
    id: 'sec-gambar',
    title: 'Gambar & lokasi kerja',
    items: [
      { id: 'c1', label: 'Lingkup sesuai gambar kerja', source: 'S-301 Rev C' },
      { id: 'c2', label: 'Lokasi & grid dicocokkan denganmarkup lapangan', source: 'S-301 Rev C' },
    ],
  },
  {
    id: 'sec-tulangan',
    title: 'Tulangan',
    items: [
      { id: 'c3', label: 'Ukuran, jarak, dan overlap besi', source: 'S-301 Rev C' },
      { id: 'c4', label: 'Sambungan & posisi lap splicing', source: 'S-301 Rev C' },
      { id: 'c5', label: 'Kait & stirrup terikat rapat', source: 'SPEC-CON-01' },
    ],
  },
  {
    id: 'sec-cover',
    title: 'Cover & penyangga',
    items: [
      { id: 'c6', label: 'Cover block sesuai spesifikasi', source: 'SPEC-CON-01 §5.3' },
      { id: 'c7', label: 'Spacer & kursi tulangan memadai' },
    ],
  },
  {
    id: 'sec-bekisting',
    title: 'Bekisting',
    items: [
      { id: 'c8', label: 'Kondisi bersih, rapat, dan kukuh' },
      { id: 'c9', label: 'Minyak bekisting & bukaan bersih' },
    ],
  },
  {
    id: 'sec-embedded',
    title: 'Embedded item & bukaan',
    items: [
      { id: 'c10', label: 'Sleeve & embedded sesuai drawing', source: 'MEP-12 Rev 2' },
    ],
  },
  {
    id: 'sec-siap',
    title: 'Kebersihan & kesiapan',
    items: [
      { id: 'c11', label: 'Area cor bersih dari sisa material' },
      { id: 'c12', label: 'Akses & alat cor siap' },
    ],
  },
]

const bekistingSections = (): ChecklistSection[] => [
  {
    id: 'sec-tegak',
    title: 'Dimensi & perataan',
    items: [
      { id: 'b1', label: 'Tegak-lurus & perataan kolom', source: 'S-301 Rev C' },
      { id: 'b2', label: 'Dimensi penampang sesuai gambar' },
    ],
  },
  {
    id: 'sec-support',
    title: 'Support & kekakuan',
    items: [
      { id: 'b3', label: 'Penyangga & jepitan memadai' },
      { id: 'b4', label: 'Sambungan rapat, tidak bocor' },
    ],
  },
  {
    id: 'sec-akses',
    title: 'Kebersihan & akses',
    items: [
      { id: 'b5', label: 'Dalam bekisting bersih' },
      { id: 'b6', label: 'Akses cor & vibrator siap' },
    ],
  },
]

const pipaSections = (): ChecklistSection[] => [
  {
    id: 'sec-rute',
    title: 'Rute & pemasangan',
    items: [
      { id: 'pp1', label: 'Rute & ketinggian sesuai drawing', source: 'MEP-12 Rev 2' },
      { id: 'pp2', label: 'Diameter & tipe pipa sesuai approval', source: 'AP-034 Rev 0' },
    ],
  },
  {
    id: 'sec-support-plb',
    title: 'Support & klem',
    items: [
      { id: 'pp3', label: 'Jarak support sesuai spesifikasi', source: 'SPEC-PLB-01' },
      { id: 'pp4', label: 'Klem menggantung beban dengan aman' },
    ],
  },
  {
    id: 'sec-dok',
    title: 'Dokumen pendukung',
    items: [
      { id: 'pp5', label: 'Hasil pressure test terlampir' },
      { id: 'pp6', label: 'Surat jalan material terlampir' },
    ],
  },
]

const subgradeSections = (): ChecklistSection[] => [
  {
    id: 'sec-uji',
    title: 'Pengujian',
    items: [
      { id: 'sg1', label: 'CBR lapangan memenuhi target', source: 'Typ. XSEC-01 Rev 3' },
      { id: 'sg2', label: 'Kepadatan in-situ (sand cone)', source: 'ITP-JK-RW Rev 2' },
    ],
  },
  {
    id: 'sec-geom',
    title: 'Geometri',
    items: [
      { id: 'sg3', label: 'Perataan memanjang & melintang' },
      { id: 'sg4', label: 'Batas STA sesuai pengajuan' },
    ],
  },
]

export const F_WIRS: FWir[] = [
  {
    id: 'wir-024',
    ref: 'INSP-NW-2026-0142',
    projectId: 'naw',
    activityId: 'act-ar-1',
    itpPointId: 'itp-ar-41',
    discipline: 'Struktur Beton',
    activityType: 'Pembesian Balok & Pelat',
    targetScope: 'Unit A-05 · Lantai 2',
    title: '[Unit A-05] Pembesian Balok & Pelat L2',
    location: 'Blok A — Unit A-05 · Lantai 2',
    portion: 'Balok B1-B2 & pelat L2 Unit A-05',
    status: 'reinspection_requested',
    submittedAt: agoD(1),
    decidedAt: agoH(5),
    submitter: 'Andi Pratama',
    inspector: 'Rina Maharani',
    externalParty: { name: 'Hendra Kusuma', role: 'Konsultan Pengawas', attendance: 'hadir' },
    evidence: [
      { id: 'e1', kind: 'photo', title: 'Foto perbaikan spacer beton 25 mm', meta: '8 foto pasca perbaikan · Budi Santoso', cat: 'inspeksi', phase: 'after' },
      { id: 'e2', kind: 'photo', title: 'Cover tulangan awal balok B2 (20 mm)', meta: 'Sebelum perbaikan', cat: 'temuan', phase: 'before' },
      { id: 'e3', kind: 'doc', title: 'STR-A05 Rev C', meta: 'Gambar detail tulangan balok & pelat' },
    ],
    checklist: (() => {
      const s = prePourSections()
      s[2].items[0].result = 'issue'
      s[2].items[0].note = 'Cover tulangan balok B2 terukur 20 mm; spacer beton 25 mm sudah dipasang ulang.'
      return s
    })(),
    rounds: [
      { n: 1, at: agoD(4), outcome: 'Perlu Perbaikan', note: 'Cover selimut beton balok B2 terukur 20 mm; ganti spacer 25 mm.' },
      { n: 2, at: agoH(2), outcome: 'Verifikasi Perbaikan', note: 'Spacer 25 mm telah dipasang & diverifikasi pengawas lapangan.' },
    ],
    timeline: [
      { id: 't1', at: agoD(6), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Pengajuan pemeriksaan diajukan', kind: 'submitted', detail: 'Lingkup: balok B1-B2 & pelat Unit A-05 Lantai 2' },
      { id: 't2', at: agoD(4), actor: 'Rina Maharani', role: 'Pengawas Kualitas', title: 'Hasil: Perlu Perbaikan', kind: 'correction', note: 'Cover balok B2 terukur 20 mm (spesifikasi 25 mm). Pasang spacer beton kur standar.', detail: 'Temuan F-NW-021 tercatat dari pemeriksaan ini.' },
      { id: 't3', at: agoD(1), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Bukti perbaikan diajukan', kind: 'evidence', note: 'Spacer 25 mm dipasang tiap 60 cm; 8 foto dilampirkan.' },
      { id: 't4', at: agoH(2), actor: 'Rina Maharani', role: 'Pengawas Kualitas', title: 'Pemeriksaan ulang di lokasi', kind: 'reinspection', note: 'Pengecekan fisik di lokasi Unit A-05.' },
    ],
    linkedFindingIds: ['fnd-008'],
  },
  {
    id: 'wir-025',
    ref: 'INSP-NW-2026-0151',
    projectId: 'naw',
    activityId: 'act-ar-2',
    itpPointId: 'itp-ar-42',
    discipline: 'Struktur Atap',
    activityType: 'Rangka Kuda-kuda Baja Ringan',
    targetScope: 'Unit B-02 · Atap',
    title: '[Unit B-02] Rangka Kuda-kuda Baja Ringan',
    location: 'Blok B — Unit B-02 · Atap',
    portion: 'Kuda-kuda C75, reng & dynabolt',
    status: 'submitted',
    submittedAt: agoH(8),
    scheduledAt: aheadH(2),
    submitter: 'Andi Pratama',
    inspector: 'Rina Maharani',
    externalParty: { name: 'Hendra Kusuma', role: 'Konsultan Pengawas', attendance: 'belum_dikonfirmasi' },
    noticeNote: 'Pemberitahuan diajukan sesuai checklist operasional.',
    evidence: [
      { id: 'e4', kind: 'photo', title: 'Kuda-kuda baja ringan terpasang', meta: 'Terpasang rapi, menunggu cek', cat: 'inspeksi' },
      { id: 'e5', kind: 'doc', title: 'STR-A05 Rev C', meta: 'Gambar detail struktur atap' },
    ],
    checklist: bekistingSections(),
    timeline: [
      { id: 't4', at: agoH(8), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Pengajuan pemeriksaan diajukan', kind: 'submitted' },
      { id: 't5', at: agoH(3), actor: 'Rina Maharani', role: 'Pengawas Kualitas', title: 'Jadwal dikonfirmasi: hari ini 13:00', kind: 'scheduled' },
    ],
  },
  {
    id: 'wir-026',
    ref: 'INSP-NW-2026-0147',
    projectId: 'naw',
    activityId: 'act-ar-4',
    itpPointId: 'itp-ar-43',
    discipline: 'Finishing Lantai',
    activityType: 'Pemasangan Granit Tile 40x40',
    targetScope: 'Unit A-01 · Ruang Tamu',
    title: '[Unit A-01] Pemasangan Granit Tile 40x40',
    location: 'Blok A — Unit A-01 · Ruang Tamu',
    portion: 'Granit tile 40x40 ruang tamu',
    status: 'draft',
    submitter: 'Andi Pratama',
    evidence: [],
    checklist: [
      {
        id: 'sec-krm',
        title: 'Keramik & finishing',
        items: [
          { id: 'km1', label: 'Kerataan nat & kelurusan pemasangan keramik' },
          { id: 'km2', label: 'Bebas kopong saat diketuk' },
        ],
      },
    ],
    timeline: [
      { id: 't6', at: agoH(20), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Draf pengajuan dibuat', kind: 'created' },
    ],
  },
  {
    id: 'wir-012',
    ref: 'INSP-RKO-2026-0088',
    projectId: 'rko',
    activityId: 'act-ks-1',
    itpPointId: 'itp-ks-plb1',
    discipline: 'Pekerjaan MEP',
    activityType: 'Pipa Sanitair & Kabel Daya',
    targetScope: 'Ruko 03 · Shaft Lantai 2',
    title: '[Ruko 03] Pipa Sanitair & Tray Kabel L2',
    location: 'Ruko 03 — Lantai 2 · Toilet & Shaft',
    portion: 'Toilet & shaft pipa Lantai 2',
    status: 'clarification_required',
    submittedAt: agoH(2),
    submitter: 'Budi Santoso',
    inspector: 'Rina Maharani',
    missingItems: ['Foto jarak pemisah tray kabel vs pipa air bersih belum jelas'],
    evidence: [
      { id: 'e6', kind: 'photo', title: 'Rute pipa shaft Ruko 03', meta: 'Sebelum dinding shaft ditutup', cat: 'inspeksi' },
      { id: 'e7', kind: 'photo', title: 'Support & klem pipa PPR', meta: 'Jarak 1,2 m', cat: 'inspeksi' },
      { id: 'e8', kind: 'doc', title: 'MEP-RK-03 Rev 2', meta: 'Shop drawing sanitair Ruko' },
    ],
    checklist: pipaSections(),
    timeline: [
      { id: 't7', at: agoH(2), actor: 'Budi Santoso', role: 'Site Supervisor', title: 'Pengajuan pemeriksaan diajukan', kind: 'submitted', detail: 'Perlu konfirmasi pemisahan tray kabel vs pipa air di shaft.' },
    ],
  },
  {
    id: 'wir-018',
    ref: 'INSP-GML-2026-0041',
    projectId: 'gml',
    activityId: 'act-jk-1',
    itpPointId: 'itp-jk-51',
    discipline: 'Interior & Plafon',
    activityType: 'Rangka Hollow & Gypsum 9 mm',
    targetScope: 'Lantai 2 · Ruang Rapat',
    title: '[Lantai 2] Partisi Gypsum & Plafon',
    location: 'Lantai 2 · Area Ruang Rapat',
    portion: '180 m² rangka hollow galvalum',
    status: 'scheduled',
    submittedAt: agoD(2),
    scheduledAt: aheadH(20),
    submitter: 'Yusuf Maulana',
    inspector: 'Dimas Saputra',
    evidence: [
      { id: 'e10', kind: 'photo', title: 'Rangka hollow partisi ruang rapat', meta: 'Kondisi terpasang', cat: 'inspeksi' },
      { id: 'e11', kind: 'doc', title: 'SPEC-GML-ARC §3.4', meta: 'Spesifikasi teknis interior' },
    ],
    checklist: subgradeSections(),
    rounds: [
      { n: 1, at: agoD(2), outcome: 'Terjadwal', note: 'Jadwal pemeriksaan disepakati H+1 14:00.' },
    ],
    timeline: [
      { id: 't8', at: agoD(3), actor: 'Yusuf Maulana', role: 'Site Manager', title: 'Pengajuan pemeriksaan diajukan', kind: 'submitted' },
      { id: 't9', at: agoD(1), actor: 'Dimas Saputra', role: 'Pengawas Kualitas', title: 'Jadwal dikonfirmasi', kind: 'scheduled' },
    ],
  },
  {
    id: 'wir-021',
    ref: 'INSP-NW-2026-0131',
    projectId: 'naw',
    activityId: 'act-ar-1',
    itpPointId: 'itp-ar-41',
    discipline: 'Struktur Pondasi',
    activityType: 'Pondasi Batu Kali & Sloof',
    targetScope: 'Unit C-03 · Sloof Dasar',
    title: '[Unit C-03] Pondasi Batu Kali & Sloof',
    location: 'Blok C — Unit C-03',
    portion: 'Sloof 15/20 cm, besi 4D12',
    status: 'accepted',
    submittedAt: agoD(11),
    decidedAt: agoD(9),
    submitter: 'Andi Pratama',
    inspector: 'Rina Maharani',
    evidence: [
      { id: 'e13', kind: 'photo', title: 'Sloof pondasi Unit C-03 sebelum cor', meta: 'Sesuai spesifikasi', cat: 'inspeksi' },
    ],
    checklist: prePourSections(),
    decision: {
      outcome: 'Sesuai',
      statusId: 'accepted',
      by: 'Rina Maharani',
      comment: 'Sesuai gambar kerja & acuan checklist sloof pondasi.',
    },
    holdNote: 'Izin cor diberikan.',
    timeline: [
      { id: 't11', at: agoD(11), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Pengajuan pemeriksaan diajukan', kind: 'submitted' },
      { id: 't12', at: agoD(9), actor: 'Rina Maharani', role: 'Pengawas Kualitas', title: 'Hasil: Sesuai', kind: 'accepted', note: 'Dimensi & tulangan sesuai gambar.' },
    ],
  },
  {
    id: 'wir-023',
    ref: 'INSP-NW-2026-0119',
    projectId: 'naw',
    activityId: 'act-ar-4',
    itpPointId: 'itp-ar-43',
    title: 'Instalasi pipa distribusi Blok B',
    location: 'Blok B — Saluran Distribusi',
    portion: 'Pipa air bersih PVC AW DN25',
    status: 'withdrawn',
    submittedAt: agoD(9),
    decidedAt: agoD(8),
    submitter: 'Andi Pratama',
    evidence: [],
    checklist: pipaSections(),
    timeline: [
      { id: 't13', at: agoD(9), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Pengajuan diajukan', kind: 'submitted' },
      { id: 't14', at: agoD(8), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Ditarik pengirim', kind: 'withdrawn', note: 'Digabungkan dengan pengajuan terpadu Blok B.' },
    ],
  },
]

/* ------------------------------------------------------------
 * Temuan & tindak lanjut (PRD §10)
 * ------------------------------------------------------------ */

export interface MeasurementBenchmark {
  actual: string
  standard: string
  tolerance: string
  deviation: string
  referenceDoc: string
  secondaryPoints?: string
}

export interface RootCauseIndication {
  category: string
  component: string
  trigger: string
}

export interface StructuredActionPlan {
  actionType: string
  component: string
  targetLocation: string
  requirePhotoEvidence: boolean
  standardSpec?: string
}

export interface FFinding {
  id: string
  ref: string
  projectId: string
  activityId: string
  sourceWirId?: string
  trade?: string
  element?: string
  defectType?: string
  title: string
  desc: string
  benchmark?: MeasurementBenchmark
  rootCause?: RootCauseIndication
  actionPlan?: StructuredActionPlan
  classification: FindingClassificationId
  /** Referensi NCR formal, bila prosedur proyek menerbitkannya. */
  ncrRef?: string
  location: string
  responsible: string
  dueAt: string
  status: FindingStatusId
  evidence: FEvidence[]
  response?: {
    desc: string
    at: string
    by: string
    evidence: FEvidence[]
    actionPlan?: StructuredActionPlan
    evidenceCount?: number
  }
  verification?: {
    at: string
    by: string
    outcome: 'verified' | 'rejected' | 'clarification'
    note?: string
  }[]
  timeline: TimelineEvent[]
}

export const F_FINDINGS: FFinding[] = [
  {
    id: 'fnd-008',
    ref: 'F-NW-021',
    projectId: 'naw',
    activityId: 'act-ar-1',
    sourceWirId: 'wir-024',
    trade: 'Struktur Beton',
    element: 'Balok B2 (Unit A-05)',
    defectType: 'Tebal Selimut Kurang (20 mm)',
    title: '[Balok B2] Tebal Selimut Kurang (<25 mm)',
    desc: 'Pengukuran lapangan pada balok B2 Unit A-05 menunjukkan selimut beton 20 mm; spesifikasi menetapkan 25 mm. Spacer beton 25 mm telah dipasang ulang.',
    benchmark: {
      actual: '20 mm',
      standard: '25 mm',
      tolerance: '0 mm',
      deviation: '-5 mm',
      referenceDoc: 'SPEC-NW-01 §5.3',
      secondaryPoints: 'Balok B1 sesuai (26 mm)',
    },
    rootCause: {
      category: 'Pemasangan',
      component: 'Spacer Beton Balok B2',
      trigger: 'Spacer lepas saat perakitan tulangan oleh tukang besi',
    },
    actionPlan: {
      actionType: 'Ganti dan pasang ulang',
      component: 'Spacer beton 25 mm',
      targetLocation: 'Balok B2 sisi timur Unit A-05 (interval 60 cm)',
      requirePhotoEvidence: true,
      standardSpec: 'SPEC-NW-01 §5.3',
    },
    classification: 'potential_nc',
    location: 'Blok A — Unit A-05 · Lantai 2 · Balok B2',
    responsible: 'CV Mitra Bangun (Mandor Struktur)',
    dueAt: aheadH(46),
    status: 'verification_pending',
    ncrRef: undefined,
    evidence: [
      { id: 'fe1', kind: 'photo', title: 'Cover tulangan awal balok B2 (20 mm)', meta: 'Foto temuan pengawas', cat: 'temuan', phase: 'before' },
      { id: 'fe2', kind: 'photo', title: 'Penanda balok B2', meta: 'Tanda kapur lokasi di balok', cat: 'temuan', phase: 'before' },
    ],
    response: {
      desc: 'Spacer beton 25 mm kur sudah dipasang tiap jarak 60 cm pada balok B2 sisi timur Unit A-05. 8 foto pasca-perbaikan terlampir.',
      at: agoD(1),
      by: 'Andi Pratama',
      actionPlan: {
        actionType: 'Ganti dan pasang ulang',
        component: 'Spacer beton 25 mm (interval 60 cm)',
        targetLocation: 'Balok B2 sisi timur Unit A-05',
        requirePhotoEvidence: true,
        standardSpec: 'SPEC-NW-01 §5.3',
      },
      evidenceCount: 8,
      evidence: [
        { id: 'fe1b', kind: 'photo', title: 'Spacer beton 25 mm terpasang', meta: 'Setelah perbaikan', cat: 'inspeksi', phase: 'after' },
      ],
    },
    timeline: [
      { id: 'f1', at: agoD(4), actor: 'Rina Maharani', role: 'Pengawas Kualitas', title: 'Catatan pekerjaan dicatat dari INSP-NW-2026-0142', kind: 'finding', note: 'Ditugaskan ke mandor struktur CV Mitra Bangun.' },
      { id: 'f1b', at: agoD(1), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Bukti perbaikan diajukan', kind: 'action', note: '8 foto terlampir; menunggu verifikasi pengawas.' },
    ],
  },
  {
    id: 'fnd-004',
    ref: 'F-RKO-012',
    projectId: 'rko',
    activityId: 'act-ks-1',
    sourceWirId: 'wir-012',
    trade: 'Instalasi MEP',
    element: 'Shaft Pipa L2 (Ruko 03)',
    defectType: 'Jarak Pipa vs Kabel < 30 cm',
    title: '[Shaft Pipa] Jarak Pipa vs Kabel < 30 cm',
    desc: 'Jarak jalur pipa air PPR dan kabel daya shaft Ruko 03 kurang dari 10 cm; jarak aman minimal 30 cm.',
    benchmark: {
      actual: '8 cm',
      standard: '30 cm',
      tolerance: 'Min 25 cm',
      deviation: '-22 cm',
      referenceDoc: 'SPEC-MEP-03 §2.1',
    },
    rootCause: {
      category: 'Koordinasi MEP',
      component: 'Shaft Pipa Ruko 03',
      trigger: 'Penarikan pipa air mendahului instalasi tray kabel listrik',
    },
    actionPlan: {
      actionType: 'Penataan ulang jarak',
      component: 'Pipa PPR & Tray Kabel',
      targetLocation: 'Shaft Pipa Lantai 2 Ruko 03',
      requirePhotoEvidence: true,
      standardSpec: 'SPEC-MEP-03 §2.1',
    },
    classification: 'potential_nc',
    location: 'Ruko 03 — Lantai 2 · Shaft Pipa',
    responsible: 'PT Tri Daya Bangun · MEP',
    dueAt: aheadH(72),
    status: 'assigned',
    evidence: [
      { id: 'fe3', kind: 'photo', title: 'Jarak pipa vs kabel di shaft', meta: 'Sebelum perbaikan', cat: 'temuan', phase: 'before' },
    ],
    timeline: [
      { id: 'f2', at: agoD(2), actor: 'Rina Maharani', role: 'Pengawas Kualitas', title: 'Temuan dicatat dari inspeksi shaft', kind: 'finding' },
      { id: 'f3', at: agoD(1), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Ditugaskan penataan ulang ke mandor MEP', kind: 'action' },
    ],
  },
  {
    id: 'fnd-002',
    ref: 'F-RKO-014',
    projectId: 'rko',
    activityId: 'act-ks-2',
    trade: 'Finishing Fasad',
    element: 'Dinding Fasad Ruko 02',
    defectType: 'Cat Weatherproof Melepuh (1,5 m²)',
    title: '[Fasad Ruko 02] Cat Menggelembung (1,5 m²)',
    desc: 'Cat weatherproof dinding luar Ruko 02 menggelembung seluas ±1,5 m² akibat kelembapan saat pengecatan dasar.',
    benchmark: {
      actual: '1.5 m² menggelembung',
      standard: '0 m² (Mulus merata)',
      tolerance: '0 toleransi',
      deviation: 'Area cat melepuh',
      referenceDoc: 'SPEC-FIN-08 §4.2',
    },
    rootCause: {
      category: 'Kelembapan Dinding',
      component: 'Dinding Fasad Ruko 02',
      trigger: 'Pengecatan dasar diaplikasikan sebelum kadar air dinding < 15%',
    },
    actionPlan: {
      actionType: 'Kerok dan cat ulang',
      component: 'Cat Weatherproof Eksterior',
      targetLocation: 'Dinding Luar Lantai 1 Ruko 02',
      requirePhotoEvidence: true,
      standardSpec: 'SPEC-FIN-08 §4.2',
    },
    classification: 'confirmed_nc',
    ncrRef: 'NCR-RKO-014',
    location: 'Ruko 02 — Lantai 1 · Dinding Depan',
    responsible: 'CV Berkah Finishing (Mandor Cat)',
    dueAt: agoD(1),
    status: 'action_in_progress',
    evidence: [
      { id: 'fe5', kind: 'photo', title: 'Cat menggelembung di fasad Ruko 02', meta: 'Sebelum perbaikan', cat: 'temuan', phase: 'before' },
    ],
    timeline: [
      { id: 'f4', at: agoD(6), actor: 'Rizky Hidayat', role: 'Site Manager', title: 'Temuan dicatat, perlu perbaikan sebelum serah terima', kind: 'finding' },
      { id: 'f5', at: agoH(20), actor: 'Sistem (simulasi)', role: 'Eskalasi demo', title: 'Tindakan melewati jatuh tempo (Overdue 1 hari)', kind: 'action' },
    ],
  },
]

/* ------------------------------------------------------------
 * Laporan harian (PRD §7.10 s.d. §7.11)
 * ------------------------------------------------------------ */

export interface ManpowerRow {
  id: string
  company: string
  trade: string
  count?: number
  area: string
}

export interface WorkPerformedRow {
  id: string
  activityId: string
  name: string
  location: string
  qty?: string
  status: 'berlangsung' | 'selesai' | 'sebagian' | 'berhenti'
  subkon: string
  note?: string
}

export interface EquipmentRow {
  id: string
  name: string
  assetId: string
  location: string
  status: 'operasi' | 'idle' | 'perawatan' | 'rusak' | 'tidak_di_site'
  hours?: string
  issue?: string
}

export interface DeliveryRow {
  id: string
  supplier: string
  suratJalan: string
  material: string
  expected: string
  received: string
  time: string
  condition: 'diterima' | 'kurang' | 'rusak' | 'salah_item' | 'menunggu_cek'
  location: string
  note?: string
}

export interface DelayRow {
  id: string
  category: 'cuaca' | 'material' | 'alat' | 'tenaga kerja' | 'akses' | 'desain/RFI' | 'inspeksi' | 'koordinasi'
  affected: string
  time: string
  desc: string
  duration?: string
  impact?: string
}

export interface VisitorRow {
  id: string
  name: string
  org: string
  purpose: string
  time: string
  area: string
}

export interface FReport {
  id: string
  dateLabel: string
  ref: string
  projectId: string
  author: string
  status: 'draft' | 'submitted' | 'returned'
  isToday?: boolean
  lateNote?: string
  sections: {
    shift: string
    weather: { time: string; condition: string }[]
    siteCondition: string
    impact?: string
    manpower: ManpowerRow[]
    work: WorkPerformedRow[]
    equipment: EquipmentRow[]
    deliveries: DeliveryRow[]
    delays: DelayRow[]
    visitors: VisitorRow[]
    toolbox: 'ya' | 'tidak' | 'belum_dicatat'
    safetyNote?: string
    nextPlan: string
  }
  reviewComment?: string
  submittedAt?: string
}

export const F_REPORTS: FReport[] = [
  {
    id: 'rpt-1030',
    dateLabel: '30 Okt 2026',
    ref: 'LHR-NAW-1030',
    projectId: 'naw',
    author: 'Andi Pratama',
    status: 'submitted',
    submittedAt: agoH(16),
    sections: {
      shift: 'Pagi · 07:30 s.d. 17:00',
      weather: [
        { time: '08:00', condition: 'Cerah' },
        { time: '15:30', condition: 'Hujan deras' },
      ],
      siteCondition: 'Kering pagi s.d. siang; basah sore hari',
      impact: 'Pekerjaan luar sloof Unit C-04 dialihkan ke perakitan besi dalam gudang',
      manpower: [
        { id: 'm1', company: 'PT Tri Daya Bangun', trade: 'Pelaksana & Site Engineer', count: 3, area: 'Blok A & B' },
        { id: 'm2', company: 'CV Mitra Bangun', trade: 'Tukang Besi & Struktur', count: 8, area: 'Unit A-05 & A-07' },
        { id: 'm3', company: 'CV Baja Mandiri', trade: 'Tukang Rangka Atap', count: 5, area: 'Unit B-02' },
        { id: 'm4', company: 'CV Tirta Abadi', trade: 'Tukang Plumbing / MEP', count: 4, area: 'Unit B-12' },
      ],
      work: [
        { id: 'w1', activityId: 'act-ar-1', name: 'Pembesian balok & pelat Unit A-05', location: 'Blok A — Unit A-05 L2', qty: 'Balok B2', status: 'berlangsung', subkon: 'CV Mitra Bangun', note: 'Pemasangan spacer 25 mm selesai' },
        { id: 'w2', activityId: 'act-ar-2', name: 'Rangka atap baja ringan Unit B-02', location: 'Blok B — Unit B-02', qty: '65 m²', status: 'berlangsung', subkon: 'CV Baja Mandiri', note: 'Siap diperiksa pengawas' },
        { id: 'w3', activityId: 'act-ar-4', name: 'Instalasi pipa sanitair Unit B-12', location: 'Blok B — Unit B-12', qty: '6 titik', status: 'berlangsung', subkon: 'CV Tirta Abadi' },
      ],
      equipment: [
        { id: 'eq1', name: 'Pick up operasional site', assetId: 'PU-01', location: 'Area Depan', status: 'operasi', hours: '6 jam' },
        { id: 'eq2', name: 'Molen mini / mixer', assetId: 'MX-01', location: 'Blok C', status: 'idle', issue: 'Menunggu siap cor sloof Unit C-04' },
        { id: 'eq3', name: 'Bar bender & cutter listrik', assetId: 'BB-02', location: 'Bengkel Besi', status: 'operasi', hours: '7 jam' },
      ],
      deliveries: [
        { id: 'd1', supplier: 'PT Semen Nusantara', suratJalan: 'SJ-7712', material: 'Semen Portland 50 kg', expected: '80 sak', received: '80 sak', time: '10:00', condition: 'diterima', location: 'Gudang Blok A', note: 'Kondisi kering rapi' },
        { id: 'd2', supplier: 'Toko Besi Maju', suratJalan: 'SJ-3304', material: 'Besi beton D13 & D10 SNI', expected: '120 btg', received: '120 btg', time: '11:30', condition: 'diterima', location: 'Yard Blok B' },
      ],
      delays: [
        { id: 'dl1', category: 'cuaca', affected: 'Unit C-04 (Galian & Cor Sloof)', time: '15:30 s.d. 17:00', duration: '1,5 Jam', impact: 'Pengecoran sloof ditunda ke esok pagi', desc: 'Hujan deras, pekerjaan galian basah.' },
      ],
      visitors: [
        { id: 'v1', name: 'Rizky Hidayat', org: 'PT Tri Daya Bangun', purpose: 'Inspeksi berkala progres mingguan', time: '14:00', area: 'Blok A & B' },
      ],
      toolbox: 'ya',
      safetyNote: 'Briefing K3 pagi: penggunaan helm, rompi, dan sepatu safety area struktur.',
      nextPlan: 'Verifikasi hasil perbaikan selimut beton Unit A-05; persiapan cor balok B2; periksa atap Unit B-02.',
    },
  },
  {
    id: 'rpt-1028',
    dateLabel: '28 Okt 2026',
    ref: 'LHR-NAW-1028',
    projectId: 'naw',
    author: 'Andi Pratama',
    status: 'returned',
    reviewComment: 'Jumlah tukang plesteran subkon tidak sesuai absensi harian. Mohon bagian tenaga kerja diperbarui.',
    sections: {
      shift: 'Pagi · 07:30 s.d. 17:00',
      weather: [{ time: '08:00', condition: 'Cerah' }],
      siteCondition: 'Kering',
      manpower: [
        { id: 'm5', company: 'PT Tri Daya Bangun', trade: 'Pelaksana & Site Engineer', count: 3, area: 'Seluruh area' },
        { id: 'm6', company: 'CV Mitra Bangun', trade: 'Tukang Besi', count: 6, area: 'Unit A-05' },
      ],
      work: [
        { id: 'w4', activityId: 'act-ar-1', name: 'Pembesian balok B2 Unit A-05', location: 'Blok A — Unit A-05', qty: '2 balok', status: 'berlangsung', subkon: 'CV Mitra Bangun' },
      ],
      equipment: [{ id: 'eq4', name: 'Pick up operasional', assetId: 'PU-01', location: 'Area Depan', status: 'operasi', hours: '5 jam' }],
      deliveries: [],
      delays: [],
      visitors: [],
      toolbox: 'ya',
      nextPlan: 'Lanjut pembesian balok & pelat Unit A-05.',
    },
  },
  {
    id: 'rpt-1027',
    dateLabel: '27 Okt 2026',
    ref: 'LHR-NAW-1027',
    projectId: 'naw',
    author: 'Andi Pratama',
    status: 'submitted',
    lateNote: 'Diisi 29 Okt (entri susulan)',
    submittedAt: agoD(2),
    sections: {
      shift: 'Pagi · 07:30 s.d. 17:00',
      weather: [{ time: '08:00', condition: 'Cerah' }],
      siteCondition: 'Kering',
      manpower: [{ id: 'm7', company: 'PT Tri Daya Bangun', trade: 'Pelaksana', count: 2, area: 'Seluruh area' }],
      work: [{ id: 'w5', activityId: 'act-ar-1', name: 'Perakitan tulangan sloof Unit C-03', location: 'Blok C — Unit C-03', qty: '1 unit', status: 'selesai', subkon: 'CV Mitra Bangun' }],
      equipment: [],
      deliveries: [],
      delays: [],
      visitors: [],
      toolbox: 'ya',
      nextPlan: 'Pengajuan pemeriksaan sloof Unit C-03.',
    },
  },
]

/* ------------------------------------------------------------
 * Dokumen & gambar proyek (PRD §11.2)
 * ------------------------------------------------------------ */

export type DocCategory = 'Gambar' | 'ITP & Checklist' | 'Spesifikasi' | 'Method Statement' | 'Persetujuan Material' | 'Laporan Uji'

export interface FDoc {
  id: string
  projectId: string
  number: string
  title: string
  category: DocCategory
  rev: string
  status: 'current' | 'superseded'
  issued: string
  discipline?: string
  /** Referensi revisi terbaru bila dokumen ini sudah kadaluarsa. */
  latestRev?: string
  relatedWirRef?: string
}

export const F_DOCS: FDoc[] = [
  { id: 'doc-1', projectId: 'naw', number: 'STR-A05', title: 'Detail Pembesian Balok & Pelat Unit A-05', category: 'Gambar', rev: 'C', status: 'current', issued: agoD(24), discipline: 'Struktur', relatedWirRef: 'INSP-NW-2026-0142' },
  { id: 'doc-2', projectId: 'naw', number: 'STR-A05', title: 'Detail Pembesian Balok & Pelat Unit A-05', category: 'Gambar', rev: 'B', status: 'superseded', issued: agoD(120), latestRev: 'C', discipline: 'Struktur' },
  { id: 'doc-3', projectId: 'naw', number: 'CHK-STR-01', title: 'Checklist Acuan Pemeriksaan Struktur Beton', category: 'ITP & Checklist', rev: '2', status: 'current', issued: agoD(90), discipline: 'Struktur' },
  { id: 'doc-4', projectId: 'naw', number: 'SPEC-NW-01', title: 'Spesifikasi Teknis Pekerjaan Bangunan Nawasena', category: 'Spesifikasi', rev: '1', status: 'current', issued: agoD(300), discipline: 'Struktur' },
  { id: 'doc-5', projectId: 'naw', number: 'CHK-ATP-01', title: 'Checklist Acuan Rangka Atap Baja Ringan', category: 'ITP & Checklist', rev: '2', status: 'current', issued: agoD(60), discipline: 'Struktur' },
  { id: 'doc-6', projectId: 'rko', number: 'MEP-RK-03', title: 'Shop Drawing Jalur Pipa Sanitair & Listrik Ruko', category: 'Gambar', rev: '2', status: 'current', issued: agoD(9), discipline: 'MEP', relatedWirRef: 'INSP-RKO-2026-0088' },
  { id: 'doc-7', projectId: 'rko', number: 'CHK-MEP-01', title: 'Checklist Acuan Pemeriksaan Plumbing & Sanitair', category: 'ITP & Checklist', rev: '1', status: 'current', issued: agoD(60), discipline: 'MEP' },
  { id: 'doc-8', projectId: 'rko', number: 'SPEC-RKO-FIN', title: 'Spesifikasi Material Pengecatan & Finishing Ruko', category: 'Spesifikasi', rev: '1', status: 'current', issued: agoD(45), discipline: 'Finishing' },
  { id: 'doc-9', projectId: 'gml', number: 'SPEC-GML-ARC', title: 'Spesifikasi Teknis Partisi Gypsum & Plafon Akustik', category: 'Spesifikasi', rev: '1', status: 'current', issued: agoD(80), discipline: 'Arsitektur', relatedWirRef: 'INSP-GML-2026-0041' },
]

/* ------------------------------------------------------------
 * Galeri bukti lintas catatan (PRD §11.1)
 * ------------------------------------------------------------ */

export interface FPhoto {
  id: string
  projectId: string
  title: string
  cat: PhotoCategory
  location: string
  at: string
  state: EvidenceState
  phase?: 'before' | 'after'
  link?: { label: string; to: string }
  gradient: string
}

export const F_PHOTOS: FPhoto[] = [
  { id: 'ph-1', projectId: 'naw', title: 'Pemasangan spacer beton 25 mm balok B2', cat: 'progres', location: 'Blok A — Unit A-05 L2', at: agoH(3), state: 'ok', link: { label: 'INSP-NW-2026-0142', to: '/field/inspeksi/wir-024' }, gradient: 'from-sky-100 to-brand-50' },
  { id: 'ph-2', projectId: 'naw', title: 'Kuda-kuda baja ringan Unit B-02', cat: 'inspeksi', location: 'Blok B — Unit B-02 Atap', at: agoH(8), state: 'ok', link: { label: 'INSP-NW-2026-0151', to: '/field/inspeksi/wir-025' }, gradient: 'from-amber-50 to-sky-100' },
  { id: 'ph-3', projectId: 'naw', title: 'Cover tulangan awal balok B2 (20 mm)', cat: 'temuan', location: 'Blok A — Unit A-05 L2', at: agoH(5), state: 'ok', phase: 'before', link: { label: 'F-NW-021', to: '/field/temuan/fnd-008' }, gradient: 'from-red-50 to-amber-50' },
  { id: 'ph-4', projectId: 'naw', title: 'Penerimaan semen Portland 80 sak', cat: 'material', location: 'Gudang Blok A', at: agoH(24), state: 'pending', gradient: 'from-green-50 to-sky-50' },
  { id: 'ph-5', projectId: 'rko', title: 'Rute pipa PPR di shaft Ruko 03', cat: 'inspeksi', location: 'Ruko 03 — Lantai 2', at: agoH(2), state: 'ok', link: { label: 'INSP-RKO-2026-0088', to: '/field/inspeksi/wir-012' }, gradient: 'from-sky-50 to-green-50' },
  { id: 'ph-6', projectId: 'rko', title: 'Cat dinding fasad menggelembung', cat: 'temuan', location: 'Ruko 02 — Lantai 1', at: agoD(1), state: 'ok', phase: 'before', link: { label: 'F-RKO-014', to: '/field/temuan/fnd-002' }, gradient: 'from-red-50 to-amber-50' },
  { id: 'ph-7', projectId: 'gml', title: 'Rangka hollow partisi ruang rapat', cat: 'inspeksi', location: 'Lantai 2 · Graha Mulia', at: agoD(2), state: 'ok', link: { label: 'INSP-GML-2026-0041', to: '/field/inspeksi/wir-018' }, gradient: 'from-gray-100 to-sky-50' },
]

/* ------------------------------------------------------------
 * Inbox per persona (PRD §13.1)
 * ------------------------------------------------------------ */

export interface FInboxItem {
  id: string
  to: PersonaId
  title: string
  body: string
  at: string
  tone: 'info' | 'warning' | 'danger' | 'success'
  link: string
  thread?: { from: string; role: string; at: string; message: string }[]
}

export const F_INBOX: FInboxItem[] = [
  {
    id: 'ib-1',
    to: 'engineer',
    title: 'INSP-NW-2026-0142 verifikasi fisik di lapangan',
    body: 'Spacer 25 mm balok B2 Unit A-05 telah diperiksa pengawas; menunggu konfirmasi hasil.',
    at: agoH(2),
    tone: 'info',
    link: '/field/inspeksi/wir-024',
    thread: [
      { from: 'Rina Maharani', role: 'Pengawas Kualitas', at: agoH(2), message: 'Spacer beton 25 mm sudah terpasang rapi di balok B2. Hasil verifikasi segera dicatat.' },
    ],
  },
  {
    id: 'ib-2',
    to: 'engineer',
    title: 'Catatan F-NW-021: bukti perbaikan diajukan',
    body: 'Penanggung jawab: CV Mitra Bangun (Mandor Struktur). Verifikasi sedang berlangsung.',
    at: agoH(5),
    tone: 'warning',
    link: '/field/temuan/fnd-008',
  },
  {
    id: 'ib-3',
    to: 'engineer',
    title: 'Jadwal INSP-NW-2026-0151 dikonfirmasi',
    body: 'Pemeriksaan rangka atap Unit B-02 hari ini 13:00 WIB bersama pengawas.',
    at: agoH(3),
    tone: 'info',
    link: '/field/inspeksi/wir-025',
  },
  {
    id: 'ib-4',
    to: 'engineer',
    title: 'Laporan 28 Okt dikembalikan reviewer',
    body: 'Jumlah tukang plesteran perlu disesuaikan dengan absensi lapangan.',
    at: agoD(1),
    tone: 'warning',
    link: '/field/laporan/rpt-1028',
  },
  {
    id: 'ib-5',
    to: 'qc',
    title: 'Pengajuan baru: INSP-RKO-2026-0088',
    body: 'Pemeriksaan jalur pipa sanitair shaft Ruko 03. Kelengkapan foto perlu ditinjau.',
    at: agoH(2),
    tone: 'info',
    link: '/field/inspeksi/wir-012',
  },
  {
    id: 'ib-6',
    to: 'qc',
    title: 'Bukti perbaikan F-NW-021 menunggu konfirmasi',
    body: '8 foto pemasangan spacer 25 mm Unit A-05 siap diverifikasi.',
    at: agoD(1),
    tone: 'warning',
    link: '/field/temuan/fnd-008',
  },
  {
    id: 'ib-7',
    to: 'qc',
    title: 'Tindakan perbaikan cat Ruko 02 lewat jatuh tempo',
    body: 'F-RKO-014 cat dinding luar fasad Ruko 02 melewati batas waktu 1 hari.',
    at: agoH(20),
    tone: 'danger',
    link: '/field/temuan/fnd-002',
  },
]

/* ------------------------------------------------------------
 * Peristiwa site (proyek terkini + catatan cepat)
 * ------------------------------------------------------------ */

export interface FEvent {
  id: string
  projectId: string
  at: string
  kind: 'kendala' | 'material' | 'alat' | 'pengunjung' | 'inspeksi' | 'laporan' | 'progres'
  title: string
  note?: string
}

export const F_EVENTS: FEvent[] = [
  { id: 'ev-1', projectId: 'naw', at: agoH(2), kind: 'inspeksi', title: 'INSP-NW-2026-0142: verifikasi perbaikan balok Unit A-05 dicek di lokasi', note: 'Rina Maharani · Pengawas Kualitas' },
  { id: 'ev-2', projectId: 'naw', at: agoH(3), kind: 'progres', title: 'Progres pembesian Unit A-05 diperbarui (75%)' },
  { id: 'ev-3', projectId: 'naw', at: agoH(24), kind: 'material', title: 'Penerimaan semen Portland 80 sak & besi D13 SNI', note: 'Gudang Material Blok A' },
  { id: 'ev-4', projectId: 'naw', at: agoD(1), kind: 'pengunjung', title: 'Kunjungan Project Manager Rizky Hidayat', note: 'Evaluasi progres mingguan Blok A & B' },
  { id: 'ev-5', projectId: 'rko', at: agoH(2), kind: 'inspeksi', title: 'INSP-RKO-2026-0088 diajukan untuk review' },
  { id: 'ev-6', projectId: 'rko', at: agoH(20), kind: 'kendala', title: 'Perbaikan cat fasad Ruko 02 melewati batas waktu (Overdue)' },
  { id: 'ev-7', projectId: 'gml', at: agoH(6), kind: 'inspeksi', title: 'Jadwal pemeriksaan partisi Lantai 2 dikonfirmasi H+1' },
]

/* ------------------------------------------------------------
 * Helper turunan untuk kartu home & badge angka
 * ------------------------------------------------------------ */

export const wirsForProject = (wirs: FWir[], projectId: string) => {
  const norm = normalizeFieldProjectId(projectId)
  return wirs.filter((w) => w.projectId === norm || w.projectId === projectId)
}

export const OPEN_WIR_STATUS: InspectionStatusId[] = ['submitted', 'scheduled', 'in_progress', 'correction_required', 'clarification_required', 'reinspection_requested', 'unable_to_inspect']
