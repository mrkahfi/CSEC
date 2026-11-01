import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Camera, CircleCheck, CircleAlert, CircleSlash, ClipboardCheck, Clock,
  FilePenLine, FileQuestion, ListChecks, MapPin, Plus, SearchCheck,
  Send, TriangleAlert, UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { INSPECTION_STATUS, FINDING_STATUS, POINT_TYPE, type InspectionStatusId } from '@/components/status'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import {
  ITP_POINTS, fActivity, fProject, type ChecklistSection, type FWir, type TimelineEvent,
} from '@/field/data'
import { EvidenceChip, MCard, KV, Screen, SectionTitle, Segmented, StepBar, StickyBar, TopBar, PhotoTile, useSheet } from '@/field/ui'
import { WirCard } from '@/field/screens/shared'
import { useToast } from '@/components/ui/Toast'

/* ============================================================
 * FO-17/22 Daftar inspeksi per peran + FO-18..20 pengajuan
 * + FO-21/23 detail & keputusan + FO-24..26 pelaksanaan
 * ============================================================ */

const DISC_CODE: Record<string, string> = { Struktur: 'STR', MEP: 'MEP', Perkerasan: 'CIV' }

const TIMELINE_ICON: Record<TimelineEvent['kind'], LucideIcon> = {
  created: FilePenLine,
  submitted: Send,
  scheduled: Clock,
  accepted: CircleCheck,
  correction: TriangleAlert,
  clarification: CircleAlert,
  reinspection: SearchCheck,
  unable: CircleSlash,
  withdrawn: CircleSlash,
  finding: TriangleAlert,
  action: ClipboardCheck,
  verified: CircleCheck,
  evidence: Camera,
  schedule_change: Clock,
}

const TIMELINE_TONE: Record<TimelineEvent['kind'], string> = {
  created: 'text-ink-muted',
  submitted: 'text-sky-600',
  scheduled: 'text-sky-600',
  accepted: 'text-green-600',
  correction: 'text-amber-600',
  clarification: 'text-amber-600',
  reinspection: 'text-violet-600',
  unable: 'text-red-600',
  withdrawn: 'text-ink-muted',
  finding: 'text-amber-600',
  action: 'text-sky-600',
  verified: 'text-green-600',
  evidence: 'text-ink-muted',
  schedule_change: 'text-sky-600',
}

function TimelineList({ events }: { events: TimelineEvent[] }) {
  return (
    <MCard className="p-3.5">
      <ol className="space-y-0">
        {events.map((e, i) => {
          const TIcon = TIMELINE_ICON[e.kind] ?? Clock
          return (
            <li key={e.id} className="relative flex gap-3 pb-4 last:pb-0">
              {i < events.length - 1 && <span aria-hidden className="absolute top-6 bottom-0 left-[11px] w-px bg-line-subtle" />}
              <span className={cn('relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-line-subtle', TIMELINE_TONE[e.kind])}>
                <TIcon {...iconProps(13)} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-ink">{e.title}</p>
                  <span className="tnum shrink-0 text-2xs text-ink-disabled">{formatRelative(e.at)}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-muted">{e.actor} · {e.role}</p>
                {e.note && <p className="mt-1 text-sm leading-5 text-ink-secondary">{e.note}</p>}
                {e.detail && <p className="mt-0.5 truncate text-xs text-ink-muted">{e.detail}</p>}
              </div>
            </li>
          )
        })}
      </ol>
    </MCard>
  )
}

/* ---------- FO-17 (engineer) & FO-22 (QC): daftar ---------- */

const GROUPS: Record<'engineer' | 'qc', { key: string; label: string; statuses: InspectionStatusId[] }[]> = {
  engineer: [
    { key: 'perlu', label: 'Perlu tindakan', statuses: ['draft', 'correction_required', 'clarification_required'] },
    { key: 'berjalan', label: 'Berjalan', statuses: ['submitted', 'scheduled', 'in_progress', 'reinspection_requested'] },
    { key: 'selesai', label: 'Riwayat', statuses: ['accepted', 'withdrawn', 'cancelled', 'deferred', 'unable_to_inspect'] },
  ],
  qc: [
    { key: 'antrian', label: 'Antrian review', statuses: ['submitted'] },
    { key: 'jadwal', label: 'Terjadwal', statuses: ['scheduled', 'in_progress', 'reinspection_requested'] },
    { key: 'riwayat', label: 'Riwayat', statuses: ['accepted', 'correction_required', 'clarification_required', 'withdrawn', 'cancelled', 'deferred', 'unable_to_inspect', 'draft'] },
  ],
}

export function InspectionList() {
  const { persona, projectId, wirs } = useField()
  const navigate = useNavigate()
  const project = fProject(projectId)
  const groups = GROUPS[persona]
  const [group, setGroup] = useState<string>(groups[0].key)
  const active = groups.find((g) => g.key === group) ?? groups[0]
  const list = wirs
    .filter((w) => w.projectId === projectId && active.statuses.includes(w.status))
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))

  return (
    <Screen
      topBar={<TopBar large title="Inspeksi" subtitle={`${project.name} · ${wirs.filter((w) => w.projectId === projectId).length} permintaan`} />}
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-4">
        {persona === 'engineer' && (
          <button
            type="button"
            onClick={() => navigate('/field/inspeksi/baru')}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-brand-600 p-4 text-left text-white shadow-xs transition-colors active:bg-brand-800"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Plus {...iconProps(19)} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-md font-semibold">Ajukan inspeksi</span>
              <span className="block text-sm text-white/80">Pilih titik ITP, lampirkan bukti, kirim</span>
            </span>
          </button>
        )}

        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-1.5">
            {groups.map((g) => {
              const n = wirs.filter((w) => w.projectId === projectId && g.statuses.includes(w.status)).length
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setGroup(g.key)}
                  className={cn(
                    'inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition-colors',
                    g.key === group ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-surface text-ink-secondary',
                  )}
                >
                  {g.label}
                  <span className={cn('tnum text-xs', g.key === group ? 'text-white/80' : 'text-ink-disabled')}>{n}</span>
                </button>
              )
            })}
          </div>
        </div>

        {list.length === 0
          ? <EmptyState icon={ClipboardCheck} title="Belum ada permintaan" description="Grup ini belum berisi permintaan inspeksi." />
          : (
            <div className="space-y-2">
              {list.map((w) => (
                <WirCard
                  key={w.id}
                  wir={w}
                  meta={w.status === 'scheduled' && w.scheduledAt ? `Terjadwal ${formatRelative(w.scheduledAt)}` : undefined}
                />
              ))}
            </div>
          )}
      </div>
    </Screen>
  )
}

/* ---------- FO-18..20: pengajuan inspeksi ---------- */

export function InspectionCreate() {
  const { projectId, activities, wirs, setWirs, setEvents } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const points = ITP_POINTS.filter((p) => p.projectId === projectId)
  const [pointId, setPointId] = useState<string | null>(null)
  const point = points.find((p) => p.id === pointId) ?? null
  const activity = point ? activities.find((a) => a.projectId === projectId) : null

  const [portion, setPortion] = useState('')
  const [note, setNote] = useState('')
  const [photos, setPhotos] = useState(0)

  const ref = useMemo(() => {
    const code = activity ? DISC_CODE[activity.discipline] ?? 'GEN' : 'GEN'
    const maxN = wirs
      .filter((w) => w.ref.includes(`WIR-${code}-`))
      .map((w) => Number(w.ref.split('-')[2]) || 0)
      .reduce((a, b) => Math.max(a, b), 0)
    return `WIR-${code}-${String(maxN + 1).padStart(3, '0')}`
  }, [wirs, activity])

  if (points.length === 0) {
    return (
      <Screen topBar={<TopBar title="Ajukan Inspeksi" onBack="/field/inspeksi" />} className="p-4">
        <EmptyState icon={ClipboardCheck} title="Tidak ada titik ITP" description="Proyek ini belum memiliki titik inspeksi aktif." />
      </Screen>
    )
  }

  const submit = () => {
    if (!point) return
    const act = activities.find((a) => a.projectId === projectId) ?? activities[0]
    const now = new Date().toISOString()
    const wir: FWir = {
      id: `wir-new-${Date.now()}`,
      ref,
      projectId,
      activityId: act.id,
      itpPointId: point.id,
      title: point.name,
      location: act.location,
      portion: portion.trim() || 'Sesuai catatan lapangan',
      status: 'submitted',
      submittedAt: now,
      submitter: 'Andi Pratama',
      noticeNote: `Pemberitahuan mengikuti konfigurasi ${point.itpRef}.`,
      evidence: photos > 0
        ? Array.from({ length: photos }, (_, i) => ({ id: `ne-${i}`, kind: 'photo' as const, title: `Foto lapangan ${i + 1}`, meta: 'Lampiran pengajuan', cat: 'inspeksi' as const }))
        : [],
      checklist: [],
      timeline: [
        { id: 'nt1', at: now, actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan inspeksi diajukan', kind: 'submitted', note: note.trim() || undefined },
      ],
    }
    setWirs((list) => [wir, ...list])
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId, at: now, kind: 'inspeksi', title: `${ref} diajukan, menunggu review QC` },
      ...list,
    ])
    toast({ tone: 'success', title: `${ref} diajukan`, description: 'QC akan meninjau kelengkapan pengajuan (simulasi).' })
    navigate(`/field/inspeksi/${wir.id}`)
  }

  const STEPS = ['Titik ITP', 'Lingkup & bukti', 'Kirim']

  return (
    <Screen
      topBar={<TopBar title="Ajukan Inspeksi" subtitle={ref} onBack="/field/inspeksi" />}
      sticky={(
        <StickyBar>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="h-11 cursor-pointer rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors active:bg-hover">
                Kembali
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                disabled={!point}
                onClick={() => setStep((s) => s + 1)}
                className="h-11 flex-1 cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Lanjut: {STEPS[step + 1]}
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800"
              >
                <Send {...iconProps(15)} /> Ajukan Sekarang
              </button>
            )}
          </div>
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        <StepBar steps={STEPS} current={step} />

        {/* Langkah 1: pilih titik ITP */}
        {step === 0 && (
          <section className="space-y-2">
            <SectionTitle>Titik ITP proyek</SectionTitle>
            {points.map((p) => {
              const pt = POINT_TYPE[p.type]
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPointId(p.id)}
                  className={cn(
                    'w-full cursor-pointer rounded-xl border p-3.5 text-left shadow-xs transition-colors active:bg-hover',
                    p.id === pointId ? 'border-brand-500 bg-tone-brand-bg ring-4 ring-brand-500/10' : 'border-line-subtle bg-surface',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-ink">{p.name}</p>
                    <Badge size="sm" tone={pt.tone}>{pt.label}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{p.itpRef} · {p.item}</p>
                </button>
              )
            })}
          </section>
        )}

        {/* Langkah 2: lingkup & bukti */}
        {step === 1 && point && (
          <div className="space-y-5">
            <MCard className="space-y-2.5 p-3.5">
              <KV label="Titik">{point.name}</KV>
              <KV label="Jenis">{POINT_TYPE[point.type].label}</KV>
              <KV label="Referensi">{point.refs.join(' · ')}</KV>
            </MCard>

            <Field label="Lingkup diperiksa" hint="Sebutkan grid, STA, atau nomor ruang.">
              <Input value={portion} onChange={(e) => setPortion(e.target.value)} placeholder="Contoh: Balok B1-B4, Grid C-F" />
            </Field>

            <section className="space-y-2">
              <SectionTitle>Checklist siap-inspeksi</SectionTitle>
              <MCard className="divide-y divide-line-subtle">
                {point.readiness.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5">
                    <CircleCheck {...iconProps(14)} className="mt-0.5 shrink-0 text-green-600" />
                    <p className="text-sm leading-5 text-ink-secondary">{r}</p>
                  </div>
                ))}
              </MCard>
            </section>

            <section className="space-y-2">
              <SectionTitle>Foto bukti</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: Math.max(photos, 1) }, (_, i) => i < photos
                  ? (
                    <PhotoTile
                      key={i}
                      photo={{ title: `Foto lapangan ${i + 1}`, state: 'ok', gradient: 'from-sky-100 to-brand-50', cat: 'inspeksi' }}
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
              <p className="text-2xs leading-4 text-ink-disabled">Foto minimal menampilkan area lingkup dan penanda lokasi (simulasi kamera).</p>
            </section>

            <Field label="Catatan pengajuan" hint="Opsional; info tambahan untuk pemeriksa.">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Akses lewat lift pasir, area memakai APD ketinggian." />
            </Field>
          </div>
        )}

        {/* Langkah 3: ringkasan & kirim */}
        {step === 2 && point && (
          <div className="space-y-4">
            <section className="space-y-2">
              <SectionTitle>Ringkasan pengajuan</SectionTitle>
              <MCard className="space-y-2.5 p-3.5">
                <KV label="Nomor">{ref}</KV>
                <KV label="Titik ITP">{point.name}</KV>
                <KV label="Lingkup">{portion.trim() || 'Sesuai catatan lapangan'}</KV>
                <KV label="Foto bukti">{photos} lampiran</KV>
              </MCard>
            </section>
            <Callout tone="info" icon={Clock} title="Pemberitahuan">
              {`Pengajuan mengikuti aturan pemberitahuan pada ${point.itpRef}. QC meninjau kelengkapan sebelum penjadwalan.`}
            </Callout>
          </div>
        )}
      </div>
    </Screen>
  )
}

/* ---------- FO-21/23: detail permintaan + keputusan QC ---------- */

const DECISIONS: { status: InspectionStatusId; outcome: string; desc: string }[] = [
  { status: 'accepted', outcome: 'Diterima', desc: 'Sesuai gambar dan spesifikasi.' },
  { status: 'correction_required', outcome: 'Perlu Perbaikan', desc: 'Ada ketidaksesuaian; temuan dicatat.' },
  { status: 'clarification_required', outcome: 'Perlu Klarifikasi', desc: 'Dokumen atau lingkup perlu dilengkapi.' },
  { status: 'unable_to_inspect', outcome: 'Tidak Dapat Diperiksa', desc: 'Kondisi lapangan atau akses tidak memungkinkan.' },
]

export function InspectionDetail() {
  const { id } = useParams()
  const { persona, wirs, findings, setWirs, setFindings, setEvents, setInbox } = useField()
  const toast = useToast()
  const sheet = useSheet()
  const navigate = useNavigate()
  const wir = wirs.find((w) => w.id === id)

  if (!wir) {
    return (
      <Screen topBar={<TopBar title="Inspeksi" onBack="/field/inspeksi" />} className="p-4">
        <EmptyState icon={ClipboardCheck} title="Permintaan tidak ditemukan" />
      </Screen>
    )
  }

  const status = INSPECTION_STATUS[wir.status]
  const point = ITP_POINTS.find((p) => p.id === wir.itpPointId)
  const linked = findings.filter((f) => wir.linkedFindingIds?.includes(f.id))

  const pushEvent = (w: FWir, ev: Omit<TimelineEvent, 'id' | 'at'>) => {
    const now = new Date().toISOString()
    setWirs((list) => list.map((x) => x.id === w.id
      ? { ...x, timeline: [...x.timeline, { ...ev, id: `t-${Date.now()}`, at: now }] }
      : x))
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId: w.projectId, at: now, kind: 'inspeksi', title: `${w.ref}: ${ev.title}` },
      ...list,
    ])
    return now
  }

  const submitDraft = () => {
    setWirs((list) => list.map((x) => x.id === wir.id ? { ...x, status: 'submitted', submittedAt: new Date().toISOString() } : x))
    pushEvent(wir, { actor: 'Andi Pratama', role: 'Site Engineer', title: 'Permintaan inspeksi diajukan', kind: 'submitted' })
    toast({ tone: 'success', title: `${wir.ref} diajukan`, description: 'Menunggu tinjauan QC (simulasi).' })
  }

  const requestReinspection = () => {
    const round = (wir.rounds?.length ?? 0) + 1
    setWirs((list) => list.map((x) => x.id === wir.id
      ? {
          ...x,
          status: 'reinspection_requested',
          rounds: [...(x.rounds ?? []), { n: round, at: new Date().toISOString(), outcome: 'Re-inspeksi diminta', note: 'Perbaikan telah dilakukan; bukti terlampir.' }],
        }
      : x))
    pushEvent(wir, { actor: 'Andi Pratama', role: 'Site Engineer', title: `Re-inspeksi diminta (Ronde ${round})`, kind: 'reinspection' })
    toast({ tone: 'success', title: 'Re-inspeksi diminta', description: 'QC akan menjadwalkan Ronde berikutnya (simulasi).' })
  }

  const scheduleReinspection = () => {
    const at = new Date(Date.now() + 8 * 3_600_000).toISOString()
    setWirs((list) => list.map((x) => x.id === wir.id ? { ...x, status: 'scheduled', scheduledAt: at } : x))
    pushEvent(wir, { actor: 'Rina Maharani', role: 'QA/QC', title: 'Jadwal re-inspeksi dikonfirmasi', kind: 'schedule_change' })
    toast({ tone: 'success', title: 'Re-inspeksi dijadwalkan', description: `Ronde berikutnya ${formatRelative(at)} (simulasi).` })
  }

  const openDecision = () => {
    sheet.open({
      title: `Keputusan ${wir.ref}`,
      children: <DecisionSheet
        onDecide={(statusId, _outcome, comment, createFinding) => {
          const dec = DECISIONS.find((d) => d.status === statusId)!
          setWirs((list) => list.map((x) => x.id === wir.id
            ? {
                ...x,
                status: statusId,
                decidedAt: new Date().toISOString(),
                decision: { outcome: dec.outcome, statusId, by: 'Rina Maharani', comment },
              }
            : x))
          const now = pushEvent(wir, {
            actor: 'Rina Maharani', role: 'QA/QC',
            title: `Keputusan: ${dec.outcome}`, kind: statusId === 'accepted' ? 'accepted' : statusId === 'unable_to_inspect' ? 'unable' : 'correction',
            note: comment || undefined,
          })
          if (statusId === 'correction_required') {
            const round = (wir.rounds?.length ?? 0) + 1
            setWirs((list) => list.map((x) => x.id === wir.id
              ? { ...x, rounds: [...(x.rounds ?? []), { n: round, at: now, outcome: dec.outcome, note: comment || undefined }] }
              : x))
          }
          if (createFinding) {
            const act = fActivity(wir.activityId)
            const code = DISC_CODE[act.discipline] ?? 'GEN'
            const n = 8 + findings.length + 1
            const fid = `fnd-new-${Date.now()}`
            setFindings((list) => [
              {
                id: fid,
                ref: `FIND-${code}-${String(n).padStart(3, '0')}`,
                projectId: wir.projectId,
                activityId: wir.activityId,
                sourceWirId: wir.id,
                title: `Perbaikan diperlukan: ${wir.title}`,
                desc: comment || 'Ketidaksesuaian dicatat saat keputusan inspeksi.',
                classification: 'potential_nc',
                location: wir.location,
                responsible: act.subkon,
                dueAt: new Date(Date.now() + 48 * 3_600_000).toISOString(),
                status: 'assigned',
                evidence: [],
                timeline: [
                  { id: `tf1`, at: now, actor: 'Rina Maharani', role: 'QA/QC', title: 'Temuan dicatat dari inspeksi', kind: 'finding' },
                ],
              },
              ...list,
            ])
            setWirs((list) => list.map((x) => x.id === wir.id
              ? { ...x, linkedFindingIds: [...(x.linkedFindingIds ?? []), fid] }
              : x))
          }
          setInbox((list) => [
            {
              id: `ib-${Date.now()}`,
              to: 'engineer',
              title: `${wir.ref}: ${dec.outcome}`,
              body: comment || dec.desc,
              at: now,
              tone: statusId === 'accepted' ? 'success' : 'warning',
              link: `/field/inspeksi/${wir.id}`,
            },
            ...list,
          ])
          sheet.close()
          toast({ tone: statusId === 'accepted' ? 'success' : 'warning', title: `Keputusan dicatat: ${dec.outcome}`, description: 'Simulasi demo.' })
        }}
      />,
    })
  }

  const qcCanDecide = persona === 'qc' && wir.status === 'submitted'

  return (
    <Screen
      topBar={(
        <TopBar
          title={wir.ref}
          subtitle={wir.title}
          onBack="/field/inspeksi"
          right={<StatusBadge status={status} size="sm" />}
        />
      )}
      sticky={persona === 'engineer' && wir.status === 'draft' ? (
        <StickyBar>
          <button type="button" onClick={submitDraft} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <Send {...iconProps(15)} /> Ajukan Sekarang
          </button>
        </StickyBar>
      ) : persona === 'engineer' && ['correction_required', 'clarification_required'].includes(wir.status) ? (
        <StickyBar>
          <button type="button" onClick={requestReinspection} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <SearchCheck {...iconProps(15)} /> Ajukan Re-inspeksi
          </button>
        </StickyBar>
      ) : qcCanDecide ? (
        <StickyBar>
          <button type="button" onClick={openDecision} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <ListChecks {...iconProps(15)} /> Tinjau & Putuskan
          </button>
        </StickyBar>
      ) : persona === 'qc' && wir.status === 'scheduled' ? (
        <StickyBar>
          <button type="button" onClick={() => navigate(`/field/inspeksi/${wir.id}/kerja`)} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <ClipboardCheck {...iconProps(15)} /> Mulai Inspeksi
          </button>
        </StickyBar>
      ) : persona === 'qc' && wir.status === 'reinspection_requested' ? (
        <StickyBar>
          <button type="button" onClick={scheduleReinspection} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <Clock {...iconProps(15)} /> Jadwalkan Re-inspeksi
          </button>
        </StickyBar>
      ) : undefined}
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-5">
        {/* Info utama */}
        <MCard className="space-y-2.5 p-3.5">
          <KV label="Titik ITP">{point ? `${point.name}` : 'Titik ITP'}</KV>
          {point && <KV label="Jenis titik">{POINT_TYPE[point.type].label}</KV>}
          <KV label="Lokasi">{wir.location}</KV>
          <KV label="Lingkup">{wir.portion}</KV>
          <KV label="Pengirim">{wir.submitter}</KV>
          {wir.inspector && <KV label="Pemeriksa">{wir.inspector}</KV>}
          {wir.scheduledAt && <KV label="Jadwal">{formatRelative(wir.scheduledAt)}</KV>}
          {wir.externalParty && (
            <KV label="Pihak eksternal">
              <span className="inline-flex items-center gap-1">
                <UserCheck {...iconProps(12)} className="text-ink-muted" />
                {wir.externalParty.name} · {wir.externalParty.attendance === 'hadir' ? 'Hadir' : wir.externalParty.attendance === 'tidak_hadir' ? 'Tidak hadir' : 'Belum konfirmasi'}
              </span>
            </KV>
          )}
        </MCard>

        {/* Catatan status */}
        {wir.status === 'submitted' && wir.missingItems && wir.missingItems.length > 0 && (
          <Callout tone="warning" icon={FileQuestion} title="Kelengkapan perlu ditinjau">
            <span className="space-y-1">
              {wir.missingItems.map((m) => <span key={m} className="block">{m}</span>)}
            </span>
          </Callout>
        )}
        {wir.noticeNote && wir.status === 'submitted' && (
          <p className="px-1 text-xs leading-5 text-ink-muted">{wir.noticeNote}</p>
        )}
        {wir.holdNote && (
          <Callout tone="info" icon={Clock} title="Catatan rilis">
            {wir.holdNote}
          </Callout>
        )}
        {persona === 'engineer' && wir.status === 'correction_required' && wir.decision && (
          <Callout tone="warning" icon={TriangleAlert} title={`Keputusan: ${wir.decision.outcome}`}>
            {wir.decision.comment}
          </Callout>
        )}
        {wir.decision && wir.status === 'accepted' && (
          <Callout tone="success" icon={CircleCheck} title={`Keputusan: ${wir.decision.outcome}`}>
            {wir.decision.comment}
          </Callout>
        )}

        {/* Ronde */}
        {wir.rounds && wir.rounds.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Riwayat ronde</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {wir.rounds.map((r) => (
                <div key={r.n} className="p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-ink">Ronde {r.n} · {r.outcome}</p>
                    <span className="tnum shrink-0 text-2xs text-ink-disabled">{formatRelative(r.at)}</span>
                  </div>
                  {r.note && <p className="mt-0.5 text-sm leading-5 text-ink-secondary">{r.note}</p>}
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Bukti */}
        {wir.evidence.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Bukti lampiran</SectionTitle>
            <div className="-mx-4 overflow-x-auto px-4">
              <div className="flex gap-2">
                {wir.evidence.map((ev) => <EvidenceChip key={ev.id} ev={ev} />)}
              </div>
            </div>
          </section>
        )}

        {/* Checklist terisi */}
        {wir.checklist.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Hasil pemeriksaan</SectionTitle>
            <div className="space-y-2">
              {wir.checklist.map((sec) => (
                <MCard key={sec.id} className="p-3.5">
                  <p className="text-sm font-semibold text-ink">{sec.title}</p>
                  <ul className="mt-2 space-y-1.5">
                    {sec.items.map((it) => (
                      <li key={it.id} className="flex items-start gap-2">
                        {it.result === 'ok' && <CircleCheck {...iconProps(13)} className="mt-0.5 shrink-0 text-green-600" />}
                        {it.result === 'issue' && <TriangleAlert {...iconProps(13)} className="mt-0.5 shrink-0 text-amber-600" />}
                        {it.result === 'na' && <CircleSlash {...iconProps(13)} className="mt-0.5 shrink-0 text-ink-muted" />}
                        {!it.result && <CircleAlert {...iconProps(13)} className="mt-0.5 shrink-0 text-ink-disabled" />}
                        <span className="min-w-0 flex-1 text-sm leading-5 text-ink-secondary">
                          {it.label}
                          {it.source && <span className="block text-xs text-ink-muted">Ref: {it.source}</span>}
                          {it.note && <span className="mt-0.5 block text-xs font-medium text-amber-700">{it.note}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </MCard>
              ))}
            </div>
          </section>
        )}

        {/* Temuan terkait */}
        {linked.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Temuan dari inspeksi ini</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {linked.map((f) => (
                <Link key={f.id} to={`/field/temuan/${f.id}`} className="flex items-center gap-3 p-3 transition-colors active:bg-hover">
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs text-ink-muted">{f.ref}</span>
                    <span className="block truncate text-sm font-medium text-ink">{f.title}</span>
                  </span>
                  <StatusBadge status={FINDING_STATUS[f.status]} size="sm" />
                </Link>
              ))}
            </MCard>
          </section>
        )}

        {/* Linimasa */}
        <section className="space-y-2">
          <SectionTitle>Linimasa</SectionTitle>
          <TimelineList events={[...wir.timeline].sort((a, b) => a.at.localeCompare(b.at))} />
        </section>

        <p className="flex items-center justify-center gap-1.5 px-2 text-center text-2xs leading-4 text-ink-disabled">
          <MapPin {...iconProps(12)} /> Semua keputusan dalam demo ini tersimpan di memori sesi saja.
        </p>
      </div>
    </Screen>
  )
}

/** Lembar keputusan QC di dalam bottom sheet (FO-23). */
function DecisionSheet({
  onDecide,
}: {
  onDecide: (status: InspectionStatusId, outcome: string, comment: string, createFinding: boolean) => void
}) {
  const [choice, setChoice] = useState<InspectionStatusId | undefined>(undefined)
  const [comment, setComment] = useState('')
  const [createFinding, setCreateFinding] = useState(true)

  return (
    <div className="space-y-4">
      <Segmented
        value={choice}
        onChange={setChoice}
        options={DECISIONS.map((d) => ({ value: d.status, label: d.outcome.split(' ')[0] }))}
      />
      {choice && <p className="text-xs leading-5 text-ink-muted">{DECISIONS.find((d) => d.status === choice)!.desc}</p>}

      <Field label="Catatan keputusan" hint="Wajib untuk perbaikan dan klarifikasi.">
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Jelaskan ketidaksesuaian dan tindakan yang diminta." />
      </Field>

      {choice === 'correction_required' && (
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line-subtle bg-sunken p-3">
          <input
            type="checkbox"
            checked={createFinding}
            onChange={(e) => setCreateFinding(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-600"
          />
          <span className="text-sm leading-5 text-ink-secondary">
            Catat temuan formal terkait
            <span className="block text-xs text-ink-muted">Temuan masuk daftar tindak lanjut dengan penanggung jawab subkon.</span>
          </span>
        </label>
      )}

      <button
        type="button"
        disabled={!choice || (['correction_required', 'clarification_required'].includes(choice) && comment.trim() === '')}
        onClick={() => choice && onDecide(choice, DECISIONS.find((d) => d.status === choice)!.outcome, comment.trim(), createFinding && choice === 'correction_required')}
        className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Simpan Keputusan
      </button>
      <p className="text-center text-2xs leading-4 text-ink-disabled">Keputusan tercatat di linimasa dan terkirim ke pengirim (simulasi).</p>
    </div>
  )
}

/* ---------- FO-24..26: pelaksanaan inspeksi QC ---------- */

type ItemResult = 'ok' | 'issue' | 'na'

export function Conduct() {
  const { id } = useParams()
  const { wirs, setWirs, setFindings, setEvents, setInbox } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const wir = wirs.find((w) => w.id === id)
  const [step, setStep] = useState(0)
  const [checklist, setChecklist] = useState<ChecklistSection[]>(() => structuredClone(wir?.checklist ?? []))
  const [resultNote, setResultNote] = useState<Record<string, string>>({})
  const [photos, setPhotos] = useState(0)
  const [decision, setDecision] = useState<InspectionStatusId | undefined>(undefined)
  const [comment, setComment] = useState('')
  const [createFinding, setCreateFinding] = useState(true)

  // Pindah antar permintaan harus mengosongkan draf pemeriksaan.
  useEffect(() => {
    setChecklist(structuredClone(wirs.find((w) => w.id === id)?.checklist ?? []))
    setStep(0)
    setResultNote({})
    setPhotos(0)
    setDecision(undefined)
    setComment('')
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!wir) {
    return (
      <Screen topBar={<TopBar title="Pelaksanaan inspeksi" onBack="/field/inspeksi" />} className="p-4">
        <EmptyState icon={ClipboardCheck} title="Permintaan tidak ditemukan" />
      </Screen>
    )
  }

  const point = ITP_POINTS.find((p) => p.id === wir.itpPointId)
  const issues = checklist.flatMap((s) => s.items.filter((it) => it.result === 'issue').map((it) => ({ ...it, section: s.title })))
  const anyIssue = issues.length > 0

  const setResult = (sectionId: string, itemId: string, result: ItemResult) => {
    setChecklist((secs) => secs.map((s) => s.id === sectionId
      ? { ...s, items: s.items.map((it) => it.id === itemId ? { ...it, result } : it) }
      : s))
  }

  const finish = () => {
    const now = new Date().toISOString()
    const finalStatus: InspectionStatusId = decision ?? (anyIssue ? 'correction_required' : 'accepted')
    const finalDec = DECISIONS.find((d) => d.status === finalStatus)!
    const round = (wir.rounds?.length ?? 0) + 1

    setWirs((list) => list.map((x) => x.id === wir.id
      ? {
          ...x,
          status: finalStatus,
          decidedAt: now,
          checklist: checklist.map((s) => ({
            ...s,
            items: s.items.map((it) => ({
              ...it,
              note: resultNote[it.id] !== undefined && resultNote[it.id].trim() !== '' ? resultNote[it.id].trim() : it.note,
            })),
          })),
          decision: { outcome: finalDec.outcome, statusId: finalStatus, by: 'Rina Maharani', comment: comment.trim() || finalDec.desc },
          rounds: finalStatus === 'correction_required'
            ? [...(x.rounds ?? []), { n: round, at: now, outcome: finalDec.outcome, note: comment.trim() || undefined }]
            : x.rounds,
        }
      : x))

    // Temuan dari item bermasalah (PRD FO-26)
    if (anyIssue && createFinding) {
      const act = fActivity(wir.activityId)
      const code = DISC_CODE[act.discipline] ?? 'GEN'
      const fid = `fnd-new-${Date.now()}`
      setFindings((list) => [
        {
          id: fid,
          ref: `FIND-${code}-${String(list.length + 9).padStart(3, '0')}`,
          projectId: wir.projectId,
          activityId: wir.activityId,
          sourceWirId: wir.id,
          title: `${issues[0].label}`,
          desc: `${issues.map((i) => `${i.label} (${i.section})`).join('; ')}. ${comment.trim()}`.trim(),
          classification: 'potential_nc',
          location: wir.location,
          responsible: act.subkon,
          dueAt: new Date(Date.now() + 48 * 3_600_000).toISOString(),
          status: 'assigned',
          evidence: Array.from({ length: photos }, (_, i) => ({
            id: `fe-${i}`, kind: 'photo' as const, title: `Foto temuan ${i + 1}`, meta: 'Bukti kondisi awal', cat: 'temuan' as const, phase: 'before' as const,
          })),
          timeline: [{ id: 'tf1', at: now, actor: 'Rina Maharani', role: 'QA/QC', title: 'Temuan dicatat saat inspeksi', kind: 'finding' }],
        },
        ...list,
      ])
      setWirs((list) => list.map((x) => x.id === wir.id
        ? { ...x, linkedFindingIds: [...(x.linkedFindingIds ?? []), fid] }
        : x))
    }

    setWirs((list) => list.map((x) => x.id === wir.id
      ? {
          ...x,
          timeline: [
            ...x.timeline,
            { id: `tc-${Date.now()}`, at: now, actor: 'Rina Maharani', role: 'QA/QC', title: `Keputusan: ${finalDec.outcome}`, kind: finalStatus === 'accepted' ? 'accepted' : 'correction', note: comment.trim() || undefined },
            ...(photos > 0 ? [{ id: `tp-${Date.now()}`, at: now, actor: 'Rina Maharani', role: 'QA/QC', title: `${photos} foto bukti terlampir`, kind: 'evidence' as const }] : []),
          ],
        }
      : x))

    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId: wir.projectId, at: now, kind: 'inspeksi', title: `${wir.ref}: keputusan ${finalDec.outcome}` },
      ...list,
    ])
    setInbox((list) => [
      {
        id: `ib-${Date.now()}`, to: 'engineer',
        title: `${wir.ref}: ${finalDec.outcome}`,
        body: comment.trim() || finalDec.desc,
        at: now, tone: finalStatus === 'accepted' ? 'success' : 'warning', link: `/field/inspeksi/${wir.id}`,
      },
      ...list,
    ])

    toast({
      tone: finalStatus === 'accepted' ? 'success' : 'warning',
      title: `Inspeksi selesai: ${finalDec.outcome}`,
      description: anyIssue && createFinding ? 'Temuan dicatat untuk tindak lanjut (simulasi).' : 'Simulasi demo.',
    })
    navigate(`/field/inspeksi/${wir.id}`)
  }

  const STEPS = ['Checklist', 'Catatan', 'Keputusan']
  const checkedCount = checklist.reduce((n, s) => n + s.items.filter((it) => it.result).length, 0)
  const totalCount = checklist.reduce((n, s) => n + s.items.length, 0)

  return (
    <Screen
      topBar={<TopBar title="Pelaksanaan Inspeksi" subtitle={`${wir.ref} · ${wir.title}`} onBack={`/field/inspeksi/${wir.id}`} />}
      sticky={(
        <StickyBar>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && checkedCount === 0}
              className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lanjut: {STEPS[step + 1]}{step === 0 ? ` (${checkedCount}/${totalCount})` : ''}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800"
            >
              Simpan Hasil Inspeksi
            </button>
          )}
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        <StepBar steps={STEPS} current={step} />

        {/* Langkah 1: checklist */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-xs leading-5 text-ink-muted">
              {point ? `${point.itpRef} · ${point.item}` : 'Checklist titik ITP'} · tandai tiap butir saat memeriksa.
            </p>
            {checklist.map((sec) => (
              <MCard key={sec.id} className="divide-y divide-line-subtle">
                <p className="px-3.5 pt-3 text-sm font-semibold text-ink">{sec.title}</p>
                {sec.items.map((it) => (
                  <div key={it.id} className="px-3.5 py-2.5">
                    <p className="text-sm leading-5 text-ink">
                      {it.label}
                      {it.source && <span className="ml-1.5 font-mono text-2xs text-ink-muted">{it.source}</span>}
                    </p>
                    <div className="mt-1.5">
                      <Segmented
                        value={it.result}
                        onChange={(v) => setResult(sec.id, it.id, v)}
                        options={[
                          { value: 'ok' as ItemResult, label: 'Sesuai' },
                          { value: 'issue' as ItemResult, label: 'Masalah' },
                          { value: 'na' as ItemResult, label: 'N/A' },
                        ]}
                      />
                    </div>
                    {it.result === 'issue' && (
                      <Field label="Catatan masalah" className="mt-2">
                        <Input
                          value={resultNote[it.id] ?? it.note ?? ''}
                          onChange={(e) => setResultNote((r) => ({ ...r, [it.id]: e.target.value }))}
                          placeholder="Uraikan singkat ketidaksesuaiannya."
                        />
                      </Field>
                    )}
                  </div>
                ))}
              </MCard>
            ))}
          </div>
        )}

        {/* Langkah 2: bukti & catatan */}
        {step === 1 && (
          <div className="space-y-5">
            <section className="space-y-2">
              <SectionTitle>Foto kondisi lapangan</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: Math.max(photos, 1) }, (_, i) => i < photos
                  ? (
                    <PhotoTile
                      key={i}
                      photo={{ title: `Foto temuan ${i + 1}`, state: 'ok', gradient: 'from-amber-50 to-sky-100', cat: 'inspeksi', phase: 'before' }}
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
              {anyIssue && <p className="text-2xs leading-4 text-ink-disabled">Foto menjadi bukti awal (sebelum) pada temuan.</p>}
            </section>

            {anyIssue ? (
              <Callout tone="warning" icon={TriangleAlert} title={`${issues.length} butir perlu perbaikan`}>
                {issues.map((i) => <span key={i.id} className="block">· {i.label}</span>)}
              </Callout>
            ) : (
              <Callout tone="success" icon={CircleCheck} title="Semua butir sesuai">
                Tidak ada ketidaksesuaian selama pemeriksaan.
              </Callout>
            )}

            <Field label="Catatan umum pemeriksa" hint="Kondisi umum, kehadiran pihak lain, hal teknis.">
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Contoh: konsultan hadir; cuaca cerah; area aman." />
            </Field>
          </div>
        )}

        {/* Langkah 3: keputusan */}
        {step === 2 && (
          <div className="space-y-4">
            <section className="space-y-2">
              <SectionTitle>Keputusan inspeksi</SectionTitle>
              <Segmented
                value={decision ?? (anyIssue ? 'correction_required' : 'accepted')}
                onChange={setDecision}
                options={DECISIONS.map((d) => ({ value: d.status, label: d.outcome.split(' ')[0] }))}
              />
              <p className="text-xs leading-5 text-ink-muted">
                {DECISIONS.find((d) => d.status === (decision ?? (anyIssue ? 'correction_required' : 'accepted')))!.desc}
              </p>
            </section>

            {(decision ?? (anyIssue ? 'correction_required' : 'accepted')) === 'correction_required' && (
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-line-subtle bg-sunken p-3">
                <input
                  type="checkbox"
                  checked={createFinding}
                  onChange={(e) => setCreateFinding(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-brand-600"
                />
                <span className="text-sm leading-5 text-ink-secondary">
                  Catat temuan formal untuk tindak lanjut subkon
                  <span className="block text-xs text-ink-muted">Temuan muncul di daftar temuan dan inbox pengirim.</span>
                </span>
              </label>
            )}

            <div className="rounded-xl border border-line-subtle bg-sunken p-3.5">
              <p className="text-2xs font-semibold tracking-wider text-ink-muted uppercase">Ringkasan</p>
              <p className="mt-1 text-sm leading-5 text-ink-secondary">
                {checkedCount}/{totalCount} butir diperiksa · {issues.length} masalah · {photos} foto ·
                keputusan {DECISIONS.find((d) => d.status === (decision ?? (anyIssue ? 'correction_required' : 'accepted')))!.outcome}
              </p>
            </div>
          </div>
        )}
      </div>
    </Screen>
  )
}
