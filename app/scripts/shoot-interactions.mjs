/* Screenshot interaksi: dialog konfirmasi, dialog rilis, layout tablet. */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = new URL('./shots/', import.meta.url).pathname
const browser = await chromium.launch({ channel: 'chrome', headless: true })

// Dialog di desktop
let page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 400)))
await page.goto(`${BASE}/#/foundations`, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: /Catat Rilis Hold Point/ }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}dlg-release.png` })
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

await page.getByRole('button', { name: /Tolak Pengajuan \(konfirmasi\)/ }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}dlg-confirm.png` })
await page.keyboard.press('Escape')
await page.close()
console.log('✓ dialogs')

// Tablet
page = await browser.newPage({ viewport: { width: 834, height: 1112 }, deviceScaleFactor: 2 })
await page.goto(`${BASE}/#/foundations`, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)
await page.screenshot({ path: `${OUT}tablet-top.png` })
await page.close()
console.log('✓ tablet')

await browser.close()
console.log('done')
