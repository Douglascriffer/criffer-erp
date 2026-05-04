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

// Exact Row mapping (0-indexed)
const CC_ROWS = [
  { cc: 'Comercial', row: 9 },
  { cc: 'Marketing', row: 17 },
  { cc: 'Compras', row: 25 },
  { cc: 'Lab. Calibração', row: 33 },
  { cc: 'Lab. Manutenção', row: 41 },
  { cc: 'Administrativo', row: 49 },
  { cc: 'Diretoria', row: 57 },
  { cc: 'Financeiro', row: 66 },
  { cc: 'P&D', row: 74 },
  { cc: 'RH', row: 82 },
  { cc: 'Locação', row: 90 },
  { cc: 'TI', row: 98 },
  { cc: 'Logística', row: 106 },
  { cc: 'Manutenção', row: 114 },
  { cc: 'Produção', row: 122 },
  { cc: 'Sup. Técnico', row: 130 }
];

// Row 132 (idx 131) is TOTAL GERAL
const totalGeralRow = 131;

// Consolidate into mensal data
months.forEach((m, mIdx) => {
  const key = `2026_${mIdx + 1}`;
  
  const centros = CC_ROWS.map(map => ({
    cc: map.cc,
    orc: Number(rows[map.row]?.[m.orcIdx] || 0),
    real: Number(rows[map.row]?.[m.realIdx] || 0)
  }));

  orcamentoData.mensal[key] = {
    centros: centros,
    totalOrc: Number(rows[totalGeralRow]?.[m.orcIdx] || 0),
    totalReal: Number(rows[totalGeralRow]?.[m.realIdx] || 0)
  };
});

// Update metas (based on footer rows)
// We'll keep the previous footer logic if it worked, or find labels.
// Actually, let's look for "Receita Bruta" etc. in the whole sheet.
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

console.log('Sync completed with exact row mapping!');
