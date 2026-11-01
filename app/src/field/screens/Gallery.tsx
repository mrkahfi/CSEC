import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Images } from 'lucide-react'
import { iconProps } from '@/components/Icon'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { F_PHOTOS, fProject, type PhotoCategory } from '@/field/data'
import { PhotoTile, Screen, SectionTitle, TopBar, useSheet } from '@/field/ui'
import { cn } from '@/lib/cn'

/* ============================================================
 * FO-32 Galeri bukti lintas catatan
 * ============================================================ */

const CATS: (PhotoCategory | 'Semua')[] = ['Semua', 'progres', 'inspeksi', 'temuan', 'material', 'kondisi site']

const CAT_LABEL: Record<string, string> = {
  progres: 'Progres',
  inspeksi: 'Inspeksi',
  temuan: 'Temuan',
  material: 'Material',
  'kondisi site': 'Kondisi site',
}

export function Gallery() {
  const { projectId } = useField()
  const photos = F_PHOTOS
  const project = fProject(projectId)
  const sheet = useSheet()
  const [cat, setCat] = useState<(typeof CATS)[number]>('Semua')

  const list = photos
    .filter((p) => p.projectId === projectId)
    .filter((p) => cat === 'Semua' || p.cat === cat)
    .sort((a, b) => b.at.localeCompare(a.at))

  const open = (id: string) => {
    const p = photos.find((x) => x.id === id)
    if (!p) return
    sheet.open({
      title: CAT_LABEL[p.cat] ?? p.cat,
      children: (
        <div className="space-y-3">
          <div className={cn('flex aspect-video items-center justify-center rounded-xl border border-line-subtle bg-gradient-to-br text-gray-400', p.gradient)}>
            <Images {...iconProps(28)} />
          </div>
          <p className="text-md font-semibold text-ink">{p.title}</p>
          <p className="text-sm text-ink-secondary">{p.location} · {formatRelative(p.at)}</p>
          {p.link && (
            <Link
              to={p.link.to}
              onClick={sheet.close}
              className="flex items-center justify-between rounded-lg border border-line-subtle bg-sunken p-3 text-sm font-semibold text-brand-700"
            >
              Lihat catatan terkait: {p.link.label}
              <ChevronRight {...iconProps(14)} />
            </Link>
          )}
        </div>
      ),
    })
  }

  return (
    <Screen topBar={<TopBar large title="Galeri" subtitle={`${project.name} · ${list.length} foto bukti`} />} className="px-4 pt-4 pb-6">
      <div className="space-y-4">
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
                {c === 'Semua' ? 'Semua' : CAT_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0
          ? <EmptyState icon={Images} title="Belum ada foto" description="Foto dari progres dan inspeksi akan terkumpul di sini." />
          : (
            <section className="space-y-2">
              <SectionTitle>Terbaru</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                {list.map((p) => <PhotoTile key={p.id} photo={p} onClick={() => open(p.id)} />)}
              </div>
            </section>
          )}
      </div>
    </Screen>
  )
}
