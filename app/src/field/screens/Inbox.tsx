import { Link, useNavigate } from 'react-router-dom'
import { Bell, CircleCheck, Info, OctagonAlert, Send, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelative } from '@/lib/format'
import { useField } from '@/field/FieldContext'
import { MCard, Screen, SectionTitle, TopBar } from '@/field/ui'

/* ============================================================
 * FO-34/35 Notifikasi per persona + balasan singkat
 * ============================================================ */

const TONE = {
  info: { icon: Info, cls: 'bg-sky-50 text-sky-600' },
  warning: { icon: TriangleAlert, cls: 'bg-amber-50 text-amber-600' },
  danger: { icon: OctagonAlert, cls: 'bg-red-50 text-red-600' },
  success: { icon: CircleCheck, cls: 'bg-green-50 text-green-600' },
} as const

export function Inbox() {
  const { persona, inbox } = useField()
  const navigate = useNavigate()
  const list = inbox.filter((i) => i.to === persona)

  return (
    <Screen topBar={<TopBar large title="Inbox" subtitle={`${list.length} notifikasi untuk Anda`} />} className="px-4 pt-4 pb-6">
      <div className="space-y-4">
        {list.length === 0
          ? <EmptyState icon={Bell} title="Inbox kosong" description="Notifikasi keputusan dan penugasan muncul di sini." />
          : (
            <section className="space-y-2">
              <SectionTitle>Terbaru</SectionTitle>
              <div className="space-y-2">
                {list.map((n) => {
                  const t = TONE[n.tone]
                  return (
                    <MCard key={n.id} className="p-3.5">
                      <Link to={n.link} className="flex items-start gap-3">
                        <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', t.cls)}>
                          <t.icon {...iconProps(15)} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-ink">{n.title}</span>
                          <span className="mt-0.5 block text-sm leading-5 text-ink-secondary">{n.body}</span>
                          <span className="tnum mt-1 block text-xs text-ink-disabled">{formatRelative(n.at)}</span>
                        </span>
                      </Link>
                      {n.thread && (
                        <div className="mt-3 space-y-2 border-t border-line-subtle pt-3">
                          {n.thread.map((m, i) => (
                            <div key={i} className="rounded-lg bg-sunken p-2.5">
                              <p className="text-xs font-semibold text-ink">{m.from} <span className="font-normal text-ink-muted">· {m.role}</span></p>
                              <p className="mt-0.5 text-sm leading-5 text-ink-secondary">{m.message}</p>
                              <p className="tnum mt-1 text-2xs text-ink-disabled">{formatRelative(m.at)}</p>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => navigate(n.link)}
                            className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-brand-700"
                          >
                            <Send {...iconProps(12)} /> Buka catatan terkait
                          </button>
                        </div>
                      )}
                    </MCard>
                  )
                })}
              </div>
            </section>
          )}
      </div>
    </Screen>
  )
}
