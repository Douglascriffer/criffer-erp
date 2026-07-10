# Como Atualizar o Sistema (Guia Completo)

Este é o fluxo automático padrão e documentado de como gerar uma nova atualização para o Dashboard (lendo a planilha de Resultados, sincronizando tudo e mandando para produção).

## Pré-requisitos
Certifique-se de que a planilha atualizada está localizada exatamente neste caminho:
`C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx`

---

## Passo a Passo para Atualização

No terminal (dentro da pasta `c:\Douglas\Projeto Antigravity\criffer`), basta rodar a seguinte sequência de comandos para extrair, sincronizar e subir os novos dados:

### 1. Extrair os dados da planilha
Esse comando irá ler as abas Receitas, Comercial e Metas e resetar o arquivo `dados.json`.
```bash
node scratch/update_dados.js
```

### 2. Sincronizar o Orçamento
Esse comando irá ler a aba Orçamento e anexar no `dados.json`.
```bash
node scratch/sync_budget.js
```

### 3. Sincronizar o Fluxo de Caixa
Esse comando irá ler a aba Fluxo de Caixa e anexar no `dados.json`.
```bash
node scratch/sync_fluxo.js
```

### 4. Salvar as alterações no GitHub (Opcional, mas recomendado)
Fazer o commit das alterações do JSON para manter o controle de versão e acionar deploys automáticos, se aplicável.
```bash
git commit -a -m "atualiza dados do dashboard"
git push
```

### 5. Enviar para a Produção na Vercel
Esse comando força o envio do novo `dados.json` e a compilação do projeto para a internet.
```bash
npx vercel --prod --yes
```
*(Caso dê bloqueio de execução no terminal do Windows, utilize: `cmd /c npx vercel --prod --yes`)*

---

## ⚠️ E quanto ao Supabase?
O sistema atual busca todas as informações essenciais direto do arquivo interno `dados.json`, ou seja, o envio ao Supabase tornou-se uma ferramenta de **backup/histórico**, e não o banco primário do Dashboard (diferente da arquitetura antiga).

Caso queira alimentar o Supabase por desencargo ou para análises avançadas futuras via API:
1. Verifique primeiro se o Supabase não está pausado por falta de uso (verifique a tela "Projects").
2. Caso pausado, ative clicando no botão verde "Resume".
3. Rode o comando no terminal:
   ```bash
   node scratch/upload_supabase.js
   ```
*(Importante: No momento, esse script via API pode apresentar bloqueios de RLS (Row-Level Security), dependendo das permissões ativadas no painel do banco)*
