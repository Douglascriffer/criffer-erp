import pandas as pd
from datetime import datetime

excel_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
df_rec = pd.read_excel(excel_path, sheet_name="RECEITAS", header=None)

print("--- INSPEÇÃO DA PLANILHA RECEITAS (Linhas 0 a 25) ---")
for r in range(0, 25):
    col0 = df_rec.iloc[r, 0]
    colAE = df_rec.iloc[r, 30] # coluna AE (indice 30)
    print(f"Linha {r:2d} | Coluna A (Data): {col0} (Tipo: {type(col0)}) | Coluna AE (Total): {colAE}")

print("\n--- DETALHAMENTO DE OFFSETS EM RECEITAS ---")
offsets = {"vendas": 2, "servicos": 31, "locacao": 61, "devolucoes": 91}
for r in range(2, 20):
    date_val = df_rec.iloc[r, 0]
    if pd.isna(date_val) or str(date_val).strip() == "":
        continue
    print(f"\nLinha {r}: Data = {date_val}")
    for cat, off in offsets.items():
        row_idx = r - 2 + off
        val = df_rec.iloc[row_idx, 30]
        print(f"  - {cat} (Linha {row_idx}): {val}")
