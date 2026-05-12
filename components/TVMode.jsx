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
  Clock, Monitor
} from 'lucide-react'
import MapaHeatBrasil from './MapaHeatBrasil'

const fmt = (v) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}k`
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`
}

const MESES_LABELS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

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

  const labelPeriodo = mes === 'all' ? 'ACUMULADO ANUAL 2026' : `${MESES_LABELS[parseInt(mes)-1].toUpperCase()} 2026`

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
        {currentSlide === 0 && <SlideReceitas data={data} mes={mes} t={t} />}
        {currentSlide === 1 && <SlideMapa data={data} mes={mes} t={t} />}
        {currentSlide === 2 && <SlideVendedores data={data} mes={mes} t={t} />}
        {currentSlide === 3 && <SlideMetas data={data} mes={mes} t={t} />}
        {currentSlide === 4 && <SlideOrcamento data={data} mes={mes} t={t} />}
      </div>

      <div style={{ padding: '20px 60px', background: 'rgba(255,106,34,0.05)', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 40 }}>
           <TickerItem label="STATUS" value="ONLINE" color={t.green} />
           <TickerItem label="SLIDE" value={`${currentSlide + 1} / ${slides.length}`} />
           <TickerItem label="PERÍODO" value={labelPeriodo} color={t.accent} />
        </div>
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

function SlideReceitas({ data, mes, t }) {
  // Lógica de extração de dados por mês com inteligência de acumulado (YTD)
  const curMes = mes === 'all' ? 'all' : mes
  let v = { vendas: 0, servicos: 0, locacao: 0, devolucao: 0 }
  let ultimoMesComDados = 0

  const mensal = data?.receitas?.mensal || {}

  if (curMes === 'all') {
    // Identificar até qual mês temos dados
    Object.keys(mensal).forEach(mIdx => {
      const mData = mensal[mIdx]
      if ((mData.vendas || 0) > 0) {
        ultimoMesComDados = Math.max(ultimoMesComDados, parseInt(mIdx))
      }
    })

    // Somar apenas até o último mês com dados
    for (let i = 1; i <= (ultimoMesComDados || 12); i++) {
      const m = mensal[String(i)] || {}
      v.vendas += (m.vendas || 0)
      v.servicos += (m.servicos || 0)
      v.locacao += (m.locacao || 0)
      v.devolucao += (m.devolucao || 0)
    }
  } else {
    v = mensal[curMes] || { vendas: 0, servicos: 0, locacao: 0, devolucao: 0 }
  }

  const total = v.vendas + v.servicos + v.locacao
  
  // Buscar meta real proporcional ao período
  const metaData = data?.meta?.[new Date().getFullYear()] || []
  let metaMes = 0

  if (curMes === 'all') {
    // Somar metas apenas até o último mês que teve realizado
    metaMes = metaData
      .filter(m => m.mes <= (ultimoMesComDados || 12))
      .reduce((acc, m) => acc + (m.meta || 0), 0)
  } else {
    metaMes = metaData.find(m => String(m.mes) === String(curMes))?.meta || 2200000
  }

  const pct = metaMes > 0 ? (total / metaMes) * 100 : 0

  return (
    <div className="slide-enter" style={{ display: 'flex', flexDirection: 'column', gap: 40, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
        <KpiCardTV label="VENDAS" value={v.vendas} icon={ArrowUpRight} color={t.accent} t={t} />
        <KpiCardTV label="SERVIÇOS" value={v.servicos} icon={Activity} color={t.accent} t={t} />
        <KpiCardTV label="LOCAÇÃO" value={v.locacao} icon={TrendingUp} color={t.accent} t={t} />
        <KpiCardTV label="DEVOLUÇÃO" value={v.devolucao} icon={ArrowDownRight} color={t.red} t={t} />
      </div>
      <div style={{ flex: 1, background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', padding: '0 60px', gap: 80 }}>
        <div style={{ flex: 1 }}>
           <h2 style={{ fontSize: 24, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 20 }}>Receita Bruta Total</h2>
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

function SlideMapa({ data, mes, t }) {
  return (
    <div className="slide-enter" style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 450px', gap: 40 }}>
      <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 40, position: 'relative' }}>
         <MapaHeatBrasil data={data} darkMode={true} isTVMode={true} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
         <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 40, flex: 1 }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 30 }}>Distribuição Regional</h3>
            {['SUL', 'SUDESTE', 'CENTRO-OESTE', 'NORDESTE', 'NORTE'].map((reg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: i < 4 ? `1px solid ${t.border}` : 'none' }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{reg}</span>
                <span style={{ fontSize: 24, fontWeight: 900, color: t.accent }}>{35 - (i*5)}%</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}

function SlideVendedores({ data, mes, t }) {
  const ranking = [
    { name: 'Gabriel Dias', val: 450000 },
    { name: 'Ana Silva', val: 380000 },
    { name: 'Carlos Santos', val: 320000 },
    { name: 'Juliana Lima', val: 290000 },
    { name: 'Roberto M.', val: 250000 }
  ]

  return (
    <div className="slide-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ flex: 1, background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 60 }}>
        <h3 style={{ fontSize: 28, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 40 }}>Ranking de Vendedores</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranking} layout="vertical" margin={{ left: 100, right: 100 }}>
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

function SlideMetas({ data, mes, t }) {
  const hist = [
    { mes: 'JAN', real: 1200000, meta: 1100000 },
    { mes: 'FEV', real: 1400000, meta: 1150000 },
    { mes: 'MAR', real: 1300000, meta: 1200000 },
    { mes: 'ABR', real: 1600000, meta: 1250000 },
    { mes: 'MAI', real: 1850000, meta: 1300000 }
  ]

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
            <p style={{ fontSize: 80, fontWeight: 900, color: '#000', margin: 0 }}>{fmt(450000)}</p>
         </div>
         <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>Performance</p>
            <p style={{ fontSize: 80, fontWeight: 900, color: t.green, margin: 0 }}>+18.4%</p>
         </div>
      </div>
    </div>
  )
}

function SlideOrcamento({ data, mes, t }) {
  return (
    <div className="slide-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, flex: 1 }}>
         <div style={{ background: t.card, borderRadius: 32, border: `1.5px solid ${t.border}`, padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <h4 style={{ fontSize: 28, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', marginBottom: 20 }}>Resultado Operacional</h4>
            <p style={{ fontSize: 110, fontWeight: 900, color: t.green, margin: 0 }}>{fmt(185000)}</p>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1 }}>
               <p style={{ fontSize: 20, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>Receitas Líquidas</p>
               <p style={{ fontSize: 56, fontWeight: 900, color: '#fff', margin: 0 }}>{fmt(1240000)}</p>
            </div>
            <div style={{ background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 50, flex: 1 }}>
               <p style={{ fontSize: 20, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>Despesas Totais</p>
               <p style={{ fontSize: 56, fontWeight: 900, color: t.red, margin: 0 }}>{fmt(1055000)}</p>
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
