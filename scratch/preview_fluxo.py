import pandas as pd
import json
from datetime import datetime

EXCEL_PATH = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"
df = pd.read_excel(EXCEL_PATH, sheet_name=5, header=None)

# Função para converter datetime para string
def handler(obj):
    if isinstance(obj, (datetime, pd.Timestamp)):
        return obj.isoformat()
    return str(obj)

preview = df.iloc[:100, :20].fillna("").values.tolist()
# Converter tudo para string/serializável
clean_preview = []
for row in preview:
    clean_preview.append([handler(x) for x in row])

with open("scratch/fluxo_preview.json", "w", encoding="utf-8") as f:
    json.dump(clean_preview, f, ensure_ascii=False, indent=2)

print("Preview do Fluxo de Caixa salvo em scratch/fluxo_preview.json")
