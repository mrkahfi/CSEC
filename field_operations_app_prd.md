# Product Requirements Document (PRD)
# Field Operations App — Mobile-first

**Product concept:** Site Operations & Project Quality Control (Mobile Field App)  
**Document type:** UI Demo / Interactive Prototype PRD  
**Version:** 1.1  
**Date:** 31 October 2026 (diperbarui 18 November 2026)  
**Primary market hypothesis:** Kontraktor bangunan skala kecil-menengah mapan dan kontraktor menengah di Indonesia yang mengerjakan klaster perumahan (cluster), ruko/shophouse, dan gedung komersial lokal dengan tim lapangan terstruktur  
**Primary users:** Site Supervisor / Site Engineer (Andi Pratama) dan Pengawas Kualitas / QC (Rina Maharani) — PT Tri Daya Bangun  
**Related product:** Site Operations Dashboard — Web

---

## 0. How to use this PRD

This document specifies the **screens, information architecture, visible features, content, user journeys, prototype interactions, and representative field scenarios** for a mobile-first UI demo targeted at Indonesian building contractors.

### Core Product Positioning & Promise

**Posisi Produk:** *Site Operations & Project Quality Control*  
**Janji Produk Utama:**
> *"Pantau progres proyek, dokumentasikan pekerjaan lapangan, lakukan pemeriksaan kualitas, dan tindak lanjuti pekerjaan yang perlu diperbaiki dalam satu alur."*

Aplikasi lapangan ini dirancang khusus untuk penggunaan cepat dan praktis oleh tim lapangan (Site Supervisor, Site Engineer, Pengawas Mutu):
- **Buat Laporan Harian** secara ringkas dan praktis (tidak mewajibkan birokrasi tenaga kerja/alat rumit di setiap entri).
- **Update Progres Pekerjaan** per blok dan unit.
- **Dokumentasikan Pekerjaan** dengan foto langsung dari lapangan.
- **Catat Kendala** (cuaca, material, alat, akses).
- **Catat Material Datang** (semen, pasir, besi beton, bata ringan).
- **Ajukan Pemeriksaan** kesiapan pekerjaan menggunakan checklist acuan.
- **Catat Temuan** (punch list / cacat pekerjaan yang butuh perbaikan).
- **Kirim Bukti Perbaikan** dengan foto setelah dikerjakan subkon/mandor.
- **Lihat Status Pemeriksaan** dan izin kelanjutan pekerjaan.

---

# 1. Product overview

## 1.1 Product summary

Field Operations App adalah aplikasi mobile-first yang dioptimalkan untuk perangkat ponsel pintar pengawas lapangan. Aplikasi ini menyatukan dua peran kerja lapangan utama dalam satu alur terpadu:

1. **Site Engineer / Site Supervisor (Andi Pratama):**
   - Mengisi laporan harian lapangan dengan cepat.
   - Mengunggah progres pekerjaan per unit (misal: *Blok A — Unit A-05*, *Blok B — Unit B-12*, *Ruko 03 — Lantai 2*).
   - Mengajukan pemeriksaan pekerjaan ketika suatu tahapan selesai (misal: pembesian balok & pelat sebelum cor).
   - Mengirimkan bukti foto perbaikan atas temuan/punch list yang telah ditindaklanjuti mandor.

2. **Pengawas Kualitas / QC Inspector (Rina Maharani):**
   - Melihat antrean pemeriksaan terjadwal hari ini.
   - Memeriksa pekerjaan menggunakan checklist acuan proyek.
   - Merekam hasil pemeriksaan: *Sesuai*, *Perlu Perbaikan*, *Perlu Klarifikasi*, atau *Belum Diperiksa*.
   - Mencatat temuan pekerjaan langsung dengan foto, lokasi spesifik, dan tenggat waktu.
   - Memverifikasi bukti perbaikan di lapangan.

## 1.2 Familiar Location Context & Terminology

Aplikasi menggunakan struktur lokasi dan istilah yang lazim di proyek perumahan dan bangunan komersial Indonesia:
- **Lokasi familiar:** *Blok A — Unit A-05*, *Blok B — Unit B-12*, *Ruko 03 — Lantai 2*, *Area Parkir — Zona Timur*.
- **Tahapan konstruksi:** *Pondasi & Sloof*, *Struktur Beton*, *Dinding & Plesteran*, *Atap Baja Ringan*, *Instalasi MEP*, *Lantai & Keramik*, *Pengecatan*, *Finishing & Serah Terima (Punch List)*.
- **Bahasa operasional sederhana:**
  - *Ajukan Pemeriksaan* (bukan WIR kaku).
  - *Checklist Pemeriksaan / Acuan Pemeriksaan* (bukan formal ITP).
  - *Temuan Pekerjaan / Daftar Temuan (Punch List)* (bukan NCR otomatis).
  - *Tindak Lanjut Perbaikan & Verifikasi Perbaikan*.
  - *Izin Tahap Kritis* (fitur Advanced QC opsional untuk pengecoran struktur).

---

# 2. Target users and personas

## 2.1 Persona A — Site Engineer

**Primary responsibility:** coordinate technical work on a defined site area, report execution status, and prepare work for inspection.

Typical activities:
- check drawings and work references;
- coordinate foremen and subcontractors;
- monitor work by floor, zone, grid, chainage, or work front;
- report work completed and work still in progress;
- document site conditions and constraints;
- submit inspection requests;
- respond to comments and findings;
- coordinate re-inspection.

Typical app behavior:
- frequent, short sessions while moving around the site;
- photo capture and quick notes;
- switching among projects or work areas;
- checking the status of requests and corrective actions.

## 2.2 Persona B — Site Supervisor / Site Manager

**Primary responsibility:** oversee daily execution and coordinate labor, equipment, work fronts, and site issues.

Typical activities:
- review what work is planned and what is progressing;
- record labor and equipment presence;
- identify delays and constraints;
- review daily site reports;
- coordinate deliveries and subcontractors;
- ensure work is presented for inspection at the appropriate stage.

For the first demo, this persona can share most of the Site Engineer interface. The prototype may show a slightly different home screen or additional overview cards, but it should not become a separate application.

## 2.3 Persona C — QA/QC Inspector

**Primary responsibility:** inspect submitted work against the project-defined checklist and reference documents, document the result, and record observations or nonconformities through the applicable project process.

Typical activities:
- review the inspection request and location;
- check whether the submission includes the relevant references and evidence;
- conduct an inspection at the site;
- record checklist results and photographs;
- record observations or findings;
- communicate the outcome;
- verify corrective work and re-inspection.

Typical app behavior:
- work from an assigned inspection queue;
- open an inspection at the relevant location;
- work through checklist sections;
- record photos and concise notes;
- review previous inspection history.

## 2.4 Secondary participants represented in the UI

These participants may appear in records, assignments, or activity timelines, but do not require a dedicated app persona in the initial demo:
- subcontractor / trade contractor;
- foreman;
- project manager;
- site manager;
- owner or client representative;
- consultant / supervising engineer;
- third-party laboratory or testing provider.

The initial prototype does not need to give every external party a login. Their participation can be represented as an invited party, an assigned action, or a recorded external decision.

---

# 3. Product scope and feature hierarchy

## 3.1 Core experience

The app should prioritize four connected jobs:

1. **Report what happened on site.**
2. **Report what work is ready to be checked.**
3. **Record what the inspection found.**
4. **Show what must happen next.**

## 3.2 Feature groups

### P0 — Must appear in the demo
- Persona-based home screen
- Project selector and project overview
- Daily site report
- Work progress / work activity log
- Inspection request creation and tracking
- Inspection queue and inspection detail
- Checklist-based inspection
- Inspection result / findings
- Corrective action response and re-inspection
- Photo and evidence presentation
- Project documents / drawing references
- Inbox / notifications
- Activity timeline
- Demo role switcher and seeded scenario

### P1 — Valuable if time permits
- Quick site event / delay report
- Material delivery record
- Equipment / plant status record
- Visitors, instructions, and site meeting record
- Safety observation / incident reference
- Upcoming inspection calendar
- Search across projects and records
- Draft and submitted report history
- Mock offline / upload-pending visual state

### Out of scope
- Complete inventory and warehouse system
- Purchase orders and procurement approvals
- Payroll, HR, attendance, or timesheets
- Full scheduling and Gantt charts
- Budget, cost control, accounting, and claims calculation
- Full HSE management, incident investigation, or permit-to-work
- Full NCR/CAPA management suite
- Structural calculations or technical design checks
- Automated acceptance decisions
- Full drawing markup/BIM viewer

---

# 4. Core product concepts and terminology

The UI should use terminology familiar to Indonesian construction teams while allowing the project to use its own wording.

| Concept | Meaning in the app | Example |
|---|---|---|
| Project | A construction contract or project site | Gedung Aruna |
| Work package / activity | A defined unit of work | Pembesian balok lantai 2 |
| Work location | Physical location of the work | Tower A, Lantai 2, Grid C–F |
| Daily report / site diary | Record of a day's site activities and conditions | Laporan harian 31 Okt |
| Inspection request | A request to inspect a defined scope of work | WIR-STR-024 |
| Inspection point | A check defined in a project ITP or procedure | Pemeriksaan pembesian sebelum cor |
| ITP | Inspection and Test Plan / Rencana Inspeksi dan Pengujian | ITP Struktur |
| Hold point | A project-defined stop point pending required release | Pre-pour inspection |
| Witness point | A point where a specified party is invited to witness | Pemeriksaan pemasangan tulangan |
| Review point | A document or record review stage | Review shop drawing |
| Finding | An observation or issue recorded during a review | Jarak tulangan perlu diperbaiki |
| NCR | Formal nonconformance record when required by project quality procedure | NCR-STR-008 |
| Corrective action | Work/action taken to address a finding | Perbaikan jarak tulangan |
| Re-inspection | Follow-up inspection after corrective work | Re-inspeksi pembesian |
| Evidence | Photo, attachment, test report, checklist, or record | Foto kondisi lapangan |

**Terminology note:** Contractors may use WIR, RFI, IR, request for inspection, permintaan pemeriksaan, or their own labels. The UI demo should use a consistent default and show that the label is configurable per project.

**Important distinction:** a request returned because information is incomplete is not automatically a technical nonconformance. An observation is not automatically a formal NCR. A recorded inspection acceptance is not necessarily the same as the authorized release of a hold point. These differences should be evident in labels and screen copy.

---

# 5. Information architecture and navigation

## 5.1 Navigation model

Recommended bottom navigation:
1. **Beranda** — role-specific summary and quick actions.
2. **Pekerjaan** — work packages, progress records, and daily activity.
3. **Inspeksi** — requests, assigned inspections, and inspection history.
4. **Inbox** — pending actions, comments, and notifications.
5. **Lainnya** — findings, documents, daily reports, project information, profile, and demo settings.

The navigation may be adapted if the visual design benefits from a prominent “Laporan Harian” action. Keep the number of primary destinations small.

## 5.2 Global header

The header should consistently provide:
- current project selector;
- current persona / role indicator;
- notification indicator;
- contextual page title;
- back navigation where appropriate.

When no project is selected, the app shows a project selection or portfolio context.

## 5.3 Persona-specific home

The app is one product with role-specific priorities.

### Site Engineer / Supervisor home

Prioritize:
- today's active project;
- daily report status;
- work activities in progress;
- inspections requiring submission;
- inspection requests awaiting response;
- findings assigned to the site team;
- quick actions: `Buat Laporan Harian`, `Laporkan Progres`, `Ajukan Inspeksi`, `Catat Kendala`.

### QA/QC Inspector home

Prioritize:
- inspections assigned to me;
- inspections scheduled today;
- pending review / inspection;
- re-inspections waiting;
- findings awaiting verification;
- quick actions: `Mulai Inspeksi`, `Lihat Antrian`, `Verifikasi Perbaikan`.

---

# 6. Screen inventory

| ID | Screen | Primary persona | Priority |
|---|---|---|---|
| FO-01 | Splash / demo entry | All | P0 |
| FO-02 | Persona selection / role switcher | Demo presenter | P0 |
| FO-03 | Project selector | All | P0 |
| FO-04 | Project overview | All | P0 |
| FO-05 | Site Engineer home | Site Engineer / Supervisor | P0 |
| FO-06 | QC Inspector home | QC Inspector | P0 |
| FO-07 | Work activity list | Site Engineer / Supervisor | P0 |
| FO-08 | Work activity detail | Site Engineer / Supervisor | P0 |
| FO-09 | Record work progress | Site Engineer / Supervisor | P0 |
| FO-10 | Daily report list | Site Engineer / Supervisor | P0 |
| FO-11 | Daily report wizard — general conditions | Site Engineer / Supervisor | P0 |
| FO-12 | Daily report wizard — workforce | Site Engineer / Supervisor | P0 |
| FO-13 | Daily report wizard — work performed | Site Engineer / Supervisor | P0 |
| FO-14 | Daily report wizard — equipment & deliveries | Site Engineer / Supervisor | P0/P1 |
| FO-15 | Daily report wizard — delays, visitors, safety & notes | Site Engineer / Supervisor | P0/P1 |
| FO-16 | Daily report preview / status | Site Engineer / Supervisor | P0 |
| FO-17 | Inspection request list | Site Engineer / Supervisor | P0 |
| FO-18 | Create inspection request — scope & location | Site Engineer / Supervisor | P0 |
| FO-19 | Create inspection request — checklist & references | Site Engineer / Supervisor | P0 |
| FO-20 | Create inspection request — schedule & parties | Site Engineer / Supervisor | P0 |
| FO-21 | Inspection request preview / detail | Site Engineer / Supervisor | P0 |
| FO-22 | QC inspection queue | QC Inspector | P0 |
| FO-23 | Inspection detail — QC view | QC Inspector | P0 |
| FO-24 | Conduct inspection — checklist | QC Inspector | P0 |
| FO-25 | Conduct inspection — observations & evidence | QC Inspector | P0 |
| FO-26 | Inspection outcome summary | QC Inspector | P0 |
| FO-27 | Findings list | Site Engineer / QC | P0 |
| FO-28 | Finding detail | Site Engineer / QC | P0 |
| FO-29 | Corrective action response | Site Engineer / Supervisor | P0 |
| FO-30 | Corrective action verification | QC Inspector | P0 |
| FO-31 | Re-inspection request / detail | Both | P0 |
| FO-32 | Photo and evidence gallery | Both | P0 |
| FO-33 | Project documents / drawing viewer | Both | P0 |
| FO-34 | Inbox / action center | Both | P0 |
| FO-35 | Notification detail / comment thread | Both | P1 |
| FO-36 | Quick site event / delay record | Site Engineer / Supervisor | P1 |
| FO-37 | Material delivery record | Site Engineer / Supervisor | P1 |
| FO-38 | Equipment / plant log | Site Engineer / Supervisor | P1 |
| FO-39 | Visitors / instructions log | Site Engineer / Supervisor | P1 |
| FO-40 | Profile, preferences, help, demo reset | All | P0 |

---

# 7. Detailed screen requirements

## 7.1 FO-01 — Splash / demo entry

Purpose:
- Establish product identity and construction context.
- Clearly mark the environment as a prototype.

Visible elements:
- product logo/name;
- short positioning statement;
- “Prototype / Demo Data” label;
- `Masuk ke Demo` action.

## 7.2 FO-02 — Persona selection / role switcher

Purpose:
- Let the presenter demonstrate the two primary user experiences.

Persona cards:
- Site Engineer / Supervisor
- QA/QC Inspector

Each card shows:
- sample user name;
- role;
- assigned project(s);
- one-line responsibility.

Include a persistent but unobtrusive `Ganti Role Demo` control in the profile or demo menu. Switching persona should return to that persona's home screen and update visible mock assignments.

This is a prototype convenience. Do not present it as a real user permission feature.

## 7.3 FO-03 — Project selector

Purpose:
- Show the user's assigned project context.

Project card content:
- project name/code;
- project type;
- location;
- client/owner name;
- project manager / site manager;
- project status;
- current workflow summary;
- latest update.

UI states to design:
- multiple assigned projects;
- one project only;
- no project assigned;
- project archived/completed;
- search/filter result empty.

## 7.4 FO-04 — Project overview

Purpose:
- Give a compact field-level view of the selected project.

Sections:
- project header and location;
- project team/contact summary;
- today's work fronts;
- work activities in progress;
- inspections scheduled/awaiting action;
- findings/corrective actions assigned to the current persona;
- latest daily report;
- current documents / drawing references;
- recent project activity.

Avoid displaying overall budget, financial progress, or full schedule unless explicitly included as read-only context from another system.

## 7.5 FO-05 — Site Engineer home

Recommended layout:
1. greeting and date;
2. project selector;
3. `Laporan harian` prominent card with current state (`Belum dibuat`, `Draft`, `Sudah dikirim`);
4. `Pekerjaan saya` with in-progress items;
5. `Inspeksi` with requests awaiting response or upcoming inspection;
6. `Tindak lanjut` with findings assigned to the site team;
7. quick action buttons.

Example quick actions:
- Buat laporan harian
- Update progres pekerjaan
- Ajukan inspeksi
- Laporkan kendala
- Catat material datang

Content should emphasize tasks that need attention, not generic charts.

## 7.6 FO-06 — QC Inspector home

Recommended layout:
1. greeting and date;
2. assigned project selector;
3. inspections scheduled today;
4. pending inspection queue;
5. re-inspections;
6. corrective actions awaiting verification;
7. recently recorded decisions;
8. quick action `Mulai inspeksi`.

Each card should expose:
- request ID;
- activity and location;
- requested/scheduled time;
- submitter;
- inspection type (Hold / Witness / Review / other project-defined type);
- urgency/age label where useful.

## 7.7 FO-07 — Work activity list

Purpose:
- Let field users locate the activity they need to report or present for inspection.

List content:
- activity/work package name;
- discipline/trade;
- location;
- subcontractor or responsible team;
- displayed progress state;
- next inspection point, if relevant;
- recent update.

Filters:
- project;
- building/block/area/floor/grid/chainage;
- discipline;
- status;
- assigned team.

Example activity categories:
- pekerjaan tanah;
- pondasi;
- pembesian;
- bekisting;
- pengecoran;
- pekerjaan struktur;
- waterproofing;
- pasangan dinding;
- finishing;
- instalasi listrik;
- plumbing;
- HVAC;
- pekerjaan jalan/perkerasan.

These are examples for demo content, not a universal activity taxonomy.

## 7.8 FO-08 — Work activity detail

Sections:
- activity name and reference;
- project and exact location;
- work scope/description;
- assigned trade/subcontractor;
- current status;
- recent progress entries;
- related inspection points;
- linked drawings/specifications/method statements;
- open findings;
- photo history;
- related next activity (informational).

Primary actions:
- `Update progres`
- `Ajukan inspeksi`
- `Lihat dokumen`
- `Catat kendala`

Show the difference between an activity being reported as physically complete and being accepted/released through an applicable inspection workflow.

## 7.9 FO-09 — Record work progress

Purpose:
- Capture a concise field update for a work activity.

Visible fields:
- activity and work location;
- reporting date/time;
- progress state (belum mulai / berlangsung / selesai dilaporkan / tertahan);
- work description;
- quantity completed and unit, where applicable;
- work area or portion covered;
- trade/subcontractor;
- photo gallery/camera placeholder;
- comments or constraints;
- related inspection / finding link.

UI presentation:
- use short, structured sections;
- show example quantity units appropriate to the activity (m, m², m³, unit, titik, lot);
- allow a narrative note for context;
- show previous progress entries.

Avoid implying that the progress percentage is calculated from a formal baseline schedule.

## 7.10 FO-10 — Daily report list

Purpose:
- Find daily reports for a selected project.

Each row/card:
- report date;
- report reference;
- author;
- shift / work period;
- status (Draft, Submitted, Returned for Update, Reviewed);
- short preview of work activity;
- last update.

Filters:
- date range;
- status;
- author;
- shift.

Display:
- current day's report;
- recent reports;
- returned reports;
- reports with delayed entry labels.

## 7.11 FO-11 to FO-16 — Daily report creation and presentation

The daily report is a **site diary-style record**, not a long essay. It should be designed as a short multi-step form with a visible progress indicator and a clear review screen.

### FO-11 — General conditions

Visible content:
- project and report date;
- prepared by;
- shift / work hours;
- weather conditions;
- site condition (dry, wet, muddy, flooded, restricted access, etc.);
- impact of weather/site condition on work;
- site working hours or exceptional closure;
- optional general note.

Weather UI:
- condition selector (sunny, cloudy, rain, heavy rain, wind, other);
- optional temperature/rainfall placeholder if the project wants it;
- “impact on work?” selection;
- impact description and time range.

Do not require a weather API for the prototype. Use manual illustrative values.

### FO-12 — Workforce / manpower

Visible content:
- workforce grouped by company/subcontractor and trade;
- number of workers;
- hours/shift;
- work area;
- optional remarks.

Example rows:
- kontraktor utama — site engineer — 2;
- subkontraktor pembesian — fitter / installer — 8;
- subkontraktor bekisting — carpenter — 6;
- operator alat — 2.

UI states:
- no manpower entry;
- multiple subcontractors;
- workforce changed mid-shift;
- subcontractor not present;
- manpower details not available (display as “belum dicatat”, not zero).

Do not build payroll, attendance, or timesheet functionality.

### FO-13 — Work performed

Visible content:
- activity/work package;
- location (tower/floor/grid/zone or chainage);
- work description;
- quantity and unit, if known;
- status (ongoing/completed/partially completed/stopped);
- responsible trade/subcontractor;
- progress photos;
- remarks.

Support several work entries in one daily report.

Example:
- pembesian balok, Tower A, Lantai 2, Grid C–F;
- bekisting kolom, Tower A, Lantai 3;
- pemasangan pipa air bersih, Basement 1, Zona B.

### FO-14 — Equipment, plant, and deliveries

This section may be split into two cards or substeps.

**Equipment / plant**
- equipment name/type;
- unit/asset identifier;
- location;
- status: operating / idle / under maintenance / breakdown / not on site;
- reported operating/idle hours, if available;
- downtime reason and duration;
- photo/remark.

Examples:
- tower crane;
- excavator;
- concrete pump;
- vibrator;
- dump truck;
- generator.

**Material deliveries**
- supplier;
- delivery note / surat jalan reference;
- material name/specification;
- expected and received quantity;
- unit;
- delivery time;
- receiving location;
- condition: accepted / short quantity / damaged / wrong item / pending check;
- photo of delivery or docket;
- remarks.

This is a lightweight field record, not inventory, stock valuation, goods-received accounting, or procurement approval.

### FO-15 — Delays, visitors, instructions, safety references, and next-day notes

**Delays / disruptions**
- category: weather, material, equipment, labor, access, design/RFI, inspection/approval, coordination, other;
- affected activity/location;
- start/end time or estimated time lost;
- description;
- parties involved, where known;
- supporting photo or reference.

**Visitors and meetings**
- person/company;
- role/purpose;
- arrival/departure time;
- area visited;
- summary / action item.

**Instructions / site directions**
- instruction description;
- source/person issuing instruction;
- time/date;
- affected activity;
- photo/document reference;
- follow-up required.

**Safety and environmental references**
- toolbox talk / pre-start briefing held (yes/no/not recorded);
- safety observation or hazard reference;
- incident / near-miss reference where relevant;
- environmental concern (dust, noise, waste, spill, water discharge) where relevant.

This is only a field-report summary/reference, not a full HSE reporting workflow or incident-investigation tool.

**Plan / needs for next shift or day**
- planned work;
- material/equipment/personnel needed;
- information or drawing clarification needed;
- activities likely to require inspection;
- outstanding blocker.

### FO-16 — Daily report preview / status

Purpose:
- Present the full daily report in a readable summary before the demo's simulated submission.

Layout:
- report header;
- general conditions;
- manpower summary;
- completed and ongoing work;
- equipment and deliveries;
- delays/events;
- visitor/instruction/safety summary;
- photo strip;
- next-day plan;
- author and review status.

Prototype actions:
- `Edit bagian`
- `Lihat sebagai laporan`
- `Kirim laporan (simulasi)`

After simulated submission, show a confirmation state and report status. If demonstrating a returned report, show review comments and a path back to the relevant section.

---

# 8. Inspection request experience — Site Engineer / Supervisor

## 8.1 FO-17 — Inspection request list

Purpose:
- Show the user's requests and their current stage.

Tabs or filters:
- Semua
- Draft
- Menunggu review
- Terjadwal
- Perlu perbaikan
- Minta klarifikasi
- Inspeksi ulang
- Selesai
- Dibatalkan / ditarik

Inspection card content:
- request number;
- activity and location;
- inspection point/type;
- date requested;
- requested/scheduled inspection time;
- reviewer/party;
- status;
- latest comment / next action.

Include examples of:
- upcoming inspection;
- pending response;
- returned for correction;
- accepted;
- re-inspection;
- withdrawn/cancelled.

## 8.2 FO-18 — Create inspection request: scope and location

Step 1: choose the project and work activity.

Visible fields:
- project;
- work package/activity;
- discipline/trade;
- building/block/level/zone/grid/chainage;
- work portion or quantity to be inspected;
- short work description;
- related previous inspection, if this is a re-inspection.

Location examples:
- Tower A — Lantai 2 — Grid C–F — Balok B2;
- Jalan STA 1+200 hingga STA 1+250;
- Basement 1 — Ruang Pompa — Area P-03.

The UI should visually support different location patterns by project type; it does not need a universal location data model in the prototype.

## 8.3 FO-19 — Create inspection request: inspection point, checklist and references

Visible content:
- inspection point name;
- inspection type badge (Hold / Witness / Review / Surveillance / project-defined);
- ITP reference;
- stage/work sequence;
- relevant drawing/specification/method statement;
- revision indicator;
- pre-inspection readiness checklist;
- evidence/documents required for the request.

Example for structural pre-pour:
- reinforcement installation;
- bar size/spacing/lap reference;
- cover blocks/chairs;
- formwork condition;
- embedded items/sleeves;
- cleanliness and readiness;
- related approved drawing/ITP reference.

These examples are illustrative. The acceptance criteria must come from approved project documents. The UI should not invent technical tolerances.

If a checklist item is not relevant, it may be shown as “Tidak berlaku” with a visible reason field in the design. The prototype only needs to depict the presentation.

## 8.4 FO-20 — Create inspection request: schedule and parties

Visible content:
- requested inspection date/time;
- preferred time window;
- notice period reminder from the project configuration;
- internal reviewer;
- external witness/consultant/client representative, if applicable;
- optional notes/instructions;
- contact/meeting location.

Display whether an inspection is a hold, witness, or review point and a short explanation of what that means in the current project context.

Do not state that silence, absence, or elapsed time automatically authorizes work to proceed.

## 8.5 FO-21 — Inspection request preview / detail (submitter view)

Sections:
- request summary;
- project/activity/location;
- inspection point/type;
- schedule and involved parties;
- readiness checklist summary;
- drawing/ITP references and revisions;
- evidence gallery;
- status and next action;
- comments/history.

Prototype actions may include:
- edit draft;
- view submitted request;
- withdraw request (illustrative);
- respond to clarification;
- view inspection outcome;
- create re-inspection request.

The detail screen should keep the original submission visible even after a later response or re-inspection.

---

# 9. Inspection execution experience — QA/QC Inspector

## 9.1 FO-22 — QC inspection queue

Purpose:
- Let inspectors find the inspections they need to handle.

Views:
- Hari ini
- Akan datang
- Menunggu inspeksi
- Inspeksi ulang
- Menunggu verifikasi tindakan
- Riwayat

Inspection queue card:
- request ID;
- project;
- activity and location;
- inspection point/type;
- requested/scheduled time;
- submitter;
- external parties invited;
- age/status;
- short note.

Include visual distinctions for:
- hold point;
- witness point;
- review point;
- re-inspection;
- inspection requiring external attendance.

## 9.2 FO-23 — Inspection detail: QC view

The detail page should answer, at a glance:
- What is being inspected?
- Where is it?
- Who requested it?
- When is it scheduled?
- Which inspection point and project references apply?
- What evidence has been provided?
- Who else is expected to attend?
- What happened in previous inspection rounds?

Sections:
1. request summary;
2. work scope and exact location;
3. inspection point and type;
4. ITP/checklist reference;
5. drawing/specification/method statement documents;
6. submitter's readiness checklist;
7. evidence gallery;
8. related previous inspections/findings;
9. inspection action.

Primary action: `Mulai inspeksi`.

Secondary actions:
- lihat dokumen;
- hubungi/lihat kontak (simulated);
- catat perubahan jadwal;
- catat ketidakhadiran pihak yang diundang;
- lihat riwayat.

## 9.3 FO-24 — Conduct inspection: checklist

Purpose:
- Present the configured inspection checklist in a mobile-friendly, sectioned layout.

Checklist item presentation:
- item number/title;
- requirement or reference description;
- reference source/revision;
- result control: Sesuai / Tidak sesuai / Tidak berlaku / Belum diperiksa;
- concise note;
- add photo/evidence;
- optional measurement text display if relevant to the project.

Example structural pre-pour checklist sections:
- drawing and work location;
- reinforcement;
- cover and supports;
- formwork;
- embedded items/openings;
- cleanliness;
- access and readiness;
- supporting test/document records.

Other possible discipline templates to show in demo:
- MEP installation: route, supports, joints, labels, pressure/test record reference;
- waterproofing: substrate preparation, application layer, upturn/detail, ponding-test record;
- roadworks: location/chainage, layer, surface condition, test result reference;
- masonry/finishing: substrate, alignment/level, workmanship, sample/mock-up reference.

Do not use one universal checklist across disciplines.

## 9.4 FO-25 — Conduct inspection: observation and evidence

The inspector needs to document what was observed.

Visible fields:
- observation/finding description;
- exact location within the work area;
- affected quantity/extent (if known);
- photo capture/attachment placeholder;
- mark-up/annotation preview (optional mock);
- related checklist item;
- category label (observation, incomplete item, potential nonconformance, confirmed nonconformance, project-specific);
- recommended next step or comment.

Provide an “extent not yet determined” display state for cases where the affected area needs further investigation.

The UI must not automatically call every comment an NCR. It should show the project's terminology and distinguish informal observation from formal nonconformance records.

## 9.5 FO-26 — Inspection outcome summary

Purpose:
- Show a structured summary of what happened during the inspection.

Possible outcomes represented:
- Accepted / Sesuai
- Correction required / Perlu perbaikan
- Clarification required / Perlu klarifikasi
- Deferred / Dijadwalkan ulang
- Unable to inspect / Tidak dapat diperiksa
- Partial inspection / Sebagian diperiksa
- No-show / pihak yang diundang tidak hadir (where relevant)

Outcome summary includes:
- inspected scope;
- checklist summary;
- observations/findings;
- evidence;
- reviewer;
- inspection date/time;
- external attendance/decision notes;
- next action;
- linked request/history.

When a hold point applies, show a separate hold-point status area. “Accepted” must not be visually equated with “hold point released” unless the displayed project process represents both.

---

# 10. Findings and corrective action experience

## 10.1 FO-27 — Findings list

Purpose:
- Give both Site Engineer and QC a focused view of field findings.

Tabs:
- Assigned to me / tim saya
- Open
- Menunggu bukti perbaikan
- Menunggu verifikasi
- Rejected / perlu tindak lanjut
- Closed / riwayat

Finding card:
- finding reference;
- project and activity;
- location;
- concise description;
- source inspection;
- classification;
- responsible team/company;
- due date;
- status.

## 10.2 FO-28 — Finding detail

Sections:
- finding summary;
- source inspection/request;
- precise location and affected scope;
- original observation;
- source checklist item or project reference;
- original photos/evidence;
- responsible party;
- target date;
- corrective action description;
- response evidence;
- verification history;
- comments and activity timeline.

Show clearly whether the record is:
- observation;
- request for clarification;
- incomplete submission;
- potential nonconformance;
- formal NCR reference;
- project-specific issue.

## 10.3 FO-29 — Corrective action response (Site Engineer)

Purpose:
- Let the field team show what has been done in response to a finding.

Visible content:
- original finding and photos;
- required action/comment;
- location;
- responsible team;
- response description;
- after-correction photos;
- completion date/time display;
- submit-for-verification action.

The prototype should show both:
- action in progress;
- action evidence submitted, awaiting QC verification.

Do not present a submitter's “completed” button as equivalent to QC verification or formal closure.

## 10.4 FO-30 — Corrective action verification (QC)

Visible content:
- original finding;
- corrective action and submitter response;
- before/after photos;
- inspection/verification checklist;
- verification notes;
- outcomes: verified / further work required / clarification required;
- history of previous verification attempts.

If verification is unsuccessful, show the previous response and the new comments together so the user understands what remains unresolved.

## 10.5 FO-31 — Re-inspection

Re-inspection view should:
- link to the original inspection request;
- show original findings and decision;
- show corrective action response;
- identify the portion being re-inspected;
- display new inspection date/time and parties;
- preserve the inspection round history.

Example:
- WIR-STR-024 — initial inspection;
- Round 1 — correction required;
- corrective response submitted;
- Round 2 — re-inspection;
- final outcome recorded.

The UI should not overwrite the original inspection result with the latest result.

---

# 11. Photos, evidence, and documents

## 11.1 FO-32 — Photo and evidence gallery

Purpose:
- Provide a useful view of field evidence, not merely a generic image picker.

Gallery groupings:
- by project;
- by work activity/location;
- by daily report;
- by inspection request;
- by finding/corrective action.

Photo card should display:
- thumbnail;
- caption/description;
- category (progress, inspection, finding, delivery, equipment, site condition);
- location label;
- capture date/time as supplied in demo data;
- linked record.

Visual states:
- image available;
- image upload pending (simulated);
- upload failed (simulated);
- attachment unavailable;
- image superseded/replaced;
- photo set for before/after comparison.

Do not infer exact coordinates or technical compliance from an image.

## 11.2 FO-33 — Project document and drawing viewer

Purpose:
- Give field users context for the approved project reference while working.

Document categories:
- drawings;
- specifications;
- ITP / inspection checklist;
- method statement;
- material approval/submittal;
- test report/certificate;
- work instruction;
- other project reference.

Document list card:
- title/document number;
- discipline;
- revision;
- document status (current, superseded, for review, reference);
- issue date;
- relevant work package.

Document viewer:
- page/image preview;
- title and revision header;
- page selector;
- search/zoom mock controls;
- related inspection/work activity;
- visible warning if the record references an older revision.

The demo does not need a full document-control system, drawing markup engine, or version-comparison logic. It should simply make the reference and revision visible.

---

# 12. Supporting field records

These are secondary features. They add realism to the daily report experience but must not take over the product concept.

## 12.1 FO-36 — Quick site event / delay record

Purpose:
- Let field staff record a specific disruption while it is fresh.

Event types:
- weather;
- late/short/wrong material delivery;
- equipment breakdown;
- labor/subcontractor shortage;
- access restriction;
- design information/RFI pending;
- inspection/approval waiting;
- coordination conflict;
- unexpected site condition;
- other.

Visible content:
- project and location;
- affected activity/work front;
- event date/time;
- event description;
- duration / estimated time impact (if known);
- affected team/equipment;
- photos;
- linked daily report.

This is not an extension-of-time claim calculator or formal delay entitlement determination.

## 12.2 FO-37 — Material delivery record

Visible fields:
- supplier;
- delivery note reference;
- material/item and specification;
- expected quantity;
- received quantity;
- unit;
- delivery time;
- receiving location;
- condition;
- short/damaged/wrong item note;
- photo of item or delivery docket;
- related work activity.

Scenarios:
- full delivery;
- partial/short delivery;
- damaged materials;
- wrong specification/item;
- delivery without complete document;
- rejected or quarantined delivery pending review.

This is not procurement or inventory management.

## 12.3 FO-38 — Equipment / plant log

Visible fields:
- equipment;
- asset/registration ID;
- location;
- operating/idle/breakdown/maintenance/not-on-site status;
- period or shift;
- operating and idle hours (if shown);
- issue/downtime description;
- photo;
- linked activity.

Scenarios:
- equipment breakdown during critical activity;
- equipment available but idle because work front is not ready;
- equipment moved to another work area;
- equipment not delivered as planned;
- maintenance/repair record.

This is not a full fleet or maintenance system.

## 12.4 FO-39 — Visitors and instructions log

Visible fields:
- visitor / issuing party;
- organization and role;
- visit/instruction date and time;
- area visited;
- purpose;
- summary of discussion/instruction;
- follow-up item;
- linked document/photo/reference.

Use cases:
- consultant site visit;
- owner walkthrough;
- verbal instruction requiring written follow-up;
- coordination meeting;
- third-party testing visit.

This is not a complete correspondence, RFI, or contract-administration module.

---

# 13. Inbox, comments, and notifications

## 13.1 FO-34 — Inbox / action center

Purpose:
- Present records that require the current persona's attention.

For Site Engineer:
- inspection returned for correction;
- clarification requested;
- inspection scheduled or rescheduled;
- finding assigned;
- corrective action due;
- QC has verified/rejected response;
- daily report returned for update.

For QC:
- new inspection request;
- inspection scheduled;
- re-inspection requested;
- corrective action submitted for verification;
- updated evidence available;
- external party attendance/decision update.

Each item should show:
- action title;
- project and location;
- linked request/finding;
- sent by / relevant party;
- date/time;
- status/priority;
- direct navigation to record.

## 13.2 FO-35 — Notification detail / comment thread

Show:
- notification source;
- linked record;
- message/comment;
- attachments;
- chronological thread;
- reply/comment field mock;
- related action.

Example comment:
“Mohon lengkapi foto detail sambungan dan gunakan referensi gambar revisi terbaru sebelum inspeksi dijadwalkan kembali.”

Avoid building a full chat product. Messages should remain contextual to an inspection, finding, or report.

---

# 14. End-to-end user journeys

## Journey A — Site Engineer creates the daily report

1. Open the app as Site Engineer.
2. Select `Gedung Aruna — Tower A`.
3. Home shows daily report status as `Belum dibuat`.
4. Tap `Buat laporan harian`.
5. Enter date, shift, and weather/site conditions.
6. Add workforce by trade/subcontractor.
7. Add work performed by activity and location.
8. Add equipment and material delivery records where relevant.
9. Record delay, visitor, instruction, or safety reference if applicable.
10. Add site photos and next-day plan.
11. Review the report preview.
12. Tap `Kirim laporan (simulasi)`.
13. Show submitted confirmation and report detail.
14. Return to home; report status is now shown as `Sudah dikirim`.

Demo value:
- Shows that the app is designed for actual field reporting rather than only dashboard consumption.

## Journey B — Site Engineer submits a pre-pour inspection request

1. Open `Pekerjaan`.
2. Select `Pembesian balok — Tower A, Lantai 2, Grid C–F`.
3. Tap `Ajukan inspeksi`.
4. Select the pre-pour inspection point from the illustrative ITP list.
5. See the inspection type and relevant project reference.
6. Review the readiness checklist.
7. Add evidence photos and drawing/ITP references.
8. Select requested inspection date/time and invited parties.
9. Review the request.
10. Submit the request in the prototype.
11. Request detail shows status `Menunggu review / terjadwal` as appropriate to the scripted scenario.
12. The same request appears in the QC Inspector's queue and in the web dashboard's inspection register.

Demo value:
- Shows cross-role continuity between field submission, QC, and management.

## Journey C — QC carries out an inspection and records a finding

1. Switch persona to QC Inspector.
2. Open `Inspeksi`.
3. Select the pre-pour request.
4. Review work location, inspection point, references, checklist, and evidence.
5. Tap `Mulai inspeksi`.
6. Review the checklist section by section.
7. Mark illustrative checks and add a finding where needed.
8. Capture or select a mock photo.
9. Review the outcome summary.
10. Select `Perlu perbaikan`.
11. Record the comment and affected location.
12. Show the inspection outcome and linked finding.
13. The finding appears in the Site Engineer's list.

Demo value:
- Shows that an inspection outcome becomes an actionable field item, not just a status badge.

## Journey D — Site Engineer responds and requests re-inspection

1. Switch to Site Engineer.
2. Open `Tindak lanjut`.
3. Select the finding.
4. Review the original QC note and evidence.
5. Add a corrective-action response.
6. Attach after-correction photos.
7. Tap `Kirim untuk verifikasi`.
8. Status becomes `Menunggu verifikasi QC`.
9. Switch to QC.
10. Open `Verifikasi perbaikan`.
11. Review the evidence and record an illustrative result.
12. If accepted, show finding verified and offer a related re-inspection path where the project process requires inspection of the corrected work.
13. Show original inspection, correction, response, verification, and re-inspection as a continuous history.

Demo value:
- Demonstrates closed-loop handling of an issue.

## Journey E — QC cannot inspect because the work is not ready

1. QC opens the scheduled inspection.
2. Detail shows the work location and requested scope.
3. QC records `Tidak dapat diperiksa / pekerjaan belum siap`.
4. Adds a comment such as “Bekisting sisi timur belum selesai dibersihkan.”
5. Record displays an action for the Site Engineer.
6. Site Engineer sees the returned request and can update/re-submit or request another time.

Demo value:
- Shows a realistic field outcome other than pass/fail.

## Journey F — Consultant / witness party does not attend

1. Inspection detail shows a witness party invited for a scheduled inspection.
2. QC records attendance as `Tidak hadir`.
3. The timeline shows the invitation, planned time, attendance note, and next action.
4. UI displays a project-procedure reminder such as “Tindak lanjut mengikuti ketentuan witness point proyek.”
5. No automatic approval or release is shown merely because the party did not attend.

Demo value:
- Demonstrates a realistic external coordination case without pretending the app determines contract rights.

## Journey G — Material delivery is short or damaged

1. Site Engineer opens quick action `Catat material datang`.
2. Selects supplier and material.
3. Enters delivery note reference, expected and received quantity.
4. Selects condition `Kurang` or `Rusak`.
5. Adds photo and comment.
6. Saves the illustrative record.
7. The item appears in the daily report and related site event view.

Demo value:
- Demonstrates that the daily field record can capture operational disruptions.

## Journey H — Equipment breakdown delays a work front

1. Site Engineer opens `Catat kendala`.
2. Selects equipment breakdown.
3. Chooses equipment and affected activity/location.
4. Records the observed time and description.
5. Adds evidence photo.
6. The event appears in the daily report summary.
7. Site Engineer can see it in recent site events.

Demo value:
- Shows a structured record of field conditions without building fleet maintenance software.

## Journey I — Work is partially inspected

1. QC opens an inspection request covering a larger work area.
2. Records the inspected portion and the uninspected remainder.
3. Outcome summary clearly shows the partial scope.
4. The UI shows the remainder as a separate open portion / follow-up item.
5. The original request remains in history.

Demo value:
- Avoids suggesting that a partial inspection means the whole work package was accepted.

---

# 15. Real-world scenarios to represent in the prototype

This is a scenario coverage catalogue for the UI demo. It specifies **which screen state or user journey should be shown**, not backend rules or validation code.

| ID | Scenario | Persona | UI representation / state |
|---|---|---|---|
| SC-01 | User has several assigned projects | Both | Project selector with multiple project cards |
| SC-02 | User has only one assigned project | Both | Home opens directly into the project context |
| SC-03 | No project is assigned | Both | Empty state with contact/admin guidance |
| SC-04 | Project is archived/completed | Both | Read-only historical project label |
| SC-05 | Daily report has not been created | Site Engineer | Empty daily report card and `Buat laporan` CTA |
| SC-06 | Daily report is saved as draft | Site Engineer | Draft badge and continue-editing action |
| SC-07 | Daily report has been submitted | Site Engineer | Submitted status and report preview |
| SC-08 | Daily report is returned for update | Site Engineer | Review comment linked to affected section |
| SC-09 | Report is entered after the actual work date | Site Engineer | `Entri terlambat` label and event date/entry date display |
| SC-10 | Night shift spans two calendar dates | Site Engineer | Shift start/end display and report date context |
| SC-11 | Weather changes during the day | Site Engineer | Multiple weather/condition entries or time-based note |
| SC-12 | Heavy rain stops work | Site Engineer | Weather event linked to affected activity and time |
| SC-13 | Some trades did not attend | Site Engineer | Workforce section showing absent/not present trade |
| SC-14 | Several subcontractors work on site | Site Engineer | Manpower list grouped by company/trade |
| SC-15 | Manpower count is not yet available | Site Engineer | “Belum dicatat” state, distinct from zero |
| SC-16 | Work is partially completed | Site Engineer | Progress entry with partial-completion label and quantity |
| SC-17 | Several activities are performed in one day | Site Engineer | Multiple activity cards in one daily report |
| SC-18 | Work is stopped due to missing information/drawing | Site Engineer | Delay/event card with design/RFI category |
| SC-19 | Equipment breaks down | Site Engineer | Equipment status and downtime event |
| SC-20 | Equipment is idle because work is not ready | Site Engineer | Idle status linked to a work-front blocker |
| SC-21 | Material delivery is incomplete | Site Engineer | Delivery record with expected vs received quantity |
| SC-22 | Material arrives damaged or wrong | Site Engineer | Condition badge, photo, and note |
| SC-23 | Material arrives without complete delivery document | Site Engineer | Missing-document note in delivery detail |
| SC-24 | Consultant/owner visits site | Site Engineer | Visitor log entry and purpose |
| SC-25 | Verbal instruction is received | Site Engineer | Instruction record with issuer, time, and follow-up |
| SC-26 | Toolbox talk or safety briefing is conducted | Site Engineer | Daily report safety reference |
| SC-27 | Hazard or near miss is observed | Site Engineer | Safety observation reference and linked event |
| SC-28 | Photo is attached to the wrong work area | Both | Evidence detail showing location label and edit/update path |
| SC-29 | Photo is still uploading | Both | Simulated pending-upload card |
| SC-30 | Photo upload fails | Both | Simulated retry state and visible failed attachment |
| SC-31 | Drawing revision has changed | Both | Current revision badge and warning on older referenced revision |
| SC-32 | Inspection request is missing evidence | Site Engineer | Request detail with missing/incomplete evidence presentation |
| SC-33 | Inspection request is for wrong location | Both | Returned request with location correction comment |
| SC-34 | Duplicate request exists | Both | Similar/related request indicator; both records remain visible |
| SC-35 | Request was submitted too early | Both | `Belum siap diperiksa` / returned-for-update state |
| SC-36 | QC reviewer is unavailable | Both | Rescheduled inspection card and updated schedule timeline |
| SC-37 | Inspection time changes | Both | Original and revised schedule shown in history |
| SC-38 | External witness party does not attend | QC | Attendance note and project-procedure follow-up |
| SC-39 | Multiple parties are invited | QC | Separate attendance/decision indicators for each party |
| SC-40 | Inspection covers only part of the submitted scope | QC | Partial-inspection outcome with inspected vs remaining area |
| SC-41 | QC accepts the inspected work | QC | Accepted outcome and inspection summary |
| SC-42 | QC requests correction | QC | Finding created and linked to original request |
| SC-43 | QC requests clarification only | QC | Clarification state without NCR-style wording |
| SC-44 | QC cannot inspect because work is not ready | QC | Unable-to-inspect outcome with comment |
| SC-45 | QC records an observation only | QC | Observation label distinct from formal NCR |
| SC-46 | QC records a potential/confirmed nonconformance | QC | Classification and linked formal NCR reference placeholder |
| SC-47 | Extent of a finding is not known | QC | “Extent under investigation” display |
| SC-48 | One finding has several corrective actions | Both | Finding detail with multiple action cards |
| SC-49 | Corrective action is submitted for verification | Site Engineer | Waiting-for-QC-verification state |
| SC-50 | Corrective action fails verification | QC | Verification returned with new comments; previous response retained |
| SC-51 | Corrective action is verified | QC | Verified state and verification history |
| SC-52 | Re-inspection is requested | Site Engineer | Re-inspection card linked to the original inspection |
| SC-53 | Re-inspection passes after previous failure | Both | Round-by-round inspection history |
| SC-54 | Hold point remains unreleased | Both | Prominent hold-point state and affected next activity |
| SC-55 | Inspection is accepted but separate release is pending | Both | Separate “inspection outcome” and “hold-point release” panels |
| SC-56 | Work is reported as having proceeded before a hold point was released | Both | Exception/event record; no retroactive release display |
| SC-57 | Inspection is withdrawn by submitter | Site Engineer | Withdrawn state with record history |
| SC-58 | Inspection is cancelled or superseded | Both | Cancelled/superseded label and linked replacement record |
| SC-59 | Request is rescheduled multiple times | Both | Schedule timeline with prior and current time |
| SC-60 | A user changes project/role in the demo | Demo presenter | Role/project switcher updates the displayed persona context |
| SC-61 | Connectivity is poor | Both | Optional simulated offline/connection banner |
| SC-62 | A record is awaiting synchronization | Both | Optional simulated pending-sync state; explicitly demo-only |
| SC-63 | A previously submitted record is amended | Both | “Updated after submission” event in history |
| SC-64 | Current user is not the assigned inspector | QC | Assignment/context banner; no real permission enforcement |
| SC-65 | A subcontractor is responsible for corrective work | Both | Responsible company/team shown on finding and action |
| SC-66 | Site is temporarily suspended | Both | Project/site status banner and paused activity presentation |
| SC-67 | Work is handed over or project is closing | Both | Handover/open-item summary and historical record view |
| SC-68 | No records match current filters | Both | Helpful empty state with clear filter reset |
| SC-69 | User opens an attachment that is unavailable | Both | Unavailable attachment placeholder with reference |
| SC-70 | User needs to locate a previous inspection | Both | Search/filter by request ID, activity, location, or date |

The demo does not need 70 individually coded flows. It should provide representative screens/states covering the scenarios most relevant to the selected demo narrative. The rest can be presented through seeded records and static detail views.

---

# 16. Prototype content and seeded demo data

All project, organization, user, and record names below are fictional.

## 16.1 Project A — Gedung Aruna, Tower A

**Project type:** mid-rise office building  
**Location:** Surakarta  
**Primary demo discipline:** structural work  
**Work locations:**
- Tower A — Lantai 2 — Grid C–F
- Tower A — Lantai 3 — Grid A–C
- Basement 1 — Zona B

Sample activities:
- pembesian balok lantai 2;
- bekisting kolom lantai 3;
- pengecoran pelat lantai 2;
- instalasi sleeve dan embedded item.

Sample records:
- WIR-STR-024 — pemeriksaan pembesian balok lantai 2;
- WIR-STR-025 — pemeriksaan bekisting kolom lantai 3;
- FIND-STR-008 — jarak tulangan perlu diperbaiki;
- ACT-STR-008-01 — tindak lanjut perbaikan tulangan.

## 16.2 Project B — Klinik Sentosa

**Project type:** healthcare building  
**Primary demo discipline:** MEP  
**Work locations:**
- Basement 1 — Ruang Pompa;
- Lantai 1 — Zona Timur;
- Roof — Area Mechanical.

Sample activities:
- instalasi pipa air bersih;
- support dan hanger;
- pressure test;
- instalasi ducting.

Sample records:
- WIR-MEP-012 — inspeksi instalasi pipa;
- FIND-MEP-004 — support perlu penyesuaian;
- ACT-MEP-004-01 — bukti perbaikan support.

## 16.3 Project C — Peningkatan Jalan Kartika

**Project type:** road/civil works  
**Primary demo discipline:** civil  
**Work locations:**
- STA 1+200–1+250;
- STA 1+250–1+300;
- STA 1+300–1+350.

Sample activities:
- pekerjaan tanah;
- pemadatan subgrade;
- agregat kelas A;
- pekerjaan perkerasan.

Sample records:
- WIR-CIV-018 — pemeriksaan subgrade STA 1+200–1+250;
- finding about an area requiring rework;
- test-result document reference.

## 16.4 Demo accounts

- Andi Pratama — Site Engineer
- Budi Santoso — Site Supervisor
- Rina Maharani — QA/QC Inspector
- Dimas Saputra — QA/QC Engineer

The persona switcher may use these accounts to show role-specific layouts.

---

# 17. Visual and interaction design direction

## 17.1 Design principles

- Mobile-first, with one primary task per screen.
- Prioritize quick field capture over dense management dashboards.
- Use large tap targets suitable for outdoor use and gloves where practical.
- Use short labels, structured fields, and clear progress indicators.
- Keep the project and location context visible on detail and capture screens.
- Minimize deep navigation from a field task to its related evidence.
- Use photo thumbnails prominently but always accompany them with caption and location context.
- Keep status labels consistent with the web dashboard.

## 17.2 Suggested visual hierarchy

- Primary: activity, inspection status, next action.
- Secondary: project, work location, responsible person/company.
- Supporting: document reference, checklist, evidence, timeline.
- Tertiary: metadata, timestamps, technical reference details.

## 17.3 Interaction patterns

Use:
- bottom sheets for quick action menus;
- step-by-step forms for longer records;
- expandable checklist sections;
- sticky primary action buttons on long forms;
- photo grid and before/after comparison;
- timeline for inspection history;
- segmented tabs for status groupings;
- confirmation screens for simulated submission;
- contextual comments attached to records.

Avoid:
- complex multi-column tables on mobile;
- large charts with little field value;
- long unstructured text fields as the only way to report work;
- excessive modal nesting;
- using color as the only status indicator.

## 17.4 Bahasa Indonesia copy direction

Use natural language familiar to site teams. Prefer:
- `Laporan Harian` rather than “Daily Log” in the primary UI;
- `Ajukan Inspeksi` rather than overly formal wording;
- `Perlu Perbaikan` for a correction-required outcome;
- `Menunggu Verifikasi QC` for a corrective action submitted for checking;
- `Temuan` for findings, with the project's own label for NCR;
- `Lokasi Pekerjaan` with examples such as Tower/Lantai/Grid or STA.

Keep common industry terms such as QC, ITP, WIR, hold point, witness point where the target contractor uses them. Add concise helper text rather than forcing a translation that users may not recognize.

---

# 18. Relationship to Site Operations Dashboard — Web

The two interfaces must feel like one coherent product.

| Field Operations App event | What the Web Dashboard should show |
|---|---|
| Site Engineer submits daily report | Daily report appears in project activity / report list |
| Site Engineer reports work progress | Work activity update appears in project/work overview |
| Site Engineer submits inspection request | Request appears in inspection register and pending queue |
| QC records inspection outcome | Outcome and evidence appear in inspection detail/timeline |
| QC records a finding | Finding appears in findings register and project summary |
| Site Engineer submits corrective response | Action appears as waiting for verification |
| QC verifies corrective action | Updated finding/action status appears in dashboard |
| A hold point is still awaiting release | Dashboard shows the affected work as blocked / awaiting release |
| Material or equipment issue is recorded | Event is visible in project activity/daily report context |

For the demo, the records should be consistent across both interfaces. The prototype may use a shared scripted state or coordinated static screens; a real backend is not required.

---

# 19. Prototype interaction requirements

These requirements concern the **appearance and demonstration of user flow**, not production behavior.

1. All primary navigation items open a designed screen.
2. The persona switcher changes the app's home screen and role-specific sample content.
3. Selecting a project changes the project context displayed throughout the demo.
4. Daily report steps can be navigated and previewed.
5. Work activity cards open a meaningful detail screen.
6. Inspection request cards open the relevant request detail.
7. A scripted inspection-request path can be demonstrated from Site Engineer to QC.
8. QC checklist items can be visually interacted with to show selected states.
9. An inspection outcome can be selected to demonstrate the outcome summary.
10. A finding card opens its detail and corrective-action response view.
11. A submitted corrective response can be represented as awaiting QC verification.
12. A QC verification screen can show verified and more-work-required examples.
13. Photo thumbnails open an evidence detail or gallery.
14. Document cards open a document preview.
15. Inbox items navigate to the relevant record.
16. Empty, pending, returned, unavailable, and error visual states are represented where relevant.
17. A demo reset returns the prototype to the initial seeded state.
18. All simulated actions and data are visibly identified as demo/prototype content.

Do not spend prototype effort implementing real form validation, calculations, role-based security, synchronization, or persistence.

---

# 20. Acceptance criteria for the UI demo

The prototype is ready when:

### Product understanding
- [ ] A new viewer can understand within one minute that the app supports field reporting and inspection/quality workflows.
- [ ] It is clear that the app is not a generic project-management system.
- [ ] The distinction between Site Engineer and QC Inspector experiences is visible.

### Site Engineer experience
- [ ] The user can navigate from home to a project, work activity, daily report, and inspection request.
- [ ] The daily report preview contains realistic site information, not only a generic notes box.
- [ ] Work progress is tied to an identifiable activity and physical location.
- [ ] An inspection request visibly includes scope, location, inspection point, references, evidence, and schedule.

### QC experience
- [ ] QC home shows a realistic inspection queue.
- [ ] Inspection detail displays the work scope, location, ITP/reference, and submitted evidence.
- [ ] The checklist interface is usable on a phone-sized screen.
- [ ] QC can be shown recording a finding and an inspection outcome.
- [ ] A finding is distinguishable from a formal NCR reference.

### Corrective action experience
- [ ] Site Engineer can view a finding and submit an illustrative response with evidence.
- [ ] QC can view and verify that response.
- [ ] The re-inspection story preserves the prior inspection and correction history.
- [ ] An accepted inspection and a hold-point release are not presented as the same concept.

### Real-world representation
- [ ] At least one incomplete/returned inspection case is represented.
- [ ] At least one re-inspection case is represented.
- [ ] At least one daily report with weather, manpower, and work progress is represented.
- [ ] At least one material/equipment/delay event is represented.
- [ ] At least one external witness/consultant scenario is represented.
- [ ] At least one photo/document revision state is represented.
- [ ] Empty and unavailable states are designed.

### Prototype integrity
- [ ] All data is fictional or explicitly approved for demo use.
- [ ] All simulated behavior is labelled as such where needed.
- [ ] No screen claims to create legally binding approvals or production records.
- [ ] No screen implies the prototype has real offline, camera, notification, or integration capabilities.

---

# 21. Recommended build sequence for the UI designer

Build the screens in this order so the main story is coherent early:

1. Site Engineer home
2. QC Inspector home
3. Project selector and project overview
4. Work activity list and detail
5. Daily report flow and preview
6. Inspection request flow and detail
7. QC inspection queue and detail
8. QC checklist and outcome summary
9. Findings list and detail
10. Corrective action response and verification
11. Photo/evidence gallery
12. Project document viewer
13. Inbox and supporting event screens
14. Empty/error/pending states and demo polish

Build one coherent seed scenario end-to-end before adding additional project types. The most valuable first scenario is:

**Pembesian balok → Site Engineer submits pre-pour inspection → QC records correction → Site Engineer submits corrective evidence → QC verifies/re-inspects → updated status is reflected in the web dashboard.**

Then add one MEP or civil example to prove that the UI concept can accommodate a different discipline without pretending all checklists are identical.

---

# 22. Product discovery questions to validate with a contractor

Use these questions when presenting the demo. They are not assumptions to hardcode into the prototype.

### Daily field reporting
- Siapa yang saat ini membuat laporan harian: site engineer, supervisor, atau site manager?
- Apa saja yang wajib masuk laporan harian perusahaan?
- Apakah tenaga kerja, alat, material datang, cuaca, kendala, dan instruksi dicatat dalam satu laporan atau terpisah?
- Apakah laporan dibuat per proyek, per shift, atau per area?
- Siapa yang membaca dan meninjau laporan tersebut?

### Work progress
- Bagaimana pekerjaan dibagi: work package, area, lantai, grid, chainage, atau cara lain?
- Apakah progres dicatat berdasarkan volume, persentase, milestone, atau narasi?
- Apakah subkontraktor melaporkan progres langsung atau melalui supervisor kontraktor utama?

### Inspection and quality
- Apakah perusahaan menggunakan ITP dan WIR/RFI/IR?
- Siapa yang menyiapkan inspection request?
- Siapa yang melakukan pemeriksaan internal dan siapa yang memberi approval eksternal?
- Bagaimana hold point dan witness point dikelola?
- Apa alasan paling umum inspeksi dikembalikan?
- Bagaimana temuan dibedakan dari NCR formal?
- Bagaimana bukti perbaikan dan re-inspection dicatat?
- Apakah konsultan/owner bersedia memakai aplikasi kontraktor atau cukup menerima pemberitahuan/rekaman?

### Field usability
- Seberapa baik konektivitas internet di lokasi proyek?
- Apakah pekerja menggunakan ponsel pribadi atau perangkat perusahaan?
- Apakah foto dan dokumen harus bisa diakses saat offline?
- Siapa yang perlu melihat data dari luar lokasi proyek?

### Business relevance
- Bagian mana paling banyak menghabiskan waktu koordinasi?
- Apa yang paling sering menyebabkan pekerjaan tertahan?
- Dokumen apa yang paling sering sulit ditemukan saat dibutuhkan?
- Jika satu alur dapat diperbaiki lebih dahulu, alur mana yang paling bernilai?

---

# 23. Risks and design guardrails

| Risk | Guardrail for the prototype |
|---|---|
| App becomes a generic construction super-app | Keep daily reporting and inspection/quality workflow as the two primary pillars |
| Too much data entry makes field use appear impractical | Use progressive, concise steps; show only contextually relevant fields |
| One checklist is presented as universal | Show project/discipline-specific examples and reference the approved project ITP |
| Inspection acceptance is confused with hold-point release | Display them as separate concepts |
| Every observation is called an NCR | Distinguish observation, incomplete submission, potential nonconformance, and formal NCR reference |
| Daily report turns into payroll or inventory software | Record operational context only; do not add payroll/stock valuation |
| Safety module expands beyond scope | Show safety information only as a daily report reference or linked event |
| External consultant portal is assumed | Show external parties in the workflow without requiring a separate external-user app |
| Prototype looks fully operational | Label simulated actions, demo records, and unavailable production capabilities |
| Too many screens make the demo unfocused | Build one end-to-end inspection scenario first; supporting modules remain secondary |

---

# 24. References and domain notes

The following sources inform common construction field-reporting and inspection concepts. They are product-design references, not binding Indonesian regulatory interpretations. The actual contract, approved drawings, project specification, ITP, method statement, and project quality plan govern each project's requirements.

1. **Procore — Your Essential Guide to Construction Site Diaries**  
   https://www.procore.com/en-gb/library/construction-site-diaries  
   Reference for typical site diary content such as project/date/author, weather, workforce, work activity, materials, equipment, and site events.

2. **Procore — Construction Daily Reports: What to Include & Best Practices**  
   https://www.procore.com/library/construction-daily-reports  
   Reference for daily reports as a record of work, conditions, challenges, materials/equipment, inspections, and project events.

3. **HoldPoint — Inspection Test Plan (ITP): The Complete Guide for Construction**  
   https://www.holdpoint.co/inspection-test-plan  
   Reference for inspection stages, project references, acceptance criteria, responsible parties, records, and hold/witness/review point concepts.

4. **Cavoren ITP — How to Write an Inspection and Test Plan**  
   https://itp.cavoren.net/guides/how-to-write-an-itp/  
   Reference for linking an inspection point to a work package, sequence, source document, evidence, and responsible party.

5. **SiteSurvey — Construction Daily Report Template**  
   https://sitesurvey.app/forms/construction-daily-report-template/  
   Reference for daily report sections covering weather, labor, work, deliveries, delays, instructions, safety, photos, and sign-off.

---

# 25. Final recommended demo scope

The recommended Field Operations App UI demo consists of **one mobile-first app with two role-specific experiences**, not two separate mobile products.

### Site Engineer / Supervisor
- Home and project context
- Work activity and progress reporting
- Daily site report
- Inspection request submission and tracking
- Findings and corrective-action response
- Supporting photos, documents, and site-event records

### QA/QC Inspector
- Home and inspection queue
- Inspection detail and project references
- Checklist-based inspection
- Observation/finding capture
- Inspection outcome summary
- Corrective-action verification and re-inspection history

The app should be presented through one coherent scenario and supported by a small number of secondary records. Its defining value in the demo is the field user's ability to connect **what happened, where it happened, what was inspected, what was found, and what must happen next**.

**End of PRD**
