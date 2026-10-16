'use client'

import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import {
  Activity,
  AlertTriangle,
  Camera,
  Car,
  Eye,
  Gauge,
  History,
  Image as ImageIcon,
  ScanLine,
  SlidersHorizontal,
  Upload,
  Users,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Building2,
  Check,
  ChevronRight,
  CircleDot,
  Cloud,
  Cpu,
  Droplets,
  Leaf,
  Lightbulb,
  Map,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Play,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Ticket,
  Thermometer,
  Trees,
  Waves,
  Zap,
} from 'lucide-react'

const mapSource = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-figxeYzssQabzJ66szEO2hnOXPtmmN.png'

type Status = 'normal' | 'warning' | 'critical'
type Building = { id: string; name: string; short: string; x: number; y: number; status: Status; energy: number; water: number; occupancy: number; score: number }

const initialBuildings: Building[] = [
  { id: 'main', name: 'Main Academic Block', short: 'MAIN', x: 46, y: 43, status: 'normal', energy: 512, water: 6240, occupancy: 68, score: 89 },
  { id: 'engineering', name: 'Engineering Block', short: 'ENG', x: 58, y: 34, status: 'normal', energy: 384, water: 4820, occupancy: 31, score: 78 },
  { id: 'cse', name: 'CSE Block', short: 'CSE', x: 63, y: 49, status: 'normal', energy: 298, water: 3210, occupancy: 56, score: 91 },
  { id: 'library', name: 'Central Library', short: 'LIB', x: 40, y: 53, status: 'normal', energy: 218, water: 1980, occupancy: 42, score: 94 },
  { id: 'admin', name: 'Administrative Block', short: 'ADM', x: 31, y: 45, status: 'normal', energy: 176, water: 1420, occupancy: 27, score: 87 },
  { id: 'hostel-a', name: 'Hostel A', short: 'H-A', x: 26, y: 67, status: 'normal', energy: 446, water: 4180, occupancy: 82, score: 94 },
  { id: 'hostel-b', name: 'Hostel B', short: 'H-B', x: 17, y: 72, status: 'normal', energy: 421, water: 4200, occupancy: 74, score: 86 },
  { id: 'cafeteria', name: 'Cafeteria', short: 'CAF', x: 69, y: 62, status: 'normal', energy: 240, water: 2860, occupancy: 64, score: 72 },
  { id: 'auditorium', name: 'Auditorium', short: 'AUD', x: 80, y: 42, status: 'normal', energy: 332, water: 2480, occupancy: 18, score: 83 },
  { id: 'sports', name: 'Sports Complex', short: 'SPT', x: 88, y: 64, status: 'normal', energy: 268, water: 3120, occupancy: 38, score: 81 },
  { id: 'labs', name: 'Laboratory Block', short: 'LAB', x: 54, y: 65, status: 'normal', energy: 356, water: 2780, occupancy: 49, score: 88 },
  { id: 'parking', name: 'Smart Parking', short: 'P', x: 78, y: 78, status: 'normal', energy: 92, water: 380, occupancy: 61, score: 95 },
]

const nav = [
  { label: 'Dashboard', icon: Map }, { label: 'Vision Intelligence', icon: Eye }, { label: 'Buildings', icon: Building2 }, { label: 'Live Alerts', icon: AlertTriangle }, { label: 'Maintenance', icon: Ticket }, { label: 'Prevention & Solutions', icon: ShieldCheck }, { label: 'AI Copilot', icon: Bot }, { label: 'Analytics', icon: Activity }, { label: 'Reports', icon: Leaf },
]

const statusClass = (status: Status) => status === 'critical' ? 'critical' : status === 'warning' ? 'warning' : 'normal'

export default function Page() {
  const [active, setActive] = useState('Dashboard')
  const [buildings, setBuildings] = useState(initialBuildings)
  const [selected, setSelected] = useState<Building>(initialBuildings[1])
  const [simOpen, setSimOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Good morning. I’m monitoring 12 campus buildings. Ask me where resources are being wasted or trigger a simulation to see the twin respond.' }])
  const [tick, setTick] = useState(0)
  const [toast, setToast] = useState('')

  useEffect(() => { const timer = setInterval(() => setTick((v) => v + 1), 5000); return () => clearInterval(timer) }, [])

  const telemetry = useMemo(() => ({ energy: 18426 + (tick % 4) * 28, water: 42810 + (tick % 3) * 120, co2: 1284 + tick * 3, cost: 24680 + tick * 18 }), [tick])

  const simulate = (kind: 'water' | 'energy' | 'waste') => {
    const id = kind === 'water' ? 'hostel-b' : kind === 'energy' ? 'engineering' : 'cafeteria'
    setBuildings((current) => current.map((b) => b.id === id ? { ...b, status: kind === 'water' ? 'critical' : 'warning', water: kind === 'water' ? 5900 : b.water, energy: kind === 'energy' ? 487 : b.energy, score: kind === 'waste' ? 62 : b.score } : b))
    const target = initialBuildings.find((b) => b.id === id)!
    setSelected({ ...target, status: kind === 'water' ? 'critical' : 'warning', water: kind === 'water' ? 5900 : target.water, energy: kind === 'energy' ? 487 : target.energy })
    setToast(kind === 'water' ? 'Critical maintenance ticket automatically created · DSU-2048' : kind === 'energy' ? 'Energy anomaly detected · operations ticket queued' : 'Waste collection ticket created · cafeteria bin at 92%')
    setTimeout(() => setToast(''), 4200)
  }

  const sendMessage = (text = chatInput) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: 'user', text }, { from: 'ai', text: text.toLowerCase().includes('water') || text.toLowerCase().includes('first') ? 'Hostel B’s water leak should be prioritized. Current flow is 41% above baseline, estimating 180 L/hour loss and ₹720/day impact. Recommended action: inspect and isolate the ground-floor supply line.' : 'Engineering Block is the current efficiency opportunity. Energy is 24% above its expected baseline while occupancy is only 31%. I recommend reducing HVAC operation and switching non-essential lighting to standby.' }])
    setChatInput('')
  }

  return (
    <main className="ecotwin-shell">
      <div className="ambient-grid" /><div className="particle-field" aria-hidden="true"><span className="particle particle-one" /><span className="particle particle-two" /><span className="particle particle-three" /><span className="particle particle-four" /></div>
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">DSU</div><div><strong>EcoTwin</strong><span>Campus intelligence</span></div></div>
        <div className="university-label">DAYANANDA SAGAR UNIVERSITY</div>
        <nav className="nav-list">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActive(label)} className={`nav-item ${active === label ? 'active' : ''}`}><Icon /> <span>{label}</span>{label === 'Live Alerts' && <i className="nav-count">3</i>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="mini-status"><span className="status-dot pulse" /> <div><b>System operational</b><small>Telemetry synced 4 sec ago</small></div></div><button className="nav-item"><Settings2 /><span>System settings</span></button></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><div className="mobile-brand"><button className="icon-button"><Menu /></button><b>DSU <em>EcoTwin</em></b></div><div className="heading"><p>DAYANANDA SAGAR UNIVERSITY / OPERATIONS DESK</p><h1>{active === 'Dashboard' ? 'Campus Dashboard' : active}</h1><span>Real-time sustainability intelligence</span></div><div className="top-actions"><button className="simulation-trigger" onClick={() => setSimOpen(true)}><Radio /> Simulation</button><span className="live-pill"><i /> LIVE</span><span className="clock">10:42:08 <small>IST</small></span></div></header>

        <div className="content">
          <div className="hero-row"><div><div className="eyebrow"><span className="status-dot pulse" /> LIVE TELEMETRY <span className="divider-dot" /> {tick + 3}s ago</div><h2>Campus intelligence, <span>in motion.</span></h2><p className="hero-copy">A living operational model of DSU that turns sensor signals into sustainable action.</p></div><button className="demo-button" onClick={() => setSimOpen(true)}><Play /> Run demo scenario <ChevronRight /></button></div>
          <section className="kpi-grid">{[ ['Energy today', `${telemetry.energy.toLocaleString()} kWh`, '8.4%', ArrowDownRight, 'cyan'], ['Water usage', `${telemetry.water.toLocaleString()} L`, '5.2%', ArrowDownRight, 'blue'], ['CO₂ avoided', `${telemetry.co2.toLocaleString()} kg`, '11.7%', ArrowUpRight, 'violet'], ['Cost saved', `₹${telemetry.cost.toLocaleString()}`, '14.2%', ArrowUpRight, 'green'], ['Waste diverted', '68.4%', '6.8%', ArrowUpRight, 'amber'] ].map(([label, value, delta, Icon, tone]) => <div className="kpi" key={String(label)}><div className={`kpi-icon ${tone}`}><Activity /></div><div><span>{label}</span><strong>{value}</strong><small className="positive"><Icon /> {delta} <em>vs last week</em></small></div></div>)}</section>

          {active === 'Prevention & Solutions' ? <PreventionSection /> : active === 'Vision Intelligence' ? <VisionSection buildings={buildings} onSelectBuilding={(building) => { setSelected(building); setActive('Dashboard') }} /> : active !== 'Dashboard' && active !== 'AI Copilot' ? <SectionView active={active} buildings={buildings} onSelect={(building) => { setSelected(building); setActive('Dashboard') }} onSimulate={() => setSimOpen(true)} /> : active === 'AI Copilot' ? <CopilotSection messages={messages} chatInput={chatInput} setChatInput={setChatInput} sendMessage={sendMessage} /> : <>
          <div className="main-grid">
            <section className="panel twin-panel"><div className="panel-header"><div><div className="eyebrow">CAMPUS DASHBOARD / CAMPUS 01</div><h3>Live campus state</h3></div><div className="panel-actions"><button className="small-control"><LayersIcon /> Layers</button><button className="small-control"><Search /> Search</button></div></div><CampusScene buildings={buildings} selected={selected} onSelect={(building) => { setSelected(building); setActive('Dashboard') }} /><div className="twin-footer"><span><Building2 /> 12 monitored buildings</span><span><ShieldCheck /> 8 normal</span><span className="warn-text"><AlertTriangle /> 3 warnings</span><span><CircleDot /> 1 critical event</span></div><div className="selected-building"><div className={`selected-building-icon ${statusClass(selected.status)}`}><Building2 /></div><div><span className="eyebrow">SELECTED ASSET / {selected.short}</span><strong>{selected.name}</strong><small>{selected.occupancy}% occupied · {selected.energy} kWh today · {selected.water.toLocaleString()} L water use</small></div><span className={`status-badge ${statusClass(selected.status)}`}>{selected.status}</span><button className="text-button" onClick={() => setActive('Buildings')}>Open asset <ChevronRight /></button></div></section>

            <aside className="panel insight-panel"><div className="panel-header"><div><div className="eyebrow violet-text"><Sparkles /> AI INTELLIGENCE PIPELINE</div><h3>From signal to action</h3></div><span className="processing"><i /> PROCESSING</span></div><div className="pipeline">{[['Sensors', Radio], ['Computer Vision', Cpu], ['Anomaly detection', Activity], ['Digital twin', Building2], ['GenAI analysis', Sparkles], ['Recommendation', Lightbulb], ['Maintenance', Ticket]].map(([name, Icon], index) => <div className={`pipeline-step ${index === 4 ? 'current' : ''}`} key={String(name)}><div className="pipeline-icon"><Icon /></div><div><b>{name}</b><small>{index < 4 ? 'Signal received' : index === 4 ? 'Reasoning over telemetry' : 'Standing by'}</small></div>{index < 6 && <ChevronRight className="pipeline-arrow" />}</div>)}</div><div className="insight-callout"><Sparkles /><div><b>Copilot insight</b><p>Hostel B is using 41% more water than its baseline. A leak is likely. <button onClick={() => setChatOpen(true)}>Investigate →</button></p></div></div></aside>
          </div>

          <div className="bottom-grid"><section className="panel alerts-panel"><div className="panel-header"><div><div className="eyebrow">PRIORITY QUEUE</div><h3>Live alerts</h3></div><button className="text-button" onClick={() => setActive('Live Alerts')}>View all <ChevronRight /></button></div><div className="alert-list"><AlertRow type="critical" title="Water leakage detected" location="Hostel B · 180 L/hour estimated loss" time="2 min ago" /><AlertRow type="warning" title="Energy anomaly" location="Engineering Block · 24% above baseline" time="8 min ago" /><AlertRow type="warning" title="Bin nearing overflow" location="Cafeteria · 92% capacity" time="14 min ago" /></div></section><section className="panel impact-panel"><div className="panel-header"><div><div className="eyebrow green-text"><Trees /> CAMPUS IMPACT</div><h3>Today’s avoided impact</h3></div><MoreHorizontal /></div><div className="impact-number">₹24,680 <small>saved today</small></div><div className="impact-bars"><div><span>Water saved <b>42,810 L</b></span><i><em style={{ width: '76%' }} /></i></div><div><span>CO₂ avoided <b>1,284 kg</b></span><i><em style={{ width: '58%' }} /></i></div><div><span>Waste diverted <b>68.4%</b></span><i><em style={{ width: '68%' }} /></i></div></div></section><section className="panel leaderboard"><div className="panel-header"><div><div className="eyebrow">CAMPUS SUSTAINABILITY LEAGUE</div><h3>Weekly leaders</h3></div><Leaf className="green-icon" /></div>{[['Hostel A', '94', '182 kg CO₂ saved'], ['Central Library', '91', '154 kg CO₂ saved'], ['Hostel B', '86', '138 kg CO₂ saved'], ['Engineering Block', '78', '96 kg CO₂ saved']].map(([name, score, detail], i) => <div className="leader-row" key={name}><b className="rank">0{i + 1}</b><div><strong>{name}</strong><small>{detail}</small></div><span>{score}<em>/100</em></span></div>)}</section>          </div>
          </>}
        </div>
      </section>

      <button className="copilot-fab" onClick={() => setActive('AI Copilot')}><Bot /><span>Open EcoTwin Copilot</span></button>

      {simOpen && <div className="modal-backdrop"><div className="sim-modal panel"><button className="modal-close" onClick={() => setSimOpen(false)}>×</button><div className="eyebrow violet-text"><Sparkles /> DEMO MODE / CONTROL CENTER</div><h2>Campus Incident Simulator</h2><p>Trigger realistic campus events and watch the digital twin respond in real time.</p><div className="scenario-list"><Scenario icon={Droplets} title="Water leak · Hostel B" detail="Spikes water use to 5,900 L/day" tone="critical" onClick={() => simulate('water')} /><Scenario icon={Zap} title="Energy waste · Engineering" detail="Lights + HVAC active at low occupancy" tone="warning" onClick={() => simulate('energy')} /><Scenario icon={Waves} title="Overflowing bin · Cafeteria" detail="Computer vision predicts overflow in 48 min" tone="warning" onClick={() => simulate('waste')} /></div><div className="sim-state"><span><Radio /> Current campus state</span><b>8 normal · 3 warning · 1 critical</b></div></div></div>}
      {toast && <div className="toast"><Check /> {toast}</div>}
    </main>
  )
}

const preventionCategories = [
  { name: 'Waste accumulation', icon: Waves, severity: 'High', color: 'critical', description: 'Cafeteria bins are trending toward overflow during peak hours.', precaution: 'Label wet, dry, and recyclable bins near food areas.', prevention: 'Use fill sensors and usage-based collection schedules.', solution: 'Alert housekeeping and create a collection task.', longTerm: 'Optimize bin placement and reduce single-use plastic.', location: 'Cafeteria', evidence: '92% fill level · 14 min trend' },
  { name: 'Energy wastage', icon: Zap, severity: 'Medium', color: 'warning', description: 'Engineering rooms show consumption while occupancy is low.', precaution: 'Set equipment operating schedules and switch off idle systems.', prevention: 'Compare room occupancy against energy draw.', solution: 'Assign a facilities inspection; never auto-shut critical equipment.', longTerm: 'Audit HVAC and recommend efficient lighting.', location: 'Engineering Block', evidence: '24% above baseline · 31% occupied' },
  { name: 'Water leakage & wastage', icon: Droplets, severity: 'Critical', color: 'critical', description: 'Suspected abnormal flow needs an authorized inspection.', precaution: 'Inspect taps, joints, pipelines, and tanks regularly.', prevention: 'Monitor flow readings and tank levels against baseline.', solution: 'Isolate supply only when safe and authorized; create maintenance task.', longTerm: 'Install flow meters and water-efficient fixtures.', location: 'Hostel B', evidence: 'Suspected · 41% above baseline' },
  { name: 'Inefficient resource usage', icon: Leaf, severity: 'Medium', color: 'warning', description: 'Resource consumption is drifting above its historical operating profile.', precaution: 'Set targets for water, power, paper, and procurement.', prevention: 'Compare usage against operating hours and occupancy.', solution: 'Flag the responsible department for inspection.', longTerm: 'Improve procurement and compare buildings fairly.', location: 'Main Academic Block', evidence: '8.4% above 30-day baseline' },
  { name: 'Garden overwatering', icon: Trees, severity: 'Low', color: 'normal', description: 'Irrigation may be running despite adequate soil moisture.', precaution: 'Check soil moisture and weather before watering.', prevention: 'Use moisture-informed irrigation schedules.', solution: 'Alert gardening staff to inspect sprinklers.', longTerm: 'Use native plants and water-efficient landscaping.', location: 'North gardens', evidence: 'Moisture 78% · rain probability 32%' },
  { name: 'Poor indoor air quality', icon: Cloud, severity: 'High', color: 'critical', description: 'Sensor readings show recurring CO₂ warnings in occupied rooms.', precaution: 'Maintain ventilation and inspect filters.', prevention: 'Monitor CO₂ and particulate readings with appropriate sensors.', solution: 'Check ventilation and investigate pollution sources.', longTerm: 'Improve ventilation and generate building-specific reports.', location: 'CSE Block', evidence: 'CO₂ 1,180 ppm · simulated sensor' },
]

const visionDetections = [
  { id: 'VIS-1042', label: 'Person', confidence: 96, location: 'Cafeteria', time: '2 min ago', color: '#49e5dc', asset: 'cafeteria' },
  { id: 'VIS-1041', label: 'Visible litter', confidence: 88, location: 'North gardens', time: '8 min ago', color: '#f6b94e', asset: 'main' },
  { id: 'VIS-1040', label: 'Vehicle', confidence: 91, location: 'Smart Parking', time: '14 min ago', color: '#b69aff', asset: 'parking' },
]
function VisionSection({ buildings, onSelectBuilding }: { buildings: Building[]; onSelectBuilding: (building: Building) => void }) {
  const [mediaUrl, setMediaUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const [threshold, setThreshold] = useState(70)
  const [filter, setFilter] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(visionDetections[0])
  const [reviewStatus, setReviewStatus] = useState('NEW')
  const handleUpload = (file?: File) => { if (!file || !file.type.startsWith('image/')) return; setFileName(file.name); setMediaUrl(URL.createObjectURL(file)); setAnalyzed(false); setReviewStatus('NEW') }
  const runAnalysis = () => { if (mediaUrl) setAnalyzed(true) }
  const filteredEvents = visionDetections.filter((event) => (filter === 'All' || event.label === filter) && event.confidence >= threshold)
  return <section className="vision-section">
    <div className="vision-heading"><div><div className="eyebrow"><Eye /> COMPUTER VISION / CAMPUS INTELLIGENCE</div><h2>Vision Intelligence</h2><p>Connect authorized visual evidence to the DSU digital twin. Review detections without profiling people.</p></div><div className="vision-mode"><span className="status-dot pulse" /> DEMO MODE <small>Inference adapter not configured</small></div></div>
    <div className="vision-metrics"><div className="panel vision-metric"><Camera /><div><strong>12</strong><span>configured cameras</span></div></div><div className="panel vision-metric"><span className="metric-live" /><div><strong>0 / 12</strong><span>live connections</span></div></div><div className="panel vision-metric"><ScanLine /><div><strong>{analyzed ? '1' : '0'}</strong><span>uploaded analyses</span></div></div><div className="panel vision-metric"><AlertTriangle /><div><strong>3</strong><span>open visual events</span></div></div></div>
    <div className="vision-main"><div className="panel vision-upload"><div className="panel-header"><div><div className="eyebrow"><Upload /> EVIDENCE WORKSPACE</div><h3>Upload an image to inspect</h3></div><span className="processing"><i /> MOCK ADAPTER</span></div><div className={`upload-stage ${mediaUrl ? 'has-media' : ''}`}>{mediaUrl ? <><img src={mediaUrl} alt="Uploaded inspection evidence" /><div className="vision-overlay">{analyzed && <><span className="detection-box box-one"><b>Person 96%</b></span><span className="detection-box box-two"><b>Waste bin 84%</b></span></>}</div><span className="media-badge"><ImageIcon /> {fileName}</span></> : <label className="upload-empty"><Upload /><strong>Drop inspection evidence here</strong><span>PNG, JPG, WEBP · max 10 MB · faces and plates should be redacted</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleUpload(event.target.files?.[0])} /></label>}</div><div className="upload-actions"><label className="small-control"><Upload /> Choose image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleUpload(event.target.files?.[0])} /></label><button className="demo-button" disabled={!mediaUrl} onClick={runAnalysis}><ScanLine /> {analyzed ? 'Analysis complete' : 'Run demo analysis'} <ChevronRight /></button></div><div className="adapter-note"><ShieldCheck /><span><b>Privacy-first:</b> no facial recognition, identity matching, or individual profiling. Demo results are synthetic and not live campus data.</span></div></div><div className="panel twin-link-panel"><div className="panel-header"><div><div className="eyebrow violet-text"><Map /> EVENT TO TWIN</div><h3>Mapped visual events</h3></div><button className="small-control"><SlidersHorizontal /> Layers</button></div><div className="zone-map"><img src={mapSource} alt="DSU campus reference map" /><div className="zone-map-shade" />{visionDetections.map((event, index) => <button key={event.id} className="vision-marker" style={{ left: `${35 + index * 23}%`, top: `${43 + (index % 2) * 18}%`, borderColor: event.color }} onClick={() => setSelectedEvent(event)}><span style={{ background: event.color }} />{index + 1}</button>)}</div><div className="mapped-event"><div className="event-signal" style={{ background: selectedEvent.color }} /><div><strong>{selectedEvent.label}</strong><small>{selectedEvent.location} · {selectedEvent.confidence}% confidence · {selectedEvent.time}</small></div><button className="text-button" onClick={() => onSelectBuilding(buildings.find((building) => building.id === selectedEvent.asset) || buildings[0])}>Focus twin <ChevronRight /></button></div></div></div>
    <div className="vision-bottom"><div className="panel event-explorer"><div className="panel-header"><div><div className="eyebrow"><History /> EVENT EXPLORER</div><h3>Recent detection events</h3></div><div className="vision-filters"><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Person</option><option>Visible litter</option><option>Vehicle</option></select><span><SlidersHorizontal /> {threshold}%+</span><input type="range" min="50" max="98" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></div></div>{filteredEvents.map((event) => <button key={event.id} className={`vision-event ${selectedEvent.id === event.id ? 'selected' : ''}`} onClick={() => setSelectedEvent(event)}><span className="event-signal" style={{ background: event.color }} /><div><strong>{event.label}</strong><small>{event.id} · {event.location}</small></div><b>{event.confidence}%</b><span className="event-status">{selectedEvent.id === event.id ? reviewStatus : 'NEW'}</span><ChevronRight /></button>)}</div><div className="panel camera-panel"><div className="panel-header"><div><div className="eyebrow"><Camera /> CAMERA FEEDS</div><h3>Authorized sources</h3></div><span className="simulated-label">NO LIVE SOURCES</span></div>{['Gate 01 · Main entry','Cafeteria · west view','Parking · north lot'].map((camera, index) => <div className="camera-row" key={camera}><span className="camera-icon"><Camera /></span><div><strong>{camera}</strong><small>CAM-{String(index + 1).padStart(2, '0')} · {index === 1 ? 'Analysis ready' : 'Awaiting source'}</small></div><span className={index === 1 ? 'camera-ready' : 'camera-offline'}>{index === 1 ? 'READY' : 'OFFLINE'}</span></div>)}</div></div>
    <div className="vision-review-bar panel"><div><span className="eyebrow">SELECTED EVENT / {selectedEvent.id}</span><strong>{selectedEvent.label} at {selectedEvent.location}</strong><small>Model: demo-vision-0.1 · confidence {selectedEvent.confidence}% · source: synthetic event fixture</small></div><div><button className="small-control" onClick={() => setReviewStatus('FALSE POSITIVE')}>False positive</button><button className="small-control" onClick={() => setReviewStatus('ACKNOWLEDGED')}><Check /> Acknowledge</button><button className="demo-button" onClick={() => setReviewStatus('RESOLVED')}><Check /> Resolve event</button></div></div>
  </section>
}

function CampusScene({ buildings, selected, onSelect }: { buildings: Building[]; selected: Building; onSelect: (building: Building) => void }) {
  return <div className="campus-scene" aria-label="Interactive approximate 3D campus model"><Canvas camera={{ position: [12, 14, 16], fov: 42 }} dpr={[1, 1.5]} shadows><color attach="background" args={['#07151d']} /><ambientLight intensity={1.8} /><directionalLight position={[4, 12, 6]} intensity={2.4} castShadow /><gridHelper args={[22, 22, '#1a4650', '#102d36']} position={[0, -0.05, 0]} /><mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow><planeGeometry args={[22, 22]} /><meshStandardMaterial color="#0a2028" roughness={1} /></mesh>{buildings.map((building, index) => <CampusBuilding key={building.id} building={building} selected={selected.id === building.id} index={index} onSelect={onSelect} />)}<UtilityNetwork /><OrbitControls enablePan enableZoom minDistance={7} maxDistance={28} maxPolarAngle={Math.PI / 2.15} /></Canvas><div className="scene-overlay scene-title"><span className="status-dot pulse" /> 3D CAMPUS / APPROXIMATE MODEL</div><div className="scene-overlay scene-hint">Drag to orbit · Scroll to zoom · Select a building</div><div className="scene-selected"><b>{selected.short}</b><span>{selected.name}</span></div><div className="scene-legend"><span><i className="legend-dot normal" /> Healthy</span><span><i className="legend-dot warning" /> Watch</span><span><i className="legend-dot critical" /> Critical</span></div></div>
}
function CampusBuilding({ building, selected, index, onSelect }: { building: Building; selected: boolean; index: number; onSelect: (building: Building) => void }) { const x = (building.x - 50) * .16; const z = (building.y - 50) * .16; const height = 0.65 + (building.occupancy % 4) * .12; const color = building.status === 'critical' ? '#df6678' : building.status === 'warning' ? '#e5ae5b' : selected ? '#5ee6df' : ['#8da6a8','#6d8b93','#a4b4a7'][index % 3]; return <group position={[x, height / 2, z]} onClick={(event) => { event.stopPropagation(); onSelect(building) }}><mesh castShadow><boxGeometry args={[1.25 + (index % 3) * .16, height, .85 + (index % 2) * .16]} /><meshStandardMaterial color={color} emissive={selected ? '#38d5d0' : '#000000'} emissiveIntensity={selected ? .45 : 0} roughness={.74} /></mesh><mesh position={[0, height / 2 + .06, 0]}><boxGeometry args={[1.38 + (index % 3) * .16, .08, .96 + (index % 2) * .16]} /><meshStandardMaterial color="#173844" metalness={.18} roughness={.5} /></mesh></group> }
function UtilityNetwork() { return <group>{[[[-7, .08, -5],[-3, .08, -2],[1, .08, 0],[5, .08, 3]], [[-5, .1, 4],[-2, .1, 2],[2, .1, 1],[6, .1, -1]]].map((route, routeIndex) => route.slice(0, -1).map((start, index) => { const end = route[index + 1]; const midpoint = [(start[0] + end[0]) / 2, .12, (start[2] + end[2]) / 2] as [number, number, number]; const length = Math.hypot(end[0] - start[0], end[2] - start[2]); const angle = Math.atan2(end[2] - start[2], end[0] - start[0]); return <mesh key={`${routeIndex}-${index}`} position={midpoint} rotation={[0, -angle, 0]}><boxGeometry args={[length, .045, .045]} /><meshBasicMaterial color={routeIndex === 0 ? '#37d6e0' : '#e3a94e'} transparent opacity={.8} /></mesh> }))}</group> }

function PreventionSection() {
  const [selected, setSelected] = useState<typeof preventionCategories[number] | null>(null)
  const [status, setStatus] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState('All')
  const [taskMessage, setTaskMessage] = useState('')
  const visible = filter === 'All' ? preventionCategories : preventionCategories.filter((item) => item.severity === filter)
  const activeIssues = preventionCategories.filter((item) => status[item.name] !== 'Verified').length
  const verified = preventionCategories.filter((item) => status[item.name] === 'Verified').length
  const resolve = (name: string) => { setStatus((current) => ({ ...current, [name]: 'Resolved' })); setTaskMessage('Resolution recorded. Verification is still required.') }
  return <section className="prevention-section">
    <div className="section-intro prevention-intro"><div><div className="eyebrow"><ShieldCheck /> PREVENTION / CAMPUS OPERATIONS</div><h2>Campus Prevention &amp; Solutions Center</h2><p>Prevent problems before they happen. Detect issues early. Resolve them intelligently.</p></div><span className="demo-mode"><i /> DEMO DATA / RULE-BASED</span></div>
    <div className="prevention-metrics"><MetricCard label="Active issues" value={String(activeIssues)} detail="Open environmental issues" tone="red" /><MetricCard label="High-priority alerts" value="3" detail="Require urgent attention" tone="amber" /><MetricCard label="Preventive actions" value="8" detail="Scheduled or in progress" tone="cyan" /><MetricCard label="Verified resolutions" value={String(verified)} detail="Separate verification step" tone="green" /></div>
    <div className="impact-strip panel"><div><span>Projected water savings</span><strong>2,480 L</strong><small>Estimated from open actions</small></div><div><span>Projected electricity</span><strong>684 kWh</strong><small>Estimated, not verified</small></div><div><span>Projected cost savings</span><strong>₹8,420</strong><small>Rule-based estimate</small></div><div><span>Overflow incidents prevented</span><strong>6</strong><small>Simulated this month</small></div></div>
    <div className="prevention-block"><div className="block-heading"><div><div className="eyebrow">DETECT / PREVENT / RESOLVE</div><h3>Environmental problem categories</h3></div><div className="filter-row">{['All','Critical','High','Medium','Low'].map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div><div className="category-grid">{visible.map((item) => <button className="panel category-card" key={item.name} onClick={() => setSelected(item)}><div className={`category-icon ${item.color}`}><item.icon /></div><div className="category-copy"><div><strong>{item.name}</strong><span className={`severity ${item.color}`}>{item.severity}</span></div><p>{item.description}</p><small>{item.location} · {item.evidence}</small></div><ChevronRight /></button>)}</div></div>
    <div className="prevention-block"><div className="block-heading"><div><div className="eyebrow violet-text"><Sparkles /> PREDICTION CENTER</div><h3>Prevent before it happens</h3></div><span className="simulated-label">SIMULATED PREDICTIONS</span></div><div className="prediction-grid">{preventionCategories.slice(0, 4).map((item) => <div className="panel prediction-card" key={item.name}><div className={`risk-bar ${item.color}`} /><div><strong>{item.name}</strong><small>{item.location} · predicted window: next 48 hours</small><p><b>Evidence:</b> {item.evidence}</p><button className="text-button" onClick={() => { setSelected(item); setTaskMessage(`Preventive task created for ${item.location}.`) }}>Create preventive task <ChevronRight /></button></div></div>)}</div></div>
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="issue-modal panel" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><div className={`eyebrow ${selected.color === 'critical' ? 'red-text' : 'amber-text'}`}>{selected.severity.toUpperCase()} / {selected.location}</div><h2>{selected.name}</h2><p>{selected.description}</p><div className="solution-steps"><div><b>Precaution</b><span>{selected.precaution}</span></div><div><b>Prevention</b><span>{selected.prevention}</span></div><div><b>Immediate solution</b><span>{selected.solution}</span></div><div><b>Long-term recommendation</b><span>{selected.longTerm}</span></div></div><div className="issue-meta"><span>Status: <b>{status[selected.name] || 'Detected'}</b></span><span>Detection confidence: <b>82% simulated</b></span></div><div className="modal-actions"><button className="small-control" onClick={() => resolve(selected.name)}><Check /> Mark resolved</button><button className="demo-button" onClick={() => { setTaskMessage(`Preventive task assigned to Facilities for ${selected.location}.`); setSelected(null) }}><Ticket /> Assign task</button></div></div></div>}
    {taskMessage && <div className="toast"><Check /> {taskMessage}</div>}
  </section>
}

function CopilotSection({ messages, chatInput, setChatInput, sendMessage }: { messages: { from: string; text: string }[]; chatInput: string; setChatInput: (value: string) => void; sendMessage: () => void }) {
  return <section className="copilot-section">
    <div className="copilot-hero"><div><div className="eyebrow violet-text"><Bot /> ECO TWIN COPILOT / CAMPUS INTELLIGENCE</div><h2>Your campus, explained.</h2><p>Ask questions, investigate anomalies, and turn live telemetry into clear next actions.</p></div><div className="copilot-status"><span className="status-dot pulse" /> AI ONLINE <small>12 buildings connected</small></div></div>
    <div className="copilot-layout"><div className="panel copilot-conversation"><div className="chat-head"><div><div className="eyebrow violet-text"><Sparkles /> LIVE ASSISTANT</div><h3>Ask about your campus</h3></div><span className="processing"><i /> READY</span></div><div className="chat-messages">{messages.map((m, i) => <div className={`chat-message ${m.from}`} key={`${m.from}-${i}`}><div className="chat-icon">{m.from === 'ai' ? <Sparkles /> : 'RK'}</div><p>{m.text}</p></div>)}</div><div className="suggestions"><button onClick={() => sendMessage('Which issue should we fix first?')}>Which issue first?</button><button onClick={() => sendMessage('How much water are we losing?')}>Water loss?</button><button onClick={() => sendMessage('What is the biggest energy opportunity?')}>Energy opportunity?</button></div><div className="chat-input"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) sendMessage() }} placeholder="Ask about sustainability, buildings, or alerts..." /><button onClick={sendMessage} aria-label="Send message"><ArrowUpRight /></button></div></div><aside className="copilot-context"><div className="panel context-card"><div className="eyebrow">SUGGESTED QUESTIONS</div><button onClick={() => sendMessage('Which issue should we fix first?')}><AlertTriangle /> Which issue needs attention first? <ChevronRight /></button><button onClick={() => sendMessage('How much water are we losing?')}><Droplets /> Where are we wasting water? <ChevronRight /></button><button onClick={() => sendMessage('What is the biggest energy opportunity?')}><Zap /> What is our best energy opportunity? <ChevronRight /></button></div><div className="panel context-card copilot-note"><Sparkles /><div><div className="eyebrow">COPILOT CONTEXT</div><p>Using live telemetry, building health, occupancy, and incident history to ground every answer.</p></div></div></aside></div>
  </section>
}

function SectionView({ active, buildings, onSelect, onSimulate }: { active: string; buildings: Building[]; onSelect: (building: Building) => void; onSimulate: () => void }) {
  const configs: Record<string, { eyebrow: string; title: string; copy: string; icon: typeof Activity }> = {
    Buildings: { eyebrow: 'ASSET DIRECTORY / CAMPUS 01', title: 'Buildings', copy: 'Browse every monitored facility, compare live health, and open a building in the digital twin.', icon: Building2 },
    'Live Alerts': { eyebrow: 'OPERATIONS / PRIORITY QUEUE', title: 'Live Alerts', copy: 'Review active anomalies and jump directly to the asset that needs attention.', icon: AlertTriangle },
    Maintenance: { eyebrow: 'WORK ORDERS / FIELD OPERATIONS', title: 'Maintenance', copy: 'Turn telemetry into accountable work orders with clear ownership and priority.', icon: Ticket },
    Analytics: { eyebrow: 'INSIGHTS / SUSTAINABILITY PERFORMANCE', title: 'Analytics', copy: 'Track energy, water, waste, and avoided impact across the campus.', icon: Activity },
    Reports: { eyebrow: 'EXPORTS / CAMPUS REPORTING', title: 'Reports', copy: 'Generate concise operational reports for facilities and sustainability teams.', icon: Leaf },
  }
  const config = configs[active]
  if (!config) return null
  const Icon = config.icon
  const rows = active === 'Live Alerts' ? [['Critical', 'Water leakage detected', 'Hostel B', '2 min ago'], ['Warning', 'Energy anomaly', 'Engineering Block', '8 min ago'], ['Warning', 'Bin nearing overflow', 'Cafeteria', '14 min ago']] : active === 'Maintenance' ? [['DSU-2048', 'Inspect ground-floor supply line', 'Hostel B', 'Critical'], ['DSU-2047', 'Review HVAC schedule', 'Engineering Block', 'Open'], ['DSU-2046', 'Empty cafeteria waste station', 'Cafeteria', 'Queued']] : []
  return <section className="section-view">
    <div className="section-intro"><div><div className="eyebrow"><Icon /> {config.eyebrow}</div><h2>{config.title}</h2><p>{config.copy}</p></div><button className="demo-button" onClick={onSimulate}><Play /> Run demo scenario <ChevronRight /></button></div>
    {active === 'Buildings' && <div className="building-directory">{buildings.map((building) => <button className="panel directory-card" key={building.id} onClick={() => onSelect(building)}><div className={`directory-icon ${statusClass(building.status)}`}><Building2 /></div><div><strong>{building.name}</strong><small>{building.short} · {building.occupancy}% occupancy</small></div><span className={`status-badge ${statusClass(building.status)}`}>{building.status}</span><ChevronRight /></button>)}</div>}
    {(active === 'Live Alerts' || active === 'Maintenance') && <div className="panel table-panel"><div className="table-head"><span>Item</span><span>Location</span><span>Status</span></div>{rows.map((row) => <div className="table-row" key={`${row[0]}-${row[1]}`}><strong>{row[0]}</strong><span>{row[1]}<small>{row[2]}</small></span><b className={`status-badge ${row[3] === 'Critical' ? 'critical' : row[3] === 'Warning' ? 'warning' : 'normal'}`}>{row[3]}</b><ChevronRight /></div>)}</div>}
    {active === 'Analytics' && <AnalyticsSection />}
    {active === 'Reports' && <div className="report-grid"><ReportCard title="Weekly sustainability digest" detail="Energy, water, waste, and campus impact" /><ReportCard title="Facilities performance report" detail="Building health, occupancy, and incidents" /><ReportCard title="Monthly ESG summary" detail="Board-ready avoided impact metrics" /></div>}
  </section>
}

const analyticsSeries = { energy: { label: 'Energy efficiency', unit: '%', color: 'var(--chart-1)', values: [78, 81, 79, 84, 82, 86, 86.2] }, water: { label: 'Water intensity', unit: 'L', color: 'var(--chart-2)', values: [51200, 49800, 47500, 46800, 45200, 43800, 42810] }, carbon: { label: 'CO₂ avoided', unit: 'kg', color: 'var(--chart-3)', values: [820, 910, 970, 1040, 1120, 1195, 1284] }, waste: { label: 'Waste diverted', unit: '%', color: 'var(--chart-4)', values: [54, 57, 61, 59, 64, 66, 68.4] } } as const
const analyticsConfig = { value: { label: 'Campus trend', color: 'var(--chart-1)' } } satisfies ChartConfig
function AnalyticsSection() {
  const [metric, setMetric] = useState<keyof typeof analyticsSeries>('energy')
  const [period, setPeriod] = useState<'7D' | '30D'>('7D')
  const source = analyticsSeries[metric]
  const values = period === '7D' ? source.values : source.values.map((value, index) => value * (0.86 + index * .025))
  const data = values.map((value, index) => ({ day: period === '7D' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index] : `W${index + 1}`, value }))
  const display = (value: number) => source.unit === 'L' || source.unit === 'kg' ? value.toLocaleString(undefined, { maximumFractionDigits: 0 }) : value.toFixed(1)
  return <div className="analytics-grid"><MetricCard label="Energy efficiency" value="86.2%" detail="8.4% better than last week" tone="cyan" /><MetricCard label="Water intensity" value="42,810 L" detail="5.2% reduction this week" tone="blue" /><MetricCard label="CO₂ avoided" value="1,284 kg" detail="11.7% above target" tone="violet" /><MetricCard label="Waste diverted" value="68.4%" detail="Target: 70% by month end" tone="green" /><div className="panel analytics-chart-panel"><div className="chart-toolbar"><div><div className="eyebrow">RESOURCE PERFORMANCE / {period}</div><h3>{source.label}</h3><p>Interactive trend from the selected campus resource data.</p></div><div className="chart-controls"><div>{(Object.keys(analyticsSeries) as Array<keyof typeof analyticsSeries>).map((key) => <button key={key} className={metric === key ? 'active' : ''} onClick={() => setMetric(key)}>{analyticsSeries[key].label.replace(' efficiency','').replace(' intensity','').replace(' avoided','').replace(' diverted','')}</button>)}</div><div>{(['7D','30D'] as const).map((item) => <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>)}</div></div></div><div className="chart-summary"><strong>{display(values[values.length - 1])} {source.unit}</strong><span>Latest reported value</span><b className="trend-up"><ArrowUpRight /> {metric === 'water' ? 'down' : 'up'} vs prior period</b></div><ChartContainer config={analyticsConfig} className="h-[250px] w-full"><AreaChart accessibilityLayer data={data} margin={{ left: 6, right: 12, top: 12, bottom: 0 }}><CartesianGrid vertical={false} stroke="rgba(136,180,183,.13)" /><XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: '#78949b', fontSize: 10 }} /><YAxis hide domain={['auto','auto']} /><ChartTooltip cursor={{ stroke: '#49e5dc', strokeDasharray: '4 4' }} content={<ChartTooltipContent formatter={(value) => `${Number(value).toLocaleString()} ${source.unit}`} />} /><Area type="monotone" dataKey="value" stroke={source.color} fill={source.color} fillOpacity={.14} strokeWidth={2.5} dot={{ r: 3, fill: source.color, strokeWidth: 0 }} activeDot={{ r: 5 }} /></AreaChart></ChartContainer></div></div>
}

function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) { return <div className="panel metric-card"><span className={`kpi-icon ${tone}`}><Activity /></span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div></div> }
function ReportCard({ title, detail }: { title: string; detail: string }) { return <button className="panel report-card"><span className="report-icon"><Leaf /></span><div><strong>{title}</strong><small>{detail}</small><b>Generate report <ChevronRight /></b></div></button> }

function AlertRow({ type, title, location, time }: { type: Status; title: string; location: string; time: string }) { return <div className="alert-row"><span className={`alert-icon ${type}`}><AlertTriangle /></span><div><strong>{title}</strong><small>{location}</small></div><time>{time}</time><ChevronRight /></div> }
function Scenario({ icon: Icon, title, detail, tone, onClick }: { icon: typeof Droplets; title: string; detail: string; tone: Status; onClick: () => void }) { return <button className="scenario" onClick={onClick}><span className={`scenario-icon ${tone}`}><Icon /></span><span><strong>{title}</strong><small>{detail}</small></span><Play /></button> }
function LayersIcon() { return <span className="layers-icon"><i /><i /><i /></span> }
