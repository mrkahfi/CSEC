import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/layout/AppShell'
import { Portal } from '@/portal/Portal'
import { FieldApp } from '@/field/FieldApp'
import { Ringkasan } from '@/pages/Ringkasan'
import { ProyekList } from '@/pages/ProyekList'
import { ProyekDetail } from '@/pages/ProyekDetail'
import { InspeksiRegister } from '@/pages/InspeksiRegister'
import { InspeksiDetail } from '@/pages/InspeksiDetail'
import { TemuanRegister } from '@/pages/TemuanRegister'
import { TemuanDetail } from '@/pages/TemuanDetail'
import { KotakTindakan } from '@/pages/KotakTindakan'
import { Aktivitas } from '@/pages/Aktivitas'
import { Laporan } from '@/pages/Laporan'
import { Pengaturan } from '@/pages/Pengaturan'
import { NotFound } from '@/pages/NotFound'
import { ToastProvider } from '@/components/ui/Toast'
import { DemoProvider } from '@/demo/DemoContext'

/**
 * HashRouter dipakai agar demo dapat dibuka langsung dari file/buka
 * tanpa konfigurasi server saat presentasi ke prospek.
 *
 * Struktur:
 * - `/`           : portal, entry point ke kedua modul
 * - `/dashboard`  : Site Operations Dashboard (web)
 * - `/field`      : Field Operations App (mobile, dalam phone frame)
 */

/** Modul dashboard web: rute utama di bawah /dashboard. */
function DashboardModule() {
  return (
    <AppShell>
      <Routes>
        <Route index element={<Ringkasan />} />
        <Route path="proyek" element={<ProyekList />} />
        <Route path="proyek/:id" element={<ProyekDetail />} />
        <Route path="inspeksi" element={<InspeksiRegister />} />
        <Route path="inspeksi/:id" element={<InspeksiDetail />} />
        <Route path="temuan" element={<TemuanRegister />} />
        <Route path="temuan/:id" element={<TemuanDetail />} />
        <Route path="tindakan" element={<KotakTindakan />} />
        <Route path="aktivitas" element={<Aktivitas />} />
        <Route path="laporan" element={<Laporan />} />
        <Route path="pengaturan" element={<Pengaturan />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}

export default function App() {
  return (
    <DemoProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Portal />} />
            <Route path="/dashboard/*" element={<DashboardModule />} />
            <Route path="/field/*" element={<FieldApp />} />
            <Route path="*" element={<Portal />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </DemoProvider>
  )
}
