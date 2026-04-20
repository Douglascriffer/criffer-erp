'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

/* ─── Sistema de temas ─── */
const THEMES = {
  dark: {
    bg: 'linear-gradient(145deg, #0c0c14 0%, #111118 60%, #0e0e18 100%)',
    card: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.09)',
    cardHover: 'rgba(236,110,42,0.09)',
    cardHoverBorder: '#ec6e2a',
    cardShadow: '0 2px 16px rgba(0,0,0,0.18)',
    cardHoverShadow: '0 24px 64px rgba(236,110,42,0.20), 0 4px 24px rgba(0,0,0,0.2)',
    text: '#ffffff',
    textSub: 'rgba(255,255,255,0.50)',
    textMuted: 'rgba(255,255,255,0.22)',
    topbar: 'rgba(12,12,20,0.96)',
    topbarBorder: 'rgba(255,255,255,0.07)',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.13)',
    iconBg: 'rgba(236,110,42,0.09)',
    iconBorder: 'rgba(236,110,42,0.28)',
    divider: 'rgba(255,255,255,0.07)',
    grid: '#ec6e2a',
    gridOpacity: 0.028,
    pillBg: 'rgba(255,255,255,0.07)',
    statusActive: '#22c55e',
    statusBuilding: '#f59e0b',
  },
  light: {
    bg: 'linear-gradient(145deg, #f0f2f7 0%, #e8eaef 60%, #f2f4f9 100%)',
    card: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.07)',
    cardHover: 'rgba(236,110,42,0.05)',
    cardHoverBorder: '#ec6e2a',
    cardShadow: '0 2px 16px rgba(0,0,0,0.06)',
    cardHoverShadow: '0 24px 64px rgba(236,110,42,0.14), 0 4px 24px rgba(0,0,0,0.08)',
    text: '#1a1a2e',
    textSub: 'rgba(26,26,46,0.52)',
    textMuted: 'rgba(26,26,46,0.30)',
    topbar: 'rgba(255,255,255,0.96)',
    topbarBorder: 'rgba(0,0,0,0.08)',
    accent: '#ec6e2a',
    accentSoft: 'rgba(236,110,42,0.09)',
    iconBg: 'rgba(236,110,42,0.08)',
    iconBorder: 'rgba(236,110,42,0.22)',
    divider: 'rgba(0,0,0,0.07)',
    grid: '#ec6e2a',
    gridOpacity: 0.04,
    pillBg: 'rgba(0,0,0,0.06)',
    statusActive: '#16a34a',
    statusBuilding: '#d97706',
  },
  orange: {
    bg: 'linear-gradient(145deg, #b84e12 0%, #d4631c 50%, #c05518 100%)',
    card: 'rgba(255,255,255,0.12)',
    cardBorder: 'rgba(255,255,255,0.20)',
    cardHover: 'rgba(255,255,255,0.20)',
    cardHoverBorder: 'rgba(255,255,255,0.85)',
    cardShadow: '0 2px 16px rgba(0,0,0,0.15)',
    cardHoverShadow: '0 24px 64px rgba(0,0,0,0.28), 0 4px 24px rgba(0,0,0,0.18)',
    text: '#ffffff',
    textSub: 'rgba(255,255,255,0.70)',
    textMuted: 'rgba(255,255,255,0.42)',
    topbar: 'rgba(0,0,0,0.18)',
    topbarBorder: 'rgba(255,255,255,0.16)',
    accent: '#ffffff',
    accentSoft: 'rgba(255,255,255,0.16)',
    iconBg: 'rgba(255,255,255,0.14)',
    iconBorder: 'rgba(255,255,255,0.32)',
    divider: 'rgba(255,255,255,0.16)',
    grid: '#fff',
    gridOpacity: 0.05,
    pillBg: 'rgba(0,0,0,0.18)',
    statusActive: '#bbf7d0',
    statusBuilding: '#fef3c7',
  },
}

/* ─── Ícones modernos por módulo ─── */
function IconFaturamento({ color }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" width="34" height="34">
      <rect x="6" y="4" width="26" height="34" rx="4" stroke={color} strokeWidth="2.2"/>
      <line x1="12" y1="14" x2="26" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="12" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M22 30 L26 34 L34 24" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconOrcamento({ color }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" width="34" height="34">
      <circle cx="22" cy="22" r="16" stroke={color} strokeWidth="2.2" opacity="0.3"/>
      <path d="M22 6 A16 16 0 0 1 38 22" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M38 22 A16 16 0 0 1 22 38" stroke={color} strokeWidth="4.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M22 38 A16 16 0 0 1 6 22" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M6 22 A16 16 0 0 1 22 6" stroke={color} strokeWidth="4.5" strokeLinecap="round" opacity="0.3"/>
      <circle cx="22" cy="22" r="4" fill={color}/>
    </svg>
  )
}

function IconFluxo({ color }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" width="34" height="34">
      <rect x="6" y="26" width="8" height="12" rx="2" fill={color} opacity="0.5"/>
      <rect x="18" y="18" width="8" height="20" rx="2" fill={color} opacity="0.7"/>
      <rect x="30" y="10" width="8" height="28" rx="2" fill={color}/>
      <path d="M10 14 L22 10 L34 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" opacity="0.5"/>
    </svg>
  )
}

function IconInadimplencia({ color }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" width="34" height="34">
      <circle cx="17" cy="14" r="6" stroke={color} strokeWidth="2.2"/>
      <path d="M6 36c0-6.075 4.925-11 11-11h3" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="32" cy="30" r="8" stroke="#ef4444" strokeWidth="2.2"/>
      <line x1="32" y1="26" x2="32" y2="31" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="34.5" r="1.2" fill="#ef4444"/>
    </svg>
  )
}

const MODULE_ICONS = {
  faturamento:   (color) => <IconFaturamento color={color} />,
  orcamento:     (color) => <IconOrcamento color={color} />,
  fluxo:         (color) => <IconFluxo color={color} />,
  inadimplencia: (color) => <IconInadimplencia color={color} />,
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
      label: 'FATURAMENTO',
      desc: 'Análise de receita, mapa de vendas e acompanhamento de metas mensais.',
      tags: ['Receita', 'Mapa', 'Metas'],
      href: '/dashboard?tab=desempenho',
      disabled: false,
      status: 'active',
      badge: 'Operacional',
    },
    {
      id: 'orcamento',
      label: 'ORÇAMENTO',
      desc: 'Gestão de orçamentos, análise de resultados e projeções financeiras.',
      tags: ['Receitas', 'Resultado', 'Metas'],
      href: '/dashboard?tab=orcamento',
      disabled: false,
      status: 'active',
      badge: 'Operacional',
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
    },
  ]

  const THEME_OPTS = [
    { key: 'dark',   label: 'Escuro',  dot: '#0c0c14' },
    { key: 'light',  label: 'Claro',   dot: '#e8eaef' },
    { key: 'orange', label: 'Laranja', dot: '#ec6e2a' },
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

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236,110,42,0.3); }
          50%       { box-shadow: 0 0 0 10px rgba(236,110,42,0); }
        }

        .cf-card {
          cursor: pointer;
          border-radius: 22px;
          position: relative;
          overflow: hidden;
          transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.38s ease,
                      background 0.5s ease,
                      border-color 0.38s ease;
        }
        .cf-card:hover { transform: translateY(-8px) scale(1.025); }
        .cf-card-disabled { opacity: 0.36; cursor: not-allowed !important; }
        .cf-card-disabled:hover { transform: none !important; }

        .cf-shimmer {
          position: absolute;
          top: 0; left: -100%; height: 100%; width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          transform: skewX(-20deg);
          animation: shimmer 0.7s ease forwards;
          pointer-events: none;
        }

        .theme-pill-btn {
          cursor: pointer;
          border: none;
          border-radius: 18px;
          font-family: inherit;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
        }
        .theme-pill-btn:hover { filter: brightness(1.1); transform: scale(1.04); }

        .exit-btn {
          border-radius: 10px;
          font-family: inherit;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
          padding: 8px 20px;
          transition: all 0.22s ease;
        }
        .exit-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{
        background: t.topbar,
        borderBottom: `1px solid ${t.topbarBorder}`,
        padding: '12px 5%',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            background: '#fff',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 14px rgba(0,0,0,0.18), 0 0 0 2px rgba(236,110,42,0.25)',
            position: 'relative', overflow: 'hidden',
          }}>
            <Image src="/logo-base.png" alt="Criffer" fill style={{ objectFit: 'contain', padding: 5 }}/>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900, color: t.text, letterSpacing: 4, lineHeight: 1, transition: 'color 0.5s' }}>
              CRIFFER
            </div>
            <div style={{ fontSize: 9, color: t.textSub, letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 3, transition: 'color 0.5s' }}>
              ERP Financeiro
            </div>
          </div>
        </div>

        {/* Tema switcher — centro */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: t.pillBg,
          padding: '5px 6px',
          borderRadius: 24,
          flexShrink: 0,
          transition: 'background 0.5s',
        }}>
          {THEME_OPTS.map(opt => {
            const active = theme === opt.key
            return (
              <button
                key={opt.key}
                className="theme-pill-btn"
                onClick={() => changeTheme(opt.key)}
                style={{
                  background: active ? (opt.key === 'dark' ? '#1a1a2a' : opt.key === 'light' ? '#ffffff' : '#ec6e2a') : 'transparent',
                  color: active ? (opt.key === 'light' ? '#1a1a2e' : '#fff') : t.textSub,
                  boxShadow: active ? '0 2px 10px rgba(0,0,0,0.22)' : 'none',
                }}
              >
                <span style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: opt.dot,
                  border: `1.5px solid ${active ? 'rgba(255,255,255,0.4)' : 'rgba(128,128,128,0.4)'}`,
                  flexShrink: 0,
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
              <div style={{ fontSize: 13, color: t.text, fontWeight: 700, transition: 'color 0.5s', lineHeight: 1.2 }}>
                {user.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10, color: t.textSub, transition: 'color 0.5s' }}>
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
              transition: 'all 0.22s',
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
        position: 'relative', padding: '48px 5%',
        overflow: 'hidden',
      }}>

        {/* Grid de fundo sutil */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: t.gridOpacity, transition: 'opacity 0.6s' }}>
          <defs>
            <pattern id="cf-grid" width="52" height="52" patternUnits="userSpaceOnUse">
              <path d="M 52 0 L 0 0 0 52" fill="none" stroke={t.grid} strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cf-grid)"/>
        </svg>

        {/* Orbs decorativos de fundo */}
        <div style={{ position: 'absolute', top: '12%', right: '6%', width: 340, height: 340, borderRadius: '50%', background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 68%)`, pointerEvents: 'none', filter: 'blur(48px)', transition: 'background 0.6s' }}/>
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 68%)`, pointerEvents: 'none', filter: 'blur(36px)', transition: 'background 0.6s' }}/>

        {/* Título */}
        <div style={{
          textAlign: 'center', marginBottom: 52,
          position: 'relative', zIndex: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: t.accentSoft, border: `1px solid ${t.accent}33`,
            borderRadius: 20, padding: '5px 16px', marginBottom: 16,
            transition: 'background 0.5s',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent, animation: 'glow 2.4s ease infinite' }}/>
            <span style={{ fontSize: 10, color: t.accent, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', transition: 'color 0.5s' }}>
              Sistema de Gestão
            </span>
          </div>
          <div style={{
            fontSize: 34, fontWeight: 900, color: t.text,
            letterSpacing: 2, lineHeight: 1,
            textShadow: theme === 'dark' ? '0 0 60px rgba(236,110,42,0.2)' : 'none',
            transition: 'color 0.5s, text-shadow 0.5s',
          }}>
            CENTRAL DE GESTÃO
          </div>
          <div style={{ fontSize: 13, color: t.textSub, letterSpacing: 2.5, marginTop: 14, transition: 'color 0.5s' }}>
            Selecione um módulo para continuar
          </div>
        </div>

        {/* ── BENTO GRID 2×2 ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 22,
          width: '100%',
          maxWidth: 880,
          position: 'relative', zIndex: 2,
        }}>
          {MODULES.map((m, i) => {
            const isHov = hovered === m.id
            return (
              <div
                key={m.id}
                className={`cf-card${m.disabled ? ' cf-card-disabled' : ''}`}
                onMouseEnter={() => !m.disabled && setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => !m.disabled && router.push(m.href)}
                style={{
                  background: isHov ? t.cardHover : t.card,
                  border: `1.5px solid ${isHov ? t.cardHoverBorder : t.cardBorder}`,
                  boxShadow: isHov ? t.cardHoverShadow : t.cardShadow,
                  padding: '30px 28px',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 0.5s ${0.1 + i * 0.09}s, transform 0.65s ${0.1 + i * 0.09}s cubic-bezier(0.34,1.56,0.64,1), background 0.5s, border-color 0.38s, box-shadow 0.38s`,
                }}
              >
                {/* Efeito shimmer no hover */}
                {isHov && <div className="cf-shimmer"/>}

                {/* Linha superior: ícone + badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
                  {/* Ícone */}
                  <div style={{
                    width: 68, height: 68, borderRadius: 18,
                    background: t.iconBg,
                    border: `1.5px solid ${isHov ? t.cardHoverBorder : t.iconBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isHov ? `0 0 0 6px ${t.accentSoft}` : 'none',
                    transition: 'all 0.38s ease',
                    flexShrink: 0,
                  }}>
                    {MODULE_ICONS[m.id](isHov ? t.accent : t.accent)}
                  </div>

                  {/* Badge status */}
                  <div style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
                    padding: '5px 12px', borderRadius: 20,
                    background: m.status === 'active'
                      ? `${t.statusActive}1e`
                      : `${t.statusBuilding}1e`,
                    color: m.status === 'active' ? t.statusActive : t.statusBuilding,
                    border: `1px solid ${m.status === 'active' ? t.statusActive : t.statusBuilding}44`,
                    transition: 'all 0.5s',
                    whiteSpace: 'nowrap',
                  }}>
                    {m.status === 'active' ? '● ' : '○ '}{m.badge}
                  </div>
                </div>

                {/* Nome do módulo */}
                <div style={{ fontSize: 15, fontWeight: 800, color: t.text, letterSpacing: 1.5, marginBottom: 8, transition: 'color 0.5s' }}>
                  {m.label}
                </div>

                {/* Descrição */}
                <div style={{ fontSize: 12, color: t.textSub, lineHeight: 1.6, marginBottom: 18, transition: 'color 0.5s' }}>
                  {m.desc}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 10px',
                      borderRadius: 20, letterSpacing: 0.5,
                      background: t.accentSoft,
                      color: t.accent,
                      border: `1px solid ${t.accent}28`,
                      transition: 'all 0.5s',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Rodapé: ação */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 18, borderTop: `1px solid ${t.divider}`,
                  transition: 'border-color 0.5s',
                }}>
                  <span style={{ fontSize: 11, color: t.textMuted, letterSpacing: 0.5, transition: 'color 0.5s' }}>
                    {m.disabled ? 'Módulo em desenvolvimento' : 'Clique para acessar'}
                  </span>
                  {!m.disabled && (
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: isHov ? t.accent : t.accentSoft,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.35s ease',
                      flexShrink: 0,
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
