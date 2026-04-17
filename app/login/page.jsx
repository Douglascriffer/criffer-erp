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
    <div className="relative min-h-screen w-full overflow-hidden bg-black" style={{ fontFamily: 'Syne, sans-serif' }}>

      {/* ─── BACKGROUND FULL SCREEN ─── */}
      <div className="absolute inset-0">
        <Image src="/bg-login.png" alt="Criffer - Gestão de Resultados" fill className="object-cover" priority style={{ filter: 'brightness(0.88) contrast(1.05)' }} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)' }}></div>
      </div>

      {/* ─── VIGNETTE ─── */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 100%)' }}></div>

      {/* ─── LOGIN CARD ─── */}
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ zIndex: 20 }}>
        <div className="w-full text-center" style={{
          maxWidth: 480,
          width: '90%',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(40px)',
          borderRadius: 28,
          padding: '44px 48px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.5)',
          animation: 'fadeUp 0.7s ease-out forwards',
        }}>
          <style>{`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(24px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Logo Circular */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: '#fff', margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,106,34,0.15)',
            overflow: 'hidden', position: 'relative',
          }}>
            <Image src="/logo-base.png" alt="Logo Criffer" fill className="object-contain" style={{ padding: 10 }} />
          </div>

          {/* CRIFFER boxes */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
            {['C','R','I','F','F','E','R'].map((ch, i) => (
              <div key={i} style={{
                width: 34, height: 34, background: '#FF6A22', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 18, borderRadius: 6,
              }}>{ch}</div>
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 900, color: '#FF6A22', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: 36 }}>
            Gestão de Resultados
          </div>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>

            {/* Usuario */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                Acesso Administrativo
              </label>
              <select
                value={selectedUser?.nome || ''}
                onChange={e => setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null)}
                style={{ width: '100%', padding: '14px 16px', background: '#F9FAFB', border: '1.5px solid #F3F4F6', borderRadius: 14, fontSize: 14, color: '#111', fontFamily: 'inherit', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                required
              >
                <option value="">Selecione seu nome</option>
                {USUARIOS.map(u => (
                  <option key={u.nome} value={u.nome}>
                    {u.display}
                  </option>
                ))}
              </select>
            </div>

            {/* Senha */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                Chave de Segurança
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '14px 16px', background: '#F9FAFB', border: '1.5px solid #F3F4F6', borderRadius: 14, fontSize: 14, color: '#111', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 13, padding: '10px 16px', borderRadius: 10, border: '1px solid #FECACA', marginBottom: 16, textAlign: 'center', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px', background: loading ? '#ffb899' : '#FF6A22',
                color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900,
                fontSize: 14, letterSpacing: '0.1em', cursor: loading ? 'default' : 'pointer',
                fontFamily: 'inherit', boxShadow: '0 12px 30px rgba(255,106,34,0.3)',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'AUTENTICANDO...' : 'ACESSAR RESULTADOS'}
            </button>
          </form>

          <p style={{ marginTop: 28, fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} Criffer Instrumentos de Medição.
          </p>
        </div>
      </div>
    </div>
  )
}
