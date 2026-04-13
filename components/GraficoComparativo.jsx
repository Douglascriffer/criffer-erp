'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, Cell
} from 'recharts'

function fmtBRL(v) {
  if (!v && v !== 0) return 'R$ 0'
  if (v >= 1_000_000) return `R$ ${(v/1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `R$ ${(v/1_000).toFixed(1)}K`
  return `R$ ${v.toFixed(0)}`
}
function fmtS(v) {
  if (!v && v !== 0) return '0'
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `${(v/1_000).toFixed(0)}K`
  return `${v}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-4 py-3 shadow-xl border border-white/10 min-w-[180px]">
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
      {payload.length === 2 && payload[0]?.value && payload[1]?.value && (() => {
        const diff = ((payload[0].value - payload[1].value) / payload[1].value * 100)
        return (
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/50 text-[10px]">Variação</span>
            <span className={`font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
            </span>
          </div>
        )
      })()}
    </div>
  )
}

export default function GraficoComparativo({ currentData, previousData, currentLabel, previousLabel, showComparison = true }) {
  if (!currentData) return null

  if (!showComparison || !previousData) {
    const data = [
      { cat: 'Vendas',   valor: currentData.vendas   || 0 },
      { cat: 'Serviços', valor: currentData.servicos || 0 },
      { cat: 'Locação',  valor: currentData.locacao  || 0 },
    ]
    const COLORS = ['#FF6A22','#FFB899','#8B5CF6']
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 11, fill: '#A09A94' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtS} tick={{ fontSize: 10, fill: '#A09A94' }} axisLine={false} tickLine={false} width={48} />
          <Tooltip formatter={(v) => fmtBRL(v)} />
          <Bar dataKey="valor" radius={[6,6,0,0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  const chartData = [
    { cat: 'Vendas',   [currentLabel]: currentData.vendas||0,   [previousLabel]: previousData.vendas||0   },
    { cat: 'Serviços', [currentLabel]: currentData.servicos||0, [previousLabel]: previousData.servicos||0 },
    { cat: 'Locação',  [currentLabel]: currentData.locacao||0,  [previousLabel]: previousData.locacao||0  },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {chartData.map(d => {
          const curr = d[currentLabel] || 0
          const prev = d[previousLabel] || 0
          const diff = prev > 0 ? ((curr - prev) / prev * 100) : 0
          return (
            <div key={d.cat} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">{d.cat}</p>
              <p className="text-xs font-bold text-gray-800 leading-tight">{fmtBRL(curr)}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{fmtBRL(prev)}</p>
              <span className={`inline-block text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-md ${
                diff >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
              }`}>
                {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="25%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
          <XAxis dataKey="cat" tick={{ fontSize: 11, fill: '#A09A94' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmtS} tick={{ fontSize: 10, fill: '#A09A94' }} axisLine={false} tickLine={false} width={52} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6B6560', paddingTop: 4 }} />
          <Bar dataKey={currentLabel}  fill="#FF6A22" radius={[4,4,0,0]} />
          <Bar dataKey={previousLabel} fill="#FFD4B8" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
