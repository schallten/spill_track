import { useEffect, useMemo, useState } from 'react'
import { LOG_SCRIPT, NARRATION, SOURCES, TOTAL_MS, T_DETECT, T_BACKTRACK, T_ATTRIBUTE } from './data'
import type { LogLine } from './data'
import { TacticalMap } from './TacticalMap'
import { MetricsPanel, SuspectPanel, ConsolePanel } from './Panels'
import { Timeline } from './Timeline'
import { Dossier } from './Dossier'
import { Impact } from './Impact'

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
  const [report, setReport] = useState(false)
  const [impact, setImpact] = useState(false)
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setReport(false); setImpact(false) }
      if (e.target instanceof HTMLInputElement) return
      if (e.key === ' ') { e.preventDefault(); toggle() }
      else if (['1', '2', '3'].includes(e.key)) seek(STAGES[Number(e.key) - 1].win[0] + TICK)
      else if (e.key === 'r' || e.key === 'R') startRun()
      else if ((e.key === 'g' || e.key === 'G') && (clock ?? 0) >= TOTAL_MS) setReport(r => !r)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const ist = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })

  return (
    <div className="app">

      {/* header */}
      <header className="header clip"><div className="clip-in" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <div className="brand">
          <div className="brand-glyph">◉</div>
          <div>
            <div className="brand-name">SPILL TRACK</div>
            <div className="brand-sub">MARITIME SATELLITE MONITORING</div>
          </div>
        </div>
        <div className="badges-row">
          <span className="badge"><span className="key">PROBLEM</span><b>26143</b></span>
          <span className="badge"><span className="key">ORG</span><b>NTRO</b></span>
          <span className="badge"><span className="key">THEME</span><b>SPACE TECH + SOFTWARE</b></span>
          <span className="badge"><span className="key">REGION</span><b>ARABIAN SEA</b></span>
        </div>
        <div className="hdr-right">
          <div className="hdr-cell"><div className="t amber">{`T+${fmtClock(Math.floor(elapsed / 1000))}`}</div><div className="l">PIPELINE ELAPSED</div></div>
          <div className="hdr-cell"><div className="t">{ist}</div><div className="l">IST · UTC+5:30</div></div>
          <div className={`status-cell ${phase === 'run' ? 'run' : phase === 'done' ? 'done' : ''}`}>
            <span className="led" />
            {phase === 'idle' ? 'STANDBY' : phase === 'run' ? 'ANALYSING' : phase === 'hold' ? 'PAUSED' : 'COMPLETE'}
          </div>
        </div>
      </div></header>

      {/* stage rail */}
      <aside className="rail">
        <div className="clip"><div className="clip-in">
          <div className="panel-title"><span className="tick">▮</span> ANALYSIS PIPELINE</div>
          <div className="stages">
            {STAGES.map(s => {
              const active = phase === 'run' && elapsed >= s.win[0] && elapsed < s.win[1]
              const done = phase === 'done' || elapsed >= s.win[1]
              const idx = STAGES.indexOf(s)
              const p = done ? 1 : active ? clamp01((elapsed - s.win[0]) / (s.win[1] - s.win[0])) : 0
              return (
                <div key={s.name} className={`stage${active ? ' active' : ''}${done ? ' done' : ''}`}>
                  <span className="dot" />
                  <div className="num"><span className="idx">{idx + 1}</span> <span>STEP / 3</span></div>
                  <div className="name">{s.name}</div>
                  <div className="cap-h">{s.plain}</div>
                  <div className="cap-t">{s.tech}</div>
                  <div className="bar"><i style={{ width: `${p * 100}%` }} /></div>
                </div>
              )
            })}
          </div>
          <div className="railctl">
            {phase === 'run' && !paused ? (
              <button className="runbtn running" disabled>ANALYSING…</button>
            ) : (
              <button className={`runbtn${phase === 'idle' ? '' : ' rerun'}`} onClick={startRun}>
                {phase === 'idle' ? '▶ RUN ANALYSIS' : '↻ RE-RUN ANALYSIS'}
              </button>
            )}
            <button className="impactbtn" onClick={() => setImpact(true)}>ƒ IMPACT</button>
            <button className="reportbtn" onClick={() => setReport(true)}>⎘ GENERATE REPORT</button>
            <div className="drivectl">
              <span className="dlabel">STEP THROUGH</span>
              <div className="dbtns">
                {STAGES.map((s, i) => (
                  <button key={s.name} className={`dbtn${i === 0 && phase !== 'run' ? ' on' : ''}`}
                    onClick={() => seek(s.win[0] + TICK)} title={`Jump to ${s.name}`}>{i + 1}</button>
                ))}
              </div>
            </div>
          </div>
      </div></div>
      <div className="clip srcbox"><div className="clip-in">
          <div className="panel-title"><span className="tick">▮</span> DATA &amp; METHODS</div>
          <div className="src-list">
            {SOURCES.map(s => (
              <div key={s.k} className="src-row">
                <span className="src-dot" />
                <span>{s.k}</span>
                <em>{s.v}</em>
              </div>
            ))}
          </div>
        </div></div>
      </aside>

      {/* tactical map */}
      <main className="mapcell clip"><div className="clip-in">
        <div className="panel-title">
          <span className="tick">▮</span> ANALYSIS — SENTINEL-1 OVERLAY
          <span style={{ marginLeft: 'auto', color: 'var(--ink-4)', letterSpacing: '0.12em' }}>
            GRID WGS-84 · MERCATOR AUX
          </span>
        </div>
        <div className="panel-body mapwrap">
          <TacticalMap elapsed={elapsed} idle={phase === 'idle'} highlightId={hoverId} onSelect={setHoverId} />
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
        <span>// FOR DEMONSTRATION · SYNTHETIC DATA //</span>
        <span className="kbd-hint">SPACE play/pause · 1·2·3 jump stage · R replay · G report · ESC close</span>
        <span>MODE <b>SIMULATED</b> · SENSOR <b>S1A</b> · OPERATOR <b>RIBO</b> · SESSION <b>{uptime}</b> · BUILD <b>2.4.1</b></span>
      </footer>

      {report && <Dossier onClose={() => setReport(false)} />}
      {impact && <Impact onClose={() => setImpact(false)} />}
    </div>
  )
}
