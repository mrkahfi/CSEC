import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, iconProps, type LucideIcon } from '@/components/Icon'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: ReactNode
  actions?: ReactNode
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Kondisi kosong yang dirancang (PRD FR-OV-06 / SC-44):
 * kosong ≠ sehat. Selalu jelaskan konteks dan tawarkan
 * langkah berikutnya (mis. reset filter).
 */
export function EmptyState({ icon, title, description, actions, size = 'md', className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'md' ? 'gap-3 px-6 py-12' : 'gap-2 px-4 py-8',
        className,
      )}
    >
      <div className="relative flex items-center justify-center mb-1">
        <div
          aria-hidden
          className={cn(
            'absolute rounded-full bg-brand-500/10 blur-md pointer-events-none',
            size === 'md' ? 'h-16 w-16' : 'h-11 w-11',
          )}
        />
        <span
          className={cn(
            'relative flex items-center justify-center rounded-2xl border border-line-strong bg-surface text-brand-700 shadow-xs',
            size === 'md' ? 'h-12 w-12' : 'h-9 w-9',
          )}
        >
          <Icon as={icon} {...iconProps(size === 'md' ? 22 : 16)} strokeWidth={1.8} />
        </span>
      </div>
      <div className="max-w-sm">
        <p className={cn('font-semibold text-ink', size === 'md' ? 'text-md' : 'text-sm')}>
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {actions && <div className="mt-2 flex items-center gap-2">{actions}</div>}
    </div>
  )
}
