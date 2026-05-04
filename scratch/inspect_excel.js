const XLSX = require('xlsx');
const workbook = XLSX.readFile('c:\\Douglas\\Projeto Antigravity\\RESULTADOS.xlsx');
const sheetName = 'ORÇAMENTO';

if (workbook.SheetNames.includes(sheetName)) {
    const ws = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });
    
    console.log(`Sheet: ${sheetName}`);
    console.log(`Total Rows: ${rows.length}`);
    
    // Print first 50 rows to see headers and structure
    rows.slice(0, 50).forEach((row, i) => {
        console.log(`Row ${i}: ${JSON.stringify(row)}`);
    });
} else {
    console.log(`Sheet ${sheetName} not found. Available: ${workbook.SheetNames.join(', ')}`);
}
