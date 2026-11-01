/* Screenshot portal + dashboard + seluruh layar modul field (mobile) + tangkap error. */
import { chromium } from 'playwright-core'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const OUT = new URL('./shots/', import.meta.url).pathname

const browser = await chromium.launch({ channel: 'chrome', headless: true })

async function shoot(name, route, { persona = 'engineer', project = 'aru', w = 414, h = 896 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  await ctx.addInitScript(([p, pr]) => {
    localStorage.setItem('csec-field-persona', p)
    localStorage.setItem('csec-field-project', pr)
  }, [persona, project])
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console]', name, m.text().slice(0, 300)) })
  page.on('pageerror', (e) => console.log('[pageerror]', name, String(e).slice(0, 500)))
  await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}field-${name}.png`, fullPage: h > 896 })
  console.log('✓', name)
  await ctx.close()
}

/* Portal & dashboard (desktop) */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console] portal', m.text().slice(0, 300)) })
  page.on('pageerror', (e) => console.log('[pageerror] portal', String(e).slice(0, 500)))
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}field-portal.png` })
  console.log('✓ portal')
  await page.goto(`${BASE}/#/dashboard`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${OUT}field-dash-ringkasan.png` })
  console.log('✓ dash-ringkasan')
  await ctx.close()
}

/* Field: engineer (Andi Pratama) */
const ENGINEER = [
  ['splash', '/field'],
  ['persona', '/field/mulai'],
  ['home', '/field/home'],
  ['proyek', '/field/proyek'],
  ['proyek-aru', '/field/proyek/aru'],
  ['pekerjaan', '/field/pekerjaan'],
  ['pekerjaan-detail', '/field/pekerjaan/act-ar-1'],
  ['pekerjaan-progres', '/field/pekerjaan/act-ar-1/progres'],
  ['laporan', '/field/laporan'],
  ['laporan-baru', '/field/laporan/baru'],
  ['laporan-detail', '/field/laporan/rpt-1030'],
  ['laporan-returned', '/field/laporan/rpt-1028'],
  ['inspeksi', '/field/inspeksi'],
  ['inspeksi-baru', '/field/inspeksi/baru'],
  ['inspeksi-024', '/field/inspeksi/wir-024'],
  ['inspeksi-026-draft', '/field/inspeksi/wir-026'],
  ['temuan', '/field/temuan'],
  ['temuan-008', '/field/temuan/fnd-008'],
  ['temuan-008-tindakan', '/field/temuan/fnd-008/tindakan'],
  ['inbox', '/field/inbox'],
  ['kendala', '/field/kendala/baru'],
  ['material', '/field/material/baru'],
  ['lainnya', '/field/lainnya'],
]

for (const [name, route] of ENGINEER) {
  await shoot(name, route)
}

/* Field: QC (Rina Maharani, proyek Klinik Sentosa) */
const QC = [
  ['qc-home', '/field/home'],
  ['qc-proyek', '/field/proyek/ks'],
  ['qc-inspeksi', '/field/inspeksi'],
  ['qc-inspeksi-012', '/field/inspeksi/wir-012'],
  ['qc-inspeksi-018', '/field/inspeksi/wir-018'],
  ['qc-kerja', '/field/inspeksi/wir-025/kerja'],
  ['qc-temuan', '/field/temuan'],
  ['qc-temuan-004', '/field/temuan/fnd-004'],
  ['qc-temuan-004-verifikasi', '/field/temuan/fnd-004/verifikasi'],
]

for (const [name, route] of QC) {
  await shoot(name, route, { persona: 'qc', project: 'ks' })
}

/* Galeri, dokumen, laporan KS untuk QC */
await shoot('qc-galeri', '/field/galeri', { persona: 'qc', project: 'ks' })
await shoot('qc-dokumen', '/field/dokumen', { persona: 'qc', project: 'ks' })
await shoot('galeri', '/field/galeri')
await shoot('dokumen', '/field/dokumen')

await browser.close()
console.log('done')
