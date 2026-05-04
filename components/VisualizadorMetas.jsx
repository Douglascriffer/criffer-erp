'use client'
import React, { useMemo } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend, LineChart, Line, ComposedChart, Area
} from 'recharts'
import { Target, TrendingUp, AlertCircle, CheckCircle2, ArrowRightCircle } from 'lucide-react'

const fmtBRL = (v) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(1)}k`
  return `R$ ${v.toFixed(2)}`
}

const fmtBRLShort = (v) => {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`
  return `R$ ${v.toFixed(0)}`
}

const fmtPct = (v) => `${v.toFixed(1)}%`

const translateMonth = (label) => {
  const map = {
    'Jan': 'JAN', 'Feb': 'FEV', 'Mar': 'MAR', 'Apr': 'ABR', 
    'May': 'MAI', 'Jun': 'JUN', 'Jul': 'JUL', 'Aug': 'AGO', 
    'Sep': 'SET', 'Oct': 'OUT', 'Nov': 'NOV', 'Dec': 'DEZ'
  }
  return map[label] || label.toUpperCase()
}

function ThSmall({ children, align = 'left' }) {
  return (
    <th style={{ padding: '12px 20px', fontSize: 10, fontWeight: 900, color: '#888', letterSpacing: 1, textAlign: align }}>{children}</th>
  )
}

function TdSmall({ children, align = 'left', style }) {
  return (
    <td style={{ padding: '12px 20px', fontSize: 13, color: 'inherit', textAlign: align, ...style }}>{children}</td>
  )
}

export default function VisualizadorMetas({ data, filters, darkMode }) {
  const t = {
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#cccccc' : '#666666',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    card: darkMode ? '#1e1e2d' : '#ffffff',
    accent: '#FF6A22'
  }

  const metasAnuais = useMemo(() => {
    if (!data?.meta || !filters.ano) return []
    const raw = data.meta[filters.ano] || []
    return raw.map(m => ({
      ...m,
      labelPT: translateMonth(m.label)
    }))
  }, [data, filters.ano])

  const stats = useMemo(() => {
    const realizadoTotal = metasAnuais.reduce((acc, m) => acc + (m.realizado || 0), 0)
    const metaTotal = metasAnuais.reduce((acc, m) => acc + (m.meta || 0), 0)
    const pctGeral = metaTotal > 0 ? (realizadoTotal / metaTotal) * 100 : 0
    const gap = Math.max(0, metaTotal - realizadoTotal)
    
    // Projeção (Run Rate) baseada nos meses que já tiveram faturamento
    const mesesComFaturamento = metasAnuais.filter(m => m.realizado > 0).length
    const mediaMensal = mesesComFaturamento > 0 ? realizadoTotal / mesesComFaturamento : 0
    const projecaoAnual = mediaMensal * 12

    return { realizadoTotal, metaTotal, pctGeral, gap, projecaoAnual, mesesComFaturamento }
  }, [metasAnuais])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      
      {/* ── HEADER DE KPIS PREMIUM ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KpiCard 
          label="REALIZADO ACUMULADO" 
          value={fmtBRL(stats.realizadoTotal)} 
          sub={`Meta: ${fmtBRL(stats.metaTotal)}`}
          icon={TrendingUp} 
          color={t.accent} 
          darkMode={darkMode}
          snakeBorder={true}
        />
        <KpiCard 
          label="ATINGIMENTO GERAL" 
          value={fmtPct(stats.pctGeral)} 
          sub={stats.pctGeral >= 100 ? "Meta Batida!" : `${fmtPct(100 - stats.pctGeral)} para o alvo`}
          icon={Target} 
          color="#22c55e" 
          darkMode={darkMode}
        />
        <KpiCard 
          label="GAP PARA O OBJETIVO" 
          value={fmtBRL(stats.gap)} 
          sub="Restante para fechar o ano"
          icon={AlertCircle} 
          color="#ef4444" 
          darkMode={darkMode}
        />
        <KpiCard 
          label="PROJEÇÃO (RUN RATE)" 
          value={fmtBRL(stats.projecaoAnual)} 
          sub={`Tendência: ${fmtPct((stats.projecaoAnual / stats.metaTotal) * 100)} da meta`}
          icon={ArrowRightCircle} 
          color="#3b82f6" 
          darkMode={darkMode}
        />
      </div>

      {/* ── CONTEÚDO PRINCIPAL: GRÁFICO + TABELA LADO A LADO ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: GRÁFICO */}
        <div style={{ 
          background: t.card, 
          borderRadius: 12, 
          border: `1.5px solid ${t.border}`, 
          padding: 24,
          height: 520,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, letterSpacing: -0.5 }}>EVOLUÇÃO ANUAL DE METAS</h3>
              <p style={{ fontSize: 12, color: t.textSub }}>Objetivos vs Resultados</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
               <LegendItem label="Realizado" color={t.accent} />
               <LegendItem label="Meta" color={darkMode ? '#fff' : '#000'} isLine />
            </div>
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={metasAnuais}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                <XAxis 
                  dataKey="labelPT" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textSub, fontSize: 11, fontWeight: 700 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textSub, fontSize: 10, fontWeight: 600 }}
                  tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: 'rgba(255,106,34,0.05)' }} />
                
                <Bar 
                  dataKey="realizado" 
                  fill={t.accent} 
                  radius={[4, 4, 0, 0]} 
                  barSize={24}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke={darkMode ? '#fff' : '#000'} 
                  strokeWidth={3} 
                  dot={{ r: 3, strokeWidth: 2, fill: t.card }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COLUNA DIREITA: TABELA COMPACTA */}
        <div style={{ 
          background: t.card, 
          borderRadius: 12, 
          border: `1.5px solid ${t.border}`, 
          padding: 0,
          height: 520,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${t.border}`, background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, color: t.text, letterSpacing: 0.5 }}>PERFORMANCE MENSAL</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  <ThSmall>MÊS</ThSmall>
                  <ThSmall>META</ThSmall>
                  <ThSmall>REAL.</ThSmall>
                  <ThSmall align="right">%</ThSmall>
                </tr>
              </thead>
              <tbody>
                {metasAnuais.map((m, idx) => {
                  const pct = m.meta > 0 ? (m.realizado / m.meta) * 100 : 0
                  const isFuture = m.realizado === 0 && m.mes > stats.mesesComFaturamento

                  return (
                    <tr key={idx} style={{ 
                      borderBottom: `1px solid ${t.border}`,
                      opacity: isFuture ? 0.4 : 1,
                    }}>
                      <TdSmall style={{ fontWeight: 800 }}>{m.labelPT}</TdSmall>
                      <TdSmall>{fmtBRLShort(m.meta)}</TdSmall>
                      <TdSmall style={{ fontWeight: 700, color: m.realizado > 0 ? t.text : t.textSub }}>
                        {m.realizado > 0 ? fmtBRLShort(m.realizado) : '—'}
                      </TdSmall>
                      <TdSmall align="right">
                        {!isFuture ? (
                          <span style={{ 
                            color: pct >= 100 ? '#22c55e' : (pct >= 80 ? '#f59e0b' : '#ef4444'),
                            fontWeight: 900,
                            fontSize: 12
                          }}>
                            {pct.toFixed(0)}%
                          </span>
                        ) : (
                          <span style={{ color: t.textSub, fontSize: 10 }}>—</span>
                        )}
                      </TdSmall>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

function KpiCard({ label, value, sub, icon: Icon, color, darkMode, snakeBorder }) {
  const bg = darkMode ? '#1e1e2d' : '#ffffff'
  const border = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'

  return (
    <div style={{
      background: bg,
      borderRadius: 12,
      padding: '24px',
      border: `1.5px solid ${border}`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    }}>
      {snakeBorder && (
        <>
          <div style={{
            position: 'absolute',
            top: -2, left: -2, right: -2, bottom: -2,
            background: `linear-gradient(90deg, transparent, transparent, ${color}, ${color})`,
            backgroundSize: '200% 200%',
            animation: 'borderRotate 4s linear infinite',
            zIndex: 0,
            borderRadius: 12
          }} />
          <div style={{
            position: 'absolute',
            top: 1.5, left: 1.5, right: 1.5, bottom: 1.5,
            background: bg,
            zIndex: 1,
            borderRadius: 10
          }} />
        </>
      )}
      
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: darkMode ? '#888' : '#666', letterSpacing: 1 }}>{label}</p>
          <Icon size={18} color={color} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: darkMode ? '#fff' : '#000', margin: '4px 0' }}>{value}</h2>
        <p style={{ fontSize: 11, color: darkMode ? '#666' : '#999', fontWeight: 600 }}>{sub}</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes borderRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      ` }} />
    </div>
  )
}

function LegendItem({ label, color, isLine }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ 
        width: isLine ? 24 : 12, 
        height: isLine ? 3 : 12, 
        borderRadius: isLine ? 2 : 3, 
        background: color 
      }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: 'inherit' }}>{label}</span>
    </div>
  )
}

function Th({ children, align = 'left' }) {
  return (
    <th style={{ 
      padding: '16px 24px', 
      fontSize: 11, 
      fontWeight: 900, 
      color: '#888', 
      letterSpacing: 1, 
      textAlign: align 
    }}>{children}</th>
  )
}

function Td({ children, align = 'left', style }) {
  return (
    <td style={{ 
      padding: '20px 24px', 
      fontSize: 14, 
      color: 'inherit', 
      textAlign: align,
      ...style 
    }}>{children}</td>
  )
}

function CustomTooltip({ active, payload, darkMode }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  const pct = data.meta > 0 ? (data.realizado / data.meta) * 100 : 0

  return (
    <div style={{
      background: darkMode ? '#1a1a2d' : '#fff',
      padding: 16,
      borderRadius: 12,
      border: 'none',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      minWidth: 200
    }}>
      <p style={{ fontWeight: 900, fontSize: 14, marginBottom: 12, color: '#FF6A22' }}>{data.labelPT}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
          <span style={{ fontSize: 12, color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>META:</span>
          <span style={{ fontSize: 12, fontWeight: 800 }}>{fmtBRL(data.meta)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
          <span style={{ fontSize: 12, color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>REALIZADO:</span>
          <span style={{ fontSize: 12, fontWeight: 800 }}>{fmtBRL(data.realizado)}</span>
        </div>
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#FF6A22', fontWeight: 900 }}>ATINGIMENTO:</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#FF6A22' }}>{pct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
