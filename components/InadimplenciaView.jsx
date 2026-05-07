'use client'
import React from 'react'
import { 
  TrendingDown, 
  AlertCircle, 
  Clock, 
  Calendar,
  Users,
  ChevronRight,
  ArrowRight
} from 'lucide-react'

export default function InadimplenciaView({ dados, mes, darkMode }) {
  const t = {
    bg: darkMode ? '#0c0c14' : '#cccccc',
    card: darkMode ? '#1e1e2d' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    textMuted: darkMode ? '#888888' : '#666666',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    accent: '#FF6A22',
    red: '#ef4444',
    green: '#10b981',
    yellow: '#f59e0b'
  }

  // Mock data para visualização inicial premium
  const stats = [
    { label: 'Total em Aberto', value: 'R$ 1.250.000', icon: AlertCircle, color: t.red },
    { label: 'Atraso > 30 Dias', value: 'R$ 450.000', icon: Clock, color: t.yellow },
    { label: 'Atraso > 90 Dias', value: 'R$ 180.000', icon: TrendingDown, color: t.red },
    { label: 'Índice Geral', value: '4.2%', icon: Users, color: t.accent },
    { label: 'Recuperação Mês', value: 'R$ 320.000', icon: Calendar, color: t.green },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      
      {/* Grid de KPIs Superiores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ 
            background: t.card, 
            borderRadius: 16, 
            padding: 20, 
            border: `1.5px solid ${t.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'all 0.3s ease'
          }} className="hover-lift">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: `${s.color}15`, padding: 8, borderRadius: 10 }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: t.text }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        
        {/* Painel Esquerdo: Distribuição por Envelhecimento (Aging) */}
        <div style={{ background: t.card, borderRadius: 20, padding: 32, border: `1px solid ${t.border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={22} color={t.accent} />
            Distribuição por Tempo de Atraso (Aging)
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { range: '0 - 30 Dias', val: 620000, pct: 49.6, color: t.green },
              { range: '31 - 60 Dias', val: 320000, pct: 25.6, color: t.yellow },
              { range: '61 - 90 Dias', val: 130000, pct: 10.4, color: '#f97316' },
              { range: 'Acima de 90 Dias', val: 180000, pct: 14.4, color: t.red },
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{item.range}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: t.text }}>R$ {item.val.toLocaleString('pt-BR')} ({item.pct}%)</span>
                </div>
                <div style={{ height: 10, background: 'rgba(0,0,0,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Painel Direito: Principais Devedores (Placeholder) */}
        <div style={{ background: t.card, borderRadius: 20, padding: 32, border: `1px solid ${t.border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: t.text, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={22} color={t.accent} />
            Principais Títulos em Aberto
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { client: 'CONSTRUTORA ALFA LTDA', val: 85400, days: 42 },
              { client: 'METALURGICA BETA SA', val: 62100, days: 15 },
              { client: 'AGRO COMERCIAL GAMA', val: 45800, days: 98 },
              { client: 'LOGISTICA DELTA EIRELI', val: 38200, days: 12 },
              { client: 'TEXTIL EPSILON', val: 29500, days: 55 },
            ].map((c, i) => (
              <div key={i} style={{ 
                background: 'rgba(0,0,0,0.03)', 
                padding: '16px 20px', 
                borderRadius: 12, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: `1px solid ${t.border}`
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: t.text }}>{c.client}</div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>Atrasado há {c.days} dias</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: t.red }}>R$ {c.val.toLocaleString('pt-BR')}</div>
                  <ArrowRight size={14} color={t.textMuted} style={{ marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
          
          <button style={{ 
            width: '100%', 
            marginTop: 24, 
            padding: '12px', 
            borderRadius: 10, 
            background: 'transparent', 
            border: `1.5px solid ${t.accent}`,
            color: t.accent,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}>
            VER TODOS OS TÍTULOS
            <ChevronRight size={18} />
          </button>
        </div>

      </div>

    </div>
  )
}
