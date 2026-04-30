import * as XLSX from 'xlsx'

/**
 * Parse uploaded Excel file → structured financial data
 * Suporta o formato da Criffer (BASE DE DADOS - RECEITAS)
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })

        const result = {
          byPeriod: [],
          byState:  [],
          meta:     { '2025': [], '2026': [] },
          raw:      [],
        }

        // ── Sheet: Receita por periodo ──────────────────────────
        if (workbook.SheetNames.includes('Receita por periodo')) {
          const ws    = workbook.Sheets['Receita por periodo']
          const rows  = XLSX.utils.sheet_to_json(ws, { defval: 0 })
          rows.forEach(row => {
            const total = Number(row['Total'] || 0)
            if (total === 0) return
            const dt = row['Inicial'] instanceof Date ? row['Inicial'] : new Date(row['Inicial'])
            result.byPeriod.push({
              mes:        dt.getMonth() + 1,
              ano:        dt.getFullYear(),
              label:      dt.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
              vendas:     Number(row['Vendas'] || 0),
              servicos:   Number(row['Serviços'] || 0),
              locacao:    Number(row['Locação'] || 0),
              devolucoes: Number(row['Devoluções'] || 0),
              total,
            })
          })
        }

        // ── Sheet: Receita por estados ──────────────────────────
        if (workbook.SheetNames.includes('Receita por estados')) {
          const ws   = workbook.Sheets['Receita por estados']
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 })
          const stateHeaders = rows[0].slice(1, 29) // state codes
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i]
            const dateRaw = row[0]
            if (!dateRaw) continue
            const dt = dateRaw instanceof Date ? dateRaw : new Date(dateRaw)
            if (isNaN(dt.getTime())) continue
            const ano = dt.getFullYear()
            const mes = dt.getMonth() + 1
            stateHeaders.forEach((estado, j) => {
              const val = Number(row[j + 1] || 0)
              if (val > 0) {
                result.byState.push({ ano, mes, estado, faturamento: val })
              }
            })
          }
        }

        // ── Sheet: META ─────────────────────────────────────────
        if (workbook.SheetNames.includes('META')) {
          const ws   = workbook.Sheets['META']
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 })
          ;['2025', '2026'].forEach((year, yearIdx) => {
            const baseRow = yearIdx * 4
            const headerRow = rows[baseRow] || []
            const metaRow   = rows[baseRow + 0]?.slice(1) || []
            const realRow   = rows[baseRow + 1]?.slice(1) || []
            headerRow.slice(1).forEach((col, i) => {
              if (!col) return
              const dt  = col instanceof Date ? col : new Date(col)
              if (isNaN(dt.getTime())) return
              const metaVal = Number(metaRow[i] || 0)
              const realVal = Number(realRow[i] || 0)
              if (metaVal > 0) {
                result.meta[year].push({
                  mes:       dt.getMonth() + 1,
                  label:     dt.toLocaleDateString('pt-BR', { month: 'short' }),
                  meta:      metaVal,
                  realizado: realVal,
                })
              }
            })
          })
        }

        // ── Sheet: COMERCIAL (Seller performance detail - Matrix Layout) ────────
        if (workbook.SheetNames.includes('COMERCIAL')) {
          const ws   = workbook.Sheets['COMERCIAL']
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 })
          
          if (rows.length > 1) {
            const headers = rows[0]
            const sellers = []
            const totals  = []
            
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i]
              const dateRaw = row[0]
              if (!dateRaw) continue
              
              const dt = dateRaw instanceof Date ? dateRaw : new Date(dateRaw)
              if (isNaN(dt.getTime())) continue
              
              const ano = dt.getFullYear()
              const mes = dt.getMonth() + 1
              
              // Pega o 'Realizado' da coluna R (geralmente índice 17 se A=0)
              // Mas vamos procurar pelo nome da coluna para ser mais seguro
              const realIdx = headers.findIndex(h => String(h).trim() === 'Realizado')
              if (realIdx !== -1) {
                totals.push({ ano, mes, total: Number(row[realIdx] || 0) })
              }

              headers.forEach((header, colIdx) => {
                if (colIdx === 0) return 
                const hName = String(header || '').trim()
                if (hName === 'Total' || hName === 'Realizado' || !hName) return
                
                const valor = Number(row[colIdx] || 0)
                if (valor !== 0) {
                  sellers.push({ ano, mes, vendedor: hName, valor })
                }
              })
            }
            result.bySeller = sellers
            result.bySellerTotals = totals
          }
        }

        // ── Sheet: BASE DE DADOS (raw transactions) ─────────────
        if (workbook.SheetNames.includes('BASE DE DADOS')) {
          const ws   = workbook.Sheets['BASE DE DADOS']
          const rows = XLSX.utils.sheet_to_json(ws, { defval: null })
          result.raw = rows
            .filter(r => r['Transação'] === 'Nota Fiscal de Saída' && r['Status'] === 'Autorizado')
            .map(r => ({
              data:     r['Data Lançamento documento'],
              estado:   r['Estado'],
              cliente:  r['Descrição Cliente'],
              tipo:     r['Tipo NF'],
              valor:    Number(r['Vlr Total'] || 0),
            }))
        }

        resolve(result)
      } catch (err) {
        reject(new Error(`Erro ao processar Excel: ${err.message}`))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsArrayBuffer(file)
  })
}

export function formatCurrency(value) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000)     return `R$ ${(value / 1_000).toFixed(1)}K`
  return `R$ ${value.toFixed(2)}`
}
