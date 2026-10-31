import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon, iconProps, type LucideIcon } from '@/components/Icon'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Wajib — tombol ikon tidak punya teks, label aksesibilitas mutlak. */
  label: string
  icon: LucideIcon
  size?: 'sm' | 'md'
  variant?: 'ghost' | 'secondary'
}

const SIZES = { sm: 'h-7 w-7', md: 'h-8 w-8' } as const
const ICON_SIZES = { sm: 15, md: 16 } as const

/**
 * Tombol ikon — selalu dengan `aria-label` dan tooltip `title`.
 * Ikon mengikuti currentColor: tidak ada ikon berwarna di sini.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = 'md', variant = 'ghost', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md text-ink-muted',
        'transition-colors duration-100 hover:text-ink',
        'disabled:pointer-events-none disabled:opacity-45',
        variant === 'ghost' && 'hover:bg-hover',
        variant === 'secondary' && 'border border-line bg-surface shadow-xs hover:bg-hover',
        SIZES[size],
        className,
      )}
      {...props}
    >
      <Icon as={icon} {...iconProps(ICON_SIZES[size])} />
    </button>
  )
})
