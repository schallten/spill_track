// Downloads CartoDB DarkMatter (OSM-based) tiles covering the demo region
// into public/tiles/ so the map works fully offline during judging.
// Region: Arabian Sea west of Karnataka/Kerala  ·  z6-8  ·  bbox padded.
const LATS = { top: 18.5, bottom: 7.5 }
const LONS = { west: 64.5, east: 76.5 }
const ZOOMS = [6, 7, 8]
const OUT = 'public/tiles'

const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z)
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z)
}

let n = 0
for (const z of ZOOMS) {
  for (let x = lon2x(LONS.west, z); x <= lon2x(LONS.east, z); x++) {
    for (let y = lat2y(LATS.top, z); y <= lat2y(LATS.bottom, z); y++) {
      const { mkdirSync, existsSync } = await import('node:fs')
      const dir = `${OUT}/${z}`
      const file = `${dir}/${x}_${y}.png`
      mkdirSync(dir, { recursive: true })
      if (existsSync(file)) continue
      const url = `https://basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`
      const res = await fetch(url)
      if (!res.ok) { console.error('FAIL', url, res.status); continue }
      const { writeFileSync } = await import('node:fs')
      writeFileSync(file, Buffer.from(await res.arrayBuffer()))
      n++
      if (n % 25 === 0) console.log('…', n, 'tiles')
      await new Promise(r => setTimeout(r, 40))
    }
  }
}
console.log('done —', n, 'new tiles cached')
