import {
  createContext, useCallback, useContext, useMemo, useState,
  type CSSProperties, type ReactNode,
} from 'react'
import {
  Camera, ChevronLeft, CircleSlash, FileQuestion, ImageIcon,
  TriangleAlert, X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Icon, iconProps } from '@/components/Icon'
import { IconButton } from '@/components/ui/IconButton'
import type { FEvidence, FPhoto } from '@/field/data'

/* ============================================================
 * PRIMITIF UI MOBILE — Field Operations App
 * ------------------------------------------------------------
 * Mewarisi design token dashboard (tokens.css): warna semantik,
 * tipografi, radius, shadow. Ukuran disetel untuk layar 390 px:
 * target sentuh ≥ 44 px, satu tugas utama per layar.
 * ============================================================ */

/* ---------- Kerangka layar: TopBar tetap, konten menggulir ---------- */

export function Screen({
  topBar, sticky, children, className,
}: {
  topBar?: ReactNode
  /** Bilah aksi di bawah (form panjang / wizard). */
  sticky?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      {topBar}
      <div className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain', className)}>
        {children}
      </div>
      {sticky}
    </div>
  )
}

export function TopBar({
  title, subtitle, onBack, right, large,
}: {
  title: ReactNode
  subtitle?: ReactNode
  onBack?: string
  right?: ReactNode
  /** Judul besar untuk layar akar tab. */
  large?: boolean
}) {
  return (
    <header className="shrink-0 border-b border-line-subtle bg-surface/95 backdrop-blur">
      <div className="flex min-h-13 items-center gap-1 px-2 py-2">
        {onBack && <BackButton to={onBack} />}
        <div className="min-w-0 flex-1 px-1">
          <h1 className={cn('truncate font-semibold tracking-tight text-ink', large ? 'text-xl' : 'text-md')}>{title}</h1>
          {subtitle && <p className="mt-0.5 truncate text-xs text-ink-muted">{subtitle}</p>}
        </div>
        {right && <div className="flex shrink-0 items-center gap-1.5 pr-1">{right}</div>}
      </div>
    </header>
  )
}

export function BackButton({ to, label = 'Kembali' }: { to: string; label?: string }) {
  return (
    <IconButton
      label={label}
      icon={ChevronLeft}
      size="md"
      className="-ml-1"
      onClick={() => { window.location.hash = `#${to}` }}
    />
  )
}

/* ---------- Kartu, seksi, baris ---------- */

export function MCard({
  children, className, onClick, as,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  as?: 'div' | 'button'
}) {
  const cls = cn(
    'rounded-xl border border-line-subtle bg-surface shadow-xs',
    onClick && 'w-full cursor-pointer text-left transition-colors active:bg-hover',
    className,
  )
  if (as === 'button' || onClick) {
    return <button type="button" onClick={onClick} className={cls}>{children}</button>
  }
  return <div className={cls}>{children}</div>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 px-0.5">
      <h2 className="text-2xs font-semibold tracking-wider text-ink-muted uppercase">{children}</h2>
      {action}
    </div>
  )
}

/** Baris label-nilai ringkas untuk layar detail. */
export function KV({ label, children, className }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-1.5', className)}>
      <span className="shrink-0 text-sm text-ink-muted">{label}</span>
      <span className="min-w-0 text-right text-sm font-medium text-ink">{children}</span>
    </div>
  )
}

/* ---------- Kontrol: chip filter, segmented, stepper ---------- */

export function Chip({
  active, onClick, children,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border px-3 text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-line bg-surface text-ink-secondary hover:bg-hover',
      )}
    >
      {children}
    </button>
  )
}

export function Segmented<T extends string>({
  options, value, onChange, className,
}: {
  options: { value: T; label: string }[]
  value: T | undefined
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex gap-1 rounded-lg border border-line-subtle bg-sunken p-1', className)} role="radiogroup">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'h-8 flex-1 cursor-pointer rounded-md text-sm font-medium whitespace-nowrap transition-colors',
            value === o.value ? 'bg-surface text-ink shadow-xs' : 'text-ink-muted hover:text-ink',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- Indikator langkah wizard ---------- */

export function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-1.5 px-4 pt-1 pb-3">
      {steps.map((s, i) => (
        <div key={s} className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            aria-hidden
            className={cn(
              'h-1 rounded-full transition-colors',
              i < current ? 'bg-brand-600' : i === current ? 'bg-brand-500' : 'bg-gray-200',
            )}
          />
          <span className={cn('truncate text-2xs', i === current ? 'font-semibold text-ink' : 'text-ink-disabled')}>
            {s}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------- Bilah aksi melekat di bawah ---------- */

export function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-line-subtle bg-surface/95 p-3 backdrop-blur">
      {children}
    </div>
  )
}

/* ---------- Bar progres mini ---------- */

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-sunken', className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn('h-full rounded-full', value >= 100 ? 'bg-green-500' : 'bg-brand-500')}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` } as CSSProperties}
      />
    </div>
  )
}

/* ============================================================
 * BOTTOM SHEET — konteks agar layar mana pun bisa membukanya
 * ============================================================ */

interface SheetState {
  open: (content: { title: string; children: ReactNode }) => void
  close: () => void
}

const SheetContext = createContext<SheetState>({ open: () => {}, close: () => {} })

export function useSheet() {
  return useContext(SheetContext)
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<{ title: string; children: ReactNode } | null>(null)
  const [visible, setVisible] = useState(false)

  const open = useCallback((c: { title: string; children: ReactNode }) => {
    setContent(c)
    requestAnimationFrame(() => setVisible(true))
  }, [])
  const close = useCallback(() => {
    setVisible(false)
    window.setTimeout(() => setContent(null), 200)
  }, [])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <SheetContext.Provider value={value}>
      {children}
      {content && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <button
            type="button"
            aria-label="Tutup"
            onClick={close}
            className={cn(
              'absolute inset-0 cursor-default bg-gray-950/45 transition-opacity duration-200',
              visible ? 'opacity-100' : 'opacity-0',
            )}
          />
          <div
            className={cn(
              'relative flex max-h-[85%] flex-col rounded-t-2xl bg-surface shadow-xl transition-transform duration-200 ease-out',
              visible ? 'translate-y-0' : 'translate-y-full',
            )}
          >
            <div className="flex shrink-0 items-center gap-2 border-b border-line-subtle px-4 py-3">
              <span aria-hidden className="absolute top-1.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-gray-300" />
              <h3 className="min-w-0 flex-1 truncate text-md font-semibold text-ink">{content.title}</h3>
              <IconButton label="Tutup" icon={X} size="sm" onClick={close} />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">{content.children}</div>
          </div>
        </div>
      )}
    </SheetContext.Provider>
  )
}

/* ============================================================
 * FOTO & BUKTI — tile placeholder bergradasi (PRD §11.1)
 * ============================================================ */

const STATE_LABEL = {
  ok: null,
  pending: 'Mengunggah (simulasi)',
  failed: 'Gagal unggah · ketuk untuk coba lagi',
  unavailable: 'Lampiran tidak tersedia',
} as const

export function PhotoTile({
  photo, onClick, className,
}: {
  photo: Pick<FPhoto, 'title' | 'state' | 'gradient' | 'cat' | 'phase'>
  onClick?: () => void
  className?: string
}) {
  const state = photo.state ?? 'ok'
  const overlay = STATE_LABEL[state]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex aspect-square w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-line-subtle p-2 text-left',
        photo.gradient,
        state === 'failed' && 'border-red-200',
        state === 'unavailable' && 'border-dashed',
        className,
      )}
    >
      {state === 'ok' ? (
        <span className="text-gray-400">
          {photo.phase === 'before' || photo.phase === 'after'
            ? <Camera {...iconProps(18)} />
            : <ImageIcon {...iconProps(18)} />}
        </span>
      ) : (
        <span className={cn(state === 'failed' ? 'text-red-500' : 'text-gray-400')}>
          {state === 'failed' ? <TriangleAlert {...iconProps(18)} />
            : state === 'unavailable' ? <FileQuestion {...iconProps(18)} />
              : <Camera {...iconProps(18)} className="animate-pulse" />}
        </span>
      )}
      <span className="relative">
        {photo.phase && (
          <span className="mb-1 inline-flex rounded-full bg-gray-900/75 px-1.5 py-0.5 text-2xs font-semibold text-white uppercase">
            {photo.phase === 'before' ? 'Sebelum' : 'Sesudah'}
          </span>
        )}
        <span className="block truncate-2 text-xs leading-4 font-medium text-gray-800">{photo.title}</span>
        {overlay && (
          <span className={cn('mt-0.5 block text-2xs leading-3.5', state === 'failed' ? 'font-medium text-red-700' : 'text-gray-500')}>
            {overlay}
          </span>
        )}
      </span>
    </button>
  )
}

/** Lampiran dalam detail catatan (bukan tile persegi). */
export function EvidenceChip({ ev, onClick }: { ev: FEvidence; onClick?: () => void }) {
  const state = ev.state ?? 'ok'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-24 shrink-0 cursor-pointer flex-col gap-1.5 rounded-lg border border-line-subtle bg-surface p-1.5 text-left',
        state === 'unavailable' && 'border-dashed opacity-80',
        state === 'failed' && 'border-red-200',
      )}
    >
      <span className={cn(
        'flex h-14 items-center justify-center rounded-md bg-gradient-to-br from-sky-100 to-brand-50 text-gray-400',
        state === 'unavailable' && 'from-gray-100 to-gray-50',
      )}>
        {state === 'unavailable' ? <CircleSlash {...iconProps(16)} />
          : ev.kind === 'doc' ? <FileQuestion {...iconProps(16)} />
            : <Camera {...iconProps(16)} />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-2xs leading-3.5 font-medium text-ink">{ev.title}</span>
        {state !== 'ok' && (
          <span className="mt-0.5 block text-2xs leading-3 text-amber-700">
            {state === 'pending' ? 'Mengunggah' : state === 'failed' ? 'Gagal' : 'Tidak tersedia'}
          </span>
        )}
      </span>
    </button>
  )
}

/* ---------- Ekspor ulang ikon helper ---------- */
export { Icon, iconProps }
