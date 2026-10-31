import { useState, type ReactNode } from 'react'
import {
  LayoutDashboard, Building2, ClipboardList, ClipboardCheck, Flag, History, BarChart3, Settings2,
  Search, SearchCheck, Bell, HardHat, Milestone, MapPin, Layers, CalendarDays, CalendarClock, CalendarX,
  Clock, Timer, Hourglass, Send, Eye, EyeOff, FileText, FileSearch, FileWarning, FilePenLine,
  Paperclip, Printer, Download, Link2, Copy, Pencil, Trash2, Plus, Filter, SlidersHorizontal,
  ArrowUpDown, ChevronDown, ChevronRight, ArrowRight, ExternalLink, MoreHorizontal, X, Check,
  CircleCheck, CircleX, TriangleAlert, OctagonAlert, Info, CircleHelp, Ban, Undo2, RefreshCw,
  Replace, Scale, Wrench, UserPlus, Users, UserCheck, BadgeCheck, ShieldCheck, Lock, LockOpen,
  Stamp, CirclePause, CircleDashed, MessageSquare, MessageCircleQuestion, Inbox, Activity,
  TrendingUp, RotateCcw, Camera, Image, FolderOpen, Construction, Sparkles, Landmark, ScanSearch,
  AlarmClock, CircleEllipsis, ChevronsUpDown, type LucideIcon,
} from 'lucide-react'

import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Field, Input, Textarea, Select } from '@/components/ui/Input'
import { Checkbox, Switch } from '@/components/ui/Checkbox'
import { SearchInput } from '@/components/ui/SearchInput'
import { Tabs } from '@/components/ui/Tabs'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableHeaderCell, TableRow, MonoCell,
} from '@/components/ui/Table'
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog'
import { Menu } from '@/components/ui/Menu'
import { Tooltip } from '@/components/ui/Tooltip'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton'
import { Callout } from '@/components/ui/Callout'
import { Timeline } from '@/components/ui/Timeline'
import { StatTile } from '@/components/ui/StatTile'
import { Pagination } from '@/components/ui/Pagination'
import { Kbd } from '@/components/ui/Kbd'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import {
  INSPECTION_STATUS, FINDING_STATUS, FINDING_CLASSIFICATION, HOLD_POINT_STATUS, POINT_TYPE,
  type StatusDef,
} from '@/components/status'
import { iconProps } from '@/components/Icon'

/* ============================================================
   Pembantu tata letak styleguide
   ============================================================ */

function Section({
  id, eyebrow, title, description, children,
}: { id: string; eyebrow: string; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-line-subtle pt-10 first:border-0 first:pt-0">
      <p className="text-2xs font-semibold tracking-wider text-brand-600 uppercase">{eyebrow}</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{title}</h2>
      {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-ink">{children}</h3>
}

const TOC = [
  ['prinsip', 'Prinsip'],
  ['warna', 'Warna'],
  ['tipografi', 'Tipografi'],
  ['ikonografi', 'Ikonografi'],
  ['status', 'Status Domain'],
  ['komponen', 'Komponen'],
  ['tabel', 'Tabel Register'],
  ['pola', 'Pola & Aturan'],
] as const

/* ============================================================
   Halaman Foundations
   ============================================================ */

export function Foundations() {
  const [tab, setTab] = useState('register')
  const [seg, setSeg] = useState<'semua' | 'aktif' | 'selesai'>('semua')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | false>('asc')

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <PageHeader
        breadcrumbs={[{ label: 'Design System' }]}
        title="Foundations"
        meta={<Badge tone="brand" dot>v0.1 — Foundation</Badge>}
        description="Fondasi visual Site Operations Dashboard: token warna, tipografi, ikonografi, kosakata status domain, dan komponen umum. Halaman ini hidup — setiap komponen baru wajib terdaftar di sini sebelum dipakai di layar."
        className="rounded-xl border border-line-subtle pr-5 pb-4 shadow-xs"
      />

      {/* Daftar isi */}
      <nav aria-label="Daftar isi" className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {TOC.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-sm font-medium text-ink-muted transition-colors hover:text-brand-700"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 flex flex-col gap-10 pb-16">
        {/* ======================================================
            01 — PRINSIP
            ====================================================== */}
        <Section
          id="prinsip"
          eyebrow="01 — Prinsip"
          title="Keputusan desain yang mengikat"
          description="Enam aturan ini diturunkan dari prinsip produk (PRD §5) dan berlaku untuk setiap layar."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, t: 'Status bukan otorisasi', d: '“Diterima” ≠ “Dirilis”. Rilis hold point selalu tampil terpisah dengan otoritasnya.' },
              { icon: Eye, t: 'Bukan warna saja', d: 'Setiap status wajib membawa label teks + ikon. Warna hanya penguat (FR-IN-07).' },
              { icon: MessageSquare, t: 'Kosakata tunggal', d: 'Satu katalog status untuk dashboard, register, dan detail — tanpa sinonim.' },
              { icon: TriangleAlert, t: 'Pengecualian kelas satu', d: 'Ditolak, terblokir, terlambat, diperkarakan dirancang sejak awal — bukan selain happy path.' },
              { icon: CircleHelp, t: 'Kosong ≠ sehat', d: 'Empty state menjelaskan konteks dan menawarkan reset filter, bukan mengesankan aman.' },
              { icon: Sparkles, t: 'Demo selalu berlabel', d: 'Setiap data, notifikasi, dan keputusan diberi label simulasi secara eksplisit.' },
            ].map((p) => (
              <Card key={p.t} className="p-4" padded>
                <span className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-tone-brand-bg text-brand-600">
                  <p.icon {...iconProps(17)} strokeWidth={1.9} />
                </span>
                <p className="text-md font-semibold text-ink">{p.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{p.d}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ======================================================
            02 — WARNA
            ====================================================== */}
        <Section
          id="warna"
          eyebrow="02 — Warna"
          title="Primitif → semantik → tone status"
          description="Netral sejuk sebagai kanvas, kobalt untuk aksi, dan lima tone status. Nilai dirujuk lewat peran semantik (bg-surface, text-ink-secondary) — bukan warna mentah."
        >
          <div className="flex flex-col gap-6">
            <div>
              <SubTitle>Brand — aksi primer, tautan, fokus papan ketik</SubTitle>
              <ScaleStrip name="brand" steps={BRAND_STEPS} values={BRAND} />
            </div>
            <div>
              <SubTitle>Netral — kanvas, permukaan, teks, garis</SubTitle>
              <ScaleStrip name="gray" steps={GRAY_STEPS} values={GRAY} />
            </div>
            <div>
              <SubTitle>Tone status</SubTitle>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {STATUS_TONES.map((t) => (
                  <div key={t.name} className={`rounded-lg border p-3.5 ${t.cls}`}>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <span className={`inline-block h-2 w-2 rounded-full ${t.dot}`} />
                      {t.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed opacity-85">{t.usage}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <StatusBadge size="sm" status={t.sample} />
                      <StatusBadge size="sm" emphasis="strong" status={t.sample} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'bg-canvas / surface', cls: 'bg-surface', desc: 'Kanvas aplikasi vs kartu' },
                { label: 'bg-sunken', cls: 'bg-sunken', desc: 'Sumur: header tabel, wel' },
                { label: 'bg-selected', cls: 'bg-selected', desc: 'Baris/terpilih' },
              ].map((s) => (
                <div key={s.label} className="overflow-hidden rounded-lg border border-line-subtle">
                  <div className={`${s.cls} h-12 border-b border-line-subtle`} />
                  <div className="bg-surface px-3 py-2">
                    <p className="font-mono text-xs text-ink">{s.label}</p>
                    <p className="text-xs text-ink-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ======================================================
            03 — TIPOGRAFI
            ====================================================== */}
        <Section
          id="tipografi"
          eyebrow="03 — Tipografi"
          title="Inter Variable + JetBrains Mono"
          description="Inter untuk seluruh UI (base 14 px — aplikasi operasional padat data), JetBrains Mono untuk ID permintaan, revisi dokumen, chainage, dan waktu pada jejak audit. Angka di tabel memakai tabular figures (.tnum)."
        >
          <Card className="divide-y divide-line-subtle">
            {[
              { cls: 'text-display', name: 'Display', spec: '28 / 34 · Bold 700 · -2%', sample: 'Rilis Hold Point' },
              { cls: 'text-2xl', name: 'Judul Halaman', spec: '22 / 30 · SemiBold 650 · -1.5%', sample: 'Register Inspeksi — Gedung Aruna' },
              { cls: 'text-xl', name: 'Judul Seksi', spec: '18 / 28 · SemiBold · -1%', sample: 'Ringkasan Workflow Proyek' },
              { cls: 'text-lg', name: 'Judul Kartu', spec: '16 / 24 · SemiBold', sample: 'Temuan Terbuka' },
              { cls: 'text-md', name: 'Body Besar', spec: '15 / 24 · Regular', sample: 'Paket pekerjaan menunggu persetujuan konsultan.' },
              { cls: 'text-base', name: 'Body (default)', spec: '14 / 20 · Regular', sample: 'Permintaan inspeksi diajukan dengan 6 foto bukti dan checklist terisi.' },
              { cls: 'text-sm', name: 'Tabel / Label', spec: '13 / 20 · Regular', sample: 'Perkakas tulangan Lantai 7 — Grid C/4-7' },
              { cls: 'text-xs', name: 'Caption', spec: '12 / 18 · Regular', sample: 'Definisi: kalender, bukan jam kerja.' },
              { cls: 'text-2xs uppercase tracking-wider', name: 'Overline', spec: '11 / 16 · SemiBold · uppercase', sample: 'Kotak Tindakan' },
              { cls: 'font-mono text-sm', name: 'Mono', spec: '13 / 20 · JetBrains Mono', sample: 'WIR-AR-2026-0142 · Sta 1+200 · R2' },
            ].map((t) => (
              <div key={t.name} className="px-5 py-4">
                <p className="text-xs font-medium text-ink-muted">
                  {t.name} <span className="ml-1.5 font-mono text-2xs text-ink-disabled">{t.spec}</span>
                </p>
                <p className={`mt-1.5 truncate text-ink ${t.cls}`}>{t.sample}</p>
              </div>
            ))}
          </Card>
        </Section>

        {/* ======================================================
            04 — IKONOGRAFI
            ====================================================== */}
        <Section
          id="ikonografi"
          eyebrow="04 — Ikonografi"
          title="Stroke monokrom, satu keluarga"
          description="Seluruh ikon menggambar dengan stroke dan mewarisi currentColor — tidak ada ikon simbol berwarna. Ketebalan mengikuti ukuran (16→1.9, 18→1.8, 20→1.7) agar bobot optik konsisten. Sumber path: Lucide (MIT) dengan wrapper sizing sendiri."
        >
          <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-line-subtle bg-surface px-4 py-3 text-sm text-ink-secondary">
            <span className="flex items-center gap-1.5"><Ban {...iconProps(15)} className="text-red-500" /> Tanpa warna tetap</span>
            <span className="flex items-center gap-1.5"><Check {...iconProps(15)} className="text-green-600" /> currentColor</span>
            <span className="flex items-center gap-1.5">
              Grid 24 · <Kbd>16px</Kbd> <Kbd>18px</Kbd> <Kbd>20px</Kbd>
            </span>
          </div>
          <Card className="grid grid-cols-3 gap-px overflow-hidden bg-line-subtle sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {ICON_SHOWCASE.map((I) => (
              <div key={I.name} className="flex flex-col items-center gap-1.5 bg-surface px-2 py-4 transition-colors hover:bg-hover">
                <I.cmp {...iconProps(20)} className="text-ink-secondary" />
                <span className="max-w-full truncate font-mono text-[10.5px] text-ink-disabled" title={I.name}>
                  {I.name}
                </span>
              </div>
            ))}
          </Card>
        </Section>

        {/* ======================================================
            05 — STATUS DOMAIN
            ====================================================== */}
        <Section
          id="status"
          eyebrow="05 — Status Domain"
          title="Katalog status tunggal"
          description="Kosakata status dari PRD §10 — dipetakan ke lima tone + ikon. Label Bahasa Indonesia dapat dikonfigurasi per proyek; yang tidak berubah adalah struktur label + ikon + tone."
        >
          <div className="flex flex-col gap-4">
            <StatusCatalog
              title="Permintaan Inspeksi (WIR/RFI)"
              desc="Siklus hidup permintaan — termasuk loop perbaikan & klarifikasi (PRD §10.1)"
              items={Object.values(INSPECTION_STATUS)}
            />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatusCatalog
                title="Klasifikasi Temuan"
                desc="Fakta ≠ klasifikasi ≠ disposisi (FR-FA-03)"
                items={Object.values(FINDING_CLASSIFICATION)}
                compact
              />
              <StatusCatalog
                title="Jenis Titik Inspeksi"
                desc="Hold / Witness / Review / Surveillance (FR-HP-01)"
                items={Object.values(POINT_TYPE)}
                compact
              />
            </div>
            <StatusCatalog
              title="Status Temuan"
              desc="Terbuka → ditugaskan → tindakan → verifikasi → tutup; verifikasi gagal kembali aktif (PRD §10.2)"
              items={Object.values(FINDING_STATUS)}
            />
            <StatusCatalog
              title="Hold Point"
              desc="“Diterima” tidak merilis hold point — rilis butuh otoritas terpisah (PRD §10.3). Hold point memakai emphasis kuat."
              items={Object.values(HOLD_POINT_STATUS)}
              strong
            />
          </div>
        </Section>

        {/* ======================================================
            06 — KOMPONEN
            ====================================================== */}
        <Section
          id="komponen"
          eyebrow="06 — Komponen"
          title="Komponen umum"
          description="Blok bangunan seluruh layar. Setiap state (hover, aktif, disabled, fokus, loading, error) dirancang — bukan ditambahkan belakangan."
        >
          <div className="flex flex-col gap-6">
            {/* Tombol */}
            <Card>
              <CardHeader title="Tombol" description="Primary maksimal satu per konteks. Aksi destruktif memakai merah dan selalu dikonfirmasi." />
              <CardBody className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="primary" leftIcon={Send}>Ajukan Inspeksi</Button>
                  <Button variant="secondary" leftIcon={Filter}>Filter</Button>
                  <Button variant="subtle" leftIcon={Plus}>Tambah Catatan</Button>
                  <Button variant="ghost">Batal</Button>
                  <Button variant="danger" leftIcon={Ban}>Tolak Pengajuan</Button>
                  <Button variant="primary" loading>Memproses…</Button>
                  <Button variant="primary" disabled>Nonaktif</Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="secondary" leftIcon={Download}>Ekspor</Button>
                  <Button size="xs" variant="subtle">Detail</Button>
                  <IconButton label="Unduh" icon={Download} variant="secondary" />
                  <IconButton label="Cetak" icon={Printer} />
                  <IconButton label="Hapus" icon={Trash2} className="hover:bg-red-50 hover:text-red-700" />
                  <Tooltip content="Tooltip di atas pemicu">
                    <Button variant="ghost" leftIcon={CircleHelp}>Arahkan ke saya</Button>
                  </Tooltip>
                </div>
              </CardBody>
            </Card>

            {/* Form */}
            <Card>
              <CardHeader title="Masukan & Form" description="Label wajib, hint menjelaskan aturan proyek, error menyebut perbaikannya." />
              <CardBody className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="ID / Referensi Permintaan" htmlFor="f-id" hint="Nomor otomatis mengikuti format proyek.">
                  <Input id="f-id" defaultValue="WIR-AR-2026-0142" readOnly className="font-mono" />
                </Field>
                <Field label="Lokasi Pekerjaan" htmlFor="f-loc" required hint="Bangun · lantai · grid, atau chainage (SC-42).">
                  <Input id="f-loc" placeholder="mis. Lantai 7 — Grid C/4-7" />
                </Field>
                <Field label="Reviewer" htmlFor="f-rev" required error="Pilih reviewer yang berwenang untuk hold point ini.">
                  <Select id="f-rev" defaultValue="" invalid>
                    <option value="" disabled>Pilih reviewer…</option>
                    <option>Sari Wulandari — QA/QC</option>
                    <option>Ratna Dewi — Quality Manager</option>
                  </Select>
                </Field>
                <Field label="Cari catatan" htmlFor="f-search">
                  <SearchInput id="f-search" placeholder="Cari dalam riwayat…" />
                </Field>
                <Field label="Alasan (wajib untuk keputusan)" htmlFor="f-note" hint="Direkam pada riwayat — tidak dapat disunting senyap (FR-RV-05).">
                  <Textarea id="f-note" placeholder="Jelaskan alasan keputusan…" />
                </Field>
                <div className="flex flex-col justify-center gap-3.5">
                  <Checkbox label="Sertakan checklist terisi" description="Prasyarat hold point (SC-01)." defaultChecked />
                  <Checkbox label="Perlukan NCR terpisah" description="Hanya bila prosedur proyek mengharuskan (FR-RV-03)." />
                  <Switch label="Peringatkan saya sebelum jatuh tempo" description="Notifikasi simulasi (FR-NO-04)." defaultChecked />
                </div>
              </CardBody>
            </Card>

            {/* Navigasi lokal */}
            <Card>
              <CardHeader title="Navigasi Lokal" description="Tab untuk konteks, segmented control untuk pindah view." />
              <CardBody className="flex flex-col gap-5">
                <Tabs
                  label="Contoh tab"
                  value={tab}
                  onChange={setTab}
                  items={[
                    { id: 'register', label: 'Register', count: 12 },
                    { id: 'temuan', label: 'Temuan', count: 5 },
                    { id: 'holdpoint', label: 'Hold Point', count: 1 },
                    { id: 'riwayat', label: 'Riwayat' },
                  ]}
                />
                <div className="flex flex-wrap items-center gap-4">
                  <SegmentedControl
                    label="Filter cepat"
                    value={seg}
                    onChange={setSeg}
                    options={[
                      { value: 'semua', label: 'Semua', count: 12 },
                      { value: 'aktif', label: 'Aktif', count: 4 },
                      { value: 'selesai', label: 'Selesai', count: 8 },
                    ]}
                  />
                  <Breadcrumb items={[{ label: 'Proyek', to: '#' }, { label: 'Gedung Aruna', to: '#' }, { label: 'WIR-AR-2026-0142' }]} />
                </div>
              </CardBody>
            </Card>

            {/* Umpan balik */}
            <Card>
              <CardHeader title="Umpan Balik & Overlay" description="Dialog konfirmasi untuk aksi tak terurungkan; toast untuk hasil; callout untuk disclaimer." />
              <CardBody className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="danger" leftIcon={Ban} onClick={() => setConfirmOpen(true)}>
                    Tolak Pengajuan (konfirmasi)
                  </Button>
                  <Button variant="secondary" leftIcon={Stamp} onClick={() => setDialogOpen(true)}>
                    Catat Rilis Hold Point
                  </Button>
                  <Menu
                    items={[
                      { label: 'Tindakan Record', items: [
                        { id: 'edit', label: 'Sunting draf', icon: Pencil },
                        { id: 'dup', label: 'Duplikat', icon: Copy },
                        { id: 'link', label: 'Tautkan temuan', icon: Link2 },
                      ] },
                      'divider',
                      { id: 'del', label: 'Tarik pengajuan', icon: Undo2, destructive: true },
                    ]}
                    trigger={({ toggle }) => (
                      <Button variant="ghost" rightIcon={ChevronDown} onClick={toggle}>
                        Menu Konteks
                      </Button>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <Callout tone="warning" icon={OctagonAlert} title="Hold point belum dirilis">
                    Inspeksi <strong>diterima</strong>, tetapi aktivitas berikutnya (pengecoran beton)
                    menunggu rilis dari Quality Manager. <em>Accepted ≠ Released.</em>
                  </Callout>
                  <Callout tone="info" icon={Sparkles} title="Lingkungan demo">
                    Seluruh data, notifikasi, dan keputusan pada layar ini adalah simulasi —
                    tidak ada persistensi atau integrasi nyata.
                  </Callout>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-line-subtle p-4">
                    <SubTitle>Skeleton — pemuatan</SubTitle>
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 pt-1">
                        <SkeletonText lines={3} />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-line-subtle p-0">
                    <EmptyState
                      size="sm"
                      icon={Search}
                      title="Tidak ada catatan yang cocok"
                      description="Filter Anda: status “Diterima” + lokasi “Lantai 8”. Tidak berarti pekerjaan sehat — coba longgarkan filter."
                      actions={
                        <>
                          <Button size="sm" variant="secondary">Reset filter</Button>
                          <Button size="sm" variant="ghost">Ubah filter</Button>
                        </>
                      }
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Identitas & metrik */}
            <Card>
              <CardHeader title="Metrik & Orang" description="StatTile menjelaskan definisi metrik di footnote (PRD §12) dan dapat diklik menuju register terfilter (FR-OV-03)." />
              <CardBody className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <StatTile label="Menunggu Review" value={4} icon={ClipboardCheck} delta={{ value: '+2', direction: 'up' }} onClick={() => {}} footnote="Permintaan dengan aksi review terpasang" />
                  <StatTile label="Perlu Perbaikan" value={3} icon={FileWarning} emphasis="warning" footnote="Dikembalikan ke pengirim" />
                  <StatTile label="Tindakan Overdue" value={2} icon={AlarmClock} emphasis="danger" delta={{ value: '1 hari', direction: 'up' }} onClick={() => {}} footnote="Due lewat, belum ditunda resmi" />
                  <StatTile label="Hold Point Belum Dirilis" value={1} icon={Lock} emphasis="danger" onClick={() => {}} footnote="Menunggu otoritas rilis" />
                </div>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center -space-x-1.5">
                    <Avatar name="Andi Prasetyo" size="md" />
                    <Avatar name="Sari Wulandari" size="md" />
                    <Avatar name="Budi Santoso" size="md" />
                    <Avatar name="Hendra Kusuma" size="md" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line-subtle bg-surface text-xs font-medium text-ink-muted">+2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name="Ratna Dewi" size="sm" />
                    <div>
                      <p className="text-sm leading-4 font-medium text-ink">Ratna Dewi</p>
                      <p className="text-xs text-ink-muted">Quality Manager · otoritas rilis hold point</p>
                    </div>
                  </div>
                  <Pagination page={2} pageSize={10} total={42} onPageChange={() => {}} itemLabel="permintaan" />
                </div>
              </CardBody>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader
                title="Riwayat Aktivitas"
                description="Jejak kronologis: aktor, peran, waktu, dan alasan. Demo — bukan log audit formal (FR-AU-04)."
                actions={<Badge icon={History}>Simulasi</Badge>}
              />
              <CardBody className="max-w-3xl">
                <Timeline items={DEMO_TIMELINE} />
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* ======================================================
            07 — TABEL REGISTER
            ====================================================== */}
        <Section
          id="tabel"
          eyebrow="07 — Tabel Register"
          title="Register inspeksi — pola tabel inti"
          description="Pola tabel terpadat: referensi mono, lokasi granular, jenis titik, status berikon, pemilik aksi berikutnya, dan umur. Hover menunjukkan baris dapat dibuka; hold point ditekankan tanpa hanya mengandalkan warna."
        >
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <SearchInput placeholder="Cari ID, lokasi, pengirim…" className="w-64" aria-label="Cari register" />
                <Button size="sm" variant="secondary" leftIcon={SlidersHorizontal}>
                  Filter
                  <span className="tnum ml-1 rounded-full bg-brand-50 px-1.5 text-2xs text-brand-700">3</span>
                </Button>
              </div>
              <Button size="sm" variant="secondary" leftIcon={Download}>Ekspor</Button>
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell width="150">Referensi</TableHeaderCell>
                    <TableHeaderCell>Aktivitas & Lokasi</TableHeaderCell>
                    <TableHeaderCell width="130">Jenis Titik</TableHeaderCell>
                    <TableHeaderCell width="170">Status</TableHeaderCell>
                    <TableHeaderCell>Aksi Berikutnya</TableHeaderCell>
                    <TableHeaderCell width="90" align="right" sortable sortDirection={sortDir} onSort={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}>
                      Umur
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DEMO_REGISTER.map((row) => (
                    <TableRow key={row.ref} clickable tabIndex={0}>
                      <MonoCell>{row.ref}</MonoCell>
                      <TableCell>
                        <p className="font-medium text-ink">{row.activity}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-ink-muted">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <MapPin {...iconProps(11)} className="shrink-0" />
                            {row.location}
                          </span>
                          <span aria-hidden className="text-gray-300">·</span>
                          <span className="whitespace-nowrap">{row.project}</span>
                        </p>
                      </TableCell>
                      <TableCell><StatusBadge size="sm" status={row.type} /></TableCell>
                      <TableCell>
                        <StatusBadge
                          size="sm"
                          status={row.status}
                          emphasis={row.emphasis ? 'strong' : 'subtle'}
                        />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{row.nextAction}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                          <Avatar name={row.owner} size="xs" />
                          {row.owner}
                          {row.due && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span className={row.overdue ? 'tnum font-medium text-red-700' : 'tnum'}>
                                {row.due}
                              </span>
                            </>
                          )}
                        </p>
                      </TableCell>
                      <TableCell align="right" className="tnum text-ink-secondary">{row.age}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="border-t border-line-subtle px-4 py-3">
              <Pagination page={1} pageSize={6} total={12} onPageChange={() => {}} itemLabel="permintaan" />
            </div>
          </Card>
        </Section>

        {/* ======================================================
            08 — POLA & ATURAN
            ====================================================== */}
        <Section
          id="pola"
          eyebrow="08 — Pola & Aturan"
          title="Aturan pemakaian"
          description="Ringkasan keputusan yang menjaga konsistensi antar layar."
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card padded>
              <SubTitle>Lakukan</SubTitle>
              <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
                {[
                  'Tampilkan status berikutnya + pemiliknya, bukan hanya status kini (FR §14.1).',
                  'Sertakan definisi pada setiap metrik portofolio (PRD §12).',
                  'Gunakan mono untuk referensi: WIR-…, R2, Sta 1+200.',
                  'Waktu eksplisit: 13 Okt 2026 09:00 WIB — tanpa format ambigu (SC-42).',
                  'Konfirmasi dialog untuk penolakan, pembatalan, dan rilis (§14.3).',
                  'Empty state + reset filter di semua register (SC-44).',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <Check {...iconProps(15)} strokeWidth={2.2} className="mt-0.5 shrink-0 text-green-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
            <Card padded>
              <SubTitle>Hindari</SubTitle>
              <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
                {[
                  'Mengartikan status “Diterima” sebagai izin lanjut kerja (Prinsip §5.2).',
                  'Ikon berwarna-warni / Material Symbols — ikon mengikuti currentColor.',
                  'Warna sebagai satu-satunya isyarat status (FR-IN-07).',
                  'Menyamakan penolakan administratif dengan NCR (FR-RV-03).',
                  'Grafik dekoratif — dashboard utamakan pengecualian yang butuh tindakan (§14.2).',
                  'Menyembunyikan riwayat keputusan lama saat koreksi (FR-RV-05).',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <X {...iconProps(15)} strokeWidth={2.2} className="mt-0.5 shrink-0 text-red-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          <Card padded className="mt-3">
            <SubTitle>Spasi, radius, bayangan</SubTitle>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="mb-1.5 font-mono text-2xs text-ink-disabled">radius: xs 4 / sm 6 / md 8 / lg 10 / xl 12</p>
                <div className="flex items-center gap-2">
                  {[4, 6, 8, 10, 12].map((r) => (
                    <span key={r} className="h-10 w-10 border border-line-strong bg-surface" style={{ borderRadius: r }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-2xs text-ink-disabled">shadow: xs / sm / md / lg</p>
                <div className="flex items-center gap-3">
                  {['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg'].map((s) => (
                    <span key={s} className={`h-10 w-14 rounded-md border border-line-subtle bg-surface ${s}`} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-2xs text-ink-disabled">spasi: grid 4px</p>
                <div className="flex items-end gap-1">
                  {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                    <span key={n} className="w-2 rounded-xs bg-brand-200" style={{ height: n * 4 }} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Section>
      </div>

      {/* Overlay demos — hidup di luar alur konten */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        danger
        title="Tolak pengajuan inspeksi?"
        description={
          <>
            WIR-AR-2026-0142 dikembalikan ke Budi Santoso dengan alasan wajib. Penolakan
            administratif <strong>tidak</strong> membuat NCR. Riwayat pengajuan tetap tersimpan.
          </>
        }
        confirmLabel="Ya, Tolak Pengajuan"
      />
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Catat Rilis Hold Point"
        description="WIR-AR-2026-0142 · Perkakas tulangan Lantai 7 — Gedung Aruna"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button variant="primary" leftIcon={Stamp} onClick={() => setDialogOpen(false)}>
              Catat Rilis
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Callout tone="warning" icon={OctagonAlert} title="Periksa syarat rilis">
            Aksi ini merekam <strong>rilis otoritas</strong> — berbeda dari keputusan inspeksi.
            Syarat berikut wajib terpenuhi (SC-23):
          </Callout>
          <div className="flex flex-col gap-2.5">
            {[
              { ok: true, t: 'Inspeksi diterima — Sari Wulandari, 13 Okt 10:20' },
              { ok: true, t: 'Hasil uji bahan terlampir ( slump & kuat tekan )' },
              { ok: false, t: 'Verifikasi tindakan perbaikan oleh QA/QC' },
            ].map((c) => (
              <div key={c.t} className="flex items-center gap-2.5 text-sm">
                {c.ok ? (
                  <CircleCheck {...iconProps(16)} className="shrink-0 text-green-600" />
                ) : (
                  <CircleX {...iconProps(16)} className="shrink-0 text-red-600" />
                )}
                <span className={c.ok ? 'text-ink-secondary' : 'font-medium text-ink'}>{c.t}</span>
              </div>
            ))}
          </div>
          <Field label="Komentar rilis" htmlFor="release-note" required hint="Tercatat dengan nama & peran Anda pada riwayat.">
            <Textarea id="release-note" placeholder="mis. Direilis untuk pengecoran Lantai 7 sesuai ITP-STR-04…" />
          </Field>
        </div>
      </Dialog>
    </div>
  )
}

/* ============================================================
   Data seed gaya-gaya (konsisten dengan PRD §15.2)
   ============================================================ */

const BRAND_STEPS = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const BRAND = ['#f5f8ff', '#eef3ff', '#e0eaff', '#c6d6fe', '#a1bafb', '#7b95f7', '#5870ef', '#2f5be0', '#2549be', '#233f99', '#22397b', '#17254f']
const GRAY_STEPS = ['0', '25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const GRAY = ['#ffffff', '#fafbfc', '#f6f8fa', '#eff2f6', '#e3e8ef', '#cdd5df', '#9aa4b2', '#697586', '#4b5565', '#364152', '#202939', '#121926', '#0b0f1a']

function ScaleStrip({ name, steps, values }: { name: string; steps: string[]; values: string[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line-subtle">
      <div className="flex">
        {values.map((c, i) => (
          <div key={c + i} className="flex-1" style={{ minWidth: 0 }}>
            <div className="h-10 border-b border-line-subtle" style={{ background: c }} title={`${name}-${steps[i]}`} />
            <p className="truncate bg-surface px-1 py-1 text-center font-mono text-[9.5px] text-ink-disabled">
              {steps[i]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const STATUS_TONES: { name: string; cls: string; dot: string; usage: string; sample: StatusDef }[] = [
  { name: 'Neutral', cls: 'bg-tone-neutral-bg text-tone-neutral-text border-tone-neutral-border', dot: 'bg-gray-400', usage: 'Draf, ditarik, ditutup — bukan masalah.', sample: INSPECTION_STATUS.draft },
  { name: 'Info', cls: 'bg-tone-info-bg text-tone-info-text border-tone-info-border', dot: 'bg-sky-500', usage: 'Menunggu pihak lain / terjadwal.', sample: INSPECTION_STATUS.scheduled },
  { name: 'Active', cls: 'bg-tone-active-bg text-tone-active-text border-tone-active-border', dot: 'bg-violet-500', usage: 'Sedang berjalan.', sample: INSPECTION_STATUS.internal_review },
  { name: 'Success', cls: 'bg-tone-success-bg text-tone-success-text border-tone-success-border', dot: 'bg-green-500', usage: 'Diterima, terverifikasi, dirilis.', sample: INSPECTION_STATUS.accepted },
  { name: 'Warning', cls: 'bg-tone-warning-bg text-tone-warning-text border-tone-warning-border', dot: 'bg-amber-500', usage: 'Perlu tindakan — bukan gagal teknis.', sample: INSPECTION_STATUS.correction_required },
  { name: 'Danger', cls: 'bg-tone-danger-bg text-tone-danger-text border-tone-danger-border', dot: 'bg-red-500', usage: 'Ditolak, terblokir, terlambat.', sample: HOLD_POINT_STATUS.blocked_prerequisites },
]

function StatusCatalog({
  title, desc, items, compact, strong,
}: { title: string; desc: string; items: StatusDef[]; compact?: boolean; strong?: boolean }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader title={title} description={desc} className="pb-2" />
      <ul className={strong ? 'grid grid-cols-1 gap-px bg-line-subtle sm:grid-cols-2' : 'divide-y divide-line-subtle border-t border-line-subtle'}>
        {items.map((s) => (
          <li key={s.id} className="flex items-start gap-3 bg-surface px-4 py-2.5">
            <StatusBadge status={s} size={compact ? 'sm' : 'md'} emphasis={strong ? 'strong' : 'subtle'} className="mt-0.5 shrink-0" />
            <p className="text-sm leading-5 text-ink-muted">{s.description}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

const ICON_SHOWCASE: { name: string; cmp: LucideIcon }[] = [
  { name: 'layout-dashboard', cmp: LayoutDashboard },
  { name: 'building-2', cmp: Building2 },
  { name: 'clipboard-list', cmp: ClipboardList },
  { name: 'clipboard-check', cmp: ClipboardCheck },
  { name: 'flag', cmp: Flag },
  { name: 'history', cmp: History },
  { name: 'bar-chart-3', cmp: BarChart3 },
  { name: 'settings-2', cmp: Settings2 },
  { name: 'search', cmp: Search },
  { name: 'bell', cmp: Bell },
  { name: 'hard-hat', cmp: HardHat },
  { name: 'milestone', cmp: Milestone },
  { name: 'map-pin', cmp: MapPin },
  { name: 'layers', cmp: Layers },
  { name: 'calendar-days', cmp: CalendarDays },
  { name: 'calendar-clock', cmp: CalendarClock },
  { name: 'calendar-x', cmp: CalendarX },
  { name: 'clock', cmp: Clock },
  { name: 'timer', cmp: Timer },
  { name: 'hourglass', cmp: Hourglass },
  { name: 'send', cmp: Send },
  { name: 'eye', cmp: Eye },
  { name: 'eye-off', cmp: EyeOff },
  { name: 'file-text', cmp: FileText },
  { name: 'file-search', cmp: FileSearch },
  { name: 'file-warning', cmp: FileWarning },
  { name: 'file-pen-line', cmp: FilePenLine },
  { name: 'paperclip', cmp: Paperclip },
  { name: 'printer', cmp: Printer },
  { name: 'download', cmp: Download },
  { name: 'link-2', cmp: Link2 },
  { name: 'copy', cmp: Copy },
  { name: 'pencil', cmp: Pencil },
  { name: 'trash-2', cmp: Trash2 },
  { name: 'plus', cmp: Plus },
  { name: 'filter', cmp: Filter },
  { name: 'sliders-horizontal', cmp: SlidersHorizontal },
  { name: 'arrow-up-down', cmp: ArrowUpDown },
  { name: 'chevron-down', cmp: ChevronDown },
  { name: 'chevron-right', cmp: ChevronRight },
  { name: 'arrow-right', cmp: ArrowRight },
  { name: 'external-link', cmp: ExternalLink },
  { name: 'more-horizontal', cmp: MoreHorizontal },
  { name: 'x', cmp: X },
  { name: 'check', cmp: Check },
  { name: 'circle-check', cmp: CircleCheck },
  { name: 'circle-x', cmp: CircleX },
  { name: 'triangle-alert', cmp: TriangleAlert },
  { name: 'octagon-alert', cmp: OctagonAlert },
  { name: 'info', cmp: Info },
  { name: 'circle-help', cmp: CircleHelp },
  { name: 'ban', cmp: Ban },
  { name: 'undo-2', cmp: Undo2 },
  { name: 'refresh-cw', cmp: RefreshCw },
  { name: 'replace', cmp: Replace },
  { name: 'scale', cmp: Scale },
  { name: 'wrench', cmp: Wrench },
  { name: 'user-plus', cmp: UserPlus },
  { name: 'users', cmp: Users },
  { name: 'user-check', cmp: UserCheck },
  { name: 'badge-check', cmp: BadgeCheck },
  { name: 'shield-check', cmp: ShieldCheck },
  { name: 'lock', cmp: Lock },
  { name: 'lock-open', cmp: LockOpen },
  { name: 'stamp', cmp: Stamp },
  { name: 'circle-pause', cmp: CirclePause },
  { name: 'circle-dashed', cmp: CircleDashed },
  { name: 'message-square', cmp: MessageSquare },
  { name: 'message-circle-question', cmp: MessageCircleQuestion },
  { name: 'inbox', cmp: Inbox },
  { name: 'activity', cmp: Activity },
  { name: 'trending-up', cmp: TrendingUp },
  { name: 'rotate-ccw', cmp: RotateCcw },
  { name: 'camera', cmp: Camera },
  { name: 'image', cmp: Image },
  { name: 'folder-open', cmp: FolderOpen },
  { name: 'construction', cmp: Construction },
  { name: 'sparkles', cmp: Sparkles },
  { name: 'landmark', cmp: Landmark },
  { name: 'scan-search', cmp: ScanSearch },
  { name: 'alarm-clock', cmp: AlarmClock },
  { name: 'circle-ellipsis', cmp: CircleEllipsis },
  { name: 'chevrons-up-down', cmp: ChevronsUpDown },
]

const DEMO_REGISTER = [
  {
    ref: 'WIR-AR-2026-0142',
    activity: 'Perkakas tulangan & formwork — pra-pengecoran',
    location: 'Tower A · Lt. 7 · Grid C/4-7',
    project: 'Gedung Aruna',
    type: POINT_TYPE.hold,
    status: HOLD_POINT_STATUS.awaiting_release,
    emphasis: true,
    nextAction: 'Rilis otoritas oleh Quality Manager',
    owner: 'Ratna Dewi',
    due: 'hari ini 16:00',
    overdue: false,
    age: '2 hr',
  },
  {
    ref: 'WIR-KS-2026-0088',
    activity: 'Instalasi ducting HVAC — area rawat',
    location: 'Lt. 2 · R-204',
    project: 'Klinik Sentosa',
    type: POINT_TYPE.review,
    status: INSPECTION_STATUS.clarification_required,
    emphasis: false,
    nextAction: 'Kirim referensi dokumen revisi terkini',
    owner: 'Budi Santoso',
    due: 'terlambat 2 hari',
    overdue: true,
    age: '6 hr',
  },
  {
    ref: 'WIR-KS-2026-0091',
    activity: 'Penyambungan kabel utama panel MDP',
    location: 'Lt. 1 · Ruang Panel',
    project: 'Klinik Sentosa',
    type: POINT_TYPE.witness,
    status: INSPECTION_STATUS.external_review,
    emphasis: false,
    nextAction: 'Rekam keputusan konsultan',
    owner: 'Hendra Kusuma',
    due: 'besok 09:00',
    overdue: false,
    age: '1 hr',
  },
  {
    ref: 'WIR-JK-2026-0027',
    activity: 'Uji kepadatan tanah (sand cone)',
    location: 'Sta 1+200 – 1+350',
    project: 'Jalan Kartika',
    type: POINT_TYPE.witness,
    status: INSPECTION_STATUS.deferred,
    emphasis: false,
    nextAction: 'Konfirmasi jadwal ulang laboratorium',
    owner: 'Budi Santoso',
    due: '13 Nov',
    overdue: false,
    age: '4 hr',
  },
  {
    ref: 'WIR-AR-2026-0141',
    activity: 'Re-inspeksi tulangan setelah perbaikan cover',
    location: 'Tower A · Lt. 7 · Grid C/5',
    project: 'Gedung Aruna',
    type: POINT_TYPE.hold,
    status: INSPECTION_STATUS.reinspection_requested,
    emphasis: false,
    nextAction: 'Jadwalkan re-inspeksi QC',
    owner: 'Sari Wulandari',
    due: 'besok 08:00',
    overdue: false,
    age: '1 hr',
  },
  {
    ref: 'WIR-AR-2026-0139',
    activity: 'Perkakas tulangan & formwork — pra-pengecoran',
    location: 'Tower A · Lt. 6 · Grid A/1-4',
    project: 'Gedung Aruna',
    type: POINT_TYPE.hold,
    status: HOLD_POINT_STATUS.released,
    emphasis: false,
    nextAction: 'Pengecoran berjalan — tidak ada aksi',
    owner: 'Ratna Dewi',
    due: undefined,
    overdue: false,
    age: '9 hr',
  },
] as const

const DEMO_TIMELINE = [
  {
    id: 't1',
    icon: Send,
    tone: 'info' as const,
    title: 'Pengajuan dibuat',
    meta: '10 Okt 2026 · 09:12',
    detail: 'Diajukan oleh Budi Santoso (Site Engineer) dengan 6 foto & checklist terisi. Dokumen: S-304 R1.',
  },
  {
    id: 't2',
    icon: SearchCheck,
    tone: 'active' as const,
    title: 'Review QC internal dimulai',
    meta: '10 Okt 2026 · 10:02',
    detail: 'Ditugaskan ke Sari Wulandari (QA/QC Inspector).',
  },
  {
    id: 't3',
    icon: FileWarning,
    tone: 'warning' as const,
    title: 'Keputusan: Perlu Perbaikan',
    meta: '10 Okt 2026 · 14:05',
    note: 'Cover blok tulangan tidak sesuai spesifikasi pada Grid C/5 — terlihat pada 3 titik. Mohon penyesuaian & foto ulang.',
    detail: 'Direkam oleh Sari Wulandari. Tanpa NCR — koreksi lapangan.',
  },
  {
    id: 't4',
    icon: Wrench,
    tone: 'active' as const,
    title: 'Perbaikan & bukti diajukan',
    meta: '12 Okt 2026 · 08:47',
    detail: 'Budi Santoso melampirkan 8 foto pasca-perbaikan + checklist revisi.',
  },
  {
    id: 't5',
    icon: RefreshCw,
    tone: 'active' as const,
    title: 'Re-inspeksi diterima',
    meta: '13 Okt 2026 · 10:20',
    note: 'Cover sesuai spesifikasi. Diterima untuk lingkup Lt. 7 Grid C/4-7, dokumen S-304 R2.',
    detail: 'Diterima oleh Sari Wulandari. Hold point tetap menunggu rilis terpisah.',
  },
  {
    id: 't6',
    icon: Lock,
    tone: 'warning' as const,
    title: 'Hold point menunggu rilis otoritas',
    meta: '13 Okt 2026 · 10:21',
    detail: 'Rilis menunggu Ratna Dewi (Quality Manager) — syarat: verifikasi tindakan perbaikan.',
  },
]
