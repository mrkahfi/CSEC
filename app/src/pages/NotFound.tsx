import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

/** Halaman tidak ditemukan — state dirancang, bukan layar putih. */
export function NotFound() {
  const navigate = useNavigate()
  return (
    <EmptyState
      icon={Compass}
      title="Halaman tidak ditemukan"
      description="Tautan tidak dikenali pada demo. Semua rute demo tersedia lewat navigasi kiri."
      actions={
        <Button variant="secondary" onClick={() => navigate('/')}>
          Kembali ke Ringkasan
        </Button>
      }
      className="py-24"
    />
  )
}
