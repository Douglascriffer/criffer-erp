import pandas as pd

def main():
    file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
    xl = pd.ExcelFile(file_path)
    
    sheet = 'RECEITAS'
    df = pd.read_excel(file_path, sheet_name=sheet, header=None)
    print(f"\n--- Sheet: {sheet} (Full Header) ---")
    print(df.iloc[0:2]) # First two rows to see headers
    
    # Check if there are other columns like "Serviços", "Locação" etc.
    # Usually they are in separate blocks or separate sheets.
    
    if 'ORÇAMENTO' in xl.sheet_names:
        print(f"\n--- Sheet: ORÇAMENTO ---")
        df_orc = pd.read_excel(file_path, sheet_name='ORÇAMENTO', header=None)
        print(df_orc.head(20))

if __name__ == "__main__":
    main()
