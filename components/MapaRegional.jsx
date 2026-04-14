'use client'
import { useMemo } from 'react'

const REGIOES_MAP = {
  'AC':'Norte','AM':'Norte','AP':'Norte','PA':'Norte','RO':'Norte','RR':'Norte','TO':'Norte',
  'AL':'Nordeste','BA':'Nordeste','CE':'Nordeste','MA':'Nordeste','PB':'Nordeste','PE':'Nordeste','PI':'Nordeste','RN':'Nordeste','SE':'Nordeste',
  'DF':'Centro-Oeste','GO':'Centro-Oeste','MS':'Centro-Oeste','MT':'Centro-Oeste',
  'ES':'Sudeste','MG':'Sudeste','RJ':'Sudeste','SP':'Sudeste',
  'PR':'Sul','RS':'Sul','SC':'Sul',
  'EX':'Exterior'
}
const CORES = ['#FF6A22','#FF8C52','#FFAB80','#FFC9AD','#FFE4D6','#FFF0E8']

function fmtN(v) {
  if (!v) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

export default function MapaRegional({ stateData = [], compareData = null, compareLabel = '' }) {
  const regiaoData = useMemo(() => {
    const map = {}
    stateData.forEach(({ estado, faturamento }) => {
      const r = REGIOES_MAP[estado] || 'Outros'
      map[r] = (map[r] || 0) + faturamento
    })
    return Object.entries(map).map(([regiao, fat]) => ({ regiao, fat: Math.round(fat) })).sort((a, b) => b.fat - a.fat)
  }, [stateData])

  const compareRegiao = useMemo(() => {
    if (!compareData) return {}
    const map = {}
    compareData.forEach(({ estado, faturamento }) => {
      const r = REGIOES_MAP[estado] || 'Outros'
      map[r] = (map[r] || 0) + faturamento
    })
    return map
  }, [compareData])

  const maxFat = regiaoData[0]?.fat || 1

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {regiaoData.map((r, i) => {
        const pct = (r.fat / maxFat) * 100
        const prev = compareRegiao[r.regiao]
        const diff = prev > 0 ? ((r.fat - prev) / prev * 100) : null
        const barWidth = Math.max(pct, 8)
        const showInside = barWidth > 30

        return (
          <div key={r.regiao}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, color: '#AAA', fontWeight: 700, width: 18 }}>{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{r.regiao}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {diff !== null && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: diff >= 0 ? '#16a34a' : '#EF4444' }}>
                    {diff >= 0 ? '▲' : '▼'}{Math.abs(diff).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div style={{ position: 'relative', height: 22, background: '#F5F5F5', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${barWidth}%`, background: CORES[Math.min(i, CORES.length-1)], borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: showInside ? 'flex-start' : 'flex-end', padding: '0 8px', transition: 'width 0.6s ease' }}>
                {showInside && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>{fmtN(r.fat)}</span>
                )}
              </div>
              {!showInside && (
                <span style={{ position: 'absolute', left: `${barWidth + 2}%`, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 700, color: '#555', whiteSpace: 'nowrap' }}>{fmtN(r.fat)}</span>
              )}
            </div>
            {compareData && prev > 0 && (
              <div style={{ fontSize: 9, color: '#AAA', marginTop: 1 }}>{compareLabel}: {fmtN(prev)}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
