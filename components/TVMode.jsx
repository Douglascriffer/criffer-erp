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
  Clock, Monitor, ShoppingCart, Wrench, Key, RotateCcw, Globe, Wallet
} from 'lucide-react'
import MapaHeatBrasil from './MapaHeatBrasil'
import IconeRegiao from './IconeRegiao'

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

const PHOTO_MAP = {
  'Gabriel Dias': '/vendedores/Gabriel Dias.jpg',
  'Gabriel Ferreira dos Santos': '/vendedores/Gabriel Ferreira dos Santos.jpg',
  'Gabriel Klein': '/vendedores/Gabriel Klein.jpg',
  'Gabriel Medeiros': '/vendedores/Gabriel Medeiros.jpg',
  'Josiane Govoni Lanzarini': '/vendedores/Josiane Govoni Lanzarini.jpg',
  'Rogislei Vieira Padilha': '/vendedores/Rogislei Vieira Padilha.jpg',
  'Vanessa Ferreira': '/vendedores/Vanessa Ferreira.jpg'
}

export default function TVMode({ data, mes = 'all' }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = [
    { id: 'receitas', title: 'Performance de Receitas', subtitle: 'Visão Geral Comercial' },
    { id: 'mapa', title: 'Expansão Regional', subtitle: 'Distribuição Geográfica de Vendas' },
    { id: 'vendedores-1', title: 'Time Comercial (1/2)', subtitle: 'Lideranças de Vendas' },
    { id: 'vendedores-2', title: 'Time Comercial (2/2)', subtitle: 'Performance de Equipe' },
    { id: 'metas', title: 'Metas Estratégicas 2026', subtitle: 'Acompanhamento de Objetivos' },
    { id: 'orcamento', title: 'Saúde Financeira', subtitle: 'Resultado Operacional e Gastos' },
    { id: 'fluxo', title: 'Fluxo de Caixa', subtitle: 'Disponibilidade e Movimentação' }
  ]

    const SLIDE_DURATION = 4000; // 4 segundos

    useEffect(() => {
    let slideTimer;
    let progressTimer;
    if (!isPaused) {
      slideTimer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setProgress(0)
      }, SLIDE_DURATION)
      progressTimer = setInterval(() => {
        setProgress((prev) => Math.min(prev + (100 / (SLIDE_DURATION / 100)), 100))
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

      <div style={{ flex: 1, padding: '20px 60px 50px', position: 'relative' }}>
        {currentSlide === 0 && <SlideReceitas data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 1 && <SlideMapa data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 2 && <SlideVendedores data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} range={[0, 6]} />}
        {currentSlide === 3 && <SlideVendedores data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} range={[6, 12]} />}
        {currentSlide === 4 && <SlideMetas data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 5 && <SlideOrcamento data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
        {currentSlide === 6 && <SlideFluxo data={data} mes={mes} t={t} ultimoMes={ultimoMesRealizado} />}
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

  const totalYTD = useMemo(() => {
    const subset = periodData2026.filter(p => p.mes <= ultimoMes)
    return subset.reduce((acc, p) => acc + (p.vendas + p.servicos + p.locacao - Math.abs(p.devolucoes || 0)), 0)
  }, [periodData2026, ultimoMes])

  const performanceMensal = useMemo(() => {
    const nomesMeses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    return nomesMeses.map((nome, i) => {
      const mesNum = i + 1
      const realObj = periodData2026.find(p => p.mes === mesNum)
      const metaObj = metaData.find(md => md.mes === mesNum)
      const real = realObj ? (realObj.vendas + realObj.servicos + realObj.locacao - Math.abs(realObj.devolucoes || 0)) : 0
      const meta = metaObj?.meta || 0
      const p = meta > 0 ? (real / meta) * 100 : 0
      return { label: nome, meta, real, pct: p, realizado: mesNum <= ultimoMes }
    })
  }, [periodData2026, metaData, ultimoMes])

  const fmtM = (v) => `R$ ${(v / 1_000_000).toFixed(2)}M`

  return (
    <div className="slide-enter" style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: 30, height: 650 }}>
      
      {/* Coluna Esquerda: KPIs + Receita Bruta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {/* Topo - KPIs 4 Colunas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          <KpiCardTV label="VENDAS" value={v.vendas} icon={ShoppingCart} color={t.accent} t={t} />
          <KpiCardTV label="SERVIÇOS" value={v.servicos} icon={Wrench} color={t.accent} t={t} />
          <KpiCardTV label="LOCAÇÃO" value={v.locacao} icon={Key} color={t.accent} t={t} />
          <KpiCardTV label="DEVOLUÇÃO" value={v.devolucao} icon={RotateCcw} color={t.red} t={t} />
        </div>

        {/* Resumo Receita Bruta */}
        <div style={{ flex: 1, background: t.card, borderRadius: 32, border: `1.5px solid ${t.border}`, display: 'flex', flexDirection: 'column', padding: 40, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ flex: 1 }}>
               <h2 style={{ fontSize: 24, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 15 }}>Receita bruta</h2>
               <p style={{ fontSize: 90, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: -3 }}>{fmt(total)}</p>
               
               <div style={{ marginTop: 30 }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', marginBottom: 10 }}>Acumulado Jan - {performanceMensal[ultimoMes-1].label}</p>
                  <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: 0 }}>{fmt(totalYTD)}</p>
               </div>

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

            <div style={{ width: 280, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: 'Vendas', value: v.vendas }, { name: 'Outros', value: (v.servicos + v.locacao) }]} innerRadius={100} outerRadius={130} paddingAngle={5} dataKey="value">
                      <Cell fill={t.accent} />
                      <Cell fill="rgba(255,255,255,0.1)" />
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
               <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: t.textMuted, margin: 0 }}>MENSAL</p>
                  <p style={{ fontSize: 42, fontWeight: 900, margin: 0 }}>{pct.toFixed(0)}%</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna Direita: PERFORMANCE MENSAL Tabela (Altura Total) */}
      <div style={{ background: t.card, borderRadius: 32, border: `1.5px solid ${t.border}`, padding: '40px 35px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 25, color: '#fff' }}>Performance Mensal</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 60px', paddingBottom: 15, borderBottom: `1px solid ${t.border}`, marginBottom: 15, opacity: 0.6, color: '#fff' }}>
            <span style={{ fontSize: 11, fontWeight: 900 }}>MÊS</span>
            <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'right' }}>META</span>
            <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'right' }}>REAL.</span>
            <span style={{ fontSize: 11, fontWeight: 900, textAlign: 'right' }}>%</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {performanceMensal.map((m, i) => (
              <div key={m.label} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 60px', alignItems: 'center', opacity: m.realizado ? 1 : 0.3, color: '#fff', padding: '5px 0' }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{m.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', opacity: 0.8 }}>{fmtM(m.meta)}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, textAlign: 'right' }}>{m.realizado ? fmtM(m.real) : '—'}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, textAlign: 'right', color: m.realizado ? (m.pct >= 100 ? t.green : '#ff9800') : '#fff' }}>
                    {m.realizado ? `${m.pct.toFixed(0)}%` : '—'}
                  </span>
              </div>
            ))}
          </div>
      </div>

    </div>
  )
}

function SlideMapa({ data, mes, t, ultimoMes }) {
  const targetMes = mes === 'all' ? ultimoMes : Number(mes)
  const periodData2026 = data?.byPeriod?.filter(p => p.ano === 2026) || []
  const stateData = data?.byState?.filter(s => s.ano === 2026 && (mes === 'all' ? s.mes <= targetMes : s.mes === targetMes)) || []
  
  // Cálculo Histórico por Região
  const regioesHistorico = useMemo(() => {
    const mesesDisponiveis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(m => m <= ultimoMes)
    const result = {}
    
    Object.keys(REGIOES_MAP).forEach(reg => {
      result[reg] = { total: 0 }
      mesesDisponiveis.forEach(m => result[reg][m] = 0)
    })

    const allData = data?.byState?.filter(s => s.ano === 2026 && s.mes <= ultimoMes) || []
    allData.forEach(s => {
      for (const [reg, estados] of Object.entries(REGIOES_MAP)) {
        if (estados.includes(s.estado)) {
          if (result[reg]) {
            if (s.mes <= ultimoMes) result[reg][s.mes] = (result[reg][s.mes] || 0) + (s.faturamento || 0)
            result[reg].total += (s.faturamento || 0)
          }
          break
        }
      }
    })
    return { data: result, meses: mesesDisponiveis }
  }, [data, ultimoMes])

  const totalOficialPeriodo = useMemo(() => {
    const subset = periodData2026.filter(p => mes === 'all' ? p.mes <= ultimoMes : String(p.mes) === String(mes))
    return subset.reduce((acc, p) => acc + (p.vendas + p.servicos + p.locacao - Math.abs(p.devolucoes || 0)), 0)
  }, [periodData2026, mes, ultimoMes])

  const fmtClean = (v) => fmt(v).replace('R$ ', '')
  const nomesMesesReduzidos = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

  // Largura dinâmica exata: 160(regiao) + (meses * 110) + 150(total) + 40(padding card) + (meses * 2px gap)
  const leftWidth = 160 + (regioesHistorico.meses.length * 110) + 150 + 40 + (regioesHistorico.meses.length * 2)

  const rowStyle = (i) => ({
    display: 'grid',
    gridTemplateColumns: `160px repeat(${regioesHistorico.meses.length}, 110px) 150px`,
    gap: '2px',
    alignItems: 'center',
    height: 60,
    padding: '0 20px',
    borderRadius: 12,
    background: i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
    marginBottom: 5
  })

  return (
    <div className="slide-enter" style={{ height: 650, display: 'grid', gridTemplateColumns: `${leftWidth}px 1fr`, gap: 40 }}>
      
      {/* Lado Esquerdo: DESEMPENHO POR REGIÃO (Integrado Ponta a Ponta) */}
      <div style={{ background: t.card, borderRadius: 32, border: `1.5px solid ${t.border}`, padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 25, letterSpacing: 2, textAlign: 'center' }}>
            Desempenho por Região
          </h3>
          
          {/* Cabeçalho */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `160px repeat(${regioesHistorico.meses.length}, 110px) 150px`, 
            gap: '2px',
            padding: '0 20px 15px', opacity: 0.6, color: '#fff' 
          }}>
            <span style={{ fontSize: 12, fontWeight: 900 }}>REGIÃO</span>
            {regioesHistorico.meses.map(m => (
              <span key={m} style={{ fontSize: 12, fontWeight: 900, textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingRight: 10 }}>{nomesMesesReduzidos[m-1]}</span>
            ))}
            <span style={{ fontSize: 12, fontWeight: 900, textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', color: t.accent, paddingRight: 45 }}>TOTAL</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {Object.entries(regioesHistorico.data).sort((a, b) => b[1].total - a[1].total).map(([reg, vals], i) => (
              <div key={reg} style={rowStyle(i)}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{reg}</span>
                  {regioesHistorico.meses.map(m => (
                    <span key={m} style={{ fontSize: 18, fontWeight: 900, textAlign: 'right', color: '#fff', opacity: vals[m] > 0 ? 1 : 0.2, borderLeft: '1px solid rgba(255,255,255,0.05)', paddingRight: 10, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {vals[m] > 0 ? fmtClean(vals[m]) : '0'}
                    </span>
                  ))}
                  <span style={{ fontSize: 18, fontWeight: 900, textAlign: 'right', color: t.accent, borderLeft: '1px solid rgba(255,255,255,0.05)', paddingRight: 45, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    {fmtClean(vals.total)}
                  </span>
              </div>
            ))}
          </div>
      </div>

      {/* Lado Direito: MAPA */}
      <div style={{ 
        background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, 
        padding: 50, position: 'relative', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
         <div style={{ position: 'absolute', top: 40, left: 40 }}>
            <p style={{ fontSize: 16, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0, letterSpacing: 1 }}>Receita bruta</p>
            <p style={{ fontSize: 48, fontWeight: 900, color: t.accent, margin: 0 }}>{fmt(totalOficialPeriodo)}</p>
         </div>

         <div style={{ marginTop: '80px', width: '100%' }}>
            <MapaHeatBrasil stateData={stateData} darkMode={true} isTVMode={true} />
         </div>
      </div>

    </div>
  )
}

function SlideVendedores({ data, mes, t, ultimoMes, range = [0, 6] }) {
  const targetMes = mes === 'all' ? ultimoMes : Number(mes)
  const sellers = data?.bySeller || []
  
  const vendedorasData = useMemo(() => {
    const raw = sellers
      .filter(s => s.ano === 2026 && s.mes <= ultimoMes)
      .reduce((acc, curr) => {
        if (!acc[curr.vendedor]) acc[curr.vendedor] = { total: 0, meses: {} }
        acc[curr.vendedor].total += (curr.valor || curr.vendas || 0)
        acc[curr.vendedor].meses[curr.mes] = (curr.valor || curr.vendas || 0)
        return acc
      }, {})
    
    return Object.entries(raw)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.total - a.total)
      .slice(range[0], range[1])
  }, [sellers, ultimoMes, range])

  const fmtClean = (v) => fmt(v).replace('R$ ', '')
  const mesesAbreviados = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

  return (
    <div className="slide-enter" style={{ height: 650, display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${vendedorasData.length}, 1fr)`, gap: 20, width: '100%', height: 610 }}>
        {vendedorasData.map((s, i) => (
          <div key={s.name} style={{ 
            background: t.card, 
            borderRadius: 32, 
            border: `2px solid ${t.border}`, 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            position: 'relative',
            overflow: 'hidden',
            height: '100%'
          }}>
            {/* Foto no Topo */}
            <div style={{ 
              width: '100%', 
              height: 250, 
              overflow: 'hidden',
              background: '#1a1a24',
              position: 'relative'
            }}>
              {PHOTO_MAP[s.name] ? (
                <img src={PHOTO_MAP[s.name]} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60, fontWeight: 900, opacity: 0.2 }}>
                  {s.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Faixa de Nome */}
            <div style={{ 
              background: '#000000', 
              padding: '15px 10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderBottom: `1px solid ${t.border}`
            }}>
              <h4 style={{ 
                fontSize: 18, 
                fontWeight: 900, 
                textAlign: 'center', 
                margin: 0, 
                color: '#fff', 
                textTransform: 'uppercase', 
                letterSpacing: 1 
              }}>
                {s.name.split(' ').slice(0, 2).join(' ')}
              </h4>
            </div>

            {/* Histórico Mensal + TOTAL */}
            <div style={{ padding: '20px 20px 25px 20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: '25px 20px' }}>
                {[1, 2, 3, 4].map(m => (
                  <div key={m} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                    <span style={{ fontSize: 18, fontWeight: 900, color: t.textMuted }}>{mesesAbreviados[m-1]}</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', opacity: s.meses[m] > 0 ? 1 : 0.2 }}>
                      {s.meses[m] > 0 ? fmtClean(s.meses[m]) : '0'}
                    </span>
                  </div>
                ))}
                
                {/* Linha do TOTAL abaixo de Abril */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, paddingTop: 5 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>TOTAL</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: t.accent }}>
                    {fmtClean(s.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
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
  const cleanVal = fmt(value).replace('R$ ', '')
  return (
    <div style={{ background: t.card, borderRadius: 24, border: `1px solid ${t.border}`, padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 30 }}>
      <div style={{ background: color, padding: 15, borderRadius: 16 }}> <Icon size={36} color="#fff" /> </div>
      <div>
         <p style={{ fontSize: 16, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', margin: 0 }}>{label}</p>
         <p style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>{cleanVal}</p>
      </div>
    </div>
  )
}

function SlideFluxo({ data, mes, t, ultimoMes }) {
  const curMes = mes === 'all' ? ultimoMes : parseInt(mes)
  const m = data?.fluxo?.mensal?.[String(curMes)] || data?.fluxo?.mensal?.[curMes] || {}
  
  const chartData = useMemo(() => {
    if (!data?.fluxo?.mensal) return []
    return Object.entries(data.fluxo.mensal)
      .map(([m, val]) => ({
        name: MESES_LABELS[parseInt(m)-1].substring(0, 3).toUpperCase(),
        monthNum: parseInt(m),
        saldo: val.saldo_final?.real || 0,
        entradas: val.total_entradas?.real || 0,
        saidas: Math.abs(val.total_saidas?.real || 0)
      }))
      .filter(d => d.monthNum <= (mes === 'all' ? ultimoMes : parseInt(mes)))
  }, [data, mes, ultimoMes])

  const kpis = [
    { label: 'Saldo Inicial', val: m.saldo_inicial?.real || 0, icon: Wallet, color: '#fff' },
    { label: 'Entradas', val: m.total_entradas?.real || 0, icon: ArrowUpRight, color: t.green },
    { label: 'Saídas', val: Math.abs(m.total_saidas?.real || 0), icon: ArrowDownRight, color: t.red },
    { label: 'Geração de Caixa', val: m.geracao_caixa?.real || 0, icon: Activity, color: t.accent },
    { label: 'Disponibilidade Final', val: m.saldo_final?.real || 0, icon: DollarSign, color: t.accent }
  ]

  return (
    <div className="slide-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ 
            background: t.card, borderRadius: 24, border: `1px solid ${t.border}`, 
            padding: 30, display: 'flex', flexDirection: 'column', gap: 10,
            boxShadow: i === 4 ? `0 0 30px ${t.accent}33` : 'none',
            borderColor: i === 4 ? t.accent : t.border
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
               <k.icon size={20} color={k.color} />
               <span style={{ fontSize: 14, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{k.label}</span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 900, color: k.color, margin: 0 }}>{fmt(k.val)}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, background: t.card, borderRadius: 32, border: `1px solid ${t.border}`, padding: 40, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: t.accent, textTransform: 'uppercase', marginBottom: 30, letterSpacing: 2 }}>Tendência de Disponibilidade</h3>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={t.accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={t.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: t.textMuted, fontSize: 14, fontWeight: 900 }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ background: '#000', border: `1px solid ${t.accent}`, borderRadius: 12 }}
                itemStyle={{ color: '#fff', fontSize: 16, fontWeight: 900 }}
              />
              <Area type="monotone" dataKey="saldo" stroke={t.accent} strokeWidth={4} fillOpacity={1} fill="url(#colorSaldo)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
