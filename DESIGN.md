# Design Direction: Site Operations Dashboard (SiteOps)

## 1. Product Identity
- **Product Name:** Site Operations Dashboard (SiteOps)
- **Concept:** Construction Site Execution & Quality Workflow Control (CSEC)
- **Target Audience:** Indonesian medium-sized building and infrastructure contractors (Project Managers, Site Engineers, QA/QC Inspectors, Quality Managers).
- **Domain:** Construction site quality assurance, inspection requests (WIR), non-conformance tracking (NCR/findings), and hold-point release authority.

## 2. Personality & Mood
- **Tone:** Technical, authoritative, calm, disciplined, field-tested.
- **Character:** A rigorous operations tool built for high-stakes site coordination, not a playful or generic SaaS dashboard.
- **Honesty:** Every status clearly indicates its accountable next action, decision authority, and physical site location.

## 3. Visual System & Palette
- **Canvas / Background:** Crisp cool slate canvas (`#f6f8fa` / `gray-50`) with pure white elevated surfaces (`#ffffff` / `gray-0`).
- **Primary Ink:** Deep slate `#121926` for maximum readability and crisp data scanning. Secondary ink `#4b5565`, muted `#697586`.
- **Brand Accent:** Technical cobalt blue (`#1d4ed8` / `#2563eb`). Used strictly for primary actions, active navigation, and focused interactive states.
- **Status Semantics:**
  - **Info:** Technical blue / sky (`#0284c7`)
  - **Warning:** Amber (`#d97706`) for pending reviews, conditional actions, and impending milestones
  - **Danger:** Deep red (`#dc2626`) for hold point blocks, overdue corrective actions, and schedule slippage
  - **Success:** Emerald green (`#059669`) for accepted inspections and released hold points
- **Borders & Elevation:** Crisp 1px subtle borders (`#e3e8ef`) rather than blurry heavy shadows.

## 4. Typography
- **Primary Sans:** Inter Variable with tabular numbers (`tnum`) enabled for all quantities, dates, coordinates, and percentages.
- **Technical Mono:** JetBrains Mono Variable for technical identifiers (e.g. `WIR-AR-2026-0142`, `HP-AR-02`, `F-AR-021`, grid lines `A/1-4`).

## 5. Dials
- **ENERGY:** 2 (Professional, high-clarity operational density)
- **RHYTHM:** 2 (Structured functional hierarchy tailored to inspection workflows)
- **MOTION:** 1 (Subtle functional transitions, zero decorative bouncing)
