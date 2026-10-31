import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/Breadcrumb'

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  title: ReactNode
  description?: ReactNode
  /** Chip referensi (mis. ID permintaan, badge demo). */
  meta?: ReactNode
  actions?: ReactNode
  /** Baris tab/segmented di bawah judul. */
  children?: ReactNode
  className?: string
}

/** Header halaman standar: breadcrumb → judul + meta → aksi → tab. */
export function PageHeader({
  breadcrumbs,
  title,
  description,
  meta,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('border-b border-line-subtle bg-surface', className)}>
      {/* Kontainer sama dengan PageBody agar judul selaras dengan konten di bawahnya */}
      <div className={cn('mx-auto w-full max-w-page px-6 pt-4 lg:px-8', !children && 'pb-4')}>
        {breadcrumbs && <div className="mb-2"><Breadcrumb items={breadcrumbs} /></div>}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
              {meta}
            </div>
            {description && <p className="mt-1.5 max-w-3xl text-md text-ink-secondary">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2 pb-1">{actions}</div>}
        </div>
        {children && <div className="mt-3 pb-0.5">{children}</div>}
      </div>
    </header>
  )
}
