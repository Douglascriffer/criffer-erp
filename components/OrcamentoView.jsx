'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
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
            <span style={{ color: darkMode ? '#ffffff' : '#666666', fontWeight: 600 }}>{p.name}</span>
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
      const level = localStorage.getItem('criffer_role') || 'master'
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
      'P&D':                      'P&D',
      'RH':                       'RH'
    }
    return map[sector] || sector
  }

  // Derivar DADOS dinamicamente
  const dynamicDados = useMemo(() => {
    const res = {}
    if (!orcamento?.mensal) return {}

    // 1. Inicializar estrutura básica para todos os 12 meses
    for (let m = 1; m <= 12; m++) {
      res[m] = { recReal: 0, recMeta: 0, despReal: 0, despOrc: 0, centros: [] };
    }

    const targetCC = mapSectorToCC(userContext.sector)

    Object.entries(orcamento.mensal).forEach(([key, mData]) => {
      const monthNum = Number(key.split('_')[1]);
      if (!monthNum) return;

      const period = data?.byPeriod?.find(p => p.ano === 2026 && p.mes === monthNum);
      const meta   = data?.meta?.['2026']?.find(m => m.mes === monthNum);

      let filteredCentros = mData.centros || [];
      // REMOVIDO: Filtro por setor aqui estava afetando o DRE total. 
      // O filtro será aplicado apenas na visualização de Centro de Custo.

      res[monthNum] = {
        recReal:  period?.total || 0,
        recMeta:  meta?.meta || 0,
        despReal: filteredCentros.reduce((s, c) => s + (c.real || 0), 0),
        despOrc:  filteredCentros.reduce((s, c) => s + (c.orc || 0), 0),
        centros:  filteredCentros
      };
    });

    // 3. Criar Versão Acumulada
    for (let m = 1; m <= 12; m++) {
      const monthsUpToNow = [1,2,3,4,5,6,7,8,9,10,11,12].filter(v => v <= m);
      
      const accObj = {
        recReal:  monthsUpToNow.reduce((s, k) => s + (res[k]?.recReal || 0), 0),
        recMeta:  monthsUpToNow.reduce((s, k) => s + (res[k]?.recMeta || 0), 0),
        despReal: monthsUpToNow.reduce((s, k) => s + (res[k]?.despReal || 0), 0),
        despOrc:  monthsUpToNow.reduce((s, k) => s + (res[k]?.despOrc || 0), 0),
        centros: []
      };

      accObj.centros = (res[1]?.centros || []).map(c => {
        const ccName = c.cc;
        // Calcular acumulado para cada categoria também
        const categories = (c.categories || []).map(cat => {
          const catName = cat.name;
          return {
            name: catName,
            orc:  monthsUpToNow.reduce((s, k) => s + (res[k]?.centros?.find(cc => cc.cc === ccName)?.categories?.find(ct => ct.name === catName)?.orc || 0), 0),
            real: monthsUpToNow.reduce((s, k) => s + (res[k]?.centros?.find(cc => cc.cc === ccName)?.categories?.find(ct => ct.name === catName)?.real || 0), 0)
          };
        });

        return {
          cc: ccName,
          orc:  monthsUpToNow.reduce((s, k) => s + (res[k]?.centros?.find(cc => cc.cc === ccName)?.orc || 0), 0),
          real: monthsUpToNow.reduce((s, k) => s + (res[k]?.centros?.find(cc => cc.cc === ccName)?.real || 0), 0),
          categories: categories
        };
      });

      res[`acc_${m}`] = accObj;
    }

    const latestMonthWithData = [1,2,3,4,5,6,7,8,9,10,11,12].reverse().find(m => res[m].despReal > 0) || 1;
    res['all'] = res[`acc_${latestMonthWithData}`];
    res['latestMonth'] = latestMonthWithData;

    return res;
  }, [data, orcamento, userContext])

  const currentAcc = (mes === 'all' ? dynamicDados?.['all'] : dynamicDados?.[`acc_${mes}`]) || {}
  const dados = dynamicDados?.[mes] || dynamicDados?.['all'] || { centros: [] }
  const { recReal, recMeta, despReal, despOrc } = dados
  const resultado = (recReal || 0) - (despReal || 0)
  const resPos    = resultado >= 0
  
  const mensalLinha = useMemo(() => {
    return [1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
      const d = dynamicDados?.[m]
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
    textSub: darkMode ? '#ffffff' : '#444444',
    textMuted: darkMode ? '#ffffff' : '#666666',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    card: darkMode ? 'rgba(255,255,255,0.08)' : '#ffffff',
    accent: '#FF6A22',
    bg: darkMode ? '#0c0c14' : '#f8f9fa',
    green: '#22c55e',
    red: '#ef4444'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: "'Gotham', sans-serif" }}>
      
      {/* ── VISÃO DRE SIMPLIFICADO ── */}
      {viewType === 'dre' && (
        <>
          {/* GRID DE KPIS SUPERIORES (3 CARDS UNIFICADOS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            
            {/* Card 1: Resultado Líquido */}
            <div style={{ 
              background: resPos 
                ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' 
                : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              borderRadius: 20, padding: 24, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 140, position: 'relative', overflow: 'hidden'
            }}>
              <p style={{ fontSize: 18, fontWeight: 900, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Resultado Operacional</p>
              <p style={{ fontSize: 32, fontWeight: 600, marginBottom: 4 }}>{fmt(resultado)}</p>
              <div style={{ fontSize: 15, fontWeight: 600, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 10, width: 'fit-content' }}>
                {resPos ? 'Performance Positiva' : 'Abaixo do Esperado'}
              </div>
            </div>

            {/* Card 2: Receitas Líquidas + Variação */}
            {(() => {
              const diff = (recReal || 0) - (recMeta || 0)
              const pct = recMeta > 0 ? (diff / recMeta * 100) : 0
              const ok = diff >= 0
              return (
                <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Receitas Líquidas</p>
                  <p style={{ fontSize: 32, fontWeight: 600, color: t.text }}>{fmt(recReal)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: ok ? t.green : t.red }}>
                      {ok ? '+' : ''}{pct.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: 15, color: t.textMuted, fontWeight: 600 }}>
                      {ok ? '↑' : '↓'} {fmt(Math.abs(diff))} {ok ? 'acima da meta' : 'abaixo da meta'}
                    </span>
                  </div>
                </div>
              )
            })()}

            {/* Card 3: Despesas Totais + Redução */}
            {(() => {
              const economizado = (despOrc || 0) - (despReal || 0)
              const pct = despOrc > 0 ? (economizado / despOrc * 100) : 0
              const ok = economizado >= 0
              return (
                <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Despesas Totais</p>
                  <p style={{ fontSize: 32, fontWeight: 600, color: t.text }}>{fmt(despReal)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: ok ? t.green : t.red }}>
                      {pct.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: 15, color: t.textMuted, fontWeight: 600 }}>
                      {ok ? '↓' : '↑'} {fmt(Math.abs(economizado))} {ok ? 'economizados' : 'acima do orçado'}
                    </span>
                  </div>
                </div>
              )
            })()}

          </div>

          {/* ── SEÇÃO INFERIOR: TENDÊNCIA E ACUMULADO ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1.8fr) minmax(300px, 1fr))', gap: 24, marginTop: 8 }}>
            
            {/* Coluna 1: Gráfico de Tendência (65%) */}
            <div style={{ height: 564, background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Tendência Orçamentária 2026</h3>
              </div>
              
              <div style={{ flex: 1, width: '100%', marginBottom: 16 }}>
                <ResponsiveContainer width="100%" height={420}>
                  <BarChart data={mensalLinha} margin={{ top: 10, right: 30, left: -20, bottom: 0 }} barGap={8}>
                    <XAxis dataKey="mes" tick={{ fontSize: 15, fill: t.textSub, fontWeight: 700 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip content={<TipLinha darkMode={darkMode} />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="receita" name="Receita" fill={t.accent} radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="despesa" name="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda na Parte Inferior */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: t.accent }} /> RECEITA
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#ef4444' }} /> DESPESA
                </div>
              </div>
            </div>

            {/* Coluna 2: Painel de Acumulado (35%) */}
            <div style={{ height: 564, background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Acumulado 2026</h3>
                <div style={{ background: 'rgba(255,106,34,0.1)', padding: '4px 12px', borderRadius: 20, fontSize: 15, fontWeight: 600, color: t.accent }}>
                  Jan-{mes === 'all' ? (['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][(dynamicDados?.latestMonth || 1) - 1]) : (['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][Number(mes) - 1])}
                </div>
              </div>

              {/* Resultado Operacional Acumulado (Destaque) */}
              {(() => {
                const resAcc = (currentAcc?.recReal || 0) - (currentAcc?.despReal || 0)
                const resOk = resAcc >= 0
                return (
                  <div style={{ width: '100%', background: resOk ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', borderRadius: 16, padding: '16px 20px', border: `1px solid ${resOk ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}` }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Resultado Operacional Acumulado</p>
                    <p style={{ fontSize: 24, fontWeight: 600, color: resOk ? t.green : t.red }}>{fmt(resAcc)}</p>
                  </div>
                )
              })()}

              {/* Progress: Receitas */}
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.textSub }}>REALIZADO RECEITA</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{fmt(currentAcc?.recReal)}</span>
                </div>
                <div style={{ height: 12, background: darkMode ? '#1a1a25' : '#f0f0f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', background: t.accent, width: `${Math.min((currentAcc?.recReal/currentAcc?.recMeta)*100, 100)}%`, borderRadius: 6 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 15, color: t.textMuted, fontWeight: 500 }}>Meta: {fmt(currentAcc?.recMeta)}</span>
                  <span style={{ fontSize: 15, color: t.accent, fontWeight: 600 }}>
                    {(() => {
                      const pct = (currentAcc?.recReal / currentAcc?.recMeta) * 100 || 0;
                      if (pct >= 100) return `${(pct - 100).toFixed(1)}% acima`;
                      return `${(100 - pct).toFixed(1)}% abaixo`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Progress: Despesas */}
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.textSub }}>REALIZADO DESPESA</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{fmt(currentAcc?.despReal)}</span>
                </div>
                <div style={{ height: 12, background: darkMode ? '#1a1a25' : '#f0f0f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ height: '100%', background: (currentAcc?.despReal <= currentAcc?.despOrc) ? t.green : t.red, width: `${Math.min((currentAcc?.despReal/currentAcc?.despOrc)*100, 100)}%`, borderRadius: 6 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ fontSize: 15, color: t.textMuted, fontWeight: 500 }}>Orçado: {fmt(currentAcc?.despOrc)}</span>
                  <span style={{ fontSize: 15, color: (currentAcc?.despReal <= currentAcc?.despOrc) ? t.green : t.red, fontWeight: 600 }}>
                    {(() => {
                      const pct = (currentAcc?.despReal / currentAcc?.despOrc) * 100 || 0;
                      if (pct >= 100) return `${(pct - 100).toFixed(1)}% acima`;
                      return `${(100 - pct).toFixed(1)}% abaixo`;
                    })()}
                  </span>
                </div>
              </div>

              {/* Economy/Efficiency Circle */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: `1.5px solid ${t.border}`, paddingTop: 24, width: '100%' }}>
                {(() => {
                  const saving = (currentAcc?.despOrc || 0) - (currentAcc?.despReal || 0)
                  const effPct = (currentAcc?.despOrc > 0) ? ((saving / currentAcc.despOrc) * 100) : 0
                  const ok = saving >= 0
                  
                  return (
                    <>
                      <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="120" height="120" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke={darkMode ? '#1a1a25' : '#f0f0f0'} strokeWidth="8" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke={ok ? t.green : t.red} strokeWidth="8" strokeDasharray={`${Math.abs(effPct) * 2.83}, 283`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                        </svg>
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                          <p style={{ fontSize: 22, fontWeight: 600, color: ok ? t.green : t.red, lineHeight: 1 }}>{effPct.toFixed(1)}%</p>
                          <p style={{ fontSize: 9, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase' }}>Eficiência</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: t.text, marginTop: 16 }}>
                        {ok ? 'ECONOMIA' : 'EXCESSO'} DE {fmt(Math.abs(saving))}
                      </p>
                    </>
                  )
                })()}
              </div>
            </div>

          </div>
        </>
      )}

      {/* ── VISÃO CENTRO DE CUSTO ── */}
      {viewType === 'cc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {(() => {
            // Filtrar centros baseado no acesso do gestor
            const targetCC = mapSectorToCC(userContext.sector);
            const filteredCentros = (userContext.level === 'gestor' && targetCC)
              ? (dados.centros?.filter(c => c.cc === targetCC) || [])
              : (dados.centros || []);

            if (filteredCentros.length === 0) {
              return (
                <div style={{ background: t.card, padding: 48, borderRadius: 24, textAlign: 'center', border: `1.5px solid ${t.border}` }}>
                  <AlertCircle size={48} color={t.textMuted} style={{ marginBottom: 16 }} />
                  <p style={{ color: t.text, fontWeight: 600 }}>Nenhum Centro de Custo disponível para este acesso.</p>
                </div>
              );
            }

            return filteredCentros.map(center => {
              // Pegar o centro correspondente no objeto acumulado (respeitando o mês selecionado)
              const centerAcc = (currentAcc.centros?.find(c => c.cc === center.cc)) || center;

              return (
                <div key={center.cc} style={{ 
                  background: t.card, 
                  borderRadius: 24, 
                  border: `1.5px solid ${t.border}`, 
                  overflow: 'hidden',
                  height: 750,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Cabeçalho Fixo */}
                  <div style={{ padding: '24px 32px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ background: t.accent, width: 4, height: 28, borderRadius: 2 }} />
                      <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        CENTRO DE CUSTO: {center.cc}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 800, color: t.accent, background: 'rgba(255,106,34,0.12)', padding: '8px 20px', borderRadius: 14 }}>
                      {mes === 'all' ? 'VISÃO ANUAL' : `COMPETÊNCIA: ${['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'][Number(mes)-1]}`}
                    </div>
                  </div>

                  {/* Área da Tabela com Scroll Interno */}
                  <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: darkMode ? '#1e1e2d' : '#ffffff', position: 'sticky', top: 0, zIndex: 20 }}>
                          <th rowSpan={2} style={{ padding: '16px 32px', textAlign: 'left', fontSize: 17, fontWeight: 900, color: t.text, textTransform: 'uppercase', borderBottom: `1px solid ${t.border}` }}>Despesas Detalhadas</th>
                          <th colSpan={3} style={{ padding: '12px 20px', textAlign: 'center', fontSize: 17, fontWeight: 900, color: t.text, textTransform: 'uppercase', borderBottom: `1px solid ${t.border}`, borderLeft: `1px solid ${t.border}` }}>Acumulado Jan - {mes === 'all' ? (['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][(dynamicDados?.latestMonth || 1) - 1]) : (['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][Number(mes) - 1])}</th>
                          <th colSpan={3} style={{ padding: '12px 20px', textAlign: 'center', fontSize: 17, fontWeight: 900, color: t.text, textTransform: 'uppercase', borderBottom: `1px solid ${t.border}`, borderLeft: `1px solid ${t.border}` }}>{mes === 'all' ? 'Média Mensal' : 'Mensal Selecionado'}</th>
                        </tr>
                        <tr style={{ background: darkMode ? '#1e1e2d' : '#ffffff', position: 'sticky', top: 40, zIndex: 20 }}>
                          <th style={{ padding: '10px 20px', textAlign: 'right', fontSize: 15, fontWeight: 900, color: t.textMuted, borderLeft: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>ORÇADO</th>
                          <th style={{ padding: '10px 20px', textAlign: 'right', fontSize: 15, fontWeight: 900, color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>REALIZADO</th>
                          <th style={{ padding: '10px 20px', textAlign: 'center', fontSize: 15, fontWeight: 900, color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>% VAR.</th>
                          <th style={{ padding: '10px 20px', textAlign: 'right', fontSize: 15, fontWeight: 900, color: t.textMuted, borderLeft: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>ORÇADO</th>
                          <th style={{ padding: '10px 20px', textAlign: 'right', fontSize: 15, fontWeight: 900, color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>REALIZADO</th>
                          <th style={{ padding: '10px 20px', textAlign: 'center', fontSize: 15, fontWeight: 900, color: t.textMuted, borderBottom: `1px solid ${t.border}` }}>% VAR.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {center.categories?.map((cat, idx) => {
                          // Buscar categoria correspondente no acumulado
                          const catAcc = centerAcc.categories?.find(ca => ca.name === cat.name) || { orc: 0, real: 0 };
                          
                          const accVar = catAcc.orc > 0 ? ((catAcc.real - catAcc.orc) / catAcc.orc * 100) : 0;
                          const menVar = cat.orc > 0 ? ((cat.real - cat.orc) / cat.orc * 100) : 0;
                          const accOk = accVar <= 0;
                          const menOk = menVar <= 0;

                          return (
                            <tr key={cat.name} style={{ borderBottom: `1px solid ${t.border}`, background: idx % 2 === 0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.03)') }}>
                              <td style={{ padding: '22px 32px', fontSize: 15, fontWeight: 600, color: t.textSub }}>{cat.name}</td>
                              
                              {/* ACUMULADO DINÂMICO */}
                              <td style={{ padding: '22px 20px', textAlign: 'right', fontSize: 15, color: t.textMuted, borderLeft: `1px solid ${t.border}` }}>{fmt(catAcc.orc)}</td>
                              <td style={{ padding: '22px 20px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: t.text }}>{fmt(catAcc.real)}</td>
                              <td style={{ padding: '22px 20px', textAlign: 'center' }}>
                                <span style={{ fontSize: 12, fontWeight: 900, color: accOk ? t.green : t.red }}>
                                  {Math.abs(accVar).toFixed(1)}% {accVar >= 0 ? 'acima' : 'abaixo'}
                                </span>
                              </td>

                              {/* MENSAL */}
                              <td style={{ padding: '22px 20px', textAlign: 'right', fontSize: 15, color: t.textMuted, borderLeft: `1px solid ${t.border}` }}>{fmt(cat.orc)}</td>
                              <td style={{ padding: '22px 20px', textAlign: 'right', fontSize: 15, fontWeight: 700, color: t.text }}>{fmt(cat.real)}</td>
                              <td style={{ padding: '22px 20px', textAlign: 'center' }}>
                                <span style={{ fontSize: 12, fontWeight: 900, color: menOk ? t.green : t.red }}>
                                  {Math.abs(menVar).toFixed(1)}% {menVar >= 0 ? 'acima' : 'abaixo'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                        
                        {/* TOTAL ROW DINÂMICO */}
                        <tr style={{ background: darkMode ? 'rgba(255,106,34,0.12)' : 'rgba(255,106,34,0.06)', borderTop: `2px solid ${t.accent}` }}>
                          <td style={{ padding: '28px 32px', fontSize: 17, fontWeight: 900, color: t.text }}>TOTAL {center.cc}</td>
                          
                          {/* TOTAL ACUMULADO DINÂMICO */}
                          {(() => {
                            const varAcc = centerAcc.orc > 0 ? ((centerAcc.real - centerAcc.orc) / centerAcc.orc * 100) : 0;
                            return (
                              <>
                                <td style={{ padding: '28px 20px', textAlign: 'right', fontSize: 17, fontWeight: 700, color: t.text, borderLeft: `1px solid ${t.border}` }}>{fmt(centerAcc.orc)}</td>
                                <td style={{ padding: '28px 20px', textAlign: 'right', fontSize: 17, fontWeight: 900, color: t.text }}>{fmt(centerAcc.real)}</td>
                                <td style={{ padding: '28px 20px', textAlign: 'center' }}>
                                  <div style={{ background: varAcc <= 0 ? t.green : t.red, color: '#fff', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 900 }}>
                                    {Math.abs(varAcc).toFixed(1)}% {varAcc >= 0 ? 'acima' : 'abaixo'}
                                  </div>
                                </td>
                              </>
                            );
                          })()}

                          {/* TOTAL MENSAL */}
                          {(() => {
                            const varMen = center.orc > 0 ? ((center.real - center.orc) / center.orc * 100) : 0;
                            return (
                              <>
                                <td style={{ padding: '28px 20px', textAlign: 'right', fontSize: 17, fontWeight: 700, color: t.text, borderLeft: `1px solid ${t.border}` }}>{fmt(center.orc)}</td>
                                <td style={{ padding: '28px 20px', textAlign: 'right', fontSize: 17, fontWeight: 900, color: t.text }}>{fmt(center.real)}</td>
                                <td style={{ padding: '28px 20px', textAlign: 'center' }}>
                                  <div style={{ background: varMen <= 0 ? t.green : t.red, color: '#fff', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 900 }}>
                                    {Math.abs(varMen).toFixed(1)}% {varMen >= 0 ? 'acima' : 'abaixo'}
                                  </div>
                                </td>
                              </>
                            );
                          })()}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  )
}
