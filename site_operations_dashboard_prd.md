# Product Requirements Document (PRD)
## Site Operations Dashboard — Web
**Product concept:** Construction Site Execution Control  
**Document status:** Concept PRD for UI-only sales demo  
**Version:** 1.0  
**Date:** 31 October 2026  
**Primary market hypothesis:** Indonesian medium-sized building and civil contractors managing multiple active projects  
**Primary users:** Project Manager, Site Manager, QA/QC, Site Engineer, Operations/Admin  
**Related interface:** Field Operations App (mobile-first); described here only where it affects the web dashboard

---

## 1. Executive summary

Site Operations Dashboard is a web interface for a contractor's project and operations team to monitor the field workflow around work readiness, inspection requests, inspection decisions, findings, corrective actions, re-inspection, and release to the next activity.

It is **not** a general project-management suite and does not attempt to replace scheduling, budgeting, accounting, procurement, BIM, document control, or an owner's enterprise construction-management platform.

The product addresses a specific coordination problem: field work may be completed or presented as ready, but the current inspection status, outstanding findings, evidence, decision authority, and permission to proceed can be distributed across chats, spreadsheets, paper forms, calls, and separate project records. The dashboard makes the workflow and its accountable next action visible.

This PRD describes a **UI-only demonstrator**. Screens, sample data, simulated status transitions, and prototype interactions are in scope. Production authentication, integrations, persistence, offline synchronization, notifications, digital signatures with legal effect, and contractual release automation are not implemented in the demo.

### Product thesis

If a contractor can see, by project and work location:
- what is awaiting inspection or decision;
- what has been rejected or requires correction;
- who owns the next action and by when;
- what evidence and project requirement support the decision; and
- whether a defined hold point has actually been released,

then project teams can reduce coordination latency, make outstanding work visible earlier, and improve the traceability of quality decisions.

These are **intended outcomes**, not guaranteed savings. A customer discovery process must validate whether this workflow is a meaningful bottleneck for a specific contractor.

---

## 2. Product vision, goals, and non-goals

### 2.1 Vision

Give project and operations leaders a reliable, role-appropriate view of the inspection and field-quality workflow across active construction projects—without requiring them to chase updates from each site.

### 2.2 Goals

1. Make current inspection and work-readiness status understandable at portfolio and project level.
2. Make pending decisions and overdue actions immediately visible.
3. Preserve a traceable sequence of submissions, reviews, findings, corrective evidence, and decisions.
4. Distinguish a rejected/incomplete inspection request from a confirmed nonconformance.
5. Support project-specific workflows and role/authority differences without hardcoding one universal construction procedure.
6. Provide a credible, interactive UI-only demo for discussions with medium-sized contractors.

### 2.3 Non-goals

The product does not:
- create or control the master construction schedule or critical path;
- estimate, approve, or track project budgets, cash flow, claims, or accounting;
- replace a formal contract, approved drawing, specification, method statement, ITP, or project quality plan;
- determine technical acceptance criteria or declare work safe/compliant autonomously;
- automatically authorize concealed work, concrete pours, energization, commissioning, or other hold-point releases;
- replace owner/consultant systems of record;
- manage full procurement, warehouse inventory, workforce payroll, attendance, or equipment maintenance;
- provide BIM authoring, 3D coordination, or digital-twin capabilities;
- function as a full NCR/CAPA, document-control, or enterprise QA/QC platform in the demo;
- guarantee compliance with a particular contract, standard, jurisdiction, or certification.

---

## 3. Target customer and operating context

### 3.1 Ideal customer profile (ICP)

A medium-sized contractor that:
- has several active projects or multiple work fronts;
- employs project managers/site managers, site engineers, and QA/QC personnel;
- coordinates with subcontractors, consultants, owners, and/or third-party inspectors;
- has inspection/approval events that can block subsequent work;
- currently uses a mixture of chat, spreadsheets, paper forms, shared folders, or an existing system with workflow visibility gaps;
- can identify a project or process owner willing to validate the concept.

### 3.2 Initial project types

The demo scenario is a building project with a structural reinforcement inspection before concrete placement. The underlying product model should be configurable for:
- building construction;
- civil/road/bridge work;
- MEP installation;
- finishing and waterproofing;
- subcontractor work packages.

The demo must not imply that one checklist or approval path applies to every discipline or project.

### 3.3 Roles and parties

Internal roles:
- Company Administrator
- Project Manager
- Site Manager
- Site Engineer / Supervisor
- QA/QC Engineer / Inspector
- Operations Viewer / Management Viewer

External parties that may participate in a project workflow:
- Owner / Client representative
- Consultant / Engineer / Supervising consultant
- Subcontractor representative
- Third-party inspector or testing laboratory

External participants are not assumed to be users of the demo. Their decisions may be represented as recorded external outcomes where the project process permits this.

### 3.4 Assumptions requiring validation

- Inspection and approval coordination is a sufficiently painful problem to merit a dedicated workflow.
- The contractor is willing to use a dashboard alongside, rather than replace, existing systems.
- A defined project role can own inspection scheduling and follow-up.
- Project-specific requirements and decision authorities can be configured by an authorized project quality/management role.
- A web dashboard is useful to project/operations management; field capture is performed through a separate mobile-first interface or current field process.

---

## 4. User personas and jobs-to-be-done

### 4.1 Project Manager

**Job:** Understand whether work fronts are progressing or blocked, and identify where management intervention is required.

Needs:
- portfolio and project status at a glance;
- pending/overdue inspection decisions;
- critical findings and unresolved corrective actions;
- owner/consultant decision dependencies;
- a trustworthy activity history.

Does not need:
- to complete every field checklist;
- to interpret raw technical criteria without the responsible QA/QC role;
- to see every low-level notification by default.

### 4.2 Site Manager

**Job:** Coordinate execution across work fronts and avoid avoidable stoppages caused by missing inspections, evidence, or follow-up.

Needs:
- work packages awaiting readiness or inspection;
- hold points and next activities;
- late actions and assigned owners;
- visibility into the reason a work front is blocked.

### 4.3 QA/QC Engineer

**Job:** Review submitted work against project-defined requirements, record objective evidence, and route findings to resolution.

Needs:
- complete submission package;
- current applicable drawing/specification/ITP reference;
- clear location and work scope;
- review outcomes and ability to request clarification;
- history of previous inspection and re-inspection;
- distinction between administrative rejection and technical nonconformance.

### 4.4 Site Engineer / Supervisor

**Job:** Present work for inspection, respond to comments, and know whether the next activity can proceed under the project's process.

Needs:
- clear submission requirements;
- ability to see missing information;
- reviewer comments and due dates;
- re-submission path;
- clear status and authority for release.

### 4.5 Management / Operations Viewer

**Job:** Identify recurring process bottlenecks across projects without micromanaging technical decisions.

Needs:
- aging and workload indicators;
- trend summaries;
- drill-down to project and workflow record;
- clear definitions for metrics and status counts.

---

## 5. Product principles

1. **Project procedure is authoritative.** The product records project-defined workflow; it does not invent contractual requirements.
2. **A status is not an authorization.** A dashboard status must not be interpreted as permission to proceed unless the project's authorized release process is explicitly represented and satisfied.
3. **Facts and conclusions are separate.** An observation, suspected cause, technical nonconformance, and authorized disposition are distinct data.
4. **Traceability over silent editing.** Material changes and decisions require history; prior decisions must not disappear.
5. **One record, one accountable next action.** Each open item should identify an owner, due date where applicable, and next expected step.
6. **Configurable, not universal.** Workflows, checklists, hold/witness/review points, authority, and notice periods vary by contract and project.
7. **Show exceptions.** Rejected, incomplete, overdue, withdrawn, superseded, and disputed cases are first-class scenarios.
8. **Field usability matters.** The dashboard must remain legible and usable on a laptop/tablet; field capture is mobile-first in the companion interface.
9. **No false certainty.** Unknown or unverified information is explicitly marked rather than inferred.

---

## 6. Scope and feature prioritization

### 6.1 UI demo scope (P0)

- Demo login / role switcher (simulated)
- Portfolio dashboard
- Project list and project overview
- Inspection register
- Inspection detail and timeline
- Submission package / evidence viewer
- Review decision panel
- Findings and corrective-action register
- Re-inspection flow
- Hold-point / next-activity indicator
- Search, filter, sort, and saved-view simulation
- Notifications / action inbox (simulated)
- Activity history
- Project-specific workflow configuration preview
- Responsive desktop/tablet layout
- Consistent seeded data and scripted demo flow

### 6.2 Optional UI demo scope (P1)

- External consultant/client decision view
- Export/print preview of an inspection record
- Project quality KPI page
- Drawing/location visual reference (2D image or simple location breadcrumb)
- Calendar/list view for upcoming inspections
- Document revision comparison view
- Bulk assignment / bulk status filtering

### 6.3 Out of scope for demo

- Production backend or database
- Real user provisioning, SSO, or permission enforcement
- Real email, push, WhatsApp, or SMS notifications
- Actual file upload or virus scanning
- Offline sync and conflict resolution
- Legally binding e-signature
- Automatic integration with scheduling, ERP, BIM, or owner portals
- Automated technical decision-making
- Actual contract-specific ITP template library unless provided and approved by a customer

---

## 7. Domain model and terminology

The demo should use consistent terminology. Labels may be localized to Indonesian.

### 7.1 Core entities

**Company**
- company ID, name, timezone, logo, default settings

**Project**
- project ID/code, name, client, location, project type, start/end dates, status, project manager, site manager, quality lead
- project procedure/profile
- active/inactive state

**Work package / activity**
- activity ID, description, discipline/trade, work area, floor/grid/chainage or other location descriptor
- linked work sequence/next activity (informational only)
- applicable controlled documents and revisions
- inspection requirements

**Inspection point / ITP item**
- point ID, activity, stage, inspection type (Hold / Witness / Review / Surveillance / project-defined)
- responsible party, required notice, prerequisite evidence, acceptance reference
- release authority where applicable
- active revision and applicability

**Inspection request (IR/WIR/RFI as project terminology)**
- unique project reference number
- project, activity, exact location, work scope/quantity
- requested inspection date/time and notice time
- submitting party and contact/role
- checklist and evidence
- linked inspection point and document references
- current status and status history

**Inspection event**
- date/time, inspector, participants, actual outcome
- checklist results, observations, photos/attachments
- review notes and decision reference
- linked request and any follow-up

**Finding**
- description of observed condition
- location and affected extent
- evidence
- source requirement reference (if known/confirmed)
- classification: observation / incomplete submission / potential nonconformance / confirmed nonconformance / project-specific
- responsible party, due date, status
- linked corrective action and verification

**Corrective action**
- required action, assigned party, due date
- response/evidence
- verification outcome and verifier
- linked finding/NCR where applicable

**Decision / approval**
- decision maker, role/authority, date/time
- outcome, conditions, comment
- scope and revision reviewed
- linked record and history

**Document reference**
- title/type, number, revision, status, issue date
- source location or link (demo can use a mock document viewer)
- superseded/current marker
- relevant clause/page/detail

**Activity history**
- actor, role, timestamp, action, old/new value where relevant, comment, linked object

### 7.2 Terms and distinctions

- **Inspection request:** request to inspect a defined work scope.
- **Inspection outcome:** result of an inspection event.
- **Finding:** issue or observation recorded during review.
- **NCR:** formal nonconformance record, only when required by the project's quality procedure and authorized classification.
- **Corrective action:** action to address a confirmed issue; closure requires verification where project rules require it.
- **Hold point:** project-defined point beyond which work must not proceed until the required release is recorded by the authorized party.
- **Witness point:** project-defined notification/attendance point. The effect of a missed attendance or waiver is governed by the project procedure.
- **Review point:** document or record review point; it is not automatically a physical hold point.
- **Approved / accepted:** decision outcome within a specified scope; does not imply broader contractual acceptance.
- **Ready for next activity:** system display derived from project-defined prerequisites; must not imply release where required authority is missing.

A rejected inspection request is not automatically an NCR. It may be incomplete, submitted too early, incorrectly located, or missing required evidence. A technical nonconformance may require a separate NCR process. [Source: HAL's discussion of WIR and NCR distinction](https://www.halsimplify.com/knowledge-center/work-inspection-request-construction)

---

## 8. Information architecture

Primary navigation:
1. Overview
2. Projects
3. Inspections
4. Findings & Actions
5. Activity / Notifications
6. Reports (P1)
7. Project Settings (authorized roles only)

Global UI:
- company/project context selector;
- universal search;
- notification/action count;
- current user and simulated role;
- help/terminology access;
- clear environment label: “Demo data”.

### 8.1 Dashboard landing behavior

- Management roles land on portfolio overview.
- Project roles land on their assigned project overview.
- QA/QC roles land on their action inbox or inspection register.
- Demo role switcher allows the presenter to switch personas without implying real access control.

---

## 9. Functional requirements

Priority convention:
- **P0:** required for the demo's core narrative.
- **P1:** valuable enhancement.
- **P2:** future product consideration.

### 9.1 Portfolio overview

**FR-OV-01 (P0):** Display active projects accessible in the demo dataset.
- Each project card/row shows project name/code, location, project manager, overall workflow pulse, open inspections, overdue actions, and critical hold points.
- “Workflow pulse” is explicitly defined as a summary of inspection/action workflow, not overall construction completion.

**FR-OV-02 (P0):** Display portfolio-level counts:
- inspection requests awaiting review;
- inspections scheduled/upcoming;
- submissions requiring correction;
- open findings/corrective actions;
- overdue items;
- hold points awaiting authorized release.

**FR-OV-03 (P0):** Clicking any metric opens a filtered register with the same count logic.

**FR-OV-04 (P0):** Show recent high-impact events: inspection rejected, hold point released, critical finding created, overdue action escalated.

**FR-OV-05 (P1):** Show trend comparison over a selected period. Demo data must include a visible definition and avoid presenting fabricated KPI improvement.

**FR-OV-06 (P0):** Empty state explains that no records match the selected filter; it must not imply project health is good solely because there are no records.

### 9.2 Project list and overview

**FR-PR-01 (P0):** Display projects in a searchable, filterable table/list.

**FR-PR-02 (P0):** Project detail includes:
- project identity and key contacts;
- project workflow summary;
- open inspection requests;
- unresolved findings/actions;
- hold/witness/review point summary;
- recent activity;
- link to inspection register.

**FR-PR-03 (P0):** Project-level filters apply consistently to all related views.

**FR-PR-04 (P1):** Support project status labels (mobilization, active, handover, closed) as project-defined labels; do not infer construction completion.

**FR-PR-05 (P0):** A closed/archived project is read-only in the demo and remains searchable for historical records.

### 9.3 Inspection register

**FR-IN-01 (P0):** List inspection requests with:
- request ID;
- project;
- work package/activity;
- exact location;
- inspection point/type;
- requested date/time;
- submitter;
- current status;
- assigned reviewer/authority;
- next action and due/target time.

**FR-IN-02 (P0):** Provide filters for project, status, discipline, location, inspection type, reviewer, date range, overdue, and hold point.

**FR-IN-03 (P0):** Provide text search by request ID, activity, location, submitter, and document reference.

**FR-IN-04 (P0):** Provide sorting by request date, scheduled date, age, due date, and status.

**FR-IN-05 (P0):** Clearly distinguish “awaiting internal QC”, “awaiting external party”, “scheduled”, “inspection in progress”, “correction required”, “re-inspection requested”, “accepted”, “withdrawn”, and “cancelled”.

**FR-IN-06 (P1):** Allow table column selection and saved filters in the prototype.

**FR-IN-07 (P0):** Show a visual warning for hold points, but never use color alone to communicate the warning.

### 9.4 Inspection detail

**FR-ID-01 (P0):** Show an inspection request as a structured record with:
- request reference;
- project/activity/location;
- requested date/time and notice;
- submitter;
- inspection point/type;
- prerequisites and submitted checklist;
- linked document references and revisions;
- evidence gallery;
- assigned reviewer and authority;
- current state;
- history/timeline;
- linked findings and corrective actions.

**FR-ID-02 (P0):** Show what is missing from the submission, if incomplete, with a clear explanation.

**FR-ID-03 (P0):** Show “source of requirement” for checklist items, where configured: drawing/specification/ITP/method statement reference and revision.

**FR-ID-04 (P0):** Display actual work location with meaningful granularity: building/block, floor, grid/axis, room/zone, chainage, level, or project-specific descriptor. A free-text fallback is allowed.

**FR-ID-05 (P0):** Show linked prior inspections and prior comments for the same work scope where available.

**FR-ID-06 (P0):** Show status history with actor, timestamp, decision/comment, and transition.

**FR-ID-07 (P1):** Support document preview and attachment preview in demo using mock assets.

### 9.5 Review and decision panel

**FR-RV-01 (P0):** Authorized simulated reviewer can choose only a project-configured outcome:
- accept / pass;
- correction required / reject;
- request clarification / incomplete;
- defer / reschedule;
- no-show / unable to inspect (if project process permits);
- waive/record witness point (only when project procedure permits and proper authority is represented).

**FR-RV-02 (P0):** Every decision requires:
- decision outcome;
- date/time;
- reviewer identity/role;
- comment or reason for non-acceptance;
- scope reviewed;
- reference to any condition or follow-up.

**FR-RV-03 (P0):** “Correction required” must not automatically create a formal NCR. The user may link/create an NCR only according to the configured project process.

**FR-RV-04 (P0):** “Accept” on a hold point must not release it unless the configured release authority and required evidence are satisfied.

**FR-RV-05 (P0):** A decision cannot be silently overwritten. A correction or reversal is represented as a new event with a reason and reference to the prior decision.

**FR-RV-06 (P0):** A reviewer who lacks the configured authority sees the decision action disabled or is prompted to route to the authorized reviewer.

**FR-RV-07 (P1):** Support conditional acceptance only if the project procedure defines it; conditions must be visible and assigned.

### 9.6 Findings and corrective actions

**FR-FA-01 (P0):** Maintain a findings register with project, location, description, classification, responsible party, due date, status, and linked inspection.

**FR-FA-02 (P0):** Finding classifications are configurable and include at least:
- observation;
- incomplete submission / administrative comment;
- potential nonconformance;
- confirmed nonconformance;
- project-specific category.

**FR-FA-03 (P0):** Record objective facts separately from suspected cause, severity, and disposition.

**FR-FA-04 (P0):** For a confirmed nonconformance, allow a linked NCR reference or a simulated “NCR required” indicator according to project rules.

**FR-FA-05 (P0):** Corrective action includes description, assigned party, due date, evidence submitted, verifier, verification outcome, and closure date.

**FR-FA-06 (P0):** An action cannot be closed merely because the responsible party marks it complete when independent verification is required by project procedure.

**FR-FA-07 (P0):** A rejected corrective-action verification returns the action to an active state and records the reason.

**FR-FA-08 (P0):** A finding can have multiple actions or evidence events if the project process requires it.

**FR-FA-09 (P1):** Show repeat findings by category/location/trade as a trend, with caution that categorization consistency affects the metric.

### 9.7 Hold points, witness points, and release

**FR-HP-01 (P0):** Identify whether an inspection point is Hold, Witness, Review, Surveillance, or project-defined.

**FR-HP-02 (P0):** For hold points, show:
- governing ITP/requirement reference;
- required release authority;
- required evidence/prerequisites;
- current release state;
- next activity affected.

**FR-HP-03 (P0):** A hold point remains “not released” until all configured release conditions are recorded.

**FR-HP-04 (P0):** A work package may not display “ready for next activity” if an applicable unreleased hold point exists.

**FR-HP-05 (P0):** Any exceptional release, waiver, or change must record the authorized role, reason, timestamp, and referenced project instruction. Demo must not imply that a generic admin can override technical authority.

**FR-HP-06 (P1):** Witness-point no-show/waiver handling is configurable. The product must not assume a no-show automatically permits work to proceed.

### 9.8 Action inbox and notifications

**FR-NO-01 (P0):** Provide a unified action inbox for the current simulated role.

**FR-NO-02 (P0):** Action items include:
- review inspection;
- complete missing submission information;
- respond to finding;
- verify corrective action;
- schedule/reschedule inspection;
- resolve overdue action;
- record external decision.

**FR-NO-03 (P0):** Each action has a direct link to the underlying record and displays its owner and due/target date.

**FR-NO-04 (P0):** Distinguish in-app demo notifications from real external delivery. UI must label notifications as simulated.

**FR-NO-05 (P1):** Escalation policy preview supports project-defined timing/roles; no automatic escalation is executed in the demo.

### 9.9 Activity history and auditability

**FR-AU-01 (P0):** Every key state transition appears in a chronological history.

**FR-AU-02 (P0):** History includes actor, role, timestamp, action, comment/reason, and changed values where relevant.

**FR-AU-03 (P0):** Show revisions or superseded records; do not remove the prior record from history.

**FR-AU-04 (P0):** The UI clearly distinguishes recorded history from a formal legally compliant audit log, since the demo does not implement production audit guarantees.

**FR-AU-05 (P1):** Allow filtering history by event type and actor.

### 9.10 Search and navigation

**FR-SE-01 (P0):** Global search returns matching projects, inspections, findings, and action records in demo data.

**FR-SE-02 (P0):** Search result identifies entity type, project, status, and location.

**FR-SE-03 (P0):** Preserve selected project and filters when navigating back from detail to register.

**FR-SE-04 (P1):** Support keyboard-friendly navigation and clear focus states.

### 9.11 Reporting and export preview

**FR-RE-01 (P1):** Provide a project quality workflow summary with counts and aging.

**FR-RE-02 (P1):** Provide inspection outcome and first-pass acceptance views, with clear metric definitions.

**FR-RE-03 (P1):** Provide a print/export preview for an inspection record and its evidence index.

**FR-RE-04 (P0):** Do not label a report as an official contractual certificate or approved record unless the project process and actual authority support that claim.

### 9.12 Project configuration preview

**FR-CF-01 (P0):** Show project-specific workflow settings in a read-only or simulated configuration screen:
- terminology used for inspection request;
- inspection types;
- approval roles/authority;
- notice period;
- required checklist/evidence;
- hold-point behavior;
- due-date/escalation policy;
- document references.

**FR-CF-02 (P0):** Clearly indicate that configuration must be reviewed by the project's authorized quality/contract representative.

**FR-CF-03 (P1):** Show revision history for a project workflow profile.

---

## 10. Workflow states and transition rules

The exact status model must be configurable per project. The following is the default demo state model.

### 10.1 Inspection request lifecycle

`Draft → Submitted → Internal Review → Ready for External Inspection → Scheduled → Inspection in Progress → Outcome Recorded`

Possible outcomes:
- `Accepted`
- `Correction Required`
- `Clarification Required`
- `Deferred / Rescheduled`
- `Withdrawn`
- `Cancelled`
- `Unable to Inspect / No-show` (if configured)

Correction loop:
`Correction Required → Corrective Work In Progress → Re-inspection Requested → Review/Scheduled → Outcome Recorded`

Clarification loop:
`Clarification Required → Submitter Responded → Review Resumed`

Important:
- `Accepted` is scoped to the specific work, inspection point, and revision reviewed.
- A new revision or material scope change may require a new submission or invalidate a prior acceptance according to project rules.
- Withdrawal/cancellation does not erase history.
- “Accepted” does not release a hold point unless release authority and conditions are met.

### 10.2 Finding lifecycle

`Open → Assigned → Action In Progress → Action Submitted → Verification Pending → Verified / Closed`

Alternative:
`Verification Pending → Rejected / More Work Required → Action In Progress`

Other statuses:
- `Deferred` (requires reason and authority)
- `Superseded` (requires link to replacement record)
- `Cancelled` (requires reason; only if appropriate)
- `Disputed / Under Review` (project-configured)

### 10.3 Hold point lifecycle

`Not Due → Approaching → Awaiting Inspection → Awaiting Authorized Release → Released`

Exception states:
- `Blocked — prerequisites missing`
- `Blocked — finding unresolved`
- `Release disputed`
- `Waiver recorded` (only if allowed by the project and authority)

The interface must not treat a missed notification, inspector no-show, or elapsed time as automatic release unless the governing project procedure explicitly says so and the configured authority records that determination.

---

## 11. Real-world scenarios and exception requirements

This section is central to the product. The UI demo should demonstrate representative exceptions, not just the happy path.

### 11.1 Submission completeness and readiness

**SC-01 — Required evidence missing**
- User submits an inspection request without a required checklist, photo, drawing revision, test record, or prerequisite.
- System marks it `Incomplete / Clarification Required` or prevents submission based on project configuration.
- Missing items are listed explicitly.
- No technical rejection or NCR is inferred solely from missing evidence.

**SC-02 — Work not ready**
- Reviewer finds the work is not ready or not accessible.
- Record `Unable to Inspect` or `Correction Required` with reason and required next action.
- Do not classify as confirmed technical nonconformance unless the actual requirement was violated and the authorized process classifies it that way.

**SC-03 — Wrong location or scope**
- Request refers to the wrong floor, grid, chainage, room, lot, or work package.
- Reviewer routes it for correction or withdrawal.
- Original reference and change history remain visible.

**SC-04 — Duplicate request**
- Two requests are created for the same scope/inspection point.
- UI flags a possible duplicate; authorized user can link, withdraw, or retain both with rationale.
- Do not silently merge records.

**SC-05 — Premature request**
- Request submitted before prerequisites or prior inspection are complete.
- Display blocking prerequisites and the dependency record.
- Allow the request to remain draft or return for clarification according to configured workflow.

### 11.2 Scheduling and attendance

**SC-06 — Reviewer unavailable**
- Inspection must be rescheduled or routed to an authorized alternate.
- Preserve original requested time, change reason, new time, and responsible scheduler.

**SC-07 — Inspection time changed**
- Any change to requested/scheduled date or time is recorded.
- Affected parties and notice requirement are visible.
- Demo notification is simulated.

**SC-08 — Inspector does not attend**
- Record the no-show event, time, party, and evidence/communication.
- Outcome is project-defined: reschedule, record witness point, or follow a formal waiver route.
- No automatic permission to proceed.

**SC-09 — Multiple inspectors / witness parties**
- Show required parties and attendance/decision state separately.
- One party's approval must not be mistaken for all required approvals.

**SC-10 — Inspection occurs partially**
- Record inspected scope and uninspected remainder.
- The remainder stays open or requires a new request.
- Acceptance is limited to the inspected scope.

### 11.3 Inspection decision and findings

**SC-11 — Accepted**
- Record accepted scope, reviewer, time, comments, evidence, and applicable revision.
- For a hold point, separately evaluate release conditions.

**SC-12 — Rejected / correction required**
- Require a reason and clear corrective next step.
- Assign responsible party and due date where appropriate.
- Preserve prior submission and evidence.
- Re-inspection is linked to the original request.

**SC-13 — Request clarification**
- Return for missing or ambiguous information without declaring technical failure.
- Submitter response is recorded and review resumes.

**SC-14 — Finding is an observation only**
- Record observation without automatically opening NCR.
- Allow conversion/link to formal NCR only if the authorized process requires it.

**SC-15 — Confirmed nonconformance**
- Record the requirement/source, observed condition, affected scope, evidence, and authorized classification.
- Provide link to NCR workflow or mark that formal NCR must be created in the system of record.
- Do not autonomously choose repair, rework, concession, or rejection disposition.

**SC-16 — Affected extent is unknown**
- Show “extent under investigation”.
- Assign investigation owner and next update.
- Do not assume the issue is isolated.

**SC-17 — Corrective action submitted but not verified**
- Keep action in `Verification Pending`.
- Do not close finding or release dependent hold point where verification is required.

**SC-18 — Corrective action fails verification**
- Return to active action status with verifier's reason.
- Preserve submitted evidence and prior verification event.

**SC-19 — Multiple corrective actions**
- Finding remains open until all required actions and verifications are complete.
- Show each action owner/status separately.

**SC-20 — Finding disputed**
- Record dispute, basis, party, and review authority.
- Keep status visibly unresolved; do not silently close.

### 11.4 Hold points, dependencies, and work proceeding

**SC-21 — Hold point is not released**
- Dashboard shows the affected work and next activity as blocked by the hold point.
- Display exact requirement and authorized release role.

**SC-22 — Work reported as proceeded before release**
- Record as an exception/incident for project review.
- Do not retroactively mark hold point released.
- Show potential impact and route to authorized project authority; do not make a technical/legal conclusion.

**SC-23 — Release conditions incomplete**
- Show each unmet condition: missing test, open finding, absent approval, missing document, or unverified action.
- Release action remains disabled.

**SC-24 — Release is reversed or corrected**
- Require a new authorized event with reason and link to prior release.
- Preserve both events; affected next activity becomes visibly under review.

**SC-25 — Next activity changes**
- Update dependency mapping only through an authorized change.
- Re-evaluate readiness; retain prior dependency history.

**SC-26 — Witness point not attended**
- Apply project-specific rule; record notice and attendance facts.
- Do not assume the witness party's silence means approval.

### 11.5 Documents, revisions, and evidence

**SC-27 — Drawing/specification revision changes**
- Inspection request shows the revision used at submission and review.
- If the current revision changes, show a warning and project-defined impact decision.
- Do not silently replace the reviewed revision.

**SC-28 — Superseded document**
- Mark as superseded and link current revision.
- Preserve the historical reference for records already reviewed.

**SC-29 — Evidence attachment is unavailable/corrupt**
- Mark evidence as unavailable and require replacement or documented exception.
- Do not show a broken thumbnail as if evidence were valid.

**SC-30 — Photo does not establish exact location**
- Require location metadata or explicit user-entered location where needed.
- Do not infer a precise work location from image content.

**SC-31 — Evidence added after decision**
- Record it as a later event.
- Do not alter the evidence set that the original reviewer saw without a revision/review event.

**SC-32 — Confidential or restricted document**
- Display access-restricted placeholder in the demo.
- Do not expose sensitive contract/project documents to every role by default.

### 11.6 Project, role, and organization changes

**SC-33 — Person leaves or changes role**
- Reassign open actions to an authorized replacement.
- Preserve historical actor identity and prior responsibility.

**SC-34 — Approver authority changes**
- New authority applies prospectively according to project rules.
- Historical decisions retain the authority context at the time.

**SC-35 — Subcontractor responsible for correction**
- Assign action to a subcontractor role/company, with an internal accountable owner.
- Contractor retains visibility and verification responsibility as defined by project process.

**SC-36 — Project is suspended**
- Mark active requests/actions as paused or review-required according to project decision.
- Preserve due dates and show whether they are suspended, reset, or still active.

**SC-37 — Project is handed over or closed**
- Open records must be reviewed before closure.
- Historical records become read-only; no silent deletion.
- Handover exceptions remain visible.

**SC-38 — User has no access**
- In a real product, enforce access server-side. In the UI demo, show an access-denied state or role-specific restricted view.
- Do not rely only on hiding a navigation item as a security design.

### 11.7 Data quality and operational resilience

**SC-39 — Poor connectivity / offline field entry**
- This is out of scope for the web demo, but the product concept must acknowledge that field capture may occur offline.
- UI may show a simulated “not synced” state only if a mobile demo explicitly represents it.
- No claim of offline capability without implementation.

**SC-40 — Concurrent updates**
- Production behavior must detect stale records and prevent silent overwrite.
- Demo may show “record updated by another user” conflict state.

**SC-41 — Incorrect status or data entry**
- Provide correction path with reason and history.
- Restrict correction of formal decisions to authorized roles.

**SC-42 — Date/time and timezone**
- Use project timezone for requested/scheduled/recorded times.
- Show exact date/time; avoid ambiguous date formats.
- Record actual event time separately from entry time if delayed entry is allowed.

**SC-43 — Record entered after event**
- Allow a delayed entry only where project process permits.
- Capture event time, entry time, and reason.
- Mark as late entry.

**SC-44 — System has no matching data**
- Show a useful empty state and offer clear filter reset.
- Never imply that an empty list means all work is accepted.

---

## 12. Dashboard metrics and definitions

Metrics must be defined to prevent misleading management interpretation.

### 12.1 Operational counters

- **Awaiting review:** submitted requests with an assigned review action not yet completed.
- **Awaiting external decision:** requests awaiting a required owner/consultant/third-party decision.
- **Overdue action:** open action whose due date has passed, excluding explicitly paused/suspended records if project rules define this.
- **Open finding:** finding not verified/closed/superseded/cancelled.
- **Unreleased hold point:** applicable hold point with no valid recorded release.
- **Inspection aging:** elapsed time from submission to current state; specify whether calendar or working hours.
- **First-pass acceptance rate:** accepted on first inspection outcome divided by eligible inspected requests. Exclude withdrawn/cancelled and disclose exclusion logic.
- **Re-inspection rate:** requests requiring at least one re-inspection divided by eligible completed requests.
- **Corrective action cycle time:** elapsed time from action assignment to verified closure; show median/average definition and sample size.

### 12.2 Metric caveats

- A high number of findings may reflect better detection/reporting, not necessarily poorer quality.
- A low count may reflect under-reporting or incomplete data.
- First-pass acceptance can be distorted by teams splitting or combining requests differently.
- “Project workflow pulse” is not a measure of total project completion, cost, safety, or contractual performance.
- Demo charts use clearly labeled illustrative data.

---

## 13. Permissions and authority model

The product concept must separate **visibility**, **recording**, and **decision authority**.

| Role | Typical visibility | Typical actions in concept |
|---|---|---|
| Company Admin | Company/project setup | Manage demo users/configuration; no automatic technical release authority |
| Project Manager | Project workflow and records | Assign owners, monitor, escalate, record management decisions if authorized |
| Site Manager | Assigned project/work fronts | Coordinate, review readiness, assign follow-up |
| Site Engineer | Assigned work scope | Submit requests, provide evidence, respond to comments |
| QA/QC Inspector | Assigned inspections | Record inspection outcomes/findings within delegated authority |
| Quality Manager | Project quality records | Configure quality workflow and authorized disposition routes |
| Client/Consultant | Records shared with them | Record external review/decision only where agreed |
| Management Viewer | Aggregated information | Read-only |

Requirements:
- Role and project membership are distinct.
- Project-specific authority may override generic role defaults.
- The person who submits work must not be assumed to be the authorized approver.
- Admin status must not imply authority to accept technical work or release a hold point.
- Production access control must be enforced server-side; demo role switcher is only a presentation control.

---

## 14. UX requirements

### 14.1 Status presentation

- Every status has a text label and icon or other non-color cue.
- Use consistent status vocabulary across dashboard, register, and detail.
- Display both current status and next required action.
- Explain blocking reasons in plain language.
- Distinguish “not started”, “waiting”, “blocked”, “overdue”, “completed”, and “closed”.

### 14.2 Information density

- Dashboard prioritizes actionable exceptions over decorative charts.
- Register tables support scanning, filtering, and sorting.
- Detail pages use a clear hierarchy: summary → decision/status → evidence → linked findings/actions → history.
- Technical references are visible but do not overwhelm the primary workflow.

### 14.3 Accessibility and responsive behavior

- Keyboard-accessible controls and visible focus states.
- Sufficient contrast and non-color status indicators.
- Desktop-first web dashboard with usable tablet layout.
- Tables adapt to narrower screens via column prioritization or card presentation.
- Confirm dialogs for irreversible or high-impact demo actions.
- Empty, loading, error, and access-restricted states are designed, even if simulated.

### 14.4 Indonesian localization

Default demo language: Bahasa Indonesia, with familiar construction terminology.
Potential labels:
- Request for Inspection (RFI/WIR) — follow the prospect's own term;
- inspeksi;
- temuan;
- tindakan perbaikan;
- hold point / titik tahan;
- witness point / titik saksi;
- approval / persetujuan;
- siap untuk aktivitas berikutnya.

Do not force a single local term across all contractors. The project may use “WIR”, “RFI”, “IR”, “permintaan inspeksi”, or its own terminology.

---

## 15. UI-only demo behavior and seeded dataset

### 15.1 Demo requirements

- All data is illustrative and labeled “Demo”.
- A role switcher lets the presenter simulate Project Manager, Site Engineer, and QC.
- Actions update prototype state locally or through scripted interaction; no real persistence is implied.
- Demo records share consistent project, location, inspection, finding, and actor references.
- A reset/restart option restores the scripted scenario.
- No real company/customer data is used without permission.

### 15.2 Suggested seeded projects

1. **Gedung Aruna — Tower A**
   - Reinforcement inspection, hold point before concrete placement.
   - One request accepted; one correction/re-inspection loop.
2. **Pembangunan Klinik Sentosa**
   - MEP inspection with incomplete document reference.
   - One overdue corrective action.
3. **Peningkatan Jalan Kartika**
   - Chainage-based inspection.
   - Witness point with rescheduled attendance.

Project names are fictional.

### 15.3 Scripted demo path

1. Start at portfolio dashboard: show two pending reviews and one unreleased hold point.
2. Open Gedung Aruna project.
3. Open reinforcement inspection request.
4. Switch to QC role and record correction required.
5. Switch to Site Engineer and submit corrective evidence.
6. Switch to QC and accept the re-inspection.
7. Show hold point still awaiting separate authorized release, if that is configured in the scenario.
8. Record authorized release.
9. Return to Project Manager dashboard and show the blocker cleared.
10. Open history to show the complete trace.

The demo must not use “accepted” and “released” interchangeably.

---

## 16. Non-functional requirements for a future production product

These are product-quality requirements for future implementation, not claims about the UI demo.

### 16.1 Security and privacy
- Tenant/company and project data isolation.
- Server-side authorization on every read/write.
- Secure authentication and session management.
- Least-privilege access and role/project membership.
- Sensitive document access controls.
- Encryption in transit and at rest.
- Audit trail for key decisions and changes.
- Retention and deletion policies defined by customer contract and applicable law.
- No public access to private project records.

### 16.2 Reliability and data integrity
- No silent overwrite of concurrent decisions.
- Idempotent handling of duplicate submissions where appropriate.
- Traceable revision and event history.
- Backups and recovery objectives agreed for production.
- Data export and customer exit plan.
- Availability target to be agreed with customers; do not promise an SLA in the concept demo.

### 16.3 Performance
Proposed targets for future validation:
- common dashboard/register views load within 3 seconds under agreed test conditions;
- search returns useful results within 2 seconds for expected data volume;
- large project records use pagination/virtualization;
- images and documents load progressively.

These are candidate targets, not validated benchmarks.

### 16.4 Offline and mobile interoperability
- Field app may require offline capture due to site connectivity.
- Future offline design must address queued uploads, attachment retries, conflict handling, record ownership, and clear sync status.
- The web dashboard must show the authoritative server state and indicate delayed synchronization where applicable.
- Offline capability is not part of this web UI demo.

### 16.5 Audit and legal significance
- Production audit requirements, electronic signature needs, record retention, and evidentiary value must be assessed with customer/legal/contract stakeholders.
- A UI action labeled “approve” is not automatically a legally binding signature.
- Formal contract records may remain in another system.

---

## 17. Acceptance criteria for the UI demo

The demo is considered ready when:

1. A presenter can explain the product in under two minutes without calling it a full project-management system.
2. Portfolio metrics drill down to matching records.
3. Project overview, inspection register, and inspection detail show consistent data.
4. A complete submit → review → correction → re-inspection → acceptance path can be demonstrated.
5. Hold-point status is separate from inspection acceptance.
6. An incomplete request can be returned for clarification without being labeled a technical nonconformance.
7. A finding can be assigned, acted upon, submitted for verification, and rejected/closed with history.
8. Every important decision has actor, timestamp, reason/comment, and scope in the UI.
9. Filters and search work across seeded records.
10. At least one exception scenario is visible in the demo dataset.
11. UI clearly labels all data and notifications as simulated.
12. No screen claims production integrations, persistence, offline sync, or legally binding approval.

---

## 18. Success measures and discovery validation

### 18.1 Demo success
- Prospect understands the problem and proposed workflow.
- Prospect can identify which steps match or differ from their actual process.
- Prospect names a workflow owner or stakeholder to involve next.
- Prospect agrees to discuss a real project/work package or share a sanitized example form.
- Prospect identifies a measurable bottleneck or rejects the hypothesis clearly.

### 18.2 Product validation questions
- How are inspection requests raised today?
- What document defines the required inspection points and acceptance criteria?
- Who can accept/reject an inspection, and who can release a hold point?
- What causes the most rescheduling or rejected submissions?
- How are findings assigned and verified?
- What happens when a consultant does not attend a witness point?
- How are drawing revisions handled after a request is submitted?
- What records must be retained for handover, claims, or audit?
- Which system is the system of record?
- Which metric would make the workflow worth improving?
- Is the bottleneck coordination, completeness of evidence, reviewer capacity, or technical rework?

### 18.3 Business value measurement plan
Before claiming value, baseline:
- average submission-to-decision time;
- percentage of submissions returned for incomplete information;
- number/age of open findings;
- corrective-action cycle time;
- count and duration of work fronts blocked by pending release;
- time spent preparing quality status reports.

Compare after a controlled pilot using equivalent project scopes and transparent definitions. Do not attribute schedule or cost savings to the software without accounting for project conditions and other process changes.

---

## 19. Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Product mistaken for generic PM software | Weak differentiation | Lead with inspection/approval workflow and blocker visibility |
| Customer's process differs | Construction procedures vary by contract/project | Configurable workflow; validate with real forms and roles |
| Approval authority misrepresented | Can create contractual/technical risk | Explicit authority model; no implicit release |
| WIR rejection conflated with NCR | Creates inaccurate quality records | Separate administrative return, finding, and formal NCR |
| Dashboard metrics mislead | Counts may reflect reporting behavior | Define metrics and caveats; show data completeness |
| External parties refuse another portal | Adoption friction | Support external decision recording or optional portal |
| UI demo overstates functionality | Trust risk | Clearly label simulation and non-production scope |
| Too many modules dilute value | Harder to understand and build | Keep first demo centered on one end-to-end scenario |
| Demo assumes all work is digital | Unrealistic migration premise | Position as a workflow layer alongside existing records |
| Field connectivity is poor | Field users may be unable to submit | Treat offline capability as a future requirement; validate early |

---

## 20. Open questions and decisions

1. Does the target contractor primarily use internal QA/QC inspections, consultant/client inspections, or both?
2. Which terminology is used: WIR, RFI, IR, request for inspection, or another term?
3. Does the customer need a separate external portal, or is recording external decisions enough?
4. Is the most valuable scope structural work, MEP, civil, or finishing?
5. Are hold points configured in an ITP or another project-controlled document?
6. What system remains the formal system of record?
7. Does the prospect require offline mobile capture?
8. What is the customer’s policy for witness-point no-show, waiver, and hold-point release?
9. Is a formal NCR process part of this product or linked to another system?
10. What records and retention periods are required at project handover?

---

## 21. Recommended demo scope decision

**Build two UI deliverables:**
1. **Site Operations Dashboard (Web)** — portfolio/project overview, inspection register, pending decisions, findings/actions, hold-point visibility, and history.
2. **Field Operations App (mobile-first, separate UI concept)** — submission, evidence capture, inspection checklist, corrective response, and re-inspection.

The web dashboard should be the primary sales presentation surface. The field app is shown to explain where the records originate and how the workflow connects.

Add a separate Client/Consultant Portal only if discovery indicates that external parties need to actively use the system and the prospect is willing to support that adoption.

The product's differentiator is not the number of screens. It is the end-to-end traceability of a work item from “presented for inspection” to “decision recorded,” with findings resolved and any required hold-point release explicitly handled.

---

## 22. Domain references and further reading

These sources inform workflow concepts and exception handling. They do not establish that every Indonesian contractor follows the same process; project contracts and approved procedures remain authoritative.

- California Department of Transportation, *Construction Quality Assurance Program Manual*, section on control of nonconforming work/materials and corrective action.  
  https://dot.ca.gov/-/media/dot-media/programs/construction/documents/policies-procedures-publications/quality--assurance-manual-a11y.pdf
- Procore, *Construction Quality Management Guide* — roles, ITPs, hold/witness points, and NCR procedures.  
  https://www.procore.com/en-au/library/construction-quality-management
- HAL, *Work Inspection Request in Construction* — distinction between WIR rejection and NCR.  
  https://www.halsimplify.com/knowledge-center/work-inspection-request-construction
- The Hanover Insurance Group, *Construction Quality Control Checklist* — readiness, in-process, completion, concealed work, and corrective action.  
  https://www.hanover.com/businesses/business-customer-resources/hanover-risk-solutions/construction-quality-control-checklist
- New York State project quality plan example — ITPs, quality records, submittals, and review roles.  
  https://documents.dps.ny.gov/public/Common/ViewDoc.aspx?DocRefId=%7BE0FD989E-0000-C96B-9157-67F28743A7E9%7D&DocTitle=Appendix+D_Quality+Assurance+and+Quality+Control+%28QAQC%29+Plan

---

**End of PRD**
