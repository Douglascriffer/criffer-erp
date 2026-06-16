"use client";
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

const CENTER_X = 1045; // Adjusted to match typical image centers
const CENTER_Y = 515;
const RADIUS = 180;

// Approximated coordinates based on standard 16:9 1920x1080 layouts
const NODES = [
  { id: 'financeiro', x: 175, y: 215 },
  { id: 'comercial', x: 395, y: 215 },
  { id: 'rh', x: 615, y: 215 },
  { id: 'lab_manut', x: 865, y: 215 },
  
  { id: 'lab_calib', x: 105, y: 395 },
  { id: 'producao', x: 395, y: 395 },
  { id: 'logistica', x: 615, y: 395 },
  
  { id: 'ped', x: 105, y: 555 },
  { id: 'manutencao', x: 395, y: 555 },
  { id: 'compras', x: 615, y: 555 },
  
  { id: 'adm', x: 105, y: 715 },
  { id: 'marketing', x: 395, y: 715 },
  { id: 'ti', x: 615, y: 715 },
  
  { id: 'locacao', x: 265, y: 865 },
  { id: 'sup_tecnico', x: 535, y: 865 },
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
  ['lab_manut', 'center'], ['logistica', 'center'], ['compras', 'center'], ['ti', 'center'], ['sup_tecnico', 'center']
];

const CYLINDERS = [
  { id: 'P', x: 1650, y: 260, targetValue: 100 },
  { id: 'L', x: 1650, y: 515, targetValue: 35 },
  { id: 'R', x: 1650, y: 770, targetValue: 0 },
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
    
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => setPhase(3), 3000);
    const t4 = setTimeout(() => setPhase(4), 3800);
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
      aspectRatio: '16/9',
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Gotham', sans-serif",
      color: '#ffffff',
      background: '#000'
    }}>
      
      {/* Background Image (Base) */}
      <img 
        src="/bg-rede-energia-1.png" 
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
        alt="Rede de Energia Base"
      />

      {/* SVG Canvas for Overlays and Animations */}
      <svg 
        viewBox="0 0 1920 1080" 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}
      >
        <defs>
          <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6a00" />
            <stop offset="100%" stopColor="#00c3ff" />
          </linearGradient>
          <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Masking static numbers on the image so we can animate our own */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={120} fill="#060b13" />
        <rect x={CYLINDERS[0].x - 80} y={CYLINDERS[0].y - 30} width={160} height={60} fill="#09101b" rx="8" />
        <rect x={CYLINDERS[1].x - 80} y={CYLINDERS[1].y - 30} width={160} height={60} fill="#09101b" rx="8" />
        <rect x={CYLINDERS[2].x - 80} y={CYLINDERS[2].y - 30} width={160} height={60} fill="#09101b" rx="8" />

        {/* --- CONNECTIONS (Animated Flow) --- */}
        {CONNECTIONS.map(([n1, n2], i) => {
          let x1, y1, x2, y2;
          if (n1 === 'center') { x1 = CENTER_X - 180; y1 = CENTER_Y; }
          else { const node = NODES.find(n => n.id === n1); x1 = node.x; y1 = node.y; }
          
          if (n2 === 'center') { x2 = CENTER_X - 180; y2 = CENTER_Y; }
          else { const node = NODES.find(n => n.id === n2); x2 = node.x; y2 = node.y; }

          return (
            <motion.path 
              key={`anim-${i}`}
              d={`M ${x1} ${y1} Q ${(x1+x2)/2} ${y1} ${x2} ${y2}`}
              fill="none"
              stroke="url(#energyGrad)"
              strokeWidth="4"
              filter="url(#glow)"
              style={{ mixBlendMode: 'screen' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: pathFlow ? 1 : 0, 
                opacity: pathFlow ? 0.8 : 0 
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          );
        })}
        
        {/* Animated Cylinder Connections */}
        <motion.path 
          d={`M ${CENTER_X + RADIUS + 10} ${CENTER_Y} L ${CYLINDERS[0].x - 170} ${CYLINDERS[0].y}`} 
          fill="none" stroke="#f97316" strokeWidth="8" filter="url(#glow)"
          style={{ mixBlendMode: 'screen' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: pFill ? 1 : 0, opacity: pFill ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        />
        <motion.path 
          d={`M ${CENTER_X + RADIUS + 10} ${CENTER_Y} L ${CYLINDERS[1].x - 170} ${CYLINDERS[1].y}`} 
          fill="none" stroke="#f97316" strokeWidth="8" filter="url(#glow)"
          style={{ mixBlendMode: 'screen' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: lFill ? 1 : 0, opacity: lFill ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* --- NODES (Sectors) Glow --- */}
        {NODES.map(node => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <motion.circle 
              r="55" fill="none" stroke="#ea580c" strokeWidth="6"
              style={{ mixBlendMode: 'screen' }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: nodeGlow ? 1 : 0,
                scale: nodeGlow ? [1, 1.1, 1] : 1
              }}
              filter="url(#glow)"
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            />
          </g>
        ))}

        {/* --- CENTRAL CIRCLE OVERLAY --- */}
        <g transform={`translate(${CENTER_X}, ${CENTER_Y})`}>
          <motion.path 
            d={`M 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 0 0 ${RADIUS}`} fill="none" stroke="#ef4444" strokeWidth="20" filter="url(#glow)"
            style={{ mixBlendMode: 'screen' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: centerFill ? 0.8 : 0 }}
          />
          <motion.path 
            d={`M 0 ${-RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 0 ${RADIUS}`} fill="none" stroke="#22c55e" strokeWidth="20" filter="url(#glow)"
            style={{ mixBlendMode: 'screen' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: centerFill ? 0.8 : 0 }}
          />

          <text y="20" fill="#ffffff" fontSize="56" textAnchor="middle" fontWeight="bold" style={{ textShadow: centerFill ? '0 0 20px #ffffff' : 'none' }}>
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
          const w = 260; // Approximate inner width of the cylinder
          const h = 100; // Approximate inner height of the cylinder
          
          let fillPercent = 0;
          if (cyl.id === 'P' && pFill) fillPercent = 100;
          if (cyl.id === 'L' && lFill) fillPercent = 35;

          return (
            <g key={cyl.id} transform={`translate(${cyl.x}, ${cyl.y})`}>
              {/* Liquid Fill */}
              <motion.g 
                initial={{ clipPath: `inset(0 100% 0 0)` }}
                animate={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <rect x={-w/2} y={-h/2} width={w} height={h} fill="url(#liquidGrad)" rx="8" filter="url(#glow)" style={{ mixBlendMode: 'screen' }} />
                {cyl.id === 'L' && (
                  <>
                    <circle cx="-60" cy="15" r="5" fill="#ffffff" opacity="0.6" />
                    <circle cx="-20" cy="-20" r="7" fill="#ffffff" opacity="0.7" />
                    <circle cx="-90" cy="-5" r="4" fill="#ffffff" opacity="0.5" />
                    <circle cx="-40" cy="30" r="6" fill="#ffffff" opacity="0.6" />
                  </>
                )}
              </motion.g>

              {/* Percentage Text overlaid exactly over where it was masked */}
              <text x="0" y="20" fill="#ffffff" fontSize="56" textAnchor="middle" fontWeight="bold">
                <AnimatedCounter from={0} to={cyl.targetValue} delay={0} duration={0.7} isReady={cyl.id === 'P' ? pFill : lFill} />%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
