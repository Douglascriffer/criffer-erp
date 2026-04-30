'use client'
import { useMemo } from 'react'
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

const REGIONS = {
  'AC':'Norte','AM':'Norte','AP':'Norte','PA':'Norte','RO':'Norte','RR':'Norte','TO':'Norte',
  'AL':'Nordeste','BA':'Nordeste','CE':'Nordeste','MA':'Nordeste','PB':'Nordeste','PE':'Nordeste','PI':'Nordeste','RN':'Nordeste','SE':'Nordeste',
  'DF':'Centro-Oeste','GO':'Centro-Oeste','MS':'Centro-Oeste','MT':'Centro-Oeste',
  'ES':'Sudeste','MG':'Sudeste','RJ':'Sudeste','SP':'Sudeste',
  'PR':'Sul','RS':'Sul','SC':'Sul'
}

export default function MapaHeatBrasil({ stateData = [], darkMode = false, syncIndex = 0 }) {
  // Consolida o faturamento por estado e por região
  const { stats, regionTotals } = useMemo(() => {
    const s = {}
    const r = {}
    stateData.forEach(d => {
      const uf = d.estado || d.uf
      const val = d.faturamento || d.valor || 0
      s[uf] = (s[uf] || 0) + val
      
      const region = REGIONS[uf] || 'Outros'
      r[region] = (r[region] || 0) + val
    })
    return { stats: s, regionTotals: r }
  }, [stateData])

  const allUFs = useMemo(() => Object.keys(UF_NAMES).sort(), [])
  const currentUF = allUFs[syncIndex % allUFs.length]
  const currentVal = stats[currentUF] || 0
  const currentRegion = REGIONS[currentUF] || 'Outros'
  const regionTotal = regionTotals[currentRegion] || 1
  const regionPct = ((currentVal / regionTotal) * 100).toFixed(0)

  const maxVal = Math.max(...Object.values(stats), 1)

  const colorScale = scaleLinear()
    .domain([0, maxVal])
    .range(['#fff5f0', '#FF6A22'])

  return (
    <div style={{ position: 'relative', width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
      
      {/* Labels Dinâmicos (Esquerda) */}
      <div style={{ 
        position: 'absolute', left: 0, top: '45%', transform: 'translateY(-50%)', 
        zIndex: 10, pointerEvents: 'none', textAlign: 'left', width: '45%' 
      }}>
        <div style={{ animation: 'fadeInLeft 0.5s ease' }} key={currentUF}>
          <div style={{ fontSize: 16, fontWeight: 400, color: darkMode ? '#ffffff' : '#000000', marginBottom: 4 }}>
            {currentUF} - {UF_NAMES[currentUF]}
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, color: darkMode ? '#ffffff' : '#000000', opacity: 0.8, marginBottom: 32 }}>
            Faturamento: R$ {Math.round(currentVal).toLocaleString('pt-BR')}
          </div>

          <div style={{ fontSize: 16, fontWeight: 400, color: darkMode ? '#ffffff' : '#000000', marginBottom: 16 }}>
            Representação região
          </div>
          <div style={{ fontSize: 18, fontWeight: 400, color: darkMode ? '#ffffff' : '#000000' }}>
            {regionPct}%
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* Mapa (Direita/Centro) */}
      <div style={{ width: '100%', marginLeft: '15%' }}>
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
                    fill={isActive ? '#FF6A22' : colorScale(val)}
                    stroke={isActive ? '#fff' : (darkMode ? '#333' : '#ddd')}
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
        <div style={{ width: 80, height: 4, borderRadius: 2, background: `linear-gradient(to right, #fff5f0, #FF6A22)` }} />
        <span style={{ fontSize: 9, color: '#888' }}>MÁX</span>
      </div>
    </div>
  )
}
