import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, SearchX } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { SearchInput } from '@/components/ui/SearchInput'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { TableContainer, Table, TableHead, TableBody, TableHeaderCell, TableRow, TableCell } from '@/components/ui/Table'
import { PROJECT_STATUS, PROJECTS, controlPointsOfProject, findingsOfProject, inspectionsOfProject } from '@/demo/data'
import { useSimulatedLoading } from '@/demo/hooks'

type SetId = 'semua' | 'aktif' | 'arsip'

export function ProyekList() {
  const loading = useSimulatedLoading()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const [set, setSet] = useState<SetId>('semua')

  // FR-OV-03: metrik portofolio menaut ke sini dengan proyek terpilih.
  const preset = params.get('proyek')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return PROJECTS.filter((p) => {
      if (set === 'aktif' && p.status === 'closed') return false
      if (set === 'arsip' && p.status !== 'closed') return false
      if (preset && p.id !== preset) return false
      if (!needle) return true
      return [p.name, p.code, p.client, p.location, p.pm].some((s) => s.toLowerCase().includes(needle))
    })
  }, [q, set, preset])

  const openCounts = (id: string) => {
    const ins = inspectionsOfProject(id).filter((i) => !['accepted', 'withdrawn', 'cancelled'].includes(i.status))
    const fnd = findingsOfProject(id).filter((f) => !['closed', 'superseded', 'cancelled'].includes(f.status))
    const holds = controlPointsOfProject(id).filter((c) => c.pointType === 'hold' && !['released', 'not_due'].includes(c.status))
    return { ins: ins.length, fnd: fnd.length, holds: holds.length }
  }

  return (
    <>
      <PageHeader
        title="Proyek"
        description="Daftar proyek pada data demo, termasuk proyek arsip yang hanya-baca."
      />

      <PageBody className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            aria-label="Cari proyek"
            placeholder="Cari nama, kode, klien, lokasi…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-80"
          />
          <SegmentedControl<SetId>
            label="Filter status proyek"
            value={set}
            onChange={setSet}
            options={[
              { value: 'semua', label: 'Semua', count: PROJECTS.length },
              { value: 'aktif', label: 'Aktif', count: PROJECTS.filter((p) => p.status !== 'closed').length },
              { value: 'arsip', label: 'Arsip', count: PROJECTS.filter((p) => p.status === 'closed').length },
            ]}
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Tidak ada proyek yang cocok"
            description={<>Filter Anda: pencarian “{q}”{preset ? ` + proyek ${preset}` : ''}. Kosong karena filter, bukan berarti portofolio kosong.</>}
            actions={
              <button type="button" onClick={() => { setQ(''); setSet('semua') }} className="text-sm font-medium text-brand-700 hover:text-brand-800">
                Reset filter
              </button>
            }
          />
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Proyek</TableHeaderCell>
                  <TableHeaderCell className="hidden lg:table-cell">Klien & lokasi</TableHeaderCell>
                  <TableHeaderCell className="hidden xl:table-cell">Penanggung jawab</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell align="right" className="hidden md:table-cell">Terbuka</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((p) => {
                  const st = PROJECT_STATUS[p.status]
                  const c = openCounts(p.id)
                  return (
                    <TableRow key={p.id} clickable onClick={() => navigate(`/proyek/${p.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                            <Building2 size={16} strokeWidth={1.8} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-md font-semibold text-ink">{p.name}</p>
                            <p className="font-mono text-xs text-ink-muted">{p.code} · {p.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <p className="text-sm text-ink-secondary">{p.client}</p>
                        <p className="text-xs text-ink-muted">{p.location}</p>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <p className="text-sm text-ink-secondary">{p.pm}</p>
                        <p className="text-xs text-ink-muted">QL: {p.qualityLead}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={st} size="sm" />
                        {p.status === 'closed' && <span className="mt-1 block text-2xs text-ink-disabled">hanya-baca</span>}
                      </TableCell>
                      <TableCell align="right" className="hidden md:table-cell">
                        <div className="inline-flex items-center gap-1.5">
                          {c.ins > 0 && <Badge tone="info" size="sm">{c.ins} inspeksi</Badge>}
                          {c.fnd > 0 && <Badge tone="warning" size="sm">{c.fnd} temuan</Badge>}
                          {c.holds > 0 && <Badge tone="danger" size="sm">{c.holds} hold</Badge>}
                          {c.ins + c.fnd + c.holds === 0 && <span className="text-xs text-ink-disabled">-</span>}
                        </div>
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
