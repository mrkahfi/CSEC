/**
 * Format waktu Bahasa Indonesia (PRD SC-42):
 * tanggal & jam eksplisit, tanpa format ambigu.
 * Demo memakai zona waktu proyek: Asia/Jakarta (WIB).
 */

const dtf = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', ...opts })

export function formatDateTime(iso: string): string {
  return dtf({ day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    .format(new Date(iso))
    .replace('.', ':')
}

export function formatDate(iso: string): string {
  return dtf({ day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function formatTime(iso: string): string {
  return dtf({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso)).replace('.', ':')
}

/** Selisih waktu manusiawi: "2 jam lalu", "dalam 3 hari". */
export function formatRelative(iso: string, now = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime()
  const abs = Math.abs(diffMs)
  const mins = Math.round(abs / 60_000)
  const hrs = Math.round(mins / 60)
  const days = Math.round(hrs / 24)
  const fmt = (n: number, unit: string) =>
    diffMs < 0 ? `${n} ${unit} lalu` : `dalam ${n} ${unit}`
  if (mins < 1) return 'baru saja'
  if (mins < 60) return fmt(mins, 'menit')
  if (hrs < 24) return fmt(hrs, 'jam')
  if (days < 30) return fmt(days, 'hari')
  return fmt(Math.round(days / 30), 'bulan')
}

/** Usia catatan: "5 hari" — untuk kolom aging register. */
export function formatAge(iso: string, now = new Date()): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000)
  if (days < 1) {
    const hrs = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 3_600_000))
    return `${hrs} jam`
  }
  return `${days} hari`
}

/** Selisih hari dari sekarang (negatif = lewat). */
export function daysFromNow(iso: string, now = new Date()): number {
  return Math.floor((new Date(iso).getTime() - now.getTime()) / 86_400_000)
}
