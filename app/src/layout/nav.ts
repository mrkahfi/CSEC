import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  Flag,
  Inbox,
  History,
  BarChart3,
  Settings2,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Hitungan demo — dihitung dari data seed di Sidebar. */
  countKey?: 'inspeksi' | 'temuan' | 'tindakan'
  /** Penanda status item nav. */
  tag?: 'p1' | 'otoritas'
  exact?: boolean
}

export interface NavSection {
  label: string
  items: NavItem[]
}

/** Navigasi primer — Information Architecture PRD §8. */
export const NAV: NavSection[] = [
  {
    label: 'Portofolio',
    items: [
      { to: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard, exact: true },
      { to: '/dashboard/proyek', label: 'Proyek', icon: Building2 },
    ],
  },
  {
    label: 'Pekerjaan',
    items: [
      { to: '/dashboard/inspeksi', label: 'Inspeksi', icon: ClipboardList, countKey: 'inspeksi' },
      { to: '/dashboard/temuan', label: 'Temuan & Tindakan', icon: Flag, countKey: 'temuan' },
      { to: '/dashboard/tindakan', label: 'Kotak Tindakan', icon: Inbox, countKey: 'tindakan' },
      { to: '/dashboard/aktivitas', label: 'Aktivitas', icon: History },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { to: '/dashboard/laporan', label: 'Laporan', icon: BarChart3, tag: 'p1' },
      { to: '/dashboard/pengaturan', label: 'Pengaturan Proyek', icon: Settings2, tag: 'otoritas' },
    ],
  },
]
