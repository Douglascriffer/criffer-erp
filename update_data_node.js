const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');

const EXCEL_PATH = "C:\\Douglas\\Projeto Antigravity\\RESULTADOS.xlsx";
const JSON_OUTPUT = path.join(__dirname, 'public', 'data', 'dados.json');

function parseExcelNode() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`Erro: Arquivo Excel não encontrado em ${EXCEL_PATH}`);
    process.exit(1);
  }

  console.log(`Lendo ${EXCEL_PATH}...`);
  const data = fs.readFileSync(EXCEL_PATH);
  const workbook = XLSX.read(data, { type: 'buffer', cellDates: true });

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

  // ── Sheet: COMERCIAL ───────────────────
  if (workbook.SheetNames.includes('COMERCIAL')) {
    const ws   = workbook.Sheets['COMERCIAL']
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 })
    
    if (rows.length > 1) {
      const sellers = []
      const totals  = []
      
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
        10: 'Sem Vendedor', // Coluna K
        11: 'Nilson Borges',
        12: 'Rogislei Vieira Padilha',
        13: 'Site',
        14: 'Vanessa Ferreira',
        15: 'Sem Vendedor', // Coluna P
      }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const dateRaw = row[0]
        if (!dateRaw) continue
        
        const dt = dateRaw instanceof Date ? dateRaw : new Date(dateRaw)
        if (isNaN(dt.getTime())) continue
        
        const ano = dt.getFullYear()
        const mes = dt.getMonth() + 1
        
        const realVal = Number(row[17] || 0)
        if (realVal > 0) {
          totals.push({ ano, mes, total: realVal })
        }

        const monthSellers = {}

        Object.entries(COLUMN_MAP).forEach(([colIdx, name]) => {
          const idx = Number(colIdx)
          const valor = Number(row[idx] || 0)
          if (valor !== 0) {
            monthSellers[name] = (monthSellers[name] || 0) + valor
          }
        })

        Object.entries(monthSellers).forEach(([vendedor, valor]) => {
          sellers.push({ ano, mes, vendedor, valor })
        })
      }
      result.bySeller = sellers
      result.bySellerTotals = totals
    }
  }

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Dados atualizados com sucesso em ${JSON_OUTPUT}`);
}

parseExcelNode();
