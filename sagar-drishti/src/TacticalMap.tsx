import type { Vessel } from './data'
import {
  SLICK, DRIFT_PATH, ORIGIN, ORIGIN_LABEL, SLICK_LABEL,
  T_DETECT, T_BACKTRACK, T_ATTRIBUTE, VESSELS,
} from './data'

type Pt = [number, number]

const clamp01 = (u: number) => Math.max(0, Math.min(1, u))
const stageP = (ms: number, [a, b]: [number, number]) => clamp01((ms - a) / (b - a))

function polyLen(pts: Pt[]): number {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return L
}

function pointAlong(pts: Pt[], u: number): Pt {
  const s = clamp01(u)
  const total = polyLen(pts)
  let target = s * total
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
    if (target <= seg || i === pts.length - 1) {
      const f = seg === 0 ? 0 : Math.min(1, target / seg)
      return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f,
      ]
    }
    target -= seg
  }
  return pts[pts.length - 1]
}

const toPath = (pts: Pt[]) => 'M ' + pts.map(p => `${p[0]},${p[1]}`).join(' L ')

const TYPE_COLOR: Record<Vessel['type'], string> = {
  TANKER: '#ffb454',
  CARGO: '#35e0c8',
  FISHING: '#42e084',
}

function Marker({ type }: { type: Vessel['type'] }) {
  if (type === 'TANKER') return <path d="M0,-7.5 L6.5,5.5 L-6.5,5.5 Z" />
  if (type === 'CARGO') return <rect x={-5.5} y={-5.5} width={11} height={11} />
  return <path d="M0,-6.5 L6.5,0 L0,6.5 L-6.5,0 Z" />
}

interface TagProps {
  x: number
  y: number
  color: string
  lines: string[]
  anchor?: 'start' | 'middle'
}
function Tag({ x, y, color, lines, anchor = 'start' }: TagProps) {
  const w = Math.max(...lines.map(l => l.length)) * 6.6 + 16
  const h = lines.length * 15 + 10
  const bx = anchor === 'start' ? x : x - w / 2
  return (
    <g>
      <rect x={bx} y={y} width={w} height={h} fill="rgba(3,11,19,.88)" stroke={color} strokeWidth={1} />
      {lines.map((l, i) => (
        <text key={i} x={bx + 8} y={y + 17 + i * 15} fontSize={11} fill={color} className="svg-label" style={{ fill: color }}>
          {l}
        </text>
      ))}
    </g>
  )
}

const LAND =
  'M 700 -10 L 716 52 C 736 118 742 158 758 208 C 774 262 768 300 786 350 ' +
  'C 804 404 818 430 836 480 C 856 534 852 570 878 620 L 898 710 L 1010 710 L 1010 -10 Z'

export function TacticalMap({ elapsed, idle }: { elapsed: number; idle: boolean }) {
  const detP = stageP(elapsed, T_DETECT)
  const btP = stageP(elapsed, T_BACKTRACK)
  const atP = stageP(elapsed, T_ATTRIBUTE)

  const slickLen = polyLen(SLICK)
  const driftLen = polyLen(DRIFT_PATH)
  const slickC: Pt = [505, 398]

  const sweepOpacity = idle ? 0.35 : detP < 1 ? 0.95 : 0.4

  return (
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#07202e" />
          <stop offset="0.5" stopColor="#051824" />
          <stop offset="1" stopColor="#03101b" />
        </linearGradient>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d2a33" />
          <stop offset="1" stopColor="#082028" />
        </linearGradient>
        <radialGradient id="slickfill" cx="0.5" cy="0.5" r="0.65">
          <stop offset="0" stopColor="#123a44" />
          <stop offset="0.6" stopColor="#0c2b36" />
          <stop offset="1" stopColor="#081f2a" stopOpacity="0.4" />
        </radialGradient>
        <linearGradient id="sweepgrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#35e0c8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#35e0c8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ocean */}
      <rect width="1000" height="700" fill="url(#ocean)" />

      {/* graticule */}
      {[134, 228, 322, 416, 510, 604, 698, 792, 886].map(x => (
        <line key={x} x1={x} y1={0} x2={x} y2={700} stroke="#123648" strokeWidth={0.5} opacity={0.35} />
      ))}
      {[114, 193, 271, 350, 428, 507, 585, 664].map(y => (
        <line key={y} x1={0} y1={y} x2={1000} y2={y} stroke="#123648" strokeWidth={0.5} opacity={0.35} />
      ))}
      {[['68°E', 134], ['70°E', 322], ['72°E', 510], ['74°E', 698], ['76°E', 886]].map(([l, x]) => (
        <text key={l as string} x={(x as number) + 4} y={700 - 6} fontSize={9} className="svg-label" opacity={0.8}>{l}</text>
      ))}
      {[['16°N', 114], ['14°N', 271], ['12°N', 428], ['10°N', 585]].map(([l, y]) => (
        <text key={l as string} x={6} y={(y as number) - 5} fontSize={9} className="svg-label" opacity={0.8}>{l}</text>
      ))}

      {/* depth contours */}
      <path d="M 690 -10 C 700 120 680 260 700 380 C 715 470 700 580 720 710" fill="none" stroke="#1b4a5e" strokeWidth={1} strokeDasharray="2 6" opacity={0.5} />
      <path d="M 600 -10 C 610 140 585 280 605 400 C 618 480 605 590 620 710" fill="none" stroke="#1b4a5e" strokeWidth={1} strokeDasharray="2 6" opacity={0.35} />
      <path d="M 505 -10 C 512 170 486 320 500 450 C 508 540 498 620 505 710" fill="none" stroke="#1b4a5e" strokeWidth={1} strokeDasharray="2 6" opacity={0.22} />
      <text x={706} y={148} fontSize={8} className="svg-label" opacity={0.55}>200 m</text>
      <text x={612} y={210} fontSize={8} className="svg-label" opacity={0.45}>1 000 m</text>

      {/* India west coast landmass */}
      <path d={LAND} fill="url(#land)" stroke="#2b6a63" strokeWidth={1.2} />
      {[[763, 240, 'KARWAR'], [789, 356, 'MANGALORE'], [881, 612, 'KOCHI']].map(([x, y, n]) => (
        <g key={n as string}>
          <circle cx={x as number} cy={y as number} r={2.2} fill="#35e0c8" opacity={0.85} />
          <text x={(x as number) + 7} y={(y as number) + 3.5} fontSize={9} className="svg-label" letterSpacing={1.5}>{n}</text>
        </g>
      ))}

      {/* Lakshadweep */}
      <circle cx={155} cy={572} r={2} fill="#2b6a63" />
      <circle cx={186} cy={606} r={2} fill="#2b6a63" />
      <text x={198} y={610} fontSize={8.5} className="svg-label" opacity={0.7}>LAKSHADWEEP</text>
      <text x={250} y={190} fontSize={26} className="svg-disp" fill="#123648" letterSpacing={14} fontWeight={700} opacity={0.5}>ARABIAN SEA</text>

      {/* radar sweep */}
      <g className="sweep" style={{ transformOrigin: '500px 350px', opacity: sweepOpacity }}>
        <path d="M 500 350 L 500 105 A 245 245 0 0 1 662 152 Z" fill="url(#sweepgrad)" />
        <line x1={500} y1={350} x2={500} y2={105} stroke="#35e0c8" strokeWidth={1} opacity={0.5} />
      </g>
      <circle cx={500} cy={350} r={245} fill="none" stroke="#123648" strokeWidth={0.7} opacity={0.5} />

      {/* ===== STAGE 1 · DETECT ===== */}
      {detP > 0 && (
        <g>
          <polygon
            points={SLICK.map(p => p.join(',')).join(' ')}
            fill="url(#slickfill)"
            opacity={Math.min(0.95, detP * 2)}
          />
          <polygon
            points={SLICK.map(p => p.join(',')).join(' ')}
            fill="none"
            stroke="#ff5964"
            strokeWidth={2}
            strokeDasharray={slickLen}
            strokeDashoffset={slickLen * (1 - detP)}
            opacity={0.95}
          />
          {detP > 0.5 && (
            <g stroke="#ff5964" opacity={0.9}>
              <circle cx={slickC[0]} cy={slickC[1]} r={30} fill="none" />
              <line x1={slickC[0] - 44} y1={slickC[1]} x2={slickC[0] - 18} y2={slickC[1]} />
              <line x1={slickC[0] + 18} y1={slickC[1]} x2={slickC[0] + 44} y2={slickC[1]} />
              <line x1={slickC[0]} y1={slickC[1] - 44} x2={slickC[0]} y2={slickC[1] - 18} />
              <line x1={slickC[0]} y1={slickC[1] + 18} x2={slickC[0]} y2={slickC[1] + 44} />
            </g>
          )}
          {detP >= 0.9 && (
            <Tag x={618} y={330} color="#ff5964" lines={['OIL SLICK DETECTED', 'AREA 14.7 KM² · CONF 0.87', SLICK_LABEL]} />
          )}
        </g>
      )}

      {/* ===== STAGE 2 · BACKTRACK ===== */}
      {btP > 0 && (
        <g>
          <path
            d={toPath(DRIFT_PATH)}
            fill="none"
            stroke="#ffb454"
            strokeWidth={2.2}
            strokeDasharray={`${driftLen} ${driftLen}`}
            strokeDashoffset={driftLen * (1 - btP)}
            opacity={0.9}
            className="dash-flow"
          />
          {/* tracer particles */}
          {Array.from({ length: 7 }, (_, k) => {
            const p = pointAlong(DRIFT_PATH, btP * 1.8 - k * 0.11)
            const op = Math.max(0.25, 1 - atP) * 0.9
            return <circle key={k} cx={p[0]} cy={p[1]} r={2.6} fill="#ffb454" opacity={op} />
          })}
          {btP > 0.5 && (
            <g>
              <ellipse
                cx={ORIGIN[0]} cy={ORIGIN[1]} rx={48} ry={22}
                transform={`rotate(38 ${ORIGIN[0]} ${ORIGIN[1]})`}
                fill="rgba(255,180,84,.07)" stroke="#ffb454" strokeWidth={1.2}
                strokeDasharray="7 5" className="ell-spin"
              />
              <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r={4.5} fill="#ffb454" />
              <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r={10} fill="none" stroke="#ffb454" strokeWidth={1.6} className="ping" />
              {btP >= 0.92 && (
                <Tag x={ORIGIN[0] - 96} y={ORIGIN[1] - 74} color="#ffb454"
                  lines={['EST. ORIGIN OF SPILL', `${ORIGIN_LABEL} · ±14 KM`, 'SLICK AGE ≈ 9 H']} />
              )}
            </g>
          )}
        </g>
      )}

      {/* ===== STAGE 3 · ATTRIBUTE ===== */}
      {atP > 0 && VESSELS.map((v, i) => {
        const vP = clamp01(atP * 6 - i * 1.05)
        if (vP <= 0) return null
        const len = polyLen(v.track)
        const pos = pointAlong(v.track, vP)
        const col = TYPE_COLOR[v.type]
        const primary = i === 0
        const showLabel = vP > 0.75
        return (
          <g key={v.id} opacity={Math.min(1, vP * 1.6)}>
            <path
              d={toPath(v.track)} fill="none" stroke={col}
              strokeWidth={primary ? 2 : 1.4}
              strokeDasharray={`${len} ${len}`}
              strokeDashoffset={len * (1 - vP)}
              opacity={primary ? 0.85 : 0.5}
            />
            {primary && atP > 0.55 && (
              <circle cx={pos[0]} cy={pos[1]} r={16} fill="none" stroke="#ff5964" strokeWidth={1.6} strokeDasharray="4 4" className="ell-spin" />
            )}
            <g transform={`translate(${pos[0]},${pos[1]}) rotate(${v.headingDeg})`}>
              <Marker type={v.type} />
            </g>
            {showLabel && !primary && (
              <text x={pos[0]} y={pos[1] + 22} fontSize={9.5} textAnchor="middle" className="svg-label" fill={col} style={{ fill: col }}>
                {v.name} · P={v.score.toFixed(2)}
              </text>
            )}
          </g>
        )
      })}
      {atP > 0.55 && (
        <Tag x={620} y={618} color="#ff5964"
          lines={['★ PRIMARY SUSPECT', 'MT OCEAN GLORY · P=0.92']} />
      )}

      {/* compass */}
      <g transform="translate(72,86)" opacity={0.8}>
        <circle r={19} fill="rgba(3,11,19,.6)" stroke="#123648" />
        <path d="M0,-13 L4,4 L0,1 L-4,4 Z" fill="#35e0c8" />
        <text y={-25} fontSize={9} textAnchor="middle" className="svg-label">N</text>
      </g>

      {/* scale bar */}
      <g transform="translate(46,662)" opacity={0.85}>
        <line x1={0} y1={0} x2={85} y2={0} stroke="#587f8d" strokeWidth={1.4} />
        <line x1={0} y1={-4} x2={0} y2={4} stroke="#587f8d" />
        <line x1={42.5} y1={-3} x2={42.5} y2={3} stroke="#587f8d" />
        <line x1={85} y1={-4} x2={85} y2={4} stroke="#587f8d" />
        <text x={0} y={16} fontSize={8.5} className="svg-label">0</text>
        <text x={42.5} y={16} fontSize={8.5} textAnchor="middle" className="svg-label">50</text>
        <text x={85} y={16} fontSize={8.5} textAnchor="end" className="svg-label">100 KM</text>
      </g>

      {/* legend */}
      <g transform="translate(46,596)">
        <text y={0} fontSize={9} className="svg-label" letterSpacing={2} opacity={0.9}>CONTACT LEGEND</text>
        {([['TANKER', 'TANKER'], ['CARGO', 'CARGO'], ['FISHING', 'FISHING']] as const).map(([label, t], i) => (
          <g key={t} transform={`translate(0,${16 + i * 15})`}>
            <g fill={TYPE_COLOR[t]}>
              <Marker type={t} />
            </g>
            <text x={14} y={3.5} fontSize={9} className="svg-label">{label}</text>
          </g>
        ))}
      </g>

      <text x={992} y={692} fontSize={8} textAnchor="end" className="svg-label" opacity={0.6} letterSpacing={1.2}>
        SYNTHETIC DEMO DATASET · NOT FOR OPERATIONAL USE
      </text>

      {idle && (
        <g opacity={0.9}>
          <rect x={0} y={296} width={1000} height={110} fill="rgba(3,11,19,.55)" />
          <text x={500} y={340} fontSize={21} textAnchor="middle" className="svg-disp" fill="#35e0c8" letterSpacing={6} fontWeight={600}>
            ◉ NO ACTIVE SCENE — AWAITING TASKING
          </text>
          <text x={500} y={372} fontSize={12} textAnchor="middle" className="svg-label" letterSpacing={3}>
            PRESS RUN ANALYSIS TO START THE DETECT → BACKTRACK → ATTRIBUTE PIPELINE
          </text>
        </g>
      )}
    </svg>
  )
}
