import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
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
            <CardHeader title="Linimasa" />
            <CardBody className="pt-4">
              <Timeline
                items={rows.map((a) => ({
                  id: a.id,
                  icon: EVENT_ICON[a.kind],
                  tone: EVENT_TONE[a.kind],
                  title: (
                    <>
                      {a.title}{' '}
                      <Link to={a.link} className="font-mono text-xs font-medium text-brand-700 hover:underline">
                        {a.ref}
                      </Link>{' '}
                      <span className="text-xs font-normal text-ink-muted">· {projectName(a.projectId)}</span>
                    </>
                  ),
                  meta: `${a.actor} · ${a.role} · ${formatDateTime(a.at)}`,
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
