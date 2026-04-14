'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const USUARIOS = [
  'Andressa Pereira da Silva Barth',
  'Alcione',
  'Rodrigo dos Santos',
  'Carlos Henrique Trein Rocha',
  'Cleiton Da Silva Staehler',
  'Douglas De Jesus Schmitz',
  'Felipe F de Andrade Oliveira',
  'Felipe Charão Antonio Maria',
  'Fernando Malta de Brito',
  'Felipe Martins Immich',
  'Gabriel Dias',
  'Juliano De Bastos Chagas',
  'Ruslan Fulaneto Dos Santos',
  'Faiblan',
]
const SENHA_CORRETA = 'Criffer2026'

function CubeLogo() {
  return (
    <svg width="180" height="60" viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {['C','R','I','F','F','E','R'].map((letter, i) => (
        <g key={i} transform={`translate(${i * 52}, 0)`} style={{animation:`cubeDrop 0.5s ease-out ${i*0.08}s both`}}>
          <rect x="2" y="2" width="44" height="60" rx="6" fill="#FF6A22" opacity="0.12"/>
          <rect x="0" y="0" width="44" height="58" rx="6" fill="#FF6A22"/>
          <rect x="0" y="0" width="44" height="58" rx="6" fill="url(#cube)" opacity="0.3"/>
          <text x="22" y="38" textAnchor="middle" fill="white" fontSize="28" fontWeight="800" fontFamily="Syne,sans-serif">{letter}</text>
        </g>
      ))}
      <defs>
        <linearGradient id="cube" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="black" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (nome.length > 0) {
      const filtered = USUARIOS.filter(u => u.toLowerCase().includes(nome.toLowerCase()))
      setFilteredUsers(filtered)
      setShowSuggestions(filtered.length > 0 && nome.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [nome])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!USUARIOS.includes(nome)) {
      setError('Usuário não encontrado.')
      return
    }
    if (senha !== SENHA_CORRETA) {
      setError('Senha incorreta.')
      return
    }
    setLoading(true)
    // Store user session in localStorage
    localStorage.setItem('criffer_user', nome)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8F5 0%, #FFF0E8 50%, #FFE4D6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 0,
    }}>
      <style>{`
        @keyframes cubeDrop {
          from { opacity: 0; transform: translateY(-30px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-left { animation: slideLeft 0.7s ease-out 0.6s both; }
        .slide-right { animation: slideRight 0.7s ease-out 0.6s both; }
        .fade-up { animation: fadeUp 0.6s ease-out 1s both; }
        .logo-wrap { animation: fadeUp 0.5s ease-out both; }
        input { outline: none; transition: border-color 0.2s; font-family: inherit; }
        input:focus { border-color: #FF6A22 !important; }
        .suggestion-item:hover { background: #FFF0E8; }
      `}</style>

      <div className="logo-wrap" style={{ marginBottom: 32 }}>
        {mounted && <CubeLogo />}
      </div>

      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '40px 48px',
        boxShadow: '0 20px 60px rgba(255,106,34,0.12)',
        width: '100%',
        maxWidth: 420,
        border: '0.5px solid rgba(255,106,34,0.15)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#999', letterSpacing: 1, textTransform: 'uppercase' }}>ERP Financeiro</span>
        </div>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#ccc', marginBottom: 32 }}>
          Acesse com seu nome e a senha da empresa
        </div>

        <form onSubmit={handleLogin}>
          {/* Campo nome — desliza da esquerda */}
          <div className="slide-left" style={{ marginBottom: 16, position: 'relative' }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
              Seu nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              onFocus={() => nome && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Digite seu nome..."
              autoComplete="off"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #E5E7EB',
                borderRadius: 10,
                fontSize: 14,
                color: '#111',
                background: '#FAFAFA',
              }}
            />
            {showSuggestions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1.5px solid #FFD4B8',
                borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                zIndex: 100,
                maxHeight: 200,
                overflowY: 'auto',
                marginTop: 4,
              }}>
                {filteredUsers.map(u => (
                  <div key={u} className="suggestion-item"
                    onMouseDown={() => { setNome(u); setShowSuggestions(false) }}
                    style={{ padding: '10px 16px', cursor: 'pointer', fontSize: 13, color: '#333', borderBottom: '0.5px solid #F5F5F5' }}>
                    {u}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campo senha — desliza da direita */}
          <div className="slide-right" style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid #E5E7EB',
                borderRadius: 10,
                fontSize: 14,
                color: '#111',
                background: '#FAFAFA',
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="fade-up">
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#FFB899' : '#FF6A22',
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'default' : 'pointer',
                fontFamily: 'Syne, sans-serif',
                letterSpacing: 1,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Entrando...' : 'ENTRAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
