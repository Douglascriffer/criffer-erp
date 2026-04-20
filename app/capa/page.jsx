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
      'linear-gradient(145deg, rgba(236,110,42,0.20) 0%, rgba(255,255,255,0.30) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.18) 0%, rgba(255,255,255,0.30) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.18) 0%, rgba(255,255,255,0.30) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.18) 0%, rgba(255,255,255,0.30) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(145deg, rgba(236,110,42,0.30) 0%, rgba(255,255,255,0.50) 100%)',
      'linear-gradient(145deg, rgba(34,197,94,0.26) 0%, rgba(255,255,255,0.50) 100%)',
      'linear-gradient(145deg, rgba(59,130,246,0.26) 0%, rgba(255,255,255,0.50) 100%)',
      'linear-gradient(145deg, rgba(239,68,68,0.26) 0%, rgba(255,255,255,0.50) 100%)',
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
      'linear-gradient(145deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 100%)',
      'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)',
      'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)',
      'linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)',
    ],
    gradientHovers: [
      'linear-gradient(145deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.14) 100%)',
      'linear-gradient(145deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 100%)',
      'linear-gradient(145deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 100%)',
      'linear-gradient(145deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 100%)',
    ],
  },
}

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

        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(44px) scale(0.96); }
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
        @keyframes titleEntrance {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cf-card {
          border-radius: 22px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform 0.40s cubic-bezier(0.34, 1.56, 0.64, 1),
            box-shadow 0.38s ease,
            border-color 0.28s ease;
        }
        .cf-card:hover { transform: translateY(-12px) scale(1.028); }
        .cf-card-disabled { opacity: 0.38; cursor: not-allowed !important; }
        .cf-card-disabled:hover { transform: none !important; }

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
        .cf-card:hover .cf-icon-wrap {
          animation: iconFloat 2.4s ease-in-out infinite;
        }

        .theme-btn {
          cursor: pointer;
          border: none;
          border-radius: 20px;
          font-family: inherit;
          font-weight: 700;
          font-size: 11.5px;
          letter-spacing: 0.05em;
          padding: 7px 16px;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.24s ease;
        }
        .theme-btn:hover { filter: brightness(1.10); transform: scale(1.05); }

        .topbar-exit-btn {
          border-radius: 10px;
          font-family: inherit;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          padding: 9px 22px;
          transition: all 0.22s ease;
          border: 1.5px solid rgba(255,255,255,0.40);
          background: transparent;
          color: #fff;
        }
        .topbar-exit-btn:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.70);
          transform: translateY(-1px);
        }
      `}</style>

      {/* ══ TOPBAR — sempre laranja ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #a84410 0%, #d4601a 42%, #ec6e2a 72%, #f07c38 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.18)',
        padding: '16px 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 4px 32px rgba(168,68,16,0.55)',
        zIndex: 100,
        gap: 16,
      }}>
        {/* Logo + Nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
          <div style={{
            width: 50, height: 50,
            background: '#fff',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,255,255,0.30)',
            position: 'relative', overflow: 'hidden', flexShrink: 0,
          }}>
            <Image src="/logo-base.png" alt="Criffer" fill style={{ objectFit: 'contain', padding: 6 }}/>
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: 5, lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
              CRIFFER
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.80)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 3 }}>
              ERP Financeiro
            </div>
          </div>
        </div>

        {/* Theme switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(0,0,0,0.22)',
          padding: '5px 6px',
          borderRadius: 26,
          flexShrink: 0,
          backdropFilter: 'blur(8px)',
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
                    ? (opt.key === 'dark' ? '#1a1a2a' : opt.key === 'light' ? '#f0f2f7' : 'rgba(255,255,255,0.30)')
                    : 'transparent',
                  color: active ? (opt.key === 'light' ? '#1a1a2e' : '#fff') : 'rgba(255,255,255,0.72)',
                  boxShadow: active ? '0 2px 10px rgba(0,0,0,0.28)' : 'none',
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
        justifyContent: 'center',
        position: 'relative',
        padding: '36px 4% 40px',
        overflow: 'hidden',
      }}>

        {/* Grid sutil */}
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

        {/* Título */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
          position: 'relative', zIndex: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{
            fontSize: 40, fontWeight: 900,
            color: t.text,
            letterSpacing: 3, lineHeight: 1,
            textShadow: theme === 'dark' ? '0 0 70px rgba(236,110,42,0.30)' : 'none',
            transition: 'color 0.5s, text-shadow 0.5s',
          }}>
            CENTRAL DE GESTÃO
          </div>
        </div>

        {/* ══ CARDS 4 em linha ══ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 22,
          width: '100%',
          maxWidth: 1280,
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
                  padding: '28px 26px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: 420,
                  transition: `box-shadow 0.38s ease, border-color 0.28s ease`,
                  animation: visible
                    ? `cardEntrance 0.70s cubic-bezier(0.34,1.56,0.64,1) ${0.06 + i * 0.10}s both`
                    : 'none',
                }}
              >
                {/* Shimmer no hover */}
                {isHov && <div className="cf-shimmer"/>}

                {/* Badge */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, position: 'relative', zIndex: 2 }}>
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

                {/* Ícone 3D */}
                <div className="cf-icon-wrap" style={{
                  width: '100%', height: 160,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 22,
                  position: 'relative', zIndex: 2,
                  borderRadius: 18,
                  background: t.iconBg,
                  border: `1px solid ${isHov ? borderColor + '66' : t.iconBorder}`,
                  overflow: 'hidden',
                  transition: 'background 0.5s, border-color 0.4s, box-shadow 0.4s',
                  boxShadow: isHov ? `0 10px 36px ${m.accentColor}35` : 'none',
                }}>
                  <div style={{ position: 'relative', width: 130, height: 130 }}>
                    <Image src={m.icon} alt={m.label} fill style={{ objectFit: 'contain' }}/>
                  </div>
                </div>

                {/* Conteúdo */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 2 }}>
                  <div style={{
                    fontSize: 18, fontWeight: 900,
                    color: t.text, letterSpacing: 1.5,
                    transition: 'color 0.5s', lineHeight: 1.2,
                  }}>
                    {m.label}
                  </div>

                  <div style={{
                    fontSize: 13.5, color: t.textSub,
                    lineHeight: 1.65, transition: 'color 0.5s',
                    fontWeight: 500,
                  }}>
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
                  paddingTop: 18, marginTop: 18,
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
