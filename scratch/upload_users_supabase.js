
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envUrlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL="(.+)"/);
const envKeyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="(.+)"/);

const supabaseUrl = envUrlMatch ? envUrlMatch[1] : '';
const supabaseKey = envKeyMatch ? envKeyMatch[1] : '';

const supabase = createClient(supabaseUrl, supabaseKey);

const usuarios = [
  { nome: 'Andressa Barth', display: 'Andressa Barth', nivel: 'gestor', setor: 'Produção', email: 'andressa.pereira@criffer.com.br' },
  { nome: 'Carlos Rocha', display: 'Carlos Rocha', nivel: 'gestor', setor: 'Laboratório de Manutenção', email: 'carlos.rocha@criffer.com.br' },
  { nome: 'Cleiton Staehler', display: 'Cleiton Staehler', nivel: 'gestor', setor: 'Manutenção', email: 'djketu@hotmail.com' },
  { nome: 'Douglas Schmitz', display: 'Douglas Schmitz', nivel: 'gestor', setor: 'Logística', email: 'douglas.schmitz@criffer.com.br' },
  { nome: 'Faiblan', display: 'Faiblan', nivel: 'master', setor: 'TI', email: 'juliano.chagas@criffer.com.br' },
  { nome: 'Felipe Charão', display: 'Felipe Charão', nivel: 'gestor', setor: 'TI', email: 'felipe.charao@criffer.com.br' },
  { nome: 'Felipe Immich', display: 'Felipe Immich', nivel: 'gestor', setor: 'Laboratório Calibração', email: 'felipe.immich@crifferlab.com.br' },
  { nome: 'Felipe Oliveira', display: 'Felipe Oliveira', nivel: 'gestor', setor: 'Marketing', email: 'felipe.andrade@criffer.com.br' },
  { nome: 'Fernando Malta', display: 'Fernando Malta', nivel: 'gestor', setor: 'P&D', email: 'fernando.malta@criffer.com.br' },
  { nome: 'Douglas Bitencourt', display: 'Financeiro - ADM', nivel: 'master', setor: 'Diretoria', email: 'douglas.bitencourt@criffer.com.br' },
  { nome: 'Gabriel Dias', display: 'Gabriel Dias', nivel: 'gestor', setor: 'Vendas', email: 'gabriel.dias@criffer.com.br' },
  { nome: 'Juliano Chagas', display: 'Juliano Chagas', nivel: 'master', setor: 'Financeiro', email: 'juliano.chagas@criffer.com.br' },
  { nome: 'Natasha Osório da Silva', display: 'Natasha Osório', nivel: 'gestor', setor: 'RH', email: 'natasha.osorio@criffer.com.br' },
  { nome: 'Rodrigo Santos', display: 'Rodrigo Santos', nivel: 'gestor', setor: 'Compras', email: 'rodrigo.santos@criffer.com.br' },
  { nome: 'Ruslan Santos', display: 'Ruslan Santos', nivel: 'gestor', setor: 'Suporte Técnico', email: 'ruslan.santos@criffer.com.br' }
];

async function syncUsers() {
  console.log(`Enviando ${usuarios.length} usuários para o Supabase...`);

  // Tenta deletar os existentes para não duplicar (se a tabela existir)
  const { error: delErr } = await supabase.from('app_usuarios').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (delErr) {
    console.error("Erro ao limpar tabela (A tabela pode não existir ainda):", delErr.message);
    return;
  }

  const { data, error } = await supabase.from('app_usuarios').insert(usuarios);

  if (error) {
    console.error("Erro ao inserir usuários:", error.message);
  } else {
    console.log("Usuários sincronizados com sucesso no Supabase!");
  }
}

syncUsers();
