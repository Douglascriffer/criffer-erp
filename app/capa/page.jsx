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
    card: 'rgba(255,255,255,1)', // Solid white for maximum contrast
    cardBorder: 'rgba(0,0,0,0.15)',
    cardHoverShadow: '0 32px 90px rgba(236,110,42,0.22), 0 12px 40px rgba(0,0,0,0.12)',
    cardShadow: '0 8px 32px rgba(0,0,0,0.1)',
    text: '#050510', // Near black
    textSub: '#101020',
    textMuted: '#2a2a40',
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
        @keyframes fatBar { 0%,100%{transform:scaleY(0.05);} 10%,82%{transform:scaleY(1);} }
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

      {/* 6 barras mensais */}
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

      {/* Meses */}
      {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m,i) => (
        <text key={m} x={53+i*36} y="172" fill={color} fontSize="11" fontWeight="700" opacity="0.6"
          textAnchor="middle" fontFamily="Gotham">{m}</text>
      ))}
    </svg>
  )
}





/* ORÇAMENTO — Limpo, Sem RH e sem sobreposições */
function AnimOrcamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes orcB { from{width:0;} to{width:1;} }
        @keyframes orcRing { from{stroke-dashoffset:276;} to{stroke-dashoffset:50;} }
      `}</style>
      
      {/* Donut à direita - Tamanho reduzido para dar espaço */}
      <g transform="translate(210,92)">
        <circle r="40" fill="none" stroke={`${color}08`} strokeWidth="12"/>
        <circle r="40" fill="none" stroke="#22c55e" strokeWidth="12"
          strokeLinecap="round" strokeDasharray="251" strokeDashoffset="251"
          transform="rotate(-90)"
          style={{ animation:'orcRing 3s ease-out infinite alternate' }}/>
        <text y="5" fill={color} fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="Gotham">82%</text>
        <text y="18" fill={color} fontSize="9" textAnchor="middle" fontFamily="Gotham" opacity="0.6">META</text>
      </g>

      {/* Categorias à esquerda — SEM RH */}
      {[
        { label:'COMERCIAL', y:40,  w:100, c:'#ec6e2a', pct:'73%' },
        { label:'OPERAÇÕES', y:88,  w:75,  c:'#22c55e', pct:'42%' },
        { label:'TOTAL',     y:136, w:115, c:'#3b82f6', pct:'59%' },
      ].map((cat,i) => (
        <g key={i} transform={`translate(24, ${cat.y})`}>
          <text fill={color} fontSize="11" fontWeight="700" opacity="0.8" fontFamily="Gotham">{cat.label}</text>
          <rect y="12" width="120" height="10" rx="5" fill={`${color}08`}/>
          <rect y="12" width={cat.w} height="10" rx="5" fill={cat.c} opacity="0.9"
            style={{ transformOrigin:'left', animation:`orcB 2.5s ease-out infinite alternate ${i*0.2}s` }}/>
          <text x={cat.w + 10} y="21" fill={cat.c} fontSize="11" fontWeight="900" fontFamily="Gotham">{cat.pct}</text>
        </g>
      ))}
    </svg>
  )
}




/* FLUXO DE CAIXA — Barras Agrupadas, Sem Linha */
function AnimFluxo({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes flxBar { from{transform:scaleY(0.1);} to{transform:scaleY(1);} }
      `}</style>
      
      <line x1="30" y1="155" x2="250" y2="155" stroke={color} strokeWidth="1" opacity="0.2"/>

      {/* 4 Grupos de Barras Lado a Lado */}
      {[
        {x:50, inH:70, outH:45}, {x:100, inH:95, outH:70},
        {x:150,inH:80, outH:95}, {x:200,inH:110,outH:60},
      ].map((g,i) => (
        <g key={i}>
          <rect x={g.x} y={155-g.inH} width="16" height={g.inH} rx="3" fill="#22c55e" opacity="0.85"
            style={{ transformOrigin:`${g.x+8}px 155px`, animation:`flxBar 2s ease-out infinite alternate ${i*0.15}s` }}/>
          <rect x={g.x+18} y={155-g.outH} width="16" height={g.outH} rx="3" fill="#ef4444" opacity="0.85"
            style={{ transformOrigin:`${g.x+26}px 155px`, animation:`flxBar 2s ease-out infinite alternate ${i*0.15 + 0.1}s` }}/>
        </g>
      ))}

      {/* Legenda Espaçada */}
      <g transform="translate(45,30)">
        <rect width="12" height="12" rx="3" fill="#22c55e"/>
        <text x="18" y="10" fill={color} fontSize="12" fontWeight="800" fontFamily="Gotham">ENTRADAS</text>
        
        <rect x="110" width="12" height="12" rx="3" fill="#ef4444"/>
        <text x="128" y="10" fill={color} fontSize="12" fontWeight="800" fontFamily="Gotham">SAÍDAS</text>
      </g>
    </svg>
  )
}


/* INADIMPLÊNCIA — Gauge com Percentual Dinâmico */
function AnimInadimplencia({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes iadNeedle {
          0%,10% { transform:rotate(-90deg); }
          50%    { transform:rotate(55deg); }
          100%   { transform:rotate(-90deg); }
        }
        @keyframes iadCounter {
          0%,10% { opacity:0; transform:translateY(10px); }
          25%    { opacity:1; transform:translateY(0); }
          50%    { transform:scale(1.2); }
          75%    { opacity:1; transform:translateY(0); }
          90%,100% { opacity:0; transform:translateY(-10px); }
        }
      `}</style>

      <g transform="translate(140,110)">
        <path d="M -90 0 A 90 90 0 0 1 90 0" fill="none" stroke={`${color}12`} strokeWidth="18" strokeLinecap="round"/>
        
        <path d="M -90 0 A 90 90 0 0 1 -45 -78" fill="none" stroke="#22c55e" strokeWidth="18" strokeLinecap="round" opacity="0.5"/>
        <path d="M -45 -78 A 90 90 0 0 1 45 -78"  fill="none" stroke="#f59e0b" strokeWidth="18" strokeLinecap="round" opacity="0.5"/>
        <path d="M 45 -78 A 90 90 0 0 1 90 0"    fill="none" stroke="#ef4444" strokeWidth="18" strokeLinecap="round" opacity="0.5"/>

        <g style={{ transformOrigin:'0px 0px', animation:'iadNeedle 4s ease-in-out infinite' }}>
          <line x1="0" y1="10" x2="0" y2="-82" stroke="#ef4444" strokeWidth="6" strokeLinecap="round"/>
          <circle r="12" fill="#ef4444"/>
          <circle r="5" fill="white"/>
        </g>

        <text x="-105" y="25" fill="#16803d" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="Gotham">BAIXO</text>
        <text x="0"   y="-105" fill="#b45309" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="Gotham">MÉDIO</text>
        <text x="105"  y="25" fill="#b91c1c" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="Gotham">ALTO</text>
        
        {/* Usando múltiplos textos para simular contador em sincronia com o ponteiro */}
        <g style={{ animation:'iadCounter 4s ease-in-out infinite' }}>
           <text y="50" fill="#ef4444" fontSize="36" fontWeight="950" textAnchor="middle" fontFamily="Gotham">70%</text>
        </g>
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
          font-family: 'Gotham', sans-serif;
          font-size: clamp(14px, 1.2vw, 18px);
          font-weight: 700;
          letter-spacing: 0.5px;
          line-height: 1.2;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .cf-card-desc {
          font-family: 'Gotham', sans-serif;
          font-size: clamp(15px, 1.4vw, 20px);
          line-height: 1.6;
          font-weight: 500;
          margin-top: 8px;
        }

        /* ── Título da página ── */
        .cf-page-title {
          font-family: 'Gotham', sans-serif;
          font-size: clamp(32px, 4vw, 60px);
          font-weight: 700;
          letter-spacing: 2px;
          line-height: 1.1;
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
            <div className="cf-brand-name" style={{ fontWeight: 700, color: '#fff', fontSize: '1.4rem', lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
              CRIFFER
            </div>
            <div className="cf-brand-sub" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.95)', fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 4 }}>
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
                  <div className="cf-card-title" style={{ color: t.text, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>
                    {m.label}
                  </div>
                  <div className="cf-card-desc" style={{ color: t.textMuted, fontWeight: 600 }}>
                    {m.desc}
                  </div>

                  {/* Tags com leitura mais clara */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
                    {m.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: 'Gotham, sans-serif',
                        fontSize: 13,
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: 8,
                        background: t.pillBg,
                        color: t.text,
                        border: `1.5px solid ${t.divider}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
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
