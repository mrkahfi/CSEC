import { useEffect, useState, type ReactNode } from 'react'
import { PanelLeft } from 'lucide-react'
import { Sidebar } from '@/layout/Sidebar'
import { Topbar } from '@/layout/Topbar'
import { SearchPalette } from '@/layout/SearchPalette'
import { DemoTour } from '@/demo/DemoTour'
import { GlossaryModal } from '@/components/GlossaryModal'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/cn'

/**
 * Kerangka aplikasi: sidebar tetap di desktop, drawer di tablet,
 * topbar sticky dengan pencarian & persona demo.
 * Desktop-first, tetap terpakai di tablet (PRD §14.3).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [glossaryOpen, setGlossaryOpen] = useState(false)

  /* ⌘K / Ctrl+K membuka palet pencarian global (FR-SE-04). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block">
        <Sidebar onOpenGlossary={() => setGlossaryOpen(true)} />
      </aside>

      {/* Drawer tablet */}
      <div
        className={cn('fixed inset-0 z-50 lg:hidden', drawerOpen ? '' : 'pointer-events-none')}
        aria-hidden={!drawerOpen}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gray-950/45 transition-opacity duration-200',
            drawerOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 shadow-xl transition-transform duration-200 ease-out',
            drawerOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <Sidebar
            onNavigate={() => setDrawerOpen(false)}
            onOpenGlossary={() => setGlossaryOpen(true)}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar: tetap di atas; konten menggulir di bawahnya */}
        <div className="z-30 flex shrink-0 items-center">
          <div className="pl-2 lg:hidden">
            <IconButton label="Buka navigasi" icon={PanelLeft} onClick={() => setDrawerOpen(true)} />
          </div>
          <Topbar onOpenSearch={() => setSearchOpen(true)} />
        </div>

        {/* Modul Otomasi & Panduan Demo §15.3 */}
        <DemoTour onOpenGlossary={() => setGlossaryOpen(true)} />

        {/* Konten halaman */}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Palet pencarian global (⌘K) */}
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Panduan Istilah & Konvensi Proyek */}
      <GlossaryModal open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  )
}
