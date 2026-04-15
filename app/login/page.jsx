'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const USUARIOS = [
  'Andressa Pereira da Silva Barth','Alcione','Rodrigo dos Santos',
  'Carlos Henrique Trein Rocha','Cleiton Da Silva Staehler',
  'Douglas De Jesus Schmitz','Felipe F de Andrade Oliveira',
  'Felipe Charão Antonio Maria','Fernando Malta de Brito',
  'Felipe Martins Immich','Gabriel Dias','Juliano De Bastos Chagas',
  'Ruslan Fulaneto Dos Santos','Faiblan',
]
const SENHA = 'Criffer2026'

/* ─── SVG Logo Criffer ─── */
function Logo({ size = 80, color = '#ec6e2a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="18"/>
      <path d="M100 12 A88 88 0 0 1 188 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M100 188 A88 88 0 0 1 12 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M54 38 L54 100 L100 100 L100 58" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M146 162 L146 100 L100 100 L100 142" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="38" y1="100" x2="162" y2="100" stroke={color} strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="38" x2="100" y2="162" stroke={color} strokeWidth="13" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Partículas de fundo ─── */
function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
    }))
    let raf
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(236,110,42,${p.a})`
        ctx.fill()
      })
      // Lines between close particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(236,110,42,${0.08 * (1 - d/100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}/>
}

export default function LoginPage() {
  const router = useRouter()
  // phase: 'splash' → 'login'
  const [phase, setPhase] = useState('splash')
  // splash sub-states
  const [splashScale, setSplashScale] = useState(0.3)
  const [splashOpacity, setSplashOpacity] = useState(0)
  // login fields
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  // login animation state: 'hidden' | 'in'
  const [loginAnim, setLoginAnim] = useState('hidden')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fase 1: logo aparece e cresce
    const t1 = setTimeout(() => { setSplashOpacity(1); setSplashScale(1) }, 100)
    // Fase 2: logo escala até cobrir a tela
    const t2 = setTimeout(() => { setSplashScale(9); setSplashOpacity(0) }, 1200)
    // Fase 3: mostrar login
    const t3 = setTimeout(() => {
      setPhase('login')
      setTimeout(() => setLoginAnim('in'), 50)
    }, 2400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!USUARIOS.includes(nome)) { setError('Usuário não encontrado.'); return }
    if (senha !== SENHA) { setError('Senha incorreta.'); return }
    setLoading(true)
    localStorage.setItem('criffer_user', nome)
    localStorage.setItem('criffer_auth', 'true')
    setTimeout(() => router.push('/capa'), 700)
  }

  if (!mounted) return null

  return (
    <div style={{ minHeight:'100vh', background:'#ffffff', overflow:'hidden', position:'relative' }}>

      {/* ── SPLASH ── */}
      {phase === 'splash' && (
        <div style={{
          position:'fixed', inset:0, background:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:50,
        }}>
          <div style={{
            transform: `scale(${splashScale})`,
            opacity: splashOpacity,
            transition: splashOpacity === 0 && splashScale === 9
              ? 'transform 1.1s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease'
              : splashOpacity === 1
              ? 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease'
              : 'none',
          }}>
            <Logo size={120} color="#ec6e2a" />
          </div>
        </div>
      )}

      {/* ── LOGIN ── */}
      {phase === 'login' && (
        <div style={{ minHeight:'100vh', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          <Particles />

          {/* Campos vindos da esquerda */}
          <div style={{
            width:'100%', maxWidth:420, position:'relative', zIndex:2,
            transform: loginAnim === 'in' ? 'translateX(0)' : 'translateX(-120px)',
            opacity: loginAnim === 'in' ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease',
          }}>
            <style>{`
              .li { outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
              .li:focus { border-color:#ec6e2a !important; box-shadow:0 0 0 3px rgba(236,110,42,0.15) !important; }
              .lb:hover { background:#c85a20 !important; transform:scale(1.02); }
              .lb:active { transform:scale(0.98) !important; }
            `}</style>

            {/* Logo + título */}
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:14,
                animation:'logoSpin 0.8s cubic-bezier(0.34,1.56,0.64,1) both' }}>
                <Logo size={80} color="#ec6e2a" />
              </div>
              <style>{`@keyframes logoSpin{from{transform:rotate(-180deg) scale(0)}to{transform:rotate(0) scale(1)}}`}</style>
              <div style={{ fontSize:28, fontWeight:900, color:'#111', letterSpacing:4, fontFamily:'Syne,sans-serif' }}>CRIFFERLAB</div>
              <div style={{ fontSize:11, color:'#aaa', letterSpacing:3, marginTop:4, textTransform:'uppercase' }}>ERP Financeiro</div>
            </div>

            <div style={{ background:'#fff', borderRadius:20, padding:'40px 44px', boxShadow:'0 20px 80px rgba(236,110,42,0.12), 0 4px 20px rgba(0,0,0,0.06)', border:'1px solid rgba(236,110,42,0.1)' }}>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom:18 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#000', textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>Seu nome</label>
                  <input className="li" type="text" value={nome} onChange={e => setNome(e.target.value)}
                    placeholder="Digite seu nome completo"
                    autoComplete="off" autoCorrect="off" spellCheck="false" data-form-type="other"
                    style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #e5e5e5', borderRadius:10, fontSize:14, color:'#111', background:'#fafafa', fontFamily:'inherit' }}
                  />
                </div>

                {/* Senha vindo da direita */}
                <div style={{
                  marginBottom:24,
                  transform: loginAnim === 'in' ? 'translateX(0)' : 'translateX(120px)',
                  opacity: loginAnim === 'in' ? 1 : 0,
                  transition: 'transform 0.7s 0.1s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s 0.1s ease',
                }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#000', textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>Senha</label>
                  <input className="li" type="password" value={senha} onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="new-password" data-form-type="other"
                    style={{ width:'100%', padding:'12px 16px', border:'1.5px solid #e5e5e5', borderRadius:10, fontSize:14, color:'#111', background:'#fafafa', fontFamily:'inherit' }}
                  />
                </div>

                {error && (
                  <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 14px', fontSize:13, color:'#DC2626', marginBottom:16, textAlign:'center', animation:'shake 0.4s ease' }}>
                    <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`}</style>
                    {error}
                  </div>
                )}

                {/* Botão vindo de baixo */}
                <div style={{
                  transform: loginAnim === 'in' ? 'translateY(0)' : 'translateY(40px)',
                  opacity: loginAnim === 'in' ? 1 : 0,
                  transition: 'transform 0.7s 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s 0.2s ease',
                }}>
                  <button type="submit" disabled={loading} className="lb"
                    style={{ width:'100%', padding:'14px', background:loading?'#ffb899':'#ec6e2a', border:'none', borderRadius:10, color:'#fff', fontSize:15, fontWeight:700, cursor:loading?'default':'pointer', fontFamily:'Syne,sans-serif', letterSpacing:1, transition:'all .2s' }}>
                    {loading ? 'Entrando...' : 'ENTRAR'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
