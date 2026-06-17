'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const USUARIOS = [
  { nome: 'Andressa Barth', display: 'Andressa Barth', nivel: 'gestor', setor: 'Produção', email: 'andressa.pereira@criffer.com.br' },
  { nome: 'Carlos Rocha', display: 'Carlos Rocha', nivel: 'gestor', setor: 'Laboratório de Manutenção', email: 'carlos.rocha@criffer.com.br' },
  { nome: 'Cleiton Staehler', display: 'Cleiton Staehler', nivel: 'gestor', setor: 'Manutenção', email: 'djketu@hotmail.com' },
  { nome: 'Douglas Schmitz', display: 'Douglas Schmitz', nivel: 'gestor', setor: 'Logística', email: 'douglas.schmitz@criffer.com.br' },
  { nome: 'Faiblan', display: 'Faiblan', nivel: 'master', setor: 'TI', email: 'juliano.chagas@criffer.com.br' },
  { nome: 'Felipe Charão', display: 'Felipe Charão', nivel: 'gestor', setor: 'TI', email: 'felipe.charao@criffer.com.br' },
  { nome: 'Felipe Immich', display: 'Felipe Immich', nivel: 'gestor', setor: 'Laboratório Calibração', email: 'felipe.immich@crifferlab.com.br' },
  { nome: 'Felipe Oliveira', display: 'Felipe Oliveira', nivel: 'gestor', setor: 'Marketing', email: 'felipe.andrade@criffer.com.br' },
  { nome: 'Fernando Malta', display: 'Fernando Malta', nivel: 'gestor', setor: 'P&D', email: 'fernando.malta@criffer.com.br' },
  { nome: 'Douglas Bitencourt', display: 'Financeiro - ADM', nivel: 'master', setor: 'Diretoria', email: 'douglas.bitencourt@criffer.com.br' },
  { nome: 'Gabriel Dias', display: 'Gabriel Dias', nivel: 'gestor', setor: 'Vendas', email: 'gabriel.dias@criffer.com.br' },
  { nome: 'Juliano Chagas', display: 'Juliano Chagas', nivel: 'master', setor: 'Financeiro', email: 'juliano.chagas@criffer.com.br' },
  { nome: 'Natasha Osório da Silva', display: 'Natasha Osório', nivel: 'gestor', setor: 'RH', email: 'natasha.osorio@criffer.com.br' },
  { nome: 'Rodrigo Santos', display: 'Rodrigo Santos', nivel: 'gestor', setor: 'Compras', email: 'rodrigo.santos@criffer.com.br' },
]

function gerarSenha(nome) {
  if (!nome) return 'Criffer2026'
  const partes = nome.split(' ')
  let sobrenome = partes.length > 1 ? partes[1] : partes[0]
  sobrenome = sobrenome.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  sobrenome = sobrenome.charAt(0).toUpperCase() + sobrenome.slice(1).toLowerCase()
  return `${sobrenome}2026`
}


const MESES = [
  { val: 'all', label: 'MODO TRANSMISSÃO — ACUMULADO' },
  { val: '1', label: 'MODO TRANSMISSÃO — JANEIRO' },
  { val: '2', label: 'MODO TRANSMISSÃO — FEVEREIRO' },
  { val: '3', label: 'MODO TRANSMISSÃO — MARÇO' },
  { val: '4', label: 'MODO TRANSMISSÃO — ABRIL' },
  { val: '5', label: 'MODO TRANSMISSÃO — MAIO' },
  { val: '6', label: 'MODO TRANSMISSÃO — JUNHO' },
  { val: '7', label: 'MODO TRANSMISSÃO — JULHO' },
  { val: '8', label: 'MODO TRANSMISSÃO — AGOSTO' },
  { val: '9', label: 'MODO TRANSMISSÃO — SETEMBRO' },
  { val: '10', label: 'MODO TRANSMISSÃO — OUTUBRO' },
  { val: '11', label: 'MODO TRANSMISSÃO — NOVEMBRO' },
  { val: '12', label: 'MODO TRANSMISSÃO — DEZEMBRO' },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(null)
  const [senhaInput, setSenhaInput] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Recovery
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!selectedUser) { setError('Selecione um usuário.'); return }
    
    const senhaCorreta = gerarSenha(selectedUser.nome)
    if (senhaInput !== senhaCorreta) { setError('Senha incorreta.'); return }
    
    setLoading(true)
    localStorage.setItem('criffer_user', selectedUser.nome === 'Douglas Bitencourt' ? 'Financeiro' : selectedUser.display || selectedUser.nome)
    localStorage.setItem('criffer_role', selectedUser.nivel)
    localStorage.setItem('criffer_sector', selectedUser.setor)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 800)
  }

  const handleRecovery = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    
    if (!selectedUser) { setError('Selecione seu usuário acima primeiro.'); return }
    if (!recoveryEmail) { setError('Digite seu e-mail.'); return }

    if (selectedUser.email?.toLowerCase() !== recoveryEmail.trim().toLowerCase()) {
      setError('E-mail incorreto para este usuário.')
      return
    }

    setRecoveryLoading(true)
    setTimeout(() => {
      const senhaCorreta = gerarSenha(selectedUser.nome)
      setSuccessMsg(`Sua senha de acesso é: ${senhaCorreta}`)
      setRecoveryLoading(false)
      setShowRecovery(false)
      setRecoveryEmail('')
    }, 1000)
  }

  if (!mounted) return null

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', width: '100%',
      overflow: 'hidden', background: '#e8e8e8',
      fontFamily: "'Gotham', system-ui, sans-serif",
    }}>

      <style>{`
        @keyframes slideFromLeft { from { opacity: 0; transform: translateX(-160px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes dropFromTop { from { opacity: 0; transform: translateY(-100px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes riseFromBottom { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDelayed { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .cf-input:focus { border-color: #FF6A22 !important; outline: none; box-shadow: 0 0 0 3px rgba(255,106,34,0.20) !important; }
        .cf-btn:hover { background: #e05a18 !important; transform: translateY(-1px); box-shadow: 0 12px 32px rgba(255,106,34,0.5) !important; }
        .cf-btn:active { transform: scale(0.97) !important; }
        .cf-link { color: rgba(255,255,255,0.7); font-size: 13px; text-decoration: none; cursor: pointer; transition: all 0.2s; }
        .cf-link:hover { color: #fff; text-decoration: underline; }
      `}</style>

      <div style={{ position: 'absolute', inset: 0 }}>
        <Image src="/bg-login.png" alt="Criffer" fill className="object-cover" priority style={{ filter: 'brightness(0.92) contrast(1.04) saturate(0.95)' }} />
      </div>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'transparent', animation: 'slideFromLeft 2s cubic-bezier(0.22,1,0.36,1) both' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, animation: 'dropFromTop 3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div style={{ width: 110, height: 110, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 28px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,106,34,0.35)', position: 'relative', overflow: 'hidden' }}>
              <Image src="/logo-base.png" alt="Criffer" fill style={{ objectFit: 'contain', padding: 8 }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 10, animation: 'riseFromBottom 3s cubic-bezier(0.22,1,0.36,1) both' }}>
            {['C','R','I','F','F','E','R'].map((ch, i) => (
              <div key={i} style={{ width: 42, height: 42, background: '#FF6A22', color: '#fff', fontWeight: 900, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7, boxShadow: '0 4px 16px rgba(255,106,34,0.45)' }}>{ch}</div>
            ))}
          </div>

          <div style={{ animation: 'fadeInDelayed 0.8s ease-out 3s both' }}>
            <p style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.14em', textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.45)', marginBottom: 28, marginTop: 6 }}>
              Gestão de Resultados
            </p>

            {error && <div style={{ background: '#ff3b30', color: '#fff', padding: '10px', borderRadius: 8, marginBottom: 15, fontSize: 13, textAlign: 'center' }}>{error}</div>}
            {successMsg && <div style={{ background: '#34c759', color: '#fff', padding: '10px', borderRadius: 8, marginBottom: 15, fontSize: 14, textAlign: 'center', fontWeight: 'bold' }}>{successMsg}</div>}

            <form onSubmit={showRecovery ? handleRecovery : handleLogin}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ position: 'relative' }}>
                  <select
                    value={selectedUser?.nome || ''}
                    onChange={e => { setSelectedUser(USUARIOS.find(u => u.nome === e.target.value) || null); setError(''); setSuccessMsg(''); }}
                    className="cf-input"
                    style={{ width: '100%', padding: '14px 40px 14px 18px', background: '#ffffff', border: '1.5px solid rgba(255,255,255,0.95)', borderRadius: 14, fontSize: 14, color: '#222', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.12)' }}
                    required
                  >
                    <option value="">Acesso Administrativo</option>
                    {USUARIOS.map(u => <option key={u.nome} value={u.nome}>{u.display}</option>)}
                  </select>
                  <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666', fontSize: 12 }}>▼</div>
                </div>
              </div>

              {!showRecovery ? (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="password"
                        value={senhaInput}
                        onChange={e => setSenhaInput(e.target.value)}
                        placeholder="Senha"
                        className="cf-input"
                        style={{ width: '100%', padding: '14px 44px 14px 18px', background: '#ffffff', border: '1.5px solid rgba(255,255,255,0.95)', borderRadius: 14, fontSize: 14, color: '#222', fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(0,0,0,0.12)' }}
                        required
                      />
                      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 16 }}>🔒</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <a className="cf-link" onClick={() => setShowRecovery(true)}>Esqueci minha senha</a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="cf-btn"
                    style={{ width: '100%', padding: '15px', background: loading ? '#ffb899' : '#FF6A22', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 14, letterSpacing: '0.10em', textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(255,106,34,0.50)', transition: 'all 0.25s' }}
                  >
                    {loading ? 'Autenticando...' : 'Acessar Resultados'}
                  </button>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={recoveryEmail}
                        onChange={e => setRecoveryEmail(e.target.value)}
                        placeholder="Seu E-mail de Cadastro"
                        className="cf-input"
                        style={{ width: '100%', padding: '14px 44px 14px 18px', background: '#ffffff', border: '1.5px solid rgba(255,255,255,0.95)', borderRadius: 14, fontSize: 14, color: '#222', fontFamily: 'inherit', boxShadow: '0 4px 18px rgba(0,0,0,0.12)' }}
                        required
                      />
                      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 16 }}>📧</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginBottom: 20 }}>
                    <a className="cf-link" onClick={() => { setShowRecovery(false); setError(''); setSuccessMsg(''); }}>Voltar ao Login</a>
                  </div>

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="cf-btn"
                    style={{ width: '100%', padding: '15px', background: recoveryLoading ? '#999' : '#333', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 14, letterSpacing: '0.10em', textTransform: 'uppercase', cursor: recoveryLoading ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(0,0,0,0.30)', transition: 'all 0.25s' }}
                  >
                    {recoveryLoading ? 'Processando...' : 'Recuperar Senha'}
                  </button>
                </>
              )}

              <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
              </div>

              {/* BOTÃO ÚNICO COM SETA — MODO TRANSMISSÃO */}
              <div style={{ position: 'relative' }}>
                <select
                  onChange={(e) => {
                    if (e.target.value) router.push(`/transmissao?mes=${e.target.value}`)
                  }}
                  style={{
                    width: '100%', padding: '15px 44px 15px 18px',
                    background: '#ffffff',
                    color: '#FF6A22',
                    border: '2px solid #FF6A22',
                    borderRadius: 14,
                    fontWeight: 900, fontSize: 13, letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    appearance: 'none',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                >
                  <option value="">Selecione o Mês da Transmissão</option>
                  {MESES.map(m => (
                    <option key={m.val} value={m.val}>{m.label}</option>
                  ))}
                </select>
                <div style={{ 
                  position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', 
                  pointerEvents: 'none', color: '#FF6A22', fontSize: 18, fontWeight: 900 
                }}>
                  ▼
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
