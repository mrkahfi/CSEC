import { useNavigate } from 'react-router-dom'
import { Bell, ChevronsUpDown, Inbox, LogOut, OctagonAlert, AlarmClock, Info, Search } from 'lucide-react'
import { ROLE, type RoleId, type StatusTone } from '@/components/status'
import { PERSONA, LANDING, useDemo } from '@/demo/DemoContext'
import { Avatar } from '@/components/ui/Avatar'
import { Menu } from '@/components/ui/Menu'
import { useToast } from '@/components/ui/Toast'
import { iconProps, type LucideIcon } from '@/components/Icon'
import { formatRelative } from '@/lib/format'
import { NOTIFICATIONS, ACTION_ITEMS } from '@/demo/data'

const TONE_ICON: Record<StatusTone, LucideIcon> = {
  info: Info,
  warning: AlarmClock,
  danger: OctagonAlert,
  success: Info,
  neutral: Info,
  brand: Info,
  active: Info,
}
const TONE_CLS: Record<string, string> = {
  info: 'text-sky-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
}

export function Topbar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { role, setRole } = useDemo()
  const toast = useToast()
  const navigate = useNavigate()
  const persona = PERSONA[role]
  const inboxCount = ACTION_ITEMS.filter((a) => a.visibleTo.includes(role)).length

  /** Ganti peran + pindah ke halaman pendaratan peran (PRD §8.1). */
  const switchRole = (r: RoleId) => {
    setRole(r)
    toast({
      tone: 'info',
      title: `Peran diganti: ${ROLE[r].label}`,
      description: 'Mendarat di halaman awal peran.',
    })
    navigate(LANDING[r])
  }

  return (
    <header className="flex h-16 min-w-0 flex-1 shrink-0 items-center gap-4 border-b border-line-subtle bg-surface px-5">
      {/* Pencarian global — buka palet (FR-SE-01) */}
      <div className="hidden min-w-0 flex-1 justify-center sm:flex">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-10 w-full max-w-xl cursor-pointer items-center gap-2.5 rounded-lg border border-line-strong bg-surface px-3.5 text-base text-ink-disabled shadow-xs transition-colors hover:border-gray-300 hover:bg-hover"
          aria-label="Buka pencarian global"
        >
          <Search {...iconProps(18)} />
          <span className="flex-1 truncate text-left">Cari ID permintaan, lokasi, dokumen…</span>
          <span className="rounded border border-line-subtle bg-sunken px-1.5 py-0.5 text-2xs font-medium text-ink-muted">⌘K</span>
        </button>
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="flex shrink-0 items-center gap-2">
        {/* Notifikasi demo — dari data seed, tautan ke catatan (FR-NO-03/04) */}
        <Menu
          align="end"
          panelClassName="w-[26rem]"
          items={[
            {
              label: 'Notifikasi (demo)',
              items: NOTIFICATIONS.map((n) => {
                const NIcon = TONE_ICON[n.tone]
                return {
                  id: n.id,
                  label: n.title,
                  icon: NIcon,
                  hint: <span className="tnum text-2xs whitespace-nowrap text-ink-disabled">{formatRelative(n.at)}</span>,
                  iconClassName: TONE_CLS[n.tone],
                  onSelect: () => {
                    navigate(n.link)
                    toast({ tone: 'info', title: 'Membuka catatan sumber' })
                  },
                }
              }),
            },
            'divider',
            {
              id: 'inbox',
              label: `Lihat semua di Kotak Tindakan (${inboxCount})`,
              icon: Inbox,
              onSelect: () => navigate('/tindakan'),
            },
          ]}
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label={`Notifikasi demo, ${NOTIFICATIONS.length} item`}
              title="Notifikasi (simulasi)"
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-hover hover:text-ink"
            >
              <Bell {...iconProps(20)} />
              <span
                aria-hidden
                className="absolute top-0.5 right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none font-bold text-white ring-2 ring-surface"
              >
                {NOTIFICATIONS.length}
              </span>
            </button>
          )}
        />

        {/* Pemilih peran demo (PRD §8.1) */}
        <Menu
          align="end"
          className="ml-1"
          items={[
            {
              label: 'Ganti Peran Demo',
              items: (Object.keys(ROLE) as RoleId[]).map((r) => ({
                id: r,
                label: `${ROLE[r].label}${r === role ? ' (aktif)' : ''}`,
                icon: ROLE[r].icon,
                onSelect: () => switchRole(r),
              })),
            },
            'divider',
            { id: 'logout', label: 'Keluar (nonaktif di demo)', icon: LogOut, disabled: true },
          ]}
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line-subtle bg-surface py-1.5 pr-2.5 pl-2 shadow-xs transition-colors hover:bg-hover"
              aria-label="Menu pengguna dan ganti peran demo"
            >
              <Avatar name={persona.name} size="md" />
              <span className="hidden text-left md:block">
                <span className="block max-w-36 truncate text-sm leading-5 font-medium text-ink">
                  {persona.name}
                </span>
                <span className="block text-xs leading-4 text-ink-muted">{ROLE[role].label}</span>
              </span>
              <ChevronsUpDown {...iconProps(16)} className="text-ink-disabled" />
            </button>
          )}
        />
      </div>
    </header>
  )
}
