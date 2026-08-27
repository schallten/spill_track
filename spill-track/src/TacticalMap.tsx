import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Vessel } from './data'
import {
  SLICK, DRIFT_PATH, ORIGIN,
  T_DETECT, T_BACKTRACK, T_ATTRIBUTE, VESSELS,
} from './data'

type Pt = [number, number]
type LL = [number, number]

const clamp01 = (u: number) => Math.max(0, Math.min(1, u))
const stageP = (ms: number, [a, b]: [number, number]) => clamp01((ms - a) / (b - a))

/** legacy demo-scene coords -> real geography (matches the lat/lon labels used throughout) */
const ptToLL = ([x, y]: Pt): LL => [
  17 - ((y - 36) / 628) * 8,
  67 + ((x - 40) / 940) * 10,
]

const lerpLL = (a: LL, b: LL, f: number): LL => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]

function alongLL(pts: LL[], u: number): LL {
  const s = clamp01(u) * (pts.length - 1)
  const i = Math.min(Math.floor(s), pts.length - 2)
  return lerpLL(pts[i], pts[i + 1], s - i)
}

const TYPE_COLOR: Record<Vessel['type'], string> = {
  TANKER: '#c99a4a',
  CARGO: '#3aa0a0',
  FISHING: '#7fb069',
}

const SHAPE: Record<Vessel['type'], string> = {
  TANKER: '<svg viewBox="-8 -8 16 16"><path d="M0,-7.5 L6.5,5.5 L-6.5,5.5 Z"/></svg>',
  CARGO: '<svg viewBox="-8 -8 16 16"><rect x="-5.5" y="-5.5" width="11" height="11"/></svg>',
  FISHING: '<svg viewBox="-8 -8 16 16"><path d="M0,-6.5 L6.5,0 L0,6.5 L-6.5,0 Z"/></svg>',
}

const fmtLL = (ll: LL) => `${ll[0].toFixed(2)}°N ${ll[1].toFixed(2)}°E`

interface FixedLayers {
  slick: L.Polygon
  slickTip: L.Circle
  drift: L.Polyline
  tracers: L.CircleMarker[]
  originDot: L.Marker
  uncertain: L.Circle
  ring25: L.Circle
  ring50: L.Circle
  originTip: L.Marker
  suspectRing: L.Marker
}

interface VesselLayers {
  track: L.Polyline
  crumbs: L.CircleMarker[]
  leader: L.Polyline
  mark: L.Marker
}

export function TacticalMap({ elapsed, idle, highlightId }: { elapsed: number; idle: boolean; highlightId: string | null }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layRef = useRef<Partial<FixedLayers>>({})
  const vesRef = useRef<VesselLayers[]>([])
  const [cursor, setCursor] = useState<LL | null>(null)

  /* ---------- create map + all layers once ---------- */
  useEffect(() => {
    if (!boxRef.current || mapRef.current) return
    const map = L.map(boxRef.current, {
      center: [15.0, 65.0],
      zoom: 5,
      minZoom: 5,
      maxZoom: 8,
      maxBounds: L.latLngBounds([5.0, 53.5], [25.5, 77.0]),
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: false,
    })
    L.tileLayer('tiles/{z}/{x}_{y}.png', {
      minZoom: 5,
      maxZoom: 8,
      errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
    }).addTo(map)
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; OpenStreetMap contributors &copy; CARTO')
      .addTo(map)
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map)
    map.on('mousemove', (e: L.LeafletMouseEvent) => setCursor([e.latlng.lat, e.latlng.lng]))
    map.on('mouseout', () => setCursor(null))
    mapRef.current = map

    const slickLL = SLICK.map(ptToLL)
    const driftLL = DRIFT_PATH.map(ptToLL)
    const originLL = ptToLL(ORIGIN)
    const slickC = alongLL(slickLL, 0.5)

    /* stage 1 · detect */
    const slick = L.polygon(slickLL, {
      className: 'flow', color: '#cf6d6d', weight: 2,
      fillColor: '#3a464f', fillOpacity: 0, opacity: 0,
    }).addTo(map)
    const slickTip = L.circle(slickC, { radius: 1200, color: '#cf6d6d', weight: 1.2, fill: false, opacity: 0 })
      .bindTooltip('OIL SLICK · 14.7 KM² · CONF 0.87', { permanent: true, direction: 'right', className: 'tag tag-red', offset: [10, 0] })
      .addTo(map)

    /* stage 2 · backtrack */
    const drift = L.polyline(driftLL, {
      className: 'flow', color: '#c99a4a', weight: 2.4, opacity: 0, dashArray: '7 6',
    }).addTo(map)
    const tracers = Array.from({ length: 7 }, () =>
      L.circleMarker(driftLL[0], { radius: 3, color: '#c99a4a', fillColor: '#c99a4a', fillOpacity: 1, opacity: 0, weight: 0 }).addTo(map),
    )
    const originDot = L.marker(originLL, {
      icon: L.divIcon({ className: '', html: '<div class="origin-dot"><span></span></div>', iconSize: [12, 12], iconAnchor: [6, 6] }),
      opacity: 0,
    }).addTo(map)
    const uncertain = L.circle(originLL, {
      radius: 14000, color: '#c99a4a', weight: 1.2, dashArray: '6 5',
      fillColor: '#c99a4a', fillOpacity: 0.05, opacity: 0,
    }).addTo(map)
    const ring25 = L.circle(originLL, { radius: 25000, color: '#c99a4a', weight: 0.8, dashArray: '3 7', fill: false, opacity: 0 }).addTo(map)
    const ring50 = L.circle(originLL, { radius: 50000, color: '#c99a4a', weight: 0.8, dashArray: '3 7', fill: false, opacity: 0 }).addTo(map)
    const originTip = L.marker(originLL, { opacity: 0 })
      .bindTooltip(`EST. ORIGIN OF SPILL<br>${fmtLL(originLL)} · ±14 KM<br>SLICK AGE ≈ 9 H`, { permanent: true, direction: 'left', className: 'tag tag-amber', offset: [-12, 0] })
      .addTo(map)

    /* stage 3 · attribute */
    const vessels: VesselLayers[] = VESSELS.map((v, i) => {
      const trackLL = v.track.map(ptToLL)
      const col = TYPE_COLOR[v.type]
      const crumbs = trackLL.slice(1, -1).map(ll =>
        L.circleMarker(ll, { radius: 1.7, color: col, fillColor: col, fillOpacity: 0.65, weight: 0, opacity: 0 }).addTo(map),
      )
      const mark = L.marker(trackLL[0], {
        icon: L.divIcon({
          className: '',
          html: `<div class="vm ${v.type.toLowerCase()}" style="transform:rotate(${v.headingDeg}deg)">${SHAPE[v.type]}</div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        }),
        opacity: 0,
      })
        .bindTooltip(`${v.name} · P=${v.score.toFixed(2)}`, { permanent: true, direction: 'bottom', offset: [0, 10], className: `tag ${i === 0 ? 'tag-focus' : 'tag-dim'}` })
        .addTo(map)
      return {
        track: L.polyline(trackLL, { color: col, weight: i === 0 ? 2 : 1.4, opacity: 0 }).addTo(map),
        crumbs,
        leader: L.polyline([trackLL[0], trackLL[0]], { color: col, weight: 1.2, dashArray: '2 3', opacity: 0 }).addTo(map),
        mark,
      }
    })
    const suspectRing = L.marker(VESSELS[0].track.map(ptToLL)[0], {
      icon: L.divIcon({ className: '', html: '<div class="suspect-ring"></div>', iconSize: [36, 36], iconAnchor: [18, 18] }),
      opacity: 0,
    }).addTo(map)

    layRef.current = { slick, slickTip, drift, tracers, originDot, uncertain, ring25, ring50, originTip, suspectRing }
    vesRef.current = vessels

    return () => {
      map.remove()
      mapRef.current = null
      layRef.current = {}
      vesRef.current = []
    }
  }, [])

  /* ---------- drive every layer from elapsed ---------- */
  useEffect(() => {
    const vessels = vesRef.current
    const {
      slick, slickTip, drift, tracers, originDot,
      uncertain, ring25, ring50, originTip, suspectRing,
    } = layRef.current
    if (!slick || !slickTip || !drift || !tracers || !originDot ||
      !uncertain || !ring25 || !ring50 || !originTip || !suspectRing) return
    const detP = stageP(elapsed, T_DETECT)
    const btP = stageP(elapsed, T_BACKTRACK)
    const atP = stageP(elapsed, T_ATTRIBUTE)

    /* stage 1 */
    slick.setStyle({ fillOpacity: Math.min(0.8, detP * 1.6) * 0.85, opacity: detP > 0 ? 0.95 : 0 })
    slickTip.setStyle({ opacity: detP > 0.55 ? 0.9 : 0 })
    if (detP >= 0.75 && !slickTip.isTooltipOpen()) slickTip.openTooltip()
    if (detP < 0.75 && slickTip.isTooltipOpen()) slickTip.closeTooltip()

    /* stage 2 */
    const driftLL = DRIFT_PATH.map(ptToLL)
    drift.setStyle({ opacity: btP > 0 ? 0.9 : 0 })
    tracers.forEach((c, k) => {
      const u = (((btP * 1.8 - k * 0.11) % 1) + 1) % 1
      c.setLatLng(alongLL(driftLL, u))
      c.setStyle({ opacity: btP > 0 ? Math.max(0.25, 1 - atP) * 0.9 : 0 })
    })
    originDot.setOpacity(btP > 0.5 ? 1 : 0)
    uncertain.setStyle({ opacity: btP > 0.5 ? 0.8 : 0 })
    const showRings = btP >= 0.92
    ring25.setStyle({ opacity: showRings ? 0.32 : 0 })
    ring50.setStyle({ opacity: showRings ? 0.2 : 0 })
    if (showRings && !originTip.isTooltipOpen()) originTip.openTooltip()
    if (!showRings && originTip.isTooltipOpen()) originTip.closeTooltip()

    /* stage 3 */
    VESSELS.forEach((v, i) => {
      const vl = vessels[i]
      if (!vl) return
      const vP = clamp01(atP * 6 - i * 1.05)
      const focused = highlightId === v.id
      const dimmed = highlightId !== null && !focused
      const baseOp = Math.min(1, vP * 1.6) * (dimmed ? 0.14 : focused ? 1 : 0.92)
      const pos = alongLL(v.track.map(ptToLL), vP)

      vl.track.setStyle({ opacity: baseOp * (i === 0 ? 0.85 : focused ? 1 : 0.5) })
      vl.crumbs.forEach((c, j) => {
        c.setStyle({ opacity: vP > (j + 1) / (v.track.length - 1) ? 0.65 * baseOp : 0 })
      })
      if (vP > 0.85 && !dimmed) {
        const rad = (v.headingDeg * Math.PI) / 180
        const dKm = 14 + v.score * 14
        const head: LL = [
          pos[0] + (dKm * Math.cos(rad)) / 111,
          pos[1] + (dKm * Math.sin(rad)) / (111 * Math.cos((pos[0] * Math.PI) / 180)),
        ]
        vl.leader.setLatLngs([pos, head])
        vl.leader.setStyle({ opacity: 0.8 * baseOp })
      } else {
        vl.leader.setStyle({ opacity: 0 })
      }
      vl.mark.setLatLng(pos)
      vl.mark.setOpacity(vP > 0 ? baseOp : 0)
      vl.mark.setTooltipContent(`${v.name} · P=${v.score.toFixed(2)}${focused ? ' ◂' : ''}`)
      const wantTip = vP > (focused ? 0.4 : 0.75) && baseOp > 0.3
      if (wantTip && !(i === 0 && !focused && atP <= 0.55)) {
        if (!vl.mark.isTooltipOpen()) vl.mark.openTooltip()
      } else if (vl.mark.isTooltipOpen()) {
        vl.mark.closeTooltip()
      }
      if (i === 0) {
        const showRing = atP > 0.55 && (!highlightId || focused)
        suspectRing.setLatLng(pos)
        suspectRing.setOpacity(showRing ? 0.95 : 0)
      }
    })
  }, [elapsed, highlightId])

  return (
    <div className="mapwrap">
      <div ref={boxRef} className="leaflet-box" />
      {cursor && <div className="cursor-readout">▸ CURSOR {fmtLL(cursor)}</div>}
      <div className="map-legend">
        <div className="ml-title">CONTACT LEGEND</div>
        {(Object.keys(TYPE_COLOR) as Vessel['type'][]).map(t => (
          <div key={t} className="ml-row">
            <span className={`vm ${t.toLowerCase()}`} dangerouslySetInnerHTML={{ __html: SHAPE[t] }} />
            {t}
          </div>
        ))}
      </div>
      {idle && (
        <div className="map-idle">
          <div className="mi-main">◉ DEMO READY — PRESS RUN ANALYSIS</div>
          <div className="mi-sub">Watch AI find an oil spill from space, trace where it came from, and name the ship responsible.</div>
        </div>
      )}
    </div>
  )
}
