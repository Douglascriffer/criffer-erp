'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  TrendingUp, Users, Target, Activity, 
  Map as MapIcon, BarChart3, PieChart, 
  TrendingDown, DollarSign, Package, Briefcase
} from 'lucide-react'
import { useFinancialData, useFilteredData } from '@/lib/hooks'

const MapaHeatBrasil       = dynamic(() => import('@/components/MapaHeatBrasil'),       { ssr:false, loading:()=><Skeleton h={400}/> })
const GraficoMetaRealizado = dynamic(() => import('@/components/GraficoMetaRealizado'), { ssr:false, loading:()=><Skeleton h={240}/> })
const GraficoReceitas      = dynamic(() => import('@/components/GraficoReceitas'),      { ssr:false, loading:()=><Skeleton h={300}/> })
const GraficoComparativo   = dynamic(() => import('@/components/GraficoComparativo'),   { ssr:false, loading:()=><Skeleton h={240}/> })
const MapaRegional         = dynamic(() => import('@/components/MapaRegional'),         { ssr:false, loading:()=><Skeleton h={240}/> })
const OrcamentoView        = dynamic(() => import('@/components/OrcamentoView'),        { ssr:false, loading:()=><Skeleton h={500}/> })

function Skeleton({ h=200 }) { return <div style={{ height:h, background:'rgba(0,0,0,0.05)', borderRadius:16, animation:'pulse 1.5s infinite' }} /> }

// Formatação Profissional
function fmt(v) {
  if (!v && v !== 0) return '—'
  if (Math.abs(v) >= 1e6) return `R$ ${(v/1e6).toFixed(2)}M`
  if (Math.abs(v) >= 1e3) return `R$ ${(v/1e3).toFixed(1)}K`
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`
}

const MES = {'1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun','7':'Jul','8':'Ago','9':'Set','10':'Out','11':'Nov','12':'Dez'}

/* ─── Temas Sincronizados (Padrão Capa) ─── */
const THEME = {
  light: {
    bg: '#ffffff',
    card: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
    text: '#000000',
    textSub: '#333333',
    textMuted: '#666666',
    accent: '#FF6A22',
    pillBg: 'rgba(0,0,0,0.05)',
    grid: '#FF6A22',
    gridOpacity: 0.03,
  },
  dark: {
    bg: '#0c0c14',
    card: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
    text: '#ffffff',
    textSub: '#cccccc',
    textMuted: '#888888',
    accent: '#FF6A22',
    pillBg: 'rgba(255,255,255,0.08)',
    grid: '#FF6A22',
    gridOpacity: 0.05,
  }
}

export default function DashboardClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tab          = searchParams.get('tab') || 'desempenho'
  const subTab       = searchParams.get('sub')  || ''

  const [user, setUser]             = useState('')
  const [filters, setFilters]       = useState({ ano:'2026', mes:String(new Date().getMonth() + 1) })
  const [theme, setTheme]           = useState('light')
  const t = THEME[theme]

  const { data, loading, refetch } = useFinancialData()

  // Dados Filtrados (Mês Atual)
  const filtered = useFilteredData(data, filters)
  
  // Dados Ano Anterior (Mesmo Mês)
  const prevYearFilters = useMemo(() => ({
    ano: String(Number(filters.ano) - 1),
    mes: filters.mes
  }), [filters])
  const prevYearData = useFilteredData(data, prevYearFilters)

  useEffect(()=>{
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    const savedTheme = localStorage.getItem('criffer_theme') || 'light'
    if (!auth) router.push('/login')
    else {
      setUser(nome||'')
      setTheme(savedTheme)
    }
  },[])

  const changeTheme = useCallback((next) => {
    setTheme(next)
    localStorage.setItem('criffer_theme', next)
  }, [])

  const TOP_TABS = [
    { id:'desempenho', label:'FATURAMENTO', icon: BarChart3 },
    { id:'orcamento',  label:'ORÇAMENTO', icon: PieChart },
    { id:'fluxo',      label:'FLUXO DE CAIXA', icon: Activity },
  ]

  const SUB_TABS = {
    desempenho: [
      { id:'vendas', label:'RECEITA' },
      { id:'mapa',   label:'MAPA' },
      { id:'rank',   label:'VENDEDORES' },
      { id:'metas',  label:'METAS' },
    ],
    orcamento: [
      { id:'dre',  label:'DRE Simplificado' },
      { id:'metas_orc', label:'Metas' },
    ],
  }

  const activeSubs = SUB_TABS[tab] || []
  const activeSub  = subTab || activeSubs[0]?.id || ''

  function goTab(id) { router.push(`/dashboard?tab=${id}`) }
  function goSub(id) { router.push(`/dashboard?tab=${tab}&sub=${id}`) }

  // ── Componente: Card de KPI Premium ──
  const KpiCard = ({ label, value, prevValue, icon: Icon, color }) => {
    const diff = value - prevValue
    const pct = prevValue > 0 ? (diff / prevValue * 100) : 0
    const isUp = diff >= 0

    return (
      <div style={{
        background: t.card,
        border: `1.5px solid ${t.border}`,
        borderRadius: 24,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: theme === 'light' ? '0 4px 20px rgba(0,0,0,0.03)' : '0 4px 20px rgba(0,0,0,0.2)',
      }} className="hover-lift">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ 
            background: `${color}15`, 
            color: color, 
            padding: 10, 
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={20} />
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            fontSize: 12, 
            fontWeight: 800, 
            color: isUp ? '#22c55e' : '#ef4444',
            background: isUp ? '#22c55e10' : '#ef444410',
            padding: '4px 8px',
            borderRadius: 20
          }}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(pct).toFixed(1)}%
          </div>
        </div>
        
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</p>
          <p style={{ fontSize: 26, fontWeight: 900, color: t.text, margin: '4px 0' }}>{fmt(value)}</p>
          <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>
            Anterior: <span style={{ fontWeight: 700 }}>{fmt(prevValue)}</span>
          </p>
        </div>
      </div>
    )
  }

  const kpis = filtered?.kpis || {}
  const pkpis = prevYearData?.kpis || {}

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: t.bg, 
      fontFamily: "'Gotham', sans-serif",
      color: t.text,
      transition: 'background 0.5s ease'
    }}>
      {/* Global CSS Reset & Gotham Integration */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .hover-lift:hover { transform: translateY(-5px); }
        .tab-active { background: #ffffff !important; color: #FF6A22 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
      `}</style>

      {/* ══ TOPBAR PREMIUM (Sincronizada com Capa) ══ */}
      <header style={{
        background: 'linear-gradient(135deg, #a84410 0%, #d4601a 42%, #FF6A22 72%, #f07c38 100%)',
        padding: '12px 4%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 32px rgba(168,68,16,0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: 20
      }}>
        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/capa')}>
          <div style={{ background: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <Image src="/logo-base.png" alt="Criffer" width={28} height={28} style={{ objectFit: 'contain' }}/>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: 3, lineHeight: 1 }}>CRIFFER</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>ERP Financeiro</div>
          </div>
        </div>

        {/* Top Tabs Navigation */}
        <nav style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.15)', padding: 5, borderRadius: 12, backdropFilter: 'blur(10px)' }}>
          {TOP_TABS.map(tabItem => {
            const active = tab === tabItem.id
            const Icon = tabItem.icon
            return (
              <button key={tabItem.id} onClick={() => goTab(tabItem.id)} style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: active ? '#fff' : 'transparent',
                color: active ? '#FF6A22' : 'rgba(255,255,255,0.85)',
                transition: 'all 0.2s',
              }}>
                <Icon size={16} />
                {tabItem.label}
              </button>
            )
          })}
        </nav>

        {/* User & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Theme Switcher sutil */}
          <button onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')} style={{
            background: 'rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20,
            padding: '6px 12px',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
          </button>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1 }}>FINANCEIRO</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Tenha um ótimo dia</div>
          </div>
          <button onClick={() => { localStorage.clear(); router.push('/login') }} style={{
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.4)',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer'
          }}>Sair</button>
        </div>
      </header>

      {/* ══ CONTEÚDO PRINCIPAL ══ */}
      <main style={{ maxWidth: 1800, margin: '0 auto', padding: '32px 4%' }}>
        
        {/* Filtros de Período (Design SaaS Moderno) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', background: t.pillBg, padding: 4, borderRadius: 12 }}>
              {['2025', '2026'].map(y => (
                <button key={y} onClick={() => setFilters(f => ({ ...f, ano: y }))} style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: filters.ano === y ? t.card : 'transparent',
                  color: filters.ano === y ? t.accent : t.textSub,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: filters.ano === y ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                }}>{y}</button>
              ))}
            </div>
            <select value={filters.mes} onChange={e => setFilters(f => ({ ...f, mes: e.target.value }))} style={{
              background: t.card,
              border: `1.5px solid ${t.border}`,
              padding: '8px 16px',
              borderRadius: 12,
              color: t.text,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none'
            }}>
              {Object.entries(MES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {/* Sub-abas de Navegação Interna */}
          {activeSubs.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {activeSubs.map(sub => (
                <button key={sub.id} onClick={() => goSub(sub.id)} style={{
                  padding: '8px 20px',
                  borderRadius: 30,
                  border: 'none',
                  background: activeSub === sub.id ? t.accent : t.pillBg,
                  color: activeSub === sub.id ? '#fff' : t.textSub,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>{sub.label}</button>
              ))}
            </div>
          )}
        </div>

        {/* ══ CARDS DE KPI (Top 6) ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
          <KpiCard label="VENDAS" value={kpis.vendas || 0} prevValue={pkpis.vendas || 0} icon={Package} color="#FF6A22" />
          <KpiCard label="SERVIÇOS" value={kpis.servicos || 0} prevValue={pkpis.servicos || 0} icon={Briefcase} color="#3b82f6" />
          <KpiCard label="LOCAÇÃO" value={kpis.locacao || 0} prevValue={pkpis.locacao || 0} icon={Activity} color="#8b5cf6" />
          <KpiCard label="RECEITA BRUTA" value={kpis.totalFaturamento || 0} prevValue={pkpis.totalFaturamento || 0} icon={DollarSign} color="#10b981" />
          <KpiCard label="META" value={kpis.totalMeta || 0} prevValue={pkpis.totalMeta || 0} icon={Target} color="#f59e0b" />
          <KpiCard label="ATINGIMENTO" value={kpis.pctAtingido || 0} prevValue={pkpis.pctAtingido || 0} icon={TrendingUp} color="#FF6A22" />
        </div>

        {/* ══ CONTEÚDO DINÂMICO POR ABA ══ */}
        <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          
          {/* ABA FATURAMENTO (Desempenho) */}
          {tab === 'desempenho' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              
              {/* Sub-aba: RECEITA */}
              {activeSub === 'vendas' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                  <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 900 }}>Evolução de Receita (2026)</h3>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted }}>Barras Horizontais</div>
                    </div>
                    <GraficoReceitas periodData={data?.byPeriod?.filter(p => p.ano === 2026) || []} darkMode={theme === 'dark'} horizontal={true}/>
                  </div>
                  <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Comparativo Anual (2025 vs 2026)</h3>
                    <GraficoComparativo 
                      showComparison={true}
                      currentData={data?.byPeriod?.filter(p => p.ano === 2026)?.reduce((acc, curr) => ({
                        vendas: acc.vendas + curr.vendas,
                        servicos: acc.servicos + curr.servicos,
                        locacao: acc.locacao + curr.locacao
                      }), { vendas: 0, servicos: 0, locacao: 0 })}
                      previousData={data?.byPeriod?.filter(p => p.ano === 2025)?.reduce((acc, curr) => ({
                        vendas: acc.vendas + curr.vendas,
                        servicos: acc.servicos + curr.servicos,
                        locacao: acc.locacao + curr.locacao
                      }), { vendas: 0, servicos: 0, locacao: 0 })}
                    />
                  </div>
                </div>
              )}

              {/* Sub-aba: MAPA */}
              {activeSub === 'mapa' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 24 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 900, textAlign: 'center', marginBottom: 16 }}>MAPA RECEITA 2026</h3>
                      <MapaHeatBrasil stateData={data?.byState?.filter(s => s.ano === 2026) || []} />
                    </div>
                    <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 24 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 900, textAlign: 'center', marginBottom: 16 }}>MAPA RECEITA 2025</h3>
                      <MapaHeatBrasil stateData={data?.byState?.filter(s => s.ano === 2025) || []} />
                    </div>
                  </div>
                  <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Distribuição Regional (Faturamento)</h3>
                    <MapaRegional stateData={data?.byState?.filter(s => s.ano === 2026) || []} />
                  </div>
                </div>
              )}

              {/* Sub-aba: METAS */}
              {activeSub === 'metas' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Meta vs Realizado (Mês Selecionado)</h3>
                    <GraficoMetaRealizado metaData={data?.meta?.[filters.ano]?.filter(m => m.mes === Number(filters.mes)) || []}/>
                  </div>
                  <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Atingimento Acumulado 2026</h3>
                    <div style={{ fontSize: 64, fontWeight: 900, color: t.accent }}>
                      {kpis.pctAtingido ? `${kpis.pctAtingido.toFixed(1)}%` : '—'}
                    </div>
                    <p style={{ fontSize: 14, color: t.textMuted, fontWeight: 600 }}>Performance em relação à meta anual</p>
                  </div>
                </div>
              )}

              {/* Sub-aba: VENDEDORES */}
              {activeSub === 'rank' && (
                <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Ranking de Vendedores</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {(data?.bySeller || []).map((v, i) => (
                      <div key={i} style={{ padding: 20, background: t.pillBg, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{v.img}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>{v.name}</p>
                          <p style={{ margin: 0, fontSize: 13, color: t.textMuted }}>{fmt(v.val)}</p>
                        </div>
                        <div style={{ fontWeight: 900, color: t.accent }}>#{i+1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA ORÇAMENTO */}
          {tab === 'orcamento' && (
            <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
              <OrcamentoView mes={filters.mes} darkMode={theme === 'dark'} />
            </div>
          )}

          {/* ABA FLUXO DE CAIXA */}
          {tab === 'fluxo' && (
            <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 80, textAlign: 'center' }}>
              <Activity size={48} color={t.accent} style={{ marginBottom: 20 }} />
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>Fluxo de Caixa em Homologação</h2>
              <p style={{ color: t.textMuted, maxWidth: 500, margin: '12px auto' }}>Estamos integrando os dados bancários reais para oferecer uma visão preditiva do seu caixa.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

