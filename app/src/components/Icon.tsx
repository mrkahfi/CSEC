import type { LucideIcon, LucideProps } from 'lucide-react'

/**
 * Ikon sistem: stroke monokrom yang mewarisi `currentColor`,
 * sehingga ikon selalu mengikuti warna teks konteksnya —
 * bukan ikon simbol beraneka warna.
 *
 * Sumber path: set ikon Lucide (MIT). Konsistensi dicapai lewat
 * `iconProps()` / `<Icon as={...} />` yang memetakan ukuran →
 * ketebalan stroke:
 *
 * - 14 px, stroke 2.0 : inline teks kecil, chip
 * - 16 px, stroke 1.9 : badge, menu, tabel
 * - 18 px, stroke 1.8 : tombol, input (default)
 * - 20 px, stroke 1.7 : navigasi, header kartu
 * - 24 px, stroke 1.6 : empty state / ilustrasi
 */

const SIZE_TO_STROKE: Record<number, number> = {
  12: 2.1,
  14: 2,
  16: 1.9,
  18: 1.8,
  20: 1.7,
  24: 1.6,
  32: 1.4,
  48: 1.25,
}

export type IconSize = number

/** Properti siap-pakai untuk komponen ikon Lucide apa pun. */
export function iconProps(size: IconSize = 18, strokeWidth?: number) {
  return {
    size,
    strokeWidth: strokeWidth ?? SIZE_TO_STROKE[size] ?? 1.8,
    absoluteStrokeWidth: false,
  } as const
}

export interface IconProps extends Omit<LucideProps, 'size' | 'strokeWidth'> {
  /** Komponen ikon Lucide. */
  as: LucideIcon
  /** Ukuran dalam px. Default 18. */
  size?: IconSize
  /** Override ketebalan stroke bila perlu (jarang). */
  strokeWidth?: number
}

/** Pemakaian deklaratif: <Icon as={Send} size={16} /> */
export function Icon({ as: Cmp, size = 18, strokeWidth, ...props }: IconProps) {
  const p = iconProps(size, strokeWidth)
  return <Cmp size={p.size} strokeWidth={p.strokeWidth} aria-hidden focusable="false" {...props} />
}

export type { LucideIcon }
