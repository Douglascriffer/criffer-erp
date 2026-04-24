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

export default function MapaHeatBrasil({ stateData = [], darkMode = false }) {
  const [activeUF, setActiveUF] = useState(null)
  const [hoverUF, setHoverUF]   = useState(null)
  const [autoIdx, setAutoIdx]   = useState(0)
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
    .domain([0, maxVal * 0.3, maxVal])
    .range(darkMode ? ['#1a1a1a', '#ec6e2a80', '#ec6e2a'] : ['#f8f9fa', '#ffb899', '#ec6e2a'])

  useEffect(() => {
    if (stateList.length === 0) return
    setActiveUF(stateList[0]?.[0] || null)

    timerRef.current = setInterval(() => {
      setAutoIdx(i => {
        const next = (i + 1) % stateList.length
        setActiveUF(stateList[next]?.[0] || null)
        return next
      })
    }, 3000)
    return () => clearInterval(timerRef.current)
  }, [stateList])

  const handleEnter = (uf) => {
    clearInterval(timerRef.current)
    setHoverUF(uf)
    setActiveUF(uf)
  }

  const handleLeave = () => {
    setHoverUF(null)
    timerRef.current = setInterval(() => {
      setAutoIdx(i => {
        const next = (i + 1) % stateList.length
        setActiveUF(stateList[next]?.[0] || null)
        return next
      })
    }, 3000)
  }

  const displayUF = hoverUF || activeUF
  const displayVal = displayUF ? stateMap[displayUF] : null

  return (
    <div style={{ position:'relative', width: '100%' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>

      {displayUF && (
        <div key={displayUF} style={{
          position:'absolute', top: 0, left:'50%', transform:'translateX(-50%)',
          background: '#ec6e2a', color:'white', borderRadius: 50,
          padding:'8px 24px', fontSize: 13, fontWeight: 900, zIndex: 10,
          boxShadow: '0 8px 32px rgba(236,110,42,0.4)',
          animation: 'fadeInUp 0.3s ease forwards',
          whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 16 }}>{displayUF}</span>
          <span style={{ opacity: 0.5, fontWeight: 300 }}>|</span>
          <span>R$ {fmtN(displayVal || 0)}</span>
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center:[-54,-15], scale: 800 }}
        width={500} height={380}
        style={{ width:'100%', height:'auto' }}>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const uf  = STATE_MAP[geo.properties.name] || geo.properties.sigla || ''
              const val = stateMap[uf] || 0
              const isActive = uf === displayUF
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={val > 0 ? colorScale(val) : (darkMode ? '#151515' : '#f0f0f0')}
                  stroke={isActive ? '#ec6e2a' : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}
                  strokeWidth={isActive ? 2 : 0.5}
                  style={{
                    default: { outline:'none', transition:'all 0.4s ease' },
                    hover:   { outline:'none', fill:'#ec6e2a', cursor:'pointer' },
                    pressed: { outline:'none' },
                  }}
                  onMouseEnter={() => handleEnter(uf)}
                  onMouseLeave={handleLeave}
                />
              )
            })
          }
        </Geographies>

        {stateList.slice(0, 8).map(([uf, val]) => {
          const centroid = STATE_CENTROIDS[uf]
          if (!centroid) return null
          const isActive = uf === displayUF
          return (
            <Marker key={uf} coordinates={centroid}>
              <text
                textAnchor="middle"
                fill={isActive ? '#fff' : (darkMode ? '#888' : '#666')}
                fontSize={isActive ? 12 : 9}
                fontWeight={900}
                style={{ pointerEvents:'none', transition:'all 0.3s', fontFamily: "'Gotham', sans-serif" }}
              >
                {uf}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>

      <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center', marginTop: -20 }}>
        <span style={{ fontSize:10, fontWeight: 800, color: darkMode ? '#555' : '#999', textTransform: 'uppercase' }}>Mín</span>
        <div style={{ width:120, height:6, borderRadius:3, background: `linear-gradient(to right, ${darkMode ? '#1a1a1a' : '#f8f9fa'}, #ec6e2a)` }}/>
        <span style={{ fontSize:10, fontWeight: 800, color: darkMode ? '#555' : '#999', textTransform: 'uppercase' }}>Máx</span>
      </div>
    </div>
  )
}

