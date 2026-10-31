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
      <span
        className={cn(
          'flex items-center justify-center rounded-xl border border-line-subtle bg-sunken text-ink-muted',
          size === 'md' ? 'h-12 w-12' : 'h-9 w-9',
        )}
      >
        <Icon as={icon} {...iconProps(size === 'md' ? 24 : 18)} />
      </span>
      <div className="max-w-sm">
        <p className={cn('font-semibold text-ink', size === 'md' ? 'text-md' : 'text-sm')}>
          {title}
        </p>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {actions && <div className="mt-1 flex items-center gap-2">{actions}</div>}
    </div>
  )
}
