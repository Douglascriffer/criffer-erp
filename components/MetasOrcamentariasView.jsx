'use client'
import React from 'react'
import { Target, TrendingUp, ArrowDownCircle, DollarSign, PieChart, AlertTriangle } from 'lucide-react'

const fmtBRL = (v) => {
  return Math.round(v).toLocaleString('pt-BR')
}

const fmtFull = (v) => {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function MetasOrcamentariasView({ darkMode }) {
  const t = {
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#cccccc' : '#444444',
    textMuted: darkMode ? '#888888' : '#666666',
    border: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    card: darkMode ? '#252538' : '#ffffff',
    accent: '#FF6A22',
    blue: '#3b82f6',
    green: '#22c55e',
    red: '#ef4444'
  }

  // Dados extraídos da planilha
  const metaInicial = {
    receita: 26674257,
    despesas: -27797748,
    resultado: -1123491.39,
    lucro: 3000000,
    ganho: -4123491.39,
    economia: 0.23 // 23%
  }

  const metaAtualizada = {
    receita: 27119218.15,
    despesas: -27072000.38,
    resultado: 47217.77,
    lucro: 3000000,
    ganho: -2952782.23,
    economia: 0.1669 // 16.7%
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Título Superior */}
      <div style={{ borderBottom: `1px solid ${t.border}`, paddingBottom: 16, textAlign: 'center' }}>
         <h2 style={{ fontSize: 20, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>
            Meta Inicial vs Meta Atualizada — 2026
         </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        
        {/* CARD: META INICIAL */}
        <GoalCard 
          title="Meta Inicial" 
          data={metaInicial} 
          t={t} 
          darkMode={darkMode} 
          borderColor={t.blue}
        />

        {/* CARD: META ATUALIZADA */}
        <GoalCard 
          title="Meta Atualizada" 
          data={metaAtualizada} 
          t={t} 
          darkMode={darkMode} 
          borderColor={t.accent}
          highlight
        />

      </div>
    </div>
  )
}

function GoalCard({ title, data, t, darkMode, borderColor, highlight }) {
  return (
    <div style={{ 
      background: t.card, 
      borderRadius: 24, 
      border: `2px solid ${borderColor}`,
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Label Principal */}
      <h3 style={{ fontSize: 20, fontWeight: 900, color: highlight ? t.accent : t.blue, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center' }}>
        {title}
      </h3>

      {/* Lista de Itens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ItemRow label="Receita Bruta" value={data.receita} color={t.green} t={t} />
        <ItemRow label="Despesas" value={data.despesas} color={t.red} t={t} />
        <ItemRow label="Resultado" value={data.resultado} color={data.resultado >= 0 ? t.green : t.red} t={t} prefix={data.resultado >= 0 ? '+' : ''}/>
        <ItemRow label="Lucro Esperado" value={data.lucro} color={t.blue} t={t} />
        <ItemRow label="Ganho Necessário" value={data.ganho} color={t.red} t={t} />
      </div>

      {/* Box de Economia */}
      <div style={{ 
        marginTop: 'auto',
        background: highlight ? 'rgba(255,106,34,0.05)' : 'rgba(59,130,246,0.05)',
        borderRadius: 20,
        padding: '24px',
        textAlign: 'center',
        border: `1px solid ${highlight ? 'rgba(255,106,34,0.1)' : 'rgba(59,130,246,0.1)'}`
      }}>
        <p style={{ fontSize: 18, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Economia Necessária</p>
        <p style={{ fontSize: 18, fontWeight: 900, color: highlight ? t.accent : t.blue }}>
          {(data.economia * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  )
}

function ItemRow({ label, value, color, t, prefix = '' }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${t.border}`, paddingBottom: 12 }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: t.textSub }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 900, color: color }}>
        {prefix}{fmtBRL(value)}
      </span>
    </div>
  )
}
