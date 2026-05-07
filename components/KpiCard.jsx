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

      {/* Valores: Atual e Anterior */}
      <div style={{ textAlign: 'center', width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontSize: 24, fontWeight: 900, color: theme.text, lineHeight: 1.1, margin: 0 }}>
          {isPercent ? `${value.toFixed(1)}%` : fmt(value)}
        </p>
        
        {!hideDiff && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted }}>
              {isPercent ? `${prevValue.toFixed(1)}%` : fmt(prevValue)}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 900, color: isUp ? '#22c55e' : '#ef4444' }}>
              {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(pct).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default KpiCard
