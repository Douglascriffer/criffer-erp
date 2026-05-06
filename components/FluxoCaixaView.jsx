import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Line, ComposedChart, LabelList, Legend
} from 'recharts';
import { Activity } from 'lucide-react';

const fmt = (v) => {
  if (!v && v !== 0) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(v);
};

const FluxoCaixaView = ({ dados, mes, darkMode, viewType = 'simples' }) => {
  const t = {
    card: darkMode ? '#1e1e2d' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#cccccc' : '#333333',
    textMuted: darkMode ? '#888888' : '#666666',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)',
    accent: '#FF6A22',
    green: '#22c55e',
    red: '#ef4444',
    zebra: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
  };

  const mesesLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

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
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20 }}>
          
          {/* Gráfico de Evolução do Saldo (Horizontal) */}
          <div style={{ 
            background: t.card, 
            borderRadius: 12, 
            border: `1.5px solid ${t.border}`, 
            padding: 32,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 32, width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Activity size={22} color={t.accent} />
                <h3 style={{ fontSize: 22, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Evolução do Saldo</h3>
              </div>
            </div>
            
            <div style={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 80, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={t.border} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 700 }} 
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} 
                    itemStyle={{ fontSize: 13, fontWeight: 600 }}
                    formatter={(v) => [v.toLocaleString('pt-BR'), '']} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="rect" wrapperStyle={{ paddingTop: 20 }} />
                  <Bar dataKey="saldoInicial" name="SALDO INICIAL" fill="#9ca3af" barSize={25} radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="saldoInicial" position="right" formatter={(v) => v.toLocaleString('pt-BR')} style={{ fontSize: 11, fontWeight: 900, fill: t.text }} offset={10} />
                  </Bar>
                  <Bar dataKey="saldoFinal" name="SALDO FINAL" fill={t.accent} barSize={25} radius={[0, 4, 4, 0]}>
                    <LabelList dataKey="saldoFinal" position="right" formatter={(v) => v.toLocaleString('pt-BR')} style={{ fontSize: 11, fontWeight: 900, fill: t.text }} offset={10} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Distribuição de Saídas */}
          <div style={{ 
            background: t.card, borderRadius: 12, border: `1.5px solid ${t.border}`, padding: 0, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${t.border}` }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', margin: 0 }}>Composição das Saídas</h3>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {(() => {
                const currentMonth = mes === 'all' ? (chartData.filter(d => d.hasData).pop()?.monthNum || 1) : parseInt(mes);
                const m = dados?.fluxo?.mensal?.[currentMonth];
                const cats = [
                  { label: 'Matéria Prima', val: Math.abs(m?.materia_prima?.real || 0) },
                  { label: 'Pessoal', val: Math.abs(m?.pessoal?.real || 0) },
                  { label: 'Impostos', val: Math.abs(m?.impostos?.real || 0) },
                  { label: 'Operacional', val: Math.abs(m?.despesas_op?.real || 0) + Math.abs(m?.manut_predial?.real || 0) },
                  { label: 'Diretoria', val: Math.abs(m?.diretoria?.real || 0) },
                  { label: 'Outros Gastos', val: Math.abs(m?.outros_gastos?.real || 0) },
                ].sort((a,b) => b.val - a.val);
                const max = cats.reduce((s,c) => s + c.val, 0);
                return cats.map((c, i) => (
                  <div key={i} style={{ padding: '20px 32px', background: i % 2 === 0 ? 'transparent' : t.zebra, borderBottom: i === cats.length - 1 ? 'none' : `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: t.textSub }}>{c.label}</span>
                      <span style={{ fontSize: 17, fontWeight: 900, color: t.text }}>{fmt(c.val)}</span>
                    </div>
                    <div style={{ height: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: `linear-gradient(90deg, ${t.accent} 0%, #f07c38 100%)`, width: `${max > 0 ? (c.val/max)*100 : 0}%`, borderRadius: 5 }} />
                    </div>
                  </div>
                ));
              })()}
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
                  const m = dados?.fluxo?.mensal?.[currentMonth] || {};
                  
                  const rows = [
                    { label: 'ENTRADAS OPERACIONAIS', isHeader: true },
                    { label: 'Vendas', real: m.vendas?.real, orc: m.vendas?.orc },
                    { label: 'Outros Recebíveis', real: m.outros_recebiveis?.real, orc: m.outros_recebiveis?.orc },
                    { label: 'TOTAL ENTRADAS', real: m.total_entradas?.real, orc: m.total_entradas?.orc, isTotal: true },
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
                    { label: 'TOTAL SAÍDAS', real: m.total_saidas?.real, orc: m.total_saidas?.orc, isTotal: true },
                    { label: 'OUTROS FLUXOS', isHeader: true },
                    { label: 'Diretoria', real: m.diretoria?.real, orc: m.diretoria?.orc },
                    { label: 'Outros Gastos', real: m.outros_gastos?.real, orc: m.outros_gastos?.orc },
                    { label: 'Rendimentos Aplic.', real: m.rendimentos?.real, orc: m.rendimentos?.orc },
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
