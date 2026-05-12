'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  ComposedChart, Cell, PieChart, Pie
} from 'recharts'
import { 
  TrendingUp, Target, Map as MapIcon, Users, 
  DollarSign, ArrowUpRight, ArrowDownRight, Activity, 
  Clock, Monitor, ShoppingCart, Wrench, Key, RotateCcw, Globe, Earth
} from 'lucide-react'
import MapaHeatBrasil from './MapaHeatBrasil'
import MiniMapaRegiao from './MiniMapaRegiao'

const fmt = (v) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}k`
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`
}

const MESES_LABELS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

// Mapeamento de Regiões Criffer
const REGIOES_MAP = {
  'SUL': ['PR', 'SC', 'RS'],
  'SUDESTE': ['SP', 'RJ', 'MG', 'ES'],
  'CENTRO-OESTE': ['MS', 'MT', 'GO', 'DF'],
  'NORDESTE': ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
  'NORTE': ['TO', 'PA', 'AP', 'RR', 'AM', 'AC', 'RO'],
  'EXTERIOR': ['EX']
}

export default function TVMode({ data, mes = 'all' }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = [
    { id: 'receitas', title: 'Performance de Receitas', subtitle: 'Visão Geral Comercial' },
    { id: 'mapa', title: 'Expansão Regional', subtitle: 'Distribuição Geográfica de Vendas' },
    { id: 'vendedores', title: 'Time Comercial', subtitle: 'Ranking de Performance' },
    { id: 'metas', title: 'Metas Estratégicas 2026', subtitle: 'Acompanhamento de Objetivos' },
    { id: 'orcamento', title: 'Saúde Financeira', subtitle: 'Resultado Operacional e Gastos' }
  ]

  useEffect(() => {
    let slideTimer;
    let progressTimer;
    if (!isPaused) {
      slideTimer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setProgress(0)
      }, 30000)
      progressTimer = setInterval(() => {
        setProgress((prev) => Math.min(prev + (100 / 300), 100))
      }, 100)
    }
    return () => {
      if (slideTimer) clearInterval(slideTimer)
      if (progressTimer) clearInterval(progressTimer)
    }
  }, [slides.length, isPaused])

  const t = {
    bg: '#000000',
    card: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
    accent: '#FF6A22',
    text: '#ffffff',
    textMuted: '#888888',
    green: '#22c55e',
    red: '#ef4444'
  }

  // Lógica de cálculo unificada para bater com o Dashboard
  const periodData2026 = useMemo(() => (data?.byPeriod?.filter(p => p.ano === 2026) || []), [data])
  
  const ultimoMesRealizado = useMemo(() => {
    return periodData2026.reduce((max, p) => p.total > 0 ? Math.max(max, p.mes) : max, 0)
  }, [periodData2026])

  const labelPeriodo = mes === 'all' 
    ? `ACUMULADO ATÉ ${MESES_LABELS[ultimoMesRealizado-1]?.toUpperCase() || 'JAN'}` 
    : `${MESES_LABELS[parseInt(mes)-1]?.toUpperCase()} 2026`

  return (
    <div style={{ width: '100vw', height: '100vh', background: t.bg, color: t.text, fontFamily: "'Gotham', sans-serif", overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', zIndex: 100 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: t.accent, transition: 'width 0.1s linear' }} />
      </div>

      <div style={{ padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <h1 style={{ fontSize: 42, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, margin: 0, color: t.accent }}>
              {slides[currentSlide].title}
            </h1>
            <div style={{ background: 'rgba(255,106,34,0.15)', padding: '6px 16px', borderRadius: 8, fontSize: 16, fontWeight: 900, color: t.accent, border: '1px solid rgba(255,106,34,0.3)' }}>
              {labelPeriodo}
            </div>
          </div>
          <p style={{ fontSize: 20, fontWeight: 600, color: t.textMuted, margin: '8px 0 0', textTransform: 'uppercase', letterSpacing: 2 }}>
            {slides[currentSlide].subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
           <button onClick={() => setIsPaused(!isPaused)} style={{ background: isPaused ? t.accent : 'rgba(255,255,255,0.1)', border: `1px solid ${t.accent}`, color: '#fff', padding: '10px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 900, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s', textTransform: 'uppercase' }}>
             {isPaused ? '▶ Retomar' : '⏸ Pausar'}
           </button>
           <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>CRIFFER ERP</p>
              <p style={{ fontSize: 14, color: t.accent, margin: 0, fontWeight: 800 }}>LIVE BROADCAST</p>
           </div>
           <div style={{ background: t.accent, padding: 12, borderRadius: 12 }}>
              <Monitor size={32} color="#fff" />
           </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 60px 60px', position: 'relative' }}>
        {currentSlide === 0 && <SlideReceitas data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 1 && <SlideMapa data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 2 && <SlideVendedores data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 3 && <SlideMetas data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 4 && <SlideOrcamento data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
      </div>

      <div style={{ padding: '20px 60px', background: 'rgba(255,106,34,0.05)', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 900, opacity: 0.8 }}>
          {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeInSlide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .slide-enter { animation: fadeInSlide 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }` }} />
    </div>
  )
}

function TickerItem({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
       <span style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>{label}:</span>
       <span style={{ fontSize: 14, fontWeight: 900, color: color || '#fff' }}>{value}</span>
    </div>
  )
}

function SlideReceitas({ data, mes, t, ultimoMes }) {
  const periodData2026 = data?.byPeriod?.filter(p => p.ano === 2026) || []
  
  let v = { vendas: 0, servicos: 0, locacao: 0, devolucao: 0 }

  if (mes === 'all') {
    const subset = periodData2026.filter(p => p.mes <= ultimoMes)
    v = subset.reduce((acc, p) => ({
      vendas: acc.vendas + (p.vendas - (p.devolucoes || 0)),
      servicos: acc.servicos + p.servicos,
      locacao: acc.locacao + p.locacao,
      devolucao: acc.devolucao + (p.devolucoes || 0)
    }), { vendas: 0, servicos: 0, locacao: 0, devolucao: 0 })
  } else {
    const p = periodData2026.find(p => String(p.mes) === String(mes)) || {}
    v = {
      vendas: (p.vendas || 0) - (p.devolucoes || 0),
      servicos: p.servicos || 0,
      locacao: p.locacao || 0,
      devolucao: p.devolucoes || 0
    }
  }

  const total = v.vendas + v.servicos + v.locacao
  
  // Metas do Dashboard
  const metaData = data?.meta?.[2026] || []
  let metaValor = 0
  if (mes === 'all') {
    metaValor = metaData.filter(m => m.mes <= ultimoMes).reduce((acc, m) => acc + (m.meta || 0), 0)
  } else {
    metaValor = metaData.find(m => String(m.mes) === String(mes))?.meta || 0
  }

  const pct = metaValor > 0 ? (total / metaValor) * 100 : 0

  return (
    <div className="slide-enter" style={{ display: 'flex', flexDirection: 'column', gap: 40, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
        <KpiCardTV label="VENDAS" value={v.vendas} icon={ShoppingCart} color={t.accent} t={t} />
        <KpiCardTV label="SERVIÇOS" value={v.servicos} icon={Wrench} color={t.accent} t={t} />
        <KpiCardTV label="LOCAÇÃO" value={v.locacao} icon={Key} color={t.accent} t={t} />
        <KpiCardTV label="DEVOLUÇÃO" value={v.devolucao} icon={RotateCcw} color={t.red} t={t} />
      </div>
      <div style={{ flex: 1, background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', padding: '0 60px', gap: 80 }}>
        <div style={{ flex: 1 }}>
           <h2 style={{ fontSize: 24, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 20 }}>Receita bruta</h2>
           <p style={{ fontSize: 120, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: -4 }}>{fmt(total)}</p>
           <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 40 }}>
              <div style={{ height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 6, flex: 1, overflow: 'hidden' }}>
                 <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: t.accent }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 32, fontWeight: 900 }}>{pct.toFixed(1)}%</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: t.accent, marginTop: -4 }}>VS META</span>
              </div>
           </div>
        </div>
        <div style={{ width: 400, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
           <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Vendas', value: v.vendas }, { name: 'Outros', value: (v.servicos + v.locacao) }]} innerRadius={140} outerRadius={180} paddingAngle={5} dataKey="value">
                  <Cell fill={t.accent} />
                  <Cell fill="rgba(255,255,255,0.1)" />
                </Pie>
              </PieChart>
           </ResponsiveContainer>
           <div style={{ position: 'absolute', textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: t.textMuted, margin: 0 }}>DESEMPENHO</p>
              <p style={{ fontSize: 60, fontWeight: 900, margin: 0 }}>{pct.toFixed(0)}%</p>
              <p style={{ fontSize: 16, fontWeight: 900, color: t.accent, margin: 0, letterSpacing: 1 }}>VS META</p>
           </div>
        </div>
      </div>
    </div>
  )
}

function SlideMapa({ data, mes, t, ultimoMes }) {
  const targetMes = mes === 'all' ? ultimoMes : Number(mes)
  const periodData2026 = data?.byPeriod?.filter(p => p.ano === 2026) || []
  const stateData = data?.byState?.filter(s => s.ano === 2026 && (mes === 'all' ? s.mes <= targetMes : s.mes === targetMes)) || []
  
  // Cálculo Real por Região
  const regioesValores = useMemo(() => {
    const result = { 'SUL': 0, 'SUDESTE': 0, 'CENTRO-OESTE': 0, 'NORDESTE': 0, 'NORTE': 0, 'EXTERIOR': 0 }
    stateData.forEach(s => {
      for (const [reg, estados] of Object.entries(REGIOES_MAP)) {
        if (estados.includes(s.estado)) {
          result[reg] += (s.faturamento || 0)
          break
        }
      }
    })
    return result
  }, [stateData])

  const totalOficialPeriodo = useMemo(() => {
    const subset = periodData2026.filter(p => mes === 'all' ? p.mes <= ultimoMes : String(p.mes) === String(mes))
    return subset.reduce((acc, p) => acc + (p.vendas + p.servicos + p.locacao - Math.abs(p.devolucoes || 0)), 0)
  }, [periodData2026, mes, ultimoMes])

  return (
    <div className="slide-enter" style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 500px', gap: 40 }}>
      {/* Mapa centralizado verticalmente */}
      <div style={{ 
        background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, 
        padding: 40, position: 'relative', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
         {/* Faturamento Total no Canto Superior Esquerdo (Sincronizado com Receita Bruta) */}
         <div style={{ position: 'absolute', top: 40, left: 40 }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0, letterSpacing: 1 }}>Receita bruta</p>
            <p style={{ fontSize: 48, fontWeight: 900, color: t.accent, margin: 0 }}>{fmt(totalOficialPeriodo)}</p>
         </div>

         <div style={{ marginTop: '80px', width: '100%' }}>
            <MapaHeatBrasil stateData={stateData} darkMode={true} isTVMode={true} />
         </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
         <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 26, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 40, letterSpacing: 2 }}>
               Resumo por Região
            </h3>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 25 }}>
               {Object.entries(regioesValores).sort((a, b) => b[1] - a[1]).map(([reg, val], i) => (
                 <div key={reg} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 15, borderBottom: i < 5 ? `1px solid ${t.border}` : 'none' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                     {reg === 'EXTERIOR' ? (
                       <div style={{ width: 45, height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Earth size={24} color={t.accent} />
                       </div>
                     ) : (
                       <MiniMapaRegiao regiao={reg} color={t.accent} />
                     )}
                     <span style={{ fontSize: 22, fontWeight: 800, color: t.text }}>{reg}</span>
                   </div>
                   <span style={{ fontSize: 26, fontWeight: 900, color: val > 0 ? '#fff' : t.textMuted }}>
                     {val > 0 ? fmt(val) : 'R$ 0'}
                   </span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

function SlideVendedores({ data, mes, t, ultimoMes }) {
  const targetMes = mes === 'all' ? ultimoMes : Number(mes)
  const sellers = data?.bySeller || []
  
  const ranking = useMemo(() => {
    const raw = sellers
      .filter(s => s.ano === 2026 && (mes === 'all' ? s.mes <= targetMes : s.mes === targetMes))
      .reduce((acc, curr) => {
        acc[curr.vendedor] = (acc[curr.vendedor] || 0) + curr.vendas
        return acc
      }, {})
    
    return Object.entries(raw)
      .map(([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 5)
  }, [sellers, mes, targetMes])

  return (
    <div className="slide-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ flex: 1, background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 60 }}>
        <h3 style={{ fontSize: 28, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 40 }}>Top 5 Vendedores</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranking} layout="vertical" margin={{ left: 150, right: 100 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 24, fontWeight: 900 }} />
            <Bar dataKey="val" fill={t.accent} radius={[0, 10, 10, 0]} barSize={50}>
               {ranking.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={index === 0 ? t.accent : 'rgba(255,106,34,0.4)'} />
               ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function SlideMetas({ data, mes, t, ultimoMes }) {
  const periodData2026 = data?.byPeriod?.filter(p => p.ano === 2026) || []
  const hist = periodData2026.filter(p => p.mes <= (mes === 'all' ? ultimoMes : Number(mes)))
    .map(p => ({
      mes: MESES_LABELS[p.mes-1].substring(0,3).toUpperCase(),
      real: p.vendas + p.servicos + p.locacao - (p.devolucoes || 0),
      meta: data?.meta?.[2026]?.find(m => m.mes === p.mes)?.meta || 0
    }))

  const totalReal = hist.reduce((acc, h) => acc + h.real, 0)
  const totalMeta = hist.reduce((acc, h) => acc + h.meta, 0)
  const gap = Math.max(0, totalMeta - totalReal)

  return (
    <div className="slide-enter" style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
      <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50 }}>
         <h3 style={{ fontSize: 24, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 40 }}>Evolução Mensal</h3>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hist}>
              <defs>
                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={t.accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={t.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 18, fontWeight: 900 }} />
              <Area type="monotone" dataKey="real" stroke={t.accent} strokeWidth={4} fillOpacity={1} fill="url(#colorReal)" />
              <Line type="monotone" dataKey="meta" stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
         </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
         <div style={{ background: t.accent, borderRadius: 32, padding: 50, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', margin: 0 }}>Gap para Objetivo</p>
            <p style={{ fontSize: 80, fontWeight: 900, color: '#000', margin: 0 }}>{fmt(gap)}</p>
         </div>
         <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>Performance Acumulada</p>
            <p style={{ fontSize: 80, fontWeight: 900, color: totalReal >= totalMeta ? t.green : t.red, margin: 0 }}>
              {totalMeta > 0 ? ((totalReal / totalMeta) * 100).toFixed(1) : 0}%
            </p>
         </div>
      </div>
    </div>
  )
}

function SlideOrcamento({ data, mes, t, ultimoMes }) {
  const targetMes = mes === 'all' ? ultimoMes : Number(mes)
  const f = data?.fluxo?.mensal?.[String(targetMes)] || {}
  
  return (
    <div className="slide-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, flex: 1 }}>
         <div style={{ background: t.card, borderRadius: 32, border: `1.5px solid ${t.border}`, padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <h4 style={{ fontSize: 28, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', marginBottom: 20 }}>Resultado Operacional</h4>
            <p style={{ fontSize: 110, fontWeight: 900, color: (f.geracao_caixa?.real || 0) >= 0 ? t.green : t.red, margin: 0 }}>{fmt(f.geracao_caixa?.real || 0)}</p>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1 }}>
               <p style={{ fontSize: 20, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>Receitas Líquidas (Mês)</p>
               <p style={{ fontSize: 56, fontWeight: 900, color: '#fff', margin: 0 }}>{fmt(f.entradas?.real || 0)}</p>
            </div>
            <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1 }}>
               <p style={{ fontSize: 20, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>Saídas Totais (Mês)</p>
               <p style={{ fontSize: 56, fontWeight: 900, color: t.red, margin: 0 }}>{fmt(Math.abs(f.total_saidas?.real || 0))}</p>
            </div>
         </div>
      </div>
    </div>
  )
}

function KpiCardTV({ label, value, icon: Icon, color, t }) {
  return (
    <div style={{ background: t.card, borderRadius: 24, border: `1px solid ${t.border}`, padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 30 }}>
      <div style={{ background: color, padding: 15, borderRadius: 16 }}> <Icon size={36} color="#fff" /> </div>
      <div>
         <p style={{ fontSize: 16, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>{label}</p>
         <p style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>{fmt(value)}</p>
      </div>
    </div>
  )
}
