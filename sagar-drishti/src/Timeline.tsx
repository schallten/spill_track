import type { LogLine } from './data'
import { TOTAL_MS } from './data'

interface StageBand {
  name: string
  win: [number, number]
}

interface TLProps {
  clock: number | null
  paused: boolean
  events: LogLine[]
  stages: StageBand[]
  onSeek: (t: number) => void
  onToggle: () => void
}

const pct = (t: number) => (t / TOTAL_MS) * 100

function stageAt(ms: number, stages: StageBand[]): string {
  for (const s of stages) if (ms >= s.win[0] && ms < s.win[1]) return s.name
  return ms >= TOTAL_MS ? 'COMPLETE' : '—'
}

export function Timeline({ clock, paused, events, stages, onSeek, onToggle }: TLProps) {
  const t = clock ?? 0
  const done = clock !== null && clock >= TOTAL_MS
  const playing = clock !== null && !paused && !done

  return (
    <div className="tl">
      <button className={`tl-btn${playing ? ' playing' : ''}`} onClick={onToggle} title={playing ? 'Pause' : 'Play / Replay'}>
        {playing ? '❚❚' : '▶'}
      </button>
      <span className="tl-clock">T+{(t / 1000).toFixed(1)}s</span>
      <div className="tl-track">
        {stages.map((s, i) => (
          <div key={s.name} className="tl-band" style={{ left: `${pct(s.win[0])}%`, width: `${pct(s.win[1]) - pct(s.win[0])}%` }}>
            <span>0{i + 1}</span>
          </div>
        ))}
        {clock !== null && <div className="tl-fill" style={{ width: `${pct(t)}%` }} />}
        {events.map((e, i) =>
          e.level === 'info' ? null : (
            <span
              key={i}
              className={`tl-tick ${e.level}`}
              style={{ left: `${pct(e.t)}%` }}
              title={`T+${(e.t / 1000).toFixed(1)}s — ${e.text}`}
            />
          ),
        )}
        {clock !== null && <div className="tl-thumb" style={{ left: `${pct(t)}%` }} />}
        <input
          type="range"
          min={0}
          max={TOTAL_MS}
          step={50}
          value={t}
          disabled={clock === null}
          onChange={e => onSeek(Number(e.target.value))}
          aria-label="Timeline scrubber"
        />
      </div>
      <span className="tl-stage">{stageAt(t, stages)}</span>
    </div>
  )
}
