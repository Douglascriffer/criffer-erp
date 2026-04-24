import pandas as pd

file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"

def print_sheet_info(sheet_name):
    print(f"\n--- {sheet_name} ---")
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    print("Columns:", df.columns.tolist())
    print("First 5 rows:")
    print(df.head(5).to_string())

# Analyzing sheets that seem most relevant for the requested KPIs
print_sheet_info('RECEITAS')
print_sheet_info('METAS')
print_sheet_info('COMERCIAL')
