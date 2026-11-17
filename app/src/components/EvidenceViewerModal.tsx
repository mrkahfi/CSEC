import { useState } from 'react'
import {
  Camera,
  FileText,
  FileCheck2,
  Calendar,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
} from 'lucide-react'
import { Dialog } from '@/components/ui/Dialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { iconProps } from '@/components/Icon'
import { cn } from '@/lib/cn'

export type EvidenceType = 'photo-rebar' | 'photo-before' | 'test-slump' | 'doc-laporan'

export interface EvidenceViewerModalProps {
  open: boolean
  onClose: () => void
  initialType?: EvidenceType
}

export function EvidenceViewerModal({ open, onClose, initialType = 'photo-rebar' }: EvidenceViewerModalProps) {
  const [activeTab, setActiveTab] = useState<EvidenceType>(initialType)

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="2xl"
      title="Pratinjau Bukti Lapangan & Berkas Verifikasi"
      description="Bukti visual, berita acara uji laboratorium, dan laporan pengawasan terlampir."
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xs text-ink-muted">Tipe Dokumen:</span>
            <Badge tone="brand" size="sm">
              {activeTab.startsWith('photo') ? 'Foto Lapangan Bergeotag' : 'Dokumen Pengawasan Resmi'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Tutup
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => alert('Simulasi unduh: Berkas tersimpan di perangkat.')}
            >
              <Download {...iconProps(14)} /> Unduh Berkas
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Selector Tab Bukti */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-line-subtle pb-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('photo-rebar')}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeTab === 'photo-rebar'
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'bg-sunken text-ink-secondary hover:bg-hover hover:text-ink',
            )}
          >
            <Camera {...iconProps(13)} />
            <span>Foto Pasca-Koreksi (Grid A/2)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photo-before')}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeTab === 'photo-before'
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'bg-sunken text-ink-secondary hover:bg-hover hover:text-ink',
            )}
          >
            <AlertTriangle {...iconProps(13)} />
            <span>Foto Temuan Awal (F-AR-021)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('test-slump')}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeTab === 'test-slump'
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'bg-sunken text-ink-secondary hover:bg-hover hover:text-ink',
            )}
          >
            <FileCheck2 {...iconProps(13)} />
            <span>Berita Acara Uji Slump Batch 118</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('doc-laporan')}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
              activeTab === 'doc-laporan'
                ? 'bg-brand-600 text-white shadow-2xs'
                : 'bg-sunken text-ink-secondary hover:bg-hover hover:text-ink',
            )}
          >
            <FileText {...iconProps(13)} />
            <span>Laporan Pengawasan LW-08-114</span>
          </button>
        </div>

        {/* Tampilan Konten Bukti */}
        {activeTab === 'photo-rebar' && <RebarPhotoView />}
        {activeTab === 'photo-before' && <BeforePhotoView />}
        {activeTab === 'test-slump' && <SlumpTestReportView />}
        {activeTab === 'doc-laporan' && <DailySupervisorReportView />}
      </div>
    </Dialog>
  )
}

/** Tampilan 1: Foto Pembesian & Spacer Pasca Koreksi */
function RebarPhotoView() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Visual Kanvas Foto Konstruksi */}
      <div className="lg:col-span-2 overflow-hidden rounded-xl border border-line-strong bg-slate-950 relative shadow-sm">
        {/* Render Grafis Visual Lapangan (Simulasi Pembesian & Beton Decking) */}
        <div className="aspect-4/3 w-full bg-linear-to-b from-slate-900 via-slate-800 to-stone-900 relative flex items-center justify-center p-6 select-none overflow-hidden">
          {/* Tekstur Bekisting Kayu Lapisan Bawah */}
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,#78350f,#78350f_40px,#92400e_40px,#92400e_80px)]" />

          {/* Grid Anyaman Tulangan Baja D16-150 */}
          <div className="relative w-full h-full flex flex-col justify-around">
            {/* Tulangan Horizontal */}
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className="h-3 w-full bg-linear-to-r from-stone-400 via-slate-300 to-stone-500 rounded-xs shadow-md border-y border-stone-600 relative">
                {/* Rusuk/Ulir Besi Rebar */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.35)_6px,rgba(0,0,0,0.35)_9px)] opacity-60" />
              </div>
            ))}

            {/* Tulangan Vertikal Melintang */}
            <div className="absolute inset-0 flex justify-around pointer-events-none">
              {[0, 1, 2, 3, 4].map((idx) => (
                <div key={idx} className="w-3 h-full bg-linear-to-b from-stone-400 via-slate-300 to-stone-500 rounded-xs shadow-lg border-x border-stone-600 relative">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(0,0,0,0.35)_6px,rgba(0,0,0,0.35)_9px)] opacity-60" />
                </div>
              ))}
            </div>

            {/* Beton Decking / Spacer Kubus (25 mm) Terpasang */}
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="h-10 w-10 rounded-sm bg-stone-300 border-2 border-stone-400 shadow-xl flex items-center justify-center text-[9px] font-bold font-mono text-stone-700">
                25mm
              </div>
              <div className="absolute -top-6 -left-8 bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1">
                <CheckCircle2 size={11} /> SPACER: 25.4 mm (OK)
              </div>
            </div>

            {/* Kawat Bendrat Ikatan Tulangan */}
            <div className="absolute top-[48%] left-[62%] h-4 w-4 rounded-full border-2 border-amber-300 opacity-90" />
          </div>

          {/* Viewfinder Kamera & Geotag Watermark Lapangan */}
          <div className="absolute top-3 left-3 text-white font-mono text-[10px] bg-black/60 px-2 py-1 rounded backdrop-blur-xs border border-white/10">
            [REC] 4032x3024 · ISO 50 · 1/250s
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded text-[10px] font-mono font-semibold">
            <ShieldCheck size={12} /> VERIFIKASI: LOLOS
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-white/90 font-mono text-[9px] bg-black/75 px-3 py-1.5 rounded-md backdrop-blur-xs border border-white/15">
            <div>
              <p className="font-bold text-amber-300">GEDUNG ARUNA TOWER A · LANTAI 8 GRID A/2</p>
              <p className="text-white/70">WIR-AR-2026-0142 · QA/QC VERIFIED</p>
            </div>
            <div className="text-right">
              <p>15-NOV-2026 14:32:18 WIB</p>
              <p className="text-white/70">GPS: -6.2088, 106.8456 (±2m)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Informasi & Metadata Foto */}
      <div className="rounded-xl border border-line-subtle bg-surface p-4 space-y-3.5">
        <div className="border-b border-line-subtle pb-2.5">
          <Badge tone="success" size="sm" icon={CheckCircle2}>Bukti Perbaikan Disetujui</Badge>
          <h4 className="mt-1.5 text-sm font-bold text-ink leading-snug">
            Pemasangan Beton Decking Tebal 25 mm
          </h4>
          <p className="mt-0.5 text-xs text-ink-muted">
            Lingkup: Pembesian pelat L8 Grid A/1-4 (Zona Puring Timur)
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">Hasil Pengukuran</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-base font-bold text-emerald-700">25.4 mm</span>
              <span className="text-2xs text-ink-muted">Toleransi: 25 mm ± 5 mm (SPEC-CON-01 §5.3)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-line-subtle">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">Diambil Oleh</span>
              <span className="font-semibold text-ink">Budi Santoso</span>
              <span className="block text-2xs text-ink-muted">Site Engineer (PT KBN)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">Diverifikasi Oleh</span>
              <span className="font-semibold text-ink">Sari Wulandari</span>
              <span className="block text-2xs text-ink-muted">QA/QC Inspector</span>
            </div>
          </div>

          <div className="pt-1 border-t border-line-subtle text-2xs text-ink-secondary space-y-1">
            <p className="flex items-center gap-1.5"><Calendar size={12} className="text-ink-muted" /> 15 November 2026, 14:32 WIB</p>
            <p className="flex items-center gap-1.5"><MapPin size={12} className="text-ink-muted" /> Lat: -6.208761, Long: 106.845620</p>
            <p className="flex items-center gap-1.5"><Camera size={12} className="text-ink-muted" /> Samsung XCover Pro (SM-G715FN)</p>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-950">
          <span className="font-bold block text-emerald-900">Catatan Pemeriksa:</span>
          Tebal selimut beton merata dan spacer terikat kuat pada tulangan bawah. Sesuai gambar pembesian S-301 Rev C.
        </div>
      </div>
    </div>
  )
}

/** Tampilan 2: Foto Temuan Awal (Defect) */
function BeforePhotoView() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 overflow-hidden rounded-xl border border-red-300 bg-slate-950 relative shadow-sm">
        <div className="aspect-4/3 w-full bg-linear-to-b from-stone-900 via-stone-800 to-amber-950 relative flex items-center justify-center p-6 select-none overflow-hidden">
          {/* Bekisting */}
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,#451a03,#451a03_40px,#78350f_40px,#78350f_80px)]" />

          {/* Tulangan yang Menempel Bekisting (Cover Kurang) */}
          <div className="relative w-full h-full flex flex-col justify-around">
            <div className="h-3 w-full bg-stone-500 rounded-xs shadow-md border-y border-stone-700 relative translate-y-6" />
            <div className="h-3 w-full bg-stone-500 rounded-xs shadow-md border-y border-stone-700 relative translate-y-6" />

            {/* Tulangan Vertikal yang Terkulai */}
            <div className="absolute inset-0 flex justify-around pointer-events-none">
              <div className="w-3 h-full bg-stone-500 rounded-xs shadow-lg border-x border-stone-700 translate-y-4" />
              <div className="w-3 h-full bg-stone-500 rounded-xs shadow-lg border-x border-stone-700 translate-y-4" />
            </div>

            {/* Indikator Cacat / Defect */}
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 z-10">
              <div className="h-8 w-16 border-2 border-red-500 rounded-sm bg-red-950/70 flex items-center justify-center text-[10px] font-bold font-mono text-red-200">
                12 mm
              </div>
              <div className="absolute -top-6 -left-12 bg-red-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap flex items-center gap-1">
                <AlertTriangle size={11} /> CACAT: KURANG DARI 25mm
              </div>
            </div>
          </div>

          <div className="absolute top-3 left-3 text-red-300 font-mono text-[10px] bg-red-950/80 px-2 py-1 rounded border border-red-500/40">
            TEMUAN AKTIF · F-AR-021
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-white/90 font-mono text-[9px] bg-black/80 px-3 py-1.5 rounded-md border border-red-500/30">
            <div>
              <p className="font-bold text-red-400">KONDISI AWAL SEBELUM PERBAIKAN</p>
              <p className="text-white/70">Tulangan menempel pada bekisting tanpa beton decking</p>
            </div>
            <div className="text-right">
              <p>11-NOV-2026 11:20 WIB</p>
              <p className="text-white/70">QA/QC INSPEKSI AWAL</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line-subtle bg-surface p-4 space-y-3.5">
        <div className="border-b border-line-subtle pb-2.5">
          <Badge tone="danger" size="sm" icon={AlertTriangle}>Temuan Kritis (F-AR-021)</Badge>
          <h4 className="mt-1.5 text-sm font-bold text-ink leading-snug">
            Cover Tulangan di Bawah Spesifikasi
          </h4>
          <p className="mt-0.5 text-xs text-ink-muted">
            Lantai 8 Tower A · Grid A/2
          </p>
        </div>

        <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-950 space-y-1">
          <span className="font-bold block text-red-900">Uraian Ketidaksesuaian:</span>
          <p>
            Tulangan bawah pelat ditemukan berjarak hanya 12–15 mm dari dasar bekisting akibat ketiadaan spacer beton. Berpotensi korosi tulangan jika dicor.
          </p>
        </div>

        <div className="text-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">Tindakan Perbaikan Wajib (CA-021-1)</span>
          <p className="text-ink-secondary">
            Pengadaan dan pemasangan beton decking K-400 tebal 25 mm dengan interval maksimal 100 cm sebelum izin cor diberikan.
          </p>
        </div>
      </div>
    </div>
  )
}

/** Tampilan 3: Berita Acara Uji Slump Beton (Batch 118) */
function SlumpTestReportView() {
  return (
    <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-line-subtle bg-white p-6 text-slate-900 shadow-xs font-sans">
      {/* Kop Surat Laboratorium */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
        <div>
          <h3 className="font-serif text-base font-bold tracking-tight text-slate-900">
            PT KARYA LAB INDEPENDEN
          </h3>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">
            Laboratorium Pengujian Mutu Beton &amp; Geoteknik Terakreditasi
          </p>
          <p className="text-2xs text-slate-500">Jl. D.I. Panjaitan No. 42, Cawang, Jakarta Timur · Telp: (021) 851-9920</p>
        </div>
        <div className="text-right">
          <div className="inline-block rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-right">
            <span className="block text-[9px] font-bold text-slate-400 uppercase">No. Dokumen</span>
            <span className="font-mono text-xs font-bold text-slate-900">BA-SLUMP/2026/ARU-118</span>
          </div>
        </div>
      </div>

      <div className="my-4 text-center">
        <h4 className="text-sm font-bold uppercase tracking-wider underline">
          BERITA ACARA PENGUJIAN SLUMP BETON SEGAR
        </h4>
        <p className="text-2xs text-slate-500 font-mono mt-0.5">SNI 1972:2008 / ASTM C143</p>
      </div>

      {/* Data Identitas Sampling */}
      <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Proyek</span>
          <span className="font-semibold text-slate-900">Gedung Aruna Tower A (Struktur Pelat Lantai 8)</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Pemasok Ready Mix</span>
          <span className="font-semibold text-slate-900">PT Adhimix Precast Indonesia · Plant Pulogadung</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Mutu Beton Rencana</span>
          <span className="font-mono font-bold text-slate-900">fc' 30 MPa (K-350) · Slump Rencana 80 ± 25 mm</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">No. Truk Mixer &amp; Batch</span>
          <span className="font-mono font-bold text-slate-900">B-9842-TDA · Batch 118 (Vol. 7.0 m³)</span>
        </div>
      </div>

      {/* Tabel Hasil Pengujian */}
      <div className="mt-4">
        <table className="w-full text-xs border border-slate-300 text-left">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300">Parameter Pengujian</th>
              <th className="p-2 border-r border-slate-300 text-center">Spesifikasi Kontrak</th>
              <th className="p-2 border-r border-slate-300 text-center">Hasil Uji Lapangan</th>
              <th className="p-2 text-center">Kesimpulan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-2 border-r border-slate-300 font-medium">Uji Slump (Kerucut Abrams)</td>
              <td className="p-2 border-r border-slate-300 text-center font-mono">75 mm s.d. 105 mm</td>
              <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-emerald-700 bg-emerald-50/50">85 mm</td>
              <td className="p-2 text-center font-bold text-emerald-700">MEMENUHI</td>
            </tr>
            <tr>
              <td className="p-2 border-r border-slate-300 font-medium">Suhu Beton Segar</td>
              <td className="p-2 border-r border-slate-300 text-center font-mono">Maks. 32.0 °C</td>
              <td className="p-2 border-r border-slate-300 text-center font-mono">29.2 °C</td>
              <td className="p-2 text-center font-bold text-emerald-700">MEMENUHI</td>
            </tr>
            <tr>
              <td className="p-2 border-r border-slate-300 font-medium">Benda Uji Tekan Silinder (15x30 cm)</td>
              <td className="p-2 border-r border-slate-300 text-center font-mono">4 Silinder / 50 m³</td>
              <td className="p-2 border-r border-slate-300 text-center font-mono">4 Benda Uji Dibuat</td>
              <td className="p-2 text-center font-bold text-emerald-700">LENGKAP</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tanda Tangan & Cap Laboratorium */}
      <div className="mt-8 grid grid-cols-3 gap-6 text-center text-xs pt-4 border-t border-slate-200">
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Pemasok Ready Mix</p>
          <div className="h-12 flex items-center justify-center font-serif italic text-slate-400">ttd</div>
          <p className="font-bold text-slate-800">Yanto Subagio</p>
          <p className="text-[10px] text-slate-500">Quality Control Plant</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Kontraktor Pelaksana</p>
          <div className="h-12 flex items-center justify-center font-serif italic text-slate-400">ttd</div>
          <p className="font-bold text-slate-800">Budi Santoso</p>
          <p className="text-[10px] text-slate-500">Site Engineer (PT KBN)</p>
        </div>
        <div className="relative">
          {/* Stempel Lab */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full border-2 border-emerald-600/80 px-3 py-1 rotate-[-8deg] text-emerald-700 font-mono text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50/80">
            LULUS UJI LAPANGAN
          </div>
          <p className="text-[10px] text-slate-500 uppercase font-semibold">Pengawas Independen</p>
          <div className="h-12 flex items-center justify-center font-serif italic text-slate-400">ttd</div>
          <p className="font-bold text-slate-800">Sari Wulandari</p>
          <p className="text-[10px] text-slate-500">QA/QC Inspector</p>
        </div>
      </div>
    </div>
  )
}

/** Tampilan 4: Laporan Pengawasan Harian Lapangan (LW-08-114) */
function DailySupervisorReportView() {
  return (
    <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-line-subtle bg-white p-6 text-slate-900 shadow-xs font-sans">
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-slate-900">PT MITRA TEKNIK SUPERVISI</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Konsultan Manajemen Konstruksi &amp; Supervisi Mutu
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
            LW-08-114
          </span>
          <p className="text-2xs text-slate-500 mt-1">14 November 2026</p>
        </div>
      </div>

      <div className="my-3 flex items-center justify-between bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Cuaca</span>
          <p className="font-semibold text-slate-800">Cerah (Suhu 31°C)</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Tenaga Kerja</span>
          <p className="font-semibold text-slate-800">38 Orang (14 Tukang Besi, 8 Bekisting)</p>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Alat Berat Beroperasi</span>
          <p className="font-semibold text-slate-800">Tower Crane #1 (Normal)</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <h5 className="font-bold uppercase tracking-wider text-slate-700 text-[11px] border-b border-slate-200 pb-1">
            Uraian Pekerjaan &amp; Pengawasan Lapangan
          </h5>
          <p className="mt-2 text-slate-700 leading-relaxed">
            1. Mengawasi pekerjaan rektifikasi dan penambahan beton decking pada pembesian pelat lantai 8 zona Grid A/1-4 (Tindak lanjut temuan F-AR-021).
          </p>
          <p className="mt-1.5 text-slate-700 leading-relaxed">
            2. Melakukan uji ukur acak tebal selimut beton pada 12 titik: didapatkan nilai rata-rata 25.4 mm (memenuhi syarat minimum 25 mm).
          </p>
          <p className="mt-1.5 text-slate-700 leading-relaxed">
            3. Memeriksa kebersihan sambungan bekisting dari serpihan kawat bendrat dan debu sebelum penutupan akhir.
          </p>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5">
          <span className="font-bold text-emerald-900 block">Rekomendasi Konsultan:</span>
          <p className="text-emerald-800 mt-0.5">
            Pekerjaan pembesian telah sesuai dengan Gambar Kerja S-301 Rev C. Kontraktor direkomendasikan segera mengajukan Work Inspection Request (WIR-AR-2026-0142) untuk verifikasi formal hold point rilis cor.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end text-xs border-t border-slate-200 pt-3">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Pengawas Lapangan</p>
          <p className="font-bold text-slate-900 mt-6">Hendra Kusuma, ST.</p>
          <p className="text-[10px] text-slate-500">Quality Inspector Konsultan</p>
        </div>
      </div>
    </div>
  )
}
