import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Icon, iconProps } from '@/components/Icon'
import { TONE_STYLES, type StatusTone } from '@/components/status'

const badgeVariants = cva(
  'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border font-medium',
  {
    variants: {
      size: {
        sm: 'h-5.5 px-2 text-xs',
        md: 'h-6.5 px-2.5 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  tone?: StatusTone
  /** Titik kecil di depan label. */
  dot?: boolean
  icon?: LucideIcon
  children?: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, size, tone = 'neutral', dot, icon, children, ...props },
  ref,
) {
  const t = TONE_STYLES[tone]
  return (
    <span ref={ref} className={cn(badgeVariants({ size }), t.badge, className)} {...props}>
      {dot && <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />}
      {icon && <Icon as={icon} {...iconProps(size === 'sm' ? 13 : 14)} strokeWidth={2.1} />}
      {children}
    </span>
  )
})
