'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from 'recharts'

function fmtBRL(v) {
  if (v >= 1_000_000) return `R$${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `R$${(v/1_000).toFixed(0)}K`
  return `R$${v}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + (p.value || 0), 0)
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
      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
        <span className="text-white/60">Total</span>
        <span className="font-bold text-brand-300">{fmtBRL(total)}</span>
      </div>
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
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="20%" barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A09A94' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtBRL} tick={{ fontSize: 10, fill: '#A09A94' }} axisLine={false} tickLine={false} width={52} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6B6560', paddingTop: 8 }} />
        <Bar dataKey="Vendas"   fill="#FF6A22" radius={[4,4,0,0]} />
        <Bar dataKey="Serviços" fill="#FFB899" radius={[4,4,0,0]} />
        <Bar dataKey="Locação"  fill="#8B5CF6" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
