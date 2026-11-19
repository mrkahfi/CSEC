import { Timeline, type TimelineItem } from '@/components/ui/Timeline'
import { formatDateTime } from '@/lib/format'
import { EVENT_ICON, EVENT_TONE, type TimelineEvent } from '@/demo/data'

/** Peta peristiwa data ke item timeline (aktor, peran, waktu: FR-AU-02). */
export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  const items: TimelineItem[] = events.map((e) => ({
    id: e.id,
    icon: EVENT_ICON[e.kind],
    tone: EVENT_TONE[e.kind],
    title: e.title,
    meta: (
      <span className="flex flex-wrap items-center gap-1.5 text-2xs text-ink-muted">
        <span className="font-medium text-ink">{e.actor}</span>
        <span className="rounded bg-sunken px-1.5 py-0.2 font-medium text-ink-secondary border border-line-subtle">{e.role}</span>
        <span className="font-mono tnum text-ink-disabled">{formatDateTime(e.at)}</span>
      </span>
    ),
    note: e.note,
    detail: e.detail,
  }))
  return <Timeline items={items} />
}
