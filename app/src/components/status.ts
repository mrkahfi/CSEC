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
 * Kosakata status operasional kontraktor Indonesia:
 * - Ajukan Pemeriksaan (Inspection Request / WIR)
 * - Checklist Pemeriksaan / Acuan Pemeriksaan (ITP)
 * - Temuan Pekerjaan & Punch List (NCR / Defect)
 * - Tindak Lanjut Perbaikan (Corrective Action)
 * - Verifikasi Perbaikan (Re-inspection)
 * - Menunggu Pemeriksaan / Persetujuan (Hold Point)
 * - Hasil Pemeriksaan (Sesuai, Perlu Perbaikan, Perlu Klarifikasi, Belum Diperiksa)
 * - Pemeriksaan Kualitas (Quality Control)
 *
 * Ikon adalah isyarat non-warna sehingga status tetap terbaca
 * untuk pengguna buta warna.
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
    label: 'Sesuai',
    tone: 'success',
    icon: CircleCheck,
    description:
      'Pekerjaan sesuai checklist/acuan pemeriksaan. Bukan izin atau persetujuan kontraktual otomatis.',
  },
  correction_required: {
    id: 'correction_required',
    label: 'Perlu Perbaikan',
    tone: 'warning',
    icon: FileWarning,
    description: 'Catatan pekerjaan yang perlu diperbaiki; bukan inkonformitas teknis formal.',
  },
  clarification_required: {
    id: 'clarification_required',
    label: 'Perlu Klarifikasi',
    tone: 'warning',
    icon: MessageCircleQuestion,
    description: 'Informasi atau lingkup belum lengkap/jelas; bukan kegagalan teknis.',
  },
  reinspection_requested: {
    id: 'reinspection_requested',
    label: 'Verifikasi Perbaikan',
    tone: 'active',
    icon: RefreshCw,
    description: 'Bukti perbaikan diajukan untuk verifikasi lapangan.',
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
    label: 'Catatan / Punch List',
    tone: 'info',
    icon: Eye,
    description: 'Catatan pekerjaan minor atau punch list sebelum serah terima.',
  },
  admin_comment: {
    id: 'admin_comment',
    label: 'Komentar Administratif',
    tone: 'neutral',
    icon: FileText,
    description: 'Kelengkapan administrasi atau koordinasi gambar.',
  },
  potential_nc: {
    id: 'potential_nc',
    label: 'Perlu Perbaikan',
    tone: 'warning',
    icon: TriangleAlert,
    description: 'Pekerjaan tidak sesuai checklist/spesifikasi, perlu perbaikan.',
  },
  confirmed_nc: {
    id: 'confirmed_nc',
    label: 'Temuan Kritis (NCR)',
    tone: 'danger',
    icon: OctagonAlert,
    description: 'Inkonformitas signifikan yang memerlukan penanganan khusus.',
  },
} satisfies Record<string, StatusDef>

export type FindingClassificationId = keyof typeof FINDING_CLASSIFICATION

/* ------------------------------------------------------------
 * 4. Status titik kendali / persetujuan — PRD §10.3
 *    "Sesuai" ≠ "Persetujuan Otomatis" — alur terstruktur.
 * ------------------------------------------------------------ */
export const HOLD_POINT_STATUS = {
  not_due: {
    id: 'not_due',
    label: 'Belum Mulai',
    tone: 'neutral',
    icon: CircleDashed,
    description: 'Pekerjaan belum mencapai tahap pemeriksaan ini.',
  },
  approaching: {
    id: 'approaching',
    label: 'Mendekati',
    tone: 'warning',
    icon: Hourglass,
    description: 'Mendekati jadwal pemeriksaan kualitas.',
  },
  awaiting_inspection: {
    id: 'awaiting_inspection',
    label: 'Menunggu Pemeriksaan',
    tone: 'info',
    icon: ClipboardCheck,
    description: 'Pekerjaan siap dan menunggu pemeriksaan lapangan.',
  },
  awaiting_release: {
    id: 'awaiting_release',
    label: 'Menunggu Persetujuan',
    tone: 'warning',
    icon: Lock,
    description: 'Pemeriksaan selesai; menunggu persetujuan tahap lanjut.',
  },
  released: {
    id: 'released',
    label: 'Disetujui',
    tone: 'success',
    icon: LockOpen,
    description: 'Persetujuan tercatat; tahap pekerjaan berikutnya boleh jalan.',
  },
  blocked_prerequisites: {
    id: 'blocked_prerequisites',
    label: 'Tertahan (Prasyarat)',
    tone: 'danger',
    icon: OctagonAlert,
    description: 'Prasyarat pemeriksaan sebelumnya belum selesai.',
  },
  blocked_finding: {
    id: 'blocked_finding',
    label: 'Tertahan (Temuan Terbuka)',
    tone: 'danger',
    icon: OctagonAlert,
    description: 'Masih ada temuan pekerjaan yang belum diperbaiki.',
  },
  waiver_recorded: {
    id: 'waiver_recorded',
    label: 'Dispensasi Disetujui',
    tone: 'warning',
    icon: Stamp,
    description: 'Pengecualian khusus disetujui pihak berwenang.',
  },
} satisfies Record<string, StatusDef>

export type HoldPointStatusId = keyof typeof HOLD_POINT_STATUS

/* ------------------------------------------------------------
 * 5. Jenis titik kendali pemeriksaan
 * ------------------------------------------------------------ */
export const POINT_TYPE = {
  hold: {
    id: 'hold',
    label: 'Menunggu Persetujuan',
    tone: 'warning',
    icon: OctagonAlert,
    description: 'Pekerjaan tahap berikutnya tidak boleh lanjut sebelum pemeriksaan disetujui.',
  },
  witness: {
    id: 'witness',
    label: 'Pemeriksaan Bersama',
    tone: 'info',
    icon: Eye,
    description: 'Pemeriksaan lapangan bersama pengawas/konsultan sesuai jadwal.',
  },
  review: {
    id: 'review',
    label: 'Review Acuan',
    tone: 'neutral',
    icon: FileSearch,
    description: 'Review gambar kerja atau dokumen acuan pelaksanaan.',
  },
  surveillance: {
    id: 'surveillance',
    label: 'Pemeriksaan Berkala',
    tone: 'neutral',
    icon: ScanSearch,
    description: 'Pengawasan berkala rutin saat pekerjaan berjalan.',
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
  site_engineer: { id: 'site_engineer', label: 'Site Engineer / Pelaksana', icon: FilePenLine },
  qc_inspector: { id: 'qc_inspector', label: 'Pengawas Kualitas / QC', icon: SearchCheck },
  quality_manager: { id: 'quality_manager', label: 'Quality Lead / Manajer Mutu', icon: Stamp },
  external: { id: 'external', label: 'Konsultan / Owner', icon: Landmark },
  viewer: { id: 'viewer', label: 'Manajemen Operasi', icon: CircleEllipsis },
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
