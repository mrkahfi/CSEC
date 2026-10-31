import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, ClipboardList, Flag, Search, ScanSearch, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { Kbd } from '@/components/ui/Kbd'
import { FINDING_STATUS, HOLD_POINT_STATUS, INSPECTION_STATUS } from '@/components/status'
import { PROJECT_STATUS, searchIndex, type SearchEntry } from '@/demo/data'

const TYPE_META: Record<SearchEntry['type'], { icon: LucideIcon; label: string; cls: string }> = {
  proyek: { icon: Building2, label: 'Proyek', cls: 'bg-brand-50 text-brand-700' },
  inspeksi: { icon: ClipboardList, label: 'Inspeksi', cls: 'bg-sky-50 text-sky-700' },
  temuan: { icon: Flag, label: 'Temuan', cls: 'bg-amber-50 text-amber-800' },
  'titik kendali': { icon: ScanSearch, label: 'Titik kendali', cls: 'bg-violet-50 text-violet-700' },
}

/** Label status dari id — katalog apa pun yang cocok. */
function statusLabel(statusId: string): string | null {
  const catalogs = [PROJECT_STATUS, INSPECTION_STATUS, FINDING_STATUS, HOLD_POINT_STATUS] as const
  for (const c of catalogs) {
    const def = (c as Record<string, { label: string }>)[statusId]
    if (def) return def.label
  }
  return null
}

/**
 * Palet pencarian global (⌘K) — FR-SE-01/02: hasil menyebut tipe
 * entitas, proyek, status, dan lokasi. Pencarian demo data saja.
 */
export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const idx = searchIndex()
    if (!needle) return idx.filter((e) => e.type === 'inspeksi').slice(0, 5)
    return idx
      .filter((e) => [e.title, e.subtitle, e.location, e.statusId].some((s) => s.toLowerCase().includes(needle)))
      .slice(0, 10)
  }, [q])

  if (!open) return null

  const go = (e: SearchEntry) => {
    onClose()
    navigate(e.to)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Pencarian global">
      <div aria-hidden className="fixed inset-0 bg-gray-950/45" onClick={onClose} />
      <div className="relative mt-10 w-full max-w-xl overflow-hidden rounded-xl border border-line-subtle bg-surface shadow-xl outline-none">
        {/* Input */}
        <div className="flex items-center gap-2.5 border-b border-line-subtle px-4">
          <Search {...iconProps(17)} className="shrink-0 text-ink-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) go(results[0])
            }}
            placeholder="Cari proyek, WIR/RFI, temuan, titik kendali…"
            aria-label="Kueri pencarian"
            className="h-12 flex-1 bg-transparent text-md text-ink outline-none placeholder:text-ink-disabled"
          />
          <button type="button" aria-label="Tutup pencarian" onClick={onClose} className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-ink-muted hover:bg-hover hover:text-ink">
            <X {...iconProps(14)} strokeWidth={2.2} />
          </button>
        </div>

        {/* Hasil — dikelompokkan per tipe entitas */}
        <div className="max-h-96 overflow-y-auto p-2" role="listbox" aria-label="Hasil pencarian">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-muted">
              Tidak ada hasil pada data demo untuk “{q}”. Coba nomor WIR, lokasi (mis. “Lantai 8”), atau Sta.
            </p>
          ) : (
            [...new Set(results.map((r) => r.type))].map((type) => (
              <div key={type} className="mb-1 last:mb-0">
                <p className="px-2.5 pt-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-ink-muted">
                  {TYPE_META[type].label}
                </p>
                {results.filter((r) => r.type === type).map((r) => {
                  const meta = TYPE_META[r.type]
                  const sl = statusLabel(r.statusId)
                  return (
                    <button
                      key={`${r.type}-${r.id}`}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => go(r)}
                      className="group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-hover"
                    >
                      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', meta.cls)}>
                        <meta.icon {...iconProps(15)} strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{r.title}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-muted">
                          <span className="font-medium text-ink-secondary">{r.location}</span>
                          {sl && <span>· {sl}</span>}
                        </span>
                      </span>
                      <ArrowRight {...iconProps(14)} className="shrink-0 text-gray-300 transition-colors group-hover:text-brand-600" />
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Kaki: petunjuk + label demo */}
        <div className="flex items-center justify-between border-t border-line-subtle bg-sunken px-4 py-2 text-2xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> buka hasil pertama · <Kbd>esc</Kbd> tutup
          </span>
          <span>Pencarian demo · data simulasi</span>
        </div>
      </div>
    </div>
  )
}
