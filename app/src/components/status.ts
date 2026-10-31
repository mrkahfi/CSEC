import {
  Send,
  SearchCheck,
  Users,
  CalendarClock,
  Timer,
  CircleCheck,
  FileWarning,
  MessageCircleQuestion,
  RefreshCw,
  CalendarX,
  EyeOff,
  Undo2,
  Ban,
  TriangleAlert,
  UserPlus,
  Wrench,
  Hourglass,
  BadgeCheck,
  CircleX,
  CirclePause,
  Replace,
  Scale,
  Eye,
  FileText,
  OctagonAlert,
  CircleDashed,
  ClipboardCheck,
  Lock,
  LockOpen,
  Stamp,
  FileSearch,
  ScanSearch,
  MessageSquare,
  AlarmClock,
  CircleHelp,
  FilePenLine,
  HardHat,
  Landmark,
  CircleEllipsis,
  type LucideIcon,
} from 'lucide-react'

/**
 * KATALOG STATUS DOMAIN
 * ------------------------------------------------------------
 * Kosakata status tunggal untuk seluruh aplikasi (PRD §14.1):
 * setiap status = label teks (Bahasa Indonesia) + ikon + tone.
 * Ikon adalah isyarat non-warna sehingga status tetap terbaca
 * untuk pengguna buta warna (PRD FR-IN-07).
 *
 * Catatan terminologi (PRD §14.4): label mengikuti istilah yang
 * akrab di kontraktor Indonesia dan dapat dikonfigurasi per
 * proyek — tidak dipaksakan seragam.
 */

export type StatusTone =
  | 'neutral' // draf, ditarik, dibatalkan, ditutup
  | 'brand' // penanda konteks / sorotan
  | 'info' // menunggu, terjadwal, pihak eksternal
  | 'active' // sedang berjalan
  | 'success' // diterima, terverifikasi, dirilis
  | 'warning' // perlu tindakan, mendekati, tertunda
  | 'danger' // ditolak, terblokir, terlambat

export interface StatusDef {
  id: string
  /** Label pendek untuk badge. */
  label: string
  tone: StatusTone
  /** Ikon wajib — isyarat non-warna. */
  icon: LucideIcon
  /** Penjelasan singkat untuk tooltip/help. */
  description?: string
}

/* ------------------------------------------------------------
 * 1. Status permintaan inspeksi (WIR/RFI) — PRD §10.1
 * ------------------------------------------------------------ */
export const INSPECTION_STATUS = {
  draft: {
    id: 'draft',
    label: 'Draf',
    tone: 'neutral',
    icon: FilePenLine,
    description: 'Belum diajukan; masih dapat disunting pengirim.',
  },
  submitted: {
    id: 'submitted',
    label: 'Diajukan',
    tone: 'info',
    icon: Send,
    description: 'Paket pengajuan diterima; menunggu penugasan reviewer.',
  },
  internal_review: {
    id: 'internal_review',
    label: 'Review QC Internal',
    tone: 'active',
    icon: SearchCheck,
    description: 'Sedang ditinjau QA/QC internal sebelum inspeksi.',
  },
  external_review: {
    id: 'external_review',
    label: 'Menunggu Keputusan Eksternal',
    tone: 'info',
    icon: Users,
    description: 'Menunggu keputusan owner/konsultan/pihak ketiga.',
  },
  scheduled: {
    id: 'scheduled',
    label: 'Terjadwal',
    tone: 'info',
    icon: CalendarClock,
    description: 'Tanggal & waktu inspeksi telah disepakati.',
  },
  in_progress: {
    id: 'in_progress',
    label: 'Inspeksi Berlangsung',
    tone: 'active',
    icon: Timer,
    description: 'Inspeksi sedang dilaksanakan di lapangan.',
  },
  accepted: {
    id: 'accepted',
    label: 'Diterima',
    tone: 'success',
    icon: CircleCheck,
    description:
      'Diterima untuk lingkup & revisi yang ditinjau. Bukan otomatis rilis hold point.',
  },
  correction_required: {
    id: 'correction_required',
    label: 'Perlu Perbaikan',
    tone: 'warning',
    icon: FileWarning,
    description: 'Dikembalikan untuk perbaikan; bukan inkonformitas teknis.',
  },
  clarification_required: {
    id: 'clarification_required',
    label: 'Perlu Klarifikasi',
    tone: 'warning',
    icon: MessageCircleQuestion,
    description: 'Informasi tidak lengkap/ambigu; bukan kegagalan teknis.',
  },
  reinspection_requested: {
    id: 'reinspection_requested',
    label: 'Re-Inspeksi Diminta',
    tone: 'active',
    icon: RefreshCw,
    description: 'Perbaikan diajukan kembali untuk pemeriksaan ulang.',
  },
  deferred: {
    id: 'deferred',
    label: 'Ditunda',
    tone: 'neutral',
    icon: CalendarX,
    description: 'Ditunda/dijadwalkan ulang dengan alasan tercatat.',
  },
  unable_to_inspect: {
    id: 'unable_to_inspect',
    label: 'Tidak Dapat Diinspeksi',
    tone: 'warning',
    icon: EyeOff,
    description: 'Pekerjaan tidak siap / reviewer tidak hadir.',
  },
  withdrawn: {
    id: 'withdrawn',
    label: 'Ditarik',
    tone: 'neutral',
    icon: Undo2,
    description: 'Ditarik pengirim; riwayat tetap tersimpan.',
  },
  cancelled: {
    id: 'cancelled',
    label: 'Dibatalkan',
    tone: 'neutral',
    icon: Ban,
    description: 'Dibatalkan; riwayat tetap tersimpan.',
  },
} satisfies Record<string, StatusDef>

export type InspectionStatusId = keyof typeof INSPECTION_STATUS

/* ------------------------------------------------------------
 * 2. Status temuan — PRD §10.2
 * ------------------------------------------------------------ */
export const FINDING_STATUS = {
  open: {
    id: 'open',
    label: 'Terbuka',
    tone: 'warning',
    icon: TriangleAlert,
    description: 'Temuan tercatat, belum ditugaskan.',
  },
  assigned: {
    id: 'assigned',
    label: 'Ditugaskan',
    tone: 'active',
    icon: UserPlus,
    description: 'Penanggung jawab telah ditetapkan.',
  },
  action_in_progress: {
    id: 'action_in_progress',
    label: 'Tindakan Berjalan',
    tone: 'active',
    icon: Wrench,
    description: 'Perbaikan sedang dikerjakan.',
  },
  action_submitted: {
    id: 'action_submitted',
    label: 'Tindakan Diajukan',
    tone: 'info',
    icon: Send,
    description: 'Bukti perbaikan diajukan untuk diverifikasi.',
  },
  verification_pending: {
    id: 'verification_pending',
    label: 'Menunggu Verifikasi',
    tone: 'warning',
    icon: Hourglass,
    description: 'Menunggu verifikasi independen; belum boleh ditutup.',
  },
  verified: {
    id: 'verified',
    label: 'Terverifikasi',
    tone: 'success',
    icon: BadgeCheck,
    description: 'Perbaikan diverifikasi oleh verifikator.',
  },
  verification_rejected: {
    id: 'verification_rejected',
    label: 'Verifikasi Ditolak',
    tone: 'danger',
    icon: CircleX,
    description: 'Verifikasi gagal; tindakan kembali aktif dengan alasan.',
  },
  closed: {
    id: 'closed',
    label: 'Ditutup',
    tone: 'neutral',
    icon: CircleCheck,
    description: 'Ditutup setelah seluruh syarat terpenuhi.',
  },
  deferred: {
    id: 'deferred',
    label: 'Ditangguhkan',
    tone: 'neutral',
    icon: CirclePause,
    description: 'Ditangguhkan dengan alasan & otoritas.',
  },
  superseded: {
    id: 'superseded',
    label: 'Digantikan',
    tone: 'neutral',
    icon: Replace,
    description: 'Digantikan catatan lain; tertaut ke catatan pengganti.',
  },
  disputed: {
    id: 'disputed',
    label: 'Diperselisihkan',
    tone: 'danger',
    icon: Scale,
    description: 'Diperselisihkan; tetap terlihat hingga selesai ditinjau.',
  },
} satisfies Record<string, StatusDef>

export type FindingStatusId = keyof typeof FINDING_STATUS

/* ------------------------------------------------------------
 * 3. Klasifikasi temuan — PRD FR-FA-02
 *    (fakta ≠ klasifikasi ≠ disposisi)
 * ------------------------------------------------------------ */
export const FINDING_CLASSIFICATION = {
  observation: {
    id: 'observation',
    label: 'Observasi',
    tone: 'info',
    icon: Eye,
    description: 'Catatan kondisi tanpa tindakan formal.',
  },
  admin_comment: {
    id: 'admin_comment',
    label: 'Komentar Administratif',
    tone: 'neutral',
    icon: FileText,
    description: 'Kelengkapan administrasi, bukan kegagalan teknis.',
  },
  potential_nc: {
    id: 'potential_nc',
    label: 'Potensi Inkonformitas',
    tone: 'warning',
    icon: TriangleAlert,
    description: 'Diduga menyimpang; menunggu investigasi.',
  },
  confirmed_nc: {
    id: 'confirmed_nc',
    label: 'Inkonformitas Terkonfirmasi',
    tone: 'danger',
    icon: OctagonAlert,
    description: 'Penyimpangan terkonfirmasi terhadap persyaratan.',
  },
} satisfies Record<string, StatusDef>

export type FindingClassificationId = keyof typeof FINDING_CLASSIFICATION

/* ------------------------------------------------------------
 * 4. Status hold point — PRD §10.3
 *    "Accepted" ≠ "Released" — dua hal yang berbeda.
 * ------------------------------------------------------------ */
export const HOLD_POINT_STATUS = {
  not_due: {
    id: 'not_due',
    label: 'Belum Jatuh Tempo',
    tone: 'neutral',
    icon: CircleDashed,
    description: 'Hold point belum mendekati jadwal.',
  },
  approaching: {
    id: 'approaching',
    label: 'Mendekati',
    tone: 'warning',
    icon: Hourglass,
    description: 'Mendekati jadwal; persiapan rilis perlu dimulai.',
  },
  awaiting_inspection: {
    id: 'awaiting_inspection',
    label: 'Menunggu Inspeksi',
    tone: 'info',
    icon: ClipboardCheck,
    description: 'Inspeksi hold point belum dilaksanakan.',
  },
  awaiting_release: {
    id: 'awaiting_release',
    label: 'Menunggu Rilis',
    tone: 'warning',
    icon: Lock,
    description: 'Inspeksi selesai; menunggu rilis dari otoritas berwenang.',
  },
  released: {
    id: 'released',
    label: 'Dirilis',
    tone: 'success',
    icon: LockOpen,
    description: 'Rilis tercatat oleh otoritas; aktivitas berikutnya boleh jalan.',
  },
  blocked_prerequisites: {
    id: 'blocked_prerequisites',
    label: 'Terblokir — Prasyarat',
    tone: 'danger',
    icon: OctagonAlert,
    description: 'Prasyarat rilis belum terpenuhi.',
  },
  blocked_finding: {
    id: 'blocked_finding',
    label: 'Terblokir — Temuan',
    tone: 'danger',
    icon: OctagonAlert,
    description: 'Masih ada temuan yang belum selesai.',
  },
  waiver_recorded: {
    id: 'waiver_recorded',
    label: 'Pengecualian Tercatat',
    tone: 'warning',
    icon: Stamp,
    description: 'Waiver dicatat otoritas sesuai prosedur proyek.',
  },
} satisfies Record<string, StatusDef>

export type HoldPointStatusId = keyof typeof HOLD_POINT_STATUS

/* ------------------------------------------------------------
 * 5. Jenis titik inspeksi — PRD FR-HP-01
 * ------------------------------------------------------------ */
export const POINT_TYPE = {
  hold: {
    id: 'hold',
    label: 'Hold Point',
    tone: 'warning',
    icon: OctagonAlert,
    description: 'Pekerjaan tidak boleh lanjut sebelum dirilis pihak berwenang.',
  },
  witness: {
    id: 'witness',
    label: 'Witness Point',
    tone: 'info',
    icon: Eye,
    description: 'Titik pemberitahuan/kehadiran; efek ketidakhadiran sesuai prosedur.',
  },
  review: {
    id: 'review',
    label: 'Review Point',
    tone: 'neutral',
    icon: FileSearch,
    description: 'Tinjauan dokumen/rekaman; bukan hold fisik.',
  },
  surveillance: {
    id: 'surveillance',
    label: 'Surveillance',
    tone: 'neutral',
    icon: ScanSearch,
    description: 'Pengawasan berkala tanpa henti/tinjauan wajib.',
  },
} satisfies Record<string, StatusDef>

export type PointTypeId = keyof typeof POINT_TYPE

/* ------------------------------------------------------------
 * 6. Jenis tindakan di inbox (PRD FR-NO-02) — untuk ikon baris
 * ------------------------------------------------------------ */
export const ACTION_TYPE_ICON: Record<string, LucideIcon> = {
  review_inspection: ClipboardCheck,
  complete_submission: FileWarning,
  respond_finding: MessageSquare,
  verify_action: BadgeCheck,
  schedule_inspection: CalendarClock,
  resolve_overdue: AlarmClock,
  record_external_decision: Stamp,
  clarification: CircleHelp,
}

/* ------------------------------------------------------------
 * 7. Peran demo (role switcher) — PRD §13
 * ------------------------------------------------------------ */
export const ROLE = {
  project_manager: { id: 'project_manager', label: 'Project Manager', icon: HardHat },
  site_engineer: { id: 'site_engineer', label: 'Site Engineer', icon: FilePenLine },
  qc_inspector: { id: 'qc_inspector', label: 'QA/QC Inspector', icon: SearchCheck },
  quality_manager: { id: 'quality_manager', label: 'Quality Manager', icon: Stamp },
  external: { id: 'external', label: 'Konsultan / Owner', icon: Landmark },
  viewer: { id: 'viewer', label: 'Management Viewer', icon: CircleEllipsis },
} satisfies Record<string, { id: string; label: string; icon: LucideIcon }>

export type RoleId = keyof typeof ROLE

/** Palet label tone → kelas token (dipakai Badge/StatusBadge/Callout). */
export const TONE_STYLES = {
  neutral: {
    badge: 'bg-tone-neutral-bg text-tone-neutral-text border-tone-neutral-border',
    dot: 'bg-gray-400',
    text: 'text-ink-secondary',
    icon: 'text-gray-500',
  },
  brand: {
    badge: 'bg-tone-brand-bg text-tone-brand-text border-tone-brand-border',
    dot: 'bg-brand-500',
    text: 'text-brand-700',
    icon: 'text-brand-600',
  },
  info: {
    badge: 'bg-tone-info-bg text-tone-info-text border-tone-info-border',
    dot: 'bg-sky-500',
    text: 'text-sky-800',
    icon: 'text-sky-600',
  },
  active: {
    badge: 'bg-tone-active-bg text-tone-active-text border-tone-active-border',
    dot: 'bg-violet-500',
    text: 'text-violet-700',
    icon: 'text-violet-600',
  },
  success: {
    badge: 'bg-tone-success-bg text-tone-success-text border-tone-success-border',
    dot: 'bg-green-500',
    text: 'text-green-700',
    icon: 'text-green-600',
  },
  warning: {
    badge: 'bg-tone-warning-bg text-tone-warning-text border-tone-warning-border',
    dot: 'bg-amber-500',
    text: 'text-amber-800',
    icon: 'text-amber-600',
  },
  danger: {
    badge: 'bg-tone-danger-bg text-tone-danger-text border-tone-danger-border',
    dot: 'bg-red-500',
    text: 'text-red-800',
    icon: 'text-red-600',
  },
} as const

export type ToneStyleKey = keyof typeof TONE_STYLES
