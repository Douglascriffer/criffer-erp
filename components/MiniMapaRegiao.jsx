'use client'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

const UF_MAP_REVERSE = {
  'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA',
  'Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR',
  'Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO'
}

// Escalas ajustadas para o tamanho super reduzido (35x25)
const REGIOES_CONFIG = {
  'SUL': { center: [-52, -27], scale: 400, states: ['PR', 'SC', 'RS'] },
  'SUDESTE': { center: [-46, -21], scale: 400, states: ['SP', 'RJ', 'MG', 'ES'] },
  'CENTRO-OESTE': { center: [-54, -16], scale: 250, states: ['MS', 'MT', 'GO', 'DF'] },
  'NORDESTE': { center: [-41, -11], scale: 220, states: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'] },
  'NORTE': { center: [-60, -5], scale: 140, states: ['TO', 'PA', 'AP', 'RR', 'AM', 'AC', 'RO'] }
}

export default function MiniMapaRegiao({ regiao, color = '#FF6A22' }) {
  const config = REGIOES_CONFIG[regiao]
  if (!config) return null

  return (
    <div style={{ width: 35, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: config.center, scale: config.scale }}
        width={100}
        height={80}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies
              .map(geo => {
                const uf = UF_MAP_REVERSE[geo.properties.name] || geo.properties.sigla
                const isInRegion = config.states.includes(uf)
                if (!isInRegion) return null

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="none"
                    style={{ default: { outline: 'none' } }}
                  />
                )
              })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
