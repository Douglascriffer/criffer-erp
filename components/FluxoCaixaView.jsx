import React, { useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, 
  ArrowUpRight, ArrowDownRight, Activity, Calendar
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, LineChart, Line, Legend, AreaChart, Area
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
    card: darkMode ? '#11111d' : '#ffffff',
    text: darkMode ? '#ffffff' : '#1a1a25',
    textSub: darkMode ? '#94a3b8' : '#64748b',
    textMuted: darkMode ? '#64748b' : '#94a3b8',
    border: darkMode ? '#1e1e2d' : '#f1f5f9',
    accent: '#FF6A22',
    green: '#22c55e',
    red: '#ef4444',
  };

  const mesesLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Processar dados para o gráfico e KPIs
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

  const currentMonthData = useMemo(() => {
    if (mes === 'all') {
      // Se for "Todos", pegamos o último mês que tem dados reais
      const validMonths = chartData.filter(d => d.hasData);
      return validMonths[validMonths.length - 1] || chartData[0];
    }
    return chartData.find(d => d.monthNum === parseInt(mes));
  }, [chartData, mes]);

  const kpis = [
    { 
      label: 'Saldo em Conta', 
      value: currentMonthData?.saldo, 
      icon: Wallet, 
      color: t.accent,
      sub: `Posição final em ${currentMonthData?.name}/26`
    },
    { 
      label: 'Entradas (Real)', 
      value: currentMonthData?.entradas, 
      icon: ArrowUpRight, 
      color: t.green,
      sub: 'Total recebido no período'
    },
    { 
      label: 'Saídas (Real)', 
      value: currentMonthData?.saidas, 
      icon: ArrowDownRight, 
      color: t.red,
      sub: 'Total pago no período'
    },
    { 
      label: 'Geração de Caixa', 
      value: currentMonthData?.resultado, 
      icon: Activity, 
      color: (currentMonthData?.resultado >= 0) ? t.green : t.red,
      sub: 'Fluxo líquido operacional'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 8px' }}>
      
      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ 
            background: t.card, 
            borderRadius: 24, 
            padding: '24px 28px', 
            border: `1.5px solid ${t.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ padding: 10, borderRadius: 14, background: `${kpi.color}15` }}>
                <kpi.icon size={22} color={kpi.color} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{kpi.label}</span>
            </div>
            <div>
              <p style={{ fontSize: 26, fontWeight: 900, color: t.text, marginBottom: 4 }}>{fmt(kpi.value)}</p>
              <p style={{ fontSize: 13, color: t.textSub, fontWeight: 500 }}>{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        
        {/* Gráfico Principal */}
        <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase' }}>Evolução Mensal</h3>
              <p style={{ fontSize: 14, color: t.textSub }}>Movimentação de Entradas vs Saídas</p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: t.green }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textMuted }}>ENTRADAS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: t.red }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textMuted }}>SAÍDAS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 2, background: t.accent }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: t.textMuted }}>SALDO</span>
              </div>
            </div>
          </div>
          
          <div style={{ height: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.border} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textSub, fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: t.textSub, fontSize: 11 }}
                  tickFormatter={(v) => `R$ ${(v/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [fmt(v), '']}
                />
                <Bar dataKey="entradas" fill={t.green} radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="saidas" fill={t.red} radius={[4, 4, 0, 0]} barSize={30} />
                <Line 
                  type="monotone" 
                  dataKey="saldo" 
                  stroke={t.accent} 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: t.accent, strokeWidth: 2, stroke: t.card }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Composição das Saídas (Donut ou Barras) */}
        <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', marginBottom: 24 }}>Distribuição de Saídas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {(() => {
              const m = dados?.fluxo?.mensal?.[parseInt(mes === 'all' ? (dynamicDados?.latestMonth || 1) : mes)];
              const categories = [
                { label: 'Matéria Prima', val: Math.abs(m?.materia_prima?.real || 0) },
                { label: 'Pessoal', val: Math.abs(m?.pessoal?.real || 0) },
                { label: 'Impostos', val: Math.abs(m?.impostos?.real || 0) },
                { label: 'Operacional', val: Math.abs(m?.despesas_op?.real || 0) + Math.abs(m?.manut_predial?.real || 0) },
                { label: 'Diretoria', val: Math.abs(m?.diretoria?.real || 0) },
              ].sort((a,b) => b.val - a.val);

              const total = categories.reduce((s,c) => s + c.val, 0);

              return categories.map((cat, i) => (
                <div key={i} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{cat.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.textSub }}>{fmt(cat.val)}</span>
                  </div>
                  <div style={{ height: 6, background: darkMode ? '#1a1a25' : '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: t.accent, width: `${(cat.val/total)*100}%`, opacity: 1 - (i*0.15) }} />
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

// Precisamos importar o ComposedChart do recharts
import { ComposedChart } from 'recharts';

export default FluxoCaixaView;
