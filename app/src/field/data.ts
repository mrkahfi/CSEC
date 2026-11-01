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
    role: 'Site Engineer',
    org: 'PT Karya Bangun Nusantara',
    responsibility: 'Mencatat pekerjaan, mengajukan inspeksi, menindaklanjuti temuan.',
    projectIds: ['aru', 'jk'],
  },
  qc: {
    id: 'qc',
    name: 'Rina Maharani',
    role: 'QA/QC Inspector',
    org: 'PT Karya Bangun Nusantara',
    responsibility: 'Memeriksa pekerjaan, mencatat hasil, memverifikasi perbaikan.',
    projectIds: ['aru', 'ks'],
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

export const F_PROJECTS: FProject[] = [
  {
    id: 'aru',
    code: 'ARU',
    name: 'Gedung Aruna Tower A',
    client: 'PT Griya Aruna Sejahtera',
    location: 'Jakarta Selatan',
    type: 'Gedung perkantoran, struktur beton',
    status: 'active',
    pm: 'Andi Prasetyo',
    latestUpdate: 'WIR-STR-024 dikembalikan untuk perbaikan',
    latestUpdateAt: agoH(5),
  },
  {
    id: 'ks',
    code: 'KS',
    name: 'Pembangunan Klinik Sentosa',
    client: 'Yayasan Sentosa Sehat',
    location: 'Bandung',
    type: 'Fasilitas kesehatan, fokus MEP',
    status: 'active',
    pm: 'Andi Prasetyo',
    latestUpdate: 'WIR-MEP-012 diajukan, menunggu review QC',
    latestUpdateAt: agoH(2),
  },
  {
    id: 'jk',
    code: 'JK',
    name: 'Peningkatan Jalan Kartika',
    client: 'Dinas Bina Marga (fiktif)',
    location: 'Makassar, Sektor 2',
    type: 'Jalan, peningkatan perkerasan',
    status: 'active',
    pm: 'Andi Prasetyo',
    latestUpdate: 'Re-inspeksi subgrade diminta (Ronde 2)',
    latestUpdateAt: agoH(6),
  },
]

export const fProject = (id: string) => F_PROJECTS.find((p) => p.id === id)!

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
  discipline: 'Struktur' | 'MEP' | 'Perkerasan'
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
    projectId: 'aru',
    name: 'Pembesian balok & pelat lantai 2',
    discipline: 'Struktur',
    location: 'Tower A · Lantai 2 · Grid C-F',
    subkon: 'CV Jaya Beton',
    status: 'berlangsung',
    progressPct: 65,
    unit: 'm³',
    qtyDone: '64',
    qtyPlan: '98',
    lastUpdate: 'Grid C-D selesai diikat, lanjut Grid E-F',
    lastUpdateAt: agoH(2),
    nextCheck: 'Pre-pour pembesian · Hold Point',
    holdNote: 'Pengecoran menunggu rilis hold point pre-pour.',
    progress: [
      { id: 'p1', at: agoH(2), by: 'Andi Pratama', status: 'berlangsung', qty: '12 m³', area: 'Grid C-D', note: 'Tulangan balok B2 selesai diikat, menunggu pemeriksaan QC.' },
      { id: 'p2', at: agoD(1), by: 'Andi Pratama', status: 'berlangsung', qty: '9 m³', area: 'Grid D-E', note: 'Spacer dan cover block mulai dipasang.' },
    ],
  },
  {
    id: 'act-ar-2',
    projectId: 'aru',
    name: 'Bekisting kolom lantai 3',
    discipline: 'Struktur',
    location: 'Tower A · Lantai 3 · Grid A-C',
    subkon: 'CV Jaya Beton',
    status: 'berlangsung',
    progressPct: 40,
    unit: 'm²',
    qtyDone: '38',
    qtyPlan: '96',
    lastUpdate: '6 dari 14 kolom terpasang',
    lastUpdateAt: agoH(4),
    nextCheck: 'Bekisting sebelum cor · Witness Point',
    progress: [
      { id: 'p3', at: agoH(4), by: 'Budi Santoso', status: 'berlangsung', qty: '6 kolom', area: 'Grid A-B', note: 'Perlu cek tegak-lurus sebelum witness point.' },
    ],
  },
  {
    id: 'act-ar-3',
    projectId: 'aru',
    name: 'Pengecoran pelat lantai 2',
    discipline: 'Struktur',
    location: 'Tower A · Lantai 2 · Grid C-F',
    subkon: 'PT KBN (internal)',
    status: 'tertahan',
    progressPct: 0,
    unit: 'm³',
    lastUpdate: 'Menunggu rilis hold point pre-pour',
    lastUpdateAt: agoH(5),
    holdNote: 'Tertahan: hold point pre-pour belum dirilis otoritas.',
    progress: [
      { id: 'p4', at: agoH(5), by: 'Sistem (simulasi)', status: 'tertahan', note: 'WIR-STR-024 perlu perbaikan; pengecoran menunggu.' },
    ],
  },
  {
    id: 'act-ar-4',
    projectId: 'aru',
    name: 'Instalasi sleeve & embedded item',
    discipline: 'MEP',
    location: 'Basement 1 · Zona B',
    subkon: 'CV Karya Mandiri',
    status: 'berlangsung',
    progressPct: 30,
    unit: 'titik',
    qtyDone: '24',
    qtyPlan: '80',
    lastUpdate: 'Sleeve drainase zona B2 terpasang',
    lastUpdateAt: agoD(1),
    nextCheck: 'Embedded item · Review Point',
    progress: [
      { id: 'p5', at: agoD(1), by: 'Andi Pratama', status: 'berlangsung', qty: '14 titik', area: 'Zona B2', note: 'Koordinasi bor dengan draft structure.' },
    ],
  },
  {
    id: 'act-ks-1',
    projectId: 'ks',
    name: 'Instalasi pipa air bersih lantai 1',
    discipline: 'MEP',
    location: 'Lantai 1 · Blok Poli · Ruang 101-118',
    subkon: 'CV Tirta Karya',
    status: 'berlangsung',
    progressPct: 55,
    unit: 'm',
    qtyDone: '120',
    qtyPlan: '220',
    lastUpdate: 'Rute utama ruang 101-110 terpasang',
    lastUpdateAt: agoH(3),
    nextCheck: 'Instalasi sebelum dinding ditutup · Hold Point',
    progress: [
      { id: 'p6', at: agoH(3), by: 'Budi Santoso', status: 'berlangsung', qty: '35 m', area: 'Ruang 105-110', note: 'Klem dan support mengikuti jadwal.' },
    ],
  },
  {
    id: 'act-ks-2',
    projectId: 'ks',
    name: 'Support & hanger ducting',
    discipline: 'MEP',
    location: 'Lantai 1 · Zona Timur',
    subkon: 'CV Udara Sehat',
    status: 'berlangsung',
    progressPct: 70,
    unit: 'unit',
    qtyDone: '28',
    qtyPlan: '40',
    lastUpdate: 'Perbaikan support area 3 selesai, menunggu verifikasi QC',
    lastUpdateAt: agoD(1),
    progress: [
      { id: 'p7', at: agoD(1), by: 'Budi Santoso', status: 'berlangsung', qty: '6 unit', area: 'Area 3', note: 'Jarak support sudah disesuaikan sesuai temuan FIND-MEP-004.' },
    ],
  },
  {
    id: 'act-ks-3',
    projectId: 'ks',
    name: 'Pressure test jaringan air bersih',
    discipline: 'MEP',
    location: 'Basement 1 · Ruang Pompa',
    subkon: 'CV Tirta Karya',
    status: 'belum_mulai',
    progressPct: 0,
    lastUpdate: 'Menunggu instalasi selesai',
    lastUpdateAt: agoD(2),
    nextCheck: 'Pressure test · Witness Point',
    progress: [],
  },
  {
    id: 'act-jk-1',
    projectId: 'jk',
    name: 'Pemadatan subgrade',
    discipline: 'Perkerasan',
    location: 'Sta 1+200 s.d. 1+250',
    subkon: 'PT Aspal Jaya',
    status: 'selesai_dilaporkan',
    progressPct: 100,
    unit: 'm²',
    qtyDone: '620',
    qtyPlan: '620',
    lastUpdate: 'Ronde 1 perlu perbaikan; re-inspeksi diminta',
    lastUpdateAt: agoH(6),
    nextCheck: 'Penerimaan subgrade · Hold Point',
    holdNote: 'Hold point penerimaan belum dirilis; ada area rework.',
    progress: [
      { id: 'p8', at: agoH(6), by: 'Yusuf Maulana', status: 'selesai_dilaporkan', qty: '620 m²', area: 'Sta 1+200-1+250', note: 'Area A sudah dimadatkan ulang sesuai temuan.' },
    ],
  },
  {
    id: 'act-jk-2',
    projectId: 'jk',
    name: 'Agregat kelas A (layer base)',
    discipline: 'Perkerasan',
    location: 'Sta 1+250 s.d. 1+300',
    subkon: 'PT Aspal Jaya',
    status: 'berlangsung',
    progressPct: 20,
    unit: 'm³',
    qtyDone: '40',
    qtyPlan: '210',
    lastUpdate: 'Penebaran mulai setelah subgrade 1+200 selesai dicek',
    lastUpdateAt: agoD(1),
    progress: [
      { id: 'p9', at: agoD(1), by: 'Yusuf Maulana', status: 'berlangsung', qty: '40 m³', area: 'Sta 1+250-1+270', note: 'Timbunan sementara di STA 1+260.' },
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
    projectId: 'aru',
    itpRef: 'ITP-ARU-STR Rev B',
    item: 'Item 4.1',
    name: 'Pemeriksaan pembesian sebelum pengecoran',
    type: 'hold',
    readiness: [
      'Pemasangan tulangan sesuai gambar',
      'Ukuran, jarak, dan overlap besi',
      'Cover block dan spacer terpasang',
      'Kondisi bekisting bersih dan rapat',
      'Embedded item dan sleeve terpasang',
      'Kebersihan area cor',
    ],
    refs: ['S-301 Rev C', 'SPEC-CON-01 Rev 1'],
  },
  {
    id: 'itp-ar-42',
    projectId: 'aru',
    itpRef: 'ITP-ARU-STR Rev B',
    item: 'Item 4.2',
    name: 'Pemeriksaan bekisting sebelum pengecoran',
    type: 'witness',
    readiness: [
      'Tegak-lurus dan perataan bekisting',
      'Support dan penyangga memadai',
      'Minyak bekisting sudah dioleskan',
      'Bukaan bersih dan pemeriksaan',
    ],
    refs: ['S-301 Rev C', 'MS-STR-02 Rev A'],
  },
  {
    id: 'itp-ar-43',
    projectId: 'aru',
    itpRef: 'ITP-ARU-STR Rev B',
    item: 'Item 4.3',
    name: 'Pemeriksaan embedded item & sleeve',
    type: 'review',
    readiness: [
      'Posisi sesuai shop drawing MEP',
      'Penyambungan dan penutupan ujung',
      'Koordinasi bor struktur',
    ],
    refs: ['MEP-12 Rev 2'],
  },
  {
    id: 'itp-ks-plb1',
    projectId: 'ks',
    itpRef: 'ITP-KS-PLB Rev A',
    item: 'Item 3.1',
    name: 'Instalasi pipa sebelum dinding ditutup',
    type: 'hold',
    readiness: [
      'Rute dan ketinggian sesuai drawing',
      'Support dan klem terpasang',
      'Hasil pressure test terlampir',
      'Ujung pipa ditutup dari kotoran',
    ],
    refs: ['MEP-12 Rev 2', 'AP-034 Rev 0'],
  },
  {
    id: 'itp-ks-plb2',
    projectId: 'ks',
    itpRef: 'ITP-KS-PLB Rev A',
    item: 'Item 3.2',
    name: 'Pressure test jaringan air bersih',
    type: 'witness',
    readiness: [
      'Alat uji terkalibrasi',
      'Tekanan uji sesuai spesifikasi',
      'Formulir rekaman uji siap',
    ],
    refs: ['SPEC-PLB-01 Rev 1'],
  },
  {
    id: 'itp-jk-51',
    projectId: 'jk',
    itpRef: 'ITP-JK-RW Rev 2',
    item: 'Item 5.1',
    name: 'Penerimaan subgrade sebelum layer base',
    type: 'hold',
    readiness: [
      'Hasil CBR & kepadatan in-situ',
      'Perataan dan kemiringan lintasan',
      'Batas STA yang diajukan',
    ],
    refs: ['Typ. XSEC-01 Rev 3', 'HAS-LAB-118'],
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
    ref: 'WIR-STR-024',
    projectId: 'aru',
    activityId: 'act-ar-1',
    itpPointId: 'itp-ar-41',
    title: 'Pemeriksaan pembesian balok & pelat L2',
    location: 'Tower A · Lantai 2 · Grid C-F',
    portion: 'Balok B1-B4, Grid C-F',
    status: 'correction_required',
    submittedAt: agoD(1),
    decidedAt: agoH(5),
    submitter: 'Andi Pratama',
    inspector: 'Rina Maharani',
    externalParty: { name: 'Hendra Kusuma', role: 'Konsultan · CV Mitra Teknik', attendance: 'belum_dikonfirmasi' },
    evidence: [
      { id: 'e1', kind: 'photo', title: 'Tulangan balok B2 Grid C-D', meta: 'Sebelum keputusan · ' + 'kondisi jarak besi', cat: 'inspeksi', phase: 'before' },
      { id: 'e2', kind: 'photo', title: 'Cover block pelat L2', meta: 'Sisi timur Grid E', cat: 'inspeksi' },
      { id: 'e3', kind: 'doc', title: 'S-301 Rev C', meta: 'Gambar detail tulangan (revisi berjalan)' },
    ],
    checklist: (() => {
      const s = prePourSections()
      s[1].items[0].result = 'issue'
      s[1].items[0].note = 'Jarak kait balok B2 bervariasi 190 s.d. 210 mm; toleransi ±10 mm.'
      return s
    })(),
    rounds: [
      { n: 1, at: agoH(5), outcome: 'Perlu Perbaikan', note: 'Jarak tulangan di luar toleransi; perbaikan sebelum re-inspeksi.' },
    ],
    timeline: [
      { id: 't1', at: agoD(1), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan inspeksi diajukan', kind: 'submitted', detail: 'Lingkup: balok B1-B4 Grid C-F · pre-pour' },
      { id: 't2', at: agoH(7), actor: 'Rina Maharani', role: 'QA/QC', title: 'Inspeksi dilaksanakan di lapangan', kind: 'evidence' },
      { id: 't3', at: agoH(5), actor: 'Rina Maharani', role: 'QA/QC', title: 'Keputusan: Perlu Perbaikan', kind: 'correction', note: 'Jarak tulangan balok B2 di luar toleransi. Mohon lengkapi foto detail sambungan untuk re-inspeksi.', detail: 'Temuan FIND-STR-008 tercatat dari inspeksi ini.' },
    ],
    linkedFindingIds: ['fnd-008'],
  },
  {
    id: 'wir-025',
    ref: 'WIR-STR-025',
    projectId: 'aru',
    activityId: 'act-ar-2',
    itpPointId: 'itp-ar-42',
    title: 'Pemeriksaan bekisting kolom L3',
    location: 'Tower A · Lantai 3 · Grid A-C',
    portion: 'Kolom K1-K6, Grid A-B',
    status: 'scheduled',
    submittedAt: agoH(8),
    scheduledAt: aheadH(2),
    submitter: 'Andi Pratama',
    inspector: 'Rina Maharani',
    externalParty: { name: 'Hendra Kusuma', role: 'Konsultan · CV Mitra Teknik', attendance: 'belum_dikonfirmasi' },
    noticeNote: 'Pemberitahuan 1 hari kerja sesuai konfigurasi proyek.',
    evidence: [
      { id: 'e4', kind: 'photo', title: 'Bekisting kolom K1-K3', meta: 'Terpasang, menunggu pemeriksaan', cat: 'inspeksi' },
      { id: 'e5', kind: 'doc', title: 'S-301 Rev C', meta: 'Gambar detail tulangan' },
    ],
    checklist: bekistingSections(),
    timeline: [
      { id: 't4', at: agoH(8), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan inspeksi diajukan', kind: 'submitted' },
      { id: 't5', at: agoH(3), actor: 'Rina Maharani', role: 'QA/QC', title: 'Jadwal dikonfirmasi: hari ini 13:00', kind: 'scheduled' },
    ],
  },
  {
    id: 'wir-026',
    ref: 'WIR-STR-026',
    projectId: 'aru',
    activityId: 'act-ar-4',
    itpPointId: 'itp-ar-43',
    title: 'Pemeriksaan embedded item & sleeve B1',
    location: 'Basement 1 · Zona B',
    portion: 'Zona B2, 24 dari 80 titik',
    status: 'draft',
    submitter: 'Andi Pratama',
    evidence: [],
    checklist: [
      {
        id: 'sec-emb',
        title: 'Embedded item',
        items: [
          { id: 'em1', label: 'Posisi sesuai shop drawing MEP', source: 'MEP-12 Rev 2' },
          { id: 'em2', label: 'Ujung sleeve ditutup rapi' },
        ],
      },
    ],
    timeline: [
      { id: 't6', at: agoH(20), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Draf permintaan dibuat', kind: 'created' },
    ],
  },
  {
    id: 'wir-012',
    ref: 'WIR-MEP-012',
    projectId: 'ks',
    activityId: 'act-ks-1',
    itpPointId: 'itp-ks-plb1',
    title: 'Inspeksi instalasi pipa air bersih L1',
    location: 'Lantai 1 · Blok Poli · Ruang 101-118',
    portion: 'Ruang 101-110',
    status: 'submitted',
    submittedAt: agoH(2),
    submitter: 'Budi Santoso',
    inspector: 'Rina Maharani',
    missingItems: ['Hasil pressure test belum dilampirkan'],
    evidence: [
      { id: 'e6', kind: 'photo', title: 'Rute pipa ruang 105', meta: 'Sebelum dinding ditutup', cat: 'inspeksi' },
      { id: 'e7', kind: 'photo', title: 'Support & klem pipa', meta: 'Jarak 1,5 m', cat: 'inspeksi' },
      { id: 'e8', kind: 'doc', title: 'AP-034 Rev 0', meta: 'Persetujuan material pipa PPR' },
      { id: 'e9', kind: 'doc', title: 'HAS-LAB-118', meta: 'Laporan uji, belum melingkup pengajuan ini', state: 'unavailable' },
    ],
    checklist: pipaSections(),
    timeline: [
      { id: 't7', at: agoH(2), actor: 'Budi Santoso', role: 'Site Supervisor', title: 'Permintaan inspeksi diajukan', kind: 'submitted', detail: 'Menunggu peninjauan kelengkapan oleh QC.' },
    ],
  },
  {
    id: 'wir-018',
    ref: 'WIR-CIV-018',
    projectId: 'jk',
    activityId: 'act-jk-1',
    itpPointId: 'itp-jk-51',
    title: 'Penerimaan subgrade Sta 1+200 s.d. 1+250',
    location: 'Sta 1+200 s.d. 1+250 · Lajur kanan',
    portion: '620 m², lajur kanan',
    status: 'reinspection_requested',
    submittedAt: agoD(2),
    scheduledAt: aheadH(20),
    submitter: 'Yusuf Maulana',
    inspector: 'Dimas Saputra',
    evidence: [
      { id: 'e10', kind: 'photo', title: 'Area A sebelum rework', meta: 'Kondisi awal, ada lembang', cat: 'temuan', phase: 'before' },
      { id: 'e11', kind: 'photo', title: 'Area A setelah pemadatan ulang', meta: 'Setelah rework', cat: 'progres', phase: 'after' },
      { id: 'e12', kind: 'test', title: 'HAS-LAB-118', meta: 'CBR 8,7% · memenuhi' },
    ],
    checklist: subgradeSections(),
    rounds: [
      { n: 1, at: agoD(2), outcome: 'Perlu Perbaikan', note: 'Area A (STA 1+210 s.d. 1+225) ada lembang; perlu pemadatan ulang.' },
    ],
    timeline: [
      { id: 't8', at: agoD(3), actor: 'Yusuf Maulana', role: 'Site Manager', title: 'Permintaan inspeksi diajukan', kind: 'submitted' },
      { id: 't9', at: agoD(2), actor: 'Dimas Saputra', role: 'QA/QC Engineer', title: 'Keputusan: Perlu Perbaikan', kind: 'correction', note: 'Area A lembang; sisanya sesuai.', detail: 'FIND-CIV-002 dicatat, kini terverifikasi.' },
      { id: 't10', at: agoH(6), actor: 'Yusuf Maulana', role: 'Site Manager', title: 'Re-inspeksi diminta (Ronde 2)', kind: 'reinspection', note: 'Area A telah dimadatkan ulang; bukti terlampir.' },
    ],
    linkedFindingIds: ['fnd-002'],
  },
  {
    id: 'wir-021',
    ref: 'WIR-STR-021',
    projectId: 'aru',
    activityId: 'act-ar-3',
    itpPointId: 'itp-ar-41',
    title: 'Pemeriksaan pembesian pelat L2 Grid A-D',
    location: 'Tower A · Lantai 2 · Grid A-D',
    portion: 'Pelat zona A',
    status: 'accepted',
    submittedAt: agoD(4),
    decidedAt: agoD(3),
    submitter: 'Andi Pratama',
    inspector: 'Rina Maharani',
    evidence: [
      { id: 'e13', kind: 'photo', title: 'Pelat zona A sebelum cor', meta: 'Diterima 27 Okt', cat: 'inspeksi' },
    ],
    checklist: prePourSections(),
    decision: {
      outcome: 'Diterima',
      statusId: 'accepted',
      by: 'Rina Maharani',
      comment: 'Sesuai gambar & spesifikasi untuk lingkup zona A.',
    },
    holdNote: 'Diterima bukan berarti rilis hold point; rilis cor dicatat terpisah oleh otoritas.',
    timeline: [
      { id: 't11', at: agoD(4), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan inspeksi diajukan', kind: 'submitted' },
      { id: 't12', at: agoD(3), actor: 'Rina Maharani', role: 'QA/QC', title: 'Keputusan: Diterima', kind: 'accepted', note: 'Sesuai gambar & spesifikasi.' },
    ],
  },
  {
    id: 'wir-023',
    ref: 'WIR-STR-023',
    projectId: 'aru',
    activityId: 'act-ar-2',
    itpPointId: 'itp-ar-42',
    title: 'Pemeriksaan bekisting kolom L2',
    location: 'Tower A · Lantai 2 · Grid A-B',
    portion: 'Kolom K1-K4',
    status: 'withdrawn',
    submittedAt: agoD(5),
    decidedAt: agoD(4),
    submitter: 'Andi Pratama',
    evidence: [],
    checklist: bekistingSections(),
    timeline: [
      { id: 't13', at: agoD(5), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan inspeksi diajukan', kind: 'submitted' },
      { id: 't14', at: agoD(4), actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan ditarik pengirim', kind: 'withdrawn', note: 'Tergantikan WIR-STR-025 untuk lingkup yang tepat.' },
    ],
  },
]

/* ------------------------------------------------------------
 * Temuan & tindak lanjut (PRD §10)
 * ------------------------------------------------------------ */

export interface FFinding {
  id: string
  ref: string
  projectId: string
  activityId: string
  sourceWirId?: string
  title: string
  desc: string
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
    ref: 'FIND-STR-008',
    projectId: 'aru',
    activityId: 'act-ar-1',
    sourceWirId: 'wir-024',
    title: 'Jarak tulangan balok B2 di luar toleransi',
    desc: 'Jarak kait bervariasi 190 s.d. 210 mm pada balok B2 Grid C-D; toleransi gambar ±10 mm dari 200 mm. Perlu penyeraan ulang sebelum re-inspeksi.',
    classification: 'potential_nc',
    location: 'Tower A · Lantai 2 · Grid C-D · Balok B2',
    responsible: 'CV Jaya Beton',
    dueAt: aheadH(46),
    status: 'assigned',
    ncrRef: undefined,
    evidence: [
      { id: 'fe1', kind: 'photo', title: 'Jarak kait balok B2', meta: 'Foto inspeksi QC', cat: 'temuan', phase: 'before' },
      { id: 'fe2', kind: 'photo', title: 'Penanda area perbaikan', meta: 'Tanda kapur di lapangan', cat: 'temuan', phase: 'before' },
    ],
    timeline: [
      { id: 'f1', at: agoH(5), actor: 'Rina Maharani', role: 'QA/QC', title: 'Temuan dicatat dari WIR-STR-024', kind: 'finding', note: 'Ditugaskan ke tim site CV Jaya Beton.' },
    ],
  },
  {
    id: 'fnd-004',
    ref: 'FIND-MEP-004',
    projectId: 'ks',
    activityId: 'act-ks-2',
    sourceWirId: undefined,
    title: 'Support ducting perlu penyesuaian',
    desc: 'Jarak support ducting area 3 melebihi spesifikasi (2,1 m vs maks 1,8 m). Perlu tambah support antara.',
    classification: 'potential_nc',
    location: 'Lantai 1 · Zona Timur · Area 3',
    responsible: 'CV Udara Sehat',
    dueAt: agoH(-4),
    status: 'verification_pending',
    evidence: [
      { id: 'fe3', kind: 'photo', title: 'Jarak support area 3', meta: 'Sebelum perbaikan', cat: 'temuan', phase: 'before' },
    ],
    response: {
      desc: 'Ditambah 4 support antara pada area 3; jarak kini maksimal 1,75 m. Foto sesudah terlampir.',
      at: agoD(1),
      by: 'Budi Santoso',
      evidence: [
        { id: 'fe4', kind: 'photo', title: 'Support baru terpasang', meta: 'Setelah perbaikan', cat: 'temuan', phase: 'after' },
      ],
    },
    timeline: [
      { id: 'f2', at: agoD(3), actor: 'Dimas Saputra', role: 'QA/QC Engineer', title: 'Temuan dicatat dari inspeksi ducting', kind: 'finding' },
      { id: 'f3', at: agoD(1), actor: 'Budi Santoso', role: 'Site Supervisor', title: 'Bukti perbaikan diajukan', kind: 'action', note: 'Menunggu verifikasi QC.' },
    ],
  },
  {
    id: 'fnd-002',
    ref: 'FIND-CIV-002',
    projectId: 'jk',
    activityId: 'act-jk-1',
    sourceWirId: 'wir-018',
    title: 'Subgrade area A perlu pemadatan ulang',
    desc: 'Lembang pada STA 1+210 s.d. 1+225; kepadatan di bawah target 95% standard proctor.',
    classification: 'confirmed_nc',
    ncrRef: 'NCR-CIV-002',
    location: 'Sta 1+210 s.d. 1+225 · Lajur kanan',
    responsible: 'PT Aspal Jaya',
    dueAt: agoH(-20),
    status: 'verified',
    evidence: [
      { id: 'fe5', kind: 'photo', title: 'Lembang area A', meta: 'Sebelum rework', cat: 'temuan', phase: 'before' },
    ],
    response: {
      desc: 'Area A digali ulang 30 cm dan dimadatkan kembali; CBR ulang 8,7% (memenuhi).',
      at: agoH(10),
      by: 'Yusuf Maulana',
      evidence: [
        { id: 'fe6', kind: 'photo', title: 'Area A setelah rework', meta: 'Setelah pemadatan ulang', cat: 'progres', phase: 'after' },
        { id: 'fe7', kind: 'test', title: 'HAS-LAB-118', meta: 'CBR ulang memenuhi' },
      ],
    },
    verification: [
      {
        at: agoH(7),
        by: 'Dimas Saputra',
        outcome: 'verified',
        note: 'Hasil uji & kondisi lapangan memenuhi. Re-inspeksi formal diminta terpisah via WIR-CIV-018 Ronde 2.',
      },
    ],
    timeline: [
      { id: 'f4', at: agoD(2), actor: 'Dimas Saputra', role: 'QA/QC Engineer', title: 'Temuan dicatat, NCR-CIV-002 diterbitkan', kind: 'finding' },
      { id: 'f5', at: agoH(10), actor: 'Yusuf Maulana', role: 'Site Manager', title: 'Bukti perbaikan diajukan', kind: 'action' },
      { id: 'f6', at: agoH(7), actor: 'Dimas Saputra', role: 'QA/QC Engineer', title: 'Perbaikan terverifikasi', kind: 'verified', note: 'Re-inspeksi formal mengikuti WIR-CIV-018.' },
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
    ref: 'LHR-ARU-1030',
    projectId: 'aru',
    author: 'Andi Pratama',
    status: 'submitted',
    submittedAt: agoH(16),
    sections: {
      shift: 'Pagi · 07:00 s.d. 17:00',
      weather: [
        { time: '07:00', condition: 'Cerah' },
        { time: '16:00', condition: 'Hujan sedang' },
      ],
      siteCondition: 'Kering, genangan kecil di area BM 1 setelah hujan sore',
      impact: 'Hujan sore menghentikan bekisting L3 sejak 16:00 (1 jam)',
      manpower: [
        { id: 'm1', company: 'PT KBN', trade: 'Mandor & site engineer', count: 4, area: 'Seluruh area' },
        { id: 'm2', company: 'CV Jaya Beton', trade: 'Pembesiang', count: 8, area: 'Lantai 2' },
        { id: 'm3', company: 'CV Jaya Beton', trade: 'Tukang bekisting', count: 6, area: 'Lantai 3' },
        { id: 'm4', company: 'CV Karya Mandiri', trade: 'Mekanik MEP', count: 3, area: 'Basement 1' },
      ],
      work: [
        { id: 'w1', activityId: 'act-ar-1', name: 'Pembesian balok & pelat L2', location: 'Grid C-D', qty: '12 m³', status: 'berlangsung', subkon: 'CV Jaya Beton', note: 'Progres 65%' },
        { id: 'w2', activityId: 'act-ar-2', name: 'Bekisting kolom L3', location: 'Grid A-B', qty: '6 kolom', status: 'sebagian', subkon: 'CV Jaya Beton', note: 'Berhenti 16:00 karena hujan' },
        { id: 'w3', activityId: 'act-ar-4', name: 'Sleeve & embedded B1', location: 'Zona B2', qty: '14 titik', status: 'berlangsung', subkon: 'CV Karya Mandiri' },
      ],
      equipment: [
        { id: 'eq1', name: 'Tower crane', assetId: 'TCA-01', location: 'Tower A', status: 'operasi', hours: '8 jam' },
        { id: 'eq2', name: 'Concrete pump', assetId: 'CP-02', location: 'Yard', status: 'idle', issue: 'Front kerja belum siap (menunggu hold point)' },
        { id: 'eq3', name: 'Excavator', assetId: 'EX-02', location: 'Basement', status: 'rusak', hours: '0 jam', issue: 'Kebocoran hidrolik, perbaikan 2 jam' },
      ],
      deliveries: [
        { id: 'd1', supplier: 'PT Besi Nusantara', suratJalan: 'SJ-8841', material: 'Besi D16, panjang 12 m', expected: '4,5 ton', received: '4,2 ton', time: '09:30', condition: 'kurang', location: 'Yard timur', note: 'Kurang 300 kg, klaim ke supplier; surat jalan lengkap.' },
      ],
      delays: [
        { id: 'dl1', category: 'cuaca', affected: 'Bekisting kolom L3', time: '16:00 s.d. 17:00', desc: 'Hujan sedang, pekerjaan ketinggian dihentikan.' },
        { id: 'dl2', category: 'alat', affected: 'Pekerjaan tanah basement', time: '10:00 s.d. 12:00', desc: 'Excavator EX-02 bocor hidrolik.' },
      ],
      visitors: [
        { id: 'v1', name: 'Hendra Kusuma', org: 'CV Mitra Teknik (konsultan)', purpose: 'Kunjungan rutin & ikut toolbox talk', time: '10:00', area: 'Tower A' },
      ],
      toolbox: 'ya',
      safetyNote: 'Toolbox talk 07:15: kerja ketinggian & APD. Tidak ada insiden.',
      nextPlan: 'Lanjut ikatan tulangan Grid E-F; persiapan re-inspeksi pembesian; bekisting kolom K7-K10.',
    },
  },
  {
    id: 'rpt-1028',
    dateLabel: '28 Okt 2026',
    ref: 'LHR-ARU-1028',
    projectId: 'aru',
    author: 'Andi Pratama',
    status: 'returned',
    reviewComment: 'Jumlah tenaga kerja subkon bekisting tidak sesuai absensi harian. Mohon bagian tenaga kerja diperbarui.',
    sections: {
      shift: 'Pagi · 07:00 s.d. 17:00',
      weather: [{ time: '07:00', condition: 'Berawan' }],
      siteCondition: 'Kering',
      manpower: [
        { id: 'm5', company: 'PT KBN', trade: 'Mandor & site engineer', count: 4, area: 'Seluruh area' },
        { id: 'm6', company: 'CV Jaya Beton', trade: 'Tukang bekisting', count: 4, area: 'Lantai 2' },
      ],
      work: [
        { id: 'w4', activityId: 'act-ar-2', name: 'Bekisting kolom L2', location: 'Grid A-B', qty: '4 kolom', status: 'berlangsung', subkon: 'CV Jaya Beton' },
      ],
      equipment: [{ id: 'eq4', name: 'Tower crane', assetId: 'TCA-01', location: 'Tower A', status: 'operasi', hours: '8 jam' }],
      deliveries: [],
      delays: [],
      visitors: [],
      toolbox: 'ya',
      nextPlan: 'Lanjut bekisting kolom.',
    },
  },
  {
    id: 'rpt-1027',
    dateLabel: '27 Okt 2026',
    ref: 'LHR-ARU-1027',
    projectId: 'aru',
    author: 'Andi Pratama',
    status: 'submitted',
    lateNote: 'Diisi 29 Okt (entri terlambat)',
    submittedAt: agoD(2),
    sections: {
      shift: 'Pagi · 07:00 s.d. 17:00',
      weather: [{ time: '07:00', condition: 'Cerah' }],
      siteCondition: 'Kering',
      manpower: [{ id: 'm7', company: 'PT KBN', trade: 'Mandor & site engineer', count: 4, area: 'Seluruh area' }],
      work: [{ id: 'w5', activityId: 'act-ar-1', name: 'Pembesian pelat L2 zona A', location: 'Grid A-D', qty: '18 m³', status: 'selesai', subkon: 'CV Jaya Beton' }],
      equipment: [],
      deliveries: [],
      delays: [],
      visitors: [],
      toolbox: 'ya',
      nextPlan: 'Pengajuan WIR pelat zona A.',
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
  { id: 'doc-1', projectId: 'aru', number: 'S-301', title: 'Detail Tulangan Pelat & Balok Lantai 2', category: 'Gambar', rev: 'C', status: 'current', issued: agoD(24), discipline: 'Struktur', relatedWirRef: 'WIR-STR-024' },
  { id: 'doc-2', projectId: 'aru', number: 'S-301', title: 'Detail Tulangan Pelat & Balok Lantai 2', category: 'Gambar', rev: 'B', status: 'superseded', issued: agoD(120), latestRev: 'C', discipline: 'Struktur' },
  { id: 'doc-3', projectId: 'aru', number: 'ITP-ARU-STR', title: 'Rencana Inspeksi & Pengujian Struktur', category: 'ITP & Checklist', rev: 'B', status: 'current', issued: agoD(90), discipline: 'Struktur' },
  { id: 'doc-4', projectId: 'aru', number: 'SPEC-CON-01', title: 'Spesifikasi Teknik Beton Struktur', category: 'Spesifikasi', rev: '1', status: 'current', issued: agoD(300), discipline: 'Struktur' },
  { id: 'doc-5', projectId: 'aru', number: 'MS-STR-02', title: 'Method Statement Pengecoran Kolom & Pelat', category: 'Method Statement', rev: 'A', status: 'current', issued: agoD(150), discipline: 'Struktur' },
  { id: 'doc-6', projectId: 'ks', number: 'MEP-12', title: 'Shop Drawing Tata Letak MEP Lantai 1', category: 'Gambar', rev: '2', status: 'current', issued: agoD(9), discipline: 'MEP', relatedWirRef: 'WIR-MEP-012' },
  { id: 'doc-7', projectId: 'ks', number: 'ITP-KS-PLB', title: 'Rencana Inspeksi & Pengujian Plumbing', category: 'ITP & Checklist', rev: 'A', status: 'current', issued: agoD(60), discipline: 'MEP' },
  { id: 'doc-8', projectId: 'ks', number: 'AP-034', title: 'Persetujuan Material Pipa PPR PN-20', category: 'Persetujuan Material', rev: '0', status: 'current', issued: agoD(45), discipline: 'MEP' },
  { id: 'doc-9', projectId: 'jk', number: 'Typ. XSEC-01', title: 'Potongan Tipikal Perkerasan', category: 'Gambar', rev: '3', status: 'current', issued: agoD(80), discipline: 'Perkerasan', relatedWirRef: 'WIR-CIV-018' },
  { id: 'doc-10', projectId: 'jk', number: 'ITP-JK-RW', title: 'Rencana Inspeksi & Pengujian Perkerasan Jalan', category: 'ITP & Checklist', rev: '2', status: 'current', issued: agoD(60), discipline: 'Perkerasan' },
  { id: 'doc-11', projectId: 'jk', number: 'HAS-LAB-118', title: 'Laporan Uji CBR & Kepadatan Subgrade', category: 'Laporan Uji', rev: '0', status: 'current', issued: agoH(9), discipline: 'Perkerasan' },
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
  { id: 'ph-1', projectId: 'aru', title: 'Ikatan tulangan balok B2', cat: 'progres', location: 'Lantai 2 · Grid C-D', at: agoH(3), state: 'ok', link: { label: 'WIR-STR-024', to: '/field/inspeksi/wir-024' }, gradient: 'from-sky-100 to-brand-50' },
  { id: 'ph-2', projectId: 'aru', title: 'Bekisting kolom K1-K3', cat: 'inspeksi', location: 'Lantai 3 · Grid A-B', at: agoH(8), state: 'ok', link: { label: 'WIR-STR-025', to: '/field/inspeksi/wir-025' }, gradient: 'from-amber-50 to-sky-100' },
  { id: 'ph-3', projectId: 'aru', title: 'Jarak kait balok B2', cat: 'temuan', location: 'Lantai 2 · Grid C-D', at: agoH(5), state: 'ok', phase: 'before', link: { label: 'FIND-STR-008', to: '/field/temuan/fnd-008' }, gradient: 'from-red-50 to-amber-50' },
  { id: 'ph-4', projectId: 'aru', title: 'Pengiriman besi SJ-8841', cat: 'material', location: 'Yard timur', at: agoH(24), state: 'pending', gradient: 'from-green-50 to-sky-50' },
  { id: 'ph-5', projectId: 'ks', title: 'Rute pipa ruang 105', cat: 'inspeksi', location: 'Lantai 1 · Blok Poli', at: agoH(2), state: 'ok', link: { label: 'WIR-MEP-012', to: '/field/inspeksi/wir-012' }, gradient: 'from-sky-50 to-green-50' },
  { id: 'ph-6', projectId: 'ks', title: 'Support baru area 3', cat: 'temuan', location: 'Zona Timur · Area 3', at: agoD(1), state: 'ok', phase: 'after', link: { label: 'FIND-MEP-004', to: '/field/temuan/fnd-004' }, gradient: 'from-green-50 to-brand-50' },
  { id: 'ph-7', projectId: 'ks', title: 'Kondisi ruang pompa', cat: 'kondisi site', location: 'Basement 1', at: agoD(2), state: 'failed', gradient: 'from-gray-100 to-gray-50' },
  { id: 'ph-8', projectId: 'jk', title: 'Area A setelah rework', cat: 'progres', location: 'Sta 1+210 s.d. 1+225', at: agoH(10), state: 'ok', phase: 'after', link: { label: 'WIR-CIV-018', to: '/field/inspeksi/wir-018' }, gradient: 'from-amber-50 to-green-50' },
  { id: 'ph-9', projectId: 'jk', title: 'Lembang area A', cat: 'temuan', location: 'Sta 1+215', at: agoD(2), state: 'ok', phase: 'before', link: { label: 'FIND-CIV-002', to: '/field/temuan/fnd-002' }, gradient: 'from-red-50 to-gray-50' },
  { id: 'ph-10', projectId: 'aru', title: 'Foto docket beton batch 118', cat: 'material', location: 'Tower A', at: agoD(3), state: 'unavailable', gradient: 'from-gray-100 to-gray-50' },
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
    title: 'WIR-STR-024 dikembalikan untuk perbaikan',
    body: 'Jarak tulangan balok B2 di luar toleransi. Lihat catatan QC.',
    at: agoH(5),
    tone: 'warning',
    link: '/field/inspeksi/wir-024',
    thread: [
      { from: 'Rina Maharani', role: 'QA/QC', at: agoH(5), message: 'Mohon lengkapi foto detail sambungan dan perbaiki jarak kait balok B2 sebelum re-inspeksi dijadwalkan.' },
    ],
  },
  {
    id: 'ib-2',
    to: 'engineer',
    title: 'Temuan FIND-STR-008 ditugaskan ke tim Anda',
    body: 'Penanggung jawab: CV Jaya Beton. Jatuh tempo dalam 2 hari.',
    at: agoH(5),
    tone: 'danger',
    link: '/field/temuan/fnd-008',
  },
  {
    id: 'ib-3',
    to: 'engineer',
    title: 'Jadwal WIR-STR-025 dikonfirmasi',
    body: 'Inspeksi bekisting kolom L3 hari ini 13:00. Konsultan diundang.',
    at: agoH(3),
    tone: 'info',
    link: '/field/inspeksi/wir-025',
  },
  {
    id: 'ib-4',
    to: 'engineer',
    title: 'Laporan 28 Okt dikembalikan reviewer',
    body: 'Bagian tenaga kerja perlu diperbarui.',
    at: agoD(1),
    tone: 'warning',
    link: '/field/laporan/rpt-1028',
  },
  {
    id: 'ib-5',
    to: 'qc',
    title: 'Permintaan baru: WIR-MEP-012',
    body: 'Instalasi pipa air bersih L1, Klinik Sentosa. Kelengkapan perlu ditinjau.',
    at: agoH(2),
    tone: 'info',
    link: '/field/inspeksi/wir-012',
  },
  {
    id: 'ib-6',
    to: 'qc',
    title: 'Bukti perbaikan FIND-MEP-004 menunggu verifikasi',
    body: 'CV Udara Sehat mengajukan perbaikan support ducting.',
    at: agoD(1),
    tone: 'warning',
    link: '/field/temuan/fnd-004',
  },
  {
    id: 'ib-7',
    to: 'qc',
    title: 'Re-inspeksi diminta: WIR-CIV-018 Ronde 2',
    body: 'Subgrade Sta 1+200 s.d. 1+250 setelah perbaikan area A.',
    at: agoH(6),
    tone: 'info',
    link: '/field/inspeksi/wir-018',
  },
  {
    id: 'ib-8',
    to: 'qc',
    title: 'WIR-STR-025 terjadwal hari ini 13:00',
    body: 'Witness point bekisting kolom L3. Konsultan CV Mitra Teknik diundang.',
    at: agoH(3),
    tone: 'info',
    link: '/field/inspeksi/wir-025',
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
  { id: 'ev-1', projectId: 'aru', at: agoH(5), kind: 'inspeksi', title: 'WIR-STR-024: keputusan Perlu Perbaikan', note: 'Rina Maharani · QA/QC' },
  { id: 'ev-2', projectId: 'aru', at: agoH(3), kind: 'progres', title: 'Progres pembesian L2 diperbarui (65%)' },
  { id: 'ev-3', projectId: 'aru', at: agoH(24), kind: 'material', title: 'Besi D16 datang kurang 300 kg', note: 'SJ-8841 · PT Besi Nusantara · klaim diajukan' },
  { id: 'ev-4', projectId: 'aru', at: agoD(1), kind: 'pengunjung', title: 'Kunjungan konsultan CV Mitra Teknik', note: 'Hendra Kusuma · ikut toolbox talk' },
  { id: 'ev-5', projectId: 'ks', at: agoH(2), kind: 'inspeksi', title: 'WIR-MEP-012 diajukan, menunggu review QC' },
  { id: 'ev-6', projectId: 'ks', at: agoD(1), kind: 'kendala', title: 'Bukti perbaikan FIND-MEP-004 diajukan' },
  { id: 'ev-7', projectId: 'jk', at: agoH(6), kind: 'inspeksi', title: 'Re-inspeksi WIR-CIV-018 Ronde 2 diminta' },
  { id: 'ev-8', projectId: 'jk', at: agoH(10), kind: 'progres', title: 'Rework subgrade area A selesai' },
]

/* ------------------------------------------------------------
 * Helper turunan untuk kartu home & badge angka
 * ------------------------------------------------------------ */

export const wirsForProject = (wirs: FWir[], projectId: string) => wirs.filter((w) => w.projectId === projectId)

export const OPEN_WIR_STATUS: InspectionStatusId[] = ['submitted', 'scheduled', 'in_progress', 'correction_required', 'clarification_required', 'reinspection_requested', 'unable_to_inspect']
