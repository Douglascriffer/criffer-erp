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
      background: '#e8e8e8',
      fontFamily: 'Syne, system-ui, sans-serif',
    }}>

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
        .cf-input:focus {
          border-color: #FF6A22 !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,106,34,0.20) !important;
        }
        .cf-btn:hover  { background: #e05a18 !important; transform: translateY(-1px); box-shadow: 0 12px 32px rgba(255,106,34,0.5) !important; }
        .cf-btn:active { transform: scale(0.97) !important; }
      `}</style>

      {/* ── FUNDO — bem claro, sala nítida ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/bg-login.png"
          alt="Criffer — Gestão de Resultados"
          fill
          className="object-cover"
          priority
          style={{
            /* Sala clara e visível */
            filter: 'brightness(0.92) contrast(1.04) saturate(0.95)',
          }}
        />
        {/* Sem vinheta — fundo totalmente visível */}
      </div>

      {/* ── CONTAINER — transparente, só posiciona os elementos ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, zIndex: 10,
      }}>

        {/*
          CARD CONTAINER — TOTALMENTE TRANSPARENTE
          Apenas agrupa os elementos. Sem background, sem borda, sem blur.
          Só os campos e botão têm fundo próprio.
        */}
        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'transparent',
          animation: 'slideFromLeft 2s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* ── LOGO — cai do topo em 3s ── */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 20,
            animation: 'dropFromTop 3s cubic-bezier(0.22,1,0.36,1) both',
          }}>
            <div style={{
              width: 110, height: 110,
              background: '#fff',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 28px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,106,34,0.35)',
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
            display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 10,
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
                borderRadius: 7,
                boxShadow: '0 4px 16px rgba(255,106,34,0.45)',
              }}>{ch}</div>
            ))}
          </div>

          {/* ── RESTANTE — aparece após 3s ── */}
          <div style={{ animation: 'fadeInDelayed 0.8s ease-out 3s both' }}>

            {/* Subtítulo — texto sobre o fundo claro */}
            <p style={{
              textAlign: 'center',
              fontSize: 22, fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.45)',
              marginBottom: 28, marginTop: 6,
            }}>
              Gestão de Resultados
            </p>

            <form onSubmit={handleLogin}>

              {/* Campo — Acesso Administrativo */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedUser?.nome || ''}
                    onChange={e => setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null)}
                    className="cf-input"
                    style={{
                      width: '100%', padding: '14px 40px 14px 18px',
                      /* ▼ campo com fundo branco bem visível */
                      background: 'rgba(255,255,255,0.88)',
                      border: '1.5px solid rgba(255,255,255,0.95)',
                      borderRadius: 14, fontSize: 14, color: '#222',
                      fontFamily: 'inherit', cursor: 'pointer',
                      boxSizing: 'border-box', transition: 'all 0.2s',
                      appearance: 'none',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
                    }}
                    required
                  >
                    <option value="">Acesso Administrativo</option>
                    {USUARIOS.map(u => (
                      <option key={u.nome} value={u.nome}>{u.display}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: '#666', fontSize: 12,
                  }}>▼</div>
                </div>
              </div>

              {/* Campo — Senha */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    placeholder="Senha"
                    className="cf-input"
                    style={{
                      width: '100%', padding: '14px 44px 14px 18px',
                      background: 'rgba(255,255,255,0.88)',
                      border: '1.5px solid rgba(255,255,255,0.95)',
                      borderRadius: 14, fontSize: 14, color: '#222',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
                    }}
                    required
                  />
                  <div style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888', fontSize: 16,
                  }}>🔒</div>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div style={{
                  background: 'rgba(255,255,255,0.85)', color: '#DC2626',
                  fontSize: 12, padding: '10px 14px', borderRadius: 10,
                  border: '1px solid rgba(220,38,38,0.35)',
                  marginBottom: 14, textAlign: 'center', fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
                }}>
                  {error}
                </div>
              )}

              {/* Botão — sólido laranja, único elemento opaco */}
              <button
                type="submit"
                disabled={loading}
                className="cf-btn"
                style={{
                  width: '100%', padding: '15px',
                  background: loading ? '#ffb899' : '#FF6A22',
                  color: '#fff', border: 'none', borderRadius: 14,
                  fontWeight: 900, fontSize: 14, letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 8px 28px rgba(255,106,34,0.50)',
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
