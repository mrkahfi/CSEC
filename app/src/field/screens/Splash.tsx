import { useNavigate } from 'react-router-dom'
import { ArrowRight, BadgeCheck, FlaskConical, HardHat, SearchCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { iconProps } from '@/components/Icon'
import { Logo } from '@/layout/Logo'
import { useField } from '@/field/FieldContext'
import { PERSONAS, fProject, type PersonaId } from '@/field/data'

/* ============================================================
 * FO-01 Splash / demo entry + FO-02 pemilihan persona
 * ============================================================ */

function Hero({ onEnter, personaName }: { onEnter: () => void; personaName?: string }) {
  return (
    <div className="flex h-full flex-col justify-between px-6 pt-10 pb-6">
      <div className="flex flex-col items-center pt-6 text-center">
        <Logo size={56} />
        <h1 className="mt-5 text-xl font-bold tracking-tight text-ink">Field Operations App</h1>
        <p className="mt-2 max-w-64 text-md leading-relaxed text-ink-secondary">
          Catat pekerjaan di lapangan, ajukan inspeksi, tindak lanjuti temuan.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-tone-warning-border bg-tone-warning-bg px-3 py-1 text-xs font-medium text-tone-warning-text">
          <FlaskConical {...iconProps(13)} />
          Prototype · Data demo
        </span>
      </div>
      <div className="space-y-2.5">
        {personaName && (
          <button
            type="button"
            onClick={onEnter}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 text-md font-semibold text-white shadow-xs transition-colors active:bg-brand-800"
          >
            Lanjutkan sebagai {personaName}
            <ArrowRight {...iconProps(16)} strokeWidth={2.2} />
          </button>
        )}
        <button
          type="button"
          onClick={() => { window.location.hash = '#/field/mulai' }}
          className={cn(
            'flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-md font-semibold transition-colors',
            personaName
              ? 'border border-line bg-surface text-ink-secondary active:bg-hover'
              : 'bg-brand-600 text-white shadow-xs active:bg-brand-800',
          )}
        >
          Masuk ke Demo
        </button>
        <p className="pt-2 text-center text-2xs leading-4 text-ink-disabled">
          Semua catatan, notifikasi, dan tindakan adalah simulasi.
        </p>
      </div>
    </div>
  )
}

function PersonaCard({ id, onSelect, active }: { id: PersonaId; onSelect: (id: PersonaId) => void; active?: boolean }) {
  const p = PERSONAS[id]
  const IconCmp = id === 'engineer' ? HardHat : SearchCheck
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        'w-full cursor-pointer rounded-xl border bg-surface p-4 text-left shadow-xs transition-all',
        active ? 'border-brand-500 ring-4 ring-brand-500/15' : 'border-line-subtle active:bg-hover',
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-tone-brand-bg text-brand-600">
          <IconCmp {...iconProps(19)} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-md font-semibold text-ink">{p.name}</p>
          <p className="truncate text-sm text-ink-muted">{p.role}</p>
        </div>
        {active && <BadgeCheck {...iconProps(17)} className="shrink-0 text-brand-600" />}
      </div>
      <p className="mt-3 text-sm leading-5 text-ink-secondary">{p.responsibility}</p>
      <p className="mt-2 truncate text-xs text-ink-muted">
        Proyek: {p.projectIds.map((pid) => fProject(pid).name).join(' · ')}
      </p>
    </button>
  )
}

export function Splash({ step }: { step?: 'persona' }) {
  const navigate = useNavigate()
  const { persona, setPersona, setProjectId } = useField()

  if (step !== 'persona') {
    return (
      <div className="h-full overflow-y-auto bg-surface">
        <Hero onEnter={() => navigate('/field/home')} personaName={PERSONAS[persona].name} />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-canvas px-5 pt-4 pb-6">
      <h1 className="text-lg font-semibold tracking-tight text-ink">Pilih persona demo</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Dua pengalaman peran dalam satu aplikasi. Bisa diganti kapan saja.
      </p>
      <div className="mt-5 space-y-3">
        <PersonaCard id="engineer" active={persona === 'engineer'} onSelect={(id) => {
          setPersona(id)
          setProjectId(PERSONAS[id].projectIds[0])
          navigate('/field/home')
        }} />
        <PersonaCard id="qc" active={persona === 'qc'} onSelect={(id) => {
          setPersona(id)
          setProjectId(PERSONAS[id].projectIds[0])
          navigate('/field/home')
        }} />
      </div>
      <button
        type="button"
        onClick={() => { window.location.hash = '#/field' }}
        className="mt-4 h-11 w-full cursor-pointer rounded-xl text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        Kembali
      </button>
      <p className="mt-2 text-center text-2xs leading-4 text-ink-disabled">
        Pengganti persona adalah kemudahan demo, bukan pengaturan akses nyata.
      </p>
    </div>
  )
}
