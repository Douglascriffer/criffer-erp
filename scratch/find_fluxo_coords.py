import pandas as pd
import os

EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"

def find_value():
    if not os.path.exists(EXCEL_PATH):
        print("Arquivo não encontrado")
        return

    print(f"Lendo aba FLUXO de {EXCEL_PATH}...")
    try:
        # Lendo as primeiras 100 linhas e 100 colunas para varredura
        df = pd.read_excel(EXCEL_PATH, sheet_name="FLUXO DE CAIXA", header=None, nrows=100)
        
        target = 10509491
        # Procurar por valores aproximados (caso tenha centavos)
        for r in range(len(df)):
            for c in range(len(df.columns)):
                val = df.iloc[r, c]
                if pd.notna(val) and isinstance(val, (int, float)):
                    if abs(val - target) < 1000: # Margem para arredondamento
                        print(f"VALOR ENCONTRADO! Linha: {r} (Excel: {r+1}), Coluna: {c} (Excel Index: {c})")
                        print(f"Conteúdo da célula: {val}")
                        
                        # Mostrar contexto da linha para confirmar se é o Saldo Inicial
                        print(f"Label da linha (Coluna A): {df.iloc[r, 0]}")
                        return
        print("Valor não encontrado nas primeiras 100 linhas/colunas.")
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    find_value()
