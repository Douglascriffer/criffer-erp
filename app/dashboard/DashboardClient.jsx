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
import MapaRegional      from '@/components/MapaRegional'

const MapaHeatBrasil       = dynamic(() => import('@/components/MapaHeatBrasil'),       { ssr: false, loading: () => <ChartSkeleton h={280} /> })
const GraficoMetaRealizado = dynamic(() => import('@/components/GraficoMetaRealizado'), { ssr: false, loading: () => <ChartSkeleton h={240} /> })

function ChartSkeleton({ h = 200 }) {
  return <div className="animate-pulse bg-gray-100 rounded-xl" style={{ height: h }} />
}

const MES_NOMES = {
  '1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun',
  '7':'Jul','8':'Ago','9':'Set','10':'Out','11':'Nov','12':'Dez'
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

  const showComparison = filters.ano === '2026'
  const prevYearFilters = { ano: String(Number(filters.ano) - 1), mes: filters.mes }

  const filtered         = useFilteredData(data, filters)
  const prevYearFiltered = useFilteredData(data, prevYearFilters)

  // Label dinâmico para comparação KPIs
  const compLabel = useMemo(() => {
    if (filters.mes === 'all') return `vs ${Number(filters.ano)-1}`
    const mesNome = MES_NOMES[filters.mes] || filters.mes
    return `vs ${mesNome}/${Number(filters.ano)-1}`
  }, [filters])

  // Label do período atual para o mapa
  const periodoLabel = useMemo(() => {
    if (filters.mes === 'all') return filters.ano
    const mesNome = MES_NOMES[filters.mes] || filters.mes
    return `${mesNome}/${filters.ano}`
  }, [filters])

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

  const totalFat = filtered?.kpis?.totalFaturamento || 0
  const fmtTotal = totalFat >= 1e6 ? `${(totalFat/1e6).toFixed(2)}M` : `${(totalFat/1e3).toFixed(1)}K`

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

        {/* ═══ TAB: DESEMPENHO ═══ */}
        {tab === 'desempenho' && (
          <div className="space-y-4">
            {/* KPI CARDS — comparação vs mesmo período ano anterior */}
            <KpiCards kpis={filtered?.kpis} previousKpis={prevYearFiltered?.kpis} compLabel={compLabel} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-800">Receitas mensais — {filters.ano}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Vendas · Serviços · Locação (lado a lado) — valores sobre as colunas</p>
                </div>
                <GraficoReceitas periodData={filtered?.byPeriod || []} />
              </div>

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
                  previousData={showComparison && prevYearFiltered?.byPeriod?.length > 0 ? {
                    vendas:   prevYearFiltered.byPeriod.reduce((s,r) => s+r.vendas,   0),
                    servicos: prevYearFiltered.byPeriod.reduce((s,r) => s+r.servicos, 0),
                    locacao:  prevYearFiltered.byPeriod.reduce((s,r) => s+r.locacao,  0),
                  } : null}
                  currentLabel={filters.ano}
                  previousLabel={String(Number(filters.ano)-1)}
                />
              </div>
            </div>

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
                      <div><p className="text-xs text-gray-400 mb-1">Realizado</p>
                        <div className="h-10 bg-[#FF6A22] rounded-xl flex items-center px-4"><span className="text-white font-bold">{fmtV(totReal)}</span></div>
                      </div>
                      <div><p className="text-xs text-gray-400 mb-1">Meta anual</p>
                        <div className="h-10 bg-orange-800 rounded-xl flex items-center px-4"><span className="text-white font-bold">{fmtV(totMeta)}</span></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-500">Atingimento</span>
                          <span className={`font-bold ${pct >= 100 ? 'text-green-600' : 'text-[#FF6A22]'}`}>{pct > 0 ? `${pct.toFixed(1)}%` : '—'}</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF6A22] rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5 text-center">Falta {fmtV(Math.max(totMeta - totReal, 0))} para atingir a meta</p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: MAPA ═══ */}
        {tab === 'mapa' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

              {/* Mapa principal — sem KPI cards aqui */}
              <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Faturamento por Estado — {periodoLabel}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Passe o mouse sobre os estados para ver os valores</p>
                </div>
                <MapaHeatBrasil stateData={filtered?.stateData || []} />
              </div>

              {/* Ranking por região */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  Ranking por Região — Fat. {fmtTotal}
                </h3>
                <p className="text-xs text-gray-400 mb-4">{periodoLabel}</p>
                <MapaRegional
                  stateData={filtered?.stateData || []}
                  compareData={showComparison ? prevYearFiltered?.stateData : null}
                  compareLabel={String(Number(filters.ano)-1)}
                />
              </div>
            </div>

            {/* Mapas comparativos lado a lado — só 2026 */}
            {showComparison && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Mapa — {periodoLabel}</h3>
                  <p className="text-xs text-gray-400 mb-3">Passe o mouse para ver valores por estado</p>
                  <MapaHeatBrasil stateData={filtered?.stateData || []} />
                  {/* Top estados abaixo do mapa */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Top estados</p>
                    <div className="space-y-1.5">
                      {(filtered?.stateData || []).slice(0,5).map((s,i) => (
                        <div key={s.estado} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-3">{i+1}</span>
                          <span className="text-xs font-semibold text-gray-700 w-7">{s.estado}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-full bg-[#FF6A22] rounded-full" style={{ width: `${(s.faturamento/(filtered?.stateData?.[0]?.faturamento||1))*100}%` }} />
                          </div>
                          <span className="text-xs text-gray-600 w-16 text-right font-medium">
                            {s.faturamento >= 1e6 ? `R$${(s.faturamento/1e6).toFixed(1)}M` : `R$${(s.faturamento/1e3).toFixed(0)}K`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Mapa — {filters.mes === 'all' ? Number(filters.ano)-1 : `${MES_NOMES[filters.mes]}/${Number(filters.ano)-1}`}</h3>
                  <p className="text-xs text-gray-400 mb-3">Passe o mouse para ver valores por estado</p>
                  <MapaHeatBrasil stateData={prevYearFiltered?.stateData || []} />
                  {/* Top estados abaixo do mapa */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Top estados</p>
                    <div className="space-y-1.5">
                      {(prevYearFiltered?.stateData || []).slice(0,5).map((s,i) => (
                        <div key={s.estado} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-3">{i+1}</span>
                          <span className="text-xs font-semibold text-gray-700 w-7">{s.estado}</span>
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-full bg-[#FFB899] rounded-full" style={{ width: `${(s.faturamento/(prevYearFiltered?.stateData?.[0]?.faturamento||1))*100}%` }} />
                          </div>
                          <span className="text-xs text-gray-600 w-16 text-right font-medium">
                            {s.faturamento >= 1e6 ? `R$${(s.faturamento/1e6).toFixed(1)}M` : `R$${(s.faturamento/1e3).toFixed(0)}K`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: ORÇAMENTO ═══ */}
        {tab === 'orcamento' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Meta vs Realizado — {filters.ano}</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                <GraficoMetaRealizado metaData={data?.meta?.[filters.ano] || []} />
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Mês','Meta','Realizado','Δ','%'].map(h => (
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

        {/* ═══ TAB: FLUXO ═══ */}
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
                  <p className={`text-2xl font-bold ${card.color}`}>{fmtV(card.value)}</p>
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
