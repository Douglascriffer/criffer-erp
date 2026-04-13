'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { Upload, RefreshCw, TrendingUp, Map, BarChart2, DollarSign } from 'lucide-react'

import { useFinancialData, useFilteredData } from '@/lib/hooks'
import { supabase } from '@/lib/supabaseClient'

import KpiCards          from '@/components/KpiCards'
import FiltroPeriodo     from '@/components/FiltroPeriodo'
import GraficoReceitas   from '@/components/GraficoReceitas'
import GraficoComparativo from '@/components/GraficoComparativo'
import UploadExcel       from '@/components/UploadExcel'

const MapaHeatBrasil       = dynamic(() => import('@/components/MapaHeatBrasil'),       { ssr: false, loading: () => <ChartSkeleton h={260} /> })
const GraficoMetaRealizado = dynamic(() => import('@/components/GraficoMetaRealizado'), { ssr: false, loading: () => <ChartSkeleton h={240} /> })

function ChartSkeleton({ h = 200 }) {
  return <div className="animate-pulse bg-gray-100 rounded-xl" style={{ height: h }} />
}

export default function DashboardClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tab          = searchParams.get('tab') || 'desempenho'

  const [user, setUser]             = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [filters, setFilters]       = useState({ ano: '2026', mes: 'all' })
  const [localData, setLocalData]   = useState(null)

  const { data: remoteData, loading, error, refetch } = useFinancialData()
  const data = localData || remoteData

  // Ano anterior para comparação (só mostra se ano = 2026)
  const showComparison = filters.ano === '2026'
  const prevFilters = { ano: String(Number(filters.ano) - 1), mes: filters.mes }

  const filtered     = useFilteredData(data, filters)
  const prevFiltered = useFilteredData(data, prevFilters)

  // KPIs com comparação vs mesmo período ano anterior
  const prevYearFilters = { ano: String(Number(filters.ano) - 1), mes: filters.mes }
  const prevYearFiltered = useFilteredData(data, prevYearFilters)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user && !searchParams.get('demo')) {
        router.push('/login')
      } else {
        setUser(user)
      }
    })
  }, [])

  const TABS = [
    { id: 'desempenho', label: 'Desempenho',  icon: TrendingUp },
    { id: 'mapa',       label: 'Mapa',        icon: Map },
    { id: 'orcamento',  label: 'Orçamento',   icon: BarChart2 },
    { id: 'fluxo',      label: 'Fluxo Caixa', icon: DollarSign },
  ]

  if (loading && !data) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#FF6A22] border-t-transparent animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Carregando dados...</p>
      </div>
    </div>
  )

  const fmtV = v => !v ? 'R$ 0' : v >= 1e6 ? `R$ ${(v/1e6).toFixed(2)}M` : `R$ ${(v/1e3).toFixed(1)}K`

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">

      {/* TOPBAR */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-black tracking-[3px] md:tracking-[4px] text-[#FF6A22]" style={{ fontFamily: 'Syne,sans-serif' }}>
              CRIFFER
            </span>
            <span className="hidden md:block text-sm text-gray-400">ERP Financeiro</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowUpload(u => !u)}
              className="flex items-center gap-1.5 text-xs py-1.5 px-3 border border-gray-200 rounded-lg hover:border-[#FF6A22] hover:text-[#FF6A22] transition-all">
              <Upload size={13} />
              <span className="hidden sm:inline">Upload Excel</span>
            </button>
            <button onClick={refetch}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-[#FF6A22] hover:text-[#FF6A22] transition-all">
              <RefreshCw size={13} />
            </button>
            {user && (
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6A22] text-xs font-bold">
                {(user.email?.[0] || 'U').toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto w-full px-4 md:px-6 py-4 flex-1">

        {showUpload && (
          <div className="mb-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Atualizar base de dados</h3>
              <UploadExcel userId={user?.id} onDataLoaded={(d) => { setLocalData(d); setShowUpload(false) }} />
            </div>
          </div>
        )}

        {/* FILTERS + TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <FiltroPeriodo filters={filters} onChange={setFilters} />
          <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id}
                onClick={() => router.push(`/dashboard?tab=${t.id}`)}
                className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  tab === t.id ? 'bg-white shadow text-[#FF6A22]' : 'text-gray-500 hover:text-gray-700'
                }`}>
                <t.icon size={13} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS - comparação vs mesmo período ano anterior */}
        <div className="mb-4">
          <KpiCards kpis={filtered?.kpis} previousKpis={prevYearFiltered?.kpis} />
        </div>

        {/* ═══════════════════ TAB: DESEMPENHO ═══════════════════ */}
        {tab === 'desempenho' && (
          <div className="space-y-4">
            {/* Gráfico receitas + Comparativo lado a lado */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Receitas mensais - barras agrupadas */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Receitas mensais — {filters.ano}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Vendas · Serviços · Locação (lado a lado)</p>
                  </div>
                </div>
                <GraficoReceitas periodData={filtered?.byPeriod || []} />
              </div>

              {/* Comparativo - só mostra se ano = 2026 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {showComparison ? `Comparativo ${filters.ano} vs ${Number(filters.ano)-1}` : `Distribuição ${filters.ano}`}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {showComparison ? 'Mesmo período — ano a ano' : 'Por categoria'}
                  </p>
                </div>
                <GraficoComparativo
                  showComparison={showComparison}
                  currentData={filtered?.byPeriod?.length > 0 ? {
                    vendas:   filtered.byPeriod.reduce((s,r) => s+r.vendas,   0),
                    servicos: filtered.byPeriod.reduce((s,r) => s+r.servicos, 0),
                    locacao:  filtered.byPeriod.reduce((s,r) => s+r.locacao,  0),
                  } : null}
                  previousData={showComparison && prevFiltered?.byPeriod?.length > 0 ? {
                    vendas:   prevFiltered.byPeriod.reduce((s,r) => s+r.vendas,   0),
                    servicos: prevFiltered.byPeriod.reduce((s,r) => s+r.servicos, 0),
                    locacao:  prevFiltered.byPeriod.reduce((s,r) => s+r.locacao,  0),
                  } : null}
                  currentLabel={filters.ano}
                  previousLabel={String(Number(filters.ano)-1)}
                />
              </div>
            </div>

            {/* Meta vs Realizado + Bloco meta */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Meta vs Realizado — {filters.ano}</h3>
                <GraficoMetaRealizado metaData={data?.meta?.[filters.ano] || []} />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Atingimento — {filters.ano}</h3>
                {(() => {
                  const metaArr = data?.meta?.[filters.ano] || []
                  const totMeta = metaArr.reduce((s,m) => s+m.meta, 0)
                  const totReal = metaArr.reduce((s,m) => s+m.realizado, 0)
                  const pct = totMeta > 0 ? (totReal/totMeta)*100 : 0
                  return (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Realizado</p>
                        <div className="h-10 bg-[#FF6A22] rounded-xl flex items-center px-4">
                          <span className="text-white font-bold">{fmtV(totReal)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Meta anual</p>
                        <div className="h-10 bg-orange-800 rounded-xl flex items-center px-4">
                          <span className="text-white font-bold">{fmtV(totMeta)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-500">Atingimento</span>
                          <span className={`font-bold ${pct >= 100 ? 'text-green-600' : 'text-[#FF6A22]'}`}>
                            {pct > 0 ? `${pct.toFixed(1)}%` : '—'}
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF6A22] rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                          Falta {fmtV(Math.max(totMeta - totReal, 0))} para atingir a meta
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: MAPA ═══════════════════ */}
        {tab === 'mapa' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Mapa principal */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  Faturamento por Estado — {filters.ano}
                  {filters.mes !== 'all' ? ` · Mês ${filters.mes}` : ' · Acumulado'}
                </h3>
                <p className="text-xs text-gray-400 mb-4">Passe o mouse sobre os estados para ver os valores</p>
                <MapaHeatBrasil stateData={filtered?.stateData || []} />
              </div>

              {/* Ranking */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Ranking por estado</h3>
                <div className="space-y-2.5">
                  {(filtered?.stateData || []).slice(0,12).map((s,i) => {
                    const max = filtered?.stateData?.[0]?.faturamento || 1
                    return (
                      <div key={s.estado} className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 w-4">{i+1}</span>
                        <span className="text-xs font-semibold text-gray-700 w-8">{s.estado}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div className="h-full bg-[#FF6A22] rounded-full" style={{ width: `${(s.faturamento/max)*100}%` }} />
                        </div>
                        <span className="text-xs text-gray-600 w-20 text-right font-medium">
                          {s.faturamento >= 1e6 ? `R$ ${(s.faturamento/1e6).toFixed(1)}M` : `R$ ${(s.faturamento/1e3).toFixed(0)}K`}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Top estados summary abaixo do ranking */}
                {showComparison && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-3">Top estados — comparativo {filters.ano} vs {Number(filters.ano)-1}</p>
                    {(filtered?.stateData || []).slice(0,5).map(s => {
                      const prev = (prevFiltered?.stateData || []).find(p => p.estado === s.estado)
                      const diff = prev?.faturamento > 0 ? ((s.faturamento - prev.faturamento) / prev.faturamento * 100) : null
                      return (
                        <div key={s.estado} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                          <span className="text-xs font-medium text-gray-700">{s.estado}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {s.faturamento >= 1e6 ? `R$${(s.faturamento/1e6).toFixed(1)}M` : `R$${(s.faturamento/1e3).toFixed(0)}K`}
                            </span>
                            {diff !== null && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${diff >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mapa comparativo — só para 2026 */}
            {showComparison && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Mapa — {filters.ano}</h3>
                  <MapaHeatBrasil stateData={filtered?.stateData || []} />
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Mapa — {Number(filters.ano)-1}</h3>
                  <MapaHeatBrasil stateData={prevFiltered?.stateData || []} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════ TAB: ORÇAMENTO ═══════════════════ */}
        {tab === 'orcamento' && (
          <div className="space-y-4">
            {/* Gráfico + tabela lado a lado */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Meta vs Realizado — {filters.ano}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                {/* Gráfico */}
                <div>
                  <GraficoMetaRealizado metaData={data?.meta?.[filters.ano] || []} />
                </div>
                {/* Tabela ao lado */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Mês','Meta','Realizado','Δ','% Ating.'].map(h => (
                          <th key={h} className="text-left py-2 px-2 text-gray-400 font-semibold uppercase tracking-wide text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.meta?.[filters.ano] || []).map(m => {
                        const diff = m.realizado - m.meta
                        const pct  = m.meta > 0 ? (m.realizado/m.meta)*100 : 0
                        return (
                          <tr key={m.mes} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2 px-2 font-medium text-gray-700">{m.label}</td>
                            <td className="py-2 px-2 text-gray-500">{fmtV(m.meta)}</td>
                            <td className="py-2 px-2 text-gray-700 font-medium">{m.realizado > 0 ? fmtV(m.realizado) : '—'}</td>
                            <td className={`py-2 px-2 font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                              {m.realizado > 0 ? (diff > 0 ? '+' : '') + fmtV(diff) : '—'}
                            </td>
                            <td className="py-2 px-2">
                              {pct > 0 ? (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${pct >= 100 ? 'bg-green-50 text-green-700' : pct >= 80 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                                  {pct.toFixed(0)}%
                                </span>
                              ) : '—'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════ TAB: FLUXO ═══════════════════ */}
        {tab === 'fluxo' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Entradas brutas', value: filtered?.kpis?.totalFaturamento, color: 'text-[#FF6A22]', bg: 'bg-orange-50' },
                { label: 'Devoluções', value: filtered?.byPeriod?.reduce((s,r) => s+(r.devolucoes||0), 0), color: 'text-red-500', bg: 'bg-red-50' },
                { label: 'Receita líquida', value: (filtered?.kpis?.totalFaturamento||0) - (filtered?.byPeriod?.reduce((s,r) => s+(r.devolucoes||0),0)||0), color: 'text-green-600', bg: 'bg-green-50' },
              ].map(card => (
                <div key={card.label} className={`${card.bg} rounded-2xl border border-gray-100 p-5`}>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.color}`} style={{fontFamily:'Syne,sans-serif'}}>{fmtV(card.value)}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Receita por categoria — {filters.ano}</h3>
              <GraficoReceitas periodData={filtered?.byPeriod || []} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
