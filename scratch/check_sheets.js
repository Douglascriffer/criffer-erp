const XLSX = require('xlsx');
const fs = require('fs');
const buf = fs.readFileSync('C:\\\\Douglas\\\\Projeto Antigravity\\\\RESULTADOS.xlsx');
const workbook = XLSX.read(buf, {type: 'buffer'});
console.log(workbook.SheetNames);
