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
  Palette,
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
      { to: '/', label: 'Ringkasan', icon: LayoutDashboard, exact: true },
      { to: '/proyek', label: 'Proyek', icon: Building2 },
    ],
  },
  {
    label: 'Pekerjaan',
    items: [
      { to: '/inspeksi', label: 'Inspeksi', icon: ClipboardList, countKey: 'inspeksi' },
      { to: '/temuan', label: 'Temuan & Tindakan', icon: Flag, countKey: 'temuan' },
      { to: '/tindakan', label: 'Kotak Tindakan', icon: Inbox, countKey: 'tindakan' },
      { to: '/aktivitas', label: 'Aktivitas', icon: History },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { to: '/laporan', label: 'Laporan', icon: BarChart3, tag: 'p1' },
      { to: '/pengaturan', label: 'Pengaturan Proyek', icon: Settings2, tag: 'otoritas' },
      { to: '/foundations', label: 'Design System', icon: Palette },
    ],
  },
]
