'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

function CrifferLogo({ size = 38, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="18"/>
      <path d="M100 10 A90 90 0 0 1 190 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M100 190 A90 90 0 0 1 10 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M54 36 L54 100 L100 100 L100 56" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M146 164 L146 100 L100 100 L100 144" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="36" y1="100" x2="164" y2="100" stroke={color} strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="36" x2="100" y2="164" stroke={color} strokeWidth="13" strokeLinecap="round"/>
    </svg>
  )
}

export default function CapaPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [hovered, setHovered] = useState(null)
  const bodyRef = useRef(null)
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    if (!auth) { router.push('/login'); return }
    setUser(nome || '')
  }, [])

  // Cursor tracking
  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      if (dotRef.current) { dotRef.current.style.left = x + 'px'; dotRef.current.style.top = y + 'px' }
      if (ringRef.current) { ringRef.current.style.left = x + 'px'; ringRef.current.style.top = y + 'px' }
    }
    el.addEventListener('mousemove', move)
    return () => el.removeEventListener('mousemove', move)
  }, [])

  const MODULES = [
    {
      id: 'faturamento', label: 'FATURAMENTO', href: '/dashboard?tab=desempenho',
      icon: (
        <svg viewBox="0 0 52 52" fill="none" width="56" height="56">
          <rect x="6" y="8" width="40" height="36" rx="5" stroke="#ec6e2a" strokeWidth="2.5"/>
          <line x1="14" y1="20" x2="38" y2="20" stroke="#ec6e2a" strokeWidth="2"/>
          <line x1="14" y1="27" x2="30" y2="27" stroke="#ec6e2a" strokeWidth="2"/>
          <line x1="14" y1="34" x2="24" y2="34" stroke="#ec6e2a" strokeWidth="2"/>
          <path d="M32 30 L36 34 L44 24" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      disabled: false,
    },
    {
      id: 'orcamento', label: 'ORÇAMENTO', href: '/dashboard?tab=orcamento',
      icon: (
        <svg viewBox="0 0 52 52" fill="none" width="56" height="56">
          <circle cx="26" cy="26" r="19" stroke="#ec6e2a" strokeWidth="2.5"/>
          <line x1="26" y1="14" x2="26" y2="26" stroke="#ec6e2a" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="26" y1="26" x2="34" y2="32" stroke="#3978bc" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="26" cy="26" r="2.5" fill="#ec6e2a"/>
          <line x1="26" y1="7" x2="26" y2="11" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
          <line x1="26" y1="41" x2="26" y2="45" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
          <line x1="7" y1="26" x2="11" y2="26" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
          <line x1="41" y1="26" x2="45" y2="26" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      disabled: false,
    },
    {
      id: 'fluxo', label: 'FLUXO DE CAIXA', href: '/dashboard?tab=fluxo',
      icon: (
        <svg viewBox="0 0 52 52" fill="none" width="56" height="56">
          <path d="M10 36 L20 24 L28 30 L42 16" stroke="#ec6e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="34,16 42,16 42,24" stroke="#ec6e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="10" y1="42" x2="42" y2="42" stroke="#b5b5b5" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      disabled: true,
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .mod-card { cursor:pointer; border-radius:20px; border:2px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); transition:all .28s cubic-bezier(.34,1.56,.64,1); display:flex; flex-direction:column; align-items:center; padding:36px 28px 32px; }
        .mod-card:hover { transform:scale(1.1); border-color:#ec6e2a; background:rgba(236,110,42,0.08); }
        .mod-card:hover .mod-icon-wrap { box-shadow:0 0 0 6px rgba(236,110,42,0.25), 0 0 40px rgba(236,110,42,0.2); }
        .mod-disabled { opacity:.4; cursor:not-allowed !important; }
        .mod-disabled:hover { transform:none !important; border-color:rgba(255,255,255,0.08) !important; background:rgba(255,255,255,0.04) !important; }
        .mod-disabled:hover .mod-icon-wrap { box-shadow:none !important; }
        .cursor-dot { position:absolute; width:10px; height:10px; border-radius:50%; background:#ec6e2a; pointer-events:none; transform:translate(-50%,-50%); transition:left 0.06s,top 0.06s; opacity:0.8; z-index:10; }
        .cursor-ring { position:absolute; width:30px; height:30px; border-radius:50%; border:2px solid #ec6e2a; pointer-events:none; transform:translate(-50%,-50%); transition:left 0.16s,top 0.16s; opacity:0.3; z-index:9; }
        .topbar-btn { border:1.5px solid rgba(255,255,255,0.3); border-radius:8px; background:rgba(255,255,255,0.1); cursor:pointer; font-size:13px; color:#fff; padding:7px 16px; font-family:inherit; transition:all .2s; }
        .topbar-btn:hover { background:rgba(255,255,255,0.25); }
      `}</style>

      {/* TOPBAR — fundo laranja, letras brancas */}
      <div style={{ background: '#ec6e2a', padding: '12px 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CrifferLogo size={38} color="white" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: 4, lineHeight: 1 }}>CRIFFERLAB</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>ERP Financeiro</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>Olá, {user.split(' ')[0]}</span>}
          <button className="topbar-btn" onClick={() => { localStorage.clear(); router.push('/login') }}>
            Sair
          </button>
        </div>
      </div>

      {/* BODY — fundo preto com cursor tracking */}
      <div ref={bodyRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '40px 5%' }}>
        {/* Cursor */}
        <div className="cursor-dot" ref={dotRef} />
        <div className="cursor-ring" ref={ringRef} />

        {/* Logo marca d'água */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, pointerEvents: 'none' }}>
          <CrifferLogo size={480} color="white" />
        </div>

        {/* Títulos */}
        <div style={{ textAlign: 'center', marginBottom: 52, position: 'relative', zIndex: 2, animation: 'fadeUp .5s ease-out both' }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>CENTRAL DE GESTÃO</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 10 }}>Selecione um módulo</div>
        </div>

        {/* Módulos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, width: '100%', maxWidth: 860, position: 'relative', zIndex: 2 }}>
          {MODULES.map((m, i) => (
            <div
              key={m.id}
              className={`mod-card${m.disabled ? ' mod-disabled' : ''}`}
              onClick={() => !m.disabled && router.push(m.href)}
              style={{ animation: `fadeUp .5s ease-out ${.1 + i * .12}s both` }}
            >
              <div className="mod-icon-wrap" style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(236,110,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, transition: 'all .28s ease' }}>
                {m.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: m.disabled ? 'rgba(255,255,255,0.3)' : '#fff', letterSpacing: 2, textAlign: 'center' }}>{m.label}</div>
              {m.disabled && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6, letterSpacing: 1 }}>Em construção</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
