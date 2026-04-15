'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

// Valores dentro das barras: número inteiro pt-BR sem K/M
function fmtBar(v) {
  if (!v && v !== 0) return ''
  return Math.round(v).toLocaleString('pt-BR')
}
// Tooltip
function fmtTip(v) {
  if (!v && v !== 0) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

function InsideLabel({ x, y, width, height, value }) {
  if (!value) return null
  const text = fmtBar(value)
  const inside = width > 80
  if (inside) return <text x={x+width-8} y={y+height/2+4} fill="white" fontSize={11} fontWeight={700} textAnchor="end">{text}</text>
  return <text x={x+width+6} y={y+height/2+4} fill="#555" fontSize={11} fontWeight={700} textAnchor="start">{text}</text>
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#1A1A1A', borderRadius:10, padding:'10px 16px', fontSize:13 }}>
      <p style={{ color:'#AAA', marginBottom:6, fontWeight:700 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:3 }}>
          <span style={{ color:'#BBB' }}>{p.name}</span>
          <span style={{ color:'white', fontWeight:800 }}>{fmtTip(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const CORES = ['#FF6A22','#FFB899','#9CA3AF']
const CATS  = ['Vendas','Serviços','Locação']

export default function GraficoComparativo({ currentData, previousData, currentLabel, previousLabel, showComparison=true }) {
  if (!currentData) return null

  if (!showComparison || !previousData) {
    const data = CATS.map(cat => ({
      cat,
      val: currentData[cat==='Serviços'?'servicos':cat==='Locação'?'locacao':cat.toLowerCase()] || 0,
    })).sort((a,b) => b.val - a.val)

    return (
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          {CATS.map((cat,i) => (
            <div key={cat} style={{ background:'#F9F9F9', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#333' }}>{cat}</div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ top:4, right:10, left:70, bottom:4 }} barCategoryGap="30%">
            <XAxis type="number" hide/>
            <YAxis type="category" dataKey="cat" tick={{ fontSize:13, fill:'#555', fontWeight:600 }} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Bar dataKey="val" radius={[0,5,5,0]}>
              {data.map((_,i) => <Cell key={i} fill={CORES[i]}/>)}
              <LabelList content={<InsideLabel/>}/>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const chartData = [
    { cat:'Vendas',   curr:currentData.vendas||0,   prev:previousData.vendas||0   },
    { cat:'Serviços', curr:currentData.servicos||0, prev:previousData.servicos||0 },
    { cat:'Locação',  curr:currentData.locacao||0,  prev:previousData.locacao||0  },
  ].sort((a,b) => b.curr - a.curr)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {/* Cards com % variação */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {chartData.map(d => {
          const diff = d.prev > 0 ? ((d.curr - d.prev) / d.prev * 100) : 0
          return (
            <div key={d.cat} style={{ background:'#F9F9F9', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#333', marginBottom:4 }}>{d.cat}</div>
              <span style={{ fontSize:14, fontWeight:900, color:diff>=0?'#16a34a':'#EF4444' }}>
                {diff>=0?'▲':'▼'} {Math.abs(diff).toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Barras horizontais — valores DENTRO das barras */}
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={chartData} layout="vertical" margin={{ top:4, right:10, left:70, bottom:4 }} barCategoryGap="25%" barGap={3}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="cat" tick={{ fontSize:13, fill:'#555', fontWeight:600 }} axisLine={false} tickLine={false}/>
          <Tooltip content={<Tip/>}/>
          <Bar dataKey="curr" name={currentLabel}  fill="#FF6A22" radius={[0,4,4,0]}><LabelList content={<InsideLabel/>}/></Bar>
          <Bar dataKey="prev" name={previousLabel} fill="#FFD4B8" radius={[0,4,4,0]}><LabelList content={<InsideLabel/>}/></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
