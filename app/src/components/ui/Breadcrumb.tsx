import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex items-center gap-1 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex min-w-0 items-center gap-1">
              {last || !item.to ? (
                <span aria-current={last ? 'page' : undefined} className="truncate font-medium text-ink">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="truncate text-ink-muted transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              )}
              {!last && (
                <ChevronRight {...iconProps(13)} className="shrink-0 text-gray-400" aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
