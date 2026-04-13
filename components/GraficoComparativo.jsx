'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, Cell, LabelList
} from 'recharts'

function fmtBRL(v) {
  if (!v && v !== 0) return 'R$ 0'
  if (v >= 1_000_000) return `R$ ${(v/1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `R$ ${(v/1_000).toFixed(1)}K`
  return `R$ ${v.toFixed(0)}`
}
function fmtN(v) {
  if (!v && v !== 0) return '0'
  if (v >= 1_000_000) return `${(Math.round(v/1000)*1000).toLocaleString('pt-BR')}`
  if (v >= 1_000)     return `${Math.round(v).toLocaleString('pt-BR')}`
  return `${Math.round(v)}`
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

// Horizontal bar label
function HorizLabel({ x, y, width, height, value }) {
  if (!value) return null
  return (
    <text x={x + width + 6} y={y + height / 2 + 4} fill="#374151" fontSize={10} fontWeight={600}>
      {fmtN(value)}
    </text>
  )
}

export default function GraficoComparativo({ currentData, previousData, currentLabel, previousLabel, showComparison = true }) {
  if (!currentData) return null

  if (!showComparison || !previousData) {
    // Gráfico horizontal simples — só ano atual
    const data = [
      { cat: 'Vendas',   valor: currentData.vendas   || 0 },
      { cat: 'Serviços', valor: currentData.servicos || 0 },
      { cat: 'Locação',  valor: currentData.locacao  || 0 },
    ].sort((a,b) => b.valor - a.valor)

    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 80, left: 20, bottom: 4 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="cat" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip formatter={(v) => fmtBRL(v)} />
          <Bar dataKey="valor" radius={[0,4,4,0]}>
            {data.map((_, i) => <Cell key={i} fill={['#FF6A22','#FFB899','#8B5CF6'][i]} />)}
            <LabelList content={<HorizLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  // Gráfico horizontal agrupado — comparativo ano a ano
  const chartData = [
    { cat: 'Vendas',   curr: currentData.vendas||0,   prev: previousData.vendas||0   },
    { cat: 'Serviços', curr: currentData.servicos||0, prev: previousData.servicos||0 },
    { cat: 'Locação',  curr: currentData.locacao||0,  prev: previousData.locacao||0  },
  ].sort((a,b) => b.curr - a.curr)

  const withDiff = chartData.map(d => ({
    ...d,
    diff: d.prev > 0 ? ((d.curr - d.prev) / d.prev * 100) : 0
  }))

  return (
    <div className="space-y-2">
      {/* Mini resumo variações */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        {withDiff.map(d => (
          <div key={d.cat} className="text-center bg-gray-50 rounded-lg p-2">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{d.cat}</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{fmtBRL(d.curr)}</p>
            <span className={`text-[10px] font-bold ${d.diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {d.diff >= 0 ? '▲' : '▼'} {Math.abs(d.diff).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Gráfico horizontal agrupado */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical"
          margin={{ top: 4, right: 100, left: 20, bottom: 4 }}
          barCategoryGap="25%" barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="cat" tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#6B6560' }} />
          <Bar dataKey="curr" name={currentLabel}  fill="#FF6A22" radius={[0,3,3,0]}>
            <LabelList content={<HorizLabel />} />
          </Bar>
          <Bar dataKey="prev" name={previousLabel} fill="#FFD4B8" radius={[0,3,3,0]}>
            <LabelList content={<HorizLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
