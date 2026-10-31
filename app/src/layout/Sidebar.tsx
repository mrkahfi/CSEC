import { NavLink } from 'react-router-dom'
import { CircleHelp, RotateCcw, Lock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/layout/Logo'
import { NAV } from '@/layout/nav'
import { useDemo } from '@/demo/DemoContext'
import { useToast } from '@/components/ui/Toast'
import { Tooltip } from '@/components/ui/Tooltip'
import { iconProps } from '@/components/Icon'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { resetDemo } = useDemo()
  const toast = useToast()

  return (
    <div className="flex h-full w-60 shrink-0 flex-col border-r border-line-subtle bg-surface">
      {/* Identitas produk */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <Logo size={30} />
        <div className="min-w-0">
          <p className="text-md leading-5 font-semibold tracking-tight text-ink">SiteOps</p>
          <p className="truncate text-xs text-ink-muted">Site Operations Dashboard</p>
        </div>
      </div>

      {/* Label lingkungan demo — wajib jelas (PRD §8) */}
      <div className="px-4 pb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-2xs font-semibold tracking-wider text-amber-800 uppercase">
          <Sparkles {...iconProps(11)} strokeWidth={2.4} />
          Data Demo
        </span>
      </div>

      {/* Navigasi primer */}
      <nav aria-label="Navigasi utama" className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
        {NAV.map((section) => (
          <div key={section.label} className="mb-3">
            <p className="px-2 pt-2 pb-1 text-2xs font-semibold tracking-wider text-ink-disabled uppercase">
              {section.label}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.exact}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-2.5 rounded-md px-2 py-[7px] text-sm font-medium',
                        'transition-colors duration-75',
                        isActive
                          ? 'bg-selected text-brand-700'
                          : 'text-ink-secondary hover:bg-hover hover:text-ink',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          {...iconProps(17)}
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive ? 'text-brand-600' : 'text-ink-muted group-hover:text-ink-secondary',
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.tag === 'otoritas' && (
                          <Tooltip content="Hanya peran berwenang">
                            <Lock {...iconProps(12)} className="shrink-0 text-ink-disabled" />
                          </Tooltip>
                        )}
                        {item.tag === 'p1' && (
                          <span className="rounded-full bg-sunken px-1.5 text-2xs leading-4 font-medium text-ink-muted">
                            P1
                          </span>
                        )}
                        {item.count !== undefined && (
                          <span
                            className={cn(
                              'tnum rounded-full px-1.5 text-2xs leading-4 font-medium tabular-nums',
                              isActive ? 'bg-brand-100 text-brand-800' : 'bg-sunken text-ink-muted',
                            )}
                          >
                            {item.count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Utilitas bawah */}
      <div className="border-t border-line-subtle p-3">
        <button
          type="button"
          onClick={() => {
            resetDemo()
            toast({ tone: 'info', title: 'Skenario demo direset', description: 'Semua status simulasi kembali ke titik awal.' })
          }}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-[7px] text-sm font-medium text-ink-secondary transition-colors hover:bg-hover hover:text-ink"
        >
          <RotateCcw {...iconProps(16)} className="text-ink-muted" />
          Reset Skenario Demo
        </button>
        <button
          type="button"
          onClick={() => toast({ tone: 'info', title: 'Panduan istilah (demo)', description: 'Glosarium WIR, hold point, NCR menyusul pada iterasi konten.' })}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-[7px] text-sm font-medium text-ink-secondary transition-colors hover:bg-hover hover:text-ink"
        >
          <CircleHelp {...iconProps(16)} className="text-ink-muted" />
          Panduan Istilah
        </button>
      </div>
    </div>
  )
}
