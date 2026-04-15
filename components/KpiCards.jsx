'use client'
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart2, Package } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `${(v/1_000).toFixed(1)}K`
  return Number(v).toFixed(0)
}

function KpiCard({ label, value, change, changeLabel, icon: Icon, accent = false, danger = false }) {
  const isPositive = change > 0
  return (
    <div style={{
      background: accent ? '#FFF3EE' : 'white',
      borderRadius: 14,
      padding: '16px 18px',
      border: `0.5px solid ${accent ? '#FFD4B8' : '#F0EDE8'}`,
      borderLeft: accent ? '4px solid #FF6A22' : danger ? '4px solid #EF4444' : '4px solid transparent',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</p>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: accent ? '#FFE4D6' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={accent ? '#FF6A22' : danger ? '#EF4444' : '#AAA'} />
        </div>
      </div>
      <p style={{ fontSize: 24, fontWeight: 800, color: accent ? '#FF6A22' : danger ? '#EF4444' : '#1A1A1A', fontFamily: 'Syne, sans-serif', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </p>
      {change !== undefined && change !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isPositive ? <TrendingUp size={12} color="#16a34a" /> : <TrendingDown size={12} color="#EF4444" />}
          <span style={{ fontSize: 12, fontWeight: 700, color: isPositive ? '#16a34a' : '#EF4444' }}>{Math.abs(change).toFixed(1)}%</span>
          {changeLabel && <span style={{ fontSize: 11, color: '#CCC' }}>{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}

export default function KpiCards({ kpis, previousKpis, compLabel = 'vs período ant.', hideForOrcamento = false }) {
  if (!kpis || hideForOrcamento) return null
  const pct = (curr, prev) => (prev && prev > 0) ? ((curr - prev) / prev) * 100 : undefined

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10, marginBottom: 16 }}>
      <KpiCard label="Receita Total" value={fmt(kpis.totalFaturamento)} change={pct(kpis.totalFaturamento, previousKpis?.totalFaturamento)} changeLabel={compLabel} icon={DollarSign} accent />
      <KpiCard label="Vendas" value={fmt(kpis.totalVendas)} change={pct(kpis.totalVendas, previousKpis?.totalVendas)} changeLabel={compLabel} icon={TrendingUp} />
      <KpiCard label="Serviços" value={fmt(kpis.totalServicos)} change={pct(kpis.totalServicos, previousKpis?.totalServicos)} changeLabel={compLabel} icon={BarChart2} />
      <KpiCard label="Locação" value={fmt(kpis.totalLocacao)} change={pct(kpis.totalLocacao, previousKpis?.totalLocacao)} changeLabel={compLabel} icon={Package} />
      <KpiCard label="Meta" value={fmt(kpis.totalMeta)} icon={Target} />
      <KpiCard label="% Meta" value={kpis.pctAtingido > 0 ? `${kpis.pctAtingido.toFixed(1)}%` : '—'} icon={kpis.pctAtingido >= 100 ? TrendingUp : TrendingDown} danger={kpis.pctAtingido > 0 && kpis.pctAtingido < 80} accent={kpis.pctAtingido >= 100} />
    </div>
  )
}
