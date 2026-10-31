import { cn } from '@/lib/cn'

export interface TabItem {
  id: string
  label: string
  count?: number
}

export interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  label?: string
  className?: string
}

/** Tab garis bawah — navigasi dalam halaman. */
export function Tabs({ items, value, onChange, label = 'Navigasi tab', className }: TabsProps) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex items-center gap-0.5 border-b border-line-subtle', className)}>
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative inline-flex items-center gap-1.5 px-3 pt-2 pb-2.5 text-sm font-medium',
              'transition-colors duration-100 -mb-px cursor-pointer',
              selected ? 'text-brand-700' : 'text-ink-muted hover:text-ink',
            )}
          >
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'tnum rounded-full px-1.5 text-2xs leading-4.5 tabular-nums',
                  selected ? 'bg-brand-50 text-brand-700' : 'bg-sunken text-ink-muted',
                )}
              >
                {item.count}
              </span>
            )}
            {selected && (
              <span aria-hidden className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-600" />
            )}
          </button>
        )
      })}
    </div>
  )
}
