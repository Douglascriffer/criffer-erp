import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const KpiCard = ({ label, value, prevValue, icon: Icon, color, isPercent=false, hideDiff=false, darkMode=true }) => {
  const diff = value - prevValue
  const pct = prevValue > 0 ? (diff / prevValue * 100) : 0
  const isUp = diff >= 0

  const theme = {
    card: darkMode ? '#1a1a1a' : '#ffffff',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    text: darkMode ? '#ffffff' : '#000000',
    textMuted: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
  }

  const fmt = (v) => {
    if (!v && v !== 0) return '—'
    return `${Math.round(v).toLocaleString('pt-BR')}`
  }

  return (
    <div style={{
      background: theme.card,
      border: `1.5px solid ${theme.border}`,
      borderRadius: 12,
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.03)',
      minHeight: 95
    }}>
      
      {/* Ícone no Topo Esquerdo */}
      <div style={{ position: 'absolute', top: 12, left: 12, opacity: 0.8 }}>
        <Icon size={18} color={color} />
      </div>

      {/* Rótulo no Topo Centro */}
      <div style={{ textAlign: 'center', width: '100%', marginTop: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: theme.text, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{label}</p>
      </div>

      {/* Valor na Base Centro */}
      <div style={{ textAlign: 'center', width: '100%', marginTop: 'auto', marginBottom: 4 }}>
        <p style={{ fontSize: 22, fontWeight: 900, color: theme.text, lineHeight: 1, margin: 0 }}>
          {isPercent ? `${value.toFixed(1)}%` : fmt(value)}
        </p>
      </div>

      {!hideDiff && (
        <div style={{ position: 'absolute', bottom: 8, right: 12, display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 700, color: isUp ? '#22c55e' : '#ef4444' }}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(pct).toFixed(1)}%
        </div>
      )}
    </div>
  )
}

export default KpiCard
