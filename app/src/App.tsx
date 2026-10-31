import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/layout/AppShell'
import { Foundations } from '@/pages/Foundations'
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
 */
export default function App() {
  return (
    <DemoProvider>
      <ToastProvider>
        <HashRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<Ringkasan />} />
              <Route path="/proyek" element={<ProyekList />} />
              <Route path="/proyek/:id" element={<ProyekDetail />} />
              <Route path="/inspeksi" element={<InspeksiRegister />} />
              <Route path="/inspeksi/:id" element={<InspeksiDetail />} />
              <Route path="/temuan" element={<TemuanRegister />} />
              <Route path="/temuan/:id" element={<TemuanDetail />} />
              <Route path="/tindakan" element={<KotakTindakan />} />
              <Route path="/aktivitas" element={<Aktivitas />} />
              <Route path="/laporan" element={<Laporan />} />
              <Route path="/pengaturan" element={<Pengaturan />} />
              <Route path="/foundations" element={<Foundations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </HashRouter>
      </ToastProvider>
    </DemoProvider>
  )
}
