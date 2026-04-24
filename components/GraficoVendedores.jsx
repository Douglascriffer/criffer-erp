'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  if (Math.abs(v) >= 1e6) return `R$ ${(v/1e6).toFixed(2)}M`
  if (Math.abs(v) >= 1e3) return `R$ ${(v/1e3).toFixed(1)}K`
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`
}

export default function GraficoVendedores({ sellers = [], darkMode = false }) {
  const [hovered, setHovered] = useState(null)

  // Agrupar dados por vendedor para YoY
  const sellersMap = {}
  sellers.forEach(s => {
    if (!sellersMap[s.name]) sellersMap[s.name] = { name: s.name, val2026: 0, val2025: 0, img: s.img }
    if (s.ano === 2026) sellersMap[s.name].val2026 += s.val
    if (s.ano === 2025) sellersMap[s.name].val2025 += s.val
  })

  const ranking = Object.values(sellersMap)
    .sort((a, b) => b.val2026 - a.val2026)

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <style>{`
        @keyframes border-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .seller-card:hover .avatar-ring { animation: border-spin 3s linear infinite; }
      `}</style>

      {ranking.map((s, i) => {
        const diff = s.val2026 - s.val2025
        const pct = s.val2025 > 0 ? (diff / s.val2025 * 100) : 0
        const isUp = diff >= 0
        const isHovered = hovered === s.name

        return (
          <div 
            key={s.name}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '16px 24px',
              background: isHovered ? (darkMode ? 'rgba(255,106,34,0.1)' : 'rgba(255,106,34,0.05)') : 'transparent',
              border: `1.5px solid ${isHovered ? '#FF6A22' : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}`,
              borderRadius: 20,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'visible'
            }}
            className="seller-card"
          >
            {/* Rank Number */}
            <div style={{ 
              fontSize: 20, 
              fontWeight: 900, 
              color: i === 0 ? '#FF6A22' : (darkMode ? '#444' : '#ccc'), 
              width: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {i === 0 ? <Star size={20} fill="#FF6A22" /> : i + 1}
            </div>

            {/* Avatar with Animated Ring */}
            <div style={{ position: 'relative', width: 50, height: 50 }}>
              <div 
                className="avatar-ring"
                style={{ 
                  position: 'absolute', inset: -3, borderRadius: '50%',
                  background: isHovered ? 'conic-gradient(from 0deg, #FF6A22, #ffb899, #FF6A22)' : 'transparent',
                  padding: 2
                }}
              />
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '50%', 
                background: darkMode ? '#222' : '#f0f0f0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 900, color: '#FF6A22',
                position: 'relative', zIndex: 1,
                border: `2px solid ${darkMode ? '#0c0c14' : '#fff'}`
              }}>
                {s.img}
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: darkMode ? '#fff' : '#000' }}>{s.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                <span style={{ fontWeight: 900, color: '#FF6A22', fontSize: 14 }}>{fmt(s.val2026)}</span>
                <span style={{ 
                  display: 'flex', alignItems: 'center', gap: 4, 
                  fontSize: 11, fontWeight: 800, 
                  color: isUp ? '#22c55e' : '#ef4444'
                }}>
                  {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {Math.abs(pct).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Hover Card (Details) */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '100%',
                transform: 'translateY(-50%)',
                marginLeft: 20,
                background: darkMode ? '#1a1a1a' : '#fff',
                border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 20,
                padding: 20,
                width: 240,
                zIndex: 200,
                boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
                animation: 'fadeInUp 0.3s ease'
              }}>
                <p style={{ fontSize: 11, fontWeight: 900, color: '#FF6A22', textTransform: 'uppercase', marginBottom: 12 }}>Performance YoY</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: darkMode ? '#aaa' : '#666' }}>2026 (Atual)</span>
                    <span style={{ fontSize: 13, fontWeight: 900 }}>{fmt(s.val2026)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: darkMode ? '#aaa' : '#666' }}>2025 (Anterior)</span>
                    <span style={{ fontSize: 13, fontWeight: 800 }}>{fmt(s.val2025)}</span>
                  </div>
                  <div style={{ height: 1, background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>Crescimento</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: isUp ? '#22c55e' : '#ef4444' }}>
                      {isUp ? '+' : ''}{fmt(diff)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
