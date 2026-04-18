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
      background: '#0a0a0a',
      fontFamily: 'Syne, system-ui, sans-serif',
    }}>

      {/* ── KEYFRAMES E ESTILOS ── */}
      <style>{`
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
        @keyframes logoGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,106,34,0.5), 0 0 60px rgba(255,106,34,0.2); }
          50%       { box-shadow: 0 0 32px rgba(255,106,34,0.8), 0 0 90px rgba(255,106,34,0.35); }
        }
        @keyframes crifferGlow {
          0%, 100% { box-shadow: 0 4px 15px rgba(255,106,34,0.5); }
          50%       { box-shadow: 0 4px 28px rgba(255,106,34,0.9); }
        }

        /* Campos — foco laranja brilhante */
        .cf-input:focus {
          border-color: #FF6A22 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,106,34,0.35), 0 0 16px rgba(255,106,34,0.2) !important;
          background: rgba(255,255,255,0.18) !important;
        }
        /* Placeholder visível */
        .cf-input::placeholder { color: rgba(255,255,255,0.45); }

        /* Botão hover */
        .cf-btn:hover  {
          background: linear-gradient(135deg,#ff8c42,#e05a18) !important;
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(255,106,34,0.7) !important;
        }
        .cf-btn:active { transform: scale(0.97) !important; }

        /* Select — opções legíveis no dropdown nativo */
        .cf-select option { background: #1a1a1a; color: #fff; }
      `}</style>

      {/* ── 1. FUNDO FIXO ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/bg-login.png"
          alt="Criffer — Gestão de Resultados"
          fill
          className="object-cover"
          priority
          style={{ filter: 'brightness(0.72) contrast(1.08) saturate(0.9)' }}
        />
        {/* Vinheta lateral suave para direcionar o olhar ao card */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 80% at 38% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)',
        }} />
      </div>

      {/* ── CENTRALIZAÇÃO ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, zIndex: 10,
      }}>

        {/* ── 2. CARD — vidro ultrafino, quase invisível ── */}
        <div style={{
          width: '100%',
          maxWidth: 460,
          /* ▼ TRANSPARÊNCIA MÁXIMA — só 5% de branco */
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(64px)',
          WebkitBackdropFilter: 'blur(64px)',
          borderRadius: 28,
          padding: '52px 44px 48px',
          /* borda superior iluminada + sombra profunda */
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.30),
            inset 0 0 0 1px rgba(255,255,255,0.10),
            0 40px 100px rgba(0,0,0,0.55),
            0 0 80px rgba(255,106,34,0.08)
          `,
          animation: 'slideFromLeft 1s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* ── 3. LOGO — cai do topo, glow pulsante ── */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 22,
            animation: 'dropFromTop 3s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            <div style={{
              width: 114, height: 114,
              background: '#fff',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid rgba(255,106,34,0.6)',
              position: 'relative', overflow: 'hidden',
              animation: 'logoGlow 3s ease-in-out infinite',
            }}>
              <Image
                src="/logo-base.png"
                alt="Criffer"
                fill
                style={{ objectFit: 'contain', padding: 8 }}
              />
            </div>
          </div>

          {/* ── 4. C-R-I-F-F-E-R — sobe de baixo, glow forte ── */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 12,
            animation: 'riseFromBottom 3s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            {['C','R','I','F','F','E','R'].map((ch, i) => (
              <div key={i} style={{
                width: 42, height: 42,
                background: 'linear-gradient(145deg, #FF7A35, #E05500)',
                color: '#fff',
                fontWeight: 900,
                fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 8,
                animation: `crifferGlow 2.5s ease-in-out ${i * 0.1}s infinite`,
                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              }}>{ch}</div>
            ))}
          </div>

          {/* ── 5. RESTANTE — aparece após 3s ── */}
          <div style={{ animation: 'fadeInDelayed 0.8s ease-out 3s both' }}>

            {/* Subtítulo */}
            <p style={{
              textAlign: 'center',
              fontSize: 16, fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(255,106,34,0.8), 0 2px 8px rgba(0,0,0,0.5)',
              marginBottom: 32, marginTop: 4,
            }}>
              Gestão de Resultados
            </p>

            <form onSubmit={handleLogin}>

              {/* Acesso Administrativo */}
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block', fontSize: 10, fontWeight: 800,
                  color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '0.16em',
                  marginBottom: 7,
                  textShadow: '0 0 10px rgba(255,255,255,0.4)',
                }}>
                  Acesso Administrativo
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedUser?.nome || ''}
                    onChange={e => setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null)}
                    className="cf-input cf-select"
                    style={{
                      width: '100%', padding: '13px 40px 13px 16px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      borderRadius: 12, fontSize: 14,
                      color: '#fff',
                      fontFamily: 'inherit', cursor: 'pointer',
                      boxSizing: 'border-box', transition: 'all 0.2s',
                      appearance: 'none',
                    }}
                    required
                  >
                    <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>Selecione seu nome</option>
                    {USUARIOS.map(u => (
                      <option key={u.nome} value={u.nome} style={{ background: '#1a1a1a', color: '#fff' }}>{u.display}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 11,
                  }}>▼</div>
                </div>
              </div>

              {/* Senha */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block', fontSize: 10, fontWeight: 800,
                  color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '0.16em',
                  marginBottom: 7,
                  textShadow: '0 0 10px rgba(255,255,255,0.4)',
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
                      width: '100%', padding: '13px 44px 13px 16px',
                      background: 'rgba(255,255,255,0.10)',
                      border: '1.5px solid rgba(255,255,255,0.35)',
                      borderRadius: 12, fontSize: 14,
                      color: '#fff',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                      transition: 'all 0.2s',
                    }}
                    required
                  />
                  <div style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.55)', fontSize: 16,
                  }}>🔒</div>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div style={{
                  background: 'rgba(220,38,38,0.2)',
                  color: '#FCA5A5', fontSize: 12,
                  padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(220,38,38,0.5)',
                  marginBottom: 16, textAlign: 'center', fontWeight: 700,
                  backdropFilter: 'blur(8px)',
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
                  width: '100%', padding: '15px',
                  background: loading
                    ? 'rgba(255,184,153,0.4)'
                    : 'linear-gradient(135deg, #FF7A35, #E05500)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontWeight: 900, fontSize: 14, letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: loading ? 'none' : '0 8px 30px rgba(255,106,34,0.55)',
                  transition: 'all 0.25s',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
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
