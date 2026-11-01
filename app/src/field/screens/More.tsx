import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, ClipboardList, FlaskConical, HardHat,
  Images, LayoutGrid, ScrollText, SearchCheck, Send,
  TriangleAlert, Truck,
} from 'lucide-react'
import { iconProps } from '@/components/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { useField } from '@/field/FieldContext'
import { PERSONAS, fProject } from '@/field/data'
import { MCard, Screen, SectionTitle, Segmented, StickyBar, TopBar, useSheet } from '@/field/ui'
import { useToast } from '@/components/ui/Toast'

/* ============================================================
 * FO-40 Lainnya: profil, persona/proyek, catatan cepat, reset
 * + FO-36 Catat Kendala + FO-37 Material Datang
 * ============================================================ */

function RowLink({ icon: IconCmp, label, meta, onClick }: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  meta?: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-center gap-3 p-3.5 text-left transition-colors active:bg-hover">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tone-brand-bg text-brand-600">
        <IconCmp {...iconProps(15)} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{label}</span>
        {meta && <span className="block truncate text-xs text-ink-muted">{meta}</span>}
      </span>
      <ChevronRight {...iconProps(15)} className="shrink-0 text-ink-disabled" />
    </button>
  )
}

export function More() {
  const { persona, projectId, setProjectId, resetDemo } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const sheet = useSheet()
  const p = PERSONAS[persona]
  const project = fProject(projectId)

  const pickProject = () => {
    sheet.open({
      title: 'Pilih proyek aktif',
      children: (
        <div className="space-y-2">
          {p.projectIds.map((pid) => {
            const pr = fProject(pid)
            return (
              <button
                key={pid}
                type="button"
                onClick={() => { setProjectId(pid); sheet.close() }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-line-subtle bg-surface p-3 text-left transition-colors active:bg-hover"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-tone-brand-bg text-2xs font-bold text-brand-700">{pr.code}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">{pr.name}</span>
                  <span className="block truncate text-xs text-ink-muted">{pr.location}</span>
                </span>
                {pid === projectId && <Badge size="sm" tone="brand">Aktif</Badge>}
              </button>
            )
          })}
        </div>
      ),
    })
  }

  const doReset = () => {
    sheet.open({
      title: 'Reset demo',
      children: (
        <div className="space-y-3">
          <p className="text-sm leading-6 text-ink-secondary">
            Semua perubahan sesi (laporan, pengajuan, keputusan, temuan) dikembalikan ke data awal. Persona dan proyek aktif dipertahankan.
          </p>
          <button
            type="button"
            onClick={() => { resetDemo(); sheet.close(); toast({ tone: 'success', title: 'Demo direset', description: 'Data kembali ke kondisi awal.' }); navigate('/field/home') }}
            className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800"
          >
            Ya, reset sekarang
          </button>
          <button type="button" onClick={sheet.close} className="h-11 w-full cursor-pointer rounded-lg border border-line text-sm font-semibold text-ink-secondary">
            Batal
          </button>
        </div>
      ),
    })
  }

  return (
    <Screen topBar={<TopBar large title="Lainnya" subtitle="Akun, konteks, dan alat demo" />} className="px-4 pt-4 pb-6">
      <div className="space-y-5">
        {/* Profil */}
        <MCard className="p-4">
          <div className="flex items-center gap-3">
            <Avatar name={p.name} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-md font-semibold text-ink">{p.name}</p>
              <p className="truncate text-sm text-ink-muted">{p.role} · {p.org}</p>
            </div>
          </div>
        </MCard>

        {/* Konteks demo */}
        <section className="space-y-2">
          <SectionTitle>Konteks demo</SectionTitle>
          <MCard className="divide-y divide-line-subtle [&>button:first-child]:rounded-t-xl [&>button:last-child]:rounded-b-xl">
            <RowLink icon={persona === 'engineer' ? HardHat : SearchCheck} label="Ganti persona" meta={`${p.name} · ${p.role}`} onClick={() => navigate('/field/mulai')} />
            <RowLink icon={ClipboardList} label="Proyek aktif" meta={project.name} onClick={pickProject} />
            <RowLink icon={FlaskConical} label="Reset data demo" meta="Kembalikan semua catatan ke awal" onClick={doReset} />
          </MCard>
        </section>

        {/* Pintasan */}
        <section className="space-y-2">
          <SectionTitle>Pintasan</SectionTitle>
          <MCard className="divide-y divide-line-subtle [&>button:first-child]:rounded-t-xl [&>button:last-child]:rounded-b-xl">
            <RowLink icon={TriangleAlert} label="Catat kendala" onClick={() => navigate('/field/kendala/baru')} />
            <RowLink icon={Truck} label="Material datang" onClick={() => navigate('/field/material/baru')} />
            <RowLink icon={Images} label="Galeri foto" onClick={() => navigate('/field/galeri')} />
            <RowLink icon={ScrollText} label="Gambar & dokumen" onClick={() => navigate('/field/dokumen')} />
            <RowLink icon={LayoutGrid} label="Portal demo" meta="Site Operations Dashboard & modul ini" onClick={() => { window.location.hash = '#/' }} />
          </MCard>
        </section>

        <p className="flex items-start justify-center gap-1.5 px-4 text-center text-2xs leading-4 text-ink-disabled">
          <FlaskConical {...iconProps(12)} className="mt-0.5 shrink-0" />
          Prototipe dengan data fiktif. Tidak ada data yang dikirim ke server.
        </p>
      </div>
    </Screen>
  )
}

/* ---------- FO-36: catat kendala cepat ---------- */

export function KendalaForm() {
  const { projectId, setEvents } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const project = fProject(projectId)
  const [kategori, setKategori] = useState('cuaca')
  const [uraian, setUraian] = useState('')
  const [dampak, setDampak] = useState('')

  const submit = () => {
    const now = new Date().toISOString()
    setEvents((list) => [
      {
        id: `ev-${Date.now()}`, projectId, at: now, kind: 'kendala',
        title: `Kendala ${kategori} dicatat`,
        note: uraian.trim() || dampak.trim() || 'Tanpa uraian',
      },
      ...list,
    ])
    toast({ tone: 'success', title: 'Kendala tercatat', description: 'Muncul di aktivitas proyek (simulasi).' })
    navigate('/field/home')
  }

  return (
    <Screen
      topBar={<TopBar title="Catat Kendala" subtitle={project.name} onBack="/field/home" />}
      sticky={(
        <StickyBar>
          <button type="button" onClick={submit} className="h-11 w-full cursor-pointer rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            Simpan Kendala
          </button>
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        <Field label="Kategori">
          <Segmented
            value={kategori}
            onChange={setKategori}
            options={[
              { value: 'cuaca', label: 'Cuaca' },
              { value: 'material', label: 'Material' },
              { value: 'alat', label: 'Alat' },
              { value: 'akses', label: 'Akses' },
            ]}
          />
        </Field>
        <Field label="Uraian singkat" hint="Apa yang terjadi dan di lokasi mana.">
          <Textarea value={uraian} onChange={(e) => setUraian(e.target.value)} rows={3} placeholder="Contoh: Akses truk molen terhalang material yard timur." />
        </Field>
        <Field label="Dampak ke pekerjaan" hint="Opsional; aktivitas yang tertunda dan perkiraan durasi.">
          <Input value={dampak} onChange={(e) => setDampak(e.target.value)} placeholder="Contoh: Pengecoran L2 tertunda sekitar 2 jam" />
        </Field>
        <p className="text-2xs leading-4 text-ink-disabled">Kendala tercatat sebagai peristiwa proyek dan dapat disebut dalam laporan harian.</p>
      </div>
    </Screen>
  )
}

/* ---------- FO-37: material datang cepat ---------- */

export function MaterialForm() {
  const { projectId, setEvents } = useField()
  const navigate = useNavigate()
  const toast = useToast()
  const project = fProject(projectId)
  const [supplier, setSupplier] = useState('')
  const [material, setMaterial] = useState('')
  const [kondisi, setKondisi] = useState<'diterima' | 'kurang' | 'rusak'>('diterima')
  const [catatan, setCatatan] = useState('')

  const submit = () => {
    const now = new Date().toISOString()
    setEvents((list) => [
      {
        id: `ev-${Date.now()}`, projectId, at: now, kind: 'material',
        title: `Material datang: ${material.trim() || 'kiriman baru'}`,
        note: [supplier.trim(), kondisi === 'diterima' ? 'lengkap' : kondisi, catatan.trim()].filter(Boolean).join(' · '),
      },
      ...list,
    ])
    toast({ tone: 'success', title: 'Kedatangan tercatat', description: 'Tersambung ke laporan harian berikutnya (simulasi).' })
    navigate('/field/home')
  }

  return (
    <Screen
      topBar={<TopBar title="Material Datang" subtitle={project.name} onBack="/field/home" />}
      sticky={(
        <StickyBar>
          <button type="button" onClick={submit} className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors active:bg-brand-800">
            <Send {...iconProps(15)} /> Simpan Kedatangan
          </button>
        </StickyBar>
      )}
      className="px-4 pt-4 pb-4"
    >
      <div className="space-y-5">
        <Field label="Supplier"><Input value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="PT Besi Nusantara" /></Field>
        <Field label="Material"><Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Besi D16, 4,5 ton" /></Field>
        <Field label="Kondisi diterima">
          <Segmented
            value={kondisi}
            onChange={setKondisi}
            options={[
              { value: 'diterima' as const, label: 'Lengkap' },
              { value: 'kurang' as const, label: 'Kurang' },
              { value: 'rusak' as const, label: 'Rusak' },
            ]}
          />
        </Field>
        <Field label="Catatan" hint="Nomor surat jalan, klaim, atau lokasi penempatan.">
          <Textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={2} placeholder="SJ-8841 · yard timur" />
        </Field>
        <p className="text-2xs leading-4 text-ink-disabled">Catatan cepat; verifikasi kuantitas tetap mengikuti prosedur proyek.</p>
      </div>
    </Screen>
  )
}
