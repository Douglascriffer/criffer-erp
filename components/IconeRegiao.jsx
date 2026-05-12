'use client'
import React from 'react'

export default function IconeRegiao({ regiao, color = '#FF6A22', size = 48 }) {
  // Ícones de Luxo baseados na nova referência (Neon Line Art)
  const icons = {
    'SUDESTE': (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <path d="M10 90h80M20 90V40h15v50M40 90V20h20v70M65 90V50h15v40" />
        <path d="M15 70l25-25 15 15 30-35m0 0h-10m10 0v10" strokeWidth="2" />
        <circle cx="50" cy="55" r="12" fill="rgba(255,106,34,0.1)" strokeWidth="2" />
        <text x="46" y="61" fontSize="16" fill={color} fontWeight="900" stroke="none">$</text>
      </g>
    ),
    'SUL': (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <path d="M10 80l20-40 20 30 25-50 15 60M5 80h90" />
        <path d="M30 80V55m-8 0l8-10 8 10M30 65l-6 8M30 65l6 8" /> {/* Araucária 1 */}
        <path d="M70 80V50m-8 0l8-10 8 10M70 60l-6 8M70 60l6 8" /> {/* Araucária 2 */}
      </g>
    ),
    'NORDESTE': (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <circle cx="50" cy="30" r="15" />
        <path d="M50 10v5M70 30h5M30 30h5M50 50v5M65 15l4 4M35 15l-4 4" />
        <path d="M10 85c15-10 35 10 50 0s25 5 30 0" />
        <path d="M60 80l20-25v25h-20z" fill="rgba(255,106,34,0.1)" />
      </g>
    ),
    'NORTE': (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <path d="M10 50c30-10 40 40 80 0" strokeWidth="3" opacity="0.6" /> {/* Rio */}
        <path d="M25 50V30m-10 0l10-10 10 10M25 40l-8 8M25 40l8 8" /> {/* Árvore 1 */}
        <path d="M75 50V30m-10 0l10-10 10 10M75 40l-8 8M75 40l8 8" /> {/* Árvore 2 */}
        <path d="M40 70h20l5 5h-30l5-5z" fill="rgba(255,106,34,0.1)" /> {/* Barco */}
      </g>
    ),
    'CENTRO-OESTE': (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <path d="M30 80c5-30 35-30 40 0M40 80c2-20 18-20 20 0M50 80V30m-5 0h10" /> {/* Catedral */}
        <rect x="15" y="60" width="20" height="15" rx="2" /> {/* Trator/Máquina */}
        <path d="M80 80V50m-5 5h10M80 65h10" /> {/* Trigo/Plantação */}
      </g>
    ),
    'EXTERIOR': (
      <g stroke={color} fill="none" strokeWidth="1.5">
        <circle cx="50" cy="50" r="35" strokeWidth="2" />
        <ellipse cx="50" cy="50" rx="12" ry="35" />
        <path d="M15 50h70M22 30h56M22 70h56" />
        <path d="M50 15c40 0 40 70 0 70s-40-70 0-70" opacity="0.4" /> {/* Órbita */}
        <text x="35" y="95" fontSize="10" fill={color} fontWeight="bold" stroke="none">$ € ¥ £</text>
      </g>
    )
  }

  const selectedIcon = icons[regiao] || icons['SUDESTE']

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ 
        filter: `drop-shadow(0 0 8px rgba(255,106,34,0.6))`,
        display: 'block'
      }}
    >
      {selectedIcon}
    </svg>
  )
}
