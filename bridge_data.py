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
        
        # 1. Processar RECEITAS por Categorias e Períodos (Lógica Premium)
        if "RECEITAS" in xl.sheet_names:
            log("Processando RECEITAS (Categorias)...")
            # Ler tudo sem header para controlar os offsets manualmente
            df_rec = pd.read_excel(EXCEL_PATH, sheet_name="RECEITAS", header=None)
            
            # Mapear estados (Row 1, Cols 1-28)
            states = {}
            for c in range(1, 29):
                st = df_rec.iloc[1, c]
                if pd.notna(st): states[c] = str(st).strip()

            # Offsets definidos pelo usuário (0-indexed)
            offsets = {
                "vendas": 2,
                "servicos": 31,
                "locacao": 61,
                "devolucoes": 91
            }

            # Extrair dados para cada mês (jan-25 até mar-26 ou o que estiver preenchido)
            # Vamos assumir que a primeira tabela (vendas) manda na lista de datas
            for r in range(2, 30): # Pegando um range seguro
                date_val = df_rec.iloc[r, 0]
                if pd.isna(date_val) or str(date_val).strip() == "": break
                
                try:
                    if isinstance(date_val, datetime):
                        dt = date_val
                    else:
                        dt = pd.to_datetime(str(date_val), format='%b-%y')
                except:
                    continue

                period_data = {
                    "mes": dt.month,
                    "ano": dt.year,
                    "label": dt.strftime("%b/%y").lower(),
                    "vendas": 0, "servicos": 0, "locacao": 0, "devolucoes": 0,
                    "total": 0
                }

                # Extrair valores totais da Coluna AE (30)
                for cat, off in offsets.items():
                    val = df_rec.iloc[r - 2 + off, 30]
                    period_data[cat] = float(val) if pd.notna(val) else 0

                # Receita Bruta = Vendas + Serviços + Locação
                period_data["total"] = period_data["vendas"] + period_data["servicos"] + period_data["locacao"]
                result["byPeriod"].append(period_data)

                # Extrair dados para o Mapa (Vendas + Servicos + Locacao por estado)
                for col_idx, st_name in states.items():
                    st_faturamento = 0
                    for cat in ["vendas", "servicos", "locacao"]:
                        off = offsets[cat]
                        val = df_rec.iloc[r - 2 + off, col_idx]
                        st_faturamento += float(val) if pd.notna(val) else 0
                    
                    if st_faturamento != 0:
                        result["byState"].append({
                            "ano": dt.year,
                            "mes": dt.month,
                            "estado": st_name,
                            "faturamento": st_faturamento
                        })

        # 2. Processar BASE DE DADOS para Ranking de Vendedores
        if "BASE DE DADOS" in xl.sheet_names:
            log("Processando Ranking de Vendedores (BASE DE DADOS)...")
            df = pd.read_excel(EXCEL_PATH, sheet_name="BASE DE DADOS")
            df['Data de Emissão'] = pd.to_datetime(df['Data de Emissão'], dayfirst=True)
            
            # Ranking por Vendedor (Agrupado por Ano para permitir YoY no componente)
            seller_group = df.groupby([df['Data de Emissão'].dt.year, 'Vendedor'])['Valor Total'].sum().reset_index()
            seller_group.columns = ['ano', 'vendedor', 'total']
            
            for _, row in seller_group.iterrows():
                result["bySeller"].append({
                    "ano": int(row['ano']),
                    "name": str(row['vendedor']),
                    "val": float(row['total']),
                    "img": str(row['vendedor'])[:2].upper()
                })
        # 3. Processar METAS
        if "METAS" in xl.sheet_names:
            log("Processando METAS...")
            df_meta = pd.read_excel(EXCEL_PATH, sheet_name="METAS", header=None)
            
            def extract_meta_year(start_row, year):
                # O layout do usuário tem Datas na linha (start_row-1), Metas na linha (start_row), Realizado na (start_row+1)
                headers = df_meta.iloc[start_row-1]
                metas = df_meta.iloc[start_row]
                reals = df_meta.iloc[start_row+1]
                for i in range(1, len(headers)):
                    dt = headers.iloc[i]
                    if pd.isna(dt) or str(dt) == 'Total' or 'Diferença' in str(dt): continue
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

