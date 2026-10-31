import { cn } from '@/lib/cn'

/** Warana latar avatar — di-hash dari nama agar stabil. */
const PALETTE = [
  'bg-brand-100 text-brand-800',
  'bg-green-100 text-green-800',
  'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-900',
  'bg-sky-100 text-sky-900',
  'bg-red-100 text-red-800',
  'bg-gray-200 text-gray-700',
]

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

function hashOf(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  /** Tampilkan cincin fokus saat elemen interaktif. */
  title?: string
}

const SIZES = {
  xs: 'h-5 w-5 text-2xs',
  sm: 'h-6.5 w-6.5 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-md',
} as const

export function Avatar({ name, size = 'md', className, title }: AvatarProps) {
  return (
    <span
      title={title ?? name}
      aria-hidden
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold',
        PALETTE[hashOf(name) % PALETTE.length],
        SIZES[size],
        className,
      )}
    >
      {initialsOf(name)}
    </span>
  )
}
