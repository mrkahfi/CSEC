import { Timeline, type TimelineItem } from '@/components/ui/Timeline'
import { formatDateTime } from '@/lib/format'
import { EVENT_ICON, EVENT_TONE, type TimelineEvent } from '@/demo/data'

/** Peta peristiwa data → item timeline (aktor · peran · waktu — FR-AU-02). */
export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  const items: TimelineItem[] = events.map((e) => ({
    id: e.id,
    icon: EVENT_ICON[e.kind],
    tone: EVENT_TONE[e.kind],
    title: e.title,
    meta: `${e.actor} · ${e.role} · ${formatDateTime(e.at)}`,
    note: e.note,
    detail: e.detail,
  }))
  return <Timeline items={items} />
}
