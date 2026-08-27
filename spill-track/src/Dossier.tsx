import { VESSELS, ORIGIN_LABEL, SLICK_LABEL, SOURCES } from './data'

const REF = 'SD-2025-26143-A'

export function Dossier({ onClose }: { onClose: () => void }) {
  const primary = VESSELS[0]
  return (
    <div className="dossier">
      <div className="ds-actions no-print">
        <button className="ds-btn" onClick={() => window.print()}>🖨 PRINT / PDF</button>
        <button className="ds-btn ds-close" onClick={onClose}>✕ CLOSE</button>
      </div>

      <div className="ds-page">
        <div className="ds-class">DEMONSTRATION // SYNTHETIC DATA // FOR PROPOSAL REVIEW</div>

        <header className="ds-head">
          <div>
            <h1>SPILL TRACK</h1>
            <p>MARITIME INCIDENT DOSSIER — AUTOMATED SPILL DETECTION &amp; VESSEL ATTRIBUTION</p>
          </div>
          <table className="ds-meta">
            <tbody>
              <tr><th>REFERENCE</th><td>{REF}</td></tr>
              <tr><th>PROBLEM ID</th><td>26143 · NTRO</td></tr>
              <tr><th>DATE</th><td>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
              <tr><th>REGION</th><td>Arabian Sea</td></tr>
            </tbody>
          </table>
        </header>

        <section>
          <h2>1. SUMMARY</h2>
          <p>
            A dark slick consistent with mineral oil was detected in Sentinel-1 SAR imagery over the
            Arabian Sea at {SLICK_LABEL}. Backward drift simulation of wind and current records traces the
            spill to an origin near <b>{ORIGIN_LABEL}</b>, approximately nine hours before imaging.
            Correlation of this origin with AIS vessel traffic yields {primary.name} as the primary suspect
            with a likelihood of {Math.round(primary.score * 100)}%.
          </p>
        </section>

        <section>
          <h2>2. DETECTION</h2>
          <table className="ds-table">
            <tbody>
              <tr><th>Sensor</th><td>Sentinel-1 C-band SAR (ESA Copernicus) ·VV+VH·</td></tr>
              <tr><th>Method</th><td>U-Net semantic segmentation (PyTorch), trained on labelled Zenodo SAR scenes</td></tr>
              <tr><th>Slick centroid</th><td>{SLICK_LABEL}</td></tr>
              <tr><th>Slick area / perimeter</th><td>14.7 km² / 21.3 km</td></tr>
              <tr><th>Detection confidence</th><td>0.87 · boundary accuracy (IoU) 0.78 vs expert annotation</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>3. DRIFT BACK-TRACK</h2>
          <table className="ds-table">
            <tbody>
              <tr><th>Inputs</th><td>ERA5 10 m winds + NOAA/OSCAR surface currents, t−6 h → t₀</td></tr>
              <tr><th>Method</th><td>Lagrangian particle back-advection, 512 tracers, Δt = −10 min</td></tr>
              <tr><th>Estimated origin</th><td>{ORIGIN_LABEL} · uncertainty ±14 km · slick age ≈ 9 h</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>4. SUSPECT VESSEL RANKING</h2>
          <p className="ds-note">AIS window ±4 h · radius 50 km of estimated origin. Weighted scoring:
            proximity 0.30 · trajectory 0.25 · speed anomaly 0.20 · vessel type 0.15 · history 0.10.</p>
          <table className="ds-table ds-suspects">
            <thead>
              <tr><th>#</th><th>Vessel</th><th>Type</th><th>Flag / IMO</th><th>Likelihood</th><th>Primary evidence</th></tr>
            </thead>
            <tbody>
              {VESSELS.map((v, i) => (
                <tr key={v.id} className={i === 0 ? 'primary-row' : ''}>
                  <td>{i + 1}</td>
                  <td>{v.name}{i === 0 ? ' ★' : ''}</td>
                  <td>{v.type}</td>
                  <td>{v.flag} · {v.imo.replace('IMO ', '')}</td>
                  <td>{Math.round(v.score * 100)}%</td>
                  <td>{v.reasons[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ds-note">Vessels ranked 3–4 are considered low likelihood; manual review is recommended
            for the top two only.</p>
        </section>

        <section>
          <h2>5. DATA &amp; METHODS</h2>
          <ul className="ds-src">
            {SOURCES.map(s => <li key={s.k}><b>{s.k}</b> — {s.v}</li>)}
          </ul>
        </section>

        <footer className="ds-foot">
          <div>
            Prepared by<br /><b>SPILL TRACK automated pipeline v2.4</b><br />
            Machine-generated; subject to analyst verification.
          </div>
          <div className="ds-sign">
            Reviewed by (signature)<br />
            <span />
          </div>
        </footer>

        <div className="ds-class">DEMONSTRATION // SYNTHETIC DATA // FOR PROPOSAL REVIEW</div>
      </div>
    </div>
  )
}
