'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { Upload, RefreshCw } from 'lucide-react'
import { useFinancialData, useFilteredData } from '@/lib/hooks'
import GraficoReceitas    from '@/components/GraficoReceitas'
import GraficoComparativo from '@/components/GraficoComparativo'
import UploadExcel        from '@/components/UploadExcel'
import MapaRegional       from '@/components/MapaRegional'
import OrcamentoView      from '@/components/OrcamentoView'

const MapaHeatBrasil       = dynamic(() => import('@/components/MapaHeatBrasil'),       { ssr:false, loading:()=><Skeleton h={280}/> })
const GraficoMetaRealizado = dynamic(() => import('@/components/GraficoMetaRealizado'), { ssr:false, loading:()=><Skeleton h={240}/> })

function Skeleton({ h=200 }) { return <div style={{ height:h, background:'#F5F5F5', borderRadius:12 }} /> }

function fmt(v) {
  if (!v && v!==0) return '—'
  if (v>=1e6) return `${(v/1e6).toFixed(2)}M`
  if (v>=1e3) return `${(v/1e3).toFixed(1)}K`
  return Math.round(v).toString()
}

const MES = {'1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun','7':'Jul','8':'Ago','9':'Set','10':'Out','11':'Nov','12':'Dez'}

export default function DashboardClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tab          = searchParams.get('tab') || 'desempenho'
  const subTab       = searchParams.get('sub')  || ''

  const [user, setUser]           = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [filters, setFilters]     = useState({ ano:'2026', mes:'all' })
  const [localData, setLocalData] = useState(null)
  const [dark, setDark]           = useState(false)

  const { data:remoteData, loading, refetch } = useFinancialData()
  const data = localData || remoteData

  const prev = { ano:String(Number(filters.ano)-1), mes:filters.mes }
  const filtered     = useFilteredData(data, filters)
  const prevFiltered = useFilteredData(data, prev)

  const compLabel = filters.mes==='all' ? `vs ${Number(filters.ano)-1}` : `vs ${MES[filters.mes]}/${Number(filters.ano)-1}`
  const periodoLabel = filters.mes==='all' ? filters.ano : `${MES[filters.mes]}/${filters.ano}`
  const prevLabel    = filters.mes==='all' ? String(Number(filters.ano)-1) : `${MES[filters.mes]}/${Number(filters.ano)-1}`

  useEffect(()=>{
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    if (!auth) router.push('/login')
    else setUser(nome||'')
  },[])

  // Colors
  const bg       = dark ? '#111' : '#F8F9FA'
  const card     = dark ? '#1A1A1A' : '#FFFFFF'
  const border   = dark ? '#2A2A2A' : '#F0EDE8'
  const textMain = dark ? '#EEE' : '#1A1A1A'
  const textSub  = dark ? '#888' : '#666'
  const textMuted= dark ? '#555' : '#AAA'

  // ── TOP-LEVEL TABS (top-right) ───────────────────────────────
  const TOP_TABS = [
    { id:'desempenho', label:'Faturamento' },
    { id:'orcamento',  label:'Orçamento'  },
    { id:'fluxo',      label:'Fluxo de Caixa' },
  ]

  // ── SUB-TABS per top tab ─────────────────────────────────────
  const SUB_TABS = {
    desempenho: [
      { id:'vendas', label:'Desempenho das Vendas' },
      { id:'mapa',   label:'Mapa de Vendas' },
      { id:'rank',   label:'Rank de Vendedores' },
    ],
    orcamento: [
      { id:'receitas',  label:'Receitas e Despesas' },
      { id:'resultado', label:'Resultado Líquido' },
      { id:'metas',     label:'Metas 2026' },
    ],
    fluxo: [
      { id:'construcao', label:'Em Construção' },
    ],
  }

  const activeSubs = SUB_TABS[tab] || []
  const activeSub  = subTab || activeSubs[0]?.id || ''

  function goTab(t) { router.push(`/dashboard?tab=${t}`) }
  function goSub(s) { router.push(`/dashboard?tab=${tab}&sub=${s}`) }

  // ── KPI cards (only for faturamento/mapa) ───────────────────
  const showKpi = (tab === 'desempenho' || tab === 'mapa')
  const kpis = filtered?.kpis || {}
  const prevKpis = prevFiltered?.kpis || {}
  function pct(a,b) { return b&&b>0 ? ((a-b)/b*100) : undefined }

  const KpiBar = () => (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:16 }}>
      {[
        { label:'Receita Total', val:fmt(kpis.totalFaturamento), chg:pct(kpis.totalFaturamento,prevKpis.totalFaturamento), accent:true },
        { label:'Vendas',   val:fmt(kpis.totalVendas),   chg:pct(kpis.totalVendas,prevKpis.totalVendas) },
        { label:'Serviços', val:fmt(kpis.totalServicos), chg:pct(kpis.totalServicos,prevKpis.totalServicos) },
        { label:'Locação',  val:fmt(kpis.totalLocacao),  chg:pct(kpis.totalLocacao,prevKpis.totalLocacao) },
        { label:'Meta',     val:fmt(kpis.totalMeta) },
        { label:'% Meta',   val:kpis.pctAtingido>0?`${kpis.pctAtingido.toFixed(1)}%`:'—', warn:kpis.pctAtingido>0&&kpis.pctAtingido<80 },
      ].map(k => (
        <div key={k.label} style={{ background:k.accent?'#FFF3EE':card, borderRadius:14, padding:'14px 16px', border:`1px solid ${k.accent?'#FFD4B8':border}`, borderLeft:`4px solid ${k.accent?'#FF6A22':k.warn?'#EF4444':'transparent'}` }}>
          <p style={{ fontSize:10, fontWeight:700, color:textMuted, textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>{k.label}</p>
          <p style={{ fontSize:22, fontWeight:900, color:k.accent?'#FF6A22':k.warn?'#EF4444':textMain, fontFamily:'Syne,sans-serif', lineHeight:1, marginBottom:6 }}>{k.val}</p>
          {k.chg!==undefined && (
            <span style={{ fontSize:12, fontWeight:700, color:k.chg>=0?'#16a34a':'#EF4444' }}>
              {k.chg>=0?'▲':'▼'} {Math.abs(k.chg).toFixed(1)}% {compLabel}
            </span>
          )}
        </div>
      ))}
    </div>
  )

  if (loading && !data) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:bg }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, border:'3px solid #FFB899', borderTopColor:'#FF6A22', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto 12px' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:textMuted, fontSize:14 }}>Carregando...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:bg, fontFamily:'Syne,sans-serif' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} * { box-sizing:border-box; }`}</style>

      {/* ── HEADER ── */}
      <header style={{ background:card, borderBottom:`1px solid ${border}`, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:1600, margin:'0 auto', padding:'0 28px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', flexShrink:0 }} onClick={()=>router.push('/capa')}>
            <div style={{ width:34,height:34,borderRadius:8,background:'#FF6A22',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polygon points="11,2 21,7 21,15 11,20 1,15 1,7" fill="white" opacity=".15"/><polygon points="11,2 21,7 11,12 1,7" fill="white"/><polygon points="1,7 11,12 11,20 1,15" fill="white" opacity=".7"/><polygon points="21,7 11,12 11,20 21,15" fill="white" opacity=".9"/></svg>
            </div>
            <div>
              <div style={{ fontSize:18,fontWeight:900,color:'#FF6A22',letterSpacing:4,lineHeight:1 }}>CRIFFER</div>
              <div style={{ fontSize:9,color:textMuted,letterSpacing:2 }}>ERP Financeiro</div>
            </div>
          </div>

          {/* TOP TABS — center-right */}
          <div style={{ display:'flex', gap:4, background:dark?'#222':'#F0F0F0', borderRadius:10, padding:4 }}>
            {TOP_TABS.map(t => (
              <button key={t.id} onClick={()=>goTab(t.id)} style={{
                padding:'7px 18px', borderRadius:8, border:'none', cursor:'pointer',
                fontFamily:'inherit', fontSize:13, fontWeight:700,
                background: tab===t.id ? card : 'transparent',
                color:      tab===t.id ? '#FF6A22' : textSub,
                boxShadow:  tab===t.id ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                transition:'all .18s',
              }}>{t.label}</button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <button onClick={()=>setDark(d=>!d)} style={{ padding:'6px 13px', borderRadius:20, border:`1px solid ${border}`, background:dark?'#FF6A22':card, color:dark?'white':textSub, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              {dark?'☀ Claro':'◑ Escuro'}
            </button>
            <button onClick={()=>setShowUpload(u=>!u)} style={{ display:'flex',alignItems:'center',gap:5, fontSize:12, padding:'7px 12px', border:`1px solid ${border}`, borderRadius:8, background:'transparent', color:textSub, cursor:'pointer', fontFamily:'inherit' }}>
              <Upload size={12}/> Upload
            </button>
            <button onClick={refetch} style={{ width:32,height:32,borderRadius:8,border:`1px solid ${border}`,background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <RefreshCw size={13} color={textMuted}/>
            </button>
            {user && (
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:14, color:textSub, fontWeight:600 }}>Olá, {user.split(' ')[0]}</span>
                <button onClick={()=>{localStorage.clear();router.push('/login')}} style={{ border:`1px solid ${border}`,borderRadius:8,background:'none',cursor:'pointer',fontSize:13,color:textMuted,padding:'5px 12px',fontFamily:'inherit' }}>Sair</button>
              </div>
            )}
          </div>
        </div>

        {/* ── SUB-TABS row ── */}
        {activeSubs.length > 0 && (
          <div style={{ maxWidth:1600, margin:'0 auto', padding:'0 28px', display:'flex', gap:2, borderTop:`1px solid ${border}`, paddingTop:0 }}>
            {activeSubs.map(s => (
              <button key={s.id} onClick={()=>goSub(s.id)} style={{
                padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer',
                fontFamily:'inherit', fontSize:13, fontWeight:600,
                color: activeSub===s.id ? '#FF6A22' : textSub,
                borderBottom: activeSub===s.id ? '2px solid #FF6A22' : '2px solid transparent',
                transition:'all .18s',
              }}>{s.label}</button>
            ))}
          </div>
        )}
      </header>

      {/* ── PERIOD FILTER ── */}
      <div style={{ maxWidth:1600, margin:'0 auto', padding:'16px 28px 0', display:'flex', alignItems:'center', gap:10 }}>
        {/* Year */}
        <div style={{ display:'flex', background:dark?'#222':'#F0F0F0', borderRadius:8, padding:3, gap:2 }}>
          {['2025','2026'].map(y => (
            <button key={y} onClick={()=>setFilters(f=>({...f,ano:y}))} style={{
              padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer',
              fontFamily:'inherit', fontSize:13, fontWeight:700,
              background: filters.ano===y ? card : 'transparent',
              color:      filters.ano===y ? '#FF6A22' : textSub,
            }}>{y}</button>
          ))}
        </div>
        {/* Month */}
        <select value={filters.mes} onChange={e=>setFilters(f=>({...f,mes:e.target.value}))}
          style={{ fontSize:13, border:`1px solid ${border}`, borderRadius:8, padding:'6px 12px', background:card, color:textMain, fontFamily:'inherit', cursor:'pointer' }}>
          <option value="all">Todos os meses</option>
          {Object.entries(MES).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={()=>setFilters({ano:String(new Date().getFullYear()),mes:String(new Date().getMonth()+1)})}
          style={{ fontSize:13, padding:'6px 14px', border:`1px solid #FF6A22`, borderRadius:8, background:'transparent', color:'#FF6A22', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}>
          Mês atual
        </button>
      </div>

      {/* ── UPLOAD ── */}
      {showUpload && (
        <div style={{ maxWidth:1600, margin:'12px auto', padding:'0 28px' }}>
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12, color:textMain }}>Atualizar dados</h3>
            <UploadExcel onDataLoaded={d=>{ setLocalData(d); setShowUpload(false) }}/>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth:1600, margin:'16px auto', padding:'0 28px 40px' }}>

        {/* ════════════════════ FATURAMENTO ════════════════════ */}
        {tab==='desempenho' && (
          <div>
            {showKpi && <KpiBar/>}

            {/* Desempenho das Vendas */}
            {(activeSub==='' || activeSub==='vendas') && (
              <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16 }}>
                {/* Receitas mensais */}
                <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:24 }}>
                  <h3 style={{ textAlign:'center', fontSize:15, fontWeight:700, color:textMain, margin:'0 0 16px' }}>Receitas mensais</h3>
                  <GraficoReceitas periodData={filtered?.byPeriod||[]} darkMode={dark}/>
                </div>
                {/* Comparativo */}
                <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:24 }}>
                  <h3 style={{ textAlign:'center', fontSize:15, fontWeight:700, color:textMain, margin:'0 0 16px' }}>
                    {filters.ano==='2026' ? 'Comparativo 2026 vs 2025' : `Distribuição ${filters.ano}`}
                  </h3>
                  <GraficoComparativo
                    showComparison={filters.ano==='2026'}
                    currentData={filtered?.byPeriod?.length>0?{
                      vendas:   filtered.byPeriod.reduce((s,r)=>s+r.vendas,0),
                      servicos: filtered.byPeriod.reduce((s,r)=>s+r.servicos,0),
                      locacao:  filtered.byPeriod.reduce((s,r)=>s+r.locacao,0),
                    }:null}
                    previousData={filters.ano==='2026'&&prevFiltered?.byPeriod?.length>0?{
                      vendas:   prevFiltered.byPeriod.reduce((s,r)=>s+r.vendas,0),
                      servicos: prevFiltered.byPeriod.reduce((s,r)=>s+r.servicos,0),
                      locacao:  prevFiltered.byPeriod.reduce((s,r)=>s+r.locacao,0),
                    }:null}
                    currentLabel={filters.ano}
                    previousLabel={String(Number(filters.ano)-1)}
                  />
                </div>

                {/* Meta vs Realizado */}
                <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:24 }}>
                  <h3 style={{ textAlign:'center', fontSize:15, fontWeight:700, color:textMain, margin:'0 0 16px' }}>Meta vs Realizado — {filters.ano}</h3>
                  <GraficoMetaRealizado metaData={data?.meta?.[filters.ano]||[]}/>
                </div>

                {/* Atingimento */}
                <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:24 }}>
                  <h3 style={{ textAlign:'center', fontSize:15, fontWeight:700, color:textMain, margin:'0 0 20px' }}>Atingimento — {filters.ano}</h3>
                  {(()=>{
                    const arr = data?.meta?.[filters.ano]||[]
                    const totMeta = arr.reduce((s,m)=>s+m.meta,0)
                    const totReal = arr.reduce((s,m)=>s+m.realizado,0)
                    const pct = totMeta>0 ? (totReal/totMeta)*100 : 0
                    return (
                      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                        <div>
                          <p style={{ fontSize:12, color:textMuted, marginBottom:6, fontWeight:600 }}>Realizado</p>
                          <div style={{ height:44, background:'#FF6A22', borderRadius:10, display:'flex', alignItems:'center', padding:'0 18px' }}>
                            <span style={{ color:'white', fontWeight:800, fontSize:18, fontFamily:'Syne,sans-serif' }}>{fmt(totReal)}</span>
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize:12, color:textMuted, marginBottom:6, fontWeight:600 }}>Meta anual</p>
                          <div style={{ height:44, background:'#7C2D12', borderRadius:10, display:'flex', alignItems:'center', padding:'0 18px' }}>
                            <span style={{ color:'white', fontWeight:800, fontSize:18, fontFamily:'Syne,sans-serif' }}>{fmt(totMeta)}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontSize:13, color:textSub, fontWeight:600 }}>Atingimento</span>
                            <span style={{ fontSize:14, fontWeight:800, color:pct>=100?'#16a34a':'#FF6A22' }}>{pct>0?`${pct.toFixed(1)}%`:'—'}</span>
                          </div>
                          <div style={{ height:10, background:dark?'#333':'#F0EDE8', borderRadius:5, overflow:'hidden' }}>
                            <div style={{ height:'100%', background:'#FF6A22', borderRadius:5, width:`${Math.min(pct,100)}%`, transition:'width .7s' }}/>
                          </div>
                          <p style={{ fontSize:11, color:textMuted, marginTop:6, textAlign:'center' }}>Falta {fmt(Math.max(totMeta-totReal,0))} para a meta</p>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Mapa de Vendas */}
            {activeSub==='mapa' && <MapaContent filtered={filtered} prevFiltered={prevFiltered} periodoLabel={periodoLabel} prevLabel={prevLabel} card={card} border={border} textMain={textMain} textSub={textSub} dark={dark} showComparison={filters.ano==='2026'}/>}

            {/* Rank de Vendedores */}
            {activeSub==='rank' && (
              <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:60, textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:16 }}>🏆</div>
                <h3 style={{ fontSize:22, fontWeight:800, color:textMain, marginBottom:8 }}>Rank de Vendedores</h3>
                <p style={{ color:textMuted, fontSize:14 }}>Em desenvolvimento</p>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════ MAPA (top tab) ════════════════════ */}
        {tab==='mapa' && (
          <div>
            {showKpi && <KpiBar/>}
            <MapaContent filtered={filtered} prevFiltered={prevFiltered} periodoLabel={periodoLabel} prevLabel={prevLabel} card={card} border={border} textMain={textMain} textSub={textSub} dark={dark} showComparison={filters.ano==='2026'}/>
          </div>
        )}

        {/* ════════════════════ ORÇAMENTO ════════════════════ */}
        {tab==='orcamento' && (
          <div>
            {/* NO KpiBar for orcamento — show its own cards inside OrcamentoView */}
            <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:28 }}>
              <OrcamentoView mes={filters.mes} initialSubView={activeSub==='receitas'?0:activeSub==='resultado'?1:activeSub==='metas'?2:0} darkMode={dark}/>
            </div>
          </div>
        )}

        {/* ════════════════════ FLUXO ════════════════════ */}
        {tab==='fluxo' && (
          <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:60, textAlign:'center' }}>
            <div style={{ fontSize:50, marginBottom:20 }}>🚧</div>
            <h3 style={{ fontSize:26, fontWeight:900, color:textMain, marginBottom:10 }}>Fluxo de Caixa Direto</h3>
            <p style={{ color:textMuted, fontSize:15 }}>Em construção — em breve disponível</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── MAPA CONTENT component ───────────────────────────────────────────────────
function MapaContent({ filtered, prevFiltered, periodoLabel, prevLabel, card, border, textMain, textSub, dark, showComparison }) {
  )

  const fmtTotal = v => !v ? '—' : v>=1e6 ? `${(v/1e6).toFixed(2)}M` : `${(v/1e3).toFixed(0)}K`

  if (showComparison) {
    const fat26 = fmtTotal(filtered?.kpis?.totalFaturamento)
    const fat25 = fmtTotal(prevFiltered?.kpis?.totalFaturamento)
    return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {[
          { label:`Mapa — ${periodoLabel} · Fat. ${fat26}`, data:filtered,     lineColor:dark?'white':'black' },
          { label:`Mapa — ${prevLabel} · Fat. ${fat25}`,     data:prevFiltered, lineColor:dark?'white':'black' },
        ].map(({ label, data:d, lineColor }) => (
          <div key={label} style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:20 }}>
            <h3 style={{ textAlign:'center', fontSize:14, fontWeight:700, color:textMain, marginBottom:16 }}>{label}</h3>
            <MapaHeatBrasil stateData={d?.stateData||[]} lineColor={lineColor}/>
            <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${border}` }}>
              <MapaRegional stateData={d?.stateData||[]}/>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const fat = fmtTotal(filtered?.kpis?.totalFaturamento)
  return (
    <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16 }}>
      <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:20 }}>
        <h3 style={{ textAlign:'center', fontSize:14, fontWeight:700, color:textMain, marginBottom:16 }}>Faturamento por Estado — {periodoLabel} · {fat}</h3>
        <MapaHeatBrasil stateData={filtered?.stateData||[]} lineColor={dark?'white':'black'}/>
      </div>
      <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:20 }}>
        <h3 style={{ textAlign:'center', fontSize:14, fontWeight:700, color:textMain, marginBottom:16 }}>Regiões — {fat}</h3>
        <MapaRegional stateData={filtered?.stateData||[]}/>
      </div>
    </div>
  )
}
