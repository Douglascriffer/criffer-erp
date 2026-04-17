'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

function Logo({ size = 38, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="18"/>
      <path d="M100 12 A88 88 0 0 1 188 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M100 188 A88 88 0 0 1 12 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M54 38 L54 100 L100 100 L100 58" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M146 162 L146 100 L100 100 L100 142" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="38" y1="100" x2="162" y2="100" stroke={color} strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="38" x2="100" y2="162" stroke={color} strokeWidth="13" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── KPI Background animada com parallax ─── */
function KpiBg({ mouseX, mouseY }) {
  // Círculos flutuantes que reagem ao mouse
  const circles = [
    { cx:15, cy:20, r:180, delay:0 },
    { cx:80, cy:60, r:120, delay:0.5 },
    { cx:50, cy:80, r:100, delay:1 },
    { cx:90, cy:15, r:90,  delay:1.5 },
  ]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {/* Mão KPI SVG abstrata */}
      <div style={{
        position:'absolute', right:'8%', top:'50%',
        transform:`translate(${mouseX * 18}px, ${mouseY * 18 - 50}%) scale(1.05)`,
        transition:'transform 0.12s ease-out',
        opacity:0.12,
      }}>
        <svg viewBox="0 0 320 420" width="320" height="420" fill="none">
          {/* Braço */}
          <rect x="130" y="220" width="60" height="180" rx="30" fill="#ec6e2a"/>
          {/* Mão */}
          <ellipse cx="160" cy="210" rx="55" ry="55" fill="#ec6e2a"/>
          {/* Dedo indicador apontando */}
          <rect x="148" y="100" width="24" height="120" rx="12" fill="#ec6e2a"/>
          {/* Dedos fechados */}
          <rect x="106" y="150" width="22" height="80" rx="11" fill="#ec6e2a" opacity=".8"/>
          <rect x="172" y="155" width="22" height="75" rx="11" fill="#ec6e2a" opacity=".8"/>
          <rect x="196" y="165" width="20" height="65" rx="10" fill="#ec6e2a" opacity=".6"/>
          {/* Ícones KPI ao redor */}
          <circle cx="80" cy="80" r="35" stroke="#ec6e2a" strokeWidth="3" fill="none"/>
          <polyline points="65,95 75,80 85,88 100,70" stroke="#ec6e2a" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="240" cy="120" r="30" stroke="#ec6e2a" strokeWidth="3" fill="none"/>
          <line x1="230" y1="130" x2="250" y2="130" stroke="#ec6e2a" strokeWidth="3" strokeLinecap="round"/>
          <line x1="240" y1="120" x2="240" y2="140" stroke="#ec6e2a" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="260" cy="300" r="28" stroke="#ec6e2a" strokeWidth="3" fill="none"/>
          <text x="252" y="308" fill="#ec6e2a" fontSize="22" fontWeight="bold">%</text>
          <circle cx="50" cy="320" r="28" stroke="#ec6e2a" strokeWidth="3" fill="none"/>
          <rect x="40" y="305" width="8" height="30" rx="2" fill="#ec6e2a"/>
          <rect x="52" y="315" width="8" height="20" rx="2" fill="#ec6e2a"/>
        </svg>
      </div>

      {/* Orbs flutuantes */}
      {circles.map((c, i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${c.cx}%`, top:`${c.cy}%`,
          width:c.r, height:c.r,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(236,110,42,0.08) 0%, transparent 70%)',
          transform:`translate(${mouseX * (i+1) * 8}px, ${mouseY * (i+1) * 8}px)`,
          transition:`transform ${0.1 + i * 0.04}s ease-out`,
          animation:`float${i} ${4 + i}s ease-in-out infinite alternate`,
        }}/>
      ))}
      <style>{`
        @keyframes float0{from{transform:translateY(0)}to{transform:translateY(-20px)}}
        @keyframes float1{from{transform:translateY(0)}to{transform:translateY(-30px)}}
        @keyframes float2{from{transform:translateY(0)}to{transform:translateY(-15px)}}
        @keyframes float3{from{transform:translateY(0)}to{transform:translateY(-25px)}}
      `}</style>

      {/* Grade de linhas sutis */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04 }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ec6e2a" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>
  )
}

/* ─── Ícones dos módulos ─── */
const MODULE_ICONS = {
  faturamento: (
    <svg viewBox="0 0 56 56" fill="none" width="52" height="52">
      <rect x="7" y="9" width="42" height="38" rx="6" stroke="#ec6e2a" strokeWidth="2.5"/>
      <line x1="15" y1="21" x2="41" y2="21" stroke="#ec6e2a" strokeWidth="2"/>
      <line x1="15" y1="29" x2="32" y2="29" stroke="#ec6e2a" strokeWidth="2"/>
      <line x1="15" y1="37" x2="26" y2="37" stroke="#ec6e2a" strokeWidth="2"/>
      <path d="M34 32 L38 36 L46 26" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  orcamento: (
    <svg viewBox="0 0 56 56" fill="none" width="52" height="52">
      <circle cx="28" cy="28" r="20" stroke="#ec6e2a" strokeWidth="2.5"/>
      <line x1="28" y1="16" x2="28" y2="28" stroke="#ec6e2a" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="28" x2="37" y2="35" stroke="#3978bc" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="28" cy="28" r="2.8" fill="#ec6e2a"/>
      <line x1="28" y1="8" x2="28" y2="12" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
      <line x1="28" y1="44" x2="28" y2="48" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="28" x2="12" y2="28" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
      <line x1="44" y1="28" x2="48" y2="28" stroke="#ec6e2a" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  fluxo: (
    <svg viewBox="0 0 56 56" fill="none" width="52" height="52">
      <polyline points="10,42 20,28 30,35 46,18" stroke="#ec6e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="38,18 46,18 46,26" stroke="#ec6e2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="10" y1="48" x2="46" y2="48" stroke="#b5b5b5" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

export default function CapaPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hoveredMod, setHoveredMod] = useState(null)
  const [visible, setVisible] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    if (!auth) { router.push('/login'); return }
    setUser(nome || '')
    setTimeout(() => setVisible(true), 80)
  }, [])

  const handleMouseMove = useCallback((e) => {
    const el = bodyRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    setMouse({ x: nx, y: ny })
  }, [])

  const MODULES = [
    { id:'faturamento', label:'FATURAMENTO', sub:'Receita · Mapa · Metas', href:'/dashboard?tab=desempenho', disabled:false },
    { id:'orcamento',   label:'ORÇAMENTO',   sub:'Receitas · Resultado · Metas', href:'/dashboard?tab=orcamento', disabled:false },
    { id:'fluxo',       label:'FLUXO DE CAIXA', sub:'Em construção', href:'#', disabled:true },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#000', display:'flex', flexDirection:'column', fontFamily:'Syne,sans-serif', overflow:'hidden' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(236,110,42,0.4)}50%{box-shadow:0 0 0 12px rgba(236,110,42,0)}}
        .mod-btn{cursor:pointer;border-radius:20px;border:2px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03);transition:all .32s cubic-bezier(.34,1.56,.64,1);display:flex;flex-direction:column;align-items:center;padding:36px 24px 30px}
        .mod-btn:hover{transform:translateY(-10px) scale(1.06);border-color:#ec6e2a;background:rgba(236,110,42,0.08);box-shadow:0 24px 60px rgba(236,110,42,0.25)}
        .mod-btn:hover .mod-icon{box-shadow:0 0 0 6px rgba(236,110,42,0.3);animation:pulse 1.5s ease infinite}
        .mod-disabled{opacity:.35;cursor:not-allowed!important}
        .mod-disabled:hover{transform:none!important;border-color:rgba(255,255,255,0.06)!important;background:rgba(255,255,255,0.03)!important;box-shadow:none!important}
      `}</style>

      {/* TOPBAR laranja */}
      <div style={{ background:'#ec6e2a', padding:'11px 5%', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, boxShadow:'0 2px 20px rgba(236,110,42,0.4)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Logo size={36} color="white"/>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:'#fff', letterSpacing:4, lineHeight:1 }}>CRIFFERLAB</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.7)', letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>ERP Financeiro</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {user && <span style={{ fontSize:14, color:'#fff', fontWeight:600 }}>Olá, {user.split(' ')[0]}</span>}
          <button onClick={() => { localStorage.clear(); router.push('/login') }}
            style={{ border:'1.5px solid rgba(255,255,255,0.4)', borderRadius:8, background:'transparent', cursor:'pointer', fontSize:13, color:'#fff', padding:'7px 16px', fontFamily:'inherit', transition:'all .2s' }}
            onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background='transparent'}>
            Sair
          </button>
        </div>
      </div>

      {/* BODY interativo */}
      <div ref={bodyRef} onMouseMove={handleMouseMove}
        style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', padding:'40px 5%' }}>

        <KpiBg mouseX={mouse.x} mouseY={mouse.y}/>

        {/* Cursor dot */}
        <div style={{
          position:'absolute', pointerEvents:'none', zIndex:10,
          width:10, height:10, borderRadius:'50%', background:'#ec6e2a', opacity:0.7,
          left:`calc(${(mouse.x+0.5)*100}% - 5px)`,
          top:`calc(${(mouse.y+0.5)*100}% - 5px)`,
          transition:'left 0.06s, top 0.06s',
          boxShadow:'0 0 0 16px rgba(236,110,42,0.1)',
        }}/>

        {/* Título */}
        <div style={{ textAlign:'center', marginBottom:52, position:'relative', zIndex:2,
          opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(20px)',
          transition:'all 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ fontSize:34, fontWeight:900, color:'#fff', letterSpacing:2, textShadow:'0 0 40px rgba(236,110,42,0.4)' }}>
            CENTRAL DE GESTÃO
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', letterSpacing:3, textTransform:'uppercase', marginTop:12 }}>
            Selecione um módulo
          </div>
        </div>

        {/* Cards dos módulos */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32, width:'100%', maxWidth:900, position:'relative', zIndex:2 }}>
          {MODULES.map((m, i) => (
            <div key={m.id}
              className={`mod-btn${m.disabled?' mod-disabled':''}`}
              onMouseEnter={() => setHoveredMod(m.id)}
              onMouseLeave={() => setHoveredMod(null)}
              onClick={() => !m.disabled && router.push(m.href)}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.5s ${0.15+i*0.12}s, transform 0.6s ${0.15+i*0.12}s cubic-bezier(0.34,1.56,0.64,1)`,
              }}>
              {/* Ícone */}
              <div className="mod-icon" style={{ width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.05)', border:'2px solid rgba(236,110,42,0.4)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, transition:'all .32s ease' }}>
                {MODULE_ICONS[m.id]}
              </div>
              {/* Label */}
              <div style={{ fontSize:13, fontWeight:800, color:m.disabled?'rgba(255,255,255,0.25)':'#fff', letterSpacing:2, textAlign:'center', marginBottom:8 }}>{m.label}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:.5, textAlign:'center' }}>{m.sub}</div>

              {/* Linha decorativa animada no hover */}
              <div style={{ width: hoveredMod===m.id ? '60%' : '0%', height:2, background:'#ec6e2a', borderRadius:2, marginTop:20, transition:'width 0.3s ease', opacity: m.disabled?0:1 }}/>
            </div>
          ))}
        </div>

        {/* Logo fundo marca d'água */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', opacity:0.03, pointerEvents:'none', zIndex:0 }}>
          <Logo size={500} color="white"/>
        </div>
      </div>
    </div>
  )
}
