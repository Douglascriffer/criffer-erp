'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Star, ShoppingCart, Wrench, Globe } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  if (Math.abs(v) >= 1e6) return `R$ ${(v / 1e6).toFixed(2)}M`
  if (Math.abs(v) >= 1e3) return `R$ ${(v / 1e3).toFixed(1)}K`
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

// Mapeamento de Ícones para Outros Canais
const CHANNEL_ICONS = {
  'Mercado Livre': { type: 'icon', icon: ShoppingCart, color: '#FFE600' },
  'Site': { type: 'img', src: '/logo-base.png' },
  'Assistência Técnica': { type: 'icon', icon: Wrench, color: '#3b82f6' },
  '-Nenhum vendedor-': { type: 'text' }
}

function SellerList({ items, title, hovered, setHovered, darkMode }) {
  const totalValue = items.reduce((acc, s) => acc + s.valMonth, 0)

  return (
    <div className="no-scrollbar" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', overflowY: 'auto', paddingRight: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, paddingLeft: 12, paddingRight: 12 }}>
        <h4 style={{
          fontSize: 15,
          fontWeight: 700,
          color: '#FF6A22',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          opacity: 0.8,
          margin: 0
        }}>{title}</h4>
        <div style={{ fontSize: 16, fontWeight: 700, color: darkMode ? '#fff' : '#000', opacity: 0.9 }}>
          {fmt(totalValue)}
        </div>
      </div>

      {items.map((s, i) => {
        const isHovered = hovered === s.name
        const rank = i + 1
        const channelCfg = CHANNEL_ICONS[s.name]

        return (
          <div
            key={s.name}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '12px 16px',
              background: isHovered ? (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent',
              border: '1px solid transparent',
              borderRadius: 12,
              transition: 'none',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {/* Rank/Badge */}
            <div style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 400,
              color: rank <= 3 && title.includes('EQUIPE') ? '#FF6A22' : (darkMode ? '#fff' : '#000')
            }}>
              {rank <= 3 && title.includes('EQUIPE') ? (
                <Star size={20} fill={rank === 1 ? '#FF6A22' : 'none'} />
              ) : rank}
            </div>

            {/* Avatar / Logo */}
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${darkMode ? '#333' : '#eee'}`,
              background: !EQUIPE_VENDAS.includes(s.name) ? '#000000' : (darkMode ? '#1a1a24' : '#f8f8f8'),
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(() => {
                if (EQUIPE_VENDAS.includes(s.name)) {
                  return s.img && s.img.startsWith('/') ?
                    <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                    <span style={{ fontSize: 18, fontWeight: 400 }}>{s.name.charAt(0)}</span>
                }

                if (channelCfg?.type === 'img') {
                  return <img src={channelCfg.src} alt={s.name} style={{ width: '70%', height: '70%', objectFit: 'contain' }} />
                }
                if (channelCfg?.type === 'icon') {
                  const Icon = channelCfg.icon
                  return <Icon size={30} color={channelCfg.color} />
                }
                return <span style={{ fontSize: 18, fontWeight: 400, opacity: 0.5 }}>{s.name.charAt(0)}</span>
              })()}
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 400, color: darkMode ? '#fff' : '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.name}
              </p>
            </div>

            {/* Monthly Revenue */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 400, color: '#FF6A22' }}>
                {fmt(s.valMonth)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function GraficoVendedores({ sellers = [], darkMode = false, filters = { ano: '2026', mes: '3' } }) {
  const [hovered, setHovered] = useState(null)

  // Filtrar dados pelo Mês e Ano selecionado
  const sellersMap = {}
  sellers.forEach(s => {
    const matchAno = s.ano === Number(filters.ano)
    const matchMes = filters.mes === 'all' || s.mes === Number(filters.mes)

    if (matchAno && matchMes) {
      if (!sellersMap[s.name]) {
        sellersMap[s.name] = {
          name: s.name,
          valMonth: 0,
          img: PHOTO_MAP[s.name] || s.img
        }
      }
      sellersMap[s.name].valMonth += s.val
    }
  })

  const allSellers = Object.values(sellersMap)
  const salesTeam = allSellers
    .filter(s => EQUIPE_VENDAS.includes(s.name))
    .sort((a, b) => b.valMonth - a.valMonth)

  const otherChannels = allSellers
    .filter(s => !EQUIPE_VENDAS.includes(s.name))
    .sort((a, b) => b.valMonth - a.valMonth)

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', gap: 48, overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <SellerList items={salesTeam} title="Equipe de Vendas" hovered={hovered} setHovered={setHovered} darkMode={darkMode} />
      <div style={{ width: 1, background: (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') }} />
      <SellerList items={otherChannels} title="Outros Canais" hovered={hovered} setHovered={setHovered} darkMode={darkMode} />
    </div>
  )
}
