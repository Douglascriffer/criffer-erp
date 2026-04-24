import pandas as pd

def main():
    file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
    df = pd.read_excel(file_path, sheet_name='RECEITAS', header=None)
    
    print("\n--- Block: VENDAS (Rows 12-14) ---")
    print(df.iloc[12:15, [0, 30]]) # jan-26 total
    
    print("\n--- Block: SERVICOS (Rows 41-43) ---")
    print(df.iloc[41:44, [0, 30]]) # jan-26 total
    
    print("\n--- Block: LOCACAO (Rows 71-73) ---")
    print(df.iloc[71:74, [0, 30]]) # jan-26 total

if __name__ == "__main__":
    main()
