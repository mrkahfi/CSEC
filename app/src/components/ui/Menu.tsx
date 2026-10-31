import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { iconProps, type LucideIcon } from '@/components/Icon'

export interface MenuItemDef {
  id: string
  label: string
  icon?: LucideIcon
  onSelect?: () => void
  destructive?: boolean
  disabled?: boolean
  hint?: ReactNode
}

export function MenuDivider() {
  return <div role="separator" className="my-1 h-px bg-line-subtle" />
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 pt-2 pb-1 text-2xs font-semibold tracking-wider text-ink-muted uppercase">
      {children}
    </div>
  )
}

export interface MenuProps {
  /** Elemen pemicu (button). */
  trigger: (props: { open: boolean; toggle: () => void; id: string }) => ReactNode
  items: (MenuItemDef | 'divider' | { label: string; items: MenuItemDef[] })[]
  align?: 'start' | 'end'
  className?: string
}

/** Menu konteks sederhana: klik-luar menutup, Escape menutup, panah memilih. */
export function Menu({ trigger, items, align = 'start', className }: MenuProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const flatItems = items.flatMap((it) => {
    if (it === 'divider') return []
    if ('items' in it) return it.items
    return [it]
  })

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => {
          const n = flatItems.length
          return e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n
        })
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        const item = flatItems[activeIndex]
        if (item && !item.disabled) {
          item.onSelect?.()
          setOpen(false)
        }
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, activeIndex, flatItems])

  let flatCursor = -1

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      {trigger({ open, toggle: () => setOpen((o) => !o), id: listId })}
      {open && (
        <div
          role="menu"
          aria-activedescendant={activeIndex >= 0 ? `mi-${activeIndex}` : undefined}
          className={cn(
            'absolute z-40 mt-1.5 min-w-52 rounded-lg border border-line-subtle bg-surface p-1 shadow-lg',
            'pop-in origin-top',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((it, i) => {
            if (it === 'divider') return <MenuDivider key={i} />
            if ('items' in it) {
              return (
                <div key={i}>
                  <MenuLabel>{it.label}</MenuLabel>
                  {it.items.map((item) => renderItem(item))}
                </div>
              )
            }
            return renderItem(it)
          })}
        </div>
      )}
    </div>
  )

  function renderItem(item: MenuItemDef) {
    flatCursor += 1
    const idx = flatCursor
    return (
      <button
        key={item.id}
        id={`mi-${idx}`}
        role="menuitem"
        type="button"
        disabled={item.disabled}
        onMouseEnter={() => setActiveIndex(idx)}
        onClick={() => {
          item.onSelect?.()
          setOpen(false)
        }}
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-75',
          item.disabled && 'cursor-not-allowed opacity-45',
          !item.disabled && (item.destructive
            ? 'text-red-700 hover:bg-red-50'
            : 'text-ink-secondary hover:bg-hover hover:text-ink'),
          activeIndex === idx && !item.disabled && (item.destructive ? 'bg-red-50' : 'bg-hover'),
        )}
      >
        {item.icon && <item.icon {...iconProps(16)} className="shrink-0 opacity-80" />}
        <span className="flex-1">{item.label}</span>
        {item.hint}
      </button>
    )
  }
}
