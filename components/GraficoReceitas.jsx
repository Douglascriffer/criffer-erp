'use client'
import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const C = { Vendas:'#FF6A22', 'Serviços':'#3b82f6', 'Locação':'#8b5cf6' }

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
            <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 800 }}>R$ {Math.round(p.value).toLocaleString('pt-BR')}</span>
        </div>
      ))}
      <div style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', marginTop: 12, paddingTop: 12 }}>
        <span style={{ color: '#FF6A22', fontWeight: 900, fontSize: 15 }}>Total: R$ {Math.round(payload.reduce((s,p)=>s+p.value,0)).toLocaleString('pt-BR')}</span>
      </div>
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
      {/* Legenda */}
      <div style={{ display:'flex', gap:24, justifyContent:'center', marginBottom:24 }}>
        {Object.entries(C).map(([k, c]) => (
          <div key={k} style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, fontWeight: 800, color: darkMode ? '#888' : '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <div style={{ width:12, height:12, borderRadius: '50%', background:c }}/>
            {k}
          </div>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={horizontal ? chartData.length * 50 + 60 : 350}>
        <BarChart 
          data={chartData} 
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={horizontal} horizontal={!horizontal} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
          {horizontal ? (
            <>
              <XAxis type="number" hide />
              <YAxis dataKey="label" type="category" tick={{ fontSize:11, fill: darkMode ? '#666' : '#999', fontWeight: 800 }} axisLine={false} tickLine={false} width={80} />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={{ fontSize:11, fill: darkMode ? '#666' : '#999', fontWeight: 800 }} axisLine={false} tickLine={false} />
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
              stackId="a" 
              fill={color} 
              radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} 
              barSize={horizontal ? 20 : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

