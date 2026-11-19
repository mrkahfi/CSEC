import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FileWarning,
  History,
  Info,
  Lock,
  MapPin,
  Database,
  OctagonAlert,
  TrendingUp,
  TriangleAlert,
  User,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { FINDING_CLASSIFICATION, FINDING_STATUS, TONE_STYLES } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { StatTile } from '@/components/ui/StatTile'
import { PlanActualBar, PlanActualDelta } from '@/components/ui/PlanActual'
import { Select } from '@/components/ui/Input'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import { UnitDetailModal } from '@/components/UnitDetailModal'
import { formatDate, formatRelative } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import { useDemo } from '@/demo/DemoContext'
import {
  ACTIVITY,
  DAILY_REPORTS,
  EVENT_ICON,
  MILESTONE_STATUS,
  PROJECT_STATUS,
  PROJECTS,
  PROJECT_UNITS,
  PROJECT_HEALTH,
  CONTROL_POINTS,
  attentionProjects,
  healthOf,
  milestonesAtRisk,
  portfolioCounts,
  priorityIssues,
  progressOf,
  projectPulse,
  projectName,
  reportDueToday,
  type Project,
  type ProjectUnit,
} from '@/demo/data'

/** Pita pulse — proporsi status inspeksi per proyek (bukan progres fisik). */
function PulseBar({ projectId }: { projectId: string }) {
  const segments = projectPulse(projectId)
  const total = segments.reduce((a, s) => a + s.count, 0)
  const critical = segments.filter((s) => s.tone === 'warning' || s.tone === 'danger')
  const criticalCount = critical.reduce((a, s) => a + s.count, 0)
  const tooltipText = segments.map((s) => `${s.count} ${s.label}`).join(' • ')

  return (
    <div title={`Alur pemeriksaan: ${tooltipText}`}>
      <div className="flex h-1.5 gap-px overflow-hidden rounded-full" role="img" aria-label={`Pulse: ${tooltipText}`}>
        {segments.map((s) => (
          <span key={s.label} className={TONE_STYLES[s.tone].dot} style={{ flexGrow: s.count }} />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-2xs text-ink-muted">
        <span className="tnum font-medium text-ink-secondary">{total} inspeksi</span>
        {criticalCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            {criticalCount} perlu tindakan
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Lancar
          </span>
        )}
      </div>
    </div>
  )
}

/** Kartu proyek pada direktori — kini dengan kesehatan & progres. */
function ProjectCard({ p }: { p: Project }) {
  const archived = p.status === 'closed'
  const pts = CONTROL_POINTS.filter((c) => c.projectId === p.id)
  const critical = pts.filter((c) => c.pointType === 'hold' && c.status !== 'released' && c.status !== 'not_due')
  const st = PROJECT_STATUS[p.status]
  const health = healthOf(p.id)
  const hst = PROJECT_HEALTH[health.healthId]
  const prog = progressOf(p.id)
  return (
    <Link
      to={`/dashboard/proyek/${p.id}`}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-4 shadow-xs transition-all duration-100',
        'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm',
        archived && 'opacity-75 saturate-50',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-secondary border border-line-subtle shadow-2xs font-mono text-xs font-bold">
            {p.code}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink group-hover:text-brand-700">{p.name}</p>
            <div className="mt-0.5 flex items-center gap-2 text-2xs text-ink-muted">
              <span className="flex items-center gap-0.5"><MapPin {...iconProps(10)} /> {p.location}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge tone={st.tone} size="sm" dot>{st.label}</Badge>
          {health.healthId !== 'on_track' && !archived && (
            <StatusBadge status={hst} size="sm" emphasis={health.healthId === 'behind' ? 'strong' : 'subtle'} />
          )}
        </div>
      </div>

      {prog && prog.weekly.length > 0 && (
        <div className="space-y-1">
          <PlanActualBar plan={prog.planPct} actual={prog.actualPct} label={`Progres ${p.name}: realisasi ${prog.actualPct}% dari rencana ${prog.planPct}%`} />
          <div className="flex items-center justify-between text-2xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <span className="tnum font-semibold text-ink">{prog.actualPct}%</span>
              <span>realisasi (rencana {prog.planPct}%)</span>
            </div>
            <PlanActualDelta plan={prog.planPct} actual={prog.actualPct} />
          </div>
        </div>
      )}

      <PulseBar projectId={p.id} />

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-subtle pt-2.5 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1 text-2xs">
          <ClipboardCheck {...iconProps(12)} className="text-ink-muted" /> PM: <span className="font-medium text-ink-secondary">{p.pm}</span>
        </span>
        {critical.length > 0 && (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-2xs font-semibold text-amber-700 border border-amber-200">
            <Lock {...iconProps(11)} /> {critical.length} hold point
          </span>
        )}
        {archived && <span className="text-ink-disabled text-2xs">hanya-baca</span>}
        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
          <span>Buka</span>
          <ExternalLink {...iconProps(11)} />
        </span>
      </div>
    </Link>
  )
}

/** Kartu "perlu perhatian": exception-first, format dashboard operasional. */
function AttentionCard({ p }: { p: Project }) {
  const { scenario } = useDemo()
  const isAruReleased = p.id === 'aru' && scenario.holdPointReleased
  const isNawReleased = p.id === 'naw' && scenario.holdPointReleased

  const baseHealth = healthOf(p.id)
  const health = (isAruReleased || isNawReleased)
    ? {
        healthId: 'on_track' as const,
        headline: isNawReleased
          ? 'Izin tahap kritis Cluster Nawasena telah dirilis oleh Quality Manager.'
          : 'Siklus cor lantai 8 telah dirilis oleh Quality Manager.',
        blockerSummary: {
          badgeLabel: 'Siap Lanjut',
          tone: 'success' as const,
          targetUnit: isNawReleased ? 'Unit A-05' : 'Lantai 8',
          component: 'Pekerjaan Telah Diverifikasi',
          prerequisiteRef: isNawReleased ? 'CP-NW-02' : 'HP-AR-02',
          prerequisiteAction: 'Rilis resmi diberikan Quality Lead',
        },
        reasons: isNawReleased
          ? [
              { id: 'r1', severity: 'info' as const, refLabel: 'INSP-NW-2026-0142', label: 'Inspeksi struktur Unit A-05 telah disetujui (Sesuai).', to: '/dashboard/proyek/naw' },
            ]
          : [
              { id: 'r1', severity: 'info' as const, refLabel: 'HP-AR-02', label: 'Rilis resmi hold point telah dicatat oleh Ratna Dewi.', to: '/dashboard/proyek/aru?titik=hp-ar-02' },
              { id: 'r2', severity: 'info' as const, refLabel: 'WIR-AR-2026-0142', label: 'Inspeksi tulangan pelat L8 telah disetujui (diterima).', to: '/dashboard/inspeksi/wir-ar-0142' },
            ],
      }
    : baseHealth

  const hst = PROJECT_HEALTH[health.healthId]
  const prog = progressOf(p.id)
  const riskyMilestone = milestonesAtRisk().find((m) => m.projectId === p.id)
  const delayed = health.healthId === 'behind'

  return (
    <div
      className={cn(
        'group flex flex-col rounded-xl border bg-surface p-4 shadow-2xs transition-all duration-150 hover:shadow-xs',
        delayed ? 'border-red-200 ring-1 ring-red-100' : (isAruReleased || isNawReleased) ? 'border-emerald-200' : 'border-amber-200',
      )}
    >
      {/* Header Proyek dengan Logo/Badge Kode */}
      <div className="flex items-start justify-between gap-3 border-b border-line-subtle pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold shadow-2xs',
            delayed
              ? 'bg-red-50 text-red-700 border border-red-200/80'
              : (isAruReleased || isNawReleased)
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                : 'bg-amber-50 text-amber-700 border border-amber-200/80'
          )}>
            {p.code}
          </span>
          <div className="min-w-0">
            <Link to={`/dashboard/proyek/${p.id}`} className="block truncate text-sm font-bold text-ink hover:text-brand-700 transition-colors">
              {p.name}
            </Link>
            <div className="flex items-center gap-2 text-2xs text-ink-muted">
              <span className="flex items-center gap-0.5"><MapPin {...iconProps(10)} /> {p.location}</span>
              <span className="flex items-center gap-0.5"><User {...iconProps(10)} /> {p.pm}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <StatusBadge status={hst} size="sm" emphasis={delayed ? 'strong' : 'subtle'} />
          <Link
            to={`/dashboard/proyek/${p.id}`}
            title="Buka detail proyek"
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-hover hover:text-ink transition-colors"
          >
            <ExternalLink {...iconProps(13)} />
          </Link>
        </div>
      </div>

      {/* Meteran Progres Aktual vs Rencana (Visual KPI) */}
      {prog && prog.weekly.length > 0 && (
        <div className="my-3 rounded-lg border border-line-subtle bg-sunken/60 p-2.5 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold tracking-tight text-ink tnum">
                {prog.actualPct}%
              </span>
              <span className="text-2xs text-ink-muted font-medium">
                / {prog.planPct}% rencana
              </span>
            </div>
            <PlanActualDelta plan={prog.planPct} actual={prog.actualPct} />
          </div>
          <PlanActualBar plan={prog.planPct} actual={prog.actualPct} label={`Progres: ${prog.actualPct}% dari ${prog.planPct}%`} />
        </div>
      )}

      {/* Sinyal Operasional / Blocker Callout: Clean, Tokenized */}
      <div className="space-y-1.5 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          Kendala Operasional
        </span>
        <div className={cn(
          'flex items-start gap-2.5 rounded-lg p-2.5 text-xs border',
          delayed
            ? 'bg-red-50/70 border-red-200 text-red-950'
            : (isAruReleased || isNawReleased)
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/70 border-amber-200 text-amber-950'
        )}>
          {delayed ? (
            <OctagonAlert {...iconProps(15)} className="shrink-0 mt-0.5 text-red-600" />
          ) : (isAruReleased || isNawReleased) ? (
            <CheckCircle2 {...iconProps(15)} className="shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <TriangleAlert {...iconProps(15)} className="shrink-0 mt-0.5 text-amber-600" />
          )}
          <div className="min-w-0 flex-1">
            {health.blockerSummary ? (
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={cn(
                    "rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider",
                    health.blockerSummary.tone === 'danger' ? 'bg-red-100 text-red-800' :
                    health.blockerSummary.tone === 'warning' ? 'bg-amber-100 text-amber-900' :
                    health.blockerSummary.tone === 'success' ? 'bg-emerald-100 text-emerald-900' :
                    'bg-brand-100 text-brand-900'
                  )}>
                    {health.blockerSummary.badgeLabel}
                  </span>
                  <span className="font-mono text-xs font-bold text-ink">{health.blockerSummary.targetUnit}</span>
                  <span className="text-2xs text-ink-secondary truncate">{health.blockerSummary.component}</span>
                </div>
                {health.blockerSummary.prerequisiteRef && (
                  <div className="flex items-center gap-1.5 text-2xs pt-0.5">
                    <span className="text-ink-muted">Syarat:</span>
                    <Link
                      to={health.reasons[0]?.to ?? `/dashboard/proyek/${p.id}`}
                      className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface border border-line-subtle text-brand-700 hover:underline"
                    >
                      {health.blockerSummary.prerequisiteRef}
                    </Link>
                    <span className="text-ink-muted truncate">{health.blockerSummary.prerequisiteAction}</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <p className="font-semibold text-xs leading-snug">{health.headline}</p>
                {health.reasons[0]?.refLabel && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Link
                      to={health.reasons[0].to ?? `/dashboard/proyek/${p.id}`}
                      className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface border border-line-subtle text-ink hover:text-brand-700 hover:border-brand-300 transition-colors"
                    >
                      {health.reasons[0].refLabel}
                    </Link>
                    <span className="text-2xs text-ink-muted truncate">
                      {health.reasons[0].label.replace(/^[^:]+:\s*/, '')}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Milestone */}
      {riskyMilestone && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-subtle pt-2.5 text-2xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <CalendarClock {...iconProps(12)} className="shrink-0 text-ink-muted" />
            <span className="text-ink-muted font-medium shrink-0">Target:</span>
            <span className="font-mono text-ink-muted shrink-0">[{riskyMilestone.targetScope}]</span>
            <span className="font-semibold text-ink truncate">{riskyMilestone.activityName}</span>
          </div>
          <span className="shrink-0 tnum font-mono text-ink-muted bg-sunken px-1.5 py-0.5 rounded border border-line-subtle">
            {formatRelative(riskyMilestone.date)}
          </span>
        </div>
      )}
    </div>
  )
}

/** Tren ilustratif 4 minggu — angka statis demo. */
const TREND = [
  { w: 'M1', ok: 11, rework: 3 },
  { w: 'M2', ok: 14, rework: 2 },
  { w: 'M3', ok: 9, rework: 4 },
  { w: 'M4', ok: 16, rework: 3 },
]

/** Bagian visibilitas operasional unit & blok perumahan/ruko. */
function UnitOverviewSection() {
  const [activeTab, setActiveTab] = useState<'attention' | 'all' | 'naw_a' | 'naw_b' | 'naw_c' | 'rko'>('attention')
  const [selectedUnit, setSelectedUnit] = useState<ProjectUnit | null>(null)

  const attentionUnits = PROJECT_UNITS.filter((u) => u.status !== 'normal')

  const displayedUnits = PROJECT_UNITS.filter((u) => {
    if (activeTab === 'attention') return u.status !== 'normal'
    if (activeTab === 'all') return true
    if (activeTab === 'naw_a') return u.projectId === 'naw' && u.blockOrZone === 'Blok A'
    if (activeTab === 'naw_b') return u.projectId === 'naw' && u.blockOrZone === 'Blok B'
    if (activeTab === 'naw_c') return u.projectId === 'naw' && u.blockOrZone === 'Blok C'
    if (activeTab === 'rko') return u.projectId === 'rko'
    return true
  })

  // 4 kartu rollup blok/zona
  const blockRollups = [
    { id: 'naw_a' as const, name: 'Blok A', project: 'Nawasena', count: 8, avgProgress: 64, alert: '1 Perlu Periksa', tone: 'warning' as const },
    { id: 'naw_b' as const, name: 'Blok B', project: 'Nawasena', count: 8, avgProgress: 57, alert: '1 Periksa, 1 Temuan', tone: 'warning' as const },
    { id: 'naw_c' as const, name: 'Blok C', project: 'Nawasena', count: 8, avgProgress: 25, alert: '1 Tertunda', tone: 'danger' as const },
    { id: 'rko' as const, name: 'Ruko Harmoni', project: 'Ruko 3 Lantai', count: 6, avgProgress: 61, alert: '1 Temuan, 1 Tertunda', tone: 'warning' as const },
  ]

  return (
    <>
      <section aria-label="Status operasional unit dan blok" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-ink">Status Operasional Unit &amp; Blok</h2>
            <Badge tone="brand" size="sm" className="font-mono">{PROJECT_UNITS.length} unit portofolio</Badge>
          </div>

          <div className="flex flex-wrap gap-1 text-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('attention')}
              className={cn(
                'rounded-lg border px-2.5 py-1 font-semibold transition-all cursor-pointer',
                activeTab === 'attention'
                  ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-2xs'
                  : 'border-line-subtle bg-surface text-ink-secondary hover:text-ink hover:border-line-strong'
              )}
            >
              Perlu Perhatian ({attentionUnits.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'rounded-lg border px-2.5 py-1 font-medium transition-all cursor-pointer',
                activeTab === 'all'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-2xs font-semibold'
                  : 'border-line-subtle bg-surface text-ink-secondary hover:text-ink hover:border-line-strong'
              )}
            >
              Semua ({PROJECT_UNITS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('naw_a')}
              className={cn(
                'rounded-lg border px-2.5 py-1 font-medium transition-all cursor-pointer',
                activeTab === 'naw_a'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-2xs font-semibold'
                  : 'border-line-subtle bg-surface text-ink-secondary hover:text-ink hover:border-line-strong'
              )}
            >
              Blok A (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('naw_b')}
              className={cn(
                'rounded-lg border px-2.5 py-1 font-medium transition-all cursor-pointer',
                activeTab === 'naw_b'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-2xs font-semibold'
                  : 'border-line-subtle bg-surface text-ink-secondary hover:text-ink hover:border-line-strong'
              )}
            >
              Blok B (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('naw_c')}
              className={cn(
                'rounded-lg border px-2.5 py-1 font-medium transition-all cursor-pointer',
                activeTab === 'naw_c'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-2xs font-semibold'
                  : 'border-line-subtle bg-surface text-ink-secondary hover:text-ink hover:border-line-strong'
              )}
            >
              Blok C (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rko')}
              className={cn(
                'rounded-lg border px-2.5 py-1 font-medium transition-all cursor-pointer',
                activeTab === 'rko'
                  ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-2xs font-semibold'
                  : 'border-line-subtle bg-surface text-ink-secondary hover:text-ink hover:border-line-strong'
              )}
            >
              Ruko (6)
            </button>
          </div>
        </div>

        {/* 4 Rollup Blok/Zona */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {blockRollups.map((b) => {
            const isSelected = activeTab === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setActiveTab(isSelected ? 'all' : b.id)}
                className={cn(
                  'flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-100 cursor-pointer',
                  isSelected
                    ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-line-subtle bg-surface hover:border-line-strong hover:bg-hover'
                )}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-ink">{b.name}</span>
                    <span className="text-[10px] text-ink-muted">({b.count} unit)</span>
                  </div>
                  <span className="text-2xs text-ink-muted mt-0.5 block">{b.project}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-ink">{b.avgProgress}%</span>
                  <span className={cn(
                    'block text-[10px] font-semibold mt-0.5',
                    b.tone === 'danger' ? 'text-red-700' : 'text-amber-700'
                  )}>
                    {b.alert}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Grid Unit Terfokus — klik untuk membuka Dialog Detail */}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          {displayedUnits.map((u) => {
            const isNeedInspection = u.status === 'need_inspection'
            const isHasFindings = u.status === 'has_findings'
            const isDelayed = u.status === 'delayed'
            const isReadyHandover = u.status === 'ready_handover'

            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedUnit(u)}
                className={cn(
                  'group flex flex-col justify-between rounded-lg border bg-surface p-2.5 text-left transition-all hover:border-brand-500 hover:shadow-xs cursor-pointer',
                  isNeedInspection && 'border-amber-300 ring-1 ring-amber-200/60 bg-amber-50/15',
                  isHasFindings && 'border-orange-300 ring-1 ring-orange-200/60 bg-orange-50/15',
                  isDelayed && 'border-red-300 ring-1 ring-red-200/60 bg-red-50/15',
                  isReadyHandover && 'border-emerald-300 ring-1 ring-emerald-200/60 bg-emerald-50/15',
                  !isNeedInspection && !isHasFindings && !isDelayed && !isReadyHandover && 'border-line-subtle',
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-xs font-bold text-ink group-hover:text-brand-700">{u.code}</span>
                    <span className="tnum font-mono text-xs font-bold text-ink">{u.progressPct}%</span>
                  </div>

                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-sunken">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        isDelayed ? 'bg-red-500' : isReadyHandover ? 'bg-emerald-500' : isNeedInspection ? 'bg-amber-500' : 'bg-brand-500'
                      )}
                      style={{ width: `${u.progressPct}%` }}
                    />
                  </div>

                  <span className="mt-1.5 block truncate text-2xs font-medium text-ink-secondary" title={u.stage}>
                    {u.stage}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-1 border-t border-line-subtle/80 pt-1.5 text-2xs">
                  <div>
                    {isNeedInspection && (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Perlu Periksa
                      </span>
                    )}
                    {isHasFindings && (
                      <span className="inline-flex items-center gap-1 font-semibold text-orange-700 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        Ada Temuan
                      </span>
                    )}
                    {isDelayed && (
                      <span className="inline-flex items-center gap-1 font-semibold text-red-700 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Tertunda
                      </span>
                    )}
                    {isReadyHandover && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Punch List
                      </span>
                    )}
                    {!isNeedInspection && !isHasFindings && !isDelayed && !isReadyHandover && (
                      <span className="inline-flex items-center gap-1 text-ink-muted text-[10px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Sesuai
                      </span>
                    )}
                  </div>

                  <span className="text-ink-disabled group-hover:text-brand-600 transition-colors">
                    <ChevronRight {...iconProps(12)} />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Modal Dialog Detail Unit */}
      <UnitDetailModal
        unit={selectedUnit}
        open={!!selectedUnit}
        onClose={() => setSelectedUnit(null)}
      />
    </>
  )
}

/** Peristiwa berdampak tinggi — FR-OV-04. */
export function Ringkasan() {
  const loading = useSimulatedLoading()
  const navigate = useNavigate()
  const { scenario } = useDemo()
  const c = portfolioCounts()
  if (scenario.holdPointReleased) {
    c.holdAwaitingRelease = 0
  }

  const tiles: { label: string; value: number; icon: LucideIcon; emphasis?: 'neutral'|'warning'|'danger'|'success'; to: string }[] = [
    { label: 'Proyek Aktif', value: PROJECTS.filter(p => p.status === 'active').length, icon: Building2, to: '/dashboard/proyek' },
    { label: 'Unit Dikerjakan', value: c.scheduled + c.awaitingReview + 14, icon: TrendingUp, to: '/dashboard/proyek' },
    { label: 'Menunggu Review', value: c.awaitingReview, icon: ClipboardCheck, to: '/dashboard/inspeksi?set=review' },
    { label: 'Perlu Perbaikan', value: c.corrections, icon: FileWarning, emphasis: c.corrections > 0 ? 'warning' : 'neutral', to: '/dashboard/inspeksi?set=perbaikan' },
    { label: 'Temuan Terbuka', value: c.openFindings, icon: TriangleAlert, emphasis: c.openFindings > 0 ? 'warning' : 'neutral', to: '/dashboard/temuan?set=terbuka' },
    { label: 'Menunggu Verifikasi', value: c.overdueActions, icon: FileWarning, emphasis: c.overdueActions > 0 ? 'danger' : 'neutral', to: '/dashboard/temuan?set=overdue' },
    { label: 'Pekerjaan Tertunda', value: c.holdAwaitingRelease + 1, icon: CalendarClock, emphasis: (c.holdAwaitingRelease + 1) > 0 ? 'warning' : 'neutral', to: '/dashboard/temuan?set=overdue' },
  ]

  const impacts = ACTIVITY.filter((e) => e.impact).slice(0, 6)
  const attention = attentionProjects()
  const issues = priorityIssues().slice(0, 5)
  const riskyMs = milestonesAtRisk().slice(0, 5)
  const reports = [...DAILY_REPORTS].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 3)
  const reportMissing = PROJECTS.filter((p) => p.status !== 'closed' && reportDueToday(p.id))

  return (
    <>
      <PageHeader
        title="Ringkasan Portofolio"
        meta={<Badge tone="brand" icon={Database}>Data demo</Badge>}
        actions={
          <Select aria-label="Periode tren" defaultValue="4w" wrapperClassName="w-48">
            <option value="4w">4 minggu terakhir</option>
            <option value="q">Kuartal berjalan</option>
          </Select>
        }
      />

      <PageBody className="space-y-6">
        {/* Metrik portofolio: klik ke register terfilter */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-line-subtle bg-surface p-4 shadow-xs">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="mt-3 h-7 w-10" />
                <Skeleton className="mt-2 h-2.5 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {tiles.map((t) => (
              <StatTile
                key={t.label}
                label={t.label}
                value={t.value}
                icon={t.icon}
                emphasis={t.emphasis}
                onClick={() => navigate(t.to)}
              />
            ))}
          </div>
        )}

        {/* ══ Exception-first: proyek yang perlu perhatian pemilik ══ */}
        <section aria-label="Proyek yang perlu perhatian">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
                <OctagonAlert {...iconProps(13)} strokeWidth={2.2} />
              </span>
              <h2 className="text-base font-bold text-ink">Proyek Perlu Perhatian</h2>
              <Badge tone="danger" size="sm">{attention.length} proyek</Badge>
            </div>
            <Link to="/dashboard/proyek" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline">
              <span>Lihat Semua Proyek</span>
              <ExternalLink {...iconProps(12)} />
            </Link>
          </div>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-line-subtle bg-surface p-5 shadow-xs">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="mt-2 h-3 w-full" />
                  <Skeleton className="mt-4 h-2 w-full" />
                  <SkeletonText lines={3} className="mt-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
              {attention.map((p) => (
                <AttentionCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>

        {/* ══ Isu prioritas + milestone berisiko + laporan harian ══ */}
        <div className="grid items-start gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader
              icon={FileWarning}
              title="Isu Terbuka Prioritas"
              actions={
                <Link to="/dashboard/temuan" className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
                  <span>Semua Temuan</span>
                  <ExternalLink {...iconProps(12)} />
                </Link>
              }
            />
            <CardBody className="pt-1">
              {loading ? (
                <SkeletonText lines={6} className="p-2" />
              ) : (
                <ul className="divide-y divide-line-subtle">
                  {issues.map(({ finding: f, overdue, blocks }) => {
                    const cls = FINDING_CLASSIFICATION[f.classification]
                    const st = FINDING_STATUS[f.status]
                    return (
                      <li key={f.id}>
                        <Link to={`/dashboard/temuan/${f.id}`} className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-hover">
                          <span className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', TONE_STYLES[cls.tone].badge)}>
                            <cls.icon {...iconProps(14)} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-ink-muted bg-sunken px-1.5 py-0.5 rounded border border-line-subtle">
                                {f.ref}
                              </span>
                              {f.trade && (
                                <span className="rounded bg-brand-50 px-1.5 py-0.2 text-[10px] font-semibold text-brand-700 border border-brand-200">
                                  {f.trade}
                                </span>
                              )}
                              <span className="text-sm font-semibold text-ink group-hover:text-brand-700">
                                {f.defectType ?? f.title}
                              </span>
                              {f.element && (
                                <span className="rounded bg-sunken px-1.5 py-0.2 font-mono text-[10px] text-ink-secondary border border-line-subtle">
                                  {f.element}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs text-ink-muted">
                              <span className="flex items-center gap-1 font-medium text-ink-secondary"><Building2 {...iconProps(11)} className="text-ink-muted" /> {projectName(f.projectId)}</span>
                              <span className="flex items-center gap-1"><User {...iconProps(11)} className="text-ink-muted" /> {f.assignee}</span>
                              {f.dueAt && (
                                <span className="flex items-center gap-1 font-mono text-ink-secondary"><CalendarClock {...iconProps(11)} className="text-ink-muted" /> {formatRelative(f.dueAt)}</span>
                              )}
                              {blocks.length > 0 && (
                                <span className="ml-auto inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 font-bold text-red-700 border border-red-200">
                                  <Lock {...iconProps(10)} strokeWidth={2.4} /> Blokir {blocks.map((b) => b.ref).join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <StatusBadge status={st} size="sm" />
                            {overdue && (
                              <Badge tone="danger" size="sm">terlambat</Badge>
                            )}
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            {/* Milestone & aktivitas berisiko */}
            <Card>
              <CardHeader icon={CalendarClock} title="Milestone Berisiko" />
              <CardBody className="space-y-2.5 pt-2">
                {loading ? (
                  <SkeletonText lines={4} />
                ) : (
                  riskyMs.map((m) => (
                    <div key={m.id} className="rounded-lg border border-line-subtle p-2.5 bg-sunken/40 hover:bg-surface transition-colors">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tnum rounded bg-surface px-1.5 py-0.5 text-2xs font-semibold text-ink-secondary border border-line-subtle font-mono">{formatDate(m.date)}</span>
                        {m.code && (
                          <span className="rounded bg-sunken px-1.5 py-0.2 font-mono text-[10px] font-bold text-ink border border-line-subtle">
                            {m.code}
                          </span>
                        )}
                        <span className="font-mono text-2xs font-semibold text-ink-muted">[{m.targetScope}]</span>
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{m.activityName}</span>
                        <StatusBadge status={MILESTONE_STATUS[m.statusId]} size="sm" />
                      </div>
                      {m.prerequisiteAction && (
                        <div className="mt-1 flex items-center gap-1.5 text-2xs text-ink-secondary">
                          <span className="text-[10px] uppercase font-bold text-ink-muted">Prasyarat:</span>
                          <span className="font-medium">{m.prerequisiteAction}</span>
                        </div>
                      )}
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-2xs">
                        <span className="font-medium text-ink-secondary">{projectName(m.projectId)}</span>
                        {m.links.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="text-ink-muted text-[10px]">Terkait:</span>
                            {m.links.map((lnk) => (
                              <Link
                                key={lnk.id}
                                to={lnk.to}
                                className={cn(
                                  "font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border transition-colors",
                                  m.statusId === 'blocked' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' :
                                  'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                )}
                              >
                                {lnk.label}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-ink-muted text-2xs">{m.note}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            {/* Sinyal lapangan: laporan harian */}
            <Card>
              <CardHeader icon={FileText} title="Laporan Harian Lapangan" />
              <CardBody className="pt-2">
                {loading ? (
                  <SkeletonText lines={4} />
                ) : (
                  <>
                    <ul className="divide-y divide-line-subtle">
                      {reports.map((r) => (
                        <li key={r.id}>
                          <Link to={`/dashboard/proyek/${r.projectId}`} className="group -mx-2 block rounded-lg px-2.5 py-2.5 transition-colors hover:bg-hover">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-xs font-bold text-ink-secondary bg-sunken px-1.5 py-0.5 rounded border border-line-subtle">
                                  {r.ref}
                                </span>
                                <span className="truncate text-xs font-semibold text-ink group-hover:text-brand-700">{projectName(r.projectId)}</span>
                              </div>
                              <time className="tnum shrink-0 text-2xs text-ink-muted font-mono">{formatRelative(r.at)}</time>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-2xs">
                              <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 font-semibold text-ink-secondary border border-line-subtle">
                                <TrendingUp {...iconProps(11)} className="text-brand-600" />
                                {r.progressNote.match(/\d+%/)?.[0] ?? 'Aktif'} progres
                              </span>
                              {r.flags.length > 0 && (
                                <div className="inline-flex items-center gap-1.5">
                                  <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                                    {r.flags[0].code ?? r.flags[0].refId.toUpperCase()}
                                  </span>
                                  {r.flags[0].targetUnit && (
                                    <span className="font-semibold text-2xs text-ink">
                                      {r.flags[0].targetUnit}
                                    </span>
                                  )}
                                  <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[10px] font-semibold text-amber-800 border border-amber-200">
                                    {r.flags[0].statusNote ?? 'Perlu Tindakan'}
                                  </span>
                                </div>
                              )}
                              <span className="ml-auto text-2xs text-ink-muted">
                                {r.author.split('(')[0].trim()}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {reportMissing.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50/60 px-2.5 py-1.5 text-2xs text-amber-900 font-medium">
                        <Info {...iconProps(12)} className="shrink-0 text-amber-600" />
                        <span>Laporan hari ini belum diterima: <strong className="font-mono">{reportMissing.map((p) => p.code).join(', ')}</strong></span>
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* ══ Status Operasional Unit & Blok ══ */}
        <UnitOverviewSection />

        {/* ══ Direktori semua proyek ══ */}
        <section aria-label="Semua proyek">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-md font-semibold text-ink">Semua proyek</h2>
          </div>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-line-subtle bg-surface p-5 shadow-xs">
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="mt-2 h-3 w-64" />
                  <Skeleton className="mt-4 h-1.5 w-full" />
                  <SkeletonText lines={2} className="mt-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {PROJECTS.filter((p) => p.status !== 'closed').map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
              {PROJECTS.filter((p) => p.status === 'closed').map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </section>

        {/* Peristiwa berdampak + tren */}
        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader icon={History} title="Peristiwa Berdampak" />
            <CardBody className="pt-1">
              {loading ? (
                <SkeletonText lines={5} className="p-2" />
              ) : impacts.length === 0 ? (
                <EmptyState icon={Info} size="sm" title="Tidak ada peristiwa berdampak" />
              ) : (
                <ul className="divide-y divide-line-subtle">
                  {impacts.map((e) => {
                    const EIcon = EVENT_ICON[e.kind]
                    return (
                      <li key={e.id}>
                        <Link to={e.link} className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-hover">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-secondary">
                            <EIcon {...iconProps(14)} />
                          </span>
                          <div className="min-w-0 flex-1">
                            {e.actionDetail ? (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={cn(
                                  "rounded px-1.5 py-0.2 text-[10px] font-bold border",
                                  e.actionDetail.tone === 'danger' ? 'bg-red-50 text-red-700 border-red-200' :
                                  e.actionDetail.tone === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                  e.actionDetail.tone === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  'bg-brand-50 text-brand-700 border-brand-200'
                                )}>
                                  {e.actionDetail.actionLabel}
                                </span>
                                <span className="font-semibold text-xs text-ink group-hover:text-brand-700">{e.actionDetail.targetScope}</span>
                                {e.actionDetail.statusOutcome && (
                                  <span className="rounded bg-sunken px-1.5 py-0.2 font-mono text-2xs text-ink-secondary border border-line-subtle ml-auto">
                                    {e.actionDetail.statusOutcome}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs font-semibold text-ink group-hover:text-brand-700">{e.title}</p>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-2xs text-ink-muted">
                              <span className="font-mono font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200/70">{e.ref}</span>
                              <span className="font-medium text-ink-secondary">{projectName(e.projectId)}</span>
                              <span className="rounded bg-sunken px-1.5 py-0.2 text-ink-muted border border-line-subtle">{e.actor}</span>
                            </div>
                          </div>
                          <time className="tnum shrink-0 pt-0.5 text-2xs font-mono text-ink-muted">{formatRelative(e.at)}</time>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            {/* Tren ilustratif — KPI + bar mini per minggu (FR-OV-05) */}
            <Card>
              <CardHeader icon={TrendingUp} title="Tren 4 Minggu" />
              <CardBody className="pt-3">
                <div className="grid grid-cols-3 divide-x divide-line-subtle rounded-lg border border-line-subtle bg-sunken">
                  {[
                    { v: '78%', k: 'Sesuai pertama' },
                    { v: '17%', k: 'Perbaikan' },
                    { v: '6 hr', k: 'Rata-rata siklus' },
                  ].map((m) => (
                    <div key={m.k} className="px-2 py-3 text-center">
                      <span className="tnum block font-mono text-xl font-bold text-ink">{m.v}</span>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted mt-0.5">{m.k}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 flex items-end gap-2"
                  role="img"
                  aria-label="Pemeriksaan per minggu: sesuai pertama kali vs verifikasi perbaikan"
                >
                  {TREND.map((w) => (
                    <div key={w.w} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex h-20 w-full max-w-10 flex-col justify-end gap-px">
                        <span className="w-full rounded-t-[3px] bg-amber-400" style={{ height: `${w.rework * 4}px` }} />
                        <span className="w-full bg-brand-500" style={{ height: `${w.ok * 4}px` }} />
                      </div>
                      <span className="tnum text-2xs font-medium text-ink-muted">{w.w}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4 border-t border-line-subtle pt-2.5">
                  <span className="inline-flex items-center gap-1.5 text-2xs text-ink-muted">
                    <span aria-hidden className="h-2 w-2 rounded-sm bg-brand-500" /> Sesuai pertama kali
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-2xs text-ink-muted">
                    <span aria-hidden className="h-2 w-2 rounded-sm bg-amber-400" /> Verifikasi perbaikan
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </PageBody>
    </>
  )
}
