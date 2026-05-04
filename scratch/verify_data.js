const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:\\Douglas\\Projeto Antigravity\\criffer\\public\\data\\dados.json', 'utf8'));

const year = 2026;
const months = [1, 2, 3];

months.forEach(mes => {
    const period = data.byPeriod.find(p => p.ano === year && p.mes === mes);
    const states = data.byState.filter(s => s.ano === year && s.mes === mes);
    const stateTotal = states.reduce((acc, s) => acc + s.faturamento, 0);
    
    const sellerTotal = data.bySellerTotals.find(s => s.ano === year && s.mes === mes)?.total || 0;
    
    console.log(`Mês ${mes}:`);
    console.log(`  Period Total: ${period.total}`);
    console.log(`  State Total:  ${stateTotal}`);
    console.log(`  Seller Total: ${sellerTotal}`);
    console.log(`  Diff Period-State: ${period.total - stateTotal}`);
    console.log(`  Diff Period-Seller: ${period.total - sellerTotal}`);
});
