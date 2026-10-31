import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, CircleCheck, LogOut, ShieldCheck, ChevronsUpDown, Inbox } from 'lucide-react'
import { ROLE, type RoleId } from '@/components/status'
import { PERSONA, useDemo } from '@/demo/DemoContext'
import { Avatar } from '@/components/ui/Avatar'
import { Menu } from '@/components/ui/Menu'
import { SearchInput } from '@/components/ui/SearchInput'
import { useToast } from '@/components/ui/Toast'
import { iconProps } from '@/components/Icon'
import { formatRelative } from '@/lib/format'

/** Notifikasi demo (simulasi — bukan pengiriman nyata, FR-NO-04). */
const NOW = new Date()
const SIMULATED_NOTIFICATIONS = [
  {
    id: 'n1',
    icon: ShieldCheck,
    cls: 'text-amber-600',
    title: 'Hold point menunggu rilis otoritas',
    meta: formatRelative(new Date(NOW.getTime() - 10 * 60_000).toISOString(), NOW),
  },
  {
    id: 'n2',
    icon: CheckCheck,
    cls: 'text-green-600',
    title: 'Re-inspeksi diterima oleh QC',
    meta: formatRelative(new Date(NOW.getTime() - 60 * 60_000).toISOString(), NOW),
  },
  {
    id: 'n3',
    icon: CircleCheck,
    cls: 'text-sky-600',
    title: 'Konsultan menjadwalkan ulang witness point',
    meta: formatRelative(new Date(NOW.getTime() - 3 * 60 * 60_000).toISOString(), NOW),
  },
]

export function Topbar() {
  const { role, setRole } = useDemo()
  const toast = useToast()
  const navigate = useNavigate()
  const persona = PERSONA[role]

  const switchRole = (r: RoleId) => {
    setRole(r)
    toast({
      tone: 'info',
      title: `Peran diganti: ${ROLE[r].label}`,
      description: 'Kontrol demo — bukan penerapan hak akses nyata.',
    })
    navigate('/')
  }

  return (
    <header className="flex h-14 min-w-0 flex-1 shrink-0 items-center gap-3 border-b border-line-subtle bg-surface px-4">
      {/* Pencarian global (FR-SE-01) */}
      <div className="hidden min-w-0 flex-1 justify-center sm:flex">
        <SearchInput
          shortcutHint
          aria-label="Cari proyek, inspeksi, temuan…"
          placeholder="Cari ID permintaan, lokasi, dokumen…"
          className="w-full max-w-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toast({
                tone: 'info',
                title: 'Pencarian global (demo)',
                description: 'Hasil lintas entitas menyusul bersama data seed.',
              })
            }
          }}
        />
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="flex shrink-0 items-center gap-1.5">
        {/* Kotak notifikasi / action inbox (FR-NO-01) */}
        <Menu
          align="end"
          items={[
            {
              label: 'Notifikasi Demo (simulasi)',
              items: SIMULATED_NOTIFICATIONS.map((n) => ({
                id: n.id,
                label: n.title,
                icon: n.icon,
                hint: <span className="font-mono text-2xs whitespace-nowrap text-ink-disabled">{n.meta}</span>,
                onSelect: () =>
                  toast({ tone: 'info', title: n.title, description: 'Tautan ke catatan menyusul pada iterasi data.' }),
              })),
            },
            'divider',
            {
              id: 'inbox',
              label: 'Lihat semua di Kotak Tindakan',
              icon: Inbox,
              onSelect: () => navigate('/aktivitas'),
            },
          ]}
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Notifikasi demo, 3 item"
              title="Notifikasi (simulasi)"
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-hover hover:text-ink"
            >
              <Bell {...iconProps(17)} />
              <span
                aria-hidden
                className="absolute top-0.5 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-600 px-0.5 text-[9px] leading-none font-bold text-white"
              >
                3
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
                label: ROLE[r].label,
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
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-line-subtle bg-surface py-1 pr-2 pl-1.5 shadow-xs transition-colors hover:bg-hover"
              aria-label="Menu pengguna dan ganti peran demo"
            >
              <Avatar name={persona.name} size="sm" />
              <span className="hidden text-left md:block">
                <span className="block max-w-36 truncate text-sm leading-4 font-medium text-ink">
                  {persona.name}
                </span>
                <span className="block text-xs leading-3.5 text-ink-muted">{ROLE[role].label}</span>
              </span>
              <ChevronsUpDown {...iconProps(14)} className="text-ink-disabled" />
            </button>
          )}
        />
      </div>
    </header>
  )
}
