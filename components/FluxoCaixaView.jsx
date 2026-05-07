import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Target, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Activity, Calendar, List 
} from 'lucide-react';
import KpiCard from './KpiCard';

const fmt = (v) => {
  if (!v && v !== 0) return '0';
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0
  }).format(v);
};

const FluxoCaixaView = ({ dados, mes, darkMode, viewType = 'simples' }) => {
  const t = {
    card: darkMode ? '#1e1e2d' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#cccccc' : '#000000',
    textMuted: darkMode ? '#888888' : '#000000',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.2)',
    accent: '#FF6A22',
    green: '#22c55e',
    red: '#ef4444',
    zebra: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.05)'
  };

  const mesesLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Trava de Segurança: Apenas adm, juliano, faiblan e financeiro vêem a composição de saídas
  const user = typeof window !== 'undefined' ? localStorage.getItem('criffer_user')?.toLowerCase() : '';
  const hasFullAccess = ['adm', 'juliano', 'faiblan', 'financeiro'].includes(user);

  const chartData = useMemo(() => {
    if (!dados?.fluxo?.mensal) return [];
    return Object.entries(dados.fluxo.mensal).map(([m, val]) => ({
      name: mesesLabels[parseInt(m) - 1].toUpperCase(),
      monthNum: parseInt(m),
      saldoInicial: val.saldo_inicial?.real || 0,
      saldoFinal: val.saldo_final?.real || 0,
      hasData: (val.total_entradas?.real !== 0 || val.total_saidas?.real !== 0)
    })).filter(d => d.monthNum <= (mes === 'all' ? 12 : parseInt(mes)));
  }, [dados, mes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Gotham', sans-serif" }}>
      
      {/* ── VISÃO SIMPLIFICADA ── */}
      {viewType === 'simples' && (
        <div style={{ display: 'grid', gridTemplateColumns: hasFullAccess ? '1fr 420px' : '1fr', gap: 20 }}>
          
          {/* COLUNA DA ESQUERDA: KPIs + SITUAÇÃO FINANCEIRA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* KPIs SUPERIORES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {(() => {
                const curMes = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                const m = dados?.fluxo?.mensal?.[String(curMes)] || dados?.fluxo?.mensal?.[curMes] || {};
                return (
                  <>
                    <KpiCard label="SALDO INICIAL" value={m.saldo_inicial?.real || 0} prevValue={m.saldo_inicial?.orc || 0} icon={Wallet} color="#FF6A22" hideDiff darkMode={darkMode} />
                    <KpiCard label="ENTRADAS" value={m.total_entradas?.real || 0} prevValue={m.total_entradas?.orc || 0} icon={ArrowUpRight} color="#22c55e" hideDiff darkMode={darkMode} />
                    <KpiCard label="SAÍDAS" value={Math.abs(m.total_saidas?.real || 0)} prevValue={Math.abs(m.total_saidas?.orc || 0)} icon={ArrowDownRight} color="#ef4444" hideDiff darkMode={darkMode} />
                    <KpiCard label="GERAÇÃO CAIXA" value={m.geracao_caixa?.real || 0} prevValue={m.geracao_caixa?.orc || 0} icon={Activity} color="#FF6A22" hideDiff darkMode={darkMode} />
                    <KpiCard label="SALDO FINAL" value={m.saldo_final?.real || 0} prevValue={m.saldo_final?.orc || 0} icon={Wallet} color="#FF6A22" hideDiff darkMode={darkMode} />
                  </>
                );
              })()}
            </div>

            {/* Situação Financeira */}
            <div style={{ 
              background: t.card, 
              borderRadius: 16, 
              border: `1.5px solid ${t.border}`, 
              padding: '40px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              minHeight: 635
            }}>
              <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <h3 style={{ fontSize: 28, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>Situação Financeira</h3>
                <p style={{ fontSize: 14, color: t.textMuted, fontWeight: 500, marginTop: 6, letterSpacing: 0.5 }}>Posição atual versus objetivos anuais</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, width: '100%', flex: 1 }}>
                
                {/* Card: Meta Anual */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 32, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                    <Target size={22} color={t.accent} />
                    <span style={{ fontSize: 25, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Meta Anual 2026</span>
                  </div>
                  
                  {(() => {
                    const metaValue = 11000000;
                    const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                    const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth] || {};
                    const saldoFinal = m.saldo_final?.real || 0;
                    const varAcc = saldoFinal - metaValue;
                    const pctDesvio = metaValue !== 0 ? (varAcc / metaValue * 100) : 0;
                    const isGoodAcc = varAcc >= 0;
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ background: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)', padding: '20px 28px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 22, color: t.text, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>Meta 2026</span>
                          <span style={{ fontSize: 30, fontWeight: 900, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{Math.round(metaValue).toLocaleString('pt-BR')}</span>
                        </div>
                        <div style={{ border: `1.5px solid ${isGoodAcc ? t.green : t.red}`, background: isGoodAcc ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '20px 28px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 22, color: t.text, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>Variação Acumulada</span>
                          <span style={{ fontSize: 30, fontWeight: 900, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{varAcc < 0 ? '-' : '+'}{Math.abs(Math.round(varAcc)).toLocaleString('pt-BR')}</span>
                        </div>
                        <div style={{ border: `1.5px solid ${isGoodAcc ? t.green : t.red}`, background: isGoodAcc ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '20px 28px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 22, color: t.text, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>Percentual de Desvio</span>
                          <span style={{ fontSize: 30, fontWeight: 900, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{pctDesvio > 0 ? '+' : ''}{pctDesvio.toFixed(2)}%</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Card: Posição Atual */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 32, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                    <TrendingUp size={22} color={t.accent} />
                    <span style={{ fontSize: 25, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Posição Atual</span>
                  </div>
                  
                  {(() => {
                    const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                    const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth] || {};
                    const saldoIni2026 = dados?.fluxo?.mensal?.[String(1)]?.saldo_inicial?.real || dados?.fluxo?.mensal?.[1]?.saldo_inicial?.real || 0;
                    const saldoFin = m.saldo_final?.real || 0;
                    const varPer = saldoFin - saldoIni2026;
                    const isGoodPer = varPer >= 0;
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ background: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)', padding: '20px 28px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 22, color: t.text, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>Saldo Inicial 2026</span>
                          <span style={{ fontSize: 30, fontWeight: 900, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{Math.round(saldoIni2026).toLocaleString('pt-BR')}</span>
                        </div>
                        <div style={{ background: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)', padding: '20px 28px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 22, color: t.text, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>Saldo Final {mesesLabels[currentMonth-1]}/26</span>
                          <span style={{ fontSize: 30, fontWeight: 900, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{Math.round(saldoFin).toLocaleString('pt-BR')}</span>
                        </div>
                        <div style={{ border: `1.5px solid ${isGoodPer ? t.green : t.red}`, background: isGoodPer ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '20px 28px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 22, color: t.text, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>Variação Período</span>
                          <span style={{ fontSize: 30, fontWeight: 900, color: t.text, fontVariantNumeric: 'tabular-nums' }}>{varPer < 0 ? '-' : '+'}{Math.abs(Math.round(varPer)).toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DA DIREITA: COMPOSIÇÃO DAS SAÍDAS (FULL HEIGHT) - PROTEGIDA */}
          {hasFullAccess && (
            <div style={{ 
              background: t.card, 
              borderRadius: 16, 
              border: `1.5px solid ${t.border}`, 
              padding: 0, 
              overflow: 'hidden', 
              boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.1)', 
              display: 'flex', 
              flexDirection: 'column', 
              height: 750,
              color: t.text
            }}>
              <div style={{ padding: '24px 32px', borderBottom: `1px solid ${t.border}` }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Composição das Saídas</h3>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {(() => {
                  const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                  const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth];
                  const cats = [
                    { label: 'Matéria Prima', val: m?.materia_prima?.real || 0 },
                    { label: 'Fretes', val: m?.fretes?.real || 0 },
                    { label: 'Pessoal', val: m?.pessoal?.real || 0 },
                    { label: 'Impostos', val: m?.impostos?.real || 0 },
                    { label: 'Manut. Predial', val: m?.manut_predial?.real || 0 },
                    { label: 'Desp. Operacionais', val: m?.despesas_op?.real || 0 },
                    { label: 'Consultorias', val: m?.consultorias?.real || 0 },
                    { label: 'P&D', val: m?.pd?.real || 0 },
                    { label: 'Tarifas Bancárias', val: m?.tarifas?.real || 0 },
                    { label: 'Diretoria', val: m?.diretoria?.real || 0 },
                    { label: 'Outros Gastos', val: m?.outros_gastos?.real || 0 },
                    { label: 'Atividades Financeiras', val: m?.ativ_financeiros?.real || 0 },
                  ].sort((a,b) => Math.abs(b.val) - Math.abs(a.val));
                  return cats.map((c, i) => (
                    <div key={i} style={{ padding: '14.3px 32px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: t.text, textTransform: 'capitalize' }}>{c.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: t.text, minWidth: 90, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {c.val < 0 ? '-' : ''}{Math.abs(Math.round(c.val)).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NOVA VISÃO ORÇAMENTO CAIXA (RECONSTRUÇÃO TOTAL ALTA FIDELIDADE) ── */}
      {viewType === 'orcamento_caixa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25, animation: 'fadeIn 0.5s ease-out' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 30 }}>
            
            {/* Coluna Esquerda: Banner Resultado + 3 Cards de Resumo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Banner Resultado do Mês (Agora na Esquerda) */}
              {(() => {
                const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth] || {};
                const saldoFinal = m.resultado_mes_fixo?.real || 0;
                const isPos = saldoFinal >= 0;
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 50 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, opacity: 0.7 }}>
                      <Calendar size={18} color={t.text} />
                      <span style={{ fontSize: 18, fontWeight: 900, color: t.text }}>Resultado do Mês</span>
                    </div>
                    <div style={{ 
                      background: isPos ? t.green : t.red, 
                      color: '#ffffff', 
                      padding: '10px 25px', 
                      borderRadius: 8, 
                      fontSize: 28, 
                      fontWeight: 900,
                      boxShadow: `0 8px 25px ${isPos ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      width: '100%',
                      textAlign: 'center'
                    }}>
                      R$ {fmt(Math.abs(saldoFinal))}
                    </div>
                    <span style={{ color: t.accent, fontSize: 14, fontWeight: 900, marginTop: 8, letterSpacing: 2, alignSelf: 'center' }}>
                      {isPos ? '↑ POSITIVO' : '↓ NEGATIVO'}
                    </span>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                <Activity size={20} color={t.text} />
                <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, textTransform: 'uppercase', margin: 0 }}>Resumo Operacional</h3>
              </div>

              {(() => {
                const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth] || {};
                
                const cards = [
                  { label: 'Entradas Operacionais', val: m.total_entradas?.real || 0, color: '#FF6A22', icon: ArrowUpRight, bg: 'rgba(255,106,34,0.1)' },
                  { label: 'Saídas Operacionais', val: m.total_saidas_op?.real || 0, color: '#ef4444', icon: ArrowDownRight, bg: 'rgba(239,68,68,0.1)' },
                  { label: 'Ativ Financeiras', val: m.ativ_financeiros_fixo?.real || 0, color: '#ef4444', icon: ArrowDownRight, bg: 'rgba(239,68,68,0.1)' },
                ];

                return cards.map((c, i) => (
                  <div key={i} style={{ 
                    background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', 
                    borderRadius: 16, 
                    padding: '25px', 
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                    borderLeft: `6px solid ${c.color}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: t.textMuted }}>{c.label}</span>
                      <c.icon size={18} color={c.color} />
                    </div>
                    <span style={{ fontSize: 28, fontWeight: 900, color: c.color, zIndex: 2 }}>
                      {c.val < 0 ? `(R$ ${fmt(Math.abs(c.val))})` : `R$ ${fmt(c.val)}`}
                    </span>
                    {/* Efeito Visual de Fundo */}
                    <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.05 }}>
                      <c.icon size={80} color={c.color} />
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Coluna Direita: Detalhamento de Gastos */}
            <div style={{ background: t.card, borderRadius: 20, border: `1.5px solid ${t.border}`, padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', height: 700, display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 25 }}>
                <div style={{ background: t.accent, borderRadius: 8, padding: 8 }}>
                  <List size={26} color="#ffffff" />
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 900, color: t.text, margin: 0 }}>Detalhamento de Gastos</h3>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${t.accent}` }}>
                      <th style={{ padding: '20px 10px', textAlign: 'left', fontSize: 18, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>Categoria</th>
                      <th style={{ padding: '20px 10px', textAlign: 'right', fontSize: 18, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>Orçado</th>
                      <th style={{ padding: '20px 10px', textAlign: 'right', fontSize: 18, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>Realizado</th>
                      <th style={{ padding: '20px 10px', textAlign: 'right', fontSize: 18, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                      const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth] || {};
                      
                      const rows = [
                        { label: 'Matéria Prima/Prod', real: m.materia_prima?.real, orc: m.materia_prima?.orc },
                        { label: 'Fretes', real: m.fretes?.real, orc: m.fretes?.orc },
                        { label: 'Gastos com Pessoal', real: m.pessoal?.real, orc: m.pessoal?.orc },
                        { label: 'Impostos/Taxas', real: m.impostos?.real, orc: m.impostos?.orc },
                        { label: 'Manutenção Predial', real: m.manut_predial?.real, orc: m.manut_predial?.orc },
                        { label: 'Despesas Operacionais', real: m.despesas_op?.real, orc: m.despesas_op?.orc },
                        { label: 'Consultoria', real: m.consultorias?.real, orc: m.consultorias?.orc },
                        { label: 'P&D', real: m.pd?.real, orc: m.pd?.orc },
                        { label: 'Tarifas Bancárias', real: m.tarifas?.real, orc: m.tarifas?.orc },
                      ];

                      return rows.map((row, i) => {
                        const diff = Math.abs(row.orc || 0) - Math.abs(row.real || 0);
                        const isSaving = diff >= 0;

                        const formatVal = (v) => v < 0 ? `(${fmt(Math.abs(v))})` : `${fmt(v)}`;

                        return (
                          <tr key={i} style={{ borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, transition: 'background 0.2s' }}>
                            <td style={{ padding: '20px 10px', fontSize: 18, fontWeight: 700, color: t.text }}>{row.label}</td>
                            <td style={{ padding: '20px 10px', textAlign: 'right', fontSize: 18, color: t.textMuted }}>{formatVal(row.orc)}</td>
                            <td style={{ padding: '20px 10px', textAlign: 'right', fontSize: 18, color: t.textMuted }}>{formatVal(row.real)}</td>
                            <td style={{ padding: '20px 10px', textAlign: 'right', fontSize: 18, fontWeight: 900, color: isGoodAcc ? t.green : t.red }}>
                              {diff < 0 ? `(${fmt(Math.abs(diff))})` : fmt(diff)}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VISÃO DETALHADA ── */}
      {viewType === 'detalhe' && (
        <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>Demonstrativo de Fluxo Detalhado</h3>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.accent, background: 'rgba(255,106,34,0.12)', padding: '8px 20px', borderRadius: 14 }}>
              COMPETÊNCIA: {mes === 'all' ? 'VISÃO ANUAL' : mesesLabels[parseInt(mes)-1].toUpperCase()}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: darkMode ? '#1e1e2d' : '#f8f9fa' }}>
                  <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: 14, fontWeight: 900, color: t.textMuted, borderBottom: `2px solid ${t.border}` }}>CATEGORIA</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: 14, fontWeight: 900, color: t.textMuted, borderBottom: `2px solid ${t.border}` }}>ORÇADO</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: 14, fontWeight: 900, color: t.textMuted, borderBottom: `2px solid ${t.border}` }}>REALIZADO</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 14, fontWeight: 900, color: t.textMuted, borderBottom: `2px solid ${t.border}` }}>VARIAÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                  const m = dados?.fluxo?.mensal?.[String(currentMonth)] || dados?.fluxo?.mensal?.[currentMonth] || {};
                  
                  const rows = [
                    { label: 'ENTRADAS OPERACIONAIS', isHeader: true },
                    { label: 'Total de Entradas', real: m.total_entradas?.real, orc: m.total_entradas?.orc, isTotal: true },
                    
                    { label: 'SAÍDAS OPERACIONAIS', isHeader: true },
                    { label: 'Matéria Prima', real: m.materia_prima?.real, orc: m.materia_prima?.orc },
                    { label: 'Fretes', real: m.fretes?.real, orc: m.fretes?.orc },
                    { label: 'Pessoal', real: m.pessoal?.real, orc: m.pessoal?.orc },
                    { label: 'Impostos', real: m.impostos?.real, orc: m.impostos?.orc },
                    { label: 'Manutenção Predial', real: m.manut_predial?.real, orc: m.manut_predial?.orc },
                    { label: 'Despesas Operacionais', real: m.despesas_op?.real, orc: m.despesas_op?.orc },
                    { label: 'Consultorias', real: m.consultorias?.real, orc: m.consultorias?.orc },
                    { label: 'P&D', real: m.pd?.real, orc: m.pd?.orc },
                    { label: 'Tarifas Bancárias', real: m.tarifas?.real, orc: m.tarifas?.orc },
                    { label: 'Subtotal Saídas OP', real: m.total_saidas_op?.real, orc: m.total_saidas_op?.orc, isTotal: true },

                    { label: 'OUTROS FLUXOS E FINANÇAS', isHeader: true },
                    { label: 'Diretoria', real: m.diretoria?.real, orc: m.diretoria?.orc },
                    { label: 'Outros Gastos', real: m.outros_gastos?.real, orc: m.outros_gastos?.orc },
                    { label: 'Atividades Financeiras (L19-25)', real: m.ativ_financeiros?.real, orc: m.ativ_financeiros?.orc },
                    { label: 'Rendimentos Aplic.', real: m.rend_aplic?.real, orc: m.rend_aplic?.orc },
                    
                    { label: 'TOTAL GERAL DE SAÍDAS', real: m.total_saidas?.real, orc: m.total_saidas?.orc, isTotal: true },
                    { label: 'GERAÇÃO DE CAIXA', real: m.geracao_caixa?.real, orc: m.geracao_caixa?.orc, isFinal: true },
                  ];

                  return rows.map((row, i) => {
                    if (row.isHeader) {
                      return (
                        <tr key={i} style={{ background: darkMode ? 'rgba(255,106,34,0.05)' : 'rgba(255,106,34,0.02)' }}>
                          <td colSpan={4} style={{ padding: '12px 32px', fontSize: 12, fontWeight: 900, color: t.accent, textTransform: 'uppercase' }}>{row.label}</td>
                        </tr>
                      );
                    }
                    const diff = (row.real || 0) - (row.orc || 0);
                    const pct = row.orc !== 0 ? (diff / Math.abs(row.orc) * 100) : 0;
                    const isPositive = diff >= 0;
                    const isGood = row.label.includes('ENTRADA') || row.label.includes('Rendimentos') || row.label.includes('GERAÇÃO') ? isPositive : !isPositive;

                    return (
                      <tr key={i} style={{ 
                        borderBottom: `1px solid ${t.border}`, 
                        background: row.isTotal ? (darkMode ? 'rgba(255,255,255,0.05)' : '#fcfcfc') : (row.isFinal ? (darkMode ? 'rgba(255,106,34,0.15)' : 'rgba(255,106,34,0.08)') : 'transparent'),
                        fontWeight: row.isTotal || row.isFinal ? 700 : 400
                      }}>
                        <td style={{ padding: '18px 32px', fontSize: row.isTotal || row.isFinal ? 15 : 14, color: t.text }}>{row.label}</td>
                        <td style={{ padding: '18px 20px', textAlign: 'right', fontSize: 14, color: t.textMuted }}>{fmt(row.orc)}</td>
                        <td style={{ padding: '18px 20px', textAlign: 'right', fontSize: 14, fontWeight: 700, color: t.text }}>{fmt(row.real)}</td>
                        <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                          <span style={{ fontSize: 12, fontWeight: 900, color: isGood ? t.green : t.red }}>
                            {Math.abs(pct).toFixed(1)}% {isPositive ? '↑' : '↓'}
                          </span>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── VISÃO METAS ── */}
      {viewType === 'metas_fluxo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          
          {/* Card Meta Entradas */}
          <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, textTransform: 'uppercase', marginBottom: 24 }}>Atingimento de Entradas</h3>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: t.textMuted, fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => [fmt(v), '']} />
                  <Bar dataKey="entradasOrc" name="Orçado" fill={darkMode ? 'rgba(255,255,255,0.1)' : '#eee'} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="entradas" name="Realizado" fill={t.green} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card Meta Saídas */}
          <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, textTransform: 'uppercase', marginBottom: 24 }}>Controle de Saídas</h3>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: t.textMuted, fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => [fmt(v), '']} />
                  <Bar dataKey="saidasOrc" name="Orçado" fill={darkMode ? 'rgba(255,255,255,0.1)' : '#eee'} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="saidas" name="Realizado" fill={t.red} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default FluxoCaixaView;
