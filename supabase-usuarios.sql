-- 1. Tabela de usuários para gerenciamento de acessos
CREATE TABLE IF NOT EXISTS app_usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  display TEXT NOT NULL,
  nivel TEXT NOT NULL,
  setor TEXT NOT NULL,
  email TEXT UNIQUE,
  senha TEXT NOT NULL DEFAULT 'Criffer2026',
  recovery_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar segurança em nível de linha (opcional)
ALTER TABLE app_usuarios ENABLE ROW LEVEL SECURITY;

-- Como é um sistema interno, liberamos leitura e edição do recovery para autenticação/recuperação simplificada do frontend
DROP POLICY IF EXISTS "permitir_leitura_publica" ON app_usuarios;
CREATE POLICY "permitir_leitura_publica" ON app_usuarios FOR SELECT USING (true);

DROP POLICY IF EXISTS "permitir_update_publico" ON app_usuarios;
CREATE POLICY "permitir_update_publico" ON app_usuarios FOR UPDATE USING (true);

-- 3. Limpar tabela antes de inserir para evitar duplicidades em caso de reexecução
TRUNCATE TABLE app_usuarios;

-- 4. Inserir usuários
INSERT INTO app_usuarios (nome, display, nivel, setor, email) VALUES
('Andressa Barth', 'Andressa Barth', 'gestor', 'Produção', 'andressa.pereira@criffer.com.br'),
('Carlos Rocha', 'Carlos Rocha', 'gestor', 'Laboratório de Manutenção', 'carlos.rocha@criffer.com.br'),
('Cleiton Staehler', 'Cleiton Staehler', 'gestor', 'Manutenção', 'djketu@hotmail.com'),
('Douglas Schmitz', 'Douglas Schmitz', 'gestor', 'Logística', 'douglas.schmitz@criffer.com.br'),
('Faiblan', 'Faiblan', 'master', 'TI', 'juliano.chagas@criffer.com.br'),
('Felipe Charão', 'Felipe Charão', 'gestor', 'TI', 'felipe.charao@criffer.com.br'),
('Felipe Immich', 'Felipe Immich', 'gestor', 'Laboratório Calibração', 'felipe.immich@crifferlab.com.br'),
('Felipe Oliveira', 'Felipe Oliveira', 'gestor', 'Marketing', 'felipe.andrade@criffer.com.br'),
('Fernando Malta', 'Fernando Malta', 'gestor', 'P&D', 'fernando.malta@criffer.com.br'),
('Douglas Bitencourt', 'Financeiro - ADM', 'master', 'Diretoria', 'douglas.bitencourt@criffer.com.br'),
('Gabriel Dias', 'Gabriel Dias', 'gestor', 'Vendas', 'gabriel.dias@criffer.com.br'),
('Juliano Chagas', 'Juliano Chagas', 'master', 'Financeiro', 'juliano.chagas@criffer.com.br'),
('Natasha Osório da Silva', 'Natasha Osório', 'gestor', 'RH', 'natasha.osorio@criffer.com.br'),
('Rodrigo Santos', 'Rodrigo Santos', 'gestor', 'Compras', 'rodrigo.santos@criffer.com.br'),
('Ruslan Santos', 'Ruslan Santos', 'gestor', 'Suporte Técnico', 'ruslan.santos@criffer.com.br');
