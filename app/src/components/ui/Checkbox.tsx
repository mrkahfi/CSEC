import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  description?: ReactNode
  invalid?: boolean
}

/** Checkbox dengan label — kontrol native, tergaya penuh. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, invalid, className, id: idProp, disabled, ...props },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <span className="relative mt-0.5 inline-flex h-4 w-4 shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            'peer h-4 w-4 cursor-pointer appearance-none rounded-[5px] border bg-surface',
            'transition-colors duration-100 checked:border-brand-600 checked:bg-brand-600',
            'hover:border-line-strong checked:hover:border-brand-700',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
            'indeterminate:border-brand-600 indeterminate:bg-brand-600',
            'disabled:cursor-not-allowed disabled:border-line-subtle disabled:bg-sunken disabled:checked:bg-gray-300 disabled:checked:border-gray-300',
            invalid ? 'border-red-400' : 'border-line-strong',
          )}
          {...props}
        />
        <Check
          aria-hidden
          {...iconProps(12)}
          strokeWidth={2.6}
          className="pointer-events-none absolute inset-0 m-auto scale-75 text-white opacity-0 transition-transform duration-100 peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      {(label || description) && (
        <label htmlFor={id} className={cn('select-none', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
          {label && <span className="block text-sm leading-5 font-medium text-ink">{label}</span>}
          {description && <span className="block text-xs leading-4 text-ink-muted">{description}</span>}
        </label>
      )}
    </div>
  )
})

/* ---------- Switch ---------- */

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  description?: ReactNode
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, className, id: idProp, disabled, ...props },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      {/* Input peer + track & knob sebagai sibling — state murni CSS */}
      <span className="relative mt-0.5 inline-flex h-[18px] w-8 shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          aria-hidden
          className={cn(
            'block h-[18px] w-8 rounded-full bg-gray-300 transition-colors duration-150',
            'peer-checked:bg-brand-600 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500',
            !disabled && 'cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-xs transition-transform duration-150 peer-checked:translate-x-[14px]"
        />
      </span>
      {(label || description) && (
        <label htmlFor={id} className={cn('select-none', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
          {label && <span className="block text-sm leading-5 font-medium text-ink">{label}</span>}
          {description && <span className="block text-xs leading-4 text-ink-muted">{description}</span>}
        </label>
      )}
    </div>
  )
})
