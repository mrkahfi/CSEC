import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  UserCheck,
  CheckCircle2,
  Workflow,
  HelpCircle,
  Info,
  X,
} from 'lucide-react'
import { useDemo } from '@/demo/DemoContext'
import { DEMO_STEPS } from '@/demo/demoSteps'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { iconProps } from '@/components/Icon'
import { cn } from '@/lib/cn'

export function DemoTour({ onOpenGlossary }: { onOpenGlossary?: () => void }) {
  const {
    currentStep,
    setCurrentStep,
    autoPlay,
    setAutoPlay,
    resetDemo,
    isTourOpen,
    setIsTourOpen,
  } = useDemo()
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)

  const activeStep = DEMO_STEPS[currentStep - 1] ?? DEMO_STEPS[0]

  // Navigasi rute saat ganti langkah
  const goTo = (stepNum: number) => {
    setCurrentStep(stepNum)
    const target = DEMO_STEPS[stepNum - 1]
    if (target) {
      navigate(target.path)
    }
  }

  // Timer putar otomatis
  useEffect(() => {
    if (!autoPlay) return
    const timer = setTimeout(() => {
      if (currentStep < DEMO_STEPS.length) {
        goTo(currentStep + 1)
      } else {
        setAutoPlay(false)
      }
    }, 4500)
    return () => clearTimeout(timer)
  }, [autoPlay, currentStep])

  if (!isTourOpen) {
    return (
      <div className="border-b border-line-subtle bg-surface px-4 py-1.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsTourOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors cursor-pointer"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-50 text-brand-700 border border-brand-200">
              <Workflow {...iconProps(12)} />
            </span>
            <span>Buka Modul Demo Terpandu (9 Langkah)</span>
          </button>
          {onOpenGlossary && (
            <IconButton
              label="Panduan Istilah"
              icon={HelpCircle}
              size="sm"
              onClick={onOpenGlossary}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <aside aria-label="Modul Demo Terpandu" className="border-b border-line-subtle bg-surface/95 backdrop-blur-xs transition-all duration-150">
      <div className="mx-auto px-4 py-2 space-y-1.5">
        {/* HUD Ramping: Baris Kontrol Utama */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs">
              <Workflow {...iconProps(13)} />
            </span>

            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono font-bold tracking-tight text-ink uppercase">
                Demo
              </span>
              <Badge tone="brand" size="sm" className="font-mono">
                {currentStep}/{DEMO_STEPS.length}
              </Badge>
              {autoPlay && (
                <Badge tone="warning" size="sm" className="animate-pulse">
                  Otomatis
                </Badge>
              )}
              <span className="hidden lg:inline-flex items-center gap-1.5 rounded bg-sunken px-2 py-0.5 text-2xs font-medium text-ink-secondary border border-line-subtle">
                <UserCheck {...iconProps(11)} className="text-ink-muted" />
                <span className="font-semibold text-ink">{activeStep.personaName}</span>
                <span className="text-ink-muted">({activeStep.personaRole})</span>
              </span>
            </div>
          </div>

          {/* Kontrol Aksi Berbasis Ikon */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setAutoPlay(!autoPlay)}
              title={autoPlay ? 'Jeda otomatisasi' : 'Jalankan otomatis'}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-semibold shadow-2xs transition-colors cursor-pointer',
                autoPlay
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                  : 'bg-brand-600 text-white hover:bg-brand-700',
              )}
            >
              {autoPlay ? <Pause {...iconProps(12)} /> : <Play {...iconProps(12)} />}
              <span>{autoPlay ? 'Jeda' : 'Putar'}</span>
            </button>

            <div className="h-3.5 w-px bg-line-strong mx-0.5" />

            <IconButton
              label="Langkah sebelumnya"
              icon={ChevronLeft}
              size="sm"
              disabled={currentStep <= 1}
              onClick={() => goTo(currentStep - 1)}
            />

            <IconButton
              label="Langkah berikutnya"
              icon={ChevronRight}
              size="sm"
              disabled={currentStep >= DEMO_STEPS.length}
              onClick={() => goTo(currentStep + 1)}
            />

            <IconButton
              label="Reset ke Langkah 1"
              icon={RotateCcw}
              size="sm"
              onClick={resetDemo}
            />

            <div className="h-3.5 w-px bg-line-strong mx-0.5" />

            <IconButton
              label={showDetails ? 'Tutup panduan langkah' : 'Tampilkan panduan langkah'}
              icon={Info}
              size="sm"
              className={showDetails ? 'bg-brand-50 text-brand-700' : ''}
              onClick={() => setShowDetails(!showDetails)}
            />

            {onOpenGlossary && (
              <IconButton
                label="Panduan Istilah"
                icon={HelpCircle}
                size="sm"
                onClick={onOpenGlossary}
              />
            )}

            <IconButton
              label="Sembunyikan bilah demo"
              icon={X}
              size="sm"
              onClick={() => setIsTourOpen(false)}
            />
          </div>
        </div>

        {/* Pita Langkah Compact (1..9) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
          {DEMO_STEPS.map((s) => {
            const isCurrent = s.step === currentStep
            const isPassed = s.step < currentStep
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.step)}
                title={`${s.step}. ${s.title}`}
                className={cn(
                  'flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-2xs font-medium transition-colors cursor-pointer',
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-xs font-semibold'
                    : isPassed
                      ? 'bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200/60'
                      : 'bg-sunken text-ink-muted hover:bg-hover hover:text-ink border border-line-subtle',
                )}
              >
                {isPassed ? (
                  <CheckCircle2 {...iconProps(10)} className="text-brand-600" />
                ) : (
                  <span className={cn('h-3 w-3 rounded-full flex items-center justify-center text-[8px] font-bold', isCurrent ? 'bg-white/20' : 'bg-line-strong text-ink-secondary')}>
                    {s.step}
                  </span>
                )}
                <span>{s.shortLabel}</span>
              </button>
            )
          })}
        </div>

        {/* Kartu Panduan Skenario (Hanya muncul jika diaktifkan via tombol Info) */}
        {showDetails && (
          <div className="rounded-xl border border-line-subtle bg-sunken/80 p-3.5 text-xs space-y-2.5 animate-in fade-in duration-100">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink text-sm">{activeStep.title}</span>
                <span className="font-mono text-2xs text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded">
                  {activeStep.path}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-2xs text-ink-secondary">
                <UserCheck {...iconProps(13)} className="text-ink-muted" />
                <span>Simulasi Peran:</span>
                <span className="font-semibold text-ink">{activeStep.personaName}</span>
                <span className="text-ink-muted">({activeStep.personaRole})</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 text-2xs">
              <div className="space-y-1 rounded-lg bg-surface p-2.5 border border-line-subtle">
                <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">Tujuan Langkah</span>
                <p className="text-ink-secondary leading-relaxed">{activeStep.goal}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-surface p-2.5 border border-line-subtle">
                <span className="font-bold text-ink-muted uppercase tracking-wider text-[10px]">Tindakan di Layar</span>
                <p className="text-ink-secondary leading-relaxed">{activeStep.action}</p>
              </div>
              <div className="space-y-1 rounded-lg bg-surface p-2.5 border border-line-subtle">
                <span className="font-bold text-brand-700 uppercase tracking-wider text-[10px]">Nilai Bisnis Operasi</span>
                <p className="text-ink leading-relaxed font-semibold">{activeStep.takeaway}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
