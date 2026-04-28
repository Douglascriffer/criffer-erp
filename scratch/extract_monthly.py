import json

with open('public/data/dados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Checklist de Valores 2026:")
for p in data.get('byPeriod', []):
    if p.get('ano') == 2026:
        print(f"Mês: {p.get('label')}")
        print(f"  Vendas: {p.get('vendas', 0):,.2f}")
        print(f"  Serviços: {p.get('servicos', 0):,.2f}")
        print(f"  Locação: {p.get('locacao', 0):,.2f}")
        print(f"  Devoluções: {p.get('devolucoes', 0):,.2f}")
        print(f"  Total Realizado: {p.get('totalRealizado', 0):,.2f}")
        print(f"  Total Meta: {p.get('totalMeta', 0):,.2f}")
        print("-" * 20)
