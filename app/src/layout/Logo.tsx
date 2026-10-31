/** Logo produk: tumpukan lapisan pekerjaan + verifikasi. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" fill="var(--color-brand-600)" />
      <path d="M16 6.5 L25.5 11.25 16 16 6.5 11.25Z" fill="#fff" />
      <path
        d="M8 15.4 L16 19.4 24 15.4"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.66"
      />
      <path
        d="M8 20 L16 24 24 20"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.34"
      />
    </svg>
  )
}
