'use client'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

const REGIOES_CONFIG = {
  'SUL': { center: [-52, -27], scale: 900, states: ['PR', 'SC', 'RS'] },
  'SUDESTE': { center: [-46, -20], scale: 900, states: ['SP', 'RJ', 'MG', 'ES'] },
  'CENTRO-OESTE': { center: [-53, -16], scale: 700, states: ['MS', 'MT', 'GO', 'DF'] },
  'NORDESTE': { center: [-40, -10], scale: 700, states: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'] },
  'NORTE': { center: [-60, -5], scale: 500, states: ['TO', 'PA', 'AP', 'RR', 'AM', 'AC', 'RO'] },
  'EXTERIOR': { center: [0, 0], scale: 100, states: ['EX'] }
}

const UF_MAP = {
  'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA',
  'Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR',
  'Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO'
}

export default function MiniMapaRegiao({ regiao, color = '#FF6A22' }) {
  const config = REGIOES_CONFIG[regiao]
  if (!config || regiao === 'EXTERIOR') return null

  return (
    <div style={{ width: 60, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              .filter(geo => config.states.includes(UF_MAP[geo.properties.name]))
              .map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={color}
                  stroke="none"
                  style={{ default: { outline: 'none' } }}
                />
              ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
