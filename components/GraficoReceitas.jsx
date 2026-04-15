'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const C = { Vendas:'#FF6A22', 'Serviços':'#FFB899', 'Locação':'#9CA3AF' }

function TooltipC({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#111', borderRadius:10, padding:'10px 16px', fontSize:13, border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 8px 32px rgba(0,0,0,.4)' }}>
      <p style={{ color:'#FF6A22', marginBottom:8, fontWeight:800, letterSpacing:1 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:20, marginBottom:4 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:p.fill }}/>
            <span style={{ color:'#AAA' }}>{p.name}</span>
          </div>
          <span style={{ color:'white', fontWeight:800 }}>{Math.round(p.value).toLocaleString('pt-BR')}</span>
        </div>
      ))}
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:8, paddingTop:8 }}>
        <span style={{ color:'#FF6A22', fontWeight:800 }}>Total: {Math.round(payload.reduce((s,p)=>s+p.value,0)).toLocaleString('pt-BR')}</span>
      </div>
    </div>
  )
}

/* Bar personalizada com animação hover */
function AnimatedBar(props) {
  const { x, y, width, height, fill, isHovered } = props
  return (
    <rect
      x={x} y={y}
      width={width}
      height={isHovered ? height + 4 : height}
      fill={fill}
      rx={5} ry={5}
      style={{
        filter: isHovered ? `drop-shadow(0 0 8px ${fill})` : 'none',
        transition: 'all 0.2s ease',
        transform: isHovered ? `translateY(-4px)` : 'none',
        transformOrigin: 'bottom',
      }}
    />
  )
}

export default function GraficoReceitas({ periodData = [] }) {
  const [hoveredBar, setHoveredBar] = useState(null)

  const chartData = periodData.map(d => ({
    label: d.label,
    Vendas:   d.vendas   || 0,
    Serviços: d.servicos || 0,
    Locação:  d.locacao  || 0,
  }))

  return (
    <div>
      {/* Legenda */}
      <div style={{ display:'flex', gap:16, justifyContent:'center', marginBottom:12 }}>
        {Object.entries(C).map(([k, c]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#555' }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }}/>
            {k}
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top:10, right:8, left:0, bottom:0 }}
          barCategoryGap="20%" barGap={3}
          onMouseLeave={() => setHoveredBar(null)}>
          <XAxis dataKey="label" tick={{ fontSize:12, fill:'#AAA', fontWeight:600 }} axisLine={false} tickLine={false}/>
          {/* Tooltip ONLY on hover — sem labels visíveis nas barras */}
          <Tooltip content={<TooltipC/>} cursor={{ fill:'rgba(255,106,34,0.05)', radius:8 }}/>
          {Object.entries(C).map(([key, color]) => (
            <Bar key={key} dataKey={key} fill={color} radius={[5,5,0,0]}
              onMouseEnter={(_, idx) => setHoveredBar(`${key}-${idx}`)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
