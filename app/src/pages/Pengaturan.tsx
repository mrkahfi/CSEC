import { useState } from 'react'
import {
  CalendarClock,
  CircleCheck,
  EyeOff,
  FileText,
  Info,
  Lock,
  ShieldCheck,
  Stamp,
  TriangleAlert,
} from 'lucide-react'
import { iconProps } from '@/components/Icon'
import { POINT_TYPE } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Callout } from '@/components/ui/Callout'
import { Select } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Timeline } from '@/components/ui/Timeline'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useDemo } from '@/demo/DemoContext'
import { useSimulatedLoading } from '@/demo/hooks'
import { PROJECTS, controlPointsOfProject } from '@/demo/data'

/** Profil workflow per proyek — statis, ilustratif (FR-CF-01). */
const PROFILES: Record<string, {
  terminology: string
  noticeHours: number
  outcomes: { outcome: string; role: string }[]
  requiredEvidence: string[]
  holdBehavior: string[]
  escalation: string
  docs: string[]
}> = {
  aru: {
    terminology: 'WIR (Work Inspection Request, istilah kontrak)',
    noticeHours: 48,
    outcomes: [
      { outcome: 'Keputusan internal (terima/koreksi/klarifikasi/tunda)', role: 'QA/QC Inspector · Sari Wulandari' },
      { outcome: 'Rilis hold point pengecoran', role: 'Quality Manager · Ratna Dewi' },
      { outcome: 'Keputusan pihak eksternal (bila ITP mensyaratkan)', role: 'Konsultan · CV Mitra Teknik' },
    ],
    requiredEvidence: ['Foto cover & tulangan per grid', 'Berita acara uji slump per batch', 'Laporan pengawasan harian konsultan', 'Checklist pra-pengecoran bertanda tangan'],
    holdBehavior: [
      'Rilis hanya bila seluruh kondisi tercatat, tidak ada pintas admin.',
      'Waiver memerlukan peran otoritas + alasan + referensi instruksi proyek.',
      'Inspeksi “Diterima” tidak merilis apa pun secara otomatis.',
    ],
    escalation: 'Target review 1 hari kerja; overdue H+1 tampil di kotak tindakan PM.',
    docs: ['ITP-ARU-STR Rev C', 'ITP-ARU-ARC Rev B', 'ITP-ARU-MEP Rev A', 'SPEC-CON-01 Rev 1', 'Gambar seri S-2xx'],
  },
  ks: {
    terminology: 'RFI (Request for Inspection, istilah proyek)',
    noticeHours: 24,
    outcomes: [
      { outcome: 'Keputusan internal', role: 'QA/QC Inspector · Sari Wulandari' },
      { outcome: 'Rilis titik tahan FF', role: 'Quality Manager · Ratna Dewi' },
      { outcome: 'Review shop drawing', role: 'Konsultan · CV Mitra Teknik' },
    ],
    requiredEvidence: ['Foto instalasi sebelum plafon ditutup', 'Hasil uji kontinuitas/isolasi', 'Checklist QA kontraktor bertanda tangan'],
    holdBehavior: ['Titik review bukan hold fisik, hanya titik tahan FF yang memblokir.', 'Revisi shop drawing wajib dikonfirmasi sebelum review teknis.'],
    escalation: 'Target klarifikasi kelengkapan 2 hari; temuan K3 naik ke PM pada hari yang sama.',
    docs: ['ITP-KS-MEP Rev B', 'ITP-KS-PLB Rev A', 'ITP-KS-FF Rev A', 'Shop drawing MEP-12 Rev 2'],
  },
  jk: {
    terminology: 'IR (Inspection Request, istilah proyek; referensi lokasi memakai chainage/Sta)',
    noticeHours: 72,
    outcomes: [
      { outcome: 'Keputusan internal', role: 'QA/QC Inspector · Sari Wulandari' },
      { outcome: 'Kehadiran witness & penerimaan layer', role: 'Konsultan · PT Cipta Karya' },
    ],
    requiredEvidence: ['Laporan uji lab (CBR/proctor/sand cone)', 'Foto sta & lajur', 'BA uji lapangan'],
    holdBehavior: ['Witness tidak hadir ≠ izin lanjut, efek mengikuti prosedur dinas.', 'Hold layer base menahan pekerjaan aspal hingga rilis.'],
    escalation: 'Pemberitahuan 72 jam; perubahan jadwal witness dicatat dengan alasan.',
    docs: ['ITP-JK-RW Rev 2', 'Spesifikasi dinas perkerasan (referensi)'],
  },
  bl: {
    terminology: 'WIR (arsip, hanya-baca)',
    noticeHours: 24,
    outcomes: [{ outcome: '-', role: 'Proyek arsip (konfigurasi historis)' }],
    requiredEvidence: ['-'],
    holdBehavior: ['Konfigurasi historis tidak berlaku; rekaman hanya-baca.'],
    escalation: '-',
    docs: ['ITP-BL-ST Rev A'],
  },
}

/** Peran yang dapat melihat konfigurasi (simulasi SC-38 — bukan enforcement). */
const CONFIG_VIEWERS = ['project_manager', 'quality_manager', 'qc_inspector']

export function Pengaturan() {
  const loading = useSimulatedLoading()
  const { role } = useDemo()
  const toast = useToast()
  const [projectId, setProjectId] = useState('aru')
  const profile = PROFILES[projectId]
  const pts = controlPointsOfProject(projectId)
  const allowed = CONFIG_VIEWERS.includes(role)

  if (loading) {
    return (
      <PageBody className="space-y-4 py-8">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-56 w-full" />
      </PageBody>
    )
  }

  return (
    <>
      <PageHeader
        title="Pengaturan Proyek"
        meta={<Badge tone="warning" size="sm">Hanya-baca</Badge>}
        actions={
          <Select
            aria-label="Pilih proyek"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            wrapperClassName="w-72"
          >
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.code} · {p.name}</option>)}
          </Select>
        }
      />

      <PageBody className="space-y-5">
        {!allowed ? (
          /* SC-38: state akses terbatas dirancang — bukan sekadar nav disembunyikan */
          <EmptyState
            icon={EyeOff}
            title="Akses terbatas (konfigurasi hanya untuk peran berwenang)"
            description={`Peran Anda tidak memiliki akses konfigurasi. Coba peran Project Manager / Quality Manager.`}
            actions={
              <Button variant="secondary" onClick={() => toast({ tone: 'info', title: 'Simulasi permintaan akses', description: 'Demo tidak memproses permintaan akses.' })}>
                <Lock {...iconProps(15)} /> Minta akses (simulasi)
              </Button>
            }
            className="rounded-xl border border-line-subtle bg-surface py-16 shadow-xs"
          />
        ) : (
          <>
            <Callout tone="warning" icon={ShieldCheck} title="Konfigurasi memerlukan review otoritas">
              Perubahan workflow disetujui perwakilan kualitas/kontrak sebelum berlaku.
            </Callout>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader title="Terminologi & pemberitahuan" />
                <CardBody className="space-y-3 pt-3">
                  <div>
                    <p className="text-xs text-ink-muted">Istilah permintaan inspeksi</p>
                    <p className="mt-0.5 text-md font-semibold text-ink">{profile.terminology}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-1 text-xs text-ink-muted"><CalendarClock {...iconProps(13)} /> Notice period</p>
                    <p className="mt-0.5 text-md font-semibold text-ink">{profile.noticeHours} jam sebelum jadwal inspeksi</p>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Jenis titik terpasang" />
                <CardBody className="space-y-1.5 pt-3">
                  {(['hold', 'witness', 'review', 'surveillance'] as const).map((t) => {
                    const count = pts.filter((p) => p.pointType === t).length
                    return (
                      <div key={t} className="flex items-center gap-2 text-sm">
                        <StatusBadge status={POINT_TYPE[t]} size="sm" />
                        <span className="tnum ml-auto text-sm font-medium text-ink-secondary">{count} titik</span>
                      </div>
                    )
                  })}
                  <p className="pt-1 font-mono text-xs text-ink-muted">Terpasang: {pts.map((p) => p.ref).join(', ') || '-'}</p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Peran & otoritas keputusan" />
                <CardBody className="pt-2">
                  <ul className="divide-y divide-line-subtle">
                    {profile.outcomes.map((o) => (
                      <li key={o.outcome} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                        <span className="text-sm text-ink-secondary">{o.outcome}</span>
                        <span className="text-right text-sm font-semibold text-ink">{o.role}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Kelengkapan wajib pengajuan" />
                <CardBody className="pt-2">
                  <ul className="space-y-1.5">
                    {profile.requiredEvidence.map((r) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-ink-secondary">
                        <CircleCheck {...iconProps(14)} strokeWidth={2} className="mt-0.5 shrink-0 text-green-600" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Perilaku hold point" />
                <CardBody className="pt-2">
                  <ul className="space-y-1.5">
                    {profile.holdBehavior.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-ink-secondary">
                        <Stamp {...iconProps(14)} className="mt-0.5 shrink-0 text-ink-muted" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Target waktu & eskalasi" />
                <CardBody className="pt-3">
                  <p className="flex items-start gap-2 text-sm text-ink-secondary">
                    <Info {...iconProps(15)} className="mt-0.5 shrink-0 text-sky-600" />
                    {profile.escalation}
                  </p>
                </CardBody>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader title="Referensi dokumen proyek" />
                <CardBody className="pt-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.docs.map((d) => (
                      <span key={d} className="inline-flex items-center gap-1.5 rounded-full border border-line-subtle bg-sunken px-2.5 py-1 font-mono text-xs text-ink-secondary">
                        <FileText {...iconProps(12)} /> {d}
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* FR-CF-03: riwayat revisi profil */}
              <Card className="md:col-span-2">
                <CardHeader title="Riwayat revisi profil workflow" />
                <CardBody className="pt-4">
                  <Timeline
                    items={[
                      { id: 'r1', icon: FileText, tone: 'neutral', title: 'ITP & profil workflow (revisi awal disetujui)', meta: 'QA Manager · 12 bulan lalu', note: 'Baseline dari template kontrak.' },
                      { id: 'r2', icon: TriangleAlert, tone: 'warning', title: 'Revisi 2 (notice period 24→48 jam, kondisi rilis ditambah)', meta: 'Quality Manager · 5 bulan lalu', note: 'Disetujui konsultan; berlaku prospektif.' },
                      { id: 'r3', icon: CircleCheck, tone: 'success', title: 'Revisi berjalan (tanpa perubahan tertunda)', meta: 'Demo · hari ini', detail: 'Perubahan berikutnya memerlukan review otoritas kualitas/kontrak.' },
                    ]}
                  />
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </PageBody>
    </>
  )
}
