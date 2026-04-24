import pandas as pd
import json

file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"

try:
    xl = pd.ExcelFile(file_path)
    sheets = xl.sheet_names
    print(f"Sheets: {sheets}")
    
    summary = {}
    for sheet in sheets:
        df = pd.read_excel(file_path, sheet_name=sheet, nrows=10)
        summary[sheet] = {
            "columns": df.columns.tolist(),
            "sample_rows": df.head(3).values.tolist()
        }
    
    with open("scratch/analyze_resultados_excel.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print("Analysis complete. Check scratch/analyze_resultados_excel.json")

except Exception as e:
    print(f"Error: {e}")
