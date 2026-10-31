import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui/Input'
import { Kbd } from '@/components/ui/Kbd'
import { iconProps } from '@/components/Icon'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Tampilkan petunjuk ⌘K di kanan (untuk search global). */
  shortcutHint?: boolean
  onClear?: () => void
  trailing?: ReactNode
}

/** Input pencarian: ikon, tombol bersihkan, hint keyboard. */
export function SearchInput({
  className,
  shortcutHint,
  onClear,
  trailing,
  value,
  defaultValue,
  onChange,
  ...props
}: SearchInputProps) {
  const [internal, setInternal] = useState(String(defaultValue ?? ''))
  const val = value !== undefined ? String(value) : internal
  const hasValue = val.length > 0

  return (
    <div className={cn('relative', className)}>
      <Input
        type="search"
        role="searchbox"
        leftIcon={Search}
        value={val}
        onChange={(e) => {
          setInternal(e.target.value)
          onChange?.(e as never)
        }}
        className={cn(shortcutHint && hasValue === false && 'pr-14', trailing && 'pr-16')}
        {...props}
      />
      <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center gap-1.5">
        {hasValue ? (
          <button
            type="button"
            aria-label="Bersihkan pencarian"
            className="pointer-events-auto flex h-5 w-5 items-center justify-center rounded-sm text-ink-muted hover:bg-hover hover:text-ink"
            onClick={() => {
              setInternal('')
              onClear?.()
            }}
          >
            <X {...iconProps(13)} strokeWidth={2.2} />
          </button>
        ) : shortcutHint ? (
          <span className="pointer-events-none">
            <Kbd>⌘K</Kbd>
          </span>
        ) : null}
      </span>
    </div>
  )
}
