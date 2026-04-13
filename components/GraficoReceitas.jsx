'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, LabelList
} from 'recharts'

function fmtBRL(v) {
  if (!v) return 'R$0'
  if (v >= 1_000_000) return `R$${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `R$${(v/1_000).toFixed(0)}K`
  return `R$${v}`
}

function CustomLabel({ x, y, width, value, fill }) {
  if (!value || value === 0) return null
  return (
    <text x={x + width / 2} y={y - 4} fill={fill || '#666'} textAnchor="middle" fontSize={9} fontWeight={600}>
      {fmtBRL(value)}
    </text>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl border border-white/10 min-w-[160px]">
      <p className="font-semibold text-white/70 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />
            <span className="text-white/60">{p.name}</span>
          </div>
          <span className="font-bold">{fmtBRL(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function GraficoReceitas({ periodData = [] }) {
  const chartData = periodData.map(d => ({
    label:    d.label,
    Vendas:   d.vendas,
    Serviços: d.servicos,
    Locação:  d.locacao,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="20%" barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A09A94' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 10, fill: '#A09A94' }} axisLine={false} tickLine={false} width={52} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6B6560', paddingTop: 8 }} />
        <Bar dataKey="Vendas" fill="#FF6A22" radius={[4,4,0,0]}>
          <LabelList content={<CustomLabel fill="#FF6A22" />} />
        </Bar>
        <Bar dataKey="Serviços" fill="#FFB899" radius={[4,4,0,0]}>
          <LabelList content={<CustomLabel fill="#CC7A44" />} />
        </Bar>
        <Bar dataKey="Locação" fill="#8B5CF6" radius={[4,4,0,0]}>
          <LabelList content={<CustomLabel fill="#6D3FCC" />} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
