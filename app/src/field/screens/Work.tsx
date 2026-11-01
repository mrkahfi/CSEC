import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Camera, CircleCheck, ClipboardCheck, MapPin, Plus, TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Callout } from '@/components/ui/Callout'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { INSPECTION_STATUS } from '@/components/status'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { ACTIVITY_STATUS, fProject, type ActivityStatus, type FPhoto } from '@/field/data'
import { MCard, ProgressBar, Screen, SectionTitle, Segmented, StickyBar, TopBar, PhotoTile } from '@/field/ui'
import { ActivityRow } from '@/field/screens/shared'
import { useToast } from '@/components/ui/Toast'

/* ============================================================
 * FO-07 Daftar pekerjaan + FO-08 Detail aktivitas + FO-09 Catat progres
 * ============================================================ */

const DISCIPLINES = ['Semua', 'Struktur', 'MEP', 'Perkerasan'] as const

export function WorkList() {
  const { projectId, activities } = useField()
  const project = fProject(projectId)
  const [disc, setDisc] = useState<(typeof DISCIPLINES)[number]>('Semua')

  const list = activities
    .filter((a) => a.projectId === projectId)
    .filter((a) => disc === 'Semua' || a.discipline === disc)

  return (
    <Screen
      topBar={
        <TopBar
          large
          title="Pekerjaan"
          subtitle={`${project.name} · ${list.length} aktivitas`}
        />
      }
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-4">
        <Segmented
          value={disc}
          onChange={setDisc}
          options={DISCIPLINES.map((d) => ({ value: d, label: d }))}
        />
        {list.length === 0
          ? <EmptyState icon={ClipboardCheck} title="Tidak ada aktivitas" description="Belum ada front kerja untuk disiplin ini." />
          : (
            <div className="space-y-2">
              {list.map((a) => <ActivityRow key={a.id} a={a} />)}
            </div>
          )}
      </div>
    </Screen>
  )
}

export function WorkDetail() {
  const { id } = useParams()
  const { activities, wirs, findings } = useField()
  const activity = activities.find((a) => a.id === id)
  const navigate = useNavigate()

  if (!activity) {
    return (
      <Screen topBar={<TopBar title="Detail pekerjaan" onBack="/field/pekerjaan" />} className="p-4">
        <EmptyState icon={Camera} title="Aktivitas tidak ditemukan" />
      </Screen>
    )
  }

  const st = ACTIVITY_STATUS[activity.status]
  const relatedWirs = wirs.filter((w) => w.activityId === activity.id)
  const relatedFindings = findings.filter((f) => f.activityId === activity.id)

  return (
    <Screen topBar={<TopBar title={activity.name} subtitle={activity.location} onBack="/field/pekerjaan" />} className="px-4 pt-4 pb-6">
      <div className="space-y-5">
        {/* Ringkasan progres */}
        <MCard className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Badge size="sm" tone={st.tone} dot>{st.label}</Badge>
            <span className="tnum text-sm font-semibold text-ink-secondary">{activity.progressPct}%</span>
          </div>
          <ProgressBar value={activity.progressPct} className="mt-2.5" />
          <p className="mt-2 truncate text-sm text-ink-muted">{activity.lastUpdate} · {formatRelative(activity.lastUpdateAt)}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line-subtle pt-3">
            <div>
              <p className="text-2xs text-ink-muted">Subkon</p>
              <p className="mt-0.5 truncate text-sm font-medium text-ink">{activity.subkon}</p>
            </div>
            <div>
              <p className="text-2xs text-ink-muted">Volume</p>
              <p className="tnum mt-0.5 truncate text-sm font-medium text-ink">
                {activity.qtyDone ? `${activity.qtyDone} / ${activity.qtyPlan} ${activity.unit ?? ''}` : `${activity.progressPct}% tercatat`}
              </p>
            </div>
          </div>
        </MCard>

        {/* Catatan hambatan */}
        {activity.holdNote && (
          <Callout tone="warning" icon={TriangleAlert} title="Aktivitas tertahan">
            {activity.holdNote}
          </Callout>
        )}

        {/* Titik inspeksi berikutnya */}
        {activity.nextCheck && (
          <section className="space-y-2">
            <SectionTitle>Titik inspeksi berikutnya</SectionTitle>
            <Link
              to="/field/inspeksi/baru"
              className="flex items-center gap-3 rounded-xl border border-tone-brand-border bg-tone-brand-bg p-3.5 transition-colors active:bg-hover"
            >
              <ClipboardCheck {...iconProps(17)} className="shrink-0 text-brand-600" />
              <span className="min-w-0 flex-1 text-sm leading-5 font-medium text-ink">{activity.nextCheck}</span>
              <span className="shrink-0 text-xs font-semibold text-brand-700">Ajukan</span>
            </Link>
          </section>
        )}

        {/* Aksi */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => navigate(`/field/pekerjaan/${activity.id}/progres`)}
            className="flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-brand-600 text-white shadow-xs transition-colors active:bg-brand-800"
          >
            <Plus {...iconProps(17)} />
            <span className="text-xs font-semibold">Progres</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/field/inspeksi/baru')}
            className="flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-line bg-surface text-ink transition-colors active:bg-hover"
          >
            <ClipboardCheck {...iconProps(17)} className="text-brand-600" />
            <span className="text-xs font-semibold">Inspeksi</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/field/kendala/baru')}
            className="flex h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-line bg-surface text-ink transition-colors active:bg-hover"
          >
            <TriangleAlert {...iconProps(17)} className="text-amber-600" />
            <span className="text-xs font-semibold">Kendala</span>
          </button>
        </div>

        {/* Riwayat progres */}
        <section className="space-y-2">
          <SectionTitle>Progres terkini</SectionTitle>
          <MCard className="divide-y divide-line-subtle">
            {activity.progress.slice(0, 4).map((p) => {
              const pst = ACTIVITY_STATUS[p.status]
              return (
                <div key={p.id} className="p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge size="sm" tone={pst.tone}>{pst.label}</Badge>
                    <span className="tnum shrink-0 text-xs text-ink-disabled">{formatRelative(p.at)}</span>
                  </div>
                  {p.qty && <p className="tnum mt-1.5 text-sm font-medium text-ink">{p.qty}{p.area ? ` · ${p.area}` : ''}</p>}
                  <p className="mt-0.5 text-sm leading-5 text-ink-secondary">{p.note}</p>
                  <p className="mt-1 text-xs text-ink-muted">{p.by}</p>
                </div>
              )
            })}
          </MCard>
        </section>

        {/* Inspeksi terkait */}
        {relatedWirs.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Inspeksi terkait</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {relatedWirs.map((w) => (
                <Link key={w.id} to={`/field/inspeksi/${w.id}`} className="flex items-center gap-3 p-3 transition-colors active:bg-hover">
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs text-ink-muted">{w.ref}</span>
                    <span className="block truncate text-sm font-medium text-ink">{w.title}</span>
                  </span>
                  <StatusBadge status={INSPECTION_STATUS[w.status]} size="sm" />
                </Link>
              ))}
            </MCard>
          </section>
        )}

        {/* Temuan terkait */}
        {relatedFindings.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Temuan terkait</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {relatedFindings.map((f) => (
                <Link key={f.id} to={`/field/temuan/${f.id}`} className="flex items-center gap-3 p-3 transition-colors active:bg-hover">
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs text-ink-muted">{f.ref}</span>
                    <span className="block truncate text-sm font-medium text-ink">{f.title}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-muted">{f.responsible}</span>
                </Link>
              ))}
            </MCard>
          </section>
        )}
      </div>
    </Screen>
  )
}

/* ---------- FO-09: form catat progres ---------- */

const STATUS_OPTIONS: { value: ActivityStatus; label: string }[] = [
  { value: 'belum_mulai', label: 'Belum mulai' },
  { value: 'berlangsung', label: 'Berlangsung' },
  { value: 'selesai_dilaporkan', label: 'Selesai' },
  { value: 'tertahan', label: 'Tertahan' },
]

const EMPTY_PHOTO: Pick<FPhoto, 'title' | 'state' | 'gradient' | 'cat' | 'phase'> = {
  title: '', state: 'ok', gradient: 'from-sky-100 to-brand-50', cat: 'progres', phase: undefined,
}

export function ProgressForm() {
  const { id } = useParams()
  const { activities, setActivities, setEvents, projectId } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const activity = activities.find((a) => a.id === id)

  const [status, setStatus] = useState<ActivityStatus>(activity?.status ?? 'berlangsung')
  const [qty, setQty] = useState('')
  const [area, setArea] = useState('')
  const [pct, setPct] = useState(String(activity?.progressPct ?? 0))
  const [note, setNote] = useState('')
  const [photos, setPhotos] = useState<(Pick<FPhoto, 'title' | 'state' | 'gradient' | 'cat' | 'phase'> | null)[]>([null])

  const nameOf = useMemo(() => activity?.name ?? 'Aktivitas', [activity])

  if (!activity) {
    return (
      <Screen topBar={<TopBar title="Update progres" onBack="/field/pekerjaan" />} className="p-4">
        <EmptyState icon={Camera} title="Aktivitas tidak ditemukan" />
      </Screen>
    )
  }

  const attach = (i: number) => {
    setPhotos((list) => {
      const next = [...list]
      const cur = next[i]
      if (!cur) next[i] = { ...EMPTY_PHOTO, title: `Foto lapangan ${i + 1}`, state: 'pending' }
      else if (cur.state === 'pending') next[i] = { ...cur, state: 'ok' }
      else next[i] = null
      return next
    })
  }

  const save = () => {
    const newPct = status === 'selesai_dilaporkan'
      ? 100
      : Math.min(100, Math.max(0, Number(pct) || activity.progressPct))
    const entry = {
      id: `pe-${Date.now()}`,
      at: new Date().toISOString(),
      by: 'Andi Pratama',
      status,
      qty: qty.trim() ? `${qty.trim()} ${activity.unit ?? ''}`.trim() : undefined,
      area: area.trim() || undefined,
      note: note.trim() || `Progres diperbarui menjadi ${newPct}%.`,
    }
    setActivities((list) => list.map((a) => a.id === activity.id
      ? {
          ...a,
          status,
          progressPct: newPct,
          qtyDone: qty.trim() || a.qtyDone,
          lastUpdate: entry.note,
          lastUpdateAt: entry.at,
          progress: [entry, ...a.progress],
        }
      : a))
    setEvents((list) => [
      { id: `ev-${Date.now()}`, projectId, at: entry.at, kind: 'progres', title: `Progres ${activity.name} diperbarui (${newPct}%)` },
      ...list,
    ])
    toast({ tone: 'success', title: 'Progres tersimpan', description: 'Catatan ini adalah simulasi demo.' })
    navigate(`/field/pekerjaan/${activity.id}`)
  }

  return (
    <Screen
      topBar={<TopBar title="Update Progres" subtitle={nameOf} onBack={`/field/pekerjaan/${activity.id}`} />}
      sticky={<StickyBar><button type="button" onClick={save} className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">Simpan Progres</button></StickyBar>}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        {/* Ringkasan aktivitas */}
        <MCard className="p-3.5">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-ink">{activity.name}</p>
            <span className="tnum shrink-0 text-sm font-semibold text-ink-secondary">{activity.progressPct}%</span>
          </div>
          <ProgressBar value={activity.progressPct} className="mt-2" />
        </MCard>

        <Segmented
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field label="Kuantitas" hint={activity.unit ? `Satuan: ${activity.unit}` : undefined}>
            <Input value={qty} onChange={(e) => setQty(e.target.value)} inputMode="decimal" placeholder={activity.qtyDone ?? '0'} />
          </Field>
          <Field label="Progres (%)">
            <Input value={pct} onChange={(e) => setPct(e.target.value)} inputMode="numeric" disabled={status === 'selesai_dilaporkan'} />
          </Field>
        </div>

        <Field label="Area / lokasi" hint="Contoh: Grid C-D atau Sta 1+200">
          <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder={activity.location} />
        </Field>

        <Field label="Catatan singkat" hint="Satu-dua poin utama yang terjadi hari ini.">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Pekerjaan yang berjalan, kendala, atau rencana lanjutan." />
        </Field>

        {/* Foto lapangan (simulasi kamera) */}
        <section className="space-y-2">
          <SectionTitle>Foto lapangan</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => p
              ? (
                <PhotoTile
                  key={i}
                  photo={p}
                  onClick={() => attach(i)}
                  className={cn(p.state === 'pending' && '[&>span:first-child]:animate-pulse')}
                />
              )
              : (
                <button
                  key={i}
                  type="button"
                  onClick={() => attach(i)}
                  className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-line-strong bg-sunken text-ink-muted transition-colors active:bg-hover"
                >
                  <Camera {...iconProps(19)} />
                  <span className="text-2xs leading-3.5">Ambil foto</span>
                </button>
              ))}
          </div>
          <p className="text-2xs leading-4 text-ink-disabled">Ketuk ubin untuk menambah, lalu ketuk lagi sebagai unggahan selesai (simulasi).</p>
        </section>

        {/* Riwayat singkat */}
        {activity.progress.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Sebelumnya</SectionTitle>
            <MCard className="divide-y divide-line-subtle">
              {activity.progress.slice(0, 2).map((p) => (
                <div key={p.id} className="p-3">
                  <div className="flex items-center gap-2">
                    <CircleCheck {...iconProps(13)} className="shrink-0 text-green-600" />
                    <p className="min-w-0 flex-1 truncate text-sm text-ink">{p.note}</p>
                    <span className="tnum shrink-0 text-xs text-ink-disabled">{formatRelative(p.at)}</span>
                  </div>
                  <p className="mt-1 pl-5.5 text-xs text-ink-muted">
                    <MapPin {...iconProps(11)} className="mr-1 inline" />{p.area ?? activity.location} · {p.by}
                  </p>
                </div>
              ))}
            </MCard>
          </section>
        )}
      </div>
    </Screen>
  )
}
