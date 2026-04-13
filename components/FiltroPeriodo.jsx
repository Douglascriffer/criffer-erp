'use client'
import { Calendar } from 'lucide-react'

const MONTHS = [
  { v: 'all', l: 'Todos os meses' },
  { v: '1',  l: 'Janeiro' }, { v: '2',  l: 'Fevereiro' },
  { v: '3',  l: 'Março' },   { v: '4',  l: 'Abril' },
  { v: '5',  l: 'Maio' },    { v: '6',  l: 'Junho' },
  { v: '7',  l: 'Julho' },   { v: '8',  l: 'Agosto' },
  { v: '9',  l: 'Setembro' },{ v: '10', l: 'Outubro' },
  { v: '11', l: 'Novembro' },{ v: '12', l: 'Dezembro' },
]

export default function FiltroPeriodo({ filters, onChange }) {
  const { ano, mes } = filters

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-gray-400">
        <Calendar size={14} />
        <span className="text-xs font-medium uppercase tracking-wide">Período</span>
      </div>

      {/* Year tabs */}
      <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
        {['2025', '2026'].map(y => (
          <button key={y} onClick={() => onChange({ ano: y, mes })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              ano === y
                ? 'bg-white text-brand shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {y}
          </button>
        ))}
      </div>

      {/* Month selector */}
      <select
        value={mes}
        onChange={e => onChange({ ano, mes: e.target.value })}
        className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white
                   focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand
                   text-gray-700 cursor-pointer">
        {MONTHS.map(m => (
          <option key={m.v} value={m.v}>{m.l}</option>
        ))}
      </select>

      {/* Quick shortcuts */}
      <div className="flex gap-1 ml-1">
        {[
          { l: 'Jan–Fev', action: () => onChange({ ano, mes: 'all' }) },
        ].map(s => null)}
        <button
          onClick={() => onChange({ ano: new Date().getFullYear().toString(), mes: String(new Date().getMonth() + 1) })}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-brand/30 text-brand hover:bg-brand-50 transition-all">
          Mês atual
        </button>
      </div>
    </div>
  )
}
