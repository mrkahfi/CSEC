import { BookOpen } from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { iconProps } from '@/components/Icon'

interface GlossaryItem {
  term: string
  fullName: string
  desc: string
  example: string
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'Ajukan Pemeriksaan',
    fullName: 'Work Inspection Request (WIR)',
    desc: 'Pengajuan dari pelaksana lapangan/kontraktor kepada pengawas kualitas untuk memeriksa kesiapan pekerjaan fisik sebelum tahap berikutnya dilanjutkan.',
    example: 'Contoh: INSP-NW-2026-0142 untuk pemeriksaan pembesian balok & pelat Unit A-05 sebelum cor.',
  },
  {
    term: 'Checklist / Acuan Periksa',
    fullName: 'Inspection and Test Plan (ITP) & Checklist',
    desc: 'Daftar parameter mutu spesifik dan kriteria keberterimaan (dimensi, toleransi, pemasangan) yang menjadi acuan pengecekan lapangan.',
    example: 'Contoh: Checklist Struktur Beton Item 4.2 (diameter besi D13/D10, selimut beton 25 mm).',
  },
  {
    term: 'Temuan Pekerjaan / Punch List',
    fullName: 'Non-Conformance / Field Finding',
    desc: 'Catatan pekerjaan yang belum rapi, cacat minor (punch list), atau ketidaksesuaian fisik terhadap gambar kerja yang harus diperbaiki.',
    example: 'Contoh: F-NW-021 mengenai selimut beton balok B2 Unit A-05 terukur 20 mm (spesifikasi 25 mm).',
  },
  {
    term: 'Tindak Lanjut Perbaikan',
    fullName: 'Corrective Action',
    desc: 'Langkah nyata yang dilakukan tim lapangan untuk mengoreksi temuan atau cacat pekerjaan, dilengkapi dokumentasi foto hasil perbaikan.',
    example: 'Contoh: CA-021-1 berupa penggantian dan pemasangan ulang spacer beton 25 mm tiap jarak 60 cm.',
  },
  {
    term: 'Verifikasi Perbaikan',
    fullName: 'Re-inspection / Verification',
    desc: 'Pengecekan ulang langsung di lokasi oleh pengawas kualitas untuk memastikan hasil perbaikan telah sesuai sebelum pekerjaan dilanjutkan.',
    example: 'Contoh: Pengawas memeriksa langsung spacer 25 mm di balok B2 Unit A-05 dan menyatakan sesuai.',
  },
  {
    term: 'Menunggu Persetujuan / Izin Tahap Kritis',
    fullName: 'Hold Point / Milestone Release',
    desc: 'Titik pemberhentian wajib sebelum pekerjaan kritis (mis. pengecoran beton). Pekerjaan tidak boleh berjalan sebelum seluruh syarat checklist dan temuan selesai diverifikasi.',
    example: 'Contoh: CP-NW-02 izin pengecoran pelat & balok Unit A-05 menunggu verifikasi selimut beton.',
  },
  {
    term: 'Hasil Pemeriksaan',
    fullName: 'Inspection Outcome',
    desc: 'Keputusan objektif hasil evaluasi checklist di lapangan: Sesuai, Perlu Perbaikan, Perlu Klarifikasi, atau Belum Diperiksa.',
    example: 'Contoh: Hasil pemeriksaan balok B2 dinyatakan "Perlu Perbaikan" sebelum diganti spacer standar.',
  },
]

export function GlossaryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <BookOpen {...iconProps(20)} className="text-brand-600" />
          <span>Panduan Istilah Operasional &amp; Kontrol Kualitas</span>
        </div>
      }
      description="Glosarium istilah operasional konstruksi untuk pemantauan lapangan, pemeriksaan kualitas, dan tindak lanjut perbaikan."
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup Panduan
        </Button>
      }
    >
      <div className="space-y-4 py-2">
        <div className="rounded-lg border border-brand-200 bg-brand-50/60 p-3 text-xs text-brand-900">
          <p className="font-semibold">Alur Operasional Lapangan:</p>
          <p className="mt-1 leading-relaxed text-brand-800">
            Sistem menghubungkan pelaporan progres harian, pengajuan pemeriksaan kualitas, pencatatan temuan/punch list, dan verifikasi perbaikan dalam satu alur terpadu. Istilah formal seperti ITP/NCR tetap didukung secara fleksibel untuk proyek yang menggunakannya.
          </p>
        </div>

        <div className="divide-y divide-line-subtle rounded-lg border border-line-subtle">
          {GLOSSARY_ITEMS.map((item) => (
            <div key={item.term} className="p-3.5 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-ink">{item.term}</span>
                <span className="text-2xs text-ink-muted">{item.fullName}</span>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">{item.desc}</p>
              <p className="text-2xs font-medium text-ink-muted bg-sunken rounded px-2 py-1 mt-1">
                {item.example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
