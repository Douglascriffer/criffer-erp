import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Handshake, Users, FlaskConical, Stethoscope, Factory, Package, 
  Cpu, Wrench, ShoppingCart, ClipboardList, Megaphone, Monitor, Key, HardHat,
  DollarSign
} from 'lucide-react';

export default function PlrView({ darkMode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const branches = [
    {
      y: 20,
      nodes: [
        { id: 'financeiro', label: 'Financeiro', icon: TrendingUp, x: 8 },
        { id: 'comercial', label: 'Comercial', icon: Handshake, x: 19 },
        { id: 'rh', label: 'RH', icon: Users, x: 30 },
        { id: 'lab_manutencao', label: 'Lab. Manutenção', icon: FlaskConical, x: 41 },
      ]
    },
    {
      y: 38,
      nodes: [
        { id: 'lab_calibracao', label: 'Lab. Calibração', icon: Stethoscope, x: 8 },
        { id: 'producao', label: 'Produção', icon: Factory, x: 22 },
        { id: 'logistica', label: 'Logística', icon: Package, x: 36 },
      ]
    },
    {
      y: 56,
      nodes: [
        { id: 'pd', label: 'P&D', icon: Cpu, x: 8 },
        { id: 'manutencao', label: 'Manutenção', icon: Wrench, x: 22 },
        { id: 'compras', label: 'Compras', icon: ShoppingCart, x: 36 },
      ]
    },
    {
      y: 74,
      nodes: [
        { id: 'adm', label: 'ADM', icon: ClipboardList, x: 8 },
        { id: 'marketing', label: 'Marketing', icon: Megaphone, x: 22 },
        { id: 'ti', label: 'TI', icon: Monitor, x: 36 },
      ]
    },
    {
      y: 92,
      nodes: [
        { id: 'locacao', label: 'Locação', icon: Key, x: 15 },
        { id: 'sup_tecnico', label: 'Sup. Tecnico', icon: HardHat, x: 29 },
      ]
    }
  ];

  const center = { x: 55, y: 56 };
  
  const batteries = [
    { id: 'P', label: 'P', percent: 100, y: 25, color: '#FF7A00' },
    { id: 'L', label: 'L', percent: 35, y: 56, color: '#FF7A00' },
    { id: 'R', label: 'R', percent: 0, y: 87, color: '#555555' },
  ];

  // SVG dimensions
  const vw = 100;
  const vh = 100;

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#020617', // Very dark blue/black
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px solid rgba(255,106,34,0.2)',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', 'Gotham', sans-serif",
      color: '#ffffff'
    }}>
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        src="/plr_video.mp4" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          zIndex: 1,
          opacity: 0.8
        }} 
      />

      {/* Render Left Nodes */}
      {branches.map((branch, bIdx) => (
        branch.nodes.map((node, nIdx) => (
          <div key={node.id} style={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${branch.y}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 20
          }}>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', whiteSpace: 'nowrap', textShadow: '0 2px 4px rgba(0,0,0,0.8)', letterSpacing: '0.5px' }}>
              {node.label}
            </div>
            <div style={{
              position: 'relative',
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at center, #111827 0%, #000000 100%)',
              boxShadow: '0 0 20px rgba(59,130,246,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Circulating Energy SVG Ring */}
              <svg width="85" height="85" viewBox="0 0 85 85" style={{ position: 'absolute', top: 0, left: 0, animation: 'spin 2s linear infinite' }}>
                <circle cx="42.5" cy="42.5" r="40" fill="none" stroke="#FF6A22" strokeWidth="3" strokeDasharray="60 120" strokeLinecap="round" filter="drop-shadow(0 0 4px #FF6A22)" />
              </svg>
              {/* Inner blue ring */}
              <div style={{ position: 'absolute', width: '74px', height: '74px', borderRadius: '50%', border: '2px solid #3B82F6' }}></div>
              
              <node.icon size={44} color="#FF6A22" style={{ filter: 'drop-shadow(0 0 5px rgba(255,106,34,0.8))', zIndex: 2 }} />
            </div>
          </div>
        ))
      ))}

      {/* Render Center Dial */}
      <div style={{
        position: 'absolute',
        left: `${center.x}%`,
        top: `${center.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Unified Center Dial: Red/Green Background meeting the outer edge */}
        <div style={{
          width: '280px', height: '280px',
          borderRadius: '50%',
          background: 'conic-gradient(from 171deg, #EF4444 0% 55%, #22C55E 55% 100%)',
          boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 0 80px rgba(0,0,0,0.6)',
          border: '4px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{ fontSize: '42px', fontWeight: 900, color: '#ffffff', textShadow: '0 4px 15px rgba(0,0,0,0.8)', zIndex: 2, letterSpacing: '1px' }}>
            1.986.520
          </div>
        </div>

        {/* 55% and 45% texts */}
        <div style={{ position: 'absolute', bottom: '-40px', left: '20%', fontSize: '20px', fontWeight: 700, color: '#EF4444', textShadow: '0 0 10px rgba(239,68,68,0.8)' }}>
          55%
        </div>
        <div style={{ position: 'absolute', bottom: '-40px', right: '20%', fontSize: '20px', fontWeight: 700, color: '#22C55E', textShadow: '0 0 10px rgba(34,197,94,0.8)' }}>
          45%
        </div>
      </div>

      {/* Render Right Batteries */}
      {batteries.map((batt, idx) => (
        <div key={batt.id} style={{
          position: 'absolute',
          left: '80%',
          top: `${batt.y}%`,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          zIndex: 20
        }}>
          {/* Battery Capsule */}
          <div style={{
            width: '180px',
            height: '80px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '8px',
            border: '3px solid #333',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 20px ${batt.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Battery Fill */}
            <div style={{
              position: 'absolute',
              left: 0, top: 0, bottom: 0,
              width: `${batt.percent}%`,
              background: `linear-gradient(90deg, ${batt.color}40 0%, ${batt.color} 100%)`,
              boxShadow: `0 0 30px ${batt.color}`,
              transition: 'width 1s ease-in-out'
            }}></div>
            
            {/* Battery End Caps (visual styling) */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '10px', background: 'linear-gradient(180deg, #555, #222, #555)', borderRight: '1px solid #111' }}></div>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '10px', background: 'linear-gradient(180deg, #555, #222, #555)', borderLeft: '1px solid #111' }}></div>
            
            {/* Text Value */}
            <span style={{ position: 'relative', zIndex: 5, fontSize: '28px', fontWeight: 800, color: '#fff', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
              {batt.percent}%
            </span>
          </div>

          {/* Letter (P, L, R) */}
          <div style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 4px 15px rgba(255,255,255,0.4)'
          }}>
            {batt.label}
          </div>
        </div>
      ))}
    </div>
  );
}
