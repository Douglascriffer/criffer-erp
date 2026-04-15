'use client'
import { useState, useMemo, useEffect, useRef } from 'react'

// Formata número inteiro com separador pt-BR — SEM K ou M
function fmt(v) {
  if (!v && v !== 0) return '—'
  return Math.round(Math.abs(v)).toLocaleString('pt-BR')
}

// ── Dados reais por mês ─────────────────────────────────────────────────────
// Janeiro: receita meta 1.211.291 | realizado 1.607.824 → acima da meta ✅
// Janeiro: despesa orçada 1.343.002 | realizado 1.282.826 → abaixo do orçado ✅
const DADOS = {
  '1': {
    recReal: 1607824, recMeta: 1211291,
    despReal: 1282826, despOrc: 1343002,
    centros: [
      { cc:'Comercial',      orc:72931,   real:51352  },
      { cc:'Marketing',      orc:26209,   real:19038  },
      { cc:'Compras',        orc:22598,   real:17764  },
      { cc:'Lab. Calibração',orc:68931,   real:23708  },
      { cc:'Lab. Manutenção',orc:35659,   real:34593  },
      { cc:'Administrativo', orc:85747,   real:130470 },
      { cc:'Diretoria',      orc:362453,  real:372616 },
      { cc:'Financeiro',     orc:37031,   real:26305  },
      { cc:'P&D',            orc:66798,   real:84967  },
      { cc:'RH',             orc:5627,    real:3351   },
      { cc:'Locação',        orc:21662,   real:19517  },
      { cc:'TI',             orc:67026,   real:55513  },
      { cc:'Logística',      orc:120448,  real:86124  },
      { cc:'Manutenção',     orc:35466,   real:18058  },
      { cc:'Produção',       orc:283470,  real:315660 },
      { cc:'Sup. Técnico',   orc:30946,   real:23790  },
    ],
  },
  '2': {
    recReal: 1829348, recMeta: 2037149,
    despReal: 1534770, despOrc: 1735261,
    centros: [
      { cc:'Comercial',      orc:72931,   real:101701 },
      { cc:'Marketing',      orc:59209,   real:47366  },
      { cc:'Compras',        orc:22598,   real:24062  },
      { cc:'Lab. Calibração',orc:50431,   real:37366  },
      { cc:'Lab. Manutenção',orc:35659,   real:39875  },
      { cc:'Administrativo', orc:86147,   real:127076 },
      { cc:'Diretoria',      orc:362453,  real:374822 },
      { cc:'Financeiro',     orc:37784,   real:51423  },
      { cc:'P&D',            orc:105798,  real:77549  },
      { cc:'RH',             orc:13627,   real:8299   },
      { cc:'Locação',        orc:21662,   real:23447  },
      { cc:'TI',             orc:78190,   real:36721  },
      { cc:'Logística',      orc:120484,  real:81519  },
      { cc:'Manutenção',     orc:46707,   real:28881  },
      { cc:'Produção',       orc:459881,  real:196299 },
      { cc:'Sup. Técnico',   orc:30946,   real:39411  },
    ],
  },
  'all': {
    recReal: 1607824 + 1829348, recMeta: 1211291 + 2037149,
    despReal: 1282826 + 1534770, despOrc: 1343002 + 1735261,
    centros: [
      { cc:'Comercial',      orc:145862,  real:153053  },
      { cc:'Marketing',      orc:85418,   real:66404   },
      { cc:'Compras',        orc:45196,   real:41826   },
      { cc:'Lab. Calibração',orc:119362,  real:61074   },
      { cc:'Lab. Manutenção',orc:71318,   real:74468   },
      { cc:'Administrativo', orc:171894,  real:257546  },
      { cc:'Diretoria',      orc:724906,  real:747438  },
      { cc:'Financeiro',     orc:74815,   real:77728   },
      { cc:'P&D',            orc:172596,  real:162516  },
      { cc:'RH',             orc:19254,   real:11650   },
      { cc:'Locação',        orc:43324,   real:42964   },
      { cc:'TI',             orc:145216,  real:92234   },
      { cc:'Logística',      orc:240932,  real:167643  },
      { cc:'Manutenção',     orc:82173,   real:46939   },
      { cc:'Produção',       orc:743351,  real:511959  },
      { cc:'Sup. Técnico',   orc:61892,   real:63201   },
    ],
  },
}

const METAS = {
  inicial:    { receita:26674257, despesas:27797748, resultado:-1123491, lucro:3000000, ganho:4123491, economia:23 },
  atualizada: { receita:27120192, despesas:26955883, resultado:164309,   lucro:3000000, ganho:2835691, economia:16 },
}

const MES_LABEL = { '1':'Janeiro', '2':'Fevereiro', 'all':'Acumulado (Jan–Fev)' }

// ── Fireworks ────────────────────────────────────────────────────────────────
function Fireworks({ onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const colors = ['#ec6e2a','#27ae60','#f39c12','#3498db','#e74c3c','#9b59b6','#FFD700']
    const particles = []
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div')
      const tx = (Math.random() - 0.5) * 500
      const ty = (Math.random() - 0.5) * 300
      const color = colors[Math.floor(Math.random() * colors.length)]
      p.style.cssText = `
        position:absolute;width:7px;height:7px;border-radius:50%;
        background:${color};left:${30+Math.random()*40}%;top:${20+Math.random()*60}%;
        animation:fw ${0.6+Math.random()*0.9}s ease-out ${Math.random()*0.4}s forwards;
        --tx:${tx}px;--ty:${ty}px;
      `
      el.appendChild(p)
      particles.push(p)
    }
    const t = setTimeout(() => { onDone && onDone() }, 3000)
    return () => { clearTimeout(t); particles.forEach(p => p.remove()) }
  }, [])
  return (
    <>
      <style>{`@keyframes fw{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}`}</style>
      <div ref={ref} style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:10, overflow:'hidden', borderRadius:20 }}/>
    </>
  )
}

// ── Shake ────────────────────────────────────────────────────────────────────
function ShakeOverlay({ onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.animation = 'shake 0.5s ease-in-out 4'
    const t = setTimeout(() => { onDone && onDone() }, 3000)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-7px)}20%,40%,60%,80%{transform:translateX(7px)}}`}</style>
      <div ref={ref} style={{ position:'absolute', inset:0, background:'rgba(220,38,38,0.12)', borderRadius:20, pointerEvents:'none', zIndex:5 }}/>
    </>
  )
}

export default function OrcamentoView({ mes = 'all', initialSubView = 0, darkMode = false }) {
  const [sub, setSub] = useState(initialSubView)
  const [animDone, setAnimDone] = useState(false)

  // Sync sub com initialSubView quando prop muda (via URL)
  useEffect(() => { setSub(initialSubView); setAnimDone(false) }, [initialSubView])

  const dados    = DADOS[mes] || DADOS['all']
  const mesLabel = MES_LABEL[mes] || 'Acumulado'

  const totalOrc  = useMemo(() => dados.centros.reduce((s,c) => s + c.orc,  0), [dados])
  const totalReal = useMemo(() => dados.centros.reduce((s,c) => s + c.real, 0), [dados])

  const recReal  = dados.recReal
  const recMeta  = dados.recMeta
  const despReal = dados.despReal
  const despOrc  = dados.despOrc

  // Receita: acima da meta é BOM (seta ▲ verde)
  const recDiff  = recReal - recMeta
  const recPct   = recMeta > 0 ? ((recReal - recMeta) / recMeta * 100) : 0
  const recBom   = recReal >= recMeta

  // Despesa: abaixo do orçado é BOM (seta ▼ verde)
  const despDiff = despReal - despOrc
  const despPct  = despOrc > 0 ? ((despReal - despOrc) / despOrc * 100) : 0
  const despBom  = despReal <= despOrc

  const resultado = recReal - despReal
  const resPositivo = resultado >= 0

  const card    = darkMode ? '#222'   : 'white'
  const border  = darkMode ? '#333'   : '#F0EDE8'
  const textMain= darkMode ? '#EEE'   : '#1A1A1A'
  const textSub = darkMode ? '#AAA'   : '#555'
  const textMut = darkMode ? '#666'   : '#999'
  const rowOdd  = darkMode ? '#1E1E1E': '#FAFAFA'

  const SUB = ['Receitas e Despesas', 'Resultado Líquido', 'Metas 2026']

  return (
    <div style={{ fontFamily:'Syne,sans-serif' }}>
      {/* Sub-tabs INTERNOS ao card — apenas para o painel de orçamento */}
      <div style={{ display:'flex', gap:4, background:darkMode?'#333':'#F5F5F5', borderRadius:12, padding:4, marginBottom:24 }}>
        {SUB.map((t,i) => (
          <button key={i} onClick={() => { setSub(i); setAnimDone(false) }} style={{
            flex:1, padding:'10px 8px', border:'none', borderRadius:9, cursor:'pointer',
            fontFamily:'inherit', fontSize:13, fontWeight:700,
            background: sub===i ? card      : 'transparent',
            color:      sub===i ? '#FF6A22' : textMut,
            boxShadow:  sub===i ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
            transition:'all .18s',
          }}>{t}</button>
        ))}
      </div>

      {/* ── SUB 0: Receitas e Despesas ── */}
      {sub === 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* KPI Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

            {/* RECEITA */}
            <div style={{ background:card, borderRadius:16, padding:'24px 28px', border:`1px solid ${border}`, borderLeft:`4px solid ${recBom?'#16a34a':'#EF4444'}` }}>
              <p style={{ fontSize:11, fontWeight:800, color:textMut, textTransform:'uppercase', letterSpacing:.5, marginBottom:10 }}>Receita — {mesLabel}</p>
              <p style={{ fontSize:36, fontWeight:900, color:recBom?'#16a34a':'#EF4444', lineHeight:1, marginBottom:10 }}>
                {fmt(recReal)}
              </p>
              <p style={{ fontSize:14, color:textSub, marginBottom:8 }}>Meta: {fmt(recMeta)}</p>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:18, fontWeight:900, color:recBom?'#16a34a':'#EF4444' }}>
                  {recBom ? '▲' : '▼'} {Math.abs(recPct).toFixed(1)}%
                </span>
                <span style={{ fontSize:12, color:textMut }}>
                  {recBom ? 'acima da meta' : 'abaixo da meta'}
                </span>
              </div>
              <div style={{ marginTop:10, fontSize:13, color:recBom?'#16a34a':'#EF4444', fontWeight:600 }}>
                {recBom
                  ? `✅ Superamos a meta em ${fmt(Math.abs(recDiff))}`
                  : `⚠️ Faltou ${fmt(Math.abs(recDiff))} para a meta`}
              </div>
            </div>

            {/* DESPESA */}
            <div style={{ background:card, borderRadius:16, padding:'24px 28px', border:`1px solid ${border}`, borderLeft:`4px solid ${despBom?'#16a34a':'#EF4444'}` }}>
              <p style={{ fontSize:11, fontWeight:800, color:textMut, textTransform:'uppercase', letterSpacing:.5, marginBottom:10 }}>Despesas — {mesLabel}</p>
              <p style={{ fontSize:36, fontWeight:900, color:despBom?'#16a34a':'#EF4444', lineHeight:1, marginBottom:10 }}>
                {fmt(despReal)}
              </p>
              <p style={{ fontSize:14, color:textSub, marginBottom:8 }}>Orçado: {fmt(despOrc)}</p>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:18, fontWeight:900, color:despBom?'#16a34a':'#EF4444' }}>
                  {despBom ? '▼' : '▲'} {Math.abs(despPct).toFixed(1)}%
                </span>
                <span style={{ fontSize:12, color:textMut }}>
                  {despBom ? 'abaixo do orçado' : 'acima do orçado'}
                </span>
              </div>
              <div style={{ marginTop:10, fontSize:13, color:despBom?'#16a34a':'#EF4444', fontWeight:600 }}>
                {despBom
                  ? `✅ Economia de ${fmt(Math.abs(despDiff))} — abaixo do orçado!`
                  : `⚠️ Excedemos o orçado em ${fmt(Math.abs(despDiff))}`}
              </div>
            </div>
          </div>

          {/* Tabela centros de custo */}
          <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', background:'#FF6A22', textAlign:'center' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'white' }}>Despesas por Centro de Custo — {mesLabel}</div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:darkMode?'#252525':'#FFF8F5' }}>
                    {['Centro de Custo','Orçado','Realizado','Variação'].map(h => (
                      <th key={h} style={{ padding:'12px 20px', textAlign:h==='Centro de Custo'?'left':'right', fontSize:12, fontWeight:800, color:textSub, textTransform:'uppercase', letterSpacing:.3, borderBottom:`2px solid ${border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.centros.map((c,i) => {
                    const v = c.orc > 0 ? ((c.real - c.orc) / c.orc * 100) : 0
                    // Despesa: variação negativa (gastou menos) = verde (bom)
                    const varBom = v <= 0
                    return (
                      <tr key={c.cc} style={{ background:i%2===0?card:rowOdd, borderBottom:`1px solid ${border}` }}>
                        <td style={{ padding:'11px 20px', color:textMain, fontWeight:700, fontSize:14 }}>{c.cc}</td>
                        <td style={{ padding:'11px 20px', textAlign:'right', color:textSub, fontSize:14 }}>{fmt(c.orc)}</td>
                        <td style={{ padding:'11px 20px', textAlign:'right', color:textMain, fontWeight:800, fontSize:14 }}>{fmt(c.real)}</td>
                        <td style={{ padding:'11px 20px', textAlign:'right' }}>
                          <span style={{ fontSize:14, fontWeight:800, color:varBom?'#16a34a':'#EF4444' }}>
                            {v > 0 ? '+' : ''}{v.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background:'#1A1A1A', borderTop:'2px solid #FF6A22' }}>
                    <td style={{ padding:'13px 20px', color:'white', fontWeight:900, fontSize:15 }}>Total Geral</td>
                    <td style={{ padding:'13px 20px', textAlign:'right', color:'#CCC', fontSize:14 }}>{fmt(totalOrc)}</td>
                    <td style={{ padding:'13px 20px', textAlign:'right', color:'white', fontWeight:900, fontSize:15 }}>{fmt(totalReal)}</td>
                    <td style={{ padding:'13px 20px', textAlign:'right' }}>
                      <span style={{ color: totalReal <= totalOrc ? '#27ae60' : '#EF4444', fontWeight:900, fontSize:15 }}>
                        {totalOrc > 0 ? (((totalReal - totalOrc) / totalOrc) * 100).toFixed(1) : '—'}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB 1: Resultado Líquido ── */}
      {sub === 1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ position:'relative', background:card, borderRadius:20, padding:'52px 40px', border:`1px solid ${border}`, textAlign:'center', overflow:'hidden' }}>
            {/* Animação: fogos se positivo, tremida se negativo — 3 segundos */}
            {!animDone && resPositivo  && <Fireworks onDone={() => setAnimDone(true)} />}
            {!animDone && !resPositivo && <ShakeOverlay onDone={() => setAnimDone(true)} />}

            <div style={{ position:'relative', zIndex:2 }}>
              <div style={{ fontSize:13, color:textMut, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>
                Resultado Líquido — {mesLabel}
              </div>
              <div style={{ fontSize:64, fontWeight:900, color:resPositivo?'#16a34a':'#EF4444', lineHeight:1, marginBottom:14 }}>
                {resultado < 0 ? '- ' : '+ '}{fmt(Math.abs(resultado))}
              </div>
              <div style={{ fontSize:16, color:resPositivo?'#16a34a':'#EF4444', fontWeight:700, marginBottom:6 }}>
                {resPositivo ? '🎉 Resultado positivo — parabéns pelo desempenho!' : '⚠️ Resultado negativo — atenção às despesas'}
              </div>
              <div style={{ fontSize:14, color:textSub, fontWeight:600 }}>
                Receita {fmt(recReal)} − Despesas {fmt(despReal)}
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { label:'Receita Realizada', val:recReal,  ref:recMeta,  refLabel:'Meta',   pct:recMeta>0?(recReal/recMeta)*100:0,   color:recBom?'#16a34a':'#EF4444' },
              { label:'Despesa Realizada', val:despReal, ref:despOrc,  refLabel:'Orçado', pct:despOrc>0?(despReal/despOrc)*100:0,  color:despBom?'#16a34a':'#EF4444' },
            ].map(c => (
              <div key={c.label} style={{ background:card, borderRadius:16, padding:'28px', border:`1px solid ${border}` }}>
                <div style={{ fontSize:12, color:textMut, fontWeight:800, textTransform:'uppercase', marginBottom:14 }}>{c.label}</div>
                <div style={{ fontSize:38, fontWeight:900, color:c.color, marginBottom:16 }}>{fmt(c.val)}</div>
                <div style={{ height:10, background:darkMode?'#333':'#F0F0F0', borderRadius:5, overflow:'hidden', marginBottom:10 }}>
                  <div style={{ height:'100%', background:c.color, borderRadius:5, width:`${Math.min(c.pct,130)}%`, transition:'width .7s' }}/>
                </div>
                <div style={{ fontSize:14, color:textSub, fontWeight:600 }}>{c.refLabel}: {fmt(c.ref)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB 2: Metas 2026 ── */}
      {sub === 2 && (
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:textMut, textTransform:'uppercase', letterSpacing:1, textAlign:'center', marginBottom:24 }}>
            METAS ANUAIS 2026
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {[
              { label:'META 2026 — INICIAL',    data:METAS.inicial    },
              { label:'META 2026 — ATUALIZADA', data:METAS.atualizada },
            ].map(({ label, data:d }) => (
              <div key={label} style={{ background:card, borderRadius:16, border:`1px solid ${border}`, overflow:'hidden' }}>
                <div style={{ background:'#FF6A22', padding:'18px 24px', textAlign:'center' }}>
                  <div style={{ fontSize:14, fontWeight:900, color:'white', letterSpacing:.5 }}>{label}</div>
                </div>
                <div style={{ padding:'20px 28px' }}>
                  {[
                    { label:'Receita Bruta', val:d.receita,  color:textMain, prefix:''   },
                    { label:'Despesas',      val:d.despesas, color:'#EF4444', prefix:'- ' },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${border}` }}>
                      <span style={{ fontSize:15, color:textSub }}>{row.label}</span>
                      <span style={{ fontSize:15, fontWeight:700, color:row.color }}>{row.prefix}R$ {fmt(Math.abs(row.val))}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${border}` }}>
                    <span style={{ fontSize:15, fontWeight:800, color:textMain }}>Resultado</span>
                    <span style={{ fontSize:15, fontWeight:900, color:d.resultado<0?'#EF4444':'#16a34a' }}>
                      {d.resultado<0?'- ':'+ '}R$ {fmt(Math.abs(d.resultado))}
                    </span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${border}` }}>
                    <span style={{ fontSize:15, fontWeight:800, color:textMain }}>Lucro Esperado</span>
                    <span style={{ fontSize:15, fontWeight:700, color:textMain }}>R$ {fmt(d.lucro)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${border}` }}>
                    <span style={{ fontSize:15, color:textSub }}>Ganho Necessário</span>
                    <span style={{ fontSize:15, fontWeight:700, color:'#FF6A22' }}>R$ {fmt(d.ganho)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:18 }}>
                    <span style={{ fontSize:13, fontWeight:900, color:textMain, textTransform:'uppercase', letterSpacing:.5 }}>Economia de Gastos</span>
                    <span style={{ fontSize:42, fontWeight:900, color:'#FF6A22' }}>{d.economia}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
