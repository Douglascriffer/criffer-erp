'use client'
import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

const STATE_NAME_MAP = {
  'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
  'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
  'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
  'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
  'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO',
}

function fmtBRL(v) {
  if (v >= 1_000_000) return `R$ ${(v/1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `R$ ${(v/1_000).toFixed(1)}K`
  return `R$ ${v.toFixed(0)}`
}

export default function MapaHeatBrasil({ stateData = [] }) {
  const [tooltip, setTooltip] = useState(null)
  const [pos, setPos]         = useState({ x: 0, y: 0 })

  const stateMap = useMemo(() => {
    const m = {}
    stateData.forEach(({ estado, faturamento }) => {
      m[estado] = (m[estado] || 0) + faturamento
    })
    return m
  }, [stateData])

  const values   = Object.values(stateMap)
  const minVal   = values.length ? Math.min(...values) : 0
  const maxVal   = values.length ? Math.max(...values) : 1

  const colorScale = scaleLinear()
    .domain([minVal, maxVal])
    .range(['#FFE5D9', '#FF6A22'])

  const topStates = Object.entries(stateMap)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 5)

  return (
    <div className="relative w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 700, center: [-54, -15] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const stateName = geo.properties.name || geo.properties.sigla
              const uf  = STATE_NAME_MAP[stateName] || stateName
              const val = stateMap[uf] || 0

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={val > 0 ? colorScale(val) : '#F0EDE8'}
                  stroke="#FFFFFF"
                  strokeWidth={0.8}
                  style={{
                    default:  { outline: 'none', cursor: 'pointer' },
                    hover:    { fill: '#FF6A22', outline: 'none' },
                    pressed:  { fill: '#CC5519', outline: 'none' },
                  }}
                  onMouseEnter={(evt) => {
                    setTooltip({ name: stateName, uf, val })
                    setPos({ x: evt.clientX, y: evt.clientY })
                  }}
                  onMouseMove={(evt) => setPos({ x: evt.clientX, y: evt.clientY })}
                  onMouseLeave={() => setTooltip(null)}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{ left: pos.x + 12, top: pos.y - 40 }}>
          <p className="font-semibold">{tooltip.name} ({tooltip.uf})</p>
          <p className="text-brand-200 font-bold">{fmtBRL(tooltip.val)}</p>
        </div>
      )}

      {/* Color scale legend */}
      <div className="flex items-center gap-2 mt-2 justify-center">
        <span className="text-[10px] text-gray-400">Menor</span>
        <div className="h-2 w-24 rounded-full"
          style={{ background: 'linear-gradient(to right, #FFE5D9, #FF6A22)' }} />
        <span className="text-[10px] text-gray-400">Maior</span>
      </div>

      {/* Top 5 states */}
      {topStates.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Top estados</p>
          {topStates.map(([estado, val], i) => (
            <div key={estado} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-300 w-4">{i+1}</span>
              <span className="text-xs font-medium text-gray-700 w-8">{estado}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${(val/maxVal)*100}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 text-right w-20">{fmtBRL(val)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
