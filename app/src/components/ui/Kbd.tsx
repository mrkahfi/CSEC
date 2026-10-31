import { cn } from '@/lib/cn'

/** Petunjuk tombol papan ketik, mis. ⌘K. */
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-line bg-surface',
        'px-1 font-sans text-2xs font-medium text-ink-muted',
        'shadow-xs',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
