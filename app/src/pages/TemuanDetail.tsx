import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Camera,
  CircleCheck,
  CircleX,
  ClipboardCheck,
  Eye,
  FileSearch,
  FileText,
  Flag,
  OctagonAlert,
  Scale,
  TriangleAlert,
  Wrench,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { FINDING_CLASSIFICATION, FINDING_STATUS } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Callout'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime, formatRelative } from '@/lib/format'
import { useDemo } from '@/demo/DemoContext'
import { useSimulatedLoading } from '@/demo/hooks'
import { EventTimeline } from '@/demo/EventTimeline'
import { EvidenceViewerModal, type EvidenceType } from '@/components/EvidenceViewerModal'
import { controlPointsOfProject, findingById, inspectionByRef, projectById, projectName, reportsMentioningFinding } from '@/demo/data'
import type { CorrectiveAction } from '@/demo/data'

const ACTION_STATUS: Record<CorrectiveAction['status'], { label: string; tone: 'warning' | 'info' | 'active' | 'success' | 'danger'; icon: typeof CircleCheck; description: string }> = {
  in_progress: { label: 'Tindakan Berjalan', tone: 'active', icon: Wrench, description: 'Perbaikan sedang dikerjakan penanggung jawab.' },
  submitted: { label: 'Tindakan Diajukan', tone: 'info', icon: FileText, description: 'Bukti perbaikan menunggu peninjauan verifikator.' },
  verification_pending: { label: 'Menunggu Verifikasi', tone: 'warning', icon: Eye, description: 'Menunggu verifikasi independen, temuan belum boleh ditutup.' },
  verified: { label: 'Terverifikasi', tone: 'success', icon: CircleCheck, description: 'Diverifikasi oleh verifikator independen.' },
  rejected: { label: 'Verifikasi Ditolak', tone: 'danger', icon: CircleX, description: 'Verifikasi gagal, tindakan kembali aktif dengan alasan.' },
}

/** Kartu satu tindakan perbaikan: FR-FA-05. */
function ActionCard({ a }: { a: CorrectiveAction }) {
  const toast = useToast()
  const { role } = useDemo()
  const st = ACTION_STATUS[a.status]
  const overdue = new Date(a.dueAt).getTime() < Date.now() && !['verified'].includes(a.status)
  const canVerify = a.status === 'verification_pending' && (role === 'qc_inspector' || role === 'quality_manager')

  return (
    <div className="rounded-xl border border-line-subtle bg-surface p-4 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-tone-active-bg text-violet-700">
          <Wrench {...iconProps(14)} strokeWidth={2} />
        </span>
        <span className="font-mono text-xs text-ink-muted">{a.ref}</span>
        <span className="ml-auto"><StatusBadge status={{ id: a.status, label: st.label, tone: st.tone, icon: st.icon, description: st.description }} size="sm" /></span>
      </div>
      <p className="mt-2 text-sm text-ink">{a.description}</p>
      <dl className="mt-2.5 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-3">
        <div>
          <dt className="text-ink-muted">Penanggung jawab</dt>
          <dd className="font-medium text-ink">{a.assignee}<span className="block font-normal text-ink-muted">{a.assigneeOrg}</span></dd>
        </div>
        <div>
          <dt className="text-ink-muted">Jatuh tempo</dt>
          <dd className={cn('tnum font-medium', overdue ? 'flex items-center gap-1 text-red-700' : 'text-ink')}>
            {overdue && <OctagonAlert {...iconProps(12)} strokeWidth={2.2} />}
            {formatDateTime(a.dueAt)} {overdue && <span className="ml-0.5 text-[10px] font-bold uppercase tracking-wide">Terlambat</span>}
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Verifikator</dt>
          <dd className="font-medium text-ink">{a.verifiedBy ?? <span className="text-ink-muted">QA/QC <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700">Menunggu</span></span>}</dd>
        </div>
      </dl>
      {a.evidenceNote && (
        <div className="mt-2 flex items-start gap-2 rounded-md bg-sunken px-2.5 py-1.5 text-xs text-ink-secondary">
          <span className="flex-1"><span className="font-medium text-ink">Bukti diajukan:</span> {a.evidenceNote}</span>
        </div>
      )}
      {a.rejectionReason && (
        <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-900">
          <span className="font-semibold">Verifikasi ditolak:</span> {a.rejectionReason}
        </p>
      )}
      {canVerify && (
        <div className="mt-3 flex gap-2 border-t border-line-subtle pt-3">
          <Button size="xs" variant="primary" onClick={() => toast({ tone: 'success', title: 'Simulasi verifikasi lulus', description: `${a.ref} terverifikasi; temuan dapat ditutup bila semua tindakan selesai.` })}>
            <CircleCheck {...iconProps(13)} strokeWidth={2.1} /> Verifikasi lulus
          </Button>
          <Button size="xs" variant="danger-subtle" onClick={() => toast({ tone: 'warning', title: 'Simulasi verifikasi ditolak', description: `${a.ref} kembali aktif dengan alasan verifikator.` })}>
            <CircleX {...iconProps(13)} strokeWidth={2.1} /> Tolak verifikasi
          </Button>
        </div>
      )}
    </div>
  )
}

export function TemuanDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const loading = useSimulatedLoading()
  const f = findingById(id)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerType, setViewerType] = useState<EvidenceType>('photo-before')

  if (loading) {
    return (
      <PageBody className="space-y-4 py-8">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-96" />
        <div className="grid gap-4 pt-2 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-52" />
          </div>
          <Skeleton className="h-60" />
        </div>
      </PageBody>
    )
  }

  if (!f) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Temuan tidak ditemukan"
        description="Referensi tidak ada pada data demo."
        actions={<Button variant="secondary" onClick={() => navigate('/dashboard/temuan')}><ArrowLeft {...iconProps(15)} /> Kembali ke register</Button>}
        className="py-20"
      />
    )
  }

  const project = projectById(f.projectId)
  const cls = FINDING_CLASSIFICATION[f.classification]
  const status = FINDING_STATUS[f.status]
  const sourceIns = f.inspectionRef ? inspectionByRef(f.inspectionRef) : undefined
  const blockingHolds = controlPointsOfProject(f.projectId).filter(
    (c) => c.conditions?.some((x) => !x.met && x.label.includes(f.ref)),
  )
  const mentioningReports = reportsMentioningFinding(f.id)
  const overdue = f.dueAt && new Date(f.dueAt).getTime() < Date.now() && !['closed', 'superseded', 'cancelled'].includes(f.status)

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'Proyek', to: '/dashboard/proyek' },
          { label: project.name, to: `/dashboard/proyek/${project.id}` },
          { label: 'Temuan', to: `/dashboard/temuan?proyek=${project.id}` },
          { label: f.ref },
        ]}
        title={f.title}
        description={f.location}
        meta={
          <>
            <Badge tone="neutral" size="sm" className="font-mono">{f.ref}</Badge>
            <StatusBadge status={cls} size="sm" />
          </>
        }
        actions={
          sourceIns && (
            <Link
              to={`/dashboard/inspeksi/${sourceIns.id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium text-ink shadow-xs transition-colors hover:bg-hover"
            >
              <ClipboardCheck {...iconProps(15)} /> Inspeksi sumber {sourceIns.ref}
            </Link>
          )
        }
      />

      <PageBody className="space-y-5">
        <Callout tone={status.tone === 'neutral' ? 'info' : status.tone} icon={status.icon} title={`Status: ${status.label}`}>
          {status.description}
          {overdue && f.dueAt && <> <strong>Jatuh tempo {formatRelative(f.dueAt)}, terlambat.</strong></>}
        </Callout>

        {f.ncrRequired && (
          <Callout tone="danger" icon={Flag} title="NCR formal diperlukan">
            Inkonformitas terkonfirmasi, dicatat pada sistem resmi proyek.
          </Callout>
        )}

        <div className="grid items-start gap-4 lg:grid-cols-3">
          {/* KOLOM UTAMA */}
          <div className="space-y-4 lg:col-span-2">
            {/* Fakta ≠ dugaan ≠ disposisi: FR-FA-03 */}
            <Card>
              <CardHeader title="Kondisi teramati" />
              <CardBody className="space-y-3 pt-3">
                <div className="rounded-lg border border-line-subtle p-3">
                  <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-ink-muted"><Eye {...iconProps(12)} /> Fakta objektif</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{f.facts}</p>
                </div>
                {f.suspectedCause && (
                  <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/60 p-3">
                    <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-wider text-amber-700"><TriangleAlert {...iconProps(12)} /> Dugaan penyebab (belum dikonfirmasi)</p>
                    <p className="mt-1 text-sm text-amber-950">{f.suspectedCause}</p>
                  </div>
                )}
                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-ink-muted">Luas terdampak</dt>
                    <dd className="text-sm font-medium text-ink">{f.affectedExtent}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Dasar persyaratan</dt>
                    <dd className="font-mono text-xs font-medium text-ink">{f.sourceRequirement}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Diidentifikasi</dt>
                    <dd className="tnum text-sm font-medium text-ink">{formatDateTime(f.identifiedAt)}
                      <span className="block text-xs font-normal text-ink-muted">{f.identifiedBy}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Penanggung jawab</dt>
                    <dd className="text-sm font-medium text-ink">{f.assignee}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>

            {/* Tindakan perbaikan: SC-17/18/19 */}
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-md font-semibold text-ink">Tindakan perbaikan</h2>
                <span className="text-xs text-ink-muted">
                  {f.actions.length > 0 ? `${f.actions.length} tindakan` : 'Belum ada tindakan ditetapkan'}
                </span>
              </div>
              {f.actions.map((a) => <ActionCard key={a.id} a={a} />)}
              {f.actions.length === 0 && (
                <div className="rounded-xl border border-dashed border-line-strong p-4 text-sm text-ink-muted">
                  Observasi mungkin tidak memerlukan tindakan formal.
                </div>
              )}
            </div>

            {/* Bukti Foto & Dokumen */}
            <Card>
              <CardHeader
                title="Bukti & Dokumentasi"
                icon={Camera}
                actions={
                  <span className="flex items-center gap-1 rounded-full bg-sunken px-2 py-0.5 text-[11px] font-semibold text-ink-muted">
                    2 berkas
                  </span>
                }
              />
              <CardBody className="grid grid-cols-2 gap-3 pt-3">
                {/* Thumbnail: Foto Temuan Awal */}
                <button
                  type="button"
                  onClick={() => { setViewerType('photo-before'); setViewerOpen(true) }}
                  className="group relative overflow-hidden rounded-lg border border-red-200 bg-red-950 aspect-4/3 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#451a03,#451a03_30px,#78350f_30px,#78350f_60px)] opacity-30" />
                  <div className="absolute inset-0 flex flex-col justify-around p-2">
                    <div className="h-2 w-full bg-stone-500 rounded-xs opacity-80 translate-y-2" />
                    <div className="h-2 w-full bg-stone-500 rounded-xs opacity-80 translate-y-2" />
                  </div>
                  <div className="absolute top-1.5 left-1.5 rounded bg-red-600 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                    F-AR-021 (CACAT)
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <Eye size={20} className="text-white" />
                  </div>
                  <p className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-semibold text-white/90 bg-black/60 rounded px-1 py-0.5">
                    Foto Temuan Awal
                  </p>
                </button>

                {/* Thumbnail: Foto Pasca-Koreksi */}
                <button
                  type="button"
                  onClick={() => { setViewerType('photo-rebar'); setViewerOpen(true) }}
                  className="group relative overflow-hidden rounded-lg border border-emerald-300 bg-slate-950 aspect-4/3 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#78350f,#78350f_30px,#92400e_30px,#92400e_60px)] opacity-20" />
                  <div className="absolute inset-0 flex flex-col justify-around p-2">
                    <div className="h-2 w-full bg-slate-400 rounded-xs opacity-80" />
                    <div className="h-2 w-full bg-slate-400 rounded-xs opacity-80" />
                  </div>
                  <div className="absolute top-1.5 left-1.5 rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                    SPACER OK
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <Eye size={20} className="text-white" />
                  </div>
                  <p className="absolute bottom-1.5 left-1.5 right-1.5 text-center text-[9px] font-semibold text-white/90 bg-black/60 rounded px-1 py-0.5">
                    Foto Pasca-Koreksi
                  </p>
                </button>
              </CardBody>
            </Card>

            {/* Riwayat */}
            <Card>
              <CardHeader title="Riwayat temuan" />
              <CardBody className="pt-4">
                <EventTimeline events={f.timeline} />
              </CardBody>
            </Card>
          </div>

          {/* KOLOM SAMPING */}
          <div className="space-y-4">
            <Card>
              <CardHeader title="Ringkasan" />
              <CardBody className="space-y-3 pt-3">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={cls} />
                  <StatusBadge status={status} />
                </div>
                <dl className="space-y-2 text-xs">
                  <div><dt className="text-ink-muted">Klasifikasi</dt><dd className="font-medium text-ink">{cls.description}</dd></div>
                  <div><dt className="text-ink-muted">Penanggung jawab</dt><dd className="font-medium text-ink">{f.assignee}</dd></div>
                  <div><dt className="text-ink-muted">Jatuh tempo</dt><dd className="tnum font-medium text-ink">{f.dueAt ? formatDateTime(f.dueAt) : '-'}</dd></div>
                  {f.ncrRef && <div><dt className="text-ink-muted">Referensi NCR</dt><dd className="font-mono font-medium text-ink">{f.ncrRef}</dd></div>}
                </dl>
              </CardBody>
            </Card>

            {blockingHolds.length > 0 && (
              <Callout tone="danger" icon={Scale} title="Temuan memblokir rilis hold point">
                <div className="space-y-1.5 mt-1">
                  {blockingHolds.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">{c.ref}</span>
                      <span className="text-xs font-medium text-red-950">{c.title}</span>
                    </div>
                  ))}
                </div>
              </Callout>
            )}

            <Card>
              <CardHeader title="Konteks" />
              <CardBody className="space-y-1.5 pt-3 text-xs text-ink-muted">
                <p>Proyek: <Link to={`/dashboard/proyek/${project.id}`} className="font-medium text-brand-700 hover:underline">{projectName(project.id)}</Link></p>
                {sourceIns && <p>Sumber: <Link to={`/dashboard/inspeksi/${sourceIns.id}`} className="font-mono text-brand-700 hover:underline">{sourceIns.ref}</Link></p>}
                {mentioningReports.length > 0 && (
                  <div>
                    <p className="mt-1">Disebut dalam laporan harian lapangan:</p>
                    <ul className="mt-1 space-y-1">
                      {mentioningReports.map((r) => (
                        <li key={r.id}>
                          <Link to={`/dashboard/proyek/${r.projectId}`} className="inline-flex items-center gap-1 text-brand-700 hover:underline">
                            <FileText {...iconProps(11)} />
                            <span className="font-mono">{r.ref}</span>
                            <span className="tnum text-ink-muted">· {formatRelative(r.at)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </PageBody>
      <EvidenceViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        initialType={viewerType}
      />
    </>
  )
}
