'use client'
import React from 'react'

export default function IconeRegiao({ regiao, size = 60 }) {
  // Mapeamento para os Badges Executivos Hexagonais (Enterprise Style)
  const map = {
    'SUDESTE': '/assets/regioes/sudeste.png',
    'SUL': '/assets/regioes/sul.png',
    'NORDESTE': '/assets/regioes/nordeste.png',
    'NORTE': '/assets/regioes/norte.png',
    'CENTRO-OESTE': '/assets/regioes/centro_oeste.png',
    'EXTERIOR': '/assets/regioes/exterior.png'
  }

  const src = map[regiao] || map['SUDESTE']

  return (
    <div style={{ 
      width: size, 
      height: size, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <img 
        src={src} 
        alt={regiao} 
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 8px rgba(255,106,34,0.6)) brightness(1.2)',
          transition: 'all 0.3s ease'
        }} 
      />
    </div>
  )
}
