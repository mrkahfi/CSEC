import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Blok placeholder saat memuat — dengan animasi pulse halus. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('rounded-md bg-gray-200/80 [animation:pulse-soft_1.6s_ease-in-out_infinite]', className)}
      {...props}
    />
  )
}

/** Baris teks placeholder multi-baris. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/5' : 'w-full')} />
      ))}
    </div>
  )
}
