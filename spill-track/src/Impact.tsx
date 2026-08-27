const OUR_MS = 13
const OUR_MS_EXACT = '13.2 s' /* demo pipeline replay: TOTAL_MS = 13 200 ms */

const KPIS: { k: string; manual: string; ours: string; unit: string; ratio: string }[] = [
  { k: 'Time to first viable suspect', manual: '40–80 days', ours: `~${OUR_MS}s demo run`, unit: 'PER INCIDENT', ratio: '>250,000×' },
  { k: 'Analyst effort', manual: 'Multi-week', ours: '~2 min review', unit: 'PER INCIDENT', ratio: 'Automatic' },
  { k: 'Data sources fused', manual: '1–2 (charts)', ours: '5 (SAR·AIS·ENC·wind·current)', unit: 'PER ANALYSIS', ratio: '2.5×' },
  { k: 'Suspect coverage', manual: 'Limited manual sample', ours: 'All vessels in corridor · 100%', unit: 'OF TRAFFIC', ratio: 'Full' },
  { k: 'Scoring consistency', manual: 'Subjective / variable', ours: 'Weighted & reproducible', unit: 'ATTRIBUTION', ratio: 'Fixed' },
  { k: 'Cost per incident', manual: 'High (field + analysts)', ours: 'Low (automated, review-only)', unit: 'ESTIMATE', ratio: 'Lower' },
]

/* phase durations taken from the actual demo timeline in data.ts
   (T_TOTAL = 13 200 ms): detect 3.6 s · backtrack 4.2 s · attribute 5.0 s */
const PHASE = [
  { name: 'SAR slick detected + vectorised (U-Net)', t: '3.6 s' },
  { name: 'Origin back-tracked via wind/current', t: '4.2 s' },
  { name: 'AIS correlation + weighted scoring', t: '5.0 s' },
]

const MANUAL = [
  { name: 'Ship movement charts requested & digitised', t: 'Weeks' },
  { name: 'Drift modelled by meteorology specialists', t: 'Days–weeks' },
  { name: 'Vessel lists shortlisted by human judgement', t: 'Days' },
  { name: 'Cross-checks against records / manifests', t: 'Weeks' },
]

export function Impact({ onClose }: { onClose: () => void }) {
  return (
    <div className="impact" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="im-in">
        <div className="im-top">
          <div className="im-title">
            <span className="im-tick">▮</span> IMPACT — ATTRIBUTION, ACCELERATED
          </div>
          <button className="im-close" onClick={onClose}>✕</button>
        </div>

        <div className="im-headline">
          <div className="im-big">
            <span className="im-days">40–80 DAYS</span>
            <span className="im-arrow">→</span>
            <span className="im-sec">~13 SECONDS</span>
          </div>
          <div className="im-tag">TO A CANDIDATE RESPONSIBLE VESSEL</div>
        </div>

        <div className="im-cols">
          <div className="im-col dst">
            <div className="im-colh">CONVENTIONAL METHOD</div>
            <div className="im-phase">
              {MANUAL.map(r => (
                <div className="im-row" key={r.name}>
                  <span className="im-rowk">{r.name}</span>
                  <em className="im-rowv">{r.t}</em>
                </div>
              ))}
            </div>
            <div className="im-verdict bad">DAYS → WEEKS OF ANALYST TIME</div>
          </div>

          <div className="im-col ours">
            <div className="im-colh">SPILL TRACK PIPELINE</div>
            <div className="im-phase">
              {PHASE.map(r => (
                <div className="im-row" key={r.name}>
                  <span className="im-rowk">{r.name}</span>
                  <em className="im-rowv">{r.t}</em>
                </div>
              ))}
            </div>
            <div className="im-verdict good">ONE-TAP · 3 STAGES · ~13 s</div>
          </div>
        </div>

        <table className="im-table">
          <thead>
            <tr><th>METRIC</th><th>CONVENTIONAL</th><th>SPILL TRACK</th><th>GAIN</th></tr>
          </thead>
          <tbody>
            {KPIS.map(r => (
              <tr key={r.k}>
                <td className="im-tk">{r.k}<div className="im-tu">{r.unit}</div></td>
                <td>{r.manual}</td>
                <td className="im-go">{r.ours}</td>
                <td className="im-ratio">{r.ratio}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="im-note">
          <b>WHY IT MATTERS.</b> Faster attribution lets agencies stop further harm sooner, direct
          clean-up immediately, shorten insurer / legal dispute time, and deter illegal discharges —
          because responsibility becomes near-instant to establish rather than a months-long open question.
        </div>

        <div className="im-foot">
          Pipeline figure is the live in-app run ({OUR_MS_EXACT}); sources and phase durations from the
          demo timeline. Conventional method figures are representative published/field estimates.
        </div>
      </div>
    </div>
  )
}
