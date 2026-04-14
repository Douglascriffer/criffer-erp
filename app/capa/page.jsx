'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CapaPage() {
  const router = useRouter()
  const [user, setUser] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    if (!auth) { router.push('/login'); return }
    setUser(nome || '')
  }, [])

  const MODULES = [
    {
      id: 'faturamento',
      label: 'Faturamento',
      sub: 'Desempenho · Mapa',
      img: '/Receitas.png',
      href: '/dashboard?tab=desempenho',
    },
    {
      id: 'orcamento',
      label: 'Orçamento',
      sub: 'Receitas/Desp · Resultado · Metas',
      img: '/Orçamento.png',
      href: '/dashboard?tab=orcamento',
    },
    {
      id: 'fluxo',
      label: 'Fluxo de Caixa Direto',
      sub: 'Em breve',
      img: '/Fluxo_de_caixa.png',
      href: '/dashboard?tab=fluxo',
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #FFF8F5 0%, #FFF0E8 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .module-card { transition: transform 0.25s, box-shadow 0.25s; cursor: pointer; }
        .module-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(255,106,34,0.18) !important; }
        .logout-btn { transition: color 0.2s; }
        .logout-btn:hover { color: #FF6A22; }
      `}</style>

      {/* Header */}
      <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        {user && <span style={{ fontSize: 13, color: '#999' }}>Olá, {user.split(' ')[0]}</span>}
        <button className="logout-btn" onClick={() => { localStorage.clear(); router.push('/login') }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#ccc', fontFamily: 'inherit' }}>
          Sair
        </button>
      </div>

      {/* Logo */}
      <div style={{ animation: 'fadeIn 0.6s ease-out both', textAlign: 'center', marginBottom: 60 }}>
        <div style={{ fontSize: 48, fontWeight: 900, color: '#FF6A22', letterSpacing: 8, fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
          CRIFFER
        </div>
        <div style={{ fontSize: 14, color: '#CCC', letterSpacing: 2, marginTop: 8 }}>ERP FINANCEIRO</div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 1000,
      }}>
        {MODULES.map((m, i) => (
          <div key={m.id}
            className="module-card"
            onClick={() => router.push(m.href)}
            style={{
              animation: `fadeIn 0.6s ease-out ${0.2 + i * 0.15}s both`,
              background: 'white',
              borderRadius: 24,
              boxShadow: '0 8px 32px rgba(255,106,34,0.08)',
              border: '1px solid rgba(255,106,34,0.1)',
              padding: '40px 32px 32px',
              width: 260,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}>
            <div style={{ width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={m.img} alt={m.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 12, color: '#AAA' }}>{m.sub}</div>
            </div>
            <div style={{
              marginTop: 8,
              padding: '8px 24px',
              background: m.id === 'fluxo' ? '#F5F5F5' : '#FF6A22',
              color: m.id === 'fluxo' ? '#CCC' : 'white',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'Syne, sans-serif',
              letterSpacing: 0.5,
            }}>
              {m.id === 'fluxo' ? 'Em breve' : 'Acessar →'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
