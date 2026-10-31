import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, iconProps, type LucideIcon } from '@/components/Icon'
import { TONE_STYLES, type StatusTone } from '@/components/status'

const STRONG: Record<StatusTone, string> = {
  neutral: 'border-line-subtle bg-surface text-ink-secondary',
  brand: 'border-brand-200 bg-brand-50 text-brand-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
  active: 'border-violet-200 bg-violet-50 text-violet-900',
  success: 'border-green-200 bg-green-50 text-green-900',
  warning: 'border-amber-300 bg-amber-50 text-amber-950',
  danger: 'border-red-300 bg-red-50 text-red-950',
}

export interface CalloutProps {
  tone?: StatusTone
  icon: LucideIcon
  title: ReactNode
  children?: ReactNode
  actions?: ReactNode
  className?: string
}

/** Pita info/peringatan — untuk diskaimer demo & alasan pemblokiran. */
export function Callout({ tone = 'info', icon, title, children, actions, className }: CalloutProps) {
  return (
    <section
      className={cn('flex gap-3 rounded-lg border px-3.5 py-3', STRONG[tone], className)}
      aria-label={typeof title === 'string' ? title : undefined}
    >
      <span className={cn('mt-0.5 shrink-0', TONE_STYLES[tone].icon)}>
        <Icon as={icon} {...iconProps(17)} strokeWidth={1.9} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {children && <div className="mt-1 text-sm leading-relaxed opacity-90">{children}</div>}
        {actions && <div className="mt-2.5 flex items-center gap-2">{actions}</div>}
      </div>
    </section>
  )
}
