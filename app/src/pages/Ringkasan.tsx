import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  FileWarning,
  Flag,
  Info,
  Lock,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { TONE_STYLES } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { StatTile } from '@/components/ui/StatTile'
import { Select } from '@/components/ui/Input'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import { formatRelative } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import {
  ACTIVITY,
  EVENT_ICON,
  PROJECT_STATUS,
  PROJECTS,
  CONTROL_POINTS,
  portfolioCounts,
  projectPulse,
  projectName,
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

function ProjectCard({ p }: { p: Project }) {
  const archived = p.status === 'closed'
  const pts = CONTROL_POINTS.filter((c) => c.projectId === p.id)
  const critical = pts.filter((c) => c.pointType === 'hold' && c.status !== 'released' && c.status !== 'not_due')
  const st = PROJECT_STATUS[p.status]
  return (
    <Link
      to={`/proyek/${p.id}`}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-line-subtle bg-surface p-5 shadow-xs transition-all duration-100',
        'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-sm',
        archived && 'opacity-75 saturate-50',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-md font-semibold text-ink group-hover:text-brand-700">{p.name}</p>
          <p className="mt-0.5 truncate text-xs text-ink-muted">
            {p.code} · {p.client} · {p.location}
          </p>
        </div>
        <Badge tone={st.tone} size="sm" dot>{st.label}</Badge>
      </div>

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
        <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
          Buka proyek <ArrowRight {...iconProps(13)} strokeWidth={2.2} />
        </span>
      </div>
    </Link>
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
  const c = portfolioCounts()

  const tiles: {
    label: string
    value: number
    icon: LucideIcon
    emphasis?: 'neutral' | 'warning' | 'danger' | 'success'
    to: string
  }[] = [
    { label: 'Menunggu review', value: c.awaitingReview, icon: ClipboardCheck, to: '/inspeksi?set=review' },
    { label: 'Terjadwal & berlangsung', value: c.scheduled, icon: CalendarClock, to: '/inspeksi?set=jadwal' },
    { label: 'Perlu perbaikan', value: c.corrections, icon: FileWarning, emphasis: 'warning', to: '/inspeksi?set=perbaikan' },
    { label: 'Menunggu keputusan eksternal', value: c.awaitingExternal, icon: Flag, to: '/inspeksi?set=eksternal' },
    { label: 'Temuan terbuka', value: c.openFindings, icon: TriangleAlert, emphasis: 'warning', to: '/temuan?set=terbuka' },
    { label: 'Tindakan terlambat', value: c.overdueActions, icon: TriangleAlert, emphasis: 'danger', to: '/temuan?set=overdue' },
    { label: 'Hold point menunggu rilis', value: c.holdAwaitingRelease, icon: Lock, emphasis: c.holdAwaitingRelease > 0 ? 'warning' : 'neutral', to: '/inspeksi?set=review' },
  ]

  const impacts = ACTIVITY.filter((e) => e.impact).slice(0, 6)

  return (
    <>
      <PageHeader
        title="Ringkasan Portofolio"
        meta={<Badge tone="brand" icon={Sparkles}>Data demo</Badge>}
        actions={
          <Select aria-label="Periode tren" defaultValue="4w" wrapperClassName="w-48">
            <option value="4w">4 minggu terakhir</option>
            <option value="q">Kuartal berjalan</option>
          </Select>
        }
      />

      <PageBody className="space-y-6">
        {/* Metrik portofolio — klik → register terfilter */}
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

        {/* Kartu proyek */}
        <section aria-label="Proyek aktif">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-md font-semibold text-ink">Proyek</h2>
            <Link to="/proyek" className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800">
              Lihat semua proyek <ArrowRight {...iconProps(14)} strokeWidth={2.1} />
            </Link>
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
            <CardHeader title="Peristiwa berdampak" />
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
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-secondary">
                            <EIcon {...iconProps(14)} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-md font-medium text-ink group-hover:text-brand-700">{e.title}</p>
                            <p className="mt-0.5 truncate text-xs text-ink-muted">
                              <span className="font-mono">{e.ref}</span> · {projectName(e.projectId)} · {e.actor} ({e.role})
                            </p>
                            {e.note && <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted italic">“{e.note}”</p>}
                          </div>
                          <time className="tnum shrink-0 pt-0.5 text-xs text-ink-muted">{formatRelative(e.at)}</time>
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
              <CardHeader title="Tren 4 minggu" />
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
