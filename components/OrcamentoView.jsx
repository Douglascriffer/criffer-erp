'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'

function fmt(v) {
  if (!v && v !== 0) return '—'
  return Math.round(Math.abs(v)).toLocaleString('pt-BR')
}

// ── Dados reais por mês ───────────────────────────────────────────────────────
const DADOS = {
  '1': {
    recReal:1607824, recMeta:1211291,
    despReal:1282826, despOrc:1343002,
    centros:[
      {cc:'Comercial',      orc:72931,  real:51352 },
      {cc:'Marketing',      orc:26209,  real:19038 },
      {cc:'Compras',        orc:22598,  real:17764 },
      {cc:'Lab. Calibração',orc:68931,  real:23708 },
      {cc:'Lab. Manutenção',orc:35659,  real:34593 },
      {cc:'Administrativo', orc:85747,  real:130470},
      {cc:'Diretoria',      orc:362453, real:372616},
      {cc:'Financeiro',     orc:37031,  real:26305 },
      {cc:'P&D',            orc:66798,  real:84967 },
      {cc:'RH',             orc:5627,   real:3351  },
      {cc:'Locação',        orc:21662,  real:19517 },
      {cc:'TI',             orc:67026,  real:55513 },
      {cc:'Logística',      orc:120448, real:86124 },
      {cc:'Manutenção',     orc:35466,  real:18058 },
      {cc:'Produção',       orc:283470, real:315660},
      {cc:'Sup. Técnico',   orc:30946,  real:23790 },
    ],
  },
  '2': {
    recReal:1829348, recMeta:2037149,
    despReal:1534770, despOrc:1735261,
    centros:[
      {cc:'Comercial',      orc:72931,  real:101701},
      {cc:'Marketing',      orc:59209,  real:47366 },
      {cc:'Compras',        orc:22598,  real:24062 },
      {cc:'Lab. Calibração',orc:50431,  real:37366 },
      {cc:'Lab. Manutenção',orc:35659,  real:39875 },
      {cc:'Administrativo', orc:86147,  real:127076},
      {cc:'Diretoria',      orc:362453, real:374822},
      {cc:'Financeiro',     orc:37784,  real:51423 },
      {cc:'P&D',            orc:105798, real:77549 },
      {cc:'RH',             orc:13627,  real:8299  },
      {cc:'Locação',        orc:21662,  real:23447 },
      {cc:'TI',             orc:78190,  real:36721 },
      {cc:'Logística',      orc:120484, real:81519 },
      {cc:'Manutenção',     orc:46707,  real:28881 },
      {cc:'Produção',       orc:459881, real:196299},
      {cc:'Sup. Técnico',   orc:30946,  real:39411 },
    ],
  },
  'all': {
    recReal:3437172, recMeta:3248440,
    despReal:2817596, despOrc:3078263,
    centros:[
      {cc:'Comercial',      orc:145862, real:153053 },
      {cc:'Marketing',      orc:85418,  real:66404  },
      {cc:'Compras',        orc:45196,  real:41826  },
      {cc:'Lab. Calibração',orc:119362, real:61074  },
      {cc:'Lab. Manutenção',orc:71318,  real:74468  },
      {cc:'Administrativo', orc:171894, real:257546 },
      {cc:'Diretoria',      orc:724906, real:747438 },
      {cc:'Financeiro',     orc:74815,  real:77728  },
      {cc:'P&D',            orc:172596, real:162516 },
      {cc:'RH',             orc:19254,  real:11650  },
      {cc:'Locação',        orc:43324,  real:42964  },
      {cc:'TI',             orc:145216, real:92234  },
      {cc:'Logística',      orc:240932, real:167643 },
      {cc:'Manutenção',     orc:82173,  real:46939  },
      {cc:'Produção',       orc:743351, real:511959 },
      {cc:'Sup. Técnico',   orc:61892,  real:63201  },
    ],
  },
}

// Dados mensais para gráfico de linha
const MENSAL_LINHA = [
  { mes:'Jan', receita:1607824, despesa:1282826, meta:1211291 },
  { mes:'Fev', receita:1829348, despesa:1534770, meta:2037149 },
  { mes:'Mar', receita:null,    despesa:null,    meta:1350000 },
  { mes:'Abr', receita:null,    despesa:null,    meta:1380000 },
  { mes:'Mai', receita:null,    despesa:null,    meta:1290000 },
  { mes:'Jun', receita:null,    despesa:null,    meta:1420000 },
  { mes:'Jul', receita:null,    despesa:null,    meta:1400000 },
  { mes:'Ago', receita:null,    despesa:null,    meta:1450000 },
  { mes:'Set', receita:null,    despesa:null,    meta:1480000 },
  { mes:'Out', receita:null,    despesa:null,    meta:1500000 },
  { mes:'Nov', receita:null,    despesa:null,    meta:1550000 },
  { mes:'Dez', receita:null,    despesa:null,    meta:1600000 },
]

const METAS = {
  inicial:    { receita:26674257, despesas:27797748, resultado:-1123491, lucro:3000000, ganho:4123491, economia:23 },
  atualizada: { receita:27120192, despesas:26955883, resultado:164309,   lucro:3000000, ganho:2835691, economia:16 },
}
const MES_LABEL = {'1':'Janeiro','2':'Fevereiro','all':'Acumulado (Jan–Fev)'}

// ── Fogos de Artifício ────────────────────────────────────────────────────────
function Fireworks() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const colors = ['#ec6e2a','#27ae60','#f39c12','#3498db','#e74c3c','#9b59b6','#FFD700','#fff']
    const ps = []
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('div')
      const tx = (Math.random()-0.5)*600
      const ty = (Math.random()-0.5)*380
      const c = colors[Math.floor(Math.random()*colors.length)]
      p.style.cssText = `position:absolute;width:${4+Math.random()*5}px;height:${4+Math.random()*5}px;border-radius:50%;background:${c};left:${20+Math.random()*60}%;top:${15+Math.random()*70}%;opacity:0;`
      p.animate([
        {transform:'translate(0,0) scale(1)',opacity:1},
        {transform:`translate(${tx}px,${ty}px) scale(0)`,opacity:0}
      ],{duration:700+Math.random()*800,delay:Math.random()*500,easing:'ease-out',fill:'forwards'})
      el.appendChild(p); ps.push(p)
    }
    return () => ps.forEach(p => p.remove())
  }, [])
  return <div ref={ref} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:5,overflow:'hidden',borderRadius:20}}/>
}

// ── Shake Negativo ────────────────────────────────────────────────────────────
function ShakeRed({ onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.animation = 'shk 0.5s ease-in-out 4'
    const t = setTimeout(() => onDone?.(), 3000)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <style>{`@keyframes shk{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-8px)}30%,60%,90%{transform:translateX(8px)}}`}</style>
      <div ref={ref} style={{position:'absolute',inset:0,background:'rgba(220,38,38,0.13)',borderRadius:20,pointerEvents:'none',zIndex:4}}/>
    </>
  )
}

// ── Tooltip linha ─────────────────────────────────────────────────────────────
function TipLinha({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{background:'#111',borderRadius:10,padding:'10px 16px',fontSize:13,border:'1px solid rgba(255,255,255,.08)'}}>
      <p style={{color:'#FF6A22',marginBottom:6,fontWeight:800}}>{label}</p>
      {payload.filter(p=>p.value!=null).map(p=>(
        <div key={p.name} style={{display:'flex',justifyContent:'space-between',gap:16,marginBottom:3}}>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:8,height:8,borderRadius:2,background:p.color}}/>
            <span style={{color:'#BBB'}}>{p.name}</span>
          </div>
          <span style={{color:'white',fontWeight:800}}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function OrcamentoView({ mes='all', initialSubView=0, darkMode=false }) {
  const [sub, setSub] = useState(initialSubView)
  const [animDone, setAnimDone] = useState(false)

  useEffect(() => { setSub(initialSubView); setAnimDone(false) }, [initialSubView])

  const dados    = DADOS[mes] || DADOS['all']
  const mesLabel = MES_LABEL[mes] || 'Acumulado'

  const totalOrc  = useMemo(() => dados.centros.reduce((s,c)=>s+c.orc, 0), [dados])
  const totalReal = useMemo(() => dados.centros.reduce((s,c)=>s+c.real,0), [dados])

  const { recReal, recMeta, despReal, despOrc } = dados
  const recDiff  = recReal - recMeta
  const recPct   = recMeta > 0 ? ((recReal-recMeta)/recMeta*100) : 0
  const recBom   = recReal >= recMeta
  const despDiff = despReal - despOrc
  const despPct  = despOrc > 0 ? ((despReal-despOrc)/despOrc*100) : 0
  const despBom  = despReal <= despOrc
  const resultado = recReal - despReal
  const resPos    = resultado >= 0

  const card    = darkMode?'#222':'white'
  const border  = darkMode?'#333':'#F0EDE8'
  const textMain= darkMode?'#EEE':'#1A1A1A'
  const textSub = darkMode?'#AAA':'#555'
  const textMut = darkMode?'#666':'#999'
  const rowOdd  = darkMode?'#1E1E1E':'#FAFAFA'

  const SUB = ['Receitas e Despesas','Resultado Líquido','Metas 2026']

  return (
    <div style={{fontFamily:'Syne,sans-serif'}}>
      {/* Sub-tabs */}
      <div style={{display:'flex',gap:4,background:darkMode?'#333':'#F5F5F5',borderRadius:12,padding:4,marginBottom:24}}>
        {SUB.map((t,i)=>(
          <button key={i} onClick={()=>{setSub(i);setAnimDone(false)}} style={{
            flex:1,padding:'10px 8px',border:'none',borderRadius:9,cursor:'pointer',
            fontFamily:'inherit',fontSize:13,fontWeight:700,
            background:sub===i?card:'transparent',
            color:sub===i?'#FF6A22':textMut,
            boxShadow:sub===i?'0 1px 4px rgba(0,0,0,.08)':'none',
            transition:'all .18s',
          }}>{t}</button>
        ))}
      </div>

      {/* ── SUB 0: Receitas e Despesas ── */}
      {sub===0 && (
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {/* KPI cards */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {/* RECEITA */}
            <div style={{background:card,borderRadius:16,padding:'24px 28px',border:`1px solid ${border}`,borderLeft:`4px solid ${recBom?'#16a34a':'#EF4444'}`,transition:'all .3s'}}>
              <p style={{fontSize:11,fontWeight:800,color:textMut,textTransform:'uppercase',letterSpacing:.5,marginBottom:10}}>Receita — {mesLabel}</p>
              <p style={{fontSize:36,fontWeight:900,color:recBom?'#16a34a':'#EF4444',lineHeight:1,marginBottom:10}}>{fmt(recReal)}</p>
              <p style={{fontSize:14,color:textSub,marginBottom:8}}>Meta: {fmt(recMeta)}</p>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                <span style={{fontSize:20,fontWeight:900,color:recBom?'#16a34a':'#EF4444'}}>{recBom?'▲':'▼'} {Math.abs(recPct).toFixed(1)}%</span>
                <span style={{fontSize:12,color:textMut}}>{recBom?'acima da meta':'abaixo da meta'}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:recBom?'#16a34a':'#EF4444',padding:'8px 12px',background:recBom?'#F0FDF4':'#FEF2F2',borderRadius:8}}>
                {recBom?`✅ Superamos em ${fmt(Math.abs(recDiff))}`:`⚠️ Faltou ${fmt(Math.abs(recDiff))}`}
              </div>
              {/* Mini progress */}
              <div style={{height:6,background:darkMode?'#333':'#F0F0F0',borderRadius:3,marginTop:14,overflow:'hidden'}}>
                <div style={{height:'100%',background:recBom?'#16a34a':'#EF4444',borderRadius:3,width:`${Math.min(recReal/recMeta*100,100)}%`,transition:'width .8s ease'}}/>
              </div>
              <div style={{fontSize:11,color:textMut,marginTop:4,textAlign:'right'}}>{Math.round(recReal/recMeta*100)}% da meta</div>
            </div>

            {/* DESPESA */}
            <div style={{background:card,borderRadius:16,padding:'24px 28px',border:`1px solid ${border}`,borderLeft:`4px solid ${despBom?'#16a34a':'#EF4444'}`,transition:'all .3s'}}>
              <p style={{fontSize:11,fontWeight:800,color:textMut,textTransform:'uppercase',letterSpacing:.5,marginBottom:10}}>Despesas — {mesLabel}</p>
              <p style={{fontSize:36,fontWeight:900,color:despBom?'#16a34a':'#EF4444',lineHeight:1,marginBottom:10}}>{fmt(despReal)}</p>
              <p style={{fontSize:14,color:textSub,marginBottom:8}}>Orçado: {fmt(despOrc)}</p>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                <span style={{fontSize:20,fontWeight:900,color:despBom?'#16a34a':'#EF4444'}}>{despBom?'▼':'▲'} {Math.abs(despPct).toFixed(1)}%</span>
                <span style={{fontSize:12,color:textMut}}>{despBom?'abaixo do orçado':'acima do orçado'}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:despBom?'#16a34a':'#EF4444',padding:'8px 12px',background:despBom?'#F0FDF4':'#FEF2F2',borderRadius:8}}>
                {despBom?`✅ Economia de ${fmt(Math.abs(despDiff))}`:`⚠️ Excedemos em ${fmt(Math.abs(despDiff))}`}
              </div>
              <div style={{height:6,background:darkMode?'#333':'#F0F0F0',borderRadius:3,marginTop:14,overflow:'hidden'}}>
                <div style={{height:'100%',background:despBom?'#16a34a':'#EF4444',borderRadius:3,width:`${Math.min(despReal/despOrc*100,100)}%`,transition:'width .8s ease'}}/>
              </div>
              <div style={{fontSize:11,color:textMut,marginTop:4,textAlign:'right'}}>{Math.round(despReal/despOrc*100)}% do orçado</div>
            </div>
          </div>

          {/* Gráfico de linha: receitas vs despesas mensal */}
          <div style={{background:card,borderRadius:16,border:`1px solid ${border}`,padding:'20px 24px'}}>
            <h3 style={{fontSize:14,fontWeight:700,color:textMain,marginBottom:16,textAlign:'center'}}>Receitas vs Despesas — Evolução Mensal 2026</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MENSAL_LINHA} margin={{top:4,right:8,left:0,bottom:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode?'#333':'#F0EDE8'} vertical={false}/>
                <XAxis dataKey="mes" tick={{fontSize:11,fill:'#AAA'}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>v?`${(v/1e6).toFixed(1)}M`:''} tick={{fontSize:10,fill:'#AAA'}} axisLine={false} tickLine={false} width={44}/>
                <Tooltip content={<TipLinha/>}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12,color:'#666',paddingTop:8}}/>
                <ReferenceLine y={1211291} stroke="#FF6A22" strokeDasharray="4 3" strokeWidth={1.5} label={{value:'Meta Jan',position:'right',fontSize:10,fill:'#FF6A22'}}/>
                <Line type="monotone" dataKey="meta" name="Meta" stroke="#C0BAB4" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls/>
                <Line type="monotone" dataKey="receita" name="Receita" stroke="#FF6A22" strokeWidth={2.5} dot={{fill:'#FF6A22',r:4}} connectNulls={false}/>
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#EF4444" strokeWidth={2} strokeDasharray="3 2" dot={{fill:'#EF4444',r:3}} connectNulls={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela centros de custo */}
          <div style={{background:card,borderRadius:16,border:`1px solid ${border}`,overflow:'hidden'}}>
            <div style={{padding:'14px 24px',background:'#FF6A22',textAlign:'center'}}>
              <div style={{fontSize:14,fontWeight:800,color:'white'}}>Despesas por Centro de Custo — {mesLabel}</div>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:darkMode?'#252525':'#FFF8F5'}}>
                    {['Centro de Custo','Orçado','Realizado','Variação'].map(h=>(
                      <th key={h} style={{padding:'11px 18px',textAlign:h==='Centro de Custo'?'left':'right',fontSize:11,fontWeight:800,color:textSub,textTransform:'uppercase',letterSpacing:.3,borderBottom:`2px solid ${border}`}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.centros.map((c,i)=>{
                    const v = c.orc>0?((c.real-c.orc)/c.orc*100):0
                    const bom = v<=0
                    return (
                      <tr key={c.cc} style={{background:i%2===0?card:rowOdd,borderBottom:`1px solid ${border}`}}>
                        <td style={{padding:'10px 18px',color:textMain,fontWeight:700,fontSize:13}}>{c.cc}</td>
                        <td style={{padding:'10px 18px',textAlign:'right',color:textSub,fontSize:13}}>{fmt(c.orc)}</td>
                        <td style={{padding:'10px 18px',textAlign:'right',color:textMain,fontWeight:800,fontSize:13}}>{fmt(c.real)}</td>
                        <td style={{padding:'10px 18px',textAlign:'right'}}>
                          <span style={{fontSize:13,fontWeight:800,color:bom?'#16a34a':'#EF4444',padding:'2px 8px',background:bom?'#F0FDF4':'#FEF2F2',borderRadius:20}}>
                            {v>0?'+':''}{v.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{background:'#111',borderTop:'2px solid #FF6A22'}}>
                    <td style={{padding:'12px 18px',color:'white',fontWeight:900,fontSize:14}}>Total Geral</td>
                    <td style={{padding:'12px 18px',textAlign:'right',color:'#AAA',fontSize:13}}>{fmt(totalOrc)}</td>
                    <td style={{padding:'12px 18px',textAlign:'right',color:'white',fontWeight:900,fontSize:14}}>{fmt(totalReal)}</td>
                    <td style={{padding:'12px 18px',textAlign:'right'}}>
                      <span style={{color:totalReal<=totalOrc?'#27ae60':'#EF4444',fontWeight:900,fontSize:14}}>
                        {totalOrc>0?(((totalReal-totalOrc)/totalOrc)*100).toFixed(1):'—'}%
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
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{position:'relative',background:card,borderRadius:20,padding:'52px 40px',border:`1px solid ${border}`,textAlign:'center',overflow:'hidden'}}>
            {!animDone && resPos  && <Fireworks/>}
            {!animDone && !resPos && <ShakeRed onDone={()=>setAnimDone(true)}/>}
            {!animDone && setTimeout(()=>setAnimDone(true),3100) && null}

            <div style={{position:'relative',zIndex:2}}>
              <div style={{fontSize:13,color:textMut,fontWeight:800,textTransform:'uppercase',letterSpacing:1,marginBottom:16}}>
                Resultado Líquido — {mesLabel}
              </div>
              <div style={{fontSize:68,fontWeight:900,color:resPos?'#16a34a':'#EF4444',lineHeight:1,marginBottom:14,textShadow:resPos?'0 0 40px rgba(22,163,74,0.3)':'0 0 40px rgba(239,68,68,0.3)'}}>
                {resultado<0?'- ':'+' }{fmt(Math.abs(resultado))}
              </div>
              <div style={{fontSize:16,fontWeight:700,color:resPos?'#16a34a':'#EF4444',marginBottom:10}}>
                {resPos?'🎉 Resultado positivo — excelente desempenho!':'⚠️ Resultado negativo — atenção às despesas'}
              </div>
              <div style={{fontSize:14,color:textSub}}>
                Receita {fmt(recReal)} − Despesas {fmt(despReal)}
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {label:'Receita Realizada',val:recReal,ref:recMeta,refLabel:'Meta',pct:recMeta>0?(recReal/recMeta)*100:0,cor:recBom?'#16a34a':'#EF4444'},
              {label:'Despesa Realizada',val:despReal,ref:despOrc,refLabel:'Orçado',pct:despOrc>0?(despReal/despOrc)*100:0,cor:despBom?'#16a34a':'#EF4444'},
            ].map(c=>(
              <div key={c.label} style={{background:card,borderRadius:16,padding:'28px',border:`1px solid ${border}`}}>
                <div style={{fontSize:12,color:textMut,fontWeight:800,textTransform:'uppercase',marginBottom:14}}>{c.label}</div>
                <div style={{fontSize:38,fontWeight:900,color:c.cor,marginBottom:16}}>{fmt(c.val)}</div>
                <div style={{height:10,background:darkMode?'#333':'#F0F0F0',borderRadius:5,overflow:'hidden',marginBottom:10}}>
                  <div style={{height:'100%',background:c.cor,borderRadius:5,width:`${Math.min(c.pct,130)}%`,transition:'width .8s ease'}}/>
                </div>
                <div style={{fontSize:14,color:textSub,fontWeight:600}}>{c.refLabel}: {fmt(c.ref)}</div>
              </div>
            ))}
          </div>

          {/* Gráfico de linha resultado */}
          <div style={{background:card,borderRadius:16,border:`1px solid ${border}`,padding:'20px 24px'}}>
            <h3 style={{fontSize:14,fontWeight:700,color:textMain,marginBottom:16,textAlign:'center'}}>Receitas vs Despesas Mensais — Tendência 2026</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={MENSAL_LINHA} margin={{top:4,right:8,left:0,bottom:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode?'#333':'#F0EDE8'} vertical={false}/>
                <XAxis dataKey="mes" tick={{fontSize:11,fill:'#AAA'}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>v?`${(v/1e6).toFixed(1)}M`:''} tick={{fontSize:10,fill:'#AAA'}} axisLine={false} tickLine={false} width={44}/>
                <Tooltip content={<TipLinha/>}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12,color:'#666',paddingTop:8}}/>
                <Line type="monotone" dataKey="receita" name="Receita" stroke="#FF6A22" strokeWidth={2.5} dot={{fill:'#FF6A22',r:4}} connectNulls={false}/>
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#EF4444" strokeWidth={2} dot={{fill:'#EF4444',r:3}} connectNulls={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── SUB 2: Metas 2026 ── */}
      {sub===2 && (
        <div>
          <div style={{fontSize:13,fontWeight:800,color:textMut,textTransform:'uppercase',letterSpacing:1,textAlign:'center',marginBottom:24}}>METAS ANUAIS 2026</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}}>
            {[
              {label:'META 2026 — INICIAL',data:METAS.inicial},
              {label:'META 2026 — ATUALIZADA',data:METAS.atualizada},
            ].map(({label,data:d})=>(
              <div key={label} style={{background:card,borderRadius:16,border:`1px solid ${border}`,overflow:'hidden'}}>
                <div style={{background:'#FF6A22',padding:'16px 24px',textAlign:'center'}}>
                  <div style={{fontSize:13,fontWeight:900,color:'white',letterSpacing:.5}}>{label}</div>
                </div>
                <div style={{padding:'20px 28px'}}>
                  {[
                    {label:'Receita Bruta',val:d.receita,color:textMain,prefix:''},
                    {label:'Despesas',val:d.despesas,color:'#EF4444',prefix:'- '},
                  ].map(row=>(
                    <div key={row.label} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${border}`}}>
                      <span style={{fontSize:14,color:textSub}}>{row.label}</span>
                      <span style={{fontSize:14,fontWeight:700,color:row.color}}>{row.prefix}R$ {fmt(Math.abs(row.val))}</span>
                    </div>
                  ))}
                  <div style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:`1px solid ${border}`}}>
                    <span style={{fontSize:14,fontWeight:800,color:textMain}}>Resultado</span>
                    <span style={{fontSize:14,fontWeight:900,color:d.resultado<0?'#EF4444':'#16a34a'}}>{d.resultado<0?'- ':'+'}R$ {fmt(Math.abs(d.resultado))}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:16}}>
                    <span style={{fontSize:12,fontWeight:900,color:textMain,textTransform:'uppercase',letterSpacing:.5}}>Economia de Gastos</span>
                    <span style={{fontSize:40,fontWeight:900,color:'#FF6A22'}}>{d.economia}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico de linha metas */}
          <div style={{background:card,borderRadius:16,border:`1px solid ${border}`,padding:'20px 24px'}}>
            <h3 style={{fontSize:14,fontWeight:700,color:textMain,marginBottom:16,textAlign:'center'}}>Projeção de Metas vs Realizações — 2026</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MENSAL_LINHA} margin={{top:4,right:8,left:0,bottom:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode?'#333':'#F0EDE8'} vertical={false}/>
                <XAxis dataKey="mes" tick={{fontSize:11,fill:'#AAA'}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>v?`${(v/1e6).toFixed(1)}M`:''} tick={{fontSize:10,fill:'#AAA'}} axisLine={false} tickLine={false} width={44}/>
                <Tooltip content={<TipLinha/>}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:12,color:'#666',paddingTop:8}}/>
                <Line type="monotone" dataKey="meta" name="Meta" stroke="#C0BAB4" strokeWidth={2} strokeDasharray="5 3" dot={false} connectNulls/>
                <Line type="monotone" dataKey="receita" name="Realizado" stroke="#FF6A22" strokeWidth={2.5} dot={{fill:'#FF6A22',r:4}} connectNulls={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
