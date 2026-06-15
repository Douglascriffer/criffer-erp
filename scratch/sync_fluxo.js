const XLSX = require('xlsx');
const fs = require('fs');

const EXCEL_PATH = 'C:\\\\Douglas\\\\Projeto Antigravity\\\\RESULTADOS.xlsx';
const JSON_OUTPUT = 'C:\\\\Douglas\\\\Projeto Antigravity\\\\criffer\\\\public\\\\data\\\\dados.json';

const workbook = XLSX.readFile(EXCEL_PATH);
const target_fluxo_sheet = workbook.SheetNames.find(n => n.toUpperCase().includes('FLUXO'));
if (!target_fluxo_sheet) {
  console.log('Sheet FLUXO DE CAIXA not found!');
  process.exit(1);
}

const ws = workbook.Sheets[target_fluxo_sheet];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: 0 });

const rows_map = {
  "saldo_inicial": 2,
  "total_entradas": 5,
  "materia_prima": 6,
  "fretes": 7,
  "pessoal": 8,
  "impostos": 9,
  "manut_predial": 10,
  "despesas_op": 11,
  "consultorias": 12,
  "pd": 13,
  "tarifas": 14,
  "total_saidas_op": 15,
  "diretoria": 16,
  "outros_gastos": 17,
  "ativ_financeiros": 25,
  "geracao_caixa": 27,
  "saldo_final": 28
};

function safeFloat(val) {
  if (val === undefined || val === null || val === '') return 0.0;
  if (typeof val === 'number') return val;
  const s = String(val).replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  if (s === '-' || s === '') return 0.0;
  return Number(s) || 0.0;
}

const fluxoData = { mensal: {}, latestMonth: 1 };

for (let m = 1; m <= 12; m++) {
  const col_orc = (m - 1) * 3 + 4;
  const col_real = (m - 1) * 3 + 5;
  
  const month_data = {};
  for (const [key, row_idx] of Object.entries(rows_map)) {
    if (row_idx < rows.length) {
      const val_orc = safeFloat(rows[row_idx][col_orc]);
      const val_real = safeFloat(rows[row_idx][col_real]);
      month_data[key] = { real: val_real, orc: val_orc };
    } else {
      month_data[key] = { real: 0, orc: 0 };
    }
  }

  let af_sum_real = 0.0;
  let af_sum_orc = 0.0;
  for (let r_idx = 18; r_idx <= 24; r_idx++) {
    if (r_idx < rows.length) {
      af_sum_real += safeFloat(rows[r_idx][col_real]);
      af_sum_orc += safeFloat(rows[r_idx][col_orc]);
    }
  }
  month_data["ativ_financeiros"] = { real: af_sum_real, orc: af_sum_orc };

  const ts_real = (month_data["total_saidas_op"]?.real || 0) +
                  (month_data["diretoria"]?.real || 0) +
                  (month_data["outros_gastos"]?.real || 0) +
                  af_sum_real;
                  
  const ts_orc = (month_data["total_saidas_op"]?.orc || 0) +
                 (month_data["diretoria"]?.orc || 0) +
                 (month_data["outros_gastos"]?.orc || 0) +
                 af_sum_orc;

  month_data["total_saidas"] = { real: ts_real, orc: ts_orc };

  month_data["ativ_financeiros_fixo"] = {
    real: rows[25] ? safeFloat(rows[25][col_real]) : 0,
    orc: rows[25] ? safeFloat(rows[25][col_orc]) : 0
  };
  
  month_data["resultado_mes_fixo"] = {
    real: rows[27] ? safeFloat(rows[27][col_real]) : 0,
    orc: rows[27] ? safeFloat(rows[27][col_orc]) : 0
  };

  fluxoData.mensal[m] = month_data;
}

let latest = 1;
for (let m = 1; m <= 12; m++) {
  if (fluxoData.mensal[m] && fluxoData.mensal[m]["total_entradas"]["real"] !== 0) {
    latest = m;
  }
}
fluxoData.latestMonth = latest;

const dados = JSON.parse(fs.readFileSync(JSON_OUTPUT, 'utf8'));
dados.fluxo = fluxoData;
fs.writeFileSync(JSON_OUTPUT, JSON.stringify(dados, null, 2));

console.log('Fluxo sync completed!');
