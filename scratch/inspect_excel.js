const XLSX = require('xlsx');
const workbook = XLSX.readFile('c:\\Douglas\\Projeto Antigravity\\RESULTADOS.xlsx');
const ws = workbook.Sheets['ORÇAMENTO'];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });

// Print rows 1 to 20 to see categories and column headers
for (let i = 0; i < 30; i++) {
  console.log(`Row ${i}:`, rows[i]);
}
