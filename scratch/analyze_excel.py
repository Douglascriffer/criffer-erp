import pandas as pd
import sys

def main():
    file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
    try:
        xl = pd.ExcelFile(file_path)
        print(f"Sheets: {xl.sheet_names}")
        
        for sheet in xl.sheet_names:
            print(f"\n--- Sheet: {sheet} ---")
            df = pd.read_excel(file_path, sheet_name=sheet, nrows=5)
            print(df.head())
            print(df.columns)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
