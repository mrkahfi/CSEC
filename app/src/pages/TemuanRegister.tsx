import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Flag, MapPin, OctagonAlert, SearchX, Wrench } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { FINDING_CLASSIFICATION, FINDING_STATUS } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TableContainer, Table, TableHead, TableBody, TableHeaderCell, TableRow, TableCell, MonoCell } from '@/components/ui/Table'
import { formatRelative } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import { FINDINGS, PROJECTS, projectCode } from '@/demo/data'

type SetId = 'semua' | 'terbuka' | 'overdue' | 'verifikasi' | 'selesai'
const SETS: Record<SetId, { label: string; ids: readonly string[] | 'OVERDUE' | null }> = {
  semua: { label: 'Semua', ids: null },
  terbuka: { label: 'Terbuka', ids: ['open', 'assigned', 'action_in_progress', 'action_submitted', 'verification_pending'] },
  overdue: { label: 'Terlambat', ids: 'OVERDUE' },
  verifikasi: { label: 'Menunggu verifikasi', ids: ['verification_pending', 'action_submitted'] },
  selesai: { label: 'Selesai', ids: ['closed', 'verified'] },
}

const isOverdue = (f: (typeof FINDINGS)[number]) =>
  f.dueAt !== undefined &&
  new Date(f.dueAt).getTime() < Date.now() &&
  !['closed', 'superseded', 'cancelled'].includes(f.status)

export function TemuanRegister() {
  const loading = useSimulatedLoading()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [proyek, setProyek] = useState(params.get('proyek') ?? '')
  const set = (params.get('set') as SetId) || 'terbuka'

  const applySet = (s: SetId) => {
    const next = new URLSearchParams(params)
    next.set('set', s)
    setParams(next, { replace: true })
  }

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const ids = SETS[set].ids
    return FINDINGS.filter((f) => {
      if (proyek && f.projectId !== proyek) return false
      if (ids === 'OVERDUE') { if (!isOverdue(f)) return false }
      else if (ids && !ids.includes(f.status)) return false
      if (!needle) return true
      return [f.ref, f.title, f.facts, f.location, f.assignee].some((s) => s.toLowerCase().includes(needle))
    })
  }, [q, proyek, set])

  return (
    <>
      <PageHeader
        title="Temuan & Tindakan"
        meta={<Badge tone="neutral" size="sm" className="tnum">{FINDINGS.length} temuan</Badge>}
      />

      <PageBody className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            aria-label="Cari temuan"
            placeholder="ID, judul, lokasi, penanggung jawab…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-80"
          />
          <Select
            aria-label="Filter proyek"
            value={proyek}
            onChange={(e) => setProyek(e.target.value)}
            wrapperClassName="w-60"
          >
            <option value="">Semua proyek</option>
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>[{p.code}] {p.name}</option>)}
          </Select>
          <SegmentedControl<SetId>
            label="Set status temuan"
            size="sm"
            value={set}
            onChange={applySet}
            options={(Object.keys(SETS) as SetId[]).map((k) => ({
              value: k,
              label: SETS[k].label,
              count: SETS[k].ids === 'OVERDUE'
                ? FINDINGS.filter(isOverdue).length
                : SETS[k].ids
                  ? FINDINGS.filter((f) => SETS[k].ids!.includes(f.status)).length
                  : undefined,
            }))}
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Tidak ada temuan yang cocok"
            description={<>Longgarkan filter atau reset.</>}
            actions={
              <button type="button" onClick={() => { setQ(''); setProyek('') }} className="rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-xs hover:bg-hover">
                Reset filter
              </button>
            }
          />
        ) : (
          <TableContainer>
            {/* Fixed layout: alasan sama dengan register inspeksi. */}
            <Table className="table-fixed min-w-[990px]">
              <TableHead>
                <TableRow>
                  <TableHeaderCell width="100px">Referensi</TableHeaderCell>
                  <TableHeaderCell width="330px">Temuan</TableHeaderCell>
                  <TableHeaderCell width="225px" className="hidden lg:table-cell">Klasifikasi</TableHeaderCell>
                  <TableHeaderCell width="185px">Status</TableHeaderCell>
                  <TableHeaderCell width="250px" className="hidden 2xl:table-cell">Tindakan</TableHeaderCell>
                  <TableHeaderCell width="150px">Jatuh tempo</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((f) => {
                  const overdue = isOverdue(f)
                  return (
                    <TableRow key={f.id} clickable onClick={() => navigate(`/dashboard/temuan/${f.id}`)}>
                      <MonoCell>{f.ref}</MonoCell>
                      <TableCell>
                        <p className="max-w-80 truncate text-sm font-medium text-ink">{f.title}</p>
                        <div className="mt-1 flex max-w-80 items-center gap-1.5 text-xs text-ink-muted">
                          <span className="shrink-0 rounded bg-sunken px-1.5 py-0.2 font-mono text-2xs font-semibold text-ink-secondary border border-line-subtle">
                            {projectCode(f.projectId)}
                          </span>
                          <span className="flex items-center gap-0.5 truncate text-2xs">
                            <MapPin {...iconProps(11)} />
                            <span className="truncate">{f.location}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <StatusBadge status={FINDING_CLASSIFICATION[f.classification]} size="sm" />
                        {f.ncrRequired && (
                          <span className="mt-1 block">
                            <Badge tone="danger" size="sm" icon={Flag}>NCR diperlukan</Badge>
                          </span>
                        )}
                        {f.ncrRef && <Badge tone="neutral" size="sm" className="mt-1 font-mono">{f.ncrRef}</Badge>}
                      </TableCell>
                      <TableCell><StatusBadge status={FINDING_STATUS[f.status]} size="sm" /></TableCell>
                      <TableCell className="hidden 2xl:table-cell">
                        {f.actions.length === 0 ? (
                          <span className="text-xs text-ink-disabled">belum ada</span>
                        ) : (
                          <div className="space-y-0.5">
                            {f.actions.map((a) => (
                              <p key={a.id} className="flex items-center gap-1 text-xs text-ink-secondary">
                                <Wrench {...iconProps(11)} className="shrink-0 text-ink-muted" />
                                <span className="whitespace-nowrap font-mono">{a.ref}</span>
                                <span className="truncate">{a.assignee}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className={cn('tnum text-xs', overdue ? 'flex items-center gap-1 font-semibold text-red-700' : 'text-ink-secondary')}>
                          {overdue && <OctagonAlert {...iconProps(12)} strokeWidth={2.2} />}
                          {f.dueAt ? formatRelative(f.dueAt) : '-'}
                        </p>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </PageBody>
    </>
  )
}
