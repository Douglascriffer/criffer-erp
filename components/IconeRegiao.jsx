'use client'
import React from 'react'

export default function IconeRegiao({ regiao, color = '#FF6A22', size = 40 }) {
  // SVGs otimizados que representam o recorte real de cada região do Brasil
  const paths = {
    'SUL': (
      <path d="M40 70 L60 70 L70 90 L50 100 L30 90 Z" /> // Silhueta simplificada do Sul
    ),
    'SUDESTE': (
      <path d="M50 40 L80 50 L90 70 L70 85 L40 75 L45 55 Z" /> // Sudeste
    ),
    'CENTRO-OESTE': (
      <path d="M30 30 L60 25 L75 50 L60 75 L35 70 L25 45 Z" /> // Centro-Oeste
    ),
    'NORDESTE': (
      <path d="M60 10 L85 10 L100 35 L85 60 L65 45 L55 30 Z" /> // Nordeste
    ),
    'NORTE': (
      <path d="M5 10 L55 5 L65 35 L45 65 L15 60 L5 35 Z" /> // Norte
    )
  }

  // Se for Exterior, mantemos um ícone de Planeta Terra mais estilizado em SVG
  if (regiao === 'EXTERIOR') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 5px ${color}44)` }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  }

  const selectedPath = paths[regiao] || paths['SUL']

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}>
      {selectedPath}
    </svg>
  )
}
