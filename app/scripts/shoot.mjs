/* Screenshot per seksi + tangkap error console. */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = new URL('./shots/', import.meta.url).pathname

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })

page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) console.log('[console]', m.type(), m.text().slice(0, 300))
})
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 500)))

await page.goto(`${BASE}/#/foundations`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)

for (const id of ['prinsip', 'warna', 'tipografi', 'ikonografi', 'status', 'komponen', 'tabel', 'pola']) {
  const el = page.locator(`#${id}`)
  if ((await el.count()) === 0) {
    console.log('✗ seksi tidak ditemukan:', id)
    continue
  }
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(250)
  await page.screenshot({ path: `${OUT}sec-${id}.png` })
  console.log('✓ sec-' + id)
}

await browser.close()
console.log('done')
