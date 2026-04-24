import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from 'recharts'

function fmtBRL(v) {
  if (v >= 1_000_000) return `R$${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `R$${(v/1_000).toFixed(0)}K`
  return `R$${v}`
}

function CustomTooltip({ active, payload, label, darkMode }) {
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
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }}/>
            <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 800 }}>{fmtBRL(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && (
        <div style={{ borderTop: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', marginTop: 12, paddingTop: 12 }}>
          <span style={{ color: '#FF6A22', fontWeight: 900, fontSize: 15 }}>
            Atingimento: {((payload[0].value / payload[1].value) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default function GraficoMetaRealizado({ metaData = [], darkMode = false }) {
  const chartData = metaData.map(d => ({
    label:     d.label,
    Realizado: d.realizado || 0,
    Meta:      d.meta || 0,
  }))

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: darkMode ? '#666' : '#999', fontWeight: 800 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={fmtBRL}
            tick={{ fontSize: 10, fill: darkMode ? '#666' : '#999', fontWeight: 800 }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontWeight: 800, color: darkMode ? '#888' : '#666', paddingTop: 20 }}
          />
          <Bar
            dataKey="Realizado"
            fill="#FF6A22"
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
          <Line
            type="monotone"
            dataKey="Meta"
            stroke={darkMode ? '#fff' : '#000'}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
