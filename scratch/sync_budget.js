const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('c:\\Douglas\\Projeto Antigravity\\RESULTADOS.xlsx');
const orcamentoSheetName = 'ORÇAMENTO';
const ws = workbook.Sheets[orcamentoSheetName];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });

const orcamentoData = {
  mensal: {},
  metas: {}
};

// Map months
const months = [];
for (let j = 5; j < 29; j += 2) {
  months.push({ name: rows[0][j], orcIdx: j, realIdx: j + 1 });
}

// Parse Categories and Totals
const centros = {};
rows.forEach((row, i) => {
  if (i < 2) return;
  const cc = row[0];
  const cat = row[1];
  if (!cc || cc === 0) return;
  if (!centros[cc]) centros[cc] = { items: [], totals: { orc: Array(12).fill(0), real: Array(12).fill(0) } };
  if (cat === 'TOTAL') {
    months.forEach((m, mIdx) => {
      centros[cc].totals.orc[mIdx] = Number(row[m.orcIdx] || 0);
      centros[cc].totals.real[mIdx] = Number(row[m.realIdx] || 0);
    });
  } else {
    const item = { categoria: cat, orc: [], real: [] };
    months.forEach((m) => {
      item.orc.push(Number(row[m.orcIdx] || 0));
      item.real.push(Number(row[m.realIdx] || 0));
    });
    centros[cc].items.push(item);
  }
});

// Consolidate into mensal data
months.forEach((m, mIdx) => {
  const key = `2026_${mIdx + 1}`;
  orcamentoData.mensal[key] = {
    centros: Object.entries(centros).map(([name, data]) => ({
      cc: name,
      orc: data.totals.orc[mIdx],
      real: data.totals.real[mIdx]
    })),
    totalOrc: Object.values(centros).reduce((acc, c) => acc + c.totals.orc[mIdx], 0),
    totalReal: Object.values(centros).reduce((acc, c) => acc + c.totals.real[mIdx], 0)
  };
});

// Global targets
const findVal = (label) => {
  const r = rows.find(row => row[1] === label);
  return r ? Number(r[2] || 0) : 0;
};
orcamentoData.metas = {
  inicial: {
    receita: findVal('Receita Bruta'),
    despesas: Math.abs(findVal('Despesas')),
    resultado: findVal('Resultado'),
    economia: findVal('Economia gastos')
  }
};

// Update dados.json
const dadosPath = 'c:\\Douglas\\Projeto Antigravity\\criffer\\public\\data\\dados.json';
const dados = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
dados.orcamento = orcamentoData;
fs.writeFileSync(dadosPath, JSON.stringify(dados, null, 2));

console.log('Sync completed successfully!');
