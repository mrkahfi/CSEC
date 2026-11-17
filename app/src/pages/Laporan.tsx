import { useMemo, useState } from 'react'
import { BadgeCheck, ClipboardList, FileWarning, Printer, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { INSPECTION_STATUS, POINT_TYPE } from '@/components/status'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime } from '@/lib/format'
import { useSimulatedLoading } from '@/demo/hooks'
import { INSPECTIONS, PROJECTS, findingsOfProject, inspectionsOfProject, projectCode, projectName, projectPulse } from '@/demo/data'

/* ------------------------------------------------------------
 * Pratinjau cetak rekor inspeksi (FR-RE-03): dokumen simulasi.
 * ------------------------------------------------------------ */

function PrintPreview({ insId, onClose }: { insId: string; onClose: () => void }) {
  const toast = useToast()
  const ins = INSPECTIONS.find((i) => i.id === insId)!
  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title="Pratinjau Cetak: Rekor Inspeksi"
      description={
        <span className="flex items-center gap-2">
          <span className="rounded bg-sunken px-2 py-0.5 font-mono text-xs font-semibold text-ink">{ins.ref}</span>
          <span className="text-ink-muted">Data demo</span>
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Tutup</Button>
          <Button variant="secondary" onClick={() => toast({ tone: 'info', title: 'Simulasi cetak', description: 'Demo tidak mencetak/mengekspor berkas nyata.' })}>
            <Printer {...iconProps(15)} /> Cetak / PDF
          </Button>
        </>
      }
    >
      {/* Dokumen ala A4 */}
      <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-line-subtle bg-white p-6 text-gray-900">
        <div className="flex items-start justify-between border-b-2 border-gray-900 pb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-800">SiteOps: Pratinjau Rekor Inspeksi</p>
            <p className="mt-0.5 font-mono text-sm font-semibold">{ins.ref}</p>
          </div>
          <div className="text-right text-2xs leading-4 text-gray-600">
            <p className="font-semibold text-gray-900">{projectName(ins.projectId)}</p>
            <p>Data demo, bukan rekaman resmi</p>
            <p>Dicetak: {formatDateTime(new Date().toISOString())}</p>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
          {[
            ['Lingkup', ins.title],
            ['Lokasi', ins.location],
            ['Titik / ITP', `${POINT_TYPE[ins.pointType].label} (${ins.itpRef})`],
            ['Status', INSPECTION_STATUS[ins.status].label],
            ['Pengirim', ins.submitter.name],
            ['Reviewer', ins.reviewer],
          ].map(([k, v]) => (
            <div key={k}><dt className="font-semibold uppercase tracking-wide text-gray-500">{k}</dt><dd className="mt-0.5">{v}</dd></div>
          ))}
        </dl>

        {ins.decision && (
          <div className="mt-4 rounded border border-gray-300 bg-gray-50 p-3 text-xs">
            <p className="font-bold uppercase tracking-wide">Keputusan: {ins.decision.outcome}</p>
            <p className="mt-1 font-medium">{ins.decision.by} <span className="font-normal text-gray-600">({ins.decision.role})</span> [Lingkup: {ins.decision.scope}]</p>
            <p className="mt-1 italic">“{ins.decision.comment}”</p>
          </div>
        )}

        <p className="mt-4 text-xs font-bold uppercase tracking-wide">Checklist</p>
        <ul className="mt-1.5 space-y-1 text-xs">
          {ins.checklist.map((c) => (
            <li key={c.id} className="flex justify-between gap-4 border-b border-dashed border-gray-200 pb-1">
              <span>{c.label}</span>
              <span className="shrink-0 text-gray-500">{c.result === 'ok' ? '✓ Sesuai' : c.result === 'issue' ? '△ Temuan' : 'N/A'}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs font-bold uppercase tracking-wide">Indeks bukti</p>
        <ol className="mt-1.5 list-decimal space-y-0.5 pl-4 text-xs">
          {ins.evidence.map((e) => (
            <li key={e.id}>
              <span className="font-medium">{e.title}</span> <span className="font-mono text-gray-500 text-2xs">({e.meta})</span>{e.unavailable && ' (tidak tersedia)'}
            </li>
          ))}
          {ins.evidence.length === 0 && <li className="list-none">Tidak ada bukti terlampir.</li>}
        </ol>

        <p className="mt-5 border-t border-gray-300 pt-2.5 text-2xs leading-4 text-gray-500">
          Pratinjau UI, bukan dokumen resmi.
        </p>
      </div>
    </Dialog>
  )
}

/* ============================================================ */

export function Laporan() {
  const loading = useSimulatedLoading()
  const [printId, setPrintId] = useState<string | null>(null)

  /** Aging inspeksi terbuka per proyek: kalender, bukan jam kerja (§12.1). */
  const rows = useMemo(() => PROJECTS.map((p) => {
    const ins = inspectionsOfProject(p.id)
    const open = ins.filter((i) => !['accepted', 'withdrawn', 'cancelled'].includes(i.status))
    const ages = open.filter((i) => i.submittedAt).map((i) => (Date.now() - new Date(i.submittedAt!).getTime()) / 86_400_000)
    const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null
    return {
      p,
      total: ins.length,
      open: open.length,
      findings: findingsOfProject(p.id).filter((f) => !['closed', 'superseded', 'cancelled'].includes(f.status)).length,
      avgAge,
      pulse: projectPulse(p.id),
    }
  }), [])

  return (
    <>
      <PageHeader
        title="Laporan"
        meta={<Badge tone="warning" size="sm">P1</Badge>}
      />

      <PageBody className="space-y-5">
        {/* Ringkasan per proyek + aging */}
        <Card>
          <CardHeader title="Ringkasan workflow per proyek" />
          <CardBody className="pt-1">
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs text-ink-muted">
                      <th className="py-2.5 pr-4 font-semibold">Proyek</th>
                      <th className="py-2.5 pr-4 font-semibold">Inspeksi</th>
                      <th className="py-2.5 pr-4 font-semibold">Terbuka</th>
                      <th className="py-2.5 pr-4 font-semibold">Temuan terbuka</th>
                      <th className="py-2.5 pr-4 font-semibold">Umur rata-rata terbuka</th>
                      <th className="py-2.5 font-semibold">Komposisi status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-subtle">
                    {rows.map((r) => (
                      <tr key={r.p.id}>
                        <td className="py-3 pr-4">
                          <span className="font-medium text-ink">{r.p.name}</span>
                          <span className="block font-mono text-2xs text-ink-muted">{r.p.code}</span>
                        </td>
                        <td className="tnum py-3 pr-4 text-ink-secondary">{r.total}</td>
                        <td className="tnum py-3 pr-4 text-ink-secondary">{r.open}</td>
                        <td className="tnum py-3 pr-4 text-ink-secondary">{r.findings}</td>
                        <td className="tnum py-3 pr-4">
                          {r.avgAge !== null ? <span className="text-ink-secondary">{r.avgAge} hari</span> : <span className="text-ink-disabled">-</span>}
                        </td>
                        <td className="py-3">
                          <div className="flex max-w-56 flex-wrap gap-1">
                            {r.pulse.map((s) => (
                              <span key={s.label} className={cn('tnum inline-flex items-center gap-1 rounded-full border px-1.5 text-2xs', {
                                'bg-green-50 text-green-800 border-green-200': s.tone === 'success',
                                'bg-sky-50 text-sky-800 border-sky-200': s.tone === 'info',
                                'bg-violet-50 text-violet-800 border-violet-200': s.tone === 'active',
                                'bg-amber-50 text-amber-900 border-amber-200': s.tone === 'warning',
                                'bg-gray-50 text-gray-700 border-gray-200': s.tone === 'neutral',
                              })}>
                                {s.count} {s.label}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* First-pass & re-inspection dengan definisi */}
          <Card>
            <CardHeader title="First-pass acceptance & re-inspection" />
            <CardBody className="space-y-4 pt-3">
              {[
                { icon: BadgeCheck, k: 'First-pass acceptance', v: '78%', def: 'Diterima pada keputusan pertama (n=14)' },
                { icon: RefreshCw, k: 'Re-inspection rate', v: '17%', def: 'Permintaan dengan ≥1 re-inspeksi' },
                { icon: FileWarning, k: 'Siklus tindakan (median)', v: '6 hari', def: 'Penugasan ke verifikasi (n=12)' },
              ].map((m) => (
                <div key={m.k} className="flex items-start gap-3 border-b border-line-subtle pb-3.5 last:border-0 last:pb-0">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <m.icon {...iconProps(16)} strokeWidth={2} />
                  </span>
                  <div className="flex flex-1 items-baseline justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{m.k}</p>
                      <p className="mt-0.5 text-xs leading-4 text-ink-muted">{m.def}</p>
                    </div>
                    <span className="tnum shrink-0 text-xl font-semibold text-ink">{m.v}</span>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Pratinjau cetak rekor inspeksi */}
          <Card>
            <CardHeader title="Pratinjau cetak rekor inspeksi" />
            <CardBody className="pt-3">
              <ul className="divide-y divide-line-subtle">
                {INSPECTIONS.filter((i) => i.status === 'accepted').map((i) => (
                  <li key={i.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                    <ClipboardList {...iconProps(16)} className="shrink-0 text-ink-muted" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-brand-50 px-1.5 py-0.5 font-mono text-2xs font-semibold text-brand-700">{i.ref}</span>
                        <p className="truncate text-sm font-medium text-ink">{i.title}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-muted">{projectCode(i.projectId)}: {i.location}</p>
                    </div>
                    <Button size="xs" variant="secondary" onClick={() => setPrintId(i.id)}>
                      <Printer {...iconProps(13)} /> Pratinjau
                    </Button>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </PageBody>

      {printId && <PrintPreview insId={printId} onClose={() => setPrintId(null)} />}
    </>
  )
}
