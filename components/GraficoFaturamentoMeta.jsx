'use client'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const MES_MAP = {
  'JAN': 'JAN', 'FEB': 'FEV', 'MAR': 'MAR', 'APR': 'ABR', 'MAY': 'MAI', 'JUN': 'JUN',
  'JUL': 'JUL', 'AUG': 'AGO', 'SEP': 'SET', 'OCT': 'OUT', 'NOV': 'NOV', 'DEC': 'DEZ'
}

export default function GraficoFaturamentoMeta({ metaData = [], darkMode = false }) {
  const chartData = (metaData || []).map(d => {
    const rawMonth = (d.label || d.mes || '').toUpperCase().split('/')[0]
    return {
      name: MES_MAP[rawMonth] || rawMonth,
      Faturamento: d.realizado || d.valor || 0,
      Meta: d.meta || 0,
    }
  })

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
          <p style={{ color: '#FF6A22', marginBottom: 12, fontWeight: 700, fontSize: 14 }}>{label}</p>
          {payload.map(p => (
            <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }}/>
                <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 400 }}>{p.name}</span>
              </div>
              <span style={{ fontWeight: 400 }}>{Math.round(p.value).toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 330 }}>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 0, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize:12, fill: darkMode ? '#fff' : '#999', fontWeight: 400 }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', radius: 12 }} />
            <Bar dataKey="Faturamento" barSize={35} fill="#FF6A22" radius={[6, 6, 0, 0]} />
            <Line type="monotone" dataKey="Meta" stroke="#FFFFFF" strokeWidth={3} dot={{ r: 4, fill: '#FFFFFF', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda Manual - Forçada para o fundo */}
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 'auto' }}>
        {[['Faturamento', '#FF6A22'], ['Meta', '#FFFFFF']].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 400, color: darkMode ? '#fff' : '#000', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
