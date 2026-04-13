-- ═══════════════════════════════════════════════════════════
--  CRIFFER ERP — Supabase Schema
--  Execute no SQL Editor do Supabase (app.supabase.com)
-- ═══════════════════════════════════════════════════════════

-- 1. Tabela principal de dados financeiros
CREATE TABLE IF NOT EXISTS financial_data (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,       -- 'periodo' | 'estado'
  ano         INTEGER,
  mes         INTEGER,
  label       TEXT,
  -- Período
  vendas      NUMERIC(15,2) DEFAULT 0,
  servicos    NUMERIC(15,2) DEFAULT 0,
  locacao     NUMERIC(15,2) DEFAULT 0,
  devolucoes  NUMERIC(15,2) DEFAULT 0,
  total       NUMERIC(15,2) DEFAULT 0,
  -- Estado
  estado      TEXT,
  faturamento NUMERIC(15,2) DEFAULT 0,
  -- Meta
  meta        NUMERIC(15,2) DEFAULT 0,
  realizado   NUMERIC(15,2) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_financial_user    ON financial_data(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_tipo    ON financial_data(tipo);
CREATE INDEX IF NOT EXISTS idx_financial_ano_mes ON financial_data(ano, mes);
CREATE INDEX IF NOT EXISTS idx_financial_estado  ON financial_data(estado);

-- 3. Row Level Security (cada usuário vê apenas seus dados)
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_own_data" ON financial_data;
CREATE POLICY "users_own_data" ON financial_data
  FOR ALL USING (auth.uid() = user_id);

-- 4. Tabela de metas (separada para flexibilidade)
CREATE TABLE IF NOT EXISTS metas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ano         INTEGER NOT NULL,
  mes         INTEGER NOT NULL,
  tipo        TEXT DEFAULT 'total',  -- 'total' | 'vendas' | 'servicos'
  valor_meta  NUMERIC(15,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ano, mes, tipo)
);

ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_metas" ON metas
  FOR ALL USING (auth.uid() = user_id);

-- 5. View agregada para performance
CREATE OR REPLACE VIEW financial_summary AS
SELECT
  user_id,
  ano,
  mes,
  SUM(vendas)      AS total_vendas,
  SUM(servicos)    AS total_servicos,
  SUM(locacao)     AS total_locacao,
  SUM(devolucoes)  AS total_devolucoes,
  SUM(total)       AS total_geral
FROM financial_data
WHERE tipo = 'periodo'
GROUP BY user_id, ano, mes;

-- 6. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_financial_updated_at
  BEFORE UPDATE ON financial_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
