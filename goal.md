# GOAL: SIH 26143 — Judge Demo Frontend ("SAGAR DRISHTI")

## The Goal
Build a **mock, fully-functional-looking frontend demo** for judges — a maritime ops-center
dashboard that visually simulates the full pipeline from the technical guide:
**Detect → Backtrack → Attribute** (oil spill detection → origin tracing → vessel ranking).

## Project Setup
- Location: `/home/ribo/Documents/college/sih/sagar-drishti/`
- Stack: **React + TypeScript + Vite**, package manager: **bun**
- NO external map libs (Leaflet etc.) — the tactical map is a hand-built SVG so it works fully OFFLINE during judging
- Fonts: Google Fonts (Chakra Petch + IBM Plex Mono) with monospace fallbacks

## STATUS: ✅ REBUILT FROM SCRATCH & WORKING (Aug 2026)
Old blocked build deleted; project re-scaffolded and `bun install` succeeded cleanly.

- `index.html` — fonts (Chakra Petch / IBM Plex Mono), title, favicon
- `src/index.css` — dark naval ops-center theme (sonar cyan `#35e0c8`, amber alerts, red detect), CRT scanline overlay, clipped-corner panels, stage rail, console styles
- `src/data.ts` — mock data: 4 suspects w/ AIS tracks + Bayesian sub-score reasons (MT OCEAN GLORY 0.92 ★, SEA ANGEL 0.74, KOCHI EXPRESS 0.41, FV NEENDAKARA-7 0.18), slick polygon, drift path, ~13s timed log script
- `src/TacticalMap.tsx` — SVG scene (1000×700): ocean gradient, graticule + lat/lon labels, India west coast landmass (Karwar/Mangalore/Kochi), depth contours, Lakshadweep, rotating radar sweep, compass, scale bar, legend. Staged layers driven by elapsed time:
  - DETECT → slick fill + red outline draw-in + crosshair + tag "OIL SLICK · 14.7 km² · CONF 0.87"
  - BACKTRACK → amber drift path draw-in + tracer particles (JS-animated) + pulsing ORIGIN marker ± spinning uncertainty ellipse
  - ATTRIBUTE → vessels fade in staggered, tracks draw in, markers rotate to heading, primary suspect ringed + "★ PRIMARY SUSPECT P=0.92"
- `src/Panels.tsx` — MetricsPanel (IoU 0.78, ±14 km, top-3 80%… revealed per stage), SuspectPanel (ranked cards, animated confidence bars, explainable reasons, score formula footer), ConsolePanel (autoscrolling timestamped log)
- `src/App.tsx` — header (PSID 26143 · NTRO badges, IST clock, T+ elapsed, STANDBY/ANALYSING/COMPLETE pill), left stage rail with progress bars, RUN ANALYSIS button driving a ~13s timed state machine

## How to run
```
cd sagar-drishti && bun run dev     # dev server (currently running on :5199)
bun run build                       # tsc + vite build — passes clean
```
Demo flow for judges: press **RUN ANALYSIS**, narrate stages as they light up (~13 s).

## Reference docs in parent folder
- `SIH_OilSpill_Technical_Guide.md` — full technical reference (metrics, architecture, Q&A)
- `SIH_Presentation_Team_Brief.md` — 6-slide presentation brief
