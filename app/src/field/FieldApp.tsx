import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  ArrowLeft, BatteryFull, ClipboardCheck, HardHat, House, Inbox as InboxIcon,
  LayoutGrid, Signal, Smartphone, Wifi,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { FieldProvider, useField } from '@/field/FieldContext'
import { SheetProvider } from '@/field/ui'
import { PERSONAS } from '@/field/data'
import { Splash } from '@/field/screens/Splash'
import { Home } from '@/field/screens/Home'
import { ProjectSelector, ProjectOverview } from '@/field/screens/Projects'
import { WorkList, WorkDetail, ProgressForm } from '@/field/screens/Work'
import { ReportList, ReportWizard, ReportDetail } from '@/field/screens/Reports'
import { InspectionList, InspectionCreate, InspectionDetail, Conduct } from '@/field/screens/Inspections'
import { FindingList, FindingDetail, FindingRespond, FindingVerify } from '@/field/screens/Findings'
import { Gallery } from '@/field/screens/Gallery'
import { Docs } from '@/field/screens/Docs'
import { Inbox } from '@/field/screens/Inbox'
import { More, KendalaForm, MaterialForm } from '@/field/screens/More'

/* ============================================================
 * FIELD OPERATIONS APP — modul mobile dalam phone frame
 * ------------------------------------------------------------
 * Desktop: pratinjau perangkat rasio 9:17 di tengah kanvas.
 * Layar kecil: aplikasi memenuhi layar tanpa bezel.
 * ============================================================ */

/** Jam status bar mengikuti waktu nyata (Asia/Jakarta). */
function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(t)
  }, [])
  return (
    <span className="tnum text-xs font-semibold text-ink">
      {new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).format(now).replace('.', ':')}
    </span>
  )
}

function StatusBar() {
  return (
    <div className="relative z-10 flex h-10 shrink-0 items-center justify-between bg-surface px-6 pt-1">
      <Clock />
      {/* Dynamic island — bagian dari frame perangkat */}
      <span aria-hidden className="absolute top-1.5 left-1/2 h-6.5 w-26 -translate-x-1/2 rounded-full bg-gray-950" />
      <span aria-hidden className="flex items-center gap-1 text-ink">
        <Signal {...iconProps(14)} />
        <Wifi {...iconProps(14)} />
        <BatteryFull {...iconProps(16)} />
      </span>
    </div>
  )
}

const NAV = [
  { to: '/field/home', label: 'Beranda', icon: House },
  { to: '/field/pekerjaan', label: 'Pekerjaan', icon: HardHat },
  { to: '/field/inspeksi', label: 'Inspeksi', icon: ClipboardCheck },
  { to: '/field/inbox', label: 'Inbox', icon: InboxIcon },
  { to: '/field/lainnya', label: 'Lainnya', icon: LayoutGrid },
] as const

function BottomNav() {
  const { wirs, inbox, persona, projectId } = useField()
  const openCount = wirs.filter((w) =>
    w.projectId === projectId &&
    ['submitted', 'scheduled', 'correction_required', 'reinspection_requested'].includes(w.status),
  ).length
  const inboxCount = inbox.filter((i) => i.to === persona).length

  const badgeFor = (to: string) => {
    if (to === '/field/inbox' && inboxCount > 0) return inboxCount
    if (to === '/field/inspeksi' && openCount > 0) return openCount
    return null
  }

  return (
    <nav aria-label="Navigasi utama" className="relative z-10 shrink-0 border-t border-line-subtle bg-surface/95 pb-1 backdrop-blur">
      <div className="flex items-stretch">
        {NAV.map((n) => {
          const badge = badgeFor(n.to)
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/field/home'}
              className={({ isActive }) => cn(
                'flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 pt-1.5 text-ink-muted transition-colors',
                isActive ? 'text-brand-700' : 'active:bg-hover',
              )}
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <n.icon {...iconProps(21)} strokeWidth={isActive ? 2.2 : 1.9} />
                    {badge !== null && (
                      <span className="tnum absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none font-bold text-white ring-2 ring-surface">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span className={cn('text-[11px] leading-none', isActive && 'font-semibold')}>{n.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
      {/* Home indicator perangkat */}
      <div aria-hidden className="mx-auto my-1 hidden h-1 w-28 rounded-full bg-gray-900/80 md:block" />
    </nav>
  )
}

/** Rute imersif (wizard, alur kerja) tanpa navigasi bawah. */
function useShowNav(path: string) {
  const sub = path.replace(/^\/field/, '') || '/'
  if (sub === '/' || sub === '/mulai') return false
  return !/\/(baru|progres|kerja|tindakan|verifikasi)$/.test(sub)
}

function FieldInner() {
  const { pathname } = useLocation()
  const showNav = useShowNav(pathname)
  return (
    <SheetProvider>
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          <Routes>
            <Route index element={<Splash />} />
            <Route path="mulai" element={<Splash step="persona" />} />
            <Route path="home" element={<Home />} />
            <Route path="proyek" element={<ProjectSelector />} />
            <Route path="proyek/:id" element={<ProjectOverview />} />
            <Route path="pekerjaan" element={<WorkList />} />
            <Route path="pekerjaan/:id" element={<WorkDetail />} />
            <Route path="pekerjaan/:id/progres" element={<ProgressForm />} />
            <Route path="laporan" element={<ReportList />} />
            <Route path="laporan/baru" element={<ReportWizard />} />
            <Route path="laporan/:id" element={<ReportDetail />} />
            <Route path="inspeksi" element={<InspectionList />} />
            <Route path="inspeksi/baru" element={<InspectionCreate />} />
            <Route path="inspeksi/:id" element={<InspectionDetail />} />
            <Route path="inspeksi/:id/kerja" element={<Conduct />} />
            <Route path="temuan" element={<FindingList />} />
            <Route path="temuan/:id" element={<FindingDetail />} />
            <Route path="temuan/:id/tindakan" element={<FindingRespond />} />
            <Route path="temuan/:id/verifikasi" element={<FindingVerify />} />
            <Route path="galeri" element={<Gallery />} />
            <Route path="dokumen" element={<Docs />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="lainnya" element={<More />} />
            <Route path="kendala/baru" element={<KendalaForm />} />
            <Route path="material/baru" element={<MaterialForm />} />
          </Routes>
        </div>
        {showNav && <BottomNav />}
      </div>
    </SheetProvider>
  )
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'relative mx-auto flex w-full flex-col overflow-hidden bg-canvas',
        // Tinggi mengikuti viewport, lebar diturunkan dari rasio 9:17 —
        // di jendela pendek frame menyusut proporsional, tidak jadi gepeng.
        'h-dvh md:h-[min(756px,calc(100dvh-6.5rem))] md:w-auto md:aspect-[9/17]',
        'md:rounded-[2.9rem] md:border-[10px] md:border-gray-950 md:shadow-2xl',
      )}
    >
      <StatusBar />
      {children}
    </div>
  )
}

export function FieldApp() {
  return (
    <FieldProvider>
      {/* Chrome modul di desktop; di layar kecil aplikasi langsung penuh */}
      <div className="flex min-h-dvh flex-col bg-gradient-to-b from-gray-100 to-canvas md:h-dvh md:overflow-hidden">
        <header className="hidden shrink-0 items-center gap-3 border-b border-line-subtle bg-surface px-5 py-2.5 md:flex">
          <button
            type="button"
            onClick={() => { window.location.hash = '#/' }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-hover hover:text-ink"
          >
            <ArrowLeft {...iconProps(15)} /> Portal
          </button>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Smartphone {...iconProps(15)} className="text-brand-600" />
            Field Operations App
          </span>
          <span className="ml-auto inline-flex h-6 items-center rounded-full border border-tone-warning-border bg-tone-warning-bg px-2.5 text-xs font-medium text-tone-warning-text">
            Demo · {PERSONAS.engineer.name.split(' ')[0]} &amp; {PERSONAS.qc.name.split(' ')[0]}
          </span>
        </header>
        <div className="flex min-h-0 flex-1 items-center justify-center md:p-6">
          <PhoneFrame>
            <FieldInner />
          </PhoneFrame>
        </div>
      </div>
    </FieldProvider>
  )
}
