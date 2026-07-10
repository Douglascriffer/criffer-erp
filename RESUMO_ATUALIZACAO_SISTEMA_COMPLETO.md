# 📋 Guia Definitivo de Atualização do Sistema (Criffer ERP)

Este documento foi criado para registrar o fluxo exato de como QUALQUER atualização (seja de layout, troca de vídeos, mudança de regras ou novos dados) deve ser feita no projeto, servindo de memória fundamental para futuros atendimentos.

## 1. Fluxo Geral para Qualquer Atualização (Layout, Vídeos, Código)
Sempre que o usuário solicitar uma alteração visual (como ajustar tamanhos, trocar vídeos ou mudar cores) ou lógica no código:
1. **Entenda o Contexto:** Utilize ferramentas para localizar onde o componente está na pasta `app/` ou `components/`.
2. **Faça as Modificações:** Altere os arquivos com cuidado. Valide proporções de tela e teste impactos (como limites de tela para vídeos e responsividade).
3. **Persistência no Git:** Todo código modificado e novos arquivos DEVEM ser registrados e enviados ao GitHub:
   ```bash
   git add .
   git commit -m "Descricao clara da atualizacao"
   git push
   ```
4. **Deploy na Vercel:** O GitHub guarda os arquivos, mas a Vercel é o servidor principal que hospeda o site. Para garantir que o usuário veja a mudança na hora, force sempre o deploy de produção logo após o `git push`:
   ```bash
   cmd /c npx vercel --prod --yes
   ```
5. **Cache do Navegador:** Oriente sempre o usuário a atualizar a página usando `Ctrl + F5` (Hard Refresh), pois arquivos estáticos (como vídeos) e dados sofrem forte cache no navegador.

## 2. Atualizações de Dados Financeiros e Planilhas
A base de todos os dados numéricos do sistema é a planilha de Excel localizada em: `C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx`.
Quando o usuário modificar a planilha:
1. Rode os scripts da pasta `scratch/` (ex: `update_dados.js`, `sync_fluxo.js`) para ler o Excel e compilar as informações.
2. O resultado sempre vai para o arquivo de banco local: 👉 `public/data/dados.json`.
3. **O Detalhe Crítico (Metas Orçamentárias):** Os dados da sub-aba **Metas** (linhas 146 a 161 da aba ORÇAMENTO no Excel) **não** são lidos dinamicamente. Os valores de *Meta Inicial* e *Meta Atualizada* estão **chumbados (hardcoded)** direto no código `components/MetasOrcamentariasView.jsx`. O agente DEVE abrir este arquivo e alterar os números à mão todas as vezes.

## 3. O Ecossistema "Os 3 Sites" (Vercel, GitHub, Supabase)
O usuário se refere ao ecossistema do projeto como "os 3 sites". Sempre garanta que eles estão alinhados conforme estas regras:
- **GitHub:** Repositório oficial. Guarda e rastreia o histórico de todo o código. Obrigatório subir tudo para ele via `git push`.
- **Vercel:** Roda o site ao vivo (`criffer-erp.vercel.app`). É atualizado instantaneamente via `npx vercel --prod`.
- **Supabase:** É utilizado apenas como **Backup/Histórico** de dados para as versões antigas da arquitetura. O site novo da Vercel **NÃO** depende dele para funcionar (usa apenas o `dados.json`). O script de envio para o Supabase (`scratch/upload_supabase.js`) não funciona com a chave anônima por conta de bloqueios de segurança (Row-Level Security). Se o usuário cobrar do Supabase, foque em avisar que a Vercel + GitHub já estão operantes, mas peça a *Service Role Key* se ele realmente precisar da integração antiga funcionando.
