import json

with open("public/data/dados.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("--- Resumo de Períodos no dados.json ---")
for p in data.get("byPeriod", []):
    if p["ano"] == 2026:
        print(f"Mês: {p['mes']}/{p['ano']} | Vendas: {p['vendas']:.2f} | Serviços: {p['servicos']:.2f} | Locação: {p['locacao']:.2f} | Devoluções: {p['devolucoes']:.2f} | Total: {p['total']:.2f}")

print("\n--- Resumo de Metas 2026 ---")
for m in data.get("meta", {}).get("2026", []):
    print(f"Mês: {m['mes']} | Meta: {m['meta']:.2f} | Realizado: {m['realizado']:.2f}")
