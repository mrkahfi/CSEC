import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/layout/AppShell'
import { Foundations } from '@/pages/Foundations'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { ToastProvider } from '@/components/ui/Toast'
import { DemoProvider } from '@/demo/DemoContext'

/**
 * HashRouter dipakai agar demo dapat dibuka langsung dari file/buka
 * tanpa konfigurasi server saat presentasi ke prospek.
 */
export default function App() {
  return (
    <DemoProvider>
      <ToastProvider>
        <HashRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<PlaceholderPage />} />
              <Route path="/foundations" element={<Foundations />} />
              <Route path="*" element={<PlaceholderPage />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </ToastProvider>
    </DemoProvider>
  )
}
