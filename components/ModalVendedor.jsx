'use client'
// Force redeploy for lateral layout
import { X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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
  const targetMonth = filters.mes === 'all' ? 12 : Number(filters.mes)

  // Faturamento Total da Empresa no Mês (Fonte Oficial: bySellerTotals ou byPeriod)
  const officialData = data?.bySellerTotals?.find(p => p.ano === targetYear && (filters.mes === 'all' ? true : p.mes === targetMonth))
  const periodData = data?.byPeriod?.find(p => p.ano === targetYear && (filters.mes === 'all' ? true : p.mes === targetMonth))
  
  const totalEmpresa = officialData?.total || (periodData 
    ? (periodData.vendas + periodData.servicos + periodData.locacao - Math.abs(periodData.devolucoes || 0))
    : 0)

  // Faturamento do Vendedor no Mês
  const totalVendedor = data?.bySeller
    ?.filter(s => (s.vendedor === sellerName || s.name === sellerName) && s.ano === targetYear && (filters.mes === 'all' ? true : s.mes === targetMonth))
    ?.reduce((acc, curr) => acc + (curr.valor || curr.val || 0), 0) || 0

  // Representatividade
  const representatividade = totalEmpresa > 0 ? (totalVendedor / totalEmpresa) * 100 : 0

  // 1.1 Cálculos Acumulados (YTD - Year To Date)
  const totalAcumuladoEmpresa = data?.bySellerTotals
    ?.filter(p => p.ano === targetYear && p.mes <= targetMonth)
    ?.reduce((acc, p) => acc + (p.total || 0), 0) || 0

  const totalAcumuladoVendedor = data?.bySeller
    ?.filter(s => (s.vendedor === sellerName || s.name === sellerName) && s.ano === targetYear && s.mes <= targetMonth)
    ?.reduce((acc, curr) => acc + (curr.valor || curr.val || 0), 0) || 0

  const representatividadeAcumulada = totalAcumuladoEmpresa > 0 ? (totalAcumuladoVendedor / totalAcumuladoEmpresa) * 100 : 0

  // 2. Dados do Gráfico (Ano a Ano)
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1
    const val2026 = data?.bySeller
      ?.filter(s => (s.vendedor === sellerName || s.name === sellerName) && s.ano === 2026 && s.mes === mes)
      ?.reduce((acc, curr) => acc + (curr.valor || curr.val || 0), 0) || 0
    const val2025 = data?.bySeller
      ?.filter(s => (s.vendedor === sellerName || s.name === sellerName) && s.ano === 2025 && s.mes === mes)
      ?.reduce((acc, curr) => acc + (curr.valor || curr.val || 0), 0) || 0
    
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
        width: '100%', maxWidth: 1250, background: 'transparent', borderRadius: 24,
        overflow: 'hidden', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        animation: 'modalShow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '4px' // Espaço ideal para o brilho
      }} onClick={e => e.stopPropagation()}>
        
        {/* Camada de Brilho Giratório (Dual Snake Border - Laranja Criffer) */}
        <div style={{
          position: 'absolute',
          top: '-150%', left: '-150%',
          width: '400%', height: '400%',
          background: `conic-gradient(from 0deg, ${t.accent} 0deg, ${t.accent} 60deg, transparent 60deg, transparent 180deg, ${t.accent} 180deg, ${t.accent} 240deg, transparent 240deg)`,
          animation: 'borderRotate 4s linear infinite',
          zIndex: 0
        }} />

        {/* Conteúdo Real (Sobre o brilho) */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          background: t.bg,
          borderRadius: 22,
          width: '100%', height: '100%',
          overflow: 'hidden'
        }}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: `1px solid ${t.border}`, position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text, margin: 0 }}>{sellerName}</h2>
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
          {/* Top Row: KPIs Mensais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
            <KpiCard title="FATURAMENTO MÊS" value={fmt(totalEmpresa)} color="#FF6A22" darkMode={darkMode} large />
            <KpiCard title="FAT. VENDEDOR" value={fmt(totalVendedor)} color="#FF6A22" darkMode={darkMode} large />
            <KpiCard title="PARTICIPAÇÃO" value={`${representatividade.toFixed(1)}%`} color="#FF6A22" darkMode={darkMode} large />
          </div>

          {/* Bottom Row: Photo, Chart, and YTD Column */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 240px', gap: 32 }}>
            {/* Foto Vendedor */}
            <div style={{ 
              background: darkMode ? '#000' : '#fff',
              borderRadius: 16, overflow: 'hidden',
              border: `1.5px solid ${t.border}`,
              height: '100%', minHeight: 400
            }}>
              <img 
                src={`/vendedores/${sellerName}.jpg`} 
                alt={sellerName}
                onError={(e) => { e.target.src = '/vendedores/default.jpg' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Gráfico de Evolução */}
            <div style={{ 
              background: t.card,
              borderRadius: 6, padding: 24, border: `1.5px solid ${t.border}`,
              display: 'flex', flexDirection: 'column'
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Evolução de Faturamento</h3>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: t.textSub }} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(val) => fmt(val)}
                      contentStyle={{ background: darkMode ? '#1a1a2d' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                      itemStyle={{ color: t.text }}
                    />
                    <Bar dataKey="atual" name="2026" fill="#FF6A22" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="anterior" name="2025" fill={darkMode ? '#444' : '#ccc'} radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Coluna de Acumulados (YTD) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: t.textSub, textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Saldos Acumulados</h3>
              <KpiCard title="ACUMULADO EMPRESA" value={fmt(totalAcumuladoEmpresa)} color="#FF6A22" darkMode={darkMode} />
              <KpiCard title="ACUMULADO VENDEDOR" value={fmt(totalAcumuladoVendedor)} color="#FF6A22" darkMode={darkMode} />
              <KpiCard title="PARTICIPAÇÃO ANUAL" value={`${representatividadeAcumulada.toFixed(1)}%`} color="#FF6A22" darkMode={darkMode} />
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
        @keyframes borderRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function KpiCard({ title, value, color, darkMode, suffix, large }) {
  return (
    <div style={{ 
      background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
      borderRadius: 20, padding: large ? '24px' : '16px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      textAlign: 'center',
      flex: 1,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: large ? 12 : 10, fontWeight: 700, color: darkMode ? '#aaa' : '#666', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: large ? 12 : 8 }}>{title}</div>
      <div style={{ fontSize: large ? 32 : 22, fontWeight: 900, color: color, letterSpacing: -0.5 }}>{value}</div>
      {suffix && <div style={{ fontSize: 10, color: darkMode ? '#666' : '#999', marginTop: 4 }}>{suffix}</div>}
    </div>
  )
}
