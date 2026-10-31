import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Kontainer halaman standar — lebar & padding yang sama di semua halaman,
 * selaras dengan konten PageHeader. Jangan buat max-width per halaman sendiri.
 */
export function PageBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-page px-6 py-6 lg:px-8', className)}
      {...props}
    />
  )
}
