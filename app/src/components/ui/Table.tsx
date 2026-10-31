import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'

/**
 * Tabel register — padat, dapat dipindai (PRD §14.2).
 * Native <table> agar aksesibilitas semantik terjaga.
 */

export function TableContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full overflow-x-auto', className)} {...props} />
}

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  function Table({ className, ...props }, ref) {
    return (
      <table
        ref={ref}
        className={cn('w-full border-collapse text-sm', className)}
        {...props}
      />
    )
  },
)

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-gray-25', className)} {...props} />
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-line-subtle', className)} {...props} />
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  sortDirection?: 'asc' | 'desc' | false
  onSort?: () => void
  width?: string
}

export function TableHeaderCell({
  className,
  align = 'left',
  sortable,
  sortDirection = false,
  onSort,
  width,
  children,
  ...props
}: TableHeaderCellProps) {
  const content = (
    <span className={cn('inline-flex items-center gap-1', align === 'right' && 'flex-row-reverse')}>
      {children}
      {sortable && (
        <>
          {sortDirection === false ? (
            <ArrowUpDown {...iconProps(12)} className="text-gray-400" />
          ) : sortDirection === 'asc' ? (
            <ChevronUp {...iconProps(12)} strokeWidth={2.2} className="text-brand-600" />
          ) : (
            <ChevronDown {...iconProps(12)} strokeWidth={2.2} className="text-brand-600" />
          )}
        </>
      )}
    </span>
  )
  return (
    <th
      scope="col"
      aria-sort={sortDirection === false ? undefined : sortDirection === 'asc' ? 'ascending' : 'descending'}
      style={width ? { width } : undefined}
      className={cn(
        'border-b border-line px-3 py-2 text-xs font-semibold whitespace-nowrap text-ink-muted',
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className="inline-flex cursor-pointer rounded-xs transition-colors hover:text-ink"
        >
          {content}
        </button>
      ) : (
        content
      )}
    </th>
  )
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center'
}

export function TableCell({ className, align = 'left', ...props }: TableCellProps) {
  return (
    <td
      className={cn(
        'px-3 py-2.5 align-middle text-ink-secondary',
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    />
  )
}

export function TableRow({
  className,
  clickable,
  selected,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean; selected?: boolean }) {
  return (
    <tr
      className={cn(
        'transition-colors duration-75',
        clickable && 'cursor-pointer hover:bg-hover',
        selected && 'bg-selected',
        className,
      )}
      {...props}
    />
  )
}

/** Sel referensi mono — ID permintaan, revisi dokumen, chainage. */
export function MonoCell({ className, ...props }: TableCellProps) {
  return <TableCell className={cn('font-mono text-[12.5px] text-ink', className)} {...props} />
}
