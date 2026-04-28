'use client'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function GraficoFaturamentoMeta({ metaData = [], darkMode = false }) {
  const chartData = metaData.map(d => ({
    name: d.label.toUpperCase(),
    'Faturamento': d.realizado || 0,
    'Meta': d.meta || 0,
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
          <p style={{ color: '#FF6A22', marginBottom: 12, fontWeight: 900, fontSize: 14 }}>{label}</p>
          {payload.map(p => (
            <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }}/>
                <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>{p.name}</span>
              </div>
              <span style={{ fontWeight: 800 }}>{Math.round(p.value).toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:12, fill: darkMode ? '#fff' : '#999', fontWeight: 500 }} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', radius: 12 }} />
          <Legend wrapperStyle={{ fontSize: 13, fontWeight: 500, paddingTop: 20 }} />
          <Bar dataKey="Faturamento" barSize={40} fill={darkMode ? '#ffffff' : '#333333'} radius={[6, 6, 0, 0]} />
          <Line type="monotone" dataKey="Meta" stroke="#FF6A22" strokeWidth={4} dot={{ r: 6, strokeWidth: 2 }} activeDot={{ r: 9 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
