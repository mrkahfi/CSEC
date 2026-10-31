/* Screenshot semua halaman demo + tangkap error console/pageerror. */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = new URL('./shots/', import.meta.url).pathname

const ROUTES = [
  ['ringkasan', '/'],
  ['proyek', '/proyek'],
  ['proyek-aru', '/proyek/aru'],
  ['proyek-aru-hold', '/proyek/aru?titik=hp-ar-02'],
  ['proyek-arsip', '/proyek/bl'],
  ['inspeksi', '/inspeksi'],
  ['inspeksi-review', '/inspeksi?set=review'],
  ['inspeksi-0142', '/inspeksi/wir-ar-0142'],
  ['inspeksi-0088', '/inspeksi/wir-ks-0088'],
  ['inspeksi-0027', '/inspeksi/wir-jk-0027'],
  ['temuan', '/temuan'],
  ['temuan-ar021', '/temuan/f-ar-021'],
  ['tindakan', '/tindakan'],
  ['aktivitas', '/aktivitas'],
  ['laporan', '/laporan'],
  ['pengaturan', '/pengaturan'],
  ['foundations', '/foundations'],
  ['404', '/tidak-ada'],
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
