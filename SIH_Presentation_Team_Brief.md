# SIH Problem 26143: Oil Spill Detection & Vessel Attribution
## Presentation Team Brief

---

## The Problem (2 Slides)

**What**: Oil spills at sea go unattributed. We don't know who did it.

**Why it matters**: 
- Thousands of tonnes spilled yearly
- Most polluters escape accountability
- Current investigation takes weeks to months
- Manual satellite analysis + manual AIS correlation = slow, expensive

**Current gap**: 
- Satellite imagery exists but isn't connected to ship tracking data
- No automated system links detection to attribution

---

## Our Solution (2 Slides)

**The idea**: Automated pipeline that detects oil spills from satellite → traces them backward to find origin point → matches that point with ship locations to identify the culprit.

**Three stages**:

1. **Detection**: AI model identifies oil slick from satellite imagery
   - Input: Sentinel-1 satellite data (free, public)
   - Output: Spill location, size, intensity
   - Time: ~2 minutes

2. **Backtracking**: Ocean physics simulates the spill backward in time
   - Input: Wind data, ocean current data (free, public)
   - Output: Where the spill started (origin point + time)
   - Time: ~30 minutes

3. **Attribution**: Match origin point with ship tracking data
   - Input: AIS vessel positions (free, public)
   - Output: Ranked list of suspect ships with confidence scores
   - Time: ~5 minutes

**Total time**: Under 1 hour (vs. current 40-80 days)

---

## Why This Works

**All proven technology**:
- ESA already detects oil spills with SAR imagery
- Oceanographers use drift models for decades
- Companies like MarineTraffic already track ships via AIS
- We're just connecting them automatically

**All free/public data**:
- Satellite imagery: Zenodo dataset + Sentinel-1
- Ocean data: NOAA forecasts
- Ship data: Marine Cadastre AIS database

**Expected accuracy**: 75-80% detection, top-3 suspect ranking 80% accurate

---

## Technical Approach (1-2 Slides)

**Detection model**: U-Net (semantic segmentation)
- Trained on ~70 labeled satellite images
- Detects oil boundaries in satellite photos

**Drift model**: Lagrangian particle advection
- Standard oceanography method
- Runs ocean currents + wind backward in time

**Attribution scoring**: Bayesian ranking
- Scores vessels by: proximity, trajectory, speed anomalies, vessel type
- Explainable (judges can understand why rank #1 is ranked #1)

**Tech stack**: PyTorch, Python, PostgreSQL, Streamlit (all standard, open-source)

---

## Impact & Benefits (1 Slide)

**For government**: 
- Reduces investigation time from weeks to hours
- Automates correlation between satellite and AIS data
- Enables prosecution with evidence

**For environment**: 
- Faster response to spills
- Deters future incidents (polluters know they'll be caught)

**Scale**: Works globally (same algorithm, all oceans)

---

## Key Numbers to Mention

- **3-4 million** tonnes of oil spilled annually
- **40-80 days** current investigation time
- **<1 hour** our system's time
- **80%** reduction in investigation burden
- **₹50+ lakhs** current cost per investigation
- **75-80%** expected detection accuracy
- **80%** top-3 suspect ranking accuracy

---

## What You Need to Know for Q&A

**Why satellite + ocean data + AIS?**
- Only way to connect detection to attribution
- Each data stream exists but is never combined

**What if weather blocks satellite?**
- SAR (radar) works through clouds
- And vessel tracking via AIS still works regardless

**What if ships turn off AIS?**
- SAR still detects the spill
- We can use port movements + historical patterns to narrow suspects
- Confidence drops but tracking still possible

**Timeline to build?**
- MVP: 8-12 weeks
- Full system: 3-4 months

**Who will actually use this?**
- NTRO (maritime surveillance)
- Coast Guard (spill response)
- International maritime authorities

---

## Slide Structure (Official SIH Format - 6 slides max)

**Slide 1**: Title + problem ID + team info

**Slide 2**: Problem statement
- What's happening: Oil spills unattributed
- Why it matters: Scale + impact
- What's missing: Connected data system

**Slide 3**: Proposed solution
- Flowchart: Detect → Trace → Identify
- Simple visual showing 3 stages
- Output: Ranked suspect list

**Slide 4**: Technical approach
- Architecture diagram (visual, not text-heavy)
- Key technologies used + why
- Data sources we're using

**Slide 5**: Impact & benefits
- Time/cost reduction numbers
- Who benefits (govt, environment, accountability)
- Scalability

**Slide 6**: Research & references
- 3-5 key papers on oil detection / drift modeling / vessel tracking
- Data sources (Zenodo, NOAA, Marine Cadastre)
- Similar projects proving feasibility (ESA, OceanParcels)

---

## Delivery Notes

**Opening (30 seconds)**:
"We're solving problem 26143. Oil spills happen. We don't know who did it. Our system automatically connects satellite detection to vessel tracking to prove guilt. Faster, cheaper, accountable."

**Tone**: 
- Technical but not jargon-heavy
- Confident (this is solvable)
- Impact-focused (this matters)

**Avoid**:
- Claiming 99% accuracy
- Over-explaining technical details
- Reading from slides
- Making excuses about not having code

**Timing**: 7-9 minutes talking + 2-3 min Q&A

---

## Simple Q&A Answers

**Q: Is this realistic?**  
A: "Yes. ESA detects spills. OceanParcels models drift. MarineTraffic tracks ships. We're automating all three together."

**Q: What if your model fails?**  
A: "We validate against past incidents. Uncertainty is built in. If detection is ±20km, we cast wider net for suspects."

**Q: How will maritime authorities use this?**  
A: "Same data they use now. We just automate the analysis. They get results in hours instead of days."

**Q: What about false positives?**  
A: "Precision over recall. Better to miss a tiny spill than falsely accuse a ship."

---

## Presentation Day Checklist

- [ ] Slides follow official SIH template
- [ ] No spelling errors
- [ ] All 6 slides have clear visuals (not text walls)
- [ ] Font size readable (18pt minimum)
- [ ] Practiced delivery 5+ times
- [ ] Can answer the Q&A above without reading notes
- [ ] Assigned backup speaker for each slide
- [ ] Dressed professionally
- [ ] PDF exported (not PowerPoint)
- [ ] Submitted by deadline

---

That's it. You know what to say. Build the slides. Practice. Done.
