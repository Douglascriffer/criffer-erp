'use client'
import { useMemo } from 'react'

const REGIOES_MAP = {
  'AC': 'Norte', 'AM': 'Norte', 'AP': 'Norte', 'PA': 'Norte', 'RO': 'Norte', 'RR': 'Norte', 'TO': 'Norte',
  'AL': 'Nordeste', 'BA': 'Nordeste', 'CE': 'Nordeste', 'MA': 'Nordeste', 'PB': 'Nordeste',
  'PE': 'Nordeste', 'PI': 'Nordeste', 'RN': 'Nordeste', 'SE': 'Nordeste',
  'DF': 'Centro-Oeste', 'GO': 'Centro-Oeste', 'MS': 'Centro-Oeste', 'MT': 'Centro-Oeste',
  'ES': 'Sudeste', 'MG': 'Sudeste', 'RJ': 'Sudeste', 'SP': 'Sudeste',
  'PR': 'Sul', 'RS': 'Sul', 'SC': 'Sul',
  'EX': 'Exterior'
}

const CORES = ['#FF6A22', '#FF8C52', '#FFAB80', '#FFC9AD', '#FFE4D6']

function fmtBRL(v) {
  if (!v) return 'R$ 0'
  if (v >= 1_000_000) return `R$ ${(v/1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `R$ ${(v/1_000).toFixed(1)}K`
  return `R$ ${Math.round(v)}`
}

export default function MapaRegional({ stateData = [], label = '', compareData = null, compareLabel = '' }) {
  const regiaoData = useMemo(() => {
    const map = {}
    stateData.forEach(({ estado, faturamento }) => {
      const regiao = REGIOES_MAP[estado] || 'Outros'
      map[regiao] = (map[regiao] || 0) + faturamento
    })
    return Object.entries(map)
      .map(([regiao, fat]) => ({ regiao, fat: Math.round(fat) }))
      .sort((a, b) => b.fat - a.fat)
  }, [stateData])

  const compareRegiao = useMemo(() => {
    if (!compareData) return {}
    const map = {}
    compareData.forEach(({ estado, faturamento }) => {
      const regiao = REGIOES_MAP[estado] || 'Outros'
      map[regiao] = (map[regiao] || 0) + faturamento
    })
    return map
  }, [compareData])

  const maxFat = regiaoData[0]?.fat || 1
  const total = regiaoData.reduce((s, r) => s + r.fat, 0)

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      )}

      {/* Ranking por região com barras */}
      <div className="space-y-2.5">
        {regiaoData.map((r, i) => {
          const pct = (r.fat / maxFat) * 100
          const pctTotal = total > 0 ? (r.fat / total * 100) : 0
          const prev = compareRegiao[r.regiao]
          const diff = prev > 0 ? ((r.fat - prev) / prev * 100) : null

          return (
            <div key={r.regiao} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 w-4">{i+1}</span>
                  <span className="text-xs font-semibold text-gray-700">{r.regiao}</span>
                  <span className="text-[10px] text-gray-400">{pctTotal.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">{fmtBRL(r.fat)}</span>
                  {diff !== null && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      diff >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                    }`}>
                      {diff >= 0 ? '▲' : '▼'}{Math.abs(diff).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-5 bg-gray-100 rounded-sm overflow-hidden relative">
                <div
                  className="h-full rounded-sm transition-all duration-700 flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(pct, 3)}%`, background: CORES[Math.min(i, CORES.length-1)] }}>
                </div>
                {compareData && prev && (
                  <div
                    className="absolute top-0 h-full opacity-40 rounded-sm"
                    style={{ width: `${Math.max((prev/maxFat)*100, 2)}%`, background: '#FFD4B8' }}
                  />
                )}
              </div>
              {compareData && prev && (
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>{compareLabel}: {fmtBRL(prev)}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
