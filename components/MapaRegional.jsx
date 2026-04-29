'use client'
import { useMemo } from 'react'

const REG = {
  'AC':'Norte','AM':'Norte','AP':'Norte','PA':'Norte','RO':'Norte','RR':'Norte','TO':'Norte',
  'AL':'Nordeste','BA':'Nordeste','CE':'Nordeste','MA':'Nordeste','PB':'Nordeste','PE':'Nordeste','PI':'Nordeste','RN':'Nordeste','SE':'Nordeste',
  'DF':'Centro-Oeste','GO':'Centro-Oeste','MS':'Centro-Oeste','MT':'Centro-Oeste',
  'ES':'Sudeste','MG':'Sudeste','RJ':'Sudeste','SP':'Sudeste',
  'PR':'Sul','RS':'Sul','SC':'Sul',
  'EX':'Exterior',
}
const CORES = ['#FF6A22','#FF8C52','#FFAB80','#FFC9AD','#FFD4B8','#FFE4D6']

function fmtN(v) {
  if (!v) return '0'
  return Math.round(v).toLocaleString('pt-BR')
}

export default function MapaRegional({ stateData=[], compareData=null, darkMode = false }) {
  const regioes = useMemo(() => {
    const m = {}
    stateData.forEach(({ estado, faturamento }) => {
      const r = REG[estado] || 'Outros'
      m[r] = (m[r]||0) + faturamento
    })
    return Object.entries(m).map(([r,fat])=>({ r, fat:Math.round(fat) })).sort((a,b)=>b.fat-a.fat)
  }, [stateData])

  const prev = useMemo(() => {
    if (!compareData) return {}
    const m = {}
    compareData.forEach(({ estado, faturamento }) => {
      const r = REG[estado]||'Outros'
      m[r] = (m[r]||0)+faturamento
    })
    return m
  }, [compareData])

  const maxFat = regioes[0]?.fat || 1

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {regioes.map((row, i) => {
        const pct    = (row.fat / maxFat) * 100
        const barW   = Math.max(pct, 6)
        const inside = barW > 35
        const prevV  = prev[row.r]
        const diff   = prevV>0 ? ((row.fat-prevV)/prevV*100) : null

        return (
          <div key={row.r}>
            {/* Label row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:11, color: darkMode ? '#888' : '#AAA', fontWeight:400, width:16 }}>{i+1}</span>
                <span style={{ fontSize:13, fontWeight:400, color: darkMode ? '#fff' : '#333' }}>{row.r}</span>
              </div>
              {diff!==null && (
                <span style={{ fontSize:12, fontWeight:400, color:diff>=0?'#16a34a':'#EF4444' }}>
                  {diff>=0?'▲':'▼'}{Math.abs(diff).toFixed(1)}%
                </span>
              )}
            </div>
            {/* Bar */}
            <div style={{ position:'relative', height:24, background:'#F5F5F5', borderRadius:5, overflow:'hidden' }}>
              <div style={{
                position:'absolute', top:0, left:0, height:'100%',
                width:`${barW}%`, background:CORES[Math.min(i,CORES.length-1)],
                borderRadius:5, display:'flex', alignItems:'center',
                justifyContent: inside?'flex-end':'flex-start',
                padding:'0 8px', transition:'width .6s ease',
              }}>
                {inside && <span style={{ fontSize:12, fontWeight:400, color:'white', whiteSpace:'nowrap' }}>{fmtN(row.fat)}</span>}
              </div>
              {!inside && (
                <span style={{ position:'absolute', left:`${barW+1}%`, top:'50%', transform:'translateY(-50%)', fontSize:12, fontWeight:400, color: darkMode ? '#fff' : '#444', whiteSpace:'nowrap', paddingLeft:6 }}>{fmtN(row.fat)}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
