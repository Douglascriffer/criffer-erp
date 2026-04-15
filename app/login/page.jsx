'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

function CrifferLogo({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke="#ec6e2a" strokeWidth="18"/>
      <path d="M100 10 A90 90 0 0 1 190 100" stroke="#ec6e2a" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M100 190 A90 90 0 0 1 10 100" stroke="#ec6e2a" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M54 36 L54 100 L100 100 L100 56" stroke="#ec6e2a" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M146 164 L146 100 L100 100 L100 144" stroke="#ec6e2a" strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="36" y1="100" x2="164" y2="100" stroke="#ec6e2a" strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="36" x2="100" y2="164" stroke="#ec6e2a" strokeWidth="13" strokeLinecap="round"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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
    localStorage.setItem('criffer_user', nome)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        .login-input { outline: none; transition: border-color 0.2s; font-family: inherit; }
        .login-input:focus { border-color: #ec6e2a !important; box-shadow: 0 0 0 3px rgba(236,110,42,0.12) !important; }
        .login-btn-main { transition: background 0.2s, transform 0.1s; }
        .login-btn-main:hover { background: #c85a20 !important; }
        .login-btn-main:active { transform: scale(0.98); }
      `}</style>

      {/* Logo de fundo — marca d'água */}
      {mounted && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          opacity: 0.04, pointerEvents: 'none',
        }}>
          <CrifferLogo size={480} />
        </div>
      )}

      {/* Card de login */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '48px 44px',
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 2,
        animation: 'fadeIn 0.5s ease-out both',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        {/* Logo + Nome */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {mounted && <CrifferLogo size={72} />}
          <div style={{ marginTop: 14, fontSize: 26, fontWeight: 800, color: '#000', letterSpacing: 3, fontFamily: 'Syne, sans-serif' }}>
            CRIFFERLAB
          </div>
          <div style={{ fontSize: 12, color: '#999', letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }}>
            ERP Financeiro
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {/* Campo nome — SEM autocomplete e SEM sugestões */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Seu nome
            </label>
            <input
              className="login-input"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              data-form-type="other"
              style={{
                width: '100%', padding: '12px 16px',
                border: '1.5px solid #E0E0E0', borderRadius: 10,
                fontSize: 14, color: '#000', background: '#FAFAFA',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Campo senha — SEM autocomplete */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              Senha
            </label>
            <input
              className="login-input"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="new-password"
              data-form-type="other"
              style={{
                width: '100%', padding: '12px 16px',
                border: '1.5px solid #E0E0E0', borderRadius: 10,
                fontSize: 14, color: '#000', background: '#FAFAFA',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-btn-main"
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#FFB899' : '#ec6e2a',
              border: 'none', borderRadius: 10,
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'default' : 'pointer',
              fontFamily: 'Syne, sans-serif', letterSpacing: 1,
            }}
          >
            {loading ? 'Entrando...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  )
}
