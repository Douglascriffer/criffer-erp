import pandas as pd
EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
xl = pd.ExcelFile(EXCEL_PATH)
df_orc = pd.read_excel(EXCEL_PATH, sheet_name=4, header=None) # ORÇAMENTO
print("--- PRIMEIRAS 100 LINHAS DA ABA ORÇAMENTO ---")
print(df_orc.iloc[:100, :15].to_string())
