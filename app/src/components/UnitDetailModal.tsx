import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  FileWarning,
  Layers,
  MapPin,
} from 'lucide-react'
import { iconProps } from '@/components/Icon'
import { Dialog } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/format'
import { projectName, type ProjectUnit } from '@/demo/data'

export interface UnitDetailModalProps {
  unit: ProjectUnit | null
  open: boolean
  onClose: () => void
}

const STATUS_LABELS: Record<ProjectUnit['status'], { label: string; tone: 'brand' | 'warning' | 'danger' | 'success' | 'neutral' }> = {
  normal: { label: 'Sesuai Jadwal', tone: 'success' },
  need_inspection: { label: 'Perlu Pemeriksaan', tone: 'warning' },
  has_findings: { label: 'Catatan Temuan', tone: 'danger' },
  ready_handover: { label: 'Punch List / Serah Terima', tone: 'brand' },
  delayed: { label: 'Pekerjaan Tertunda', tone: 'danger' },
}

export function UnitDetailModal({ unit, open, onClose }: UnitDetailModalProps) {
  const navigate = useNavigate()
  if (!unit) return null

  const st = STATUS_LABELS[unit.status]

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-base font-bold text-ink">{unit.code}</span>
          <Badge tone={st.tone} size="sm">
            {st.label}
          </Badge>
        </div>
      }
      description={
        <span className="flex items-center gap-2 text-xs text-ink-muted mt-0.5">
          <span className="flex items-center gap-1 font-medium text-ink-secondary">
            <Building2 {...iconProps(12)} /> {projectName(unit.projectId)}
          </span>
          <span aria-hidden>•</span>
          <span className="flex items-center gap-1">
            <MapPin {...iconProps(12)} /> {unit.blockOrZone}
          </span>
          <span aria-hidden>•</span>
          <span className="rounded bg-sunken px-1.5 py-0.2 font-mono text-[10px] text-ink-muted border border-line-subtle">
            {unit.type}
          </span>
        </span>
      }
    >
      <div className="space-y-4 pt-1">
        {/* Metrik Progres Utama */}
        <div className="rounded-xl border border-line-subtle bg-sunken/40 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
              Progres Fisik Unit
            </span>
            <span className="font-mono text-2xl font-bold text-ink tnum">
              {unit.progressPct}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sunken border border-line-subtle">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${unit.progressPct}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-2xs text-ink-muted pt-2 border-t border-line-subtle">
            <span className="flex items-center gap-1">
              <Layers {...iconProps(12)} className="text-ink-secondary" />
              Tahap saat ini: <strong className="text-ink font-semibold">{unit.stage}</strong>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar {...iconProps(12)} className="text-ink-secondary" />
              Target serah terima: <span className="text-ink font-medium">{formatDate(unit.targetHandover)}</span>
            </span>
          </div>
        </div>

        {/* Status & Tindakan Terbuka */}
        <div className="space-y-2">
          <span className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
            Tindakan &amp; Referensi Operasional
          </span>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {/* Pemeriksaan Aktif */}
            <div className="rounded-lg border border-line-subtle bg-surface p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-2xs font-semibold text-ink-muted uppercase">
                  <FileText {...iconProps(12)} /> Pemeriksaan Aktif
                </span>
                {unit.activeInspectionRef && (
                  <Badge tone="warning" size="sm">Menunggu Tindak Lanjut</Badge>
                )}
              </div>
              {unit.activeInspectionRef ? (
                <div className="pt-1">
                  <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {unit.activeInspectionRef}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate('/dashboard/inspeksi/wir-ar-0142')
                    }}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline cursor-pointer"
                  >
                    <span>Buka lembar pemeriksaan</span>
                    <ExternalLink {...iconProps(11)} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-ink-disabled pt-1">Tidak ada pengajuan aktif saat ini.</p>
              )}
            </div>

            {/* Temuan / Punch List */}
            <div className="rounded-lg border border-line-subtle bg-surface p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-2xs font-semibold text-ink-muted uppercase">
                  <FileWarning {...iconProps(12)} /> Daftar Temuan (Punch List)
                </span>
                {unit.openFindingRef && (
                  <Badge tone="danger" size="sm">Perlu Perbaikan</Badge>
                )}
              </div>
              {unit.openFindingRef ? (
                <div className="pt-1">
                  <span className="font-mono text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {unit.openFindingRef}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate('/dashboard/temuan/f-ar-021')
                    }}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800 hover:underline cursor-pointer"
                  >
                    <span>Lihat detail temuan &amp; foto bukti</span>
                    <ExternalLink {...iconProps(11)} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-ink-disabled pt-1">Belum ada catatan temuan terbuka.</p>
              )}
            </div>
          </div>
        </div>

        {/* Catatan Lapangan Mandor / Supervisor */}
        {unit.notes && (
          <div className="rounded-lg border border-line-subtle bg-sunken/60 p-3 space-y-1">
            <span className="text-2xs font-bold uppercase tracking-wider text-ink-muted">
              Catatan Pengawas Lapangan
            </span>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {unit.notes}
            </p>
          </div>
        )}

        {/* Footer Tombol Aksi Cepat */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-line-subtle">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-hover cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              navigate(`/dashboard/inspeksi?proyek=${unit.projectId}`)
            }}
            className="rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <FileText {...iconProps(12)} />
            <span>Ajukan Pemeriksaan Unit</span>
          </button>
        </div>
      </div>
    </Dialog>
  )
}
