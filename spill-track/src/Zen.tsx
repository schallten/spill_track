import { TacticalMap } from './TacticalMap'
import { ZenSuspects } from './Panels'

export function Zen({ elapsed, phase, hoverId, onHover, onSelect, startRun, onExit }: {
  elapsed: number
  phase: 'idle' | 'run' | 'hold' | 'done'
  hoverId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string | null) => void
  startRun: () => void
  onExit: () => void
}) {
  const running = phase === 'run'
  return (
    <div className="zen">
      <div className="zen-bar">
        <button className={`zen-run${running ? ' running' : ''}`} onClick={startRun} disabled={running}>
          {running ? 'ANALYSING…' : phase === 'done' ? '↻ RE-RUN ANALYSIS' : '▶ RUN ANALYSIS'}
        </button>
        <button className="zen-exit" onClick={onExit}>✕ EXIT ZEN</button>
      </div>
      <div className="zen-body">
        <div className="zen-map">
          <TacticalMap elapsed={elapsed} idle={phase === 'idle'} highlightId={hoverId} onSelect={onSelect} />
        </div>
        <div className="zen-side">
          <ZenSuspects elapsed={elapsed} hoverId={hoverId} onHover={onHover} />
        </div>
      </div>
    </div>
  )
}
