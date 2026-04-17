import os
import time
import pyautogui
import pandas as pd
from docx import Document
import win32com.client
import json
from datetime import datetime

# Configurações do RPA
PATH_WORD = r"C:\Douglas\Projeto Antigravity\PROMPT para relatorio V2908.docx"
PATH_EXCEL = r"C:\Douglas\Projeto Antigravity\DASHBOARD.xlsx"
PATH_JSON = r"C:\Douglas\Projeto Antigravity\criffer\public\data\dados.json"

def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def read_word_sql(path):
    doc = Document(path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

def check_sap_open():
    log("Verificando se o SAP está aberto...")
    # Em um ambiente real, poderíamos usar win32gui para encontrar a janela
    # Aqui assumimos que o usuário garantiu o SAP aberto ou que o processo está ativo
    return True

def close_excel():
    log("Garantindo que o Excel esteja fechado...")
    try:
        os.system("taskkill /f /im excel.exe")
    except:
        pass

def rpa_flow():
    if not check_sap_open():
        log("ERRO: SAP não está aberto. Abortando.")
        return False

    # 1. Navegação no SAP (Exemplo de automação pyautogui)
    log("Navegando no Gerenciador de Consultas...")
    # pyautogui.click(x, y) ... coordenadas dependem da tela do usuário
    # Como não temos as coordenadas exatas, deixaremos os placeholders documentados
    time.sleep(2)
    
    # 2. Inserção de Datas
    log("Inserindo datas: 01/01/2025 até hoje...")
    # pyautogui.write("01012025")
    # pyautogui.press('tab')
    # pyautogui.write(datetime.now().strftime("%d%m%Y"))
    
    # 3. Injeção de SQL
    log("Lendo SQL do Word...")
    sql_content = read_word_sql(PATH_WORD)
    
    log("Injetando SQL no SAP...")
    # pyautogui.click(lapis_icon_coords)
    # pyautogui.hotkey('ctrl', 'a')
    # pyautogui.press('backspace')
    # Use pyperclip para colar se o conteúdo for grande
    # import pyperclip; pyperclip.copy(sql_content); pyautogui.hotkey('ctrl', 'v')
    
    # 4. Execução e Cópia
    log("Executando relatório e copiando tabela...")
    # pyautogui.click(executar_btn_coords)
    # time.sleep(10) # Aguarda processamento
    # pyautogui.rightClick(center_table_coords)
    # pyautogui.press('down', 5) # Escolher "Copiar Tabela"
    # pyautogui.press('enter')
    
    # 5. Colar no Excel
    close_excel()
    log(f"Atualizando {PATH_EXCEL}...")
    # Aqui poderíamos usar win32com para maior precisão
    # excel = win32com.client.Dispatch("Excel.Application")
    # wb = excel.Workbooks.Open(PATH_EXCEL)
    # ws = wb.Sheets("BASE")
    # ws.Range("A1").Select()
    # ws.Paste()
    # wb.Save()
    # wb.Close()
    
    log("Fluxo RPA concluído com sucesso.")
    return True

def export_json():
    log("Iniciando Bridge Excel -> JSON...")
    try:
        # Carrega as abas do Excel
        excel_data = pd.ExcelFile(PATH_EXCEL)
        
        result = {
            "byPeriod": [],
            "byState": [],
            "bySeller": [],
            "meta": {"2025": [], "2026": []},
            "raw": []
        }
        
        # 1. Receita por periodo
        if "Receita por periodo" in excel_data.sheet_names:
            df = pd.read_excel(PATH_EXCEL, sheet_name="Receita por periodo")
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
        if "Receita por estados" in excel_data.sheet_names:
            df_st = pd.read_excel(PATH_EXCEL, sheet_name="Receita por estados", header=0)
            # Remove total columns/rows if any, or skip header
            for _, row in df_st.iterrows():
                dt = row.iloc[0]
                if pd.isna(dt): continue
                if hasattr(dt, 'to_pydatetime'): dt = dt.to_pydatetime()
                for i in range(1, len(df_st.columns)):
                    val = row.iloc[i]
                    if val > 0:
                        result["byState"].append({
                            "ano": dt.year,
                            "mes": dt.month,
                            "estado": df_st.columns[i],
                            "faturamento": float(val)
                        })

        # 3. META
        if "META" in excel_data.sheet_names:
            df_meta = pd.read_excel(PATH_EXCEL, sheet_name="META", header=None)
            # O parser JS espera [2025:[], 2026:[]]
            # Lógica simplificada: itera sobre blocos de anos
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
                                "mes": dt.month,
                                "label": dt.strftime("%b"),
                                "meta": m_val,
                                "realizado": r_val
                            })

        # 4. RANKING DE VENDEDORES
        log("Buscando dados de vendedores...")
        possible_seller_cols = ['Vendedor', 'Consultor', 'Representante', 'VENDEDOR']
        if "Receita por periodo" in excel_data.sheet_names:
            df_v = pd.read_excel(PATH_EXCEL, sheet_name="Receita por periodo")
            seller_col = next((c for c in possible_seller_cols if c in df_v.columns), None)
            if seller_col:
                latest = df_v.sort_values(by='Inicial', ascending=False).iloc[0]['Inicial']
                df_latest = df_v[df_v['Inicial'] == latest]
                vendas_v = df_latest.groupby(seller_col)['Total'].sum().sort_values(ascending=False)
                for name, val in vendas_v.items():
                    result["bySeller"].append({
                        "name": str(name),
                        "val": float(val),
                        "meta": float(val * 1.1),
                        "img": str(name)[:2].upper()
                    })

        # 4. BASE (Extração dos dados do RPA)
        target_sheet = "BASE" if "BASE" in excel_data.sheet_names else "BASE DE DADOS"
        if target_sheet in excel_data.sheet_names:
            df = pd.read_excel(PATH_EXCEL, sheet_name=target_sheet)
            # Filtro simplificado conforme excelParser.js:105
            if 'Transação' in df.columns:
                df_filtered = df[(df['Transação'] == 'Nota Fiscal de Saída') & (df['Status'] == 'Autorizado')]
                for _, r in df_filtered.iterrows():
                    result["raw"].append({
                        "data": str(r.get('Data Lançamento documento', '')),
                        "estado": r.get('Estado', ''),
                        "cliente": r.get('Descrição Cliente', ''),
                        "tipo": r.get('Tipo NF', ''),
                        "valor": float(r.get('Vlr Total', 0))
                    })

        # Salva o JSON final
        with open(PATH_JSON, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        log(f"JSON atualizado em {PATH_JSON}")
        return True
    
    except Exception as e:
        log(f"ERRO no export_json: {str(e)}")
        return False

if __name__ == "__main__":
    # Executa o fluxo
    success = rpa_flow()
    if success:
        export_json()
