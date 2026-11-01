import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react'
import { ROLE, type RoleId } from '@/components/status'

/** Persona demo per peran — pengganti login (PRD §15.1). */
export const PERSONA: Record<RoleId, { name: string; org: string }> = {
  project_manager: { name: 'Andi Prasetyo', org: 'PT Karya Bangun Nusantara' },
  site_engineer: { name: 'Budi Santoso', org: 'PT Karya Bangun Nusantara' },
  qc_inspector: { name: 'Sari Wulandari', org: 'QA/QC · PT KBN' },
  quality_manager: { name: 'Ratna Dewi', org: 'QA/QC · PT KBN' },
  external: { name: 'Hendra Kusuma', org: 'Konsultan · CV Mitra Teknik' },
  viewer: { name: 'Maya Anggraini', org: 'Manajemen Operasi' },
}

export const DEFAULT_ROLE: RoleId = 'project_manager'

/** Peran terpilih bertahan antar muat ulang — presenter tidak perlu ganti ulang. */
const ROLE_KEY = 'csec-demo-role'
function initialRole(): RoleId {
  try {
    const saved = localStorage.getItem(ROLE_KEY) as RoleId | null
    if (saved && saved in ROLE) return saved
  } catch { /* penyimpanan tidak tersedia — pakai default */ }
  return DEFAULT_ROLE
}

/**
 * Halaman pendaratan per peran (PRD §8.1): manajemen → portofolio,
 * peran proyek → proyek tugasnya, QA/QC → kotak tindakan/register.
 */
export const LANDING: Record<RoleId, string> = {
  project_manager: '/dashboard',
  site_engineer: '/dashboard/proyek/aru',
  qc_inspector: '/dashboard/tindakan',
  quality_manager: '/dashboard/inspeksi',
  external: '/dashboard/tindakan',
  viewer: '/dashboard',
}

interface DemoState {
  role: RoleId
  setRole: (r: RoleId) => void
  /** Pulihkan skenario terkorek ke titik awal (PRD §15.1). */
  resetDemo: () => void
  /** Versi skenario — naik tiap reset, dipakai kunci ulang animasi. */
  scenarioEpoch: number
}

const DemoContext = createContext<DemoState>({
  role: DEFAULT_ROLE,
  setRole: () => {},
  resetDemo: () => {},
  scenarioEpoch: 0,
})

export function useDemo() {
  return useContext(DemoContext)
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>(initialRole)
  const [scenarioEpoch, setEpoch] = useState(0)

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r)
    try { localStorage.setItem(ROLE_KEY, r) } catch { /* abaikan */ }
  }, [])

  const resetDemo = useCallback(() => {
    setRoleState(DEFAULT_ROLE)
    try { localStorage.setItem(ROLE_KEY, DEFAULT_ROLE) } catch { /* abaikan */ }
    setEpoch((e) => e + 1)
  }, [])

  const value = useMemo(
    () => ({ role, setRole, resetDemo, scenarioEpoch }),
    [role, setRole, resetDemo, scenarioEpoch],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function roleLabel(r: RoleId) {
  return ROLE[r].label
}

export function personaName(r: RoleId) {
  return PERSONA[r].name
}
