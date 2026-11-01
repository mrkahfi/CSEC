import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, ClipboardCheck, FileText, Flag, HardHat,
  HelpCircle, MapPin, ScrollText, TriangleAlert, UserRound,
} from 'lucide-react'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { F_PROJECTS, fProject, PERSONAS, type FProject } from '@/field/data'
import { MCard, Screen, SectionTitle, TopBar } from '@/field/ui'
import { ActivityRow, WirCard, FindingCard } from '@/field/screens/shared'

/* ============================================================
 * FO-03 Pemilih proyek + FO-04 Ringkasan proyek
 * ============================================================ */

const PROJECT_BADGE: Record<FProject['status'], { label: string; tone: 'success' | 'warning' | 'neutral' }> = {
  active: { label: 'Aktif', tone: 'success' },
  handover: { label: 'Serah terima', tone: 'warning' },
  archived: { label: 'Arsip · hanya-baca', tone: 'neutral' },
}

export function ProjectSelector() {
  const { persona, projectId, setProjectId } = useField()
  const navigate = useNavigate()
  const projects = F_PROJECTS.filter((p) => PERSONAS[persona].projectIds.includes(p.id))

  return (
    <Screen topBar={<TopBar title="Pilih Proyek" subtitle="Konteks kerja seluruh aplikasi" onBack="/field/home" />} className="px-4 pt-4 pb-6">
      <div className="space-y-2.5">
        {projects.map((p) => {
          const b = PROJECT_BADGE[p.status]
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setProjectId(p.id)
                navigate(`/field/proyek/${p.id}`)
              }}
              className={`w-full cursor-pointer rounded-xl border bg-surface p-4 text-left shadow-xs transition-colors active:bg-hover ${p.id === projectId ? 'border-brand-500 ring-4 ring-brand-500/15' : 'border-line-subtle'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-md font-semibold text-ink">{p.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-ink-muted">
                    <MapPin {...iconProps(12)} /> {p.location} · {p.client}
                  </p>
                </div>
                {p.id === projectId && <BadgeCheck {...iconProps(17)} className="shrink-0 text-brand-600" />}
              </div>
              <p className="mt-2 text-sm text-ink-secondary">{p.type}</p>
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line-subtle pt-2.5">
                <Badge size="sm" tone={b.tone} dot>{b.label}</Badge>
                <span className="truncate text-xs text-ink-muted">{p.latestUpdate}</span>
              </div>
            </button>
          )
        })}
      </div>
      <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-line-subtle bg-sunken p-3.5">
        <HelpCircle {...iconProps(16)} className="mt-0.5 shrink-0 text-ink-muted" />
        <p className="text-xs leading-5 text-ink-muted">
          Tidak melihat proyek Anda? Hubungi admin proyek untuk penugasan.
          Daftar ini mengikuti persona demo yang aktif.
        </p>
      </div>
    </Screen>
  )
}

const OVERVIEW_STATS = [
  { key: 'aktif', label: 'Pekerjaan aktif', icon: HardHat, to: '/field/pekerjaan' },
  { key: 'inspeksi', label: 'Inspeksi berjalan', icon: ClipboardCheck, to: '/field/inspeksi' },
  { key: 'temuan', label: 'Temuan terbuka', icon: Flag, to: '/field/temuan' },
] as const

export function ProjectOverview() {
  const { id } = useParams()
  const { activities, wirs, findings, reports, events, setProjectId } = useField()
  const project = fProject(id ?? 'aru')

  useEffect(() => {
    if (id) setProjectId(id)
  }, [id, setProjectId])

  const projActivities = activities.filter((a) => a.projectId === project.id)
  const activeCount = projActivities.filter((a) => ['berlangsung', 'tertahan'].includes(a.status)).length
  const openWirCount = wirs.filter((w) => w.projectId === project.id && !['accepted', 'withdrawn', 'cancelled', 'draft'].includes(w.status)).length
  const openFindingCount = findings.filter((f) => f.projectId === project.id && !['verified', 'closed'].includes(f.status)).length

  const stats: Record<string, number> = {
    aktif: activeCount,
    inspeksi: openWirCount,
    temuan: openFindingCount,
  }

  const latestReport = reports.filter((r) => r.projectId === project.id).sort((a, b) => b.submittedAt!.localeCompare(a.submittedAt!))[0]
  const openWirs = wirs.filter((w) => w.projectId === project.id && ['correction_required', 'scheduled', 'submitted', 'reinspection_requested'].includes(w.status)).slice(0, 2)
  const openFindings = findings.filter((f) => f.projectId === project.id && !['verified', 'closed'].includes(f.status)).slice(0, 2)
  const recentEvents = events.filter((e) => e.projectId === project.id).slice(0, 4)

  const EVENT_ICON: Record<string, LucideIcon> = {
    kendala: TriangleAlert,
    material: ArrowRight,
    alat: HardHat,
    pengunjung: UserRound,
    inspeksi: ClipboardCheck,
    laporan: FileText,
    progres: BadgeCheck,
  }

  return (
    <Screen topBar={<TopBar title={project.name} subtitle={`${project.client} · ${project.location}`} onBack="/field/proyek" />} className="px-4 pt-4 pb-6">
      <div className="space-y-5">
        {/* Stat ringkas */}
        <div className="grid grid-cols-3 gap-2">
          {OVERVIEW_STATS.map((s) => (
            <Link
              key={s.key}
              to={s.to}
              className="rounded-xl border border-line-subtle bg-surface p-3 text-center shadow-xs transition-colors active:bg-hover"
            >
              <span className="tnum block text-xl font-semibold text-ink">{stats[s.key]}</span>
              <span className="mt-0.5 block text-2xs leading-3.5 text-ink-muted">{s.label}</span>
            </Link>
          ))}
        </div>

        {/* Front kerja */}
        <section className="space-y-2">
          <SectionTitle action={<Link to="/field/pekerjaan" className="text-xs font-medium text-brand-700">Semua pekerjaan</Link>}>
            Front kerja
          </SectionTitle>
          {projActivities.filter((a) => ['berlangsung', 'tertahan'].includes(a.status)).slice(0, 3).map((a) => (
            <ActivityRow key={a.id} a={a} />
          ))}
        </section>

        {/* Inspeksi & temuan */}
        {(openWirs.length > 0 || openFindings.length > 0) && (
          <section className="space-y-2">
            <SectionTitle>Inspeksi &amp; temuan</SectionTitle>
            {openWirs.map((w) => <WirCard key={w.id} wir={w} />)}
            {openFindings.map((f) => <FindingCard key={f.id} f={f} />)}
          </section>
        )}

        {/* Laporan terakhir + dokumen */}
        <section className="space-y-2">
          <SectionTitle>Referensi</SectionTitle>
          {latestReport && (
            <Link
              to={`/field/laporan/${latestReport.id}`}
              className="flex items-center gap-3 rounded-xl border border-line-subtle bg-surface p-3.5 shadow-xs transition-colors active:bg-hover"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-secondary">
                <FileText {...iconProps(16)} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">Laporan harian {latestReport.dateLabel}</span>
                <span className="block truncate text-xs text-ink-muted">{latestReport.ref} · {latestReport.author}</span>
              </span>
              <ArrowRight {...iconProps(14)} className="shrink-0 text-ink-disabled" />
            </Link>
          )}
          <Link
            to="/field/dokumen"
            className="flex items-center gap-3 rounded-xl border border-line-subtle bg-surface p-3.5 shadow-xs transition-colors active:bg-hover"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sunken text-ink-secondary">
              <ScrollText {...iconProps(16)} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-ink">Gambar &amp; dokumen proyek</span>
              <span className="block truncate text-xs text-ink-muted">ITP, spesifikasi, method statement</span>
            </span>
            <ArrowRight {...iconProps(14)} className="shrink-0 text-ink-disabled" />
          </Link>
        </section>

        {/* Aktivitas terbaru */}
        <section className="space-y-2">
          <SectionTitle>Aktivitas terbaru</SectionTitle>
          {recentEvents.length === 0 ? (
            <EmptyState size="sm" icon={FileText} title="Belum ada aktivitas" />
          ) : (
            <MCard className="divide-y divide-line-subtle">
              {recentEvents.map((e) => {
                const EIcon = EVENT_ICON[e.kind] ?? FileText
                return (
                  <div key={e.id} className="flex items-start gap-3 p-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sunken text-ink-secondary">
                      <EIcon {...iconProps(13)} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-5 font-medium text-ink">{e.title}</p>
                      {e.note && <p className="mt-0.5 truncate text-xs text-ink-muted">{e.note}</p>}
                    </div>
                    <span className="tnum shrink-0 text-xs text-ink-disabled">{formatRelative(e.at)}</span>
                  </div>
                )
              })}
            </MCard>
          )}
        </section>
      </div>
    </Screen>
  )
}
