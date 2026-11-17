import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarX,
  Camera,
  CircleCheck,
  ClipboardCheck,
  Eye,
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
import { EvidenceViewerModal, type EvidenceType } from '@/components/EvidenceViewerModal'
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
  const { setScenario } = useDemo()
  const [comment, setComment] = useState('')
  if (!outcome) return null
  const o = OUTCOMES[outcome]
  const needsComment = outcome !== 'accept'

  return (
    <Dialog
      open
      onClose={onClose}
      title={`Rekam keputusan: ${o.label}`}
      description={
        <span className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sunken text-ink">{ins.ref}</span>
          <span className="text-ink-secondary">{ins.title}</span>
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button
            variant={outcome === 'accept' ? 'primary' : outcome === 'correction' ? 'danger' : 'secondary'}
            disabled={needsComment && comment.trim() === ''}
            onClick={() => {
              onClose()
              if (outcome === 'correction') {
                setScenario((prev) => ({ ...prev, wirStatus: 'correction' }))
              } else if (outcome === 'accept') {
                setScenario((prev) => ({ ...prev, wirStatus: 'accepted' }))
              }
              toast({ tone: 'brand', title: 'Keputusan direkam', description: `${o.label}: ${ins.ref}. Status simulasi skenario diperbarui.` })
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
            <dd className="flex flex-wrap items-center gap-2 font-medium text-ink">
              <span>{ins.scope}</span>
              <span className="rounded bg-surface px-1.5 py-0.5 text-xs text-ink-secondary border border-line-subtle font-mono">
                ITP: {ins.itpRef}
              </span>
            </dd>
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
  const { scenario, setScenario } = useDemo()
  const [comment, setComment] = useState('')
  const cp = controlPointById(cpId)!
  
  // Dalam skenario demo: jika WIR diterima, kondisi tercapai untuk simulasi rilis
  const conditionsMet = cp.id === 'hp-ar-02' && scenario.wirStatus === 'accepted'
  const unmet = conditionsMet ? [] : (cp.conditions?.filter((c) => !c.met) ?? [])
  const canRelease = unmet.length === 0 && comment.trim() !== ''

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={`Catat Rilis Hold Point ${cp.ref}`}
      description={`${cp.title} (${cp.itpRef})`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            disabled={!canRelease}
            onClick={() => {
              onClose()
              setScenario((prev) => ({ ...prev, holdPointReleased: true }))
              toast({ tone: 'success', title: 'Rilis hold point tercatat', description: `${cp.ref} resmi dirilis oleh Quality Manager. Izin cor aktif.` })
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
          Mengizinkan aktivitas berikutnya berjalan. Tercatat resmi atas nama {cp.releaseAuthority}.
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
  const { role, scenario } = useDemo()
  const toast = useToast()

  const ins = inspectionById(id)
  const [outcome, setOutcome] = useState<OutcomeId | null>(null)
  const [releaseOpen, setReleaseOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerType, setViewerType] = useState<EvidenceType>('photo-rebar')

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
  const rawCp = ins.holdPointId ? controlPointById(ins.holdPointId) : undefined
  const cp = (rawCp?.id === 'hp-ar-02' && scenario.holdPointReleased)
    ? { ...rawCp, status: 'released' as const }
    : rawCp

  const rawStatus = (ins.id === 'wir-ar-0142' && scenario.wirStatus === 'accepted')
    ? 'accepted'
    : (ins.id === 'wir-ar-0142' && scenario.wirStatus === 'correction')
      ? 'correction_required'
      : ins.status
  const statusDef = INSPECTION_STATUS[rawStatus]
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
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-ink-muted font-medium">Tindakan berikutnya:</span>
                <span className="font-bold text-ink">{ins.nextAction.label}</span>
                <span className="rounded bg-sunken px-1.5 py-0.2 font-medium text-ink-secondary border border-line-subtle">{ins.nextAction.owner}</span>
                {ins.nextAction.dueAt && (
                  <span className="rounded bg-amber-50 px-1.5 py-0.2 font-mono text-2xs font-bold text-amber-800 border border-amber-200">
                    target {formatRelative(ins.nextAction.dueAt)}
                  </span>
                )}
              </div>
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
                <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Lokasi kerja</dt>
                    <dd className="text-sm font-semibold text-ink">
                      <span className="inline-flex items-center gap-1.5"><MapPin {...iconProps(13)} className="text-brand-600" />{ins.location}</span>
                      {ins.locationDetail && <span className="mt-0.5 block pl-5 text-xs font-normal text-ink-muted">{ins.locationDetail}</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Paket kerja</dt>
                    <dd className="text-sm font-semibold text-ink">{wp?.name} <span className="font-mono text-xs font-normal text-ink-muted bg-sunken px-1.5 py-0.2 rounded border border-line-subtle">{wp?.code}</span></dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Titik inspeksi &amp; ITP</dt>
                    <dd className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <StatusBadge status={POINT_TYPE[ins.pointType]} size="sm" />
                      <span className="font-mono text-xs font-normal text-ink-muted">{ins.itpRef}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Pemberitahuan (notice)</dt>
                    <dd className="text-sm font-semibold text-ink">{ins.noticeHours > 0 ? `${ins.noticeHours} jam sebelum jadwal` : '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Pengirim</dt>
                    <dd className="text-sm font-semibold text-ink">{ins.submitter.name}<span className="block text-xs font-normal text-ink-muted">{ins.submitter.org}</span></dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Reviewer / otoritas</dt>
                    <dd className="text-sm font-semibold text-ink">{ins.reviewer}{ins.externalAuthority && <span className="block text-xs font-normal text-ink-muted">Eksternal: {ins.externalAuthority}</span>}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Diajukan</dt>
                    <dd className="tnum font-mono text-sm font-semibold text-ink">{ins.submittedAt ? formatDateTime(ins.submittedAt) : 'belum diajukan (draf)'}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">Jadwal diminta / disetujui</dt>
                    <dd className="tnum font-mono text-sm font-semibold text-ink">
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
              <CardHeader
                icon={Camera}
                title="Bukti Foto &amp; Laporan Lapangan"
                actions={
                  <Badge tone="brand" size="sm">
                    {ins.evidence.length} berkas terlampir
                  </Badge>
                }
              />
              <CardBody className="pt-2">
                <div className="grid gap-3 sm:grid-cols-3">
                  {ins.evidence.map((e) => {
                    const isPhoto = e.kind === 'photo'
                    const isTest = e.kind === 'test'
                    const isDoc = e.kind === 'doc'
                    const isUnavailable = e.unavailable

                    const handleClick = () => {
                      if (isUnavailable) {
                        toast({ tone: 'danger', title: 'Lampiran tidak tersedia', description: 'Berkas rusak atau belum diunggah dari lapangan.' })
                        return
                      }
                      if (e.id === 'ev1') setViewerType('photo-rebar')
                      else if (e.id === 'ev3') setViewerType('test-slump')
                      else if (e.id === 'ev2') setViewerType('doc-laporan')
                      else setViewerType('photo-before')
                      setViewerOpen(true)
                    }

                    return (
                      <figure
                        key={e.id}
                        onClick={handleClick}
                        className={cn(
                          'overflow-hidden rounded-xl border transition-all duration-150 flex flex-col',
                          isUnavailable
                            ? 'border-dashed border-red-300 bg-red-50/40 cursor-not-allowed opacity-80'
                            : 'border-line-subtle bg-surface shadow-2xs hover:shadow-sm hover:border-brand-300 cursor-pointer group',
                        )}
                      >
                        {/* Visual Thumbnail Rendering */}
                        {isPhoto && !isUnavailable && (
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-900 select-none">
                            {/* Rebar grid simulation */}
                            <div className="absolute inset-0 flex flex-col justify-around p-2 opacity-50">
                              <div className="h-1.5 w-full bg-slate-400 rounded-xs" />
                              <div className="h-1.5 w-full bg-slate-400 rounded-xs" />
                              <div className="h-1.5 w-full bg-slate-400 rounded-xs" />
                            </div>
                            <div className="absolute inset-0 flex justify-around p-2 opacity-50">
                              <div className="w-1.5 h-full bg-slate-400 rounded-xs" />
                              <div className="w-1.5 h-full bg-slate-400 rounded-xs" />
                              <div className="w-1.5 h-full bg-slate-400 rounded-xs" />
                            </div>
                            {/* Concrete Decking Spacer */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-xs bg-stone-300 border border-stone-400 shadow-md flex items-center justify-center font-mono text-[9px] font-bold text-stone-800">
                              25mm
                            </div>
                            {/* Watermark HUD */}
                            <div className="absolute top-1.5 left-1.5 font-mono text-[8px] bg-black/75 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-500/30">
                              COVER: 25.4mm [OK]
                            </div>
                            <div className="absolute bottom-1 right-1.5 font-mono text-[8px] text-white/80 bg-black/70 px-1.5 py-0.2 rounded">
                              LT.8 GRID A/2
                            </div>
                            <div className="absolute inset-0 bg-brand-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="rounded-full bg-white text-brand-700 px-2 py-1 text-2xs font-semibold shadow-md flex items-center gap-1">
                                <Eye {...iconProps(12)} /> Perbesar
                              </span>
                            </div>
                          </div>
                        )}

                        {isTest && (
                          <div className="relative aspect-video w-full overflow-hidden bg-white p-2.5 border-b border-line-subtle flex flex-col justify-between select-none">
                            <div className="flex items-start justify-between border-b border-slate-200 pb-1">
                              <span className="font-serif text-[9px] font-bold text-slate-800">PT KARYA LAB</span>
                              <span className="font-mono text-[8px] font-bold text-slate-500">BATCH 118</span>
                            </div>
                            <div className="my-auto flex items-center justify-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                SLUMP: 85 mm
                              </span>
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                                LULUS
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono">
                              <span>SNI 1972:2008</span>
                              <span className="text-emerald-700 font-semibold">QA APPROVED</span>
                            </div>
                            <div className="absolute inset-0 bg-brand-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="rounded-full bg-white text-brand-700 px-2 py-1 text-2xs font-semibold shadow-md flex items-center gap-1">
                                <Eye {...iconProps(12)} /> Buka Berita Acara
                              </span>
                            </div>
                          </div>
                        )}

                        {isDoc && (
                          <div className="relative aspect-video w-full overflow-hidden bg-white p-2.5 border-b border-line-subtle flex flex-col justify-between select-none">
                            <div className="flex items-start justify-between border-b border-slate-200 pb-1">
                              <span className="font-serif text-[9px] font-bold text-slate-800">SUPERVISI MK</span>
                              <span className="font-mono text-[8px] font-bold text-brand-700 bg-brand-50 px-1 rounded border border-brand-200/60">LW-08-114</span>
                            </div>
                            <div className="space-y-0.5 my-auto">
                              <p className="text-[10px] font-semibold text-slate-800 line-clamp-1">Pengawasan Pembesian Pelat L8</p>
                              <p className="text-[9px] text-slate-500">CV Mitra Teknik (38 Pekerja)</p>
                            </div>
                            <div className="flex items-center justify-between text-[8px] text-slate-400">
                              <span>14 Nov 2026</span>
                              <span className="text-slate-600 font-medium">Hendra Kusuma, ST</span>
                            </div>
                            <div className="absolute inset-0 bg-brand-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="rounded-full bg-white text-brand-700 px-2 py-1 text-2xs font-semibold shadow-md flex items-center gap-1">
                                <Eye {...iconProps(12)} /> Buka Laporan
                              </span>
                            </div>
                          </div>
                        )}

                        {isUnavailable && (
                          <div className="flex aspect-video items-center justify-center bg-red-50 text-red-500 border-b border-red-200">
                            <TriangleAlert {...iconProps(24)} strokeWidth={1.8} />
                          </div>
                        )}

                        <figcaption className="space-y-1 p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className={cn('text-xs font-semibold leading-snug', isUnavailable ? 'text-red-800' : 'text-ink group-hover:text-brand-700 transition-colors')}>{e.title}</p>
                            <p className="text-2xs leading-relaxed text-ink-muted mt-0.5">{e.meta}</p>
                          </div>
                          {isUnavailable ? (
                            <p className="rounded bg-red-100 px-1.5 py-0.5 text-2xs font-bold text-red-800 mt-1">
                              Lampiran tidak tersedia
                            </p>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-2xs font-semibold text-brand-700 mt-1">
                              <Eye {...iconProps(11)} /> Klik untuk pratinjau penuh
                            </span>
                          )}
                        </figcaption>
                      </figure>
                    )
                  })}
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
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-secondary">
                      <span className="font-semibold text-ink">{ins.decision.by}</span>
                      <span className="rounded bg-surface px-1.5 py-0.5 text-2xs text-ink-muted border border-line-subtle">{ins.decision.role}</span>
                    </div>
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
                    <div className="rounded-lg bg-sky-50 p-2.5 text-xs text-sky-950 border border-sky-200 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-sky-900">Witness: {cp.witness.party}</span>
                        <span className="font-mono text-2xs text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded">{formatDateTime(cp.witness.scheduledAt)}</span>
                      </div>
                      <p className="text-sky-800 text-2xs leading-normal">{cp.witness.note}</p>
                    </div>
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
      <EvidenceViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        initialType={viewerType}
      />
    </>
  )
}
