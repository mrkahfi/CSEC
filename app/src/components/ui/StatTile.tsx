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
  success: 'text-green-700',
} as const

/** Petak metrik portofolio — angka + definisi, bukan grafik dekoratif. */
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
      <div className="flex items-center justify-between gap-2">
        <span className="text-2xs font-semibold tracking-wider text-ink-muted uppercase">
          {label}
        </span>
        {IconCmp && (
          <span className="text-ink-disabled">
            <Icon as={IconCmp} {...iconProps(16)} />
          </span>
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={cn('tnum text-2xl font-semibold tracking-tight', VALUE_EMPHASIS[emphasis])}>
          {value}
        </span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-medium',
              delta.neutral
                ? 'text-ink-muted'
                : delta.direction === 'up'
                  ? 'text-red-600'
                  : 'text-green-700',
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
      {footnote && <p className="mt-1 text-xs text-ink-muted">{footnote}</p>}
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
