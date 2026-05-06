import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Line, ComposedChart
} from 'recharts';

const fmt = (v) => {
  if (!v && v !== 0) return 'R$ 0';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(v);
};

const FluxoCaixaView = ({ dados, mes, darkMode }) => {
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
      name: mesesLabels[parseInt(m) - 1],
      monthNum: parseInt(m),
      entradas: val.total_entradas?.real || 0,
      saidas: Math.abs(val.total_saidas?.real || 0),
      resultado: (val.total_entradas?.real || 0) + (val.total_saidas?.real || 0),
      saldo: val.saldo_final?.real || 0,
      hasData: (val.total_entradas?.real !== 0 || val.total_saidas?.real !== 0)
    })).filter(d => d.monthNum <= (mes === 'all' ? 12 : parseInt(mes)));
  }, [dados, mes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'Gotham', sans-serif" }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20 }}>
        
        {/* Gráfico de Evolução */}
        <div style={{ 
          background: t.card, 
          borderRadius: 12, 
          border: `1.5px solid ${t.border}`, 
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>Evolução de Caixa</h3>
              <p style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Movimentação Mensal Consolidada (Realizado)</p>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, background: t.green, borderRadius: 3 }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase' }}>ENTRADAS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, background: t.red, borderRadius: 3 }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase' }}>SAÍDAS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 3, background: t.accent, borderRadius: 2 }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase' }}>SALDO</span>
              </div>
            </div>
          </div>
          
          <div style={{ height: 330, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textMuted, fontSize: 12, fontWeight: 500 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textMuted, fontSize: 11, fontWeight: 500 }} 
                  tickFormatter={(v) => `R$ ${(v/1000).toFixed(0)}k`} 
                />
                <Tooltip 
                  contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} 
                  itemStyle={{ fontSize: 13, fontWeight: 600 }}
                  formatter={(v) => [fmt(v), '']} 
                />
                <Bar dataKey="entradas" fill={t.green} barSize={32} radius={[4, 4, 0, 0]} />
                <Bar dataKey="saidas" fill={t.red} barSize={32} radius={[4, 4, 0, 0]} />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke={t.accent} 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: t.accent, strokeWidth: 2, stroke: t.card }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição de Saídas */}
        <div style={{ 
          background: t.card, 
          borderRadius: 12, 
          border: `1.5px solid ${t.border}`, 
          padding: 0, 
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column'
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
                <div key={i} style={{ 
                  padding: '20px 32px', 
                  background: i % 2 === 0 ? 'transparent' : t.zebra,
                  borderBottom: i === cats.length - 1 ? 'none' : `1px solid ${t.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: t.textSub }}>{c.label}</span>
                    <span style={{ fontSize: 17, fontWeight: 900, color: t.text }}>{fmt(c.val)}</span>
                  </div>
                  <div style={{ height: 10, background: darkMode ? 'rgba(255,255,255,0.05)' : '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      background: `linear-gradient(90deg, ${t.accent} 0%, #f07c38 100%)`, 
                      width: `${max > 0 ? (c.val/max)*100 : 0}%`, 
                      borderRadius: 5,
                      transition: 'width 1s ease-out'
                    }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

      </div>

    </div>
  );
};

export default FluxoCaixaView;
