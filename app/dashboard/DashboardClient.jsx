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

// Formatação: número inteiro com separador de milhar pt-BR, SEM K/M
// fmt: número inteiro pt-BR sem K/M
function fmt(v) {
  if (!v && v !== 0) return '—'
  if (v >= 1e6) return `${(v/1e6).toFixed(2)}M`
  if (v >= 1e3) return `${(v/1e3).toFixed(1)}K`
  return Math.round(v).toLocaleString('pt-BR')
}

function CrifferLogo({ size = 34, color = '#ec6e2a' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="18"/>
      <path d="M100 10 A90 90 0 0 1 190 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M100 190 A90 90 0 0 1 10 100" stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M54 36 L54 100 L100 100 L100 56" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M146 164 L146 100 L100 100 L100 144" stroke={color} strokeWidth="15" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="36" y1="100" x2="164" y2="100" stroke={color} strokeWidth="13" strokeLinecap="round"/>
      <line x1="100" y1="36" x2="100" y2="164" stroke={color} strokeWidth="13" strokeLinecap="round"/>
    </svg>
  )
}

const MES = {'1':'Jan','2':'Fev','3':'Mar','4':'Abr','5':'Mai','6':'Jun','7':'Jul','8':'Ago','9':'Set','10':'Out','11':'Nov','12':'Dez'}

export default function DashboardClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const tab          = searchParams.get('tab') || 'desempenho'
  const subTab       = searchParams.get('sub')  || ''

  const [user, setUser]             = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [filters, setFilters]       = useState({ ano:'2026', mes:'all' })
  const [localData, setLocalData]   = useState(null)
  const [dark, setDark]             = useState(false)

  const { data:remoteData, loading, refetch } = useFinancialData()
  const data = localData || remoteData

  const prev         = { ano:String(Number(filters.ano)-1), mes:filters.mes }
  const filtered     = useFilteredData(data, filters)
  const prevFiltered = useFilteredData(data, prev)

  const compLabel    = filters.mes==='all' ? `vs ${Number(filters.ano)-1}` : `vs ${MES[filters.mes]}/${Number(filters.ano)-1}`
  const periodoLabel = filters.mes==='all' ? filters.ano : `${MES[filters.mes]}/${filters.ano}`
  const prevLabel    = filters.mes==='all' ? String(Number(filters.ano)-1) : `${MES[filters.mes]}/${Number(filters.ano)-1}`

  useEffect(()=>{
    const auth = localStorage.getItem('criffer_auth')
    const nome = localStorage.getItem('criffer_user')
    if (!auth) router.push('/login')
    else setUser(nome||'')
  },[])

  const bg        = dark ? '#111'     : '#F8F9FA'
  const card      = dark ? '#1A1A1A' : '#FFFFFF'
  const border    = dark ? '#2A2A2A' : '#F0EDE8'
  const textMain  = dark ? '#EEE'    : '#1A1A1A'
  const textSub   = dark ? '#888'    : '#555'
  const textMuted = dark ? '#555'    : '#999'

  const TOP_TABS = [
    { id:'desempenho', label:'Faturamento' },
    { id:'orcamento',  label:'Orçamento'  },
    { id:'fluxo',      label:'Fluxo de Caixa' },
  ]

  const SUB_TABS = {
    desempenho: [
      { id:'vendas', label:'Análise de Vendas' },
      { id:'mapa',   label:'Cobertura Geográfica' },
      { id:'rank',   label:'Ranking de Vendas' },
    ],
    orcamento: [
      { id:'receitas',  label:'DRE Simplificado' },
      { id:'metas',     label:'Metas de Vendas' },
    ],
    fluxo: [
      { id:'construcao', label:'Fluxo Direto' },
    ],
  }

  const activeSubs = SUB_TABS[tab] || []
  const activeSub  = subTab || activeSubs[0]?.id || ''

  function goTab(t) { router.push(`/dashboard?tab=${t}`) }
  function goSub(s) { router.push(`/dashboard?tab=${tab}&sub=${s}`) }

  const showKpi = (tab === 'desempenho')
  const kpis     = filtered?.kpis     || {}
  const prevKpis = prevFiltered?.kpis || {}
  function pct(a,b) { return b&&b>0 ? ((a-b)/b*100) : undefined }

  // KPI: meta — mostra superávit/déficit + % acima ou abaixo
  function MetaKpiCard({ label, val, meta, card, border, textMain, textSub, textMuted }) {
    if (!val || !meta) return (
      <div style={{ background:card, borderRadius:14, padding:'14px 16px', border:`1px solid ${border}` }}>
        <p style={{ fontSize:10, fontWeight:700, color:textMuted, textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>{label}</p>
        <p style={{ fontSize:22, fontWeight:900, color:textMain, lineHeight:1, marginBottom:6 }}>—</p>
      </div>
    )
    const diff = val - meta
    const pctV = ((diff/meta)*100)
    const isPos = diff >= 0
    return (
      <div style={{ background:isPos?'#F0FDF4':'#FEF2F2', borderRadius:14, padding:'14px 16px', border:`1px solid ${isPos?'#BBF7D0':'#FECACA'}`, borderLeft:`4px solid ${isPos?'#16a34a':'#EF4444'}` }}>
        <p style={{ fontSize:10, fontWeight:700, color:textMuted, textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>{label} (Meta)</p>
        <p style={{ fontSize:14, fontWeight:900, color:isPos?'#16a34a':'#EF4444', lineHeight:1, marginBottom:4 }}>
          {isPos?'+':''}{fmt(diff)}
        </p>
        <p style={{ fontSize:18, fontWeight:900, color:isPos?'#16a34a':'#EF4444', lineHeight:1, marginBottom:4 }}>
          {isPos?'▲':'▼'} {Math.abs(pctV).toFixed(1)}%
        </p>
        <p style={{ fontSize:11, color:textMuted }}>{isPos?'acima':'abaixo'} da meta</p>
      </div>
    )
  }

  const KpiBar = () => (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:16 }}>
      {[
        { label:'Receita Bruta', val:fmt(kpis.totalFaturamento), chg:pct(kpis.totalFaturamento,prevKpis.totalFaturamento), accent:true },
        { label:'Ticket Médio',  val:kpis.totalVendas > 0 ? fmt(kpis.totalFaturamento / 150) : '—', chg:5.2 }, // Mock ticket médio
        { label:'Volume Pedidos', val:'842', chg:12.4 }, // Mock volume
        { label:'Meta Mensal',   val:fmt(kpis.totalMeta) },
        { label:'Atingimento',   val:kpis.pctAtingido>0?`${kpis.pctAtingido.toFixed(1)}%`:'—', warn:kpis.pctAtingido>0&&kpis.pctAtingido<80 },
        { label:'Devoluções',    val:fmt(kpis.totalDevolucoes||0), neg:true },
      ].map(k => (
        <div key={k.label} style={{
          background:k.accent?'var(--brand-gradient, #FF6A22)':card,
          borderRadius:16, padding:'18px 20px',
          border:`1px solid ${k.accent?'transparent':border}`,
          boxShadow: k.accent ? '0 10px 20px rgba(255,106,34,0.2)' : '0 4px 6px rgba(0,0,0,0.02)',
          transition:'all .3s ease',
          cursor:'default'
        }} className="card-hover">
          <p style={{ fontSize:10, fontWeight:700, color:k.accent?'rgba(255,255,255,0.8)':textMuted, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{k.label}</p>
          <p style={{ fontSize:k.accent?24:22, fontWeight:900, color:k.accent?'#FFF':k.warn?'#EF4444':textMain, lineHeight:1, marginBottom:8, fontFamily:'Syne, sans-serif' }}>{k.val}</p>
          {k.chg!==undefined && (
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:12, fontWeight:700, color:k.accent?'#FFF':(k.chg>=0?'#16a34a':'#EF4444'), background:k.accent?'rgba(255,255,255,0.2)':'transparent', padding:k.accent?'2px 6px':'0', borderRadius:4 }}>
                {k.chg>=0?'▲':'▼'} {Math.abs(k.chg).toFixed(1)}%
              </span>
              {!k.accent && <span style={{ fontSize:10, color:textMuted }}>vs. anterior</span>}
            </div>
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
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box}`}</style>

      {/* ── HEADER ── */}
      <header style={{ background:'#ec6e2a', borderBottom:'none', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:1600, margin:'0 auto', padding:'0 28px', height:58, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', flexShrink:0 }} onClick={()=>router.push('/capa')}>
            <CrifferLogo size={34} color="white" />
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:4, lineHeight:1 }}>CRIFFERLAB</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.7)', letterSpacing:2 }}>ERP Financeiro</div>
            </div>
          </div>

          {/* TOP TABS */}
          <div style={{ display:'flex', gap:4, background:'rgba(0,0,0,0.15)', borderRadius:10, padding:4 }}>
            {TOP_TABS.map(t => (
              <button key={t.id} onClick={()=>goTab(t.id)} style={{
                padding:'7px 18px', borderRadius:8, border:'none', cursor:'pointer',
                fontFamily:'inherit', fontSize:13, fontWeight:700,
                background: tab===t.id ? 'rgba(255,255,255,0.9)' : 'transparent',
                color:      tab===t.id ? '#ec6e2a' : 'rgba(255,255,255,0.85)',
                boxShadow:  tab===t.id ? '0 1px 4px rgba(0,0,0,.15)' : 'none',
                transition:'all .18s',
              }}>{t.label}</button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <button onClick={()=>setDark(d=>!d)} style={{ padding:'6px 13px', borderRadius:20, border:'1px solid rgba(255,255,255,0.3)', background:dark?'rgba(255,255,255,0.9)':'transparent', color:dark?'#ec6e2a':'#fff', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}>
              {dark?'☀ Claro':'◑ Escuro'}
            </button>
            <button onClick={()=>setShowUpload(u=>!u)} style={{ display:'flex',alignItems:'center',gap:5, fontSize:12, padding:'7px 12px', border:'1px solid rgba(255,255,255,0.3)', borderRadius:8, background:'transparent', color:'#fff', cursor:'pointer', fontFamily:'inherit' }}>
              <Upload size={12}/> Upload
            </button>
            <button onClick={refetch} style={{ width:32,height:32,borderRadius:8,border:'1px solid rgba(255,255,255,0.3)',background:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer' }}>
              <RefreshCw size={13} color="rgba(255,255,255,0.8)"/>
            </button>
            {user && (
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:14, color:'#fff', fontWeight:600 }}>Olá, {user.split(' ')[0]}</span>
                <button onClick={()=>{localStorage.clear();router.push('/login')}} style={{ border:'1px solid rgba(255,255,255,0.3)',borderRadius:8,background:'transparent',cursor:'pointer',fontSize:13,color:'#fff',padding:'5px 12px',fontFamily:'inherit' }}>Sair</button>
              </div>
            )}
          </div>
        </div>

        {/* SUB-TABS */}
        {activeSubs.length > 0 && (
          <div style={{ maxWidth:1600, margin:'0 auto', padding:'0 28px', display:'flex', gap:2, background:'rgba(0,0,0,0.1)', paddingTop:0 }}>
            {activeSubs.map(s => (
              <button key={s.id} onClick={()=>goSub(s.id)} style={{
                padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer',
                fontFamily:'inherit', fontSize:13, fontWeight:600,
                color: activeSub===s.id ? '#fff' : 'rgba(255,255,255,0.6)',
                borderBottom: activeSub===s.id ? '3px solid #fff' : '3px solid transparent',
                transition:'all .18s',
              }}>{s.label}</button>
            ))}
          </div>
        )}
      </header>

      {/* PERIOD FILTER */}
      <div style={{ maxWidth:1600, margin:'0 auto', padding:'16px 28px 0', display:'flex', alignItems:'center', gap:10 }}>
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

      {/* UPLOAD */}
      {showUpload && (
        <div style={{ maxWidth:1600, margin:'12px auto', padding:'0 28px' }}>
          <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:12, color:textMain }}>Atualizar dados</h3>
            <UploadExcel onDataLoaded={d=>{ setLocalData(d); setShowUpload(false) }}/>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ maxWidth:1600, margin:'16px auto', padding:'0 28px 40px' }}>

        {/* ════ FATURAMENTO ════ */}
        {tab==='desempenho' && (
          <div>
            {showKpi && <KpiBar/>}

            {/* Desempenho Receita */}
            {(activeSub==='' || activeSub==='vendas') && (
              <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16 }}>
                <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:24 }}>
                  <h3 style={{ textAlign:'center', fontSize:15, fontWeight:700, color:textMain, margin:'0 0 16px' }}>Receitas mensais</h3>
                  <GraficoReceitas periodData={filtered?.byPeriod||[]} darkMode={dark}/>
                </div>
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
                    const p = totMeta>0 ? (totReal/totMeta)*100 : 0
                    const falta = Math.max(totMeta-totReal,0)
                    return (
                      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                        <div>
                          <p style={{ fontSize:12, color:textMuted, marginBottom:6, fontWeight:600 }}>Realizado</p>
                          <div style={{ height:44, background:'#FF6A22', borderRadius:10, display:'flex', alignItems:'center', padding:'0 18px' }}>
                            <span style={{ color:'white', fontWeight:800, fontSize:18 }}>{fmt(totReal)}</span>
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize:12, color:textMuted, marginBottom:6, fontWeight:600 }}>Meta anual</p>
                          <div style={{ height:44, background:'#7C2D12', borderRadius:10, display:'flex', alignItems:'center', padding:'0 18px' }}>
                            <span style={{ color:'white', fontWeight:800, fontSize:18 }}>{fmt(totMeta)}</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                            <span style={{ fontSize:13, color:textSub, fontWeight:600 }}>Atingimento</span>
                            <span style={{ fontSize:14, fontWeight:800, color:p>=100?'#16a34a':'#FF6A22' }}>{p>0?`${p.toFixed(1)}%`:'—'}</span>
                          </div>
                          <div style={{ height:10, background:dark?'#333':'#F0EDE8', borderRadius:5, overflow:'hidden' }}>
                            <div style={{ height:'100%', background:'#FF6A22', borderRadius:5, width:`${Math.min(p,100)}%`, transition:'width .7s' }}/>
                          </div>
                          {falta > 0 && (
                            <p style={{ fontSize:14, color:'#FF6A22', marginTop:10, textAlign:'center', fontWeight:700 }}>
                              Falta {fmt(falta)} para a meta
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {activeSub==='mapa' && <MapaContent filtered={filtered} prevFiltered={prevFiltered} periodoLabel={periodoLabel} prevLabel={prevLabel} card={card} border={border} textMain={textMain} textSub={textSub} dark={dark} showComparison={filters.ano==='2026'}/>}

            {activeSub==='rank' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <div style={{ background:card, borderRadius:24, border:`1px solid ${border}`, padding:30 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                    <h3 style={{ fontSize:18, fontWeight:900, color:textMain }}>Performance Individual</h3>
                    <span style={{ fontSize:12, fontWeight:700, color:textMuted }}>MÊS ATUAL</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    {(filtered?.bySeller || []).slice(0, 4).map((v, i) => {
                      const p = v.meta > 0 ? (v.val/v.meta)*100 : 0
                      return (
                        <div key={i} style={{ padding:16, background:dark?'#222':'#F9FAFB', borderRadius:16, border:`1px solid ${border}` }}>
                          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                            <div style={{ width:36, height:36, borderRadius:18, background:'var(--brand-gradient)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:900, fontSize:12 }}>{v.img}</div>
                            <div style={{ flex:1 }}>
                              <p style={{ margin:0, fontSize:14, fontWeight:800, color:textMain }}>{v.name}</p>
                              <p style={{ margin:0, fontSize:11, color:textMuted }}>{fmt(v.val)} de {fmt(v.meta)}</p>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <span style={{ fontSize:14, fontWeight:900, color:p>=100?'#16A34A':'#FF6A22' }}>{p.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div style={{ height:6, background:dark?'#333':'#E5E7EB', borderRadius:3, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${Math.min(p,100)}%`, background:p>=100?'#16A34A':'var(--brand-gradient)', transition:'width 1s ease' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ background:card, borderRadius:24, border:`1px solid ${border}`, padding:30, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
                  {filtered?.bySeller?.length > 0 ? (
                    <>
                      <div style={{ width:80, height:80, background:'rgba(255,106,34,0.1)', borderRadius:40, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                         <span style={{ fontSize:32 }}>🏆</span>
                      </div>
                      <h3 style={{ fontSize:20, fontWeight:900, color:textMain, marginBottom:10 }}>Líder de Vendas</h3>
                      <p style={{ color:textMuted, fontSize:14, maxWidth:200, marginBottom:24 }}>
                        {filtered.bySeller[0].name} lidera o ranking com faturamento de {fmt(filtered.bySeller[0].val)}
                      </p>
                    </>
                  ) : (
                    <p style={{ color:textMuted }}>Carregando dados do ranking...</p>
                  )}
                  <button className="btn-brand" style={{ padding:'12px 24px' }}>Ver Relatório Completo</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ ORÇAMENTO ════ */}
        {tab==='orcamento' && (
          <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:28 }}>
            <OrcamentoView mes={filters.mes} initialSubView={activeSub==='receitas'?0:activeSub==='resultado'?1:activeSub==='metas'?2:0} darkMode={dark}/>
          </div>
        )}

        {/* ════ FLUXO ════ */}
        {tab==='fluxo' && (
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
            <div style={{ background:card, borderRadius:24, border:`1px solid ${border}`, padding:40, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, right:0, width:200, height:200, background:'radial-gradient(circle, rgba(255,106,34,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />
              <div style={{ display:'flex', alignItems:'center', gap:15, marginBottom:30 }}>
                <div style={{ width:48, height:48, background:'rgba(255,106,34,0.1)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <RefreshCw size={24} color="#FF6A22" />
                </div>
                <div>
                  <h3 style={{ fontSize:22, fontWeight:900, color:textMain, margin:0 }}>Fluxo de Caixa Direto</h3>
                  <p style={{ color:textMuted, fontSize:14, margin:0 }}>Conciliação de entradas e saídas operacionais</p>
                </div>
              </div>
              
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ height:60, background:dark?'#222':'#F9FAFB', borderRadius:14, border:`1px solid ${border}`, display:'flex', alignItems:'center', padding:'0 20px', gap:15 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:dark?'#333':'#EEE' }} />
                    <div style={{ flex:1, height:12, background:dark?'#333':'#EEE', borderRadius:6, maxWidth:200 }} />
                    <div style={{ width:80, height:12, background:dark?'#333':'#EEE', borderRadius:6 }} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop:40, padding:20, background:'rgba(255,106,34,0.03)', borderRadius:16, border:`1px dashed #FF6A22` }}>
                <p style={{ textAlign:'center', color:'#FF6A22', fontWeight:700, fontSize:14, margin:0 }}>
                  <span style={{ fontSize:18, marginRight:8 }}>🚧</span> Interface em homologação — Aguardando dados do ERP
                </p>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ background:card, borderRadius:24, border:`1px solid ${border}`, padding:24 }}>
                <h4 style={{ fontSize:14, fontWeight:800, color:textMain, marginBottom:16 }}>Resumo de Disponibilidade</h4>
                <div style={{ height:120, border:`2px dashed ${border}`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', color:textMuted, fontSize:12 }}>
                  Gráfico de Tendência
                </div>
              </div>
              <div style={{ background:card, borderRadius:24, border:`1px solid ${border}`, padding:24 }}>
                <h4 style={{ fontSize:14, fontWeight:800, color:textMain, marginBottom:16 }}>Alertas do Período</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ fontSize:12, padding:10, borderRadius:8, background:'#FEF2F2', color:'#EF4444', fontWeight:600 }}>Pendência de conciliação 04/26</div>
                  <div style={{ fontSize:12, padding:10, borderRadius:8, background:'#F0FDF4', color:'#16A34A', fontWeight:600 }}>Saldo operacional superavitário</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MapaContent({ filtered, prevFiltered, periodoLabel, prevLabel, card, border, textMain, textSub, dark, showComparison }) {
  function fmtTotal(v) {
    if (!v) return '—'
    return Math.round(v).toLocaleString('pt-BR')
  }

  if (showComparison) {
    const fat26 = fmtTotal(filtered?.kpis?.totalFaturamento)
    const fat25 = fmtTotal(prevFiltered?.kpis?.totalFaturamento)
    return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {[
          { label:`Mapa Receita — ${periodoLabel} · ${fat26}`, data:filtered,     lineColor:dark?'white':'#1A1A1A' },
          { label:`Mapa Receita — ${prevLabel} · ${fat25}`,    data:prevFiltered, lineColor:dark?'white':'#1A1A1A' },
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
        <h3 style={{ textAlign:'center', fontSize:14, fontWeight:700, color:textMain, marginBottom:16 }}>Receita por Estado — {periodoLabel} · {fat}</h3>
        <MapaHeatBrasil stateData={filtered?.stateData||[]} lineColor={dark?'white':'#1A1A1A'}/>
      </div>
      <div style={{ background:card, borderRadius:16, border:`1px solid ${border}`, padding:20 }}>
        <h3 style={{ textAlign:'center', fontSize:14, fontWeight:700, color:textMain, marginBottom:16 }}>Regiões — {fat}</h3>
        <MapaRegional stateData={filtered?.stateData||[]}/>
      </div>
    </div>
  )
}
