import pandas as pd

EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
df_rec = pd.read_excel(EXCEL_PATH, sheet_name="RECEITAS", header=None)

print("Dates in RECEITAS col 0:")
for r in range(2, 20):
    date_val = df_rec.iloc[r, 0]
    print(f"Row {r}: {date_val}")
