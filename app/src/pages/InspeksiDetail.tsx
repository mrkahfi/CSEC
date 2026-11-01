import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarX,
  Camera,
  CircleCheck,
  ClipboardCheck,
  EyeOff,
  FileSearch,
  FileText,
  FileWarning,
  Link2,
  Lock,
  LockOpen,
  MapPin,
  MessageCircleQuestion,
  MinusCircle,
  Route,
  Stamp,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import {
  FINDING_CLASSIFICATION,
  HOLD_POINT_STATUS,
  INSPECTION_STATUS,
  POINT_TYPE,
  TONE_STYLES,
  type StatusTone,
} from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Callout'
import { Dialog } from '@/components/ui/Dialog'
import { Checkbox } from '@/components/ui/Checkbox'
import { Tooltip } from '@/components/ui/Tooltip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime, formatRelative } from '@/lib/format'
import { useDemo } from '@/demo/DemoContext'
import { useSimulatedLoading } from '@/demo/hooks'
import { EventTimeline } from '@/demo/EventTimeline'
import {
  activityById,
  controlPointById,
  findingById,
  inspectionById,
  projectById,
  type Inspection,
} from '@/demo/data'

/* ------------------------------------------------------------
 * Panel keputusan (FR-RV) — murni simulasi: membuka dialog,
 * mengonfirmasi hanya menampilkan toast. Tanpa logika bisnis.
 * ------------------------------------------------------------ */

type OutcomeId = 'accept' | 'correction' | 'clarification' | 'defer' | 'unable'

const OUTCOMES: Record<OutcomeId, { label: string; tone: StatusTone; icon: typeof CircleCheck; note?: string }> = {
  accept: {
    label: 'Diterima',
    tone: 'success',
    icon: CircleCheck,
    note: 'Berlaku untuk lingkup & revisi yang ditinjau, tidak merilis hold point.',
  },
  correction: {
    label: 'Perlu Perbaikan',
    tone: 'warning',
    icon: FileWarning,
    note: 'Tidak otomatis membuat NCR, tergantung prosedur proyek.',
  },
  clarification: { label: 'Perlu Klarifikasi', tone: 'warning', icon: MessageCircleQuestion, note: 'Kelengkapan informasi, bukan kegagalan teknis.' },
  defer: { label: 'Tunda / Jadwalkan ulang', tone: 'neutral', icon: CalendarX, note: 'Waktu asli, alasan & jadwal baru tercatat.' },
  unable: { label: 'Tidak Dapat Diinspeksi', tone: 'warning', icon: EyeOff, note: 'Pekerjaan tidak siap / pemeriksa tidak hadir.' },
}

function DecisionDialog({
  ins,
  outcome,
  onClose,
  authorized,
}: {
  ins: Inspection
  outcome: OutcomeId | null
  onClose: () => void
  authorized: boolean
}) {
  const toast = useToast()
  const [comment, setComment] = useState('')
  if (!outcome) return null
  const o = OUTCOMES[outcome]
  const needsComment = outcome !== 'accept'

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Rekam keputusan: ${o.label}`}
      description={`${ins.ref} · ${ins.title}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button
            variant={outcome === 'accept' ? 'primary' : outcome === 'correction' ? 'danger' : 'secondary'}
            disabled={needsComment && comment.trim() === ''}
            onClick={() => {
              onClose()
              toast({ tone: 'brand', title: 'Simulasi keputusan direkam', description: `${o.label} · ${ins.ref}, data demo tidak berubah (tanpa persistensi).` })
            }}
          >
            <o.icon {...iconProps(16)} strokeWidth={2} />
            Rekam keputusan
          </Button>
        </>
      }
    >
      <div className="space-y-3.5">
        <Callout tone={o.tone} icon={o.icon} title={o.label}>
          {o.note}
        </Callout>

        {/* FR-RV-02: setiap keputusan membawa identitas, waktu, lingkup, komentar */}
        <dl className="grid gap-x-6 gap-y-2 rounded-lg border border-line-subtle bg-sunken px-3.5 py-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-ink-muted">Perekam (peran simulasi)</dt>
            <dd className="font-medium text-ink">{authorized ? 'Anda (via pengalih peran)' : '-'}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">Waktu</dt>
            <dd className="tnum font-medium text-ink">{formatDateTime(new Date().toISOString())} WIB</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-muted">Lingkup yang ditinjau</dt>
            <dd className="font-medium text-ink">{ins.scope} · ITP: <span className="font-mono text-xs">{ins.itpRef}</span></dd>
          </div>
        </dl>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">
            Komentar / alasan {needsComment && <span className="text-red-700">*</span>}
            {!needsComment && <span className="font-normal text-ink-muted">(opsional)</span>}
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={needsComment ? 'Wajib; alasan tercatat di riwayat.' : 'Catatan keputusan…'}
            className="w-full resize-none rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink shadow-xs outline-none transition-colors placeholder:text-ink-disabled focus-visible:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500"
          />
        </label>

        {ins.pointType === 'witness' && (
          <Checkbox
            label="Rekam waiver witness point (bila prosedur proyek mengizinkan)"
            description="Dicatat dengan otoritas, alasan & referensi instruksi proyek."
          />
        )}
      </div>
    </Dialog>
  )
}

/* ------------------------------------------------------------
 * Panel rilis hold point (FR-HP) — tombol nonaktif bila ada
 * kondisi belum terpenuhi (SC-23).
 * ------------------------------------------------------------ */

function ReleaseDialog({ cpId, onClose }: { cpId: string; onClose: () => void }) {
  const toast = useToast()
  const [comment, setComment] = useState('')
  const cp = controlPointById(cpId)!
  const unmet = cp.conditions?.filter((c) => !c.met) ?? []
  const canRelease = unmet.length === 0 && comment.trim() !== ''

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={`Catat Rilis Hold Point ${cp.ref}`}
      description={`${cp.title} · ${cp.itpRef}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            disabled={!canRelease}
            onClick={() => {
              onClose()
              toast({ tone: 'success', title: 'Simulasi rilis tercatat', description: `${cp.ref} dirilis oleh otoritas, aktivitas berikutnya tidak lagi terblokir (demo).` })
            }}
          >
            <Stamp {...iconProps(16)} strokeWidth={2} />
            Catat Rilis
          </Button>
        </>
      }
    >
      <div className="space-y-3.5">
        <Callout tone="warning" icon={Stamp} title="Rilis otoritas, berbeda dari keputusan inspeksi">
          Mengizinkan aktivitas berikutnya berjalan · tercatat atas nama {cp.releaseAuthority}.
        </Callout>

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Kondisi rilis</p>
          <ul className="space-y-1.5">
            {cp.conditions?.map((c) => (
              <li key={c.id} className="flex items-start gap-2 rounded-lg border border-line-subtle px-3 py-2 text-sm">
                {c.met ? (
                  <CircleCheck {...iconProps(16)} strokeWidth={2.1} className="mt-0.5 shrink-0 text-green-600" />
                ) : (
                  <span className="mt-0.5 shrink-0 text-red-600"><TriangleAlert {...iconProps(16)} strokeWidth={2.1} /></span>
                )}
                <div>
                  <p className={cn('font-medium', c.met ? 'text-ink-secondary' : 'text-ink')}>{c.label}</p>
                  {c.note && <p className={cn('text-xs', c.met ? 'text-ink-muted' : 'text-red-700')}>{c.note}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {unmet.length > 0 ? (
          <Callout tone="danger" icon={Lock} title="Rilis tetap nonaktif">
            {unmet.length} kondisi belum terpenuhi: {unmet.map((u) => u.label.trim()).join('; ')}.
          </Callout>
        ) : (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Komentar rilis <span className="text-red-700">*</span></span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Referensi instruksi/BA rilis…"
              className="w-full resize-none rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink shadow-xs outline-none focus-visible:border-brand-400 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-500"
            />
          </label>
        )}
      </div>
    </Dialog>
  )
}

/* ============================================================ */

const CHECK_ICON = {
  ok: { icon: CircleCheck, cls: 'text-green-600', label: 'Sesuai' },
  issue: { icon: TriangleAlert, cls: 'text-amber-600', label: 'Temuan' },
  na: { icon: MinusCircle, cls: 'text-gray-400', label: 'N/A' },
} as const

export function InspeksiDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const loading = useSimulatedLoading()
  const { role } = useDemo()
  const toast = useToast()

  const ins = inspectionById(id)
  const [outcome, setOutcome] = useState<OutcomeId | null>(null)
  const [releaseOpen, setReleaseOpen] = useState(false)

  if (loading) {
    return (
      <PageBody className="space-y-4 py-8">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 pt-2 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-80" />
        </div>
      </PageBody>
    )
  }

  if (!ins) {
    return (
      <EmptyState
        icon={FileSearch}
        title="Catatan inspeksi tidak ditemukan"
        description="ID tidak ditemukan pada data demo."
        actions={<Button variant="secondary" onClick={() => navigate('/dashboard/inspeksi')}><ArrowLeft {...iconProps(15)} /> Kembali ke register</Button>}
        className="py-20"
      />
    )
  }

  const project = projectById(ins.projectId)
  const wp = activityById(ins.activityId)
  const cp = ins.holdPointId ? controlPointById(ins.holdPointId) : undefined
  const statusDef = INSPECTION_STATUS[ins.status]
  const findings = ins.linkedFindingIds.map((f) => findingById(f)!).filter(Boolean)
  const priors = ins.priorInspectionIds.map((p) => inspectionById(p)!).filter(Boolean)
  const archived = project.status === 'closed'

  /* Otoritas keputusan simulatif (FR-RV-06 / §13) — presentasi, bukan enforcement. */
  const isExternalDecision = ins.status === 'external_review'
  const authorized = archived
    ? false
    : isExternalDecision
      ? role === 'external'
      : role === 'qc_inspector' || role === 'quality_manager'
  const decisionOwner = isExternalDecision ? ins.externalAuthority ?? ins.reviewer : ins.reviewer

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'Proyek', to: '/dashboard/proyek' },
          { label: project.name, to: `/dashboard/proyek/${project.id}` },
          { label: 'Inspeksi', to: `/dashboard/inspeksi?proyek=${project.id}` },
          { label: ins.ref },
        ]}
        title={ins.title}
        description={ins.scope}
        meta={
          <>
            <Badge tone="neutral" size="sm" className="font-mono">{ins.ref}</Badge>
            <StatusBadge status={POINT_TYPE[ins.pointType]} size="sm" />
          </>
        }
        actions={
          authorized ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => setOutcome('clarification')}>
                <MessageCircleQuestion {...iconProps(15)} /> Klarifikasi
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setOutcome('correction')}>
                <FileWarning {...iconProps(15)} /> Perlu Perbaikan
              </Button>
              <Button variant="primary" size="sm" onClick={() => setOutcome('accept')}>
                <CircleCheck {...iconProps(15)} strokeWidth={2.1} /> Terima
              </Button>
            </>
          ) : archived ? (
            <Badge tone="neutral" icon={Lock}>Arsip (hanya-baca)</Badge>
          ) : (
            <Tooltip content={`Keputusan oleh: ${decisionOwner}`}>
              <Button variant="secondary" size="sm" disabled onClick={() => toast({ tone: 'info', title: 'Dirutekan ke pemberi keputusan', description: `Simulasi: tautan tinjauan dikirim ke ${decisionOwner}.` })}>
                <Route {...iconProps(15)} /> Rutekan ke otoritas
              </Button>
            </Tooltip>
          )
        }
      />

      <PageBody className="space-y-5">
        {/* Pita status + tindakan berikutnya (FR-ID-06 / §14.1) */}
        <Callout
          tone={statusDef.tone === 'neutral' ? 'info' : statusDef.tone}
          icon={statusDef.icon}
          title={`Status: ${statusDef.label}`}
          actions={
            ins.nextAction ? (
              <span className="text-xs text-ink-muted">
                Tindakan berikutnya: <span className="font-medium text-ink">{ins.nextAction.label}</span> · {ins.nextAction.owner}
                {ins.nextAction.dueAt && <> · target {formatRelative(ins.nextAction.dueAt)}</>}
              </span>
            ) : undefined
          }
        >
          {statusDef.description}
        </Callout>

        {ins.missingItems && (
          <Callout tone="warning" icon={FileWarning} title="Kelengkapan pengajuan (2 item kurang)">
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {ins.missingItems.map((m) => <li key={m}>{m}</li>)}
            </ul>
          </Callout>
        )}

        <div className="grid items-start gap-4 lg:grid-cols-3">
          {/* ════ KOLOM UTAMA ════ */}
          <div className="space-y-4 lg:col-span-2">
            {/* Detail pengajuan — FR-ID-01 */}
            <Card>
              <CardHeader title="Detail pengajuan" />
              <CardBody className="pt-3">
                <dl className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-ink-muted">Lokasi kerja</dt>
                    <dd className="text-sm font-medium text-ink">
                      <span className="inline-flex items-center gap-1"><MapPin {...iconProps(13)} className="text-ink-muted" />{ins.location}</span>
                      {ins.locationDetail && <span className="mt-0.5 block pl-5 text-xs font-normal text-ink-muted">{ins.locationDetail}</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Paket kerja</dt>
                    <dd className="text-sm font-medium text-ink">{wp?.name} <span className="font-mono text-xs text-ink-muted">{wp?.code}</span></dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Titik inspeksi & ITP</dt>
                    <dd className="flex items-center gap-2 text-sm font-medium text-ink">
                      <StatusBadge status={POINT_TYPE[ins.pointType]} size="sm" />
                      <span className="font-mono text-xs font-normal text-ink-muted">{ins.itpRef}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Pemberitahuan (notice)</dt>
                    <dd className="text-sm font-medium text-ink">{ins.noticeHours > 0 ? `${ins.noticeHours} jam sebelum jadwal` : '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Pengirim</dt>
                    <dd className="text-sm font-medium text-ink">{ins.submitter.name}<span className="block text-xs font-normal text-ink-muted">{ins.submitter.org}</span></dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Reviewer / otoritas</dt>
                    <dd className="text-sm font-medium text-ink">{ins.reviewer}{ins.externalAuthority && <span className="block text-xs font-normal text-ink-muted">Eksternal: {ins.externalAuthority}</span>}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Diajukan</dt>
                    <dd className="tnum text-sm font-medium text-ink">{ins.submittedAt ? formatDateTime(ins.submittedAt) : 'belum diajukan (draf)'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Jadwal diminta / disetujui</dt>
                    <dd className="tnum text-sm font-medium text-ink">
                      {ins.scheduledAt ? formatDateTime(ins.scheduledAt) : ins.requestedAt ? formatDateTime(ins.requestedAt) : '-'}
                    </dd>
                  </div>
                </dl>
              </CardBody>
            </Card>

            {/* Checklist + sumber persyaratan — FR-ID-03 */}
            <Card>
              <CardHeader title="Checklist & sumber persyaratan" />
              <CardBody className="pt-1">
                <ul className="divide-y divide-line-subtle">
                  {ins.checklist.map((c) => {
                    const ci = CHECK_ICON[c.result ?? 'na']
                    return (
                      <li key={c.id} className="flex items-start gap-3 py-2.5 first:pt-1 last:pb-0">
                        <span className={cn('mt-0.5 shrink-0', ci.cls)} title={ci.label}>
                          <ci.icon {...iconProps(16)} strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-ink">{c.label}</p>
                          {c.source && <p className="mt-0.5 font-mono text-xs text-ink-muted">{c.source}</p>}
                          {c.note && <p className="mt-0.5 text-xs italic text-ink-muted">{c.note}</p>}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </CardBody>
            </Card>

            {/* Dokumen & revisi — SC-27/28 */}
            <Card>
              <CardHeader title="Dokumen & revisi" />
              <CardBody className="space-y-2 pt-2">
                {ins.documents.length === 0 && <p className="text-sm text-ink-muted">Tidak ada dokumen terlampir.</p>}
                {ins.documents.map((d) => {
                  const changed = d.usedRevAtSubmission && d.rev !== d.usedRevAtSubmission
                  return (
                    <div key={d.id} className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border px-3 py-2', changed ? 'border-amber-300 bg-amber-50' : 'border-line-subtle')}>
                      <FileText {...iconProps(16)} className="shrink-0 text-ink-muted" />
                      <span className="text-sm font-medium text-ink">{d.title}</span>
                      <span className="font-mono text-xs text-ink-muted">{d.number} Rev {d.rev}</span>
                      {d.status === 'superseded' ? (
                        <>
                          <Badge tone="neutral" size="sm" icon={Link2}>Digantikan</Badge>
                          <button
                            type="button"
                            onClick={() => toast({ tone: 'info', title: 'Simulasi: buka revisi terkini', description: `${d.number} Rev ${d.rev}, demo tidak menautkan dokumen nyata.` })}
                            className="text-xs font-medium text-brand-700 hover:underline"
                          >
                            lihat revisi terkini ({d.number})
                          </button>
                        </>
                      ) : (
                        <Badge tone="success" size="sm">Revisi berjalan</Badge>
                      )}
                      {changed && <span className="w-full text-xs font-medium text-amber-800">Revisi berubah sejak pengajuan (diajukan dengan Rev {d.usedRevAtSubmission}), keputusan dampak menunggu tinjauan ulang.</span>}
                    </div>
                  )
                })}
              </CardBody>
            </Card>

            {/* Bukti & lampiran — SC-29 */}
            <Card>
              <CardHeader title="Bukti & lampiran" />
              <CardBody className="pt-2">
                <div className="grid gap-3 sm:grid-cols-3">
                  {ins.evidence.map((e) => (
                    <figure key={e.id} className={cn('overflow-hidden rounded-lg border', e.unavailable ? 'border-dashed border-red-300 bg-red-50/50' : 'border-line-subtle bg-surface shadow-xs transition-shadow hover:shadow-sm')}>
                      {e.kind === 'photo' && (
                        <div className={cn('flex aspect-video items-center justify-center', e.unavailable ? 'bg-red-50 text-red-400' : 'bg-sunken text-gray-400')}>
                          {e.unavailable ? <TriangleAlert {...iconProps(22)} /> : <Camera {...iconProps(22)} />}
                        </div>
                      )}
                      <figcaption className="space-y-1 p-2.5">
                        <p className={cn('text-xs font-medium leading-4', e.unavailable ? 'text-red-800' : 'text-ink')}>{e.title}</p>
                        <p className="text-2xs leading-4 text-ink-muted">{e.meta}</p>
                        {e.unavailable && (
                          <p className="rounded bg-red-100 px-1.5 py-1 text-2xs font-medium leading-4 text-red-800">
                            Lampiran tidak tersedia, perlu penggantian.
                          </p>
                        )}
                        {e.kind !== 'photo' && (
                          <p className="inline-flex items-center gap-1 text-2xs font-medium text-brand-700">
                            <FileSearch {...iconProps(11)} /> {e.kind === 'test' ? 'Berkas uji' : 'Dokumen'} · pratinjau simulasi
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                  {ins.evidence.length === 0 && <p className="col-span-3 text-sm text-ink-muted">Belum ada bukti terlampir.</p>}
                </div>
              </CardBody>
            </Card>

            {/* Temuan tertaut + inspeksi terdahulu — FR-ID-05 */}
            {(findings.length > 0 || priors.length > 0) && (
              <Card>
                <CardHeader title="Temuan terkait & inspeksi terdahulu" />
                <CardBody className="space-y-2 pt-2">
                  {findings.map((f) => (
                    <Link key={f.id} to={`/dashboard/temuan/${f.id}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-line-subtle px-3 py-2 transition-colors hover:bg-hover">
                      <span className="font-mono text-xs text-ink-muted">{f.ref}</span>
                      <span className="text-sm font-medium text-ink">{f.title}</span>
                      <span className="ml-auto flex gap-1.5">
                        <StatusBadge status={FINDING_CLASSIFICATION[f.classification]} size="sm" />
                      </span>
                    </Link>
                  ))}
                  {priors.map((p) => (
                    <Link key={p.id} to={`/dashboard/inspeksi/${p.id}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-line-subtle px-3 py-2 transition-colors hover:bg-hover">
                      <ClipboardCheck {...iconProps(15)} className="text-ink-muted" />
                      <span className="font-mono text-xs text-ink-muted">{p.ref}</span>
                      <span className="text-sm text-ink-secondary">{p.title}</span>
                      <span className="ml-auto"><StatusBadge status={INSPECTION_STATUS[p.status]} size="sm" /></span>
                    </Link>
                  ))}
                </CardBody>
              </Card>
            )}

            {/* Riwayat — FR-ID-06 */}
            <Card>
              <CardHeader title="Riwayat & keputusan" />
              <CardBody className="pt-4">
                <EventTimeline events={ins.timeline} />
              </CardBody>
            </Card>
          </div>

          {/* ════ KOLOM SAMPING ════ */}
          <div className="space-y-4">
            {/* Status + keputusan terakhir */}
            <Card>
              <CardHeader title="Status & keputusan" />
              <CardBody className="space-y-3 pt-3">
                <StatusBadge status={statusDef} emphasis={statusDef.tone === 'warning' ? 'strong' : 'subtle'} />
                {ins.decision && (
                  <div className="rounded-lg border border-line-subtle bg-sunken p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      <Stamp {...iconProps(12)} /> Keputusan terakhir
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-ink">{ins.decision.outcome}</p>
                    <p className="text-xs text-ink-secondary">
                      {ins.decision.by} · {ins.decision.role}
                    </p>
                    <p className="tnum text-xs text-ink-muted">{ins.decidedAt ? formatDateTime(ins.decidedAt) : ''}</p>
                    <p className="mt-1.5 text-xs text-ink-muted"><span className="text-ink-secondary">Lingkup:</span> {ins.decision.scope}</p>
                    <p className="mt-1 border-l-2 border-line-strong pl-2 text-xs italic text-ink-secondary">“{ins.decision.comment}”</p>
                  </div>
                )}
                {!ins.decision && (
                  <p className="text-xs text-ink-muted">Belum ada keputusan terekam. {archived ? 'Rekam historis arsip.' : `Otoritas: ${decisionOwner}.`}</p>
                )}
              </CardBody>
            </Card>

            {/* Panel hold point — FR-HP-02 */}
            {cp && (
              <Card className={cn(cp.pointType === 'hold' && !['released', 'not_due'].includes(cp.status) && 'border-amber-300')}>
                <CardHeader title="Hold point terkait" />
                <CardBody className="space-y-3 pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-ink-muted">{cp.ref}</span>
                    <span className="text-sm font-medium text-ink">{cp.title}</span>
                  </div>
                  <StatusBadge status={HOLD_POINT_STATUS[cp.status]} emphasis="strong" />
                  <dl className="space-y-1.5 text-xs">
                    <div><dt className="inline text-ink-muted">Otoritas rilis: </dt><dd className="inline font-medium text-ink">{cp.releaseAuthority}</dd></div>
                    <div><dt className="inline text-ink-muted">Referensi: </dt><dd className="inline font-mono text-ink">{cp.itpRef}</dd></div>
                    {cp.nextActivity && (
                      <div className="flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1.5 text-amber-900">
                        <Lock {...iconProps(13)} className="mt-px shrink-0" />
                        <span>Aktivitas berikutnya <strong>terblokir</strong>: {cp.nextActivity}</span>
                      </div>
                    )}
                  </dl>
                  {cp.conditions && (
                    <ul className="space-y-1 border-t border-line-subtle pt-2.5">
                      {cp.conditions.map((c) => (
                        <li key={c.id} className="flex items-start gap-1.5 text-xs">
                          <span aria-hidden className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', c.met ? 'bg-green-500' : 'bg-red-500')} />
                          <span className={c.met ? 'text-ink-muted line-through decoration-gray-300' : 'font-medium text-ink'}>{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {cp.witness && (
                    <p className="rounded-md bg-sky-50 px-2.5 py-2 text-xs text-sky-900">
                      Witness: {cp.witness.party} · {formatDateTime(cp.witness.scheduledAt)} · {cp.witness.note}
                    </p>
                  )}
                  {archived ? (
                    <p className="text-xs text-ink-muted">Rekam arsip, rilis tidak tersedia.</p>
                  ) : (
                    <Tooltip
                      content={
                        role === 'quality_manager'
                          ? undefined
                          : `Otoritas rilis: ${cp.releaseAuthority}`
                      }
                    >
                      <Button
                        variant={cp.status === 'awaiting_release' ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full"
                        disabled={role !== 'quality_manager'}
                        onClick={() => setReleaseOpen(true)}
                      >
                        <LockOpen {...iconProps(15)} />
                        Catat Rilis Hold Point
                      </Button>
                    </Tooltip>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Pihak terlibat */}
            <Card>
              <CardHeader title="Pihak terlibat" />
              <CardBody className="pt-3">
                <ul className="space-y-2.5 text-sm">
                  {[ins.submitter, { name: ins.reviewer, org: isExternalDecision ? 'Pihak eksternal' : 'QA/QC internal', role: 'qc_inspector' as const }].map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', TONE_STYLES[idx === 0 ? 'info' : 'active'].badge)}>
                        <Users {...iconProps(14)} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                        <p className="truncate text-xs text-ink-muted">{p.org}</p>
                      </div>
                    </li>
                  ))}
                  {ins.externalAuthority && (
                    <li className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tone-brand-bg text-tone-brand-text">
                        <Users {...iconProps(14)} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{ins.externalAuthority}</p>
                        <p className="text-xs text-ink-muted">Otoritas eksternal</p>
                      </div>
                    </li>
                  )}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </PageBody>

      <DecisionDialog ins={ins} outcome={outcome} onClose={() => setOutcome(null)} authorized={authorized} />
      {cp && releaseOpen && <ReleaseDialog cpId={cp.id} onClose={() => setReleaseOpen(false)} />}
    </>
  )
}
