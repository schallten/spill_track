import { useEffect, useRef, useState } from 'react'
import type { LogLine, Vessel } from './data'
import { VESSELS } from './data'

/* ---------------- metrics ---------------- */

interface MetricDef {
  k: string
  v: string
  cls?: string
  t: number
}

const METRICS: MetricDef[] = [
  { k: 'SAR SCENE', v: 'S1A_GRD · VV+VH', t: 400 },
  { k: 'DETECTION IoU', v: '0.78', cls: 'cyan', t: 3_000 },
  { k: 'SLICK AREA', v: '14.7 km²', t: 2_800 },
  { k: 'ORIGIN ERROR', v: '±14 km', cls: 'amber', t: 8_000 },
  { k: 'AGE ESTIMATE', v: '≈ 9 h', cls: 'amber', t: 8_000 },
  { k: 'TOP-3 HIT RATE', v: '80 %', cls: 'green', t: 12_500 },
  { k: 'LEGACY TIMELINE', v: '40–80 days', cls: 'red', t: 12_500 },
]

export function MetricsPanel({ elapsed }: { elapsed: number }) {
  return (
    <div className="clip metrics">
      <div className="clip-in">
        <div className="panel-title"><span className="tick">▮</span> PIPELINE METRICS</div>
        <div className="panel-body metrics-body">
          {METRICS.map(m => (
            <div className="mrow" key={m.k}>
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

function SuspectCard({ v, rank }: { v: Vessel; rank: number }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(v.score))
    return () => cancelAnimationFrame(id)
  }, [v.score])
  const primary = rank === 1
  const pctCol = primary ? '#ff5964' : v.score >= 0.7 ? '#ffb454' : '#587f8d'
  return (
    <div className={`scard${primary ? ' primary' : ''}`}>
      <div className="sc-head">
        <span className="sc-rank">#{rank}</span>
        <span className="sc-name">{v.name}</span>
        <span className={`sc-type ${v.type.toLowerCase()}`}>{v.type}</span>
      </div>
      <div className="sc-meta">{v.flag} · {v.imo}</div>
      <div className="sc-score-row">
        <div className="sc-bar"><i style={{ width: `${w * 100}%`, background: pctCol }} /></div>
        <span className="sc-pct" style={{ color: pctCol }}>{Math.round(w * 100)}%</span>
      </div>
      <ul className="sc-reasons">
        {v.reasons.map(r => <li key={r}>{r}</li>)}
      </ul>
    </div>
  )
}

export function SuspectPanel({ elapsed }: { elapsed: number }) {
  const revealed = Math.max(0, Math.min(VESSELS.length, Math.floor((elapsed - 8_900) / 800)))
  return (
    <div className="clip suspects">
      <div className="clip-in">
        <div className="panel-title"><span className="tick">▮</span> SUSPECT RANKING — BAYESIAN</div>
        <div className="panel-body suspects-body">
          {VESSELS.slice(0, revealed).map((v, i) => (
            <SuspectCard key={v.id} v={v} rank={i + 1} />
          ))}
          {revealed === 0 && (
            <div style={{ color: 'var(--faint)', fontSize: 11, letterSpacing: '0.08em', padding: '14px 4px' }}>
              AWAITING AIS CORRELATION…
            </div>
          )}
        </div>
        <div className="formula">
          <b>SCORE =</b> 0.30·proximity + 0.25·trajectory + 0.20·speed-anomaly + 0.15·vessel-type + 0.10·history
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
          <span style={{ marginLeft: 'auto', color: 'var(--faint)', letterSpacing: '0.1em' }}>AUTOSCROLL ▾</span>
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
