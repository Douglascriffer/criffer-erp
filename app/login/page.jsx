'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const USUARIOS = [
  { nome: 'Douglas Bitencourt', display: 'Financeiro - ADM', nivel: 'master', setor: 'Diretoria' },
  { nome: 'Juliano Chagas',     display: 'Juliano Chagas',   nivel: 'master', setor: 'Financeiro' },
  { nome: 'Faiblan',            display: 'Faiblan',          nivel: 'master', setor: 'TI' },
  { nome: 'Andressa Barth',     display: 'Andressa Barth',   nivel: 'gestor', setor: 'Produção' },
  { nome: 'Rodrigo Santos',     display: 'Rodrigo Santos',   nivel: 'gestor', setor: 'Compras' },
  { nome: 'Carlos Rocha',       display: 'Carlos Rocha',     nivel: 'gestor', setor: 'Laboratório de Manutenção' },
  { nome: 'Cleiton Staehler',   display: 'Cleiton Staehler', nivel: 'gestor', setor: 'Manutenção' },
  { nome: 'Douglas Schmitz',    display: 'Douglas Schmitz',  nivel: 'gestor', setor: 'Logística' },
  { nome: 'Felipe Oliveira',    display: 'Felipe Oliveira',  nivel: 'gestor', setor: 'Marketing' },
  { nome: 'Felipe Charão',      display: 'Felipe Charão',    nivel: 'gestor', setor: 'TI' },
  { nome: 'Fernando Malta',     display: 'Fernando Malta',   nivel: 'gestor', setor: 'P&D' },
  { nome: 'Felipe Immich',      display: 'Felipe Immich',    nivel: 'gestor', setor: 'Laboratório Calibração' },
  { nome: 'Gabriel Dias',       display: 'Gabriel Dias',     nivel: 'gestor', setor: 'Vendas' },
  { nome: 'Ruslan Santos',      display: 'Ruslan Santos',    nivel: 'gestor', setor: 'Suporte Técnico' },
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
    localStorage.setItem('criffer_user', selectedUser.nome === 'Douglas Bitencourt' ? 'Financeiro' : selectedUser.display || selectedUser.nome)
    localStorage.setItem('criffer_role', selectedUser.nivel)
    localStorage.setItem('criffer_sector', selectedUser.setor)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 800)
  }

  if (!mounted) return null

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden',
      background: '#111',
      fontFamily: 'Syne, system-ui, sans-serif',
    }}>

      <style>{`
        /* ── Animações de entrada ── */
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-160px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dropFromTop {
          from { opacity: 0; transform: translateY(-100px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseFromBottom {
          from { opacity: 0; transform: translateY(80px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDelayed {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Interações ── */
        .cf-input:focus {
          border-color: #FF6A22 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,106,34,0.30) !important;
        }
        .cf-input::placeholder { color: rgba(255,255,255,0.40); }
        .cf-select option { background: #1e1e1e; color: #fff; }

        .cf-btn:hover {
          background: #e05a18 !important;
          transform: translateY(-2px);
          box-shadow: 0 14px 38px rgba(255,106,34,0.65) !important;
        }
        .cf-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* ── FUNDO — mais claro, imagem bem visível ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/bg-login.png"
          alt="Criffer — Gestão de Resultados"
          fill
          className="object-cover"
          priority
          style={{
            /* ▼ brightness alto para fundo claro e nítido */
            filter: 'brightness(0.88) contrast(1.05) saturate(0.95)',
          }}
        />
        {/* Overlay levíssimo apenas nas bordas */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.18) 100%)',
        }} />
      </div>

      {/* ── CARD ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, zIndex: 10,
      }}>
        {/*
          Dark-glass: fundo escuro 30% para a imagem aparecer por trás,
          blur moderado preserva a cena sem borrar demais.
        */}
        <div style={{
          width: '100%',
          maxWidth: 460,
          background: 'rgba(10, 10, 10, 0.42)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderRadius: 26,
          padding: '52px 44px 48px',
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -1px 0 rgba(255,255,255,0.06),
            inset 1px 0 0 rgba(255,255,255,0.08),
            0 32px 80px rgba(0,0,0,0.50)
          `,
          border: '1px solid rgba(255,255,255,0.12)',
          animation: 'slideFromLeft 1s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* ── LOGO — cai do topo em 3s ── */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 22,
            animation: 'dropFromTop 3s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            <div style={{
              width: 114, height: 114,
              background: '#fff',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 4px rgba(255,106,34,0.50), 0 8px 32px rgba(0,0,0,0.45)',
              position: 'relative', overflow: 'hidden',
            }}>
              <Image
                src="/logo-base.png"
                alt="Criffer"
                fill
                style={{ objectFit: 'contain', padding: 8 }}
              />
            </div>
          </div>

          {/* ── C-R-I-F-F-E-R — sobe de baixo em 3s ── */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 12,
            animation: 'riseFromBottom 3s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            {['C','R','I','F','F','E','R'].map((ch, i) => (
              <div key={i} style={{
                width: 42, height: 42,
                background: '#FF6A22',
                color: '#fff',
                fontWeight: 900,
                fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
                boxShadow: '0 4px 18px rgba(255,106,34,0.60)',
                textShadow: '0 1px 3px rgba(0,0,0,0.35)',
              }}>{ch}</div>
            ))}
          </div>

          {/* ── RESTANTE — aparece após 3s ── */}
          <div style={{ animation: 'fadeInDelayed 0.8s ease-out 3s both' }}>

            {/* Subtítulo */}
            <p style={{
              textAlign: 'center',
              fontSize: 15, fontWeight: 600,
              color: 'rgba(255,255,255,0.90)',
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              textShadow: '0 1px 8px rgba(0,0,0,0.6)',
              marginBottom: 32, marginTop: 4,
            }}>
              Gestão de Resultados
            </p>

            <form onSubmit={handleLogin}>

              {/* Acesso Administrativo */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block', fontSize: 10, fontWeight: 800,
                  color: 'rgba(255,255,255,0.80)',
                  textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 7,
                }}>
                  Acesso Administrativo
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedUser?.nome || ''}
                    onChange={e => setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null)}
                    className="cf-input cf-select"
                    style={{
                      width: '100%', padding: '12px 38px 12px 14px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1.5px solid rgba(255,255,255,0.28)',
                      borderRadius: 11, fontSize: 14, color: '#fff',
                      fontFamily: 'inherit', cursor: 'pointer',
                      boxSizing: 'border-box', transition: 'all 0.2s',
                      appearance: 'none',
                    }}
                    required
                  >
                    <option value="" style={{ background: '#1e1e1e', color: '#fff' }}>Selecione seu nome</option>
                    {USUARIOS.map(u => (
                      <option key={u.nome} value={u.nome} style={{ background: '#1e1e1e', color: '#fff' }}>{u.display}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute', right: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: 'rgba(255,255,255,0.60)', fontSize: 11,
                  }}>▼</div>
                </div>
              </div>

              {/* Senha */}
              <div style={{ marginBottom: 22 }}>
                <label style={{
                  display: 'block', fontSize: 10, fontWeight: 800,
                  color: 'rgba(255,255,255,0.80)',
                  textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 7,
                }}>
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
                      width: '100%', padding: '12px 44px 12px 14px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1.5px solid rgba(255,255,255,0.28)',
                      borderRadius: 11, fontSize: 14, color: '#fff',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                      transition: 'all 0.2s',
                    }}
                    required
                  />
                  <div style={{
                    position: 'absolute', right: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.50)', fontSize: 16,
                  }}>🔒</div>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div style={{
                  background: 'rgba(220,38,38,0.25)', color: '#FCA5A5',
                  fontSize: 12, padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(220,38,38,0.45)',
                  marginBottom: 16, textAlign: 'center', fontWeight: 700,
                }}>
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
                  background: loading ? 'rgba(255,184,153,0.35)' : '#FF6A22',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontWeight: 900, fontSize: 14, letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 8px 28px rgba(255,106,34,0.55)',
                  transition: 'all 0.25s',
                }}
              >
                {loading ? 'Autenticando...' : 'Acessar Resultados'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  )
}
