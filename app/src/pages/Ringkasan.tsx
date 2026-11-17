import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  FileWarning,
  Flag,
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
} from '@/demo/data'

/** Pita pulse — proporsi status inspeksi per proyek (bukan progres fisik). */
function PulseBar({ projectId }: { projectId: string }) {
  const segments = projectPulse(projectId)
  const total = segments.reduce((a, s) => a + s.count, 0)
  return (
    <div>
      <div className="flex h-1.5 gap-px overflow-hidden rounded-full" role="img" aria-label={`Pulse workflow: ${segments.map((s) => `${s.count} ${s.label}`).join(', ')}`}>
        {segments.map((s) => (
          <span key={s.label} className={TONE_STYLES[s.tone].dot} style={{ flexGrow: s.count }} />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1 text-2xs text-ink-muted">
            <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', TONE_STYLES[s.tone].dot)} />
            <span className="tnum font-medium text-ink-secondary">{s.count}</span> {s.label}
          </span>
        ))}
        <span className="tnum text-2xs text-ink-disabled">{total} inspeksi total</span>
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
        'group flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-5 shadow-xs transition-all duration-100',
        'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm',
        archived && 'opacity-75 saturate-50',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-secondary border border-line-subtle shadow-2xs">
            <Building2 {...iconProps(16)} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink group-hover:text-brand-700">{p.name}</p>
            <div className="mt-0.5 flex items-center gap-2 text-2xs text-ink-muted">
              <span className="font-mono font-semibold text-ink-secondary">{p.code}</span>
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
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-2xs text-ink-muted">
            <span><span className="tnum font-semibold text-ink">{prog.actualPct}%</span> realisasi</span>
            <span aria-hidden>·</span>
            <span className="tnum">rencana {prog.planPct}%</span>
            <PlanActualDelta plan={prog.planPct} actual={prog.actualPct} />
          </div>
        </div>
      )}

      <PulseBar projectId={p.id} />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line-subtle pt-2.5 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <ClipboardCheck {...iconProps(13)} /> PM {p.pm}
        </span>
        {critical.length > 0 && (
          <span className="inline-flex items-center gap-1 font-medium text-amber-700">
            <Lock {...iconProps(13)} /> {critical.length} hold point kritis
          </span>
        )}
        {archived && <span className="text-ink-disabled">hanya-baca</span>}
        <span className="ml-auto inline-flex items-center gap-1 font-semibold text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
          <span>Buka</span>
          <ExternalLink {...iconProps(12)} />
        </span>
      </div>
    </Link>
  )
}

/** Kartu "perlu perhatian": exception-first, format dashboard operasional. */
function AttentionCard({ p }: { p: Project }) {
  const { scenario } = useDemo()
  const isAruReleased = p.id === 'aru' && scenario.holdPointReleased

  const baseHealth = healthOf(p.id)
  const health = isAruReleased
    ? {
        healthId: 'on_track' as const,
        headline: 'Siklus cor lantai 8 telah dirilis oleh Quality Manager.',
        reasons: [
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
        delayed ? 'border-red-200' : isAruReleased ? 'border-emerald-200' : 'border-amber-200',
      )}
    >
      {/* Header Proyek dengan Logo/Badge Kode */}
      <div className="flex items-start justify-between gap-3 border-b border-line-subtle pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold shadow-2xs',
            delayed
              ? 'bg-red-50 text-red-700 border border-red-200/80'
              : isAruReleased
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
              <span className="flex items-center gap-0.5"><MapPin {...iconProps(11)} /> {p.location}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><User {...iconProps(11)} /> {p.pm}</span>
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
              <span className="text-2xs text-ink-muted">
                / {prog.planPct}% rencana
              </span>
            </div>
            <PlanActualDelta plan={prog.planPct} actual={prog.actualPct} />
          </div>
          <PlanActualBar plan={prog.planPct} actual={prog.actualPct} label={`Progres: ${prog.actualPct}% dari ${prog.planPct}%`} />
        </div>
      )}

      {/* Sinyal Operasional / Blocker Callout */}
      <div className="space-y-1.5 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
          Status Operasional
        </span>
        <div className={cn(
          'flex items-start gap-2 rounded-lg p-2.5 text-xs border',
          delayed
            ? 'bg-red-50/60 border-red-200/80 text-red-900'
            : isAruReleased
              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
              : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
        )}>
          {delayed ? (
            <OctagonAlert {...iconProps(15)} className="shrink-0 mt-0.5 text-red-600" />
          ) : isAruReleased ? (
            <CheckCircle2 {...iconProps(15)} className="shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <TriangleAlert {...iconProps(15)} className="shrink-0 mt-0.5 text-amber-600" />
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs leading-snug">{health.headline}</p>
            {health.reasons[0] && (
              <p className="mt-1 text-2xs opacity-85">
                {health.reasons[0].refLabel && <span className="font-mono font-bold mr-1">{health.reasons[0].refLabel}</span>}
                {health.reasons[0].label}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Milestone */}
      {riskyMilestone && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line-subtle pt-2.5 text-2xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <CalendarClock {...iconProps(12)} className="shrink-0 text-ink-muted" />
            <span className="truncate text-ink-secondary">
              <span className="text-ink-muted font-medium">Target:</span> {riskyMilestone.title}
            </span>
          </div>
          <span className="shrink-0 tnum font-mono text-ink-muted bg-sunken px-1.5 py-0.5 rounded">
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

/** Peristiwa berdampak tinggi — FR-OV-04. */
export function Ringkasan() {
  const loading = useSimulatedLoading()
  const navigate = useNavigate()
  const { scenario } = useDemo()
  const c = portfolioCounts()
  if (scenario.holdPointReleased) {
    c.holdAwaitingRelease = 0
  }

  const tiles: {
    label: string
    value: number
    icon: LucideIcon
    emphasis?: 'neutral' | 'warning' | 'danger' | 'success'
    to: string
  }[] = [
    { label: 'Menunggu review', value: c.awaitingReview, icon: ClipboardCheck, to: '/dashboard/inspeksi?set=review' },
    { label: 'Terjadwal & berlangsung', value: c.scheduled, icon: CalendarClock, to: '/dashboard/inspeksi?set=jadwal' },
    { label: 'Perlu perbaikan', value: c.corrections, icon: FileWarning, emphasis: 'warning', to: '/dashboard/inspeksi?set=perbaikan' },
    { label: 'Menunggu keputusan eksternal', value: c.awaitingExternal, icon: Flag, to: '/dashboard/inspeksi?set=eksternal' },
    { label: 'Temuan terbuka', value: c.openFindings, icon: TriangleAlert, emphasis: 'warning', to: '/dashboard/temuan?set=terbuka' },
    { label: 'Tindakan terlambat', value: c.overdueActions, icon: TriangleAlert, emphasis: 'danger', to: '/dashboard/temuan?set=overdue' },
    { label: 'Hold point menunggu rilis', value: c.holdAwaitingRelease, icon: Lock, emphasis: c.holdAwaitingRelease > 0 ? 'warning' : 'neutral', to: '/dashboard/inspeksi?set=review' },
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
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-ink-muted bg-sunken px-1.5 py-0.5 rounded border border-line-subtle">
                                {f.ref}
                              </span>
                              <p className="truncate text-sm font-semibold text-ink group-hover:text-brand-700">
                                {f.title}
                              </p>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-2xs text-ink-muted">
                              <span className="flex items-center gap-0.5"><Building2 {...iconProps(11)} /> {projectName(f.projectId)}</span>
                              <span>·</span>
                              <span className="flex items-center gap-0.5"><User {...iconProps(11)} /> {f.assignee}</span>
                              {f.dueAt && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-0.5"><CalendarClock {...iconProps(11)} /> target {formatRelative(f.dueAt)}</span>
                                </>
                              )}
                              {blocks.length > 0 && (
                                <span className="ml-auto inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 font-bold text-red-700 border border-red-200">
                                  <Lock {...iconProps(10)} strokeWidth={2.4} /> memblokir {blocks.map((b) => b.ref).join(', ')}
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
                        <span className="tnum rounded bg-surface px-1.5 py-0.5 text-2xs font-semibold text-ink-secondary border border-line-subtle">{formatDate(m.date)}</span>
                        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{m.title}</span>
                        <StatusBadge status={MILESTONE_STATUS[m.statusId]} size="sm" />
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-2xs text-ink-muted">
                        <span className="font-semibold text-ink-secondary">{projectName(m.projectId)}:</span>
                        <span>{m.note}</span>
                      </p>
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
                          <Link to={`/dashboard/proyek/${r.projectId}`} className="group -mx-2 block rounded-lg px-2 py-2.5 transition-colors hover:bg-hover">
                            <p className="flex items-center gap-2 text-xs">
                              <FileText {...iconProps(13)} className="shrink-0 text-ink-muted" />
                              <span className="font-mono text-ink-muted">{r.ref}</span>
                              <span className="truncate font-medium text-ink group-hover:text-brand-700">{projectName(r.projectId)}</span>
                              <time className="tnum ml-auto shrink-0 text-2xs text-ink-muted">{formatRelative(r.at)}</time>
                            </p>
                            <p className="mt-1 line-clamp-2 pl-[22px] text-2xs leading-4 text-ink-secondary">{r.progressNote}</p>
                            {r.flags.length > 0 && (
                              <p className="mt-1 line-clamp-1 pl-[22px] text-2xs text-ink-muted">
                                <TriangleAlert {...iconProps(11)} strokeWidth={2.2} className="mr-1 inline text-amber-600" />
                                {r.flags[0].label}
                                {r.flags.length > 1 && <span className="ml-1.5 rounded bg-amber-50 px-1 py-0.5 text-2xs font-semibold text-amber-700">+{r.flags.length - 1} isu</span>}
                              </p>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {reportMissing.length > 0 && (
                      <p className="mt-2 rounded-md bg-sunken px-2.5 py-1.5 text-2xs text-ink-muted">
                        <Info {...iconProps(11)} className="mr-1 inline text-ink-muted" />
                        Laporan hari ini belum diterima: {reportMissing.map((p) => p.code).join(', ')}.
                      </p>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

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
                            <p className="text-sm font-semibold text-ink group-hover:text-brand-700">{e.title}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-2xs text-ink-muted">
                              <span className="font-mono font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200/70">{e.ref}</span>
                              <span className="font-medium text-ink-secondary">{projectName(e.projectId)}</span>
                              <span className="rounded bg-sunken px-1.5 py-0.2 text-ink-muted border border-line-subtle">{e.actor} ({e.role})</span>
                            </div>
                            {e.note && <p className="mt-1 line-clamp-1 text-2xs text-ink-muted italic">“{e.note}”</p>}
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
                    { v: '78%', k: 'Lolos pertama' },
                    { v: '17%', k: 'Re-inspeksi' },
                    { v: '6 hr', k: 'Siklus tindakan' },
                  ].map((m) => (
                    <div key={m.k} className="px-2 py-2.5 text-center">
                      <span className="tnum block text-lg font-semibold text-ink">{m.v}</span>
                      <span className="block text-2xs text-ink-muted">{m.k}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 flex items-end gap-2"
                  role="img"
                  aria-label="Inspeksi per minggu: lolos pertama vs re-inspeksi"
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
                    <span aria-hidden className="h-2 w-2 rounded-sm bg-brand-500" /> Lolos pertama
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-2xs text-ink-muted">
                    <span aria-hidden className="h-2 w-2 rounded-sm bg-amber-400" /> Re-inspeksi
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
