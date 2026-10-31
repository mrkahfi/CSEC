import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'bottom'
  className?: string
}

/** Tooltip CSS murni — muncul saat hover/focus pemicu. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-pre rounded-md bg-inverted px-2 py-1',
          'text-xs font-medium text-ink-inverted shadow-md',
          'scale-97 opacity-0 transition-[opacity,transform] duration-100',
          'group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100',
          'group-focus-within/tooltip:scale-100 group-focus-within/tooltip:opacity-100',
          side === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
        )}
      >
        {content}
      </span>
    </span>
  )
}
