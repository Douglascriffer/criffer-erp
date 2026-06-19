import os
import json
import pandas as pd
import openpyxl
from datetime import datetime
import math

# Configurações de Caminhos
EXCEL_VENDAS_PATH = r"Y:\.SAP VENDA\DASHBOARD VENDAS\1- ACOMPANHAMENTO VENDAS 2026.xlsx"
EXCEL_LOCACOES_PATH = r"Y:\.SAP VENDA\DASHBOARD VENDAS\1- ACOMPANHAMENTO LOCAÇÕES 2026.xlsx"
EXCEL_SERVICOS_PATH = r"Y:\.SAP VENDA\DASHBOARD VENDAS\1- ACOMPANHAMENTO SERVIÇOS 2026.xlsx"
JSON_OUTPUT = r"Y:\.SAP VENDA\DASHBOARD VENDAS\public\data\dados.json"

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def ensure_dirs():
    dir_path = os.path.dirname(JSON_OUTPUT)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        log(f"Diretório criado: {dir_path}")

def is_numeric_ped(x):
    try:
        val = float(x)
        return not math.isnan(val)
    except:
        return False

def clean_vendor(v):
    if pd.isna(v) or v is None:
        return 'Sem Vendedor'
    s = str(v).strip()
    if s == '' or s.upper() in ['NAN', 'NONE', '0', '0.0']:
        return 'Sem Vendedor'
    
    # Padronização
    s_lower = s.lower()
    if 'klein' in s_lower:
        return 'Gabriel Klein'
    if 'rogislei' in s_lower:
        return 'Rogislei'
    if 'gabriel ferreira' in s_lower:
        return 'Gabriel Ferreira'
    if 'dias' in s_lower:
        return 'Gabriel Dias'
    if 'mercado' in s_lower:
        return 'Mercado Livre'
    if 'site' in s_lower:
        return 'Site'
    if 'retorno' in s_lower and 'golpe' in s_lower:
        return 'Retorno de golpe'
    
    return s

def process_sheet(df, m_num, result, tx_list, is_locacao=False):
    col_map = {str(c).strip().lower(): c for c in df.columns}
    
    pedido_col = col_map.get('número do pedido', col_map.get('contrato'))
    if not pedido_col:
        return 0.0
        
    df_tx = df[df[pedido_col].apply(is_numeric_ped)].copy()
    
    valor_col = col_map.get('valor')
    if not valor_col:
        return 0.0
        
    df_tx[valor_col] = pd.to_numeric(df_tx[valor_col], errors='coerce').fillna(0.0)
    tx_sum = df_tx[valor_col].sum()
    
    for _, row in df_tx.iterrows():
        ped_val = row.get(pedido_col)
        try:
            ped_val = int(float(ped_val))
        except:
            ped_val = str(ped_val)
            
        if is_locacao:
            ped_val = f"LOC-{ped_val}"
            
        cliente_col = col_map.get('cliente')
        cli_val = str(row.get(cliente_col, '')).strip() if cliente_col else ''
        
        val_val = float(row.get(valor_col, 0.0))
        
        vendedor_col = col_map.get('vendedor')
        v_val = clean_vendor(row.get(vendedor_col)) if vendedor_col else 'Sem Vendedor'
        
        data_col = col_map.get('data')
        dt_val = row.get(data_col) if data_col else None
        
        if isinstance(dt_val, datetime):
            dt_str = dt_val.strftime("%Y-%m-%d")
        elif pd.notna(dt_val):
            try:
                dt_str = pd.to_datetime(str(dt_val).strip()).strftime("%Y-%m-%d")
            except:
                dt_str = str(dt_val)
        else:
            dt_str = f"2026-{m_num:02d}-01"
            
        obs_col = col_map.get('observações', col_map.get('observacoes'))
        obs_val = str(row.get(obs_col, '')).strip() if obs_col else ''
        
        if obs_val == 'nan' or pd.isna(obs_val):
            obs_val = ''
        
        tx_record = {
            "ano": 2026,
            "mes": m_num,
            "pedido": ped_val,
            "cliente": cli_val,
            "valor": val_val,
            "vendedor": v_val,
            "data": dt_str,
            "obs": obs_val,
            "tipo": "Locação" if is_locacao else "Venda"
        }
        result["transactions"].append(tx_record)
        tx_list.append(tx_record)
        
        existing = next((item for item in result["bySeller"] if item["ano"] == 2026 and item["mes"] == m_num and item["vendedor"] == v_val), None)
        if existing:
            existing["valor"] += val_val
            existing["count"] += 1
        else:
            result["bySeller"].append({
                "ano": 2026,
                "mes": m_num,
                "vendedor": v_val,
                "valor": val_val,
                "count": 1
            })
            
    return tx_sum

def process_excel():
    if not os.path.exists(EXCEL_VENDAS_PATH):
        log(f"ERRO: Arquivo Excel não encontrado em {EXCEL_VENDAS_PATH}.")
        return None

    try:
        log(f"Lendo Excel Vendas: {EXCEL_VENDAS_PATH}...")
        xl_vendas = pd.ExcelFile(EXCEL_VENDAS_PATH)
        
        xl_locacoes = None
        if os.path.exists(EXCEL_LOCACOES_PATH):
            log(f"Lendo Excel Locações: {EXCEL_LOCACOES_PATH}...")
            xl_locacoes = pd.ExcelFile(EXCEL_LOCACOES_PATH)
        else:
            log(f"Aviso: Arquivo de Locações não encontrado em {EXCEL_LOCACOES_PATH}.")

        xl_servicos = None
        if os.path.exists(EXCEL_SERVICOS_PATH):
            log(f"Lendo Excel Serviços: {EXCEL_SERVICOS_PATH}...")
            xl_servicos = pd.ExcelFile(EXCEL_SERVICOS_PATH)
        else:
            log(f"Aviso: Arquivo de Serviços não encontrado em {EXCEL_SERVICOS_PATH}.")
        
        result = {
            "byPeriod": [],
            "bySeller": [],
            "transactions": [],
            "meta": {"2026": []}
        }
        
        months_names = {
            1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio',
            6: 'Junho', 7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro',
            11: 'Novembro', 12: 'Dezembro'
        }

        annual_metrics = {}
        for m in range(1, 13):
            annual_metrics[m] = {
                "vendas_meta": 0.0, "vendas_realizado": 0.0,
                "locacao_meta": 0.0, "locacao_realizado": 0.0,
                "servicos_meta": 0.0, "servicos_realizado": 0.0,
                "total_meta": 0.0
            }

        if "META ANUAL" in xl_vendas.sheet_names:
            log("Processando metas e realizados da sheet META ANUAL (VENDAS)...")
            df_meta = pd.read_excel(EXCEL_VENDAS_PATH, sheet_name="META ANUAL", header=None)
            for m in range(1, 13):
                mt = df_meta.iloc[4, m]
                mv = df_meta.iloc[10, m]
                rv = df_meta.iloc[11, m]
                ml = df_meta.iloc[19, m]
                rl = df_meta.iloc[20, m]
                ms = df_meta.iloc[29, m]
                rs = df_meta.iloc[30, m]

                def clean_val(val):
                    if pd.isna(val) or val is None:
                        return 0.0
                    try:
                        return float(val)
                    except:
                        return 0.0

                annual_metrics[m] = {
                    "vendas_meta": clean_val(mv),
                    "vendas_realizado": clean_val(rv),
                    "locacao_meta": clean_val(ml),
                    "locacao_realizado": clean_val(rl),
                    "servicos_meta": clean_val(ms),
                    "servicos_realizado": clean_val(rs),
                    "total_meta": clean_val(mt)
                }
                
                result["meta"]["2026"].append({
                    "mes": m,
                    "label": months_names[m][:3],
                    "meta_empresa": clean_val(mv),
                    "meta_nossa": clean_val(mv)
                })
        
        for m_num in range(1, 13):
            month_name_upper = months_names[m_num].upper()
            tx_list = []
            
            # Processar Vendas
            sheet_found_vendas = next((s for s in xl_vendas.sheet_names if s.upper() == month_name_upper or (s.upper() == 'MARÇO' and month_name_upper == 'MARÇO') or (s.upper() == 'MARCO' and month_name_upper == 'MARÇO')), None)
            
            vendas_sum = 0.0
            if sheet_found_vendas:
                log(f"Processando vendas detalhadas da sheet: {sheet_found_vendas} (Mês {m_num})...")
                df = xl_vendas.parse(sheet_found_vendas)
                vendas_sum = process_sheet(df, m_num, result, tx_list, is_locacao=False)
            
            # Processar Locações
            locacoes_sum = 0.0
            if xl_locacoes:
                sheet_found_locacoes = next((s for s in xl_locacoes.sheet_names if s.upper() == month_name_upper or (s.upper() == 'MARÇO' and month_name_upper == 'MARÇO') or (s.upper() == 'MARCO' and month_name_upper == 'MARÇO')), None)
                if sheet_found_locacoes:
                    log(f"Processando locações detalhadas da sheet: {sheet_found_locacoes} (Mês {m_num})...")
                    df = xl_locacoes.parse(sheet_found_locacoes)
                    locacoes_sum = process_sheet(df, m_num, result, tx_list, is_locacao=True)
            
            # Processar Serviços
            if xl_servicos:
                sheet_found_servicos = next((s for s in xl_servicos.sheet_names if s.upper() == month_name_upper or (s.upper() == 'MARÇO' and month_name_upper == 'MARÇO') or (s.upper() == 'MARCO' and month_name_upper == 'MARÇO')), None)
                if sheet_found_servicos:
                    log(f"Processando serviços da sheet: {sheet_found_servicos} (Mês {m_num})...")
                    df_servicos = xl_servicos.parse(sheet_found_servicos, header=None)
                    
                    def clean_val_local(val):
                        if pd.isna(val) or val is None:
                            return 0.0
                        try:
                            return float(val)
                        except:
                            return 0.0
                            
                    s_meta = clean_val_local(df_servicos.iloc[1, 8]) if df_servicos.shape[0] > 1 and df_servicos.shape[1] > 8 else 0.0
                    s_realizado = clean_val_local(df_servicos.iloc[10, 3]) if df_servicos.shape[0] > 10 and df_servicos.shape[1] > 3 else 0.0
                    
                    annual_metrics[m_num]["servicos_meta"] = s_meta
                    annual_metrics[m_num]["servicos_realizado"] = s_realizado
            
            # Consolidar os dados financeiros deste mês
            metrics = annual_metrics[m_num]
            vendas_meta = metrics["vendas_meta"]
            vendas_realizado = metrics["vendas_realizado"]
            
            if (vendas_realizado == 0.0 or pd.isna(vendas_realizado)) and vendas_sum > 0:
                vendas_realizado = vendas_sum
                log(f"  Mês {m_num}: Faturamento de VENDAS atualizado pela soma: R$ {vendas_realizado:,.2f}")
                
            locacao_meta = metrics["locacao_meta"]
            locacao_realizado = metrics["locacao_realizado"]
            
            if locacoes_sum > 0:
                locacao_realizado = locacoes_sum
                log(f"  Mês {m_num}: Faturamento de LOCAÇÕES atualizado pela soma: R$ {locacao_realizado:,.2f}")
                
            servicos_meta = metrics["servicos_meta"]
            servicos_realizado = metrics["servicos_realizado"]
            servicos_falta = servicos_meta - servicos_realizado
            
            total_meta = metrics["total_meta"]
            total_realizado = vendas_realizado + locacao_realizado + servicos_realizado

            result["byPeriod"].append({
                "ano": 2026,
                "mes": m_num,
                "label": months_names[m_num].capitalize() + "/26",
                "vendas_meta": vendas_meta,
                "vendas_realizado": vendas_realizado,
                "locacao_meta": locacao_meta,
                "locacao_realizado": locacao_realizado,
                "servicos_meta": servicos_meta,
                "servicos_realizado": servicos_realizado,
                "servicos_falta": servicos_falta,
                "total_meta": total_meta,
                "total_realizado": total_realizado,
                "count": len(tx_list)
            })

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
        final_data = clean_nans(final_data)
        
        json_str = json.dumps(final_data, ensure_ascii=False, indent=2)
        with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
            f.write(json_str)
        log(f"Dados sincronizados com sucesso em {JSON_OUTPUT}")
    else:
        log("Falha na sincronização.")

if __name__ == "__main__":
    main()
