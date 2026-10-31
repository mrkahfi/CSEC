import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { CircleCheck, Info, OctagonAlert, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/ui/IconButton'
import { iconProps, type LucideIcon } from '@/components/Icon'
import type { StatusTone } from '@/components/status'

interface ToastOptions {
  title: string
  description?: string
  tone?: StatusTone
}

interface ToastItem extends ToastOptions {
  id: number
}

const ToastContext = createContext<(t: ToastOptions) => void>(() => {})

export function useToast() {
  return useContext(ToastContext)
}

const TONE_ICON: Record<string, { icon: LucideIcon; cls: string }> = {
  success: { icon: CircleCheck, cls: 'text-green-600' },
  warning: { icon: TriangleAlert, cls: 'text-amber-600' },
  danger: { icon: OctagonAlert, cls: 'text-red-600' },
  info: { icon: Info, cls: 'text-sky-600' },
  neutral: { icon: Info, cls: 'text-gray-500' },
  brand: { icon: Info, cls: 'text-brand-600' },
  active: { icon: Info, cls: 'text-violet-600' },
}

/**
 * Toast notifikasi demo. Semua notifikasi dalam demo ini adalah
 * simulasi — bukan pengiriman nyata (PRD FR-NO-04).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const seq = useRef(0)

  const push = useCallback((t: ToastOptions) => {
    const id = ++seq.current
    setToasts((list) => [...list.slice(-3), { id, tone: 'neutral', ...t }])
    window.setTimeout(() => {
      setToasts((list) => list.filter((x) => x.id !== id))
    }, 5000)
  }, [])

  const value = useMemo(() => push, [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-88 max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {toasts.map((t) => {
          const { icon: ToneIcon, cls } = TONE_ICON[t.tone ?? 'neutral']
          return (
            <div
              key={t.id}
              role="status"
              className="slide-up-in pointer-events-auto flex items-start gap-2.5 rounded-lg border border-line-subtle bg-surface p-3 shadow-lg"
            >
              <ToneIcon {...iconProps(18)} className={cn('mt-0.5 shrink-0', cls)} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{t.title}</p>
                {t.description && <p className="mt-0.5 text-sm text-ink-muted">{t.description}</p>}
              </div>
              <IconButton
                label="Tutup notifikasi"
                icon={X}
                size="sm"
                className="-mt-0.5 -mr-1"
                onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
              />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
