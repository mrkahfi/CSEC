import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CalendarDays, CircleCheck, CircleAlert, ClipboardPen, CloudSun,
  FilePenLine, FileText, HardHat, Package, Plus, Send, TriangleAlert, Users,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { Callout } from '@/components/ui/Callout'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { fProject, type FReport } from '@/field/data'
import { MCard, KV, Screen, SectionTitle, Segmented, StepBar, StickyBar, TopBar, useSheet } from '@/field/ui'
import { useToast } from '@/components/ui/Toast'

/* ============================================================
 * FO-10 Daftar laporan + FO-11..15 Wizard + FO-16 Detail/preview
 * ============================================================ */

const REPORT_STATUS = {
  draft: { label: 'Draft', tone: 'neutral' },
  submitted: { label: 'Terkirim', tone: 'success' },
  returned: { label: 'Dikembalikan', tone: 'warning' },
} as const

export function ReportList() {
  const { projectId, reports } = useField()
  const project = fProject(projectId)
  const list = reports
    .filter((r) => r.projectId === projectId)
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
  const today = list.find((r) => r.isToday)

  return (
    <Screen topBar={<TopBar large title="Laporan Harian" subtitle={project.name} />} className="px-4 pt-4 pb-6">
      <div className="space-y-4">
        {/* Status laporan hari ini (PRD §7.5) */}
        {today ? (
          <Link
            to={`/field/laporan/${today.id}`}
            className="flex items-center gap-3 rounded-xl border border-line-subtle bg-surface p-4 shadow-xs transition-colors active:bg-hover"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CircleCheck {...iconProps(19)} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-md font-semibold text-ink">Laporan hari ini terkirim</span>
              <span className="block truncate text-sm text-ink-muted">Dikirim {formatRelative(today.submittedAt!)}</span>
            </span>
            <FilePenLine {...iconProps(16)} className="shrink-0 text-ink-disabled" />
          </Link>
        ) : (
          <Link
            to="/field/laporan/baru"
            className="flex items-center gap-3 rounded-xl bg-brand-600 p-4 text-white shadow-xs transition-colors active:bg-brand-800"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Plus {...iconProps(19)} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-md font-semibold">Buat laporan hari ini</span>
              <span className="block text-sm text-white/80">Shift, tenaga, pekerjaan, material, kendala</span>
            </span>
          </Link>
        )}

        <section className="space-y-2">
          <SectionTitle>Riwayat</SectionTitle>
          {list.length === 0
            ? <EmptyState icon={FileText} title="Belum ada laporan" description="Laporan pertama proyek ini akan muncul di sini." />
            : (
              <MCard className="divide-y divide-line-subtle">
                {list.map((r) => {
                  const st = REPORT_STATUS[r.status]
                  return (
                    <Link key={r.id} to={`/field/laporan/${r.id}`} className="flex items-center gap-3 p-3.5 transition-colors active:bg-hover">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-secondary">
                        <FileText {...iconProps(16)} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{r.dateLabel}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {r.ref}
                          {r.lateNote ? ` · ${r.lateNote}` : r.submittedAt ? ` · dikirim ${formatRelative(r.submittedAt)}` : ''}
                        </span>
                      </span>
                      <Badge size="sm" tone={st.tone}>{st.label}</Badge>
                    </Link>
                  )
                })}
              </MCard>
            )}
        </section>
      </div>
    </Screen>
  )
}

/* ---------- FO-11..15: wizard 5 langkah ---------- */

const STEPS = ['Info', 'Tenaga', 'Pekerjaan', 'Material', 'Kirim']

interface WeatherRow { time: string; condition: string }

export function ReportWizard() {
  const { projectId, activities, setReports, setEvents } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const project = fProject(projectId)
  const [step, setStep] = useState(0)

  const todayLabel = useMemo(
    () => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
    [],
  )
  const ref = useMemo(() => {
    const d = new Date()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `LHR-${project.code}-${mm}${dd}`
  }, [project.code])

  // Langkah 1: info dasar
  const [shift, setShift] = useState('Pagi · 07:00 s.d. 17:00')
  const [weather, setWeather] = useState<WeatherRow[]>([
    { time: '07:00', condition: 'Cerah' },
  ])
  const [siteCondition, setSiteCondition] = useState('Kering')

  // Langkah 2: tenaga & alat
  const [manpower, setManpower] = useState([
    { company: 'PT KBN', trade: 'Mandor & site engineer', count: '4', area: 'Seluruh area' },
  ])
  const [equipment, setEquipment] = useState([
    { name: 'Tower crane TCA-01', status: 'operasi' },
  ])

  // Langkah 3: pekerjaan dilakukan (pilih dari front kerja aktif)
  const [workIds, setWorkIds] = useState<string[]>(
    activities.filter((a) => a.projectId === projectId && a.status === 'berlangsung').slice(0, 2).map((a) => a.id),
  )

  // Langkah 4: material & kendala
  const [hasDelivery, setHasDelivery] = useState(false)
  const [delivery, setDelivery] = useState({ supplier: '', material: '', condition: 'diterima' as FReport['sections']['deliveries'][number]['condition'] })
  const [hasDelay, setHasDelay] = useState(false)
  const [delay, setDelay] = useState({ category: 'cuaca', desc: '' })

  // Langkah 5: penutup
  const [toolbox, setToolbox] = useState<'ya' | 'tidak'>('ya')
  const [nextPlan, setNextPlan] = useState('')

  const selectedWork = activities.filter((a) => workIds.includes(a.id))

  const completeness = [
    { label: 'Shift & cuaca', ok: shift.trim() !== '' && weather.every((w) => w.condition.trim() !== '') },
    { label: 'Tenaga kerja', ok: manpower.length > 0 },
    { label: 'Pekerjaan dilakukan', ok: workIds.length > 0 },
    { label: 'Rencana esok hari', ok: nextPlan.trim() !== '' },
  ]
  const missing = completeness.filter((c) => !c.ok)

  const submit = () => {
    const id = `rpt-${Date.now()}`
    const report: FReport = {
      id,
      dateLabel: todayLabel,
      ref,
      projectId,
      author: 'Andi Pratama',
      status: 'submitted',
      isToday: true,
      submittedAt: new Date().toISOString(),
      sections: {
        shift,
        weather,
        siteCondition: siteCondition.trim() || 'Tidak dicatat',
        manpower: manpower.map((m, i) => ({ id: `m-${i}`, company: m.company, trade: m.trade, count: Number(m.count) || undefined, area: m.area })),
        work: selectedWork.map((a) => ({
          id: `w-${a.id}`, activityId: a.id, name: a.name, location: a.location,
          qty: a.qtyDone ? `${a.qtyDone} ${a.unit ?? ''}`.trim() : undefined,
          status: 'berlangsung' as const, subkon: a.subkon,
        })),
        equipment: equipment.map((eq, i) => ({
          id: `eq-${i}`, name: eq.name.split(' ').slice(0, -1).join(' ') || eq.name,
          assetId: eq.name.split(' ').pop() ?? 'TBA', location: 'Sesuai area kerja', status: eq.status as 'operasi',
        })),
        deliveries: hasDelivery && delivery.supplier.trim()
          ? [{ id: 'd-new', supplier: delivery.supplier, suratJalan: 'SJ (diisi admin)', material: delivery.material || 'Sesuai PO', expected: 'Sesuai PO', received: 'Sesuai PO', time: '09:00', condition: delivery.condition, location: 'Yard' }]
          : [],
        delays: hasDelay && delay.desc.trim()
          ? [{ id: 'dl-new', category: delay.category as 'cuaca', affected: 'Aktivitas berjalan', time: 'Hari ini', desc: delay.desc }]
          : [],
        visitors: [],
        toolbox,
        nextPlan: nextPlan.trim() || 'Belum dirinci.',
      },
    }
    setReports((list) => [report, ...list])
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId, at: report.submittedAt!, kind: 'laporan', title: `Laporan harian ${todayLabel} dikirim (${ref})` },
      ...list,
    ])
    toast({ tone: 'success', title: 'Laporan harian terkirim', description: `${ref} · simulasi demo, tidak dikirim ke sistem nyata.` })
    navigate(`/field/laporan/${id}`)
  }

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  return (
    <Screen
      topBar={<TopBar title="Laporan Harian" subtitle={`${todayLabel} · ${ref}`} onBack="/field/laporan" />}
      sticky={(
        <StickyBar>
          <div className="flex gap-2">
            {step > 0 && (
              <button type="button" onClick={back} className="h-11 cursor-pointer rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors active:bg-hover">
                Kembali
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="h-11 flex-1 cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
                Lanjut: {STEPS[step + 1]}
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={missing.length > 0}
                className="inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send {...iconProps(15)} /> Kirim Laporan
              </button>
            )}
          </div>
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        <StepBar steps={STEPS} current={step} />

        {/* Langkah 1: info dasar */}
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Shift kerja">
              <Input value={shift} onChange={(e) => setShift(e.target.value)} />
            </Field>
            <section className="space-y-2">
              <SectionTitle>Cuaca</SectionTitle>
              {weather.map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={w.time}
                    onChange={(e) => setWeather((list) => list.map((x, j) => j === i ? { ...x, time: e.target.value } : x))}
                    className="w-20"
                    inputMode="numeric"
                    aria-label={`Jam pengamatan ${i + 1}`}
                  />
                  <Input
                    value={w.condition}
                    onChange={(e) => setWeather((list) => list.map((x, j) => j === i ? { ...x, condition: e.target.value } : x))}
                    placeholder="Cerah / hujan"
                    aria-label={`Kondisi cuaca ${i + 1}`}
                  />
                  {weather.length > 1 && (
                    <button type="button" onClick={() => setWeather((list) => list.filter((_, j) => j !== i))} className="cursor-pointer text-xs font-medium text-red-700">
                      Hapus
                    </button>
                  )}
                </div>
              ))}
              {weather.length < 3 && (
                <button
                  type="button"
                  onClick={() => setWeather((list) => [...list, { time: '16:00', condition: '' }])}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-700"
                >
                  <Plus {...iconProps(13)} /> Tambah pengamatan
                </button>
              )}
            </section>
            <Field label="Kondisi area kerja" hint="Kering, becek, genangan, dsb.">
              <Input value={siteCondition} onChange={(e) => setSiteCondition(e.target.value)} />
            </Field>
          </div>
        )}

        {/* Langkah 2: tenaga & alat */}
        {step === 1 && (
          <div className="space-y-5">
            <section className="space-y-2">
              <SectionTitle action={(
                <button
                  type="button"
                  onClick={() => setManpower((list) => [...list, { company: '', trade: '', count: '', area: '' }])}
                  className="inline-flex cursor-pointer items-center gap-0.5 text-xs font-medium text-brand-700"
                >
                  <Plus {...iconProps(12)} /> Tambah
                </button>
              )}
              >
                <span className="inline-flex items-center gap-1"><Users {...iconProps(12)} /> Tenaga kerja</span>
              </SectionTitle>
              {manpower.map((m, i) => (
                <MCard key={i} className="grid grid-cols-2 gap-2 p-3">
                  <Field label="Perusahaan"><Input value={m.company} onChange={(e) => setManpower((l) => l.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} placeholder="PT KBN" /></Field>
                  <Field label="Jumlah"><Input value={m.count} onChange={(e) => setManpower((l) => l.map((x, j) => j === i ? { ...x, count: e.target.value } : x))} inputMode="numeric" placeholder="0" /></Field>
                  <Field label="Keahlian" className="col-span-2"><Input value={m.trade} onChange={(e) => setManpower((l) => l.map((x, j) => j === i ? { ...x, trade: e.target.value } : x))} placeholder="Pembesiang" /></Field>
                  <Field label="Area" className="col-span-2"><Input value={m.area} onChange={(e) => setManpower((l) => l.map((x, j) => j === i ? { ...x, area: e.target.value } : x))} placeholder="Lantai 2" /></Field>
                </MCard>
              ))}
            </section>
            <section className="space-y-2">
              <SectionTitle><span className="inline-flex items-center gap-1"><HardHat {...iconProps(12)} /> Peralatan utama</span></SectionTitle>
              {equipment.map((eq, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={eq.name}
                    onChange={(e) => setEquipment((l) => l.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Tower crane TCA-01"
                    aria-label={`Peralatan ${i + 1}`}
                  />
                  <Segmented
                    value={eq.status}
                    onChange={(v) => setEquipment((l) => l.map((x, j) => j === i ? { ...x, status: v } : x))}
                    options={[{ value: 'operasi', label: 'Operasi' }, { value: 'idle', label: 'Idle' }, { value: 'rusak', label: 'Rusak' }]}
                    className="shrink-0"
                  />
                </div>
              ))}
            </section>
          </div>
        )}

        {/* Langkah 3: pekerjaan */}
        {step === 2 && (
          <section className="space-y-2">
            <SectionTitle>Pekerjaan hari ini</SectionTitle>
            <p className="text-xs text-ink-muted">Pilih front kerja yang berjalan. Volume mengikuti catatan progres terakhir.</p>
            <div className="space-y-2">
              {activities.filter((a) => a.projectId === projectId).map((a) => {
                const on = workIds.includes(a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setWorkIds((ids) => on ? ids.filter((x) => x !== a.id) : [...ids, a.id])}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3.5 text-left transition-colors active:bg-hover',
                      on ? 'border-brand-500 bg-tone-brand-bg ring-4 ring-brand-500/10' : 'border-line-subtle bg-surface',
                    )}
                  >
                    <span className={cn('flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md border', on ? 'border-brand-600 bg-brand-600 text-white' : 'border-line-strong bg-surface')}>
                      {on && <CircleCheck {...iconProps(13)} strokeWidth={2.4} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{a.name}</span>
                      <span className="block truncate text-xs text-ink-muted">{a.location} · {a.progressPct}%</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Langkah 4: material & kendala */}
        {step === 3 && (
          <div className="space-y-5">
            <section className="space-y-2">
              <SectionTitle action={(
                <button type="button" onClick={() => setHasDelivery((v) => !v)} className="cursor-pointer text-xs font-medium text-brand-700">
                  {hasDelivery ? 'Hapus' : 'Tambah'}
                </button>
              )}
              >
                <span className="inline-flex items-center gap-1"><Package {...iconProps(12)} /> Material datang</span>
              </SectionTitle>
              {hasDelivery ? (
                <MCard className="space-y-2 p-3">
                  <Field label="Supplier"><Input value={delivery.supplier} onChange={(e) => setDelivery((d) => ({ ...d, supplier: e.target.value }))} placeholder="PT Besi Nusantara" /></Field>
                  <Field label="Material"><Input value={delivery.material} onChange={(e) => setDelivery((d) => ({ ...d, material: e.target.value }))} placeholder="Besi D16" /></Field>
                  <Field label="Kondisi diterima">
                    <Segmented
                      value={delivery.condition}
                      onChange={(v) => setDelivery((d) => ({ ...d, condition: v }))}
                      options={[
                        { value: 'diterima', label: 'Lengkap' },
                        { value: 'kurang', label: 'Kurang' },
                        { value: 'rusak', label: 'Rusak' },
                        { value: 'menunggu_cek', label: 'Cek ulang' },
                      ]}
                    />
                  </Field>
                </MCard>
              ) : (
                <p className="text-xs text-ink-muted">Tidak ada kiriman material hari ini.</p>
              )}
            </section>
            <section className="space-y-2">
              <SectionTitle action={(
                <button type="button" onClick={() => setHasDelay((v) => !v)} className="cursor-pointer text-xs font-medium text-brand-700">
                  {hasDelay ? 'Hapus' : 'Tambah'}
                </button>
              )}
              >
                <span className="inline-flex items-center gap-1"><TriangleAlert {...iconProps(12)} /> Kendala & hambatan</span>
              </SectionTitle>
              {hasDelay ? (
                <MCard className="space-y-2 p-3">
                  <Field label="Kategori">
                    <Segmented
                      value={delay.category}
                      onChange={(v) => setDelay((d) => ({ ...d, category: v }))}
                      options={[
                        { value: 'cuaca', label: 'Cuaca' },
                        { value: 'material', label: 'Material' },
                        { value: 'alat', label: 'Alat' },
                        { value: 'tenaga kerja', label: 'Tenaga' },
                      ]}
                    />
                  </Field>
                  <Field label="Uraian singkat"><Textarea value={delay.desc} onChange={(e) => setDelay((d) => ({ ...d, desc: e.target.value }))} rows={2} placeholder="Hujan menghentikan pekerjaan ketinggian 1 jam." /></Field>
                </MCard>
              ) : (
                <p className="text-xs text-ink-muted">Tidak ada kendala dicatat.</p>
              )}
            </section>
          </div>
        )}

        {/* Langkah 5: tinjau & kirim */}
        {step === 4 && (
          <div className="space-y-4">
            <section className="space-y-2">
              <SectionTitle>Periksa kelengkapan</SectionTitle>
              <MCard className="divide-y divide-line-subtle">
                {completeness.map((c) => (
                  <div key={c.label} className="flex items-center gap-2.5 p-3">
                    {c.ok
                      ? <CircleCheck {...iconProps(16)} className="shrink-0 text-green-600" />
                      : <CircleAlert {...iconProps(16)} className="shrink-0 text-amber-600" />}
                    <span className={cn('flex-1 text-sm font-medium', c.ok ? 'text-ink' : 'text-ink-secondary')}>{c.label}</span>
                    <span className="text-xs text-ink-muted">{c.ok ? 'Lengkap' : 'Kosong'}</span>
                  </div>
                ))}
              </MCard>
              {missing.length > 0 && (
                <p className="text-xs text-amber-700">Lengkapi bagian bertanda sebelum mengirim.</p>
              )}
            </section>

            <Field label="Toolbox talk hari ini">
              <Segmented value={toolbox} onChange={setToolbox} options={[{ value: 'ya', label: 'Sudah dilaksanakan' }, { value: 'tidak', label: 'Tidak ada' }]} />
            </Field>

            <Field label="Rencana esok hari" hint="Wajib sebelum laporan bisa dikirim.">
              <Textarea value={nextPlan} onChange={(e) => setNextPlan(e.target.value)} rows={3} placeholder="Lanjut ikatan tulangan Grid E-F; persiapan re-inspeksi." />
            </Field>

            <div className="flex items-start gap-2.5 rounded-xl border border-line-subtle bg-sunken p-3.5">
              <CloudSun {...iconProps(16)} className="mt-0.5 shrink-0 text-ink-muted" />
              <p className="text-xs leading-5 text-ink-muted">
                Laporan dikirim ke reviewer internal. Setelah terkirim, laporan hanya bisa diperbarui
                bila dikembalikan reviewer.
              </p>
            </div>
          </div>
        )}
      </div>
    </Screen>
  )
}

/* ---------- FO-16: detail & pratinjau laporan ---------- */

export function ReportDetail() {
  const { id } = useParams()
  const { reports, setReports, setEvents, projectId } = useField()
  const toast = useToast()
  const sheet = useSheet()
  const report = reports.find((r) => r.id === id)

  if (!report) {
    return (
      <Screen topBar={<TopBar title="Laporan" onBack="/field/laporan" />} className="p-4">
        <EmptyState icon={FileText} title="Laporan tidak ditemukan" />
      </Screen>
    )
  }

  const st = REPORT_STATUS[report.status]
  const s = report.sections

  const submitDraft = () => {
    setReports((list) => list.map((r) => r.id === report.id
      ? { ...r, status: 'submitted', submittedAt: new Date().toISOString() }
      : r))
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId, at: new Date().toISOString(), kind: 'laporan', title: `Laporan ${report.dateLabel} dikirim` },
      ...list,
    ])
    toast({ tone: 'success', title: 'Laporan terkirim', description: 'Simulasi demo.' })
  }

  const openSection = (title: string) => {
    sheet.open({
      title,
      children: <p className="text-sm leading-6 text-ink-secondary">Pengubahan bagian laporan tersedia pada demo melalui alur &ldquo;laporan dikembalikan&rdquo; di beranda engineer.</p>,
    })
  }

  return (
    <Screen
      topBar={(
        <TopBar
          title={report.dateLabel}
          subtitle={`${report.ref} · ${report.author}`}
          onBack="/field/laporan"
          right={<Badge size="sm" tone={st.tone}>{st.label}</Badge>}
        />
      )}
      sticky={report.status === 'draft' ? (
        <StickyBar>
          <button type="button" onClick={submitDraft} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <Send {...iconProps(15)} /> Kirim Laporan
          </button>
        </StickyBar>
      ) : undefined}
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-5">
        {report.status === 'returned' && report.reviewComment && (
          <Callout tone="warning" icon={FilePenLine} title="Dikembalikan reviewer">
            {report.reviewComment}
          </Callout>
        )}
        {report.lateNote && (
          <div className="flex items-center gap-2 rounded-lg border border-line-subtle bg-sunken px-3.5 py-2.5">
            <CalendarDays {...iconProps(14)} className="shrink-0 text-ink-muted" />
            <p className="text-xs font-medium text-ink-secondary">{report.lateNote}</p>
          </div>
        )}

        {/* Info dasar */}
        <section className="space-y-2">
          <SectionTitle>Info dasar</SectionTitle>
          <MCard className="space-y-2.5 p-3.5">
            <KV label="Shift">{s.shift}</KV>
            <KV label="Cuaca">
              <span className="flex flex-wrap gap-1.5">
                {s.weather.map((w, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-md bg-sunken px-2 py-0.5 text-xs text-ink-secondary">
                    <span className="tnum">{w.time}</span> · {w.condition}
                  </span>
                ))}
              </span>
            </KV>
            <KV label="Kondisi area">{s.siteCondition}</KV>
            {s.impact && <KV label="Dampak kerja">{s.impact}</KV>}
          </MCard>
        </section>

        {/* Tenaga kerja */}
        {s.manpower.length > 0 && (
          <section className="space-y-2">
            <SectionTitle action={report.status === 'returned' ? (
              <button type="button" onClick={() => openSection('Perbarui tenaga kerja')} className="cursor-pointer text-xs font-medium text-brand-700">Perbarui</button>
            ) : undefined}
            >
              Tenaga kerja · {s.manpower.reduce((n, m) => n + (m.count ?? 0), 0)} orang
            </SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {s.manpower.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-3">
                  <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunken text-sm font-bold text-ink-secondary">{m.count ?? '·'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">{m.company}</span>
                    <span className="block truncate text-xs text-ink-muted">{m.trade} · {m.area}</span>
                  </span>
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Pekerjaan dilakukan */}
        {s.work.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Pekerjaan dilakukan</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {s.work.map((w) => (
                <div key={w.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-ink">{w.name}</p>
                    <Badge size="sm" tone={w.status === 'selesai' ? 'success' : w.status === 'berhenti' ? 'warning' : 'active'}>{w.status}</Badge>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-muted">
                    <span>{w.location}</span>
                    {w.qty && <span className="tnum">· {w.qty}</span>}
                    <span>· {w.subkon}</span>
                  </p>
                  {w.note && <p className="mt-1 text-xs text-ink-secondary">{w.note}</p>}
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Peralatan */}
        {s.equipment.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Peralatan</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {s.equipment.map((eq) => (
                <div key={eq.id} className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-ink">{eq.name} <span className="font-mono text-xs font-normal text-ink-muted">{eq.assetId}</span></p>
                    <Badge size="sm" tone={eq.status === 'operasi' ? 'success' : eq.status === 'rusak' ? 'danger' : 'neutral'}>{eq.status}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">{eq.location}{eq.hours ? ` · ${eq.hours}` : ''}</p>
                  {eq.issue && <p className="mt-1 text-xs text-amber-700">{eq.issue}</p>}
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Material datang */}
        {s.deliveries.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Material datang</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {s.deliveries.map((d) => (
                <div key={d.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-ink">{d.material}</p>
                    <Badge size="sm" tone={d.condition === 'diterima' ? 'success' : d.condition === 'kurang' ? 'warning' : d.condition === 'rusak' ? 'danger' : 'neutral'}>{d.condition}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{d.supplier} · {d.suratJalan} · <span className="tnum">{d.time}</span></p>
                  <p className="mt-0.5 text-xs text-ink-secondary">Diminta {d.expected} · diterima {d.received} · {d.location}</p>
                  {d.note && <p className="mt-1 text-xs text-ink-secondary">{d.note}</p>}
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Kendala */}
        {s.delays.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Kendala & hambatan</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {s.delays.map((d) => (
                <div key={d.id} className="flex items-start gap-2.5 p-3">
                  <TriangleAlert {...iconProps(14)} className="mt-0.5 shrink-0 text-amber-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink capitalize">{d.category} · {d.affected}</p>
                    <p className="mt-0.5 text-xs text-ink-muted"><span className="tnum">{d.time}</span></p>
                    <p className="mt-0.5 text-sm leading-5 text-ink-secondary">{d.desc}</p>
                  </div>
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Pengunjung */}
        {s.visitors.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Pengunjung</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {s.visitors.map((v) => (
                <div key={v.id} className="p-3">
                  <p className="truncate text-sm font-semibold text-ink">{v.name} <span className="text-xs font-normal text-ink-muted">· {v.org}</span></p>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">{v.purpose} · <span className="tnum">{v.time}</span> · {v.area}</p>
                </div>
              ))}
            </MCard>
          </section>
        )}

        {/* Penutup */}
        <section className="space-y-2">
          <SectionTitle>Penutup</SectionTitle>
          <MCard className="space-y-2.5 p-3.5">
            <KV label="Toolbox talk">{s.toolbox === 'ya' ? 'Dilaksanakan' : s.toolbox === 'belum_dicatat' ? 'Belum dicatat' : 'Tidak ada'}</KV>
            {s.safetyNote && <KV label="Catatan K3">{s.safetyNote}</KV>}
            <KV label="Rencana esok">{s.nextPlan}</KV>
          </MCard>
        </section>

        {report.status === 'submitted' && report.submittedAt && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-ink-disabled">
            <ClipboardPen {...iconProps(13)} /> Terkirim {formatRelative(report.submittedAt)}
          </p>
        )}
      </div>
    </Screen>
  )
}
