'use client'
import { X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const MES_MAP = {
  1: 'JAN', 2: 'FEV', 3: 'MAR', 4: 'ABR', 5: 'MAI', 6: 'JUN',
  7: 'JUL', 8: 'AGO', 9: 'SET', 10: 'OUT', 11: 'NOV', 12: 'DEZ'
}

function fmt(v) {
  if (!v && v !== 0) return 'R$ 0'
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`
}

export default function ModalVendedor({ isOpen, onClose, sellerName, data, filters, darkMode }) {
  if (!isOpen || !sellerName) return null

  const t = {
    bg: darkMode ? 'rgba(12, 12, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)',
    card: darkMode ? '#1e1e2d' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#aaaaaa' : '#666666',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  }

  // 1. Cálculos de Faturamento
  const targetYear = Number(filters.ano)
  const targetMonth = filters.mes === 'all' ? 12 : Number(filters.mes) // Simplificação para 'all'

  // Faturamento Total da Empresa no Mês
  const totalEmpresa = data?.byPeriod
    ?.filter(p => p.ano === targetYear && (filters.mes === 'all' ? true : p.mes === targetMonth))
    ?.reduce((acc, curr) => acc + (curr.vendas + curr.servicos + curr.locacao), 0) || 0

  // Faturamento do Vendedor no Mês
  const totalVendedor = data?.bySeller
    ?.filter(s => s.name === sellerName && s.ano === targetYear && (filters.mes === 'all' ? true : s.mes === targetMonth))
    ?.reduce((acc, curr) => acc + curr.val, 0) || 0

  // Representatividade
  const representatividade = totalEmpresa > 0 ? (totalVendedor / totalEmpresa) * 100 : 0

  // 2. Dados do Gráfico (Ano a Ano)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1
    const val2026 = data?.bySeller
      ?.filter(s => s.name === sellerName && s.ano === 2026 && s.mes === mes)
      ?.reduce((acc, curr) => acc + curr.val, 0) || 0
    const val2025 = data?.bySeller
      ?.filter(s => s.name === sellerName && s.ano === 2025 && s.mes === mes)
      ?.reduce((acc, curr) => acc + curr.val, 0) || 0
    
    return {
      name: MES_MAP[mes],
      atual: val2026 > 0 ? val2026 : null,
      anterior: val2025 > 0 ? val2025 : null
    }
  })

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
      padding: 24
    }} onClick={onClose}>
      
      <div style={{ 
        width: '100%', maxWidth: 1100, background: t.bg, borderRadius: 24,
        border: `1px solid ${t.border}`, overflow: 'hidden', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        animation: 'modalShow 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: `1px solid ${t.border}`, position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text, margin: 0 }}>{sellerName}</h2>
            <p style={{ fontSize: 14, color: t.textSub, margin: '4px 0 0 0' }}>Resumo de Performance Executiva</p>
          </div>
          <button onClick={onClose} style={{ 
            position: 'absolute', right: 32,
            background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', 
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: t.text
          }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: 32 }}>
          {/* Top Row: KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
            <KpiCard title="FATURAMENTO MÊS" value={fmt(totalEmpresa)} color="#FF6A22" darkMode={darkMode} />
            <KpiCard title="Faturamento vendedor" value={fmt(totalVendedor)} color="#FF6A22" darkMode={darkMode} />
            <KpiCard title="Representatividade" value={`${representatividade.toFixed(1)}%`} color="#FF6A22" darkMode={darkMode} />
          </div>

          {/* Bottom Row: Photo and Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
            {/* Foto Vendedor */}
            <div style={{ 
              background: darkMode ? '#000000' : '#f8f8f8',
              borderRadius: 32, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${t.border}`, position: 'relative', overflow: 'hidden'
            }}>
              {/* Glow Effect */}
              <div style={{ 
                position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
                width: '120%', height: 60, background: 'radial-gradient(ellipse at center, rgba(255,106,34,0.15) 0%, transparent 70%)',
                filter: 'blur(20px)', pointerEvents: 'none'
              }} />

              <div style={{ 
                width: 220, height: 260, borderRadius: 24, overflow: 'hidden',
                border: `2.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                background: '#000', boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={`/vendedores/${sellerName}.jpg`} 
                  alt={sellerName}
                  onError={(e) => { e.target.src = '/vendedores/default.jpg' }}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
            </div>

            {/* Gráfico de Evolução */}
            <div style={{ 
              background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              borderRadius: 24, padding: 24, border: `1px solid ${t.border}`
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1 }}>Evolução de Faturamento (Vendedor)</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6A22" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF6A22" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.textSub }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ background: darkMode ? '#1a1a2d' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                      itemStyle={{ color: t.text }}
                    />
                    <Area type="monotone" dataKey="atual" name="2026" stroke="#FF6A22" strokeWidth={3} fillOpacity={1} fill="url(#colorAtual)" />
                    <Area type="monotone" dataKey="anterior" name="2025" stroke={darkMode ? '#444' : '#ccc'} strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textSub }}>
                  <div style={{ width: 12, height: 3, background: '#FF6A22', borderRadius: 2 }} /> 2026 (ATUAL)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textSub }}>
                  <div style={{ width: 12, height: 3, background: darkMode ? '#444' : '#ccc', borderRadius: 2, borderStyle: 'dashed' }} /> 2025 (ANTERIOR)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalShow {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}

function KpiCard({ title, value, color, darkMode, suffix }) {
  return (
    <div style={{ 
      background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: 20, padding: '24px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: darkMode ? '#aaa' : '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color }}>{value}</div>
      {suffix && <div style={{ fontSize: 12, color: darkMode ? '#666' : '#999', marginTop: 4 }}>{suffix}</div>}
    </div>
  )
}
