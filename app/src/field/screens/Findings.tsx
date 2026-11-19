import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Camera, CircleCheck, CircleAlert, FileText, MessageSquareWarning,
  SearchCheck, TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Textarea } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FINDING_STATUS, FINDING_CLASSIFICATION, type FindingStatusId } from '@/components/status'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { fProject, type FFinding, type TimelineEvent } from '@/field/data'
import { EvidenceChip, MCard, KV, PhotoTile, Screen, SectionTitle, Segmented, StickyBar, TopBar } from '@/field/ui'
import { FindingCard, BeforeAfter } from '@/field/screens/shared'
import { useToast } from '@/components/ui/Toast'

/* ============================================================
 * FO-27 Daftar temuan + FO-28 detail + FO-29 tindak lanjut
 * + FO-30 verifikasi perbaikan
 * ============================================================ */

const OPEN_FINDING: FindingStatusId[] = ['open', 'assigned', 'action_in_progress', 'action_submitted', 'verification_pending', 'verification_rejected']

const TIMELINE_ICON: Record<TimelineEvent['kind'], LucideIcon> = {
  created: FileText,
  submitted: FileText,
  scheduled: FileText,
  accepted: CircleCheck,
  correction: TriangleAlert,
  clarification: CircleAlert,
  reinspection: SearchCheck,
  unable: CircleAlert,
  withdrawn: CircleAlert,
  finding: TriangleAlert,
  action: Camera,
  verified: CircleCheck,
  evidence: Camera,
  schedule_change: FileText,
}

export function FindingList() {
  const { projectId, findings } = useField()
  const project = fProject(projectId)
  const [group, setGroup] = useState<'terbuka' | 'selesai'>('terbuka')
  const list = findings
    .filter((f) => f.projectId === projectId)
    .filter((f) => group === 'terbuka' ? OPEN_FINDING.includes(f.status) : !OPEN_FINDING.includes(f.status))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))

  return (
    <Screen topBar={<TopBar large title="Temuan" subtitle={`${project.name} · ${findings.filter((f) => f.projectId === projectId).length} catatan`} />} className="px-4 pt-4 pb-6">
      <div className="space-y-4">
        <div className="flex gap-1.5">
          {([['terbuka', 'Terbuka'], ['selesai', 'Selesai']] as const).map(([key, label]) => {
            const n = findings.filter((f) => f.projectId === projectId && (key === 'terbuka' ? OPEN_FINDING.includes(f.status) : !OPEN_FINDING.includes(f.status))).length
            return (
              <button
                key={key}
                type="button"
                onClick={() => setGroup(key)}
                className={cn(
                  'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors',
                  key === group ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-surface text-ink-secondary',
                )}
              >
                {label}
                <span className={cn('tnum text-xs', key === group ? 'text-white/80' : 'text-ink-disabled')}>{n}</span>
              </button>
            )
          })}
        </div>

        {list.length === 0
          ? <EmptyState icon={CircleCheck} title="Tidak ada temuan" description={group === 'terbuka' ? 'Semua temuan proyek ini sudah selesai.' : 'Belum ada riwayat temuan selesai.'} />
          : (
            <div className="space-y-2">
              {list.map((f) => <FindingCard key={f.id} f={f} />)}
            </div>
          )}
      </div>
    </Screen>
  )
}

function FindingActions({ f }: { f: FFinding }) {
  const { persona } = useField()
  const navigate = useNavigate()
  const needsAction = ['assigned', 'action_in_progress', 'verification_rejected'].includes(f.status)
  const needsVerify = ['verification_pending', 'action_submitted'].includes(f.status)

  if (persona === 'engineer' && needsAction) {
    return (
      <StickyBar>
        <button
          type="button"
          onClick={() => navigate(`/field/temuan/${f.id}/tindakan`)}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800"
        >
          <MessageSquareWarning {...iconProps(15)} /> Tanggapi & Kirim Bukti
        </button>
      </StickyBar>
    )
  }
  if (persona === 'qc' && needsVerify) {
    return (
      <StickyBar>
        <button
          type="button"
          onClick={() => navigate(`/field/temuan/${f.id}/verifikasi`)}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800"
        >
          <SearchCheck {...iconProps(15)} /> Verifikasi Perbaikan
        </button>
      </StickyBar>
    )
  }
  return undefined
}

export function FindingDetail() {
  const { id } = useParams()
  const { findings, wirs } = useField()
  const f = findings.find((x) => x.id === id)

  if (!f) {
    return (
      <Screen topBar={<TopBar title="Temuan" onBack="/field/temuan" />} className="p-4">
        <EmptyState icon={MessageSquareWarning} title="Temuan tidak ditemukan" />
      </Screen>
    )
  }

  const status = FINDING_STATUS[f.status]
  const cls = FINDING_CLASSIFICATION[f.classification]
  const overdue = new Date(f.dueAt).getTime() < Date.now() && !['verified', 'closed'].includes(f.status)
  const sourceWir = wirs.find((w) => w.id === f.sourceWirId)

  return (
    <Screen
      topBar={(
        <TopBar
          title={f.ref}
          subtitle={f.title}
          onBack="/field/temuan"
          right={<StatusBadge status={status} size="sm" />}
        />
      )}
      sticky={<FindingActions f={f} />}
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-5">
        <MCard className="space-y-2.5 p-3.5">
          <KV label="Klasifikasi"><Badge size="sm" tone={cls.tone}>{cls.label}</Badge></KV>
          {f.ncrRef && <KV label="Ref. Formal">{f.ncrRef}</KV>}
          <KV label="Lokasi">{f.location}</KV>
          <KV label="Penanggung jawab">{f.responsible}</KV>
          <KV label="Jatuh tempo">
            <span className={cn(overdue && 'font-semibold text-amber-700')}>
              {formatRelative(f.dueAt)}{overdue ? ' · lewat tenggat' : ''}
            </span>
          </KV>
          {sourceWir && (
            <KV label="Sumber">
              <Link to={`/field/inspeksi/${sourceWir.id}`} className="font-mono text-brand-700 underline decoration-brand-300 underline-offset-2">
                {sourceWir.ref}
              </Link>
            </KV>
          )}
        </MCard>

        <section className="space-y-2">
          <SectionTitle>Kondisi Terukur & Spesifikasi</SectionTitle>
          {f.benchmark ? (
            <MCard className="space-y-3 p-3.5">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-red-200 bg-red-50/70 p-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-red-800">Terukur</span>
                  <span className="font-mono text-base font-bold text-red-950 tnum">{f.benchmark.actual}</span>
                </div>
                <div className="rounded-lg border border-line-subtle bg-sunken p-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">Standar</span>
                  <span className="font-mono text-base font-bold text-ink tnum">{f.benchmark.standard}</span>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">Deviasi</span>
                  <span className="font-mono text-base font-bold text-amber-950 tnum">{f.benchmark.deviation}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-subtle pt-2 text-2xs">
                <span className="text-ink-muted">Dasar: <span className="font-mono font-semibold text-ink">{f.benchmark.referenceDoc}</span></span>
                {f.benchmark.secondaryPoints && (
                  <span className="text-emerald-700 font-medium">✓ {f.benchmark.secondaryPoints}</span>
                )}
              </div>
              {f.rootCause && (
                <div className="rounded-md border border-line-subtle bg-sunken/60 p-2 text-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-amber-100 px-1.5 py-0.2 font-bold text-amber-900 text-[10px] uppercase tracking-wider">
                      {f.rootCause.category}
                    </span>
                    <span className="font-semibold text-ink">{f.rootCause.component}</span>
                  </div>
                  <p className="mt-1 text-ink-muted">{f.rootCause.trigger}</p>
                </div>
              )}
            </MCard>
          ) : (
            <MCard className="p-3.5">
              <p className="text-sm leading-6 text-ink-secondary">{f.desc}</p>
            </MCard>
          )}
        </section>

        {f.evidence.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Bukti awal</SectionTitle>
            <div className="-mx-4 overflow-x-auto px-4">
              <div className="flex gap-2">
                {f.evidence.map((ev) => <EvidenceChip key={ev.id} ev={ev} />)}
              </div>
            </div>
          </section>
        )}

        {f.response && (
          <section className="space-y-2">
            <SectionTitle>Tindak lanjut perbaikan</SectionTitle>
            <MCard className="space-y-2.5 p-3.5">
              {f.response.actionPlan ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-brand-200">
                      {f.response.actionPlan.actionType}
                    </span>
                    {f.response.actionPlan.requirePhotoEvidence && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
                        Wajib Bukti Foto
                      </span>
                    )}
                    {f.response.evidenceCount && (
                      <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200">
                        <Camera {...iconProps(11)} /> {f.response.evidenceCount} Foto
                      </span>
                    )}
                  </div>
                  <div className="rounded-md border border-line-subtle bg-sunken/40 p-2 text-xs">
                    <span className="font-semibold text-ink">{f.response.actionPlan.component}</span>
                    <span className="block text-ink-muted text-2xs mt-0.5">{f.response.actionPlan.targetLocation}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-6 text-ink-secondary">{f.response.desc}</p>
              )}
              <div className="flex items-center gap-2 border-t border-line-subtle pt-2 text-2xs text-ink-muted">
                <span className="font-semibold text-ink">{f.response.by}</span>
                <span>·</span>
                <span>{formatRelative(f.response.at)}</span>
              </div>
              {f.response.evidence.length > 0 && (
                <div className="mt-2">
                  <BeforeAfter
                    before={{ title: f.evidence[0]?.title ?? 'Kondisi awal' }}
                    after={{ title: f.response.evidence[0]?.title ?? 'Setelah perbaikan' }}
                  />
                </div>
              )}
            </MCard>
          </section>
        )}

        {f.verification && f.verification.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Verifikasi QC</SectionTitle>
            <div className="space-y-2">
              {f.verification.map((v, i) => (
                <Callout
                  key={i}
                  tone={v.outcome === 'verified' ? 'success' : v.outcome === 'rejected' ? 'danger' : 'warning'}
                  icon={v.outcome === 'verified' ? CircleCheck : TriangleAlert}
                  title={`${v.outcome === 'verified' ? 'Terverifikasi' : v.outcome === 'rejected' ? 'Perlu perbaikan ulang' : 'Klarifikasi'} · ${v.by}`}
                >
                  <span className="space-y-0.5">
                    {v.note && <span className="block">{v.note}</span>}
                    <span className="block text-xs opacity-80">{formatRelative(v.at)}</span>
                  </span>
                </Callout>
              ))}
            </div>
          </section>
        )}

        {/* Linimasa */}
        <section className="space-y-2">
          <SectionTitle>Linimasa</SectionTitle>
          <MCard className="p-3.5">
            <ol className="space-y-3">
              {[...f.timeline].sort((a, b) => a.at.localeCompare(b.at)).map((e, i, arr) => {
                const TIcon = TIMELINE_ICON[e.kind] ?? FileText
                return (
                  <li key={e.id} className="relative flex gap-3">
                    {i < arr.length - 1 && <span aria-hidden className="absolute top-6 bottom-0 left-[11px] w-px bg-line-subtle" />}
                    <span className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-secondary">
                      <TIcon {...iconProps(13)} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{e.title}</p>
                        <span className="tnum shrink-0 text-2xs text-ink-disabled">{formatRelative(e.at)}</span>
                      </div>
                      {e.note && <p className="mt-0.5 text-sm leading-5 text-ink-secondary">{e.note}</p>}
                    </div>
                  </li>
                )
              })}
            </ol>
          </MCard>
        </section>
      </div>
    </Screen>
  )
}

/* ---------- FO-29: form tindak lanjut (engineer) ---------- */

export function FindingRespond() {
  const { id } = useParams()
  const { findings, setFindings, setEvents, setInbox } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const f = findings.find((x) => x.id === id)
  const [desc, setDesc] = useState('')
  const [photos, setPhotos] = useState(0)

  if (!f) {
    return (
      <Screen topBar={<TopBar title="Tindak lanjut" onBack="/field/temuan" />} className="p-4">
        <EmptyState icon={MessageSquareWarning} title="Temuan tidak ditemukan" />
      </Screen>
    )
  }

  const submit = () => {
    const now = new Date().toISOString()
    setFindings((list) => list.map((x) => x.id === f.id
      ? {
          ...x,
          status: 'verification_pending',
          response: {
            desc: desc.trim() || 'Perbaikan dilaporkan selesai.',
            at: now,
            by: 'Andi Pratama',
            evidence: Array.from({ length: photos }, (_, i) => ({
              id: `re-${i}`, kind: 'photo' as const, title: `Bukti perbaikan ${i + 1}`, meta: 'Kondisi setelah perbaikan', cat: 'temuan' as const, phase: 'after' as const,
            })),
          },
          timeline: [...x.timeline, { id: `fa-${Date.now()}`, at: now, actor: 'Andi Pratama', role: 'Site Engineer', title: 'Bukti perbaikan diajukan', kind: 'action', note: desc.trim() || undefined }],
        }
      : x))
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId: f.projectId, at: now, kind: 'kendala', title: `Bukti perbaikan ${f.ref} diajukan` },
      ...list,
    ])
    setInbox((list) => [
      {
        id: `ib-${Date.now()}`, to: 'qc',
        title: `Bukti perbaikan ${f.ref} menunggu verifikasi`,
        body: desc.trim() || 'Perbaikan dilaporkan selesai; foto terlampir.',
        at: now, tone: 'warning', link: `/field/temuan/${f.id}`,
      },
      ...list,
    ])
    toast({ tone: 'success', title: 'Bukti perbaikan terkirim', description: 'QC akan memverifikasi (simulasi).' })
    navigate(`/field/temuan/${f.id}`)
  }

  return (
    <Screen
      topBar={<TopBar title="Tindak Lanjut" subtitle={`${f.ref} · ${f.title}`} onBack={`/field/temuan/${f.id}`} />}
      sticky={(
        <StickyBar>
          <button type="button" onClick={submit} className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            Kirim Bukti Perbaikan
          </button>
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        {f.actionPlan ? (
          <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-3 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-900 block">Instruksi Tindak Lanjut</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800">
                {f.actionPlan.actionType}
              </span>
              {f.actionPlan.requirePhotoEvidence && (
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                  Wajib Foto
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-ink">{f.actionPlan.component} <span className="text-ink-muted font-normal">({f.actionPlan.targetLocation})</span></p>
            {f.actionPlan.standardSpec && (
              <span className="font-mono text-2xs text-ink-muted block">Standar: {f.actionPlan.standardSpec}</span>
            )}
          </div>
        ) : (
          <Callout tone="info" icon={CircleAlert} title="Yang diminta">
            {f.desc}
          </Callout>
        )}

        <Field label="Uraian perbaikan" hint="Jelaskan apa yang diperbaiki dan hasilnya.">
          <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Contoh: Jarak kait diperbaiki ke 200 mm dan disera ulang." />
        </Field>

        <section className="space-y-2">
          <SectionTitle>Foto sesudah perbaikan</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: Math.max(photos, 1) }, (_, i) => i < photos
              ? (
                <PhotoTile
                  key={i}
                  photo={{ title: `Bukti perbaikan ${i + 1}`, state: 'ok', gradient: 'from-green-50 to-sky-100', cat: 'temuan', phase: 'after' }}
                  onClick={() => setPhotos((n) => n - 1)}
                />
              )
              : (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotos((n) => n + 1)}
                  className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-line-strong bg-sunken text-ink-muted transition-colors active:bg-hover"
                >
                  <Camera {...iconProps(19)} />
                  <span className="text-2xs leading-3.5">Ambil foto</span>
                </button>
              ))}
          </div>
          <p className="text-2xs leading-4 text-ink-disabled">Foto sesudah dibandingkan dengan bukti awal saat verifikasi QC.</p>
        </section>
      </div>
    </Screen>
  )
}

/* ---------- FO-30: verifikasi perbaikan (QC) ---------- */

const VERDICTS = [
  { value: 'verified' as const, label: 'Terverifikasi', desc: 'Perbaikan memenuhi; temuan selesai.' },
  { value: 'rejected' as const, label: 'Perlu Ulang', desc: 'Perbaikan belum memenuhi; kembali ke penanggung jawab.' },
]

export function FindingVerify() {
  const { id } = useParams()
  const { findings, setFindings, setEvents, setInbox } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const f = findings.find((x) => x.id === id)
  const [verdict, setVerdict] = useState<'verified' | 'rejected'>('verified')
  const [note, setNote] = useState('')

  if (!f || !f.response) {
    return (
      <Screen topBar={<TopBar title="Verifikasi" onBack="/field/temuan" />} className="p-4">
        <EmptyState icon={SearchCheck} title="Belum ada bukti perbaikan" description="Tindak lanjut pengguna belum diajukan." />
      </Screen>
    )
  }

  const submit = () => {
    const now = new Date().toISOString()
    setFindings((list) => list.map((x) => x.id === f.id
      ? {
          ...x,
          status: verdict === 'verified' ? 'verified' : 'verification_rejected',
          verification: [...(x.verification ?? []), { at: now, by: 'Rina Maharani', outcome: verdict, note: note.trim() || undefined }],
          timeline: [...x.timeline, {
            id: `fv-${Date.now()}`, at: now, actor: 'Rina Maharani', role: 'QA/QC',
            title: verdict === 'verified' ? 'Perbaikan terverifikasi' : 'Perbaikan perlu diulang',
            kind: 'verified', note: note.trim() || undefined,
          }],
        }
      : x))
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId: f.projectId, at: now, kind: 'inspeksi', title: `${f.ref}: ${verdict === 'verified' ? 'perbaikan terverifikasi' : 'perbaikan perlu diulang'}` },
      ...list,
    ])
    setInbox((list) => [
      {
        id: `ib-${Date.now()}`, to: 'engineer',
        title: verdict === 'verified' ? `${f.ref} terverifikasi` : `${f.ref} perlu perbaikan ulang`,
        body: note.trim() || (verdict === 'verified' ? 'Perbaikan diterima QC.' : 'Perbaikan belum memenuhi; cek catatan QC.'),
        at: now, tone: verdict === 'verified' ? 'success' : 'danger', link: `/field/temuan/${f.id}`,
      },
      ...list,
    ])
    toast({
      tone: verdict === 'verified' ? 'success' : 'warning',
      title: verdict === 'verified' ? 'Perbaikan terverifikasi' : 'Perbaikan dikembalikan',
      description: 'Status temuan diperbarui (simulasi).',
    })
    navigate(`/field/temuan/${f.id}`)
  }

  return (
    <Screen
      topBar={<TopBar title="Verifikasi Perbaikan" subtitle={`${f.ref} · ${f.title}`} onBack={`/field/temuan/${f.id}`} />}
      sticky={(
        <StickyBar>
          <button type="button" onClick={submit} className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            Simpan Verifikasi
          </button>
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        <section className="space-y-2">
          <SectionTitle>Perbandingan</SectionTitle>
          <BeforeAfter
            before={{ title: f.evidence[0]?.title ?? 'Kondisi awal' }}
            after={{ title: f.response.evidence[0]?.title ?? 'Setelah perbaikan' }}
          />
        </section>

        <MCard className="space-y-2.5 p-3.5">
          <KV label="Diajukan oleh">{f.response.by}</KV>
          <KV label="Waktu">{formatRelative(f.response.at)}</KV>
          <KV label="Penanggung jawab">{f.responsible}</KV>
        </MCard>

        <section className="space-y-2">
          <SectionTitle>Uraian perbaikan</SectionTitle>
          <MCard className="p-3.5 space-y-2">
            {f.response.actionPlan ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-brand-200">
                    {f.response.actionPlan.actionType}
                  </span>
                  {f.response.evidenceCount && (
                    <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200">
                      <Camera {...iconProps(11)} /> {f.response.evidenceCount} Foto Terlampir
                    </span>
                  )}
                </div>
                <div className="rounded-md border border-line-subtle bg-sunken/40 p-2 text-xs">
                  <span className="font-semibold text-ink">{f.response.actionPlan.component}</span>
                  <span className="block text-ink-muted text-2xs mt-0.5">{f.response.actionPlan.targetLocation}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-6 text-ink-secondary">{f.response.desc}</p>
            )}
          </MCard>
        </section>

        {f.response.evidence.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Bukti sesudah</SectionTitle>
            <div className="-mx-4 overflow-x-auto px-4">
              <div className="flex gap-2">
                {f.response.evidence.map((ev) => <EvidenceChip key={ev.id} ev={ev} />)}
              </div>
            </div>
          </section>
        )}

        <section className="space-y-2">
          <SectionTitle>Keputusan verifikasi</SectionTitle>
          <Segmented value={verdict} onChange={setVerdict} options={VERDICTS.map((v) => ({ value: v.value, label: v.label }))} />
          <p className="text-xs leading-5 text-ink-muted">{VERDICTS.find((v) => v.value === verdict)!.desc}</p>
        </section>

        <Field label="Catatan verifikasi" hint="Wajib bila perbaikan perlu diulang.">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Contoh: Jarak support kini sesuai; tidak ada catatan lain." />
        </Field>
      </div>
    </Screen>
  )
}
