import pandas as pd

def main():
    file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
    xl = pd.ExcelFile(file_path)
    
    sheet = 'RECEITAS'
    df = pd.read_excel(file_path, sheet_name=sheet, header=None)
    print(f"\n--- Searching in Sheet: {sheet} ---")
    for row_idx, row in df.iterrows():
        for col_idx, val in enumerate(row):
            if pd.notna(val):
                s_val = str(val).upper()
                if any(kw in s_val for kw in ["VENDA", "SERVI", "LOCA", "TOTAL", "REALIZADO"]):
                    print(f"Found '{val}' at Row {row_idx}, Col {col_idx}")

if __name__ == "__main__":
    main()
