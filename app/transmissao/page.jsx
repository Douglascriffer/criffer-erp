'use client'
import { useState, useEffect } from 'react'
import TVMode from '@/components/TVMode'

export default function TransmissaoPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados reais do ERP
    fetch('/data/dados.json')
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Erro ao carregar dados para transmissão:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{ 
        width: '100vw', height: '100vh', background: '#000', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FF6A22', fontSize: 24, fontWeight: 900, textTransform: 'uppercase'
      }}>
        Iniciando Transmissão Criffer...
      </div>
    )
  }

  return <TVMode data={data} />
}
