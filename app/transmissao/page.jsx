'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import TVMode from '@/components/TVMode'

function TransmissaoContent() {
  const searchParams = useSearchParams()
  const mes = searchParams.get('mes') || 'all'
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  return <TVMode data={data} mes={mes} />
}

export default function TransmissaoPage() {
  return (
    <Suspense fallback={<div style={{ background: '#000', height: '100vh' }} />}>
      <TransmissaoContent />
    </Suspense>
  )
}
