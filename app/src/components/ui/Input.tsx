import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'

/* ---------- Field: label + kontrol + hint/error ---------- */

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
  actions,
}: {
  label: ReactNode
  htmlFor?: string
  required?: boolean
  hint?: ReactNode
  error?: ReactNode
  children: ReactNode
  className?: string
  actions?: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-red-600">
              *
            </span>
          )}
          {required && <span className="sr-only"> (wajib)</span>}
        </label>
        {actions}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  )
}

/* ---------- Input ---------- */

export const inputStyles = cva(
  [
    'w-full rounded-md border bg-surface text-base text-ink',
    'placeholder:text-ink-disabled',
    'transition-[border-color,box-shadow] duration-100',
    'hover:border-line-strong',
    'focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15',
    'disabled:cursor-not-allowed disabled:border-line-subtle disabled:bg-sunken disabled:text-ink-disabled',
  ].join(' '),
  {
    variants: {
      invalid: {
        true: 'border-red-400 hover:border-red-500 focus:border-red-500 focus:ring-red-500/15',
        false: 'border-line',
      },
      size: {
        sm: 'h-8 px-2.5 text-sm',
        md: 'h-9 px-3',
      },
      withIcon: { true: 'pl-9', false: '' },
    },
    defaultVariants: { invalid: false, size: 'md', withIcon: false },
  },
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputStyles> {
  leftIcon?: LucideIcon
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, size, leftIcon: Left, ...props },
  ref,
) {
  return (
    <div className="relative">
      {Left && (
        <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-muted">
          <Left {...iconProps(16)} />
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(inputStyles({ invalid, size, withIcon: !!Left }), className)}
        {...props}
      />
    </div>
  )
})

/* ---------- Textarea ---------- */

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        inputStyles({ invalid }),
        'resize-y py-2 leading-relaxed',
        className,
      )}
      {...props}
    />
  )
})

/* ---------- Select (native, tergaya) ---------- */

export const Select = forwardRef<
  HTMLSelectElement,
  InputHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; wrapperClassName?: string }
>(function Select({ className, wrapperClassName, invalid, children, ...props }, ref) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          inputStyles({ invalid }),
          'cursor-pointer appearance-none pr-8',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-ink-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  )
})
