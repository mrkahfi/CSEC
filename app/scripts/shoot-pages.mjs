/* Screenshot semua halaman demo + tangkap error console/pageerror. */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = new URL('./shots/', import.meta.url).pathname

const ROUTES = [
  ['ringkasan', '/dashboard/'],
  ['proyek', '/dashboard/proyek'],
  ['proyek-aru', '/dashboard/proyek/aru'],
  ['proyek-aru-hold', '/dashboard/proyek/aru?titik=hp-ar-02'],
  ['proyek-arsip', '/dashboard/proyek/bl'],
  ['inspeksi', '/dashboard/inspeksi'],
  ['inspeksi-review', '/dashboard/inspeksi?set=review'],
  ['inspeksi-0142', '/dashboard/inspeksi/wir-ar-0142'],
  ['inspeksi-0088', '/dashboard/inspeksi/wir-ks-0088'],
  ['inspeksi-0027', '/dashboard/inspeksi/wir-jk-0027'],
  ['temuan', '/dashboard/temuan'],
  ['temuan-ar021', '/dashboard/temuan/f-ar-021'],
  ['tindakan', '/dashboard/tindakan'],
  ['aktivitas', '/dashboard/aktivitas'],
  ['laporan', '/dashboard/laporan'],
  ['pengaturan', '/dashboard/pengaturan'],
  ['404', '/dashboard/tidak-ada'],
]

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })

page.on('console', (m) => {
  if (m.type() === 'error') console.log('[console]', m.text().slice(0, 300))
})
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 500)))

for (const [name, path] of ROUTES) {
  await page.goto(`${BASE}/#${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000) // loading tersimulasi 600 ms + settle
  await page.screenshot({ path: `${OUT}page-${name}.png` })
  // Halaman panjang: main menggulir internal — ambil juga bagian bawah.
  const scrollable = await page.evaluate(() => {
    const m = document.querySelector('main')
    return !!m && m.scrollHeight > m.clientHeight + 120
  })
  if (scrollable) {
    await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 999999))
    await page.waitForTimeout(250)
    await page.screenshot({ path: `${OUT}page-${name}-b.png` })
    await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 0))
  }
  console.log('✓', name)
}

await browser.close()
console.log('done')
