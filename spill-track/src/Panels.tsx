import { useEffect, useRef, useState } from 'react'
import type { LogLine, Vessel } from './data'
import { FACTOR_META, VESSELS } from './data'

/* ---------------- metrics ---------------- */

interface MetricDef {
  k: string
  v: string
  cls?: string
  t: number
  tip?: string
}

const METRICS: MetricDef[] = [
  { k: 'SATELLITE IMAGE', v: 'Sentinel-1 SAR', t: 400, tip: 'ESA radar satellite — sees oil slicks even through clouds and at night' },
  { k: 'AI BOUNDARY ACCURACY', v: '78 %', cls: 'cyan', t: 3_000, tip: 'IoU — overlap between the AI outline and a human expert annotation' },
  { k: 'SPILL SIZE', v: '14.7 km²', t: 2_800, tip: 'Area enclosed by the detected slick boundary' },
  { k: 'ORIGIN PINPOINTED TO', v: '±14 km', cls: 'amber', t: 8_000, tip: 'Radius of the estimated source location from drift back-tracking' },
  { k: 'SPILL AGE ESTIMATE', v: '≈ 9 h', cls: 'amber', t: 8_000, tip: 'How long before imaging the spill likely began' },
  { k: 'CULPRIT IN TOP-3 PICKS', v: '80 %', cls: 'green', t: 12_500, tip: 'Share of validation cases where the true culprit appears in the top 3 ranked suspects' },
  { k: 'OLD MANUAL METHOD TAKES', v: '40–80 days', cls: 'red', t: 12_500, tip: 'Typical manual investigation span today (satellite review + AIS correlation by hand)' },
]

export function MetricsPanel({ elapsed }: { elapsed: number }) {
  return (
    <div className="clip metrics">
      <div className="clip-in">
        <div className="panel-title"><span className="tick">▮</span> PIPELINE METRICS</div>
        <div className="panel-body metrics-body">
          {METRICS.map(m => (
            <div className="mrow" key={m.k} title={m.tip}>
              <span className="k">{m.k}</span>
              {elapsed >= m.t
                ? <span className={`v ${m.cls ?? ''}`}>{m.v}</span>
                : <span className="v empty">· · ·</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- suspects ---------------- */

const FACTOR_ALPHA = [0.35, 0.5, 0.65, 0.82, 1]

function SuspectCard({ v, rank, hovered, onHover }: { v: Vessel; rank: number; hovered: boolean; onHover: (id: string | null) => void }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(v.score))
    return () => cancelAnimationFrame(id)
  }, [v.score])
  const primary = rank === 1
  const pctCol = primary ? '#cf6d6d' : v.score >= 0.7 ? '#c99a4a' : '#76808d'
  const hex = pctCol.replace('#', '')
  const rgba = (a: number) => {
    const n = parseInt(hex, 16)
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
  }
  return (
    <div
      className={`scard show${primary ? ' primary' : ''}${hovered ? ' hl' : ''}`}
      onMouseEnter={() => onHover(v.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="sc-top">
        <span className="sc-rank">#{rank}</span>
        <span className={`sc-chip ${v.type.toLowerCase()}`} aria-hidden="true">
          <svg className="glyph" viewBox="-8 -8 16 16">
            {v.type === 'TANKER'
              ? <path d="M0,-7.5 L6.5,5.5 L-6.5,5.5 Z" />
              : v.type === 'CARGO'
                ? <rect x="-5.5" y="-5.5" width="11" height="11" />
                : <path d="M0,-6.5 L6.5,0 L0,6.5 L-6.5,0 Z" />}
          </svg>
        </span>
        <span className="sc-name">{v.name}</span>
        <span className={`sc-type ${v.type.toLowerCase()}`}>{v.type}</span>
      </div>
      <div className="sc-meta">{v.flag} · {v.imo}</div>
      <div className="sc-score-row">
        <div className="sc-bar sc-factors">
          {FACTOR_META.map((m, i) => (
            <i
              key={m.k}
              style={{ width: `${v.factors[m.k] * 100}%`, background: rgba(FACTOR_ALPHA[i]) }}
              title={`${v.factors[m.k].toFixed(2)} · weight ${m.w.toFixed(2)}`}
            />
          ))}
        </div>
        <span className="sc-pct" style={{ color: pctCol }}>{Math.round(w * 100)}%</span>
      </div>
      <ul className="sc-reasons">
        {v.reasons.map(r => <li key={r}>{r}</li>)}
      </ul>
    </div>
  )
}

export function SuspectPanel({ elapsed, hoverId, onHover }: { elapsed: number; hoverId: string | null; onHover: (id: string | null) => void }) {
  const revealed = Math.max(0, Math.min(VESSELS.length, Math.floor((elapsed - 8_900) / 800)))
  return (
    <div className="clip suspects">
      <div className="clip-in">
        <div className="panel-title"><span className="tick">▮</span> ATTRIBUTION — RANKED SUSPECTS</div>
        <div className="panel-body suspects-body" onMouseLeave={() => onHover(null)}>
          {VESSELS.slice(0, revealed).map((v, i) => (
            <SuspectCard key={v.id} v={v} rank={i + 1} hovered={hoverId === v.id} onHover={onHover} />
          ))}
          {revealed === 0 && (
            <div className="suspect-hint">
              AWAITING AIS CORRELATION…
            </div>
          )}
        </div>
        <div className="formula">
          <b>SCORE =</b> {FACTOR_META.map(m => `${m.w.toFixed(2)}·${m.k}`).join(' + ')}
          <span className="hint">HOVER CARD → TRACK</span>
        </div>
      </div>
    </div>
  )
}

/* ---------------- console ---------------- */

export function ConsolePanel({ entries }: { entries: LogLine[] }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries.length])
  return (
    <div className="clip logcell">
      <div className="clip-in">
        <div className="panel-title">
          <span className="tick">▮</span> SYSTEM LOG
          <span style={{ marginLeft: 'auto', color: 'var(--ink-4)', letterSpacing: '0.1em' }}>AUTOSCROLL ▾</span>
        </div>
        <div className="panel-body log-body" ref={ref}>
          {entries.map((l, i) => (
            <div className="log-line" key={i}>
              <span className="log-ts">{fmtTs(l.t)}</span>
              <span className={`log-lv-${l.level}`}>{l.text}</span>
            </div>
          ))}
          <span className="cursor" />
        </div>
      </div>
    </div>
  )
}

function fmtTs(t: number): string {
  const s = Math.floor(t / 1000)
  const d = Math.floor((t % 1000) / 100)
  return `T+${String(s).padStart(2, '0')}.${d}`
}
