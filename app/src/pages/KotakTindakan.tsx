import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Inbox, Mail, OctagonAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { ROLE } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatRelative, formatDateTime } from '@/lib/format'
import { useDemo } from '@/demo/DemoContext'
import { useSimulatedLoading } from '@/demo/hooks'
import { ACTION_ITEMS, ACTION_KIND, projectCode } from '@/demo/data'

type ScopeId = 'saya' | 'semua'

/** Kotak tindakan per peran simulasi — FR-NO-01..04. */
export function KotakTindakan() {
  const loading = useSimulatedLoading()
  const navigate = useNavigate()
  const { role } = useDemo()
  const [scope, setScope] = useState<ScopeId>('saya')

  const items = useMemo(() => {
    const list = scope === 'saya' ? ACTION_ITEMS.filter((a) => a.visibleTo.includes(role)) : ACTION_ITEMS
    return [...list].sort((a, b) => (a.dueAt ?? '9999').localeCompare(b.dueAt ?? '9999'))
  }, [scope, role])

  const overdueCount = items.filter((a) => a.dueAt && new Date(a.dueAt).getTime() < Date.now()).length

  return (
    <>
      <PageHeader
        title="Kotak Tindakan"
        meta={<Badge tone="brand" icon={Mail}>{ROLE[role].label}</Badge>}
      />

      <PageBody className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl<ScopeId>
            label="Cakupan kotak tindakan"
            value={scope}
            onChange={setScope}
            options={[
              { value: 'saya', label: 'Peran saya', icon: Inbox, count: ACTION_ITEMS.filter((a) => a.visibleTo.includes(role)).length },
              { value: 'semua', label: 'Semua peran', count: ACTION_ITEMS.length },
            ]}
          />
          {overdueCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-800">
              <OctagonAlert {...iconProps(13)} strokeWidth={2.1} />
              {overdueCount} terlambat
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Tidak ada tindakan untuk peran ini"
            description="Coba “Semua peran” atau ganti peran lewat menu kanan atas."
          />
        ) : (
          <ul className="space-y-2.5">
            {items.map((a) => {
              const k = ACTION_KIND[a.kind]
              const overdue = !!a.dueAt && new Date(a.dueAt).getTime() < Date.now()
              const dueSoon = !!a.dueAt && !overdue && new Date(a.dueAt).getTime() - Date.now() < 36 * 3600e3
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => navigate(a.record.type === 'inspection' ? `/inspeksi/${a.record.id}` : a.record.type === 'finding' ? `/temuan/${a.record.id}` : `/proyek/${a.projectId}?titik=${a.record.id}`)}
                    className={cn(
                      'group block w-full cursor-pointer rounded-xl border bg-surface p-5 text-left shadow-xs transition-all',
                      overdue ? 'border-red-200 hover:border-red-300 hover:shadow-sm' : 'border-line-subtle hover:border-line-strong hover:shadow-sm',
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', k.tone === 'danger' ? 'bg-red-50 text-red-700' : k.tone === 'warning' ? 'bg-amber-50 text-amber-700' : k.tone === 'brand' ? 'bg-brand-50 text-brand-700' : 'bg-sunken text-ink-secondary')}>
                        <k.icon {...iconProps(16)} strokeWidth={2} />
                      </span>
                      <span className="text-2xs font-semibold uppercase tracking-wider text-ink-muted">{k.label}</span>
                      <Badge tone="neutral" size="sm" className="font-mono">{projectCode(a.projectId)}</Badge>
                      {overdue && <Badge tone="danger" size="sm" icon={OctagonAlert}>Terlambat</Badge>}
                      {dueSoon && <Badge tone="warning" size="sm">Segera jatuh tempo</Badge>}
                      <span className="ml-auto hidden items-center gap-1 text-sm font-medium text-brand-700 opacity-0 transition-opacity group-hover:opacity-100 md:inline-flex">
                        Buka catatan <ArrowRight {...iconProps(14)} strokeWidth={2.2} />
                      </span>
                    </div>
                    <p className="mt-2.5 text-md font-semibold text-ink">{a.title}</p>
                    <p className="mt-1 text-sm text-ink-secondary">{a.detail}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-muted">
                      <span className="font-medium text-ink-secondary">{a.owner}</span>
                      {a.dueAt && <>· target <span className={cn('tnum', overdue && 'font-semibold text-red-700')}>{formatDateTime(a.dueAt)}</span> ({formatRelative(a.dueAt)})</>}
                    </p>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </PageBody>
    </>
  )
}
