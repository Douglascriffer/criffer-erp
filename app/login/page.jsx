'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const USUARIOS = [
  { nome: 'Douglas Bitencourt', display: 'Financeiro - ADM', nivel: 'master', setor: 'Diretoria' },
  { nome: 'Juliano Chagas', display: 'Juliano Chagas', nivel: 'master', setor: 'Financeiro' },
  { nome: 'Faiblan', display: 'Faiblan', nivel: 'master', setor: 'TI' },
  { nome: 'Andressa Barth', display: 'Andressa Barth', nivel: 'gestor', setor: 'Produção' },
  { nome: 'Rodrigo Santos', display: 'Rodrigo Santos', nivel: 'gestor', setor: 'Compras' },
  { nome: 'Carlos Rocha', display: 'Carlos Rocha', nivel: 'gestor', setor: 'Laboratório de Manutenção' },
  { nome: 'Cleiton Staehler', display: 'Cleiton Staehler', nivel: 'gestor', setor: 'Manutenção' },
  { nome: 'Douglas Schmitz', display: 'Douglas Schmitz', nivel: 'gestor', setor: 'Logística' },
  { nome: 'Felipe Oliveira', display: 'Felipe Oliveira', nivel: 'gestor', setor: 'Marketing' },
  { nome: 'Felipe Charão', display: 'Felipe Charão', nivel: 'gestor', setor: 'TI' },
  { nome: 'Fernando Malta', display: 'Fernando Malta', nivel: 'gestor', setor: 'P&D' },
  { nome: 'Felipe Immich', display: 'Felipe Immich', nivel: 'gestor', setor: 'Laboratório Calibração' },
  { nome: 'Gabriel Dias', display: 'Gabriel Dias', nivel: 'gestor', setor: 'Vendas' },
  { nome: 'Ruslan Santos', display: 'Ruslan Santos', nivel: 'gestor', setor: 'Suporte Técnico' },
]
const SENHA = 'Criffer2026'

export default function LoginPage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(null)
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!selectedUser) { setError('Selecione um usuário.'); return }
    if (senha !== SENHA) { setError('Senha incorreta.'); return }
    setLoading(true)
    localStorage.setItem('criffer_user', selectedUser.nome)
    localStorage.setItem('criffer_role', selectedUser.nivel)
    localStorage.setItem('criffer_sector', selectedUser.setor)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 800)
  }

  if (!mounted) return null

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', background: '#0a0a0a', fontFamily: 'Syne, system-ui, sans-serif' }}>

      {/* ── FUNDO FULL SCREEN ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/bg-login.png"
          alt="Criffer - Gestão de Resultados"
          fill
          className="object-cover"
          priority
          style={{ filter: 'brightness(0.72) contrast(1.08) saturate(0.9)' }}
        />
        {/* Vinheta central suave */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)' }} />
      </div>

      {/* ── CARD DE LOGIN ── */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 10 }}>
        <div style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          borderRadius: 24,
          padding: '48px 44px 44px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3)',
          animation: 'fadeUp 0.6s ease-out both',
        }}>
          <style>{`
            @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
            .cf-input:focus { border-color: #FF6A22 !important; outline: none; }
            .cf-btn:hover { background: #e05a18 !important; transform: translateY(-1px); }
            .cf-btn:active { transform: scale(0.98) !important; }
          `}</style>

          {/* Logo circular */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{
              width: 80, height: 80,
              background: '#fff',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255,106,34,0.2)',
              border: '2px solid rgba(255,106,34,0.15)',
              position: 'relative', overflow: 'hidden',
            }}>
              <Image src="/logo-base.png" alt="Criffer" fill style={{ objectFit: 'contain', padding: 8 }} />
            </div>
          </div>

          {/* Caixas CRIFFER */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 10 }}>
            {['C','R','I','F','F','E','R'].map((ch, i) => (
              <div key={i} style={{
                width: 40, height: 40,
                background: '#FF6A22',
                color: '#fff',
                fontWeight: 900,
                fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 6,
              }}>{ch}</div>
            ))}
          </div>

          {/* Subtítulo */}
          <p style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#FF6A22', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 28, marginTop: 0 }}>
            Gestão de Resultados
          </p>

          <form onSubmit={handleLogin}>

            {/* Acesso */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                Acesso Administrativo
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedUser?.nome || ''}
                  onChange={e => setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null)}
                  className="cf-input"
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: '#F8F8F8', border: '1.5px solid #EBEBEB',
                    borderRadius: 12, fontSize: 14, color: '#111',
                    fontFamily: 'inherit', cursor: 'pointer',
                    boxSizing: 'border-box', transition: 'border-color 0.2s',
                    appearance: 'none',
                  }}
                  required
                >
                  <option value="">Selecione seu nome</option>
                  {USUARIOS.map(u => (
                    <option key={u.nome} value={u.nome}>{u.display}</option>
                  ))}
                </select>
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#999', fontSize: 12 }}>▼</div>
              </div>
            </div>

            {/* Senha */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••••••"
                  className="cf-input"
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: '#F8F8F8', border: '1.5px solid #EBEBEB',
                    borderRadius: 12, fontSize: 14, color: '#111',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  required
                />
                <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#BBB', fontSize: 16 }}>🔒</div>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid #FECACA', marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="cf-btn"
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#ffb899' : '#FF6A22',
                color: '#fff', border: 'none', borderRadius: 12,
                fontWeight: 900, fontSize: 14, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(255,106,34,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Autenticando...' : 'Acessar Resultados'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
