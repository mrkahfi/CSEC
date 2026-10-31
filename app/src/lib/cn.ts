import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Gabungkan kelas Tailwind dengan resolving konflik. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
