'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

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
  const [usuarios, setUsuarios] = useState([])
  const [selectedUserId, setSelectedUserId] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Recovery
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryLoading, setRecoveryLoading] = useState(false)

  useEffect(() => { 
    setMounted(true)
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      const { data, error } = await supabase.from('app_usuarios').select('*').order('display')
      if (error) throw error
      if (data) setUsuarios(data)
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
      setError('Falha ao conectar no banco de usuários.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!selectedUserId) { setError('Selecione um usuário.'); return }
    
    const user = usuarios.find(u => u.id === selectedUserId)
    if (!user) { setError('Usuário não encontrado.'); return }
    if (senha !== user.senha) { setError('Senha incorreta.'); return }
    
    setLoading(true)
    localStorage.setItem('criffer_user', user.nome === 'Douglas Bitencourt' ? 'Financeiro' : user.display || user.nome)
    localStorage.setItem('criffer_role', user.nivel)
    localStorage.setItem('criffer_sector', user.setor)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 800)
  }

  const handleRecovery = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    
    if (!selectedUserId) { setError('Selecione seu usuário acima primeiro.'); return }
    if (!recoveryEmail) { setError('Digite seu e-mail.'); return }

    const user = usuarios.find(u => u.id === selectedUserId)
    if (user.email?.toLowerCase() !== recoveryEmail.trim().toLowerCase()) {
      setError('E-mail incorreto para este usuário.')
      return
    }

    setRecoveryLoading(true)
    try {
      const nomes = user.nome.split(' ')
      const sobrenome = nomes.length > 1 ? nomes[nomes.length - 1] : nomes[0]
      const newCount = (user.recovery_count || 0) + 1
      const novaSenha = `${sobrenome}${newCount}`

      const { error: updError } = await supabase
        .from('app_usuarios')
        .update({ senha: novaSenha, recovery_count: newCount })
        .eq('id', user.id)

      if (updError) throw updError

      setUsuarios(prev => prev.map(u => u.id === user.id ? { ...u, senha: novaSenha, recovery_count: newCount } : u))
      
      setSuccessMsg(`Senha recuperada! Sua nova senha é: ${novaSenha}`)
      setShowRecovery(false)
      setRecoveryEmail('')
    } catch (err) {
      console.error(err)
      setError('Erro ao gerar nova senha.')
    } finally {
      setRecoveryLoading(false)
    }
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
                    value={selectedUserId}
                    onChange={e => { setSelectedUserId(e.target.value); setError(''); setSuccessMsg(''); }}
                    className="cf-input"
                    style={{ width: '100%', padding: '14px 40px 14px 18px', background: '#ffffff', border: '1.5px solid rgba(255,255,255,0.95)', borderRadius: 14, fontSize: 14, color: '#222', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none', boxShadow: '0 4px 18px rgba(0,0,0,0.12)' }}
                    required
                  >
                    <option value="">Acesso Administrativo</option>
                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.display}</option>)}
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
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
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
                    disabled={loading || usuarios.length === 0}
                    className="cf-btn"
                    style={{ width: '100%', padding: '15px', background: loading ? '#ffb899' : '#FF6A22', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 14, letterSpacing: '0.10em', textTransform: 'uppercase', cursor: (loading || usuarios.length === 0) ? 'default' : 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 28px rgba(255,106,34,0.50)', transition: 'all 0.25s' }}
                  >
                    {loading ? 'Carregando...' : 'Acessar Resultados'}
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
                        placeholder="Seu E-mail"
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
                    {recoveryLoading ? 'Processando...' : 'Gerar Nova Senha'}
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
