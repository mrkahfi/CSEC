import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, iconProps, type LucideIcon } from '@/components/Icon'
import { TONE_STYLES, type StatusTone } from '@/components/status'

export interface TimelineItem {
  id: string
  icon: LucideIcon
  tone?: StatusTone
  /** Judul peristiwa, mis. "Keputusan direkam: Perlu Perbaikan". */
  title: ReactNode
  /** Aktor + peran + waktu, mis. "Sari Wulandari · QA/QC · 12 Okt 2026 14:05". */
  meta: ReactNode
  /** Komentar/alasan tercatat. */
  note?: ReactNode
  /** Detail tambahan (nilai lama → baru, referensi, dsb.). */
  detail?: ReactNode
}

/**
 * Riwayat kejadian kronologis (PRD §9.9): aktor, waktu, aksi,
 * alasan — jejak audit yang terbaca, bukan catatan tersembunyi.
 */
export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn('relative flex flex-col', className)}>
      {items.map((item, i) => {
        const t = TONE_STYLES[item.tone ?? 'neutral']
        const last = i === items.length - 1
        return (
          <li key={item.id} className="relative flex gap-3.5 pb-5 last:pb-0">
            {/* Garis penghubung */}
            {!last && (
              <span aria-hidden className="absolute top-9 bottom-0 left-[15px] w-px bg-line-subtle" />
            )}
            <span
              className={cn(
                'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-surface',
                item.tone === 'neutral' ? 'border-line-subtle' : 'border-transparent',
                item.tone && item.tone !== 'neutral' && t.badge,
              )}
            >
              <Icon
                as={item.icon}
                {...iconProps(15)}
                strokeWidth={1.9}
                className={item.tone && item.tone !== 'neutral' ? t.icon : 'text-ink-muted'}
              />
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="text-sm font-semibold text-ink">{item.title}</div>
                <div className="shrink-0 text-xs text-ink-muted">{item.meta}</div>
              </div>
              {item.note && (
                <div className="mt-1.5 flex items-start gap-1.5 rounded-lg border border-line-subtle bg-sunken/40 px-2.5 py-1.5 text-xs text-ink-secondary">
                  <span className="font-semibold text-ink-muted text-[10px] uppercase tracking-wider shrink-0 mt-0.5">Catatan:</span>
                  <span className="flex-1">{item.note}</span>
                </div>
              )}
              {item.detail && <div className="mt-1 text-xs text-ink-muted">{item.detail}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
