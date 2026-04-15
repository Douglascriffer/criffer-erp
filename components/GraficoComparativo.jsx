'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

function fmtBR(v) {
  if (!v && v !== 0) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

function InsideLabel({ x, y, width, height, value }) {
  if (!value || !width) return null
  const inside = width > 90
  if (inside) return <text x={x+width-10} y={y+height/2+4} fill="white" fontSize={11} fontWeight={700} textAnchor="end">{fmtBR(value)}</text>
  return <text x={x+width+8} y={y+height/2+4} fill="#444" fontSize={11} fontWeight={700} textAnchor="start">{fmtBR(value)}</text>
}

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#111', borderRadius:10, padding:'10px 16px', fontSize:13, border:'1px solid rgba(255,255,255,0.1)' }}>
      <p style={{ color:'#FF6A22', marginBottom:6, fontWeight:800 }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:3 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:p.fill }}/>
            <span style={{ color:'#BBB' }}>{p.name}</span>
          </div>
          <span style={{ color:'white', fontWeight:800 }}>{fmtBR(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const CORES = ['#FF6A22','#FFB899','#9CA3AF']
const CATS  = ['Vendas','Serviços','Locação']

export default function GraficoComparativo({ currentData, previousData, currentLabel, previousLabel, showComparison = true }) {
  if (!currentData) return null

  if (!showComparison || !previousData) {
    const data = CATS.map(cat => ({
      cat,
      val: currentData[cat==='Serviços'?'servicos':cat==='Locação'?'locacao':cat.toLowerCase()] || 0,
    })).sort((a,b) => b.val - a.val)
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top:4, right:16, left:70, bottom:4 }} barCategoryGap="30%">
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="cat" tick={{ fontSize:13, fill:'#555', fontWeight:600 }} axisLine={false} tickLine={false}/>
          <Tooltip content={<Tip/>}/>
          <Bar dataKey="val" radius={[0,5,5,0]}>
            {data.map((_, i) => <Cell key={i} fill={CORES[i]}/>)}
            <LabelList content={<InsideLabel/>}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const chartData = [
    { cat:'Vendas',   curr:currentData.vendas||0,   prev:previousData.vendas||0 },
    { cat:'Serviços', curr:currentData.servicos||0, prev:previousData.servicos||0 },
    { cat:'Locação',  curr:currentData.locacao||0,  prev:previousData.locacao||0 },
  ].sort((a,b) => b.curr - a.curr)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {/* Cards variação — SEM % nos subtítulos, SEM valores brutos */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {chartData.map(d => {
          const diff = d.prev > 0 ? ((d.curr - d.prev) / d.prev * 100) : 0
          const isPos = diff >= 0
          return (
            <div key={d.cat} style={{ background:isPos?'#F0FDF4':'#FEF2F2', borderRadius:10, padding:'10px 8px', textAlign:'center', border:`1px solid ${isPos?'#BBF7D0':'#FECACA'}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#333', marginBottom:4 }}>{d.cat}</div>
              <span style={{ fontSize:16, fontWeight:900, color:isPos?'#16a34a':'#EF4444' }}>
                {isPos?'▲':'▼'} {Math.abs(diff).toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
      {/* Barras horizontais — 2026 laranja forte, 2025 cinza escuro */}
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={chartData} layout="vertical" margin={{ top:4, right:16, left:70, bottom:4 }} barCategoryGap="25%" barGap={3}>
          <XAxis type="number" hide/>
          <YAxis type="category" dataKey="cat" tick={{ fontSize:13, fill:'#555', fontWeight:600 }} axisLine={false} tickLine={false}/>
          <Tooltip content={<Tip/>}/>
          <Bar dataKey="curr" name={currentLabel}  fill="#FF6A22" radius={[0,5,5,0]}><LabelList content={<InsideLabel/>}/></Bar>
          <Bar dataKey="prev" name={previousLabel} fill="#6B7280" radius={[0,5,5,0]}><LabelList content={<InsideLabel/>}/></Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Legenda */}
      <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
        {[[currentLabel,'#FF6A22'],[previousLabel,'#6B7280']].map(([l,c]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#555' }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }}/>{l}
          </div>
        ))}
      </div>
    </div>
  )
}
