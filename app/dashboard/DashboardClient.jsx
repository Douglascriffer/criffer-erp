'use client'
import { useState, useEffect, useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { Upload, RefreshCw, TrendingUp, Map, BarChart2, DollarSign, Home } from 'lucide-react'

import { useFinancialData, useFilteredData } from '@/lib/hooks'

import KpiCards          from '@/components/KpiCards'
import FiltroPeriodo     from '@/components/FiltroPeriodo'
import GraficoReceitas   from '@/components/GraficoReceitas'
import GraficoComparativo from '@/components/GraficoComparativo'
import UploadExcel       from '@/components/UploadExcel'
import MapaRegional      from '@/components/MapaRegional'
import OrcamentoView     from '@/components/OrcamentoView'

const MapaHeatBrasil       = dynamic(() => import('@/components/MapaHeatBrasil'),       { ssr: false, loading: () => <ChartSkeleton h={280} /> })
const GraficoMetaRealizado = dynamic(() => import('@/components/GraficoMetaRealizado'), { ssr: false, loading: () => <ChartSkeleton h={240} /> })

function ChartSkeleton({ h = 200 }) {
  return <div style={{ height: h, background: '#F5F5F5', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />
}

const MES_NOMES = { '1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun','7':'Jul','8':'Ago','9':'Set','10':'Out','11':'Nov','12':'Dez' }

export default function DashboardClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tab          = searchParams.get('tab') || 'desempenho'

  const [user, setUser]             = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [filters, setFilters]       = useState({ ano: '2026', mes: 'all' })
  const [localData, setLocalData]   = useState(null)
  const [darkMode, setDarkMode]     = useState(false)

  const { data: remoteData, loading, error, refetch } = useFinancialData()
  const data = localData || remoteData

  const showComparison = filters.ano === '2026'
  const prevYearFilters = { ano: String(Number(filters.ano) - 1), mes: filters.mes }
  const filtered         = useFilteredData(data, filters)
  const prevYearFiltered = useFilteredData(data, prevYearFilters)

  const compLabel = useMemo(() => {
    if (filters.mes === 'all') return `vs ${Number(filters.ano)-1}`
    const m = MES_NOMES[filters.mes] || filters.mes
    return `vs ${m}/${Number(filters.ano)-1}`
  }, [filters])

  const periodoLabel = useMemo(() => {
    if (filters.mes === 'all') return filters.ano
    return `${MES_NOMES[filters.mes]}/${filters.ano}`
  }, [filters])

  const prevPeriodoLabel = useMemo(() => {
    if (filters.mes === 'all') return String(Number(filters.ano)-1)
    return `${MES_NOMES[filters.mes]}/${Number(filters.ano)-1}`
  }, [filters])

  const totalFat = filtered?.kpis?.totalFaturamento || 0
  const fmtTotal = totalFat >= 1e6 ? `${(totalFat/1e6).toFixed(2)}M` : `${(totalFat/1e3).toFixed(0)}K`

  useEffect(() => {
    const auth = typeof window !== 'undefined' ? localStorage.getItem('criffer_auth') : null
    const nome = typeof window !== 'undefined' ? localStorage.getItem('criffer_user') : ''
    if (!auth) router.push('/login')
    else setUser(nome || '')
  }, [])

  const TABS = [
    { id: 'desempenho', label: 'Faturamento',  icon: TrendingUp },
    { id: 'mapa',       label: 'Mapa',        icon: Map },
    { id: 'orcamento',  label: 'Orçamento',   icon: BarChart2 },
    { id: 'fluxo',      label: 'Fluxo Caixa', icon: DollarSign },
  ]

  const bg = darkMode ? '#111' : '#F8F9FA'
  const cardBg = darkMode ? '#1A1A1A' : 'white'
  const cardBorder = darkMode ? '#2A2A2A' : '#F0EDE8'
  const textPrimary = darkMode ? '#EEE' : '#1A1A1A'
  const textSecondary = darkMode ? '#888' : '#999'

  if (loading && !data) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #FFB899', borderTopColor: '#FF6A22', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: textSecondary, fontSize: 14 }}>Carregando dados...</p>
      </div>
    </div>
  )

  const fmtV = v => !v ? '0' : v >= 1e6 ? `R$ ${(v/1e6).toFixed(2)}M` : `R$ ${(v/1e3).toFixed(1)}K`

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* TOPBAR */}
      <header style={{ background: cardBg, borderBottom: `0.5px solid ${cardBorder}`, position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.push('/capa')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Home size={18} color="#FF6A22" />
            </button>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#FF6A22', letterSpacing: 4, fontFamily: 'Syne,sans-serif' }}>CRIFFER</span>
            <span style={{ fontSize: 12, color: textSecondary, display: 'none' }} className="md-show">ERP Financeiro</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Tema */}
            <button onClick={() => setDarkMode(d => !d)} style={{
              padding: '4px 12px', borderRadius: 20, border: `0.5px solid ${cardBorder}`,
              background: darkMode ? '#FF6A22' : cardBg, color: darkMode ? 'white' : textSecondary,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>{darkMode ? '☀ Claro' : '◑ Escuro'}</button>
            <button onClick={() => setShowUpload(u => !u)} style={{
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 12px',
              border: `0.5px solid ${cardBorder}`, borderRadius: 8, background: 'transparent',
              color: textSecondary, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Upload size={13} /> Upload Excel
            </button>
            <button onClick={refetch} style={{ width: 32, height: 32, borderRadius: 8, border: `0.5px solid ${cardBorder}`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RefreshCw size={13} color={textSecondary} />
            </button>
            {user && (
              <button onClick={() => { localStorage.clear(); router.push('/login') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: textSecondary, fontFamily: 'inherit' }}>
                {user.split(' ')[0]} · Sair
              </button>
            )}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '20px 24px', flex: 1 }}>

        {showUpload && (
          <div style={{ marginBottom: 16, background: cardBg, border: `0.5px solid ${cardBorder}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: textPrimary }}>Atualizar base de dados</h3>
            <UploadExcel onDataLoaded={(d) => { setLocalData(d); setShowUpload(false) }} />
          </div>
        )}

        {/* FILTERS + TABS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <FiltroPeriodo filters={filters} onChange={setFilters} />
          <div style={{ display: 'flex', background: darkMode ? '#222' : '#F0F0F0', borderRadius: 10, padding: 3, gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => router.push(`/dashboard?tab=${t.id}`)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
                background: tab === t.id ? cardBg : 'transparent',
                color: tab === t.id ? '#FF6A22' : textSecondary,
                boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
              }}>
                <t.icon size={13} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ marginBottom: 16 }}>
          <KpiCards kpis={filtered?.kpis} previousKpis={prevYearFiltered?.kpis} compLabel={compLabel} />
        </div>

        {/* ═══ FATURAMENTO ═══ */}
        {tab === 'desempenho' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0 }}>Receitas mensais — {filters.ano}</h3>
                </div>
                <GraficoReceitas periodData={filtered?.byPeriod || []} darkMode={darkMode} />
              </div>
              <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0 }}>
                    {showComparison ? `Comparativo ${filters.ano} vs ${Number(filters.ano)-1}` : `Distribuição ${filters.ano}`}
                  </h3>
                </div>
                <GraficoComparativo
                  showComparison={showComparison}
                  currentData={filtered?.byPeriod?.length > 0 ? {
                    vendas:   filtered.byPeriod.reduce((s,r) => s+r.vendas, 0),
                    servicos: filtered.byPeriod.reduce((s,r) => s+r.servicos, 0),
                    locacao:  filtered.byPeriod.reduce((s,r) => s+r.locacao, 0),
                  } : null}
                  previousData={showComparison && prevYearFiltered?.byPeriod?.length > 0 ? {
                    vendas:   prevYearFiltered.byPeriod.reduce((s,r) => s+r.vendas, 0),
                    servicos: prevYearFiltered.byPeriod.reduce((s,r) => s+r.servicos, 0),
                    locacao:  prevYearFiltered.byPeriod.reduce((s,r) => s+r.locacao, 0),
                  } : null}
                  currentLabel={filters.ano}
                  previousLabel={String(Number(filters.ano)-1)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0 }}>Meta vs Realizado — {filters.ano}</h3>
                </div>
                <GraficoMetaRealizado metaData={data?.meta?.[filters.ano] || []} />
              </div>
              <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: textPrimary, margin: 0 }}>Meta — {filters.ano}</h3>
                </div>
                {(() => {
                  const metaArr = data?.meta?.[filters.ano] || []
                  const totMeta = metaArr.reduce((s,m) => s+m.meta, 0)
                  const totReal = metaArr.reduce((s,m) => s+m.realizado, 0)
                  const pct = totMeta > 0 ? (totReal/totMeta)*100 : 0
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <p style={{ fontSize: 11, color: textSecondary, marginBottom: 4 }}>Realizado</p>
                        <div style={{ height: 40, background: '#FF6A22', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                          <span style={{ color: 'white', fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>{fmtV(totReal)}</span>
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: textSecondary, marginBottom: 4 }}>Meta anual</p>
                        <div style={{ height: 40, background: '#7C2D12', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                          <span style={{ color: 'white', fontWeight: 700, fontFamily: 'Syne,sans-serif' }}>{fmtV(totMeta)}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: textSecondary }}>Atingimento</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 100 ? '#16a34a' : '#FF6A22' }}>{pct > 0 ? `${pct.toFixed(1)}%` : '—'}</span>
                        </div>
                        <div style={{ height: 8, background: darkMode ? '#333' : '#F0EDE8', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#FF6A22', borderRadius: 4, width: `${Math.min(pct, 100)}%`, transition: 'width 0.7s ease' }} />
                        </div>
                        <p style={{ fontSize: 10, color: textSecondary, marginTop: 6, textAlign: 'center' }}>Falta {fmtV(Math.max(totMeta - totReal, 0))} para a meta</p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Nav icons bottom */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '12px 0', borderTop: `0.5px solid ${cardBorder}`, marginTop: 8 }}>
              {[
                { id: 'home', label: 'Início', icon: Home, href: '/capa' },
                { id: 'desempenho', label: 'Faturamento', icon: TrendingUp, href: '/dashboard?tab=desempenho' },
                { id: 'orcamento', label: 'Orçamento', icon: BarChart2, href: '/dashboard?tab=orcamento' },
                { id: 'fluxo', label: 'Fluxo Caixa', icon: DollarSign, href: '/dashboard?tab=fluxo' },
              ].map(n => (
                <button key={n.id} onClick={() => n.href.startsWith('/capa') ? router.push('/capa') : router.push(n.href)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 16px', border: 'none', background: tab === n.id ? '#FFF3EE' : 'transparent', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <n.icon size={16} color={tab === n.id ? '#FF6A22' : textSecondary} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: tab === n.id ? '#FF6A22' : textSecondary }}>{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ MAPA ═══ */}
        {tab === 'mapa' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {showComparison ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: `Mapa — ${periodoLabel} · Fat. ${fmtTotal}`, data: filtered, prev: null },
                  { label: `Mapa — ${prevPeriodoLabel}`, data: prevYearFiltered, prev: null },
                ].map(({ label, data: d }) => (
                  <div key={label} style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                    <h3 style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 16 }}>{label}</h3>
                    <MapaHeatBrasil stateData={d?.stateData || []} />
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: `0.5px solid ${cardBorder}` }}>
                      <MapaRegional stateData={d?.stateData || []} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                  <h3 style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 16 }}>Faturamento por Estado — {periodoLabel}</h3>
                  <MapaHeatBrasil stateData={filtered?.stateData || []} />
                </div>
                <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
                  <h3 style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: textPrimary, marginBottom: 16 }}>Ranking por Região — Fat. {fmtTotal}</h3>
                  <MapaRegional stateData={filtered?.stateData || []} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ ORÇAMENTO ═══ */}
        {tab === 'orcamento' && (
          <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 24 }}>
            <OrcamentoView metaData={data?.meta?.[filters.ano] || []} />
          </div>
        )}

        {/* ═══ FLUXO ═══ */}
        {tab === 'fluxo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { label: 'Entradas brutas', value: filtered?.kpis?.totalFaturamento, color: '#FF6A22', bg: '#FFF3EE' },
                { label: 'Devoluções', value: filtered?.byPeriod?.reduce((s,r) => s+(r.devolucoes||0), 0), color: '#EF4444', bg: '#FEF2F2' },
                { label: 'Receita líquida', value: (filtered?.kpis?.totalFaturamento||0) - (filtered?.byPeriod?.reduce((s,r) => s+(r.devolucoes||0),0)||0), color: '#16a34a', bg: '#F0FDF4' },
              ].map(card => (
                <div key={card.label} style={{ background: card.bg, borderRadius: 16, padding: 20 }}>
                  <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, fontWeight: 700 }}>{card.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: card.color, fontFamily: 'Syne,sans-serif' }}>{fmtV(card.value)}</p>
                </div>
              ))}
            </div>
            <div style={{ background: cardBg, borderRadius: 16, border: `0.5px solid ${cardBorder}`, padding: 20 }}>
              <h3 style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: textPrimary, marginBottom: 16 }}>Receita por categoria — {filters.ano}</h3>
              <GraficoReceitas periodData={filtered?.byPeriod || []} darkMode={darkMode} />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
