import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
  count?: number
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}

/** Kontrol pilihan tunggal sekilas — untuk pindah view/filter cepat. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-line-subtle bg-sunken p-1',
        className,
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-100',
              size === 'sm' ? 'h-8 px-2.5 text-sm' : 'h-9 px-3 text-sm',
              selected
                ? 'bg-surface text-ink shadow-xs'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            {opt.icon && <opt.icon {...iconProps(size === 'sm' ? 14 : 15)} />}
            {opt.label}
            {opt.count !== undefined && (
              <span
                className={cn(
                  'tnum rounded-full px-1.5 text-xs tabular-nums',
                  selected ? 'bg-sunken text-ink-secondary' : 'bg-gray-200/70 text-ink-muted',
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
