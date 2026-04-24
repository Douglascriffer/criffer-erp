import pandas as pd

def main():
    file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
    xl = pd.ExcelFile(file_path)
    
    keywords = ["Vendas", "Servios", "Locao", "Receita Bruta", "Meta", "Atingimento"]
    # For coding safety, use substrings
    keywords = ["VENDA", "SERVI", "LOCA", "BRUTA", "META"]
    
    for sheet in xl.sheet_names:
        print(f"\nSearching in Sheet: {sheet}")
        df = pd.read_excel(file_path, sheet_name=sheet, header=None)
        for row_idx, row in df.iterrows():
            for col_idx, val in enumerate(row):
                if pd.notna(val):
                    s_val = str(val).upper()
                    for kw in keywords:
                        if kw in s_val:
                            print(f"Found '{kw}' at Row {row_idx}, Col {col_idx}: {val}")
                            # Print some context
                            print(f"  Row {row_idx} context: {list(row)[:10]}")
                            break

if __name__ == "__main__":
    main()
