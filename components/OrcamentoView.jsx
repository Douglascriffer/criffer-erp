'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts'
import { Activity, TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react'

function fmt(v) {
  if (!v && v !== 0) return '—'
  return `R$ ${Math.round(Math.abs(v)).toLocaleString('pt-BR')}`
}

// ── Dados Reais (Acoplados para simulação de DRE - Sincronizados com Auditoria Net) ──
const DADOS = {
  '1': {
    recReal:1594922, recMeta:1211291,
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
    recReal:1763470, recMeta:2037149,
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
    recReal:5889120, recMeta:3248440,
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
  { mes:'Jan', receita:1594922, despesa:1282826, meta:1211291 },
  { mes:'Fev', receita:1763470, despesa:1534770, meta:2037149 },
  { mes:'Mar', receita:2530728, despesa:null,    meta:1350000 },
  { mes:'Abr', receita:null,    despesa:null,    meta:1380000 },
]

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
  const { recReal, recMeta, despReal, despOrc } = dados
  const resultado = recReal - despReal
  const resPos    = resultado >= 0

  const t = {
    text: darkMode ? '#ffffff' : '#000000',
    textSub: darkMode ? '#cccccc' : '#666666',
    textMuted: darkMode ? '#666666' : '#999999',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    card: darkMode ? 'rgba(255,255,255,0.02)' : '#ffffff',
    accent: '#FF6A22',
    bg: darkMode ? '#0c0c14' : '#f8f9fa'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontFamily: "'Gotham', sans-serif" }}>
      
      {/* ── HEADER DE KPIS PREMIUM ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Card Resultado Líquido */}
        <div style={{ 
          background: resPos 
            ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' 
            : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          borderRadius: 24, 
          padding: 32, 
          color: '#fff', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 160,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.15 }}>
            <Activity size={100} />
          </div>
          <p style={{ fontSize: 11, fontWeight: 900, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Resultado Líquido</p>
          <p style={{ fontSize: 42, fontWeight: 900, marginBottom: 8 }}>{fmt(resultado)}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: 12, width: 'fit-content' }}>
            {resPos ? '🎉 Performance Superavitária' : '⚠️ Atenção: Resultado Deficitário'}
          </div>
        </div>

        {/* Card Receitas vs Meta */}
        <div style={{ 
          background: t.card, 
          borderRadius: 24, 
          border: `1.5px solid ${t.border}`, 
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Receitas Líquidas</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: t.text }}>{fmt(recReal)}</p>
            </div>
            <div style={{ background: 'rgba(255,106,34,0.1)', padding: 12, borderRadius: 16 }}>
              <TrendingUp size={24} color={t.accent} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 8, background: darkMode ? '#333' : '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: t.accent, width: `${Math.min(recReal/recMeta*100, 100)}%` }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: t.text }}>{Math.round(recReal/recMeta*100)}%</span>
          </div>
          <p style={{ fontSize: 12, color: t.textMuted, marginTop: 8, fontWeight: 600 }}>Meta: {fmt(recMeta)}</p>
        </div>

        {/* Card Despesas vs Orçado */}
        <div style={{ 
          background: t.card, 
          borderRadius: 24, 
          border: `1.5px solid ${t.border}`, 
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 900, color: t.textSub, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Despesas Totais</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: t.text }}>{fmt(despReal)}</p>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.1)', padding: 12, borderRadius: 16 }}>
              <DollarSign size={24} color="#ef4444" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 8, background: darkMode ? '#333' : '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: despReal <= despOrc ? '#22c55e' : '#ef4444', width: `${Math.min(despReal/despOrc*100, 100)}%` }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: t.text }}>{Math.round(despReal/despOrc*100)}%</span>
          </div>
          <p style={{ fontSize: 12, color: t.textMuted, marginTop: 8, fontWeight: 600 }}>Orçado: {fmt(despOrc)}</p>
        </div>

      </div>

      {/* ── GRID INFERIOR: TENDÊNCIA E CENTROS DE CUSTO ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* Coluna 1: Tendência */}
        <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, padding: 32, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 32, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Tendência Orçamentária 2026</h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={MENSAL_LINHA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: t.textMuted, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<TipLinha darkMode={darkMode} />} cursor={{ stroke: t.accent, strokeWidth: 1 }} />
                <Line type="monotone" dataKey="receita" name="Receita" stroke={t.accent} strokeWidth={5} dot={{ r: 6, fill: t.accent, strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textSub, fontWeight: 700 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.accent }} /> Receita
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textSub, fontWeight: 700 }}>
              <div style={{ width: 12, height: 3, background: '#ef4444', borderRadius: 2 }} /> Despesa
            </div>
          </div>
        </div>

        {/* Coluna 2: Detalhamento CC */}
        <div style={{ background: t.card, borderRadius: 24, border: `1.5px solid ${t.border}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 32px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: t.text, textTransform: 'uppercase', letterSpacing: 1 }}>Detalhamento por Centro de Custo</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: t.accent, background: 'rgba(255,106,34,0.1)', padding: '6px 12px', borderRadius: 12 }}>
              <BarChart3 size={16} /> {dados.centros.length} CCs
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: 400 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: darkMode ? '#1a1a25' : '#f8f9fa', zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Centro de Custo</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Orçado</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Realizado</th>
                  <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: 10, fontWeight: 900, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Var.</th>
                </tr>
              </thead>
              <tbody>
                {dados.centros.map((c, i) => {
                  const diff = c.orc > 0 ? ((c.real - c.orc) / c.orc * 100) : 0
                  const ok = diff <= 0
                  return (
                    <tr key={c.cc} style={{ borderBottom: `1px solid ${t.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)' }}>
                      <td style={{ padding: '16px 32px', fontSize: 14, fontWeight: 700, color: t.text }}>{c.cc}</td>
                      <td style={{ padding: '16px 32px', textAlign: 'right', fontSize: 13, color: t.textMuted }}>{fmt(c.orc)}</td>
                      <td style={{ padding: '16px 32px', textAlign: 'right', fontSize: 14, fontWeight: 900, color: t.text }}>{fmt(c.real)}</td>
                      <td style={{ padding: '16px 32px', textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: 11, fontWeight: 900, 
                          color: ok ? '#22c55e' : '#ef4444',
                          background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          padding: '6px 12px', borderRadius: 20
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
    </div>
  )
}
