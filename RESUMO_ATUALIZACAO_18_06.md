# 📋 Resumo de Atualizações — 18/06/2026

Este documento registra as últimas validações, ajustes de layout e correções lógicas aplicadas no Criffer ERP após a última revisão do dia 14/05/2026.

## 🎨 Identidade Visual e Layout
- **Logotipos Oficiais:** Adicionado o logotipo oficial da empresa como ícone do site, inserção do logo da Criffer no card do e-commerce (com fundo laranja oficial `#ED6E2A`), e logotipo oficial em português do Mercado Livre (fundo amarelo).
- **Fotos do Time Comercial:** Aplicadas melhorias profissionais de nitidez (sharpness 2.0x) e contraste em todas as fotos para o padrão premium. Feitos ajustes finos repetidos de enquadramento vertical, alinhamento de cabeças e dimensionamento dos cards (aprox. 650px de altura).
- **Expansão Regional:** Implementado layout de Tabela à Esquerda e Mapa à Direita, cores de texto revertidas, listras alternadas (Zebra Striping) e padronização das fontes em 18px.
- **Dashboard P.L.R. (Participação):** Criação da janela P.L.R. estilo dashboard, com animação de pie chart e malha/rede de energia passando sequencialmente por todos os setores no estilo zig-zag até o centro. Alterado para usar base estática com valores sobrepostos.
- **Gráficos e Legibilidade:** Remoção do prefixo "R$" dos valores das barras (e cards KPIs superiores do Modo TV) para evitar quebra de linha. O Gráfico de Evolução de Metas foi redesenhado com barras horizontais e valores internos.

## ⚙️ Correções e Ajustes Lógicos (Fixes)
- **Financeiro e Centros de Custo:** Uso de helper `getMacroCenter` robusto para impedir agregação duplicada da linha ADM e remoção da categoria '0'. Formatação corrigida para saldos negativos.
- **Vendas:** Ajuste para o card VENDAS exibir o valor de vendas brutas (sem subtrair devoluções).

## 📺 Modo de Exibição (TV Mode)
- **Slides Ocultados:** Foram removidos do rodízio do Modo TV os slides de *Fluxo de Caixa* e *Saúde Financeira*.
- **Otimização de Espaço:** Divisão do Time Comercial em dois slides com layout compacto e histórico mensal para caberem de maneira nítida, além de associar os cards "Sem Vendedor" e "Assistência Técnica" ao logotipo Criffer "SITE".
- **Histórico Dinâmico:** Atualizado o código da tabela do *Time Comercial* para não ficar chumbado até abril, tornando-o dinâmico. Agora, exibe automaticamente todos os meses que possuem valores disponíveis (a partir do `ultimoMes` preenchido).
- **Ajustes Globais:** Aumentada a altura global dos slides no Modo TV para preencher melhor as telas grandes, além do reposicionamento de legendas e escalas no slide de Metas Estratégicas.
