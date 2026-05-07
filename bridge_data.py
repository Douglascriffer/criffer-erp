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
                        date_str = str(date_val).strip().lower()
                        pt_to_en = {'fev':'feb', 'abr':'apr', 'mai':'may', 'ago':'aug', 'set':'sep', 'out':'oct', 'dez':'dec'}
                        for pt, en in pt_to_en.items():
                            date_str = date_str.replace(pt, en)
                        dt = pd.to_datetime(date_str, format='%b-%y')
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

                # Receita Líquida = Vendas + Serviços + Locação - |Devoluções|
                period_data["total"] = period_data["vendas"] + period_data["servicos"] + period_data["locacao"] - abs(period_data["devolucoes"])
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

        # 2. Processar COMERCIAL para Ranking de Vendedores (Matriz Oficial)
        if "COMERCIAL" in xl.sheet_names:
            log("Processando Ranking de Vendedores (COMERCIAL)...")
            df_com = pd.read_excel(EXCEL_PATH, sheet_name="COMERCIAL", header=None)
            
            # Mapeamento fixo conforme solicitado pelo Douglas
            COLUMN_MAP = {
                1:  'Assistência Técnica',
                2:  'Gabriel Dias',
                3:  'Gabriel Ferreira dos Santos',
                4:  'Gabriel Klein',
                5:  'Gabriel Medeiros',
                6:  'Josiane Govoni Lanzarini',
                7:  'Juliano Chagas',
                8:  'Leonardo Schons de Oliveira',
                9:  'Mercado Livre',
                10: 'Sem Vendedor', # Coluna K
                11: 'Nilson Borges',
                12: 'Rogislei Vieira Padilha',
                13: 'Site',
                14: 'Vanessa Ferreira',
                15: 'Sem Vendedor'  # Coluna P
            }

            result["bySeller"] = []
            result["bySellerTotals"] = []

            for r in range(1, len(df_com)):
                date_val = df_com.iloc[r, 0]
                if pd.isna(date_val): continue
                
                try:
                    if isinstance(date_val, datetime):
                        dt = date_val
                    else:
                        dt = pd.to_datetime(date_val)
                except: continue

                # Coluna R (índice 17) - Total Oficial
                real_val = float(df_com.iloc[r, 17]) if pd.notna(df_com.iloc[r, 17]) else 0
                if real_val > 0:
                    result["bySellerTotals"].append({
                        "ano": dt.year, "mes": dt.month, "total": real_val
                    })

                # Agregação por vendedor no mês
                month_sellers = {}
                for col_idx, name in COLUMN_MAP.items():
                    val = float(df_com.iloc[r, col_idx]) if pd.notna(df_com.iloc[r, col_idx]) else 0
                    if val != 0:
                        month_sellers[name] = month_sellers.get(name, 0) + val

                for name, val in month_sellers.items():
                    result["bySeller"].append({
                        "ano": dt.year,
                        "mes": dt.month,
                        "vendedor": name,
                        "valor": val
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
                        try:
                            date_str = str(dt).strip().lower()
                            pt_to_en = {'fev':'feb', 'abr':'apr', 'mai':'may', 'ago':'aug', 'set':'sep', 'out':'oct', 'dez':'dec'}
                            for pt, en in pt_to_en.items():
                                date_str = date_str.replace(pt, en)
                            dt = pd.to_datetime(date_str)
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

        # 4. Processar ORÇAMENTO (Centros de Custo e DRE)
        target_orc_sheet = next((s for s in xl.sheet_names if "OR" in s.upper() and "AMENTO" in s.upper()), None)
        if target_orc_sheet:
            log(f"Processando {target_orc_sheet}...")
            df_orc = pd.read_excel(EXCEL_PATH, sheet_name=target_orc_sheet, header=None)
            
            result["orcamento"] = {"mensal": {}}
            for m in range(1, 13):
                result["orcamento"]["mensal"][f"month_{m}"] = {"centros": []}
            
            def normalize_cc(name):
                n = str(name).strip()
                if 'Produ' in n: return 'Produção'
                if 'Logistica' in n: return 'Logística'
                if 'Manuten' in n and 'Lab' not in n: return 'Manutenção'
                if 'Sup' in n and 'Tec' in n: return 'Sup. Técnico'
                if 'Loca' in n: return 'Locação'
                if 'Calibra' in n: return 'Lab. Calibração'
                if 'Lab. Manuten' in n: return 'Lab. Manutenção'
                if 'Comercial' in n: return 'Comercial'
                if 'Vendas' in n: return 'Comercial'
                if 'Financeiro' in n: return 'Financeiro'
                if 'RH' in n: return 'RH'
                if 'TI' in n: return 'TI'
                if 'Diretoria' in n: return 'Diretoria'
                if 'Marketing' in n: return 'Marketing'
                if 'Compras' in n: return 'Compras'
                return n

            current_cc = None
            cc_rows = []

            for r in range(2, len(df_orc)):
                cc_candidate = df_orc.iloc[r, 0]
                category = df_orc.iloc[r, 1]
                
                # Se encontrou um novo CC na coluna 0
                if pd.notna(cc_candidate) and str(cc_candidate).strip() != "":
                    current_cc = normalize_cc(cc_candidate)
                    if current_cc == "Total Geral": break
                    
                if not current_cc: continue
                
                # Coletar dados mensais para esta linha (categoria ou total)
                if pd.notna(category) and str(category).strip() != "":
                    cat_name = str(category).strip()
                    
                    monthly_values = []
                    for m in range(1, 13):
                        col_orc = 5 + (m-1)*2
                        col_real = 6 + (m-1)*2
                        val_orc = float(df_orc.iloc[r, col_orc]) if pd.notna(df_orc.iloc[r, col_orc]) else 0
                        val_real = float(df_orc.iloc[r, col_real]) if pd.notna(df_orc.iloc[r, col_real]) else 0
                        monthly_values.append({"m": m, "orc": val_orc, "real": val_real})
                    
                    if cat_name.upper() == "TOTAL":
                        # Finalizar o CC atual e adicionar ao resultado
                        for mv in monthly_values:
                            # Encontrar ou criar o registro do mês
                            month_key = f"month_{mv['m']}"
                            
                            # Procurar se já existe este CC neste mês
                            existing_cc = next((c for c in result["orcamento"]["mensal"][month_key]["centros"] if c["cc"] == current_cc), None)
                            if not existing_cc:
                                existing_cc = {"cc": current_cc, "orc": mv["orc"], "real": mv["real"], "categories": []}
                                result["orcamento"]["mensal"][month_key]["centros"].append(existing_cc)
                            else:
                                existing_cc["orc"] = mv["orc"]
                                existing_cc["real"] = mv["real"]
                                
                            # Adicionar as categorias acumuladas para este CC
                            for crow in cc_rows:
                                existing_cc["categories"].append({
                                    "name": crow["name"],
                                    "orc": crow["values"][mv["m"]-1]["orc"],
                                    "real": crow["values"][mv["m"]-1]["real"]
                                })
                        
                        # Limpar para o próximo CC
                        cc_rows = []
                    else:
                        # Adicionar categoria à lista temporária do CC atual
                        cc_rows.append({"name": cat_name, "values": monthly_values})

        # 5. Processar FLUXO DE CAIXA
        target_fluxo_sheet = next((s for s in xl.sheet_names if "FLUXO" in s.upper()), None)
        if target_fluxo_sheet:
            log(f"Processando {target_fluxo_sheet}...")
            df_fluxo = pd.read_excel(EXCEL_PATH, sheet_name=target_fluxo_sheet, header=None)
            
            result["fluxo"] = {"mensal": {}}
            
            # Linhas fixas baseadas na análise da planilha (index 0)
            rows_map = {
                "saldo_inicial": 4,
                "total_entradas": 5,
                "materia_prima": 6,
                "fretes": 7,
                "pessoal": 8,
                "impostos": 9,
                "manut_predial": 10,
                "despesas_op": 11,
                "consultorias": 12,
                "pd": 13,
                "tarifas": 14,
                "total_saidas_op": 15, # Linha 16
                "diretoria": 16,
                "outros_gastos": 17,
                "emprestimos": 18,
                "aplic_sicredi": 19,
                "resgate_sicredi": 20,
                "rend_aplic": 21,
                "transf_sicredi": 22,
                "transf_bb": 23,
                "cash": 24,
                "ativ_fin_total": 25,  # Linha 26 (Resultados Ativ Fin)
                "geracao_caixa": 26,   # Linha 27
                "saldo_final": 27      # Linha 28
            }

            def safe_float(val):
                try:
                    if pd.isna(val) or val == "": return 0.0
                    if isinstance(val, (int, float)): return float(val)
                    s = str(val).replace('R$', '').replace('.', '').replace(',', '.').strip()
                    if s == '-' or s == '': return 0.0
                    return float(s)
                except:
                    return 0.0

            for m in range(1, 13):
                col_orc = 1 + (m * 3)
                col_real = 2 + (m * 3)
                
                if col_real < len(df_fluxo.columns):
                    month_data = {}
                    for key, row_idx in rows_map.items():
                        if row_idx < len(df_fluxo):
                            val_orc = safe_float(df_fluxo.iloc[row_idx, col_orc])
                            val_real = safe_float(df_fluxo.iloc[row_idx, col_real])
                            month_data[key] = {"real": val_real, "orc": val_orc}
                    
                    # ── CONSOLIDAÇÃO ATIVIDADES FINANCEIRAS (SOMA RIGOROSA 19-25) ──
                    # Usar índices diretos para garantir captura independente do rows_map
                    af_sum_real = 0.0
                    af_sum_orc = 0.0
                    for r_idx in range(18, 25): # Linhas 19 a 25
                        if r_idx < len(df_fluxo):
                            af_sum_real += safe_float(df_fluxo.iloc[r_idx, col_real])
                            af_sum_orc += safe_float(df_fluxo.iloc[r_idx, col_orc])
                    
                    month_data["ativ_financeiros"] = {"real": af_sum_real, "orc": af_sum_orc}

                    # ── TOTAL DE SAÍDAS CONSOLIDADO ──
                    # Saídas OP (Linha 16) + Diretoria (Linha 17) + Outros (Linha 18) + Ativ Fin (Soma 19-25)
                    ts_real = (month_data.get("total_saidas_op", {}).get("real") or 0) + \
                              (month_data.get("diretoria", {}).get("real") or 0) + \
                              (month_data.get("outros_gastos", {}).get("real") or 0) + \
                              af_sum_real
                    
                    ts_orc = (month_data.get("total_saidas_op", {}).get("orc") or 0) + \
                             (month_data.get("diretoria", {}).get("orc") or 0) + \
                             (month_data.get("outros_gastos", {}).get("orc") or 0) + \
                             af_sum_orc
                    
                    month_data["total_saidas"] = {"real": ts_real, "orc": ts_orc}
                    
                    result["fluxo"]["mensal"][m] = month_data

            # Identificar o último mês com dados reais para o Fluxo
            latest = 1
            for m in range(1, 13):
                if m in result["fluxo"]["mensal"] and result["fluxo"]["mensal"][m]["total_entradas"]["real"] != 0:
                    latest = m
            result["fluxo"]["latestMonth"] = latest

        log("Processamento concluído com sucesso.")
        return result
    except Exception as e:
        log(f"ERRO no processamento: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def clean_nans(obj):
    if isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(i) for i in obj]
    elif isinstance(obj, float):
        import math
        if math.isnan(obj) or math.isinf(obj):
            return 0.0
    return obj

def main():
    ensure_dirs()
    final_data = process_excel()
    
    if final_data:
        # Limpar NaNs para evitar JSON inválido
        final_data = clean_nans(final_data)
        
        json_str = json.dumps(final_data, ensure_ascii=False, indent=2)
        with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
            f.write(json_str)
        log(f"Dados sincronizados com sucesso em {JSON_OUTPUT}")
    else:
        log("Falha na sincronização.")

if __name__ == "__main__":
    main()

