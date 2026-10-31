import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDownWideNarrow,
  MapPin,
  OctagonAlert,
  SearchX,
  Bookmark,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { INSPECTION_STATUS, POINT_TYPE } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Checkbox } from '@/components/ui/Checkbox'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TableContainer, Table, TableHead, TableBody, TableHeaderCell, TableRow, TableCell, MonoCell } from '@/components/ui/Table'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatRelative, formatAge } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import { INSPECTIONS, PROJECTS, controlPointById, projectCode, type Inspection } from '@/demo/data'

/** Set tampilan — kosakata status sama dengan katalog (FR-IN-05). */
type SetId = 'semua' | 'review' | 'eksternal' | 'jadwal' | 'perbaikan' | 'selesai' | 'arsip'
const SETS: Record<SetId, { label: string; ids: readonly string[] | null }> = {
  semua: { label: 'Semua', ids: null },
  review: { label: 'Review', ids: ['submitted', 'internal_review', 'reinspection_requested'] },
  eksternal: { label: 'Eksternal', ids: ['external_review'] },
  jadwal: { label: 'Terjadwal', ids: ['scheduled', 'in_progress'] },
  perbaikan: { label: 'Perlu perbaikan', ids: ['clarification_required', 'correction_required', 'deferred', 'unable_to_inspect'] },
  selesai: { label: 'Selesai', ids: ['accepted'] },
  arsip: { label: 'Arsip', ids: ['withdrawn', 'cancelled', 'draft'] },
}

const SORTS = {
  diajukan: 'Terbaru diajukan',
  target: 'Target tindakan',
  umur: 'Umur terlama',
  status: 'Status',
} as const
type SortId = keyof typeof SORTS

/** Tampilan tersimpan (simulasi FR-IN-06) — preset filter, bukan fitur persistensi. */
const SAVED_VIEWS: { id: string; label: string; set: SetId }[] = [
  { id: 'sv1', label: 'Perlu keputusan QC', set: 'review' },
  { id: 'sv2', label: 'Menunggu eksternal', set: 'eksternal' },
  { id: 'sv3', label: 'Perlu perbaikan', set: 'perbaikan' },
]

const isOverdue = (i: Inspection) =>
  !!i.nextAction?.dueAt && new Date(i.nextAction.dueAt).getTime() < Date.now()

export function InspeksiRegister() {
  const loading = useSimulatedLoading()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const [q, setQ] = useState('')
  const [proyek, setProyek] = useState(params.get('proyek') ?? '')
  const [sort, setSort] = useState<SortId>('diajukan')
  const [overdueOnly, setOverdueOnly] = useState(false)
  const set = (params.get('set') as SetId) || 'semua'

  const applySet = (s: SetId) => {
    const next = new URLSearchParams(params)
    if (s === 'semua') next.delete('set')
    else next.set('set', s)
    setParams(next, { replace: true })
  }

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const ids = SETS[set].ids
    let list = INSPECTIONS.filter((i) => {
      if (proyek && i.projectId !== proyek) return false
      if (ids && !ids.includes(i.status)) return false
      if (overdueOnly && !isOverdue(i)) return false
      if (!needle) return true
      const hay = [i.ref, i.title, i.scope, i.location, i.submitter.name, ...i.documents.map((d) => `${d.number} ${d.rev}`)]
      return hay.some((s) => s.toLowerCase().includes(needle))
    })
    list = [...list].sort((a, b) => {
      if (sort === 'umur') return (a.submittedAt ?? '').localeCompare(b.submittedAt ?? '')
      if (sort === 'target') return (a.nextAction?.dueAt ?? '9999').localeCompare(b.nextAction?.dueAt ?? '9999')
      if (sort === 'status') return a.status.localeCompare(b.status)
      return (b.submittedAt ?? '').localeCompare(a.submittedAt ?? '')
    })
    return list
  }, [q, proyek, set, overdueOnly, sort])

  const total = INSPECTIONS.length

  return (
    <>
      <PageHeader
        title="Register Inspeksi"
        meta={<Badge tone="neutral" size="sm" className="tnum">{total} catatan</Badge>}
      />

      <PageBody className="space-y-4">
        {/* Toolbar filter */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            aria-label="Cari inspeksi"
            placeholder="ID, aktivitas, lokasi, pengirim, dokumen…"
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
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.code} · {p.name}</option>
            ))}
          </Select>
          <Select
            aria-label="Urutkan"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            wrapperClassName="w-48"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <span className="inline-flex items-center gap-1 text-ink-muted" aria-hidden>
            <ArrowDownWideNarrow {...iconProps(14)} />
          </span>
          <Checkbox label="Terlambat saja" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} className="ml-1" />
          <span className="tnum ml-auto self-center text-xs text-ink-muted">
            Menampilkan {rows.length} dari {total}
          </span>
        </div>

        {/* Tab set status */}
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl<SetId>
            label="Set status"
            size="sm"
            value={set}
            onChange={applySet}
            options={(Object.keys(SETS) as SetId[]).map((k) => ({
              value: k,
              label: SETS[k].label,
              count: SETS[k].ids ? INSPECTIONS.filter((i) => SETS[k].ids!.includes(i.status)).length : undefined,
            }))}
          />
          {/* Tampilan tersimpan — simulasi (FR-IN-06) */}
          <span className="ml-2 hidden items-center gap-1.5 md:inline-flex" title="Simulasi tampilan tersimpan, tidak ada persistensi">
            <Bookmark {...iconProps(13)} className="text-ink-muted" />
            {SAVED_VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => applySet(v.set)}
                className="rounded-full border border-dashed border-line-strong px-2.5 py-1 text-xs text-ink-secondary transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
              >
                {v.label}
              </button>
            ))}
          </span>
        </div>

        {/* Tabel */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Tidak ada catatan yang cocok"
            description={<>Longgarkan filter atau reset.</>}
            actions={
              <button
                type="button"
                onClick={() => { setQ(''); setProyek(''); setOverdueOnly(false); applySet('semua') }}
                className="rounded-lg border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-xs hover:bg-hover"
              >
                Reset semua filter
              </button>
            }
          />
        ) : (
          <TableContainer>
            {/* Layout fixed + min-w: kolom nowrap (pill status) tak bisa menyusut di auto layout, sehingga register ini pakai lebar eksplisit. */}
            <Table className="table-fixed min-w-[1000px]">
              <TableHead>
                <TableRow>
                  <TableHeaderCell width="165px">Referensi</TableHeaderCell>
                  <TableHeaderCell width="80px" className="hidden 2xl:table-cell">Proyek</TableHeaderCell>
                  <TableHeaderCell width="270px">Lingkup & lokasi</TableHeaderCell>
                  <TableHeaderCell width="140px" className="hidden lg:table-cell">Titik</TableHeaderCell>
                  <TableHeaderCell width="235px">Status</TableHeaderCell>
                  <TableHeaderCell width="160px" className="hidden 2xl:table-cell">Pengirim → reviewer</TableHeaderCell>
                  <TableHeaderCell width="190px">Tindakan berikutnya</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((i) => {
                  const overdue = isOverdue(i)
                  const cp = i.holdPointId ? controlPointById(i.holdPointId) : undefined
                  const hpBlocked = cp && !['released', 'not_due'].includes(cp.status)
                  return (
                    <TableRow key={i.id} clickable onClick={() => navigate(`/inspeksi/${i.id}`)}>
                      <MonoCell>
                        <span className="group-hover:text-brand-700">{i.ref}</span>
                        <span className="mt-0.5 block whitespace-nowrap text-2xs text-ink-muted tnum">umur {i.submittedAt ? formatAge(i.submittedAt) : '-'}</span>
                      </MonoCell>
                      <TableCell className="hidden 2xl:table-cell">
                        <span className="text-xs font-medium text-ink-secondary">{projectCode(i.projectId)}</span>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-72 truncate text-sm font-medium text-ink">{i.title}</p>
                        <p className="mt-0.5 flex max-w-72 items-center gap-1 text-xs text-ink-muted">
                          <MapPin {...iconProps(12)} /> <span className="truncate">{i.location}</span>
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={POINT_TYPE[i.pointType]} size="sm" />
                          {hpBlocked && (
                            <Tooltip content={`Hold point ${cp!.ref}, belum dirilis`}>
                              <span className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-2xs font-medium text-amber-900">
                                <OctagonAlert {...iconProps(11)} strokeWidth={2.2} />
                                Hold belum rilis
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={INSPECTION_STATUS[i.status]} size="sm" />
                      </TableCell>
                      <TableCell className="hidden 2xl:table-cell">
                        <p className="text-xs text-ink-secondary">{i.submitter.name}</p>
                        <p className="text-xs text-ink-muted">→ {i.reviewer}</p>
                      </TableCell>
                      <TableCell>
                        {i.nextAction ? (
                          <div className="text-xs">
                            <p className="max-w-44 truncate text-ink-secondary">{i.nextAction.label}</p>
                            <p className={cn('tnum mt-0.5 flex items-center gap-1', overdue ? 'font-medium text-red-700' : 'text-ink-muted')}>
                              {overdue && <OctagonAlert {...iconProps(11)} strokeWidth={2.2} />}
                              {i.nextAction.owner.split('(')[0].trim()}
                              {i.nextAction.dueAt && ` · ${formatRelative(i.nextAction.dueAt)}`}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-ink-disabled">-</span>
                        )}
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
