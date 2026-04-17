import os
import pandas as pd
import requests
from datetime import datetime

# Configurações
EXCEL_PATH = r"C:\projeto dashboard\DASHBOARD.xlsx"
SUPABASE_URL = "https://aolhtqbrxwifoujdkhqw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvbGh0cWJyeHdpZm91amRraHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDU4MDcsImV4cCI6MjA5MTQyMTgwN30.lJacFwiBN4WZLIdf2yHH75pBsZgvnrFsX6UiXqYdllg"

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def parse_pt_date(d):
    if hasattr(d, 'to_pydatetime'): return d.to_pydatetime()
    if not isinstance(d, str): return d
    months_pt = {
        'jan': 1, 'fev': 2, 'mar': 3, 'abr': 4, 'mai': 5, 'jun': 6,
        'jul': 7, 'ago': 8, 'set': 9, 'out': 10, 'nov': 11, 'dez': 12
    }
    try:
        parts = d.lower().split('-')
        if len(parts) == 2:
            m = months_pt.get(parts[0], 1)
            y = int(parts[1])
            if y < 100: y += 2000
            return datetime(y, m, 1)
    except: pass
    return d

def sync_to_supabase():
    if not os.path.exists(EXCEL_PATH):
        log(f"ERRO: Excel não encontrado em {EXCEL_PATH}")
        return

    log("Lendo Excel e processando blocos...")
    df = pd.read_excel(EXCEL_PATH, sheet_name="DASHBOARD", header=None)
    
    # Siglas dos Estados (L2, Col B-AB)
    uf_cols = list(range(1, 28))
    uf_names = df.iloc[1, uf_cols].values

    def extract_quadrant(start_row, end_row):
        data_df = df.iloc[start_row+2 : end_row-1, :]
        rows = []
        for _, row in data_df.iterrows():
            periodo_raw = row[0]
            if pd.isna(periodo_raw) or str(periodo_raw).strip() == "": continue
            dt = parse_pt_date(periodo_raw)
            ano, mes = (dt.year, dt.month) if hasattr(dt, 'year') else (2025, 1)
            
            # Estados
            states = []
            for i, col_idx in enumerate(uf_cols):
                val = float(row[col_idx]) if not pd.isna(row[col_idx]) else 0
                if val != 0:
                    states.append({"ano": ano, "mes": mes, "estado": str(uf_names[i]), "faturamento": val})
            
            total_geral = float(row[28]) if not pd.isna(row[28]) else 0
            rows.append({
                "ano": ano, "mes": mes, 
                "label": dt.strftime("%b/%y").lower() if hasattr(dt, 'strftime') else str(dt),
                "total": total_geral,
                "states": states
            })
        return rows

    v_data = extract_quadrant(0, 26)   # Quadrante A: Vendas
    s_data = extract_quadrant(29, 55)  # Quadrante B: Servicos
    d_data = extract_quadrant(58, 84)  # Quadrante C: Devolucoes

    periods = {}
    def get_k(r): return f"{r['ano']}_{r['mes']}"

    for v in v_data:
        k = get_k(v)
        periods[k] = {"ano": v['ano'], "mes": v['mes'], "label": v['label'], "vendas": v['total'], "servicos": 0, "devolucoes": 0, "total": v['total'], "tipo": "periodo"}
    for s in s_data:
        k = get_k(s)
        if k in periods:
            periods[k]["servicos"] = s['total']
            periods[k]["total"] += s['total']
        else:
            periods[k] = {"ano": s['ano'], "mes": s['mes'], "label": s['label'], "vendas": 0, "servicos": s['total'], "devolucoes": 0, "total": s['total'], "tipo": "periodo"}
    for d in d_data:
        k = get_k(d)
        if k in periods:
            periods[k]["devolucoes"] = d['total']
            periods[k]["total"] -= d['total']

    # Consolidação de Estados
    states_agg = {}
    for items in [v_data, s_data, d_data]:
        sig = -1 if items == d_data else 1
        for row in items:
            for s in row['states']:
                key = f"{s['ano']}_{s['mes']}_{s['estado']}"
                if key not in states_agg:
                    states_agg[key] = {"ano": s['ano'], "mes": s['mes'], "estado": s['estado'], "faturamento": 0, "tipo": "estado"}
                states_agg[key]["faturamento"] += (s['faturamento'] * sig)

    # Payload para o Supabase
    all_payload = list(periods.values()) + list(states_agg.values())
    
    log(f"Enviando {len(all_payload)} registros para o Supabase...")
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates" # Upsert baseado em unique constraints se houver
    }
    
    url = f"{SUPABASE_URL}/rest/v1/financial_data"
    
    # Nota: O schema do Supabase precisa de uma constraint UNIQUE (ano, mes, tipo, estado) ou similar para o upsert funcionar como merge.
    # Por segurança, vamos limpar e inserir se não houver constraint, ou apenas POST.
    # Como não temos certeza da Service Role, vamos tentar um POST simples.
    
    # Limpa dados antigos (opcional, se tivermos deleção)
    # r_del = requests.delete(url, headers=headers)
    
    response = requests.post(url, headers=headers, json=all_payload)
    
    if response.status_code in [200, 201]:
        log("Sincronização com Supabase concluída com sucesso!")
    else:
        log(f"ERRO na sincronização: {response.status_code} - {response.text}")

if __name__ == "__main__":
    sync_to_supabase()
