import { useState } from 'react'
import { FileText, FileWarning } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { SearchInput } from '@/components/ui/SearchInput'
import { formatAge } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { F_DOCS, fProject, type DocCategory, type FDoc } from '@/field/data'
import { MCard, Screen, SectionTitle, TopBar, useSheet } from '@/field/ui'

/* ============================================================
 * FO-33 Gambar & dokumen proyek + peringatan revisi lama
 * ============================================================ */

const CATS: (DocCategory | 'Semua')[] = ['Semua', 'Gambar', 'ITP & Checklist', 'Spesifikasi', 'Method Statement', 'Persetujuan Material', 'Laporan Uji']

function openDoc(sheet: ReturnType<typeof useSheet>, doc: FDoc) {
  sheet.open({
    title: `${doc.number} Rev ${doc.rev}`,
    children: (
      <div className="space-y-3">
        {doc.status === 'superseded' && (
          <div className="flex items-start gap-2.5 rounded-lg border border-tone-warning-border bg-tone-warning-bg p-3">
            <FileWarning {...iconProps(16)} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-sm leading-5 text-ink-secondary">
              Revisi ini sudah digantikan oleh Rev {doc.latestRev}. Jangan dipakai sebagai dasar pemeriksaan.
            </p>
          </div>
        )}
        <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-line-strong bg-sunken text-ink-disabled">
          <FileText {...iconProps(28)} />
        </div>
        <p className="text-md font-semibold text-ink">{doc.title}</p>
        <p className="text-sm text-ink-secondary">{doc.category}{doc.discipline ? ` · ${doc.discipline}` : ''} · diterbitkan {formatAge(doc.issued)} lalu</p>
        <p className="rounded-lg bg-sunken p-3 text-2xs leading-4 text-ink-disabled">
          Pratinjau dokumen penuh tidak tersedia pada demo.
        </p>
      </div>
    ),
  })
}

export function Docs() {
  const { projectId } = useField()
  const project = fProject(projectId)
  const sheet = useSheet()
  const [cat, setCat] = useState<(typeof CATS)[number]>('Semua')
  const [q, setQ] = useState('')

  const docs = F_DOCS
  const list = docs
    .filter((d) => d.projectId === projectId)
    .filter((d) => cat === 'Semua' || d.category === cat)
    .filter((d) => q.trim() === '' || `${d.number} ${d.title}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <Screen topBar={<TopBar large title="Gambar & Dokumen" subtitle={project.name} />} className="px-4 pt-4 pb-6">
      <div className="space-y-4">
        <SearchInput value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} placeholder="Cari nomor atau judul dokumen" />

        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-1.5">
            {CATS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={cn(
                  'inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3 text-sm font-medium whitespace-nowrap transition-colors',
                  c === cat ? 'border-brand-600 bg-brand-600 text-white' : 'border-line bg-surface text-ink-secondary',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0
          ? <EmptyState icon={FileText} title="Tidak ada dokumen" description="Coba kata kunci atau kategori lain." />
          : (
            <section className="space-y-2">
              <SectionTitle>{list.length} dokumen</SectionTitle>
              <MCard className="divide-y divide-line-subtle">
                {list.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => openDoc(sheet, d)}
                    className="flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors active:bg-hover"
                  >
                    <span className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      d.status === 'superseded' ? 'bg-tone-warning-bg text-amber-600' : 'bg-sunken text-ink-secondary',
                    )}
                    >
                      {d.status === 'superseded' ? <FileWarning {...iconProps(16)} /> : <FileText {...iconProps(16)} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {d.number} <span className="font-mono text-xs font-normal text-ink-muted">Rev {d.rev}</span>
                      </span>
                      <span className="block truncate text-xs text-ink-muted">{d.title}</span>
                    </span>
                    {d.status === 'superseded'
                      ? <Badge size="sm" tone="warning">Lama</Badge>
                      : <Badge size="sm" tone="success">Berlaku</Badge>}
                  </button>
                ))}
              </MCard>
            </section>
          )}
      </div>
    </Screen>
  )
}
