import pandas as pd

file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"

xl = pd.ExcelFile(file_path)
for sheet in xl.sheet_names:
    df = pd.read_excel(file_path, sheet_name=sheet, nrows=20)
    with open(f"scratch/sheet_{sheet.replace(' ', '_')}.txt", "w", encoding="utf-8") as f:
        f.write(f"Columns: {df.columns.tolist()}\n\n")
        f.write(df.to_string())
print("Saved sheet summaries to scratch/")
