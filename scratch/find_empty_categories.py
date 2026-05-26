import pandas as pd

df = pd.read_excel(r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx", sheet_name="ORÇAMENTO", header=None)

for r in range(2, len(df)):
    cc = df.iloc[r, 0]
    cat = df.iloc[r, 1]
    if pd.isna(cat) or str(cat).strip() in ["", "0", "0.0"]:
        print(f"Row {r:3d} | CC: {str(cc):20s} | Cat: {str(cat)}")
