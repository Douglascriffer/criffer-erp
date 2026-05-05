const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('c:\\Douglas\\Projeto Antigravity\\RESULTADOS.xlsx');
const ws = workbook.Sheets['ORÇAMENTO'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });

const orcamentoData = {
  mensal: {},
  metas: {}
};

// Map months based on columns F (idx 5) to AC (idx 28)
const months = [];
const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
for (let i = 0; i < 12; i++) {
  months.push({ 
    name: monthNames[i], 
    orcIdx: 5 + (i * 2), 
    realIdx: 6 + (i * 2) 
  });
}

// Exact Row mapping for TOTALS (to keep compatibility with DRE if needed)
const CC_MAP = [
  { cc: 'Comercial', start: 2, end: 9 },
  { cc: 'Marketing', start: 10, end: 17 },
  { cc: 'Compras', start: 18, end: 25 },
  { cc: 'Lab. Calibração', start: 26, end: 33 },
  { cc: 'Lab. Manutenção', start: 34, end: 41 },
  { cc: 'Administrativo', start: 42, end: 49 },
  { cc: 'Diretoria', start: 50, end: 57 },
  { cc: 'Financeiro', start: 58, end: 66 },
  { cc: 'P&D', start: 67, end: 74 },
  { cc: 'RH', start: 75, end: 82 },
  { cc: 'Locação', start: 83, end: 90 },
  { cc: 'TI', start: 91, end: 98 },
  { cc: 'Logística', start: 99, end: 106 },
  { cc: 'Manutenção', start: 107, end: 114 },
  { cc: 'Produção', start: 115, end: 122 },
  { cc: 'Sup. Técnico', start: 123, end: 130 }
];

// Row 132 (idx 131) is TOTAL GERAL
const totalGeralRow = 131;

// Consolidate into mensal data
months.forEach((m, mIdx) => {
  const key = `2026_${mIdx + 1}`;
  
  const centros = CC_MAP.map(map => {
    const totalRow = rows[map.end];
    const categories = [];
    
    // Extract categories between start and end (exclusive of end which is TOTAL)
    for (let r = map.start; r < map.end; r++) {
      const row = rows[r];
      if (row && row[1] && row[1] !== 'TOTAL') {
        categories.push({
          name: row[1],
          orc: Number(row[m.orcIdx] || 0),
          real: Number(row[m.realIdx] || 0),
          accOrc: Number(row[2] || 0), // Column C
          accReal: Number(row[3] || 0) // Column D
        });
      }
    }

    return {
      cc: map.cc,
      orc: Number(totalRow?.[m.orcIdx] || 0),
      real: Number(totalRow?.[m.realIdx] || 0),
      accOrc: Number(totalRow?.[2] || 0),
      accReal: Number(totalRow?.[3] || 0),
      categories: categories
    };
  });

  orcamentoData.mensal[key] = {
    centros: centros,
    totalOrc: Number(rows[totalGeralRow]?.[m.orcIdx] || 0),
    totalReal: Number(rows[totalGeralRow]?.[m.realIdx] || 0)
  };
});

// Update metas (based on footer rows)
const findVal = (label) => {
  const r = rows.find(row => row[1] === label || row[0] === label);
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

console.log('Sync completed with detailed categories and YTD columns!');
