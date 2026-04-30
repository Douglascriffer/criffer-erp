'use client'
import { useMemo } from 'react'

const REGIONS = {
  'AC':'Norte','AM':'Norte','AP':'Norte','PA':'Norte','RO':'Norte','RR':'Norte','TO':'Norte',
  'AL':'Nordeste','BA':'Nordeste','CE':'Nordeste','MA':'Nordeste','PB':'Nordeste','PE':'Nordeste','PI':'Nordeste','RN':'Nordeste','SE':'Nordeste',
  'DF':'Centro-Oeste','GO':'Centro-Oeste','MS':'Centro-Oeste','MT':'Centro-Oeste',
  'ES':'Sudeste','MG':'Sudeste','RJ':'Sudeste','SP':'Sudeste',
  'PR':'Sul','RS':'Sul','SC':'Sul',
  'EX':'Exterior'
}

const COLORS = ['#FF6A22', '#FF854D', '#FFA378', '#FFC1A3', '#FFDECE']

export default function MapaRegional({ stateData = [], officialTotal = 0, darkMode = false }) {
  const data = useMemo(() => {
    const map = {}
    stateData.forEach(d => {
      const reg = REGIONS[d.estado] || 'Outros'
      map[reg] = (map[reg] || 0) + (d.faturamento || d.valor || 0)
    })
    
    let entries = Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)

    // Ajuste Proporcional para bater com o Total Oficial
    if (officialTotal > 0) {
      const currentGross = entries.reduce((acc, curr) => acc + curr.value, 0)
      if (currentGross > 0) {
        const scaleFactor = officialTotal / currentGross
        entries = entries.map(item => ({
          ...item,
          value: Math.round(item.value * scaleFactor)
        }))
      }
    }

    return entries
  }, [stateData, officialTotal])

  const maxVal = data[0]?.value || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {data.map((item, i) => {
        const pct = (item.value / maxVal) * 100
        return (
          <div key={item.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
              <span style={{ color: darkMode ? '#ffffff' : '#000000', fontWeight: 400 }}>{item.name}</span>
              <span style={{ color: darkMode ? '#ffffff' : '#000000', fontWeight: 400, opacity: 0.8 }}>R$ {item.value.toLocaleString('pt-BR')}</span>
            </div>
            <div style={{ height: 6, background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ 
                width: `${pct}%`, 
                height: '100%', 
                background: COLORS[i % COLORS.length], 
                transition: 'width 0.8s ease-out' 
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
