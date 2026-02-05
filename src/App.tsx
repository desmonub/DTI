import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Shield, AlertTriangle, 
  CheckCircle, Lightbulb, Target, Heart, 
  Zap, ChevronRight, ChevronLeft, Play,
  UserCheck, Camera, Radio, Stethoscope
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Detailed Storyboard frames based on actual venue map
const storyboardFrames = [
  {
    id: 1,
    scene: "Scene 1: Arrival & Approach",
    title: "Students Enter from Open Campus Area",
    visual: "approach",
    peak: "Queue forms at both entry points (Green: General Entry, Pink: Specially-Abled Entry). Volunteers with signboards direct students. Digital displays show current crowd capacity (~4,200/5,000). Students with time-slot tickets get priority access. Security personnel positioned at queue start.",
    nonPeak: "Students walk freely from Open Campus Area to entry points. No queues. Friendly volunteers welcome attendees. Capacity display shows ~800/5,000. Casual atmosphere with photo opportunities near entrance signage.",
    elements: ["2 Entry Points", "Queue Markers", "Digital Capacity Display", "Volunteer Guides", "Security Checkpoint"],
    constraints: ["Max 5,000 capacity", "2 entry gates only", "ID verification mandatory"],
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 2,
    scene: "Scene 2: Entry & Security Screening",
    title: "ID Check at Designated Entry Gates",
    visual: "entry",
    peak: "All entry gates operational: Green Gate (General) processes 200 students/min, Pink Gate (Specially-Abled) has ramp access. Bag screening at both gates. Thermal sensors at entry detect crowd buildup. Guards monitor via CCTV. Students directed to least crowded zones based on real-time density data.",
    nonPeak: "Single Green Gate operational. Quick ID verification (~10 seconds per student). No bag screening required. Guards at relaxed positions. Students freely choose viewing spots. Thermal sensors on standby.",
    elements: ["ID Verification", "Bag Screening", "Thermal Sensors", "CCTV Monitoring", "Guard Posts"],
    constraints: ["Green Gate: General Entry", "Pink Gate: Accessible Entry", "No re-entry without stamp"],
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    scene: "Scene 3: Movement Through Crowd Zone",
    title: "Navigating to Viewing Area",
    visual: "movement",
    peak: "One-way circulation enforced via removable barricades (dotted line on map). Color-coded floor markings: Yellow arrows guide to side exits, Green arrows show entry flow. Thermal sensors on side walls monitor zone density. Guards positioned every 15 meters. Strong barricade (thick black line) separates crowd from stage area. Students in high-density zones (>80%) redirected to lower density areas.",
    nonPeak: "Free movement throughout Crowd Zone. Removable barricades opened for flexible routing. Students explore different viewing angles. Easy access to all areas. Guards at perimeter positions only. No flow restrictions.",
    elements: ["Removable Barricades", "Floor Markings", "Side Thermal Sensors", "Guard Positions", "Density Monitors"],
    constraints: ["Strong barricade: Non-removable", "Stage area: Restricted", "Max density: 5 people/m²"],
    color: "from-amber-500 to-orange-600"
  },
  {
    id: 4,
    scene: "Scene 4: Performance Experience",
    title: "Viewing from Crowd Zone Near Stage",
    visual: "experience",
    peak: "Crowd Zone at ~85% capacity (4,250 people). Strong barricade (non-removable) maintains 3-meter safety buffer from stage. Guards positioned along barricade every 5 meters. CCTV cameras at stage corners monitor crowd behavior. Thermal sensors detect any surge toward stage. Celebrity entry/exit (Blue/Purple arrows at top) completely separate from crowd flow. Stairs on stage left for performer access.",
    nonPeak: "Crowd Zone at ~30% capacity (1,500 people). Students can approach closer to strong barricade. Relaxed viewing with space to move. Guards at stage corners only. CCTV recording continues. Opportunity for better photos and videos.",
    elements: ["Strong Barricade", "Stage Buffer Zone", "CCTV Coverage", "Celebrity Entry/Exit", "Guard Cordon"],
    constraints: ["3m minimum from stage", "No crossing strong barricade", "Celebrity access: Separate"],
    color: "from-rose-500 to-pink-600"
  },
  {
    id: 5,
    scene: "Scene 5: Exit & Emergency Protocols",
    title: "Departure via Designated Exit Points",
    visual: "exit",
    peak: "Staggered exit activated. Yellow arrows: Regular exits (left/right sides) for controlled crowd. Red arrows: Emergency exits (same locations) activated if density exceeds safe threshold. Guards guide flow to prevent bottlenecks. Thermal sensors monitor exit congestion. All exits lead to Open Campus Area. Emergency response team on standby. Medical aid station near exit.",
    nonPeak: "Regular exits (Yellow arrows) handle flow smoothly. Students exit at own pace through left or right side. No congestion. Guards at exit positions for general assistance. Emergency exits remain closed but monitored.",
    elements: ["2 Regular Exits", "2 Emergency Exits", "Exit Signage", "Medical Station", "Emergency Team"],
    constraints: ["Emergency exits: Staff-only activation", "Evacuation target: <5 min", "No re-entry after exit"],
    color: "from-blue-500 to-cyan-600"
  }
];

// Stakeholder insights
const stakeholderInsights = [
  { 
    role: "Student Participants", 
    concern: "Long waits & overcrowding anxiety",
    solution: "Time-slot entry + 2 entry gates + real-time capacity display",
    icon: Users 
  },
  { 
    role: "Performers/Artists", 
    concern: "Backstage safety & quick access",
    solution: "Dedicated Blue entry + Purple exit + strong barricade protection",
    icon: Zap 
  },
  { 
    role: "Volunteers", 
    concern: "Managing crowd surge & communication",
    solution: "Radio comms + clear protocols + thermal sensor alerts",
    icon: UserCheck 
  },
  { 
    role: "Security Staff", 
    concern: "Emergency response & evacuation",
    solution: "CCTV coverage + guard posts every 15m + emergency exits",
    icon: Shield 
  }
];

// Problem statements
const problemStatements = [
  "How might we manage continuous crowd inflow/outflow in a 24x7 setting with only 2 entry points?",
  "How might we prevent congestion at entry, exit, and the strong barricade zone during peak hours?",
  "How might we ensure safety with 5,000 max capacity while maintaining festive experience?"
];

// Solutions mapped to venue elements
const solutions = [
  { 
    category: "Entry/Exit Management", 
    items: [
      "Green Gate: General entry (bottom center)", 
      "Pink Gate: Specially-abled entry (bottom left)", 
      "Yellow exits: Regular crowd exit (left/right)",
      "Red exits: Emergency only (same locations)"
    ] 
  },
  { 
    category: "Zone Control", 
    items: [
      "Strong barricade: Non-removable stage protection",
      "Removable barricades: Flexible crowd routing", 
      "Crowd Zone: Max 5,000 capacity",
      "Stage Buffer: 3-meter safety zone"
    ] 
  },
  { 
    category: "Safety Infrastructure", 
    items: [
      "CCTV cameras: Stage corners + entry points",
      "Thermal sensors: Side walls + entry gates", 
      "Security guards: Every 15m in peak hours",
      "Medical station: Near exit points"
    ] 
  }
];

// Safety infrastructure from map
const safetyFeatures = [
  { icon: Camera, label: "CCTV Cameras", value: "6+", desc: "Stage corners & entries" },
  { icon: Radio, label: "Thermal Sensors", value: "8+", desc: "Side walls & gates" },
  { icon: Shield, label: "Security Guards", value: "15+", desc: "Strategic posts" },
  { icon: Stethoscope, label: "Medical Aid", value: "On-site", desc: "Near exits" }
];

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

// Detailed Visual Scene Component based on actual venue map
function SceneVisual({ isPeak }: { isPeak: boolean }) {
  const crowdCount = isPeak ? 20 : 6;
  console.log('SceneVisual rendering - isPeak:', isPeak, 'crowdCount:', crowdCount);
  
  return (
    <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border-2 border-slate-200" style={{ minHeight: '400px' }}>
      <svg className="w-full h-full" viewBox="0 0 500 280" preserveAspectRatio="xMidYMid meet" style={{ minHeight: '400px', display: 'block' }}>
        <defs>
          <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#2563eb" />
          </marker>
          <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#9333ea" />
          </marker>
          <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#16a34a" />
          </marker>
          <marker id="arrowPink" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#ec4899" />
          </marker>
          <marker id="arrowYellow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#eab308" />
          </marker>
          <marker id="arrowYellow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#eab308" />
          </marker>
          <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#dc2626" />
          </marker>
          <marker id="arrowRed2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#dc2626" />
          </marker>
        </defs>
        
        {/* Background */}
        <rect width="500" height="280" fill="#f8fafc" />
        
        {/* Main venue outline */}
        <rect x="50" y="20" width="400" height="240" fill="none" stroke="#334155" strokeWidth="3" rx="4" />
        
        {/* Open Campus Area labels */}
        <text x="10" y="140" fontSize="10" fill="#64748b" transform="rotate(-90 10 140)">Open Campus Area</text>
        <text x="490" y="140" fontSize="10" fill="#64748b" transform="rotate(90 490 140)">Open Campus Area</text>
        
        {/* --- STAGE AREA (Top Section) --- */}
        <rect x="150" y="30" width="200" height="60" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" rx="2" />
        <text x="250" y="65" fontSize="16" fill="#4338ca" textAnchor="middle" fontWeight="bold">STAGE</text>
        
        {/* Stairs on stage left */}
        <g transform="translate(120, 40)">
          <line x1="0" y1="0" x2="20" y2="0" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="8" x2="20" y2="8" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="16" x2="20" y2="16" stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="24" x2="20" y2="24" stroke="#64748b" strokeWidth="2" />
          <text x="10" y="40" fontSize="8" fill="#64748b" textAnchor="middle">Stairs</text>
        </g>
        
        {/* Celebrity Entry (Blue) - Top center */}
        <line x1="250" y1="20" x2="250" y2="30" stroke="#2563eb" strokeWidth="4" markerEnd="url(#arrowBlue)" />
        <text x="270" y="25" fontSize="9" fill="#2563eb">Celebrity Entry</text>
        
        {/* Celebrity Exit (Purple) - Top center going up */}
        <line x1="270" y1="30" x2="270" y2="20" stroke="#9333ea" strokeWidth="3" markerEnd="url(#arrowPurple)" />
        <text x="285" y="18" fontSize="9" fill="#9333ea">Celebrity Exit</text>
        
        {/* --- STRONG BARRICADE (Non-removable) --- */}
        <line x1="50" y1="100" x2="450" y2="100" stroke="#0f172a" strokeWidth="8" />
        <text x="460" y="105" fontSize="8" fill="#0f172a">Strong Barricade</text>
        
        {/* --- REMOVABLE BARRICADES (Dotted) --- */}
        <line x1="50" y1="140" x2="450" y2="140" stroke="#64748b" strokeWidth="3" strokeDasharray="8,4" />
        <text x="460" y="145" fontSize="8" fill="#64748b">Removable</text>
        
        {/* --- CROWD ZONE LABEL --- */}
        <text x="250" y="200" fontSize="20" fill="#94a3b8" textAnchor="middle" fontWeight="bold" opacity="0.5">Crowd Zone</text>
        
        {/* --- ENTRY POINTS (Bottom) --- */}
        {/* Green: General Entry - Bottom center */}
        <line x1="250" y1="260" x2="250" y2="240" stroke="#16a34a" strokeWidth="5" markerEnd="url(#arrowGreen)" />
        <text x="250" y="275" fontSize="10" fill="#16a34a" textAnchor="middle" fontWeight="bold">General Entry</text>
        
        {/* Pink: Specially-Abled Entry - Bottom left */}
        <line x1="120" y1="260" x2="120" y2="240" stroke="#ec4899" strokeWidth="5" markerEnd="url(#arrowPink)" />
        <text x="120" y="275" fontSize="9" fill="#ec4899" textAnchor="middle">Accessible Entry</text>
        
        {/* --- EXIT POINTS (Sides) --- */}
        {/* Yellow: Regular Exit Left */}
        <line x1="50" y1="180" x2="20" y2="180" stroke="#eab308" strokeWidth="4" markerEnd="url(#arrowYellow)" />
        
        {/* Yellow: Regular Exit Right */}
        <line x1="450" y1="180" x2="480" y2="180" stroke="#eab308" strokeWidth="4" markerEnd="url(#arrowYellow2)" />
        <text x="465" y="195" fontSize="8" fill="#eab308" textAnchor="middle">Regular Exit</text>
        
        {/* Red: Emergency Exit Left */}
        <line x1="50" y1="120" x2="20" y2="120" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowRed)" opacity={isPeak ? 1 : 0.3} />
        
        {/* Red: Emergency Exit Right */}
        <line x1="450" y1="120" x2="480" y2="120" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowRed2)" opacity={isPeak ? 1 : 0.3} />
        {isPeak && <text x="465" y="110" fontSize="8" fill="#dc2626" textAnchor="middle" fontWeight="bold">EMERGENCY</text>}
        
        {/* --- CROWD DOTS --- */}
        {Array.from({ length: crowdCount }).map((_, i) => {
          const x = 80 + (i % 7) * 50 + ((i * 17) % 30);
          const y = 160 + Math.floor(i / 7) * 25 + ((i * 23) % 20);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={isPeak ? 5 : 7}
              fill={isPeak ? '#ef4444' : '#3b82f6'}
              opacity={0.8}
            />
          );
        })}
        
        {/* --- GUARD POSITIONS (Stick figures) --- */}
        {/* Guards at strong barricade */}
        <circle cx="100" cy="100" r="6" fill="#10b981" />
        <text x="97" y="104" fontSize="8" fill="white">G</text>
        
        <circle cx="250" cy="100" r="6" fill="#10b981" />
        <text x="247" y="104" fontSize="8" fill="white">G</text>
        
        <circle cx="400" cy="100" r="6" fill="#10b981" />
        <text x="397" y="104" fontSize="8" fill="white">G</text>
        
        {/* Guards at removable barricade */}
        <circle cx="80" cy="140" r="6" fill="#10b981" />
        <text x="77" y="144" fontSize="8" fill="white">G</text>
        
        <circle cx="420" cy="140" r="6" fill="#10b981" />
        <text x="417" y="144" fontSize="8" fill="white">G</text>
        
        {/* Guards at entry */}
        <circle cx="120" cy="240" r="6" fill="#10b981" />
        <text x="117" y="244" fontSize="8" fill="white">G</text>
        
        <circle cx="250" cy="240" r="6" fill="#10b981" />
        <text x="247" y="244" fontSize="8" fill="white">G</text>
        
        {/* --- CCTV CAMERAS --- */}
        {/* Stage corners */}
        <rect x="55" y="35" width="12" height="8" fill="#6366f1" rx="1" />
        <text x="58" y="41" fontSize="6" fill="white">C</text>
        
        <rect x="433" y="35" width="12" height="8" fill="#6366f1" rx="1" />
        <text x="436" y="41" fontSize="6" fill="white">C</text>
        
        {/* Entry points */}
        <rect x="55" y="220" width="12" height="8" fill="#6366f1" rx="1" />
        <text x="58" y="226" fontSize="6" fill="white">C</text>
        
        <rect x="433" y="220" width="12" height="8" fill="#6366f1" rx="1" />
        <text x="436" y="226" fontSize="6" fill="white">C</text>
        
        {/* --- THERMAL SENSORS --- */}
        {/* Side walls */}
        <circle cx="60" cy="160" r="5" fill="#f97316" opacity="0.8" />
        <text x="57" y="163" fontSize="5" fill="white">T</text>
        
        <circle cx="60" cy="200" r="5" fill="#f97316" opacity="0.8" />
        <text x="57" y="203" fontSize="5" fill="white">T</text>
        
        <circle cx="440" cy="160" r="5" fill="#f97316" opacity="0.8" />
        <text x="437" y="163" fontSize="5" fill="white">T</text>
        
        <circle cx="440" cy="200" r="5" fill="#f97316" opacity="0.8" />
        <text x="437" y="203" fontSize="5" fill="white">T</text>
        
        {/* At entry */}
        <circle cx="140" cy="235" r="5" fill="#f97316" opacity="0.8" />
        <text x="137" y="238" fontSize="5" fill="white">T</text>
        
        <circle cx="270" cy="235" r="5" fill="#f97316" opacity="0.8" />
        <text x="267" y="238" fontSize="5" fill="white">T</text>
        
        {/* Capacity indicator */}
        <rect x="360" y="245" width="80" height="25" fill="white" stroke="#64748b" strokeWidth="1" rx="2" />
        <text x="400" y="255" fontSize="8" fill="#64748b" textAnchor="middle">Capacity</text>
        <text x="400" y="267" fontSize="10" fill={isPeak ? '#ef4444' : '#16a34a'} textAnchor="middle" fontWeight="bold">
          {isPeak ? '4,200 / 5,000' : '1,200 / 5,000'}
        </text>
      </svg>
      
      {/* Scene label and Legend below SVG */}
      <div className="px-4 py-3 bg-white">
        <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-3 ${
          isPeak ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
        }`}>
          {isPeak ? 'PEAK HOURS (85% Capacity)' : 'NON-PEAK (25% Capacity)'}
        </div>
        
        {/* Legend */}
        <div className="bg-slate-50 p-3 rounded text-xs space-y-1 border border-slate-200">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span>General Entry</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500 rounded-sm"></div><span>Accessible Entry</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div><span>Regular Exit</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div><span>Emergency Exit</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-slate-900"></div><span>Strong Barricade</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 border-t-2 border-dashed border-slate-500"></div><span>Removable</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Storyboard Panel Component
function StoryboardPanel({ frame }: { frame: typeof storyboardFrames[0] }) {
  const [showPeak, setShowPeak] = useState(true);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 border-slate-200 shadow-lg">
        {/* Panel Header */}
        <div className={`bg-gradient-to-r ${frame.color} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">{frame.scene}</p>
              <h3 className="text-xl font-bold mt-1">{frame.title}</h3>
            </div>
            <div className="text-5xl font-bold opacity-20">{String(frame.id).padStart(2, '0')}</div>
          </div>
        </div>
        
        <CardContent className="p-6">
          {/* Toggle for Peak/Non-Peak */}
          <div className="flex justify-center mb-5">
            <div className="bg-slate-100 p-1 rounded-lg flex shadow-inner">
              <button
                onClick={() => setShowPeak(true)}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  showPeak 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Peak Hours (High Density)
              </button>
              <button
                onClick={() => setShowPeak(false)}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  !showPeak 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Non-Peak (Low Density)
              </button>
            </div>
          </div>
          
          {/* Visual Scene */}
          <SceneVisual isPeak={showPeak} />
          
          {/* Scene Description */}
          <div className={`mt-5 p-4 rounded-lg border-l-4 ${
            showPeak ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'
          }`}>
            <p className={`text-sm font-semibold mb-2 ${showPeak ? 'text-red-700' : 'text-emerald-700'}`}>
              {showPeak ? 'Peak Hours Scenario:' : 'Non-Peak Hours Scenario:'}
            </p>
            <p className="text-slate-700 leading-relaxed text-sm">
              {showPeak ? frame.peak : frame.nonPeak}
            </p>
          </div>
          
          {/* Key Elements & Constraints */}
          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Key Elements</p>
              <div className="flex flex-wrap gap-2">
                {frame.elements.map((element, i) => (
                  <Badge key={i} variant="secondary" className="text-xs bg-slate-100">
                    {element}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Constraints</p>
              <div className="flex flex-wrap gap-2">
                {frame.constraints.map((constraint, i) => (
                  <Badge key={i} className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                    {constraint}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Main App
function App() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showVenueMap, setShowVenueMap] = useState(false);
  const [activeSection, setActiveSection] = useState<'storyboard' | 'empathize' | 'define' | 'ideate' | 'prototype' | 'test'>('storyboard');

  const nextFrame = () => {
    setDirection(1);
    setCurrentFrame((prev) => (prev + 1) % storyboardFrames.length);
  };

  const prevFrame = () => {
    setDirection(-1);
    setCurrentFrame((prev) => (prev - 1 + storyboardFrames.length) % storyboardFrames.length);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">German Hanger Crowd Management</h1>
              <p className="text-sm text-slate-400">Design Thinking Storyboard | Bennett University Cultural Fest</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-600">24x7 Event</Badge>
              <Badge className="bg-emerald-600">Max 5,000</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {[
              { id: 'storyboard', label: 'Storyboard', icon: Play },
              { id: 'empathize', label: 'Empathize', icon: Heart },
              { id: 'define', label: 'Define', icon: Target },
              { id: 'ideate', label: 'Ideate', icon: Lightbulb },
              { id: 'prototype', label: 'Prototype', icon: Zap },
              { id: 'test', label: 'Test', icon: CheckCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as unknown as typeof activeSection)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                    activeSection === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* STORYBOARD SECTION */}
          {activeSection === 'storyboard' && (
            <motion.div
              key="storyboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {storyboardFrames.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentFrame ? 1 : -1);
                      setCurrentFrame(i);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === currentFrame ? 'bg-purple-600 w-10' : 'bg-slate-300 w-4 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              {/* Main Storyboard Panel */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Frame Navigation */}
                <div className="lg:col-span-1 space-y-4">
                  <h2 className="text-lg font-bold text-slate-800">Storyboard Frames</h2>
                  <p className="text-sm text-slate-500">Click to navigate between scenes</p>
                  <div className="space-y-2">
                    {storyboardFrames.map((frame, i) => (
                      <button
                        key={frame.id}
                        onClick={() => {
                          setDirection(i > currentFrame ? 1 : -1);
                          setCurrentFrame(i);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          i === currentFrame
                            ? 'bg-purple-100 border-2 border-purple-500 shadow-md'
                            : 'bg-white border-2 border-transparent hover:bg-slate-100 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            i === currentFrame ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {frame.id}
                          </span>
                          <div>
                            <p className="font-medium text-sm">{frame.scene}</p>
                            <p className="text-xs text-slate-500 line-clamp-1">{frame.title}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Venue Map Toggle */}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowVenueMap(!showVenueMap)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {showVenueMap ? 'Hide' : 'Show'} Full Venue Map
                  </Button>
                </div>

                {/* Right: Active Frame */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentFrame}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <StoryboardPanel frame={storyboardFrames[currentFrame]} />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={prevFrame}
                      disabled={currentFrame === 0}
                      className="px-6"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous Scene
                    </Button>
                    <span className="flex items-center text-sm text-slate-500">
                      Scene {currentFrame + 1} of {storyboardFrames.length}
                    </span>
                    <Button
                      onClick={nextFrame}
                      disabled={currentFrame === storyboardFrames.length - 1}
                      className="bg-purple-600 hover:bg-purple-700 px-6"
                    >
                      Next Scene
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Venue Map Modal */}
              <AnimatePresence>
                {showVenueMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6"
                  >
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-4">German Hanger Venue Layout - Detailed Map</h3>
                        <img 
                          src="/venue-map.png" 
                          alt="Venue Map" 
                          className="w-full max-w-4xl mx-auto rounded-lg border"
                        />
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-green-50 p-3 rounded">
                            <p className="font-semibold text-green-700">General Entry</p>
                            <p className="text-green-600 text-xs">Green arrow - Bottom center</p>
                          </div>
                          <div className="bg-pink-50 p-3 rounded">
                            <p className="font-semibold text-pink-700">Accessible Entry</p>
                            <p className="text-pink-600 text-xs">Pink arrow - Bottom left</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded">
                            <p className="font-semibold text-yellow-700">Regular Exits</p>
                            <p className="text-yellow-600 text-xs">Yellow arrows - Left & Right</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded">
                            <p className="font-semibold text-red-700">Emergency Exits</p>
                            <p className="text-red-600 text-xs">Red arrows - Staff activated</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* EMPATHIZE SECTION */}
          {activeSection === 'empathize' && (
            <motion.div
              key="empathize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Understanding Stakeholders</h2>
                <p className="text-slate-600 mt-2">Who are we designing for and what do they need?</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stakeholderInsights.map((stakeholder, i) => {
                  const Icon = stakeholder.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                            <Icon className="w-6 h-6 text-rose-600" />
                          </div>
                          <h3 className="font-bold text-slate-800 mb-2">{stakeholder.role}</h3>
                          <div className="space-y-2">
                            <div className="bg-red-50 p-2 rounded">
                              <p className="text-xs text-red-600 font-medium">Concern:</p>
                              <p className="text-sm text-slate-700">{stakeholder.concern}</p>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded">
                              <p className="text-xs text-emerald-600 font-medium">Solution:</p>
                              <p className="text-sm text-slate-700">{stakeholder.solution}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* DEFINE SECTION */}
          {activeSection === 'define' && (
            <motion.div
              key="define"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Problem Definition</h2>
                <p className="text-slate-600 mt-2">Framing the core challenges</p>
              </div>

              <div className="space-y-4 max-w-3xl mx-auto">
                {problemStatements.map((problem, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <Card className="border-l-4 border-l-amber-500">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-amber-700 font-bold">{i + 1}</span>
                          </div>
                          <p className="text-lg text-slate-700">
                            <span className="font-bold text-amber-600">How might we</span> {problem.replace('How might we ', '')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
                {[
                  { label: 'Duration', value: '24x7' },
                  { label: 'Max Capacity', value: '5,000' },
                  { label: 'Entry Points', value: '2' },
                  { label: 'Safety Goal', value: 'Zero Incidents' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-4 rounded-xl shadow text-center"
                  >
                    <p className="text-2xl font-bold text-amber-600">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* IDEATE SECTION */}
          {activeSection === 'ideate' && (
            <motion.div
              key="ideate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Solution Ideas</h2>
                <p className="text-slate-600 mt-2">Brainstorming crowd management strategies</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {solutions.map((solution, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <Card className="h-full">
                      <div className="bg-yellow-100 p-4">
                        <h3 className="font-bold text-yellow-800">{solution.category}</h3>
                      </div>
                      <CardContent className="p-4">
                        <ul className="space-y-2">
                          {solution.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROTOTYPE SECTION */}
          {activeSection === 'prototype' && (
            <motion.div
              key="prototype"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Conceptual Design</h2>
                <p className="text-slate-600 mt-2">Visual layout and safety infrastructure</p>
              </div>

              <Card className="mb-6 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">German Hanger Venue Map</h3>
                  <img 
                    src="/venue-map.png" 
                    alt="Venue Map" 
                    className="w-full max-w-4xl mx-auto rounded-lg border"
                  />
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-4 gap-4">
                {safetyFeatures.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Icon className="w-6 h-6 text-emerald-600" />
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">{feature.value}</p>
                          <p className="font-medium text-slate-800">{feature.label}</p>
                          <p className="text-xs text-slate-500">{feature.desc}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TEST SECTION */}
          {activeSection === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Testing & Validation</h2>
                <p className="text-slate-600 mt-2">Risk assessment and failure mitigation</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { 
                    risk: 'Entry bottleneck with only 2 entry gates during peak',
                    mitigation: 'Time-slot tickets + 200 students/min processing rate + queue management'
                  },
                  { 
                    risk: 'Crowd surge toward stage breaking strong barricade',
                    mitigation: '3-meter buffer zone + guard cordon every 5m + thermal surge alerts'
                  },
                  { 
                    risk: 'Emergency evacuation with 5,000 people',
                    mitigation: '4 exit points (2 regular + 2 emergency) + staggered exit protocol'
                  },
                  { 
                    risk: 'Medical emergency in dense crowd zone',
                    mitigation: 'Medical station near exits + quick access paths + ambulance standby'
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-700 mb-2">{item.risk}</p>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-slate-600">{item.mitigation}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">Emergency Evacuation Target</h3>
                    <p className="text-5xl font-bold">&lt; 5 Minutes</p>
                    <p className="text-blue-100 mt-2">Full venue clearance for 5,000 people via 4 exit points</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-medium">MBA I Year - Design Thinking Assignment</p>
          <p className="text-sm mt-1">Aaditya (M25MBAG0037) Shayan (M25MBAG0053) Syed Emadullah (M25MBAG0007) Ishita (M25MBAG0017)</p>
        </div>
      </footer>
    </div>
  );
}

export default App;



