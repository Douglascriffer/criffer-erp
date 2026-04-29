'use client'
import { useState, useMemo, useEffect } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

const UF_MAP = {
  'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA',
  'Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR',
  'Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO'
}

const UF_NAMES = {
  'AC':'Acre','AL':'Alagoas','AP':'Amapá','AM':'Amazonas','BA':'Bahia','CE':'Ceará',
  'DF':'Distrito Federal','ES':'Espírito Santo','GO':'Goiás','MA':'Maranhão',
  'MT':'Mato Grosso','MS':'Mato Grosso do Sul','MG':'Minas Gerais','PA':'Pará',
  'PB':'Paraíba','PR':'Paraná','PE':'Pernambuco','PI':'Piauí','RJ':'Rio de Janeiro',
  'RN':'Rio Grande do Norte','RS':'Rio Grande do Sul','RO':'Rondônia','RR':'Roraima',
  'SC':'Santa Catarina','SP':'São Paulo','SE':'Sergipe','TO':'Tocantins'
}

export default function MapaHeatBrasil({ stateData = [], darkMode = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Consolida o faturamento por estado
  const stats = useMemo(() => {
    const map = {}
    stateData.forEach(d => {
      const uf = d.estado || d.uf
      map[uf] = (map[uf] || 0) + (d.faturamento || d.valor || 0)
    })
    return map
  }, [stateData])

  // Lista de estados ativos (com faturamento > 0)
  const activeStates = useMemo(() => {
    return Object.entries(stats)
      .filter(([_, val]) => val > 0)
      .sort((a,b) => b[1] - a[1])
  }, [stats])

  const maxVal = Math.max(...Object.values(stats), 1)

  // Ciclo automático a cada 3 segundos
  useEffect(() => {
    if (activeStates.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeStates.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [activeStates])

  const currentUF = activeStates[currentIndex]?.[0] || null
  const currentVal = activeStates[currentIndex]?.[1] || 0

  const colorScale = scaleLinear()
    .domain([0, maxVal * 0.2, maxVal])
    .range(darkMode ? ['#1a1a1a', '#FF6A2240', '#FF6A22'] : ['#f9f9f9', '#ffccb3', '#FF6A22'])

  return (
    <div style={{ position: 'relative', width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
      
      {/* Labels Dinâmicos (Esquerda) */}
      <div style={{ 
        position: 'absolute', left: 0, top: '45%', transform: 'translateY(-50%)', 
        zIndex: 10, pointerEvents: 'none', textAlign: 'left', width: '40%' 
      }}>
        <div style={{ animation: 'fadeInLeft 0.5s ease' }} key={currentUF}>
          <div style={{ fontSize: 16, fontWeight: 500, color: darkMode ? '#fff' : '#333', marginBottom: 4 }}>
            {currentUF} - {UF_NAMES[currentUF]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: darkMode ? '#888' : '#666' }}>
            Faturamento: {Math.round(currentVal / 1000)}k
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Mapa (Direita/Centro) */}
      <div style={{ width: '100%', marginLeft: '20%' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-55, -18], scale: 300 }}
          width={500} height={300}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const uf = UF_MAP[geo.properties.name] || geo.properties.sigla
                const val = stats[uf] || 0
                const isActive = currentUF === uf

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isActive ? '#FF6A22' : (val > 0 ? colorScale(val) : (darkMode ? '#151515' : '#eee'))}
                    stroke={isActive ? '#fff' : (darkMode ? '#333' : '#fff')}
                    strokeWidth={isActive ? 1.5 : 0.5}
                    style={{
                      default: { outline: 'none', transition: 'all 0.5s ease' },
                      hover: { outline: 'none', fill: '#FF6A22', cursor: 'pointer' },
                      pressed: { outline: 'none' }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legenda de calor compacta */}
      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, color: '#888' }}>MÍN</span>
        <div style={{ width: 80, height: 4, borderRadius: 2, background: `linear-gradient(to right, ${darkMode ? '#1a1a1a' : '#eee'}, #FF6A22)` }} />
        <span style={{ fontSize: 9, color: '#888' }}>MÁX</span>
      </div>
    </div>
  )
}
