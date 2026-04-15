'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CapaPage() {
  const router = useRouter()
  const [user, setUser] = useState('')

  useEffect(() => {
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    if (!auth) { router.push('/login'); return }
    setUser(nome || '')
  }, [])

  const MODULES = [
    { id: 'faturamento', label: 'Faturamento', sub: 'Desempenho · Mapa · Ranking', img: '/Receitas.png', href: '/dashboard?tab=desempenho', color: '#FF6A22', disabled: false },
    { id: 'orcamento',   label: 'Orçamento',   sub: 'Receitas/Desp · Resultado · Metas', img: '/Orcamento.png', href: '/dashboard?tab=orcamento', color: '#FF8C52', disabled: false },
    { id: 'fluxo',       label: 'Fluxo de Caixa Direto', sub: 'Em construção', img: '/Fluxo_de_caixa.png', href: '/dashboard?tab=fluxo', color: '#FFAB80', disabled: true },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Syne, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .mod { cursor:pointer; border-radius:20px; border:2px solid #F0EDE8; background:#fff; transition:all .25s cubic-bezier(.34,1.56,.64,1); display:flex; flex-direction:column; align-items:center; padding:0; overflow:hidden; }
        .mod:hover { transform:translateY(-8px) scale(1.02); border-color:#FF6A22; box-shadow:0 20px 60px rgba(255,106,34,.18); }
        .mod:hover .img-wrap { box-shadow:0 0 0 4px rgba(255,106,34,0.18); }
        .mod-disabled { opacity:.55; cursor:not-allowed !important; }
        .mod-disabled:hover { transform:none !important; border-color:#F0EDE8 !important; box-shadow:none !important; }
      `}</style>

      {/* TOPBAR */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 5%', borderBottom:'1px solid #F5F5F5' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'#FF6A22', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><polygon points="11,2 21,7 21,15 11,20 1,15 1,7" fill="white" opacity=".15"/><polygon points="11,2 21,7 11,12 1,7" fill="white"/><polygon points="1,7 11,12 11,20 1,15" fill="white" opacity=".7"/><polygon points="21,7 11,12 11,20 21,15" fill="white" opacity=".9"/></svg>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:'#FF6A22', letterSpacing:5, lineHeight:1 }}>CRIFFER</div>
            <div style={{ fontSize:9, color:'#CCC', letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>ERP Financeiro</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {user && <span style={{ fontSize:14, color:'#555', fontWeight:600 }}>Olá, {user.split(' ')[0]}</span>}
          <button onClick={() => { localStorage.clear(); router.push('/login') }}
            style={{ border:'1.5px solid #EEE', borderRadius:8, background:'none', cursor:'pointer', fontSize:13, color:'#999', padding:'7px 16px', fontFamily:'inherit', transition:'all .2s' }}
            onMouseOver={e=>{e.target.style.borderColor='#FF6A22';e.target.style.color='#FF6A22'}}
            onMouseOut={e=>{e.target.style.borderColor='#EEE';e.target.style.color='#999'}}>
            Sair
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'40px 5%' }}>
        <div style={{ textAlign:'center', marginBottom:48, animation:'fadeUp .5s ease-out both' }}>
          <div style={{ fontSize:12, color:'#CCC', letterSpacing:3, textTransform:'uppercase', marginBottom:8 }}>Selecione um módulo</div>
          <div style={{ fontSize:34, fontWeight:900, color:'#1A1A1A', letterSpacing:-0.5 }}>Central de Gestão</div>
        </div>

        {/* CARDS — full width, 3 cols */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:28, width:'100%', maxWidth:1300, margin:'0 auto' }}>
          {MODULES.map((m, i) => (
            <div key={m.id}
              className={`mod${m.disabled?' mod-disabled':''}`}
              onClick={() => !m.disabled && router.push(m.href)}
              style={{ animation:`fadeUp .5s ease-out ${.12+i*.12}s both` }}>
              {/* Image area — full width top */}
              <div className="img-wrap" style={{ width:'100%', background:'#FFF8F5', display:'flex', alignItems:'center', justifyContent:'center', padding:'36px 20%', transition:'box-shadow .25s', borderRadius:'18px 18px 0 0' }}>
                <img src={m.img} alt={m.label}
                  style={{ width:'100%', maxHeight:160, objectFit:'contain' }}
                  onError={e => { e.currentTarget.src = ''; e.currentTarget.style.display='none'; e.currentTarget.parentNode.innerHTML=`<div style="font-size:48px">${m.id==='faturamento'?'📊':m.id==='orcamento'?'💰':'💵'}</div>` }} />
              </div>
              {/* Text area */}
              <div style={{ padding:'24px 28px 28px', width:'100%', textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:900, color:'#1A1A1A', marginBottom:8 }}>{m.label}</div>
                <div style={{ fontSize:13, color:'#AAA', marginBottom:20, lineHeight:1.6 }}>{m.sub}</div>
                <div style={{ padding:'13px', background:m.disabled?'#F5F5F5':m.color, color:m.disabled?'#CCC':'white', borderRadius:12, fontSize:14, fontWeight:800, letterSpacing:.5 }}>
                  {m.disabled ? 'Em construção' : `Acessar →`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
