import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDemo } from '@/demo/DemoContext'

/**
 * Simulasi pemuatan (PRD §14.3): skeleton singkat setiap kali
 * rute berubah atau skenario di-reset: murni presentasi.
 */
export function useSimulatedLoading(ms = 600) {
  const { pathname } = useLocation()
  const { scenarioEpoch } = useDemo()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
  }, [pathname, scenarioEpoch, ms])
  return loading
}
