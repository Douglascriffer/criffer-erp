'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Monitor, Calendar } from 'lucide-react'

const USUARIOS = [
  { nome: 'Andressa Barth',     display: 'Andressa Barth',   nivel: 'gestor', setor: 'Produção' },
  { nome: 'Carlos Rocha',       display: 'Carlos Rocha',     nivel: 'gestor', setor: 'Laboratório de Manutenção' },
  { nome: 'Cleiton Staehler',   display: 'Cleiton Staehler', nivel: 'gestor', setor: 'Manutenção' },
  { nome: 'Douglas Schmitz',    display: 'Douglas Schmitz',  nivel: 'gestor', setor: 'Logística' },
  { nome: 'Faiblan',            display: 'Faiblan',          nivel: 'master', setor: 'TI' },
  { nome: 'Felipe Charão',      display: 'Felipe Charão',    nivel: 'gestor', setor: 'TI' },
  { nome: 'Felipe Immich',      display: 'Felipe Immich',    nivel: 'gestor', setor: 'Laboratório Calibração' },
  { nome: 'Felipe Oliveira',    display: 'Felipe Oliveira',  nivel: 'gestor', setor: 'Marketing' },
  { nome: 'Fernando Malta',     display: 'Fernando Malta',   nivel: 'gestor', setor: 'P&D' },
  { nome: 'Douglas Bitencourt', display: 'Financeiro - ADM', nivel: 'master', setor: 'Diretoria' },
  { nome: 'Gabriel Dias',       display: 'Gabriel Dias',     nivel: 'gestor', setor: 'Vendas' },
  { nome: 'Juliano Chagas',     display: 'Juliano Chagas',   nivel: 'master', setor: 'Financeiro' },
  { nome: 'Natasha Osório da Silva', display: 'Natasha Osório', nivel: 'gestor', setor: 'RH' },
  { nome: 'Rodrigo Santos',     display: 'Rodrigo Santos',   nivel: 'gestor', setor: 'Compras' },
  { nome: 'Ruslan Santos',      display: 'Ruslan Santos',    nivel: 'gestor', setor: 'Suporte Técnico' },
]
const SENHA = 'Criffer2026'

const MESES = [
  { val: 'all', label: 'Acumulado Anual' },
  { val: '1', label: 'Janeiro' },
  { val: '2', label: 'Fevereiro' },
  { val: '3', label: 'Março' },
  { val: '4', label: 'Abril' },
  { val: '5', label: 'Maio' },
  { val: '6', label: 'Junho' },
  { val: '7', label: 'Julho' },
  { val: '8', label: 'Agosto' },
  { val: '9', label: 'Setembro' },
  { val: '10', label: 'Outubro' },
  { val: '11', label: 'Novembro' },
  { val: '12', label: 'Dezembro' },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(null)
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Estado para o mês da transmissão
  const [selectedMonthTV, setSelectedMonthTV] = useState('all')

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
      fontFamily: "'Gotham', system-ui, sans-serif",
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
        .cf-btn-secondary:hover { background: rgba(255,106,34,0.1) !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(255,106,34,0.2) !important; }
      `}</style>

      {/* ── FUNDO ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Image
          src="/bg-login.png"
          alt="Criffer — Gestão de Resultados"
          fill
          className="object-cover"
          priority
          style={{ filter: 'brightness(0.92) contrast(1.04) saturate(0.95)' }}
        />
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, zIndex: 10,
      }}>

        <div style={{
          width: '100%',
          maxWidth: 420,
          background: 'transparent',
          animation: 'slideFromLeft 2s cubic-bezier(0.22,1,0.36,1) both',
        }}>

          {/* ── LOGO ── */}
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

          {/* ── C-R-I-F-F-E-R ── */}
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

          <div style={{ animation: 'fadeInDelayed 0.8s ease-out 3s both' }}>
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
              <div style={{ marginBottom: 14 }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedUser?.nome || ''}
                    onChange={e => setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null)}
                    className="cf-input"
                    style={{
                      width: '100%', padding: '14px 40px 14px 18px',
                      background: '#ffffff',
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
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666', fontSize: 12 }}>▼</div>
                </div>
              </div>

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
                      background: '#ffffff',
                      border: '1.5px solid rgba(255,255,255,0.95)',
                      borderRadius: 14, fontSize: 14, color: '#222',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
                    }}
                    required
                  />
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 16 }}>🔒</div>
                </div>
              </div>

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

              <div style={{ margin: '24px 0', borderTop: '1px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                <span style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#333', padding: '0 10px', fontSize: 10, color: '#fff', fontWeight: 900 }}>TV BROADCAST</span>
              </div>

              {/* SELETOR DE MÊS PARA TRANSMISSÃO */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedMonthTV}
                    onChange={e => setSelectedMonthTV(e.target.value)}
                    className="cf-input"
                    style={{
                      width: '100%', padding: '12px 40px 12px 18px',
                      background: '#ffffff',
                      border: '2px solid #FF6A22',
                      borderRadius: 14, fontSize: 13, color: '#222',
                      fontFamily: 'inherit', cursor: 'pointer',
                      boxSizing: 'border-box',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.12)',
                    }}
                  >
                    {MESES.map(m => (
                      <option key={m.val} value={m.val}>{m.label}</option>
                    ))}
                  </select>
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#FF6A22', fontSize: 12 }}>▼</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push(`/transmissao?mes=${selectedMonthTV}`)}
                className="cf-btn-secondary"
                style={{
                  width: '100%', padding: '12px',
                  background: '#ffffff',
                  color: '#FF6A22',
                  border: '2px solid #FF6A22',
                  borderRadius: 14,
                  fontWeight: 900, fontSize: 12, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                }}
              >
                <Monitor size={16} />
                Modo Transmissão
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
