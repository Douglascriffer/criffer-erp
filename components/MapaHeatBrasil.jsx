'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

const GEO_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson'

const STATE_MAP = {
  'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE',
  'Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA',
  'Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA',
  'Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ',
  'Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR',
  'Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO',
}

function fmtN(v) {
  if (!v) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

export default function MapaHeatBrasil({ stateData=[], lineColor='black' }) {
  const [highlight, setHighlight] = useState(null)
  const [tooltip, setTooltip]     = useState(null)
  const [autoIdx, setAutoIdx]     = useState(0)
  const timerRef = useRef(null)

  const stateMap = useMemo(() => {
    const m = {}
    stateData.forEach(({ estado, faturamento }) => {
      m[estado] = (m[estado]||0) + faturamento
    })
    return m
  }, [stateData])

  const stateList = useMemo(() => Object.entries(stateMap).sort((a,b)=>b[1]-a[1]), [stateMap])
  const values    = Object.values(stateMap)
  const maxVal    = values.length ? Math.max(...values) : 1

  const colorScale = scaleLinear()
    .domain([0, maxVal * 0.3, maxVal])
    .range(['#FFE4D6', '#FF9E6A', '#FF6A22'])

  // Auto-cycle highlight every 3s
  useEffect(() => {
    if (stateList.length === 0) return
    timerRef.current = setInterval(() => {
      setAutoIdx(i => {
        const next = (i + 1) % stateList.length
        setHighlight(stateList[next]?.[0] || null)
        return next
      })
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [stateList])

  // Pause auto on manual hover
  function handleEnter(uf, val, e) {
    clearInterval(timerRef.current)
    setHighlight(uf)
    setTooltip({ uf, val, x:e.clientX, y:e.clientY })
  }
  function handleMove(e) {
    if (tooltip) setTooltip(t => t ? { ...t, x:e.clientX, y:e.clientY } : null)
  }
  function handleLeave() {
    setTooltip(null)
    // Restart auto
    timerRef.current = setInterval(() => {
      setAutoIdx(i => {
        const next = (i + 1) % stateList.length
        setHighlight(stateList[next]?.[0] || null)
        return next
      })
    }, 3000)
  }

  // Label for current highlight
  const hlLabel = highlight && stateMap[highlight]
    ? `${highlight}: ${fmtN(stateMap[highlight])}`
    : null

  return (
    <div style={{ position:'relative' }}>
      {/* Auto-highlight label */}
      {hlLabel && !tooltip && (
        <div style={{ textAlign:'center', marginBottom:4, fontSize:13, fontWeight:700, color:'#FF6A22', fontFamily:'Syne,sans-serif' }}>
          {hlLabel}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center:[-54,-15], scale:850 }}
        width={500} height={340}
        style={{ width:'100%', height:'auto' }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const uf  = STATE_MAP[geo.properties.name] || geo.properties.sigla || ''
              const val = stateMap[uf] || 0
              const isHL = uf === highlight
              return (
                <Geography key={geo.rsmKey} geography={geo}
                  fill={val > 0 ? colorScale(val) : '#F5F5F5'}
                  stroke={lineColor}
                  strokeWidth={isHL ? 2.5 : 0.7}
                  style={{
                    default: { outline:'none', opacity:isHL?1:0.9 },
                    hover:   { outline:'none', fill:'#FF6A22', cursor:'pointer' },
                    pressed: { outline:'none' },
                  }}
                  onMouseEnter={e => handleEnter(uf, val, e)}
                  onMouseMove={handleMove}
                  onMouseLeave={handleLeave}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position:'fixed', left:tooltip.x+12, top:tooltip.y-40,
          background:'#1A1A1A', color:'white', borderRadius:8, padding:'8px 14px',
          fontSize:13, fontWeight:700, pointerEvents:'none', zIndex:999,
          boxShadow:'0 4px 16px rgba(0,0,0,.25)',
        }}>
          {tooltip.uf}: {fmtN(tooltip.val)}
        </div>
      )}
    </div>
  )
}
