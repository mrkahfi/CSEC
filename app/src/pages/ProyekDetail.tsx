import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  ClipboardList,
  Eye,
  FileText,
  Flag,
  History,
  Info,
  Lock,
  MapPin,
  TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { TONE_STYLES as TS, HOLD_POINT_STATUS, POINT_TYPE, FINDING_STATUS, FINDING_CLASSIFICATION, INSPECTION_STATUS } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TableContainer, Table, TableHead, TableBody, TableHeaderCell, TableRow, TableCell, MonoCell } from '@/components/ui/Table'
import { Timeline } from '@/components/ui/Timeline'
import { PlanActualChart, PlanActualDelta } from '@/components/ui/PlanActual'
import { formatDate, formatRelative, formatDateTime } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import {
  ACTIVITY,
  CONTROL_POINTS,
  EVENT_ICON,
  MILESTONE_STATUS,
  PROJECT_HEALTH,
  PROJECT_STATUS,
  controlPointById,
  controlPointsOfProject,
  findingsOfProject,
  healthOf,
  inspectionsOfProject,
  milestonesOfProject,
  progressOf,
  projectById,
  projectPulse,
  reportDueToday,
  reportsOfProject,
  type Project,
} from '@/demo/data'

type TabId = 'ringkasan' | 'inspeksi' | 'temuan' | 'titik' | 'aktivitas'

/** Ringkasan satu titik kendali (hold/witness/review) — FR-HP-01/02. */
function ControlPointRow({ cp, highlight }: { cp: (typeof CONTROL_POINTS)[number]; highlight?: boolean }) {
  const pt = POINT_TYPE[cp.pointType]
  const hp = HOLD_POINT_STATUS[cp.status]
  return (
    <div className={cn('rounded-lg border bg-surface p-3.5', highlight ? 'border-amber-300 shadow-xs ring-2 ring-amber-100' : 'border-line-subtle')}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('flex h-6 w-6 items-center justify-center rounded-md', TS[pt.tone].badge)}>
          <pt.icon {...iconProps(14)} strokeWidth={2} />
        </span>
        <span className="font-mono text-xs text-ink-muted">{cp.ref}</span>
        <span className="text-sm font-medium text-ink">{cp.title}</span>
        <span className="ml-auto"><StatusBadge status={hp} size="sm" emphasis={cp.pointType === 'hold' && hp.tone === 'danger' ? 'strong' : 'subtle'} /></span>
      </div>
      <div className="mt-2 grid gap-x-6 gap-y-1 text-xs text-ink-muted sm:grid-cols-2">
        <span><span className="text-ink-secondary">Otoritas rilis:</span> {cp.releaseAuthority}</span>
        <span><span className="text-ink-secondary">Referensi:</span> <span className="font-mono">{cp.itpRef}</span></span>
        {cp.nextActivity && <span className="sm:col-span-2"><span className="text-ink-secondary">Aktivitas berikutnya:</span> {cp.nextActivity}</span>}
        {cp.witness && (
          <span className="sm:col-span-2">
            <span className="text-ink-secondary">Pihak saksi:</span> {cp.witness.party} · jadwal {formatDateTime(cp.witness.scheduledAt)} ({cp.witness.attendance === 'rescheduled' ? 'dijadwalkan ulang' : cp.witness.attendance})
          </span>
        )}
        {cp.note && <span className="sm:col-span-2 italic">{cp.note}</span>}
      </div>
      {cp.conditions && (
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 border-t border-line-subtle pt-2.5">
          {cp.conditions.map((c) => (
            <span key={c.id} className={cn('inline-flex items-center gap-1.5 text-xs', c.met ? 'text-green-700' : 'font-medium text-red-700')}>
              <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', c.met ? 'bg-green-500' : 'bg-red-500')} />
              {c.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Progres vs rencana + kesehatan proyek + alasannya — sumber: laporan harian. */
function ProgresKesehatanCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const health = healthOf(project.id)
  const hst = PROJECT_HEALTH[health.healthId]
  const prog = progressOf(project.id)
  const archived = project.status === 'closed'
  return (
    <Card>
      <CardHeader
        title="Progres & kesehatan"
        description={health.headline || undefined}
        actions={<StatusBadge status={hst} size="sm" emphasis={health.healthId === 'behind' ? 'strong' : 'subtle'} />}
      />
      <CardBody className="space-y-4 pt-3">
        {prog && prog.weekly.length > 0 ? (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="flex items-baseline gap-2">
                  <span className="tnum text-3xl font-semibold tracking-tight text-ink">{prog.actualPct}%</span>
                  <span className="tnum text-sm text-ink-muted">/ rencana {prog.planPct}%</span>
                </p>
                <PlanActualDelta plan={prog.planPct} actual={prog.actualPct} className="mt-0.5" />
              </div>
              <p className="text-2xs leading-4 text-ink-muted">
                Per {formatDate(prog.asOf)} · direkap dari laporan harian{' '}
                <span className="font-mono">{prog.sourceRef}</span> · {prog.reporter}
              </p>
            </div>
            <PlanActualChart points={prog.weekly} />
          </>
        ) : (
          <p className="text-sm text-ink-muted">
            {archived ? 'Proyek arsip — rekaman progres historis (100%).' : 'Belum ada rekapan progres pada periode demo.'}
          </p>
        )}

        {health.reasons.length > 0 && (
          <div className="rounded-lg border border-line-subtle bg-sunken p-3">
            <p className="text-2xs font-semibold uppercase tracking-wider text-ink-muted">Mengapa status ini</p>
            <ul className="mt-2 space-y-1.5">
              {health.reasons.map((r) => {
                const body = (
                  <>
                    <span aria-hidden className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', TS[r.severity].dot)} />
                    <span className="min-w-0">
                      {r.refLabel && <span className="font-mono text-2xs text-ink-muted">{r.refLabel} · </span>}
                      {r.label}
                    </span>
                  </>
                )
                return (
                  <li key={r.id} className="flex items-start gap-2 text-xs leading-4 text-ink-secondary">
                    {r.to ? (
                      <button
                        type="button"
                        onClick={() => navigate(r.to!)}
                        className="-mx-1 flex cursor-pointer items-start gap-2 rounded px-1 py-0.5 text-left hover:text-brand-700"
                      >
                        {body}
                      </button>
                    ) : (
                      body
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

/** Laporan harian terbaru — jejak lapangan yang menjadi sumber kondisi. */
function LaporanHarianCard({ projectId }: { projectId: string }) {
  const navigate = useNavigate()
  const reports = reportsOfProject(projectId)
  const stale = reportDueToday(projectId)
  return (
    <Card>
      <CardHeader
        title="Laporan harian lapangan"
        description="Sumber progres & kondisi lapangan — disusun pengawas proyek."
      />
      <CardBody className="space-y-3 pt-3">
        {stale && reports.length > 0 && (
          <p className="flex items-start gap-1.5 rounded-md bg-sunken px-2.5 py-1.5 text-xs text-ink-muted">
            <Info {...iconProps(13)} className="mt-0.5 shrink-0" />
            Laporan hari ini belum diterima — terakhir diterima {formatRelative(reports[0].at)}.
          </p>
        )}
        {reports.length === 0 && <p className="text-sm text-ink-muted">Tidak ada laporan harian pada periode demo.</p>}
        {reports.slice(0, 2).map((r) => (
          <div key={r.id} className="rounded-xl border border-line-subtle p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <FileText {...iconProps(14)} className="shrink-0 text-ink-muted" />
              <span className="font-mono text-xs text-ink-muted">{r.ref}</span>
              <span className="tnum text-xs text-ink-muted">{formatDate(r.at)}</span>
              <span className="ml-auto text-2xs text-ink-disabled">{r.author} · {r.authorOrg}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-ink">{r.progressNote}</p>
            <ul className="mt-1.5 space-y-1">
              {r.workSummary.map((w, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-4 text-ink-secondary">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                  {w}
                </li>
              ))}
            </ul>
            {r.delays.length > 0 && (
              <div className="mt-2 space-y-1">
                {r.delays.map((d) => (
                  <p key={d.id} className="flex items-start gap-1.5 rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-1.5 text-xs text-amber-950">
                    <TriangleAlert {...iconProps(12)} strokeWidth={2.2} className="mt-0.5 shrink-0 text-amber-600" />
                    <span><span className="font-medium capitalize">{d.category}:</span> {d.desc}</span>
                  </p>
                ))}
              </div>
            )}
            {r.flags.length > 0 && (
              <div className="mt-2.5 border-t border-line-subtle pt-2.5">
                <p className="text-2xs font-semibold uppercase tracking-wider text-ink-muted">Isu yang dilaporkan</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {r.flags.map((fl) => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => navigate(fl.to)}
                      className="cursor-pointer rounded-full border border-line-subtle bg-sunken px-2 py-0.5 text-2xs text-ink-secondary transition-colors hover:border-line-strong hover:text-brand-700"
                    >
                      {fl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="mt-2 flex items-center gap-1 text-2xs text-ink-disabled">
              <Camera {...iconProps(11)} /> {r.photoCount} foto terlampir pada laporan
            </p>
          </div>
        ))}
        {reports.length > 2 && (
          <p className="text-xs text-ink-muted">
            +{reports.length - 2} laporan sebelumnya ({reports.slice(2).map((r) => r.ref).join(', ')}).
          </p>
        )}
      </CardBody>
    </Card>
  )
}

/** Aktivitas & milestone berikutnya + risikonya. */
function MilestoneCard({ projectId }: { projectId: string }) {
  const navigate = useNavigate()
  const ms = milestonesOfProject(projectId)
  return (
    <Card>
      <CardHeader title="Aktivitas & milestone berikutnya" />
      <CardBody className="space-y-2.5 pt-2">
        {ms.length === 0 && <p className="text-sm text-ink-muted">Tidak ada milestone terjadwal pada periode demo.</p>}
        {ms.map((m) => (
          <div key={m.id} className="rounded-lg border border-line-subtle p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tnum rounded bg-sunken px-1.5 py-0.5 text-2xs font-medium text-ink-secondary">
                {formatDate(m.date)} · {formatRelative(m.date)}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{m.title}</span>
              <StatusBadge status={MILESTONE_STATUS[m.statusId]} size="sm" />
            </div>
            <p className="mt-1 text-xs text-ink-muted">{m.note}</p>
            {m.links.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.links.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => navigate(l.to)}
                    className="cursor-pointer rounded-full border border-line-subtle bg-sunken px-2 py-0.5 font-mono text-2xs text-ink-secondary transition-colors hover:border-line-strong hover:text-brand-700"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

/** Isu terbuka proyek — pintasan ke tindak lanjut (temuan). */
function IsuTerbukaCard({ projectId }: { projectId: string }) {
  const navigate = useNavigate()
  const fnd = findingsOfProject(projectId).filter((f) => !['closed', 'superseded', 'cancelled'].includes(f.status))
  return (
    <Card>
      <CardHeader title="Isu terbuka" description={`${fnd.length} temuan menunggu penyelesaian`} />
      <CardBody className="space-y-2 pt-2">
        {fnd.length === 0 && <p className="text-sm text-ink-muted">Tidak ada temuan terbuka.</p>}
        {fnd.map((f) => {
          const st = FINDING_STATUS[f.status]
          const overdue = f.dueAt && new Date(f.dueAt).getTime() < Date.now() && !['closed'].includes(f.status)
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => navigate(`/dashboard/temuan/${f.id}`)}
              className="block w-full cursor-pointer rounded-lg border border-line-subtle p-2.5 text-left transition-colors hover:bg-hover"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs text-ink-muted">{f.ref}</span>
                <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{f.title}</span>
                <StatusBadge status={st} size="sm" />
              </div>
              <p className="mt-1 text-2xs text-ink-muted">
                PJ: {f.assignee}
                {f.dueAt && <> · target {formatRelative(f.dueAt)}</>}
                {overdue && <span className="font-medium text-red-700"> · terlambat</span>}
              </p>
            </button>
          )
        })}
      </CardBody>
    </Card>
  )
}

export function ProyekDetail() {
  const { id = 'aru' } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const loading = useSimulatedLoading()
  const project = projectById(id)
  const titikParam = params.get('titik')
  const [tab, setTab] = useState<TabId>(titikParam ? 'titik' : 'ringkasan')
  // Deep-link ?titik= aktif juga saat sudah berada di halaman proyek yang sama.
  useEffect(() => {
    if (titikParam) setTab('titik')
  }, [titikParam])

  const ins = useMemo(() => inspectionsOfProject(id), [id])
  const fnd = useMemo(() => findingsOfProject(id), [id])
  const pts = useMemo(() => controlPointsOfProject(id), [id])
  const acts = useMemo(() => ACTIVITY.filter((a) => a.projectId === id), [id])
  const openIns = ins.filter((i) => !['accepted', 'withdrawn', 'cancelled'].includes(i.status))
  const openFnd = fnd.filter((f) => !['closed', 'superseded', 'cancelled'].includes(f.status))
  const st = PROJECT_STATUS[project.status]
  const archived = project.status === 'closed'
  const pulse = projectPulse(id)
  const pulseTotal = pulse.reduce((a, s) => a + s.count, 0)

  if (loading) {
    return (
      <PageBody className="space-y-4 py-8">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <div className="grid gap-4 pt-4 lg:grid-cols-3">
          <Skeleton className="h-56 lg:col-span-2" />
          <Skeleton className="h-56" />
        </div>
      </PageBody>
    )
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Proyek', to: '/dashboard/proyek' }, { label: project.name }]}
        title={project.name}
        description={`${project.client} · ${project.location} · ${project.type}`}
        meta={
          <>
            <Badge tone="neutral" size="sm" className="font-mono">{project.code}</Badge>
            <StatusBadge status={st} size="sm" />
          </>
        }
        actions={
          archived ? (
            <Badge tone="neutral" icon={Lock}>Proyek arsip (hanya-baca)</Badge>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/inspeksi?proyek=${project.id}`)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium text-ink shadow-xs transition-colors hover:bg-hover"
              >
                <ClipboardList {...iconProps(15)} /> Register inspeksi
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/laporan')}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-600 px-3 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand-700"
              >
                Ringkasan kualitas <ArrowRight {...iconProps(15)} strokeWidth={2.1} />
              </button>
            </>
          )
        }
      >
        <Tabs
          label="Bagian proyek"
          value={tab}
          onChange={(t) => setTab(t as TabId)}
          items={[
            { id: 'ringkasan', label: 'Ringkasan' },
            { id: 'inspeksi', label: 'Inspeksi', count: ins.length },
            { id: 'temuan', label: 'Temuan & Tindakan', count: fnd.length },
            { id: 'titik', label: 'Titik Kendali', count: pts.length },
            { id: 'aktivitas', label: 'Aktivitas', count: acts.length },
          ]}
        />
      </PageHeader>

      <PageBody className="space-y-5">
        {/* ════ TAB: RINGKASAN ════ */}
        {tab === 'ringkasan' && (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <ProgresKesehatanCard project={project} />
              <LaporanHarianCard projectId={id} />
              <MilestoneCard projectId={id} />
              <Card>
                <CardHeader title="Ringkasan workflow" />
                <CardBody className="pt-3">
                  <div className="flex h-2 gap-px overflow-hidden rounded-full">
                    {pulse.map((s) => (
                      <span key={s.label} className={TS[s.tone].dot} style={{ flexGrow: s.count }} title={`${s.count} ${s.label}`} />
                    ))}
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                    {pulse.map((s) => (
                      <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                        <span aria-hidden className={cn('h-2 w-2 rounded-full', TS[s.tone].dot)} />
                        <span className="tnum font-semibold text-ink">{s.count}</span> {s.label}
                      </span>
                    ))}
                    <span className="tnum text-xs text-ink-disabled">{pulseTotal} inspeksi tercatat</span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 divide-x divide-line-subtle rounded-lg border border-line-subtle bg-sunken">
                    {[
                      { label: 'Inspeksi terbuka', v: openIns.length, to: '/dashboard/inspeksi?proyek=' + id },
                      { label: 'Temuan terbuka', v: openFnd.length, to: '/dashboard/temuan?proyek=' + id },
                      { label: 'Hold point belum rilis', v: pts.filter((p) => p.pointType === 'hold' && !['released', 'not_due'].includes(p.status)).length },
                    ].map((m) => (
                      <button key={m.label} type="button" onClick={() => m.to && navigate(m.to)} className="cursor-pointer px-3 py-3 text-left transition-colors hover:bg-hover">
                        <span className="tnum block text-xl font-semibold text-ink">{m.v}</span>
                        <span className="block text-xs text-ink-muted">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Identitas & kontak" />
                <CardBody className="pt-3">
                  <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {[
                      ['Klien', project.client],
                      ['Lokasi', project.location],
                      ['Nilai kontrak (demo)', project.value],
                      ['Periode', project.period],
                      ['Project Manager', project.pm],
                      ['Site Manager', project.siteManager],
                      ['Quality Lead', project.qualityLead],
                      ['Konsultan / Owner', project.consultant],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-ink-muted">{k}</dt>
                        <dd className="text-sm font-medium text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-4">
              <IsuTerbukaCard projectId={id} />
              <Card>
                <CardHeader title="Titik kendali" description={`${pts.filter((p) => p.pointType === 'hold').length} hold · ${pts.filter((p) => p.pointType === 'witness').length} witness · ${pts.filter((p) => p.pointType === 'review').length} review`} />
                <CardBody className="space-y-2.5 pt-2">
                  {pts.length === 0 && <p className="text-sm text-ink-muted">Tidak ada titik kendali pada proyek ini.</p>}
                  {pts.slice(0, 3).map((cp) => (
                    <button key={cp.id} type="button" onClick={() => setTab('titik')} className="block w-full cursor-pointer rounded-lg border border-line-subtle p-2.5 text-left transition-colors hover:bg-hover">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-2xs text-ink-muted">{cp.ref}</span>
                        <span className="truncate text-xs font-medium text-ink">{cp.title}</span>
                      </div>
                      <div className="mt-1.5"><StatusBadge status={HOLD_POINT_STATUS[cp.status]} size="sm" /></div>
                    </button>
                  ))}
                  {pts.length > 3 && <p className="text-xs text-ink-muted">+{pts.length - 3} lagi pada tab Titik Kendali.</p>}
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Aktivitas terbaru" />
                <CardBody className="pt-1">
                  <ul className="divide-y divide-line-subtle">
                    {acts.slice(0, 5).map((a) => {
                      const EIcon = EVENT_ICON[a.kind]
                      return (
                        <li key={a.id}>
                          <Link to={a.link} className="group -mx-2 flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-hover">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-secondary">
                              <EIcon {...iconProps(13)} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-ink group-hover:text-brand-700">{a.title}</p>
                              <p className="tnum text-2xs text-ink-muted">{a.actor} · {formatRelative(a.at)}</p>
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                    {acts.length === 0 && <li className="py-2 text-sm text-ink-muted">Belum ada aktivitas tercatat pada periode demo.</li>}
                  </ul>
                  {acts.length > 5 && (
                    <button type="button" onClick={() => setTab('aktivitas')} className="mt-2 text-xs font-medium text-brand-700 hover:text-brand-800">
                      Lihat semua aktivitas →
                    </button>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* ════ TAB: INSPEKSI ════ */}
        {tab === 'inspeksi' && (
          ins.length === 0 ? (
            <EmptyState icon={ClipboardList} title="Belum ada inspeksi pada proyek ini" />
          ) : (
            <TableContainer>
              {/* Fixed layout — alasan sama dengan register inspeksi. */}
              <Table className="table-fixed min-w-[1030px]">
                <TableHead>
                  <TableRow>
                    <TableHeaderCell width="165px">Referensi</TableHeaderCell>
                    <TableHeaderCell width="300px">Lingkup & lokasi</TableHeaderCell>
                    <TableHeaderCell width="140px" className="hidden lg:table-cell">Titik</TableHeaderCell>
                    <TableHeaderCell width="235px">Status</TableHeaderCell>
                    <TableHeaderCell width="190px" className="hidden xl:table-cell">Tindakan berikutnya</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ins.map((i) => (
                    <TableRow key={i.id} clickable onClick={() => navigate(`/dashboard/inspeksi/${i.id}`)}>
                      <MonoCell>{i.ref}</MonoCell>
                      <TableCell>
                        <p className="text-sm font-medium text-ink">{i.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted"><MapPin {...iconProps(12)} /> {i.location}</p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={POINT_TYPE[i.pointType]} size="sm" />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={INSPECTION_STATUS[i.status]} size="sm" />
                        {i.holdPointId && (
                          <span className="mt-1 block">
                            <StatusBadge status={{ ...HOLD_POINT_STATUS[controlPointById(i.holdPointId)!.status], label: 'Hold: ' + HOLD_POINT_STATUS[controlPointById(i.holdPointId)!.status].label }} size="sm" emphasis="strong" />
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {i.nextAction ? (
                          <div className="text-xs">
                            <p className="text-ink-secondary">{i.nextAction.label}</p>
                            <p className="text-ink-muted">{i.nextAction.owner}{i.nextAction.dueAt ? ` · target ${formatRelative(i.nextAction.dueAt)}` : ''}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-ink-disabled">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {/* ════ TAB: TEMUAN ════ */}
        {tab === 'temuan' && (
          fnd.length === 0 ? (
            <EmptyState icon={Flag} title="Belum ada temuan pada proyek ini" />
          ) : (
            <div className="space-y-2.5">
              {fnd.map((f) => (
                <Link key={f.id} to={`/dashboard/temuan/${f.id}`} className="group block rounded-xl border border-line-subtle bg-surface p-4 shadow-xs transition-all hover:border-line-strong hover:shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-ink-muted">{f.ref}</span>
                    <span className="text-sm font-semibold text-ink group-hover:text-brand-700">{f.title}</span>
                    <span className="ml-auto flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={FINDING_CLASSIFICATION[f.classification]} size="sm" />
                      <StatusBadge status={FINDING_STATUS[f.status]} size="sm" />
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-xs text-ink-muted">{f.facts}</p>
                  {f.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {f.actions.map((a) => (
                        <span key={a.id} className="inline-flex items-center gap-1 rounded-full border border-line-subtle bg-sunken px-2 py-0.5 text-2xs text-ink-secondary">
                          <span className="font-mono">{a.ref}</span> · {a.assignee}
                          {new Date(a.dueAt).getTime() < Date.now() && !['verified'].includes(a.status) && (
                            <span className="font-medium text-red-700">· terlambat</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )
        )}

        {/* ════ TAB: TITIK KENDALI ════ */}
        {tab === 'titik' && (
          <div className="space-y-4">
            {pts.length === 0 ? (
              <EmptyState icon={Eye} title="Tidak ada titik kendali" description="Proyek ini tidak memiliki hold/witness/review point pada data demo." />
            ) : (
              <div className="space-y-2.5">
                {pts.map((cp) => (
                  <ControlPointRow key={cp.id} cp={cp} highlight={params.get('titik') === cp.id} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ TAB: AKTIVITAS ════ */}
        {tab === 'aktivitas' && (
          <Card>
            <CardHeader
              title="Riwayat aktivitas proyek"
            />
            <CardBody className="pt-4">
              {acts.length === 0 ? (
                <EmptyState icon={History} size="sm" title="Belum ada aktivitas" />
              ) : (
                <Timeline
                  items={acts.map((a) => ({
                    id: a.id,
                    icon: EVENT_ICON[a.kind],
                    tone: undefined,
                    title: (
                      <span>
                        {a.title} <Link to={a.link} className="font-mono text-xs text-brand-700 hover:underline">{a.ref}</Link>
                      </span>
                    ),
                    meta: `${a.actor} · ${a.role} · ${formatDateTime(a.at)}`,
                    note: a.note,
                  }))}
                />
              )}
            </CardBody>
          </Card>
        )}
      </PageBody>
    </>
  )
}
