import pandas as pd
EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
df = pd.read_excel(EXCEL_PATH, sheet_name="RECEITAS", header=None)
print("MARCO 2026 check:")
print(f"Vendas (Row 16): {df.iloc[16, [0, 30]].values}")
print(f"Servicos (Row 16+29=45?): {df.iloc[45, [0, 30]].values}")
print(f"Locacao (Row 16+59=75?): {df.iloc[75, [0, 30]].values}")
print(f"Devolucoes (Row 16+89=105?): {df.iloc[105, [0, 30]].values}")
