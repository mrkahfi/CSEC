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
| **Narrative vs. Values** | Domain facts, measurements, and logs written as long narrative sentences or paragraphs (*"Field measurement at beam B2 showed 20mm; spec requires 25mm..."*) | Structured data models rendered as atomic visual tokens: 3-column benchmark diff cards (Actual \| Target \| Delta), categorical pills, and quantitative chips |
| **Status & Definitions** | Printing dictionary definitions inline beneath badges or callout headers (*"Work does not meet checklist/specs, requires rectification."*) | Crisp semantic badge only. Explanations relegated to hover tooltips or on-demand glossary modals (`?`). Callout body reserved strictly for actionable next steps and owners |
| **Data Differentiation** | Same-size monotonous text concatenated with dot chains (`A · B · C · D`) | Visual token structure: *stacked layout*, *micro-icon chips*, semantic badges, separate grids |
| **Density & Disclosure** | Forcing dozens of text labels, descriptions, and timestamps into cramped list items or cards, causing visual fatigue | Progressive disclosure: Primary operational signals (ID + Status + Key Delta) on card; secondary details accessible via clean Modal, Drawer, or Popover |
| **Input Architecture** | Lazy single `<Textarea>` expecting users to type 50-word prose paragraphs describing an incident or task | Structured input blocks: category selector, scoped entity picker, quantitative duration input, and concise impact/action field |
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

#### Pattern 5: Measurement & Benchmark Diff Cards (Actual vs. Expected)
Discrepancies, quality assurance checks, system benchmarks, financial reconciliations, and SLA variances must **NEVER** be rendered as narrative sentences like *"Inspection on node B2 showed memory 20GB; spec requires 25GB (SPEC-01 §5.3)."*
Model them as structured comparison objects:
```ts
interface MeasurementBenchmark {
  actual: string
  standard: string
  tolerance: string
  deviation: string
  referenceDoc: string
  secondaryPoints?: string
}
```
Render them as high-contrast 3-column benchmark diff cards:
```tsx
// ❌ SLOP (Raw narrative text block):
<p>Field measurement at beam B2 showed cover 20 mm; specification requires 25 mm (SPEC-NW-01 §5.3). Other points compliant.</p>

// ✅ REQUIRED — BENCHMARK DIFF CARD:
<div className="space-y-2.5 rounded-xl border border-line-subtle bg-sunken/40 p-3">
  <div className="grid grid-cols-3 gap-2 text-center">
    <div className="rounded-lg border border-red-200 bg-red-50/70 p-2">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-red-800">Actual Measured</span>
      <span className="font-mono text-base font-bold text-red-950 tnum">{benchmark.actual}</span>
    </div>
    <div className="rounded-lg border border-line-subtle bg-surface p-2">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-ink-muted">Standard Spec</span>
      <span className="font-mono text-base font-bold text-ink tnum">{benchmark.standard}</span>
    </div>
    <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800">Deviation</span>
      <span className="font-mono text-base font-bold text-amber-950 tnum">{benchmark.deviation}</span>
    </div>
  </div>
  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-subtle pt-2 text-2xs">
    <span className="text-ink-muted">Reference: <span className="font-mono font-semibold text-ink">{benchmark.referenceDoc}</span></span>
    {benchmark.secondaryPoints && (
      <span className="font-medium text-emerald-700">✓ {benchmark.secondaryPoints}</span>
    )}
  </div>
</div>
```

#### Pattern 6: Action Plan & Remediation Tokens
Remediation instructions, dispatch commands, and maintenance plans must not be free-form text paragraphs.
Model them as structured action tokens:
```ts
interface StructuredActionPlan {
  actionType: string // e.g. 'Replace & Reinstall', 'Patch & Recalibrate', 'Re-route'
  component: string
  targetLocation: string
  requirePhotoEvidence: boolean
  standardSpec?: string
}
```
Render as actionable token chips:
```tsx
// ❌ SLOP:
<p>Replace and reinstall 25 mm spacer on beam B2; attach 8 photo documentation points.</p>

// ✅ REQUIRED — ACTION TOKEN ROW:
<div className="space-y-1.5">
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700 border border-brand-200">
      {actionPlan.actionType}
    </span>
    {actionPlan.requirePhotoEvidence && (
      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-200">
        Mandatory Photo Proof
      </span>
    )}
    {evidenceCount && (
      <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200">
        <Camera size={11} /> {evidenceCount} Photos Attached
      </span>
    )}
  </div>
  <div className="rounded-md border border-line-subtle bg-sunken/40 p-2 text-xs">
    <span className="font-semibold text-ink">{actionPlan.component}</span>
    <span className="block text-ink-muted text-2xs mt-0.5">{actionPlan.targetLocation}</span>
  </div>
</div>
```

#### Pattern 7: Operational Bottlenecks & Delay Chips
Operational blockers, incident reports, and delays must never be unstructured text like *"Rain stopped high-altitude work for 1 hour at Unit C."*
```tsx
// ❌ SLOP:
<p>{delay.category}: {delay.desc}</p>

// ✅ REQUIRED — STRUCTURED DELAY TOKEN:
<div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-amber-300 bg-amber-50/60 px-2.5 py-1.5 text-xs">
  <TriangleAlert size={12} className="shrink-0 text-amber-600" />
  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
    {delay.category}
  </span>
  <span className="font-mono text-2xs font-bold text-amber-800 bg-white/70 px-1.5 py-0.5 rounded border border-amber-200">
    {delay.duration}
  </span>
  <span className="font-semibold text-ink text-2xs">{delay.affectedUnit}</span>
  <span className="text-ink-muted text-2xs">{delay.impact}</span>
</div>
```

#### Pattern 8: Structured Work Item & Inspection Records (Table & Card Rows)
Work orders, QA/QC inspections, maintenance jobs, and checklist requests must **NEVER** be rendered as unstructured sentence strings like *"Inspection of beam and slab rebar at Unit A-05"* or next actions like *"Verify concrete cover repair results"*.
Decompose them into atomic data models:
```ts
interface WorkItemHeader {
  discipline: string    // e.g. 'Structural Concrete', 'MEP', 'Roof Trusses'
  activityType: string  // e.g. 'Rebar Inspection', 'Pressure Test', 'Coating Verification'
  targetScope: string   // e.g. 'Unit A-05 · Level 2', 'Block B · Main Shaft'
  nextAction?: {
    actionType: string  // e.g. 'Field Verification', 'Drawing Review', 'Reschedule'
    component: string   // e.g. '25 mm Rebar Spacers', 'Pressure Gauge Test'
    owner: string
    dueAt?: string
  }
}
```
Render as clean atomic tokens in both table rows and card lists:
```tsx
// ❌ SLOP: Raw sentence strings
<p className="text-sm">{item.title}</p>
<p className="text-xs text-muted">{item.nextAction.label}</p>

// ✅ REQUIRED — STRUCTURED WORK ITEM ROW:
<div className="space-y-1">
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="rounded bg-brand-50 px-1.5 py-0.2 text-[10px] font-semibold text-brand-700 border border-brand-200">
      {item.discipline}
    </span>
    <span className="text-sm font-semibold text-ink">
      {item.activityType}
    </span>
  </div>
  <div className="flex items-center gap-1.5 text-xs text-ink-muted">
    <span className="rounded bg-sunken px-1.5 py-0.2 font-mono text-[10px] text-ink-secondary border border-line-subtle">
      {item.targetScope}
    </span>
    <span>·</span>
    <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span>
  </div>
</div>

// NEXT ACTION CELL:
<div className="text-xs space-y-1">
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="rounded bg-sunken px-1.5 py-0.2 text-[10px] font-bold text-ink border border-line-subtle">
      {item.nextAction.actionType}
    </span>
    <span className="text-xs font-semibold text-ink-secondary">
      {item.nextAction.component}
    </span>
  </div>
  <p className="text-ink-muted text-2xs">
    {item.nextAction.owner}
    {item.nextAction.dueAt && (
      <span className="ml-1.5 rounded bg-sunken px-1.5 py-0.5 font-mono text-2xs">
        target {formatRelative(item.nextAction.dueAt)}
      </span>
    )}
  </p>
</div>
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

### PHASE 4: Progressive Disclosure & Density Management (Anti-Overcrowding)

#### 1. The Core Principle: Never Force All Values into One Component
If a card, list item, or table row feels visually crowded, cramped, or heavy with text:
> [!CAUTION]
> **DO NOT** attempt to squeeze every field, attribute, timestamp, and remark into the primary surface. Doing so transforms your application into a wall of text that causes severe user cognitive fatigue.

Apply **Progressive Disclosure**:
- **Primary Surface (Card / Row / Tile)**: Render ONLY the immediate operational signals:
  1. Primary Identifier / Code (`font-mono font-bold`)
  2. High-contrast Status Badge / Pill
  3. Single Key Quantitative Metric or Delta (`%`, KPI, or Variance)
  4. Immediate Blocker Indicator (if blocking downstream workflow)
- **Secondary Details (Progressive Layers)**:
  - **Dialog / Modal (`size="xl"` / `size="2xl"`)**: Click to inspect comprehensive details, breakdowns, and attachments (e.g. `UnitDetailModal`, `InspectionReportModal`).
  - **Slide-out Inspector Drawer**: For multi-step workflows, audit trails, and version history.
  - **Popover / Tooltip**: For supplementary metrics, breakdown math, and definitions.
  - **Dedicated Navigation**: Deep link to full entity detail view.

#### 2. Zero Inline Dictionary / Glossary Slop
Never print dictionary definitions or status explanations inline in live working spaces:
- ❌ **SLOP**: Displaying `{status.description}` (*"Work does not comply with checklist/spec, requires rectification."*) directly under a badge that already reads `Needs Rectification`.
- ❌ **SLOP**: Adding glossary definitions inside notification or status banners (*"This status means that the work has not yet been verified by the supervisor."*).
- ✅ **REQUIRED**:
  - The badge itself conveys status: `<StatusBadge status={status} />`.
  - Explanations belong strictly in hover tooltips or a dedicated Glossary modal (`?` Help button).
  - Status Callouts / Banners must be reserved exclusively for the **immediate next action bar** (Next Action Label, Owner Pill, Target Deadline, and Action Button).

---

### PHASE 5: Input Architecture: Atomic Fields vs. Essay Textareas

#### 1. The "User Fatigue" Principle (No Essay Fields)
In operational tools, field workers, managers, and operators do NOT write prose paragraphs.
Expecting users to type 50-word essays in a giant `<Textarea>` is a massive UX anti-pattern:
1. Users get fatigued and enter incomplete, vague notes.
2. Downstream users cannot filter, search, aggregate, or sort by individual attributes.
3. The UI is forced to render the resulting data as messy raw text paragraphs.

#### 2. Form Field Decomposition Pattern
Whenever capturing domain events (delays, defects, incident reports, shift logs, handovers):
Deconstruct the event into discrete atomic inputs:
```tsx
// ❌ SLOP — Lazy Essay Textarea:
<Field label="Delay Description">
  <Textarea placeholder="Explain what happened, which unit was affected, how long it took, and what was postponed..." />
</Field>

// ✅ REQUIRED — ATOMIC DECOMPOSED INPUTS:
<div className="space-y-3">
  <Field label="Category">
    <SegmentedControl
      value={category}
      options={['Weather', 'Material', 'Equipment', 'Labor', 'Subcontractor']}
    />
  </Field>
  <div className="grid grid-cols-2 gap-2">
    <Field label="Affected Area / Scope">
      <Input value={affectedScope} placeholder="e.g. Unit C-04 / Zone 2" />
    </Field>
    <Field label="Duration">
      <Input value={duration} placeholder="e.g. 1.5 Hours / 2 Days" />
    </Field>
  </div>
  <Field label="Operational Impact / Direct Action">
    <Input value={impact} placeholder="e.g. Pouring rescheduled to tomorrow morning" />
  </Field>
</div>
```
> [!TIP]
> Keep `<Textarea>` strictly for truly optional, unstructured reviewer commentary or freehand remarks. When rendering these remarks, prefix with an explicit label (`Note:` or `Reviewer Comment:`) and avoid literary italicized quotes.

---

### PHASE 6: Icon-First Actions & HUD Overlays

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

### PHASE 7: Copywriting Hygiene & Anti-Slop

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
- [ ] **No Narrative Data Blobs**: Are measurements, quality checks, action plans, and delays modeled as structured objects and rendered as atomic visual tokens (diff cards, chips, badges) rather than raw sentences or prose paragraphs?
- [ ] **Zero Dictionary / Definition Slop**: Are status badges free of redundant glossary definitions underneath? Are banner/callout bodies reserved strictly for immediate next actions, owners, and deadlines?
- [ ] **Density Managed via Progressive Disclosure**: Is information density comfortable? Are secondary details, breakdowns, and audit trails offloaded to Modals, Drawers, or Tooltips rather than crowded into the primary card?
- [ ] **Atomic Form Inputs**: Do input forms decompose domain events into structured atomic fields (category, scope, duration, impact) rather than relying on lazy essay `<Textarea>`s?
- [ ] **Dot-Separator Free**: Is every data display free of ` · ` string concatenation? Does all metadata use stacked meta, micro-icons, or status chips?
- [ ] **Visual Domain Assets Present**: Does the feature display a real visual representation of its domain (document preview, photo thumbnail, certificate card, report simulation)?
- [ ] **Proportional Modal Size**: Does any content viewer dialog use a wide size (`size="2xl"`) so it's comfortable to read without feeling cramped?
- [ ] **Bold Quantitative Typography**: Do primary KPI/metric values use large monospaced font (`text-2xl font-mono font-bold`)?
- [ ] **Clean Actions (Icon-First)**: Do standard row/table actions (add, delete, download, preview) use `IconButton` with tooltips?
- [ ] **No Decorative Arrows**: Are all buttons and links free of `→` or `ArrowRight` with no functional purpose?
- [ ] **Text Hygiene**: Is all UI text free of em-dash (`—`) and generic AI icons (`Sparkles`)?
- [ ] **Quality Empty States**: Does every empty-state screen have an icon/illustration with ambient glow and a clear CTA?
- [ ] **Responsive**: Does the workspace layout work correctly on mobile (stacked) and desktop (grid/split)?
