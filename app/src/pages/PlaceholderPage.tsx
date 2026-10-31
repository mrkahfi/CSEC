import type { LucideIcon } from 'lucide-react'
import { Hammer } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/ui/PageHeader'
import { PageBody } from '@/components/ui/PageBody'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { NAV } from '@/layout/nav'

/** Halaman yang belum dibangun pada iterasi foundation. */
export function PlaceholderPage() {
  const { pathname } = useLocation()
  const item = NAV.flatMap((s) => s.items).find((i) => i.to === pathname)
  const IconCmp: LucideIcon = item?.icon ?? Hammer

  return (
    <div>
      <PageHeader
        title={item?.label ?? 'Halaman'}
        description="Bagian dari lingkup demo (PRD §6.1), dibangun pada iterasi berikutnya setelah fondasi design system."
      />
      <PageBody className="pt-10">
        <EmptyState
          icon={IconCmp}
          title="Sedang dalam pembangunan"
          description={
            <>
              Iterasi ini menuntaskan <strong>fondasi design system</strong>: token, tipografi,
              ikonografi, dan komponen umum. Layar fungsional untuk {item?.label ?? 'bagian ini'} menyusul
              dengan data seed yang konsisten.
            </>
          }
          actions={
            <Button variant="secondary" onClick={() => window.history.back()}>
              Kembali
            </Button>
          }
        />
      </PageBody>
    </div>
  )
}
