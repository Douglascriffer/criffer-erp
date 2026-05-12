'use client'
import React from 'react'

export default function IconeRegiao({ regiao, color = '#FF6A22', size = 32 }) {
  // Ícones customizados enviados pelo Douglas (Infografia Corporativa)
  const icons = {
    'SUDESTE': (
      <g stroke={color} fill="none" strokeWidth="2">
        <path d="M20 80h60M30 80V40h15v40M50 80V25h15v55M70 80V50h10M25 60l15-15 10 10 20-25m0 0h-8m8 0v8" />
        <circle cx="57" cy="55" r="8" strokeWidth="1.5" />
        <text x="54" y="59" fontSize="10" fill={color} fontWeight="bold" stroke="none">$</text>
      </g>
    ),
    'SUL': (
      <g stroke={color} fill="none" strokeWidth="2">
        <path d="M10 70l20-30 15 15 25-35 20 50M20 80c0-10 10-10 10 0M70 80c0-15 15-15 15 0M45 85V65m-8 0h16" />
      </g>
    ),
    'NORDESTE': (
      <g stroke={color} fill="none" strokeWidth="2">
        <circle cx="50" cy="35" r="12" />
        <path d="M50 15v5m0 30v5m20-20h5m-50 0h5M15 80c10-5 20 5 35 0s25 5 35 0M40 70l15-20v25z" />
      </g>
    ),
    'NORTE': (
      <g stroke={color} fill="none" strokeWidth="2">
        <path d="M20 20c5 20-5 40 0 60M80 20c-5 20 5 40 0 60M30 40c20-10 20 30 40 20M45 75l10-5 10 5-10 5z" />
        <path d="M25 30l10-5 10 5M65 30l10-5 10 5" strokeWidth="1.5" />
      </g>
    ),
    'CENTRO-OESTE': (
      <g stroke={color} fill="none" strokeWidth="2">
        <path d="M30 70h40L50 30zM20 85h60M25 85V70m10 15V75m40 10V70M15 40h10M80 40h10" />
        <circle cx="85" cy="75" r="5" strokeWidth="1.5" />
      </g>
    ),
    'EXTERIOR': (
      <g stroke={color} fill="none" strokeWidth="2">
        <circle cx="50" cy="50" r="35" />
        <ellipse cx="50" cy="50" rx="15" ry="35" strokeWidth="1.5" />
        <path strokeWidth="1.5" d="M15 50h70M22 30h56M22 70h56" />
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
        filter: `drop-shadow(0 0 5px rgba(249,115,22,0.8))`,
        display: 'block'
      }}
    >
      {selectedIcon}
    </svg>
  )
}
