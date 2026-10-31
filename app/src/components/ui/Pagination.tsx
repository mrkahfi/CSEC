import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/ui/IconButton'

export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
  /** Label satuan data, mis. "permintaan". */
  itemLabel?: string
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
  itemLabel = 'item',
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav aria-label="Navigasi halaman" className={cn('flex items-center justify-between gap-4 px-1', className)}>
      <p className="tnum text-sm text-ink-muted">
        Menampilkan <span className="font-medium text-ink">{from}–{to}</span> dari{' '}
        <span className="font-medium text-ink">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <IconButton
          label="Halaman sebelumnya"
          icon={ChevronLeft}
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />
        <span className="tnum px-1 text-sm text-ink-secondary">
          {page} / {pageCount}
        </span>
        <IconButton
          label="Halaman berikutnya"
          icon={ChevronRight}
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  )
}
