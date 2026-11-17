import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Icon, iconProps, type LucideIcon } from '@/components/Icon'

export interface StatTileProps {
  /** Label metrik dengan definisi jelas (PRD §12). */
  label: string
  value: ReactNode
  icon?: LucideIcon
  /** Perubahan dibanding periode sebelumnya; `direction` murni presentasi. */
  delta?: { value: string; direction: 'up' | 'down'; neutral?: boolean }
  /** Anotasi definisi/metode, mis. "kalender, bukan jam kerja". */
  footnote?: ReactNode
  /** Klik → register terfilter dengan logika hitung yang sama (FR-OV-03). */
  onClick?: () => void
  /** Tone penekanan untuk angka penting (mis. overdue). */
  emphasis?: 'neutral' | 'warning' | 'danger' | 'success'
  className?: string
}

const VALUE_EMPHASIS = {
  neutral: 'text-ink',
  warning: 'text-amber-700',
  danger: 'text-red-700',
  success: 'text-emerald-700',
} as const

const ICON_TONES = {
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200/70',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200/80',
  danger: 'bg-red-50 text-red-700 border border-red-200/80',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
} as const

/** Petak metrik portofolio — angka + definisi dengan isyarat visual non-text. */
export function StatTile({
  label,
  value,
  icon: IconCmp,
  delta,
  footnote,
  onClick,
  emphasis = 'neutral',
  className,
}: StatTileProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold tracking-wider text-ink-muted uppercase leading-tight line-clamp-2">
          {label}
        </span>
        {IconCmp && (
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-2xs', ICON_TONES[emphasis])}>
            <Icon as={IconCmp} {...iconProps(16)} strokeWidth={2} />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={cn('tnum font-mono text-2xl font-bold tracking-tight', VALUE_EMPHASIS[emphasis])}>
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold',
              delta.neutral
                ? 'text-ink-muted'
                : delta.direction === 'up'
                  ? 'text-red-600'
                  : 'text-emerald-700',
            )}
          >
            {delta.direction === 'up' ? (
              <ArrowUpRight {...iconProps(13)} strokeWidth={2.2} />
            ) : (
              <ArrowDownRight {...iconProps(13)} strokeWidth={2.2} />
            )}
            {delta.value}
          </span>
        )}
      </div>
      {footnote && <p className="mt-1 text-2xs text-ink-muted">{footnote}</p>}
    </>
  )

  const cls = cn(
    'rounded-lg border border-line-subtle bg-surface p-4 text-left shadow-xs transition-[border-color,box-shadow] duration-100',
    onClick &&
      'cursor-pointer hover:border-line-strong hover:shadow-sm focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15',
    className,
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {content}
      </button>
    )
  }
  return <div className={cls}>{content}</div>
}
