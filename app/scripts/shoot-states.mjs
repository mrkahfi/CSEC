/* Screenshot state interaktif: palet pencarian, dialog keputusan, dialog rilis, notifikasi, tablet. */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = new URL('./shots/', import.meta.url).pathname
const browser = await chromium.launch({ channel: 'chrome', headless: true })

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 400)))

// 1. Palet pencarian global (⌘K)
await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.keyboard.press('Meta+k')
await page.waitForTimeout(250)
await page.keyboard.type('WIR')
await page.waitForTimeout(350)
await page.screenshot({ path: `${OUT}st-palette.png` })
console.log('✓ palette')
await page.keyboard.press('Escape')

// 2. Notifikasi menu
await page.getByRole('button', { name: /Notifikasi demo/ }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}st-notifikasi.png` })
console.log('✓ notifikasi')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

// 3. Detail inspeksi sebagai QA/QC Inspector → dialog keputusan
// (ganti peran mendaratkan ke halaman per peran §8.1 — kembali ke detail setelahnya)
await page.getByRole('button', { name: 'Menu pengguna dan ganti peran demo' }).click()
await page.waitForTimeout(200)
await page.getByRole('menuitem', { name: /QA\/QC Inspector/ }).click()
await page.waitForTimeout(400)
await page.goto(`${BASE}/#/inspeksi/wir-ar-0142`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.screenshot({ path: `${OUT}st-inspeksi-qc.png` })
console.log('✓ inspeksi peran QC')
await page.getByRole('button', { name: /Perlu Perbaikan/ }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}st-dlg-keputusan.png` })
console.log('✓ dialog keputusan')
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

// 4. Ganti ke Quality Manager → dialog rilis hold point (terblokir kondisi)
await page.getByRole('button', { name: 'Menu pengguna dan ganti peran demo' }).click()
await page.waitForTimeout(200)
await page.getByRole('menuitem', { name: /Quality Manager/ }).click()
await page.waitForTimeout(400)
await page.goto(`${BASE}/#/inspeksi/wir-ar-0142`, { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.getByRole('button', { name: /Catat Rilis/ }).click()
await page.waitForTimeout(300)
await page.screenshot({ path: `${OUT}st-dlg-rilis.png` })
console.log('✓ dialog rilis')
await page.keyboard.press('Escape')

// 5. Tablet
const tab = await browser.newPage({ viewport: { width: 834, height: 1112 }, deviceScaleFactor: 2 })
await tab.goto(`${BASE}/#/inspeksi/wir-ar-0142`, { waitUntil: 'networkidle' })
await tab.waitForTimeout(900)
await tab.screenshot({ path: `${OUT}st-tablet-inspeksi.png` })
console.log('✓ tablet')
await tab.close()

await browser.close()
console.log('done')
