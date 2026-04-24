'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'

function fmt(v) {
  if (!v && v !== 0) return '—'
  return `R$ ${Math.round(Math.abs(v)).toLocaleString('pt-BR')}`
}

// ── Dados Reais (Acoplados para simulação de DRE) ──
const DADOS = {
  '1': {
    recReal:1607824, recMeta:1211291,
    despReal:1282826, despOrc:1343002,
    centros:[
      {cc:'Comercial',      orc:72931,  real:51352 },
      {cc:'Marketing',      orc:26209,  real:19038 },
      {cc:'Compras',        orc:22598,  real:17764 },
      {cc:'Lab. Calibração',orc:68931,  real:23708 },
      {cc:'Lab. Manutenção',orc:35659,  real:34593 },
      {cc:'Administrativo', orc:85747,  real:130470},
      {cc:'Diretoria',      orc:362453, real:372616},
      {cc:'Financeiro',     orc:37031,  real:26305 },
      {cc:'P&D',            orc:66798,  real:84967 },
      {cc:'RH',             orc:5627,   real:3351  },
      {cc:'Locação',        orc:21662,  real:19517 },
      {cc:'TI',             orc:67026,  real:55513 },
      {cc:'Logística',      orc:120448, real:86124 },
      {cc:'Manutenção',     orc:35466,  real:18058 },
      {cc:'Produção',       orc:283470, real:315660},
      {cc:'Sup. Técnico',   orc:30946,  real:23790 },
    ],
  },
  '2': {
    recReal:1829348, recMeta:2037149,
    despReal:1534770, despOrc:1735261,
    centros:[
      {cc:'Comercial',      orc:72931,  real:101701},
      {cc:'Marketing',      orc:59209,  real:47366 },
      {cc:'Compras',        orc:22598,  real:24062 },
      {cc:'Lab. Calibração',orc:50431,  real:37366 },
      {cc:'Lab. Manutenção',orc:35659,  real:39875 },
      {cc:'Administrativo', orc:86147,  real:127076},
      {cc:'Diretoria',      orc:362453, real:374822},
      {cc:'Financeiro',     orc:37784,  real:51423 },
      {cc:'P&D',            orc:105798, real:77549 },
      {cc:'RH',             orc:13627,  real:8299  },
      {cc:'Locação',        orc:21662,  real:23447 },
      {cc:'TI',             orc:78190,  real:36721 },
      {cc:'Logística',      orc:120484, real:81519 },
      {cc:'Manutenção',     orc:46707,  real:28881 },
      {cc:'Produção',       orc:459881, real:196299},
      {cc:'Sup. Técnico',   orc:30946,  real:39411 },
    ],
  },
  'all': {
    recReal:3437172, recMeta:3248440,
    despReal:2817596, despOrc:3078263,
    centros:[
      {cc:'Comercial',      orc:145862, real:153053 },
      {cc:'Marketing',      orc:85418,  real:66404  },
      {cc:'Compras',        orc:45196,  real:41826  },
      {cc:'Lab. Calibração',orc:119362, real:61074  },
      {cc:'Lab. Manutenção',orc:71318,  real:74468  },
      {cc:'Administrativo', orc:171894, real:257546 },
      {cc:'Diretoria',      orc:724906, real:747438 },
      {cc:'Financeiro',     orc:74815,  real:77728  },
      {cc:'P&D',            orc:172596, real:162516 },
      {cc:'RH',             orc:19254,  real:11650  },
      {cc:'Locação',        orc:43324,  real:42964  },
      {cc:'TI',             orc:145216, real:92234  },
      {cc:'Logística',      orc:240932, real:167643 },
      {cc:'Manutenção',     orc:82173,  real:46939  },
      {cc:'Produção',       orc:743351, real:511959 },
      {cc:'Sup. Técnico',   orc:61892,  real:63201  },
    ],
  },
}

const MENSAL_LINHA = [
  { mes:'Jan', receita:1607824, despesa:1282826, meta:1211291 },
  { mes:'Fev', receita:1829348, despesa:1534770, meta:2037149 },
  { mes:'Mar', receita:null,    despesa:null,    meta:1350000 },
  { mes:'Abr', receita:null,    despesa:null,    meta:1380000 },
]

const METAS = {
  inicial:    { receita:26674257, despesas:27797748, resultado:-1123491, economia:23 },
  atualizada: { receita:27120192, despesas:26955883, resultado:164309,   economia:16 },
}

function TipLinha({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: darkMode ? '#1a1a1a' : '#ffffff',
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: 13,
      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      color: darkMode ? '#fff' : '#000'
    }}>
      <p style={{ color: '#FF6A22', marginBottom: 8, fontWeight: 900 }}>{label}</p>
      {payload.filter(p => p.value != null).map(p => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }}/>
            <span style={{ color: darkMode ? '#aaa' : '#666', fontWeight: 600 }}>{p.name}</span>
          </div>
          <span style={{ fontWeight: 800 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function OrcamentoView({ mes='all', darkMode=false }) {
  const dados = DADOS[mes] || DADOS['all']
  
  const totalOrc  = useMemo(() => dados.centros.reduce((s,c)=>s+c.orc, 0), [dados])
  const totalReal = useMemo(() => dados.centros.reduce((s,c)=>s+c.real,0), [dados])

  const { recReal, recMeta, despReal, despOrc } = dados
  const recBom   = recReal >= recMeta
  const despBom  = despReal <= despOrc
  const resultado = recReal - despReal
  const resPos    = resultado >= 0

  const border = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const card   = darkMode ? 'rgba(255,255,255,0.02)' : '#fff'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* ── SEÇÃO SUPERIOR: RESUMO DRE ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Card Resultado */}
        <div style={{ 
          background: resPos ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          borderRadius: 24, padding: 32, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: 12, fontWeight: 800, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Resultado Líquido</p>
          <p style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>{fmt(resultado)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 12 }}>
            {resPos ? '🎉 Performance Superavitária' : '⚠️ Atenção: Resultado Deficitário'}
          </div>
        </div>

        {/* Card Receitas */}
        <div style={{ background: card, borderRadius: 24, border: `1.5px solid ${border}`, padding: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: darkMode ? '#888' : '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>RECEITAS (vs Meta)</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: darkMode ? '#fff' : '#000' }}>{fmt(recReal)}</p>
          <p style={{ fontSize: 13, color: darkMode ? '#666' : '#999', marginTop: 4 }}>Meta: {fmt(recMeta)}</p>
          <div style={{ height: 6, background: darkMode ? '#333' : '#f0f0f0', borderRadius: 3, marginTop: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: recBom ? '#16a34a' : '#ef4444', width: `${Math.min(recReal/recMeta*100, 100)}%`, borderRadius: 3 }} />
          </div>
        </div>

        {/* Card Despesas */}
        <div style={{ background: card, borderRadius: 24, border: `1.5px solid ${border}`, padding: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: darkMode ? '#888' : '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>DESPESAS (vs Orçado)</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: darkMode ? '#fff' : '#000' }}>{fmt(despReal)}</p>
          <p style={{ fontSize: 13, color: darkMode ? '#666' : '#999', marginTop: 4 }}>Orçado: {fmt(despOrc)}</p>
          <div style={{ height: 6, background: darkMode ? '#333' : '#f0f0f0', borderRadius: 3, marginTop: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: despBom ? '#16a34a' : '#ef4444', width: `${Math.min(despReal/despOrc*100, 100)}%`, borderRadius: 3 }} />
          </div>
        </div>
      </div>

      {/* ── SEÇÃO MÉDIA: GRÁFICO TENDÊNCIA ── */}
      <div style={{ background: card, borderRadius: 24, border: `1.5px solid ${border}`, padding: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 24 }}>Tendência Orçamentária 2026</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={MENSAL_LINHA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={border} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#888', fontWeight: 800 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `R$ ${(v/1e6).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#888', fontWeight: 800 }} axisLine={false} tickLine={false} />
            <Tooltip content={<TipLinha darkMode={darkMode} />} />
            <Legend iconType="circle" />
            <Line type="monotone" dataKey="receita" name="Receita" stroke="#FF6A22" strokeWidth={3} dot={{ r: 6, fill: '#FF6A22' }} />
            <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#ef4444' }} />
            <Line type="monotone" dataKey="meta" name="Meta" stroke="#999" strokeWidth={2} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── SEÇÃO INFERIOR: CENTROS DE CUSTO ── */}
      <div style={{ background: card, borderRadius: 24, border: `1.5px solid ${border}`, overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px', borderBottom: `1.5px solid ${border}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 900 }}>Detalhamento por Centro de Custo</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
                {['Centro de Custo', 'Orçado', 'Realizado', 'Variação'].map(h => (
                  <th key={h} style={{ padding: '16px 32px', textAlign: h === 'Centro de Custo' ? 'left' : 'right', fontSize: 11, fontWeight: 900, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dados.centros.map((c, i) => {
                const diff = c.orc > 0 ? ((c.real - c.orc) / c.orc * 100) : 0
                const bom = diff <= 0
                return (
                  <tr key={c.cc} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '16px 32px', fontWeight: 700, fontSize: 14 }}>{c.cc}</td>
                    <td style={{ padding: '16px 32px', textAlign: 'right', color: '#888' }}>{fmt(c.orc)}</td>
                    <td style={{ padding: '16px 32px', textAlign: 'right', fontWeight: 800 }}>{fmt(c.real)}</td>
                    <td style={{ padding: '16px 32px', textAlign: 'right' }}>
                      <span style={{ 
                        fontSize: 12, fontWeight: 900, 
                        color: bom ? '#16a34a' : '#ef4444',
                        background: bom ? '#16a34a15' : '#ef444415',
                        padding: '4px 10px', borderRadius: 20
                      }}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
