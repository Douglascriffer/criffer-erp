'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X } from 'lucide-react'
import { parseExcelFile } from '@/lib/excelParser'
import { supabase } from '@/lib/supabaseClient'
import { invalidateCache } from '@/lib/hooks'

export default function UploadExcel({ onDataLoaded, userId }) {
  const [dragging, setDragging]   = useState(false)
  const [status, setStatus]       = useState('idle') // idle | parsing | saving | done | error
  const [progress, setProgress]   = useState('')
  const [error, setError]         = useState('')
  const inputRef = useRef()

  const processFile = useCallback(async (file) => {
    if (!file.name.match(/\.xlsx?$/i)) {
      setStatus('error')
      setError('Formato inválido. Use um arquivo .xlsx')
      return
    }

    try {
      setStatus('parsing')
      setProgress('Lendo arquivo Excel...')
      const parsed = await parseExcelFile(file)

      setProgress(`${parsed.byPeriod.length} períodos e ${parsed.byState.length} registros de estados encontrados`)

      if (userId) {
        setStatus('saving')
        setProgress('Salvando no banco de dados...')

        // Clear old data for this user
        await supabase.from('financial_data').delete().eq('user_id', userId)

        // Insert period data
        if (parsed.byPeriod.length > 0) {
          const periodRows = parsed.byPeriod.map(r => ({
            user_id:    userId,
            tipo:       'periodo',
            ano:        r.ano,
            mes:        r.mes,
            label:      r.label,
            vendas:     r.vendas,
            servicos:   r.servicos,
            locacao:    r.locacao,
            devolucoes: r.devolucoes,
            total:      r.total,
          }))
          const { error: e1 } = await supabase.from('financial_data').insert(periodRows)
          if (e1) throw e1
        }

        // Insert state data
        if (parsed.byState.length > 0) {
          const stateRows = parsed.byState.map(r => ({
            user_id:    userId,
            tipo:       'estado',
            ano:        r.ano,
            mes:        r.mes,
            estado:     r.estado,
            faturamento: r.faturamento,
          }))
          // Batch insert in chunks of 500
          for (let i = 0; i < stateRows.length; i += 500) {
            const chunk = stateRows.slice(i, i + 500)
            const { error: e2 } = await supabase.from('financial_data').insert(chunk)
            if (e2) throw e2
            setProgress(`Salvando estados... ${Math.min(i + 500, stateRows.length)}/${stateRows.length}`)
          }
        }

        invalidateCache()
      }

      setStatus('done')
      setProgress(`Upload concluído! ${parsed.byPeriod.length} meses importados.`)
      onDataLoaded?.(parsed)

    } catch (err) {
      setStatus('error')
      setError(err.message || 'Erro ao processar arquivo')
    }
  }, [userId, onDataLoaded])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const reset = () => { setStatus('idle'); setError(''); setProgress('') }

  return (
    <div>
      {status === 'idle' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragging ? 'border-brand bg-brand-50 scale-[1.01]' : 'border-gray-200 hover:border-brand hover:bg-gray-50'
          }`}>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" onChange={onFileChange} className="hidden" />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dragging ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Upload size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {dragging ? 'Solte o arquivo aqui' : 'Arraste ou clique para fazer upload'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">BASE DE DADOS - RECEITAS 2025-2026.xlsx</p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-xl p-4 border flex items-start gap-3 ${
          status === 'done'  ? 'bg-green-50 border-green-200' :
          status === 'error' ? 'bg-red-50 border-red-200' :
          'bg-brand-50 border-brand-200'
        }`}>
          <div className="mt-0.5">
            {status === 'done'             && <CheckCircle size={18} className="text-green-600" />}
            {status === 'error'            && <AlertCircle size={18} className="text-red-500" />}
            {['parsing','saving'].includes(status) && (
              <div className="w-4 h-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${
              status === 'done' ? 'text-green-700' : status === 'error' ? 'text-red-600' : 'text-brand-700'
            }`}>
              {status === 'done'  ? 'Upload concluído!' :
               status === 'error' ? 'Erro no upload' :
               status === 'parsing' ? 'Processando...' : 'Salvando...'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{error || progress}</p>
          </div>
          <button onClick={reset} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
