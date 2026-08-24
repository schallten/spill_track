export type VesselType = 'TANKER' | 'CARGO' | 'FISHING'
export type FactorKey = 'prox' | 'traj' | 'spd' | 'typ' | 'hist'

export const FACTOR_META: { k: FactorKey; w: number }[] = [
  { k: 'prox', w: 0.3 },
  { k: 'traj', w: 0.25 },
  { k: 'spd', w: 0.2 },
  { k: 'typ', w: 0.15 },
  { k: 'hist', w: 0.1 },
]

export interface Vessel {
  id: string
  name: string
  type: VesselType
  flag: string
  imo: string
  score: number
  factors: Record<FactorKey, number>
  track: [number, number][]
  headingDeg: number
  reasons: string[]
}

export const TOTAL_MS = 13_200
export const T_DETECT: [number, number] = [400, 4_000]
export const T_BACKTRACK: [number, number] = [4_000, 8_200]
export const T_ATTRIBUTE: [number, number] = [8_200, TOTAL_MS]

/** Slick polygon around centroid (505, 400) in map coords */
export const SLICK: [number, number][] = [
  [447, 398], [462, 376], [492, 362], [520, 358], [551, 365], [573, 382],
  [581, 402], [570, 424], [544, 441], [512, 449], [478, 444], [455, 428],
]

/** Drift path: estimated origin -> slick centroid */
export const DRIFT_PATH: [number, number][] = [
  [432, 306], [438, 320], [450, 333], [464, 346], [476, 360],
  [486, 375], [494, 388], [502, 398],
]

export const ORIGIN: [number, number] = [432, 306]
export const ORIGIN_LABEL = '13.56°N · 71.17°E'
export const SLICK_LABEL = '12.39°N · 71.95°E'

export const VESSELS: Vessel[] = [
  {
    id: 'V1',
    factors: { prox: 0.28, traj: 0.23, spd: 0.18, typ: 0.14, hist: 0.09 },
    name: 'MT OCEAN GLORY',
    type: 'TANKER',
    flag: 'PA · LIBERIA',
    imo: 'IMO 9281771',
    score: 0.92,
    track: [
      [150, 120], [230, 170], [310, 225], [385, 272], [432, 306],
      [470, 352], [500, 410], [520, 470], [540, 540],
    ],
    headingDeg: 36,
    reasons: [
      'proximity ≤ 2.1 km of origin @ T−1.4 h',
      'course aligned with drift bearing (Δθ 7°)',
      'speed anomaly −38% kn within 10 km radius',
      'crude tanker — high spill capacity class',
      '1 prior MARPOL annex-I violation on record',
    ],
  },
  {
    id: 'V2',
    factors: { prox: 0.21, traj: 0.17, spd: 0.14, typ: 0.13, hist: 0.09 },
    name: 'MT SEA ANGEL',
    type: 'TANKER',
    flag: 'MV · PANAMA',
    imo: 'IMO 9410502',
    score: 0.74,
    track: [
      [80, 300], [190, 315], [300, 330], [420, 340],
      [540, 330], [660, 305], [780, 290],
    ],
    headingDeg: -5,
    reasons: [
      'CPA 26 km NNW of origin @ T−3.2 h',
      'partial course reversal 2 h post-window',
      'ballast exchange logged in corridor',
    ],
  },
  {
    id: 'V3',
    factors: { prox: 0.13, traj: 0.1, spd: 0.06, typ: 0.07, hist: 0.05 },
    name: 'MV KOCHI EXPRESS',
    type: 'CARGO',
    flag: 'IN · KOCHI',
    imo: 'IMO 9712698',
    score: 0.41,
    track: [
      [120, 560], [260, 540], [400, 520], [540, 505], [680, 495], [820, 490],
    ],
    headingDeg: -8,
    reasons: [
      'transits lane 48 km S of slick centroid',
      'constant 14.2 kn — no anomalous behaviour',
      'bilge discharge possible (low confidence)',
    ],
  },
  {
    id: 'V4',
    factors: { prox: 0.04, traj: 0.04, spd: 0.03, typ: 0.04, hist: 0.03 },
    name: 'FV NEENDAKARA-7',
    type: 'FISHING',
    flag: 'IN · NEENDAKARA',
    imo: 'REG IND-KL-07',
    score: 0.18,
    track: [
      [720, 430], [700, 470], [680, 505], [665, 540], [672, 575],
    ],
    headingDeg: 75,
    reasons: [
      'coastal waters, 62 km ESE of origin',
      'small bunker capacity (<40 t)',
      'AIS gap 40 min — typical fishing pattern',
    ],
  },
]

export interface LogLine {
  t: number
  level: 'info' | 'ok' | 'warn'
  text: string
}

export const LOG_SCRIPT: LogLine[] = [
  { t: 0, level: 'ok', text: 'SYSTEM ONLINE — SAGAR DRISHTI v2.4 · PSID 26143 · NTRO' },
  { t: 400, level: 'info', text: 'INGEST   Sentinel-1 GRD scene S1A_IW_GRDH_1SDV ·VV+VH· acquired' },
  { t: 800, level: 'info', text: 'PREPROC  radiometric cal → Lee σ° speckle filter → 512² tile' },
  { t: 1_400, level: 'info', text: 'MODEL    U-Net semantic segmentation — inference pass 1/1' },
  { t: 2_400, level: 'warn', text: 'DETECT   dark-slick mask ACQUIRED — boundary vectorising…' },
  { t: 2_800, level: 'ok', text: 'DETECT   area 14.7 km² · perimeter 21.3 km · confidence 0.87' },
  { t: 3_400, level: 'info', text: 'EXPORT   slick contour → GeoJSON · IoU 0.78 vs hand-label' },
  { t: 4_100, level: 'info', text: 'FETCH    ERA5 10 m winds + OSCAR currents · window t−6h → t₀' },
  { t: 4_600, level: 'info', text: 'MODEL    Lagrangian back-advection · 512 tracers · Δt −10 min' },
  { t: 6_300, level: 'info', text: 'TRACE    ensemble converging on inverse trajectory…' },
  { t: 8_000, level: 'ok', text: `ORIGIN   est. ${ORIGIN_LABEL} ±14 km · slick age ≈ 9 h` },
  { t: 8_300, level: 'info', text: 'QUERY    AIS ±4 h · 50 km radius → 4 contacts resolved' },
  { t: 8_900, level: 'info', text: 'SCORE    bayesian: prox .30 traj .25 speed .20 type .15 hist .10' },
  { t: 9_500, level: 'warn', text: 'CONTACT  MT OCEAN GLORY · P=0.92 ★ PRIMARY SUSPECT FLAGGED' },
  { t: 10_300, level: 'info', text: 'CONTACT  MT SEA ANGEL · P=0.74 — secondary interest' },
  { t: 11_100, level: 'info', text: 'CONTACT  MV KOCHI EXPRESS · P=0.41 — low likelihood' },
  { t: 11_900, level: 'info', text: 'CONTACT  FV NEENDAKARA-7 · P=0.18 — ruled unlikely' },
  { t: 12_500, level: 'ok', text: 'DOSSIER  attribution complete · top-3 hit rate 80% (validated)' },
  { t: 12_900, level: 'ok', text: 'PIPELINE COMPLETE — review suspect panel →' }
]

/** Plain-English narration shown as captions over the map */
export interface Narration {
  t: number
  step: string
  text: string
}

export const NARRATION: Narration[] = [
  { t: 400, step: 'STEP 1 / 3 · FIND', text: 'A satellite radar image arrives. Our AI scans it for dark, oily patches on the sea.' },
  { t: 2_400, step: 'STEP 1 / 3 · FOUND', text: 'Oil slick confirmed — 14.7 km², outlined in red, detected with 87% confidence.' },
  { t: 4_000, step: 'STEP 2 / 3 · REWIND', text: 'Wind and ocean-current records are played backwards to see where the oil came from…' },
  { t: 6_300, step: 'STEP 2 / 3 · SOURCE', text: 'The trail leads back to an origin point — pinned within ±14 km, about 9 hours ago.' },
  { t: 8_200, step: 'STEP 3 / 3 · SHIPS', text: 'Every ship that passed near that point in that time window is pulled from tracking data.' },
  { t: 9_500, step: 'STEP 3 / 3 · VERDICT', text: 'Course, speed and ship type are scored — MT OCEAN GLORY tops the list at 92% likelihood.' },
  { t: 12_300, step: 'COMPLETE', text: 'Done in seconds instead of months. Investigators get a ready-made evidence package.' },
]
