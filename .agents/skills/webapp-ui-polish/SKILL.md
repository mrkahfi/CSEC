---
name: webapp-ui-polish
description: "Web App Architecture & UI/UX Standard: A framework for designing and building professional web app products or features from scratch, and for polishing existing UI. Prevents the 'article/blog website' trap by enforcing visual value differentiation, eliminating dot-separator chains (·), integrating domain-specific visual assets, icon-first actions, and bold typography."
metadata:
  author: User Feedback & Anti-Slop Engineering
  version: "2.0.0"
  category: SoftwareArchitectureAndUIUX
---

# Web App Architecture & UI/UX Standard (Build & Polish Framework)

This is a mandatory standard for AI coding agents and software engineers when **designing and building new features or products from scratch (greenfield/feature build)** and when **polishing or refactoring existing UI**.

The goal is to ensure every screen, component, and interaction has the character of a **Professional Web Application** (like Linear, Notion, Stripe Dashboard, Jira, GitHub) — not a **monotonous, text-heavy article website**.

This skill is **industry-agnostic** — applicable to SaaS, fintech, healthcare, logistics, e-commerce, HR, project management, or any other domain.

---

## 1. Core Paradigm: Web App Workspace vs. Article Website

When building a product or feature, always use the **Workstation / Tool** mental model, not **Reading Page**:

| Architecture Dimension | ❌ Article Website Trap (Slop) | ✅ Professional Web App (Required) |
| :--- | :--- | :--- |
| **Header Pattern** | H1 title followed by 2-3 long paragraphs explaining what the page does | Compact title + entity/status badge + direct action toolbar (filter, search, view switcher) |
| **Data Differentiation** | Same-size monotonous text concatenated with dot chains (`A · B · C · D`) | Visual token structure: *stacked layout*, *micro-icon chips*, semantic badges, separate grids |
| **Context & Evidence** | No visual elements; just label rows, raw numbers, and plain filename links | *Domain reality*: document thumbnails, photo previews with metadata overlays, visual report cards |
| **Buttons & Actions** | Long repetitive text buttons ("Add Row", "Delete Item") & decorative arrows (`→`) | *Icon-first buttons* (`IconButton`) with accessible tooltips & semantic affordance (`ExternalLink`) |
| **Quantitative / KPI** | Small numbers mixed into paragraphs or flat tables | Massive monospaced numbers (`text-2xl font-mono font-bold`) + *micro-labels* + semantically colored icon containers |
| **Guides & Overlays** | Giant 3-column modal box covering half the workspace | Slim floating HUD toolbar (*collapsed by default*, icon controls, step pills) |

---

## 2. Feature Build Blueprint

Use these 5 phases every time you create a new screen, module, or component:

### PHASE 1: Workspace Layout Scaffolding
When creating a new page file, build the layout using this workspace structure:

```tsx
export function FeatureView() {
  return (
    <>
      {/* 1. Compact Header: Title + Entity Badge + Primary Actions (No explanatory paragraphs!) */}
      <PageHeader
        title="Orders"
        meta={<Badge tone="neutral">14 active</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <IconButton icon={Download} label="Export data" size="sm" variant="secondary" />
            <Button size="sm" variant="primary">
              <Plus size={14} /> New Order
            </Button>
          </div>
        }
      />

      <PageBody className="space-y-4">
        {/* 2. Control Toolbar: Search + Filter Dropdown + Segmented View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <SearchInput placeholder="Search by ID, name, assignee..." className="w-72" />
          <Select aria-label="Filter by status" wrapperClassName="w-48">
            <option value="">All Status</option>
            {/* Enterprise dropdown format: [CODE] Name */}
            <option value="pending">[PENDING] Awaiting Review</option>
            <option value="approved">[APPROVED] Ready to Ship</option>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            <SegmentedControl options={VIEW_OPTIONS} />
          </div>
        </div>

        {/* 3. Operational KPI Deck: Massive Numbers + Micro-labels + Colored Icon Containers */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            label="OVERDUE"
            value={3}
            icon={OctagonAlert}
            tone="danger" // Red icon container, bold font-mono number
          />
          {/* ...other stat tiles */}
        </div>

        {/* 4. Data Workspace (Grid, Split View, or Master-Detail) */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {/* Data cards with visual differentiation */}
          </div>
          <div className="space-y-3">
            {/* Inspector / Context Side Panel */}
          </div>
        </div>
      </PageBody>
    </>
  )
}
```

---

### PHASE 2: Data Modeling & Entity Tokenization (Anti-Concatenation)
When designing a view model or rendering data attributes, **NEVER** join fields with dot-separator chains (` · `). Apply these 4 visual tokenization patterns:

#### Pattern 1: Two-Row Stacked Metadata
Use for *Primary Entity* + *Supporting Meta* pairs:
```tsx
// ❌ NEVER WRITE THIS:
<p className="text-xs text-ink-muted">{user.name} · {user.role} · {user.department}</p>

// ✅ REQUIRED — STACKED PATTERN:
<div>
  <span className="block text-xs font-semibold text-ink">{user.name}</span>
  <span className="flex items-center gap-1 text-2xs text-ink-muted">
    <span className="font-medium text-ink-secondary">{user.role}</span>
    <span className="rounded bg-sunken px-1.5 py-0.5">{user.department}</span>
  </span>
</div>
```

#### Pattern 2: Micro-Icon + Label Chip
Use for entity attributes like Location, Organization, Time, or Category:
```tsx
// ❌ SLOP:
<p>{project.client} · {project.location} · {project.type}</p>

// ✅ WEB APP CHIPS:
<div className="flex flex-wrap items-center gap-2 text-xs">
  <span className="flex items-center gap-1 font-medium text-ink-secondary">
    <Building2 size={13} className="text-ink-muted" /> {project.client}
  </span>
  <span className="flex items-center gap-1 text-ink-secondary">
    <MapPin size={13} className="text-ink-muted" /> {project.location}
  </span>
  <span className="rounded bg-sunken px-2 py-0.5 text-2xs font-semibold text-ink-muted">
    {project.type}
  </span>
</div>
```

#### Pattern 3: Standalone Status & Deadline Chips
Status and deadlines must have semantically colored containers — not just a word appended to a string:
```tsx
// ❌ SLOP:
<span>{formatDateTime(task.dueAt)} · overdue</span>

// ✅ SEMANTIC CHIP:
<div className="flex items-center gap-1.5">
  <span className="font-mono text-xs text-ink">{formatDateTime(task.dueAt)}</span>
  <span className="rounded bg-red-100 px-1.5 py-0.5 font-bold text-2xs text-red-700">
    Overdue
  </span>
</div>
```

#### Pattern 4: Enterprise Dropdown Selector
Use bracket notation for entity codes to give the system an enterprise feel:
```tsx
// ❌ SLOP:
<option value={item.id}>{item.code} · {item.name}</option>

// ✅ ENTERPRISE:
<option value={item.id}>[{item.code}] {item.name}</option>
```

---

### PHASE 3: Visual Domain Asset Integration (*Domain Reality*)
Professional web apps must not consist solely of text and download links. Design concrete visual assets that reflect the product's domain from the start:

#### 1. Thumbnail & Preview Cards
Every entity with a visual representation (document, photo, certificate, invoice, report) must be shown as a clickable thumbnail:
- **Documents**: First-page preview rendered with CSS (letterhead, summary table, official stamp if relevant).
- **Photos / Media**: Thumbnail grid with metadata overlay (date, uploader, dimensions, file size).
- **Certificates / Approvals**: Visual card with status indicator (APPROVED/REJECTED stamp at an angle, semantic color).
- **Reports**: Simulated A4 document format with organization header and data summary.

> [!TIP]
> Use CSS gradients, SVG patterns, and grid lines to build visually rich thumbnails without needing external image assets. This is far better than a plain `FileText` icon with a filename underneath.

#### 2. Full-Resolution File Viewer Modal (`size="2xl"` / `max-w-5xl`)
When a thumbnail is clicked, open a wide modal:
- **Left column (60–65%)**: Full visual canvas of the document or media.
- **Right column (35–40%)**: Inspector panel with structured metadata, reviewer notes, version/history, and action buttons (download, print, share).

#### 3. Ambient Glow on Empty States & KPI Icon Containers
- Never let an *empty state* look like a dead-end: add a subtle ambient glow halo behind the icon and a direct CTA button.
- Every KPI metric must have an icon container with a semantic color tone (`emerald`, `amber`, `red`, `blue`) — never a flat, muted gray.

---

### PHASE 4: Icon-First Actions & HUD Overlays

#### 1. Row Action Buttons & Toolbars
For high-frequency operational actions, prefer `IconButton` over text buttons:
- **Add item**: `Plus`
- **Delete item**: `Trash2`
- **Edit**: `Pencil` or `Edit3`
- **Download**: `Download`
- **Print / PDF**: `Printer`
- **Info / Help**: `Info` or `HelpCircle`
- **Close**: `X`
- **View detail**: `Eye`
- **Share**: `Share2`
- **Duplicate / Copy**: `Copy`

> [!IMPORTANT]
> Every `IconButton` **must** have a `title` and `aria-label` attribute for screen reader accessibility and to show a tooltip on hover.

#### 2. No Decorative Arrows (`→`, `ArrowRight`)
- Do not append `→` or `ArrowRight` to link or button text as pure decoration.
- If an element triggers navigation to an external detail page, use a functional semantic icon like `ExternalLink` or `ChevronRight` at a proportional size (`size={13}`).

#### 3. Floating HUD Toolbar for Guide / Tour Features
If a feature requires a guided tour (onboarding or demo):
- **Do not** build a giant modal box that covers the working content.
- **Design as a Floating HUD Toolbar**:
  - Fixed position (*docked*) at the top or bottom of the workspace.
  - *Collapsed by default*: Shows a status summary in a slim pill strip.
  - Icon-based navigation controls (`Play`, `Pause`, `Prev`, `Next`, `Reset`, `Info`, `Close`).
  - Step details only expand when the user presses the `Info` icon toggle.

---

### PHASE 5: Copywriting Hygiene & Anti-Slop

#### 1. Zero Em-Dash Tolerance (`—`)
Never use em-dash (`—`) in UI strings.
- Use a colon (`:`), parentheses `(...)`, or split into two stacked lines instead.

#### 2. Semantic Icons Only
- Never use decorative icons with no functional meaning — `Sparkles`, `Wand`, `Stars`, `Zap` — in operational dashboards or technical UI.
- Every icon must have a clear, context-relevant functional meaning.
- Universal semantic icon mapping:

| Function | Appropriate Icon |
| :--- | :--- |
| Storage / Data | `Database`, `HardDrive` |
| Photo Evidence / Media | `Camera`, `Image` |
| Official Document | `FileCheck2`, `FileText` |
| Report / Analytics | `BarChart3`, `ClipboardList` |
| Fix / Repair Action | `Wrench`, `Settings` |
| Authorization / Approval | `ShieldCheck`, `CheckCircle2` |
| User / Profile | `User`, `Users` |
| Notification | `Bell`, `BellRing` |
| Calendar / Schedule | `Calendar`, `Clock` |
| Payment / Transaction | `CreditCard`, `Wallet` |

#### 3. Quantitative Typography Consistency
Every KPI or primary metric number must use typography treatment that distinguishes it from body text:
```tsx
// ❌ SLOP: Number buried in a paragraph
<p>Total orders this month: {count}</p>

// ✅ MASSIVE KPI:
<div>
  <span className="text-2xs font-semibold uppercase tracking-wider text-ink-muted">
    Total Orders
  </span>
  <span className="block text-2xl font-mono font-bold text-ink">{count}</span>
</div>
```

---

## 3. Pre-Flight Feature Checklist

Before marking a new feature as done (or before opening a pull request), verify every item below:

- [ ] **Workspace Character**: Are there any long article paragraphs below the page title? If so, remove them and replace with a *count badge* or control toolbar.
- [ ] **Dot-Separator Free**: Is every data display free of ` · ` string concatenation? Does all metadata use stacked meta, micro-icons, or status chips?
- [ ] **Visual Domain Assets Present**: Does the feature display a real visual representation of its domain (document preview, photo thumbnail, certificate card, report simulation)?
- [ ] **Proportional Modal Size**: Does any content viewer dialog use a wide size (`size="2xl"`) so it's comfortable to read without feeling cramped?
- [ ] **Bold Quantitative Typography**: Do primary KPI/metric values use large monospaced font (`text-2xl font-mono font-bold`)?
- [ ] **Clean Actions (Icon-First)**: Do standard row/table actions (add, delete, download, preview) use `IconButton` with tooltips?
- [ ] **No Decorative Arrows**: Are all buttons and links free of `→` or `ArrowRight` with no functional purpose?
- [ ] **Text Hygiene**: Is all UI text free of em-dash (`—`) and generic AI icons (`Sparkles`)?
- [ ] **Quality Empty States**: Does every empty-state screen have an icon/illustration with ambient glow and a clear CTA?
- [ ] **Responsive**: Does the workspace layout work correctly on mobile (stacked) and desktop (grid/split)?
