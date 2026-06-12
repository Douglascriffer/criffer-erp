const XLSX = require('xlsx');
const fs = require('fs');

const EXCEL_PATH = 'C:\\Douglas\\Projeto Antigravity\\RESULTADOS.xlsx';
const JSON_OUTPUT = 'C:\\Douglas\\Projeto Antigravity\\criffer\\public\\data\\dados.json';

function processExcel() {
  console.log(`Lendo Excel: ${EXCEL_PATH}...`);
  const workbook = XLSX.readFile(EXCEL_PATH, { cellDates: true });

  const result = {
    byPeriod: [],
    byState:  [],
    bySeller: [],
    bySellerTotals: [],
    meta:     { '2025': [], '2026': [] },
    raw:      [],
  };

  // 1. RECEITAS / Receita por estados
  const stateSheetName = workbook.SheetNames.find(n => n === 'RECEITAS');
  if (stateSheetName) {
    const ws = workbook.Sheets[stateSheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });
    
    // Mapear estados (Row 1, Cols 1-28)
    const states = {};
    for (let c = 1; c < 29; c++) {
      const st = rows[1][c];
      if (st) states[c] = String(st).trim();
    }

    const offsets = { vendas: 2, servicos: 31, locacao: 61, devolucoes: 91 };

    for (let r = 2; r < 30; r++) {
      const dateVal = rows[r][0];
      if (!dateVal || String(dateVal).trim() === '') break;

      let dt = new Date(dateVal);
      if (isNaN(dt.getTime())) continue;

      const periodData = {
        mes: dt.getMonth() + 1,
        ano: dt.getFullYear(),
        label: dt.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).toLowerCase(),
        vendas: 0, servicos: 0, locacao: 0, devolucoes: 0, total: 0
      };

      for (const [cat, off] of Object.entries(offsets)) {
        const val = rows[r - 2 + off][30];
        periodData[cat] = Number(val) || 0;
      }
      periodData.total = periodData.vendas + periodData.servicos + periodData.locacao - Math.abs(periodData.devolucoes);
      result.byPeriod.push(periodData);

      for (const [colIdx, stName] of Object.entries(states)) {
        let stFaturamento = 0;
        for (const cat of ['vendas', 'servicos', 'locacao']) {
          const off = offsets[cat];
          const val = rows[r - 2 + off][colIdx];
          stFaturamento += Number(val) || 0;
        }
        if (stFaturamento !== 0) {
          result.byState.push({
            ano: dt.getFullYear(),
            mes: dt.getMonth() + 1,
            estado: stName,
            faturamento: stFaturamento
          });
        }
      }
    }
  }

  // 2. COMERCIAL
  if (workbook.SheetNames.includes('COMERCIAL')) {
    const ws = workbook.Sheets['COMERCIAL'];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });
    
    const COLUMN_MAP = {
      1:  'Assistência Técnica', 2:  'Gabriel Dias', 3:  'Gabriel Ferreira dos Santos', 4:  'Gabriel Klein', 5:  'Gabriel Medeiros', 6:  'Josiane Govoni Lanzarini', 7:  'Juliano Chagas', 8:  'Leonardo Schons de Oliveira', 9:  'Mercado Livre', 10: 'Sem Vendedor', 11: 'Nilson Borges', 12: 'Rogislei Vieira Padilha', 13: 'Site', 14: 'Vanessa Ferreira', 15: 'Sem Vendedor'
    };

    for (let r = 1; r < rows.length; r++) {
      const dateVal = rows[r][0];
      if (!dateVal) continue;
      
      const dt = new Date(dateVal);
      if (isNaN(dt.getTime())) continue;

      const ano = dt.getFullYear();
      const mes = dt.getMonth() + 1;

      const realVal = Number(rows[r][17] || 0);
      if (realVal > 0) result.bySellerTotals.push({ ano, mes, total: realVal });

      const monthSellers = {};
      for (const [colIdx, name] of Object.entries(COLUMN_MAP)) {
        const val = Number(rows[r][colIdx] || 0);
        if (val !== 0) monthSellers[name] = (monthSellers[name] || 0) + val;
      }

      for (const [vendedor, valor] of Object.entries(monthSellers)) {
        result.bySeller.push({ ano, mes, vendedor, valor });
      }
    }
  }

  // 3. METAS
  if (workbook.SheetNames.includes('METAS')) {
    const ws = workbook.Sheets['METAS'];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });
    
    const extractMetaYear = (startRow, year) => {
      const headers = rows[startRow - 1];
      const metas = rows[startRow];
      const reals = rows[startRow + 1];
      for (let i = 1; i < headers.length; i++) {
        const dtStr = headers[i];
        if (!dtStr || dtStr === 'Total' || String(dtStr).includes('Diferença')) continue;
        const dt = new Date(dtStr);
        if (isNaN(dt.getTime())) continue;
        
        result.meta[year].push({
          mes: dt.getMonth() + 1,
          label: dt.toLocaleDateString('pt-BR', { month: 'short' }),
          meta: Number(metas[i]) || 0,
          realizado: Number(reals[i]) || 0
        });
      }
    };

    extractMetaYear(1, "2025");
    extractMetaYear(6, "2026");
  }

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Dados salvos em ${JSON_OUTPUT}`);
}

processExcel();
