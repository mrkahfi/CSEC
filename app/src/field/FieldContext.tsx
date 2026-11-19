import {
  createContext, useCallback, useContext, useMemo, useState, type ReactNode,
} from 'react'
import { normalizeProjectId } from '@/demo/data'
import {
  F_ACTIVITIES, F_EVENTS, F_FINDINGS, F_INBOX, F_REPORTS, F_WIRS,
  type FActivity, type FEvent, type FFinding, type FInboxItem, type FReport, type FWir,
  type PersonaId,
} from '@/field/data'

/* ============================================================
 * STATE DEMO FIELD OPERATIONS (PRD Field Ops §19)
 * ------------------------------------------------------------
 * Aksi demo mengubah salinan seed di memori: kirim laporan,
 * ajukan inspeksi, catat keputusan QC, tanggapi temuan,
 * verifikasi perbaikan. Reset mengembalikan keadaan awal.
 * Persona & proyek aktif bertahan antar muat ulang.
 * ============================================================ */

interface DemoState {
  wirs: FWir[]
  findings: FFinding[]
  reports: FReport[]
  activities: FActivity[]
  events: FEvent[]
  inbox: FInboxItem[]
}

interface FieldState extends DemoState {
  persona: PersonaId
  setPersona: (p: PersonaId) => void
  projectId: string
  setProjectId: (id: string) => void
  /** Ubah siap-pakai: setWirs((list) => ...) untuk alur layar tertentu. */
  setWirs: React.Dispatch<React.SetStateAction<FWir[]>>
  setFindings: React.Dispatch<React.SetStateAction<FFinding[]>>
  setReports: React.Dispatch<React.SetStateAction<FReport[]>>
  setActivities: React.Dispatch<React.SetStateAction<FActivity[]>>
  setEvents: React.Dispatch<React.SetStateAction<FEvent[]>>
  setInbox: React.Dispatch<React.SetStateAction<FInboxItem[]>>
  /** Pulihkan skenario ke titik awal (PRD §19.17). */
  resetDemo: () => void
  /** Naik tiap reset — kunci ulang animasi/komponen. */
  epoch: number
}

const PERSONA_KEY = 'csec-field-persona'
const PROJECT_KEY = 'csec-field-project'

const seed = (): DemoState => ({
  wirs: structuredClone(F_WIRS),
  findings: structuredClone(F_FINDINGS),
  reports: structuredClone(F_REPORTS),
  activities: structuredClone(F_ACTIVITIES),
  events: structuredClone(F_EVENTS),
  inbox: structuredClone(F_INBOX),
})

function initial<T>(key: string, fallback: T, valid: (v: string) => boolean): T {
  try {
    const saved = localStorage.getItem(key)
    if (saved && valid(saved)) return saved as unknown as T
  } catch { /* penyimpanan tidak tersedia */ }
  return fallback
}

const FieldContext = createContext<FieldState | null>(null)

export function useField() {
  const ctx = useContext(FieldContext)
  if (!ctx) throw new Error('useField harus dipakai di dalam FieldProvider')
  return ctx
}

export function FieldProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(seed)
  const [persona, setPersonaState] = useState<PersonaId>(() =>
    initial<PersonaId>(PERSONA_KEY, 'engineer', (v) => v === 'engineer' || v === 'qc'))
  const [projectId, setProjectIdState] = useState<string>(() =>
    normalizeProjectId(initial<string>(PROJECT_KEY, 'naw', (v) => ['naw', 'rko', 'gml', 'aru', 'ks', 'jk'].includes(v))))
  const [epoch, setEpoch] = useState(0)

  const persist = (key: string, value: string) => {
    try { localStorage.setItem(key, value) } catch { /* abaikan */ }
  }

  const setPersona = useCallback((p: PersonaId) => {
    setPersonaState(p)
    persist(PERSONA_KEY, p)
  }, [])

  const setProjectId = useCallback((id: string) => {
    const norm = normalizeProjectId(id)
    setProjectIdState(norm)
    persist(PROJECT_KEY, norm)
  }, [])

  const resetDemo = useCallback(() => {
    setState(seed())
    setEpoch((e) => e + 1)
  }, [])

  const value = useMemo<FieldState>(
    () => ({
      ...state,
      persona, setPersona,
      projectId, setProjectId,
      setWirs: (updater) => setState((s) => ({ ...s, wirs: typeof updater === 'function' ? (updater as (w: FWir[]) => FWir[])(s.wirs) : updater })),
      setFindings: (updater) => setState((s) => ({ ...s, findings: typeof updater === 'function' ? (updater as (f: FFinding[]) => FFinding[])(s.findings) : updater })),
      setReports: (updater) => setState((s) => ({ ...s, reports: typeof updater === 'function' ? (updater as (r: FReport[]) => FReport[])(s.reports) : updater })),
      setActivities: (updater) => setState((s) => ({ ...s, activities: typeof updater === 'function' ? (updater as (a: FActivity[]) => FActivity[])(s.activities) : updater })),
      setEvents: (updater) => setState((s) => ({ ...s, events: typeof updater === 'function' ? (updater as (e: FEvent[]) => FEvent[])(s.events) : updater })),
      setInbox: (updater) => setState((s) => ({ ...s, inbox: typeof updater === 'function' ? (updater as (i: FInboxItem[]) => FInboxItem[])(s.inbox) : updater })),
      resetDemo,
      epoch,
    }),
    [state, persona, projectId, setPersona, setProjectId, resetDemo, epoch],
  )

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}
