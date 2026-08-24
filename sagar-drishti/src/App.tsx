import { useEffect, useMemo, useState } from 'react'
import { LOG_SCRIPT, NARRATION, TOTAL_MS, T_DETECT, T_BACKTRACK, T_ATTRIBUTE } from './data'
import type { LogLine } from './data'
import { TacticalMap } from './TacticalMap'
import { MetricsPanel, SuspectPanel, ConsolePanel } from './Panels'
import { Timeline } from './Timeline'

const TICK = 100

const STAGES = [
  { name: 'DETECT', win: T_DETECT, plain: 'Spot the spill from space', tech: 'U-Net AI · Sentinel-1 SAR' },
  { name: 'BACKTRACK', win: T_BACKTRACK, plain: 'Rewind the ocean to its source', tech: 'Drift physics · wind + currents' },
  { name: 'ATTRIBUTE', win: T_ATTRIBUTE, plain: 'Name the ship responsible', tech: 'Ship-tracking correlation' },
]

const clamp01 = (u: number) => Math.max(0, Math.min(1, u))
const fmtClock = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function App() {
  const [clock, setClock] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const [uptime, setUptime] = useState('00:00')

  useEffect(() => {
    const t0 = Date.now()
    const id = setInterval(() => {
      setNow(new Date())
      setUptime(fmtClock(Math.floor((Date.now() - t0) / 1000)))
    }, 1_000)
    return () => clearInterval(id)
  }, [])

  const running = clock !== null && clock < TOTAL_MS && !paused
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setClock(c => (c === null ? TICK : Math.min(c + TICK, TOTAL_MS)))
    }, TICK)
    return () => clearInterval(id)
  }, [running])

  const elapsed = clock ?? 0
  const phase = clock === null ? 'idle' : elapsed >= TOTAL_MS ? 'done' : running ? 'run' : 'hold'

  const entries: LogLine[] = useMemo(() => LOG_SCRIPT.filter(l => l.t <= elapsed), [elapsed])
  const narration = useMemo(() => {
    let cur = null
    for (const n of NARRATION) if (elapsed >= n.t) cur = n
    return cur
  }, [elapsed])

  const startRun = () => { setPaused(false); setClock(TICK) }
  const toggle = () => {
    if (clock === null || clock >= TOTAL_MS) return startRun()
    setPaused(p => !p)
  }
  const seek = (t: number) => {
    setClock(t)
    if (t > 0 && t < TOTAL_MS) setPaused(false)
  }

  const ist = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })

  return (
    <div className="app">
      <div className="banner">// DEMONSTRATION BUILD · SYNTHETIC DATASET · UNCLASSIFIED //</div>

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
          <div className="tplus"><div className="t">{`T+${fmtClock(Math.floor(elapsed / 1000))}`}</div><div className="l">PIPELINE ELAPSED</div></div>
          <div className="clock"><div className="t">{ist}</div><div className="l">IST · UTC+5:30</div></div>
          <div className={`pill ${phase === 'run' ? 'run' : phase === 'done' ? 'done' : ''}`}>
            {phase === 'idle' ? 'STANDBY' : phase === 'run' ? 'ANALYSING' : phase === 'hold' ? 'PAUSED' : 'COMPLETE'}
          </div>
        </div>
      </div></header>

      {/* stage rail */}
      <aside className="rail">
        <div className="clip"><div className="clip-in">
          <div className="panel-title"><span className="tick">▮</span> MISSION PIPELINE</div>
          <div className="stages">
            {STAGES.map(s => {
              const active = phase === 'run' && elapsed >= s.win[0] && elapsed < s.win[1]
              const done = phase === 'done' || elapsed >= s.win[1]
              const idx = STAGES.indexOf(s)
              const p = done ? 1 : active ? clamp01((elapsed - s.win[0]) / (s.win[1] - s.win[0])) : 0
              return (
                <div key={s.name} className={`stage${active ? ' active' : ''}${done ? ' done' : ''}`}>
                  <span className="dot" />
                  <div className="num">STEP {idx + 1} / 3</div>
                  <div className="name">{s.name}</div>
                  <div className="cap-h">{s.plain}</div>
                  <div className="cap-t">{s.tech}</div>
                  <div className="bar"><i style={{ width: `${p * 100}%` }} /></div>
                </div>
              )
            })}
          </div>
          {phase === 'run' && !paused ? (
            <button className="runbtn running" disabled>▮▮ ANALYSING…</button>
          ) : (
            <button className={`runbtn${phase === 'idle' ? ' idle-pulse' : ' rerun'}`} onClick={startRun}>
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
        <div className="panel-body mapwrap">
          <TacticalMap elapsed={elapsed} idle={phase === 'idle'} highlightId={hoverId} />
          {narration && (
            <div className="narration" key={narration.t}>
              <span className="n-step">{narration.step}</span>
              <span className="n-text">{narration.text}</span>
            </div>
          )}
        </div>
      </div></main>

      {/* side column */}
      <aside className="side">
        <MetricsPanel elapsed={elapsed} />
        <SuspectPanel elapsed={elapsed} hoverId={hoverId} onHover={setHoverId} />
      </aside>

      {/* timeline scrubber */}
      <Timeline
        clock={clock}
        paused={paused}
        events={LOG_SCRIPT}
        stages={STAGES}
        onSeek={seek}
        onToggle={toggle}
      />

      <ConsolePanel entries={entries} />

      <footer className="footer">
        <span>// UNCLASSIFIED // FOR DEMONSTRATION ONLY //</span>
        <span>UPLINK <b>SIMULATED</b> · SENSOR <b>S1A</b> · OP <b>RIBO</b> · SESSION <b>{uptime}</b> · BUILD <b>2.4.1</b></span>
      </footer>
    </div>
  )
}
