import { useEffect, useMemo, useState } from 'react'
import { LOG_SCRIPT, TOTAL_MS, T_DETECT, T_BACKTRACK, T_ATTRIBUTE } from './data'
import type { LogLine } from './data'
import { TacticalMap } from './TacticalMap'
import { MetricsPanel, SuspectPanel, ConsolePanel } from './Panels'

const TICK = 100

type Phase = 'idle' | 'running' | 'done'

const STAGES = [
  { num: '01', name: 'DETECT', cap: 'U-Net segmentation\nSentinel-1 SAR', win: T_DETECT },
  { num: '02', name: 'BACKTRACK', cap: 'Lagrangian advection\nERA5 wind + currents', win: T_BACKTRACK },
  { num: '03', name: 'ATTRIBUTE', cap: 'Bayesian correlation\nAIS vessel tracks', win: T_ATTRIBUTE },
]

const clamp01 = (u: number) => Math.max(0, Math.min(1, u))

export default function App() {
  const [clock, setClock] = useState<number | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000)
    return () => clearInterval(id)
  }, [])

  const running = clock !== null && clock < TOTAL_MS
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setClock(c => (c === null ? TICK : Math.min(c + TICK, TOTAL_MS)))
    }, TICK)
    return () => clearInterval(id)
  }, [running])

  const elapsed = clock ?? 0
  const phase: Phase = clock === null ? 'idle' : elapsed >= TOTAL_MS ? 'done' : 'running'

  const entries: LogLine[] = useMemo(() => LOG_SCRIPT.filter(l => l.t <= elapsed), [elapsed])

  const startRun = () => setClock(TICK)

  const ist = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
  const tSec = Math.floor(elapsed / 1000)
  const tPlus = `T+${String(Math.floor(tSec / 60)).padStart(2, '0')}:${String(tSec % 60).padStart(2, '0')}`

  return (
    <div className="app">
      {/* header */}
      <header className="header clip"><div className="clip-in" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <div className="brand">
          <div className="brand-glyph">◉</div>
          <div>
            <div className="brand-name">SAGAR DRISHTI</div>
            <div className="brand-sub">MARITIME INTELLIGENCE · OPS CONSOLE</div>
          </div>
        </div>
        <div className="hdr-badges">
          <span className="badge">PSID <b>26143</b></span>
          <span className="badge">ORG <b>NTRO</b></span>
          <span className="badge">THEME <b>SPACE TECH + SOFTWARE</b></span>
          <span className="badge">SECTOR <b>ARABIAN SEA · SECTOR-7</b></span>
        </div>
        <div className="hdr-right">
          <div className="tplus"><div className="t">{tPlus}</div><div className="l">PIPELINE ELAPSED</div></div>
          <div className="clock"><div className="t">{ist}</div><div className="l">IST · UTC+5:30</div></div>
          <div className={`pill ${phase === 'running' ? 'run' : phase === 'done' ? 'done' : ''}`}>
            {phase === 'idle' ? 'STANDBY' : phase === 'running' ? 'ANALYSING' : 'COMPLETE'}
          </div>
        </div>
      </div></header>

      {/* stage rail */}
      <aside className="rail">
        <div className="clip"><div className="clip-in">
          <div className="panel-title"><span className="tick">▮</span> MISSION PIPELINE</div>
          <div className="stages">
            {STAGES.map(s => {
              const active = phase === 'running' && elapsed >= s.win[0] && elapsed < s.win[1]
              const done = phase === 'done' || elapsed >= s.win[1]
              const p = done ? 1 : active ? clamp01((elapsed - s.win[0]) / (s.win[1] - s.win[0])) : 0
              return (
                <div key={s.num} className={`stage${active ? ' active' : ''}${done ? ' done' : ''}`}>
                  <span className="dot" />
                  <div className="num">STAGE {s.num}</div>
                  <div className="name">{s.name}</div>
                  <div className="cap" style={{ whiteSpace: 'pre-line' }}>{s.cap}</div>
                  <div className="bar"><i style={{ width: `${p * 100}%` }} /></div>
                </div>
              )
            })}
          </div>
          {phase === 'running' ? (
            <button className="runbtn running" disabled>▮▮ ANALYSING…</button>
          ) : (
            <button className={`runbtn${phase === 'done' ? ' rerun' : ''}`} onClick={startRun}>
              {phase === 'idle' ? '▶ RUN ANALYSIS' : '↻ RE-RUN ANALYSIS'}
            </button>
          )}
        </div></div>
      </aside>

      {/* tactical map */}
      <main className="mapcell clip"><div className="clip-in">
        <div className="panel-title">
          <span className="tick">▮</span> TACTICAL PLOT — SENTINEL-1 OVERLAY
          <span style={{ marginLeft: 'auto', color: 'var(--faint)', letterSpacing: '0.12em' }}>
            GRID WGS-84 · MERCATOR AUX
          </span>
        </div>
        <div className="panel-body">
          <TacticalMap elapsed={elapsed} idle={phase === 'idle'} />
        </div>
      </div></main>

      {/* side column */}
      <aside className="side">
        <MetricsPanel elapsed={elapsed} />
        <SuspectPanel elapsed={elapsed} />
      </aside>

      <ConsolePanel entries={entries} />
    </div>
  )
}
