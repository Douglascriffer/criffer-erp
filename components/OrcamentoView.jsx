'use client'
import { useState } from 'react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  return Math.round(v).toLocaleString('pt-BR')
}
function fmtM(v) {
  if (!v && v !== 0) return '—'
  if (Math.abs(v) >= 1e6) return (v/1e6).toFixed(2).replace('.',',') + 'M'
  if (Math.abs(v) >= 1e3) return (v/1e3).toFixed(0) + 'K'
  return Math.round(v).toString()
}

const CENTROS = [
  { cc: 'Comercial',     orc: 223292,   real: 279291  },
  { cc: 'Marketing',     orc: 178126,   real: 142733  },
  { cc: 'Compras',       orc: 67793,    real: 60621   },
  { cc: 'Lab. Calibração', orc: 210263, real: 108969  },
  { cc: 'Lab. Manutenção', orc: 106976, real: 107454  },
  { cc: 'Administrativo', orc: 258042,  real: 400491  },
  { cc: 'Diretoria',     orc: 2987360,  real: 2999682 },
  { cc: 'Financeiro',    orc: 126294,   real: -483453 },
  { cc: 'P&D',           orc: 239395,   real: 220838  },
  { cc: 'RH',            orc: 24882,    real: 15701   },
  { cc: 'Locação',       orc: 64985,    real: 67281   },
  { cc: 'TI',            orc: 217974,   real: 148356  },
  { cc: 'Logística',     orc: 356415,   real: 221075  },
  { cc: 'Manutenção',    orc: 119124,   real: 85202   },
  { cc: 'Produção',      orc: 1210459,  real: 809265  },
  { cc: 'Sup. Técnico',  orc: 94839,    real: 98709   },
]
const TOTAL_ORC = 6486217
const TOTAL_REAL = 5282216

// Metas do PPTX/Excel
const METAS = {
  inicial: {
    receita: 26674257,
    despesas: -27797748,
    resultado: -1123491,
    lucro: 3000000,
    ganho: 4123491,
    economia: 23,
  },
  atualizada: {
    receita: 27120192,
    despesas: -26955883,
    resultado: 164309,
    lucro: 3000000,
    ganho: 2835691,
    economia: 16,
  }
}

// Meta vs Realizado resumo
const META_REAL = {
  receitaMeta: 2143000,
  receitaReal: 1829348,
  despesaOrc: 1343001 + 2904506,   // Jan + Fev acumulado orçado simplificado
  despesaReal: 1282825 + 2595818,
}

export default function OrcamentoView({ metaData = [] }) {
  const [subView, setSubView] = useState(0) // 0=receitas/desp, 1=resultado, 2=metas

  const recReal = 1829348
  const recMeta = 2143000
  const recPct = ((recReal - recMeta) / recMeta * 100)  // negativo = queda

  const despReal = 279291
  const despOrc = 223292
  const despPct = ((despReal - despOrc) / despOrc * 100)  // positivo = aumento de gastos

  const resultLiq = recReal - despReal  // simplificado

  const SUB_TABS = ['Receitas e Despesas', 'Resultado Líquido', 'Metas 2026']

  return (
    <div style={{ padding: '0' }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#F5F5F5', borderRadius: 12, padding: 4, marginBottom: 20 }}>
        {SUB_TABS.map((t, i) => (
          <button key={i} onClick={() => setSubView(i)} style={{
            flex: 1, padding: '8px 4px', border: 'none', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            background: subView === i ? 'white' : 'transparent',
            color: subView === i ? '#FF6A22' : '#999',
            boxShadow: subView === i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.2s',
          }}>{t}</button>
        ))}
      </div>

      {/* SUB-VIEW 0: Receitas e Despesas */}
      {subView === 0 && (
        <div>
          {/* Resumo topo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '0.5px solid #F0EDE8' }}>
              <div style={{ fontSize: 10, color: '#AAA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Receita Realizada</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Syne,sans-serif' }}>{fmt(recReal)}</div>
              <div style={{ fontSize: 11, color: '#AAA', margin: '4px 0' }}>Meta: {fmt(recMeta)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>
                  ▼ {Math.abs(recPct).toFixed(0)}%
                </span>
                <span style={{ fontSize: 10, color: '#CCC' }}>abaixo da meta</span>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 14, padding: 16, border: '0.5px solid #F0EDE8' }}>
              <div style={{ fontSize: 10, color: '#AAA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Despesa Realizada</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#EF4444', fontFamily: 'Syne,sans-serif' }}>{fmt(despReal)}</div>
              <div style={{ fontSize: 11, color: '#AAA', margin: '4px 0' }}>Orçado: {fmt(despOrc)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>
                  ▲ {Math.abs(despPct).toFixed(0)}%
                </span>
                <span style={{ fontSize: 10, color: '#CCC' }}>acima do orçado</span>
              </div>
            </div>
          </div>

          {/* Tabela centros de custo */}
          <div style={{ background: 'white', borderRadius: 14, border: '0.5px solid #F0EDE8', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: '#FF6A22' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>Despesas por Centro de Custo — Acumulado 2026</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FFF8F5' }}>
                    {['Centro de Custo', 'Orçado', 'Realizado', 'Redução'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Centro de Custo' ? 'left' : 'right', fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 0.3, borderBottom: '0.5px solid #F0EDE8' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CENTROS.map((c, i) => {
                    const reducao = c.orc > 0 ? ((c.real - c.orc) / c.orc * 100) : 0
                    const reducaoPositiva = reducao < 0 // gastou menos = bom
                    return (
                      <tr key={c.cc} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA', borderBottom: '0.5px solid #F5F5F5' }}>
                        <td style={{ padding: '8px 12px', color: '#333', fontWeight: 500 }}>{c.cc}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#666' }}>{fmt(c.orc)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#333', fontWeight: 600 }}>{fmt(c.real)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: reducaoPositiva ? '#16a34a' : '#EF4444' }}>
                            {reducao > 0 ? '+' : ''}{reducao.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: '#1A1A1A', borderTop: '2px solid #FF6A22' }}>
                    <td style={{ padding: '10px 12px', color: 'white', fontWeight: 700 }}>Total Geral</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#CCC' }}>{fmt(TOTAL_ORC)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: 'white', fontWeight: 700 }}>{fmt(TOTAL_REAL)}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <span style={{ color: '#FF6A22', fontWeight: 700 }}>
                        {(((TOTAL_REAL - TOTAL_ORC)/TOTAL_ORC)*100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 1: Resultado Líquido */}
      {subView === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '0.5px solid #F0EDE8', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#AAA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Resultado Líquido — Fev/2026</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: resultLiq > 0 ? '#FF6A22' : '#EF4444', fontFamily: 'Syne,sans-serif' }}>
              {resultLiq > 0 ? '' : '-'}R$ {fmtM(Math.abs(resultLiq))}
            </div>
            <div style={{ fontSize: 13, color: '#CCC', marginTop: 8 }}>
              Receita Realizada − Despesa Realizada
            </div>
            <div style={{ fontSize: 12, color: '#AAA', marginTop: 4 }}>
              {fmt(recReal)} − {fmt(despReal)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'white', borderRadius: 14, padding: 20, border: '0.5px solid #F0EDE8', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#AAA', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Receita Realizada</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a', fontFamily: 'Syne,sans-serif' }}>{fmt(recReal)}</div>
              <div style={{ height: 6, background: '#F0FDF4', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#16a34a', borderRadius: 3, width: `${(recReal/recMeta)*100}%` }} />
              </div>
              <div style={{ fontSize: 10, color: '#CCC', marginTop: 4 }}>Meta: {fmt(recMeta)}</div>
            </div>
            <div style={{ background: 'white', borderRadius: 14, padding: 20, border: '0.5px solid #F0EDE8', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: '#AAA', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Despesa Realizada</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#EF4444', fontFamily: 'Syne,sans-serif' }}>{fmt(despReal)}</div>
              <div style={{ height: 6, background: '#FEF2F2', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#EF4444', borderRadius: 3, width: `${Math.min((despReal/despOrc)*100, 130)}%` }} />
              </div>
              <div style={{ fontSize: 10, color: '#CCC', marginTop: 4 }}>Orçado: {fmt(despOrc)}</div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Metas 2026 */}
      {subView === 2 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', marginBottom: 20 }}>METAS ANUAIS 2026</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'META 2026 — INICIAL', data: METAS.inicial },
              { label: 'META 2026 — ATUALIZADA', data: METAS.atualizada },
            ].map(({ label, data }) => (
              <div key={label} style={{ background: 'white', borderRadius: 14, border: '0.5px solid #F0EDE8', overflow: 'hidden' }}>
                <div style={{ background: '#FF6A22', padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: 0.5 }}>{label}</div>
                </div>
                <div style={{ padding: 16 }}>
                  {[
                    { label: 'Receita Bruta', val: data.receita, color: '#333' },
                    { label: 'Despesas', val: data.despesas, color: '#EF4444' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F5F5F5' }}>
                      <span style={{ fontSize: 13, color: '#555' }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>R$ {fmt(Math.abs(row.val))}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F5F5F5' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Resultado</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: data.resultado < 0 ? '#EF4444' : '#FF6A22' }}>
                      {data.resultado < 0 ? '- ' : ''}R$ {fmt(Math.abs(data.resultado))}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F5F5F5' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>Lucro Esperado</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>R$ {fmt(data.lucro)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0EDE8' }}>
                    <span style={{ fontSize: 13, color: '#555' }}>Ganho Necessário</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#FF6A22' }}>R$ {fmt(data.ganho)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 0' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5 }}>Economia de Gastos</span>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#FF6A22', fontFamily: 'Syne,sans-serif' }}>{data.economia}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
