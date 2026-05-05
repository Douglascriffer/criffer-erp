import pandas as pd
EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
xl = pd.ExcelFile(EXCEL_PATH)
for sheet in xl.sheet_names:
    df = pd.read_excel(EXCEL_PATH, sheet_name=sheet, header=None)
    # Procurar por "META" em qualquer lugar
    mask = df.apply(lambda x: x.astype(str).str.contains('META', case=False, na=False)).any(axis=1)
    rows = df[mask]
    if not rows.empty:
        print(f"--- Encontrado 'META' na planilha {sheet} ---")
        print(rows.iloc[:, :5].to_string())
