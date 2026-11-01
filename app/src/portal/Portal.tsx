import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  FileText,
  HardHat,
  Inbox,
  LayoutDashboard,
  Monitor,
  Smartphone,
} from 'lucide-react'
import { Logo } from '@/layout/Logo'
import { iconProps } from '@/components/Icon'
import { cn } from '@/lib/cn'

/**
 * Portal demo: entry point tunggal ke dua modul produk (PRD Field Ops §18).
 * Satu produk, dua antarmuka: dashboard web untuk manajemen,
 * aplikasi lapangan mobile untuk eksekutor.
 */

/** Mockup mini browser untuk kartu dashboard — murni dekoratif. */
function BrowserMock() {
  return (
    <div aria-hidden className="w-full overflow-hidden rounded-t-xl border border-b-0 border-line-subtle bg-surface shadow-xs">
      <div className="flex items-center gap-1.5 border-b border-line-subtle px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        <span className="h-2 w-2 rounded-full bg-gray-300" />
        <span className="ml-2 h-3.5 flex-1 rounded-sm bg-sunken" />
      </div>
      <div className="flex">
        <div className="hidden w-14 flex-col gap-1.5 border-r border-line-subtle p-2 sm:flex">
          {[LayoutDashboard, Building2, ClipboardCheck, FileText, Inbox].map((I, i) => (
            <span key={i} className={cn('flex h-5 items-center justify-center rounded-sm', i === 0 ? 'bg-tone-brand-bg text-brand-600' : 'text-gray-300')}>
              <I size={11} strokeWidth={2} />
            </span>
          ))}
        </div>
        <div className="flex-1 space-y-1.5 p-3">
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-sm border border-line-subtle p-1.5">
                <div className="h-1 w-6 rounded-full bg-gray-200" />
                <div className={cn('mt-1 h-2.5 w-4 rounded-full', i === 1 ? 'bg-amber-300' : 'bg-brand-200')} />
              </div>
            ))}
          </div>
          <div className="flex gap-1.5">
            <div className="h-10 flex-1 rounded-sm bg-sunken" />
            <div className="h-10 flex-1 rounded-sm border border-line-subtle" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Mockup mini phone untuk kartu aplikasi lapangan — murni dekoratif. */
function PhoneMock() {
  return (
    <div aria-hidden className="mx-auto w-36 rounded-[1.4rem] border-[5px] border-gray-900 bg-surface shadow-md">
      <div className="overflow-hidden rounded-[0.95rem]">
        <div className="flex items-center justify-between bg-surface px-2.5 pt-1.5">
          <span className="text-[7px] font-semibold text-ink">09:41</span>
          <span className="h-2 w-8 rounded-full bg-gray-900" />
          <span className="text-[7px] text-ink-muted">100%</span>
        </div>
        <div className="space-y-1.5 p-2">
          <div className="rounded-md bg-tone-brand-bg p-1.5">
            <div className="h-1 w-14 rounded-full bg-brand-300" />
            <div className="mt-1 h-1 w-9 rounded-full bg-brand-200" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[HardHat, ClipboardCheck, FileText, Inbox].map((I, i) => (
              <div key={i} className="flex items-center gap-1 rounded-md border border-line-subtle p-1.5 text-gray-400">
                <I size={9} strokeWidth={2} />
                <div className="h-0.5 flex-1 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
          <div className="space-y-1 rounded-md border border-line-subtle p-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={cn('h-1.5 w-1.5 rounded-full', i === 1 ? 'bg-amber-400' : 'bg-green-400')} />
                <div className="h-0.5 flex-1 rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-around border-t border-line-subtle px-2 py-1.5 text-gray-300">
          {[LayoutDashboard, HardHat, ClipboardCheck, Inbox].map((I, i) => (
            <I key={i} size={9} strokeWidth={2} className={i === 2 ? 'text-brand-600' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}

const MODULES = [
  {
    to: '/dashboard',
    icon: Monitor,
    label: 'Modul Web',
    name: 'Site Operations Dashboard',
    desc: 'Kendali eksekusi lintas proyek: progres vs rencana, kesehatan proyek, dan tindak lanjut temuan — dari laporan lapangan hingga keputusan manajemen.',
    cta: 'Buka Dashboard',
    mock: <BrowserMock />,
  },
  {
    to: '/field',
    icon: Smartphone,
    label: 'Modul Mobile',
    name: 'Field Operations App',
    desc: 'Laporan harian, progres pekerjaan, pengajuan inspeksi, dan tindak lanjut temuan di lapangan.',
    cta: 'Buka Aplikasi Lapangan',
    mock: <PhoneMock />,
  },
] as const

export function Portal() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* Bar atas */}
      <header className="border-b border-line-subtle bg-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-4 lg:px-8">
          <Logo size={28} />
          <div className="min-w-0">
            <p className="text-md leading-5 font-semibold tracking-tight text-ink">CSEC Demo</p>
            <p className="text-xs leading-4 text-ink-muted">Construction Site Execution &amp; Quality Workflow</p>
          </div>
          <span className="ml-auto inline-flex h-6.5 shrink-0 items-center rounded-full border border-tone-warning-border bg-tone-warning-bg px-2.5 text-xs font-medium text-tone-warning-text">
            Data demo
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 lg:px-8 lg:py-14">
        {/* Hero */}
        <div className="max-w-2xl">
          <h1 className="text-display font-bold tracking-tight text-ink">
            Satu produk, dua antarmuka
          </h1>
          <p className="mt-3 max-w-xl text-md text-ink-secondary">
            Eksekusi pekerjaan dan mutu di lapangan, terhubung dengan pengawasan
            manajemen di kantor. Pilih modul untuk memulai demo.
          </p>
        </div>

        {/* Kartu modul */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line-subtle bg-surface shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md"
            >
              <div className="border-b border-line-subtle bg-gradient-to-b from-sunken/60 to-surface px-6 pt-6">
                {m.mock}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tone-brand-bg text-brand-600">
                    <m.icon {...iconProps(18)} />
                  </span>
                  <span className="text-2xs font-semibold tracking-wider text-ink-muted uppercase">{m.label}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink group-hover:text-brand-700">
                  {m.name}
                </h2>
                <p className="mt-1.5 text-md leading-relaxed text-ink-secondary">{m.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-md font-semibold text-brand-700">
                  {m.cta}
                  <ArrowRight {...iconProps(16)} strokeWidth={2.2} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-line-subtle bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4 text-xs text-ink-muted lg:px-8">
          <span>Seluruh data, notifikasi, dan tindakan bersifat simulasi untuk demo UI.</span>
          <span className="ml-auto tnum">v1.0 · Okt 2026</span>
        </div>
      </footer>
    </div>
  )
}
