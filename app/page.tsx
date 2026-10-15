'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
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
  Send,
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
  { label: 'Digital Twin', icon: Map }, { label: 'Buildings', icon: Building2 }, { label: 'Live Alerts', icon: AlertTriangle }, { label: 'Maintenance', icon: Ticket }, { label: 'AI Copilot', icon: Bot }, { label: 'Analytics', icon: Activity }, { label: 'Reports', icon: Leaf },
]

const statusClass = (status: Status) => status === 'critical' ? 'critical' : status === 'warning' ? 'warning' : 'normal'

export default function Page() {
  const [active, setActive] = useState('Digital Twin')
  const [buildings, setBuildings] = useState(initialBuildings)
  const [selected, setSelected] = useState<Building>(initialBuildings[1])
  const [simOpen, setSimOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'ai', text: 'Good morning. I’m monitoring 12 campus buildings. Ask me where resources are being wasted or trigger a simulation to see the twin respond.' }])
  const [tick, setTick] = useState(0)
  const [toast, setToast] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); const timer = setInterval(() => setTick((v) => v + 1), 5000); return () => clearInterval(timer) }, [])

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
      <div className="ambient-grid" />
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">DSU</div><div><strong>EcoTwin</strong><span>Campus intelligence</span></div></div>
        <div className="university-label">DAYANANDA SAGAR UNIVERSITY</div>
        <nav className="nav-list">{nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActive(label)} className={`nav-item ${active === label ? 'active' : ''}`}><Icon /> <span>{label}</span>{label === 'Live Alerts' && <i className="nav-count">3</i>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="mini-status"><span className="status-dot pulse" /> <div><b>System operational</b><small>Telemetry synced 4 sec ago</small></div></div><button className="nav-item"><Settings2 /><span>System settings</span></button></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><div className="mobile-brand"><button className="icon-button"><Menu /></button><b>DSU <em>EcoTwin</em></b></div><div className="heading"><p>DAYANANDA SAGAR UNIVERSITY / CONTROL CENTER</p><h1>{active === 'Digital Twin' ? 'Campus Digital Twin' : active}</h1><span>Real-time sustainability intelligence</span></div><div className="top-actions"><button className="simulation-trigger" onClick={() => setSimOpen(true)}><Radio /> Simulation</button><span className="live-pill"><i /> LIVE</span><span className="clock">10:42:08 <small>IST</small></span><button className="icon-button"><AlertTriangle /></button><div className="avatar">RK</div></div></header>

        <div className="content">
          <div className="hero-row"><div><div className="eyebrow"><span className="status-dot pulse" /> LIVE TELEMETRY <span className="divider-dot" /> {tick + 3}s ago</div><h2>Campus intelligence, <span>in motion.</span></h2><p className="hero-copy">A living operational model of DSU that turns sensor signals into sustainable action.</p></div><button className="demo-button" onClick={() => setSimOpen(true)}><Play /> Run demo scenario <ChevronRight /></button></div>
          <section className="kpi-grid">{[ ['Energy today', `${telemetry.energy.toLocaleString()} kWh`, '8.4%', ArrowDownRight, 'cyan'], ['Water usage', `${telemetry.water.toLocaleString()} L`, '5.2%', ArrowDownRight, 'blue'], ['CO₂ avoided', `${telemetry.co2.toLocaleString()} kg`, '11.7%', ArrowUpRight, 'violet'], ['Cost saved', `₹${telemetry.cost.toLocaleString()}`, '14.2%', ArrowUpRight, 'green'], ['Waste diverted', '68.4%', '6.8%', ArrowUpRight, 'amber'] ].map(([label, value, delta, Icon, tone]) => <div className="kpi" key={String(label)}><div className={`kpi-icon ${tone}`}><Activity /></div><div><span>{label}</span><strong>{value}</strong><small className="positive"><Icon /> {delta} <em>vs last week</em></small></div></div>)}</section>

          {active !== 'Digital Twin' ? <SectionView active={active} buildings={buildings} onSelect={(building) => { setSelected(building); setActive('Digital Twin') }} onSimulate={() => setSimOpen(true)} /> : <>
          <div className="main-grid">
            <section className="panel twin-panel"><div className="panel-header"><div><div className="eyebrow">DIGITAL TWIN / CAMPUS 01</div><h3>Live campus state</h3></div><div className="panel-actions"><button className="small-control"><LayersIcon /> Layers</button><button className="small-control"><Search /> Search</button></div></div><div className="map-frame"><img src={mapSource} alt="Satellite map reference of Dayananda Sagar University campus" /><div className="map-shade" /><div className="map-label map-title">DSU CAMPUS / LIVE VIEW</div>{buildings.map((building) => <button key={building.id} aria-label={`Open ${building.name}`} onClick={() => { setSelected(building); setActive('Digital Twin') }} className={`building-marker ${statusClass(building.status)} ${selected.id === building.id ? 'selected' : ''}`} style={{ left: `${building.x}%`, top: `${building.y}%` }}><span className="marker-core">{building.short === 'P' ? 'P' : <Building2 />}</span><span className="marker-label">{building.short}</span></button>)}<div className="map-legend"><span><i className="legend-dot normal" /> Efficient</span><span><i className="legend-dot warning" /> Warning</span><span><i className="legend-dot critical" /> Critical</span></div><div className="map-live"><span className="status-dot pulse" /> LIVE TELEMETRY</div></div><div className="twin-footer"><span><Building2 /> 12 monitored buildings</span><span><ShieldCheck /> 8 normal</span><span className="warn-text"><AlertTriangle /> 3 warnings</span><span><CircleDot /> 1 critical event</span></div>{mounted && <div className="selected-building"><div className={`selected-building-icon ${statusClass(selected.status)}`}><Building2 /></div><div><span className="eyebrow">SELECTED ASSET / {selected.short}</span><strong>{selected.name}</strong><small>{selected.occupancy}% occupied · {selected.energy} kWh today · {selected.water.toLocaleString()} L water use</small></div><span className={`status-badge ${statusClass(selected.status)}`}>{selected.status}</span><button className="text-button" onClick={() => setActive('Buildings')}>Open asset <ChevronRight /></button></div>}</section>

            <aside className="panel insight-panel"><div className="panel-header"><div><div className="eyebrow violet-text"><Sparkles /> AI INTELLIGENCE PIPELINE</div><h3>From signal to action</h3></div><span className="processing"><i /> PROCESSING</span></div><div className="pipeline">{[['Sensors', Radio], ['Computer Vision', Cpu], ['Anomaly detection', Activity], ['Digital twin', Building2], ['GenAI analysis', Sparkles], ['Recommendation', Lightbulb], ['Maintenance', Ticket]].map(([name, Icon], index) => <div className={`pipeline-step ${index === 4 ? 'current' : ''}`} key={String(name)}><div className="pipeline-icon"><Icon /></div><div><b>{name}</b><small>{index < 4 ? 'Signal received' : index === 4 ? 'Reasoning over telemetry' : 'Standing by'}</small></div>{index < 6 && <ChevronRight className="pipeline-arrow" />}</div>)}</div><div className="insight-callout"><Sparkles /><div><b>Copilot insight</b><p>Hostel B is using 41% more water than its baseline. A leak is likely. <button onClick={() => setChatOpen(true)}>Investigate →</button></p></div></div></aside>
          </div>

          <div className="bottom-grid"><section className="panel alerts-panel"><div className="panel-header"><div><div className="eyebrow">PRIORITY QUEUE</div><h3>Live alerts</h3></div><button className="text-button" onClick={() => setActive('Live Alerts')}>View all <ChevronRight /></button></div><div className="alert-list"><AlertRow type="critical" title="Water leakage detected" location="Hostel B · 180 L/hour estimated loss" time="2 min ago" /><AlertRow type="warning" title="Energy anomaly" location="Engineering Block · 24% above baseline" time="8 min ago" /><AlertRow type="warning" title="Bin nearing overflow" location="Cafeteria · 92% capacity" time="14 min ago" /></div></section><section className="panel impact-panel"><div className="panel-header"><div><div className="eyebrow green-text"><Trees /> CAMPUS IMPACT</div><h3>Today’s avoided impact</h3></div><MoreHorizontal /></div><div className="impact-number">₹24,680 <small>saved today</small></div><div className="impact-bars"><div><span>Water saved <b>42,810 L</b></span><i><em style={{ width: '76%' }} /></i></div><div><span>CO₂ avoided <b>1,284 kg</b></span><i><em style={{ width: '58%' }} /></i></div><div><span>Waste diverted <b>68.4%</b></span><i><em style={{ width: '68%' }} /></i></div></div></section><section className="panel leaderboard"><div className="panel-header"><div><div className="eyebrow">CAMPUS SUSTAINABILITY LEAGUE</div><h3>Weekly leaders</h3></div><Leaf className="green-icon" /></div>{[['Hostel A', '94', '182 kg CO₂ saved'], ['Central Library', '91', '154 kg CO₂ saved'], ['Hostel B', '86', '138 kg CO₂ saved'], ['Engineering Block', '78', '96 kg CO₂ saved']].map(([name, score, detail], i) => <div className="leader-row" key={name}><b className="rank">0{i + 1}</b><div><strong>{name}</strong><small>{detail}</small></div><span>{score}<em>/100</em></span></div>)}</section>          </div>
          </>}
        </div>
      </section>

      <button className="copilot-fab" onClick={() => setChatOpen(true)}><Bot /><span>Ask EcoTwin Copilot</span></button>
      {chatOpen && <div className="chat-window panel"><div className="chat-head"><div><div className="eyebrow violet-text"><Bot /> ECO TWIN COPILOT</div><h3>Ask about your campus</h3></div><button className="icon-button" onClick={() => setChatOpen(false)}>×</button></div><div className="chat-messages">{messages.map((m, i) => <div className={`chat-message ${m.from}`} key={i}><div className="chat-icon">{m.from === 'ai' ? <Sparkles /> : 'RK'}</div><p>{m.text}</p></div>)}</div><div className="suggestions"><button onClick={() => sendMessage('Which issue should we fix first?')}>Which issue first?</button><button onClick={() => sendMessage('How much water are we losing?')}>Water loss?</button></div><div className="chat-input"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask about sustainability..." /><button onClick={() => sendMessage()}><Send /></button></div></div>}

      {simOpen && <div className="modal-backdrop"><div className="sim-modal panel"><button className="modal-close" onClick={() => setSimOpen(false)}>×</button><div className="eyebrow violet-text"><Sparkles /> DEMO MODE / CONTROL CENTER</div><h2>Campus Incident Simulator</h2><p>Trigger realistic campus events and watch the digital twin respond in real time.</p><div className="scenario-list"><Scenario icon={Droplets} title="Water leak · Hostel B" detail="Spikes water use to 5,900 L/day" tone="critical" onClick={() => simulate('water')} /><Scenario icon={Zap} title="Energy waste · Engineering" detail="Lights + HVAC active at low occupancy" tone="warning" onClick={() => simulate('energy')} /><Scenario icon={Waves} title="Overflowing bin · Cafeteria" detail="Computer vision predicts overflow in 48 min" tone="warning" onClick={() => simulate('waste')} /></div><div className="sim-state"><span><Radio /> Current campus state</span><b>8 normal · 3 warning · 1 critical</b></div></div></div>}
      {toast && <div className="toast"><Check /> {toast}</div>}
    </main>
  )
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
    {active === 'Analytics' && <div className="analytics-grid"><MetricCard label="Energy efficiency" value="86.2%" detail="8.4% better than last week" tone="cyan" /><MetricCard label="Water intensity" value="42,810 L" detail="5.2% reduction this week" tone="blue" /><MetricCard label="CO₂ avoided" value="1,284 kg" detail="11.7% above target" tone="violet" /><MetricCard label="Waste diverted" value="68.4%" detail="Target: 70% by month end" tone="green" /><div className="panel chart-panel"><div className="eyebrow">7-DAY RESOURCE TREND</div><div className="chart-bars">{[48, 62, 55, 74, 66, 82, 91].map((height, index) => <i key={index} style={{ height: `${height}%` }}><span>{['M','T','W','T','F','S','S'][index]}</span></i>)}</div></div></div>}
    {active === 'Reports' && <div className="report-grid"><ReportCard title="Weekly sustainability digest" detail="Energy, water, waste, and campus impact" /><ReportCard title="Facilities performance report" detail="Building health, occupancy, and incidents" /><ReportCard title="Monthly ESG summary" detail="Board-ready avoided impact metrics" /></div>}
  </section>
}

function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: string }) { return <div className="panel metric-card"><span className={`kpi-icon ${tone}`}><Activity /></span><div><small>{label}</small><strong>{value}</strong><p>{detail}</p></div></div> }
function ReportCard({ title, detail }: { title: string; detail: string }) { return <button className="panel report-card"><span className="report-icon"><Leaf /></span><div><strong>{title}</strong><small>{detail}</small><b>Generate report <ChevronRight /></b></div></button> }

function AlertRow({ type, title, location, time }: { type: Status; title: string; location: string; time: string }) { return <div className="alert-row"><span className={`alert-icon ${type}`}><AlertTriangle /></span><div><strong>{title}</strong><small>{location}</small></div><time>{time}</time><ChevronRight /></div> }
function Scenario({ icon: Icon, title, detail, tone, onClick }: { icon: typeof Droplets; title: string; detail: string; tone: Status; onClick: () => void }) { return <button className="scenario" onClick={onClick}><span className={`scenario-icon ${tone}`}><Icon /></span><span><strong>{title}</strong><small>{detail}</small></span><Play /></button> }
function LayersIcon() { return <span className="layers-icon"><i /><i /><i /></span> }
