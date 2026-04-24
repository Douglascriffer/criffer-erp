import pandas as pd
import sys

def main():
    file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
    try:
        xl = pd.ExcelFile(file_path)
        print(f"Sheets: {xl.sheet_names}")
        
        target_sheets = ['RECEITAS', 'COMERCIAL', 'METAS', 'VENDEDORES']
        for sheet in target_sheets:
            if sheet in xl.sheet_names:
                print(f"\n--- Sheet: {sheet} ---")
                df = pd.read_excel(file_path, sheet_name=sheet)
                print(df.head(10))
                print(df.columns.tolist())
            else:
                print(f"\nSheet {sheet} not found.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
