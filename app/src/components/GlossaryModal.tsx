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
    term: 'WIR',
    fullName: 'Work Inspection Request (Permintaan Inspeksi Pekerjaan)',
    desc: 'Pengajuan resmi dari pelaksana/kontraktor kepada tim QA/QC dan pengawas untuk memeriksa pekerjaan sebelum tahap berikutnya dimulai.',
    example: 'Contoh: WIR-AR-2026-0142 untuk pembesian pelat lantai 8 sebelum pengecoran.',
  },
  {
    term: 'Hold Point',
    fullName: 'Titik Tahan (Mandatory Hold)',
    desc: 'Titik verifikasi kritis dalam rencana mutu (ITP). Pekerjaan fisik tidak boleh dilanjutkan melewati titik ini sebelum ada otorisasi tertulis dari personel berwenang.',
    example: 'Contoh: Pengecoran beton struktural ditahan sampai pembesian dan bekisting disetujui.',
  },
  {
    term: 'Witness Point',
    fullName: 'Titik Saksi',
    desc: 'Titik inspeksi di mana pengawas atau konsultan diundang untuk menyaksikan pengujian atau proses pelaksanaan, namun pekerjaan dapat berlanjut bila pengawas tidak hadir sesuai pemberitahuan tertulis.',
    example: 'Contoh: Uji slump beton atau pemadatan lapisan tanah (subbase).',
  },
  {
    term: 'ITP',
    fullName: 'Inspection and Test Plan (Rencana Inspeksi & Pengujian)',
    desc: 'Dokumen acuan kendali mutu yang merinci item pekerjaan, metode uji, kriteria keberterimaan, frekuensi, serta peran verifikator.',
    example: 'Contoh: ITP-ARU-STR Rev C klausul 4.2 untuk pembesian pelat dan balok.',
  },
  {
    term: 'NCR / Temuan',
    fullName: 'Non-Conformance Report (Laporan Ketidaksesuaian)',
    desc: 'Catatan resmi atas ketidaksesuaian hasil fisik pekerjaan atau material terhadap gambar kerja atau spesifikasi teknis.',
    example: 'Contoh: F-AR-021 mengenai ketebalan selimut beton (cover) kurang dari spesifikasi 25 mm.',
  },
  {
    term: 'Tindakan Perbaikan (CA)',
    fullName: 'Corrective Action (Tindakan Korektif)',
    desc: 'Langkah nyata yang diambil oleh pelaksana untuk mengoreksi ketidaksesuaian dan mencegah pengulangan masalah, dibuktikan dengan dokumentasi foto dan uji ulang.',
    example: 'Contoh: CA-021-1 berupa pemasangan tahu beton/spacer standar setebal 25 mm.',
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
          <span>Panduan Istilah &amp; Konvensi Mutu Lapangan</span>
        </div>
      }
      description="Glosarium standar alur kendali eksekusi proyek (CSEC) sesuai PRD §14 dan §15."
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup Panduan
        </Button>
      }
    >
      <div className="space-y-4 py-2">
        <div className="rounded-lg border border-brand-200 bg-brand-50/60 p-3 text-xs text-brand-900">
          <p className="font-semibold">Konvensi Workflow:</p>
          <p className="mt-1 leading-relaxed text-brand-800">
            Sistem membedakan secara tegas antara permintaan inspeksi yang belum disetujui (WIR) dengan temuan inkonformitas resmi (NCR). Penerimaan WIR tidak otomatis merilis Titik Tahan (Hold Point) tanpa otorisasi terpisah dari pihak berwenang.
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
