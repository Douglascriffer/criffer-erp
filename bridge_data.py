import os
import json
import pandas as pd
from datetime import datetime

# Configurações de Caminhos
EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\BASE DE DADOS - RECEITAS 2025-2026.xlsx"
JSON_OUTPUT = os.path.join(os.path.dirname(__file__), "public", "data", "dados.json")

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def ensure_dirs():
    dir_path = os.path.dirname(JSON_OUTPUT)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        log(f"Diretório criado: {dir_path}")

def generate_mock_data():
    """Gera dados de exemplo para inicialização imediata do Web App."""
    return {
        "byPeriod": [
            {"mes": 1, "ano": 2025, "label": "jan/25", "vendas": 850000, "servicos": 120000, "locacao": 45000, "devolucoes": 5000, "total": 1010000},
            {"mes": 2, "ano": 2025, "label": "fev/25", "vendas": 920000, "servicos": 135000, "locacao": 48000, "devolucoes": 3000, "total": 1100000},
            {"mes": 3, "ano": 2025, "label": "mar/25", "vendas": 780000, "servicos": 110000, "locacao": 42000, "devolucoes": 4000, "total": 928000},
            {"mes": 1, "ano": 2026, "label": "jan/26", "vendas": 1100000, "servicos": 150000, "locacao": 55000, "devolucoes": 2000, "total": 1303000},
        ],
        "byState": [
            {"ano": 2025, "mes": 1, "estado": "SP", "faturamento": 450000},
            {"ano": 2025, "mes": 1, "estado": "RS", "faturamento": 320000},
            {"ano": 2025, "mes": 1, "estado": "SC", "faturamento": 180000},
            {"ano": 2026, "mes": 1, "estado": "SP", "faturamento": 600000},
        ],
        "meta": {
            "2025": [
                {"mes": 1, "label": "Jan", "meta": 1000000, "realizado": 1010000},
                {"mes": 2, "label": "Fev", "meta": 1000000, "realizado": 1100000},
            ],
            "2026": [
                {"mes": 1, "label": "Jan", "meta": 1200000, "realizado": 1303000},
            ]
        },
        "raw": []
    }

def process_excel():
    if not os.path.exists(EXCEL_PATH):
        log(f"AVISO: Arquivo Excel não encontrado em {EXCEL_PATH}. Usando dados de exemplo.")
        return generate_mock_data()

    try:
        log(f"Lendo Excel (22MB): {EXCEL_PATH}...")
        xl = pd.ExcelFile(EXCEL_PATH)
        
        result = {
            "byPeriod": [],
            "byState": [],
            "meta": {"2025": [], "2026": []},
            "raw": []
        }
        
        # 1. Receita por período
        if "Receita por periodo" in xl.sheet_names:
            df = pd.read_excel(EXCEL_PATH, sheet_name="Receita por periodo")
            for _, row in df.iterrows():
                if pd.isna(row.get('Total')) or row['Total'] == 0: continue
                dt = row['Inicial']
                if hasattr(dt, 'to_pydatetime'): dt = dt.to_pydatetime()
                result["byPeriod"].append({
                    "mes": dt.month,
                    "ano": dt.year,
                    "label": dt.strftime("%b/%y").lower(),
                    "vendas": float(row.get('Vendas', 0)),
                    "servicos": float(row.get('Serviços', 0)),
                    "locacao": float(row.get('Locação', 0)),
                    "devolucoes": float(row.get('Devoluções', 0)),
                    "total": float(row['Total'])
                })

        # 2. Receita por estados
        if "Receita por estados" in xl.sheet_names:
            df_st = pd.read_excel(EXCEL_PATH, sheet_name="Receita por estados")
            for _, row in df_st.iterrows():
                dt = row.iloc[0]
                if pd.isna(dt): continue
                if hasattr(dt, 'to_pydatetime'): dt = dt.to_pydatetime()
                for i in range(1, len(df_st.columns)):
                    val = row.iloc[i]
                    if val > 0:
                        result["byState"].append({
                            "ano": dt.year, "mes": dt.month,
                            "estado": df_st.columns[i],
                            "faturamento": float(val)
                        })

        # 3. META
        if "META" in xl.sheet_names:
            df_meta = pd.read_excel(EXCEL_PATH, sheet_name="META", header=None)
            for year in ["2025", "2026"]:
                base_idx = 0 if year == "2025" else 4
                if len(df_meta) > base_idx + 1:
                    headers = df_meta.iloc[base_idx]
                    metas = df_meta.iloc[base_idx]
                    reals = df_meta.iloc[base_idx + 1]
                    for i in range(1, len(headers)):
                        dt = headers.iloc[i]
                        if pd.isna(dt): continue
                        if hasattr(dt, 'to_pydatetime'): dt = dt.to_pydatetime()
                        m_val = float(metas.iloc[i]) if not pd.isna(metas.iloc[i]) else 0
                        r_val = float(reals.iloc[i]) if not pd.isna(reals.iloc[i]) else 0
                        if m_val > 0:
                            result["meta"][year].append({
                                "mes": dt.month, "label": dt.strftime("%b"),
                                "meta": m_val, "realizado": r_val
                            })

        log("Processamento concluído com sucesso.")
        return result
    except Exception as e:
        log(f"ERRO no processamento: {str(e)}")
        return generate_mock_data()

def main():
    ensure_dirs()
    final_data = process_excel()
    
    with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    
    log(f"Web App Inicializado com Sucesso! Dados salvos em {JSON_OUTPUT}")

if __name__ == "__main__":
    main()
