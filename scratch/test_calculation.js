const fs = require('fs');

const data = JSON.parse(fs.readFileSync('C:/Douglas/Projeto Antigravity/criffer/public/data/dados.json', 'utf8'));
const orcamento = data.orcamento || {};

const res = {};
for (let m = 1; m <= 12; m++) {
  res[m] = { recReal: 0, recMeta: 0, despReal: 0, despOrc: 0, centros: [] };
}

Object.entries(orcamento.mensal).forEach(([key, mData]) => {
  const monthNum = Number(key.split('_')[1]);
  if (!monthNum) return;

  const period = data.byPeriod.find(p => p.ano === 2026 && p.mes === monthNum);
  const meta   = data.meta['2026'] ? data.meta['2026'].find(m => m.mes === monthNum) : null;

  let filteredCentros = mData.centros || [];

  res[monthNum] = {
    recReal:  period ? period.total : 0,
    recMeta:  meta ? meta.meta : 0,
    despReal: filteredCentros.reduce((s, c) => s + (c.real || 0), 0),
    despOrc:  filteredCentros.reduce((s, c) => s + (c.orc || 0), 0),
    centros:  filteredCentros
  };
});

// Create Accumulated
for (let m = 1; m <= 12; m++) {
  const monthsUpToNow = [1,2,3,4,5,6,7,8,9,10,11,12].filter(v => v <= m);
  
  const accObj = {
    recReal:  monthsUpToNow.reduce((s, k) => s + (res[k].recReal || 0), 0),
    recMeta:  monthsUpToNow.reduce((s, k) => s + (res[k].recMeta || 0), 0),
    despReal: monthsUpToNow.reduce((s, k) => s + (res[k].despReal || 0), 0),
    accDespOrc: monthsUpToNow.reduce((s, k) => s + (res[k].despOrc || 0), 0),
    centros: []
  };

  accObj.centros = (res[1].centros || []).map(c => {
    const ccName = c.cc;
    const categories = (c.categories || []).map(cat => {
      const catName = cat.name;
      return {
        name: catName,
        orc:  monthsUpToNow.reduce((s, k) => s + (res[k].centros.find(cc => cc.cc === ccName).categories.find(ct => ct.name === catName).orc || 0), 0),
        real: monthsUpToNow.reduce((s, k) => s + (res[k].centros.find(cc => cc.cc === ccName).categories.find(ct => ct.name === catName).real || 0), 0)
      };
    });

    return {
      cc: ccName,
      orc:  monthsUpToNow.reduce((s, k) => s + (res[k].centros.find(cc => cc.cc === ccName).orc || 0), 0),
      real: monthsUpToNow.reduce((s, k) => s + (res[k].centros.find(cc => cc.cc === ccName).real || 0), 0),
      categories: categories
    };
  });

  res[`acc_${m}`] = accObj;
}

const latestMonthWithData = [1,2,3,4,5,6,7,8,9,10,11,12].reverse().find(m => res[m].despReal > 0) || 1;
res['all'] = res[`acc_${latestMonthWithData}`];
res['latestMonth'] = latestMonthWithData;

console.log("latestMonthWithData =", latestMonthWithData);
console.log("res['all'].accDespOrc =", res['all'].accDespOrc);
console.log("Sum of res['all'].centros.orc =", res['all'].centros.reduce((s, c) => s + c.orc, 0));

console.log("\nFor Month 5 (Maio):");
console.log("Sum of acc_5.centros.orc =", res['acc_5'].centros.reduce((s, c) => s + c.orc, 0));
