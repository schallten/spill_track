# Oil Spill Technical Approach Slide: ASCII Visual Layout

## 📐 EXACT SLIDE LAYOUT (Scale View)

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                        TECHNICAL APPROACH                                    ║
║                                                                              ║
╠════════════════════════════════════╦════════════════════════════════════════╣
║                                    ║                                        ║
║  OIL SPILL INTELLIGENCE PIPELINE   ║      TECHNOLOGY STACK                 ║
║                                    ║                                        ║
║  ┌─ MODULE 1: DETECTION ──┐       ║                                        ║
║  │                        │       ║         ┌──────────────┐               ║
║  │  🛰️  SAR Data Input     │       ║         │  Streamlit/  │               ║
║  │       ↓                 │       ║         │  Folium      │               ║
║  │  🔧  Preprocessing      │       ║         └──────────────┘               ║
║  │       ↓                 │       ║                                        ║
║  │  🧠  U-Net Model        │       ║      ┌────────────┐  ┌─────────────┐  ║
║  │       ↓                 │       ║      │ PyTorch/   │  │Flask/FastAPI│  ║
║  │  📍  Detect Oil Slick   │       ║      │ GDAL       │  │             │  ║
║  │       ↓                 │       ║      └────────────┘  └─────────────┘  ║
║  │  📊  Calculate Metrics  │       ║                                        ║
║  │       ↓                 │       ║      ┌────────────┐  ┌─────────────┐  ║
║  │  🖼️  Visualize Result   │       ║      │ Pandas/    │  │ PostGIS/    │  ║
║  │                        │       ║      │ NumPy      │  │ Database    │  ║
║  └────────────────────────┘       ║      └────────────┘  └─────────────┘  ║
║                                    ║                                        ║
║  ┌─ MODULE 2: BACKTRACKING ─┐     ║         ┌──────────────┐               ║
║  │                          │     ║         │Docker/Deploy │               ║
║  │  📍  Spill Position       │     ║         └──────────────┘               ║
║  │       ↓                   │     ║                                        ║
║  │  🌊  Fetch Ocean Data     │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  ⚙️   Apply Drift Model    │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  ⏮️   Backtrack in Time    │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  🎯  Estimate Origin      │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  🗺️   Show Drift Path     │     ║                                        ║
║  │                          │     ║                                        ║
║  └──────────────────────────┘     ║                                        ║
║                                    ║                                        ║
║  ┌─ MODULE 3: ATTRIBUTION ──┐     ║                                        ║
║  │                          │     ║                                        ║
║  │  📌  Spill Origin Data    │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  🗄️   Query AIS Database  │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  🚢  Get Nearby Vessels   │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  📈  Analyze Trajectories │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  ⭐  Calculate Score      │     ║                                        ║
║  │       ↓                   │     ║                                        ║
║  │  🏆  Rank Suspects        │     ║                                        ║
║  │                          │     ║                                        ║
║  └──────────────────────────┘     ║                                        ║
║                                    ║                                        ║
╠════════════════════════════════════╩════════════════════════════════════════╣
║                                                                              ║
║            CORE CAPABILITIES                                                ║
║                                                                              ║
║    ┌─────────────────────┬──────────────────┬────────────────────┐         ║
║    │ SATELLITE           │ OCEAN            │ MARITIME           │         ║
║    │ INTELLIGENCE        │ PHYSICS          │ ATTRIBUTION        │         ║
║    │                     │                  │                    │         ║
║    │ ✓ Detect Spills    │ ✓ Drift Model    │ ✓ AIS Tracking     │         ║
║    │ ✓ Measure Area      │ ✓ Backtrack      │ ✓ Score Vessels    │         ║
║    │ ✓ High Accuracy     │ ✓ Predict Drift  │ ✓ Rank Suspects    │         ║
║    │                     │                  │                    │         ║
║    └─────────────────────┴──────────────────┴────────────────────┘         ║
║                                                                              ║
║  @SIH Idea Submission 2024-25 | Oil Spill Detection (Problem 26143) | Page 5║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 🎨 COLOR PALETTE SUGGESTION

```
DARK BLUE (Headers, Title):      #003d99
LIGHT GRAY (Module Boxes):       #f5f5f5
LIGHT BLUE (Borders, Lines):     #0066cc
OCEAN BLUE (Pillars):            #004d99
TEXT (Dark):                     #1a1a1a
TEXT (Light):                    #666666
ACCENT (Highlight):              #ff6b6b (for suspicious matches)
```

---

## 📐 PROPORTIONS & DIMENSIONS

### **Standard 16:9 Slide (1920px × 1080px)**

```
Title Area:              Top 60px (4% of slide)
                         Background: Dark navy

Left Content Area:       40% width × 100% height
                         Module 1: 33% of left height
                         Module 2: 33% of left height
                         Module 3: 33% of left height

Bottom Pillar Area:      100% width × 20% height
                         3 equal pillars (33% each)

Right Tech Stack Area:   35% width × 80% height
                         Center-aligned hexagons
                         6 hexagons in 3×2 grid

Footer:                  Bottom 30px (3% of slide)
                         Gray text, right-aligned
```

---

## 🔤 TYPOGRAPHY SPECS

### **Title**
```
Text: "TECHNICAL APPROACH"
Font: Bold Sans-serif (Helvetica, Arial, Segoe)
Size: 36-40pt
Color: #003d99 (dark blue) or #1a1a1a (dark gray)
Position: Top center, 15px from top edge
```

### **Section Headers** (Left, Bottom, Right)
```
Font: Semi-bold Sans-serif
Size: 18-20pt
Color: #003d99
Position: Above each section
Example: "OIL SPILL INTELLIGENCE PIPELINE"
         "CORE CAPABILITIES"
         "TECHNOLOGY STACK"
```

### **Module Box Labels**
```
Font: Regular Sans-serif
Size: 12-14pt
Color: #1a1a1a
Position: Centered in box
Examples: "SAR Data Input", "Preprocessing", etc.
```

### **Pillar Section Labels**
```
Font: Semi-bold Sans-serif
Size: 14-16pt
Color: White (on colored pillar background)
Position: Top of pillar
Examples: "SATELLITE INTELLIGENCE", "OCEAN PHYSICS", etc.
```

### **Tech Stack Labels**
```
Font: Regular Sans-serif
Size: 12pt
Color: White (on colored hexagon)
Position: Center of hexagon
Examples: "PyTorch", "GDAL", "Flask", etc.
```

### **Footer Text**
```
Font: Light Sans-serif
Size: 10pt
Color: #999999 (light gray)
Position: Bottom right, 10px from edge
Example: "@SIH Idea Submission | Problem 26143 | Page 5"
```

---

## 🎯 BOX STYLING

### **Module Flow Boxes**

```
Size:           ~150px width × 50px height
Background:     #f5f5f5 (light gray)
Border:         2px solid #0066cc (light blue)
Border-radius:  8px (slightly rounded)
Text alignment: Center
Shadow:         Light drop shadow (optional)
Icon size:      20-24px
Icon position:  Left of text, 5px padding
```

### **Connecting Arrows**

```
Style:          Solid line
Color:          #0066cc (light blue)
Weight:         2-3px
Direction:      Downward (↓)
Spacing:        ~10px between box and arrow
Position:       Centered below each box
```

### **Pillar Boxes (Bottom)**

```
Size:           ~33% width × 150px height
Background:     #004d99 (ocean blue) with gradient
Border:         1px solid #003d99
Border-radius:  0 (sharp corners for professional look)
Text color:     White
Icon size:      24-28px
Icon color:     White/Light

Alternative:   Use different shades for each pillar
               Pillar 1: #003d99 (darker)
               Pillar 2: #0066cc (medium)
               Pillar 3: #0088ff (lighter)
```

### **Hexagon (Tech Stack)**

```
Size:           120-140px width
Shape:          Regular hexagon
Background:     #003d99 (dark blue)
Border:         None
Text color:     White
Font:           Bold, centered
Spacing:        15-20px between hexagons
Arrangement:    3 rows × 2 columns (or circular)
Shadow:         Subtle drop shadow
```

---

## 📊 SPACING GRID

```
All measurements relative to slide dimensions (1920×1080):

Margin from edges:       40px (2% of width)
Gutter between columns:  30px
Line height in boxes:    1.4
Padding inside boxes:    10px
Gap between modules:     20px
Gap between sections:    25px
```

---

## ✏️ DETAILED CONTENT FOR EACH BOX

### **MODULE 1: OIL SPILL DETECTION**

```
Box 1:
  Icon:  🛰️
  Label: SAR Data Input
  Color: #f5f5f5
  Note:  Sentinel-1 imagery ingestion

Box 2:
  Icon:  🔧
  Label: Preprocessing
  Color: #f5f5f5
  Note:  Calibration & noise filtering

Box 3:
  Icon:  🧠
  Label: AI Model
  Color: #f5f5f5
  Note:  U-Net semantic segmentation

Box 4:
  Icon:  📍
  Label: Detect Slick
  Color: #f5f5f5
  Note:  Boundary extraction & analysis

Box 5:
  Icon:  📊
  Label: Calculate Metrics
  Color: #f5f5f5
  Note:  Area, perimeter, intensity

Box 6:
  Icon:  🖼️
  Label: Visualize Result
  Color: #f5f5f5
  Note:  Before/after overlay display
```

### **MODULE 2: DRIFT BACKTRACKING**

```
Box 1:
  Icon:  📍
  Label: Spill Position
  Color: #f5f5f5
  Note:  Current detected location

Box 2:
  Icon:  🌊
  Label: Fetch Ocean Data
  Color: #f5f5f5
  Note:  NOAA GFS, ERA5 winds/currents

Box 3:
  Icon:  ⚙️
  Label: Drift Model
  Color: #f5f5f5
  Note:  Lagrangian particle tracking

Box 4:
  Icon:  ⏮️
  Label: Backtrack Time
  Color: #f5f5f5
  Note:  Run physics backwards

Box 5:
  Icon:  🎯
  Label: Estimate Origin
  Color: #f5f5f5
  Note:  Location & time ± uncertainty

Box 6:
  Icon:  🗺️
  Label: Show Drift Path
  Color: #f5f5f5
  Note:  Animated trajectory visualization
```

### **MODULE 3: VESSEL ATTRIBUTION**

```
Box 1:
  Icon:  📌
  Label: Spill Origin Data
  Color: #f5f5f5
  Note:  Input from backtracking module

Box 2:
  Icon:  🗄️
  Label: Query AIS Database
  Color: #f5f5f5
  Note:  ±4 hours, ±50km radius

Box 3:
  Icon:  🚢
  Label: Get Nearby Vessels
  Color: #f5f5f5
  Note:  Filter by type and location

Box 4:
  Icon:  📈
  Label: Analyze Trajectories
  Color: #f5f5f5
  Note:  Heading, speed, direction

Box 5:
  Icon:  ⭐
  Label: Calculate Score
  Color: #f5f5f5
  Note:  Bayesian ranking algorithm

Box 6:
  Icon:  🏆
  Label: Rank Suspects
  Color: #f5f5f5
  Note:  Top-N list with confidence scores
```

### **BOTTOM PILLARS**

```
Pillar 1: SATELLITE INTELLIGENCE
  Background:    #003d99 → #0055cc (gradient)
  Text Color:    White
  Content:
    ✓ Sentinel-1 SAR Detection
    ✓ Spill Location & Area
    ✓ Metrics Calculation
    ✓ High Accuracy (87%+)

Pillar 2: OCEAN PHYSICS
  Background:    #0066cc → #0077dd (gradient)
  Text Color:    White
  Content:
    ✓ Drift Backtracking
    ✓ Origin Identification
    ✓ Physics-Based Model
    ✓ Time Estimation

Pillar 3: MARITIME ATTRIBUTION
  Background:    #0077dd → #0088ff (gradient)
  Text Color:    White
  Content:
    ✓ AIS Vessel Tracking
    ✓ Suspect Ranking
    ✓ Confidence Scoring
    ✓ Multi-Factor Analysis
```

### **TECH STACK HEXAGONS**

```
Hexagon 1:
  Position:  Top center
  Label:     "Streamlit/Folium"
  Subtitle:  "Frontend & Visualization"

Hexagon 2:
  Position:  Left middle
  Label:     "PyTorch/GDAL"
  Subtitle:  "ML & Geospatial"

Hexagon 3:
  Position:  Right middle
  Label:     "Flask/FastAPI"
  Subtitle:  "Backend API"

Hexagon 4:
  Position:  Left bottom
  Label:     "Pandas/NumPy"
  Subtitle:  "Data Processing"

Hexagon 5:
  Position:  Right bottom
  Label:     "PostGIS"
  Subtitle:  "Spatial Database"

Hexagon 6:
  Position:  Bottom center
  Label:     "Docker"
  Subtitle:  "Deployment"
```

---

## 🖨️ PRINT SPECIFICATIONS

```
Format:         16:9 widescreen
Resolution:     1920×1080 pixels (native)
                300 DPI for printing
DPI Export:     96 DPI (for screen)
File Format:    PDF (for presentation)
                PNG/JPEG (for print)

Color Mode:     RGB (screen)
                CMYK (print)

Fonts:          Embed all fonts in PDF
                Use system-safe fonts (Arial, Helvetica, Segoe)
```

---

## 🎬 ANIMATION SUGGESTIONS (If using PowerPoint)

```
Title:          Fade in (0.5 sec)
Left Modules:   Appear one module at a time (2 sec each)
                Each box cascades with arrows (0.3 sec delay)
Bottom Pillars: Slide in from bottom (1 sec)
Right Stack:    Hexagons appear in sequence (0.5 sec each)
Footer:         Fade in last (0.3 sec)

Total animation time:  ~15-20 seconds
Best for:       Live presentation (not needed)
Judges prefer:  No animation (too slow, distracting)
Recommendation: Static slide (judges want to read, not watch)
```

---

## ✅ FINAL QUALITY CHECKLIST

### **Visual Clarity**
- [ ] All text readable from 15 feet away
- [ ] Icons are clear and distinguishable
- [ ] Colors have sufficient contrast
- [ ] No overlapping elements
- [ ] Consistent spacing throughout

### **Content Accuracy**
- [ ] All 3 modules clearly visible
- [ ] All 6 boxes per module present
- [ ] All arrows pointing correct direction
- [ ] All pillar names correct
- [ ] All tech stack items listed
- [ ] No typos or grammar errors

### **Professional Appearance**
- [ ] Matches presentation theme
- [ ] Font sizes proportional
- [ ] Colors coordinated
- [ ] Whitespace balanced
- [ ] Borders/lines consistent
- [ ] Icons match style

### **Judge Appeal**
- [ ] Shows technical sophistication
- [ ] Three-pillar integration visible
- [ ] Tech stack impressive but realistic
- [ ] Solution looks implementable
- [ ] Problem solution is clear

---

## 🚀 PRODUCTION TIMELINE

```
Hour 1:    Choose design tool (PowerPoint/Figma/Adobe)
Hour 2:    Create base slide layout (40-35-20 proportions)
Hour 3:    Add title, section headers, footer
Hour 4:    Place module boxes with icons (3 modules × 6 boxes)
Hour 5:    Add connecting arrows and flows
Hour 6:    Create/place pillar sections
Hour 7:    Create/place tech stack hexagons
Hour 8:    Color scheme and styling
Hour 9:    Typography refinement
Hour 10:   Final review and polish

Total Time: ~10 hours for professional result
Realistic:  2-3 hours if reusing FitFusion template

Difficulty Level: ⭐⭐⭐ (Medium - mostly design work)
```

---

**This is your complete blueprint. Build it, review it, present it.** 🎯
