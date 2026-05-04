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

        // ── Sheet: RECEITAS / Receita por estados ──────────────────────────
        const stateSheetName = workbook.SheetNames.find(n => n === 'RECEITAS' || n === 'Receita por estados')
        if (stateSheetName) {
          const ws   = workbook.Sheets[stateSheetName]
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 })
          
          // Função para encontrar índices de matrizes (baseado no cabeçalho 'AC')
          const headerIndices = []
          rows.forEach((row, idx) => {
            if (row.slice(1, 10).includes('AC')) headerIndices.push(idx)
          })

          if (headerIndices.length >= 1) {
            const parseMatrix = (startIdx) => {
              const headers = rows[startIdx].slice(1, 29)
              const matrix = {}
              for (let i = startIdx + 1; i < rows.length; i++) {
                const row = rows[i]
                const dateRaw = row[0]
                if (!dateRaw || (typeof dateRaw === 'string' && dateRaw.toLowerCase().includes('total'))) break
                const dt = dateRaw instanceof Date ? dateRaw : new Date(dateRaw)
                if (isNaN(dt.getTime())) continue
                const key = `${dt.getFullYear()}_${dt.getMonth() + 1}`
                matrix[key] = {}
                headers.forEach((st, j) => { if (st) matrix[key][st] = Number(row[j + 1] || 0) })
              }
              return matrix
            }

            const revenueMatrix = parseMatrix(headerIndices[0])
            const returnsMatrix = headerIndices.length > 1 ? parseMatrix(headerIndices[1]) : {}

            // Unificar e Subtrair Devoluções
            Object.entries(revenueMatrix).forEach(([key, states]) => {
              const [ano, mes] = key.split('_').map(Number)
              const returns = returnsMatrix[key] || {}
              Object.entries(states).forEach(([estado, faturamento]) => {
                const liquido = faturamento - (returns[estado] || 0)
                if (liquido > 0 || liquido < 0) {
                  result.byState.push({ ano, mes, estado, faturamento: liquido })
                }
              })
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

        // ── Sheet: COMERCIAL (Seller performance detail - Fixed Matrix Layout) ───
        if (workbook.SheetNames.includes('COMERCIAL')) {
          const ws   = workbook.Sheets['COMERCIAL']
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 })
          
          if (rows.length > 1) {
            const sellers = []
            const totals  = []
            
            // Mapeamento fixo de colunas conforme solicitado
            const COLUMN_MAP = {
              1:  'Assistência Técnica',
              2:  'Gabriel Dias',
              3:  'Gabriel Ferreira dos Santos',
              4:  'Gabriel Klein',
              5:  'Gabriel Medeiros',
              6:  'Josiane Govoni Lanzarini',
              7:  'Juliano Chagas',
              8:  'Leonardo Schons de Oliveira',
              9:  'Mercado Livre',
              10: 'Sem Vendedor', // Coluna K (-Nenhum vendedor-)
              11: 'Nilson Borges',
              12: 'Rogislei Vieira Padilha',
              13: 'Site',
              14: 'Vanessa Ferreira',
              15: 'Sem Vendedor', // Coluna P (Vazia)
            }

            for (let i = 1; i < rows.length; i++) {
              const row = rows[i]
              const dateRaw = row[0]
              if (!dateRaw) continue
              
              const dt = dateRaw instanceof Date ? dateRaw : new Date(dateRaw)
              if (isNaN(dt.getTime())) continue
              
              const ano = dt.getFullYear()
              const mes = dt.getMonth() + 1
              
              // Coluna R (índice 17) para conferência oficial
              const realVal = Number(row[17] || 0)
              if (realVal > 0) {
                totals.push({ ano, mes, total: realVal })
              }

              // Consolidação dos vendedores por mês
              const monthSellers = {}

              Object.entries(COLUMN_MAP).forEach(([colIdx, name]) => {
                const idx = Number(colIdx)
                const valor = Number(row[idx] || 0)
                if (valor !== 0) {
                  monthSellers[name] = (monthSellers[name] || 0) + valor
                }
              })

              // Adiciona ao resultado final
              Object.entries(monthSellers).forEach(([vendedor, valor]) => {
                sellers.push({ ano, mes, vendedor, valor })
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
