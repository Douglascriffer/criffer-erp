'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

/* ─── Sistema de temas ─── */
const THEMES = {
  dark: {
    bg: 'linear-gradient(145deg, #0c0c14 0%, #111118 60%, #0e0e18 100%)',
    card: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.10)',
    cardHoverShadow: '0 28px 80px rgba(236,110,42,0.28), 0 8px 32px rgba(0,0,0,0.30)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.25)',
    text: '#ffffff',
    textSub: 'rgba(255,255,255,0.88)',
    textMuted: 'rgba(255,255,255,0.68)',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.16)',
    iconBg: 'rgba(255,255,255,0.04)',
    iconBorder: 'rgba(255,255,255,0.10)',
    divider: 'rgba(255,255,255,0.09)',
    grid: '#ec6e2a',
    gridOpacity: 0.025,
    pillBg: 'rgba(0,0,0,0.25)',
    statusActive: '#22c55e',
    statusBuilding: '#f59e0b',
    gradients: [
      'linear-gradient(145deg, rgba(236,110,42,0.30) 0%, rgba(236,110,42,0.08) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.26) 0%, rgba(34,197,94,0.07) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.26) 0%, rgba(59,130,246,0.07) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.26) 0%, rgba(239,68,68,0.07) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(145deg, rgba(236,110,42,0.48) 0%, rgba(236,110,42,0.14) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.42) 0%, rgba(34,197,94,0.12) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.42) 0%, rgba(59,130,246,0.12) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.42) 0%, rgba(239,68,68,0.12) 100%)',
    ],
  },
  light: {
    bg: 'linear-gradient(145deg, #eef0f5 0%, #e4e7ee 60%, #eef0f7 100%)',
    card: 'rgba(255,255,255,0.75)',
    cardBorder: 'rgba(0,0,0,0.08)',
    cardHoverShadow: '0 28px 80px rgba(236,110,42,0.20), 0 8px 32px rgba(0,0,0,0.12)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.08)',
    text: '#1a1a2e',
    textSub: 'rgba(26,26,46,0.82)',
    textMuted: 'rgba(26,26,46,0.65)',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.09)',
    iconBg: 'rgba(255,255,255,0.90)',
    iconBorder: 'rgba(0,0,0,0.07)',
    divider: 'rgba(0,0,0,0.08)',
    grid: '#ec6e2a',
    gridOpacity: 0.04,
    pillBg: 'rgba(0,0,0,0.08)',
    statusActive: '#16a34a',
    statusBuilding: '#d97706',
    gradients: [
      'linear-gradient(145deg, rgba(236,110,42,0.35) 0%, rgba(236,110,42,0.06) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.32) 0%, rgba(34,197,94,0.05) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.32) 0%, rgba(59,130,246,0.05) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.32) 0%, rgba(239,68,68,0.05) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(145deg, rgba(236,110,42,0.50) 0%, rgba(236,110,42,0.10) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.44) 0%, rgba(34,197,94,0.08) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.44) 0%, rgba(59,130,246,0.08) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.44) 0%, rgba(239,68,68,0.08) 100%)',
    ],
  },
  orange: {
    bg: 'linear-gradient(145deg, #b84e12 0%, #d4631c 50%, #c05518 100%)',
    card: 'rgba(255,255,255,0.14)',
    cardBorder: 'rgba(255,255,255,0.24)',
    cardHoverShadow: '0 28px 80px rgba(0,0,0,0.36), 0 8px 32px rgba(0,0,0,0.24)',
    cardShadow: '0 4px 24px rgba(0,0,0,0.18)',
    text: '#ffffff',
    textSub: 'rgba(255,255,255,0.92)',
    textMuted: 'rgba(255,255,255,0.80)',
    accent: '#ffffff',
    accentSoft: 'rgba(255,255,255,0.20)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.35)',
    divider: 'rgba(255,255,255,0.18)',
    grid: '#fff',
    gridOpacity: 0.05,
    pillBg: 'rgba(0,0,0,0.22)',
    statusActive: '#bbf7d0',
    statusBuilding: '#fef3c7',
    gradients: [
      'linear-gradient(145deg, rgba(255,200,150,0.45) 0%, rgba(255,255,255,0.10) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.40) 0%, rgba(255,255,255,0.08) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.40) 0%, rgba(255,255,255,0.08) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.40) 0%, rgba(255,255,255,0.08) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(145deg, rgba(255,200,150,0.62) 0%, rgba(255,255,255,0.15) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.55) 0%, rgba(255,255,255,0.12) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.55) 0%, rgba(255,255,255,0.12) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.55) 0%, rgba(255,255,255,0.12) 100%)',
    ],
  },
}

/* ─────────────────────────────────────────────────────────────
   ANIMAÇÕES — SVG profissionais para cada módulo
───────────────────────────────────────────────────────────── */

/* FATURAMENTO — Gráfico de área animado com tendência e métricas */
function AnimOrcamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes revAreaIn { from { opacity:0; } to { opacity:1; } }
        @keyframes revLine1  { from { stroke-dashoffset:540; } to { stroke-dashoffset:0; } }
        @keyframes revLine2  { from { stroke-dashoffset:500; } to { stroke-dashoffset:0; } }
        @keyframes revDot    { 0%,100%{ r:4.5; } 50%{ r:6.5; } }
      `}</style>
      <defs>
        <linearGradient id="fatAreaG1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec6e2a" stopOpacity="0.50"/>
          <stop offset="100%" stopColor="#ec6e2a" stopOpacity="0.02"/>
        </linearGradient>
        <linearGradient id="fatAreaG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.36"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02"/>
        </linearGradient>
        <clipPath id="fatClip"><rect x="22" y="18" width="254" height="142"/></clipPath>
      </defs>

      {/* Grid */}
      {[48,82,116,150].map(y => (
        <line key={y} x1="22" y1={y} x2="276" y2={y} stroke={color} strokeWidth="0.5" opacity="0.07"/>
      ))}
      {[22,72,122,172,222,272].map(x => (
        <line key={x} x1={x} y1="18" x2={x} y2="158" stroke={color} strokeWidth="0.5" opacity="0.05"/>
      ))}

      {/* Área 2026 */}
      <path d="M22,140 C72,115 120,96 170,72 C215,50 248,36 276,22 L276,158 L22,158 Z"
        fill="url(#fatAreaG1)" clipPath="url(#fatClip)" opacity="0"
        style={{ animation:'revAreaIn 1.4s ease-out forwards' }}/>
      {/* Área 2025 */}
      <path d="M22,152 C72,135 120,120 170,104 C215,88 248,78 276,66 L276,158 L22,158 Z"
        fill="url(#fatAreaG2)" clipPath="url(#fatClip)" opacity="0"
        style={{ animation:'revAreaIn 1.4s ease-out 0.45s forwards' }}/>

      {/* Eixos */}
      <line x1="22" y1="158" x2="276" y2="158" stroke={color} strokeWidth="1.5" opacity="0.22"/>
      <line x1="22" y1="18"  x2="22"  y2="158" stroke={color} strokeWidth="1.5" opacity="0.22"/>

      {/* Linha principal */}
      <path d="M22,140 C72,115 120,96 170,72 C215,50 248,36 276,22"
        fill="none" stroke="#ec6e2a" strokeWidth="2.8" strokeLinecap="round"
        strokeDasharray="540" strokeDashoffset="540"
        style={{ animation:'revLine1 2s ease-out forwards' }}/>
      {/* Linha secundária */}
      <path d="M22,152 C72,135 120,120 170,104 C215,88 248,78 276,66"
        fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" opacity="0.85"
        strokeDasharray="500" strokeDashoffset="500"
        style={{ animation:'revLine2 2s ease-out 0.35s forwards' }}/>

      {/* Pontos pulsantes */}
      {[{cx:22,cy:140},{cx:72,cy:114},{cx:120,cy:95},{cx:170,cy:71},{cx:222,cy:46},{cx:276,cy:22}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="4.5" fill="#ec6e2a"
          style={{ animation:`revDot 2.4s ease-in-out infinite ${i*0.22}s` }}/>
      ))}

      {/* KPI badge */}
      <rect x="28" y="24" width="108" height="27" rx="7"
        fill="rgba(236,110,42,0.12)" stroke="#ec6e2a" strokeWidth="1" strokeOpacity="0.50"/>
      <text x="82" y="41" fill="#ec6e2a" fontSize="10.5" fontWeight="800"
        textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui">↑ RECEITA  +24%</text>

      {/* Meses */}
      {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m,i) => (
        <text key={m} x={22+i*51} y="174" fill={color} fontSize="9" opacity="0.42"
          textAnchor="middle" fontFamily="system-ui">{m}</text>
      ))}
      {/* Legenda */}
      <circle cx="200" cy="32" r="5" fill="#ec6e2a"/>
      <text x="209" y="36" fill={color} fontSize="9" opacity="0.60" fontFamily="system-ui">2026</text>
      <circle cx="236" cy="32" r="4" fill="#22c55e"/>
      <text x="245" y="36" fill={color} fontSize="9" opacity="0.60" fontFamily="system-ui">2025</text>
    </svg>
  )
}

/* ORÇAMENTO — Prancheta + 4 barras sequenciais + flecha no alvo */
function AnimFaturamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes orcDocScroll { 0%,5%{ transform:translateY(0); } 45%,80%{ transform:translateY(-22px); } 95%,100%{ transform:translateY(0); } }
        @keyframes orcCursorBlink { 0%,48%{ opacity:1; } 50%,100%{ opacity:0; } }
        @keyframes orcCursorMove  { 0%,5%{ transform:translateY(0); } 45%,82%{ transform:translateY(-22px); } 95%,100%{ transform:translateY(0); } }
        @keyframes orcBar1Up { 0%,2%{ transform:scaleY(0);opacity:0; } 13%{ transform:scaleY(1);opacity:1; } 78%{ transform:scaleY(1);opacity:1; } 88%,100%{ transform:scaleY(0);opacity:0; } }
        @keyframes orcBar2Up { 0%,19%{ transform:scaleY(0);opacity:0; } 31%{ transform:scaleY(1);opacity:1; } 78%{ transform:scaleY(1);opacity:1; } 88%,100%{ transform:scaleY(0);opacity:0; } }
        @keyframes orcBar3Up { 0%,37%{ transform:scaleY(0);opacity:0; } 50%{ transform:scaleY(1);opacity:1; } 78%{ transform:scaleY(1);opacity:1; } 88%,100%{ transform:scaleY(0);opacity:0; } }
        @keyframes orcBar4Up { 0%,55%{ transform:scaleY(0);opacity:0; } 67%{ transform:scaleY(1);opacity:1; } 78%{ transform:scaleY(1);opacity:1; } 88%,100%{ transform:scaleY(0);opacity:0; } }
        @keyframes orcArrowFly { 0%,68%{ opacity:0; transform:translate(-55px,28px) scale(0.5); } 78%{ opacity:1; transform:translate(0,0) scale(1); } 86%{ opacity:1; transform:translate(0,0) scale(1); } 94%,100%{ opacity:0.2; transform:translate(0,0) scale(0.6); } }
        @keyframes orcTargetReveal { 0%,70%{ stroke-dashoffset:140; opacity:0; } 82%,100%{ stroke-dashoffset:0; opacity:1; } }
        @keyframes orcBullseye { 0%,70%{ r:6; opacity:0; } 80%{ r:11; opacity:0.7; } 90%,100%{ r:6; opacity:0.9; } }
        @keyframes orcCheckDraw { 0%,82%{ stroke-dashoffset:42; opacity:0; } 93%,100%{ stroke-dashoffset:0; opacity:1; } }
      `}</style>
      <defs>
        <clipPath id="orcClipPath"><rect x="14" y="28" width="104" height="132" rx="4"/></clipPath>
      </defs>

      {/* ── Prancheta ── */}
      <rect x="12" y="14" width="108" height="155" rx="8"
        fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="1" strokeOpacity="0.22"/>
      <rect x="38" y="9"  width="60" height="13" rx="5" fill={color} opacity="0.28"/>
      <rect x="50" y="5"  width="36" height="9"  rx="4" fill={color} opacity="0.42"/>
      <ellipse cx="68" cy="15" rx="5" ry="3.5" fill="rgba(0,0,0,0.40)"/>

      {/* Conteúdo rolando */}
      <g clipPath="url(#orcClipPath)" style={{ animation:'orcDocScroll 7s ease-in-out infinite' }}>
        <rect x="18" y="34" width="96" height="7" rx="3" fill="#ec6e2a" opacity="0.72"/>
        {[[88,46],[68,57],[94,68],[54,79],[78,90],[62,101],[90,112],[50,123],[70,134]].map(([w,y],i) => (
          <rect key={i} x="18" y={y} width={w} height="5" rx="2" fill={color} opacity={i<2?0.38:0.18}/>
        ))}
        {[57,79,101].map((y,i) => (
          <rect key={y} x="86" y={y} width="24" height="5" rx="2"
            fill={i===0?'#22c55e':i===1?'#ec6e2a':'#3b82f6'} opacity="0.58"/>
        ))}
      </g>

      {/* Cursor piscante */}
      <g style={{ animation:'orcCursorMove 7s ease-in-out infinite' }}>
        <rect x="54" y="80" width="2" height="12" rx="1" fill="#ec6e2a"
          style={{ animation:'orcCursorBlink 0.9s ease infinite' }}/>
      </g>

      {/* ── Barras Sequenciais ── */}
      <line x1="138" y1="162" x2="278" y2="162" stroke={color} strokeWidth="1.5" strokeOpacity="0.25"/>
      {[
        { x:140, h:76,  c:'#ec6e2a', anim:'orcBar1Up' },
        { x:175, h:104, c:'#f09050', anim:'orcBar2Up' },
        { x:210, h:62,  c:'#ec6e2a', anim:'orcBar3Up' },
        { x:245, h:120, c:'#ff8c42', anim:'orcBar4Up' },
      ].map((b,i) => (
        <rect key={i}
          x={b.x} y={162-b.h} width="26" height={b.h} rx="5"
          fill={b.c} opacity="0.90"
          style={{ transformOrigin:`${b.x+13}px 162px`, animation:`${b.anim} 7s cubic-bezier(.22,1,.36,1) infinite` }}/>
      ))}
      {['Q1','Q2','Q3','Q4'].map((q,i) => (
        <text key={q} x={153+i*35} y="176" fill={color} fontSize="9.5" opacity="0.38"
          textAnchor="middle" fontFamily="system-ui">{q}</text>
      ))}

      {/* ── Alvo ── */}
      <g transform="translate(264,44)">
        <circle cx="0" cy="0" r="22" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.15"
          strokeDasharray="138" strokeDashoffset="138"
          style={{ animation:'orcTargetReveal 7s ease-in-out infinite' }}/>
        <circle cx="0" cy="0" r="14" fill="none" stroke="#ec6e2a" strokeWidth="2" strokeOpacity="0.55"
          strokeDasharray="88" strokeDashoffset="88"
          style={{ animation:'orcTargetReveal 7s ease-in-out infinite 0.12s' }}/>
        <circle cx="0" cy="0" r="6" fill="#ef4444" opacity="0.90"
          style={{ animation:'orcBullseye 7s ease-in-out infinite' }}/>
        <circle cx="0" cy="0" r="2.5" fill="white" opacity="0.90"/>
      </g>

      {/* ── Flecha ── */}
      <g style={{ animation:'orcArrowFly 7s cubic-bezier(.22,1,.36,1) infinite' }}>
        <line x1="218" y1="90" x2="254" y2="52" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round"/>
        <polygon points="254,52 246,53 252,61" fill="#ef4444"/>
        <line x1="218" y1="90" x2="211" y2="86" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
        <line x1="218" y1="90" x2="215" y2="97" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
      </g>

      {/* Checkmark */}
      <polyline points="24,138 33,148 55,126" fill="none" stroke="#22c55e" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="42" strokeDashoffset="42"
        style={{ animation:'orcCheckDraw 7s ease-in-out infinite' }}/>
    </svg>
  )
}

/* FLUXO DE CAIXA — linha sinusoidal com área preenchida */
function AnimFluxo({ color }) {
  return (
    <svg viewBox="0 0 260 180" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes flowWave {
          0%   { d: path("M20,100 C50,70  80,130 110,90  C140,50  170,120 200,80  C225,55  245,70  250,65"); }
          25%  { d: path("M20,110 C50,80  80,50  110,90  C140,130 170,60  200,100 C225,120 245,90  250,80"); }
          50%  { d: path("M20,90  C50,120 80,60  110,100 C140,140 170,70  200,110 C225,80  245,50  250,45"); }
          75%  { d: path("M20,105 C50,65  80,120 110,80  C140,45  170,115 200,75  C225,55  245,80  250,70"); }
          100% { d: path("M20,100 C50,70  80,130 110,90  C140,50  170,120 200,80  C225,55  245,70  250,65"); }
        }
        @keyframes flowArea {
          0%   { d: path("M20,100 C50,70  80,130 110,90  C140,50  170,120 200,80  C225,55  245,70  250,65 L250,155 L20,155 Z"); }
          25%  { d: path("M20,110 C50,80  80,50  110,90  C140,130 170,60  200,100 C225,120 245,90  250,80 L250,155 L20,155 Z"); }
          50%  { d: path("M20,90  C50,120 80,60  110,100 C140,140 170,70  200,110 C225,80  245,50  250,45 L250,155 L20,155 Z"); }
          75%  { d: path("M20,105 C50,65  80,120 110,80  C140,45  170,115 200,75  C225,55  245,80  250,70 L250,155 L20,155 Z"); }
          100% { d: path("M20,100 C50,70  80,130 110,90  C140,50  170,120 200,80  C225,55  245,70  250,65 L250,155 L20,155 Z"); }
        }
        @keyframes cashUp {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50%      { opacity: 1;   transform: translateY(-4px); }
        }
        @keyframes cashDown {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50%      { opacity: 1;   transform: translateY(4px); }
        }
      `}</style>

      {/* Grid */}
      {[40,80,120,155].map(y => (
        <line key={y} x1="20" y1={y} x2="252" y2={y} stroke={color} strokeWidth="0.7" opacity="0.08"/>
      ))}

      <defs>
        <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02"/>
        </linearGradient>
      </defs>

      {/* Área preenchida animada */}
      <path
        d="M20,100 C50,70 80,130 110,90 C140,50 170,120 200,80 C225,55 245,70 250,65 L250,155 L20,155 Z"
        fill="url(#fluxGrad)"
        style={{ animation: 'flowArea 4s ease-in-out infinite' }}
      />

      {/* Linha principal animada */}
      <path
        d="M20,100 C50,70 80,130 110,90 C140,50 170,120 200,80 C225,55 245,70 250,65"
        fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
        style={{ animation: 'flowWave 4s ease-in-out infinite' }}
      />

      {/* Linha de zero */}
      <line x1="20" y1="155" x2="252" y2="155" stroke={color} strokeWidth="1.5" opacity="0.25"/>

      {/* Indicadores Entradas / Saídas */}
      <g style={{ animation: 'cashUp 2s ease-in-out infinite' }}>
        <text x="50" y="30" fill="#22c55e" fontSize="12" fontWeight="800" fontFamily="system-ui">↑ ENTRADAS</text>
      </g>
      <g style={{ animation: 'cashDown 2s ease-in-out infinite 0.5s' }}>
        <text x="148" y="30" fill="#ef4444" fontSize="12" fontWeight="800" fontFamily="system-ui">↓ SAÍDAS</text>
      </g>
    </svg>
  )
}

/* INADIMPLÊNCIA — Dashboard de risco de crédito */
function AnimInadimplencia({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes iadNeedle {
          0%,8%  { transform:rotate(-85deg); }
          38%    { transform:rotate(-12deg); }
          62%    { transform:rotate(30deg);  }
          78%    { transform:rotate(58deg);  }
          90%    { transform:rotate(58deg);  }
          100%   { transform:rotate(-85deg); }
        }
        @keyframes iadRiskB1 { 0%,100%{ width:72; } 45%,55%{ width:118; } }
        @keyframes iadRiskB2 { 0%,100%{ width:48; } 50%,60%{ width:86;  } }
        @keyframes iadRiskB3 { 0%,100%{ width:58; } 40%,55%{ width:104; } }
        @keyframes iadAlert  { 0%,100%{ opacity:0.32; transform:scale(1);    } 45%,55%{ opacity:1; transform:scale(1.12); } }
        @keyframes iadScan   { from{ transform:translateY(0);    opacity:0.65; } to{ transform:translateY(160px); opacity:0; } }
        @keyframes iadPct    { 0%,12%{ opacity:0; transform:translateY(5px); } 25%,75%{ opacity:1; transform:translateY(0); } 88%,100%{ opacity:0; transform:translateY(-5px); } }
      `}</style>

      {/* Painel */}
      <rect x="8" y="8" width="264" height="169" rx="12"
        fill="rgba(239,68,68,0.04)" stroke="rgba(239,68,68,0.18)" strokeWidth="1"/>
      <rect x="8" y="8" width="264" height="2.5" rx="1" fill="rgba(239,68,68,0.55)"
        style={{ animation:'iadScan 2.8s linear infinite' }}/>

      <text x="140" y="26" fill="#ef4444" fontSize="10.5" fontWeight="800"
        textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui" opacity="0.85">RISCO DE CRÉDITO</text>

      {/* ── Gauge / Velocímetro ── */}
      <g transform="translate(140,92)">
        <path d="M -68 0 A 68 68 0 0 1 -34 -58.9" fill="none" stroke="#22c55e" strokeWidth="14" strokeLinecap="round" opacity="0.30"/>
        <path d="M -34 -58.9 A 68 68 0 0 1 34 -58.9" fill="none" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round" opacity="0.30"/>
        <path d="M 34 -58.9 A 68 68 0 0 1 68 0" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity="0.38"/>
        <path d="M -68 0 A 68 68 0 0 1 68 0" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" strokeLinecap="round"/>

        {/* Ponteiro */}
        <g style={{ transformOrigin:'0px 0px', animation:'iadNeedle 5s ease-in-out infinite' }}>
          <line x1="0" y1="8" x2="0" y2="-56" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="0" y1="8" x2="-6" y2="15"  stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="0" y1="8" x2="6"  y2="15"  stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
        </g>
        <circle cx="0" cy="0" r="9" fill="#ef4444"/>
        <circle cx="0" cy="0" r="4" fill="white" opacity="0.90"/>

        <text x="-72" y="20" fill="#22c55e" fontSize="8.5" fontWeight="700" fontFamily="system-ui">BAIXO</text>
        <text x="-14" y="-76" fill="#f59e0b" fontSize="8.5" fontWeight="700" fontFamily="system-ui">MED</text>
        <text x="48"  y="20" fill="#ef4444" fontSize="8.5" fontWeight="700" fontFamily="system-ui">ALTO</text>
        <text x="0" y="24" fill="#ef4444" fontSize="20" fontWeight="900"
          textAnchor="middle" fontFamily="system-ui"
          style={{ animation:'iadPct 5s ease-in-out infinite' }}>12.4%</text>
        <text x="0" y="36" fill={color} fontSize="8" opacity="0.48"
          textAnchor="middle" fontFamily="system-ui">INADIMPLÊNCIA</text>
      </g>

      {/* ── Barras de envelhecimento ── */}
      <text x="20" y="124" fill={color} fontSize="9.5" fontWeight="700" opacity="0.55" fontFamily="system-ui">VENCIMENTO</text>
      {[
        { label:'0-30 dias',  y:136, w:72,  c:'#22c55e', anim:'iadRiskB1' },
        { label:'31-60 dias', y:150, w:48,  c:'#f59e0b', anim:'iadRiskB2' },
        { label:'>60 dias',   y:164, w:58,  c:'#ef4444', anim:'iadRiskB3' },
      ].map((b,i) => (
        <g key={i}>
          <text x="20" y={b.y-3} fill={color} fontSize="8" opacity="0.42" fontFamily="system-ui">{b.label}</text>
          <rect x="20" y={b.y} width="140" height="7" rx="3" fill="rgba(255,255,255,0.06)"/>
          <rect x="20" y={b.y} width={b.w} height="7" rx="3" fill={b.c} opacity="0.72"
            style={{ animation:`${b.anim} 3.5s ease-in-out infinite` }}/>
        </g>
      ))}

      {/* Ícone de alerta */}
      <g transform="translate(218,126)" style={{ animation:'iadAlert 2s ease-in-out infinite' }}>
        <circle cx="16" cy="15" r="17" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="16" y="21" fontSize="17" textAnchor="middle" fill="#ef4444">⚠</text>
      </g>
      <text x="234" y="158" fill="#ef4444" fontSize="8.5" fontWeight="700"
        textAnchor="middle" fontFamily="system-ui"
        style={{ animation:'iadAlert 2s ease-in-out infinite 0.3s' }}>ALERTA</text>
    </svg>
  )
}

const MODULE_ANIMS = [AnimOrcamento, AnimFaturamento, AnimFluxo, AnimInadimplencia]

export default function CapaPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [theme, setTheme] = useState('dark')
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(null)

  const t = THEMES[theme]

  useEffect(() => {
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    const savedTheme = localStorage.getItem('criffer_theme') || 'dark'
    if (!auth) { router.push('/login'); return }
    setUser(nome || '')
    setTheme(savedTheme)
    setTimeout(() => setVisible(true), 100)
  }, [])

  const changeTheme = useCallback((next) => {
    setTheme(next)
    localStorage.setItem('criffer_theme', next)
  }, [])

  const MODULES = [
    {
      id: 'faturamento',
      label: 'FATURAMENTO',
      desc: 'Análise de receita, mapa de vendas e acompanhamento de metas mensais.',
      tags: ['Receita', 'Mapa', 'Metas', 'Vendedores'],
      href: '/dashboard?tab=desempenho',
      disabled: false,
      status: 'active',
      badge: 'Ativo',
      accentColor: '#ec6e2a',
    },
    {
      id: 'orcamento',
      label: 'ORÇAMENTO',
      desc: 'Gestão de orçamentos, análise de resultados e projeções financeiras.',
      tags: ['Receitas', 'Resultado', 'Metas'],
      href: '/dashboard?tab=orcamento',
      disabled: false,
      status: 'active',
      badge: 'Ativo',
      accentColor: '#22c55e',
    },
    {
      id: 'fluxo',
      label: 'FLUXO DE CAIXA',
      desc: 'Controle de entradas e saídas, saldo em tempo real e projeções.',
      tags: ['Entradas', 'Saídas', 'Saldo'],
      href: '#',
      disabled: true,
      status: 'building',
      badge: 'Em breve',
      accentColor: '#3b82f6',
    },
    {
      id: 'inadimplencia',
      label: 'INADIMPLÊNCIA',
      desc: 'Monitoramento de clientes inadimplentes, alertas e análise de risco.',
      tags: ['Clientes', 'Alertas', 'Análise'],
      href: '#',
      disabled: true,
      status: 'building',
      badge: 'Em breve',
      accentColor: '#ef4444',
    },
  ]

  const THEME_OPTS = [
    { key: 'dark',   label: 'Escuro',  dotBg: '#0c0c14', dotBorder: 'rgba(255,255,255,0.4)' },
    { key: 'light',  label: 'Claro',   dotBg: '#e8eaef', dotBorder: 'rgba(0,0,0,0.3)' },
    { key: 'orange', label: 'Laranja', dotBg: '#ec6e2a', dotBorder: 'rgba(255,255,255,0.5)' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: t.bg,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Syne', system-ui, sans-serif",
      overflow: 'hidden',
      transition: 'background 0.6s ease',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');

        /* ── Animações de entrada ── */
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-15deg); }
          to   { transform: translateX(260%) skewX(-15deg); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 40px rgba(236,110,42,0.20); }
          50%       { text-shadow: 0 0 90px rgba(236,110,42,0.45); }
        }

        /* ── Grid responsivo fluido ── */
        .cf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(24px, 2.8vw, 44px);
          width: 100%;
          max-width: min(1380px, 94vw);
          position: relative;
          z-index: 2;
        }
        @media (min-width: 1400px) {
          .cf-grid { max-width: min(1520px, 92vw); gap: clamp(22px, 2vw, 32px); }
        }
        @media (max-width: 1100px) {
          .cf-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .cf-grid { grid-template-columns: 1fr; }
        }

        /* ── Card com altura fluida ── */
        .cf-card {
          border-radius: clamp(16px, 1.5vw, 24px);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          min-height: clamp(500px, 54vh, 660px);
          padding: clamp(18px, 1.8vw, 26px) clamp(18px, 1.8vw, 26px) clamp(16px, 1.6vw, 24px);
          display: flex;
          flex-direction: column;
          transition:
            transform 0.40s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.38s ease,
            border-color 0.28s ease;
        }
        .cf-card:hover { transform: translateY(-12px) scale(1.028); }
        .cf-card-disabled { opacity: 0.38; cursor: not-allowed !important; }
        .cf-card-disabled:hover { transform: none !important; }

        /* ── Área da animação — ocupa todo o espaço disponível ── */
        .cf-anim-area {
          width: 100%;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          border-radius: clamp(12px, 1.2vw, 18px);
          overflow: hidden;
          flex-shrink: 0;
          margin-bottom: 18px;
          position: relative;
        }
        .cf-anim-area > svg {
          width: 100% !important;
          height: 100% !important;
          position: absolute;
          inset: 0;
        }

        /* ── Título do card ── */
        .cf-card-title {
          font-size: clamp(12px, 1.1vw, 16px);
          font-weight: 900;
          letter-spacing: 1.0px;
          line-height: 1.2;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .cf-card-desc {
          font-size: clamp(14px, 1.30vw, 18px);
          line-height: 1.70;
          font-weight: 500;
        }

        /* ── Título da página ── */
        .cf-page-title {
          font-size: clamp(28px, 3.4vw, 52px);
          font-weight: 900;
          letter-spacing: 4px;
          line-height: 1;
        }

        /* ── Topbar ── */
        .cf-topbar {
          padding: clamp(12px, 1.6vh, 18px) clamp(3%, 5vw, 6%);
        }
        .cf-logo-circle {
          width: clamp(40px, 4vw, 54px);
          height: clamp(40px, 4vw, 54px);
        }
        .cf-brand-name {
          font-size: clamp(14px, 1.5vw, 20px);
          letter-spacing: clamp(2px, 0.4vw, 5px);
        }
        .cf-brand-sub {
          font-size: clamp(8px, 0.7vw, 10.5px);
        }

        /* ── Shimmer ── */
        .cf-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 28%,
            rgba(255,255,255,0.10) 50%,
            transparent 72%
          );
          animation: shimmer 0.80s ease forwards;
          pointer-events: none;
          z-index: 1;
        }
        .cf-icon-wrap { transition: transform 0.4s ease; }

        /* ── Botões de tema ── */
        .theme-btn {
          cursor: pointer;
          border: none;
          border-radius: 20px;
          font-family: inherit;
          font-weight: 700;
          font-size: clamp(10px, 0.85vw, 13px);
          letter-spacing: 0.05em;
          padding: 8px clamp(14px, 1.4vw, 22px);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.24s ease;
        }
        .theme-btn:hover { filter: brightness(1.10); transform: scale(1.05); }

        .topbar-exit-btn {
          border-radius: 10px;
          font-family: inherit;
          font-weight: 700;
          font-size: clamp(11px, 0.9vw, 14px);
          cursor: pointer;
          padding: clamp(7px, 0.8vh, 10px) clamp(14px, 1.4vw, 22px);
          transition: all 0.22s ease;
          border: 1.5px solid rgba(255,255,255,0.40);
          background: transparent;
          color: #fff;
          white-space: nowrap;
        }
        .topbar-exit-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.70);
          transform: translateY(-1px);
        }
      `}</style>

      {/* ══ TOPBAR — laranja + switcher de tema ══ */}
      <div className="cf-topbar" style={{
        background: 'linear-gradient(135deg, #a84410 0%, #d4601a 42%, #ec6e2a 72%, #f07c38 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 4px 32px rgba(168,68,16,0.55)',
        zIndex: 100,
        gap: 16,
      }}>
        {/* Logo + Nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px, 1vw, 16px)', flexShrink: 0 }}>
          <div className="cf-logo-circle" style={{
            background: '#fff',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.30)',
            position: 'relative', overflow: 'hidden', flexShrink: 0,
          }}>
            <Image src="/logo-base.png" alt="Criffer" fill style={{ objectFit: 'contain', padding: 6 }}/>
          </div>
          <div>
            <div className="cf-brand-name" style={{ fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
              CRIFFER
            </div>
            <div className="cf-brand-sub" style={{ color: 'rgba(255,255,255,0.80)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 3 }}>
              ERP Financeiro
            </div>
          </div>
        </div>

        {/* ── Theme Switcher ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,0,0,0.22)',
          padding: '6px 10px',
          borderRadius: 32,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
            color: 'rgba(255,255,255,0.55)',
            paddingRight: 4, paddingLeft: 2,
            textTransform: 'uppercase',
          }}>Tema</span>
          {THEME_OPTS.map(opt => {
            const active = theme === opt.key
            return (
              <button
                key={opt.key}
                className="theme-btn"
                onClick={() => changeTheme(opt.key)}
                style={{
                  background: active ? 'rgba(255,255,255,0.22)' : 'transparent',
                  color: '#fff',
                  boxShadow: active ? '0 2px 10px rgba(0,0,0,0.30)' : 'none',
                  padding: '6px clamp(10px, 1vw, 16px)',
                }}
              >
                <span style={{
                  width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                  background: opt.dotBg,
                  border: `1.5px solid ${opt.dotBorder}`,
                  display: 'inline-block',
                }}/>
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Usuário + Sair */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 15, color: '#fff', fontWeight: 700, lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,0.20)' }}>
                {user.split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)' }}>
                Bem-vindo de volta
              </div>
            </div>
          )}
          <button
            className="topbar-exit-btn"
            onClick={() => { localStorage.clear(); router.push('/login') }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        padding: 'clamp(24px, 3.5vh, 44px) 4% clamp(24px, 3vh, 40px)',
        overflow: 'hidden',
      }}>

        {/* Grid sutil de fundo */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: t.gridOpacity, transition: 'opacity 0.6s' }}>
          <defs>
            <pattern id="cf-grid" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M 52 0 L 0 0 0 52" fill="none" stroke={t.grid} strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cf-grid)"/>
        </svg>

        {/* Orbs de fundo */}
        <div style={{ position: 'absolute', top: '5%', right: '3%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 68%)`, pointerEvents: 'none', filter: 'blur(55px)', transition: 'background 0.6s', zIndex: 0 }}/>
        <div style={{ position: 'absolute', bottom: '5%', left: '3%', width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 68%)`, pointerEvents: 'none', filter: 'blur(44px)', transition: 'background 0.6s', zIndex: 0 }}/>

        {/* ── Título Central de Gestão ── */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(10px, 1.5vh, 18px)',
          position: 'relative', zIndex: 2,
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div className="cf-page-title" style={{
            color: t.text,
            animation: theme === 'dark' ? 'titleGlow 3s ease-in-out infinite' : 'none',
            transition: 'color 0.5s',
          }}>
            CENTRAL DE GESTÃO
          </div>
        </div>

        {/* ══ CARDS 4 em linha ══ */}
        <div className="cf-grid">
          {MODULES.map((m, i) => {
            const isHov = hovered === m.id
            const grad = isHov ? t.gradientHovers[i] : t.gradients[i]
            const borderColor = isHov ? m.accentColor : t.cardBorder
            const AnimComponent = MODULE_ANIMS[i]

            return (
              <div
                key={m.id}
                className={`cf-card${m.disabled ? ' cf-card-disabled' : ''}`}
                onMouseEnter={() => !m.disabled && setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => !m.disabled && router.push(m.href)}
                style={{
                  background: grad,
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: isHov ? t.cardHoverShadow : t.cardShadow,
                  transition: `box-shadow 0.38s ease, border-color 0.28s ease`,
                  animation: visible
                    ? `cardEntrance 0.70s cubic-bezier(0.34,1.56,0.64,1) ${0.06 + i * 0.10}s both`
                    : 'none',
                }}
              >
                {/* Shimmer no hover */}
                {isHov && <div className="cf-shimmer"/>}

                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: 0.8,
                    padding: '5px 13px', borderRadius: 20,
                    background: m.status === 'active' ? `${t.statusActive}28` : `${t.statusBuilding}28`,
                    color: m.status === 'active' ? t.statusActive : t.statusBuilding,
                    border: `1px solid ${m.status === 'active' ? t.statusActive : t.statusBuilding}55`,
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'all 0.5s',
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: m.status === 'active' ? t.statusActive : t.statusBuilding,
                      display: 'inline-block', flexShrink: 0,
                      animation: m.status === 'active' ? 'statusPulse 2s ease infinite' : 'none',
                    }}/>
                    {m.badge}
                  </div>
                </div>

                {/* ── Área de Animação Viva ── */}
                <div
                  className="cf-anim-area cf-icon-wrap"
                  style={{
                    background: theme === 'dark'
                      ? `linear-gradient(160deg, rgba(${m.accentColor === '#ec6e2a' ? '236,110,42' : m.accentColor === '#22c55e' ? '34,197,94' : m.accentColor === '#3b82f6' ? '59,130,246' : '239,68,68'},0.10) 0%, rgba(0,0,0,0.30) 100%)`
                      : theme === 'light'
                      ? `linear-gradient(160deg, rgba(${m.accentColor === '#ec6e2a' ? '236,110,42' : m.accentColor === '#22c55e' ? '34,197,94' : m.accentColor === '#3b82f6' ? '59,130,246' : '239,68,68'},0.08) 0%, rgba(255,255,255,0.60) 100%)`
                      : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${isHov ? borderColor + '55' : t.iconBorder}`,
                    boxShadow: isHov ? `0 14px 44px ${m.accentColor}30` : 'none',
                    transition: 'background 0.5s, border-color 0.4s, box-shadow 0.4s',
                    minHeight: 'clamp(230px, 28vh, 340px)',
                  }}
                >
                  <AnimComponent color={t.text}/>
                </div>

                {/* Conteúdo textual */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
                  <div className="cf-card-title" style={{
                    color: t.text,
                    transition: 'color 0.5s',
                  }}>
                    {m.label}
                  </div>

                  <div className="cf-card-desc" style={{ color: t.textSub, transition: 'color 0.5s' }}>
                    {m.desc}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {m.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 11, fontWeight: 700, padding: '4px 12px',
                        borderRadius: 20, letterSpacing: 0.4,
                        background: theme === 'orange'
                          ? 'rgba(255,255,255,0.22)'
                          : `${m.accentColor}1c`,
                        color: theme === 'orange' ? '#fff' : m.accentColor,
                        border: `1px solid ${theme === 'orange' ? 'rgba(255,255,255,0.32)' : m.accentColor + '35'}`,
                        transition: 'all 0.5s',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rodapé */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 16, marginTop: 16,
                  borderTop: `1px solid ${t.divider}`,
                  position: 'relative', zIndex: 2,
                  transition: 'border-color 0.5s',
                }}>
                  <span style={{
                    fontSize: 12.5, fontWeight: 600,
                    color: t.textMuted, letterSpacing: 0.3,
                    transition: 'color 0.5s',
                  }}>
                    {m.disabled ? 'Em desenvolvimento' : 'Acessar módulo'}
                  </span>
                  {!m.disabled && (
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: isHov ? m.accentColor : t.accentSoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.32s ease', flexShrink: 0,
                      boxShadow: isHov ? `0 6px 20px ${m.accentColor}65` : 'none',
                    }}>
                      <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke={isHov ? '#fff' : t.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
