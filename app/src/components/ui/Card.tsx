import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Padding penuh untuk konten sederhana tanpa header. */
  padded?: boolean
}

export function Card({ className, padded, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-line-subtle bg-surface shadow-xs',
        padded && 'p-5',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  title,
  description,
  actions,
  icon: HeaderIcon,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-4 pb-3', className)}>
      <div className="flex min-w-0 items-start gap-2.5">
        {HeaderIcon && (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sunken text-ink-secondary">
            <HeaderIcon className="h-4.5 w-4.5" strokeWidth={1.8} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-ink">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
    </div>
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-between gap-3 border-t border-line-subtle px-5 py-3.5', className)}
      {...props}
    />
  )
}
