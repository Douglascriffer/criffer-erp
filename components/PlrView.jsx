"use client";
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { 
  TrendingUp, Handshake, Users, Beaker, Wrench, Factory, Package, 
  Cpu, PenTool, ShoppingCart, ClipboardList, Megaphone, Monitor, 
  Tractor, HardHat 
} from 'lucide-react';

const CENTER_X = 1050;
const CENTER_Y = 540;
const RADIUS = 220;

const NODES = [
  { id: 'financeiro', label: 'Financeiro', x: 150, y: 150, icon: TrendingUp },
  { id: 'comercial', label: 'Comercial', x: 350, y: 150, icon: Handshake },
  { id: 'rh', label: 'RH', x: 550, y: 150, icon: Users },
  { id: 'lab_manut', label: 'Lab. Manutenção', x: 800, y: 150, icon: Beaker },
  
  { id: 'lab_calib', label: 'Lab. Calibração', x: 100, y: 350, icon: Wrench },
  { id: 'producao', label: 'Produção', x: 350, y: 350, icon: Factory },
  { id: 'logistica', label: 'Logística', x: 600, y: 350, icon: Package },
  
  { id: 'ped', label: 'P&D', x: 100, y: 550, icon: Cpu },
  { id: 'manutencao', label: 'Manutenção', x: 350, y: 550, icon: PenTool },
  { id: 'compras', label: 'Compras', x: 600, y: 550, icon: ShoppingCart },
  
  { id: 'adm', label: 'ADM', x: 100, y: 750, icon: ClipboardList },
  { id: 'marketing', label: 'Marketing', x: 350, y: 750, icon: Megaphone },
  { id: 'ti', label: 'TI', x: 600, y: 750, icon: Monitor },
  
  { id: 'locacao', label: 'Locação', x: 250, y: 900, icon: Tractor },
  { id: 'sup_tecnico', label: 'Sup. Técnico', x: 450, y: 900, icon: HardHat },
];

const CONNECTIONS = [
  ['financeiro', 'comercial'], ['comercial', 'rh'], ['rh', 'lab_manut'],
  ['financeiro', 'lab_calib'], ['comercial', 'producao'], ['rh', 'logistica'],
  ['lab_calib', 'producao'], ['producao', 'logistica'],
  ['lab_calib', 'ped'], ['producao', 'manutencao'], ['logistica', 'compras'],
  ['ped', 'manutencao'], ['manutencao', 'compras'],
  ['ped', 'adm'], ['manutencao', 'marketing'], ['compras', 'ti'],
  ['adm', 'marketing'], ['marketing', 'ti'],
  ['adm', 'locacao'], ['marketing', 'sup_tecnico'],
  ['locacao', 'sup_tecnico'],
  // to center
  ['lab_manut', 'center'], ['logistica', 'center'], ['compras', 'center'], ['ti', 'center'], ['sup_tecnico', 'center']
];

const CYLINDERS = [
  { id: 'P', x: 1650, y: 250, targetValue: 100 },
  { id: 'L', x: 1650, y: 540, targetValue: 35 },
  { id: 'R', x: 1650, y: 830, targetValue: 0 },
];

function AnimatedCounter({ from, to, delay, duration, isReady }) {
  const count = useMotionValue(from);
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!isReady) return;
    const controls = animate(count, to, {
      delay,
      duration,
      ease: "linear",
      onUpdate: (latest) => {
        setDisplay(Math.floor(latest));
      }
    });
    return controls.stop;
  }, [from, to, delay, duration, isReady]);

  return <>{display.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</>;
}

export default function PlrView({ darkMode }) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Timeline sequence
    // 0.0s - 0.5s: Phase 0 (Static)
    // 0.5s - 2.0s: Phase 1 (Nodes glowing)
    const t1 = setTimeout(() => setPhase(1), 500);
    // 2.0s - 3.0s: Phase 2 (Paths glowing)
    const t2 = setTimeout(() => setPhase(2), 2000);
    // 3.0s - 3.8s: Phase 3 (Center filling, counting 3.7M to 2M)
    const t3 = setTimeout(() => setPhase(3), 3000);
    // 3.8s - 4.5s: Phase 4 (P Cylinder filling)
    const t4 = setTimeout(() => setPhase(4), 3800);
    // 4.5s - 5.0s: Phase 5 (L Cylinder filling)
    const t5 = setTimeout(() => setPhase(5), 4500);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  if (!mounted) return null;

  const nodeGlow = phase >= 1;
  const pathFlow = phase >= 2;
  const centerFill = phase >= 3;
  const pFill = phase >= 4;
  const lFill = phase >= 5;

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#040b16', // Dark tech blue
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px solid rgba(0, 150, 255, 0.2)',
      boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', 'Gotham', sans-serif",
      color: '#ffffff'
    }}>
      
      {/* Title */}
      <h1 style={{
        position: 'absolute',
        top: '40px',
        width: '100%',
        textAlign: 'center',
        fontSize: '3.5rem',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(255,255,255,0.5)',
        zIndex: 10
      }}>A Rede de Energia</h1>

      {/* SVG Canvas for precise positioning */}
      <svg 
        viewBox="0 0 1920 1080" 
        style={{ width: '100%', height: '100%', display: 'block', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6a00" />
            <stop offset="100%" stopColor="#00c3ff" />
          </linearGradient>
          <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-intense" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* --- CONNECTIONS (Static Background Lines) --- */}
        {CONNECTIONS.map(([n1, n2], i) => {
          let x1, y1, x2, y2;
          if (n1 === 'center') { x1 = CENTER_X; y1 = CENTER_Y; }
          else { const node = NODES.find(n => n.id === n1); x1 = node.x; y1 = node.y; }
          
          if (n2 === 'center') { x2 = CENTER_X; y2 = CENTER_Y; }
          else { const node = NODES.find(n => n.id === n2); x2 = node.x; y2 = node.y; }

          return (
            <path 
              key={`bg-${i}`}
              d={`M ${x1} ${y1} Q ${(x1+x2)/2} ${y1} ${x2} ${y2}`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="6"
            />
          );
        })}

        {/* --- CYLINDER CONNECTIONS --- */}
        <path d={`M ${CENTER_X + RADIUS} ${CENTER_Y} L ${CYLINDERS[0].x - 150} ${CYLINDERS[0].y}`} fill="none" stroke="#1e293b" strokeWidth="12" />
        <path d={`M ${CENTER_X + RADIUS} ${CENTER_Y} L ${CYLINDERS[1].x - 150} ${CYLINDERS[1].y}`} fill="none" stroke="#1e293b" strokeWidth="12" />
        <path d={`M ${CENTER_X + RADIUS} ${CENTER_Y} L ${CYLINDERS[2].x - 150} ${CYLINDERS[2].y}`} fill="none" stroke="#1e293b" strokeWidth="12" />

        <path d={`M ${CENTER_X + RADIUS} ${CENTER_Y} L ${CYLINDERS[2].x - 150} ${CYLINDERS[2].y}`} fill="none" stroke="#0ea5e9" strokeWidth="6" filter="url(#glow)" />


        {/* --- CONNECTIONS (Animated Flow) --- */}
        {CONNECTIONS.map(([n1, n2], i) => {
          let x1, y1, x2, y2;
          if (n1 === 'center') { x1 = CENTER_X; y1 = CENTER_Y; }
          else { const node = NODES.find(n => n.id === n1); x1 = node.x; y1 = node.y; }
          
          if (n2 === 'center') { x2 = CENTER_X; y2 = CENTER_Y; }
          else { const node = NODES.find(n => n.id === n2); x2 = node.x; y2 = node.y; }

          return (
            <motion.path 
              key={`anim-${i}`}
              d={`M ${x1} ${y1} Q ${(x1+x2)/2} ${y1} ${x2} ${y2}`}
              fill="none"
              stroke="url(#energyGrad)"
              strokeWidth="6"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: pathFlow ? 1 : 0, 
                opacity: pathFlow ? 1 : 0 
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        })}
        {/* Animated Cylinder Connections */}
        <motion.path 
          d={`M ${CENTER_X + RADIUS} ${CENTER_Y} L ${CYLINDERS[0].x - 150} ${CYLINDERS[0].y}`} 
          fill="none" stroke="#f97316" strokeWidth="8" filter="url(#glow-intense)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: pFill ? 1 : 0, opacity: pFill ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        />
        <motion.path 
          d={`M ${CENTER_X + RADIUS} ${CENTER_Y} L ${CYLINDERS[1].x - 150} ${CYLINDERS[1].y}`} 
          fill="none" stroke="#f97316" strokeWidth="8" filter="url(#glow-intense)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: lFill ? 1 : 0, opacity: lFill ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* --- NODES (Sectors) --- */}
        {NODES.map(node => {
          const Icon = node.icon;
          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Outer Ring */}
              <motion.circle 
                r="45" fill="#020617" stroke="#ea580c" strokeWidth="4"
                animate={{ 
                  boxShadow: nodeGlow ? "0 0 20px #ea580c" : "none",
                  strokeWidth: nodeGlow ? 6 : 4
                }}
                filter={nodeGlow ? "url(#glow)" : ""}
                transition={{ duration: 0.5 }}
              />
              <text y="-60" fill="#ffffff" fontSize="18" textAnchor="middle" fontWeight="bold">
                {node.label}
              </text>
              <foreignObject x="-24" y="-24" width="48" height="48">
                <Icon size={48} color={nodeGlow ? "#f97316" : "#64748b"} style={{ filter: nodeGlow ? 'drop-shadow(0 0 8px #f97316)' : 'none', transition: 'all 0.5s' }} />
              </foreignObject>
            </g>
          );
        })}

        {/* --- CENTRAL CIRCLE --- */}
        <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
          {/* Base Background */}
          <circle r={RADIUS} fill="#020617" stroke="#1e293b" strokeWidth="8" />
          
          {/* Left Red Semi-circle */}
          <path d={`M 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 0 0 ${RADIUS}`} fill="none" stroke="#dc2626" strokeWidth="16" />
          {/* Right Green Semi-circle */}
          <path d={`M 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${RADIUS}`} fill="none" stroke="#16a34a" strokeWidth="16" />
          
          {/* Glowing Overlays */}
          <motion.path 
            d={`M 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 0 0 ${RADIUS}`} fill="none" stroke="#ef4444" strokeWidth="20" filter="url(#glow-intense)"
            initial={{ opacity: 0 }}
            animate={{ opacity: centerFill ? 1 : 0 }}
          />
          <motion.path 
            d={`M 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${RADIUS}`} fill="none" stroke="#22c55e" strokeWidth="20" filter="url(#glow-intense)"
            initial={{ opacity: 0 }}
            animate={{ opacity: centerFill ? 1 : 0 }}
          />

          {/* Central Counter Value */}
          <text y="15" fill="#ffffff" fontSize="64" textAnchor="middle" fontWeight="bold" style={{ textShadow: centerFill ? '0 0 20px #ffffff' : 'none' }}>
            <AnimatedCounter 
              from={3700000} 
              to={2000000} 
              delay={0} 
              duration={1.5} 
              isReady={centerFill} 
            />
          </text>
        </g>

        {/* --- CYLINDERS --- */}
        {CYLINDERS.map(cyl => {
          const w = 240;
          const h = 140;
          
          let fillPercent = 0;
          if (cyl.id === 'P' && pFill) fillPercent = 100;
          if (cyl.id === 'L' && lFill) fillPercent = 35;

          const innerW = w - 20;

          return (
            <g key={cyl.id} transform={`translate(${cyl.x}, ${cyl.y})`}>
              {/* Outer Shell */}
              <rect x={-w/2} y={-h/2} width={w} height={h} fill="url(#cylinderGrad)" stroke="#475569" strokeWidth="4" rx="10" />
              <rect x={-w/2 - 10} y={-h/2 - 5} width="20" height={h + 10} fill="#1e293b" rx="5" />
              <rect x={w/2 - 10} y={-h/2 - 5} width="20" height={h + 10} fill="#1e293b" rx="5" />

              {/* Empty state glass reflection */}
              <rect x={-innerW/2} y={-h/2 + 10} width={innerW} height={h - 20} fill="#020617" rx="5" />
              
              {/* Liquid Fill */}
              <motion.g 
                initial={{ clipPath: `inset(0 100% 0 0)` }}
                animate={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <rect x={-innerW/2} y={-h/2 + 10} width={innerW} height={h - 20} fill="url(#liquidGrad)" rx="5" filter="url(#glow)" />
                {/* Bubble Particles (simple CSS overlay simulation in SVG) */}
                {cyl.id === 'L' && (
                  <>
                    <circle cx="-50" cy="20" r="4" fill="#ffffff" opacity="0.5" />
                    <circle cx="-10" cy="-30" r="6" fill="#ffffff" opacity="0.6" />
                    <circle cx="-80" cy="-10" r="3" fill="#ffffff" opacity="0.4" />
                    <circle cx="-30" cy="40" r="5" fill="#ffffff" opacity="0.5" />
                  </>
                )}
              </motion.g>

              {/* Percentage Text */}
              <text x="0" y="15" fill="#ffffff" fontSize="48" textAnchor="middle" fontWeight="bold">
                <AnimatedCounter from={0} to={fillPercent} delay={0} duration={0.7} isReady={cyl.id === 'P' ? pFill : lFill} />%
              </text>
              
              {/* Cylinder Label (P, L, R) */}
              <text x={w/2 + 60} y="20" fill="#ffffff" fontSize="64" textAnchor="middle" fontWeight="bold" filter="url(#glow)">
                {cyl.id}
              </text>
            </g>
          );
        })}

        {/* Outer decorative borders */}
        <path d="M 50 50 L 1870 50 L 1870 1030 L 50 1030 Z" fill="none" stroke="#1e293b" strokeWidth="2" />
        <circle cx="50" cy="50" r="10" fill="#0ea5e9" filter="url(#glow)" />
        <circle cx="1870" cy="50" r="10" fill="#0ea5e9" filter="url(#glow)" />
        <circle cx="50" cy="1030" r="10" fill="#0ea5e9" filter="url(#glow)" />
        <circle cx="1870" cy="1030" r="10" fill="#0ea5e9" filter="url(#glow)" />

      </svg>
    </div>
  );
}
