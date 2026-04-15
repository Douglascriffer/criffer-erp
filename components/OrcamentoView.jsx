'use client'
import { useState, useMemo } from 'react'

function fmt(v) {
  if (!v && v!==0) return '—'
  return Math.round(Math.abs(v)).toLocaleString('pt-BR')
}

// ── Data por mês ─────────────────────────────────────────────
const DADOS = {
  '1': {
    recReal:1607824, recMeta:1211291,
    centros:[
      {cc:'Comercial',     orc:72931,  real:51352 },
      {cc:'Marketing',     orc:26209,  real:19038 },
      {cc:'Compras',       orc:22598,  real:17764 },
      {cc:'Lab. Calibração',orc:68931, real:23708 },
      {cc:'Lab. Manutenção',orc:35659, real:34593 },
      {cc:'Administrativo',orc:85747,  real:130470},
      {cc:'Diretoria',     orc:362453, real:372616},
      {cc:'Financeiro',    orc:37031,  real:26305 },
      {cc:'P&D',           orc:66798,  real:84967 },
      {cc:'RH',            orc:5627,   real:3351  },
      {cc:'Locação',       orc:21662,  real:19517 },
      {cc:'TI',            orc:67026,  real:55513 },
      {cc:'Logística',     orc:120448, real:86124 },
      {cc:'Manutenção',    orc:35466,  real:18058 },
      {cc:'Produção',      orc:283470, real:315660},
      {cc:'Sup. Técnico',  orc:30946,  real:23790 },
    ],
  },
  '2': {
    recReal:1829348, recMeta:2037149,
    centros:[
      {cc:'Comercial',     orc:72931,   real:101701},
      {cc:'Marketing',     orc:59209,   real:47366 },
      {cc:'Compras',       orc:22598,   real:24062 },
      {cc:'Lab. Calibração',orc:50431,  real:37366 },
      {cc:'Lab. Manutenção',orc:35659,  real:39875 },
      {cc:'Administrativo',orc:86147,   real:127076},
      {cc:'Diretoria',     orc:1662453, real:1674822},
      {cc:'Financeiro',    orc:37784,   real:51423 },
      {cc:'P&D',           orc:105798,  real:77549 },
      {cc:'RH',            orc:13627,   real:8299  },
      {cc:'Locação',       orc:21662,   real:23447 },
      {cc:'TI',            orc:78190,   real:36721 },
      {cc:'Logística',     orc:120484,  real:81519 },
      {cc:'Manutenção',    orc:46707,   real:28881 },
      {cc:'Produção',      orc:459881,  real:196299},
      {cc:'Sup. Técnico',  orc:30946,   real:39411 },
    ],
  },
  'all': {
    recReal:1607824+1829348, recMeta:1211291+2037149,
    centros:[
      {cc:'Comercial',     orc:223292,  real:279291 },
      {cc:'Marketing',     orc:178126,  real:142733 },
      {cc:'Compras',       orc:67793,   real:60621  },
      {cc:'Lab. Calibração',orc:210263, real:108969 },
      {cc:'Lab. Manutenção',orc:106976, real:107454 },
      {cc:'Administrativo',orc:258042,  real:400491 },
      {cc:'Diretoria',     orc:2987360, real:2999682},
      {cc:'Financeiro',    orc:126294,  real:-483453},
      {cc:'P&D',           orc:239395,  real:220838 },
      {cc:'RH',            orc:24882,   real:15701  },
      {cc:'Locação',       orc:64985,   real:67281  },
      {cc:'TI',            orc:217974,  real:148356 },
      {cc:'Logística',     orc:356415,  real:221075 },
      {cc:'Manutenção',    orc:119124,  real:85202  },
      {cc:'Produção',      orc:1210459, real:809265 },
      {cc:'Sup. Técnico',  orc:94839,   real:98709  },
    ],
  },
}

const METAS = {
  inicial:    { receita:26674257, despesas:27797748, resultado:-1123491, lucro:3000000, ganho:4123491, economia:23 },
  atualizada: { receita:27120192, despesas:26955883, resultado:164309,   lucro:3000000, ganho:2835691, economia:16 },
}

const MES_LABEL = {'1':'Janeiro','2':'Fevereiro','all':'Acumulado (Jan–Fev)'}

export default function OrcamentoView({ mes='all', initialSubView=0, darkMode=false }) {
  const [sub, setSub] = useState(initialSubView)

  const dados = DADOS[mes] || DADOS['all']
  const mesLabel = MES_LABEL[mes] || 'Acumulado'

  const totalOrc  = useMemo(()=> dados.centros.reduce((s,c)=>s+c.orc,0), [dados])
  const totalReal = useMemo(()=> dados.centros.reduce((s,c)=>s+c.real,0), [dados])

  const recPct  = dados.recMeta>0 ? ((dados.recReal-dados.recMeta)/dados.recMeta*100) : 0
  const despReal= useMemo(()=> dados.centros.reduce((s,c)=>s+(c.real>0?c.real:0),0), [dados])
  const despOrc = totalOrc
  const despPct = despOrc>0 ? ((despReal-despOrc)/despOrc*100) : 0
  const resultado = dados.recReal - despReal

  const card   = darkMode ? '#222' : 'white'
  const border  = darkMode ? '#333' : '#F0EDE8'
  const textMain= darkMode ? '#EEE' : '#1A1A1A'
  const textSub = darkMode ? '#AAA' : '#555'
  const textMut = darkMode ? '#666' : '#999'
  const rowOdd  = darkMode ? '#1E1E1E' : '#FAFAFA'

  const SUB = ['Receitas e Despesas','Resultado Líquido','Metas 2026']

  // Sync with initialSubView when prop changes
  useState(()=>{ setSub(initialSubView) }, [initialSubView])

  return (
    <div style={{ fontFamily:'Syne,sans-serif' }}>
      {/* Sub-tabs */}
      <div style={{ display:'flex', gap:4, background:darkMode?'#333':'#F5F5F5', borderRadius:12, padding:4, marginBottom:24 }}>
        {SUB.map((t,i) => (
          <button key={i} onClick={()=>setSub(i)} style={{
            flex:1, padding:'10px 8px', border:'none', borderRadius:9, cursor:'pointer',
            fontFamily:'inherit', fontSize:13, fontWeight:700,
            background: sub===i ? card : 'transparent',
            color:      sub===i ? '#FF6A22' : textMut,
            boxShadow:  sub===i ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
            transition:'all .18s',
          }}>{t}</button>
        ))}
      </div>

      {/* ── SUB 0: Receitas e Despesas ── */}
      {sub===0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* KPI Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {/* Receita */}
            <div style={{ background:card, borderRadius:16, padding:'24px 28px', border:`1px solid ${border}`, borderLeft:'4px solid #16a34a' }}>
              <p style={{ fontSize:11, fontWeight:800, color:textMut, textTransform:'uppercase', letterSpacing:.5, marginBottom:10 }}>Receita Realizada</p>
              <p style={{ fontSize:36, fontWeight:900, color:recPct>=0?'#16a34a':'#EF4444', fontFamily:'Syne,sans-serif', lineHeight:1, marginBottom:10 }}>{fmt(dados.recReal)}</p>
              <p style={{ fontSize:14, color:textSub, marginBottom:8 }}>Meta: {fmt(dados.recMeta)}</p>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:16, fontWeight:900, color:'#EF4444' }}>▼ {Math.abs(recPct).toFixed(0)}%</span>
                <span style={{ fontSize:12, color:textMut }}>abaixo da meta</span>
              </div>
            </div>
            {/* Despesa */}
            <div style={{ background:card, borderRadius:16, padding:'24px 28px', border:`1px solid ${border}`, borderLeft:'4px solid #EF4444' }}>
              <p style={{ fontSize:11, fontWeight:800, color:textMut, textTransform:'uppercase', letterSpacing:.5, marginBottom:10 }}>Despesa Realizada</p>
              <p style={{ fontSize:36, fontWeight:900, color:'#EF4444', fontFamily:'Syne,sans-serif', lineHeight:1, marginBottom:10 }}>{fmt(despReal)}</p>
              <p style={{ fontSize:14, color:textSub, marginBottom:8 }}>Orçado: {fmt(despOrc)}</p>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:16, fontWeight:900, color:'#EF4444' }}>▲ {Math.abs(despPct).toFixed(0)}%</span>
                <span style={{ fontSize:12, color:textMut }}>acima do orçado</span>
              </div>
            </div>
          </div>

          {/* Tabela centros */}
          <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', background:'#FF6A22', textAlign:'center' }}>
              <div style={{ fontSize:15, fontWeight:800, color:'white' }}>Despesas por Centro de Custo — {mesLabel}</div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:darkMode?'#252525':'#FFF8F5' }}>
                    {['Centro de Custo','Orçado','Realizado','Variação'].map(h=>(
                      <th key={h} style={{ padding:'12px 20px', textAlign:h==='Centro de Custo'?'left':'right', fontSize:12, fontWeight:800, color:textSub, textTransform:'uppercase', letterSpacing:.3, borderBottom:`2px solid ${border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.centros.map((c,i)=>{
                    const v = c.orc>0 ? ((c.real-c.orc)/c.orc*100) : 0
                    return (
                      <tr key={c.cc} style={{ background:i%2===0?card:rowOdd, borderBottom:`1px solid ${border}` }}>
                        <td style={{ padding:'11px 20px', color:textMain, fontWeight:700, fontSize:14 }}>{c.cc}</td>
                        <td style={{ padding:'11px 20px', textAlign:'right', color:textSub, fontSize:14 }}>{fmt(c.orc)}</td>
                        <td style={{ padding:'11px 20px', textAlign:'right', color:textMain, fontWeight:800, fontSize:14 }}>{fmt(c.real)}</td>
                        <td style={{ padding:'11px 20px', textAlign:'right' }}>
                          <span style={{ fontSize:14, fontWeight:800, color:v<0?'#16a34a':'#EF4444' }}>{v>0?'+':''}{v.toFixed(0)}%</span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background:'#1A1A1A', borderTop:'2px solid #FF6A22' }}>
                    <td style={{ padding:'13px 20px', color:'white', fontWeight:900, fontSize:15 }}>Total Geral</td>
                    <td style={{ padding:'13px 20px', textAlign:'right', color:'#CCC', fontSize:14 }}>{fmt(totalOrc)}</td>
                    <td style={{ padding:'13px 20px', textAlign:'right', color:'white', fontWeight:900, fontSize:15 }}>{fmt(totalReal)}</td>
                    <td style={{ padding:'13px 20px', textAlign:'right' }}>
                      <span style={{ color:'#FF6A22', fontWeight:900, fontSize:15 }}>
                        {totalOrc>0 ? (((totalReal-totalOrc)/totalOrc)*100).toFixed(0) : '—'}%
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
      {sub===1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:card, borderRadius:20, padding:'48px 40px', border:`1px solid ${border}`, textAlign:'center' }}>
            <div style={{ fontSize:13, color:textMut, fontWeight:800, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Resultado Líquido — {mesLabel}</div>
            <div style={{ fontSize:64, fontWeight:900, color:resultado>=0?'#FF6A22':'#EF4444', fontFamily:'Syne,sans-serif', lineHeight:1, marginBottom:14 }}>
              {resultado<0?'- ':''}{fmt(Math.abs(resultado))}
            </div>
            <div style={{ fontSize:15, color:textMut, marginBottom:6 }}>Receita Realizada − Despesa Realizada</div>
            <div style={{ fontSize:14, color:textSub, fontWeight:700 }}>{fmt(dados.recReal)} − {fmt(despReal)}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { label:'Receita Realizada', val:dados.recReal, ref:dados.recMeta, refLabel:'Meta',    pct:dados.recMeta>0?(dados.recReal/dados.recMeta)*100:0, color:'#16a34a', bg:'#F0FDF4' },
              { label:'Despesa Realizada', val:despReal,      ref:despOrc,       refLabel:'Orçado',  pct:despOrc>0?(despReal/despOrc)*100:0,                  color:'#EF4444', bg:'#FEF2F2' },
            ].map(c=>(
              <div key={c.label} style={{ background:card, borderRadius:16, padding:'28px', border:`1px solid ${border}` }}>
                <div style={{ fontSize:12, color:textMut, fontWeight:800, textTransform:'uppercase', marginBottom:14 }}>{c.label}</div>
                <div style={{ fontSize:38, fontWeight:900, color:c.color, fontFamily:'Syne,sans-serif', marginBottom:16 }}>{fmt(c.val)}</div>
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
      {sub===2 && (
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:textMut, textTransform:'uppercase', letterSpacing:1, textAlign:'center', marginBottom:24 }}>METAS ANUAIS 2026</div>
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
                    { label:'Receita Bruta',   val:d.receita,    color:textMain,  prefix:'' },
                    { label:'Despesas',        val:-d.despesas,  color:'#EF4444', prefix:'- ' },
                  ].map(row=>(
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${border}` }}>
                      <span style={{ fontSize:15, color:textSub }}>{row.label}</span>
                      <span style={{ fontSize:15, fontWeight:700, color:row.color }}>{row.prefix}R$ {fmt(Math.abs(row.val))}</span>
                    </div>
                  ))}
                  <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 0', borderBottom:`1px solid ${border}` }}>
                    <span style={{ fontSize:15, fontWeight:800, color:textMain }}>Resultado</span>
                    <span style={{ fontSize:15, fontWeight:900, color:d.resultado<0?'#EF4444':'#FF6A22' }}>
                      {d.resultado<0?'- ':''}R$ {fmt(Math.abs(d.resultado))}
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
                    <span style={{ fontSize:42, fontWeight:900, color:'#FF6A22', fontFamily:'Syne,sans-serif' }}>{d.economia}%</span>
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
