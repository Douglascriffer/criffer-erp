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
    dividerOpacity: 0.1,
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
}

/* ─────────────────────────────────────────────────────────────
   ANIMAÇÕES — SVG profissionais para cada módulo
───────────────────────────────────────────────────────────── */

/* FATURAMENTO — Barras mensais + linha de tendência + KPIs */
function AnimFaturamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes fatBar { 0%,100%{transform:scaleY(0);} 10%,82%{transform:scaleY(1);} 90%,99%{transform:scaleY(0.04);} }
        @keyframes fatLine { from{stroke-dashoffset:420;} to{stroke-dashoffset:0;} }
        @keyframes fatDot  { 0%,100%{r:3.5;opacity:0.7;} 50%{r:5.5;opacity:1;} }
        @keyframes fatKpi  { 0%,100%{opacity:0;transform:translateY(5px);} 20%,80%{opacity:1;transform:translateY(0);} }
        @keyframes fatPulse{ 0%,100%{opacity:0.6;} 50%{opacity:1;} }
      `}</style>
      <defs>
        <linearGradient id="fatBarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f07c38" stopOpacity="1"/>
          <stop offset="100%" stopColor="#a84410" stopOpacity="0.7"/>
        </linearGradient>
      </defs>

      {/* Grid */}
      {[50,80,110,140].map(y => (
        <line key={y} x1="28" y1={y} x2="268" y2={y} stroke={color} strokeWidth="0.4" opacity="0.08"/>
      ))}
      <line x1="28" y1="155" x2="268" y2="155" stroke={color} strokeWidth="1.5" opacity="0.22"/>
      <line x1="28" y1="22"  x2="28"  y2="155" stroke={color} strokeWidth="1.5" opacity="0.22"/>

      {/* 6 barras mensais */}
      {[
        {h:62, d:'0s'},   {h:80, d:'0.12s'}, {h:55, d:'0.24s'},
        {h:100,d:'0.36s'},{h:74, d:'0.48s'}, {h:118,d:'0.60s'},
      ].map((b,i) => (
        <rect key={i}
          x={38+i*38} y={155-b.h} width="26" height={b.h} rx="5"
          fill="url(#fatBarGrad)" opacity="0.88"
          style={{ transformOrigin:`${38+i*38+13}px 155px`, animation:`fatBar 3.5s ease-in-out infinite ${b.d}` }}/>
      ))}

      {/* Linha de tendência sobre as barras */}
      <polyline
        points="51,100  89,80  127,110  165,60  203,85  241,44"
        fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="420" strokeDashoffset="420"
        style={{ animation:'fatLine 1.8s ease-out 0.6s forwards' }}/>
      {[{cx:51,cy:100},{cx:89,cy:80},{cx:127,cy:110},{cx:165,cy:60},{cx:203,cy:85},{cx:241,cy:44}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="3.5" fill="#22c55e"
          style={{ animation:`fatDot 2.2s ease-in-out infinite ${i*0.22}s` }}/>
      ))}

      {/* KPI badge */}
      <rect x="30" y="22" width="118" height="24" rx="6"
        fill="rgba(236,110,42,0.15)" stroke="#ec6e2a" strokeWidth="1" strokeOpacity="0.55"/>
      <text x="89" y="38" fill="#ec6e2a" fontSize="10.5" fontWeight="800"
        textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui"
        style={{ animation:'fatKpi 3.5s ease-in-out infinite' }}>↑ 2.4M  +18%</text>

      {/* Chip crescimento */}
      <rect x="154" y="22" width="58" height="18" rx="9"
        fill="rgba(34,197,94,0.14)" stroke="#22c55e" strokeWidth="1" strokeOpacity="0.45"
        style={{ animation:'fatPulse 2.5s ease-in-out infinite' }}/>
      <text x="183" y="35" fill="#22c55e" fontSize="9" fontWeight="700"
        textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui">▲ 18% aa</text>

      {/* Meses */}
      {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m,i) => (
        <text key={m} x={51+i*38} y="170" fill={color} fontSize="8.5" opacity="0.40"
          textAnchor="middle" fontFamily="system-ui">{m}</text>
      ))}
    </svg>
  )
}



/* ORÇAMENTO — Donut de realização + barras de categoria */
function AnimOrcamento({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes orcB1 { 0%,100%{width:0;} 12%,82%{width:116;} 92%,99%{width:0;} }
        @keyframes orcB2 { 0%,5%,100%{width:0;} 22%,82%{width:67;} 92%,99%{width:0;} }
        @keyframes orcB3 { 0%,15%,100%{width:0;} 32%,82%{width:137;} 92%,99%{width:0;} }
        @keyframes orcB4 { 0%,25%,100%{width:0;} 42%,82%{width:94;} 92%,99%{width:0;} }
        @keyframes orcRing { 0%,100%{stroke-dashoffset:130;} 40%,70%{stroke-dashoffset:45;} }
        @keyframes orcPct  { 0%,100%{opacity:0;} 30%,70%{opacity:1;} }
      `}</style>

      {/* Donut — lado direito */}
      <circle cx="224" cy="92" r="42" fill="none" stroke={`${color}15`} strokeWidth="12"/>
      <circle cx="224" cy="92" r="42" fill="none" stroke="#22c55e" strokeWidth="12"
        strokeLinecap="round" strokeDasharray="264" strokeDashoffset="130"
        transform="rotate(-90 224 92)" opacity="0.90"
        style={{ animation:'orcRing 4s ease-in-out infinite' }}/>
      <text x="224" y="87" fill={color} fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="system-ui"
        style={{ animation:'orcPct 4s ease-in-out infinite' }}>82%</text>
      <text x="224" y="102" fill={color} fontSize="8" textAnchor="middle" fontFamily="system-ui" opacity="0.50">TOTAL</text>

      {/* Barras de categoria */}
      {[
        { label:'COMERCIAL', y:35,  bw:116, c:'#22c55e', anim:'orcB1', pct:'73%' },
        { label:'OPERAÇÕES', y:67,  bw:67,  c:'#3b82f6', anim:'orcB2', pct:'42%' },
        { label:'RH',        y:99,  bw:137, c:'#f59e0b', anim:'orcB3', pct:'86%' },
        { label:'TOTAL',     y:131, bw:94,  c:'#ec6e2a', anim:'orcB4', pct:'59%' },
      ].map((cat,i) => (
        <g key={i}>
          <text x="26" y={cat.y+5} fill={color} fontSize="8.5" fontWeight="700"
            opacity="0.60" fontFamily="system-ui">{cat.label}</text>
          <rect x="26" y={cat.y+10} width="160" height="9" rx="4.5" fill={`${cat.c}15`}/>
          <rect x="26" y={cat.y+10} width={cat.bw} height="9" rx="4.5" fill={cat.c} opacity="0.85"
            style={{ animation:`${cat.anim} 4s ease-in-out infinite` }}/>
          <text x="192" y={cat.y+18} fill={cat.c} fontSize="9.5" fontWeight="700"
            fontFamily="system-ui">{cat.pct}</text>
        </g>
      ))}
    </svg>
  )
}


/* FLUXO DE CAIXA — Waterfall entradas vs saídas + saldo */
function AnimFluxo({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display:'block' }}>
      <style>{`
        @keyframes flxIn  { 0%,100%{transform:scaleY(0);} 8%,82%{transform:scaleY(1);} 90%,99%{transform:scaleY(0);} }
        @keyframes flxOut { 0%,5%,100%{transform:scaleY(0);} 18%,82%{transform:scaleY(1);} 90%,99%{transform:scaleY(0);} }
        @keyframes flxBal { from{stroke-dashoffset:380;} to{stroke-dashoffset:0;} }
        @keyframes flxDot { 0%,100%{r:3;opacity:0.7;} 50%{r:4.5;opacity:1;} }
        @keyframes flxPulse{ 0%,100%{opacity:0.5;} 50%{opacity:1;} }
      `}</style>

      {[45,85,125].map(y => (
        <line key={y} x1="28" y1={y} x2="272" y2={y} stroke={color} strokeWidth="0.4" opacity="0.07"/>
      ))}
      <line x1="28" y1="155" x2="272" y2="155" stroke={color} strokeWidth="1.5" opacity="0.22"/>

      {/* Legenda */}
      <rect x="28" y="18" width="10" height="6" rx="2" fill="#22c55e" opacity="0.85"/>
      <text x="42" y="24" fill={color} fontSize="8.5" fontFamily="system-ui" opacity="0.65">↑ ENTRADAS</text>
      <rect x="120" y="18" width="10" height="6" rx="2" fill="#ef4444" opacity="0.85"/>
      <text x="134" y="24" fill={color} fontSize="8.5" fontFamily="system-ui" opacity="0.65">↓ SAÍDAS</text>

      {/* Barras por mês */}
      {[
        {inW:82, outW:58},{inW:68, outW:72},{inW:98, outW:55},{inW:74, outW:64},{inW:112,outW:80},
      ].map((m,i) => {
        const base = 155
        const bx = 38 + i*46
        return (
          <g key={i}>
            <rect x={bx}    y={base-m.inW}  width="18" height={m.inW}  rx="4" fill="#22c55e" opacity="0.80"
              style={{ transformOrigin:`${bx+9}px ${base}px`, animation:`flxIn 4s ease-in-out infinite ${i*0.15}s` }}/>
            <rect x={bx+20} y={base-m.outW} width="14" height={m.outW} rx="4" fill="#ef4444" opacity="0.75"
              style={{ transformOrigin:`${bx+27}px ${base}px`, animation:`flxOut 4s ease-in-out infinite ${i*0.15}s` }}/>
          </g>
        )
      })}

      {/* Linha de saldo */}
      <polyline points="47,82 93,98 139,66 185,80 231,56"
        fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="380" strokeDashoffset="380"
        style={{ animation:'flxBal 1.5s ease-out 0.8s forwards' }}/>
      {[{cx:47,cy:82},{cx:93,cy:98},{cx:139,cy:66},{cx:185,cy:80},{cx:231,cy:56}].map((p,i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="3" fill="#f59e0b" opacity="0.90"
          style={{ animation:`flxDot 2s ease-in-out infinite ${i*0.25}s` }}/>
      ))}

      {/* Badge */}
      <rect x="236" y="22" width="36" height="20" rx="6"
        fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.50"
        style={{ animation:'flxPulse 2.5s ease-in-out infinite' }}/>
      <text x="254" y="36" fill="#f59e0b" fontSize="8" fontWeight="800"
        textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui">SALDO</text>
    </svg>
  )
}

/* INADIMPLÊNCIA — Gauge velocímetro + aging buckets */
function AnimInadimplencia({ color }) {
  return (
    <svg viewBox="0 0 280 185" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" style={{ display: 'block' }}>
      <style>{`
        @keyframes iadNeedle {
          0%,8%  { transform:rotate(-85deg); }
          38%    { transform:rotate(-12deg); }
          62%    { transform:rotate(30deg);  }
          78%    { transform:rotate(58deg);  }
          100%   { transform:rotate(-85deg); }
        }
        @keyframes iadRiskB1 { 0%,100%{ width:72; } 45%,55%{ width:118; } }
        @keyframes iadRiskB2 { 0%,100%{ width:48; } 50%,60%{ width:86;  } }
        @keyframes iadRiskB3 { 0%,100%{ width:58; } 40%,55%{ width:104; } }
        @keyframes iadAlert  { 0%,100%{ opacity:0.32; transform:scale(1); } 50%{ opacity:1; transform:scale(1.1); } }
        @keyframes iadPct    { 0%,12%{ opacity:0; } 25%,75%{ opacity:1; } 88%,100%{ opacity:0; } }
      `}</style>

      {/* ── Gauge / Velocímetro ── */}
      <g transform="translate(140,78)">
        <path d="M -68 0 A 68 68 0 0 1 -34 -58.9" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" opacity="0.30"/>
        <path d="M -34 -58.9 A 68 68 0 0 1 34 -58.9" fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" opacity="0.30"/>
        <path d="M 34 -58.9 A 68 68 0 0 1 68 0" fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" opacity="0.38"/>
        <path d="M -68 0 A 68 68 0 0 1 68 0" fill="none" stroke={`${color}10`} strokeWidth="12" strokeLinecap="round"/>

        {/* Ponteiro */}
        <g style={{ transformOrigin:'0px 0px', animation:'iadNeedle 5s ease-in-out infinite' }}>
          <line x1="0" y1="8" x2="0" y2="-52" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
        </g>
        <circle cx="0" cy="0" r="8" fill="#ef4444"/>
        <circle cx="0" cy="0" r="3.5" fill="white"/>

        <text x="-75" y="18" fill="#22c55e" fontSize="7.5" fontWeight="700" fontFamily="system-ui">BAIXO</text>
        <text x="-12" y="-76" fill="#f59e0b" fontSize="7.5" fontWeight="700" fontFamily="system-ui">MED</text>
        <text x="50"  y="18" fill="#ef4444" fontSize="7.5" fontWeight="700" fontFamily="system-ui">ALTO</text>
        
        <text x="0" y="24" fill="#ef4444" fontSize="19" fontWeight="900" textAnchor="middle" fontFamily="system-ui"
          style={{ animation:'iadPct 5s ease-in-out infinite' }}>12.4%</text>
      </g>

      {/* ── Barras de envelhecimento ── */}
      <g transform="translate(0, 26)">
        <text x="20" y="122" fill={color} fontSize="9" fontWeight="800" opacity="0.55" fontFamily="system-ui">VENCIMENTO</text>
        {[
          { label:'0-30d',  y:135, w:72,  c:'#22c55e', anim:'iadRiskB1' },
          { label:'31-60d', y:148, w:48,  c:'#f59e0b', anim:'iadRiskB2' },
          { label:'>60d',   y:161, w:58,  c:'#ef4444', anim:'iadRiskB3' },
        ].map((b,i) => (
          <g key={i}>
            <text x="20" y={b.y-2} fill={color} fontSize="7.5" opacity="0.45" fontFamily="system-ui" fontWeight="600">{b.label}</text>
            <rect x="20" y={b.y} width="130" height="7" rx="3.5" fill={`${color}08`}/>
            <rect x="20" y={b.y} width={b.w} height="7" rx="3.5" fill={b.c} opacity="0.80"
              style={{ animation:`${b.anim} 3.5s ease-in-out infinite` }}/>
          </g>
        ))}
      </g>

      {/* Ícone de alerta lateral */}
      <g transform="translate(225,125)" style={{ animation:'iadAlert 2.5s ease-in-out infinite' }}>
        <circle cx="12" cy="12" r="16" fill="rgba(239,68,68,0.12)" stroke="#ef4444" strokeWidth="1.5"/>
        <text x="12" y="18" fontSize="16" textAnchor="middle" fill="#ef4444" fontWeight="bold">!</text>
        <text x="12" y="38" fill="#ef4444" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="system-ui">ALERTA</text>
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
        .cf-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(20px, 2.2vw, 32px);
          width: 100%;
          max-width: min(1680px, 94vw);
          position: relative;
          z-index: 2;
        }
        /* Modo Notebook / Telas Médias */
        @media (max-width: 1366px) {
          .cf-grid {
            grid-template-columns: repeat(2, 1fr);
            max-width: 1100px;
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
