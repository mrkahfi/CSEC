import { forwardRef, type HTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { Icon, iconProps } from '@/components/Icon'
import { TONE_STYLES, type StatusDef } from '@/components/status'

const statusBadgeVariants = cva(
  [
    'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border font-medium',
    'transition-colors duration-100',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-6.5 px-2 text-sm',
        md: 'h-7.5 px-2.5 text-sm',
      },
      emphasis: {
        /* Default: tint latar — banyak status dalam satu tabel tetap tenang */
        subtle: '',
        /* Untuk pengecualian kritis: hold point, terblokir */
        strong: 'shadow-xs',
      },
    },
    defaultVariants: { size: 'md', emphasis: 'subtle' },
  },
)

const STRONG_BG: Record<string, string> = {
  warning: 'bg-amber-100 text-amber-900 border-amber-300',
  danger: 'bg-red-100 text-red-900 border-red-300',
  success: 'bg-green-100 text-green-900 border-green-300',
  info: 'bg-sky-100 text-sky-900 border-sky-300',
  active: 'bg-violet-100 text-violet-900 border-violet-300',
  brand: 'bg-brand-100 text-brand-900 border-brand-300',
  neutral: 'bg-gray-100 text-gray-800 border-gray-300',
}

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Definisi status dari katalog (status.ts). */
  status: StatusDef
  size?: 'sm' | 'md'
  emphasis?: 'subtle' | 'strong'
  /** Sembunyikan ikon — hindari; ikon adalah isyarat non-warna. */
  hideIcon?: boolean
}

/**
 * Badge status domain: label + ikon + tone, dari katalog tunggal
 * sehingga kosakata konsisten di dashboard, register, dan detail.
 */
export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(function StatusBadge(
  { status, size = 'md', emphasis = 'subtle', hideIcon, className, ...props },
  ref,
) {
  const strong = emphasis === 'strong'
  const t = TONE_STYLES[status.tone]
  return (
    <span
      ref={ref}
      title={status.description}
      className={cn(
        statusBadgeVariants({ size, emphasis }),
        strong ? STRONG_BG[status.tone] : t.badge,
        className,
      )}
      {...props}
    >
      {!hideIcon && (
        <Icon
          as={status.icon}
          {...iconProps(size === 'sm' ? 14 : 15)}
          strokeWidth={2}
          className={strong ? 'shrink-0' : cn('shrink-0', t.icon)}
        />
      )}
      {status.label}
    </span>
  )
})
