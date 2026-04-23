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
    bg: 'linear-gradient(145deg, #f0f2f7 0%, #e8ebf2 60%, #f0f2f8 100%)',
    card: 'rgba(255,255,255,0.92)',
    cardBorder: 'rgba(0,0,0,0.12)',
    cardHoverShadow: '0 32px 90px rgba(236,110,42,0.18), 0 12px 40px rgba(0,0,0,0.08)',
    cardShadow: '0 6px 30px rgba(0,0,0,0.06)',
    text: '#0a0a1a',
    textSub: '#1a1a2e',
    textMuted: '#3a3a5a',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.14)',
    iconBg: '#ffffff',
    iconBorder: 'rgba(0,0,0,0.15)',
    divider: 'rgba(0,0,0,0.12)',
    dividerOpacity: 0.15,
    grid: '#ec6e2a',
    gridOpacity: 0.05,
    pillBg: 'rgba(0,0,0,0.12)',
    statusActive: '#15803d',
    statusBuilding: '#b45309',
    gradients: [
      'linear-gradient(145deg, rgba(236,110,42,0.40) 0%, rgba(236,110,42,0.08) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.38) 0%, rgba(34,197,94,0.08) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.38) 0%, rgba(59,130,246,0.08) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.38) 0%, rgba(239,68,68,0.08) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(145deg, rgba(236,110,42,0.55) 0%, rgba(236,110,42,0.16) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.48) 0%, rgba(34,197,94,0.15) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.48) 0%, rgba(59,130,246,0.15) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.48) 0%, rgba(239,68,68,0.15) 100%)',
    ],
  },
}

/* ─────────────────────────────────────────────────────────────
   ANIMAÇÕES — SVG profissionais para cada módulo
───────────────────────────────────────────────────────────── */

/* FATURAMENTO — Barras mensais + linha de tendência sincronizada */
function AnimFaturamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes fatBar { 0%,100%{transform:scaleY(0);} 10%,82%{transform:scaleY(1);} 90%,99%{transform:scaleY(0.04);} }
        @keyframes fatLine { 
          0%{stroke-dashoffset:420; opacity:0;} 
          15%{stroke-dashoffset:420; opacity:0;}
          40%{stroke-dashoffset:0; opacity:1;}
          90%{opacity:1;}
          100%{opacity:0;}
        }
        @keyframes fatDot  { 0%,10%,100%{opacity:0; r:2;} 30%,80%{opacity:1; r:4;} }
      `}</style>
      <defs>
        <linearGradient id="fatBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec6e2a" stopOpacity="1"/>
          <stop offset="100%" stopColor="#ec6e2a" stopOpacity="0.3"/>
        </linearGradient>
      </defs>

      {/* Grid */}
      {[50,80,110,140].map(y => (
        <line key={y} x1="30" y1={y} x2="260" y2={y} stroke={color} strokeWidth="1" opacity="0.1"/>
      ))}
      <line x1="30" y1="155" x2="260" y2="155" stroke={color} strokeWidth="1.5" opacity="0.3"/>

      {/* 6 barras mensais - Ciclo 3s */}
      {[
        {h:62, d:'0s'},   {h:85, d:'0.1s'}, {h:60, d:'0.2s'},
        {h:110,d:'0.3s'},{h:80, d:'0.4s'}, {h:125,d:'0.5s'},
      ].map((b,i) => (
        <rect key={i}
          x={42+i*36} y={155-b.h} width="22" height={b.h} rx="4"
          fill="url(#fatBarGrad)"
          style={{ transformOrigin:`${42+i*36+11}px 155px`, animation:`fatBar 3s ease-in-out infinite ${b.d}` }}/>
      ))}

      {/* Linha de tendência SINCRONIZADA */}
      <polyline
        points="53,100  89,75  125,110  161,55  197,85  233,40"
        fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="420" strokeDashoffset="420"
        style={{ animation:'fatLine 3s ease-out infinite' }}/>
      
      {[{cx:53,cy:100},{cx:89,cy:75},{cx:125,cy:110},{cx:161,cy:55},{cx:197,cy:85},{cx:233,cy:40}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#22c55e"
          style={{ animation:`fatDot 3s ease-in-out infinite ${0.4 + i*0.1}s` }}/>
      ))}

      {/* Meses - Ajustado para não cortar Jan */}
      {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m,i) => (
        <text key={m} x={53+i*36} y="172" fill={color} fontSize="10" fontWeight="600" opacity="0.5"
          textAnchor="middle" fontFamily="system-ui">{m}</text>
      ))}
    </svg>
  )
}




/* ORÇAMENTO — Donut fixo e barras laterais sem sobreposição */
function AnimOrcamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes orcB { from{width:0;} to{width:1;} }
        @keyframes orcRing { 0%,100%{stroke-dashoffset:264;} 50%{stroke-dashoffset:80;} }
      `}</style>

      {/* Donut Redimensionado e Movido para o Canto para não bater nas barras */}
      <g transform="translate(210,92)">
        <circle r="44" fill="none" stroke={`${color}10`} strokeWidth="10"/>
        <circle r="44" fill="none" stroke="#22c55e" strokeWidth="10"
          strokeLinecap="round" strokeDasharray="276" strokeDashoffset="264"
          transform="rotate(-90)" opacity="0.9"
          style={{ animation:'orcRing 4s ease-in-out infinite' }}/>
        <text y="5" fill={color} fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="system-ui">82%</text>
        <text y="18" fill={color} fontSize="8" textAnchor="middle" fontFamily="system-ui" opacity="0.5">META</text>
      </g>

      {/* Barras de categoria com mais espaço */}
      {[
        { label:'COMERCIAL', y:30,  w:100, c:'#ec6e2a', pct:'73%' },
        { label:'OPERAÇÕES', y:65,  w:70,  c:'#22c55e', pct:'42%' },
        { label:'RH',        y:100, w:120, c:'#f59e0b', pct:'86%' },
        { label:'TOTAL',     y:135, w:90,  c:'#3b82f6', pct:'59%' },
      ].map((cat,i) => (
        <g key={i} transform={`translate(20, ${cat.y})`}>
          <text fill={color} fontSize="9" fontWeight="700" opacity="0.7" fontFamily="system-ui">{cat.label}</text>
          <rect y="10" width="130" height="8" rx="4" fill={`${cat.c}15`}/>
          <rect y="10" width={cat.w} height="8" rx="4" fill={cat.c} opacity="0.8"
            style={{ transformOrigin:'left', animation:`orcB 3s ease-out infinite alternate ${i*0.2}s` }}/>
          <text x={cat.w + 10} y="17" fill={cat.c} fontSize="9" fontWeight="800">{cat.pct}</text>
        </g>
      ))}
    </svg>
  )
}



/* FLUXO DE CAIXA — Sincronizado e sem cortes */
function AnimFluxo({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes flxBar { from{transform:scaleY(0);} to{transform:scaleY(1);} }
        @keyframes flxLine { from{stroke-dashoffset:300;} to{stroke-dashoffset:0;} }
      `}</style>
      
      <line x1="20" y1="155" x2="260" y2="155" stroke={color} strokeWidth="1" opacity="0.2"/>

      {[
        {x:40, h:60, c:'#22c55e'}, {x:80, h:85, c:'#ef4444'},
        {x:120,h:100,c:'#22c55e'}, {x:160,h:75, c:'#ef4444'},
        {x:200,h:115,c:'#22c55e'}, {x:240,h:90, c:'#ef4444'},
      ].map((b,i) => (
        <rect key={i} x={b.x} y={155-b.h} width="18" height={b.h} rx="3" fill={b.c} opacity="0.75"
          style={{ transformOrigin:`${b.x+9}px 155px`, animation:`flxBar 2s ease-out infinite alternate ${i*0.1}s` }}/>
      ))}

      <polyline
        points="49,155 89,70 129,95 169,55 209,110 249,65"
        fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"
        strokeDasharray="300" strokeDashoffset="300"
        style={{ animation:'flxLine 3s ease-in-out infinite' }}/>

      <text x="25" y="30" fill={color} fontSize="11" fontWeight="800" opacity="0.8">ENTRADAS</text>
      <text x="110" y="30" fill={color} fontSize="11" fontWeight="800" opacity="0.8">SAÍDAS</text>
      <rect x="95" y="22" width="10" height="10" rx="2" fill="#ef4444"/>
      <rect x="10" y="22" width="10" height="10" rx="2" fill="#22c55e"/>
    </svg>
  )
}

/* INADIMPLÊNCIA — Apenas Velocímetro Limpo */
function AnimInadimplencia({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes iadNeedle {
          0%,10% { transform:rotate(-90deg); }
          50%    { transform:rotate(40deg); }
          100%   { transform:rotate(-90deg); }
        }
      `}</style>

      {/* Gauge Centralizado e Grande */}
      <g transform="translate(140,110)">
        {/* Arco de fundo */}
        <path d="M -90 0 A 90 90 0 0 1 90 0" fill="none" stroke={`${color}10`} strokeWidth="18" strokeLinecap="round"/>
        
        {/* Segmentos coloridos */}
        <path d="M -90 0 A 90 90 0 0 1 -45 -78" fill="none" stroke="#22c55e" strokeWidth="18" strokeLinecap="round" opacity="0.4"/>
        <path d="M -45 -78 A 90 90 0 0 1 45 -78"  fill="none" stroke="#f59e0b" strokeWidth="18" strokeLinecap="round" opacity="0.4"/>
        <path d="M 45 -78 A 90 90 0 0 1 90 0"    fill="none" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" opacity="0.4"/>

        {/* Ponteiro */}
        <g style={{ transformOrigin:'0px 0px', animation:'iadNeedle 4s ease-in-out infinite' }}>
          <line x1="0" y1="10" x2="0" y2="-82" stroke="#ef4444" strokeWidth="5" strokeLinecap="round"/>
          <circle r="10" fill="#ef4444"/>
          <circle r="4" fill="white"/>
        </g>

        {/* Labels ajustados para não cortar */}
        <text x="-95" y="25" fill="#22c55e" fontSize="11" fontWeight="900" textAnchor="middle">BAIXO</text>
        <text x="0"   y="-100" fill="#f59e0b" fontSize="11" fontWeight="900" textAnchor="middle">MÉDIO</text>
        <text x="95"  y="25" fill="#ef4444" fontSize="11" fontWeight="900" textAnchor="middle">ALTO</text>
        
        <text y="45" fill="#ef4444" fontSize="32" fontWeight="950" textAnchor="middle">12.4%</text>
      </g>
    </svg>
  )
}


const MODULE_ANIMS = [AnimFaturamento, AnimOrcamento, AnimFluxo, AnimInadimplencia]

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
    { key: 'dark',  label: 'Escuro', dotBg: '#0c0c14', dotBorder: 'rgba(255,255,255,0.4)' },
    { key: 'light', label: 'Claro',  dotBg: '#e8eaef', dotBorder: 'rgba(0,0,0,0.3)' },
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

        /* ── Grid responsivo fluido (Otimizado para Notebook/Monitor) ── */
        /* ── Grid responsivo fluido (Escalado para Monitores Grandes e Notebooks) ── */
        .cf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(24px, 2.8vw, 48px);
          width: 100%;
          max-width: min(2200px, 96vw); /* Aumentado para preencher monitores de 17"+ */
          position: relative;
          z-index: 2;
        }
        /* Modo Notebook / Telas Médias */
        @media (max-width: 1440px) {
          .cf-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 1200px;
          }
        }
        /* Mobile */
        @media (max-width: 850px) {
          .cf-grid {
            grid-template-columns: 1fr;
            max-width: 500px;
          }
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

        /* ── Área da animação — ajustada para dar mais espaço aos textos inferiores ── */
        .cf-anim-area {
          width: 100%;
          flex: 0.85; /* Reduzido levemente para sobrar espaço para tags legíveis */
          min-height: 0;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
          border-radius: clamp(12px, 1.2vw, 18px);
          overflow: hidden;
          flex-shrink: 0;
          margin-bottom: clamp(12px, 2vh, 20px);
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

        {/* ── Theme Switcher (sem label Tema) ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(0,0,0,0.22)',
          padding: '5px 8px',
          borderRadius: 32,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, color: '#fff', fontWeight: 900, lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,0,0.30)', textTransform: 'uppercase' }}>
                {user.split(' ')[0]}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>
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
          marginBottom: 'clamp(50px, 10vh, 120px)',
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
                    textAlign: 'center',
                  }}>
                    {m.label}
                  </div>

                  <div className="cf-card-desc" style={{ color: t.textSub, transition: 'color 0.5s' }}>
                    {m.desc}
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {m.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 12, fontWeight: 800, padding: '4px 12px',
                        borderRadius: 10, letterSpacing: 0.4,
                        background: t.pillBg,
                        color: t.accent,
                        border: `1px solid ${t.divider}`,
                        transition: 'all 0.5s',
                        whiteSpace: 'nowrap'
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
