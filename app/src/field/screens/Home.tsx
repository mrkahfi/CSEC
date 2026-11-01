import { Link, useNavigate } from 'react-router-dom'
import {
  AlarmClock, ArrowRight, BadgeCheck, ClipboardCheck, ClipboardList,
  FilePenLine, FileText, FileWarning, ListChecks, MessageSquareWarning, Play, TriangleAlert, Truck,
} from 'lucide-react'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { INSPECTION_STATUS, POINT_TYPE } from '@/components/status'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { ITP_POINTS } from '@/field/data'
import { MCard, Screen, SectionTitle, TopBar, useSheet } from '@/field/ui'
import {
  ActivityRow, FindingCard, greeting, ProjectChip,
  QuickTile, SeeAll, todayLabel, WirCard,
} from '@/field/screens/shared'

/* ============================================================
 * FO-05 Home Site Engineer + FO-06 Home QC Inspector
 * Satu layar, prioritas berbeda per persona (PRD §5.3).
 * ============================================================ */

function HomeHeader({ name }: { name: string }) {
  return (
    <TopBar
      large
      title={`${greeting()}, ${name.split(' ')[0]}`}
      subtitle={todayLabel()}
      right={
        <Link to="/field/lainnya" aria-label="Profil & pengaturan demo">
          <Avatar name={name} size="md" />
        </Link>
      }
    />
  )
}

/* ---------- Home Site Engineer / Supervisor ---------- */

function EngineerHome() {
  const { projectId, reports, wirs, findings, activities } = useField()
  const sheet = useSheet()
  const navigate = useNavigate()

  const todayReport = reports.find((r) => r.isToday && r.projectId === projectId)
  const attention: { id: string; title: string; meta: string; to: string; icon: LucideIcon }[] = [
    ...wirs.filter((w) => w.projectId === projectId && ['correction_required', 'clarification_required'].includes(w.status))
      .map((w) => ({ id: w.id, title: `${w.ref} perlu tindak lanjut`, meta: INSPECTION_STATUS[w.status].label, to: `/field/inspeksi/${w.id}`, icon: FileWarning })),
    ...findings.filter((f) => f.projectId === projectId && ['assigned', 'open', 'action_in_progress'].includes(f.status))
      .map((f) => ({ id: f.id, title: `${f.ref} ditugaskan ke tim Anda`, meta: f.responsible, to: `/field/temuan/${f.id}`, icon: MessageSquareWarning })),
    ...reports.filter((r) => r.projectId === projectId && r.status === 'returned')
      .map((r) => ({ id: r.id, title: `Laporan ${r.dateLabel} dikembalikan`, meta: 'Perlu pembaruan', to: `/field/laporan/${r.id}`, icon: FilePenLine })),
  ].slice(0, 3)

  const active = activities.filter((a) => a.projectId === projectId && ['berlangsung', 'tertahan'].includes(a.status))
  const myWirs = wirs.filter((w) => w.projectId === projectId && ['submitted', 'scheduled', 'reinspection_requested'].includes(w.status))

  const pickActivity = () => {
    sheet.open({
      title: 'Pilih aktivitas',
      children: (
        <div className="space-y-2">
          {activities.filter((a) => a.projectId === projectId).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { sheet.close(); navigate(`/field/pekerjaan/${a.id}/progres`) }}
              className="w-full cursor-pointer rounded-lg border border-line-subtle bg-surface p-3 text-left transition-colors active:bg-hover"
            >
              <p className="truncate text-sm font-semibold text-ink">{a.name}</p>
              <p className="mt-0.5 truncate text-xs text-ink-muted">{a.location}</p>
            </button>
          ))}
        </div>
      ),
    })
  }

  return (
    <Screen
      topBar={<HomeHeader name="Andi Pratama" />}
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-5">
        <ProjectChip projectId={projectId} />

        {/* Laporan harian — status hari ini (PRD §7.5) */}
        <MCard className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-2xs font-semibold tracking-wider text-ink-muted uppercase">Laporan harian</p>
              {todayReport ? (
                <>
                  <p className="mt-1 text-md font-semibold text-ink">
                    {todayReport.status === 'submitted' ? 'Sudah dikirim' : 'Draft'}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {todayReport.status === 'submitted'
                      ? `Terkirim ${formatRelative(todayReport.submittedAt!)}`
                      : 'Belum lengkap, lanjutkan pengisian'}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-md font-semibold text-ink">Belum dibuat</p>
                  <p className="mt-0.5 text-sm text-ink-muted">Catat kondisi & pekerjaan hari ini</p>
                </>
              )}
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tone-brand-bg text-brand-600">
              <FileText {...iconProps(19)} />
            </span>
          </div>
          <Link
            to={todayReport ? `/field/laporan/${todayReport.id}` : '/field/laporan/baru'}
            className="mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800"
          >
            {todayReport ? 'Lihat laporan' : 'Buat Laporan Harian'}
            <ArrowRight {...iconProps(15)} strokeWidth={2.2} />
          </Link>
        </MCard>

        {/* Perlu perhatian */}
        {attention.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Perlu perhatian</SectionTitle>
            <div className="space-y-2">
              {attention.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex items-center gap-3 rounded-xl border border-line-subtle bg-surface p-3 shadow-xs transition-colors active:bg-hover"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tone-warning-bg text-amber-600">
                    <item.icon {...iconProps(15)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{item.title}</span>
                    <span className="block truncate text-xs text-ink-muted">{item.meta}</span>
                  </span>
                  <ArrowRight {...iconProps(14)} className="shrink-0 text-ink-disabled" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Pekerjaan berjalan */}
        <section className="space-y-2">
          <SectionTitle action={<SeeAll to="/field/pekerjaan">Semua</SeeAll>}>
            Pekerjaan berjalan
          </SectionTitle>
          {active.length === 0
            ? <EmptyState size="sm" icon={ClipboardList} title="Tidak ada pekerjaan berjalan" />
            : active.slice(0, 2).map((a) => <ActivityRow key={a.id} a={a} />)}
        </section>

        {/* Inspeksi */}
        <section className="space-y-2">
          <SectionTitle action={<SeeAll to="/field/inspeksi">Semua</SeeAll>}>
            Inspeksi
          </SectionTitle>
          {myWirs.length === 0
            ? <EmptyState size="sm" icon={ClipboardCheck} title="Belum ada pengajuan berjalan" />
            : myWirs.slice(0, 2).map((w) => {
              const point = ITP_POINTS.find((p) => p.id === w.itpPointId)
              return (
                <WirCard
                  key={w.id}
                  wir={w}
                  meta={w.status === 'scheduled' && w.scheduledAt
                    ? `Terjadwal ${formatRelative(w.scheduledAt)}`
                    : point ? POINT_TYPE[point.type].label : undefined}
                />
              )
            })}
        </section>

        {/* Aksi cepat */}
        <section className="space-y-2">
          <SectionTitle>Aksi cepat</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <QuickTile icon={FilePenLine} label="Update Progres" onClick={pickActivity} />
            <QuickTile icon={ClipboardCheck} label="Ajukan Inspeksi" onClick={() => navigate('/field/inspeksi/baru')} />
            <QuickTile icon={TriangleAlert} label="Catat Kendala" onClick={() => navigate('/field/kendala/baru')} />
            <QuickTile icon={Truck} label="Material Datang" onClick={() => navigate('/field/material/baru')} />
          </div>
        </section>
      </div>
    </Screen>
  )
}

/* ---------- Home QA/QC Inspector ---------- */

function QcHome() {
  const { projectId, wirs, findings } = useField()
  const navigate = useNavigate()

  const scheduledToday = wirs.filter((w) => w.projectId === projectId && w.status === 'scheduled')
  const queue = wirs.filter((w) => w.projectId === projectId && w.status === 'submitted')
  const reinspections = wirs.filter((w) => w.projectId === projectId && w.status === 'reinspection_requested')
  const toVerify = findings.filter((f) => f.projectId === projectId && ['verification_pending', 'action_submitted'].includes(f.status))

  return (
    <Screen
      topBar={<HomeHeader name="Rina Maharani" />}
      className="px-4 pt-4 pb-6"
    >
      <div className="space-y-5">
        <ProjectChip projectId={projectId} />

        {/* Terjadwal hari ini */}
        <section className="space-y-2">
          <SectionTitle>Terjadwal hari ini</SectionTitle>
          {scheduledToday.length === 0
            ? <EmptyState size="sm" icon={AlarmClock} title="Tidak ada inspeksi terjadwal" description="Pengajuan baru akan muncul di antrian." />
            : scheduledToday.map((w) => (
              <WirCard key={w.id} wir={w} meta={w.scheduledAt ? `Hari ini · ${new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date(w.scheduledAt)).replace('.', ':')} WIB` : undefined} />
            ))}
        </section>

        {/* Antrian menunggu */}
        <section className="space-y-2">
          <SectionTitle action={<SeeAll to="/field/inspeksi">Antrian</SeeAll>}>
            Menunggu review ({queue.length})
          </SectionTitle>
          {queue.length === 0
            ? <EmptyState size="sm" icon={ListChecks} title="Antrian kosong" />
            : queue.slice(0, 2).map((w) => (
              <WirCard key={w.id} wir={w} meta={`Diajukan ${formatRelative(w.submittedAt!)}`} />
            ))}
        </section>

        {/* Re-inspeksi */}
        {reinspections.length > 0 && (
          <section className="space-y-2">
            <SectionTitle>Re-inspeksi</SectionTitle>
            {reinspections.map((w) => (
              <WirCard key={w.id} wir={w} meta={w.scheduledAt ? `Ronde berikutnya ${formatRelative(w.scheduledAt)}` : 'Menunggu penjadwalan'} />
            ))}
          </section>
        )}

        {/* Verifikasi perbaikan */}
        <section className="space-y-2">
          <SectionTitle action={<SeeAll to="/field/temuan">Semua temuan</SeeAll>}>
            Verifikasi perbaikan ({toVerify.length})
          </SectionTitle>
          {toVerify.length === 0
            ? <EmptyState size="sm" icon={BadgeCheck} title="Tidak ada perbaikan menunggu verifikasi" />
            : toVerify.map((f) => <FindingCard key={f.id} f={f} />)}
        </section>

        {/* Aksi cepat */}
        <section className="space-y-2">
          <SectionTitle>Aksi cepat</SectionTitle>
          <button
            type="button"
            onClick={() => navigate(scheduledToday[0] ? `/field/inspeksi/${scheduledToday[0].id}` : '/field/inspeksi')}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 text-md font-semibold text-white shadow-xs transition-colors active:bg-brand-800"
          >
            <Play {...iconProps(16)} /> Mulai Inspeksi
          </button>
          <div className="grid grid-cols-2 gap-2">
            <QuickTile icon={ListChecks} label="Lihat Antrian" onClick={() => navigate('/field/inspeksi')} />
            <QuickTile icon={BadgeCheck} label="Verifikasi Perbaikan" onClick={() => navigate(toVerify[0] ? `/field/temuan/${toVerify[0].id}/verifikasi` : '/field/temuan')} />
          </div>
        </section>
      </div>
    </Screen>
  )
}

export function Home() {
  const { persona } = useField()
  return persona === 'qc' ? <QcHome /> : <EngineerHome />
}
