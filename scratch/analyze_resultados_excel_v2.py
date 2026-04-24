import pandas as pd

file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"

try:
    xl = pd.ExcelFile(file_path)
    sheets = xl.sheet_names
    print(f"Sheets: {sheets}")
    
    for sheet in sheets:
        print(f"\n--- Sheet: {sheet} ---")
        df = pd.read_excel(file_path, sheet_name=sheet, nrows=5)
        print("Columns:", df.columns.tolist())
        print("Head:\n", df.to_string())

except Exception as e:
    print(f"Error: {e}")
