import pandas as pd
import sys

sys.stdout.reconfigure(encoding='utf-8')

excel_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
df_fluxo = pd.read_excel(excel_path, sheet_name="FLUXO DE CAIXA", header=None)

print("--- Colunas de Cabeçalho dos Meses (Linha 0) ---")
for c in range(5, df_fluxo.shape[1], 3):
    val = df_fluxo.iloc[0, c]
    val_str = str(val).encode('ascii', errors='ignore').decode('ascii')
    print(f"Col {c}: {val_str}")

print("\n--- Dados da Linha 5 (Total de Entradas) por Mês ---")
for m in range(1, 13):
    col_orc = (m - 1) * 3 + 4
    col_real = (m - 1) * 3 + 5
    if col_real < df_fluxo.shape[1]:
        mes_nome = df_fluxo.iloc[0, col_real - 1]
        val_orc = df_fluxo.iloc[5, col_orc]
        val_real = df_fluxo.iloc[5, col_real]
        print(f"Mês {m} ({mes_nome}): Orc = {val_orc} | Real = {val_real}")
