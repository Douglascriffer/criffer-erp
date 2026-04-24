import os
import json
import pandas as pd
from datetime import datetime

# Configurações de Caminhos
EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
JSON_OUTPUT = os.path.join(os.path.dirname(__file__), "public", "data", "dados.json")

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def ensure_dirs():
    dir_path = os.path.dirname(JSON_OUTPUT)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        log(f"Diretório criado: {dir_path}")

def process_excel():
    if not os.path.exists(EXCEL_PATH):
        log(f"ERRO: Arquivo Excel não encontrado em {EXCEL_PATH}.")
        return None

    try:
        log(f"Lendo Excel: {EXCEL_PATH}...")
        xl = pd.ExcelFile(EXCEL_PATH)
        
        result = {
            "byPeriod": [],
            "byState": [],
            "bySeller": [],
            "meta": {"2025": [], "2026": []},
            "raw": []
        }
        
        # 1. Processar BASE DE DADOS para KPIs e Períodos
        if "BASE DE DADOS" in xl.sheet_names:
            log("Processando BASE DE DADOS...")
            df = pd.read_excel(EXCEL_PATH, sheet_name="BASE DE DADOS")
            
            # Garantir formato de data
            df['Data de Emissão'] = pd.to_datetime(df['Data de Emissão'], dayfirst=True)
            df['MesAno'] = df['Data de Emissão'].dt.to_period('M')
            
            # Categorização por Utilização
            def categorizar(util):
                util = str(util).upper()
                if 'SERVIÇO' in util: return 'servicos'
                if 'LOCAÇÃO' in util: return 'locacao'
                if 'VENDA' in util or 'EXPORTAÇÃO' in util: return 'vendas'
                return 'outros'
            
            df['Categoria'] = df['Utilização'].apply(categorizar)
            
            # Agrupamento por Período
            grouped = df.groupby(['MesAno', 'Categoria'])['Valor Total'].sum().unstack(fill_value=0)
            
            for period, row in grouped.iterrows():
                dt = period.to_timestamp()
                result["byPeriod"].append({
                    "mes": dt.month,
                    "ano": dt.year,
                    "label": dt.strftime("%b/%y").lower(),
                    "vendas": float(row.get('vendas', 0)),
                    "servicos": float(row.get('servicos', 0)),
                    "locacao": float(row.get('locacao', 0)),
                    "total": float(row.get('vendas', 0) + row.get('servicos', 0) + row.get('locacao', 0))
                })

            # Agrupamento por Vendedor (Ano Atual 2026)
            df_2026 = df[df['Data de Emissão'].dt.year == 2026]
            if not df_2026.empty:
                vendedores = df_2026.groupby('Vendedor')['Valor Total'].sum().sort_values(ascending=False)
                for name, val in vendedores.items():
                    if pd.isna(name): name = "Outros"
                    result["bySeller"].append({
                        "name": str(name),
                        "val": float(val),
                        "img": str(name)[:2].upper()
                    })

        # 2. Processar RECEITAS para o Mapa (Heatmap)
        if "RECEITAS" in xl.sheet_names:
            log("Processando RECEITAS (Mapa)...")
            # A planilha RECEITAS tem estados nas colunas e períodos nas linhas
            df_rec = pd.read_excel(EXCEL_PATH, sheet_name="RECEITAS", header=1) # Header 1 tem as siglas dos estados
            # Limpar dados: a primeira coluna é o período (jan-25, etc)
            for _, row in df_rec.iterrows():
                period_str = str(row.iloc[0])
                if '-' not in period_str: continue
                
                try:
                    # Formato jan-25
                    dt = pd.to_datetime(period_str, format='%b-%y')
                except:
                    continue

                for col in df_rec.columns[1:]:
                    if col == 'Total' or pd.isna(col): continue
                    val = row[col]
                    if pd.notna(val) and val != 0:
                        result["byState"].append({
                            "ano": dt.year,
                            "mes": dt.month,
                            "estado": str(col).strip(),
                            "faturamento": float(val)
                        })

        # 3. Processar Vendedores (Ranking)
        if "BASE DE DADOS" in xl.sheet_names:
            log("Processando Vendedores...")
            df_v = pd.read_excel(EXCEL_PATH, sheet_name="BASE DE DADOS")
            if "NOME_VENDEDOR" in df_v.columns and "DATA_VENDA" in df_v.columns and "TOTAL_VENDA" in df_v.columns:
                df_v['DATA_VENDA'] = pd.to_datetime(df_v['DATA_VENDA'])
                df_v['ano'] = df_v['DATA_VENDA'].dt.year
                df_v['mes'] = df_v['DATA_VENDA'].dt.month
                
                seller_group = df_v.groupby(['ano', 'mes', 'NOME_VENDEDOR'])['TOTAL_VENDA'].sum().reset_index()
                for _, row in seller_group.iterrows():
                    result["bySeller"].append({
                        "ano": int(row['ano']),
                        "mes": int(row['mes']),
                        "vendedor": str(row['NOME_VENDEDOR']),
                        "total": float(row['TOTAL_VENDA'])
                    })

        # 4. Processar METAS
        if "METAS" in xl.sheet_names:
            log("Processando METAS...")
            df_meta = pd.read_excel(EXCEL_PATH, sheet_name="METAS", header=None)
            
            def extract_meta_year(start_row, year):
                headers = df_meta.iloc[start_row-1]
                metas = df_meta.iloc[start_row]
                reals = df_meta.iloc[start_row+1]
                for i in range(1, len(headers)):
                    dt = headers.iloc[i]
                    if pd.isna(dt) or str(dt) == 'Total': continue
                    if not isinstance(dt, datetime):
                        try: dt = pd.to_datetime(dt)
                        except: continue
                    
                    m_val = float(metas.iloc[i]) if pd.notna(metas.iloc[i]) else 0
                    r_val = float(reals.iloc[i]) if pd.notna(reals.iloc[i]) else 0
                    result["meta"][year].append({
                        "mes": dt.month,
                        "label": dt.strftime("%b"),
                        "meta": m_val,
                        "realizado": r_val
                    })

            extract_meta_year(1, "2025")
            extract_meta_year(6, "2026")

        log("Processamento concluído com sucesso.")
        return result
    except Exception as e:
        log(f"ERRO no processamento: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    ensure_dirs()
    final_data = process_excel()
    
    if final_data:
        with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        log(f"Dados sincronizados com sucesso em {JSON_OUTPUT}")
    else:
        log("Falha na sincronização.")

if __name__ == "__main__":
    main()

