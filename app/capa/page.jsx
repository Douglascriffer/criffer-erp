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
    cardHoverBorder: '#ec6e2a',
    cardShadow: '0 2px 20px rgba(0,0,0,0.22)',
    cardHoverShadow: '0 28px 70px rgba(236,110,42,0.22), 0 6px 28px rgba(0,0,0,0.24)',
    text: '#ffffff',
    textSub: 'rgba(255,255,255,0.88)',
    textMuted: 'rgba(255,255,255,0.68)',
    topbar: 'rgba(12,12,20,0.97)',
    topbarBorder: 'rgba(255,255,255,0.08)',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.14)',
    iconBg: 'rgba(255,255,255,0.04)',
    iconBorder: 'rgba(255,255,255,0.10)',
    divider: 'rgba(255,255,255,0.08)',
    grid: '#ec6e2a',
    gridOpacity: 0.025,
    pillBg: 'rgba(255,255,255,0.07)',
    statusActive: '#22c55e',
    statusBuilding: '#f59e0b',
    gradients: [
      'linear-gradient(135deg, rgba(236,110,42,0.12) 0%, rgba(236,110,42,0.04) 100%)',
      'linear-gradient(135deg, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.03) 100%)',
      'linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.03) 100%)',
      'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(239,68,68,0.03) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(135deg, rgba(236,110,42,0.20) 0%, rgba(236,110,42,0.07) 100%)',
      'linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.06) 100%)',
      'linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.06) 100%)',
      'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.06) 100%)',
    ],
  },
  light: {
    bg: 'linear-gradient(145deg, #f0f2f7 0%, #e8eaef 60%, #f2f4f9 100%)',
    card: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.08)',
    cardHoverBorder: '#ec6e2a',
    cardShadow: '0 2px 18px rgba(0,0,0,0.07)',
    cardHoverShadow: '0 28px 70px rgba(236,110,42,0.16), 0 6px 28px rgba(0,0,0,0.10)',
    text: '#1a1a2e',
    textSub: 'rgba(26,26,46,0.82)',
    textMuted: 'rgba(26,26,46,0.65)',
    topbar: 'rgba(255,255,255,0.97)',
    topbarBorder: 'rgba(0,0,0,0.09)',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.09)',
    iconBg: 'rgba(255,255,255,0.80)',
    iconBorder: 'rgba(0,0,0,0.08)',
    divider: 'rgba(0,0,0,0.08)',
    grid: '#ec6e2a',
    gridOpacity: 0.04,
    pillBg: 'rgba(0,0,0,0.06)',
    statusActive: '#16a34a',
    statusBuilding: '#d97706',
    gradients: [
      'linear-gradient(135deg, rgba(236,110,42,0.07) 0%, rgba(255,255,255,0) 100%)',
      'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(255,255,255,0) 100%)',
      'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(255,255,255,0) 100%)',
      'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(255,255,255,0) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(135deg, rgba(236,110,42,0.12) 0%, rgba(255,255,255,0) 100%)',
      'linear-gradient(135deg, rgba(34,197,94,0.11) 0%, rgba(255,255,255,0) 100%)',
      'linear-gradient(135deg, rgba(59,130,246,0.11) 0%, rgba(255,255,255,0) 100%)',
      'linear-gradient(135deg, rgba(239,68,68,0.11) 0%, rgba(255,255,255,0) 100%)',
    ],
  },
  orange: {
    bg: 'linear-gradient(145deg, #b84e12 0%, #d4631c 50%, #c05518 100%)',
    card: 'rgba(255,255,255,0.13)',
    cardBorder: 'rgba(255,255,255,0.22)',
    cardHoverBorder: 'rgba(255,255,255,0.90)',
    cardShadow: '0 2px 20px rgba(0,0,0,0.18)',
    cardHoverShadow: '0 28px 70px rgba(0,0,0,0.32), 0 6px 28px rgba(0,0,0,0.20)',
    text: '#ffffff',
    textSub: 'rgba(255,255,255,0.92)',
    textMuted: 'rgba(255,255,255,0.80)',
    topbar: 'rgba(0,0,0,0.20)',
    topbarBorder: 'rgba(255,255,255,0.18)',
    accent: '#ffffff',
    accentSoft: 'rgba(255,255,255,0.18)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconBorder: 'rgba(255,255,255,0.35)',
    divider: 'rgba(255,255,255,0.18)',
    grid: '#fff',
    gridOpacity: 0.05,
    pillBg: 'rgba(0,0,0,0.20)',
    statusActive: '#bbf7d0',
    statusBuilding: '#fef3c7',
    gradients: [
      'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.10) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.10) 100%)',
      'linear-gradient(135deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.10) 100%)',
    ],
  },
}

const ACCENT_COLORS = ['#ec6e2a', '#22c55e', '#3b82f6', '#ef4444']

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
      icon: '/icon-faturamento.png',
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
      icon: '/icon-orcamento.png',
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
      icon: '/icon-fluxo.png',
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
      icon: '/icon-inadimplencia.png',
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
    { key: 'dark',   label: 'Escuro',  dotBg: '#0c0c14', dotBorder: 'rgba(255,255,255,0.3)' },
    { key: 'light',  label: 'Claro',   dotBg: '#e8eaef', dotBorder: 'rgba(0,0,0,0.3)' },
    { key: 'orange', label: 'Laranja', dotBg: '#ec6e2a', dotBorder: 'rgba(255,255,255,0.4)' },
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

        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes titleEntrance {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-15deg); }
          to   { transform: translateX(250%) skewX(-15deg); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .cf-card {
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.38s ease,
            border-color 0.30s ease;
        }
        .cf-card:hover {
          transform: translateY(-10px) scale(1.025);
        }
        .cf-card-disabled {
          opacity: 0.40;
          cursor: not-allowed !important;
        }
        .cf-card-disabled:hover {
          transform: none !important;
        }

        .cf-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.09) 50%,
            transparent 70%
          );
          animation: shimmer 0.75s ease forwards;
          pointer-events: none;
          z-index: 1;
        }

        .cf-icon {
          transition: transform 0.4s ease;
        }
        .cf-card:hover .cf-icon {
          animation: iconFloat 2s ease-in-out infinite;
        }

        .theme-btn {
          cursor: pointer;
          border: none;
          border-radius: 20px;
          font-family: inherit;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.06em;
          padding: 7px 16px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.25s ease;
        }
        .theme-btn:hover { filter: brightness(1.08); transform: scale(1.04); }

        .exit-btn {
          border-radius: 10px;
          font-family: inherit;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          padding: 9px 22px;
          transition: all 0.22s ease;
        }
        .exit-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{
        background: t.topbar,
        borderBottom: `1px solid ${t.topbarBorder}`,
        padding: '13px 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
        transition: 'background 0.6s ease, border-color 0.6s ease',
        gap: 16,
      }}>
        {/* Logo + Nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{
            width: 44, height: 44,
            background: '#fff',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 14px rgba(0,0,0,0.18), 0 0 0 2px rgba(236,110,42,0.25)',
            position: 'relative', overflow: 'hidden', flexShrink: 0,
          }}>
            <Image src="/logo-base.png" alt="Criffer" fill style={{ objectFit: 'contain', padding: 5 }}/>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: t.text, letterSpacing: 4, lineHeight: 1, transition: 'color 0.5s' }}>CRIFFER</div>
            <div style={{ fontSize: 9, color: t.textSub, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 3, transition: 'color 0.5s' }}>ERP Financeiro</div>
          </div>
        </div>

        {/* Theme switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: t.pillBg,
          padding: '5px 6px',
          borderRadius: 26,
          flexShrink: 0,
          transition: 'background 0.5s',
        }}>
          {THEME_OPTS.map(opt => {
            const active = theme === opt.key
            return (
              <button
                key={opt.key}
                className="theme-btn"
                onClick={() => changeTheme(opt.key)}
                style={{
                  background: active
                    ? (opt.key === 'dark' ? '#1a1a2a' : opt.key === 'light' ? '#ffffff' : '#ec6e2a')
                    : 'transparent',
                  color: active ? (opt.key === 'light' ? '#1a1a2e' : '#fff') : t.textSub,
                  boxShadow: active ? '0 2px 10px rgba(0,0,0,0.22)' : 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          {user && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, color: t.text, fontWeight: 700, lineHeight: 1.2, transition: 'color 0.5s' }}>
                {user.split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: t.textSub, transition: 'color 0.5s' }}>
                Bem-vindo de volta
              </div>
            </div>
          )}
          <button
            className="exit-btn"
            onClick={() => { localStorage.clear(); router.push('/login') }}
            style={{
              border: `1.5px solid ${t.cardBorder}`,
              background: 'transparent',
              color: t.textSub,
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = t.accentSoft
              e.currentTarget.style.color = t.accent
              e.currentTarget.style.borderColor = t.accent
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = t.textSub
              e.currentTarget.style.borderColor = t.cardBorder
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '40px 4%',
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

        {/* Orbs decorativos */}
        <div style={{ position: 'absolute', top: '5%', right: '4%', width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 68%)`, pointerEvents: 'none', filter: 'blur(52px)', transition: 'background 0.6s', zIndex: 0 }}/>
        <div style={{ position: 'absolute', bottom: '5%', left: '4%', width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 68%)`, pointerEvents: 'none', filter: 'blur(40px)', transition: 'background 0.6s', zIndex: 0 }}/>

        {/* Título */}
        <div style={{
          textAlign: 'center', marginBottom: 44,
          position: 'relative', zIndex: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{
            fontSize: 38, fontWeight: 900, color: t.text,
            letterSpacing: 2, lineHeight: 1,
            textShadow: theme === 'dark' ? '0 0 60px rgba(236,110,42,0.25)' : 'none',
            transition: 'color 0.5s, text-shadow 0.5s',
          }}>
            CENTRAL DE GESTÃO
          </div>
        </div>

        {/* ── CARDS — 4 em linha ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          width: '100%',
          maxWidth: 1240,
          position: 'relative',
          zIndex: 2,
        }}>
          {MODULES.map((m, i) => {
            const isHov = hovered === m.id
            const grad = isHov ? t.gradientHovers[i] : t.gradients[i]
            const borderColor = isHov ? m.accentColor : t.cardBorder

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
                  padding: '30px 24px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: `box-shadow 0.38s ease, border-color 0.30s ease`,
                  animation: visible ? `cardEntrance 0.65s cubic-bezier(0.34,1.56,0.64,1) ${0.08 + i * 0.10}s both` : 'none',
                }}
              >
                {/* Efeito shimmer */}
                {isHov && <div className="cf-shimmer"/>}

                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, letterSpacing: 0.8,
                    padding: '5px 13px', borderRadius: 20,
                    background: m.status === 'active'
                      ? `${t.statusActive}22`
                      : `${t.statusBuilding}22`,
                    color: m.status === 'active' ? t.statusActive : t.statusBuilding,
                    border: `1px solid ${m.status === 'active' ? t.statusActive : t.statusBuilding}50`,
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all 0.5s',
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: m.status === 'active' ? t.statusActive : t.statusBuilding,
                      animation: m.status === 'active' ? 'statusPulse 2s ease infinite' : 'none',
                      display: 'inline-block', flexShrink: 0,
                    }}/>
                    {m.badge}
                  </div>
                </div>

                {/* Ícone 3D */}
                <div className="cf-icon" style={{
                  width: '100%',
                  height: 130,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  position: 'relative',
                  zIndex: 2,
                  borderRadius: 16,
                  background: t.iconBg,
                  border: `1px solid ${t.iconBorder}`,
                  overflow: 'hidden',
                  transition: 'background 0.5s, border-color 0.5s',
                  boxShadow: isHov ? `0 8px 28px ${m.accentColor}30` : 'none',
                }}>
                  <div style={{ position: 'relative', width: 110, height: 110 }}>
                    <Image
                      src={m.icon}
                      alt={m.label}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
                  {/* Nome */}
                  <div style={{
                    fontSize: 17, fontWeight: 900,
                    color: t.text,
                    letterSpacing: 1.5,
                    transition: 'color 0.5s',
                    lineHeight: 1.2,
                  }}>
                    {m.label}
                  </div>

                  {/* Descrição */}
                  <div style={{
                    fontSize: 13, color: t.textSub,
                    lineHeight: 1.65,
                    transition: 'color 0.5s',
                    fontWeight: 500,
                  }}>
                    {m.desc}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                    {m.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 11, fontWeight: 700, padding: '4px 11px',
                        borderRadius: 20, letterSpacing: 0.4,
                        background: theme === 'orange'
                          ? 'rgba(255,255,255,0.20)'
                          : `${m.accentColor}18`,
                        color: theme === 'orange' ? '#fff' : m.accentColor,
                        border: `1px solid ${theme === 'orange' ? 'rgba(255,255,255,0.30)' : m.accentColor + '30'}`,
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
                  paddingTop: 18, marginTop: 16,
                  borderTop: `1px solid ${t.divider}`,
                  position: 'relative', zIndex: 2,
                  transition: 'border-color 0.5s',
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: t.textMuted,
                    letterSpacing: 0.3,
                    transition: 'color 0.5s',
                  }}>
                    {m.disabled ? 'Em desenvolvimento' : 'Acessar módulo'}
                  </span>
                  {!m.disabled && (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isHov ? m.accentColor : t.accentSoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.32s ease',
                      flexShrink: 0,
                      boxShadow: isHov ? `0 4px 16px ${m.accentColor}60` : 'none',
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
