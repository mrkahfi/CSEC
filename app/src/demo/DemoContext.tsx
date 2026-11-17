import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react'
import { ROLE, type RoleId } from '@/components/status'
import { DEMO_STEPS } from '@/demo/demoSteps'

/** Persona demo per peran: pengganti login (PRD §15.1). */
export const PERSONA: Record<RoleId, { name: string; org: string }> = {
  project_manager: { name: 'Andi Prasetyo', org: 'PT Karya Bangun Nusantara' },
  site_engineer: { name: 'Budi Santoso', org: 'PT Karya Bangun Nusantara' },
  qc_inspector: { name: 'Sari Wulandari', org: 'QA/QC · PT KBN' },
  quality_manager: { name: 'Ratna Dewi', org: 'QA/QC · PT KBN' },
  external: { name: 'Hendra Kusuma', org: 'Konsultan · CV Mitra Teknik' },
  viewer: { name: 'Maya Anggraini', org: 'Manajemen Operasi' },
}

export const DEFAULT_ROLE: RoleId = 'project_manager'

/** Peran terpilih bertahan antar muat ulang: presenter tidak perlu ganti ulang. */
const ROLE_KEY = 'csec-demo-role'
function initialRole(): RoleId {
  try {
    const saved = localStorage.getItem(ROLE_KEY) as RoleId | null
    if (saved && saved in ROLE) return saved
  } catch { /* penyimpanan tidak tersedia: pakai default */ }
  return DEFAULT_ROLE
}

/**
 * Halaman pendaratan per peran (PRD §8.1): manajemen ke portofolio,
 * peran proyek ke proyek tugasnya, QA/QC ke kotak tindakan atau register.
 */
export const LANDING: Record<RoleId, string> = {
  project_manager: '/dashboard',
  site_engineer: '/dashboard/proyek/aru',
  qc_inspector: '/dashboard/tindakan',
  quality_manager: '/dashboard/inspeksi',
  external: '/dashboard/tindakan',
  viewer: '/dashboard',
}

export interface DemoScenarioState {
  wirStatus: 'review' | 'correction' | 'accepted'
  holdPointReleased: boolean
}

interface DemoState {
  role: RoleId
  setRole: (r: RoleId) => void
  /** Pulihkan skenario terkorek ke titik awal (PRD §15.1). */
  resetDemo: () => void
  /** Versi skenario: naik tiap reset, dipakai kunci ulang animasi. */
  scenarioEpoch: number
  /** Status modul tour & otomasi demo §15.3 */
  isTourOpen: boolean
  setIsTourOpen: (open: boolean) => void
  currentStep: number
  setCurrentStep: (s: number) => void
  autoPlay: boolean
  setAutoPlay: (p: boolean) => void
  scenario: DemoScenarioState
  setScenario: (fn: (prev: DemoScenarioState) => DemoScenarioState) => void
}

const DEFAULT_SCENARIO: DemoScenarioState = {
  wirStatus: 'review',
  holdPointReleased: false,
}

const DemoContext = createContext<DemoState>({
  role: DEFAULT_ROLE,
  setRole: () => {},
  resetDemo: () => {},
  scenarioEpoch: 0,
  isTourOpen: false,
  setIsTourOpen: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  autoPlay: false,
  setAutoPlay: () => {},
  scenario: DEFAULT_SCENARIO,
  setScenario: () => {},
})

export function useDemo() {
  return useContext(DemoContext)
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>(initialRole)
  const [scenarioEpoch, setEpoch] = useState(0)
  const [isTourOpen, setIsTourOpen] = useState(true)
  const [currentStep, setCurrentStepState] = useState(1)
  const [autoPlay, setAutoPlay] = useState(false)
  const [scenario, setScenario] = useState<DemoScenarioState>(DEFAULT_SCENARIO)

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r)
    try { localStorage.setItem(ROLE_KEY, r) } catch { /* abaikan */ }
  }, [])

  const setCurrentStep = useCallback((step: number) => {
    const valid = Math.max(1, Math.min(step, DEMO_STEPS.length))
    setCurrentStepState(valid)
    const stepDef = DEMO_STEPS[valid - 1]
    if (stepDef) {
      setRoleState(stepDef.role)
      try { localStorage.setItem(ROLE_KEY, stepDef.role) } catch { /* abaikan */ }
    }
    // Sinkronkan status scenario
    if (valid >= 8) {
      setScenario({ wirStatus: 'accepted', holdPointReleased: true })
    } else if (valid >= 6) {
      setScenario({ wirStatus: 'accepted', holdPointReleased: false })
    } else if (valid >= 4) {
      setScenario({ wirStatus: 'correction', holdPointReleased: false })
    } else {
      setScenario(DEFAULT_SCENARIO)
    }
    setEpoch((e) => e + 1)
  }, [])

  const resetDemo = useCallback(() => {
    setRoleState(DEFAULT_ROLE)
    try { localStorage.setItem(ROLE_KEY, DEFAULT_ROLE) } catch { /* abaikan */ }
    setCurrentStepState(1)
    setAutoPlay(false)
    setScenario(DEFAULT_SCENARIO)
    setEpoch((e) => e + 1)
  }, [])

  const value = useMemo(
    () => ({
      role,
      setRole,
      resetDemo,
      scenarioEpoch,
      isTourOpen,
      setIsTourOpen,
      currentStep,
      setCurrentStep,
      autoPlay,
      setAutoPlay,
      scenario,
      setScenario,
    }),
    [
      role,
      setRole,
      resetDemo,
      scenarioEpoch,
      isTourOpen,
      currentStep,
      setCurrentStep,
      autoPlay,
      scenario,
    ],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function roleLabel(r: RoleId) {
  return ROLE[r].label
}

export function personaName(r: RoleId) {
  return PERSONA[r].name
}
