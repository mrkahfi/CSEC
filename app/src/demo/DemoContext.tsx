import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react'
import { ROLE, type RoleId } from '@/components/status'

/** Persona demo per peran — pengganti login (PRD §15.1). */
export const PERSONA: Record<RoleId, { name: string; org: string }> = {
  project_manager: { name: 'Andi Prasetyo', org: 'PT Karya Bangun Nusantara' },
  site_engineer: { name: 'Budi Santoso', org: 'PT Karya Bangun Nusantara' },
  qc_inspector: { name: 'Sari Wulandari', org: 'QA/QC — PT KBN' },
  quality_manager: { name: 'Ratna Dewi', org: 'QA/QC — PT KBN' },
  external: { name: 'Hendra Kusuma', org: 'Konsultan — CV Mitra Teknik' },
  viewer: { name: 'Maya Anggraini', org: 'Manajemen Operasi' },
}

export const DEFAULT_ROLE: RoleId = 'project_manager'

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
  const [role, setRoleState] = useState<RoleId>(DEFAULT_ROLE)
  const [scenarioEpoch, setEpoch] = useState(0)

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r)
  }, [])

  const resetDemo = useCallback(() => {
    setRoleState(DEFAULT_ROLE)
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
