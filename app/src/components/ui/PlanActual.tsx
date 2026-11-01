import { cn } from '@/lib/cn'
import type { ProgressPoint } from '@/demo/data'

/**
 * Progres aktual vs rencana — pola "emphasis": realisasi memakai
 * hue brand, rencana sebagai referensi abu (bukan palet kategorik).
 * Tingkat keparahan dibawa chip delta & badge kesehatan (ikon + teks),
 * bukan dari warna batang, sehingga tidak pernah color-alone.
 */

/* ------------------------------------------------------------
 * Meter: realisasi vs rencana
 * ------------------------------------------------------------ */

export function PlanActualBar({
  plan,
  actual,
  className,
  label,
}: {
  plan: number
  actual: number
  className?: string
  /** Nama metrik untuk aksesibilitas. */
  label?: string
}) {
  const a = Math.max(0, Math.min(100, actual))
  const p = Math.max(0, Math.min(100, plan))
  return (
    <div
      role="img"
      aria-label={label ?? `Realisasi ${a}% dari rencana ${p}%`}
      className={cn('relative h-2 w-full rounded-full bg-brand-100', className)}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
        style={{ width: `${a}%` }}
      />
      {/* Penanda target rencana — referensi netral, bukan bagian isi. */}
      <div
        aria-hidden
        className="absolute -top-0.5 bottom-[-2px] w-0.5 rounded-full bg-gray-500"
        style={{ left: `calc(${p}% - 1px)` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------
 * Chip delta realisasi vs rencana — teks token, arah = baik/buruk
 * ------------------------------------------------------------ */

export function PlanActualDelta({ plan, actual, className }: { plan: number; actual: number; className?: string }) {
  const d = actual - plan
  const neutral = d === 0
  return (
    <span
      className={cn(
        'tnum inline-flex items-center gap-0.5 text-xs font-medium',
        neutral ? 'text-ink-muted' : d < 0 ? 'text-red-700' : 'text-green-700',
        className,
      )}
      title="Selisih realisasi terhadap rencana (poin persen)"
    >
      {d > 0 ? '+' : ''}
      {d} poin vs rencana
    </span>
  )
}

/* ------------------------------------------------------------
 * Grafik mini 6 minggu: rencana (abu, putus-putus) vs realisasi
 * (brand, solid). Skala seragam, grid hairline, dot ujung ≥8px
 * dengan ring permukaan; tooltip per titik via <title>.
 * ------------------------------------------------------------ */

const VB_W = 320
const VB_H = 104
const PAD_X = 8
const PAD_TOP = 8
const PAD_BOTTOM = 14

export function PlanActualChart({ points, className }: { points: ProgressPoint[]; className?: string }) {
  if (points.length < 2) return null
  const values = points.flatMap((p) => [p.plan, p.actual])
  const min = Math.floor((Math.min(...values) - 4) / 10) * 10
  const max = Math.ceil((Math.max(...values) + 4) / 10) * 10
  const x = (i: number) => PAD_X + (i / (points.length - 1)) * (VB_W - PAD_X * 2)
  const y = (v: number) => PAD_TOP + (1 - (v - min) / (max - min)) * (VB_H - PAD_TOP - PAD_BOTTOM)
  const toPath = (key: 'plan' | 'actual') =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ')
  const last = points[points.length - 1]
  const ticks = [min, (min + max) / 2, max]

  return (
    <figure className={cn('m-0', className)}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-24 w-auto max-w-full"
        role="img"
        aria-label={`Progres 6 minggu terakhir: realisasi ${last.actual}% vs rencana ${last.plan}%. Titik per titik tersedia pada tooltip.`}
      >
        {/* Grid hairline solid — reseif, dengan label skala kecil */}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD_X} x2={VB_W - PAD_X} y1={y(t)} y2={y(t)} className="stroke-gray-200" strokeWidth={1} />
            <text x={VB_W - PAD_X} y={y(t) - 2} textAnchor="end" className="fill-gray-400 text-[8px]">
              {t}%
            </text>
          </g>
        ))}

        {/* Rencana — referensi abu putus-putus */}
        <path d={toPath('plan')} fill="none" className="stroke-gray-500" strokeWidth={2} strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Realisasi — emphasis brand */}
        <path d={toPath('actual')} fill="none" className="stroke-brand-500" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* Dot ujung dengan ring permukaan */}
        <circle cx={x(points.length - 1)} cy={y(last.actual)} r={4} className="fill-brand-500 stroke-gray-0" strokeWidth={2} />

        {/* Target hover yang lebih besar dari mark + tooltip natif */}
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={x(i)} cy={y(p.actual)} r={9} fill="transparent" className="cursor-help">
              <title>{`${p.label} · realisasi ${p.actual}% · rencana ${p.plan}%`}</title>
            </circle>
            <circle cx={x(i)} cy={y(p.plan)} r={9} fill="transparent" className="cursor-help">
              <title>{`${p.label} · rencana ${p.plan}% · realisasi ${p.actual}%`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-2xs text-ink-muted">
          <span aria-hidden className="h-0.5 w-4 rounded-full bg-brand-500" />
          Realisasi <span className="tnum font-semibold text-ink">{last.actual}%</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-2xs text-ink-muted">
          <span aria-hidden className="h-0 w-4 border-t-2 border-dashed border-gray-500" />
          Rencana <span className="tnum font-semibold text-ink">{last.plan}%</span>
        </span>
        <span className="text-2xs text-ink-disabled">{points.length} minggu terakhir</span>
      </figcaption>
    </figure>
  )
}
