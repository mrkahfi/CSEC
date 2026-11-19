import { Link } from 'react-router-dom'
import {
  CalendarClock, ChevronDown, ChevronRight, MapPin,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { INSPECTION_STATUS, FINDING_STATUS, FINDING_CLASSIFICATION, POINT_TYPE } from '@/components/status'
import { ACTIVITY_STATUS, fProject, ITP_POINTS, type FActivity, type FFinding, type FWir } from '@/field/data'
import { ProgressBar } from '@/field/ui'
import { formatRelative } from '@/lib/format'

/* ============================================================
 * KARTU & BARIS BERSAMA ANTAR LAYAR
 * ============================================================ */

export function greeting() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 19) return 'Selamat sore'
  return 'Selamat malam'
}

export function todayLabel() {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
}

/** Pemilih proyek aktif di kepala layar (PRD §5.2). */
export function ProjectChip({ projectId, to = '/field/proyek' }: { projectId: string; to?: string }) {
  const p = fProject(projectId)
  return (
    <Link
      to={to}
      className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-line-subtle bg-surface px-3.5 py-2 shadow-xs transition-colors active:bg-hover"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-tone-brand-bg text-2xs font-bold text-brand-700">
        {p.code}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
        <span className="block truncate text-xs text-ink-muted">{p.client}</span>
      </span>
      <ChevronDown {...iconProps(15)} className="shrink-0 text-ink-disabled" />
    </Link>
  )
}

/** Kartu permintaan inspeksi ringkas (PRD §8.1 / §9.1). */
export function WirCard({ wir, meta }: { wir: FWir; meta?: string }) {
  const status = INSPECTION_STATUS[wir.status]
  const point = ITP_POINTS.find((p) => p.id === wir.itpPointId)
  return (
    <Link
      to={`/field/inspeksi/${wir.id}`}
      className="block rounded-xl border border-line-subtle bg-surface p-3.5 shadow-xs transition-colors active:bg-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-ink-muted bg-sunken px-1.5 py-0.2 rounded border border-line-subtle">{wir.ref}</span>
            {wir.discipline && (
              <span className="rounded bg-brand-50 px-1.5 py-0.2 text-[10px] font-semibold text-brand-700 border border-brand-200">
                {wir.discipline}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-md leading-5 font-semibold text-ink">{wir.activityType ?? wir.title}</p>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        {wir.targetScope && (
          <span className="rounded bg-sunken px-1.5 py-0.2 font-mono text-[10px] text-ink-secondary border border-line-subtle">
            {wir.targetScope}
          </span>
        )}
        <span className="flex items-center gap-1 truncate"><MapPin {...iconProps(11)} /> {wir.location}</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {point && <Badge size="sm" tone={POINT_TYPE[point.type].tone}>{POINT_TYPE[point.type].label}</Badge>}
        {meta && (
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <CalendarClock {...iconProps(12)} /> {meta}
          </span>
        )}
      </div>
    </Link>
  )
}

/** Kartu temuan ringkas (PRD §10.1). */
export function FindingCard({ f }: { f: FFinding }) {
  const status = FINDING_STATUS[f.status]
  const cls = FINDING_CLASSIFICATION[f.classification]
  return (
    <Link
      to={`/field/temuan/${f.id}`}
      className="block rounded-xl border border-line-subtle bg-surface p-3.5 shadow-xs transition-colors active:bg-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-ink-muted bg-sunken px-1.5 py-0.2 rounded border border-line-subtle whitespace-nowrap shrink-0">{f.ref}</span>
            {f.trade && (
              <span className="rounded bg-brand-50 px-1.5 py-0.2 text-[10px] font-semibold text-brand-700 border border-brand-200 whitespace-nowrap shrink-0">
                {f.trade}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-semibold text-ink leading-snug">{f.defectType ?? f.title}</p>
          {f.element && (
            <p className="text-2xs text-ink-muted mt-0.5">{f.element}</p>
          )}
        </div>
        <StatusBadge status={status} size="sm" />
      </div>
      <p className="mt-1.5 flex items-center gap-1 truncate text-xs text-ink-muted">
        <MapPin {...iconProps(12)} /> {f.location}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <Badge size="sm" tone={cls.tone}>{cls.label}</Badge>
        <span className="inline-flex items-center gap-0.5 text-xs text-ink-muted">
          {f.responsible} <ChevronRight {...iconProps(12)} />
        </span>
      </div>
    </Link>
  )
}

/** Baris aktivitas pekerjaan dengan progres (PRD §7.7). */
export function ActivityRow({ a }: { a: FActivity }) {
  const st = ACTIVITY_STATUS[a.status]
  return (
    <Link
      to={`/field/pekerjaan/${a.id}`}
      className="block rounded-xl border border-line-subtle bg-surface p-3.5 shadow-xs transition-colors active:bg-hover"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-md leading-5 font-semibold text-ink">{a.name}</p>
          <p className="mt-0.5 truncate text-sm text-ink-muted">{a.location} · {a.subkon}</p>
        </div>
        <Badge size="sm" tone={st.tone} dot>{st.label}</Badge>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <ProgressBar value={a.progressPct} className="flex-1" />
        <span className="tnum shrink-0 text-xs font-semibold text-ink-secondary">{a.progressPct}%</span>
      </div>
      <p className="mt-1.5 truncate text-xs text-ink-muted">{a.lastUpdate} · {formatRelative(a.lastUpdateAt)}</p>
    </Link>
  )
}

/** Ubin aksi cepat berikon (PRD §5.3). */
export function QuickTile({
  icon: IconCmp, label, onClick,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-19 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-line-subtle bg-surface p-2 text-center shadow-xs transition-colors active:bg-hover"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-tone-brand-bg text-brand-600">
        <IconCmp {...iconProps(17)} />
      </span>
      <span className="text-xs leading-4 font-medium text-ink">{label}</span>
    </button>
  )
}

/** Header seksi dengan tautan "Lihat semua". */
export function SeeAll({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-0.5 text-xs font-medium text-brand-700">
      {children} <ChevronRight {...iconProps(12)} strokeWidth={2.2} />
    </Link>
  )
}

/** Kartu kecil untuk sepasang foto sebelum/sesudah (PRD FO-30). */
export function BeforeAfter({
  before, after,
}: {
  before: { title: string; gradient?: string }
  after: { title: string; gradient?: string }
}) {
  const tile = (p: { title: string }, label: string, tone: string) => (
    <div className={cn('flex aspect-video flex-1 flex-col justify-end rounded-lg border border-line-subtle bg-gradient-to-br from-sky-100 to-brand-50 p-2', tone)}>
      <span className="rounded-full bg-gray-900/75 px-1.5 py-0.5 text-2xs font-semibold text-white">{label}</span>
      <span className="mt-1 truncate-2 text-xs leading-4 font-medium text-gray-800">{p.title}</span>
    </div>
  )
  return (
    <div className="flex gap-2">
      {tile(before, 'Sebelum', 'to-amber-50')}
      {tile(after, 'Sesudah', '')}
    </div>
  )
}
