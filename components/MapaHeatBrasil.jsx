'use client'
import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

// GeoJSON simplificado dos estados brasileiros
const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

// Mapeamento de nomes do GeoJSON para siglas UF
const UF_MAP = {
  'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA',
  'Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR',
  'Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO'
}

export default function MapaHeatBrasil({ stateData = [], darkMode = false }) {
  const [hoverUF, setHoverUF] = useState(null)

  // Consolida o faturamento por estado
  const stats = useMemo(() => {
    const map = {}
    stateData.forEach(d => {
      const uf = d.estado || d.uf
      map[uf] = (map[uf] || 0) + (d.faturamento || d.valor || 0)
    })
    return map
  }, [stateData])

  const maxVal = Math.max(...Object.values(stats), 1)

  // Escala de cores: Tons de Laranja Criffer
  const colorScale = scaleLinear()
    .domain([0, maxVal * 0.2, maxVal])
    .range(darkMode ? ['#1a1a1a', '#FF6A2240', '#FF6A22'] : ['#f9f9f9', '#ffccb3', '#FF6A22'])

  return (
    <div style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
      {/* Tooltip flutuante simplificado */}
      {hoverUF && stats[hoverUF] > 0 && (
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          background: '#FF6A22', color: '#fff', padding: '4px 12px', borderRadius: 20,
          fontSize: 11, zIndex: 10, pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex', gap: 8
        }}>
          <span style={{ fontWeight: 700 }}>{hoverUF}</span>
          <span style={{ opacity: 0.8 }}>R$ {Math.round(stats[hoverUF]).toLocaleString('pt-BR')}</span>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [-55, -15], scale: 300 }}
        width={500} height={300}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const uf = UF_MAP[geo.properties.name] || geo.properties.sigla
              const val = stats[uf] || 0
              const isHovered = hoverUF === uf

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHoverUF(uf)}
                  onMouseLeave={() => setHoverUF(null)}
                  fill={val > 0 ? colorScale(val) : (darkMode ? '#151515' : '#eee')}
                  stroke={darkMode ? '#333' : '#fff'}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none', transition: 'all 0.2s' },
                    hover: { outline: 'none', fill: '#FF6A22', cursor: 'pointer' },
                    pressed: { outline: 'none' }
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legenda de calor compacta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: -10 }}>
        <span style={{ fontSize: 9, color: '#888' }}>MÍN</span>
        <div style={{ width: 80, height: 4, borderRadius: 2, background: `linear-gradient(to right, ${darkMode ? '#1a1a1a' : '#eee'}, #FF6A22)` }} />
        <span style={{ fontSize: 9, color: '#888' }}>MÁX</span>
      </div>
    </div>
  )
}
