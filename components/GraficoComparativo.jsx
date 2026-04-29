'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'

function fmtBR(v) {
  if (!v && v !== 0) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

function InsideLabel({ x, y, width, height, value, darkMode }) {
  if (!value || !width) return null
  const inside = width > 90
  return (
    <text 
      x={inside ? x + width - 10 : x + width + 8} 
      y={y + height / 2 + 4} 
      fill={darkMode ? "#fff" : "#000"} 
      fontSize={13} 
      fontWeight={400} 
      textAnchor={inside ? "end" : "start"}
    >
      {fmtBR(value)}
    </text>
  )
}

function Tip({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ 
      background: darkMode ? '#1a1a1a' : '#ffffff', 
      borderRadius: 16, 
      padding: '16px', 
      fontSize: 13, 
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 8px 32px rgba(0,0,0,.15)',
      color: darkMode ? '#fff' : '#000'
    }}>
      <p style={{ color: '#FF6A22', marginBottom: 12, fontWeight: 900, textTransform: 'uppercase' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.fill }}/>
            <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 400 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 400 }}>{fmtBR(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const CORES = ['#FF6A22', '#3b82f6', '#8b5cf6']
const CATS  = ['Vendas', 'Serviços', 'Locação']

export default function GraficoComparativo({ currentData, previousData, currentLabel = '2026', previousLabel = '2025', showComparison = true, darkMode = false }) {
  if (!currentData) return null

  if (!showComparison || !previousData) {
    const data = CATS.map(cat => ({
      cat,
      val: currentData[cat==='Serviços'?'servicos':cat==='Locação'?'locacao':cat.toLowerCase()] || 0,
    })).sort((a,b) => b.val - a.val)
    
    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, left: 20, bottom: 10 }} barCategoryGap="35%">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="cat" tick={{ fontSize: 11, fill: darkMode ? '#888' : '#666', fontWeight: 800 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<Tip darkMode={darkMode}/>} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="val" radius={[0, 8, 8, 0]}>
            {data.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
            <LabelList content={<InsideLabel darkMode={darkMode} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const chartData = [
    { cat: 'Vendas',   curr: currentData.vendas || 0,   prev: previousData.vendas || 0 },
    { cat: 'Serviços', curr: currentData.servicos || 0, prev: previousData.servicos || 0 },
    { cat: 'Locação',  curr: currentData.locacao || 0,  prev: previousData.locacao || 0 },
  ].sort((a, b) => b.curr - a.curr)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 330 }}>
      {/* Container Superior: Gráfico + Cards de Variação */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', height: 280 }}>
        {/* Coluna da Esquerda: Gráfico */}
        <div style={{ flex: 1.8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 60, left: 20, bottom: 0 }} barCategoryGap="20%" barGap={4}>
              <XAxis type="number" hide />
              <YAxis dataKey="cat" type="category" tick={{ fontSize: 14, fill: darkMode ? '#fff' : '#000', fontWeight: 400 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<Tip darkMode={darkMode}/>} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="curr" name={currentLabel}  fill="#FF6A22" radius={[0, 6, 6, 0]}>
                <LabelList content={<InsideLabel darkMode={darkMode} />} />
              </Bar>
              <Bar dataKey="prev" name={previousLabel} fill={darkMode ? '#444' : '#e5e7eb'} radius={[0, 6, 6, 0]}>
                <LabelList content={<InsideLabel darkMode={darkMode} />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Coluna da Direita: Cards de Variação Empilhados */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
          {chartData.map(d => {
            const diff = d.prev > 0 ? ((d.curr - d.prev) / d.prev * 100) : 0
            const isPos = diff >= 0
            return (
              <div key={d.cat} style={{ 
                background: isPos ? '#22c55e05' : '#ef444405', 
                borderRadius: 16, 
                padding: '12px 8px', 
                textAlign: 'center', 
                border: `1.5px solid ${isPos ? '#22c55e20' : '#ef444420'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1
              }}>
                <div style={{ fontSize: 12, fontWeight: 400, color: darkMode ? '#aaa' : '#666', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{d.cat}</div>
                <div style={{ fontSize: 20, fontWeight: 400, color: isPos ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {isPos ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legenda na base de todo o card - Forçada para o fundo */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 'auto' }}>
        {[[currentLabel, '#FF6A22'], [previousLabel, darkMode ? '#444' : '#e5e7eb']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 400, color: darkMode ? '#fff' : '#000', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

