'use client'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart2, Package } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  if (v >= 1_000_000) return `R$ ${(v/1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `R$ ${(v/1_000).toFixed(1)}K`
  return `R$ ${Number(v).toFixed(2)}`
}

function KpiCard({ label, value, change, changeLabel, icon: Icon, accent = false, danger = false }) {
  const isPositive = change > 0
  return (
    <div className={`kpi-card card-hover ${accent ? 'border-l-4 border-l-brand' : ''} ${danger ? 'border-l-4 border-l-red-400' : ''}`}>
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? 'bg-brand-50' : 'bg-gray-50'}`}>
          <Icon size={15} className={accent ? 'text-brand' : danger ? 'text-red-500' : 'text-gray-400'} />
        </div>
      </div>
      <p className={`text-2xl font-bold mt-1 tracking-tight ${accent ? 'text-brand' : danger ? 'text-red-500' : 'text-gray-900'}`}
        style={{ fontFamily: 'Syne, sans-serif' }}>
        {value}
      </p>
      {change !== undefined && change !== null && (
        <div className={`flex items-center gap-1 mt-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
          <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
          {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}

export default function KpiCards({ kpis, previousKpis, compLabel = 'vs período ant.' }) {
  if (!kpis) return null
  const pctChange = (curr, prev) => (prev && prev > 0) ? ((curr - prev) / prev) * 100 : undefined

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 animate-fade-in">
      <KpiCard label="Receita Total" value={fmt(kpis.totalFaturamento)}
        change={pctChange(kpis.totalFaturamento, previousKpis?.totalFaturamento)}
        changeLabel={compLabel} icon={DollarSign} accent />
      <KpiCard label="Vendas" value={fmt(kpis.totalVendas)}
        change={pctChange(kpis.totalVendas, previousKpis?.totalVendas)}
        changeLabel={compLabel} icon={TrendingUp} />
      <KpiCard label="Serviços" value={fmt(kpis.totalServicos)}
        change={pctChange(kpis.totalServicos, previousKpis?.totalServicos)}
        changeLabel={compLabel} icon={BarChart2} />
      <KpiCard label="Locação" value={fmt(kpis.totalLocacao)}
        change={pctChange(kpis.totalLocacao, previousKpis?.totalLocacao)}
        changeLabel={compLabel} icon={Package} />
      <KpiCard label="Meta Total" value={fmt(kpis.totalMeta)} icon={Target} />
      <KpiCard label="% Meta Atingida"
        value={kpis.pctAtingido > 0 ? `${kpis.pctAtingido.toFixed(1)}%` : '—'}
        icon={kpis.pctAtingido >= 100 ? TrendingUp : TrendingDown}
        danger={kpis.pctAtingido > 0 && kpis.pctAtingido < 80}
        accent={kpis.pctAtingido >= 100} />
    </div>
  )
}
