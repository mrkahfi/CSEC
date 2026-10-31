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
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-md font-medium text-ink">{item.title}</p>
                <time className="tnum shrink-0 font-mono text-xs text-ink-muted">{item.meta}</time>
              </div>
              {item.note && (
                <p className="mt-1.5 rounded-md border border-line-subtle bg-gray-25 px-3 py-2 text-sm text-ink-secondary italic">
                  “{item.note}”
                </p>
              )}
              {item.detail && <div className="mt-1 text-sm text-ink-muted">{item.detail}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
