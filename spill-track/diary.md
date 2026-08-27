# SPILL TRACK — Project Diary

Date-stamped log of build work, changes, and progress for the SIH 26143 judge demo.
Update as you go — tick items off when done so the log stays truthful.

---

## Log

### 2026-08-27 · Palantir-Gotham redesign + rename
- [x] Rename `SAGAR DRISHTI` → `SPILL TRACK` (folder, package, brand, docs)
- [x] Rebuild UI as a Gotham-style intelligence dashboard:
  - graphite palette, hairline chrome, IBM Plex Sans/Mono
  - removed neon/CRT "slop" (scanlines, glow, cyber font, clip-path corners)
  - object-chip glyphs on suspect cards
- [x] Fix invisible-suspect-card bug (`.show` never applied)
- [x] Expand offline basemap to full Arabian Sea basin (z5–8, ~2.7 MB)
- [x] Remove demo banner strip; clean up grid
- [x] Fix GENERATE REPORT button being clipped on short laptop screens (now always visible)

### 2026-08-27 · Judge-driven interactivity + de-militarise wording
Goal: judges can drive the tool (click, zoom, change inputs), not just watch a timeline.
This lifts Innovation (20%), Technical Approach (20%) and Prototype/Demo (20%).

- [x] MAP: enable zoom in/out controls + "reset view" button
- [x] MAP: vessel markers clickable → opens evidence popup with reasons/flag/IMO/type
- [x] MAP: clicking a marker focuses it across map + suspect panel (link map ↔ panel)
- [x] CONTROL: manual step-through (3 stage-jump buttons in the rail) on top of the
      existing timed auto play + keyboard 1/2/3
- [x] CONTROL: live factor-weight sliders that re-rank suspects on change (proves
      the system responds to inputs + illustrates explainability). Weights renormalise
      to sum 1 so scores stay calibrated (defaults 30/25/20/15/10 → V1 92%), with a
      "↺ RESET" affordance once the judge edits them.
- [x] WIPE: remove "cringe"/military wording — classified / unclassified / tactical /
      intelligence / ops / PSID / NTRO / operator — replaced with neutral professional
      language (PROBLEM / REGION / ANALYSIS PIPELINE / MODE) while keeping the dashboard tone

### Backlog (higher priority, not started)
- [ ] Impact demo: side-by-side "13 s pipeline vs 40–80 day manual method" with cost/error KPIs
- [ ] Realism: live clock/sensor readouts; "simulated vs real data" toggle
- [ ] Q&A readiness: on-screen "Why / How it works" panel + 1-page judge cheat-sheet
- [ ] Export: CSV / GeoJSON / JSON download of suspect evidence (production-grade feel)

---

## Rubric reference (SIH)
Task scores: Understanding 15 · Innovation 20 · Tech Approach 20 · Prototype/Demo 20 ·
Impact 10 · Presentation 10 · Team coordination 5.
