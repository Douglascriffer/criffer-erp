'use client'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

// Paleta validada: Vendas=laranja, Serviços=salmão claro, Locação=cinza
const C = { Vendas:'#FF6A22', 'Serviços':'#FFB899', 'Locação':'#9CA3AF' }

function fmtV(v) {
  if (!v || v===0) return ''
  if (v>=1e6) return `${(v/1e6).toFixed(1)}M`
  if (v>=1e3) return `${(v/1e3).toFixed(0)}K`
  return `${Math.round(v)}`
}

// Label proporcional à largura da barra
function ProportionalLabel(props) {
  const { x, y, width, value, fill } = props
  if (!value || value===0 || width<15) return null
  // fontSize proporcional: ~55% da largura, mas entre 9 e 14px
  const fs = Math.max(9, Math.min(14, Math.round(width * 0.52)))
  return (
    <text x={x+width/2} y={y-5} fill={fill} textAnchor="middle"
      fontSize={fs} fontWeight={800} fontFamily="Syne,sans-serif">
      {fmtV(value)}
    </text>
  )
}

function Tooltip_({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#1A1A1A', borderRadius:10, padding:'10px 16px', fontSize:13 }}>
      <p style={{ color:'#AAA', marginBottom:6, fontWeight:700 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:20, marginBottom:3 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:p.fill }}/>
            <span style={{ color:'#BBB' }}>{p.name}</span>
          </div>
          <span style={{ color:'white', fontWeight:800 }}>{fmtV(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function GraficoReceitas({ periodData=[] }) {
  const chartData = periodData.map(d => ({
    label: d.label,
    Vendas:   d.vendas   || 0,
    Serviços: d.servicos || 0,
    Locação:  d.locacao  || 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}
        margin={{ top:30, right:8, left:0, bottom:0 }}
        barCategoryGap="20%" barGap={4}>
        {/* NO CartesianGrid, NO YAxis */}
        <XAxis dataKey="label" tick={{ fontSize:12, fill:'#AAA', fontWeight:600 }} axisLine={false} tickLine={false}/>
        <Tooltip content={<Tooltip_/>} cursor={{ fill:'rgba(0,0,0,0.04)' }}/>
        {/* NO Legend — per requirement */}
        {Object.entries(C).map(([key, color]) => (
          <Bar key={key} dataKey={key} fill={color} radius={[5,5,0,0]}>
            <LabelList content={(p)=><ProportionalLabel {...p} fill={color}/>}/>
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
