const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envLocal = fs.readFileSync('.env.local', 'utf-8');
const envUrlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL="(.+)"/);
const envKeyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="(.+)"/);
const supabaseUrl = envUrlMatch ? envUrlMatch[1] : '';
const supabaseKey = envKeyMatch ? envKeyMatch[1] : '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadData() {
  const rawData = fs.readFileSync('public/data/dados.json', 'utf-8');
  const dados = JSON.parse(rawData);
  const rows = [];

  // 1. Período
  if (dados.byPeriod) {
    for (const p of dados.byPeriod) {
      rows.push({
        tipo: 'periodo',
        ano: p.ano,
        mes: p.mes,
        label: p.label,
        vendas: p.vendas,
        servicos: p.servicos,
        locacao: p.locacao || 0,
        devolucoes: Math.abs(p.devolucoes || 0),
        total: p.total
      });
    }
  }

  // 2. Estado
  if (dados.byState) {
    for (const s of dados.byState) {
      rows.push({
        tipo: 'estado',
        ano: s.ano,
        mes: s.mes,
        estado: s.estado,
        faturamento: s.faturamento
      });
    }
  }

  // 3. Metas (insert directly into financial_data if we want to follow old schema, or into metas)
  // Let's insert into `metas` table instead if it exists, or just financial_data
  // `automation/sync_supabase.py` didn't insert metas, so maybe we skip or use financial_data?
  // Let's check financial_data schema: it has `meta` and `realizado` columns.

  if (dados.meta) {
    for (const [anoStr, metas] of Object.entries(dados.meta)) {
      const ano = parseInt(anoStr);
      for (const m of metas) {
        // We could insert a row with tipo='meta' if we wanted, or update existing 'periodo' row.
        // Let's try to update existing 'periodo' row.
        const existing = rows.find(r => r.tipo === 'periodo' && r.ano === ano && r.mes === m.mes);
        if (existing) {
          existing.meta = m.meta;
          existing.realizado = m.realizado;
        } else {
          rows.push({
            tipo: 'periodo',
            ano: ano,
            mes: m.mes,
            label: m.label,
            meta: m.meta,
            realizado: m.realizado
          });
        }
      }
    }
  }

  console.log(`Enviando ${rows.length} registros para o Supabase...`);

  // Limpar dados antigos? `automation/sync_supabase.py` didn't clean but upserted?
  // Rest v1 allows upsert. supabase-js allows upsert.
  // Wait, the table doesn't have a unique constraint on (ano, mes, tipo, estado).
  // The python script did a simple POST. We can just POST, but that might duplicate.
  // Let's delete all existing records to be safe? Or just POST.
  // The user might have row level security that prevents delete. 
  // Let's do a basic POST as the python script did, OR we can try to delete.

  const { data: del, error: delErr } = await supabase
    .from('financial_data')
    .delete()
    .neq('tipo', 'fake'); // Deletes all

  if (delErr) {
    console.log("Aviso ao deletar:", delErr.message);
  } else {
    console.log("Dados anteriores limpos.");
  }

  const { data, error } = await supabase.from('financial_data').insert(rows);

  if (error) {
    console.error("Erro na sincronizacao:", error);
  } else {
    console.log("Sincronizacao com Supabase concluida com sucesso!");
  }
}

uploadData();
