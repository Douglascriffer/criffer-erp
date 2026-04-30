'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  if (Math.abs(v) >= 1e6) return `R$ ${(v/1e6).toFixed(2)}M`
  if (Math.abs(v) >= 1e3) return `R$ ${(v/1e3).toFixed(1)}K`
  return `R$ ${Math.round(v).toLocaleString('pt-BR')}`
}

const EQUIPE_VENDAS = [
  'Rogislei Vieira Padilha',
  'Gabriel Klein',
  'Gabriel Ferreira dos Santos',
  'Gabriel Medeiros',
  'Josiane Govoni Lanzarini',
  'Gabriel Dias',
  'Vanessa Ferreira'
]

const PHOTO_MAP = {
  'Rogislei Vieira Padilha': '/vendedores/Rogislei Vieira Padilha.jpg',
  'Gabriel Klein': '/vendedores/Gabriel Klein.jpg',
  'Gabriel Ferreira dos Santos': '/vendedores/Gabriel Ferreira dos Santos.jpg',
  'Gabriel Medeiros': '/vendedores/Gabriel Medeiros.jpg',
  'Josiane Govoni Lanzarini': '/vendedores/Josiane Govoni Lanzarini.jpg',
  'Gabriel Dias': '/vendedores/Gabriel Dias.jpg',
  'Vanessa Ferreira': '/vendedores/Vanessa Ferreira.jpg'
}

export default function GraficoVendedores({ sellers = [], darkMode = false }) {
  const [hovered, setHovered] = useState(null)

  // Agrupar dados por vendedor para YoY
  const sellersMap = {}
  sellers.forEach(s => {
    if (!sellersMap[s.name]) {
      sellersMap[s.name] = { 
        name: s.name, 
        val2026: 0, 
        val2025: 0, 
        img: PHOTO_MAP[s.name] || s.img 
      }
    }
    if (s.ano === 2026) sellersMap[s.name].val2026 += s.val
    if (s.ano === 2025) sellersMap[s.name].val2025 += s.val
  })

  const allSellers = Object.values(sellersMap)
  const salesTeam = allSellers
    .filter(s => EQUIPE_VENDAS.includes(s.name))
    .sort((a, b) => b.val2026 - a.val2026)
  
  const otherChannels = allSellers
    .filter(s => !EQUIPE_VENDAS.includes(s.name))
    .sort((a, b) => b.val2026 - a.val2026)

  const SellerList = ({ items, title }) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h4 style={{ 
        fontSize: 11, 
        fontWeight: 700, 
        color: '#FF6A22', 
        letterSpacing: 1.5, 
        textTransform: 'uppercase',
        marginBottom: 8,
        paddingLeft: 12,
        opacity: 0.8
      }}>{title}</h4>
      
      {items.map((s, i) => {
        const diff = s.val2026 - s.val2025
        const pct = s.val2025 > 0 ? (diff / s.val2025 * 100) : 0
        const isUp = diff >= 0
        const isHovered = hovered === s.name
        const rank = i + 1

        return (
          <div 
            key={s.name}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '10px 16px',
              background: isHovered ? (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent',
              border: `1px solid ${isHovered ? '#FF6A22' : 'transparent'}`,
              borderRadius: 12,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {/* Rank/Badge */}
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              background: rank <= 3 && title.includes('EQUIPE') ? '#FF6A2215' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: rank <= 3 && title.includes('EQUIPE') ? '#FF6A22' : (darkMode ? '#666' : '#999')
            }}>
              {rank <= 3 && title.includes('EQUIPE') ? (
                <Star size={14} fill={rank === 1 ? '#FF6A22' : 'none'} />
              ) : rank}
            </div>

            {/* Avatar */}
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: `2px solid ${isHovered ? '#FF6A22' : (darkMode ? '#333' : '#eee')}`,
              background: '#f5f5f5',
              flexShrink: 0
            }}>
              {s.img && s.img.startsWith('/') ? (
                <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#999', fontWeight: 600 }}>
                  {s.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name & Revenue */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: darkMode ? '#fff' : '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.name}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#FF6A22', fontWeight: 600 }}>
                {fmt(s.val2026)}
              </p>
            </div>

            {/* YoY Trend */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                fontSize: 10, 
                fontWeight: 700, 
                color: isUp ? '#22c55e' : '#ef4444' 
              }}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {Math.abs(pct).toFixed(0)}%
              </div>
              <div style={{ fontSize: 9, color: (darkMode ? '#666' : '#999'), textTransform: 'uppercase' }}>YoY</div>
            </div>

            {/* Tooltip Detalhado */}
            {isHovered && (
              <div style={{
                position: 'absolute',
                top: -10,
                right: '105%',
                width: 180,
                background: darkMode ? '#1e1e2d' : '#fff',
                border: `1px solid ${darkMode ? '#333' : '#eee'}`,
                borderRadius: 8,
                padding: 12,
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 100,
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#FF6A22', marginBottom: 8, textTransform: 'uppercase' }}>Detalhamento</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: (darkMode ? '#aaa' : '#666') }}>2026:</span>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{fmt(s.val2026)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: (darkMode ? '#aaa' : '#666') }}>2025:</span>
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{fmt(s.val2025)}</span>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <div style={{ width: '100%', display: 'flex', gap: 32 }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      
      <SellerList items={salesTeam} title="Equipe de Vendas" />
      <div style={{ width: 1, background: (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') }} />
      <SellerList items={otherChannels} title="Outros Canais" />
    </div>
  )
}
