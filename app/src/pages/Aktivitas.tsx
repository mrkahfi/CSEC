import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Calendar, History, User } from 'lucide-react'
import { iconProps } from '@/components/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Input'
import { Timeline } from '@/components/ui/Timeline'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDateTime } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import { ACTIVITY, EVENT_ICON, EVENT_TONE, PROJECTS, projectName } from '@/demo/data'

type KindId = 'semua' | 'keputusan' | 'pengajuan' | 'jadwal' | 'temuan'

const KIND_IDS: Record<KindId, string[]> = {
  semua: [],
  keputusan: ['accepted', 'correction', 'clarification', 'rejected', 'verified', 'unable', 'withdrawn', 'cancelled'],
  pengajuan: ['created', 'submitted', 'reinspection', 'evidence', 'review'],
  jadwal: ['scheduled', 'rescheduled', 'in_progress'],
  temuan: ['finding', 'action', 'release', 'doc', 'external'],
}

export function Aktivitas() {
  const loading = useSimulatedLoading()
  const [kind, setKind] = useState<KindId>('semua')
  const [proyek, setProyek] = useState('')
  const [aktor, setAktor] = useState('')

  const actors = useMemo(() => [...new Set(ACTIVITY.map((a) => a.actor))], [])
  const rows = useMemo(() => {
    const ids = KIND_IDS[kind]
    return ACTIVITY.filter((a) => {
      if (ids.length > 0 && !ids.includes(a.kind)) return false
      if (proyek && a.projectId !== proyek) return false
      if (aktor && a.actor !== aktor) return false
      return true
    })
  }, [kind, proyek, aktor])

  return (
    <>
      <PageHeader title="Aktivitas" />

      <PageBody className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl<KindId>
            label="Jenis peristiwa"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'semua', label: 'Semua' },
              { value: 'keputusan', label: 'Keputusan' },
              { value: 'pengajuan', label: 'Pengajuan' },
              { value: 'jadwal', label: 'Jadwal' },
              { value: 'temuan', label: 'Temuan & tindakan' },
            ]}
          />
          <Select aria-label="Filter proyek" value={proyek} onChange={(e) => setProyek(e.target.value)} wrapperClassName="w-44">
            <option value="">Semua proyek</option>
            {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}
          </Select>
          <Select aria-label="Filter aktor" value={aktor} onChange={(e) => setAktor(e.target.value)} wrapperClassName="w-44">
            <option value="">Semua aktor</option>
            {actors.map((a) => <option key={a} value={a}>{a}</option>)}
          </Select>
          <span className="tnum ml-auto self-center text-sm text-ink-muted">{rows.length} peristiwa</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={History}
            title="Tidak ada peristiwa yang cocok"
            description="Longgarkan filter."
          />
        ) : (
          <Card>
            <CardHeader icon={History} title="Linimasa Peristiwa" />
            <CardBody className="pt-4">
              <Timeline
                items={rows.map((a) => ({
                  id: a.id,
                  icon: EVENT_ICON[a.kind],
                  tone: EVENT_TONE[a.kind],
                  title: (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{a.title}</span>
                      <Link
                        to={a.link}
                        className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/70 hover:underline"
                      >
                        {a.ref}
                      </Link>
                      <span className="inline-flex items-center gap-1 text-2xs text-ink-muted bg-sunken px-1.5 py-0.5 rounded border border-line-subtle">
                        <Building2 {...iconProps(11)} className="text-ink-disabled" />
                        {projectName(a.projectId)}
                      </span>
                    </div>
                  ),
                  meta: (
                    <div className="flex flex-wrap items-center gap-2 text-2xs text-ink-muted">
                      <span className="inline-flex items-center gap-1 font-medium text-ink">
                        <User {...iconProps(11)} className="text-ink-disabled" />
                        {a.actor}
                      </span>
                      <span className="rounded bg-sunken px-1.5 py-0.2 font-medium text-ink-secondary border border-line-subtle">
                        {a.role}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono tnum text-ink-disabled">
                        <Calendar {...iconProps(11)} />
                        {formatDateTime(a.at)}
                      </span>
                    </div>
                  ),
                  note: a.note,
                }))}
              />
            </CardBody>
          </Card>
        )}
      </PageBody>
    </>
  )
}
