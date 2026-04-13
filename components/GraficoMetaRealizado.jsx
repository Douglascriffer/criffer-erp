'use client'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine, Area, ComposedChart
} from 'recharts'

function fmtBRL(v) {
  if (v >= 1_000_000) return `R$${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `R$${(v/1_000).toFixed(0)}K`
  return `R$${v}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl border border-white/10">
      <p className="font-semibold text-white/70 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="font-bold">{fmtBRL(p.value)}</span>
        </div>
      ))}
      {payload.length === 2 && payload[0].value && payload[1].value && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <span className="text-white/60">Atingimento: </span>
          <span className={`font-bold ${(payload[0].value/payload[1].value)*100 >= 100 ? 'text-green-400' : 'text-amber-400'}`}>
            {((payload[0].value / payload[1].value) * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default function GraficoMetaRealizado({ metaData = [], title = 'Meta vs Realizado' }) {
  const chartData = metaData.map(d => ({
    label:     d.label,
    Realizado: d.realizado || null,
    Meta:      d.meta,
  }))

  const hasData = chartData.some(d => d.Realizado && d.Realizado > 0)

  return (
    <div className="w-full">
      {!hasData && (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Sem dados realizados para o período
        </div>
      )}
      {hasData && (
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#A09A94' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmtBRL}
              tick={{ fontSize: 10, fill: '#A09A94' }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, color: '#6B6560', paddingTop: 8 }}
            />
            {/* Meta — dashed gray */}
            <Line
              type="monotone"
              dataKey="Meta"
              stroke="#C0BAB4"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              activeDot={{ r: 4, fill: '#C0BAB4' }}
              connectNulls
            />
            {/* Realizado — solid orange */}
            <Line
              type="monotone"
              dataKey="Realizado"
              stroke="#FF6A22"
              strokeWidth={2.5}
              dot={{ fill: '#FF6A22', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#FF6A22', stroke: '#fff', strokeWidth: 2 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
