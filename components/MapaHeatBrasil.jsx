'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
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

// Centroides aproximados dos estados para label inside
const STATE_CENTROIDS = {
  AC:[-70.1,-9.0], AL:[-36.6,-9.5], AM:[-64.6,-4.0], AP:[-51.0,1.4],
  BA:[-41.7,-12.5], CE:[-39.6,-5.2], DF:[-47.8,-15.8], ES:[-40.6,-19.5],
  GO:[-49.6,-15.9], MA:[-44.7,-5.4], MG:[-44.5,-18.5], MS:[-54.6,-20.5],
  MT:[-55.9,-12.6], PA:[-51.9,-3.8], PB:[-36.8,-7.1], PE:[-37.3,-8.4],
  PI:[-42.9,-7.0], PR:[-51.6,-24.6], RJ:[-43.1,-22.3], RN:[-36.7,-5.8],
  RO:[-62.8,-10.8], RR:[-61.4,1.8], RS:[-53.2,-30.1], SC:[-49.6,-27.3],
  SE:[-37.4,-10.6], SP:[-48.5,-22.3], TO:[-48.3,-10.2],
}

function fmtN(v) {
  if (!v) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

export default function MapaHeatBrasil({ stateData = [], lineColor = '#1A1A1A' }) {
  const [activeUF, setActiveUF] = useState(null)
  const [hoverUF, setHoverUF]   = useState(null)
  const [autoIdx, setAutoIdx]   = useState(0)
  const [pulse, setPulse]       = useState(false)
  const timerRef = useRef(null)

  const stateMap = useMemo(() => {
    const m = {}
    stateData.forEach(({ estado, faturamento }) => {
      m[estado] = (m[estado] || 0) + faturamento
    })
    return m
  }, [stateData])

  const stateList = useMemo(() =>
    Object.entries(stateMap).sort((a,b) => b[1] - a[1]),
    [stateMap]
  )

  const maxVal = stateList.length ? stateList[0][1] : 1

  const colorScale = scaleLinear()
    .domain([0, maxVal * 0.25, maxVal * 0.6, maxVal])
    .range(['#FFF0E8','#FFB899','#FF8C52','#FF6A22'])

  // Auto-cicla estados a cada 3s
  useEffect(() => {
    if (stateList.length === 0) return
    setActiveUF(stateList[0]?.[0] || null)

    timerRef.current = setInterval(() => {
      setAutoIdx(i => {
        const next = (i + 1) % stateList.length
        setActiveUF(stateList[next]?.[0] || null)
        setPulse(true)
        setTimeout(() => setPulse(false), 600)
        return next
      })
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [stateList])

  function handleEnter(uf) {
    clearInterval(timerRef.current)
    setHoverUF(uf)
    setActiveUF(uf)
  }
  function handleLeave() {
    setHoverUF(null)
    timerRef.current = setInterval(() => {
      setAutoIdx(i => {
        const next = (i + 1) % stateList.length
        setActiveUF(stateList[next]?.[0] || null)
        setPulse(true)
        setTimeout(() => setPulse(false), 600)
        return next
      })
    }, 3000)
  }

  const displayUF = hoverUF || activeUF
  const displayVal = displayUF ? stateMap[displayUF] : null

  return (
    <div style={{ position:'relative' }}>
      <style>{`
        @keyframes statePulse{0%{opacity:1}50%{opacity:0.6}100%{opacity:1}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Banner do estado ativo — aparece por cima do mapa */}
      {displayUF && displayVal && (
        <div key={displayUF} style={{
          position:'absolute', top:8, left:'50%', transform:'translateX(-50%)',
          background:'#FF6A22', color:'white', borderRadius:30,
          padding:'6px 18px', fontSize:13, fontWeight:800, zIndex:10,
          boxShadow:'0 4px 20px rgba(255,106,34,0.5)',
          animation:'fadeInUp 0.4s ease',
          whiteSpace:'nowrap',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ fontSize:16 }}>{displayUF}</span>
          <span style={{ opacity:0.7, fontSize:11 }}>|</span>
          <span>{fmtN(displayVal)}</span>
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
              const isActive = uf === displayUF
              const centroid = STATE_CENTROIDS[uf]
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={val > 0 ? colorScale(val) : '#F0F0F0'}
                  stroke={isActive ? '#FF6A22' : lineColor}
                  strokeWidth={isActive ? 2.5 : 0.5}
                  style={{
                    default: { outline:'none', filter: isActive ? 'brightness(1.15) drop-shadow(0 0 6px rgba(255,106,34,0.6))' : 'none', transition:'all 0.4s ease' },
                    hover:   { outline:'none', fill:'#FF6A22', cursor:'pointer', filter:'brightness(1.1)' },
                    pressed: { outline:'none' },
                  }}
                  onMouseEnter={() => handleEnter(uf)}
                  onMouseLeave={handleLeave}
                />
              )
            })
          }
        </Geographies>

        {/* Labels DENTRO dos estados (apenas top 10 por valor) */}
        {stateList.slice(0, 10).map(([uf, val]) => {
          const centroid = STATE_CENTROIDS[uf]
          if (!centroid) return null
          const isActive = uf === displayUF
          return (
            <Marker key={uf} coordinates={centroid}>
              <text
                textAnchor="middle"
                fill={isActive ? '#fff' : '#333'}
                fontSize={isActive ? 11 : 9}
                fontWeight={isActive ? 800 : 600}
                style={{ pointerEvents:'none', transition:'all 0.3s', fontFamily:'Syne,sans-serif' }}
                dy={isActive ? -6 : 0}
              >
                {uf}
              </text>
              {isActive && (
                <text textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700} dy={6} style={{ pointerEvents:'none', fontFamily:'Syne,sans-serif' }}>
                  {fmtN(val)}
                </text>
              )}
            </Marker>
          )
        })}
      </ComposableMap>

      {/* Escala de cor */}
      <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center', marginTop:8 }}>
        <span style={{ fontSize:10, color:'#999' }}>Menor</span>
        <div style={{ width:100, height:8, borderRadius:4, background:'linear-gradient(to right, #FFF0E8, #FF6A22)' }}/>
        <span style={{ fontSize:10, color:'#999' }}>Maior</span>
      </div>
    </div>
  )
}
