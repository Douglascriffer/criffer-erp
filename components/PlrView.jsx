import React, { useState, useEffect } from 'react';
import { Users, TrendingDown } from 'lucide-react';

export default function PlrView({ darkMode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const batteries = [
    { id: 'P', label: 'P', percent: 100, y: 25, color: '#FF7A00' },
    { id: 'L', label: 'L', percent: 35, y: 50, color: '#FF7A00' },
    { id: 'R', label: 'R', percent: 0, y: 75, color: '#555555' },
  ];

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
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 5%'
    }}>
      {/* Background Grid Pattern */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* CSS Animations */}
      <style>{`
        @keyframes pushSlice {
          0% { transform: translate(-35px, 35px); }
          15% { transform: translate(-35px, 35px); }
          50% { transform: translate(0px, 0px); }
          85% { transform: translate(0px, 0px); }
          100% { transform: translate(-35px, 35px); }
        }
        @keyframes pushPeople {
          0% { transform: translate(-35px, 35px); }
          15% { transform: translate(-35px, 35px); }
          50% { transform: translate(0px, 0px); }
          85% { transform: translate(0px, 0px); }
          100% { transform: translate(-35px, 35px); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,255,255,0.3); }
          50% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px #FF6A22; }
        }
        .slice-anim {
          animation: pushSlice 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }
        .people-anim {
          animation: pushPeople 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }
      `}</style>

      {/* Title */}
      <div style={{ position: 'absolute', top: '4%', width: '100%', textAlign: 'center', zIndex: 10, left: 0 }}>
        <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#FF6A22', margin: 0, letterSpacing: '2px', textShadow: '0 0 20px rgba(255,106,34,0.5)' }}>CRIFFER</h1>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#ffffff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>A Rede de Energia</h2>
      </div>

      {/* LEFT AREA: The Animated Pie Chart */}
      <div style={{ position: 'relative', width: '40%', height: '500px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Main Pie Chart (White/Gray) representing the whole company */}
        <div style={{ position: 'relative', width: '400px', height: '400px', transform: 'scaleY(0.8) rotateX(20deg)' }}>
          {/* Main SVG */}
          <svg width="400" height="400" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* The 3D Base using drop-shadow */}
            <g style={{ filter: 'drop-shadow(0px 20px 0px #cbd5e1)' }}>
              {/* 75% Arc from top to left via right and bottom */}
              <path d="M 100 100 L 100 180 A 80 80 0 1 0 20 100 Z" fill="#f8fafc" />
            </g>
          </svg>

          {/* Animated PLR Slice (Red) */}
          <div className="slice-anim" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
            <svg width="400" height="400" viewBox="0 0 200 200">
              <g style={{ filter: 'drop-shadow(0px 20px 0px #b91c1c)' }}>
                {/* 25% Arc from left to bottom */}
                <path d="M 100 100 L 20 100 A 80 80 0 0 0 100 180 Z" fill="#ef4444" />
              </g>
              <text x="45" y="145" fill="#ffffff" fontSize="16" fontWeight="bold" transform="rotate(-45 45 145)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>P.L.R.</text>
            </svg>
          </div>

          {/* Animated People Pushing */}
          <div className="people-anim" style={{ 
            position: 'absolute', 
            top: '250px', 
            left: '-20px', 
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'rotate(15deg)' // Leaning forward to push
          }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <Users color="#e2e8f0" size={56} style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.8))' }} />
              <Users color="#cbd5e1" size={48} style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.8))', marginTop: '10px' }} />
            </div>
            <div style={{ 
              color: '#ffffff', fontSize: '14px', fontWeight: 'bold', 
              background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px',
              marginTop: '5px', textShadow: '0 2px 4px #000' 
            }}>
              Convertendo Despesa
            </div>
          </div>
        </div>

      </div>

      {/* CENTER AREA: Values */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
        <div style={{
          background: 'radial-gradient(circle at center, #111827 0%, #000000 100%)',
          border: '4px solid #333',
          boxShadow: '0 0 40px rgba(255,106,34,0.3), inset 0 0 30px #000',
          padding: '40px 50px',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '320px',
          height: '320px'
        }}>
          {/* Glowing Rings */}
          <div style={{
            position: 'absolute',
            width: '100%', height: '100%',
            borderRadius: '50%',
            border: '6px solid transparent',
            borderLeftColor: '#EF4444', 
            borderRightColor: '#22C55E', 
            borderTopColor: '#EF4444',
            borderBottomColor: '#22C55E',
            transform: 'rotate(-45deg)',
            boxShadow: '0 0 30px rgba(239,68,68,0.2), inset 0 0 30px rgba(34,197,94,0.2)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ color: '#FF6A22', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', fontWeight: 600 }}>
            Valor Acumulado
          </div>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '38px', 
            fontWeight: 800, 
            textShadow: '0 0 15px rgba(255,255,255,0.4)',
            animation: 'textGlow 3s infinite'
          }}>
            1.986.520,00
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', marginTop: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#EF4444', textShadow: '0 0 10px rgba(239,68,68,0.8)' }}>
            55% <span style={{ fontSize: '14px', color: '#fff', opacity: 0.7 }}>Despesas</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#22C55E', textShadow: '0 0 10px rgba(34,197,94,0.8)' }}>
            45% <span style={{ fontSize: '14px', color: '#fff', opacity: 0.7 }}>Lucro</span>
          </div>
        </div>
      </div>

      {/* RIGHT AREA: Batteries */}
      <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '40px', width: '30%' }}>
        {batteries.map((batt, idx) => (
          <div key={batt.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Battery Capsule */}
            <div style={{
              flex: 1,
              height: '70px',
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
              
              {/* Battery End Caps */}
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
              textShadow: '0 4px 15px rgba(255,255,255,0.4)',
              width: '40px',
              textAlign: 'center'
            }}>
              {batt.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
