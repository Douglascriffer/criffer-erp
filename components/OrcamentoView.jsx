'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { Activity, TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  return `R$ ${Math.round(Math.abs(v)).toLocaleString('pt-BR')}`
}

function TipLinha({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: darkMode ? '#1a1a1a' : '#ffffff',
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: 13,
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      color: darkMode ? '#fff' : '#000'
    }}>
      <p style={{ color: '#FF6A22', marginBottom: 8, fontWeight: 900 }}>{label}</p>
      {payload.filter(p => p.value != null).map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }}/>
            <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 800 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}export default function OrcamentoView({ mes='all', data, darkMode=false, viewType='dre' }) {
  const orcamento = data?.orcamento || {}
  
  // ── LOGICA DE TRAVA POR SETOR ──
  const [userContext, setUserContext] = useState({ level: 'master', sector: '' })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const level = localStorage.getItem('criffer_user_level') || 'master'
      const sector = localStorage.getItem('criffer_sector') || ''
      setUserContext({ level, sector })
    }
  }, [])

  // Mapeamento de Setor Login -> Centro de Custo Excel
  const mapSectorToCC = (sector) => {
    const map = {
      'Laboratório Calibração':   'Lab. Calibração',
      'Laboratório de Manutenção': 'Lab. Manutenção',
      'Vendas':                   'Comercial',
      'Suporte Técnico':          'Sup. Técnico',
      'Diretoria':                'Diretoria',
      'Financeiro':               'Financeiro',
      'TI':                       'TI',
      'Produção':                 'Produção',
      'Compras':                  'Compras',
      'Manutenção':               'Manutenção',
      'Logística':                'Logística',
      'Marketing':                'Marketing',
      'P&D':                      'P&D'
    }
    return map[sector] || sector
  }

  // Derivar DADOS dinamicamente
  const dynamicDados = useMemo(() => {
    const res = {}
    if (!orcamento?.mensal) return {}

    const targetCC = mapSectorToCC(userContext.sector)

    Object.entries(orcamento.mensal).forEach(([key, mData]) => {
      const monthNum = key.split('_')[1]
      const period = data?.byPeriod?.find(p => p.ano === 2026 && p.mes === Number(monthNum))
      const meta   = data?.meta?.['2026']?.find(m => m.mes === Number(monthNum))

      // Filtrar centros se for gestor
      let filteredCentros = mData.centros
      if (userContext.level === 'gestor' && targetCC) {
        filteredCentros = mData.centros.filter(c => c.cc === targetCC)
      }

      res[monthNum] = {
        recReal:  period?.total || 0,
        recMeta:  meta?.meta || 0,
        despReal: filteredCentros.reduce((s, c) => s + c.real, 0),
        despOrc:  filteredCentros.reduce((s, c) => s + c.orc, 0),
        centros:  filteredCentros
      }
    })

    const validMonths = Object.values(res)
    res['all'] = {
      recReal:  validMonths.reduce((s, v) => s + v.recReal, 0),
      recMeta:  validMonths.reduce((s, v) => s + v.recMeta, 0),
      despReal: validMonths.reduce((s, v) => s + v.despReal, 0),
      despOrc:  validMonths.reduce((s, v) => s + v.despOrc, 0),
      centros:  orcamento.mensal['2026_1']?.centros
        .filter(c => userContext.level === 'master' || c.cc === targetCC)
        .map(c => ({
          cc: c.cc,
          orc: validMonths.reduce((s, v) => s + (v.centros?.find(cc => cc.cc === c.cc)?.orc || 0), 0),
          real: validMonths.reduce((s, v) => s + (v.centros?.find(cc => cc.cc === c.cc)?.real || 0), 0)
        })) || []
    }
    return res
  }, [data, orcamento, userContext])

  const dados = dynamicDados[mes] || dynamicDados['all'] || { centros: [] }
  const { recReal, recMeta, despReal, despOrc } = dados
  const resultado = (recReal || 0) - (despReal || 0)
  const resPos    = resultado >= 0
  
  const mensalLinha = useMemo(() => {
    return [1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
      const d = dynamicDados[m]
      const label = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][m-1]
      return {
        mes: label,
        receita: d?.recReal || null,
        despesa: d?.despReal || null,
        meta: d?.recMeta || null
      }
    })
  }, [dynamicDados])

  const t = {
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#cccccc' : '#666666',
    textMuted: darkMode ? '#666666' : '#999999',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    card: darkMode ? 'rgba(255,255,255,0.02)' : '#ffffff',
    accent: '#FF6A22',
    bg: darkMode ? '#0c0c14' : '#f8f9fa'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: "'Gotham', sans-serif" }}>
      
      {/* ── VISÃO DRE SIMPLIFICADO ── */}
      {viewType === 'dre' && (
        <>
          {/* GRID DE KPIS SUPERIORES (5 CARDS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            
            {/* Card 1: Resultado Líquido */}
            <div style={{ 
              background: resPos 
                ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' 
                : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              borderRadius: 20, padding: 24, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 140, position: 'relative', overflow: 'hidden'
            }}>
              <p style={{ fontSize: 10, fontWeight: 900, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Resultado Operacional</p>
              <p style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>{fmt(resultado)}</p>
              <div style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 10, width: 'fit-content' }}>
                {resPos ? 'Performance Positiva' : 'Abaixo do Esperado'}
              </div>
            </div>

            {/* Card 2: Receitas Líquidas */}
            <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Receitas Líquidas</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: t.text }}>{fmt(recReal)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <div style={{ flex: 1, height: 6, background: darkMode ? '#333' : '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: t.accent, width: `${Math.min((recReal||0)/(recMeta||1)*100, 100)}%` }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 900, color: t.text }}>{Math.round((recReal||0)/(recMeta||1)*100)}%</span>
              </div>
            </div>

            {/* Card 3: Variação de Receita (NOVO) */}
            {(() => {
              const diff = (recReal || 0) - (recMeta || 0)
              const pct = recMeta > 0 ? (diff / recMeta * 100) : 0
              const ok = diff >= 0
              return (
                <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontSize: 10, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                    {mes === 'all' ? 'Variação Acumulada' : 'Variação Mensal'}
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 900, color: ok ? '#22c55e' : '#ef4444' }}>
                    {ok ? '+' : ''}{pct.toFixed(1)}%
                  </p>
                  <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginTop: 4 }}>
                    {ok ? '↑' : '↓'} {fmt(Math.abs(diff))} {ok ? 'acima da meta' : 'abaixo da meta'}
                  </p>
                </div>
              )
            })()}

            {/* Card 4: Despesas Totais */}
            <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Despesas Totais</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: t.text }}>{fmt(despReal)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <div style={{ flex: 1, height: 6, background: darkMode ? '#333' : '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: (despReal||0) <= (despOrc||0) ? '#22c55e' : '#ef4444', width: `${Math.min((despReal||0)/(despOrc||1)*100, 100)}%` }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 900, color: t.text }}>{Math.round((despReal||0)/(despOrc||1)*100)}%</span>
              </div>
            </div>

            {/* Card 5: Redução de Despesas (NOVO) */}
            {(() => {
              const economizado = (despOrc || 0) - (despReal || 0)
              const pct = despOrc > 0 ? (economizado / despOrc * 100) : 0
              const ok = economizado >= 0
              return (
                <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <p style={{ fontSize: 10, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                    {mes === 'all' ? 'Redução Acumulada' : 'Redução Mensal'}
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 900, color: ok ? '#22c55e' : '#ef4444' }}>
                    {pct.toFixed(1)}%
                  </p>
                  <p style={{ fontSize: 12, color: t.textMuted, fontWeight: 700, marginTop: 4 }}>
                    {ok ? '↓' : '↑'} {fmt(Math.abs(economizado))} {ok ? 'economizados' : 'acima do orçado'}
                  </p>
                </div>
              )
            })()}

          </div>

          {/* Gráfico de Tendência Orçamentária */}
          <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Tendência Orçamentária 2026</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: t.accent }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.accent }} /> RECEITA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#ef4444' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /> DESPESA
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={mensalLinha} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.textMuted, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<TipLinha darkMode={darkMode} />} />
                <Line type="monotone" dataKey="receita" name="Receita" stroke={t.accent} strokeWidth={5} dot={{ r: 6, fill: t.accent, stroke: '#fff' }} />
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* ── VISÃO CENTRO DE CUSTO ── */}
      {viewType === 'cc' && (
        <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Detalhamento por Centro de Custo {userContext.level === 'gestor' ? `(${userContext.sector})` : ''}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: t.accent, background: 'rgba(255,106,34,0.1)', padding: '6px 12px', borderRadius: 12 }}>
              <BarChart3 size={16} /> {dados.centros?.length || 0} Setores Ativos
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: darkMode ? '#1a1a25' : '#f8f9fa', zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Centro de Custo</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Orçado</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Realizado</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Variação</th>
                </tr>
              </thead>
              <tbody>
                {dados.centros?.map((c, i) => {
                  const diff = c.orc > 0 ? ((c.real - c.orc) / c.orc * 100) : 0
                  const ok = diff <= 0
                  return (
                    <tr key={c.cc} style={{ borderBottom: `1px solid ${t.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                      <td style={{ padding: '20px 32px', fontSize: 14, fontWeight: 700, color: t.text }}>{c.cc}</td>
                      <td style={{ padding: '20px 32px', textAlign: 'right', fontSize: 13, color: t.textMuted }}>{fmt(c.orc)}</td>
                      <td style={{ padding: '20px 32px', textAlign: 'right', fontSize: 14, fontWeight: 900, color: t.text }}>{fmt(c.real)}</td>
                      <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: ok ? '#22c55e' : '#ef4444', background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '6px 12px', borderRadius: 20 }}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
