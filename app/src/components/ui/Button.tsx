import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'

const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap',
    'rounded-md font-medium transition-[background-color,border-color,box-shadow,opacity] duration-100',
    'disabled:pointer-events-none disabled:opacity-45',
    '[&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        /* Aksi utama halaman — maksimal satu per konteks */
        primary:
          'bg-brand-600 text-white shadow-xs hover:bg-brand-700 active:bg-brand-800',
        /* Aksi sekunder standar */
        secondary:
          'border border-line bg-surface text-ink-secondary shadow-xs hover:bg-hover hover:text-ink active:bg-sunken',
        /* Tonal — aksi tersier yang tetap terlihat */
        subtle:
          'bg-tone-brand-bg text-tone-brand-text hover:bg-brand-100 active:bg-brand-200/70',
        ghost:
          'text-ink-secondary hover:bg-hover hover:text-ink active:bg-sunken',
        /* Aksi merusak / penolakan */
        danger:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 active:bg-red-800',
        'danger-subtle':
          'bg-tone-danger-bg text-tone-danger-text hover:bg-red-100 active:bg-red-200/70',
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded-sm gap-1',
        sm: 'h-8 px-2.5 text-sm',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-md',
        'icon-sm': 'h-8 w-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Tampilkan spinner dan nonaktifkan sementara. */
  loading?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
}

const ICON_SIZE = { xs: 14, sm: 16, md: 18, lg: 18, 'icon-sm': 16, icon: 18 } as const

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size = 'md', loading, leftIcon: Left, rightIcon: Right, children, disabled, ...props },
  ref,
) {
  const iconSize = ICON_SIZE[size ?? 'md']
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <LoaderCircle {...iconProps(iconSize)} className="animate-spin" />
      ) : (
        Left && <Left {...iconProps(iconSize)} />
      )}
      {children}
      {!loading && Right && <Right {...iconProps(iconSize)} />}
    </button>
  )
})
