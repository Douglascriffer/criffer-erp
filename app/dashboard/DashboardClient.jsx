'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  TrendingUp, Users, Target, Activity, 
  Map as MapIcon, BarChart3, PieChart, 
  TrendingDown, DollarSign, Package, Briefcase,
  ShoppingCart, Wrench, Key, RotateCcw
} from 'lucide-react'
import { useFinancialData, useFilteredData } from '@/lib/hooks'

const MapaHeatBrasil       = dynamic(() => import('@/components/MapaHeatBrasil'),       { ssr:false, loading:()=><Skeleton h={400}/> })
const GraficoMetaRealizado = dynamic(() => import('@/components/GraficoMetaRealizado'), { ssr:false, loading:()=><Skeleton h={240}/> })
const GraficoReceitas      = dynamic(() => import('@/components/GraficoReceitas'),      { ssr:false, loading:()=><Skeleton h={300}/> })
const GraficoComparativo   = dynamic(() => import('@/components/GraficoComparativo'),   { ssr:false, loading:()=><Skeleton h={240}/> })
const MapaRegional         = dynamic(() => import('@/components/MapaRegional'),         { ssr:false, loading:()=><Skeleton h={240}/> })
const OrcamentoView        = dynamic(() => import('@/components/OrcamentoView'),        { ssr:false, loading:()=><Skeleton h={500}/> })
const GraficoVendedores    = dynamic(() => import('@/components/GraficoVendedores'),    { ssr:false, loading:()=><Skeleton h={400}/> })
const GraficoFaturamentoMeta = dynamic(() => import('@/components/GraficoFaturamentoMeta'), { ssr:false, loading:()=><Skeleton h={300}/> })

function Skeleton({ h=200 }) { return <div style={{ height:h, background:'rgba(0,0,0,0.05)', borderRadius:16, animation:'pulse 1.5s infinite' }} /> }

// Formatação Profissional
function fmt(v) {
  if (!v && v !== 0) return '—'
  if (Math.abs(v) >= 1e6) return `${(v/1e6).toFixed(2)}M`
  if (Math.abs(v) >= 1e3) return `${(v/1e3).toFixed(1)}K`
  return `${Math.round(v).toLocaleString('pt-BR')}`
}

const MES = {'1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun','7':'Jul','8':'Ago','9':'Set','10':'Out','11':'Nov','12':'Dez'}

/* ─── Temas Sincronizados (Padrão Capa) ─── */
const THEME = {
  light: {
    bg: '#fafafa',
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
    card: '#1e1e2d',
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
  const [highlightIndex, setHighlightIndex] = useState(0)

  // Sincronização do ciclo de estados dos mapas (3s)
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightIndex(prev => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
  
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
      { id:'vendas', label:'RECEITAS' },
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
  const activeSub  = subTab || (tab === 'desempenho' ? 'vendas' : activeSubs[0]?.id || '')

  function goTab(id) { router.push(`/dashboard?tab=${id}`) }
  function goSub(id) { router.push(`/dashboard?tab=${tab}&sub=${id}`) }

  // ── Componente: Ícone de Meta Dinâmico ──
  const TargetIcon = ({ percent }) => {
    const isHit = percent >= 100
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        {/* Arrow */}
        <line 
          x1={isHit ? "12" : "18"} 
          y1={isHit ? "12" : "6"} 
          x2={isHit ? "22" : "26"} 
          y2={isHit ? "12" : "2"} 
          stroke="#FF6A22" 
          strokeWidth="3" 
          style={{ transition: 'all 0.5s ease' }}
        />
        {isHit && <path d="M19 9l3 3-3 3" stroke="#FF6A22" strokeWidth="3" />}
      </svg>
    )
  }

  // ── Componente: Card de KPI Premium ──
  const KpiCard = ({ label, value, prevValue, icon: Icon, color, isPercent=false }) => {
    const diff = value - prevValue
    const pct = prevValue > 0 ? (diff / prevValue * 100) : 0
    const isUp = diff >= 0

    return (
      <div style={{
        background: t.card,
        border: `1.5px solid ${t.border}`,
        borderRadius: 6,
        padding: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        alignItems: 'center',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: theme === 'light' ? '0 4px 20px rgba(0,0,0,0.03)' : '0 4px 20px rgba(0,0,0,0.2)',
      }} className="hover-lift">
        <p style={{ fontSize: 10, fontWeight: 500, color: t.text, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, width: '100%' }}>{label}</p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            background: `${color}15`, 
            color: color, 
            padding: 4, 
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={14} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <p style={{ fontSize: 20, fontWeight: 500, color: t.text, lineHeight: 1 }}>
               {isPercent ? `${value.toFixed(1)}%` : fmt(value)}
             </p>
          </div>
        </div>
        
        <div style={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 2, 
            fontSize: 11, 
            fontWeight: 400, 
            color: isUp ? '#22c55e' : '#ef4444',
            lineHeight: 1,
            marginBottom: 2
          }}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(pct).toFixed(1)}%
          </div>
          <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 400, lineHeight: 1 }}>
            Ant.: <span style={{ fontWeight: 400, fontSize: 13 }}>{isPercent ? `${prevValue.toFixed(1)}%` : fmt(prevValue)}</span>
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
        gap: 32
      }}>
        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => router.push('/capa')}>
          <div style={{ background: '#fff', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <Image src="/logo-base.png" alt="Criffer" width={32} height={32} style={{ objectFit: 'contain' }}/>
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 500, color: '#fff', letterSpacing: 2, lineHeight: 1 }}>CRIFFER</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 400, letterSpacing: 1.5, textTransform: 'uppercase' }}>ERP Financeiro</div>
          </div>
        </div>

        {/* Top Tabs Navigation */}
        <nav style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.15)', padding: 5, borderRadius: 12, backdropFilter: 'blur(10px)' }}>
          {TOP_TABS.map(tabItem => {
            const active = tab === tabItem.id
            const Icon = tabItem.icon
            return (
              <button key={tabItem.id} onClick={() => goTab(tabItem.id)} style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: active ? '#fff' : 'transparent',
                color: active ? '#FF6A22' : 'rgba(255,255,255,0.85)',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                <Icon size={18} />
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
            borderRadius: 30,
            padding: '8px 18px',
            color: '#fff',
            fontSize: 13,
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
          </button>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 17, fontWeight: 400, color: '#fff', lineHeight: 1 }}>FINANCEIRO</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>Tenha um ótimo dia</div>
          </div>
          <button onClick={() => { localStorage.clear(); router.push('/login') }} style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.4)',
            color: '#fff',
            padding: '8px 18px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>Sair</button>
        </div>
      </header>

      {/* ══ CONTEÚDO PRINCIPAL ══ */}
      <main style={{ maxWidth: '100%', margin: '0 auto', padding: '0px 2% 0px 2%' }}>
        
        {/* Barra de Filtros e Sub-abas (Design SaaS Moderno) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 12,
          background: 'rgba(0,0,0,0.15)',
          padding: '12px 20px',
          borderRadius: '0 0 16px 16px',
          border: '1px solid rgba(255,255,255,0.05)',
          borderTop: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', background: t.pillBg, padding: 3, borderRadius: 10 }}>
              {['2025', '2026'].map(y => (
                <button key={y} onClick={() => setFilters(f => ({ ...f, ano: y }))} style={{
                  padding: '4px 12px',
                  borderRadius: 7,
                  border: 'none',
                  background: filters.ano === y ? t.card : 'transparent',
                  color: filters.ano === y ? t.accent : t.textSub,
                  fontWeight: 600,
                  fontSize: 10.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>{y}</button>
              ))}
            </div>
            
            <div style={{ position: 'relative' }}>
              <select 
                value={filters.mes} 
                onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
                style={{
                  background: t.pillBg,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: '5px 12px',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  colorScheme: theme === 'dark' ? 'dark' : 'light'
                }}
              >
                <option value="all" style={{ background: '#1a1a1a', color: '#fff' }}>Todos os Meses</option>
                {['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'].map((m, i) => (
                  <option key={m} value={i+1} style={{ background: '#1a1a1a', color: '#fff' }}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub-abas de Navegação Interna */}
          {activeSubs.length > 0 && (
            <div style={{ display: 'flex', gap: 6 }}>
              {activeSubs.map(sub => (
                <button key={sub.id} onClick={() => goSub(sub.id)} style={{
                  padding: '6px 16px',
                  borderRadius: 30,
                  border: 'none',
                  background: activeSub === sub.id ? t.accent : 'transparent',
                  color: activeSub === sub.id ? '#fff' : t.textSub,
                  fontSize: 10.5, 
                  fontWeight: 700, 
                  letterSpacing: 0.5, 
                  textTransform: 'uppercase', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>{sub.label}</button>
              ))}
            </div>
          )}
        </div>

        {/* ══ CARDS DE KPI (Top 7) - Ocultos no MAPA e VENDEDORES ══ */}
        {activeSub !== 'mapa' && activeSub !== 'rank' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 12, width: '100%', overflowX: 'auto', paddingBottom: 6 }}>
            <KpiCard label="VENDAS" value={kpis.vendas || 0} prevValue={pkpis.vendas || 0} icon={ShoppingCart} color="#FF6A22" />
            <KpiCard label="SERVIÇOS" value={kpis.servicos || 0} prevValue={pkpis.servicos || 0} icon={Wrench} color="#3b82f6" />
            <KpiCard label="LOCAÇÃO" value={kpis.locacao || 0} prevValue={pkpis.locacao || 0} icon={Key} color="#8b5cf6" />
            <KpiCard label="DEVOLUÇÕES" value={kpis.devolucoes || 0} prevValue={pkpis.devolucoes || 0} icon={RotateCcw} color="#ef4444" />
            <KpiCard label="RECEITA BRUTA" value={kpis.totalRealizado || 0} prevValue={pkpis.totalRealizado || 0} icon={DollarSign} color="#10b981" />
            <KpiCard label="META" value={kpis.totalMeta || 0} prevValue={pkpis.totalMeta || 0} icon={() => <TargetIcon percent={kpis.pctAtingido}/>} color="#f59e0b" />
            <KpiCard label="DESEMPENHO" value={kpis.pctAtingido || 0} prevValue={pkpis.pctAtingido || 0} icon={TrendingUp} color="#FF6A22" isPercent={true} />
          </div>
        )}

        {/* ══ CONTEÚDO DINÂMICO POR ABA ══ */}
        <div style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          
          {/* ABA FATURAMENTO (Desempenho) */}
          {tab === 'desempenho' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Sub-aba: RECEITA */}
              {activeSub === 'vendas' && (
                <>
                {/* 1. Evolução de Receita - Full Width */}
                <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', color: t.text }}>Evolução de Receita (2026)</h3>
                  </div>
                  <GraficoReceitas periodData={(data?.byPeriod?.filter(p => p.ano === 2026) || []).map(p => ({
                    ...p,
                    vendas: p.vendas > 0.01 ? p.vendas : null,
                    servicos: p.servicos > 0.01 ? p.servicos : null,
                    locacao: p.locacao > 0.01 ? p.locacao : null
                  }))} darkMode={theme === 'dark'} horizontal={false}/>
                </div>

                {/* 2. Grid para Faturamento vs Meta e Comparativo Anual */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, textAlign: 'center', color: t.text }}>Faturamento Total Mensal vs Meta</h3>
                    <GraficoFaturamentoMeta metaData={data?.meta?.[2026] || []} darkMode={theme === 'dark'} />
                  </div>
                  <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, textAlign: 'center', color: t.text }}>Comparativo Anual acumulado (2025 vs 2026)</h3>
                    <GraficoComparativo 
                      showComparison={true}
                      darkMode={theme === 'dark'}
                      currentLabel="2026"
                      previousLabel="2025"
                      currentData={data?.byPeriod?.filter(p => p.ano === 2026 && (filters.mes === 'all' || p.mes <= Number(filters.mes)))?.reduce((acc, curr) => ({
                        vendas: acc.vendas + curr.vendas,
                        servicos: acc.servicos + curr.servicos,
                        locacao: acc.locacao + curr.locacao
                      }), { vendas: 0, servicos: 0, locacao: 0 })}
                      previousData={data?.byPeriod?.filter(p => p.ano === 2025 && (filters.mes === 'all' || p.mes <= Number(filters.mes)))?.reduce((acc, curr) => ({
                        vendas: acc.vendas + curr.vendas,
                        servicos: acc.servicos + curr.servicos,
                        locacao: acc.locacao + curr.locacao
                      }), { vendas: 0, servicos: 0, locacao: 0 })}
                    />
                  </div>
                </div>
                </>
              )}

               {/* Sub-aba: MAPA */}
              {activeSub === 'mapa' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {(() => {
                    const lastMonth2026 = data?.byState?.filter(s => s.ano === 2026 && s.faturamento > 0)
                      ?.reduce((max, s) => Math.max(max, s.mes), 1) || 12
                    
                    const filterByMonth = (s, targetAno) => {
                      const isAll = filters.mes === 'all'
                      const targetMes = isAll ? lastMonth2026 : Number(filters.mes)
                      return s.ano === targetAno && (isAll ? s.mes <= targetMes : s.mes === targetMes)
                    }

                    return (
                      <>
                        {/* Coluna 2026 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16, height: 420, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700, textAlign: 'left', marginBottom: 12, color: '#fff' }}>2026</h3>
                            <MapaHeatBrasil 
                              stateData={data?.byState?.filter(s => filterByMonth(s, 2026)) || []} 
                              darkMode={theme === 'dark'} 
                              syncIndex={highlightIndex}
                            />
                          </div>
                          <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, textAlign: 'left', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1, color: '#fff' }}>DISTRIBUIÇÃO REGIONAL 2026</h3>
                            <MapaRegional stateData={data?.byState?.filter(s => filterByMonth(s, 2026)) || []} darkMode={theme === 'dark'} />
                          </div>
                        </div>

                        {/* Coluna 2025 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16, height: 420, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700, textAlign: 'left', marginBottom: 12, color: '#fff' }}>2025</h3>
                            <MapaHeatBrasil 
                              stateData={data?.byState?.filter(s => filterByMonth(s, 2025)) || []} 
                              darkMode={theme === 'dark'} 
                              syncIndex={highlightIndex}
                            />
                          </div>
                          <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, textAlign: 'left', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1, color: '#fff' }}>DISTRIBUIÇÃO REGIONAL 2025</h3>
                            <MapaRegional stateData={data?.byState?.filter(s => filterByMonth(s, 2025)) || []} darkMode={theme === 'dark'} />
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

               {/* Sub-aba: METAS */}
              {activeSub === 'metas' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Meta vs Realizado (Mês Selecionado)</h3>
                    <GraficoMetaRealizado metaData={data?.meta?.[filters.ano]?.filter(m => m.mes === Number(filters.mes)) || []}/>
                  </div>
                  <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Atingimento Acumulado 2026</h3>
                    <div style={{ fontSize: 42, fontWeight: 500, color: t.accent }}>
                      {kpis.pctAtingido ? `${kpis.pctAtingido.toFixed(1)}%` : '—'}
                    </div>
                    <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>Performance em relação à meta anual</p>
                  </div>
                </div>
              )}

               {/* Sub-aba: VENDEDORES */}
              {activeSub === 'rank' && (
                <div style={{ background: theme === 'light' ? 'rgba(0,0,0,0.05)' : t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 24, height: 750, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>RANKING DE PERFORMANCE</h3>
                  </div>
                  <GraficoVendedores sellers={data?.bySeller || []} darkMode={theme === 'dark'} filters={filters} />
                </div>
              )}
            </div>
          )}

          {/* ABA ORÇAMENTO */}
          {tab === 'orcamento' && (
            <div style={{ background: t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 16 }}>
              <OrcamentoView mes={filters.mes} darkMode={theme === 'dark'} />
            </div>
          )}

          {/* ABA FLUXO DE CAIXA */}
          {tab === 'fluxo' && (
            <div style={{ background: t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 40, textAlign: 'center' }}>
              <Activity size={32} color={t.accent} style={{ marginBottom: 12 }} />
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>Fluxo de Caixa em Homologação</h2>
              <p style={{ color: t.textMuted, maxWidth: 400, margin: '8px auto', fontSize: 13 }}>Estamos integrando os dados bancários reais para oferecer uma visão preditiva do seu caixa.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

