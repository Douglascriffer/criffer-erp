'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
const C = { Vendas:'#FF6A22', 'Serviços':'#888888', 'Locação':'#A84410' }
function TooltipC({ active, payload, label, darkMode }) {
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
      <p style={{ color: '#FF6A22', marginBottom: 12, fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.fill }}/>
            <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 500 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 500 }}>{Math.round(p.value).toLocaleString('pt-BR')}</span>
        </div>
      ))}
    </div>
  )
}

export default function GraficoReceitas({ periodData = [], darkMode = false, horizontal = false }) {
  const chartData = periodData.map(d => ({
    label: d.label.toUpperCase(),
    Vendas:   d.vendas   || 0,
    Serviços: d.servicos || 0,
    Locação:  d.locacao  || 0,
  }))

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={horizontal ? chartData.length * 80 + 60 : 180}>
        <BarChart 
          data={chartData} 
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={horizontal} horizontal={!horizontal} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
          {horizontal ? (
            <>
              <XAxis type="number" hide />
              <YAxis dataKey="label" type="category" tick={{ fontSize:10, fill: darkMode ? '#fff' : '#999', fontWeight: 500 }} axisLine={false} tickLine={false} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={{ fontSize:10, fill: darkMode ? '#fff' : '#999', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis hide />
            </>
          )}
          <Tooltip 
            content={<TooltipC darkMode={darkMode}/>} 
            cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', radius: 12 }}
          />
          {Object.entries(C).map(([key, color]) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={color} 
              radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
              barSize={horizontal ? 12 : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda na Base */}
      <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:12, flexWrap: 'wrap' }}>
        {Object.entries(C).map(([k, c]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight: 500, color: darkMode ? '#fff' : '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <div style={{ width:10, height:10, borderRadius: '50%', background:c }}/>
            {k}
          </div>
        ))}
      </div>
    </div>
  )
}

